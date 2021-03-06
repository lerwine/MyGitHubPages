/// <reference path="../Scripts/typings/jquery/jquery.d.ts"/>
/// <reference path="../Scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="../Scripts/typings/angularjs/angular-route.d.ts"/>
/// <reference path="../Scripts/typings/bootstrap/index.d.ts"/>
/// <reference path="sys.ts"/>
/// <reference path="app.ts"/>

module regexTester {
    // #region Constants

    const DIRECTIVENAME_REGEXTESTER: string = "regexTester";
    const CONTROLLER_NAME_REGEXOPTIONS = "regexOptions";
    const CONTROLLER_NAME_REGEXPATTERN = "regexPattern";
    const CONTROLLER_NAME_TESTDATAITEM = "testDataItem";
    const DIRECTIVENAME_REGEXPATTERN = "regexPattern";
    const DIRECTIVENAME_TESTDATAITEM = "testDataItem";
    const DIRECTIVENAME_ERRORMESSAGE = "errorMessage";

    const CONTROL_ID_PATTERNOPTIONSMODAL = "patternOptionsModal";
    const CONTROL_ID_MULTILINEPATTERNTEXTBOX = "multiLinePatternTextBox";
    const CONTROL_ID_SINGLELINEPATTERNTEXTBOX = "singleLinePatternTextBox";

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

    const PATTERN_FLAG_SYMBOLS: { [index: string]: string; } = { global: "g", ignoreCase: "i", multiLine: "m", unicode: "u", sticky: "y" };
    const PATTERN_FLAG_NAMES: string[] = Object.getOwnPropertyNames(PATTERN_FLAG_SYMBOLS);

    const DIRECTIVE_TEMPLATE_PATH = "Template/RegexTester/";

    const EVENT_NAME_EDIT_PATTERN_MODE_CHANGED: string = "editPatternModeChanged";
    const EVENT_NAME_PATTERN_TEXT_CHANGED: string = "patternTextChanged";
    const EVENT_NAME_REGEX_FLAGS_CHANGED = "regexFlagsChanged";
    const EVENT_NAME_IGNORE_WHITESPACE_CHANGED = "changeIgnoreWhitespace";
    const EVENT_NAME_RESET_REGEX_FLAGS = "resetRegexFlags";

    // #endregion

    // #region module functions

    function getDirectiveTemplatePath(directiveName: string) { return DIRECTIVE_TEMPLATE_PATH + directiveName + ".htm"; }

    function preventDefault(event: BaseJQueryEventObject | undefined): boolean {
        if (typeof event === "object" && event !== null) {
            if (!event.isDefaultPrevented())
                event.preventDefault();
            if (!event.isPropagationStopped())
                event.stopPropagation();
        }
        return false;
    }

    interface IClassRefAttributes {
        class?: string | string[];
        ngClass?: string | string[];
    }

    function getUniqueClassNames(attr: IClassRefAttributes): string[] {
        let classNames: string[];
        let s: string;
        if (typeof attr.class === "string")
            classNames = ((s = attr.class.trim()).length === 0) ? [] : s.split(WHITESPACE_REGEX);
        else {
            classNames = [];
            if (!sys.isNil(attr.class)) {
                attr.class.forEach((n: string) => {
                    if (typeof n === "string" && (s = n.trim()).length > 0)
                        classNames = classNames.concat(s.split(WHITESPACE_REGEX));
                });
            }
        }
        if (typeof attr.ngClass === "string") {
            if ((s = attr.ngClass.trim()).length == 0)
                return (classNames.length === 0) ? classNames : sys.unique(classNames);
            return sys.unique((classNames.length === 0) ? s.split(WHITESPACE_REGEX) : classNames.concat(s.split(WHITESPACE_REGEX)));
        }
        if (sys.isNil(attr.ngClass))
            return (classNames.length === 0) ? classNames : sys.unique(classNames);
        attr.ngClass.forEach((n: string) => {
            if (typeof n === "string" && (s = n.trim()).length > 0)
                classNames = classNames.concat(s.split(WHITESPACE_REGEX));
        });
        return sys.unique(classNames);
    }

