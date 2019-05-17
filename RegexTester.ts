/// <reference path="Scripts/typings/jquery/jquery.d.ts"/>
/// <reference path="Scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="app.ts"/>

namespace regexTester {
    // #region LocalStorageService

    export interface IStoredRegex {
        pattern: string;
        inputText: string[];
        isGlobal: boolean;
        ignoreCase: boolean;
        multiline: boolean;
        unicode: boolean;
        sticky: boolean;
        dotAll: boolean;
        ignoreWhitespace: boolean;
    }

    class LocalRegexStorageService {
        keys(): string[] {
            let result: string[] = [];
            for (let i: number = 0; i < localStorage.length; i++)
                result.push(localStorage.key(i));
            return result;
        }
        length(): number { return localStorage.length; }
        load(key: string, scope: IRegexTesterControllerScope): boolean {
            try {
                let json: string = localStorage.getItem(key);
                if (!app.isNilOrWhiteSpace(json)) {
                    let data: IStoredRegex = <IStoredRegex>(JSON.parse(json));
                    scope.inputPattern = data.pattern;
                    let i: number = data.inputText.length;
                    while (scope.inputItems.length < i)
                        scope.addInputItem();
                    i--;
                    while (scope.inputItems.length > i)
                        scope.inputItems[i].delete();
                    do {
                        scope.inputItems[i].inputText = data.inputText[i--];
                    } while (i > -1);
                    scope.inputItems.forEach((i: ITestStringItemScope) => {
                        i.evaluated = i.success = false;
                        i.cssClass = ['alert', 'alert-secondary'];
                    });
                    scope.showEvaluations = false;
                }
            } catch { }
            return false;
        }
        save(key: string, scope: IRegexTesterControllerScope): void {
            localStorage.setItem(key, JSON.stringify({
                pattern: scope.inputPattern,
                inputText: scope.inputItems.map((i: ITestStringItemScope) => i.inputText),
                isGlobal: scope.isGlobal,
                ignoreCase: scope.ignoreCase,
                multiline: scope.multiline,
                unicode: scope.unicode,
                sticky: scope.sticky,
                dotAll: scope.dotAll,
                ignoreWhitespace: scope.ignoreWhitespace
            }));
        }
        remove(key: string): void { localStorage.removeItem(key); }
        clear(): void { localStorage.clear(); }
    }

    app.mainModule.factory("LocalRegexStorageService", LocalRegexStorageService);

    // #endregion
    
    interface ITestStringItemScope extends IRegexTesterControllerScope {
        itemNumber: number;
        success: boolean;
        statusMessage: string;
        cssClass: string[];
        evaluated: boolean;
        inputText: string;
        canDelete: boolean;
        isCurrent: boolean;
        matchIndex: number;
        matchGroups: { index: number; statusMessage: string; success: boolean; value: string; cssClass: string[] }[];
        edit(): void;
        delete(): void;
    }
    interface IRegexTesterControllerScope extends ng.IScope {
        inputPattern: string;
        inputItems: ITestStringItemScope[];
        fullPattern: string;
        flags: string;
        isGlobal: boolean;
        ignoreCase: boolean;
        multiline: boolean;
        unicode: boolean;
        sticky: boolean;
        dotAll: boolean;
        ignoreWhitespace: boolean;
        showOptions: boolean;
        showParseError: boolean;
        currentSavedName: string;
        savedNames: string[];
        patternParseError: string;
        validationClass: string[];
        showEvaluations: boolean;
        hideInputTextBox: boolean;
        evaluate(): void;
        addInputItem(): void;
        editInput(): void;
        editOptions(value: boolean): void;
        loadSession(name: string): void;
        deleteSession(name: string): void;
        saveSession(): void;
        sessionLoadMessage: string;
        sessionSaveMessage: string;
        inputRowCount: number;
        setInputRowCount(inc: boolean): void;
    }

    export class RegexTesterController implements ng.IController {
        private _inputText: string[] = [];
        private _regex: RegExp;
        private _inputPattern: string = '';
        private _isGlobal: boolean = false;
        private _ignoreCase: boolean = false;
        private _multiline: boolean = false;
        private _unicode: boolean = false;
        private _sticky: boolean = false;
        private _dotAll: boolean = false;
        private _ignoreWhitespace: boolean = false;

