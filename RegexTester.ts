/// <reference path="Scripts/typings/jquery/jquery.d.ts"/>
/// <reference path="Scripts/typings/bootstrap/index.d.ts" />
/// <reference path="Scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="sys.ts"/>
/// <reference path="app.ts"/>

namespace regexTester {
    const CSS_CLASS_ALERT_WARNING: string = "alert-warning";
    const CSS_CLASS_ALERT_DANGER: string = "alert-danger";
    const CSS_CLASS_ALERT_SUCCESS: string = "alert-success";
    const CSS_CLASS_ALERT_SECONDARY: string = "alert-secondary";
    const CSS_CLASS_SMALL: string = "small";
    const CSS_CLASS_ROW: string = "row";
    const CSS_CLASS_NO_GUTTERS: string = "no-gutters";
    const CSS_CLASS_BORDER_DARK: string = "border-dark";
    const CSS_CLASS_TEXT_LIGHT: string = "text-light";
    const CSS_CLASS_BG_PRIMARY: string = "bg-primary";
    const CSS_CLASS_BORDER_SUCCESS: string = "border-success";
    const CSS_CLASS_BG_SUCCESS: string = "bg-success";
    const CSS_CLASS_BORDER_WARNING: string = "border-warning";
    const CSS_CLASS_BG_WARNING: string = "bg-warning";
    const CSS_CLASS_TEXT_DARK: string = "text-dark";
    const CSS_CLASS_BORDER_PRIMARY: string = "border-primary";
    const CSS_CLASS_NOWRAP: string = "flex-nowrap";

    const CSS_CLASSES_ITEM_NOT_EVALUATED: string[] = [CSS_CLASS_ALERT_SECONDARY, CSS_CLASS_SMALL];
    const CSS_CLASSES_ITEM_EVALUATION_ERROR: string[] = [CSS_CLASS_ALERT_DANGER];
    const CSS_CLASSES_ITEM_EVALUATION_WARNING: string[] = [CSS_CLASS_ALERT_WARNING];
    const CSS_CLASSES_ITEM_EVALUATION_SUCCESS: string[] = [CSS_CLASS_ALERT_SUCCESS];
    const CSS_CLASSES_ITEM_GROUP_SUCCESS: string[] = [CSS_CLASS_ROW, CSS_CLASS_NO_GUTTERS, CSS_CLASS_ALERT_SUCCESS, CSS_CLASS_NOWRAP];
    const CSS_CLASSES_ITEM_GROUP_NO_MATCH: string[] = [CSS_CLASS_ROW, CSS_CLASS_NO_GUTTERS, CSS_CLASS_ALERT_SECONDARY, CSS_CLASS_NOWRAP];
    const CSS_CLASSES_ITEM_REPLACELINE_SELECTED: string[] = [CSS_CLASS_BG_PRIMARY, CSS_CLASS_TEXT_LIGHT, CSS_CLASS_BORDER_PRIMARY, CSS_CLASS_ROW, CSS_CLASS_NO_GUTTERS, CSS_CLASS_NOWRAP];
    const CSS_CLASSES_ITEM_REPLACELINE_NOTSELECTED: string[] = [CSS_CLASS_TEXT_DARK, CSS_CLASS_BORDER_DARK, CSS_CLASS_ROW, CSS_CLASS_NO_GUTTERS, CSS_CLASS_NOWRAP];
    const CSS_CLASSES_ITEM_METRIC_SUCCESS: string[] = [CSS_CLASS_BORDER_SUCCESS, CSS_CLASS_BG_SUCCESS, CSS_CLASS_TEXT_LIGHT, CSS_CLASS_ROW, CSS_CLASS_NO_GUTTERS, CSS_CLASS_NOWRAP];
    const CSS_CLASSES_ITEM_METRIC_EQUAL: string[] = [CSS_CLASS_BORDER_DARK, CSS_CLASS_TEXT_DARK, CSS_CLASS_ROW, CSS_CLASS_NO_GUTTERS, CSS_CLASS_NOWRAP];
    const CSS_CLASSES_ITEM_METRIC_WARNING: string[] = [CSS_CLASS_BORDER_WARNING, CSS_CLASS_BG_WARNING, CSS_CLASS_TEXT_DARK, CSS_CLASS_ROW, CSS_CLASS_NO_GUTTERS, CSS_CLASS_NOWRAP];

    const EVAL_RESULT_MSG_NOT_EVALUATED: string = "Not evaluated";
    const EVAL_RESULT_MSG_MATCH_NOT_FOUND: string = "Match not found";

    const IMG_SRC_EXPAND_DOWN: string = "./images/dave-gandy/thin-arrowheads-pointing-down.svg";
    const IMG_SRC_COLLAPSE_UP: string = "./images/dave-gandy/chevron-up.svg";
    const IMG_SRC_REPLACE: string = "./images/open-iconic/svg/loop.svg";
    const IMG_SRC_MATCH: string = "./images/open-iconic/svg/magnifying-glass.svg";

    const IMG_ALT_REPLACE: string = "Replace";
    const IMG_ALT_MATCH: string = "Match";
    
    const TEXTAREA_ROW_COUNT_MAX: number = 32;
    const TEXTAREA_ROW_COUNT_DEFAULT: number = 6;

    const WHITESPACE_REGEX: RegExp = /[\s\r\n\p{C}]+/g;
    const NEWLINE_REGEX: RegExp = /\r\n?|\n/g;
    const LINE_WITH_ENDING_REGEX: RegExp = /^([^\r\n]+)?(\r\n?|\n)/g;
    
    // #region EvaluationItem

    interface IEvaluationMatchResultGroup {
        index: number;
        successMsg: string;
        groupText: string;
        cssClass: string[];
    }

    interface IReplaceLine {
        isSelected: boolean;
        length: number;
        text: string;
        lineEnding: string;
        cssClass: string[];
        selectCurrent: { (event?: JQueryEventObject): void };
    }

    interface IEvaluationItemScope extends ng.IScope {
        item: EvaluationItem;
        isEditingInput: boolean;
        isShowingSingleLineTextInput: boolean;
        matchIndex: number;
        canDelete: boolean;
        rowCount: number;
        isMultiLine: boolean;
        inputText: string;
        replacementText: string;
        matchSuccess: boolean;
        inputClass: string[];
        messageClass: string[];
        messageText: string;
        canAddRow: boolean;
        canRemoveRow: boolean;
        isReplace: boolean;
        toggleImgSrc: string;
        toggleImgAlt: string;
        changeMessage: string;
        changedClass: string[];
        lengthClass: string[];
        originalLength: number;
        replacedLength: number;
        lineCountClass: string[];
        originalLineCount: number;
        replacedLineCount: number;
        compareClass: string[];
        originalLine: string;
        comparedLine: string;
        matchResults: IEvaluationMatchResultGroup[];
        originalLineInfo: IReplaceLine[];
        replacedLineInfo: IReplaceLine[]
    }

    class EvaluationItem {
        private _isEditingPattern: boolean = false;
        private _isEditingInput: boolean = true;
        private _index: number;

        get isEditingPattern(): boolean { return this._isEditingPattern; }
        set isEditingPattern(value: boolean) {
            if (this._isEditingPattern === (value = value === true))
                return;
            this._isEditingPattern = value;
            this.updateView();
        }

        get isEditingInput(): boolean { return this._isEditingInput; }
        set isEditingInput(value: boolean) {
            if (this._isEditingInput === (value = value === true))
                return;
            this._isEditingInput = value;
            this.updateView();
        }

        constructor(private $scope: IEvaluationItemScope, private _regexTester: RegexTesterController_old) {
            $scope.item = this;
            this.$scope.isReplace = false;
            $scope.isEditingInput = this.isEditingInput;
            $scope.inputText = "";
            $scope.matchSuccess = false;
            $scope.matchResults = [];
            $scope.messageText = EVAL_RESULT_MSG_NOT_EVALUATED;
            $scope.messageClass = [CSS_CLASS_ALERT_SECONDARY, CSS_CLASS_SMALL];
            $scope.inputClass = [];
            $scope.originalLineInfo = [];
            $scope.replacedLineInfo = [];
            $scope.changedClass = [];
            $scope.lengthClass = [];
            $scope.lineCountClass = [];
            $scope.originalLength = $scope.replacedLength = $scope.originalLineCount = $scope.replacedLineCount = 0;
            $scope.compareClass = [];
            $scope.changeMessage = $scope.originalLine = $scope.replacementText = $scope.comparedLine = "";
            $scope.matchIndex = NaN;
            $scope.isEditingPattern = _regexTester.isEditingPattern;
            $scope.toggleImgSrc = IMG_SRC_REPLACE;
            $scope.toggleImgAlt = IMG_ALT_REPLACE;
            let current: EvaluationItem = this; 
            $scope.$watchGroup(["inputText", "replacementText"], () => { current.evaluate(); })
        }

