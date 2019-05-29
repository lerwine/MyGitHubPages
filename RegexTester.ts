/// <reference path="Scripts/typings/jquery/jquery.d.ts"/>
/// <reference path="Scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="app.ts"/>

namespace regexTester {
    // #region RegexTester Controller
    
    interface IRegexTesterScope extends ng.IScope {
        evaluateExpression(): void;
        evaluationIsDisabled: boolean;
    }
    
    class RegexTesterController implements ng.IController {
        constructor(protected $scope: IRegexTesterScope, regexParser: RegexParserService, evaluateExpression: EvaluateExpressionService) {
            let controller: RegexTesterController = this;
            $scope.evaluationIsDisabled = true;
            $scope.evaluateExpression = () => { controller.evaluateExpression(); }
            regexParser.whenPatternParseSucceeded((re: RegExp) => { $scope.evaluationIsDisabled = false; });
            regexParser.whenPatternParseFailed((value: string, reason: app.ErrorResult) => { $scope.isDisabled = true; });
            regexParser.then((re: RegExp) => { $scope.evaluationIsDisabled = false; });
        }

        evaluateExpression(): void {

        }

        $doCheck() {

        }
    }
    
    app.mainModule.controller("regexTester", ["$scope", "regexParser", "evaluateExpression", RegexTesterController]);
    
    // #endregion
    
    // #region incrementalId Service
    
    class incrementalIdService {
        private _id: number = 0;

        next(): number {
            let result: number = this._id++; 
            if (result < 32768)
                return result;
            this._id = 0;
            return this.next();
        }
    
        constructor() { }
    }
    
    app.mainModule.service("incrementalId", [function () { return new incrementalIdService(); }]);
    
    // #endregion
    
    // #region regexParser Service
    
    const whitespaceRe: RegExp = /[\s\r\n\p{C}]+/g;

    class RegexParserService {
        private _result: ng.IPromise<RegExp>;
        private _flags: string = "";
        private _inputRegexPattern: string = "";
        private _parsePending: boolean = false;
        private _parsedPattern: RegExp | undefined;
        private _pauseLevel: number = 0;
        private _whenInputPatternChanged: app.IValueCallback<string> | undefined;
        private _whenParsedPatternChanged: app.IValueCallback<RegExp | undefined> | undefined;
        private _whenPatternParseSucceeded: app.IValueCallback<RegExp> | undefined;
        private _whenPatternParseFailed: app.IValueErrorCallback<string> | undefined;

        get isPaused(): boolean { return this._pauseLevel > 0; }

        get inputRegexPattern(): string { return this._inputRegexPattern; }
        set inputRegexPattern(value: string) {
            let pattern: string = ((typeof value === "undefined") || value === null) ? "" : ((typeof value === "string") ? value : "" + value);
            if (this._inputRegexPattern === pattern)
                return;
            this._inputRegexPattern = pattern;
            app.execIfFunction<string>(this._whenInputPatternChanged, this._inputRegexPattern);
            if (this._pauseLevel > 0)
                this._parsePending = true;
            else
                this.startParseCurrentPattern();
        }

        get lastParsedPattern(): RegExp | undefined { return this._parsedPattern; }
        
        constructor(protected $q: ng.IQService, protected regexOptions: RegexOptionsService) {
            let service: RegexParserService = this;
            regexOptions.whenFlagsChanged((flags: string) => {
                if (service._flags === flags)
                    return;
                service._flags = flags;
                if (this._pauseLevel > 0)
                    this._parsePending = true;
                else
                    this.startParseCurrentPattern();
            });
            this._flags = regexOptions.flags;
        }

        withParsingPaused<T>(callback: { (): T; }, thisArg?: any): T;
        withParsingPaused(callback: { (): any; }, thisArg?: any): any {
            this._pauseLevel++;
            try { return callback(); }
            finally {
                this._pauseLevel--;
                if (this._pauseLevel == 0 && this._parsePending) {
                    this._parsePending = false;
                    this.startParseCurrentPattern();
                }
            }
        }

        whenInputPatternChanged(callback: app.IValueCallback<string>) { this._whenInputPatternChanged = app.chainCallback<string>(this._whenInputPatternChanged, callback); }
    
        whenParsedPatternChanged(callback: app.IValueCallback<RegExp | undefined>) { this._whenParsedPatternChanged = app.chainCallback<RegExp | undefined>(this._whenParsedPatternChanged, callback); }
    