        constructor(protected $scope: IRegexTesterControllerScope, protected storageSvc: LocalRegexStorageService) {
            let controller: RegexTesterController = this;

            $scope.inputItems = [];
            this.addInputItem();
            $scope.inputPattern = this._inputPattern;
            $scope.patternParseError = '';
            $scope.ignoreCase = this._ignoreCase;
            $scope.isGlobal = this._isGlobal;
            $scope.multiline = this._multiline;
            $scope.unicode = this._unicode;
            $scope.sticky = this._sticky;
            $scope.dotAll = this._dotAll;
            $scope.showParseError = false;
            $scope.flags = '';
            $scope.index = -1;
            $scope.evaluate = () => controller.evaluate();
            $scope.addInputItem = () => controller.addInputItem();
            $scope.editInput = () => controller.editInput();
            $scope.editOptions = (value: boolean) => controller.editOptions(value);
            $scope.ignoreWhitespace = this._ignoreWhitespace;
            $scope.showOptions = $scope.showEvaluations = $scope.hideInputTextBox = false;
            $scope.savedNames = storageSvc.keys();
            $scope.currentSavedName = $scope.sessionLoadMessage = $scope.sessionSaveMessage = '';
            $scope.loadSession = (name: string) => controller.loadSession(name);
            $scope.deleteSession = (name: string) => controller.deleteSession(name);
            $scope.saveSession = () => controller.saveSession();
            $scope.setInputRowCount = (inc: boolean) => controller.setInputRowCount(inc);
            $scope.inputRowCount = 3;
            $scope.validationClass = [];
            this.evaluate();
        }

        setInputRowCount(inc: boolean) {
            if (inc) {
                if (this.$scope.inputRowCount < 25)
                    this.$scope.inputRowCount++;
            } else if (this.$scope.inputRowCount > 3)
                this.$scope.inputRowCount--;
        }

        loadSession(name: string): void {
            this.$scope.sessionLoadMessage = this.$scope.sessionSaveMessage = '';
            this.storageSvc.load(name, this.$scope);
            this.$scope.currentSavedName = name;
            this.$scope.sessionLoadMessage = 'Session "' + name + '" loaded at ' + Date();
        }

        deleteSession(name: string): void {
            this.$scope.sessionLoadMessage = this.$scope.sessionSaveMessage = '';
            this.storageSvc.remove(name);
            this.$scope.savedNames = this.storageSvc.keys();
            this.$scope.sessionLoadMessage = 'Session "' + name + '" deleted.';
        }

        saveSession(): void {
            this.$scope.sessionLoadMessage = this.$scope.sessionSaveMessage = '';
            if (app.isNilOrWhiteSpace(this.$scope.currentSavedName))
                alert("Saved session must have a name.");
            else {
                this.storageSvc.save((this.$scope.currentSavedName = this.$scope.currentSavedName.trim()), this.$scope);
                this.$scope.sessionSaveMessage = 'Session "' + this.$scope.currentSavedName + '" saved at ' + Date();
            }
            this.$scope.savedNames = this.storageSvc.keys();

        }
        
        editOptions(value: boolean): void {
            this.$scope.sessionLoadMessage = this.$scope.sessionSaveMessage = '';
            this.$scope.showOptions = value;
        }

        editInput(): void {
            this.$scope.hideInputTextBox = false;
        }

        addInputItem() {
            let item: ITestStringItemScope = <ITestStringItemScope>(this.$scope.$new());
            let array: ITestStringItemScope[] = this.$scope.inputItems;

            item.success = item.evaluated = false;
            item.inputText = '';
            item.statusMessage = "Not evaluated";
            item.cssClass = ['alert', 'alert-secondary'];
            item.itemNumber = array.length + 1;
            item.matchIndex = -1;
            item.matchGroups = [];
            item.edit = () => {
                array.forEach((i: ITestStringItemScope) => { i.isCurrent = false; });
                this.$scope.hideInputTextBox = false;
                item.isCurrent = true;
            }
            item.delete = () => {
                if (array.length < 1)
                    return;
                for (let i: number = item.itemNumber; i < array.length; i++)
                    array[i].itemNumber--;
                if (item.itemNumber === 1)
                    array.shift();
                else if (item.itemNumber == array.length)
                    array.pop();
                else
                    array.slice(item.itemNumber - 1, 1);
                if (array.length == 1)
                    array[0].canDelete = false;
            };
            if (array.length < 1)
                item.canDelete = false;
            else {
                item.canDelete = true;
                if (array.length == 1)
                    array[0].canDelete = true;
            }
            array.forEach((i: ITestStringItemScope) => { i.isCurrent = false; });
            item.isCurrent = true;
            array.push(item);
        }