        toggleSearchReplace(event?: JQueryEventObject): void {
            this.$scope.isReplace = this.$scope.isReplace !== true;
            if (this.$scope.isReplace) {
                this.$scope.toggleImgSrc = IMG_SRC_MATCH;
                this.$scope.toggleImgAlt = IMG_ALT_MATCH;
            } else {
                this.$scope.toggleImgSrc = IMG_SRC_REPLACE;
                this.$scope.toggleImgAlt = IMG_ALT_REPLACE;
                this.$scope.matchSuccess = false;
            }
            this.evaluate();
            if (!sys.isNil(event)) {
                event.preventDefault();
                event.stopPropagation();
            }
        }

        updateView(): void {
            if (this.isEditingInput && !this.isEditingPattern) {
                this.$scope.isEditingInput = true;
                this.$scope.canRemoveRow = this.$scope.rowCount > 1;
                this.$scope.canAddRow = this.$scope.rowCount < TEXTAREA_ROW_COUNT_MAX;
            } else
                this.$scope.isEditingInput = this.$scope.canAddRow = this.$scope.canRemoveRow = false;
        }

        addRow(event?: JQueryEventObject): void {
            if (this.$scope.rowCount >= TEXTAREA_ROW_COUNT_MAX)
                return;
            this.$scope.rowCount++;
            this.$scope.isMultiLine = true;
            this.updateView();
            if (!sys.isNil(event)) {
                event.preventDefault();
                event.stopPropagation();
            }
        }

        removeRow(event?: JQueryEventObject): void {
            if (this.$scope.rowCount < 2)
                return;
            this.$scope.rowCount--;
            this.$scope.isMultiLine = this.$scope.rowCount > 1;
            this.updateView();
            if (!sys.isNil(event)) {
                event.preventDefault();
                event.stopPropagation();
            }
        }

        editCurrent(event?: JQueryEventObject): void {
            this._regexTester.editItem(this._index);
            if (!sys.isNil(event)) {
                event.preventDefault();
                event.stopPropagation();
            }
        }

        deleteCurrent(event?: JQueryEventObject): void {
            if (this.$scope.canDelete === true)
                this._regexTester.deleteItem(this._index);
            if (!sys.isNil(event)) {
                event.preventDefault();
                event.stopPropagation();
            }
        }

        static addItem(item: EvaluationItem, array: IEvaluationItemScope[]): void {
            item._index = array.length;
            array.push(item.$scope);
            if (array.length == 2) 
                array[0].canDelete = true;
            else if (array.length < 2) {
                item.$scope.isMultiLine = false;
                item.$scope.rowCount = 1;
                item.$scope.canDelete = false;
                item.$scope.canAddRow = true;
                item.$scope.canRemoveRow = false;
                return;
            }
            let previousScope: IEvaluationItemScope = array[array.length - 2];
            item.$scope.isMultiLine = previousScope.isMultiLine;
            item.$scope.rowCount = previousScope.rowCount;
            item.$scope.canAddRow = previousScope.canAddRow;
            item.$scope.canRemoveRow = previousScope.canRemoveRow;
            item.$scope.canDelete = true;
            item.updateView();
            item.evaluate();
            item.editCurrent();
        }

        static editItem(array: IEvaluationItemScope[], index: number): void {
            if (isNaN(index) || index < 0 || index > array.length)
                return;
            let $scope: IEvaluationItemScope = array[index];
            if ($scope.isEditingInput)
                return;
            array.forEach((s: IEvaluationItemScope, i: number) => {
                if (index != i)
                    s.item.isEditingInput = false;
            });
            $scope.item.isEditingInput = true;
            $scope.item._regexTester.isEditingPattern = false;
            $scope.item.updateView();
        }

        static deleteItem(array: IEvaluationItemScope[], index: number): void {
            if (array.length < 2 || isNaN(index) || index < 0 || index > array.length)
                return;
            let $scope: IEvaluationItemScope;
            if (index == 0)
                $scope = array.shift();
            else if (index < array.length - 1)
                $scope = array.splice(index, 1)[0];
            else
                $scope = array.pop();
            for (let i: number = index; i < array.length; i++)
                array[i].item._index = i;
            $scope.$destroy();
            if (array.length == 1)
                array[0].canDelete = false;
        }

        selectOriginalLine(index: number): void {
            if (typeof index !== "number" || isNaN(index) || index < 0 || index >= this.$scope.originalLineInfo.length)
                return;
            this.$scope.originalLine = this.$scope.originalLineInfo[index].text;
            if (this.$scope.originalLine === this.$scope.comparedLine)
                this.$scope.compareClass = CSS_CLASSES_ITEM_METRIC_EQUAL;
            else
                this.$scope.compareClass = CSS_CLASSES_ITEM_METRIC_SUCCESS;
            this.$scope.originalLineInfo.forEach((value: IReplaceLine, i: number) => {
                if (i === index) {
                    value.cssClass = CSS_CLASSES_ITEM_REPLACELINE_SELECTED;
                    value.isSelected = true;
                } else {
                    value.cssClass = CSS_CLASSES_ITEM_REPLACELINE_NOTSELECTED;
                    value.isSelected = false;
                }
            });
        }

        selectResultLine(index: number): void {
            if (typeof index !== "number" || isNaN(index) || index < 0 || index >= this.$scope.originalLineInfo.length)
                return;
            this.$scope.comparedLine = this.$scope.replacedLineInfo[index].text;
            if (this.$scope.originalLine === this.$scope.comparedLine)
                this.$scope.compareClass = CSS_CLASSES_ITEM_METRIC_EQUAL;
            else
                this.$scope.compareClass = CSS_CLASSES_ITEM_METRIC_SUCCESS;
            this.$scope.replacedLineInfo.forEach((value: IReplaceLine, i: number) => {
                if (i === index) {
                    value.cssClass = CSS_CLASSES_ITEM_REPLACELINE_SELECTED;
                    value.isSelected = true;
                } else {
                    value.cssClass = CSS_CLASSES_ITEM_REPLACELINE_NOTSELECTED;
                    value.isSelected = false;
                }
            });
        }

