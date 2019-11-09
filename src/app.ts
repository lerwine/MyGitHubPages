/// <reference path="Scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="Scripts/typings/angularjs/angular-route.d.ts"/>
/// <reference path="Scripts/typings/bootstrap/index.d.ts"/>

/**
 * The JavaScript module corresponding to the MyGitHubPages angular js module.
 * @module app
 */
module app {
    /**
     * Statically defined names of modules that are registered.
     * @export
     * @constant ModuleNames
     */
    export interface IModuleNames {
        /**
         * Name of the main application module.
         * @type: {"MyGitHubPages"}
         * @readonly
         */
        readonly app: 'MyGitHubPages';
        /**
         * Name of the Home page module.
         * @type: {"MyGitHubPages.home"}
         * @readonly
         */
        readonly home: 'MyGitHubPages.home';
        /**
         * Name of the Regular Expression Tester pages module.
         * @type: {"MyGitHubPages.regexTester"}
         * @readonly
         */
        readonly regexTester: 'MyGitHubPages.regexTester';
        /**
         * Name of the URI Builder page module.
         * @type: {"MyGitHubPages.uriBuilder"}
         * @readonly
         */
        readonly uriBuilder: 'MyGitHubPages.uriBuilder';
        /**
         * Name of the Color Builder page module.
         * @type: {"MyGitHubPages.colorBuilder"}
         * @readonly
         */
        readonly colorBuilder: 'MyGitHubPages.colorBuilder';
    }
    /**
     * Names of modules that are registered.
     * @export
     * @constant ModuleNames
     */
    export const ModuleNames: IModuleNames = {
        app: 'MyGitHubPages', home: 'MyGitHubPages.home', regexTester: 'MyGitHubPages.regexTester', uriBuilder: 'MyGitHubPages.uriBuilder', 
        colorBuilder: 'MyGitHubPages.colorBuilder'
    };

    /**
     * Statically defined angular route paths to module pages.
     * @export
     * @interface IModulePaths
     */
    export interface IModulePaths {
        /**
         * The path for the Home page.
         * @type: {"/home"}
         * @readonly
         */
        readonly home: '/home';
        /**
         * The path for the GIT notes page.
         * @type: {"/git"}
         * @readonly
         */
        readonly git: '/git';
        /**
         * The path for the VS Code notes page.
         * @type: {"/vscode"}
         * @readonly
         */
        readonly vscode: '/vscode';
        /**
         * The path for the NPM notes page.
         * @type: {"/npm"}
         * @readonly
         */
        readonly npm: '/npm';
        /**
         * The path for the Regular Expression Match page.
         * @type: {"/regex/match"}
         * @readonly
         */
        readonly regexMatch: '/regex/match';
        /**
         * The path for the Regular Expression Replace page.
         * @type: {"/regex/replace"}
         * @readonly
         */
        readonly regexReplace: '/regex/replace';
        /**
         * The path for the Regular Expression Split page.
         * @type: {"/regex/split"}
         * @readonly
         */
        readonly regexSplit: '/regex/split';
        /**
         * The path for the URI Builder page.
         * @type: {"/uri"}
         * @readonly
         */
        readonly uriBuilder: '/uri';
        /**
         * The path for the Color Builder page.
         * @type: {"/color"}
         * @readonly
         */
        readonly colorBuilder: '/color';
    }
    /**
     * Angular route paths to module pages.
     * @export
     * @constant ModulePaths
     * @type {IModulePaths}
     */
    export const ModulePaths: IModulePaths = {
        home: '/home', git: '/git', vscode: '/vscode', npm: '/npm', regexMatch: '/regex/match', regexReplace: '/regex/replace',
        regexSplit: '/regex/split', uriBuilder: '/uri', colorBuilder: '/color'
    };

    /**
     * Statically defined names of controllers that are registered.
     * @export
     * @interface IControllerNames
     */
    export interface IControllerNames {
        /**
         * The name of the main application content controller.
         * @type: {"mainContentController"}
         * @readonly
         */
        readonly mainContent: 'mainContentController';
        /**
         * The name of the Home page controller.
         * @type: {"homePageController"}
         * @readonly
         */
        readonly homePage: 'homePageController';
        /**
         * The name of the Regular Expression Match page controller.
         * @type: {"regexMatchController"}
         * @readonly
         */
        readonly regexMatch: 'regexMatchController';
        /**
         * The name of the Regular Expression Replace page controller.
         * @type: {"regexReplaceController"}
         * @readonly
         */
        readonly regexReplace: 'regexReplaceController';
        /**
         * The name of the Regular Expression Split page controller.
         * @type: {"regexSplitController"}
         * @readonly
         */
        readonly regexSplit: 'regexSplitController';
        /**
         * The name of the URI Builder page controller.
         * @type: {"uriBuilderPageController"}
         * @readonly
         */
        readonly uriBuilder: 'uriBuilderPageController';
        /**
         * The name of the Color Builder page controller.
         * @type: {"colorBuilderPageController"}
         * @readonly
         */
        readonly colorBuilder: 'colorBuilderPageController';
    }
    /**
     * Names of controllers that are registered.
     * @export
     * @constant ControllerNames
     * @type {IControllerNames}
     */
    export const ControllerNames: IControllerNames = {
        mainContent: 'mainContentController', homePage: 'homePageController', regexMatch: 'regexMatchController',
        regexReplace: 'regexReplaceController', regexSplit: 'regexSplitController', uriBuilder: 'uriBuilderPageController',
        colorBuilder: 'colorBuilderPageController'
    };

    /**
     * Statically defined names of services and providers that are registered.
     * @export
     * @interface IServiceNames
     */
    export interface IServiceNames {
        /**
         * The name of the Supplantable Promise Chain service.
         * @type: {"supplantablePromiseChainService"}
         * @readonly
         */
        readonly supplantablePromiseChain: 'supplantablePromiseChainService';
        /**
         * The name of the Page Title service.
         * @type: {"pageTitleService"}
         * @readonly
         */
        readonly pageTitle: 'pageTitleService';
        /**
         * The name of the Main Navigation service provider.
         * @type: {"mainNavigationProvider"}
         * @readonly
         */
        readonly mainNavigationProvider: 'mainNavigationProvider';
        /**
         * The name of the Regular Expression Parser service.
         * @type: {"regexParser"}
         * @readonly
         */
        readonly regexParser: 'regexParser';
    }
    /**
     * Names of services and providers that are registered.
     * @export
     * @constant ServiceNames
     * @type {IServiceNames}
     */
    export const ServiceNames: IServiceNames = {
        supplantablePromiseChain: 'supplantablePromiseChainService', pageTitle: 'pageTitleService',
        mainNavigationProvider: 'mainNavigationProvider', regexParser: 'regexParser'
    };
 