    // #endregion

    // #region error-message directive
    
    interface IErrorMessageScope extends ng.IScope {
        errorMessage: ErrorMessageController;
        classNames: string[];
        error?: any;
        isVisible: boolean;
        message: string;
        hasDetails: boolean;
        details: string;
        hasName: boolean;
        name: string;
    }

    class ErrorMessageController implements ng.IController {
        constructor(private $scope: IErrorMessageScope, private $log: ng.ILogService) {
            $log.debug("ErrorMessageController.constructor");
        }
        
        private onErrorChanged(): void {
            if (sys.isNil(this.$scope.error)) {
                this.$scope.isVisible = this.$scope.hasDetails = this.$scope.hasName = false;
                this.$scope.message = this.$scope.name = this.$scope.details = "";
            } else {
                if (typeof this.$scope.error === "string") {
                    this.$scope.hasDetails = this.$scope.hasName = false;
                    this.$scope.name = this.$scope.details = "";
                    this.$scope.message = this.$scope.error;
                } else {
                    let value: any;
                    value = (<{ [key: string]: any; }>this.$scope.error).name;
                    this.$scope.name = (typeof value === "string") ? value.trim() : "";
                    this.$scope.hasName = this.$scope.name.length > 0;
                    value = (<{ [key: string]: any; }>this.$scope.error).message;
                    if (typeof value === "string" && (value = value.trim()).length > 0)
                        this.$scope.message = value;
                    else if (this.$scope.name.length > 0) {
                        this.$scope.message = this.$scope.name;
                        this.$scope.hasName = false;
                        this.$scope.name = "";
                    } else {
                        this.$scope.message = angular.toJson(this.$scope.error);
                        this.$scope.name = this.$scope.details = "";
                        this.$scope.hasName = this.$scope.hasDetails = false;
                        return;
                    }
                    value = (<{ [key: string]: any; }>this.$scope.error).data;
                    this.$scope.details = (sys.isNil(value)) ? "" : ((typeof value === "string") ? value.trim() : angular.toJson(value));
                    this.$scope.hasDetails = this.$scope.details.length > 0;
                }
                this.$scope.isVisible = true;
            }
        }

        $onInit(): void {
            this.$log.debug("ErrorMessageController.$onInit");
            let errorMessage: ErrorMessageController = this;
            this.$scope.$watch("error", () => errorMessage.onErrorChanged());
        }

        static registerDirective(module: ng.IModule): void {
            module.directive(DIRECTIVENAME_ERRORMESSAGE, () => <ng.IDirective>{
                controller: ["$scope", "$log", ErrorMessageController],
                controllerAs: DIRECTIVENAME_ERRORMESSAGE,
                link: (scope: IErrorMessageScope, element: JQuery, attr: ng.IAttributes) => {
                    scope.errorMessage.$log.debug(DIRECTIVENAME_ERRORMESSAGE + ".link");
                    scope.errorMessage.onErrorChanged();
                },
                restrict: "E",
                scope: { error: "=" },
                templateUrl: getDirectiveTemplatePath(DIRECTIVENAME_ERRORMESSAGE)
            });
        }
    }

    ErrorMessageController.registerDirective(app.mainModule);

    // #endregion

    // #region regexOptions controller

    interface IRegexOptionsScope extends ng.IScope {
        regexOptions: RegexOptionsController;
        flags: string;
        ignoreWhitespace: boolean;
        isDialogVisible: boolean;
    }

    class RegexOptionsController implements ng.IController {
        private _ignoreFlagChange: boolean = false;
        private _global: boolean = false;
        private _ignoreCase: boolean = false;
        private _multiline: boolean = false;
        private _sticky: boolean = false;
        private _unicode: boolean = false;
        private _ignoreWhitespace: boolean = false;

        get global(): boolean { return this._global; }
        set global(value: boolean) {
            if (this._global === (value === true))
                return;
            this._global = value;
            this.updateFlags();
        }