        evaluate(event?: JQueryEventObject): void {
            if (!sys.isNil(event)) {
                event.preventDefault();
                event.stopPropagation();
            }
            let re: RegExp | undefined = this._regexTester.expression;
            if (sys.isNil(re)) {
                this.$scope.matchSuccess = false;
                this.$scope.messageText = EVAL_RESULT_MSG_NOT_EVALUATED;
                this.$scope.messageClass = CSS_CLASSES_ITEM_NOT_EVALUATED;
                this.$scope.matchResults = [];
                this.$scope.originalLineInfo = [];
                this.$scope.replacedLineInfo = [];
                this.$scope.changedClass = [];
                this.$scope.lengthClass = [];
                this.$scope.lineCountClass = [];
                this.$scope.originalLength = this.$scope.replacedLength = this.$scope.originalLineCount = this.$scope.replacedLineCount = 0;
                this.$scope.compareClass = [];
                this.$scope.originalLine = this.$scope.changeMessage = this.$scope.comparedLine = "";
                return;
            }

            if (this.$scope.isReplace) {
                let originalText: string = this.$scope.inputText;
                let replacementText: string = this.$scope.replacementText;
                this._regexTester.$q<string | undefined>((resolve: ng.IQResolveReject<string | undefined>, reject: ng.IQResolveReject<any>) => {
                    if (sys.isNil(this._regexTester.expression) || re.source !== this._regexTester.expression.source || re.flags !== this._regexTester.expression.flags || originalText !== this.$scope.inputText || replacementText !== this.$scope.replacementText)
                        resolve(undefined);
                    else {
                        this._regexTester.$log.debug("Testing " + this._regexTester.expression.toString() + " against " + angular.toJson(originalText));
                        try {
                            let s: string = originalText.replace(re, replacementText);
                            resolve(s);
                        } catch (e) { reject(e); }
                    }
                }).then((result: string | undefined) => {
                    if (sys.isNil(result) || sys.isNil(this._regexTester.expression) || re.source !== this._regexTester.expression.source || re.flags !== this._regexTester.expression.flags || originalText !== this.$scope.inputText || replacementText !== this.$scope.replacementText)
                        return;
                    if (originalText === result) {
                        this.$scope.changedClass = CSS_CLASSES_ITEM_METRIC_WARNING;
                        this.$scope.changeMessage = "No";
                        this.$scope.lengthClass = CSS_CLASSES_ITEM_METRIC_EQUAL;
                        this.$scope.lineCountClass = CSS_CLASSES_ITEM_METRIC_EQUAL;
                        this.$scope.originalLength = this.$scope.replacedLength = originalText.length;
                    } else {
                        this.$scope.changedClass = CSS_CLASSES_ITEM_METRIC_SUCCESS;
                        this.$scope.changeMessage = "Yes";
                        if ((this.$scope.originalLength = originalText.length) === (this.$scope.replacedLength = result.length))
                            this.$scope.lengthClass = CSS_CLASSES_ITEM_METRIC_EQUAL;
                        else
                            this.$scope.lengthClass = CSS_CLASSES_ITEM_METRIC_SUCCESS;
                    }
                    let item: EvaluationItem = this;
                    if ((this.$scope.originalLength = originalText.length) == 0)
                        this.$scope.originalLineInfo = [{ isSelected: false, cssClass: CSS_CLASSES_ITEM_REPLACELINE_NOTSELECTED, length: 0, lineEnding: "", selectCurrent: () => { item.selectOriginalLine(0) }, text: "\"\"" }];
                    else {
                        this.$scope.originalLineInfo = [];
                        let m: RegExpExecArray = LINE_WITH_ENDING_REGEX.exec(originalText);
                        while (!sys.isNil(m)) {
                            let s: string = angular.toJson(m[2]);
                            s = s.substr(1, s.length - 2);
                            if (sys.isNil(m[1]))
                                this.$scope.originalLineInfo.push({
                                    isSelected: false, cssClass: CSS_CLASSES_ITEM_REPLACELINE_NOTSELECTED, length: 0, lineEnding: s, selectCurrent: () => {
                                        item.selectOriginalLine(this.$scope.originalLineInfo.length);
                                        if (!sys.isNil(event)) {
                                            event.preventDefault();
                                            event.stopPropagation();
                                        }
                                    }, text: "\"\""
                                });
                            else
                                this.$scope.originalLineInfo.push({
                                    isSelected: false, cssClass: CSS_CLASSES_ITEM_REPLACELINE_NOTSELECTED, length: m[1].length, lineEnding: s, selectCurrent: () => {
                                        item.selectOriginalLine(this.$scope.originalLineInfo.length);
                                        if (!sys.isNil(event)) {
                                            event.preventDefault();
                                            event.stopPropagation();
                                        }
                                    }, text: angular.toJson(m[1])
                                });
                            originalText = originalText.substr(m[0].length);
                            m = LINE_WITH_ENDING_REGEX.exec(originalText);
                        }
                        if (originalText.length > 0)
                            this.$scope.originalLineInfo.push({
                                isSelected: false, cssClass: CSS_CLASSES_ITEM_REPLACELINE_NOTSELECTED, length: originalText.length, lineEnding: "", selectCurrent: () => {
                                    item.selectOriginalLine(this.$scope.originalLineInfo.length);
                                    if (!sys.isNil(event)) {
                                        event.preventDefault();
                                        event.stopPropagation();
                                    }
                                }, text: angular.toJson(originalText)
                            });
                    }
                    if ((this.$scope.replacedLength = result.length) == 0)
                        this.$scope.replacedLineInfo = [{
                            isSelected: true, cssClass: CSS_CLASSES_ITEM_REPLACELINE_NOTSELECTED, length: 0, lineEnding: "", selectCurrent: () => {
                                item.selectResultLine(0);
                                if (!sys.isNil(event)) {
                                    event.preventDefault();
                                    event.stopPropagation();
                                }
                            }, text: "\"\""
                        }];
                    else {
                        this.$scope.replacedLineInfo = [];
                        let m: RegExpExecArray = LINE_WITH_ENDING_REGEX.exec(result);
                        while (!sys.isNil(m)) {
                            let s: string = angular.toJson(m[2]);
                            s = s.substr(1, s.length - 2);
                            if (sys.isNil(m[1]))
                                this.$scope.replacedLineInfo.push({
                                    isSelected: false, cssClass: CSS_CLASSES_ITEM_REPLACELINE_NOTSELECTED, length: 0, lineEnding: s, selectCurrent: () => {
                                        item.selectResultLine(this.$scope.replacedLineInfo.length);
                                        if (!sys.isNil(event)) {
                                            event.preventDefault();
                                            event.stopPropagation();
                                        }
                                    }, text: "\"\""
                                });
                            else
                                this.$scope.replacedLineInfo.push({
                                    isSelected: false, cssClass: CSS_CLASSES_ITEM_REPLACELINE_NOTSELECTED, length: m[1].length, lineEnding: s, selectCurrent: () => {
                                        item.selectResultLine(this.$scope.replacedLineInfo.length);
                                        if (!sys.isNil(event)) {
                                            event.preventDefault();
                                            event.stopPropagation();
                                        }
                                    }, text: angular.toJson(m[1])
                                });
                            result = result.substr(m[0].length);
                            m = LINE_WITH_ENDING_REGEX.exec(result);
                        }
                        if (result.length > 0)
                            this.$scope.replacedLineInfo.push({
                                isSelected: false, cssClass: CSS_CLASSES_ITEM_REPLACELINE_NOTSELECTED, length: result.length, lineEnding: "", selectCurrent: () => {
                                    item.selectResultLine(this.$scope.replacedLineInfo.length);
                                    if (!sys.isNil(event)) {
                                        event.preventDefault();
                                        event.stopPropagation();
                                    }
                                }, text: angular.toJson(result)
                            });
                    }
                    ;
                    this.$scope.comparedLine = "";
                    if ((this.$scope.originalLineCount = this.$scope.originalLineInfo.length) === (this.$scope.replacedLineCount = this.$scope.replacedLineInfo.length))
                        this.$scope.lineCountClass = CSS_CLASSES_ITEM_METRIC_EQUAL;
                    else
                        this.$scope.lineCountClass = CSS_CLASSES_ITEM_METRIC_SUCCESS;
                    this.selectOriginalLine(0);
                    this.selectResultLine(0);
                }, (reason: any) => {
                    if (sys.isNil(this._regexTester.expression) || re.source !== this._regexTester.expression.source || re.flags !== this._regexTester.expression.flags || originalText !== this.$scope.inputText || replacementText !== this.$scope.replacementText)
                        return;
                    if (sys.isNil(this._regexTester.patternError))
                        this._regexTester.patternError = reason;
                    this.$scope.messageClass = CSS_CLASSES_ITEM_EVALUATION_ERROR;
                    this.$scope.messageText = "Unexpected error: " + reason;
                    this.$scope.originalLineInfo = [];
                    this.$scope.replacedLineInfo = [];
                    this.$scope.changedClass = [];
                    this.$scope.lengthClass = [];
                    this.$scope.lineCountClass = [];
                    this.$scope.originalLength = this.$scope.replacedLength = this.$scope.originalLineCount = this.$scope.replacedLineCount = 0;
                    this.$scope.compareClass = [];
                    this.$scope.originalLine = this.$scope.changeMessage = this.$scope.comparedLine = "";
                    this._regexTester.evaluationComplete(false, this._index);
                });
            } else {
                this._regexTester.$q<RegExpExecArray | null | undefined>((resolve: ng.IQResolveReject<RegExpExecArray | null | undefined>, reject: ng.IQResolveReject<any>) => {
                    if (sys.isNil(this._regexTester.expression) || re.source !== this._regexTester.expression.source || re.flags !== this._regexTester.expression.flags)
                        resolve(undefined);
                    else {
                        this._regexTester.$log.debug("Testing " + this._regexTester.expression.toString() + " against " + angular.toJson(this.$scope.inputText));
                        try {
                            let m: RegExpExecArray = re.exec(this.$scope.inputText);
                            resolve(m);
                        } catch (e) { reject(e); }
                    }
                }).then((result: RegExpExecArray | null | undefined) => {
                    if (typeof result === "undefined" || sys.isNil(this._regexTester.expression) || re.source !== this._regexTester.expression.source || re.flags !== this._regexTester.expression.flags)
                        return;
                    if (result === null) {
                        this.$scope.matchSuccess = false;
                        this.$scope.messageClass = CSS_CLASSES_ITEM_EVALUATION_WARNING;
                        this.$scope.messageText = EVAL_RESULT_MSG_MATCH_NOT_FOUND;
                        this.$scope.matchResults = [];
                        this._regexTester.evaluationComplete(false, this._index);
                    } else {
                        this.$scope.matchSuccess = true;
                        this.$scope.messageClass = CSS_CLASSES_ITEM_EVALUATION_SUCCESS;
                        this.$scope.messageText = "Matched " + result.length + " groups starting at position " + result.index + ".";
                        this.$scope.matchIndex = result.index;
                        this.$scope.matchResults = result.map((value: string, index: number) => {
                            if (sys.isNil(value))
                                return <IEvaluationMatchResultGroup>{
                                    cssClass: CSS_CLASSES_ITEM_GROUP_NO_MATCH,
                                    groupText: "",
                                    successMsg: "No",
                                    index: index
                                };
                            return <IEvaluationMatchResultGroup>{
                                cssClass: CSS_CLASSES_ITEM_GROUP_SUCCESS,
                                groupText: angular.toJson(value),
                                successMsg: "Yes",
                                index: index
                            };
                        });
                        this._regexTester.evaluationComplete(true, this._index);
                    }
                }, (reason: any) => {
                    if (sys.isNil(this._regexTester.expression) || re.source !== this._regexTester.expression.source || re.flags !== this._regexTester.expression.flags)
                        return;
                    if (sys.isNil(this._regexTester.patternError))
                        this._regexTester.patternError = reason;
                    this.$scope.messageClass = CSS_CLASSES_ITEM_EVALUATION_ERROR;
                    this.$scope.messageText = "Unexpected error: " + reason;
                    this.$scope.matchResults = [];
                    this._regexTester.evaluationComplete(false, this._index);
                });
            }
        }
    }

    // #endregion

    // #region RegexTesterController_old

