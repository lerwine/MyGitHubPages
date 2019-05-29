/// <reference path="../Scripts/typings/jquery/jquery.d.ts"/>
/// <reference path="../Scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="../Scripts/typings/angularjs/angular-route.d.ts"/>

import { IQResolveReject, IPromise } from "angular";

/**
 * The application namespace.
 * 
 * @namespace
 */
namespace app
{
    /**
    * The main module for this app.
    *
    * @type {ng.IModule}
    */
    export let appModule: ng.IModule = angular.module('app', []);

    /**
     * Contains properties similar to Error objects.
     *
     * @export
     * @interface IErrorLike
     */
    export interface IErrorLike {
        /**
         *
         *
         * @type {string}
         * @memberof IErrorLike
         */
        message: string;
        
        /**
         *
         *
         * @type {*}
         * @memberof IErrorLike
         */
        data?: any;
        
        /**
         *
         *
         * @type {string}
         * @memberof IErrorLike
         */
        stack?: string;
        
        /**
         *
         *
         * @type {string}
         * @memberof IErrorLike
         */
        name?: string;
    }

    export type ErrorResult = Error | IErrorLike | string;

    /**
     *
     *
     * @param {*} value
     * @returns {ErrorResult}
     */
    function asErrorResult(value: any): ErrorResult {
        if (typeof (value) !== "undefined" && value !== null) {
            let message: string;
            if (typeof (value) === "string")
                return ((message = value.trim()).length == 0) ? "Unexpected error" : message;
            if (value instanceof Error)
                return value;
            if (typeof (value) === "object" && ((typeof (<IErrorLike>value).message !== "undefined") && (<IErrorLike>value).message !== null)) {
                if (typeof (<IErrorLike>value).data !== "undefined" && (<IErrorLike>value).data !== null)
                    return value;
                if ((message = ((typeof (<IErrorLike>value).message === "string") ? (<IErrorLike>value).message : "" + (<IErrorLike>value).message).trim()).length == 0)
                    message = ("" + value).trim();
            } else
                message = ("" + value).trim();
            return {
                message: (message.length == 0)  ? "Unexpected Error" : message,
                data: value
            };
        }
    }

    /**
     *
     *
     * @template T1
     * @template T2
     * @template T3
     * @param {({ (a1: T1, a2: T2, a3: T3): void } | undefined)} currentCallback
     * @param {{ (a1: T1, a2: T2, a3: T3): void }} newCallback
     * @returns {{ (a1: T1, a2: T2, a3: T3): void }}
     */
    function chainCallback<T1, T2, T3>(currentCallback: { (a1: T1, a2: T2, a3: T3): void } | undefined, newCallback: { (a1: T1, a2: T2, a3: T3): void }): { (a1: T1, a2: T2, a3: T3): void };
    /**
     *
     *
     * @template T1
     * @template T2
     * @param {({ (a1: T1, a2: T2): void } | undefined)} currentCallback
     * @param {{ (a1: T1, a2: T2): void }} newCallback
     * @returns {{ (a1: T1, a2: T2): void }}
     */
    function chainCallback<T1, T2>(currentCallback: { (a1: T1, a2: T2): void } | undefined, newCallback: { (a1: T1, a2: T2): void }): { (a1: T1, a2: T2): void };
    /**
     *
     *
     * @template T
     * @param {({ (a: T): void } | undefined)} currentCallback
     * @param {{ (a: T): void }} newCallback
     * @returns {{ (a: T): void }}
     */
    function chainCallback<T>(currentCallback: { (a: T): void } | undefined, newCallback: { (a: T): void }): { (a: T): void };
    /**
     *
     *
     * @param {({ (): void } | undefined)} currentCallback
     * @param {{ (): void }} newCallback
     * @returns {{ (): void }}
     */
    function chainCallback(currentCallback: { (): void } | undefined, newCallback: { (): void }): { (): void };
    function chainCallback(currentCallback: Function | undefined, newCallback: Function, thisArg?: any): Function {
        if (typeof (currentCallback) !== "function")
            return newCallback;
        return function(...args: any[]) {
            try { currentCallback.apply(thisArg, args); }
            finally { newCallback.apply(thisArg, args); }
        }
    }

    // #region patternExpression Controller
    
    /**
     *
     *
     * @export
     * @interface IPatternExpressionScope
     * @extends {ng.IScope}
     */
    export interface IPatternExpressionScope extends ng.IScope {
        /**
         *
         *
         * @type {string}
         * @memberof IPatternExpressionScope
         */
        text: string;

        /**
         *
         *
         * @type {boolean}
         * @memberof IPatternExpressionScope
         */
        ignoreWhitespace: boolean;

        /**
         *
         *
         * @type {string}
         * @memberof IPatternExpressionScope
         */
        flags: string;
        
        /**
         *
         *
         * @type {boolean}
         * @memberof IPatternExpressionScope
         */
        editDialogVisible: boolean;

        /**
         *
         *
         * @memberof IPatternExpressionScope
         */
        showRegexOptionsEditDialog(): void;
    }
    
    /**
     *
     *
     * @export
     * @class patternExpressionController
     * @implements {ng.IController}
     */
    export class patternExpressionController implements ng.IController {
        /**
         *Creates an instance of patternExpressionController.
         * @param {IPatternExpressionScope} $scope
         * @param {regexOptionsService} regexOptions
         * @param {regexParserService} regexParser
         * @memberof patternExpressionController
         */
        constructor(protected $scope: IPatternExpressionScope, protected regexOptions: regexOptionsService, protected regexParser: regexParserService) {
            this.$scope.text = "";
            this.$scope.ignoreWhitespace = regexOptions.ignoreWhitespace;
            this.$scope.flags = regexOptions.flags;
            this.$scope.editDialogVisible = regexOptions.editDialogVisible;
            this.$scope.showRegexOptionsEditDialog = () => { regexOptions.editDialogVisible = true; }
            regexOptions.whenEditDialogChanged((value: boolean) => { $scope.editDialogVisible = value; });
            regexOptions.whenIgnoreWhitespaceChanged((value: boolean) => { $scope.ignoreWhitespace = value; });
            regexOptions.whenPatternOptionsChanged((value: string) => { $scope.flags = value; })
        }
        $onChanges() {
            this.regexParser.pattern = this.$scope.text;
        }
    }
    
    appModule.controller("patternExpression", ["$scope", "regexOptions", "regexParser", patternExpressionController]);
    
    // #endregion

    // #region regexOptions Service
    
    /**
     *
     *
     * @export
     * @interface IRegexPatternOptions
     */
    export interface IRegexPatternOptions {
        /**
         *
         *
         * @type {boolean}
         * @memberof IRegexPatternOptions
         */
        global: boolean;

        /**
         *
         *
         * @type {boolean}
         * @memberof IRegexPatternOptions
         */
        ignoreCase: boolean;
        