        get ignoreCase(): boolean { return this._ignoreCase; }
        set ignoreCase(value: boolean) {
            if (this._ignoreCase === (value === true))
                return;
            this._ignoreCase = value;
            this.updateFlags();
        }

        get multiline(): boolean { return this._multiline; }
        set multiline(value: boolean) {
            if (this._multiline === (value === true))
                return;
            this._multiline = value;
            this.updateFlags();
        }

        get sticky(): boolean { return this._sticky; }
        set sticky(value: boolean) {
            if (this._sticky === (value === true))
                return;
            this._sticky = value;
            this.updateFlags();
        }

        get unicode(): boolean { return this._unicode; }
        set unicode(value: boolean) {
            if (this._unicode === (value === true))
                return;
            this._unicode = value;
            this.updateFlags();
        }

        get ignoreWhitespace(): boolean { return this._ignoreWhitespace; }
        set ignoreWhitespace(value: boolean) {
            if (this._ignoreWhitespace === (value === true))
                return;
            this._ignoreWhitespace = value;
            this.$scope.$emit(EVENT_NAME_IGNORE_WHITESPACE_CHANGED, this._ignoreWhitespace);
        }

        constructor(private $scope: IRegexOptionsScope, private $log: ng.ILogService) {
            $log.debug("RegexOptionsController.constructor");
            let ctrl: RegexOptionsController = this;
            $scope.$on(EVENT_NAME_RESET_REGEX_FLAGS, (event: ng.IAngularEvent, flags: string, ignoreWhitespace?: boolean) => {
                ctrl._ignoreFlagChange = true;
                try {
                    if (typeof flags !== "string" || (flags = flags.trim()).length === 0)
                        ctrl._global = ctrl._ignoreCase = ctrl._multiline = ctrl._sticky = ctrl._unicode = false;
                    else {
                        ctrl._ignoreCase = flags.indexOf("i") > -1;
                        ctrl._global = flags.indexOf("g") > -1;
                        ctrl._multiline = flags.indexOf("m") > -1;
                        ctrl._sticky = flags.indexOf("y") > -1;
                        ctrl._unicode = flags.indexOf("u") > -1;
                    }
                    if (typeof ignoreWhitespace === "boolean")
                        ctrl._ignoreWhitespace = ignoreWhitespace;
                } finally { ctrl._ignoreFlagChange = false; }
            });
        }

        $onInit(): void { }

        updateFlags(): void {
            if (this._ignoreFlagChange)
                return;
            let flags: string = (this._ignoreCase) ? "i" : "";
            if (this._global)
                flags += "g";
            if (this._multiline)
                flags += "m";
            if (this._sticky)
                flags += "y";
            if (this._unicode)
                flags += "u";

            this.$scope.$emit(EVENT_NAME_REGEX_FLAGS_CHANGED, flags);
        }

        closeDialog(event?: BaseJQueryEventObject): void {
            preventDefault(event);
            RegexOptionsController.setDialogVisibility(false);
        }

        static setDialogVisibility(show: boolean) { $(CONTROL_ID_PATTERNOPTIONSMODAL).modal({ show: show }); }
    }
    
    app.mainModule.controller(CONTROLLER_NAME_REGEXOPTIONS, ["$scope", "$log", RegexOptionsController]);

    // #endregion
    
    // #region regexPattern controller
    
    interface IRegexPatternScope extends ng.IScope {
        ctrl: RegexPatternController;
    }

    class RegexPatternController implements ng.IController {
        private _isEditMode: boolean = false;
        private _textBoxLineCount: number = 1;
        private _ignoreWhitespace: boolean = false;
        private _flags: string = "";
        private _patternText: string = "";
        private _singleLinePatternText: string = "";
        private _multiLinePatternText: string = "";

        // #region Properties

        get isEditMode(): boolean { return this._isEditMode; }
        set isEditMode(value: boolean) {
            throw new Error("Property not implemented.");
        }

        get patternText(): string { return this._patternText; }

        get isMultiLine(): boolean { return this._textBoxLineCount > 1; }