    /**
     * Statically defined custom event names.
     * @export
     * @interface IEventNames
     */
    export interface IEventNames {
        /**
         * The name of the setPageTitle event.
         * @type: {"MyGitHubPages.setPageTitle"}
         * @readonly
         */
        readonly setPageTitle: 'MyGitHubPages.setPageTitle';
        /**
         * The name of the topNavChanged event.
         * @type: {"MyGitHubPages.topNavChanged"}
         * @readonly
         */
        readonly topNavChanged: 'MyGitHubPages.topNavChanged';
        /**
         * The name of the regexPatternChanged2 event.
         * @type: {"MyGitHubPages.regexPatternChanged"}
         * @readonly
         */
        readonly regexPatternChanged2: 'MyGitHubPages.regexPatternChanged';
        /**
         * The name of the regexFlagsChanged2 event.
         * @type: {"MyGitHubPages.regexFlagsChanged"}
         * @readonly
         */
        readonly regexFlagsChanged2: 'MyGitHubPages.regexFlagsChanged';
        /**
         * The name of the startRegexPatternParse2 event.
         * @type: {"MyGitHubPages.startRegexPatternParse"}
         * @readonly
         */
        readonly startRegexPatternParse2: 'MyGitHubPages.startRegexPatternParse';
        /**
         * The name of the endRegexPatternParse2 event.
         * @type: {"MyGitHubPages.endRegexPatternParse"}
         * @readonly
         */
        readonly endRegexPatternParse2: 'MyGitHubPages.endRegexPatternParse';
        /**
         * The name of the regexPatternParseError2 event.
         * @type: {"MyGitHubPages.regexPatternParseError"}
         * @readonly
         */
        readonly regexPatternParseError2: 'MyGitHubPages.regexPatternParseError';
        /**
         * The name of the regexPatternParseSuccess event.
         * @type: {"MyGitHubPages.regexPatternParseSuccess"}
         * @readonly
         */
        readonly regexPatternParseSuccess: 'MyGitHubPages.regexPatternParseSuccess';
        /**
         * The name of the regexObjectChanged2 event.
         * @type: {"MyGitHubPages.regexObjectChanged"}
         * @readonly
         */
        readonly regexObjectChanged2: 'MyGitHubPages.regexObjectChanged';
    }
    /**
     * Custom event names.
     * @export
     * @constant EventNames
     * @type {IEventNames}
     */
    export const EventNames: IEventNames = {
        setPageTitle: 'MyGitHubPages.setPageTitle', topNavChanged: 'MyGitHubPages.topNavChanged',
        regexPatternChanged2: 'MyGitHubPages.regexPatternChanged', regexFlagsChanged2: 'MyGitHubPages.regexFlagsChanged',
        startRegexPatternParse2: 'MyGitHubPages.startRegexPatternParse', endRegexPatternParse2: 'MyGitHubPages.endRegexPatternParse',
        regexPatternParseError2: 'MyGitHubPages.regexPatternParseError', regexPatternParseSuccess: 'MyGitHubPages.regexPatternParseSuccess',
        regexObjectChanged2: 'MyGitHubPages.regexObjectChanged'
    };

    /**
     * Prefix for hash portion of navigation URI strings.
     * @export
     * @constant HashPrefix
     * @type {"!"}
     */
    export const HashPrefix: '!' = '!';
    /**
     * Prefix for relative navigation URI path strings.
     * @export
     * @constant NavPrefix
     * @type {"#!"}
     */
    export const NavPrefix: '#!' = '#!';

    /**
     * Handles W3C DOM event.
     * @export
     * @typedef {(event?: BaseJQueryEventObject) => void} DOMelementEventCallback
     * @param {BaseJQueryEventObject} [event] - Contains information about the W3C DOM event that occurred.
     */
    export type DOMelementEventCallback = (event?: BaseJQueryEventObject) => void;