        /**
         *
         *
         * @type {boolean}
         * @memberof IRegexPatternOptions
         */
        multiline: boolean;

        /**
         *
         *
         * @type {boolean}
         * @memberof IRegexPatternOptions
         */
        dotMatchesNewline: boolean;

        /**
         *
         *
         * @type {boolean}
         * @memberof IRegexPatternOptions
         */
        unicode: boolean;

        /**
         *
         *
         * @type {boolean}
         * @memberof IRegexPatternOptions
         */
        sticky: boolean;
    }

    /**
     *
     *
     * @export
     * @interface IRegexOptions
     * @extends {IRegexPatternOptions}
     */
    export interface IRegexOptions extends IRegexPatternOptions {
        /**
         *
         *
         * @type {boolean}
         * @memberof IRegexOptions
         */
        ignoreWhitespace: boolean;

        /**
         *
         *
         * @type {string}
         * @memberof IRegexOptions
         */
        flags: string;
    }

    /**
     *
     *
     * @export
     * @class regexOptionsService
     * @implements {IRegexOptions}
     */
    export class regexOptionsService implements IRegexOptions {
        // #region ignoreWhitespace Property
        
        private _ignoreWhitespace: boolean = false;
        
        /**
         *
         *
         * @type {boolean}
         * @memberof regexOptionsService
         */
        get ignoreWhitespace(): boolean { return this._ignoreWhitespace; }
        set ignoreWhitespace(value: boolean) {
            if (this._ignoreWhitespace == ((typeof (value) !== "boolean") ? (value = (value === true)) : value))
                return;
            this._ignoreWhitespace = value;
            let fn: { (newValue: boolean): void } = this._whenIgnoreWhitespaceChanged;
            if (typeof (fn) !== "undefined")
                fn(value);
        }
        
        // #endregion
        
        // #region flags Property
        
        private _flags: string = "";
        
        /**
         *
         *
         * @readonly
         * @type {string}
         * @memberof regexOptionsService
         */
        get flags(): string { return this._flags; }
        
        // #endregion
        
        // #region global Property
        
        private _global: boolean = false;
        
        /**
         *
         *
         * @type {boolean}
         * @memberof regexOptionsService
         */
        get global(): boolean { return this._global; }
        set global(value: boolean) {
            if (this._global == ((typeof (value) !== "boolean") ? (value = (value === true)) : value))
                return;
            this._global = value; 
            this.updateFlags();
        }
        
        // #endregion
        
        // #region ignoreCase Property
        
        private _ignoreCase: boolean = false;
        
        /**
         *
         *
         * @type {boolean}
         * @memberof regexOptionsService
         */
        get ignoreCase(): boolean { return this._ignoreCase; }
        set ignoreCase(value: boolean) {
            if (this._ignoreCase == ((typeof (value) !== "boolean") ? (value = (value === true)) : value))
                return;
            this._ignoreCase = value; 
            this.updateFlags();
        }
        
        // #endregion
        
        // #region multiline Property
        
        private _multiline: boolean = false;
        
        /**
         *
         *
         * @type {boolean}
         * @memberof regexOptionsService
         */
        get multiline(): boolean { return this._multiline; }
        set multiline(value: boolean) {
            if (this._multiline == ((typeof (value) !== "boolean") ? (value = (value === true)) : value))
                return;
            this._multiline = value; 
            this.updateFlags();
        }
        
        // #endregion
        
        // #region dotMatchesNewline Property
        
        private _dotMatchesNewline: boolean = false;
        
        /**
         *
         *
         * @type {boolean}
         * @memberof regexOptionsService
         */
        get dotMatchesNewline(): boolean { return this._dotMatchesNewline; }
        set dotMatchesNewline(value: boolean) {
            if (this._dotMatchesNewline == ((typeof (value) !== "boolean") ? (value = (value === true)) : value))
                return;
            this._dotMatchesNewline = value; 
            this.updateFlags();
        }
        
        // #endregion
        
        // #region unicode Property
        
        private _unicode: boolean = false;
        
        /**
         *
         *
         * @type {boolean}
         * @memberof regexOptionsService
         */
        get unicode(): boolean { return this._unicode; }
        set unicode(value: boolean) {
            if (this._unicode == ((typeof (value) !== "boolean") ? (value = (value === true)) : value))
                return;
            this._unicode = value; 
            this.updateFlags();
        }
        
        // #endregion
        
        // #region sticky Property
        
        private _sticky: boolean = false;
        
        /**
         *
         *
         * @type {boolean}
         * @memberof regexOptionsService
         */
        get sticky(): boolean { return this._sticky; }
        set sticky(value: boolean) {
            if (this._sticky == ((typeof (value) !== "boolean") ? (value = (value === true)) : value))
                return;
            this._sticky = value; 
            this.updateFlags();
            (/asdf/).ignoreCase
        }
        
        // #endregion
        
        // #region autoExec Property
        
        private _autoExec: boolean = false;
        
        /**
         *
         *
         * @type {boolean}
         * @memberof regexOptionsService
         */
        get autoExec(): boolean { return this._autoExec; }
        set autoExec(value: boolean) {
            if (this._autoExec == ((typeof (value) !== "boolean") ? (value = (value === true)) : value))
                return;
            this._autoExec = value;
            let fn: { (newValue: boolean): void } = this._whenAutoExecChanged;
            if (typeof (fn) !== "undefined")
                fn(value);
        }
        
        // #endregion
        
        // #region autoExec Property
        
        private _editDialogVisible: boolean = false;
        
        /**
         *
         *
         * @type {boolean}
         * @memberof regexOptionsService
         */
        get editDialogVisible(): boolean { return this._editDialogVisible; }
        set editDialogVisible(value: boolean) {
            if (this._editDialogVisible == ((typeof (value) !== "boolean") ? (value = (value === true)) : value))
                return;
            this._editDialogVisible = value;
            let fn: { (newValue: boolean): void } = this._whenEditDialogChanged;
            if (typeof (fn) !== "undefined")
                fn(value);
        }
        
        // #endregion
        
        /**
         *Creates an instance of regexOptionsService.
         * @param {boolean} [ignoreWhitespace]
         * @param {boolean} [autoExec]
         * @param {boolean} [editDialogVisible]
         * @memberof regexOptionsService
         */
        constructor(ignoreWhitespace?: boolean, autoExec?: boolean, editDialogVisible?: boolean);
        /**
         *Creates an instance of regexOptionsService.
         * @param {IRegexPatternOptions} options
         * @param {boolean} [ignoreWhitespace]
         * @param {boolean} [autoExec]
         * @param {boolean} [editDialogVisible]
         * @memberof regexOptionsService
         */
        constructor(options: IRegexPatternOptions, ignoreWhitespace?: boolean, autoExec?: boolean, editDialogVisible?: boolean);
        constructor(options?: IRegexPatternOptions | boolean, ignoreWhitespace?: boolean, autoExec?: boolean, editDialogVisible?: boolean) { }