    const CONTROL_ID_MULTILINEPATTERNTEXTBOX = "multiLinePatternTextBox";
    const CONTROL_ID_SINGLELINEPATTERNTEXTBOX = "singleLinePatternTextBox";

    interface IRegexTesterScope_old extends ng.IScope {
        regexTester: RegexTesterController_old;
        isEditingPattern: boolean;
        isShowingSingleLinePatternEdit: boolean;
        isShowingMultiLinePatternEdit: boolean;
        multiLinePatternText: string;
        singleLinePatternText: string;
        patternDisplayText: string;
        ignoreWhitespace: boolean;
        global: boolean;
        ignoreCase: boolean;
        multiline: boolean;
        sticky: boolean;
        unicode: boolean;
        dotMatchesNewline: boolean;
        flags: string;
        hasErrorMessage: boolean;
        hasErrorName: boolean;
        hasErrorDetail: boolean;
        patternErrorMessage: string;
        patternErrorName: string;
        patternErrorDetail: string;
        noMatches: boolean;
        canRemovePatternRow: boolean;
        canAddPatternRow: boolean;
        multiLineRowCount: number;
        patternTextBoxLabelId: string;
        singleLinePatternTextBoxId: string;
        multiLinePatternTextBoxId: string;
        evaluationInput: IEvaluationItemScope[];
    }

    // (?:([^?:+\\/@?#%]+)(:(?://?|/?$)))(?:((?:[^:+\\/@?#]+|%[a-f\d]2)*)(?::((?:[^\\/@?#]+|%[a-f\d]2)*))?@(?![:/?#\\]))?(((?:[^:\\/@?#]+|%[a-f\d]2)+)(:(\d+))?)?
    class RegexTesterController_old implements ng.IController {
        private _expression: RegExp | undefined;
        private _patternError: any | undefined;

        get expression(): RegExp | undefined { return this._expression; }

        get isEditingPattern(): boolean { return this.$scope.isEditingPattern; }
        set isEditingPattern(value: boolean) {
            if (this.$scope.isEditingPattern === value)
                return;

            this.$scope.isEditingPattern = value === true;
            this.updatePatternView();
        }

        get patternError(): any | undefined { return this._patternError; }
        set patternError(value: any | undefined) {
            value = sys.asErrorResult(value);
            if (sys.isNil(value)) {
                this._patternError = undefined;
                this.$scope.hasErrorMessage = this.$scope.hasErrorDetail = this.$scope.hasErrorName = false;
                this.$scope.patternErrorMessage = this.$scope.patternErrorDetail = this.$scope.patternErrorName = "";
            } else {
                this._patternError = value;
                this.$scope.hasErrorMessage = true;
                if (typeof value === "string") {
                    this.$scope.patternErrorMessage = value;
                    this.$scope.hasErrorDetail = this.$scope.hasErrorName = false;
                    this.$scope.patternErrorDetail = this.$scope.patternErrorName = "";
                } else {
                    if ((this.$scope.patternErrorMessage = sys.asString(value.message, "").trim()).length == 0) {
                        if ((this.$scope.patternErrorMessage = sys.asString(value.name, "").trim()).length == 0)
                            this.$scope.patternErrorMessage = "Unexpected error: " + value;
                        this.$scope.patternErrorName = "";
                    } else
                        this.$scope.patternErrorName = sys.asString(value.name, "").trim();
                    this.$scope.patternErrorDetail = sys.asString((<sys.IErrorLike>value).data, "");
                    this.$scope.hasErrorName = this.$scope.patternErrorName.length > 0;
                    this.$scope.hasErrorDetail = this.$scope.patternErrorDetail.trim().length > 0;
                }
            }
        }

        constructor(private $scope: IRegexTesterScope_old, public $q: ng.IQService, public $log: ng.ILogService) {
            $scope.regexTester = this;
            $scope.multiLineRowCount = TEXTAREA_ROW_COUNT_DEFAULT;
            $scope.multiLinePatternTextBoxId = CONTROL_ID_MULTILINEPATTERNTEXTBOX;
            $scope.singleLinePatternTextBoxId = CONTROL_ID_SINGLELINEPATTERNTEXTBOX;
            $scope.evaluationInput = [];
            $scope.ignoreWhitespace = $scope.global = $scope.ignoreCase = $scope.multiline = $scope.sticky = $scope.unicode = $scope.dotMatchesNewline = $scope.hasErrorMessage = $scope.hasErrorName = $scope.hasErrorDetail = false;
            $scope.noMatches = true;
            $scope.singleLinePatternText = $scope.multiLinePatternText = $scope.flags = $scope.patternErrorMessage = $scope.patternErrorName = $scope.patternErrorDetail = "";
            let controller: RegexTesterController_old = this;
            $scope.$watchGroup(["global", "ignoreCase", "multiline", "sticky", "unicode", "dotMatchesNewline"], () => {
                controller.updateFlags();
            });
            $scope.$watch("ignoreWhitespace", () => { controller.updatePatternView(); });
            $scope.$watch("multiLinePatternText", () => {
                controller.multiLinePatternChanged();
            });
            $scope.$watch("singleLinePatternText", () => {
                controller.patternChanged();
            });
            this.addInput();
            this.editPattern();
            this.patternChanged();
        }

        addPatternRow(event?: JQueryEventObject): void {
            if (this.$scope.multiLineRowCount >= TEXTAREA_ROW_COUNT_MAX)
                return;
            this.$scope.multiLineRowCount++;
            this.updatePatternView();
            if (!sys.isNil(event)) {
                event.preventDefault();
                event.stopPropagation();
            }
        }

        removePatternRow(event?: JQueryEventObject): void {
            if (this.$scope.multiLineRowCount < 3)
                return;
            this.$scope.multiLineRowCount--;
            this.updatePatternView();
            if (this.isEditingPattern && this.$scope.isShowingMultiLinePatternEdit)
                $(CONTROL_ID_MULTILINEPATTERNTEXTBOX).focus();
            if (!sys.isNil(event)) {
                event.preventDefault();
                event.stopPropagation();
            }
        }

        addInput(event?: JQueryEventObject): void {
            EvaluationItem.addItem(new EvaluationItem(<IEvaluationItemScope>this.$scope.$new(), this), this.$scope.evaluationInput);
            if (!sys.isNil(event)) {
                event.preventDefault();
                event.stopPropagation();
            }
        }
        
        editPattern(event?: JQueryEventObject): void {
            this.isEditingPattern = true;
            if (!sys.isNil(event)) {
                event.preventDefault();
                event.stopPropagation();
            }
        }

        openOptionsDialog(event?: JQueryEventObject): void {
            $('#patternOptionsModal').modal("show");
            if (!sys.isNil(event)) {
                event.preventDefault();
                event.stopPropagation();
            }
        }

        closeOptionsDialog(event?: JQueryEventObject) {
            $('#patternOptionsModal').modal("hide");
            if (!sys.isNil(event)) {
                event.preventDefault();
                event.stopPropagation();
            }
        }
        
        updatePatternView(): void {
            if (this.isEditingPattern) {
                if (this.$scope.ignoreWhitespace === true) {
                    this.$scope.patternTextBoxLabelId = CONTROL_ID_MULTILINEPATTERNTEXTBOX;
                    this.$scope.canAddPatternRow = this.$scope.multiLineRowCount < TEXTAREA_ROW_COUNT_MAX;
                    this.$scope.isShowingMultiLinePatternEdit = this.$scope.canRemovePatternRow = this.$scope.multiLineRowCount > 1;
                    this.$scope.isShowingSingleLinePatternEdit = !this.$scope.isShowingMultiLinePatternEdit;
                } else {
                    this.$scope.patternTextBoxLabelId = CONTROL_ID_SINGLELINEPATTERNTEXTBOX;
                    this.$scope.isShowingMultiLinePatternEdit = this.$scope.canAddPatternRow = this.$scope.canRemovePatternRow = false;
                    this.$scope.isShowingSingleLinePatternEdit = true;
                }
                this.$scope.evaluationInput.forEach((item: IEvaluationItemScope) => { item.item.isEditingPattern = true; });
            } else {
                this.$scope.isShowingSingleLinePatternEdit = this.$scope.isShowingMultiLinePatternEdit = this.$scope.canAddPatternRow = this.$scope.canRemovePatternRow = false;
                this.$scope.evaluationInput.forEach((item: IEvaluationItemScope) => { item.item.isEditingPattern = false; });
            }
        }
        
        updateFlags(): void {
            let flags: string = (this.$scope.ignoreCase) ? "i" : "";
            if (this.$scope.global)
                flags += "g";
            if (this.$scope.multiline)
                flags += "m";
            if (this.$scope.dotMatchesNewline)
                flags += "s";
            if (this.$scope.unicode)
                flags += "u";
            if (this.$scope.sticky)
                flags += "y";
            if (flags === this.$scope.flags)
                return;

            this.$scope.flags = flags;
            this.patternChanged();
        }

