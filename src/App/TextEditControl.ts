/// <reference path="../Scripts/typings/jquery/jquery.d.ts"/>
/// <reference path="../Scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="../Scripts/typings/angularjs/angular-route.d.ts"/>
/// <reference path="../Scripts/typings/bootstrap/index.d.ts"/>
/// <reference path="sys.ts"/>
/// <reference path="app.ts"/>

module textEditControl {
    const WHITESPACE_REGEX: RegExp = /[\s\r\n\p{C}]+/g;
    const NEWLINE_REGEX: RegExp = /\r\n?|\n/g;
    const TABBABLE_REGEX: RegExp = /^(?=\s*\S)/g;
    const UTTABBABLE_REGEX: RegExp = /^( {1,4}|\t)/g;
    const TRAILINGWS_REGEX: RegExp = /\s+$/g;

    interface ITextEditControlAttributes extends ng.IAttributes {
        textBoxId?: string;
    }

    interface ITextEditControlScope extends ng.IScope {
        ctrl: TextEditController;
        textBoxId?: string;
        text: string;
        rows?: number;
        rowCount: number;
    }

    class TextEditController implements ng.IController {
        private _textArea: HTMLTextAreaElement;

        constructor(private $scope: ITextEditControlScope, private $window: ng.IWindowService, private $log: ng.ILogService) {
            $scope.tws = sys.asBoolean($scope.trimWs, true);
            $scope.rowCount = (typeof $scope.rows !== "number" || isNaN($scope.rows) || $scope.rows < 1) ? 6 : $scope.rows;
            $scope.$watch("rows", (newValue?: number, oldValue?: number) => {
                $scope.rowCount = (typeof newValue !== "number" || isNaN(newValue) || newValue < 1) ? 6 : newValue;
            });
        }
        
        private ensureSelectedText(): void {
            let start: number = this._textArea.selectionStart;
            let end: number = this._textArea.selectionEnd;
            if (start == end) {
                let text: string = this._textArea.value;
                let c: string;
                while (start > 0) {
                    c = text.substr(start - 1, 0);
                    if (c === "\r" || c === "\n")
                        break;
                    start--;
                }
                while (end < text.length) {
                    c = text.substr(end, 1);
                    if (c === "\r" || c === "\n")
                        break;
                    end++;
                }
                this._textArea.selectionStart = start;
                this._textArea.selectionEnd = end;
            }
        }

        cutSelected(): void {
            this.ensureSelectedText();
            this.$window.document.execCommand("cut");
        }

        copySelected(): void {
            this.ensureSelectedText();
            this.$window.document.execCommand("copy");
        }

        pasteOverSelected(): void { this.$window.document.execCommand("paste"); }

        deleteSelected(): void {
            this.ensureSelectedText();
            this.$window.document.execCommand("delete");
        }
        
        indentSelected(): void {
            let start: number = this._textArea.selectionStart;
            let end: number = this._textArea.selectionEnd;
            let text: string = this._textArea.value;
            if (start == end) {
                if (text.length === 0)
                    this._textArea.value = "\t";
                else if (start === 0)
                    this._textArea.value = "\t" + text;
                else if (start === text.length)
                    this._textArea.value = text + "\t";
                else
                    this._textArea.value = text.substr(0, start) + "\t" + text.substr(start);
                this._textArea.selectionStart = this._textArea.selectionEnd = start + 1;
            } else {
                let c: string;
                while (start > 0) {
                    c = text.substr(start - 1, 0);
                    if (c === "\r" || c === "\n")
                        break;
                    start--;
                }
                while (end < text.length) {
                    c = text.substr(end, 1);
                    if (c === "\r" || c === "\n")
                        break;
                    end++;
                }
                let untabbed: string = text.substr(start, end - start);
                let tabbed: string = text.replace(TABBABLE_REGEX, "\t");
                if (untabbed !== tabbed) {
                    end += tabbed.length - untabbed.length;
                    this._textArea.value = text.substr(0, start) + tabbed + text.substr(end);
                }
                this._textArea.selectionStart = start;
                this._textArea.selectionEnd = end;
            }
        }

        unindentSelected(): void {
            let start: number = this._textArea.selectionStart;
            let end: number = this._textArea.selectionEnd;
            let text: string = this._textArea.value;
            let c: string;
            while (start > 0) {
                c = text.substr(start - 1, 0);
                if (c === "\r" || c === "\n")
                    break;
                start--;
            }
            while (end < text.length) {
                c = text.substr(end, 1);
                if (c === "\r" || c === "\n")
                    break;
                end++;
            }
            let tabbed: string = text.substr(start, end - start);
            let untabbed: string = text.replace(UTTABBABLE_REGEX, "");
            if (untabbed !== tabbed) {
                end += tabbed.length - untabbed.length;
                this._textArea.value = text.substr(0, start) + tabbed + text.substr(end);
            }
            this._textArea.selectionStart = start;
            this._textArea.selectionEnd = end;
        }