        /**
         *
         *
         * @param {IRegexPatternOptions} target
         * @memberof regexOptionsService
         */
        updateTo(target: IRegexPatternOptions) {
            target.dotMatchesNewline = this._dotMatchesNewline;
            target.global = this._global;
            target.ignoreCase = this._ignoreCase;
            target.multiline = this._multiline;
            target.sticky = this._sticky;
            target.unicode = this._unicode;
        }

        /**
         *
         *
         * @param {IRegexPatternOptions} target
         * @returns {boolean}
         * @memberof regexOptionsService
         */
        updateFrom(target: IRegexPatternOptions): boolean {
            let flags: string = regexOptionsService.toFlags(target);
            if (flags === this._flags)
                return false;
            this._dotMatchesNewline = target.dotMatchesNewline;
            this._global = target.global;
            this._ignoreCase = target.ignoreCase;
            this._multiline = target.multiline;
            this._sticky = target.sticky;
            this._unicode = target.unicode;
            this.updateFlags();
            return true;
        }

        /**
         *
         *
         * @static
         * @param {IRegexPatternOptions} value
         * @returns
         * @memberof regexOptionsService
         */
        static toFlags(value: IRegexPatternOptions) {
            return [value.ignoreCase ? "i" : "", value.global ? "g" : "", value.multiline ? "m" : "", value.dotMatchesNewline ? "s" : "", value.unicode ? "u" : "", value.sticky ? "y" : ""].join("");
        }

        private updateFlags(): void {
            let patternOptions: string = regexOptionsService.toFlags(this);
            let fn: { (newValue: string): void } = this._whenPatternOptionsChanged;
            this._flags = patternOptions;
            if (typeof (fn) !== "undefined")
                fn(patternOptions);
        }

        private _whenEditDialogChanged: { (newValue: boolean): void };
        private _whenAutoExecChanged: { (newValue: boolean): void };
        private _whenPatternOptionsChanged: { (newValue: string): void };
        private _whenIgnoreWhitespaceChanged: { (newValue: boolean): void };

        /**
         *
         *
         * @param {{ (newValue: boolean): void }} callbackFn
         * @memberof regexOptionsService
         */
        whenEditDialogChanged(callbackFn: { (newValue: boolean): void }) { this._whenEditDialogChanged = chainCallback<boolean>(this._whenEditDialogChanged, callbackFn); }

        /**
         *
         *
         * @param {{ (newValue: boolean): void }} callbackFn
         * @memberof regexOptionsService
         */
        whenAutoExecChanged(callbackFn: { (newValue: boolean): void }) { this._whenAutoExecChanged = chainCallback<boolean>(this._whenAutoExecChanged, callbackFn); }

        /**
         *
         *
         * @param {{ (newValue: string): void }} callbackFn
         * @memberof regexOptionsService
         */
        whenPatternOptionsChanged(callbackFn: { (newValue: string): void }) { this._whenPatternOptionsChanged = chainCallback<string>(this._whenPatternOptionsChanged, callbackFn); }

        /**
         *
         *
         * @param {{ (newValue: boolean): void }} callbackFn
         * @memberof regexOptionsService
         */
        whenIgnoreWhitespaceChanged(callbackFn: { (newValue: boolean): void }) { this._whenIgnoreWhitespaceChanged = chainCallback<boolean>(this._whenIgnoreWhitespaceChanged, callbackFn); }
    }
    
    appModule.service("regexOptions", [() => { return new regexOptionsService(); }]);
    
    // #endregion

    // #region editRegexOptions Controller
    
    /**
     *
     *
     * @export
     * @interface IEditRegexOptionsScope
     * @extends {IRegexPatternOptions}
     * @extends {ng.IScope}
     */
    export interface IEditRegexOptionsScope extends IRegexPatternOptions, ng.IScope {
        /**
         *
         *
         * @type {string}
         * @memberof IEditRegexOptionsScope
         */
        modalId: string;

        /**
         *
         *
         * @type {boolean}
         * @memberof IEditRegexOptionsScope
         */
        editDialogVisible: boolean;

        /**
         *
         *
         * @type {boolean}
         * @memberof IEditRegexOptionsScope
         */
        global: boolean;

        /**
         *
         *
         * @type {boolean}
         * @memberof IEditRegexOptionsScope
         */
        ignoreCase: boolean;

        /**
         *
         *
         * @type {boolean}
         * @memberof IEditRegexOptionsScope
         */
        multiline: boolean;

        /**
         *
         *
         * @type {boolean}
         * @memberof IEditRegexOptionsScope
         */
        dotMatchesNewline: boolean;

        /**
         *
         *
         * @type {boolean}
         * @memberof IEditRegexOptionsScope
         */
        sticky: boolean;

        /**
         *
         *
         * @type {boolean}
         * @memberof IEditRegexOptionsScope
         */
        unicode: boolean;

        /**
         *
         *
         * @type {boolean}
         * @memberof IEditRegexOptionsScope
         */
        ignoreWhitespace: boolean;

        /**
         *
         *
         * @memberof IEditRegexOptionsScope
         */
        hideRegexOptions(): void;

        /**
         *
         *
         * @memberof IEditRegexOptionsScope
         */
        acceptRegexOptions(): void;

        /**
         *
         *
         * @memberof IEditRegexOptionsScope
         */
        cancelRegexOptions(): void;
    }
    
    /**
     *
     *
     * @export
     * @class editRegexOptionsController
     * @implements {ng.IController}
     */
    export class editRegexOptionsController implements ng.IController {
        /**
         *
         *
         * @static
         * @memberof editRegexOptionsController
         */
        static readonly ModalID = "regexOptionsModal";

        /**
         *Creates an instance of editRegexOptionsController.
         * @param {IEditRegexOptionsScope} $scope
         * @param {regexOptionsService} regexOptions
         * @memberof editRegexOptionsController
         */
        constructor(protected $scope: IEditRegexOptionsScope, protected regexOptions: regexOptionsService) {
            $scope.modalId = editRegexOptionsController.ModalID;
            $scope.global = regexOptions.global;
            $scope.ignoreCase = regexOptions.ignoreCase;
            $scope.multiline = regexOptions.multiline;
            $scope.dotMatchesNewline = regexOptions.dotMatchesNewline;
            $scope.sticky = regexOptions.sticky;
            $scope.unicode = regexOptions.unicode;
            $scope.ignoreWhitespace = regexOptions.ignoreWhitespace;
            $scope.editDialogVisible = regexOptions.editDialogVisible;
            let controller: editRegexOptionsController = this;
            $scope.hideRegexOptions = () => { controller.hideRegexOptions(); };
            $scope.acceptRegexOptions = () => { controller.acceptRegexOptions(); };
            $scope.cancelRegexOptions = () => { controller.cancelRegexOptions(); };
            regexOptions.whenEditDialogChanged((value: boolean) => {
                $scope.editDialogVisible = value;
                $("#" + editRegexOptionsController.ModalID).modal((value) ? "show" : "hide");
            });
        }