        multiLinePatternChanged(): void {
            if (!this.$scope.ignoreWhitespace)
                return;
            let pattern: string = sys.asString(this.$scope.multiLinePatternText).trim().replace(WHITESPACE_REGEX, "");
            if (pattern === this.$scope.singleLinePatternText)
                return;
            this.$scope.singleLinePatternText = pattern;
            this.patternChanged();
        }

        patternChanged(): void {
            let patternText: string = this.$scope.singleLinePatternText;
            if (!this.$scope.ignoreWhitespace)
                this.$scope.multiLinePatternText = patternText;

            let flags: string = this.$scope.flags;
            this._expression = undefined;
            this.$q<RegExp | undefined>((resolve: ng.IQResolveReject<RegExp | undefined>, reject: ng.IQResolveReject<any>) => {
                if (patternText !== this.$scope.singleLinePatternText || flags !== this.$scope.flags)
                    resolve(undefined);
                else {
                    let re: RegExp;
                    try { re = new RegExp(patternText, flags); }
                    catch (e) {
                        reject(e);
                        return;
                    }
                    if (sys.isNil(re))
                        reject("Failed to parse regular expression.");
                    else
                        resolve(re);
                }
            }).then((result: RegExp | undefined) => {
                if (patternText !== this.$scope.singleLinePatternText || flags !== this.$scope.flags)
                    return;
                this.$scope.patternDisplayText = result.toString();
                this._expression = result;
                this.$scope.patternErrorMessage = this.$scope.patternErrorName = this.$scope.patternErrorDetail = "";
                this.$scope.hasErrorMessage = this.$scope.hasErrorName = this.$scope.hasErrorDetail = false;
                this.$scope.noMatches = true;
                this.$scope.evaluationInput.forEach((value: IEvaluationItemScope) => { value.item.evaluate(); });
            }, (reason: any) => {
                if (patternText === this.$scope.singleLinePatternText && flags === this.$scope.flags)
                    this.patternError = reason;
            });
        }

        evaluationComplete(success: boolean, _index: number): void {
            if (success)
                this.$scope.noMatches = false;
        }

        deleteItem(index: number): void { EvaluationItem.deleteItem(this.$scope.evaluationInput, index); }

        editItem(index: number): void { EvaluationItem.editItem(this.$scope.evaluationInput, index); }

        $doCheck() { }
    }

    // #endregion
    
    // #region TestStringItem

    enum ResultMessageType {
        none,
        success,
        warning,
        error
    }

    interface IResultMessage {
        type: ResultMessageType;
        message: string;
        cssClass: string[];
        hasDetail: boolean;
        detailedMessage: string;
    }

    interface IRegexReplaceLine {
        lineNumber: number;
        startIndex: number;
        length: number;
        text: string;
        lineEnding: string;
        selectForCompare(event: JQueryEventObject): boolean;
    }

    interface IRegexExecResultGroup {
        isMatch: boolean;
        length: number;
        text: string;
    }

    interface ITestStringItemScope extends ng.IScope {
        testString: TestStringItem;
        isCurrent: boolean;
        showEditControl: boolean;
        canDelete: boolean;
        showReplacementControl: boolean;
        inputText: string;
        replacementText: string;
        resultMessage: IResultMessage;
        execResult: {
            isVisible: boolean;
            success: boolean;
            index: number;
            groups: IRegexExecResultGroup[];
        }
        replaceResult: {
            sourceLength: number;
            resultText: string;
            resultLength: number;
            isVisible: boolean;
            isChanged: boolean;
            firstDifferentCharIndex: number;
            sourceLines: IRegexReplaceLine[];
            replacedLines: IRegexReplaceLine[];
        }
        lineCompare: {
            isVisible: boolean;
            areEqual: boolean;
            startEqual: boolean;
            leadingEqualText: string;
            firstDifferentCharIndex: number;
            sourceLineNumber: number;
            differingSource: string;
            replaceLineNumber: number;
            differingReplace: string;
            cssClass: string[];
        }
    }

    function preventDefault(event: JQueryEventObject): boolean {
        event.preventDefault();
        event.stopPropagation();
        return false;
    }

    class TestStringItem {
        private _id: Symbol = Symbol();
        private _parentScope: IRegexTesterScope | undefined;
        private _isReplaceMode: boolean;
        
        constructor(private $scope: ITestStringItemScope, private $log: ng.ILogService, private $q: ng.IQService) {
            $scope.testString = this;
            $scope.isCurrent = $scope.showEditControl = $scope.showReplacementControl = $scope.canDelete = this._isReplaceMode = false;
            $scope.inputText = $scope.replacementText = "";
            this.setNotEvaluated();

            let controller: TestStringItem = this;
            $scope.$watch("isCurrent", () => { controller.onIsCurrentChanged(); });
            $scope.$watch("showEditControl", () => { controller.onShowEditControlChanged(); });
            $scope.$watch("inputText", () => { controller.start(controller._parentScope.regexTester.expression, controller.getIndex(), controller._parentScope.regexTester.patternText, controller._parentScope.regexTester.flags); });

            $scope.$watch("replacementText", () => {
                if (controller._isReplaceMode)
                    controller.start(controller._parentScope.regexTester.expression, controller.getIndex(), controller._parentScope.regexTester.patternText, controller._parentScope.regexTester.flags);
            });
        }

        private static getParentArray(parentScope: IRegexTesterScope): ITestStringItemScope[] {
            if (sys.isNil(parentScope))
                return [];
            let testStrings: ITestStringItemScope[] = parentScope.testStrings;
            if (sys.isNil(testStrings) || !Array.isArray(testStrings))
                testStrings = [];
            else if ((testStrings = testStrings.filter((value: ITestStringItemScope, i: number) => {
                if (sys.isNil(value))
                    return false;
                let item: TestStringItem = value.testString;
                return !sys.isNil(item) && typeof item._parentScope !== "undefined";
            })).length === parentScope.testStrings.length)
                return parentScope.testStrings;
            parentScope.testStrings = testStrings;
            return testStrings;
        }

        getIndex(): number {
            if (sys.isNil(this._parentScope))
                return -1;
            let testStrings: ITestStringItemScope[] = TestStringItem.getParentArray(this._parentScope);
            for (let i: number = 0; i < testStrings.length; i++) {
                if (testStrings[i].testString._id === this._id)
                    return i;
            }
            this._parentScope = undefined;
            this.$scope.canDelete = false;
            return -1;
        }

        toggleReplace(event: JQueryEventObject): void {
            this._isReplaceMode = !this._isReplaceMode;
            this.start(this._parentScope.regexTester.expression, this.getIndex(), this._parentScope.regexTester.patternText, this._parentScope.regexTester.flags);
        }

        editCurrent(event: JQueryEventObject): void {
            preventDefault(event);
            let index: number = this.getIndex();
            if (index < 0)
                return;
            if (this._parentScope.isEditPatternMode)
                this._parentScope.isEditPatternMode = false;
            if (this.$scope.isCurrent) {
                if (this.$scope.showEditControl !== true)
                    this.$scope.showEditControl = true;
            } else
                this.$scope.isCurrent = true;
        }

        removeCurrent(event: JQueryEventObject): void {
            preventDefault(event);
            if (!this.$scope.canDelete)
                return;
            let index: number = this.getIndex();
            if (index < 0)
                return;
            if (index === 0)
                this._parentScope.testStrings.shift();
            else if (index === this._parentScope.testStrings.length - 1)
                this._parentScope.testStrings.pop();
            else
                this._parentScope.testStrings.splice(index, 1);
            if (this._parentScope.testStrings.length == 1)
                this._parentScope.testStrings[0].testString.$scope.canDelete = false;
            this.$scope.canDelete = false;
            this._parentScope = undefined;
        }

        private onIsCurrentChanged(): any {
            let testStrings: ITestStringItemScope[] = TestStringItem.getParentArray(this._parentScope);
            if (sys.isNil(this._parentScope)) {
                if (this.$scope.isCurrent !== false)
                    this.$scope.isCurrent = false;
                return;
            }
            if (this.$scope.isCurrent) {
                testStrings.forEach((value: ITestStringItemScope) => {
                    if (value.isCurrent && value.testString._id !== this._id)
                        value.isCurrent = false;
                });
                if (!this._parentScope.isEditPatternMode) {
                    if (this.$scope.showEditControl !== true)
                        this.$scope.showEditControl = true;
                    return;
                }
            } else {
                let current: ITestStringItemScope[] = testStrings.filter((value: ITestStringItemScope) => value.isCurrent);
                if (current.length == 0) {
                    if (!this._parentScope.isEditPatternMode) {
                        this.$scope.isCurrent = true;
                        if (this.$scope.showEditControl !== true)
                            this.$scope.showEditControl = true;
                        return;
                    }
                } else {
                    for (let i: number = 1; i < current.length; i++)
                        current[i].isCurrent = false;
                }
            }
            if (this.$scope.showEditControl !== false)
                this.$scope.showEditControl = false;
            if (this.$scope.showReplacementControl !== false)
                this.$scope.showReplacementControl = false;
        }