        get showMultiLineTextBox(): boolean { return this._textBoxLineCount > 1 && this._isEditMode; }

        get showSingleLineTextBox(): boolean { return this._textBoxLineCount < 2 && this._isEditMode; }

        get textBoxLineCount(): number { return (this._textBoxLineCount > 1) ? this._textBoxLineCount : 2; }
        set textBoxLineCount(value: number) {
            if (typeof value !== "number" || isNaN(value) || value < 1)
                value = 1;
            else if (value > TEXTAREA_ROW_COUNT_MAX)
                value = TEXTAREA_ROW_COUNT_MAX;
            if (value === this._textBoxLineCount)
                return;
            this._textBoxLineCount = value;
            
                this._ignoreWhitespace = true;
            // TODO: Remove line breaks if value is 1
            // TODO: Set ignore whitespace if value > 1
            // TODO: Update pattern text
        }

        get ignoreWhitespace(): boolean { return this._ignoreWhitespace; }
        set ignoreWhitespace(value: boolean) {
            if (this._ignoreWhitespace === (value === true))
                return;
            this._ignoreWhitespace = value;
            if (!value)
                this._textBoxLineCount = 1;
            // TODO: Update pattern text
        }
        
        get flags(): string { return this._flags; }
        set flags(value: string) {
            if (typeof value !== "string")
                value = "";
            let isChanged: boolean = (value !== this._flags);
            this._flags = value;
            if (this.$scope.flags !== value)
                this.$scope.flags = value;
            if (isChanged)
                this.startParseRegex(this.patternText, this.flags);
        }
        
        // #endregion

        constructor(private $scope: IRegexPatternScope, private $q: ng.IQService, private $log: ng.ILogService) {
            $log.debug("RegexPatternController.constructor");
            $scope.isEditingPattern = true;
            let ctrl: RegexPatternController = this;
            $scope.$on(EVENT_NAME_EDIT_PATTERN_MODE_CHANGED, (event: ng.IAngularEvent, editPattern: boolean) => {
                $scope.isEditingPattern = editPattern === true;
            });
        }

        $onInit(): void {
            this.$log.debug("RegexPatternController.$onInit");
        }

        private startParseRegex(pattern: string, flags: string) {
            let controller: RegexPatternController = this;
            this.$q((resolve: ng.IQResolveReject<RegExp | undefined>, reject: ng.IQResolveReject<any>) => {
                if (controller.patternText !== pattern || controller.flags !== flags) {
                    resolve(undefined);
                    return;
                }
                let regexp: RegExp | undefined;
                try { regexp = new RegExp(pattern, flags); }
                catch (err) {
                    reject(err);
                    return;
                }
                if (sys.isNil(regexp))
                    reject("Could not parse pattern");
                else
                    resolve(regexp);
            }).then((promiseValue: RegExp | undefined) => {
                if (sys.isNil(promiseValue) || controller.patternText !== pattern || controller.flags !== flags)
                    return;
                if (!sys.isNil(controller.$scope.patternError))
                    controller.$scope.patternError = undefined;
                let patternDisplayText: string = promiseValue.toString();
                if (patternDisplayText !== controller.$scope.patternDisplayText) {
                    controller.$scope.patternDisplayText = patternDisplayText;
                    controller.$scope.regex = promiseValue;
                }
            }).catch((reason: any) => {
                if (controller.patternText !== pattern || controller.flags !== flags)
                    return;
                if (controller.$scope.regex !== null)
                    controller.$scope.regex = null;
                controller.$scope.patternError = (sys.isNil(reason)) ? "An unspecifed error has occurred." : reason;
                let index: number = pattern.indexOf("\\");
                let patternDisplayText: string;
                if (index < 0)
                    patternDisplayText = pattern.replace("/", "\\");
                else {
                    do {
                        if (index > 0)
                            patternDisplayText += pattern.substr(0, index).replace("/", "\\/");
                        if (index === pattern.length - 1) {
                            patternDisplayText += pattern + "\\";
                            pattern = "";
                            break;
                        }
                        patternDisplayText += pattern.substr(index, 2);
                        pattern = pattern.substr(index + 2);
                        index = pattern.indexOf("\\");
                    } while (index > -1);
                    if (pattern.length > 0)
                        patternDisplayText += pattern.replace("/", "\\/");
                }
                pattern = "/" + pattern + "/" + flags;
                if (patternDisplayText !== controller.$scope.patternDisplayText)
                    controller.$scope.patternDisplayText = patternDisplayText;
            });
        }