        /**
         *
         *
         * @memberof editRegexOptionsController
         */
        hideRegexOptions(): void { this.regexOptions.editDialogVisible = false; }

        /**
         *
         *
         * @memberof editRegexOptionsController
         */
        acceptRegexOptions(): void {
            this.regexOptions.updateFrom(this.$scope);
            this.regexOptions.ignoreWhitespace = this.$scope.ignoreWhitespace;
            this.regexOptions.editDialogVisible = false;
        }
        
        /**
         *
         *
         * @memberof editRegexOptionsController
         */
        cancelRegexOptions(): void {
            this.regexOptions.updateTo(this.$scope);
            this.$scope.ignoreWhitespace = this.regexOptions.ignoreWhitespace;
            this.regexOptions.editDialogVisible = false;
        }
        
        $onChanges() { }
    }
    
    appModule.controller("editRegexOptions", ["$scope", "regexOptions", editRegexOptionsController]);
    
    // #endregion
    
    // #region regexEvaluation Service
    
    const parentEvaluationSourceCollection: unique symbol = Symbol();

    class EvaluationSourceCollectionMember {
        static readonly parent: symbol = Symbol();
    }
    /**
     *
     *
     * @export
     * @class regexEvaluationState
     */
    export class  regexEvaluationState {
        private _instanceSymbol: symbol = Symbol();
 
        /**
         *Creates an instance of regexEvaluationState.
         * @param {string} inputText
         * @memberof regexEvaluationState
         */
        constructor(inputText: string);
        /**
         *Creates an instance of regexEvaluationState.
         * @param {string} inputText
         * @param {number} specialCharacterValue
         * @memberof regexEvaluationState
         */
        constructor(inputText: string, specialCharacterValue: number);
        /**
         *Creates an instance of regexEvaluationState.
         * @param {string} inputText
         * @param {number} specialCharacterValue
         * @param {number} specialCharacterIndex
         * @memberof regexEvaluationState
         */
        constructor(inputText: string, specialCharacterValue: number, specialCharacterIndex: number);
        constructor(inputText: string, specialCharacterValue?: number, specialCharacterIndex?: number) {

        }
        
        /**
         *
         *
         * @param {string} inputText
         * @memberof regexEvaluationState
         */
        update(inputText: string): void;
        /**
         *
         *
         * @param {string} inputText
         * @param {number} specialCharacterValue
         * @memberof regexEvaluationState
         */
        update(inputText: string, specialCharacterValue: number): void;
        /**
         *
         *
         * @param {string} inputText
         * @param {number} specialCharacterValue
         * @param {number} specialCharacterIndex
         * @memberof regexEvaluationState
         */
        update(inputText: string, specialCharacterValue: number, specialCharacterIndex: number): void;
        update(inputText: string, specialCharacterValue?: number, specialCharacterIndex?: number): void {

        }

        /**
         *
         *
         * @static
         * @param {regexEvaluationState} x
         * @param {regexEvaluationState} y
         * @returns
         * @memberof regexEvaluationState
         */
        static areSame(x: regexEvaluationState, y: regexEvaluationState) {
            return (typeof x === "undefined") ? (typeof y === "undefined") : ((typeof y !== "undefined") && ((x === null) ? y === null : (y !== null && x._instanceSymbol === y._instanceSymbol)));
        }
        
        [parentEvaluationSourceCollection]: EvaluationSourceCollection;
    }       

    /**
     *
     *
     * @export
     * @class EvaluationSourceCollection
     * @implements {Map<number, regexEvaluationState>}
     */
    export class EvaluationSourceCollection implements Map<number, regexEvaluationState> {
        private _instanceSymbol: symbol = Symbol();
        private _sourceEntries: regexEvaluationState[] = [];

        /**
         *
         *
         * @readonly
         * @type {number}
         * @memberof EvaluationSourceCollection
         */
        get size(): number { return this._sourceEntries.length; }

        /**
         *Creates an instance of EvaluationSourceCollection.
         * @param {{ (): void; }} [_collectionChangedCallback]
         * @memberof EvaluationSourceCollection
         */
        constructor(private _collectionChangedCallback?: { (): void; }) { }

        private raiseCollectionChanged() {
            if (typeof this._collectionChangedCallback === "function")
                this._collectionChangedCallback();
        }

        private assertValidateInsertItems(items: regexEvaluationState[]) {
            if ((typeof items === "undefined") || items === null || items.length == 0)
                return;
            if (!items.every((item: regexEvaluationState, index: number) => {
                if ((typeof item !== "object") || item === null)
                    throw new Error("Invalid item at parameter index " + index);
                let parent: EvaluationSourceCollection = item[parentEvaluationSourceCollection];
                if (typeof parent !== "undefined") {
                    if (parent._instanceSymbol === this._instanceSymbol)
                        throw new Error("Item already exists in collection (parameter index: " + index + ")");
                    throw new Error("Item already exists in another EvaluationSourceCollection");
                }
                for (let i: number = 0; i < index; i++) {
                    if (regexEvaluationState.areSame(item, items[i]))
                        throw new Error("Same item exists twice in arguments to be added to collection (parameter indexes " + i + " and " + index + ".");
                }
                return true;
            }))
                throw new Error("Invalid items cannot be added.");
        }

        /**
         *
         *
         * @param {...regexEvaluationState[]} items
         * @returns {number}
         * @memberof EvaluationSourceCollection
         */
        push(...items: regexEvaluationState[]): number {
            if ((typeof items !== "object") || items === null || items.length == 0)
                return this._sourceEntries.length - 1;
            this.assertValidateInsertItems(items);
            let result: number = this._sourceEntries.push.apply(this._sourceEntries, items);
            items.forEach((i: regexEvaluationState) => { i[parentEvaluationSourceCollection] = this; });
            this.raiseCollectionChanged();
            return result;
        }
        