        removeTrailingWhitespaceFromSelected(): void {
            let start: number = this._textArea.selectionStart;
            let end: number = this._textArea.selectionEnd;
            let text: string = this._textArea.value;
            let c: string;
            if (start === end) {
                c = text.replace(TRAILINGWS_REGEX, "");
                if (c === text)
                    return;
                this._textArea.value = c;
                this._textArea.selectionStart = 0;
                this._textArea.selectionEnd = c.length;
            } else {
                while (start > 0) {
                    c = text.substr(start - 1, 0);
                    if (c === "\r" || c === "\n")
                        break;
                    start--;
                }
                while (end < text.length) {
                    c = text.substr(end, 1);
                    if (c === "\r" || c === "\n")
                        break;
                    end++;
                }
                let untrimmed: string = text.substr(start, end - start);
                let trimmed: string = text.replace(TRAILINGWS_REGEX, "");
                if (untrimmed !== trimmed) {
                    this._textArea.value = text.substr(0, start) + trimmed + text.substr(end);
                    end = start + trimmed.length;
                }
                this._textArea.selectionStart = start;
                this._textArea.selectionEnd = end;
            }
        }

        deleteWordLeft() {
            let start: number = this._textArea.selectionStart;
            let end: number = this._textArea.selectionEnd;
            let text: string = this._textArea.value;
            if (start < 1)
                return;
            let deleteFrom: number = start - 1;
            let c: string = text.substr(deleteFrom, 1);
            if (c === "\n") {
                if (deleteFrom > 0 && text.substr(deleteFrom - 1, 1) === "\r")
                    deleteFrom--;
            } else {
                while (deleteFrom > 0 && (c === " " || c === "\t")) {
                    deleteFrom--;
                    c = text.substr(deleteFrom, 1);
                }
                while (deleteFrom > 0 && c !== " " && c !== "\t" && c !== "\r" && c !== "\n") {
                    deleteFrom--;
                    c = text.substr(deleteFrom, 1);
                }
            }
            deleteFrom = start - deleteFrom;
            this._textArea.value = text.substr(0, deleteFrom) + text.substr(start);
            this._textArea.selectionStart = start - deleteFrom;
            this._textArea.selectionEnd = end - deleteFrom;
        }

        onKeyDownAcceptSpecialKeys(event: JQueryKeyEventObject): boolean {
            switch (event.keyCode) {
                //case 8: // Ctrl+BKSP
                //    if (event.altKey || event.metaKey || event.metaKey || !event.ctrlKey)
                //        return false;
                case 9: // TAB or Alt+TAB
                    if (event.altKey || event.ctrlKey || event.metaKey)
                        return;
                    if (event.shiftKey)
                        this.unindentSelected();
                    else
                        this.indentSelected();
                    break;
                //case 88: // Ctrl+X
                //    if (event.altKey || event.metaKey || event.metaKey || !event.ctrlKey)
                //        return false;
                //    break;
                //case 67: // Ctrl+C
                //    if (event.altKey || event.metaKey || event.metaKey || !event.ctrlKey)
                //        return false;
                //    break;
                //case 86: // Ctrl+V
                //    if (event.altKey || event.metaKey || event.metaKey || !event.ctrlKey)
                //        return false;
                //case 46: // Ctrl+DEL
                //    if (event.altKey || event.metaKey || event.metaKey || !event.ctrlKey)
                //        return false;
                //case 65: // Ctrl+A
                //    if (event.altKey || event.metaKey || event.metaKey || !event.ctrlKey)
                //        return false;
                default: // Ctrl+U; Ctrl+Alt+U
                    this.$log.info(angular.toJson({
                        keyCode: event.keyCode,
                        metaKey: event.metaKey,
                        altKey: event.altKey,
                        ctrlKey: event.ctrlKey,
                        shiftKey: event.shiftKey,
                        char: event.char,
                        charCode: event.charCode,
                        type: event.type
                    }));
                    return;
            }
            event.preventDefault();
            event.stopPropagation();
            return false;
        }

        private static directiveLink($scope: ITextEditControlScope, element: JQuery, attr: ITextEditControlAttributes): void {
            if (!element.hasClass("custom-control"))
                element.addClass("custom-control");
            if (!element.hasClass("form-control-plaintext"))
                element.addClass("form-control-plaintext");
            $scope.ctrl._textArea = <HTMLTextAreaElement>element.children("textarea")[0];
        }

        static createDirective(): ng.IDirective {
            return <ng.IDirective>{
                restrict: "E",
                transclude: false,
                templateUrl: "Template/TextEditControl.htm",
                controller: ["$scope", "$window", "$log", TextEditController],
                controllerAs: "ctrl",
                scope: {
                    textBoxId: "@?textboxId",
                    text: "=model",
                    rows: "&?rowsExpr"
                },
                link: TextEditController.directiveLink
            }
        }

        $doCheck() { }
    }

    app.mainModule.directive("textEditControl", TextEditController.createDirective);
}