    /**
     * Defines a callback method which handles a successfully resolved supplantable promise.
     * @export
     * @typedef {(promiseValue?: TPromise) => ng.IPromise<TResult> | TResult} SupplantableChainPromiseSuccessCallback
     * @template TPromise - The type of value to be resolved.
     * @template TResult - The type of result value to be produced by the callback method.
     * @param {TPromise} [promiseValue] - The resolved promise value.
     * @returns {(ng.IPromise<TResult> | TResult)} A result value or a promise which produces the result value.
     */
    export type SupplantableChainPromiseSuccessCallback<TPromise, TResult> = (promiseValue?: TPromise) => ng.IPromise<TResult> | TResult;
    /**
     * Defines a callback method which handles a successfully resolved supplantable promise.
     * @export
     * @typedef {(promiseValue?: TPromise) => ng.IPromise<TResult> | TResult} SupplantableChainPromiseSuccessThisCallback
     * @template TPromise - The type of value to be resolved.
     * @template TResult - The type of result value to be produced by the callback method.
     * @template TThis - The type of the 'this' object when the callback method is invoked.
     * @this TThis
     * @param {TPromise} [promiseValue] - The resolved promise value.
     * @returns {(ng.IPromise<TResult> | TResult)} A result value or a promise which produces the result value.
     */
    export type SupplantableChainPromiseSuccessThisCallback<TPromise, TResult, TThis> =
        (this: TThis, promiseValue?: TPromise) => ng.IPromise<TResult> | TResult;
    /**
     * Defines a callback method which handles a rejected supplantable promise.
     * @export
     * @typedef {(reason?: any) => ng.IPromise<TResult> | TResult} SupplantableChainPromiseErrorCallback
     * @template TResult - The type of result value to be produced by the callback method.
     * @param {*} [reason] - An object which represents the rejection reason.
     * @returns {(ng.IPromise<TResult> | TResult)} A result value or a promise which produces the result value.
     */
    export type SupplantableChainPromiseErrorCallback<TResult> = (reason?: any) => ng.IPromise<TResult> | TResult;
    /**
     * Defines a callback method which handles a rejected supplantable promise.
     * @export
     * @typedef {(reason?: any) => ng.IPromise<TResult> | TResult} SupplantableChainPromiseErrorThisCallback
     * @template TResult - The type of result value to be produced by the callback method.
     * @template TThis - The type of the 'this' object when the callback method is invoked.
     * @this TThis
     * @param {*} [reason] - An object which represents the rejection reason.
     * @returns {(ng.IPromise<TResult> | TResult)} A result value or a promise which produces the result value.
     */
    export type SupplantableChainPromiseErrorThisCallback<TResult, TThis> = (this: TThis, reason?: any) => ng.IPromise<TResult> | TResult;
    /**
     * Defines a callback method which handles a promise notification.
     * @export
     * @typedef {(state?: TState) => void} SupplantableChainPromiseNotifyCallback
     * @template TState - The type of object which contains the state information related to the notification.
     * @param {TState} [state] - An object which contains the state information related to the notification.
     */
    export type SupplantableChainPromiseNotifyCallback<TState> = (state?: TState) => void;
    /**
     * Defines a callback method which handles a promise notification.
     * @export
     * @typedef {(state?: TState) => void} SupplantableChainPromiseNotifyThisCallback
     * @template TState - The type of object which contains the state information related to the notification.
     * @template TThis - The type of the 'this' object when the callback method is invoked.
     * @this TThis
     * @param {TState} [state] - An object which contains the state information related to the notification.
     */
    export type SupplantableChainPromiseNotifyThisCallback<TState, TThis> = (this: TThis, state?: TState) => void;

    /**
     * An error that is thrown when a new promise chain has superceded the current one.
     * @export
     * @class PromiseChainSupersededError
     * @extends {Error}
     */
    export class PromiseChainSupersededError extends Error {
        /**
         * Creates an instance of PromiseChainSupersededError.
         * @param {string} [message] - A message that describes the error.
         * @memberof PromiseChainSupersededError
         */
        constructor(message?: string) { super(message); }
    }

    /**
     * A promise within a promise chain that can be superceded by another promise chain.
     * @export
     * @class SupplantableChainPromise
     * @implements {ng.IPromise<T>}
     * @template T - The type of value to be resolved.
     */
    export class SupplantableChainPromise<T> implements ng.IPromise<T> {
        private readonly _supplantableTaskService: SupplantablePromiseChainService;
        private readonly _taskId: symbol;
        private readonly _chainId: symbol;
        private readonly _instanceId: symbol = Symbol();

        /**
         * Creates an instance of SupplantableChainPromise to represent a following promise within a supplantable process chain.
         * @constructor
         * @memberof SupplantableTask
         * @param {ng.IPromise<T>} promise - The promise to be wrapped by this instance.
         * @param {SupplantableChainPromise<any>} preceding - The promise in a supplantable promise chain to be to be supplanted by this
         *        promise.
         */
        constructor(promise: ng.IPromise<T>, preceding: SupplantableChainPromise<any>);
        /**
         * Creates an instance of SupplantableChainPromise.
         * @constructor
         * @memberof SupplantableTask
         * @param {ng.IPromise<T>} promise - The promise to be wrapped by this instance.
         * @param {SupplantableChainPromise<any>} preceding - Either a promise within a supplantable promise chain to be to be supplanted
         *        by this promise or the preceding promise in the current promise chain.
         * @param {symbol} chainId - Unique identifier for the current promise chain.
         * @description If chainId matches the promise chain of the preceding promise, then this will be the followin promise in that
         *              promise chain; otherwise, this will be the first promise in a chain that supercedes the previous chain.
         */
        constructor(promise: ng.IPromise<T>, preceding: SupplantableChainPromise<any>, chainId: symbol);
        /**
         * Creates an instance of SupplantableChainPromise to represent a new promise chain.
         * @constructor
         * @memberof SupplantableTask
         * @param {ng.IPromise<T>} promise - The promise to be wrapped by this instance.
         * @param {symbol} taskId - The unique identifier of the promise chain to be superseded (if it exists).
         * @param {SupplantablePromiseChainService} supplantableTaskService - The Supplantable Promise Chain service which tracks
         *        supplantable promise chains.
         */
        constructor(promise: ng.IPromise<T>, taskId: symbol, supplantableTaskService: SupplantablePromiseChainService);
        constructor(private readonly _promise: ng.IPromise<T>, arg1: SupplantableChainPromise<any> | symbol,
                arg2?: SupplantablePromiseChainService | symbol) {
            if (typeof arg1 === 'symbol') {
                this._taskId = arg1;
                this._chainId = Symbol();
                this._supplantableTaskService = <SupplantablePromiseChainService>arg2;
            } else {
                this._taskId = arg1._taskId;
                this._supplantableTaskService = arg1._supplantableTaskService;
                if (typeof arg2 !== 'symbol')
                    this._chainId = Symbol();
                else {
                    this._chainId = arg2;
                    if (arg2 === arg1._chainId)
                        return;
                }
            }
        }

        /**
         * Determines whether another Supplantable Chain Promise represents the same type of supplantable promise as another.
         * @memberof SupplantableTask
         * @param {SupplantableChainPromise<any>} promise - The supplantable chain promise to compare with the current.
         * @returns {boolean} true if the other supplantable chain promise shares teh same promise type; otherwise, false.
         */
        IsSameTask(promise: SupplantableChainPromise<any>): boolean;
        /**
         * Determines whether a value is the unique identifier for the supplantble promise type.
         * @memberof SupplantableTask
         * @param {symbol} taskId - A value that uniquely identifies a promise type.
         * @returns {boolean} true if the unique identifier represents the current supplantable promise type; otherwise, false.
         */
        IsSameTask(taskId: symbol): boolean;
        IsSameTask(arg0: SupplantableChainPromise<any> | symbol): boolean {
            return this._taskId === ((typeof arg0 === 'symbol') ? arg0 : arg0._taskId);
        }

