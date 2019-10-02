/// <reference path="../Scripts/typings/jquery/jquery.d.ts"/>
/// <reference path="../Scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="../Scripts/typings/angularjs/angular-route.d.ts"/>
/// <reference path="../Scripts/typings/bootstrap/index.d.ts"/>
/// <reference path="sys.ts"/>
/// <reference path="app.ts"/>
var regexTester;
(function (regexTester) {
    // #region Constants
    const DIRECTIVENAME_REGEXTESTER = "regexTester";
    const CONTROLLER_NAME_REGEXOPTIONS = "regexOptions";
    const CONTROLLER_NAME_REGEXPATTERN = "regexPattern";
    const CONTROLLER_NAME_TESTDATAITEM = "testDataItem";
    const DIRECTIVENAME_REGEXPATTERN = "regexPattern";
    const DIRECTIVENAME_TESTDATAITEM = "testDataItem";
    const DIRECTIVENAME_ERRORMESSAGE = "errorMessage";
    const CONTROL_ID_PATTERNOPTIONSMODAL = "patternOptionsModal";
    const CONTROL_ID_MULTILINEPATTERNTEXTBOX = "multiLinePatternTextBox";
    const CONTROL_ID_SINGLELINEPATTERNTEXTBOX = "singleLinePatternTextBox";
    const CSS_CLASS_ALERT_WARNING = "alert-warning";
    const CSS_CLASS_ALERT_DANGER = "alert-danger";
    const CSS_CLASS_ALERT_SUCCESS = "alert-success";
    const CSS_CLASS_ALERT_SECONDARY = "alert-secondary";
    const CSS_CLASS_SMALL = "small";
    const CSS_CLASS_ROW = "row";
    const CSS_CLASS_NO_GUTTERS = "no-gutters";
    const CSS_CLASS_BORDER_DARK = "border-dark";
    const CSS_CLASS_TEXT_LIGHT = "text-light";
    const CSS_CLASS_BG_PRIMARY = "bg-primary";
    const CSS_CLASS_BORDER_SUCCESS = "border-success";
    const CSS_CLASS_BG_SUCCESS = "bg-success";
    const CSS_CLASS_BORDER_WARNING = "border-warning";
    const CSS_CLASS_BG_WARNING = "bg-warning";
    const CSS_CLASS_TEXT_DARK = "text-dark";
    const CSS_CLASS_BORDER_PRIMARY = "border-primary";
    const CSS_CLASS_NOWRAP = "flex-nowrap";
    const EVAL_RESULT_MSG_NOT_EVALUATED = "Not evaluated";
    const EVAL_RESULT_MSG_MATCH_NOT_FOUND = "Match not found";
    const IMG_SRC_EXPAND_DOWN = "./images/dave-gandy/thin-arrowheads-pointing-down.svg";
    const IMG_SRC_COLLAPSE_UP = "./images/dave-gandy/chevron-up.svg";
    const IMG_SRC_REPLACE = "./images/open-iconic/svg/loop.svg";
    const IMG_SRC_MATCH = "./images/open-iconic/svg/magnifying-glass.svg";
    const IMG_ALT_REPLACE = "Replace";
    const IMG_ALT_MATCH = "Match";
    const TEXTAREA_ROW_COUNT_MAX = 32;
    const TEXTAREA_ROW_COUNT_DEFAULT = 6;
    const WHITESPACE_REGEX = /[\s\r\n\p{C}]+/g;
    const NEWLINE_REGEX = /\r\n?|\n/g;
    const LINE_WITH_ENDING_REGEX = /^([^\r\n]+)?(\r\n?|\n)/g;
    const PATTERN_FLAG_SYMBOLS = { global: "g", ignoreCase: "i", multiLine: "m", unicode: "u", sticky: "y" };
    const PATTERN_FLAG_NAMES = Object.getOwnPropertyNames(PATTERN_FLAG_SYMBOLS);
    const DIRECTIVE_TEMPLATE_PATH = "Template/RegexTester/";
    const EVENT_NAME_EDIT_PATTERN_MODE_CHANGED = "editPatternModeChanged";
    const EVENT_NAME_PATTERN_TEXT_CHANGED = "patternTextChanged";
    const EVENT_NAME_REGEX_FLAGS_CHANGED = "regexFlagsChanged";
    const EVENT_NAME_IGNORE_WHITESPACE_CHANGED = "changeIgnoreWhitespace";
    const EVENT_NAME_RESET_REGEX_FLAGS = "resetRegexFlags";
    // #endregion
    // #region module functions
    function getDirectiveTemplatePath(directiveName) { return DIRECTIVE_TEMPLATE_PATH + directiveName + ".htm"; }
    function preventDefault(event) {
        if (typeof event === "object" && event !== null) {
            if (!event.isDefaultPrevented())
                event.preventDefault();
            if (!event.isPropagationStopped())
                event.stopPropagation();
        }
        return false;
    }
    function getUniqueClassNames(attr) {
        let classNames;
        let s;
        if (typeof attr.class === "string")
            classNames = ((s = attr.class.trim()).length === 0) ? [] : s.split(WHITESPACE_REGEX);
        else {
            classNames = [];
            if (!sys.isNil(attr.class)) {
                attr.class.forEach((n) => {
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
        attr.ngClass.forEach((n) => {
            if (typeof n === "string" && (s = n.trim()).length > 0)
                classNames = classNames.concat(s.split(WHITESPACE_REGEX));
        });
        return sys.unique(classNames);
    }
    class ErrorMessageController {
        constructor($scope, $log) {
            this.$scope = $scope;
            this.$log = $log;
            $log.debug("ErrorMessageController.constructor");
        }
        onErrorChanged() {
            if (sys.isNil(this.$scope.error)) {
                this.$scope.isVisible = this.$scope.hasDetails = this.$scope.hasName = false;
                this.$scope.message = this.$scope.name = this.$scope.details = "";
            }
            else {
                if (typeof this.$scope.error === "string") {
                    this.$scope.hasDetails = this.$scope.hasName = false;
                    this.$scope.name = this.$scope.details = "";
                    this.$scope.message = this.$scope.error;
                }
                else {
                    let value;
                    value = this.$scope.error.name;
                    this.$scope.name = (typeof value === "string") ? value.trim() : "";
                    this.$scope.hasName = this.$scope.name.length > 0;
                    value = this.$scope.error.message;
                    if (typeof value === "string" && (value = value.trim()).length > 0)
                        this.$scope.message = value;
                    else if (this.$scope.name.length > 0) {
                        this.$scope.message = this.$scope.name;
                        this.$scope.hasName = false;
                        this.$scope.name = "";
                    }
                    else {
                        this.$scope.message = angular.toJson(this.$scope.error);
                        this.$scope.name = this.$scope.details = "";
                        this.$scope.hasName = this.$scope.hasDetails = false;
                        return;
                    }
                    value = this.$scope.error.data;
                    this.$scope.details = (sys.isNil(value)) ? "" : ((typeof value === "string") ? value.trim() : angular.toJson(value));
                    this.$scope.hasDetails = this.$scope.details.length > 0;
                }
                this.$scope.isVisible = true;
            }
        }
        $onInit() {
            this.$log.debug("ErrorMessageController.$onInit");
            let errorMessage = this;
            this.$scope.$watch("error", () => errorMessage.onErrorChanged());
        }
        static registerDirective(module) {
            module.directive(DIRECTIVENAME_ERRORMESSAGE, () => ({
                controller: ["$scope", "$log", ErrorMessageController],
                controllerAs: DIRECTIVENAME_ERRORMESSAGE,
                link: (scope, element, attr) => {
                    scope.errorMessage.$log.debug(DIRECTIVENAME_ERRORMESSAGE + ".link");
                    scope.errorMessage.onErrorChanged();
                },
                restrict: "E",
                scope: { error: "=" },
                templateUrl: getDirectiveTemplatePath(DIRECTIVENAME_ERRORMESSAGE)
            }));
        }
    }
    ErrorMessageController.registerDirective(app.mainModule);
    class RegexOptionsController {
        constructor($scope, $log) {
            this.$scope = $scope;
            this.$log = $log;
            this._ignoreFlagChange = false;
            this._global = false;
            this._ignoreCase = false;
            this._multiline = false;
            this._sticky = false;
            this._unicode = false;
            this._ignoreWhitespace = false;
            $log.debug("RegexOptionsController.constructor");
            let ctrl = this;
            $scope.$on(EVENT_NAME_RESET_REGEX_FLAGS, (event, flags, ignoreWhitespace) => {
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
                }
                finally {
                    ctrl._ignoreFlagChange = false;
                }
            });
        }
        get global() { return this._global; }
        set global(value) {
            if (this._global === (value === true))
                return;
            this._global = value;
            this.updateFlags();
        }
        get ignoreCase() { return this._ignoreCase; }
        set ignoreCase(value) {
            if (this._ignoreCase === (value === true))
                return;
            this._ignoreCase = value;
            this.updateFlags();
        }
        get multiline() { return this._multiline; }
        set multiline(value) {
            if (this._multiline === (value === true))
                return;
            this._multiline = value;
            this.updateFlags();
        }
        get sticky() { return this._sticky; }
        set sticky(value) {
            if (this._sticky === (value === true))
                return;
            this._sticky = value;
            this.updateFlags();
        }
        get unicode() { return this._unicode; }
        set unicode(value) {
            if (this._unicode === (value === true))
                return;
            this._unicode = value;
            this.updateFlags();
        }
        get ignoreWhitespace() { return this._ignoreWhitespace; }
        set ignoreWhitespace(value) {
            if (this._ignoreWhitespace === (value === true))
                return;
            this._ignoreWhitespace = value;
            this.$scope.$emit(EVENT_NAME_IGNORE_WHITESPACE_CHANGED, this._ignoreWhitespace);
        }
        $onInit() { }
        updateFlags() {
            if (this._ignoreFlagChange)
                return;
            let flags = (this._ignoreCase) ? "i" : "";
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
        closeDialog(event) {
            preventDefault(event);
            RegexOptionsController.setDialogVisibility(false);
        }
        static setDialogVisibility(show) { $(CONTROL_ID_PATTERNOPTIONSMODAL).modal({ show: show }); }
    }
    app.mainModule.controller(CONTROLLER_NAME_REGEXOPTIONS, ["$scope", "$log", RegexOptionsController]);
    class RegexPatternController {
        // #endregion
        constructor($scope, $q, $log) {
            this.$scope = $scope;
            this.$q = $q;
            this.$log = $log;
            this._isEditMode = false;
            this._textBoxLineCount = 1;
            this._ignoreWhitespace = false;
            this._flags = "";
            this._patternText = "";
            this._singleLinePatternText = "";
            this._multiLinePatternText = "";
            $log.debug("RegexPatternController.constructor");
            $scope.isEditingPattern = true;
            let ctrl = this;
            $scope.$on(EVENT_NAME_EDIT_PATTERN_MODE_CHANGED, (event, editPattern) => {
                $scope.isEditingPattern = editPattern === true;
            });
        }
        // #region Properties
        get isEditMode() { return this._isEditMode; }
        set isEditMode(value) {
            throw new Error("Property not implemented.");
        }
        get patternText() { return this._patternText; }
        get isMultiLine() { return this._textBoxLineCount > 1; }
        get showMultiLineTextBox() { return this._textBoxLineCount > 1 && this._isEditMode; }
        get showSingleLineTextBox() { return this._textBoxLineCount < 2 && this._isEditMode; }
        get textBoxLineCount() { return (this._textBoxLineCount > 1) ? this._textBoxLineCount : 2; }
        set textBoxLineCount(value) {
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
        get ignoreWhitespace() { return this._ignoreWhitespace; }
        set ignoreWhitespace(value) {
            if (this._ignoreWhitespace === (value === true))
                return;
            this._ignoreWhitespace = value;
            if (!value)
                this._textBoxLineCount = 1;
            // TODO: Update pattern text
        }
        get flags() { return this._flags; }
        set flags(value) {
            if (typeof value !== "string")
                value = "";
            let isChanged = (value !== this._flags);
            this._flags = value;
            if (this.$scope.flags !== value)
                this.$scope.flags = value;
            if (isChanged)
                this.startParseRegex(this.patternText, this.flags);
        }
        $onInit() {
            this.$log.debug("RegexPatternController.$onInit");
        }
        startParseRegex(pattern, flags) {
            let controller = this;
            this.$q((resolve, reject) => {
                if (controller.patternText !== pattern || controller.flags !== flags) {
                    resolve(undefined);
                    return;
                }
                let regexp;
                try {
                    regexp = new RegExp(pattern, flags);
                }
                catch (err) {
                    reject(err);
                    return;
                }
                if (sys.isNil(regexp))
                    reject("Could not parse pattern");
                else
                    resolve(regexp);
            }).then((promiseValue) => {
                if (sys.isNil(promiseValue) || controller.patternText !== pattern || controller.flags !== flags)
                    return;
                if (!sys.isNil(controller.$scope.patternError))
                    controller.$scope.patternError = undefined;
                let patternDisplayText = promiseValue.toString();
                if (patternDisplayText !== controller.$scope.patternDisplayText) {
                    controller.$scope.patternDisplayText = patternDisplayText;
                    controller.$scope.regex = promiseValue;
                }
            }).catch((reason) => {
                if (controller.patternText !== pattern || controller.flags !== flags)
                    return;
                if (controller.$scope.regex !== null)
                    controller.$scope.regex = null;
                controller.$scope.patternError = (sys.isNil(reason)) ? "An unspecifed error has occurred." : reason;
                let index = pattern.indexOf("\\");
                let patternDisplayText;
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
        openOptionsDialog(event) {
            preventDefault(event);
            RegexOptionsController.setDialogVisibility(true);
        }
        editPattern(event) {
            preventDefault(event);
            this.$scope.isEditingPattern = true;
            this.$scope.$emit(EVENT_NAME_EDIT_PATTERN_MODE_CHANGED, true);
        }
        addPatternRow(event) {
            preventDefault(event);
            //if (this.$scope.multiLineRowCount < TEXTAREA_ROW_COUNT_MAX && ++this.$scope.multiLineRowCount === 2)
            //    this.isMultiLineMode = true;
        }
        removePatternRow(event) {
            preventDefault(event);
            //if (this.$scope.multiLineRowCount > 1 && --this.$scope.multiLineRowCount == 1)
            //    this.isMultiLineMode = false;
        }
        onIgnoreWhitespaceChanged() {
            if (this.ignoreWhitespace)
                return;
            //if (this.isMultiLineMode)
            //    this.isMultiLineMode = false;
            //else
            //    this.singleLinePatternText = this.singleLinePatternText.replace(WHITESPACE_REGEX, "");
        }
        onIsMultiLineModeChanged() {
            if (this.isMultiLine) {
                if (this.$scope.multiLineRowCount === 1)
                    this.$scope.multiLineRowCount = TEXTAREA_ROW_COUNT_DEFAULT;
                this.ignoreWhitespace = true;
                this.$scope.patternTextBoxLabelId = CONTROL_ID_MULTILINEPATTERNTEXTBOX;
                //this.multiLinePatternText = this.singleLinePatternText;
                this.$scope.canRemovePatternRow = true;
                this.$scope.canAddPatternRow = this.$scope.multiLineRowCount < TEXTAREA_ROW_COUNT_MAX;
            }
            else {
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
        constructor(_controller) {
            this._controller = _controller;
            this._isCurrent = false;
        }
        static addTo(controller) {
            let target = new InputTestData(controller);
            if (sys.isNil(controller.$scope.testData) || controller.$scope.testData.length == 0)
                controller.$scope.testData = [target];
            else {
                let item = controller.$scope.testData[0];
                let lastItem = item;
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
        get showEditControls() { return this._isCurrent && !this._controller.$scope.isEditingPattern; }
        get isCurrent() { return this._isCurrent; }
        set isCurrent(value) {
            if (this._isCurrent === (value = value === true))
                return;
            if (value) {
                let item;
                for (item = this._next; typeof item !== "undefined"; item = item._next)
                    item._isCurrent = false;
                for (item = this._previous; typeof item !== "undefined"; item = item._previous)
                    item._isCurrent = false;
                this._isCurrent = true;
            }
            else
                this._isCurrent = false;
        }
        get canDelete() { return this._controller.$scope.testData.length > 1; }
        deleteCurrent(event) {
            let item = this._previous;
            if (typeof item === "undefined") {
                if (typeof (item = this._next) === "undefined")
                    return;
                this._next = item._previous = undefined;
            }
            else {
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
        editText(event) {
            preventDefault(event);
            this.isCurrent = true;
            this._controller.isEditingPattern = false;
        }
    }
    class RegexTesterController {
        constructor($scope, $log) {
            this.$scope = $scope;
            this.$log = $log;
            this._isEditingPattern = true;
            this._flags = '';
            this._patternText = '';
            $log.debug("RegexTesterController.constructor");
            let ctrl = this;
            $scope.$on(EVENT_NAME_EDIT_PATTERN_MODE_CHANGED, (event, editPattern) => { ctrl.isEditingPattern = editPattern === true; });
            $scope.$on(EVENT_NAME_REGEX_FLAGS_CHANGED, (event, value) => { ctrl.flags = value; });
            $scope.$on(EVENT_NAME_PATTERN_TEXT_CHANGED, (event, value) => { ctrl.patternText = value; });
            InputTestData.addTo(this).isCurrent = true;
        }
        get isEditingPattern() { return this._isEditingPattern; }
        set isEditingPattern(value) {
            if (this._isEditingPattern === (value = value === true))
                return;
            this._isEditingPattern = value;
            this.$scope.$broadcast(EVENT_NAME_EDIT_PATTERN_MODE_CHANGED, false);
        }
        get flags() { return this._flags; }
        set flags(value) {
            if (typeof value !== "string")
                value = "";
            if (this._flags === value)
                return;
            this._flags = value;
            this.$scope.$broadcast(EVENT_NAME_REGEX_FLAGS_CHANGED, false);
        }
        get patternText() { return this._patternText; }
        set patternText(value) {
            if (typeof value !== "string")
                value = "";
            if (this._patternText === value)
                return;
            this._patternText = value;
            this.$scope.$broadcast(EVENT_NAME_PATTERN_TEXT_CHANGED, false);
        }
        get regex() { return this.$scope.regex; }
        $onInit() { }
        addItem(event) {
            preventDefault(event);
            InputTestData.addTo(this).isCurrent = true;
            this.isEditingPattern = false;
        }
    }
    app.mainModule.controller(DIRECTIVENAME_REGEXTESTER, ["$scope", "$log", RegexTesterController]);
    // #endregion
})(regexTester || (regexTester = {}));
//# sourceMappingURL=RegexTester.js.map