        /**
         *
         *
         * @param {number} start
         * @param {number} [deleteCount]
         * @returns {regexEvaluationState[]}
         * @memberof EvaluationSourceCollection
         */
        splice(start: number, deleteCount?: number): regexEvaluationState[];
        /**
         *
         *
         * @param {number} start
         * @param {number} deleteCount
         * @param {...regexEvaluationState[]} items
         * @returns {regexEvaluationState[]}
         * @memberof EvaluationSourceCollection
         */
        splice(start: number, deleteCount: number, ...items: regexEvaluationState[]): regexEvaluationState[];
        splice(start: number, deleteCount: number | undefined, ...items: regexEvaluationState[]): regexEvaluationState[] {
            if ((typeof items !== "object") || items === null)
                items = [];
            else if (items.length > 0)
                this.assertValidateInsertItems(items);
            let result: regexEvaluationState[];
            if (typeof items === "undefined" || items === null || items.length === 0) {
                if ((typeof deleteCount !== "number") || isNaN(deleteCount))
                    result = this._sourceEntries.splice(start);
                else
                    result = this._sourceEntries.splice(start, deleteCount);
            } else
                result = this._sourceEntries.splice.apply(this._sourceEntries, (<any[]>([start, ((typeof deleteCount !== "number") || isNaN(deleteCount)) ? 0 : deleteCount])).concat(items));
            result.forEach((i: regexEvaluationState) => { i[parentEvaluationSourceCollection] = undefined; });
            items.forEach((i: regexEvaluationState) => { i[parentEvaluationSourceCollection] = this; });
            if (result.length > 0 || items.length > 0)
                this.raiseCollectionChanged();
            return result;
        }

        /**
         *
         *
         * @param {regexEvaluationState} searchElement
         * @param {number} [fromIndex]
         * @returns {number}
         * @memberof EvaluationSourceCollection
         */
        indexOf(searchElement: regexEvaluationState, fromIndex?: number): number {
            if ((typeof searchElement !== "object") || searchElement === null)
                return -1;
            let parent: EvaluationSourceCollection = searchElement[parentEvaluationSourceCollection];
            if ((typeof parent !== "undefined") && parent._instanceSymbol === this._instanceSymbol)
                for (let i: number = ((typeof fromIndex !== "number") || isNaN(fromIndex) || fromIndex < 0) ? 0 : fromIndex; i < this._sourceEntries.length; i++) {
                    if (regexEvaluationState.areSame(searchElement, this._sourceEntries[i]))
                        return i;
                }
            return -1;
        }

        /**
         *
         *
         * @param {...regexEvaluationState[]} items
         * @returns {number}
         * @memberof EvaluationSourceCollection
         */
        unshift(...items: regexEvaluationState[]): number {
            if ((typeof items !== "object") || items === null || items.length == 0)
                return 0;
            this.assertValidateInsertItems(items);
            let result: number = this._sourceEntries.unshift.apply(this._sourceEntries, items);
            items.forEach((i: regexEvaluationState) => { i[parentEvaluationSourceCollection] = this; });
            this.raiseCollectionChanged();
            return result;
        }

        /**
         *
         *
         * @returns {void}
         * @memberof EvaluationSourceCollection
         */
        clear(): void {
            if (this._sourceEntries.length == 0)
                return;
            let arr: regexEvaluationState[] = this._sourceEntries;
            this._sourceEntries = [];
            arr.forEach((value: regexEvaluationState) => { value[parentEvaluationSourceCollection] = undefined; });
            this.raiseCollectionChanged();
        }

        /**
         *
         *
         * @param {number} key
         * @returns {boolean}
         * @memberof EvaluationSourceCollection
         */
        delete(key: number): boolean {
            if (typeof (key) !== "number" || isNaN(key) || key < 0 || key >= this._sourceEntries.length)
                return false;
            let item: regexEvaluationState = (key === 0) ? this._sourceEntries.shift() : ((key == this._sourceEntries.length - 1) ? this._sourceEntries.pop() : this._sourceEntries.splice(key, 1)[0]);
            item[parentEvaluationSourceCollection] = undefined;
            this.raiseCollectionChanged();
        }
        
        /**
         *
         *
         * @param {(value: regexEvaluationState, key: number, map: EvaluationSourceCollection) => void} callbackfn
         * @param {*} [thisArg]
         * @memberof EvaluationSourceCollection
         */
        forEach(callbackfn: (value: regexEvaluationState, key: number, map: EvaluationSourceCollection) => void, thisArg?: any): void {
            if (typeof (thisArg) === "undefined")
                this._sourceEntries.forEach((value: regexEvaluationState, index: number) => { callbackfn(value, index, this); });
            else
                this._sourceEntries.forEach((value: regexEvaluationState, index: number) => { callbackfn.call(thisArg, value, index, this); });
        }
        
        /**
         *
         *
         * @template T
         * @param {(value: regexEvaluationState, key: number, map: EvaluationSourceCollection) => T} callbackfn
         * @param {*} [thisArg]
         * @returns {T[]}
         * @memberof EvaluationSourceCollection
         */
        map<T>(callbackfn: (value: regexEvaluationState, key: number, map: EvaluationSourceCollection) => T, thisArg?: any): T[] {
            if (typeof (thisArg) === "undefined")
                return this._sourceEntries.map<T>((value: regexEvaluationState, index: number) => { return callbackfn(value, index, this); });
            return this._sourceEntries.map<T>((value: regexEvaluationState, index: number) => { return callbackfn.call(thisArg, value, index, this); });
        }
        
        /**
         *
         *
         * @param {number} key
         * @returns {regexEvaluationState}
         * @memberof EvaluationSourceCollection
         */
        get(key: number): regexEvaluationState { return this._sourceEntries[key]; }
        
        /**
         *
         *
         * @param {number} key
         * @returns {boolean}
         * @memberof EvaluationSourceCollection
         */
        has(key: number): boolean { return typeof (key) === "number" && !isNaN(key) && key > -1 && key < this._sourceEntries.length; }
        
        /**
         *
         *
         * @param {regexEvaluationState} value
         * @returns
         * @memberof EvaluationSourceCollection
         */
        contains(value: regexEvaluationState) {
            if ((typeof value !== "object") || value === null)
                return false;
            let parent: EvaluationSourceCollection = value[parentEvaluationSourceCollection];
            return (typeof parent !== "undefined") && parent._instanceSymbol === this._instanceSymbol;
        }

        /**
         *
         *
         * @param {number} key
         * @param {regexEvaluationState} value
         * @returns {this}
         * @memberof EvaluationSourceCollection
         */
        set(key: number, value: regexEvaluationState): this {
            if ((typeof (value) !== "object") || value === null)
                throw new Error("Value cannot be undefined or null.");
            
            let parent: EvaluationSourceCollection = value[parentEvaluationSourceCollection];
            if (typeof parent !== "undefined") {
                if (parent._instanceSymbol === this._instanceSymbol) {
                    if (regexEvaluationState.areSame(this._sourceEntries[key], value))
                        return;
                    throw new Error("Item already exists in collection");
                }
                throw new Error("Item already exists in another EvaluationSourceCollection");
            }
            let oldItem: regexEvaluationState = this._sourceEntries[key];
            this._sourceEntries[key] = value;
            oldItem[parentEvaluationSourceCollection] = undefined;
            value[parentEvaluationSourceCollection] = this;
            this.raiseCollectionChanged();
            return this;
        }
        