        /**
         * Determines whether another promise is part of the same supplantable promise chain.
         * @memberof SupplantableTask
         * @param {SupplantableChainPromise<any>} promise - The supplantable chain promise to compare with the current.
         * @returns {boolean} true if the other promise is part of teh same supplantable promise chain; otherwise, false.
         */
        isSameChain(promise: SupplantableChainPromise<any>): boolean;
        /**
         * Determines whether a value is the unique identifier for the current promise chain.
         * @memberof SupplantableTask
         * @param {symbol} chainId - A unique identifier representing a supplantable promise chain.
         * @returns {boolean} - true if the value is the unique identifier for the current promise chain; otherwise, false.
         */
        isSameChain(chainId: symbol): boolean;
        isSameChain(task: SupplantableChainPromise<any> | symbol): boolean {
            return this._chainId === ((typeof task === 'symbol') ? task : task._chainId);
        }
        ///*
        // *
        // *
        // * @template TThis - The type of the current object during callback invocation.
        // * @template TSuccessResult - The type of return value when the current promise is successfully resolved.
        // * @template TErrorResult - The type of return value when the current promise is rejected.
        // * @template TState - type of notification state value.
        // * @param {ISupplantablePromiseSuccessThisCallback<TThis, T, TSuccessResult>} successCallback - This gets invoked when (and if) the current promise is resolved.
        // * @param {ISupplantablePromiseErrorThisCallback<TThis, TErrorResult>} errorCallback - This gets invoked when (and if) the current promise is rejected.
        // * @param {ISupplantableTaskNotifyThisCallback<TThis, TState>} notifyCallback - This gets called when the promise notifies a state change.
        // * @param {TThis} thisArg - The object to use as the current object during callback invocation.
        // * @returns {SupplantableChainPromise<TSuccessResult> | SupplantableChainPromise<TErrorResult>} - The resulting promise.
        // * @memberof SupplantableTask
        // */
        //then<TThis, TSuccessResult, TErrorResult, TState>(successCallback: ISupplantablePromiseSuccessThisCallback<TThis, T, TSuccessResult>, errorCallback: ISupplantablePromiseErrorThisCallback<TThis, TErrorResult>, notifyCallback: ISupplantableTaskNotifyThisCallback<TThis, TState>, thisArg: TThis): SupplantableChainPromise<TSuccessResult> | SupplantableChainPromise<TErrorResult>;
        /**
         *
         *
         * @template TResult
         * @param {SupplantableChainPromiseSuccessCallback<T, TResult>} successCallback
         * @returns {SupplantableChainPromise<TResult>}
         * @memberof SupplantableChainPromise
         */
        then<TResult>(successCallback: SupplantableChainPromiseSuccessCallback<T, TResult>): SupplantableChainPromise<TResult>;
        /**
         *
         *
         * @template TResult
         * @template TThis
         * @param {SupplantableChainPromiseSuccessThisCallback<T, TResult, TThis>} successCallback
         * @param {(TThis & (TThis extends Function ? never : TThis))} thisArg
         * @returns {SupplantableChainPromise<TResult>}
         * @memberof SupplantableChainPromise
         */
        then<TResult, TThis>(successCallback: SupplantableChainPromiseSuccessThisCallback<T, TResult, TThis>,
            thisArg: TThis & (TThis extends Function ? never : TThis)): SupplantableChainPromise<TResult>;
        /**
         *
         *
         * @template TSuccessResult
         * @template TErrorResult
         * @param {SupplantableChainPromiseSuccessCallback<T, TSuccessResult>} successCallback
         * @param {SupplantableChainPromiseErrorCallback<TErrorResult>} errorCallback
         * @returns {(SupplantableChainPromise<TSuccessResult> | SupplantableChainPromise<TErrorResult>)}
         * @memberof SupplantableChainPromise
         */
        then<TSuccessResult, TErrorResult>(successCallback: SupplantableChainPromiseSuccessCallback<T, TSuccessResult>,
                errorCallback: SupplantableChainPromiseErrorCallback<TErrorResult>):
                    SupplantableChainPromise<TSuccessResult> | SupplantableChainPromise<TErrorResult>;
        /**
         *
         *
         * @template TSuccessResult
         * @template TErrorResult
         * @template TThis
         * @param {SupplantableChainPromiseSuccessThisCallback<T, TSuccessResult, TThis>} successCallback
         * @param {SupplantableChainPromiseErrorThisCallback<TErrorResult, TThis>} errorCallback
         * @param {(TThis & (TThis extends Function ? never : TThis))} thisArg
         * @returns {(SupplantableChainPromise<TSuccessResult> | SupplantableChainPromise<TErrorResult>)}
         * @memberof SupplantableChainPromise
         */
        then<TSuccessResult, TErrorResult, TThis>(successCallback: SupplantableChainPromiseSuccessThisCallback<T, TSuccessResult, TThis>,
                errorCallback: SupplantableChainPromiseErrorThisCallback<TErrorResult, TThis>,
                thisArg: TThis & (TThis extends Function ? never : TThis)):
                    SupplantableChainPromise<TSuccessResult> | SupplantableChainPromise<TErrorResult>;
        /**
         *
         *
         * @template TSuccessResult
         * @template TErrorResult
         * @template TState
         * @param {SupplantableChainPromiseSuccessCallback<T, TSuccessResult>} successCallback
         * @param {SupplantableChainPromiseErrorCallback<TErrorResult>} errorCallback
         * @param {SupplantableChainPromiseNotifyCallback<TState>} notifyCallback
         * @returns {(SupplantableChainPromise<TSuccessResult> | SupplantableChainPromise<TErrorResult>)}
         * @memberof SupplantableChainPromise
         */
        then<TSuccessResult, TErrorResult, TState>(successCallback: SupplantableChainPromiseSuccessCallback<T, TSuccessResult>,
                errorCallback: SupplantableChainPromiseErrorCallback<TErrorResult>,
                notifyCallback: SupplantableChainPromiseNotifyCallback<TState>):
                    SupplantableChainPromise<TSuccessResult> | SupplantableChainPromise<TErrorResult>;
        /**
         *
         *
         * @template TSuccessResult
         * @template TErrorResult
         * @template TState
         * @template TThis
         * @param {SupplantableChainPromiseSuccessThisCallback<T, TSuccessResult, TThis>} successCallback
         * @param {SupplantableChainPromiseErrorThisCallback<TErrorResult, TThis>} errorCallback
         * @param {SupplantableChainPromiseNotifyThisCallback<TState, TThis>} notifyCallback
         * @param {TThis} thisArg
         * @returns {(SupplantableChainPromise<TSuccessResult> | SupplantableChainPromise<TErrorResult>)}
         * @memberof SupplantableChainPromise
         */
        then<TSuccessResult, TErrorResult, TState, TThis>(
            successCallback: SupplantableChainPromiseSuccessThisCallback<T, TSuccessResult, TThis>,
            errorCallback: SupplantableChainPromiseErrorThisCallback<TErrorResult, TThis>,
            notifyCallback: SupplantableChainPromiseNotifyThisCallback<TState, TThis>, thisArg: TThis):
                SupplantableChainPromise<TSuccessResult> | SupplantableChainPromise<TErrorResult>;
        then(successCallback: SupplantableChainPromiseSuccessCallback<T, any>, arg1?: any, arg2?: any,
                thisArg?: any): SupplantableChainPromise<any> {
            let errorCallback: SupplantableChainPromiseErrorCallback<any>;
            let notifyCallback: SupplantableChainPromiseNotifyCallback<any>;
            let hasThis: boolean;
            if (typeof arg1 === 'function') {
                errorCallback = <SupplantableChainPromiseErrorCallback<any>>arg1;
                if (typeof arg2 === 'function') {
                    hasThis = arguments.length > 3;
                    notifyCallback = <SupplantableChainPromiseNotifyCallback<any>>arg2;
                } else {
                    hasThis = arguments.length === 3;
                    if (hasThis)
                        thisArg = arg2;
                }
            } else if (typeof arg2 === 'function') {
                hasThis = arguments.length > 3;
                notifyCallback = <SupplantableChainPromiseNotifyCallback<any>>arg2;
            } else if (arguments.length === 3) {
                hasThis = true;
                thisArg = arg2;
            } else {
                hasThis = arguments.length === 2;
                if (hasThis)
                    thisArg = arg1;
            }

            const task: SupplantableChainPromise<T> = this;
            if (typeof notifyCallback === 'function') {
                if (typeof errorCallback === 'function')
                    return new SupplantableChainPromise<any>(this._promise.then(function (promiseValue?: T): T | ng.IPromise<T> {
                        if (task._supplantableTaskService.isSuperceded(task))
                            throw new PromiseChainSupersededError();
                        if (hasThis) {
                            if (arguments.length == 0)
                                return successCallback.call(thisArg);
                            return successCallback.call(thisArg, promiseValue);
                        }
                        if (arguments.length == 0)
                            return successCallback();
                        return successCallback(promiseValue);
                    }, function (reason?: any): any {
                        if (hasThis) {
                            if (arguments.length == 0)
                                return errorCallback.call(thisArg);
                            return errorCallback.call(thisArg, reason);
                        }
                        if (arguments.length == 0)
                            return errorCallback();
                        return errorCallback(reason);
                    }, function (state?: any): void {
                        if (hasThis) {
                            if (arguments.length == 0)
                                return notifyCallback.call(thisArg);
                            return notifyCallback.call(thisArg, state);
                        }
                        if (arguments.length == 0)
                            return notifyCallback();
                        return notifyCallback(state);
                    }), this, this._chainId);
                return new SupplantableChainPromise<any>(this._promise.then(function (promiseValue?: T): T | ng.IPromise<T> {
                    if (task._supplantableTaskService.isSuperceded(task))
                        throw new PromiseChainSupersededError();
                    if (hasThis) {
                        if (arguments.length == 0)
                            return successCallback.call(thisArg);
                        return successCallback.call(thisArg, promiseValue);
                    }
                    if (arguments.length == 0)
                        return successCallback();
                    return successCallback(promiseValue);
                }, undefined, function (state?: any): void {
                    if (hasThis) {
                        if (arguments.length == 0)
                            return notifyCallback.call(thisArg);
                        return notifyCallback.call(thisArg, state);
                    }
                    if (arguments.length == 0)
                        return notifyCallback();
                    return notifyCallback(state);
                }), this, this._chainId);
            }
            if (typeof errorCallback === 'function')
                return new SupplantableChainPromise<any>(this._promise.then(function (promiseValue?: T): T | ng.IPromise<T> {
                    if (task._supplantableTaskService.isSuperceded(task))
                        throw new PromiseChainSupersededError();
                    if (hasThis) {
                        if (arguments.length == 0)
                            return successCallback.call(thisArg);
                        return successCallback.call(thisArg, promiseValue);
                    }
                    if (arguments.length == 0)
                        return successCallback();
                    return successCallback(promiseValue);
                }, function (reason?: any): any {
                    if (hasThis) {
                        if (arguments.length == 0)
                            return errorCallback.call(thisArg);
                        return errorCallback.call(thisArg, reason);
                    }
                    if (arguments.length == 0)
                        return errorCallback();
                    return errorCallback(reason);
                }), this, this._chainId);
            return new SupplantableChainPromise<any>(this._promise.then(function (promiseValue?: T): T | ng.IPromise<T> {
                if (task._supplantableTaskService.isSuperceded(task))
                    throw new PromiseChainSupersededError();
                if (hasThis) {
                    if (arguments.length == 0)
                        return successCallback.call(thisArg);
                    return successCallback.call(thisArg, promiseValue);
                }
                if (arguments.length == 0)
                    return successCallback();
                return successCallback(promiseValue);
            }), this, this._chainId);
        }