        openOptionsDialog(event?: BaseJQueryEventObject): void {
            preventDefault(event);
            RegexOptionsController.setDialogVisibility(true);
        }

        editPattern(event?: BaseJQueryEventObject): void {
            preventDefault(event);
            this.$scope.isEditingPattern = true;
            this.$scope.$emit(EVENT_NAME_EDIT_PATTERN_MODE_CHANGED, true);
        }

        addPatternRow(event?: BaseJQueryEventObject): void {
            preventDefault(event);
            //if (this.$scope.multiLineRowCount < TEXTAREA_ROW_COUNT_MAX && ++this.$scope.multiLineRowCount === 2)
            //    this.isMultiLineMode = true;
        }

        removePatternRow(event?: BaseJQueryEventObject): void {
            preventDefault(event);
            //if (this.$scope.multiLineRowCount > 1 && --this.$scope.multiLineRowCount == 1)
            //    this.isMultiLineMode = false;
        }

        private onIgnoreWhitespaceChanged(): void {
            if (this.ignoreWhitespace)
                return;
            //if (this.isMultiLineMode)
            //    this.isMultiLineMode = false;
            //else
            //    this.singleLinePatternText = this.singleLinePatternText.replace(WHITESPACE_REGEX, "");
        }

        private onIsMultiLineModeChanged(): void {
            if (this.isMultiLine) {
                if (this.$scope.multiLineRowCount === 1)
                    this.$scope.multiLineRowCount = TEXTAREA_ROW_COUNT_DEFAULT;
                this.ignoreWhitespace = true;
                this.$scope.patternTextBoxLabelId = CONTROL_ID_MULTILINEPATTERNTEXTBOX;
                //this.multiLinePatternText = this.singleLinePatternText;
                this.$scope.canRemovePatternRow = true;
                this.$scope.canAddPatternRow = this.$scope.multiLineRowCount < TEXTAREA_ROW_COUNT_MAX;
            } else {
                this.$scope.canRemovePatternRow = false;
                this.$scope.canAddPatternRow = true;
                this.$scope.patternTextBoxLabelId = CONTROL_ID_SINGLELINEPATTERNTEXTBOX;
                //this.singleLinePatternText = this.multiLinePatternText.replace((this.ignoreWhitespace) ? WHITESPACE_REGEX : NEWLINE_REGEX, "");
            }
        }
    }

    app.mainModule.controller(CONTROLLER_NAME_REGEXPATTERN, ["$scope", "$q", "$log", RegexPatternController]);

    // #endregion

    class InputTestData {
        private _isCurrent: boolean = false;
        private _previous: InputTestData | undefined;
        private _next: InputTestData | undefined;

        private constructor(private _controller: RegexTesterController) { }

        static addTo(controller: RegexTesterController): InputTestData {
            let target: InputTestData = new InputTestData(controller);

            if (sys.isNil(controller.$scope.testData) || controller.$scope.testData.length == 0)
                controller.$scope.testData = [target];
            else {
                let item: InputTestData = controller.$scope.testData[0];
                let lastItem: InputTestData = item;
                while (typeof lastItem._next !== "undefined")
                    lastItem = lastItem._next;
                (target._previous = lastItem)._next = target;

                while (typeof item._previous !== "undefined")
                    item = item._previous;
                controller.$scope.testData = [];
                do {
                    controller.$scope.testData.push(item);
                } while (typeof (item = item._next) !== "undefined");
                if (controller.$scope.testData.length > 1)
                    return target;
            }
            target._isCurrent = true;
            return target;
        }