        [Symbol.iterator](): IterableIterator<[number, regexEvaluationState]> { return this.entries(); }
        
        /**
         *
         *
         * @returns {IterableIterator<[number, regexEvaluationState]>}
         * @memberof EvaluationSourceCollection
         */
        entries(): IterableIterator<[number, regexEvaluationState]> { return this._sourceEntries.map<[number, regexEvaluationState]>((value: regexEvaluationState, index: number) => { return [ index, value]; }).values(); }
        
        /**
         *
         *
         * @returns {IterableIterator<number>}
         * @memberof EvaluationSourceCollection
         */
        keys(): IterableIterator<number> { return this._sourceEntries.map<number>((value: regexEvaluationState, index: number) => { return index; }).values(); }
        
        /**
         *
         *
         * @returns {IterableIterator<regexEvaluationState>}
         * @memberof EvaluationSourceCollection
         */
        values(): IterableIterator<regexEvaluationState> { return this._sourceEntries.values(); }
        
        [Symbol.toStringTag]: "Map";
    }

    /**
     *
     *
     * @export
     * @interface IRegexEvaluationResult
     */
    export interface IRegexEvaluationResult {
        /**
         *
         *
         * @type {boolean}
         * @memberof IRegexEvaluationResult
         */
        success:  boolean;

        /**
         *
         *
         * @type {string}
         * @memberof IRegexEvaluationResult
         */
        pattern: string;

        /**
         *
         *
         * @type {string}
         * @memberof IRegexEvaluationResult
         */
        options: string;

        /**
         *
         *
         * @type {string}
         * @memberof IRegexEvaluationResult
         */
        source: string;
    }

    /**
     *
     *
     * @export
     * @interface IRegexResultMatchGroup
     */
    export interface IRegexResultMatchGroup {
        /**
         *
         *
         * @type {number}
         * @memberof IRegexResultMatchGroup
         */
        groupNumber: number;

        /**
         *
         *
         * @type {string}
         * @memberof IRegexResultMatchGroup
         */
        value: string;
    }

    /**
     *
     *
     * @export
     * @interface ISuccessRegexEvaluationResult
     * @extends {IRegexEvaluationResult}
     */
    export interface ISuccessRegexEvaluationResult extends IRegexEvaluationResult {
        /**
         *
         *
         * @type {true}
         * @memberof ISuccessRegexEvaluationResult
         */
        success: true;

        /**
         *
         *
         * @type {IRegexResultMatchGroup[]}
         * @memberof ISuccessRegexEvaluationResult
         */
        groups: IRegexResultMatchGroup[];
    }

    /**
     *
     *
     * @export
     * @interface IFailRegexEvaluationResult
     * @extends {IRegexEvaluationResult}
     */
    export interface IFailRegexEvaluationResult extends IRegexEvaluationResult {
        /**
         *
         *
         * @type {false}
         * @memberof IFailRegexEvaluationResult
         */
        success: false;
    }

    /**
     *
     *
     * @export
     * @class regexEvaluationService
     */
    export class regexEvaluationService {
        private _result: ng.IPromise<IRegexEvaluationResult[]>;
        
        // #region source Property
        
        private _source: EvaluationSourceCollection ;
        
        /**
         *
         *
         * @readonly
         * @type {EvaluationSourceCollection}
         * @memberof regexEvaluationService
         */
        get source(): EvaluationSourceCollection { return this._source; }
        
        // #endregion
        
        /**
         *Creates an instance of regexEvaluationService.
         * @param {ng.IQService} $q
         * @param {regexParserService} regexParser
         * @param {regexOptionsService} regexOptions
         * @memberof regexEvaluationService
         */
        constructor(protected $q: ng.IQService, protected regexParser: regexParserService, protected regexOptions: regexOptionsService) {
            let service: regexEvaluationService = this;
            regexParser.whenParsed((re: RegExp) => {
                if (regexOptions.autoExec)
                    this.startEvaluation();
            });
            this._source = new EvaluationSourceCollection(() => {
                if (regexOptions.autoExec)
                    this.startEvaluation();
            });
        }

        private _whenError(errorReason: any) : ErrorResult {
            let error: ErrorResult;
            if (typeof (errorReason) === "undefined" || errorReason === "null")
                error = new Error("Unexpected failure");
            else if (typeof errorReason === "string")
                error = new Error(errorReason);
            else if (errorReason instanceof Error)
                error = errorReason;
            else {
                let message: string = ((typeof (<Error>errorReason).message === "string") ? (<Error>errorReason).message :
                    ((typeof (<Error>errorReason).message !== "undefined" && (<Error>errorReason).message !== null) ? (<Error>errorReason).message : "")).trim();
                error = {
                    message: (message.length == 0) ? "Unexpected Error" : message,
                    data: errorReason,
                };
            }
            let whenEvaluationFailed: { (reason: ErrorResult): void; } = this._whenEvaluationFailed;
            if (typeof whenEvaluationFailed === "function")
                whenEvaluationFailed(error);
            return error;
        }
        
        /**
         *
         *
         * @memberof regexEvaluationService
         */
        startEvaluation() {
            this.regexParser.then((result: RegExp) => {
                this._result = this.$q<IRegexEvaluationResult[]>((resolve: ng.IQResolveReject<IRegexEvaluationResult[]>, reject: IQResolveReject<ErrorResult>) => {
                }).then((result: IRegexEvaluationResult[]) => {
                    let whenEvaluationCompleted: { (result: IRegexEvaluationResult[]): void; } = this._whenEvaluationCompleted;
                    if (typeof (whenEvaluationCompleted) == "function")
                        whenEvaluationCompleted(result);
                    return result;
                }, this._whenError);
            }, (reason: ErrorResult) => {
                this._result = this.$q<IRegexEvaluationResult[]>((resolve: ng.IQResolveReject<IRegexEvaluationResult[]>, reject: IQResolveReject<ErrorResult>) => {
                    reject(reason);
                }).then((result: IRegexEvaluationResult[]) => { return result; }, this._whenError);
            });
        }

        private _whenEvaluationCompleted: { (result: IRegexEvaluationResult[]): void; };
        private _whenEvaluationFailed: { (reason: ErrorResult): void; };

        /**
         *
         *
         * @param {{ (result: IRegexEvaluationResult[]): void; }} successCallback
         * @memberof regexEvaluationService
         */
        whenEvaluationCompleted(successCallback: { (result: IRegexEvaluationResult[]): void; }) {
            this._whenEvaluationCompleted = chainCallback<IRegexEvaluationResult[]>(this._whenEvaluationCompleted, successCallback);
        }