        /**
         *
         *
         * @template TResult
         * @param {({ (reason: any): TResult | ng.IPromise<TResult>; })} onRejected
         * @returns {SupplantableChainPromise<TResult>}
         * @memberof SupplantableTask
         */
        catch<TResult>(onRejected: (reason?: any) => TResult | ng.IPromise<TResult>): SupplantableChainPromise<TResult>;
        /**
         *
         *
         * @template TThis
         * @template TResult
         * @param {({ (this: TThis, reason: any): TResult | ng.IPromise<TResult>; })} onRejected
         * @param {TThis} thisArg
         * @returns {SupplantableChainPromise<TResult>}
         * @memberof SupplantableTask
         */
        catch<TThis, TResult>(onRejected: (this: TThis, reason?: any) => TResult | ng.IPromise<TResult>,
            thisArg: TThis): SupplantableChainPromise<TResult>;
        catch<TResult>(onRejected: (reason?: any) => TResult | ng.IPromise<TResult>, thisArg?: any): SupplantableChainPromise<TResult> {
            const task: SupplantableChainPromise<T> = this;
            if (arguments.length > 1)
                return new SupplantableChainPromise<TResult>(this._promise.catch<TResult>(function (reason: any) {
                    return onRejected.call(thisArg, reason);
                }), this, this._chainId);
            return new SupplantableChainPromise<TResult>(this._promise.catch<TResult>(function (reason: any) {
                return onRejected(reason);
            }), this, this._chainId);
        }