        private onShowEditControlChanged(): void {
            if (this.$scope.showEditControl === true) {
                if (this._parentScope.isEditPatternMode)
                    this.$scope.showEditControl = false;
                else {
                    if (this.$scope.isCurrent === true) {
                        if (this.$scope.showReplacementControl !== this._isReplaceMode)
                            this.$scope.showReplacementControl = this._isReplaceMode;
                    } else
                        this.$scope.isCurrent = true;
                }
            } else if (this.$scope.showReplacementControl !== false)
                this.$scope.showReplacementControl = false;
        }

        static push(parentScope: IRegexTesterScope, log: ng.ILogService, $q: ng.IQService): TestStringItem {
            let item: TestStringItem = new TestStringItem(<ITestStringItemScope>parentScope.$new(), log, $q);
            item._parentScope = parentScope;
            let testStrings: ITestStringItemScope[] = TestStringItem.getParentArray(parentScope);
            testStrings.push(item.$scope);
            if (testStrings.length == 2)
                testStrings[0].testString.$scope.canDelete = true;
            return item;
        }

        static startExec(parentScope: IRegexTesterScope, regExp: RegExp | undefined, patternText: string, flags: string): void {
            if (sys.isNil(regExp)) {
                TestStringItem.getParentArray(parentScope).forEach(($scope: ITestStringItemScope) => { $scope.testString.setNotEvaluated(); });
                return;
            }
            TestStringItem.getParentArray(parentScope).forEach(($scope: ITestStringItemScope, index: number) => { $scope.testString.start(regExp, index, patternText, flags); });
        }

        private start(regExp: RegExp, index: number, patternText: string, flags: string): void {
            let item: TestStringItem = this;
            let regexTester: RegexTesterController = this._parentScope.regexTester;
            let inputText: string = this.$scope.inputText;
            let replacementText: string = this.$scope.replacementText;
            let $scope: ITestStringItemScope = this.$scope;
            this.$q<RegExpExecArray | string | null | undefined>((resolve: ng.IQResolveReject<RegExpExecArray | string | null | undefined>, reject: ng.IQResolveReject<any>) => {
                if (sys.isNil(item._parentScope) || patternText !== regexTester.patternText || flags !== regexTester.flags || inputText !== $scope.inputText || replacementText !== $scope.replacementText)
                    resolve(undefined);
                else {
                    let result: RegExpExecArray | string | null;
                    try {
                        if ($scope.isReplaceMode)
                            result = inputText.replace(regExp, replacementText);
                        else
                            result = regExp.exec(inputText);
                    }
                    catch (e) {
                        reject(e);
                        return;
                    }
                    if (sys.isNil(result) && $scope.isReplaceMode)
                        reject("Failed to evaluate regular expression.");
                    else
                        resolve(result);
                }
            }).then((result: RegExpExecArray | string | null | undefined) => {
                if (sys.isNil(item._parentScope) || patternText !== regexTester.patternText || flags !== regexTester.flags || inputText !== $scope.inputText || replacementText !== $scope.replacementText)
                    return;
                if (typeof result === "string")
                    item.setReplaceResult(inputText, result);
                else
                    item.setExecResult(result);
            }, (reason: any) => {
                if (sys.isNil(item._parentScope) || patternText !== regexTester.patternText || flags !== regexTester.flags || inputText !== $scope.inputText || replacementText !== $scope.replacementText)
                    return;
                $scope.execResult = { isVisible: false, success: false, index: -1, groups: [] };
                $scope.replaceResult = {
                    sourceLength: 0, resultText: "", resultLength: 0, isVisible: false, isChanged: false, firstDifferentCharIndex: 0,
                    sourceLines: [{ length: 0, lineEnding: "", lineNumber: 1, startIndex: 0, text: "", selectForCompare: preventDefault }],
                    replacedLines: [{ length: 0, lineEnding: "", lineNumber: 1, startIndex: 0, text: "", selectForCompare: preventDefault }]
                }
                $scope.lineCompare = { areEqual: true, cssClass: [], differingReplace: "", differingSource: "", firstDifferentCharIndex: 0, isVisible: false, leadingEqualText: "", replaceLineNumber: 1, sourceLineNumber: 1, startEqual: true };
                reason = sys.asErrorResult((sys.isNil(reason)) ? "" : reason);
                if (item._parentScope.pattern.isValid) {
                    item._parentScope.pattern.isValid = false;
                    if (typeof reason === "string")
                        item._parentScope.pattern = {
                            displayText: item._parentScope.pattern.displayText, errorMessage: (reason.trim().length == 0) ? "An unknown error has occurred while evaluating expression " + (index + 1) + "." : "Error evaluating expression " + (index + 1) + ": " + reason, isValid: false, errorDetail: "", hasErrorDetail: false
                        };
                    else {
                        let message: string = sys.asString(reason.message, "").trim();
                        let detail: string = "";
                        if (message.length == 0 && (message = sys.asString(reason.name, "").trim()).length == 0)
                            item._parentScope.pattern = { displayText: item._parentScope.pattern.displayText, errorMessage: "An unknown error has occurred while evaluating expression " + (index + 1) + ".", isValid: false, errorDetail: angular.toJson(reason), hasErrorDetail: true };
                        else if (sys.isNil((<sys.IErrorLike>reason).data))
                            item._parentScope.pattern = { displayText: item._parentScope.pattern.displayText, errorMessage: "Error evaluating expression " + (index + 1) + ": " + message, isValid: false, errorDetail: "", hasErrorDetail: false };
                        else
                            item._parentScope.pattern = { displayText: item._parentScope.pattern.displayText, errorMessage: "Error evaluating expression " + (index + 1) + ": " + message, isValid: false, errorDetail: angular.toJson((<sys.IErrorLike>reason).data), hasErrorDetail: true };
                    }
                } else if (typeof reason === "string")
                    $scope.resultMessage = { type: ResultMessageType.error, message: reason, cssClass: [], hasDetail: false, detailedMessage: "" };
                else {
                    let message: string = sys.asString(reason.message, "").trim();
                    let detail: string = "";
                    if (message.length == 0 && (message = sys.asString(reason.name, "").trim()).length == 0)
                        $scope.resultMessage = { type: ResultMessageType.error, message: "An unknown error has occurred.", cssClass: [], detailedMessage: angular.toJson(reason), hasDetail: true };
                    else if (sys.isNil((<sys.IErrorLike>reason).data))
                        $scope.resultMessage = { type: ResultMessageType.error, message: message, cssClass: [], detailedMessage: "", hasDetail: false };
                    else
                        $scope.resultMessage = { type: ResultMessageType.error, message: message, cssClass: [], detailedMessage: angular.toJson((<sys.IErrorLike>reason).data), hasDetail: true };
                }
            });
        }

        private setExecResult(result: RegExpExecArray | null): any {
            this.$scope.replaceResult = {
                sourceLength: 0, resultText: "", resultLength: 0, isVisible: false, isChanged: false, firstDifferentCharIndex: 0,
                sourceLines: [{ length: 0, lineEnding: "", lineNumber: 1, startIndex: 0, text: "", selectForCompare: preventDefault }],
                replacedLines: [{ length: 0, lineEnding: "", lineNumber: 1, startIndex: 0, text: "", selectForCompare: preventDefault }]
            }
            this.$scope.lineCompare = { areEqual: true, cssClass: [], differingReplace: "", differingSource: "", firstDifferentCharIndex: 0, isVisible: false, leadingEqualText: "", replaceLineNumber: 1, sourceLineNumber: 1, startEqual: true };
            if (sys.isNil(result))
                this.$scope.execResult = { isVisible: true, success: false, index: -1, groups: [] };
            else
                this.$scope.execResult = {
                    isVisible: true, success: true, index: result.index, groups: result.map((value: string) => {
                        if (sys.isNil(value))
                            return { isMatch: false, length: 0, text: "" };
                        return { isMatch: true, length: value.length, text: value };
                    })
                };
        }