        whenPatternParseSucceeded(callback: app.IValueCallback<RegExp>) { this._whenPatternParseSucceeded = app.chainCallback<RegExp>(this._whenPatternParseSucceeded, callback); }
        
        whenPatternParseFailed(callback: app.IValueErrorCallback<string>) { this._whenPatternParseFailed = app.chainCallback<string, app.ErrorResult>(this._whenPatternParseFailed, callback); }
        
        startParseCurrentPattern(): ng.IPromise<RegExp> {
            let result: ng.IPromise<RegExp>;
            let pattern: string = this._inputRegexPattern;
            this._result = result = this.$q<RegExp>((resolve: ng.IQResolveReject<RegExp>, reject: ng.IQResolveReject<any>) => {
                let result: RegExp;
                try { result = new RegExp(pattern, this._flags); }
                catch (e) {
                    reject(e);
                    return;
                }
                if (app.isNil(result))
                    reject("Failed ot parse regular expression.");
                else
                    resolve(result);
            }).then((result: RegExp) => {
                this._parsedPattern = result;
                try { app.execIfFunction<RegExp>(this._whenPatternParseSucceeded, result); }
                finally { app.execIfFunction<RegExp | undefined>(this._whenParsedPatternChanged, result); }
                return result;
            }, (reason: any) => {
                let errorReason: app.ErrorResult = app.asErrorResult(reason);
                this._parsedPattern = undefined;
                try { app.execIfFunction<string, app.ErrorResult>(this._whenPatternParseFailed, pattern, reason); }
                finally { app.execIfFunction<RegExp | undefined>(this._whenParsedPatternChanged, undefined); }
                return errorReason;
            });

            return result;
        }

        then<T>(successCallback: { (result: RegExp): T}, errorCallback?: { (reason: app.ErrorResult): any}): ng.IPromise<T>;
        then(successCallback: { (result: RegExp): any}, errorCallback?: { (reason: app.ErrorResult): any}): ng.IPromise<any>;
        then(successCallback: { (result: RegExp): any}, errorCallback?: { (reason: app.ErrorResult): any}): ng.IPromise<any> {
            let result: ng.IPromise<RegExp> = this._result;
            if (app.isNil(result))
                return this.startParseCurrentPattern();
            return result.then(successCallback, errorCallback);
        }
    }
    
    app.mainModule.service("regexParser", ["$q", "regexOptions", function ($q: ng.IQService, regexOptions: RegexOptionsService) {
        return new RegexParserService($q, regexOptions);
    }]);
    
    // #endregion
    
    // #region evaluationSource Service

    interface IInputSourceItemParent extends ng.IScope {
        sourceItems: IInputSourceItemScope[];
        addSourceItem(): void;
    }

    class EvaluationSourceItem {
        private _cardNumber: number;
        private _matchIndex: number;
        private _groups: IExpressionEvaluationGroup[];
        private _canDelete: boolean = true;
        private _isEvaluated: boolean = false;
        private _success: boolean = false;
        private _text: string = "";

        get cardNumber(): number { return this._cardNumber; }
        get canDelete(): boolean { return this._canDelete; }
        get isEvaluated(): boolean { return this._isEvaluated; }
        get success(): boolean { return this._success; }
        get resultsButtonText(): string { return (this._isEvaluated) ? ((this._success) ? "Matched " + this._groups.length + " groups." : "No match"): "Not Evaluated"; }
        get text(): string { return this._text; }
        
        constructor(private _parentArray: EvaluationSourceItem[]) {
            this._cardNumber = _parentArray.length + 1;
            _parentArray.push(this);
            if (this._cardNumber == 1)
                this._canDelete = false;
            else {
                this._canDelete = true;
                if (this._cardNumber == 2)
                    this._parentArray[0]._canDelete = true;
            }
        }

        getResultClass(): string[] {
            if (this._isEvaluated)
                return [(this._success) ? "btn-success" : "btn-warning"];
            return ["btn-secondary"];
        }

        delete(): boolean {
            if (typeof this._parentArray === "undefined" || this._parentArray.length < 2)
                return false;
            if (this._cardNumber == 1)
                this._parentArray.shift();
            else if (this._cardNumber == this._parentArray.length)
                this._parentArray.pop();
            else
                this._parentArray.splice(this._cardNumber - 1, 1);
            for (let i: number = this._cardNumber - 1; i < this._parentArray.length; i++)
                this._parentArray[i]._cardNumber = i + 1;
            this._parentArray = undefined;
            return true;
        }