        /**
         *
         *
         * @param {{ (reason: ErrorResult): void; }} callback
         * @memberof regexEvaluationService
         */
        whenEvaluationFailed(callback: { (reason: ErrorResult): void; }) { this._whenEvaluationFailed = chainCallback<ErrorResult>(this._whenEvaluationFailed, callback); }

        /**
         *
         *
         * @template T
         * @param {{ (result: IRegexEvaluationResult[]): T; }} successCallback
         * @param {{ (reason: ErrorResult): any}} [errorCallback]
         * @returns {T}
         * @memberof regexEvaluationService
         */
        then<T>(successCallback: { (result: IRegexEvaluationResult[]): T; }, errorCallback?: { (reason: ErrorResult): any}): T;
        /**
         *
         *
         * @param {{ (result: IRegexEvaluationResult[]): any; }} successCallback
         * @param {{ (reason: ErrorResult): any}} [errorCallback]
         * @memberof regexEvaluationService
         */
        then(successCallback: { (result: IRegexEvaluationResult[]): any; }, errorCallback?: { (reason: ErrorResult): any}): void;
        /**
         *
         *
         * @param {{ (resresultponse: IRegexEvaluationResult[]): any; }} successCallback
         * @param {{ (reason: ErrorResult): any}} [errorCallback]
         * @returns {*}
         * @memberof regexEvaluationService
         */
        then(successCallback: { (resresultponse: IRegexEvaluationResult[]): any; }, errorCallback?: { (reason: ErrorResult): any}): any {
            return this._result.then(successCallback, errorCallback);
        }
    }

    appModule.service("regexEvaluation", ["$q", "regexParser", "regexOptions", regexEvaluationService]);
    
    // #endregion

    // #region regexParser Service
    
    const WhitespaceRe: RegExp = /[\s\r\n\p{C}]+/;

    /**
     * Asynchronously parses the regular expression pattern.
     *
     * @export
     * @class regexParserService
     */
    export class regexParserService {
        private _result: ng.IPromise<RegExp>;
        private _flags: string = "";
        private _ignoreWhitespace = false;
        private _targetPattern: string = "";
        private _parsedPattern: string = "";
        private _parsedFlags: string = "";
        private _whenParsed: { (value: RegExp): void; };
        private _whenParseFailed: { (reason: ErrorResult): void; };
        private _lastSuccessfulParse: RegExp | null = null;
        private _pattern: string = "";

        // #region lastSuccessfulParse Property
        
        /**
         * This contains the last successfully parsed regular expression.
         *
         * @readonly
         * @type {(RegExp | null)}
         * @memberof regexParserService
         */
        get lastSuccessfulParse(): RegExp | null { return this._lastSuccessfulParse; }
        
        // #endregion

        /**
         * The actual string to be parsed, which has whitespace removed if ignoreWhatespace is true.
         *
         * @readonly
         * @type {string}
         * @memberof regexParserService
         */
        get targetPattern(): string { return this._targetPattern; }

        // #region pattern Property
        
        /**
         * The user-provided regular expression pattern.
         *
         * @type {string}
         * @memberof regexParserService
         */
        get pattern(): string { return this._pattern; }
        set pattern(value: string) {
            this._pattern = (typeof value === "undefined" || value === null) ? (value = "") : ((typeof value === "string") ? value : (value = "" + value));
            value = (this._ignoreWhitespace) ? this._pattern.replace(WhitespaceRe, "") : this._pattern;
            if (this._targetPattern === value)
                return;
            this._targetPattern = value; 
            if (this.regexOptions.autoExec)
                this.startParse();
        }
        
        // #endregion
        
        /**
         * Creates an instance of regexParserService.
         * @param {ng.IQService} $q Service for asynchronous execution.
         * @param {regexOptionsService} regexOptions Specifies regular expression options.
         * @memberof regexParserService
         */
        constructor(protected $q: ng.IQService, protected regexOptions: regexOptionsService) {
            let service: regexParserService = this;
            regexOptions.whenIgnoreWhitespaceChanged((value: boolean) => {
                if (value === this._ignoreWhitespace)
                    return;
                this._ignoreWhitespace = value;
                this._targetPattern = (value) ? this._pattern.replace(WhitespaceRe, "") : this._pattern;
                if (this.regexOptions.autoExec && this._targetPattern !== this._parsedPattern)
                    this.startParse();
            });
            regexOptions.whenPatternOptionsChanged((value: string) => {
                if (value === this._flags)
                    return;
                this._flags = value;
                if (this.regexOptions.autoExec && (this._parsedPattern !== this._targetPattern || this._parsedFlags !== this._flags))
                    this.startParse();
            });
            regexOptions.whenAutoExecChanged((value: boolean) => {
                if (value && (this._parsedPattern !== this._targetPattern || this._parsedFlags !== this._flags))
                    this.startParse();
            });
            this.startParse();
        }

        /**
         * Begins asynchronous parsing of the current regular expression pattern.
         *
         * @returns {IPromise<RegExp>}
         * @memberof regexParserService
         */
        startParse(): IPromise<RegExp> {
            let result: IPromise<RegExp>;
            this._result = result = this.$q<RegExp>((resolve: ng.IQResolveReject<RegExp>, reject: IQResolveReject<ErrorResult>) => {
                let pattern: string = this._targetPattern;
                let flags: string = this._flags;
                this._parsedPattern = pattern;
                this._parsedFlags = flags;
                let result: RegExp | null | undefined;
                try { result = new RegExp(pattern, flags); }
                catch (e) {
                    reject(asErrorResult(e));
                    return;
                }
                if (typeof (result) !== "object" || result === null)
                    reject("Failed to parse regular expression");
                else
                    resolve(result);
            }).then((result: RegExp) => {
                let whenParsed: { (value: RegExp): void; } = this._whenParsed;
                if (typeof whenParsed === "function")
                    whenParsed(result);
                return result;
            }, (errorReason: any) => {
                let err: ErrorResult = asErrorResult(errorReason);
                let whenParseFailed: { (reason: ErrorResult): void; } = this._whenParseFailed;
                if (typeof whenParseFailed === "function")
                    whenParseFailed(err);
                return err;
            });
            return result;
        }
        
        /**
         * This gets called after a regular expression patter has been successfully parsed.
         *
         * @param {{ (value: RegExp): void; }} callback
         * @memberof regexParserService
         */
        whenParsed(callback: { (value: RegExp): void; }) { this._whenParsed = chainCallback<RegExp>(this._whenParsed, callback); }

        /**
         * This gets called after a failed attempt to parse a regular expression string.
         *
         * @param {{ (reason: ErrorResult): void; }} callback
         * @memberof regexParserService
         */
        whenParseFailed(callback: { (reason: ErrorResult): void; }) { this._whenParseFailed = chainCallback<ErrorResult>(this._whenParseFailed, callback); }