        private setReplaceResult(inputText: string, result: string): any {
            this.$scope.execResult = { isVisible: false, success: false, index: -1, groups: [] };
            let i: number = -1;
            while (++i < inputText.length && i < result.length) {
                if (inputText.substr(i, 1) !== result.substr(i, 1))
                    break;
            }
            this.$scope.replaceResult = {
                isVisible: true,
                sourceLength: inputText.length,
                resultText: result,
                resultLength: resizeBy.length,
                isChanged: result !== inputText,
                firstDifferentCharIndex: i,
                sourceLines: [],
                replacedLines: []
            };
            let index: number = 0;
            let m: RegExpExecArray = LINE_WITH_ENDING_REGEX.exec(inputText);
            let line: IRegexReplaceLine;
            let item: TestStringItem = this;
            if (this.$scope.replaceResult.isChanged) {
                if (this.$scope.resultMessage.type !== ResultMessageType.none)
                    this.$scope.resultMessage = { type: ResultMessageType.none, message: "", cssClass: [], hasDetail: false, detailedMessage: "" };
                while (!sys.isNil(m)) {
                    let nl: string = angular.toJson(m[2]);
                    if (sys.isNil(m[1])) {
                        line = {
                            length: 0, lineEnding: nl.substr(1, nl.length - 2), lineNumber: this.$scope.replaceResult.sourceLines.length + 1, startIndex: index, text: "",
                            selectForCompare: preventDefault
                        };
                    }
                    else
                        line = {
                            length: m[0].length, lineEnding: nl.substr(1, nl.length - 2), lineNumber: this.$scope.replaceResult.sourceLines.length + 1, startIndex: index, text: m[1],
                            selectForCompare: preventDefault
                        };
                    if (line.lineNumber > 1)
                        line.selectForCompare = (event: JQueryEventObject) => {
                            item.selectSourceForCompare(line);
                            return preventDefault(event);
                        }
                    this.$scope.replaceResult.sourceLines.push(line);
                    index += m[0].length;
                    inputText = inputText.substr(m[0].length);
                }
                if (inputText.length > 0 || this.$scope.replaceResult.sourceLines.length == 0) {
                    line = {
                        length: inputText.length, lineEnding: "", lineNumber: this.$scope.replaceResult.sourceLines.length + 1, startIndex: index, text: inputText,
                        selectForCompare: preventDefault
                    };
                    if (line.lineNumber > 1)
                        line.selectForCompare = (event: JQueryEventObject) => {
                            item.selectSourceForCompare(line);
                            return preventDefault(event);
                        }
                    this.$scope.replaceResult.sourceLines.push(line);
                }
                index = 0;
                m = LINE_WITH_ENDING_REGEX.exec(result);
                while (!sys.isNil(m)) {
                    let nl: string = angular.toJson(m[2]);
                    if (sys.isNil(m[1])) {
                        line = {
                            length: 0, lineEnding: nl.substr(1, nl.length - 2), lineNumber: this.$scope.replaceResult.replacedLines.length + 1, startIndex: index, text: "",
                            selectForCompare: preventDefault
                        };
                    }
                    else
                        line = {
                            length: m[0].length, lineEnding: nl.substr(1, nl.length - 2), lineNumber: this.$scope.replaceResult.replacedLines.length + 1, startIndex: index, text: m[1],
                            selectForCompare: preventDefault
                        };
                    if (line.lineNumber > 1)
                        line.selectForCompare = (event: JQueryEventObject) => {
                            item.selectReplacedForCompare(line);
                            return preventDefault(event);
                        }
                    this. $scope.replaceResult.replacedLines.push(line);
                    index += m[0].length;
                    inputText = inputText.substr(m[0].length);
                }
                if (inputText.length > 0 || this.$scope.replaceResult.sourceLines.length == 0) {
                    line = {
                        length: inputText.length, lineEnding: "", lineNumber: this.$scope.replaceResult.replacedLines.length + 1, startIndex: index, text: inputText,
                        selectForCompare: preventDefault
                    };
                    if (line.lineNumber > 1)
                        line.selectForCompare = (event: JQueryEventObject) => {
                            item.selectReplacedForCompare(line);
                            return preventDefault(event);
                        }
                    this.$scope.replaceResult.replacedLines.push(line);
                }
            } else {
                this.$scope.resultMessage = { type: ResultMessageType.warning, cssClass: [], message: "No text was replaced", hasDetail: false, detailedMessage: "" };
                while (!sys.isNil(m)) {
                    let nl: string = angular.toJson(m[2]);
                    if (sys.isNil(m[1]))
                        line = {
                            length: 0, lineEnding: nl.substr(1, nl.length - 2), lineNumber: this.$scope.replaceResult.sourceLines.length + 1, startIndex: index, text: "",
                            selectForCompare: preventDefault
                        };
                    else
                        line = {
                            length: m[0].length, lineEnding: nl.substr(1, nl.length - 2), lineNumber: this.$scope.replaceResult.sourceLines.length + 1, startIndex: index, text: m[1],
                            selectForCompare: preventDefault
                        };
                    if (line.lineNumber > 1)
                        line.selectForCompare = (event: JQueryEventObject) => {
                            item.selectSourceForCompare(line);
                            return preventDefault(event);
                        }
                    this.$scope.replaceResult.sourceLines.push(line);
                    line = {
                        length: line.length, lineEnding: line.lineEnding, lineNumber: line.lineNumber, startIndex: index, text: line.text,
                        selectForCompare: preventDefault
                    };
                    if (line.lineNumber > 1)
                        line.selectForCompare = (event: JQueryEventObject) => {
                            item.selectReplacedForCompare(line);
                            return preventDefault(event);
                        }
                    this.$scope.replaceResult.replacedLines.push(line);
                    index += m[0].length;
                    inputText = inputText.substr(m[0].length);
                }
                if (inputText.length > 0 || this.$scope.replaceResult.sourceLines.length == 0) {
                    line = {
                        length: inputText.length, lineEnding: "", lineNumber: this.$scope.replaceResult.sourceLines.length + 1, startIndex: index, text: inputText,
                        selectForCompare: preventDefault
                    };
                    if (line.lineNumber > 1)
                        line.selectForCompare = (event: JQueryEventObject) => {
                            item.selectSourceForCompare(line);
                            return preventDefault(event);
                        }
                    this.$scope.replaceResult.sourceLines.push(line);
                    line = {
                        length: line.length, lineEnding: line.lineEnding, lineNumber: line.lineNumber, startIndex: index, text: line.text,
                        selectForCompare: preventDefault
                    };
                    if (line.lineNumber > 1)
                        line.selectForCompare = (event: JQueryEventObject) => {
                            item.selectReplacedForCompare(line);
                            return preventDefault(event);
                        }
                    this.$scope.replaceResult.replacedLines.push(line);
                }
            }
            this.selectForCompare(this.$scope.replaceResult.sourceLines[0], this.$scope.replaceResult.replacedLines[0]);
        }

        private selectReplacedForCompare(resultLine: IRegexReplaceLine): any {
            this.selectForCompare(this.$scope.replaceResult.sourceLines[this.$scope.lineCompare.sourceLineNumber - 1], resultLine);
        }

        private selectSourceForCompare(sourceLine: IRegexReplaceLine): any {
            this.selectForCompare(sourceLine, this.$scope.replaceResult.replacedLines[this.$scope.lineCompare.replaceLineNumber - 1]);
        }

        private selectForCompare(sourceLine: IRegexReplaceLine, resultLine: IRegexReplaceLine): any {
            if (sourceLine.text === resultLine.text) {
                if (sourceLine.lineEnding === resultLine.lineEnding)
                    this.$scope.lineCompare = {
                        areEqual: true, cssClass: [], differingReplace: "", differingSource: "",
                        firstDifferentCharIndex: (sourceLine.lineEnding.length == 0) ? sourceLine.length : sourceLine.length + sourceLine.lineEnding.length / 2, isVisible: true,
                        leadingEqualText: sourceLine.text, replaceLineNumber: resultLine.lineNumber, sourceLineNumber: sourceLine.lineNumber, startEqual: true
                    };
                else
                    this.$scope.lineCompare = {
                        areEqual: false, cssClass: [], differingReplace: "", differingSource: "",
                        firstDifferentCharIndex: sourceLine.length, isVisible: true,
                        leadingEqualText: sourceLine.text, replaceLineNumber: resultLine.lineNumber, sourceLineNumber: sourceLine.lineNumber, startEqual: true
                    };
            } else {
                let index: number = -1;
                while (++index < sourceLine.length && index < resultLine.length) {
                    if (sourceLine.text.substr(index, 1) !== resultLine.text.substr(index, 1))
                        break;
                }
                this.$scope.lineCompare = {
                    areEqual: false, cssClass: [], differingReplace: (index < resultLine.text.length) ? resultLine.text.substr(index) : "", differingSource: (index < sourceLine.text.length) ? sourceLine.text.substr(index) : "",
                    firstDifferentCharIndex: index, isVisible: true,
                    leadingEqualText: sourceLine.text.substr(0, index), replaceLineNumber: resultLine.lineNumber, sourceLineNumber: sourceLine.lineNumber, startEqual: index > 0
                };
            }
        }

        setNotEvaluated(): void {
            this.$scope.resultMessage = { type: ResultMessageType.warning, message: "Not evaluated", cssClass: [], hasDetail: false, detailedMessage: "" };
            this.$scope.execResult = { isVisible: false, success: false, index: -1, groups: [] };
            this.$scope.replaceResult = {
                sourceLength: 0, resultText: "", resultLength: 0, isVisible: false, isChanged: false, firstDifferentCharIndex: 0,
                sourceLines: [{ length: 0, lineEnding: "", lineNumber: 1, startIndex: 0, text: "", selectForCompare: preventDefault }],
                replacedLines: [{ length: 0, lineEnding: "", lineNumber: 1, startIndex: 0, text: "", selectForCompare: preventDefault }]
            }
            this.$scope.lineCompare = { areEqual: true, cssClass: [], differingReplace: "", differingSource: "", firstDifferentCharIndex: 0, isVisible: false, leadingEqualText: "", replaceLineNumber: 1, sourceLineNumber: 1, startEqual: true };
        }
    }
    
    // #endregion

    // #region regexTesterController
    