        evaluate(): void {
            this.$doCheck();

            if (this.$scope.patternParseError.length > 0) {
                if (this.$scope.showParseError)
                    alert("Invalid regex pattern");
                this.$scope.showParseError = true;
                return;
            }

            this.$scope.showEvaluations = this.$scope.hideInputTextBox = true;
            this.$scope.sessionLoadMessage = this.$scope.sessionSaveMessage = '';
            this._inputText = this.$scope.inputItems.map((item: ITestStringItemScope) => {
                item.isCurrent = false;
                if (typeof (item.inputText) !== 'string')
                    item.inputText = '';
                try {
                    let result: RegExpExecArray = this._regex.exec(item.inputText);
                    item.evaluated = true;
                    if (app.isNil(result)) {
                        item.success = false;
                        item.matchIndex = -1;
                        item.matchGroups = [];
                        item.statusMessage = "Match failed.";
                        item.cssClass = ['alert', 'alert-warning'];
                    } else {
                        item.success = true;
                        item.statusMessage = "Match succeeded. Matched " + result[0].length + " characters at index " + result.index + ' .';
                        item.cssClass = ['alert', 'alert-success'];
                        item.matchIndex = result.index;
                        item.matchGroups = result.map((value: string, index: number) => {
                            if (app.isNil(value))
                                return { index: index, success: false, statusMessage: 'Not matched', value: '', cssClass: ['alert', 'alert-secondary'] };
                            return { index: index, success: true, statusMessage: 'Matched ' + value.length + ' characters', value: value, cssClass: ['alert', 'alert-success'] };
                        });
                    }
                } catch (e) {
                    item.success = false;
                    item.statusMessage = "Match error: " + JSON.stringify(e);
                    item.cssClass = ['alert', 'alert-danger'];
                }
                return item.inputText;
            });
        }

        private static whitespacRe: RegExp = /\s+/g;

        $doCheck() {
            if (this.$scope.ignoreWhitespace != this._ignoreWhitespace) {
                if (this._ignoreWhitespace) {
                    this._ignoreWhitespace = false;
                    this.$scope.inputPattern = this.$scope.inputPattern.replace(RegexTesterController.whitespacRe, "");
                } else
                    this._ignoreWhitespace = true;
            }
            if (this._inputPattern !== this.$scope.inputPattern || this._isGlobal !== this.$scope.isGlobal || this._multiline !== this.$scope.multiline || this._ignoreCase !== this.$scope.ignoreCase || this._sticky !== this.$scope.sticky ||
                this._unicode !== this.$scope.unicode || this._dotAll !== this.$scope.dotAll) {
                this.$scope.patternParseError = '';
                this._inputPattern = this.$scope.inputPattern;
                this._isGlobal = this.$scope.isGlobal;
                this._multiline = this.$scope.multiline;
                this._ignoreCase = this.$scope.ignoreCase;
                this._sticky = this.$scope.sticky;
                this._unicode = this.$scope.unicode;
                this._dotAll = this.$scope.dotAll;
                this.$scope.showParseError = false;
                try {
                    this.$scope.flags = '';
                    if (this._ignoreCase)
                        this.$scope.flags = 'i';
                    if (this._isGlobal)
                        this.$scope.flags += 'g';
                    if (this._multiline)
                        this.$scope.flags += 'm';
                    if (this._unicode)
                        this.$scope.flags += 'u';
                    if (this._sticky)
                        this.$scope.flags += 'y';
                    if (this._dotAll)
                        this.$scope.flags += 's';
                    let pattern: string = this._inputPattern;
                    if (this.$scope.ignoreWhitespace)
                        pattern = pattern.replace(RegexTesterController.whitespacRe, "");
                    this.$scope.fullPattern = "/" + pattern + "/" + this.$scope.flags;
                    let regex: RegExp = (this.$scope.flags.length == 0) ? new RegExp(pattern) : new RegExp(pattern, this.$scope.flags);
                    if (app.isNil(regex))
                        throw "Failed to create regular expression.";
                    this._regex = regex;
                    if (pattern.length == 0) {
                        this.$scope.patternParseError = 'Pattern is empty.';
                        this.$scope.validationClass = ['alert', 'alert-warning'];
                    } else
                        this.$scope.validationClass = [];
                } catch (e) {
                    this.$scope.patternParseError = (typeof (e) === 'string') ? e : JSON.stringify(e);
                    this.$scope.validationClass = ['alert', 'alert-danger'];
                    this.$scope.index = -1;
                    this.$scope.matchGroups = [];
                    return;
                }
                this._inputText = [];
                this.$scope.inputItems.forEach((item: ITestStringItemScope) => {
                    item.evaluated = item.success = false;
                    item.statusMessage = "Not evaluated";
                    item.cssClass = ['alert', 'alert-secondary'];
                });
            } else {
                this.$scope.inputItems.forEach((item: ITestStringItemScope) => {
                    if (typeof (item.inputText) !== 'string')
                        item.inputText = '';
                    if (this._inputText.indexOf(item.inputText) < 0) {
                        item.evaluated = item.success = false;
                        item.statusMessage = "Not evaluated";
                        item.cssClass = ['alert', 'alert-secondary'];
                    }
                });
            }
        }
    }

    app.mainModule.controller("RegexTesterController", ["$scope", "LocalRegexStorageService", RegexTesterController]);
}