        static initialize(items: EvaluationSourceItem[], scope: IInputSourceItemParent) {
            if (app.isNil(scope.sourceItems) || !Array.isArray(scope.sourceItems))
                scope.sourceItems = [];
            let e: number = (items.length < scope.sourceItems.length) ? items.length : scope.sourceItems.length;
            let i: number;
            for (i = 0; i < e; i++) {
                let source: EvaluationSourceItem = items[i];
                let target: IInputSourceItemScope = scope.sourceItems[i];
                if ((typeof target !== "object") || target === null)
                    scope.sourceItems[i] = target = <IInputSourceItemScope>(scope.$new());
                target.canDelete = source._canDelete;
                target.controlId = "evaluationSourceTextBox" + source._cardNumber.toString();
                target.resultsButtonText = source.resultsButtonText;
                target.resultsClick = () => { return source._isEvaluated; };
                target.delete = () => { return source.delete(); }
                target.resultsHref =(source._isEvaluated) ? "#results" + source._cardNumber.toString() : "#";
                target.text = source._text;
            }
            while (scope.sourceItems.length > 3)
                scope.sourceItems.pop();
            while (e < items.length) {
                let source: EvaluationSourceItem = new EvaluationSourceItem(items);
                let target: IInputSourceItemScope = <IInputSourceItemScope>(scope.$new());
                scope.sourceItems.push(target);
                target.canDelete = source._canDelete;
                target.controlId = "evaluationSourceTextBox" + source._cardNumber.toString();
                target.resultsButtonText = source.resultsButtonText;
                target.resultsClick = () => { return source._isEvaluated; };
                target.delete = () => { return source.delete(); }
                target.resultsHref = (source._isEvaluated) ? "#results" + source._cardNumber.toString() : "#";
                target.text = source._text;
            }
        }
    }

    class EvaluationSourceService {
        private _items: EvaluationSourceItem[] = [];
    
        constructor() { }

        initialize(scope: IInputSourceItemParent) { EvaluationSourceItem.initialize(this._items, scope); }
    }
    
    app.mainModule.service("evaluationSource", [function () { return new EvaluationSourceService(); }]);
    
    // #endregion
    
    // #region evaluateExpression Service

    interface IExpressionEvaluationGroup {

    }

    interface IExpressionEvaluationResult {
        
    }
    
    class EvaluateExpressionService {
        private _result: ng.IPromise<IExpressionEvaluationResult>;
    
        constructor(protected $q: ng.IQService, protected regexParser: RegexParserService, protected regexOptions: RegexOptionsService) { }
    
        startEvaluateCurrent(): ng.IPromise<IExpressionEvaluationResult> {
            let result: ng.IPromise<IExpressionEvaluationResult>;
            this._result = result = this.regexParser.then<IExpressionEvaluationResult>((re: RegExp) => {
                return this.$q<IExpressionEvaluationResult>((resolve: ng.IQResolveReject<IExpressionEvaluationResult>) => {
                    return this.regexParser.then<IExpressionEvaluationResult>((re: RegExp) => {
                        throw new Error("Resolver not implemented.");
                    });
                }).then((result: IExpressionEvaluationResult) => { return result; }, (reason: any) => {
                    let errorReason: app.ErrorResult = app.asErrorResult(reason);
                    throw new Error("Reject not implemented.");
                    // this._parsedPattern = undefined;
                    // try { app.execIfFunction<string, app.ErrorResult>(this._whenPatternParseFailed, pattern, reason); }
                    // finally { app.execIfFunction<RegExp | undefined>(this._whenParsedPatternChanged, undefined); }
                    // return errorReason;
                });
            });
            
            return result;
        }

        then<T>(successCallback: { (result: IExpressionEvaluationResult): T}, errorCallback?: { (reason: app.ErrorResult): any}): ng.IPromise<T>;
        then(successCallback: { (result: IExpressionEvaluationResult): any}, errorCallback?: { (reason: app.ErrorResult): any}): ng.IPromise<any>;
        then(successCallback: { (resresultponse: IExpressionEvaluationResult): any}, errorCallback?: { (reason: app.ErrorResult): any}): ng.IPromise<any> {
            return this._result.then(successCallback, errorCallback);
        }
    }
    
    app.mainModule.service("evaluateExpression", ["$q", "regexParser", "regexOptions", function ($q: ng.IQService, regexParser: RegexParserService, regexOptions: RegexOptionsService) {
        return new EvaluateExpressionService($q, regexParser, regexOptions);
    }]);
    
    // #endregion
    