        /**
         *
         *
         * @param {{ (isSuperseded: boolean): any; }} finallyCallback
         * @returns {SupplantableChainPromise<T>}
         * @memberof SupplantableTask
         */
        finally(finallyCallback: (isSuperseded: boolean) => any): SupplantableChainPromise<T>;
        /**
         *
         *
         * @template TThis
         * @param {{ (this: TThis, isSuperseded: boolean): any; }} finallyCallback
         * @param {TThis} thisArg
         * @returns {SupplantableChainPromise<T>}
         * @memberof SupplantableTask
         */
        finally<TThis>(finallyCallback: (this: TThis, isSuperseded: boolean) => any, thisArg: TThis): SupplantableChainPromise<T>;
        finally(finallyCallback: (isSuperseded: boolean) => any, thisArg?: any): SupplantableChainPromise<T> {
            const task: SupplantableChainPromise<T> = this;
            if (arguments.length > 1)
                return new SupplantableChainPromise<T>(this._promise.finally(function () {
                    return finallyCallback.call(thisArg, task._supplantableTaskService.isSuperceded(task));
                }), this, this._chainId);
            return new SupplantableChainPromise<T>(this._promise.finally(function () {
                return finallyCallback(task._supplantableTaskService.isSuperceded(task));
            }), this, this._chainId);
        }
    }

    /**
     *
     * @export
     * @class SupplantablePromiseChainService
     */
    export class SupplantablePromiseChainService {
        private readonly _tasks: SupplantableChainPromise<any>[] = [];

        readonly [Symbol.toStringTag]: string = ServiceNames.supplantablePromiseChain;

        /**
         *Creates an instance of SupplantablePromiseChainService.
         * @param {ng.IQService} $q
         * @param {ng.IIntervalService} $interval
         * @memberof SupplantablePromiseChainService
         */
        constructor(private readonly $q: ng.IQService, private readonly $interval: ng.IIntervalService) {
        }

        /**
         *
         *
         * @param {SupplantableChainPromise<any>} task
         * @returns {boolean}
         * @memberof SupplantablePromiseChainService
         */
        isSuperceded(task: SupplantableChainPromise<any>): boolean {
            for (let i = 0; i < this._tasks.length; i++) {
                if (this._tasks[i].IsSameTask(task))
                    return !this._tasks[i].isSameChain(task);
            }
            return false;
        }