        /**
         *
         *
         * @template T
         * @param {{ (result: RegExp): T}} successCallback
         * @param {{ (reason: ErrorResult): any}} [errorCallback]
         * @returns {T}
         * @memberof regexParserService
         */
        then<T>(successCallback: { (result: RegExp): T}, errorCallback?: { (reason: ErrorResult): any}): T;
        /**
         *
         *
         * @param {{ (result: RegExp): any}} successCallback
         * @param {{ (reason: ErrorResult): any}} [errorCallback]
         * @memberof regexParserService
         */
        then(successCallback: { (result: RegExp): any}, errorCallback?: { (reason: ErrorResult): any}): void;
        then(successCallback: { (resresultponse: RegExp): any}, errorCallback?: { (reason: ErrorResult): any}): any {
            return this._result.then(successCallback, errorCallback);
        }
    }
    
    appModule.service("regexParser", ["$q", "regexOptions", regexParserService]);
    
    // #endregion
    
    // #region regexTest Controller

    /**
     * 
     *
     * @export
     * @enum {number}
     */
    export enum SpecialCharacterOptionValue {
        /**
         *
         */
        none,

        /**
         *
         */
        append,

        /**
         *
         */
        insert
    }

    /**
     *
     *
     * @export
     * @interface ISpecialCharacterOption
     */
    export interface ISpecialCharacterOption { id: SpecialCharacterOptionValue; text: string }

    /**
     *
     *
     * @export
     * @interface IRegexTestScope
     */
    export interface IRegexTestScope {
        /**
         *
         *
         * @type {string}
         * @memberof IRegexTestScope
         */
        inputText: string;

        /**
         *
         *
         * @type {number}
         * @memberof IRegexTestScope
         */
        specialCharacterValue: number;

        /**
         *
         *
         * @type {SpecialCharacterOptionValue}
         * @memberof IRegexTestScope
         */
        selectedSpecialCharacterOption: SpecialCharacterOptionValue;

        /**
         *
         *
         * @type {ISpecialCharacterOption[]}
         * @memberof IRegexTestScope
         */
        specialCharacterOptions: ISpecialCharacterOption[];

        /**
         *
         *
         * @type {number}
         * @memberof IRegexTestScope
         */
        specialCharacterIndex: number;

        /**
         *
         *
         * @type {boolean}
         * @memberof IRegexTestScope
         */
        autoExec: boolean;

        /**
         *
         *
         * @memberof IRegexTestScope
         */
        executeRegex(): void;
    }

    /**
     *
     *
     * @export
     * @class regexTestController
     * @implements {ng.IController}
     */
    export class regexTestController implements ng.IController {
        /**
         *Creates an instance of regexTestController.
         * @param {IRegexTestScope} $scope
         * @param {regexOptionsService} regexOptions
         * @param {regexEvaluationService} regexEvaluation
         * @memberof regexTestController
         */
        constructor(protected $scope: IRegexTestScope, protected regexOptions: regexOptionsService, protected regexEvaluation: regexEvaluationService) {
            this.$scope.specialCharacterIndex = 0;
            this.$scope.specialCharacterValue = 27;
            this.$scope.specialCharacterOptions = [
                { id: SpecialCharacterOptionValue.none, text: "No special character" },
                { id: SpecialCharacterOptionValue.append, text: "Append special character" },
                { id: SpecialCharacterOptionValue.insert, text: "Insert special character" }
            ]
            this.$scope.selectedSpecialCharacterOption = SpecialCharacterOptionValue.none;

            if (this.regexEvaluation.source.size === 0)
                this.regexEvaluation.source.push(new regexEvaluationState(this.$scope.inputText));
            else
                this.regexEvaluation.source.get(0).update(this.$scope.inputText);
            this.$scope.inputText = '';
            let controller: regexTestController = this;
            this.$scope.executeRegex = () => { controller.executeRegex(); }
        }

        /**
         *
         *
         * @memberof regexTestController
         */
        executeRegex(): void {

        }

        $onChanges() {
            if (!this.$scope.autoExec)
                this.regexOptions.autoExec = this.$scope.autoExec;
            if (this.$scope.selectedSpecialCharacterOption === SpecialCharacterOptionValue.none)
                this.regexEvaluation.source.get(0).update(this.$scope.inputText);
            else if (this.$scope.selectedSpecialCharacterOption == SpecialCharacterOptionValue.append)
                this.regexEvaluation.source.get(0).update(this.$scope.inputText, this.$scope.specialCharacterValue);
            else
                this.regexEvaluation.source.get(0).update(this.$scope.inputText, this.$scope.specialCharacterValue, this.$scope.specialCharacterIndex);
            if (this.$scope.autoExec)
                this.regexOptions.autoExec = this.$scope.autoExec;
        }
    }

    appModule.controller('regexTest', ["$scope", "regexOptions", "regexEvaluation", regexTestController]);

    // #endregion
    
    // #region regexResult Controller
    
    /**
     *
     *
     * @export
     * @interface IRegexResultGroup
     */
    export interface IRegexResultGroup {
        /**
         *
         *
         * @type {number}
         * @memberof IRegexResultGroup
         */
        groupNumber: number;

        /**
         *
         *
         * @type {boolean}
         * @memberof IRegexResultGroup
         */
        success: boolean;

        /**
         *
         *
         * @type {string}
         * @memberof IRegexResultGroup
         */
        matchValue: string;
    }

    /**
     *
     *
     * @export
     * @interface IRegexResultScope
     * @extends {ng.IScope}
     */
    export interface IRegexResultScope extends ng.IScope {
        /**
         *
         *
         * @type {boolean}
         * @memberof IRegexResultScope
         */
        isEvaluated: boolean;

        /**
         *
         *
         * @type {string}
         * @memberof IRegexResultScope
         */
        message: string;

        /**
         *
         *
         * @type {string}
         * @memberof IRegexResultScope
         */
        resultClass: string;

        /**
         *
         *
         * @type {boolean}
         * @memberof IRegexResultScope
         */
        success: boolean;

        /**
         *
         *
         * @type {string}
         * @memberof IRegexResultScope
         */
        textBeforeMatch: string;

        /**
         *
         *
         * @type {string}
         * @memberof IRegexResultScope
         */
        textAfterMatch: string;

        /**
         *
         *
         * @type {IRegexResultGroup[]}
         * @memberof IRegexResultScope
         */
        groups: IRegexResultGroup[];
    }
    
    /**
     * Represents the results of a regular expression evaluation.
     *
     * @export
     * @class regexResultController
     * @implements {ng.IController}
     */
    export class regexResultController implements ng.IController {
        /**
         *Creates an instance of regexResultController.
         * @param {IRegexResultScope} $scope
         * @memberof regexResultController
         */
        constructor(protected $scope: IRegexResultScope) { }

        $onInit() {
        
        }
    }
    
    appModule.controller("regexResult", ["$scope", regexResultController]);
    
    // #endregion
}
