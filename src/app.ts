/// <reference path="Scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="Scripts/typings/angularjs/angular-route.d.ts"/>
/// <reference path="Scripts/typings/bootstrap/index.d.ts"/>

/**
 * The commonjs module corresponding to the MyGitHubPages angular js module.
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
        app: 'MyGitHubPages', regexTester: 'MyGitHubPages.regexTester', uriBuilder: 'MyGitHubPages.uriBuilder',
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
         * The name of controller for static pages.
         * @type: {"staticPageController"}
         * @readonly
         */
        readonly staticPage: 'staticPageController';
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
        mainContent: 'mainContentController', staticPage: 'staticPageController', regexMatch: 'regexMatchController',
        regexReplace: 'regexReplaceController', regexSplit: 'regexSplitController', uriBuilder: 'uriBuilderPageController',
        colorBuilder: 'colorBuilderPageController'
    };

    /**
     * Statically defined names of services and providers that are registered.
     * @export
     * @interface IServiceNames
     */
    export interface IServiceNames {
        ///**
        // * The name of the Supplantable Promise Chain service.
        // * @type: {"supplantablePromiseChainService"}
        // * @readonly
        // */
        //readonly supplantablePromiseChain: 'supplantablePromiseChainService';
        /**
         * The name of the Page Location service.
         * @type: {"pageLocationService"}
         * @readonly
         */
        readonly pageLocation: 'pageLocationService';
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
        /*supplantablePromiseChain: 'supplantablePromiseChainService', */pageLocation: 'pageLocationService',
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
        ///**
        // * The name of the regexPatternChanged2 event.
        // * @type: {"MyGitHubPages.regexPatternChanged"}
        // * @readonly
        // */
        //readonly regexPatternChanged: 'MyGitHubPages.regexPatternChanged';
        ///**
        // * The name of the regexFlagsChanged2 event.
        // * @type: {"MyGitHubPages.regexFlagsChanged"}
        // * @readonly
        // */
        //readonly regexFlagsChanged: 'MyGitHubPages.regexFlagsChanged';
        ///**
        // * The name of the startRegexPatternParse2 event.
        // * @type: {"MyGitHubPages.startRegexPatternParse"}
        // * @readonly
        // */
        //readonly startRegexPatternParse: 'MyGitHubPages.startRegexPatternParse';
        ///**
        // * The name of the endRegexPatternParse2 event.
        // * @type: {"MyGitHubPages.endRegexPatternParse"}
        // * @readonly
        // */
        //readonly endRegexPatternParse: 'MyGitHubPages.endRegexPatternParse';
        ///**
        // * The name of the regexPatternParseError2 event.
        // * @type: {"MyGitHubPages.regexPatternParseError"}
        // * @readonly
        // */
        //readonly regexPatternParseError: 'MyGitHubPages.regexPatternParseError';
        ///**
        // * The name of the regexPatternParseSuccess event.
        // * @type: {"MyGitHubPages.regexPatternParseSuccess"}
        // * @readonly
        // */
        //readonly regexPatternParseSuccess: 'MyGitHubPages.regexPatternParseSuccess';
        ///**
        // * The name of the regexObjectChanged2 event.
        // * @type: {"MyGitHubPages.regexObjectChanged"}
        // * @readonly
        // */
        //readonly regexObjectChanged: 'MyGitHubPages.regexObjectChanged';
    }
    /**
     * Custom event names.
     * @export
     * @constant EventNames
     * @type {IEventNames}
     */
    export const EventNames: IEventNames = {
        setPageTitle: 'MyGitHubPages.setPageTitle', topNavChanged: 'MyGitHubPages.topNavChanged',
        //regexPatternChanged: 'MyGitHubPages.regexPatternChanged', regexFlagsChanged: 'MyGitHubPages.regexFlagsChanged',
        //startRegexPatternParse: 'MyGitHubPages.startRegexPatternParse', endRegexPatternParse: 'MyGitHubPages.endRegexPatternParse',
        //regexPatternParseError: 'MyGitHubPages.regexPatternParseError', regexPatternParseSuccess: 'MyGitHubPages.regexPatternParseSuccess',
        //regexObjectChanged: 'MyGitHubPages.regexObjectChanged'
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

    ///**
    // * Defines a callback method which handles a successfully resolved supplantable promise.
    // * @export
    // * @typedef {(promiseValue?: TPromise) => ng.IPromise<TResult> | TResult} SupplantableChainPromiseSuccessCallback
    // * @template TPromise - The type of value to be resolved.
    // * @template TResult - The type of result value to be produced by the callback method.
    // * @param {TPromise} [promiseValue] - The resolved promise value.
    // * @returns {(ng.IPromise<TResult> | TResult)} A result value or a promise which produces the result value.
    // */
    //export type SupplantableChainPromiseSuccessCallback<TPromise, TResult> = (promiseValue?: TPromise) => ng.IPromise<TResult> | TResult;
    ///**
    // * Defines a callback method which handles a successfully resolved supplantable promise.
    // * @export
    // * @typedef {(promiseValue?: TPromise) => ng.IPromise<TResult> | TResult} SupplantableChainPromiseSuccessThisCallback
    // * @template TPromise - The type of value to be resolved.
    // * @template TResult - The type of result value to be produced by the callback method.
    // * @template TThis - The type of the 'this' object when the callback method is invoked.
    // * @this TThis
    // * @param {TPromise} [promiseValue] - The resolved promise value.
    // * @returns {(ng.IPromise<TResult> | TResult)} A result value or a promise which produces the result value.
    // */
    //export type SupplantableChainPromiseSuccessThisCallback<TPromise, TResult, TThis> =
    //    (this: TThis, promiseValue?: TPromise) => ng.IPromise<TResult> | TResult;
    ///**
    // * Defines a callback method which handles a rejected supplantable promise.
    // * @export
    // * @typedef {(reason?: any) => ng.IPromise<TResult> | TResult} SupplantableChainPromiseErrorCallback
    // * @template TResult - The type of result value to be produced by the callback method.
    // * @param {*} [reason] - An object which represents the rejection reason.
    // * @returns {(ng.IPromise<TResult> | TResult)} A result value or a promise which produces the result value.
    // */
    //export type SupplantableChainPromiseErrorCallback<TResult> = (reason?: any) => ng.IPromise<TResult> | TResult;
    ///**
    // * Defines a callback method which handles a rejected supplantable promise.
    // * @export
    // * @typedef {(reason?: any) => ng.IPromise<TResult> | TResult} SupplantableChainPromiseErrorThisCallback
    // * @template TResult - The type of result value to be produced by the callback method.
    // * @template TThis - The type of the 'this' object when the callback method is invoked.
    // * @this TThis
    // * @param {*} [reason] - An object which represents the rejection reason.
    // * @returns {(ng.IPromise<TResult> | TResult)} A result value or a promise which produces the result value.
    // */
    //export type SupplantableChainPromiseErrorThisCallback<TResult, TThis> = (this: TThis, reason?: any) => ng.IPromise<TResult> | TResult;
    ///**
    // * Defines a callback method which handles a promise notification.
    // * @export
    // * @typedef {(state?: TState) => void} SupplantableChainPromiseNotifyCallback
    // * @template TState - The type of object which contains the state information related to the notification.
    // * @param {TState} [state] - An object which contains the state information related to the notification.
    // */
    //export type SupplantableChainPromiseNotifyCallback<TState> = (state?: TState) => void;
    ///**
    // * Defines a callback method which handles a promise notification.
    // * @export
    // * @typedef {(state?: TState) => void} SupplantableChainPromiseNotifyThisCallback
    // * @template TState - The type of object which contains the state information related to the notification.
    // * @template TThis - The type of the 'this' object when the callback method is invoked.
    // * @this TThis
    // * @param {TState} [state] - An object which contains the state information related to the notification.
    // */
    //export type SupplantableChainPromiseNotifyThisCallback<TState, TThis> = (this: TThis, state?: TState) => void;

    ///**
    // * An error that is thrown when a new promise chain has superceded the current one.
    // * @export
    // * @class PromiseChainSupersededError
    // * @extends {Error}
    // */
    //export class PromiseChainSupersededError extends Error {
    //    /**
    //     * Creates an instance of PromiseChainSupersededError.
    //     * @param {string} [message] - A message that describes the error.
    //     * @memberof PromiseChainSupersededError
    //     */
    //    constructor(message?: string) { super(message); }
    //}

    ///**
    // * A promise within a promise chain that can be superceded by another promise chain.
    // * @export
    // * @class SupplantableChainPromise
    // * @implements {ng.IPromise<T>}
    // * @template V - The type of value to be resolved.
    // */
    //export class SupplantableChainPromise<V> implements ng.IPromise<V> {
    //    private readonly _supplantableTaskService: SupplantablePromiseChainService;
    //    private readonly _taskId: symbol;
    //    private readonly _chainId: symbol;
    //    private readonly _instanceId: symbol = Symbol();

    //    /**
    //     * Creates an instance of SupplantableChainPromise to represent a following promise within a supplantable process chain.
    //     * @constructor
    //     * @memberof SupplantableTask
    //     * @param {ng.IPromise<V>} promise - The promise to be wrapped by this instance.
    //     * @param {SupplantableChainPromise<any>} preceding - The promise in a supplantable promise chain to be to be supplanted by this
    //     *        promise.
    //     */
    //    constructor(promise: ng.IPromise<V>, preceding: SupplantableChainPromise<any>);
    //    /**
    //     * Creates an instance of SupplantableChainPromise.
    //     * @constructor
    //     * @memberof SupplantableTask
    //     * @param {ng.IPromise<V>} promise - The promise to be wrapped by this instance.
    //     * @param {SupplantableChainPromise<any>} preceding - Either a promise within a supplantable promise chain to be to be supplanted
    //     *        by this promise or the preceding promise in the current promise chain.
    //     * @param {symbol} chainId - Unique identifier for the current promise chain.
    //     * @description If chainId matches the promise chain of the preceding promise, then this will be the followin promise in that
    //     *              promise chain; otherwise, this will be the first promise in a chain that supercedes the previous chain.
    //     */
    //    constructor(promise: ng.IPromise<V>, preceding: SupplantableChainPromise<any>, chainId: symbol);
    //    /**
    //     * Creates an instance of SupplantableChainPromise to represent a new promise chain.
    //     * @constructor
    //     * @memberof SupplantableTask
    //     * @param {ng.IPromise<V>} promise - The promise to be wrapped by this instance.
    //     * @param {symbol} taskId - The unique identifier of the promise chain to be superseded (if it exists).
    //     * @param {SupplantablePromiseChainService} supplantableTaskService - The Supplantable Promise Chain service which tracks
    //     *        supplantable promise chains.
    //     */
    //    constructor(promise: ng.IPromise<V>, taskId: symbol, supplantableTaskService: SupplantablePromiseChainService);
    //    constructor(private readonly _promise: ng.IPromise<V>, arg1: SupplantableChainPromise<any> | symbol,
    //            arg2?: SupplantablePromiseChainService | symbol) {
    //        if (typeof arg1 === 'symbol') {
    //            this._taskId = arg1;
    //            this._chainId = Symbol();
    //            this._supplantableTaskService = <SupplantablePromiseChainService>arg2;
    //        } else {
    //            this._taskId = arg1._taskId;
    //            this._supplantableTaskService = arg1._supplantableTaskService;
    //            if (typeof arg2 !== 'symbol')
    //                this._chainId = Symbol();
    //            else {
    //                this._chainId = arg2;
    //                if (arg2 === arg1._chainId)
    //                    return;
    //            }
    //        }
    //    }

    //    /**
    //     * Determines whether another Supplantable Chain Promise represents the same type of supplantable promise as another.
    //     * @memberof SupplantableTask
    //     * @param {SupplantableChainPromise<any>} promise - The supplantable chain promise to compare with the current.
    //     * @returns {boolean} true if the other supplantable chain promise shares teh same promise type; otherwise, false.
    //     */
    //    IsSameTask(promise: SupplantableChainPromise<any>): boolean;
    //    /**
    //     * Determines whether a value is the unique identifier for the supplantble promise type.
    //     * @memberof SupplantableTask
    //     * @param {symbol} taskId - A value that uniquely identifies a promise type.
    //     * @returns {boolean} true if the unique identifier represents the current supplantable promise type; otherwise, false.
    //     */
    //    IsSameTask(taskId: symbol): boolean;
    //    IsSameTask(arg0: SupplantableChainPromise<any> | symbol): boolean {
    //        return this._taskId === ((typeof arg0 === 'symbol') ? arg0 : arg0._taskId);
    //    }

    //    /**
    //     * Determines whether another promise is part of the same supplantable promise chain.
    //     * @memberof SupplantableTask
    //     * @param {SupplantableChainPromise<any>} promise - The supplantable chain promise to compare with the current.
    //     * @returns {boolean} true if the other promise is part of teh same supplantable promise chain; otherwise, false.
    //     */
    //    isSameChain(promise: SupplantableChainPromise<any>): boolean;
    //    /**
    //     * Determines whether a value is the unique identifier for the current promise chain.
    //     * @memberof SupplantableTask
    //     * @param {symbol} chainId - A unique identifier representing a supplantable promise chain.
    //     * @returns {boolean} - true if the value is the unique identifier for the current promise chain; otherwise, false.
    //     */
    //    isSameChain(chainId: symbol): boolean;
    //    isSameChain(arg0: SupplantableChainPromise<any> | symbol): boolean {
    //        return this._chainId === ((typeof arg0 === 'symbol') ? arg0 : arg0._chainId);
    //    }

    //    /**
    //     *
    //     *
    //     * @template R
    //     * @param {SupplantableChainPromiseSuccessCallback<V, R>} successCallback
    //     * @returns {SupplantableChainPromise<R>}
    //     * @memberof SupplantableChainPromise
    //     */
    //    then<R>(successCallback: SupplantableChainPromiseSuccessCallback<V, R>): SupplantableChainPromise<R>;
    //    /**
    //     *
    //     *
    //     * @template R
    //     * @template E
    //     * @param {SupplantableChainPromiseSuccessCallback<V, R>} successCallback
    //     * @param {SupplantableChainPromiseErrorCallback<E>} errorCallback
    //     * @returns {(SupplantableChainPromise<R> | SupplantableChainPromise<E>)}
    //     * @memberof SupplantableChainPromise
    //     */
    //    then<R, E>(successCallback: SupplantableChainPromiseSuccessCallback<V, R>,
    //            errorCallback: SupplantableChainPromiseErrorCallback<E>):
    //                SupplantableChainPromise<R> | SupplantableChainPromise<E>;
    //    /**
    //     *
    //     *
    //     * @template R
    //     * @template E
    //     * @template S
    //     * @param {SupplantableChainPromiseSuccessCallback<V, R>} successCallback
    //     * @param {SupplantableChainPromiseErrorCallback<E>} errorCallback
    //     * @param {SupplantableChainPromiseNotifyCallback<S>} notifyCallback
    //     * @returns {(SupplantableChainPromise<R> | SupplantableChainPromise<E>)}
    //     * @memberof SupplantableChainPromise
    //     */
    //    then<R, E, S>(successCallback: SupplantableChainPromiseSuccessCallback < V, R > ,
    //        errorCallback: SupplantableChainPromiseErrorCallback < E > ,
    //        notifyCallback: SupplantableChainPromiseNotifyCallback<S>): SupplantableChainPromise<R> | SupplantableChainPromise<E>;
    //    then<R, E, S, T>(successCallback: SupplantableChainPromiseSuccessCallback < V, R > ,
    //        errorCallback: SupplantableChainPromiseErrorCallback < E > ,
    //        notifyCallback: SupplantableChainPromiseNotifyCallback<S>,
    //        thisArg: T): SupplantableChainPromise<R> | SupplantableChainPromise<E>;
    //    then(successCallback: SupplantableChainPromiseSuccessCallback<V, any>, errorCallback?: SupplantableChainPromiseErrorCallback<any> ,
    //            notifyCallback?: SupplantableChainPromiseNotifyCallback<any>,
    //            thisArg?: any): SupplantableChainPromise<any> {
    //        const task: SupplantableChainPromise<V> = this;
    //        const hasThis = arguments.length > 3;
    //        if (typeof notifyCallback === 'function') {
    //            if (typeof errorCallback === 'function')
    //                return new SupplantableChainPromise<any>(this._promise.then(function (promiseValue?: V): V | ng.IPromise<V> {
    //                    if (task._supplantableTaskService.isSuperceded(task))
    //                        throw new PromiseChainSupersededError();
    //                    if (hasThis) {
    //                        if (arguments.length == 0)
    //                            return successCallback.call(thisArg);
    //                        return successCallback.call(thisArg, promiseValue);
    //                    }
    //                    if (arguments.length == 0)
    //                        return successCallback();
    //                    return successCallback(promiseValue);
    //                }, function (reason?: any): any {
    //                    if (hasThis) {
    //                        if (arguments.length == 0)
    //                            return errorCallback.call(thisArg);
    //                        return errorCallback.call(thisArg, reason);
    //                    }
    //                    if (arguments.length == 0)
    //                        return errorCallback();
    //                    return errorCallback(reason);
    //                }, function (state?: any): void {
    //                    if (hasThis) {
    //                        if (arguments.length == 0)
    //                            return notifyCallback.call(thisArg);
    //                        return notifyCallback.call(thisArg, state);
    //                    }
    //                    if (arguments.length == 0)
    //                        return notifyCallback();
    //                    return notifyCallback(state);
    //                }), this, this._chainId);
    //            return new SupplantableChainPromise<any>(this._promise.then(function (promiseValue?: V): V | ng.IPromise<V> {
    //                if (task._supplantableTaskService.isSuperceded(task))
    //                    throw new PromiseChainSupersededError();
    //                if (hasThis) {
    //                    if (arguments.length == 0)
    //                        return successCallback.call(thisArg);
    //                    return successCallback.call(thisArg, promiseValue);
    //                }
    //                if (arguments.length == 0)
    //                    return successCallback();
    //                return successCallback(promiseValue);
    //            }, undefined, function (state?: any): void {
    //                if (hasThis) {
    //                    if (arguments.length == 0)
    //                        return notifyCallback.call(thisArg);
    //                    return notifyCallback.call(thisArg, state);
    //                }
    //                if (arguments.length == 0)
    //                    return notifyCallback();
    //                return notifyCallback(state);
    //            }), this, this._chainId);
    //        }
    //        if (typeof errorCallback === 'function')
    //            return new SupplantableChainPromise<any>(this._promise.then(function (promiseValue?: V): V | ng.IPromise<V> {
    //                if (task._supplantableTaskService.isSuperceded(task))
    //                    throw new PromiseChainSupersededError();
    //                if (hasThis) {
    //                    if (arguments.length == 0)
    //                        return successCallback.call(thisArg);
    //                    return successCallback.call(thisArg, promiseValue);
    //                }
    //                if (arguments.length == 0)
    //                    return successCallback();
    //                return successCallback(promiseValue);
    //            }, function (reason?: any): any {
    //                if (hasThis) {
    //                    if (arguments.length == 0)
    //                        return errorCallback.call(thisArg);
    //                    return errorCallback.call(thisArg, reason);
    //                }
    //                if (arguments.length == 0)
    //                    return errorCallback();
    //                return errorCallback(reason);
    //            }), this, this._chainId);
    //        return new SupplantableChainPromise<any>(this._promise.then(function (promiseValue?: V): V | ng.IPromise<V> {
    //            if (task._supplantableTaskService.isSuperceded(task))
    //                throw new PromiseChainSupersededError();
    //            if (hasThis) {
    //                if (arguments.length == 0)
    //                    return successCallback.call(thisArg);
    //                return successCallback.call(thisArg, promiseValue);
    //            }
    //            if (arguments.length == 0)
    //                return successCallback();
    //            return successCallback(promiseValue);
    //        }), this, this._chainId);
    //    }

    //    /**
    //     *
    //     *
    //     * @template R
    //     * @template T
    //     * @param {SupplantableChainPromiseSuccessThisCallback<V, R, T>} successCallback
    //     * @param {(T & (T extends Function ? never : T))} thisArg
    //     * @returns {SupplantableChainPromise<R>}
    //     * @memberof SupplantableChainPromise
    //     */
    //    thenCall<R, T>(successCallback: SupplantableChainPromiseSuccessThisCallback<V, R, T>,
    //        thisArg: T): SupplantableChainPromise<R>;
    //    /**
    //     *
    //     *
    //     * @template R
    //     * @template E
    //     * @template T
    //     * @param {SupplantableChainPromiseSuccessThisCallback<V, R, T>} successCallback
    //     * @param {SupplantableChainPromiseErrorThisCallback<E, T>} errorCallback
    //     * @param {(T & (T extends Function ? never : T))} thisArg
    //     * @returns {(SupplantableChainPromise<R> | SupplantableChainPromise<E>)}
    //     * @memberof SupplantableChainPromise
    //     */
    //    thenCall<R, E, T>(successCallback: SupplantableChainPromiseSuccessThisCallback<V, R, T>,
    //            errorCallback: SupplantableChainPromiseErrorThisCallback<E, T>,
    //            thisArg: T):
    //                SupplantableChainPromise<R|E>;
    //    /**
    //     *
    //     *
    //     * @template R
    //     * @template E
    //     * @template S
    //     * @template T
    //     * @param {SupplantableChainPromiseSuccessThisCallback<V, R, T>} successCallback
    //     * @param {SupplantableChainPromiseErrorThisCallback<E, T>} errorCallback
    //     * @param {SupplantableChainPromiseNotifyThisCallback<S, T>} notifyCallback
    //     * @param {T} thisArg
    //     * @returns {(SupplantableChainPromise<R> | SupplantableChainPromise<E>)}
    //     * @memberof SupplantableChainPromise
    //     */
    //    thenCall<R, E, S, T>(
    //        successCallback: SupplantableChainPromiseSuccessThisCallback<V, R, T>,
    //        errorCallback: SupplantableChainPromiseErrorThisCallback<E, T>,
    //        notifyCallback: SupplantableChainPromiseNotifyThisCallback<S, T>, thisArg: T):
    //            SupplantableChainPromise<R | E>;
    //    thenCall<R, T>(successCallback: SupplantableChainPromiseSuccessThisCallback<V, R, T>, arg1: any, arg2?: any,
    //            thisArg?: any): SupplantableChainPromise<any> {
    //        if (arguments.length > 3)
    //            return this.then(successCallback, <SupplantableChainPromiseErrorCallback<any>>arg1,
    //                <SupplantableChainPromiseNotifyCallback<any>>arg2, thisArg);
    //        if (arguments.length == 3)
    //            return this.then(successCallback, <SupplantableChainPromiseErrorCallback<any>>arg1, undefined, arg2);
    //        return this.then(successCallback, undefined, undefined, arg1);
    //    }

    //    /**
    //     *
    //     *
    //     * @template TResult
    //     * @param {({ (reason: any): TResult | ng.IPromise<TResult>; })} onRejected
    //     * @returns {SupplantableChainPromise<TResult>}
    //     * @memberof SupplantableTask
    //     */
    //    catch<TResult>(onRejected: (reason?: any) => TResult | ng.IPromise<TResult>): SupplantableChainPromise<TResult>;
    //    /**
    //     *
    //     *
    //     * @template TThis
    //     * @template TResult
    //     * @param {({ (this: TThis, reason: any): TResult | ng.IPromise<TResult>; })} onRejected
    //     * @param {TThis} thisArg
    //     * @returns {SupplantableChainPromise<TResult>}
    //     * @memberof SupplantableTask
    //     */
    //    catch<TThis, TResult>(onRejected: (this: TThis, reason?: any) => TResult | ng.IPromise<TResult>,
    //        thisArg: TThis): SupplantableChainPromise<TResult>;
    //    catch<TResult>(onRejected: (reason?: any) => TResult | ng.IPromise<TResult>, thisArg?: any): SupplantableChainPromise<TResult> {
    //        const task: SupplantableChainPromise<V> = this;
    //        if (arguments.length > 1)
    //            return new SupplantableChainPromise<TResult>(this._promise.catch<TResult>(function (reason: any) {
    //                return onRejected.call(thisArg, reason);
    //            }), this, this._chainId);
    //        return new SupplantableChainPromise<TResult>(this._promise.catch<TResult>(function (reason: any) {
    //            return onRejected(reason);
    //        }), this, this._chainId);
    //    }

    //    /**
    //     *
    //     *
    //     * @param {{ (isSuperseded: boolean): any; }} finallyCallback
    //     * @returns {SupplantableChainPromise<V>}
    //     * @memberof SupplantableTask
    //     */
    //    finally(finallyCallback: (isSuperseded: boolean) => any): SupplantableChainPromise<V>;
    //    /**
    //     *
    //     *
    //     * @template TThis
    //     * @param {{ (this: TThis, isSuperseded: boolean): any; }} finallyCallback
    //     * @param {TThis} thisArg
    //     * @returns {SupplantableChainPromise<V>}
    //     * @memberof SupplantableTask
    //     */
    //    finally<TThis>(finallyCallback: (this: TThis, isSuperseded: boolean) => any, thisArg: TThis): SupplantableChainPromise<V>;
    //    finally(finallyCallback: (isSuperseded: boolean) => any, thisArg?: any): SupplantableChainPromise<V> {
    //        const task: SupplantableChainPromise<V> = this;
    //        if (arguments.length > 1)
    //            return new SupplantableChainPromise<V>(this._promise.finally(function () {
    //                return finallyCallback.call(thisArg, task._supplantableTaskService.isSuperceded(task));
    //            }), this, this._chainId);
    //        return new SupplantableChainPromise<V>(this._promise.finally(function () {
    //            return finallyCallback(task._supplantableTaskService.isSuperceded(task));
    //        }), this, this._chainId);
    //    }
    //}

    //export type ResolveOnlyCallback<V> = (resolve: ng.IQResolveReject<V>) => any;
    //export type ResolveOnlyThisCallback<T, V> = (this: T, resolve: ng.IQResolveReject<V>) => any;
    //export type ResolveRejectCallback<V> = (resolve: ng.IQResolveReject<V>, reject: ng.IQResolveReject<any>) => any;
    //export type ResolveRejectThisCallback<T, V> = (this: T, resolve: ng.IQResolveReject<V>, reject: ng.IQResolveReject<any>) => any;
    //export type ResolveRejectNotifyCallback<V, S> = (resolve: ng.IQResolveReject<V>, reject: ng.IQResolveReject<S>,
    //    notify: ng.IQResolveReject<any>) => any;
    //export type ResolveRejectNotifyThisCallback<T, V, S> = (this: T, resolve: ng.IQResolveReject<V>, reject: ng.IQResolveReject<any>,
    //    notify: ng.IQResolveReject<S>) => any;
    //export type ResolvePromiseCallback<V> = ResolveOnlyCallback<V> | ResolveRejectCallback<V> | ResolveRejectNotifyCallback<V, any>;
    //export type ResolvePromiseThisCallback<T, V> = ResolveOnlyThisCallback<T, V> | ResolveRejectThisCallback<T, V> |
    //    ResolveRejectNotifyThisCallback<T, V, any>;

    ///**
    // * Class which implements the supplantablePromiseChainService service.
    // * @export
    // * @class SupplantablePromiseChainService
    // */
    //export class SupplantablePromiseChainService {
    //    private readonly _tasks: SupplantableChainPromise<any>[] = [];

    //    readonly [Symbol.toStringTag]: string = ServiceNames.supplantablePromiseChain;

    //    /**
    //     * Creates an instance of SupplantablePromiseChainService.
    //     * @param {ng.IQService} $q - Injected Angular JS Q service.
    //     * @param {ng.IIntervalService} $interval - Injected Angular JS Interval service.
    //     * @memberof SupplantablePromiseChainService
    //     */
    //    constructor(private readonly $q: ng.IQService, private readonly $interval: ng.IIntervalService) {
    //    }

    //    /**
    //     * Tests whether the current promise chain has been superceded.
    //     * @param {SupplantableChainPromise<any>} promise - A promise in the current promise chain.
    //     * @returns {boolean} True if the current promise chain has been superceded; otherwise, false.
    //     * @memberof SupplantablePromiseChainService
    //     */
    //    isSuperceded(promise: SupplantableChainPromise<any>): boolean {
    //        for (let i = 0; i < this._tasks.length; i++) {
    //            if (this._tasks[i].IsSameTask(promise))
    //                return !this._tasks[i].isSameChain(promise);
    //        }
    //        return false;
    //    }

    //    /**
    //     * Starts a new supplantable promise chain.
    //     * @template V - The type of value to be resolved.
    //     * @param {symbol} taskId - Uniquely identifies a supplantable promise chain.
    //     * @param {ResolvePromiseCallback<V>} resolver - Resolves the promised value.
    //     * @returns {SupplantableChainPromise<V>} A supplantable chain promise object.
    //     * @memberof SupplantablePromiseChainService
    //     */
    //    start<V>(taskId: symbol, resolver: ResolvePromiseCallback<V>): SupplantableChainPromise<V>;
    //    /**
    //     * Starts a new supplantable promise chain.
    //     * @template T - The type of the 'this' variable when the callbacks are invoked.
    //     * @template V - The type of value to be resolved.
    //     * @this T
    //     * @param {symbol} taskId - Uniquely identifies a supplantable promise chain.
    //     * @param {ResolvePromiseThisCallback<T, V>} resolver - Resolves the promised value.
    //     * @param {T} thisArg - The object to use as the 'this' variable when the callbacks
    //     *      are invoked.
    //     * @returns {SupplantableChainPromise<V>} A supplantable chain promise object.
    //     * @memberof SupplantablePromiseChainService
    //     */
    //    start<T, V>(this: T, taskId: symbol, resolver: ResolvePromiseThisCallback<T, V>, thisArg: T): SupplantableChainPromise<V>;
    //    start<V>(taskId: symbol, resolver: ResolvePromiseCallback<V>, thisArg?: any): SupplantableChainPromise<V> {
    //        if (arguments.length > 2)
    //            return this.startDelayed(taskId, resolver, 0, thisArg);
    //        return this.startDelayed(taskId, resolver, 0);
    //    }

    //    /**
    //     * Starts a new supplantable promise chain.
    //     * @template V - The type of value to be resolved.
    //     * @param {symbol} taskId - Uniquely identifies a supplantable promise chain.
    //     * @param {ResolvePromiseCallback<V>} resolver - Resolves or rejects the promised value.
    //     * @param {number} delay - Number of milliseconds to delay before invoking the resolver.
    //     * @returns {SupplantableChainPromise<V>} A supplantable chain promise object.
    //     * @memberof SupplantablePromiseChainService
    //     */
    //    startDelayed<V>(taskId: symbol, resolver: ResolvePromiseCallback<V>, delay: number): SupplantableChainPromise<V>;
    //    /**
    //     * Starts a new supplantable promise chain.
    //     * @template T - The type of the 'this' variable when the callbacks are invoked.
    //     * @template V - The type of value to be resolved.
    //     * @this T
    //     * @param {symbol} taskId - Uniquely identifies a supplantable promise chain.
    //     * @param {ResolvePromiseThisCallback<T, V>} resolver - Resolves or rejects the promised value.
    //     * @param {number} delay - Number of milliseconds to delay before invoking the resolver.
    //     * @param {T} thisArg - The object to use as the 'this' variable when the callbacks are invoked.
    //     * @returns {SupplantableChainPromise<V>} A supplantable chain promise object.
    //     * @memberof SupplantablePromiseChainService
    //     */
    //    startDelayed<T, V>(this: T, taskId: symbol, resolver: ResolvePromiseThisCallback<T, V>, delay: number,
    //        thisArg: T): SupplantableChainPromise<V>;
    //    startDelayed<V>(taskId: symbol, resolver: ResolveRejectNotifyCallback<V, any>, delay: number,
    //        thisArg?: any): SupplantableChainPromise<V> {
    //        const deferred: ng.IDeferred<V> = this.$q.defer<V>();
    //        const svc: SupplantablePromiseChainService = this;
    //        const hasThis: boolean = arguments.length > 3;
    //        if (isNaN(delay))
    //            delay = 0;
    //        this.$interval(function () {
    //            const resolve: ng.IQResolveReject<V> = function (value?: V): void {
    //                if (arguments.length == 0)
    //                    deferred.resolve();
    //                else
    //                    deferred.resolve(value);
    //            };
    //            const reject: ng.IQResolveReject<any> = function (reason?: any) {
    //                if (arguments.length == 0)
    //                    deferred.reject();
    //                else
    //                    deferred.reject(reason);
    //            };
    //            const notify: ng.IQResolveReject<any> = function (state?: any) {
    //                if (arguments.length == 0)
    //                    deferred.notify();
    //                else
    //                    deferred.notify(state);
    //            };
    //            if (hasThis)
    //                return resolver.call(thisArg, resolve, reject, notify);
    //            return resolver(resolve, reject, notify);
    //        }, delay, 1, true);
    //        let result: SupplantableChainPromise<V>;
    //        for (let i = 0; i < this._tasks.length; i++) {
    //            if (this._tasks[i].IsSameTask(taskId)) {
    //                result = new SupplantableChainPromise<V>(deferred.promise, this._tasks[i]);
    //                this._tasks[i] = result;
    //                return result;
    //            }
    //        }
    //        result = new SupplantableChainPromise<V>(deferred.promise, taskId, this);
    //        this._tasks.push(result);
    //        return result;
    //    }
    //}

    /**
     * Service which provides page-related information and tracks and updates the current app page title.
     * @export
     * @class PageTitleService
     */
    export class PageLocationService {
        private _pageTitle = 'Lenny\'s GitHub Repositories';
        private _pageSubTitle = '';
        private _regexHref: string = NavPrefix + ModulePaths.regexMatch;
        private _scope: IMainContentControllerScope;
        readonly [Symbol.toStringTag]: string = ServiceNames.pageLocation;

        static ConfigureRoutes($routeProvider: ng.route.IRouteProvider): void {
            $routeProvider.when(ModulePaths.home, {
                templateUrl: 'home.htm',
                controller: ControllerNames.staticPage
            }).when(ModulePaths.git, {
                templateUrl: 'git.htm',
                controller: ControllerNames.staticPage
            }).when(ModulePaths.vscode, {
                templateUrl: 'vscode.htm',
                controller: ControllerNames.staticPage
            }).when(ModulePaths.npm, {
                templateUrl: 'npm.htm',
                controller: ControllerNames.staticPage
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
        }

        constructor($rootScope: ng.IRootScopeService) {
            const svc: PageLocationService = this;
            $rootScope.$on('$routeChangeSuccess', function(event: ng.IAngularEvent, current: ng.route.ICurrentRoute): void {
                switch (current.templateUrl) {
                    case 'home.htm':
                        svc.pageTitle('');
                        break;
                    case 'git.htm':
                        svc.pageTitle('GIT Cheat Sheet');
                        break;
                    case 'vscode.htm':
                        svc.pageTitle('VS Code Cheat Sheet');
                        break;
                    case 'npm.htm':
                        svc.pageTitle('NPM Cheat Sheet');
                        break;
                }
            });
        }

        /**
         * Gets or sets the default URL for the regular expression tester page.
         * @param {string} [value] - If defined, this will set the default URL for the regular expression tester page.
         * @returns {string} The default URL for the regular expression tester page.
         * @memberof PageLocationService
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
         * @param {string} [value] - If defined, this will set the current page title and the page subtitle will be empty.
         * @returns {string} The current page title.
         * @memberof PageLocationService
         */
        pageTitle(value?: string): string;
        /**
         * Sets the new page title and subtitle.
         * @param value - The new page title.
         * @param subTitle - The new page subtitle.
         * @returns {string} The current page title.
         * @memberof PageLocationService
         */
        pageTitle(value: string, subTitle: string): string;
        pageTitle(value?: string, subTitle?: string): string {
            if (typeof value === 'string') {
                this._pageTitle = ((value = value.trim()).length == 0) ? 'Lenny\'s GitHub Page' : value;
                this._pageSubTitle = (typeof subTitle === 'string') ? subTitle : '';
                if (typeof this._scope !== 'undefined') {
                    this._scope.pageTitle = this._pageTitle;
                    this._scope.showSubtitle = (this._scope.subTitle = this._pageSubTitle).length > 0;
                }
            }
            return this._pageTitle;
        }

        /**
         * Gets the current page subtitle.
         * @returns {string} - The current page subtitle title or an empty string if there is currently no subtitle.
         * @memberof PageLocationService
         */
        pageSubTitle(value?: string): string { return this._pageSubTitle; }

        /**
         * This should only be called by the main controller so the main controller's page title properties can be updated.
         * @param {IMainContentControllerScope} scope - The scope of the main application controller.
         * @memberof PageLocationService
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
     * Controller for static pages.
     * @export
     * @class StaticPageController
     * @implements {ng.IController}
     */
    export class StaticPageController implements ng.IController {
        readonly [Symbol.toStringTag]: string = ControllerNames.staticPage;
        constructor(pageLocationService: PageLocationService, $location: ng.ILocationService) {
            const path: string = $location.path();
            if (path == ModulePaths.git)
                pageLocationService.pageTitle('GIT Cheat Sheet');
            else if (path == ModulePaths.vscode)
                pageLocationService.pageTitle('VS Code Cheat Sheet');
            else if (path == ModulePaths.npm)
                pageLocationService.pageTitle('NPM Cheat Sheet');
            else
                pageLocationService.pageTitle('');
        }
        $doCheck(): void { }
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
        constructor(private readonly $scope: IMainContentControllerScope, pageLocationService: PageLocationService) {
            const ctrl: MainContentController = this;
            $scope.regexHref = NavPrefix + ModulePaths.regexMatch;
            pageLocationService.setScope($scope);
        }
        $doCheck(): void { }
    }

    export let mainModule: ng.IModule = angular.module(ModuleNames.app, ['ngRoute'])
        .config(['$locationProvider', '$routeProvider', function ($locationProvider: ng.ILocationProvider,
                $routeProvider: ng.route.IRouteProvider) {
            $locationProvider.hashPrefix(HashPrefix);
            PageLocationService.ConfigureRoutes($routeProvider);
        }])
        .service(ServiceNames.supplantablePromiseChain, ['$q', '$interval', SupplantablePromiseChainService])
        .service(ServiceNames.pageLocation, PageLocationService)
        .controller(ControllerNames.mainContent, ['$scope', ServiceNames.pageLocation, MainContentController]);
}