        /**
         *
         *
         * @template T
         * @param {symbol} taskId
         * @param {{ (resolve: ng.IQResolveReject<T>): any; }} resolver
         * @returns {SupplantableChainPromise<T>}
         * @memberof SupplantablePromiseChainService
         */
        start<T>(taskId: symbol, resolver: (resolve: ng.IQResolveReject<T>) => any): SupplantableChainPromise<T>;
        /**
         *
         *
         * @template TThis
         * @template T
         * @param {TThis} this
         * @param {symbol} taskId
         * @param {{ (resolve: ng.IQResolveReject<T>): any; }} resolver
         * @param {(TThis & (TThis extends number ? never : TThis))} thisArg
         * @returns {SupplantableChainPromise<T>}
         * @memberof SupplantablePromiseChainService
         */
        start<TThis, T>(this: TThis, taskId: symbol, resolver: (resolve: ng.IQResolveReject<T>) => any,
            thisArg: TThis & (TThis extends number ? never : TThis)): SupplantableChainPromise<T>;
        /**
         *
         *
         * @template T
         * @param {symbol} taskId
         * @param {{ (resolve: ng.IQResolveReject<T>, reject: ng.IQResolveReject<any>): any; }} resolver
         * @returns {SupplantableChainPromise<T>}
         * @memberof SupplantablePromiseChainService
         */
        start<T>(taskId: symbol, resolver: (resolve: ng.IQResolveReject<T>,
            reject: ng.IQResolveReject<any>) => any): SupplantableChainPromise<T>;
        /**
         *
         *
         * @template TThis
         * @template T
         * @param {TThis} this
         * @param {symbol} taskId
         * @param {{ (resolve: ng.IQResolveReject<T>, reject: ng.IQResolveReject<any>): any; }} resolver
         * @param {(TThis & (TThis extends number ? never : TThis))} thisArg
         * @returns {SupplantableChainPromise<T>}
         * @memberof SupplantablePromiseChainService
         */
        start<TThis, T>(this: TThis, taskId: symbol, resolver: (resolve: ng.IQResolveReject<T>, reject: ng.IQResolveReject<any>) => any,
            thisArg: TThis & (TThis extends number ? never : TThis)): SupplantableChainPromise<T>;
        /**
         *
         *
         * @template T
         * @param {symbol} taskId
         * @param {{ (resolve: ng.IQResolveReject<T>, reject: ng.IQResolveReject<any>, notify: ng.IQResolveReject<any>): any; }} resolver
         * @returns {SupplantableChainPromise<T>}
         * @memberof SupplantablePromiseChainService
         */
        start<T>(taskId: symbol, resolver: (resolve: ng.IQResolveReject<T>, reject: ng.IQResolveReject<any>,
            notify: ng.IQResolveReject<any>) => any): SupplantableChainPromise<T>;
        /**
         *
         *
         * @template TThis
         * @template T
         * @param {TThis} this
         * @param {symbol} taskId
         * @param {{ (resolve: ng.IQResolveReject<T>, reject: ng.IQResolveReject<any>, notify: ng.IQResolveReject<any>): any; }} resolver
         * @param {(TThis & (TThis extends number ? never : TThis))} thisArg
         * @returns {SupplantableChainPromise<T>}
         * @memberof SupplantablePromiseChainService
         */
        start<TThis, T>(this: TThis, taskId: symbol, resolver: (resolve: ng.IQResolveReject<T>, reject: ng.IQResolveReject<any>,
            notify: ng.IQResolveReject<any>) => any, thisArg: TThis & (TThis extends number ? never : TThis)): SupplantableChainPromise<T>;
        /**
         *
         *
         * @template T
         * @param {symbol} taskId
         * @param {{ (resolve: ng.IQResolveReject<T>): any; }} resolver
         * @param {number} delay
         * @returns {SupplantableChainPromise<T>}
         * @memberof SupplantablePromiseChainService
         */
        start<T>(taskId: symbol, resolver: (resolve: ng.IQResolveReject<T>) => any, delay: number): SupplantableChainPromise<T>;
        /**
         *
         *
         * @template TThis
         * @template T
         * @param {TThis} this
         * @param {symbol} taskId
         * @param {{ (resolve: ng.IQResolveReject<T>): any; }} resolver
         * @param {number} delay
         * @param {TThis} thisArg
         * @returns {SupplantableChainPromise<T>}
         * @memberof SupplantablePromiseChainService
         */
        start<TThis, T>(this: TThis, taskId: symbol, resolver: (resolve: ng.IQResolveReject<T>) => any, delay: number,
            thisArg: TThis): SupplantableChainPromise<T>;
        /**
         *
         *
         * @template T
         * @param {symbol} taskId
         * @param {{ (resolve: ng.IQResolveReject<T>, reject: ng.IQResolveReject<any>): any; }} resolver
         * @param {number} delay
         * @returns {SupplantableChainPromise<T>}
         * @memberof SupplantablePromiseChainService
         */
        start<T>(taskId: symbol, resolver: (resolve: ng.IQResolveReject<T>, reject: ng.IQResolveReject<any>) => any,
            delay: number): SupplantableChainPromise<T>;
        /**
         *
         *
         * @template TThis
         * @template T
         * @param {TThis} this
         * @param {symbol} taskId
         * @param {{ (resolve: ng.IQResolveReject<T>, reject: ng.IQResolveReject<any>): any; }} resolver
         * @param {number} delay
         * @param {TThis} thisArg
         * @returns {SupplantableChainPromise<T>}
         * @memberof SupplantablePromiseChainService
         */
        start<TThis, T>(this: TThis, taskId: symbol, resolver: (resolve: ng.IQResolveReject<T>, reject: ng.IQResolveReject<any>) => any,
            delay: number, thisArg: TThis): SupplantableChainPromise<T>;
        /**
         *
         *
         * @template T
         * @param {symbol} taskId
         * @param {{ (resolve: ng.IQResolveReject<T>, reject: ng.IQResolveReject<any>, notify: ng.IQResolveReject<any>): any; }} resolver
         * @param {number} delay
         * @returns {SupplantableChainPromise<T>}
         * @memberof SupplantablePromiseChainService
         */
        start<T>(taskId: symbol, resolver: (resolve: ng.IQResolveReject<T>, reject: ng.IQResolveReject<any>,
            notify: ng.IQResolveReject<any>) => any, delay: number): SupplantableChainPromise<T>;
        /**
         *
         *
         * @template TThis
         * @template T
         * @param {TThis} this
         * @param {symbol} taskId
         * @param {{ (resolve: ng.IQResolveReject<T>, reject: ng.IQResolveReject<any>, notify: ng.IQResolveReject<any>): any; }} resolver
         * @param {number} delay
         * @param {TThis} thisArg
         * @returns {SupplantableChainPromise<T>}
         * @memberof SupplantablePromiseChainService
         */
        start<TThis, T>(this: TThis, taskId: symbol, resolver: (resolve: ng.IQResolveReject<T>, reject: ng.IQResolveReject<any>,
            notify: ng.IQResolveReject<any>) => any, delay: number, thisArg: TThis): SupplantableChainPromise<T>;
        start<T>(taskId: symbol, resolver: (resolve: ng.IQResolveReject<T>, reject: ng.IQResolveReject<any>,
                notify: ng.IQResolveReject<any>) => any, arg2?: any, thisArg?: any): SupplantableChainPromise<T> {
            const deferred: ng.IDeferred<T> = this.$q.defer<T>();
            const svc: SupplantablePromiseChainService = this;
            let delay: number;
            let hasThis: boolean;
            if (typeof arg2 === 'number') {
                hasThis = arguments.length > 3;
                delay = (isNaN(arg2)) ? 0 : arg2;
            } else {
                if (arguments.length == 3) {
                    thisArg = arg2;
                    hasThis = true;
                } else
                    hasThis = arguments.length > 3;
            }
            this.$interval(function () {
                const resolve: ng.IQResolveReject<T> = function (value?: T): void {
                    if (arguments.length == 0)
                        deferred.resolve();
                    else
                        deferred.resolve(value);
                };
                const reject: ng.IQResolveReject<any> = function (reason?: any) {
                    if (arguments.length == 0)
                        deferred.reject();
                    else
                        deferred.reject(reason);
                };
                const notify: ng.IQResolveReject<any> = function (state?: any) {
                    if (arguments.length == 0)
                        deferred.notify();
                    else
                        deferred.notify(state);
                };
                if (hasThis)
                    return resolver.call(thisArg, resolve, reject, notify);
                return resolver(resolve, reject, notify);
            }, delay, 1, true);
            let result: SupplantableChainPromise<T>;
            for (let i = 0; i < this._tasks.length; i++) {
                if (this._tasks[i].IsSameTask(taskId)) {
                    result = new SupplantableChainPromise<T>(deferred.promise, this._tasks[i]);
                    this._tasks[i] = result;
                    return result;
                }
            }
            result = new SupplantableChainPromise<T>(deferred.promise, taskId, this);
            this._tasks.push(result);
            return result;
        }
    }