    interface IRegexOptions {
        global: boolean;
        ignoreCase: boolean;
        multiline: boolean;
        sticky: boolean;
        unicode: boolean;
        dotMatchesNewline: boolean;
    }

    // #region RegexOptions Service
    
    class RegexOptionsService implements IRegexOptions {
        private _whenFlagsChanged: app.IValueCallback<string>;

        // #region flags Property
        
        private _flags: string = "";
        
        get flags(): string { return this._flags; }
        
        // #endregion
        
        // #region global Property
        
        private _global: boolean = false;
        
        get global(): boolean { return this._global; }
        set global(value: boolean) {
            if (this._global === ((typeof (value) == "boolean") ? value : (value = value === true)))
                return;
            this._global = value;
            this.updateFlags();
        }
        
        // #endregion
        
        // #region ignoreCase Property
        
        private _ignoreCase: boolean = false;
        
        get ignoreCase(): boolean { return this._ignoreCase; }
        set ignoreCase(value: boolean) {
            if (this._ignoreCase === ((typeof (value) == "boolean") ? value : (value = value === true)))
                return;
            this._ignoreCase = value;
            this.updateFlags();
        }
        
        // #endregion
        
        // #region multiline Property
        
        private _multiline: boolean = false;
        
        get multiline(): boolean { return this._multiline; }
        set multiline(value: boolean) {
            if (this._multiline === ((typeof (value) == "boolean") ? value : (value = value === true)))
                return;
            this._multiline = value;
            this.updateFlags();
        }
        
        // #endregion
        
        // #region dotMatchesNewline Property
        
        private _dotMatchesNewline: boolean = false;
        
        get dotMatchesNewline(): boolean { return this._dotMatchesNewline; }
        set dotMatchesNewline(value: boolean) {
            if (this._dotMatchesNewline === ((typeof (value) == "boolean") ? value : (value = value === true)))
                return;
            this._dotMatchesNewline = value;
            this.updateFlags();
        }
        
        // #endregion
        
        // #region unicode Property
        
        private _unicode: boolean = false;
        
        get unicode(): boolean { return this._unicode; }
        set unicode(value: boolean) {
            if (this._unicode === ((typeof (value) == "boolean") ? value : (value = value === true)))
                return;
            this._unicode = value;
            this.updateFlags();
        }
        
        // #endregion
        
        // #region sticky Property
        
        private _sticky: boolean = false;
        
        get sticky(): boolean { return this._sticky; }
        set sticky(value: boolean) {
            if (this._sticky === ((typeof (value) == "boolean") ? value : (value = value === true)))
                return;
            this._sticky = value;
            this.updateFlags();
        }
        
        // #endregion

        constructor() { }

        static toFlags(source: IRegexOptions) {
            let flags: string = (source.global) ? "g" : "";
            if (source.ignoreCase)
                flags += "i";
            if (source.multiline)
                flags += "m";
            if (source.dotMatchesNewline)
                flags += "s";
            if (source.unicode)
                flags += "u";
            return (source.sticky) ? flags + "y" : flags;
        }

        updateFrom(source: IRegexOptions): boolean {
            let flags: string = RegexOptionsService.toFlags(source);
            if (flags === this._flags)
                return false;
            this._flags = flags;
            this._dotMatchesNewline = source.dotMatchesNewline;
            this._global = source.global;
            this._ignoreCase = source.ignoreCase;
            this._multiline = source.multiline;
            this._sticky = source.sticky;
            this._unicode = source.unicode;
            this.updateFlags();
            return true;
        }

        private updateFlags(): void {
            let flags: string;
            this._flags = flags = RegexOptionsService.toFlags(this);
            app.execIfFunction<string>(this._whenFlagsChanged, flags);
        }

        updateTo(target: IRegexOptions) {
            target.dotMatchesNewline = this._dotMatchesNewline;
            target.global = this._global;
            target.ignoreCase = this._ignoreCase;
            target.multiline = this._multiline;
            target.sticky = this._sticky;
            target.unicode = this._unicode;
        }
        
        whenFlagsChanged(callback: app.IValueCallback<string>) {
            this._whenFlagsChanged = app.chainCallback<string>(this._whenFlagsChanged, callback);
        }
    }
    
    app.mainModule.service("regexOptions", [function () { return new RegexOptionsService(); }]);
    
    // #endregion
    