    const PATTERN_FLAG_SYMBOLS: { [index: string]: string; } = { global: "g", ignoreCase: "i", multiline: "m", unicode: "u", sticky: "y" };
    const PATTERN_FLAG_NAMES: string[] = Object.getOwnPropertyNames(PATTERN_FLAG_SYMBOLS);

    interface IRegexTesterScope extends ng.IScope {
        regexTester: RegexTesterController;
        isEditPatternMode: boolean;
        patternIsMultiLine: boolean;
        multiLinePatternText: string;
        patternLineCount: number;
        singleLinePatternText: string;
        ignoreWhitespace: boolean;
        global: boolean;
        ignoreCase: boolean;
        multiline: boolean;
        sticky: boolean;
        unicode: boolean;
        testStrings: ITestStringItemScope[];
        pattern: {
            displayText: string;
            errorMessage: string;
            isValid: boolean;
            errorDetail: string;
            hasErrorDetail: boolean;
        }
    }

    class RegexTesterController implements ng.IController {
        private _flags: string = "";
        private _patternText: string = "";
        private _expression: RegExp | undefined;
        private _changeLevel: number = 0;
        private _patternRebuildReqd: boolean = false;

        get expression(): RegExp | undefined { return this._expression; }

        get flags(): string { return this._flags; }

        get patternText(): string { return this._patternText; }
        
        constructor(private $scope: IRegexTesterScope, private $q: ng.IQService, private $log: ng.ILogService) {
            $scope.regexTester = this;
            $scope.isEditPatternMode = true;
            $scope.ignoreWhitespace = false;
            $scope.patternIsMultiLine = false;
            $scope.singleLinePatternText = $scope.multiLinePatternText = this._patternText;
            $scope.patternLineCount = TEXTAREA_ROW_COUNT_DEFAULT;
            $scope.global = false;
            $scope.ignoreCase = false;
            $scope.multiline = false;
            $scope.sticky = false;
            $scope.unicode = false;
            $scope.pattern = { displayText: "", errorMessage: "Expression not parsed", isValid: false, errorDetail: "", hasErrorDetail: false };

            TestStringItem.push($scope, $log, $q);
            let controller: RegexTesterController = this;
            $scope.$watchGroup(PATTERN_FLAG_NAMES, () => { controller.onFlagsChanged(); });
            $scope.$watch("patternIsMultiLine", () => { controller.onPatternIsMultiLineChanged(); });
            $scope.$watch("ignoreWhitespace", () => { controller.onIgnoreWhitespaceChanged(); });
            $scope.$watch("multiLinePatternText", () => { controller.onMultiLinePatternTextChanged(); });
            $scope.$watch("singleLinePatternText", () => { controller.onSingleLinePatternTextChanged(); });
        }

        private onSingleLinePatternTextChanged(): any {
            if (this.$scope.patternIsMultiLine)
                return;
            this._changeLevel++;
            try {
                let s: string = (this.$scope.ignoreWhitespace) ? sys.asString(this.$scope.singleLinePatternText, "").replace(WHITESPACE_REGEX, "") : sys.asString(this.$scope.singleLinePatternText, "");
                if (s !== this._patternText) {
                    this._patternText = s;
                    this._patternRebuildReqd = true;
                }
            } finally { this._changeLevel--; }
            if (this._changeLevel == 0 && this._patternRebuildReqd)
                this.startPatternRebuild();
        }

        private onMultiLinePatternTextChanged(): void {
            if (!this.$scope.patternIsMultiLine)
                return;
            this._changeLevel++;
            try {
                let s: string = sys.asString(this.$scope.multiLinePatternText, "").replace(WHITESPACE_REGEX, "");
                if (s !== this._patternText) {
                    this._patternText = s;
                    this._patternRebuildReqd = true;
                }
            } finally { this._changeLevel--; }
            if (this._changeLevel == 0 && this._patternRebuildReqd)
                this.startPatternRebuild();
        }

        private onIgnoreWhitespaceChanged(): void {
            if (!this.$scope.ignoreWhitespace)
                return;
            this._changeLevel++;
            try {
                let s: string = sys.asString(this.$scope.singleLinePatternText, "").replace(WHITESPACE_REGEX, "");
                this.$scope.patternIsMultiLine = false;
                if (s !== this.$scope.singleLinePatternText)
                    this.$scope.singleLinePatternText = s;
            } finally { this._changeLevel--; }
            if (this._changeLevel == 0 && this._patternRebuildReqd)
                this.startPatternRebuild();
        }

        private onPatternIsMultiLineChanged(): void {
            this._changeLevel++;
            try {
                if (this.$scope.patternIsMultiLine) {
                    if (this.$scope.multiLinePatternText !== this.$scope.singleLinePatternText)
                        this.$scope.multiLinePatternText = this.$scope.singleLinePatternText;
                } else {
                    let s: string = sys.asString(this.$scope.multiLinePatternText, "").replace(NEWLINE_REGEX, "");
                    if (s !== this.$scope.singleLinePatternText)
                        this.$scope.singleLinePatternText = s;
                }
            } finally { this._changeLevel--; }
            if (this._changeLevel == 0 && this._patternRebuildReqd)
                this.startPatternRebuild();
        }

        private onFlagsChanged(): void {
            this._changeLevel++;
            try {
                let flags: string = (this.$scope.ignoreCase) ? "i" : "";
                if (this.$scope.global)
                    flags += "g";
                if (this.$scope.multiline)
                    flags += "m";
                if (this.$scope.unicode)
                    flags += "u";
                if (this.$scope.sticky)
                    flags += "y";
                if (flags !== this._flags) {
                    this.$scope.flags = this._flags = flags;
                    this._patternRebuildReqd = true;
                }
            } finally { this._changeLevel--; }
            if (this._changeLevel == 0 && this._patternRebuildReqd)
                this.startPatternRebuild();
        }

        editPatternText(event: JQueryEventObject) {
            if (this.$scope.isEditPatternMode !== true) {
                this.$scope.isEditPatternMode = true;
                this.$scope.testStrings.forEach((value: ITestStringItemScope) => {
                    value.showEditControl = false;
                })
            }
            preventDefault(event);
        }

        incrementPatternLineCount(event: JQueryEventObject) {

            preventDefault(event);
        }

        decrementPatternLineCount(event: JQueryEventObject) {

            preventDefault(event);
        }

        $doCheck(): void { }

        private startPatternRebuild(): void {
            let patternText: string = this._patternText;
            let flags: string = this._flags;
            this._patternRebuildReqd = false;
            let expression: RegExp | undefined = this._expression;
            let controller: RegexTesterController = this;
            this.$q<RegExp | undefined>((resolve: ng.IQResolveReject<RegExp | undefined>, reject: ng.IQResolveReject<any>) => {
                if (patternText !== controller._patternText || flags !== controller._flags)
                    resolve(undefined);
                else {
                    let re: RegExp;
                    try { re = new RegExp(patternText, flags); }
                    catch (e) {
                        reject(e);
                        return;
                    }
                    if (sys.isNil(re))
                        reject("Failed to parse regular expression.");
                    else
                        resolve(re);
                }
            }).then((result: RegExp) => {
                if (typeof result === "undefined" || patternText !== controller._patternText || flags !== controller._flags)
                    return;
                controller._expression = result;
                controller.$scope.pattern = { displayText: result.toString(), errorMessage: "", isValid: true, errorDetail: "", hasErrorDetail: false };
                TestStringItem.startExec(controller.$scope, result, patternText, flags)
            }, (reason: any) => {
                if (patternText !== controller._patternText || flags !== controller._flags)
                    return;
                let nodes: string[] = patternText.split("\\\\");
                if (nodes[nodes.length - 1].endsWith("\\"))
                    patternText += "\\";
                let displayText: string = "/" + patternText.split("\\/").map((v: string) => v.replace("/", "\\/")).join("\\/") + "/" + flags;
                reason = sys.asErrorResult((sys.isNil(reason)) ? "" : reason);
                if (typeof reason === "string")
                    controller.$scope.pattern = { displayText: displayText, errorMessage: (reason.trim().length == 0) ? "An unknown error has occurred." : reason, isValid: false, errorDetail: "", hasErrorDetail: false };
                else {
                    let message: string = sys.asString(reason.message, "").trim();
                    let detail: string = "";
                    if (message.length == 0 && (message = sys.asString(reason.name, "").trim()).length == 0)
                        controller.$scope.pattern = { displayText: displayText, errorMessage: "An unknown error has occurred.", isValid: false, errorDetail: angular.toJson(reason), hasErrorDetail: true };
                    else if (sys.isNil((<sys.IErrorLike>reason).data))
                        controller.$scope.pattern = { displayText: displayText, errorMessage: message, isValid: false, errorDetail: "", hasErrorDetail: false };
                    else
                        controller.$scope.pattern = { displayText: displayText, errorMessage: message, isValid: false, errorDetail: angular.toJson((<sys.IErrorLike>reason).data), hasErrorDetail: true };
                }
                if (typeof expression !== "undefined")
                    TestStringItem.startExec(controller.$scope, undefined, patternText, flags)
            });
        }
    }
    app.mainModule.controller("regexTesterController", ["$scope", "$q", "$log", RegexTesterController]);

    // #endregion
}