        get showEditControls(): boolean { return this._isCurrent && !this._controller.$scope.isEditingPattern; }

        get isCurrent(): boolean { return this._isCurrent; }
        set isCurrent(value: boolean) {
            if (this._isCurrent === (value = value === true))
                return;

            if (value) {
                let item: InputTestData;
                for (item = this._next; typeof item !== "undefined"; item = item._next)
                    item._isCurrent = false;
                for (item = this._previous; typeof item !== "undefined"; item = item._previous)
                    item._isCurrent = false;
                this._isCurrent = true;
            } else
                this._isCurrent = false;
        }

        get canDelete(): boolean { return this._controller.$scope.testData.length > 1; }

        deleteCurrent(event: BaseJQueryEventObject): void {
            let item: InputTestData = this._previous;
            if (typeof item === "undefined") {
                if (typeof (item = this._next) === "undefined")
                    return;
                this._next = item._previous = undefined;
            } else {
                if (typeof (item._next = this._next) != "undefined") {
                    this._next._previous = this._previous;
                    this._next = undefined;
                }
                this._previous = undefined;
            }
            while (typeof item._previous !== "undefined")
                item = item._previous;
            if (this._isCurrent) {
                this._isCurrent = false;
                item._isCurrent = true;
            }
            this._controller.$scope.testData = [];
            do {
                this._controller.$scope.testData.push(item);
            } while (typeof (item = item._next) !== "undefined");
        }

        editText(event: BaseJQueryEventObject) {
            preventDefault(event);
            this.isCurrent = true;
            this._controller.isEditingPattern = false;
        }
    }

    // #region regexTester controller
    
    interface IRegexTesterScope extends ng.IScope {
        regex?: RegExp;
        testData: InputTestData[]
    }

    class RegexTesterController implements ng.IController {
        private _isEditingPattern: boolean = true;
        private _flags: string = '';
        private _patternText: string = '';

        get isEditingPattern(): boolean { return this._isEditingPattern; }
        set isEditingPattern(value: boolean) {
            if (this._isEditingPattern === (value = value === true))
                return;
            this._isEditingPattern = value;
            this.$scope.$broadcast(EVENT_NAME_EDIT_PATTERN_MODE_CHANGED, false);
        }

        get flags(): string { return this._flags; }
        set flags(value: string) {
            if (typeof value !== "string")
                value = "";
            if (this._flags === value)
                return;
            this._flags = value;
            this.$scope.$broadcast(EVENT_NAME_REGEX_FLAGS_CHANGED, false);
        }

        get patternText(): string { return this._patternText; }
        set patternText(value: string) {
            if (typeof value !== "string")
                value = "";
            if (this._patternText === value)
                return;
            this._patternText = value;
            this.$scope.$broadcast(EVENT_NAME_PATTERN_TEXT_CHANGED, false);
        }
        
        get regex(): RegExp | undefined { return this.$scope.regex; }
        
        constructor(public $scope: IRegexTesterScope, private $log: ng.ILogService) {
            $log.debug("RegexTesterController.constructor");
            let ctrl: RegexTesterController = this;
            $scope.$on(EVENT_NAME_EDIT_PATTERN_MODE_CHANGED, (event: ng.IAngularEvent, editPattern: boolean) => { ctrl.isEditingPattern = editPattern === true; });
            $scope.$on(EVENT_NAME_REGEX_FLAGS_CHANGED, (event: ng.IAngularEvent, value: string) => { ctrl.flags = value; });
            $scope.$on(EVENT_NAME_PATTERN_TEXT_CHANGED, (event: ng.IAngularEvent, value: string) => { ctrl.patternText = value; });
            InputTestData.addTo(this).isCurrent = true;
        }

        $onInit(): void { }

        addItem(event?: BaseJQueryEventObject) {
            preventDefault(event);
            InputTestData.addTo(this).isCurrent = true;
            this.isEditingPattern = false;
        }
    }

    app.mainModule.controller(DIRECTIVENAME_REGEXTESTER, ["$scope", "$log", RegexTesterController]);


    // #endregion
}