    // #region InputSourceEdit Controller
    interface IInputSourceItemScope extends ng.IScope {
        controlId: string;
        text: string;
        resultsHref: string;
        resultClass: string[];
        resultsButtonText: string;
        canDelete: boolean;
        resultsClick(): boolean;
        delete(): void;
    }

    interface IInputSourceEditScope extends IInputSourceItemParent {
    }
    
    class InputSourceEditController implements ng.IController {
        constructor(protected $scope: IInputSourceEditScope, evaluationSource: EvaluationSourceService, evaluateExpression: EvaluateExpressionService) { }

        $doCheck() {

        }
    }
    
    app.mainModule.controller("inputSourceEdit", ["$scope", "evaluationSource", "evaluateExpression", InputSourceEditController]);
    
    // #endregion
    
    // #region RegexPattern Controller

    const editOptionsDialogId: string = "EditOptionsDialog";

    interface IRegexPatternScope extends ng.IScope {
        regexPattern: string;
        wsRegexPattern: string;
        global: boolean;
        ignoreCase: boolean;
        multiline: boolean;
        dotMatchesNewline: boolean;
        unicode: boolean;
        sticky: boolean;
        ignoreWhitespace: boolean;
        editOptionsDialogId: string;
        flags: string;
        textBoxClass: string[];
        isValid: boolean;
        patternValidationMessage: string;
        editOptionsDialogVisible: boolean;
        showEditOptionsDialog(): void;
        closeEditOptionsDialog(): void;
    }

    class RegexPatternController implements ng.IController {
        private _pattern: string;
        private _wsRegexPattern: string;

        constructor(protected $scope: IRegexPatternScope, protected $log: ng.ILogService, protected regexOptions: RegexOptionsService, protected regexParser: RegexParserService) {
            $scope.global = regexOptions.global;
            $scope.ignoreCase = regexOptions.ignoreCase;
            $scope.multiline = regexOptions.multiline;
            $scope.dotMatchesNewline = regexOptions.dotMatchesNewline;
            $scope.unicode = regexOptions.unicode;
            $scope.sticky = regexOptions.sticky;
            $scope.flags = regexOptions.flags;
            $scope.ignoreWhitespace = false;
            $scope.regexPattern = $scope.wsRegexPattern = this._pattern = this._wsRegexPattern = regexParser.inputRegexPattern;
            $scope.editOptionsDialogId = editOptionsDialogId;
            $scope.isValid = true;
            $scope.textBoxClass = ["is-valid "];
            $scope.patternValidationMessage = "";
            
            let controller: RegexPatternController = this;
            $scope.showEditOptionsDialog = () => { controller.showEditOptionsDialog(); }
            $scope.closeEditOptionsDialog = () => { controller.closeEditOptionsDialog(); }
            regexOptions.whenFlagsChanged((value: string) => { controller.$scope.flags = value; });
            regexParser.whenPatternParseSucceeded((re: RegExp) => {
                this.$scope.textBoxClass = ["is-valid "];
                this.$scope.isValid = true;
            });
            regexParser.whenPatternParseFailed((text: string, reason: app.ErrorResult) => {
                this.$scope.textBoxClass = ["is-invalid"];
                this.$scope.isValid = false;
                $scope.patternValidationMessage = (typeof reason === "string") ? reason : (typeof reason.message === "string" && reason.message.trim().length > 0) ? reason.message : "" + reason;
            });
        }

        showEditOptionsDialog(): void {
            this.$scope.editOptionsDialogVisible = true;
            $("#" + this.$scope.editOptionsDialogId).modal("show");
        }

        closeEditOptionsDialog(): void {
            this.$scope.editOptionsDialogVisible = false;
            $("#" + this.$scope.editOptionsDialogId).modal("hide");
        }

        $doCheck() {
            this.regexParser.withParsingPaused(() => {
                let hasChanges: boolean = true;
                if (this._wsRegexPattern !== this.$scope.wsRegexPattern)
                    this.regexParser.inputRegexPattern = this.$scope.regexPattern = this._pattern = (this._wsRegexPattern = this.$scope.wsRegexPattern).replace(whitespaceRe, "");
                else if (this._pattern !== this.$scope.regexPattern)
                    this.regexParser.inputRegexPattern = this._pattern = this._wsRegexPattern = this.$scope.wsRegexPattern = this.$scope.regexPattern;
                else
                    hasChanges = false;
                this.regexOptions.updateFrom(this.$scope);
            });
        }
    }
    
    app.mainModule.controller("regexPattern", ["$scope", "$log", "regexOptions", "regexParser", RegexPatternController]);
    
    // #endregion
}