    /**
     * Service which tracks updates the current app page title.
     * @export
     * @class PageTitleService
     */
    export class PageTitleService {
        private _pageTitle = 'Lenny\'s GitHub Repositories';
        private _pageSubTitle = '';
        private _regexHref: string = NavPrefix + ModulePaths.regexMatch;
        private _scope: IMainContentControllerScope;
        readonly [Symbol.toStringTag]: string = ServiceNames.pageTitle;

        constructor() { }
        
        /**
         * Gets or sets the default URL for the regular expression tester page.
         * @param {string} [value] - If defined, this will set the default URL for the regular expression tester page.
         * @returns {string} The default URL for the regular expression tester page.
         * @memberof PageTitleService
         */
        regexHref(value?: string): string {
            if (typeof value === 'string') {
                if ((value = value.trim()).length > 0) {
                    this._regexHref = value;
                    if (typeof this._scope !== 'undefined')
                        this._scope.regexHref = this._regexHref;
                }
            }
            return this._regexHref;
        }

        /**
         * Gets or sets the the current page title.
         * @param {string} [value] - If defined, this wil set the current page title.
         * @returns {string} The current page title.
         * @memberof PageTitleService
         */
        pageTitle(value?: string): string {
            if (typeof value === 'string') {
                this._pageTitle = ((value = value.trim()).length == 0) ? 'Lenny\'s GitHub Page' : value;
                if (typeof this._scope !== 'undefined')
                    this._scope.pageTitle = this._pageTitle;
            }
            return this._pageTitle;
        }

        /**
         * Gets or sets the current page subtitle.
         * @param {string} [value] - If defined, this will set the current page title.
         * @returns {string} - The current page title or an empty string if there is currently no subtitle.
         * @memberof PageTitleService
         */
        pageSubTitle(value?: string): string {
            if (typeof value === 'string') {
                this._pageSubTitle = value;
                if (typeof this._scope !== 'undefined')
                    this._scope.showSubtitle = (this._scope.subTitle = this._pageSubTitle).trim().length > 0;
            }
            return this._pageSubTitle;
        }

        /**
         * This should only be called by the main controller so the main controller's page title properties can be updated.
         * @param {IMainContentControllerScope} scope - The scope of the main application controller.
         * @memberof PageTitleService
         */
        setScope(scope: IMainContentControllerScope): void {
            if (typeof scope === 'object' && scope !== null) {
                (this._scope = scope).pageTitle = this._pageTitle;
                scope.showSubtitle = (scope.subTitle = this._pageSubTitle).trim().length > 0;
                this._scope.regexHref = this._regexHref;
            }
        }
    }

    /**
     * Defines the scope object for the main application controller.
     * @export
     * @interface IMainContentControllerScope
     * @extends {ng.IScope}
     */
    export interface IMainContentControllerScope extends ng.IScope {
        /**
         * The current page title.
         * @type {string}
         * @memberof IMainContentControllerScope
         */
        pageTitle: string;

        /**
         * Indicates whether the current page has a subtitle to be displayed.
         * @type {boolean}
         * @memberof IMainContentControllerScope
         */
        showSubtitle: boolean;

        /**
         * The subtitle for the current page.
         * @type {string}
         * @memberof IMainContentControllerScope
         */
        subTitle: string;

        /**
         * The URL For the default regular expressions tester page.
         * @type {string}
         * @memberof IMainContentControllerScope
         */
        regexHref: string;
    }

    /**
     * The main application controller.
     * @export
     * @class MainContentController
     * @implements {ng.IController}
     */
    export class MainContentController implements ng.IController {
        readonly [Symbol.toStringTag]: string = ControllerNames.mainContent;

        /**
         * Creates an instance of MainContentController.
         * @param {IMainContentControllerScope} $scope
         * @param {PageTitleService} pageTitleService
         * @memberof MainContentController
         */
        constructor(private readonly $scope: IMainContentControllerScope, pageTitleService: PageTitleService) {
            const ctrl: MainContentController = this;
            $scope.regexHref = NavPrefix + ModulePaths.regexMatch;
            pageTitleService.setScope($scope);
        }
        $doCheck(): void { }
    }

    export let mainModule: ng.IModule = angular.module(ModuleNames.app, ['ngRoute'])
        .config(['$locationProvider', '$routeProvider', function ($locationProvider: ng.ILocationProvider,
                $routeProvider: ng.route.IRouteProvider) {
            $locationProvider.hashPrefix(HashPrefix);
            $routeProvider.when(ModulePaths.home, {
                templateUrl: 'home/home.htm',
                controller: ControllerNames.homePage
            }).when(ModulePaths.git, {
                templateUrl: 'git.htm'
            }).when(ModulePaths.vscode, {
                templateUrl: 'vscode.htm'
            }).when(ModulePaths.npm, {
                templateUrl: 'npm.htm'
            }).when(ModulePaths.regexMatch, {
                templateUrl: 'regexTester/match.htm',
                controller: ControllerNames.regexMatch
            }).when(ModulePaths.regexReplace, {
                templateUrl: 'regexTester/replace.htm',
                controller: ControllerNames.regexReplace
            }).when(ModulePaths.regexSplit, {
                templateUrl: 'regexTester/split.htm',
                controller: ControllerNames.regexSplit
            }).when(ModulePaths.uriBuilder, {
                templateUrl: 'uriBuilder/uriBuilder.htm',
                controller: ControllerNames.uriBuilder
            }).when(ModulePaths.colorBuilder, {
                templateUrl: 'colorBuilder/colorBuilder.htm',
                controller: ControllerNames.colorBuilder
            }).when('/', { redirectTo: ModulePaths.home });
        }])
        .service(ServiceNames.supplantablePromiseChain, ['$q', '$interval', SupplantablePromiseChainService])
        .service(ServiceNames.pageTitle, PageTitleService)
        .controller(ControllerNames.mainContent, ['$scope', ServiceNames.pageTitle, MainContentController]);
}
