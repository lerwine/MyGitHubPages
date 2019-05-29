/// <reference path="Scripts/typings/jquery/jquery.d.ts"/>
/// <reference path="Scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="Scripts/typings/angularjs/angular-route.d.ts"/>

namespace app {
    /**
    * The main module for this app.
    *
    * @type {ng.IModule}
    */
    export let mainModule: ng.IModule = angular.module("mainModule", []);

    /**
     *
     *
     * @interface INavigationLinkConfig
     */
    interface INavigationLinkConfig {
        /**
         *
         *
         * @type {string}
         * @memberof INavigationLinkConfig
         */
        href: string;

        /**
         *
         *
         * @type {string}
         * @memberof INavigationLinkConfig
         */
        text: string;

        /**
         *
         *
         * @type {string}
         * @memberof INavigationLinkConfig
         */
        pageId?: string;

        /**
         *
         *
         * @type {string}
         * @memberof INavigationLinkConfig
         */
        target?: string;

        /**
         *
         *
         * @type {boolean}
         * @memberof INavigationLinkConfig
         */
        disabled?: boolean;

        /**
         *
         *
         * @type {INavigationLinkConfig[]}
         * @memberof INavigationLinkConfig
         */
        links?: INavigationLinkConfig[];
    }

    /**
     *
     *
     * @interface IAppConfig
     */
    interface IAppConfig {
        /**
         *
         *
         * @type {INavigationLinkConfig[]}
         * @memberof IAppConfig
         */
        links: INavigationLinkConfig[];
    }

    /**
     *
     *
     * @interface IAppConfigRequestInfo
     */
    interface IAppConfigRequestInfo {
        /**
         *
         *
         * @type {number}
         * @memberof IAppConfigRequestInfo
         */
        status?: number;

        /**
         *
         *
         * @type {ng.IHttpHeadersGetter}
         * @memberof IAppConfigRequestInfo
         */
        headers?: ng.IHttpHeadersGetter;

        /**
         *
         *
         * @type {ng.IRequestConfig}
         * @memberof IAppConfigRequestInfo
         */
        config?: ng.IRequestConfig;

        /**
         *
         *
         * @type {string}
         * @memberof IAppConfigRequestInfo
         */
        statusText: string;

        /**
         *
         *
         * @type {*}
         * @memberof IAppConfigRequestInfo
         */
        error?: any;
    }

    /**
     *
     *
     * @interface INavigationLink
     * @extends {INavigationLinkConfig}
     */
    interface INavigationLink extends INavigationLinkConfig {
        /**
         *
         *
         * @type {boolean}
         * @memberof INavigationLink
         */
        disabled: boolean;

        /**
         *
         *
         * @type {INavigationLink[]}
         * @memberof INavigationLink
         */
        links: INavigationLink[];

        /**
         *
         *
         * @type {string[]}
         * @memberof INavigationLink
         */
        cssClass: string[];

        /**
         *
         *
         * @returns {boolean}
         * @memberof INavigationLink
         */
        onClick(): boolean;
    }

    /**
     *
     *
     * @interface IAppConfigLoadResult
     */
    interface IAppConfigLoadResult {
        /**
         *
         *
         * @type {IAppConfigRequestInfo}
         * @memberof IAppConfigLoadResult
         */
        requestInfo: IAppConfigRequestInfo;

        /**
         *
         *
         * @type {INavigationLink[]}
         * @memberof IAppConfigLoadResult
         */
        links: INavigationLink[];
    }

    /**
     *
     *
     * @param {INavigationLinkConfig[]} [pages]
     * @returns {INavigationLink[]}
     */
    function sanitizeNavigationLinks(pages?: INavigationLinkConfig[]): INavigationLink[] {
        if (typeof (pages) === "undefined" || pages === null)
            return [];
        if (typeof (pages) !== "object" || !Array.isArray(pages))
            return [{ href: "#", text: "(invalid configuration data)", disabled: true, links: [], cssClass: ["nav-item", "disabled"], onClick: () => { return false; } }];
        return pages.filter(notNil).map((item: INavigationLinkConfig) => {
            if (typeof (item) !== "object")
                return { href: "#", text: "(invalid configuration data)", disabled: true, links: [], cssClass: ["nav-item", "disabled"], onClick: () => { return false; } };

            if (isNilOrWhiteSpace(item.href)) {
                item.href = "#";
                item.disabled = true;
            }
            if (item.disabled)
                return { href: item.href, text: item.text, disabled: true, links: sanitizeNavigationLinks(item.links), cssClass: ["nav-item", "disabled"], onClick: () => { return false; } };
            return { href: item.href, text: item.text, disabled: false, links: sanitizeNavigationLinks(item.links), cssClass: ["nav-item"], onClick: () => { return true; } };
        });
    }
    
    // #region applicationConfigurationLoader Service
    
    interface IApplicationConfigurationLoaderHttpResponse {
        /**
         *
         *
         * @type {INavigationLinkConfig[]}
         * @memberof IApplicationConfigurationLoaderHttpResponse
         */
        links: INavigationLinkConfig[]
    }
    
    interface IApplicationConfigurationLoaderData {
        links: INavigationLink[];
        status?: number;
        statusText?: string;
    }
    
    class applicationConfigurationLoaderService {
        private _response: ng.IPromise<IApplicationConfigurationLoaderData>;
    
        constructor(protected $http: ng.IHttpService, protected $q: ng.IQService) {
            this._response = $http.get<IApplicationConfigurationLoaderHttpResponse>('appConfig.json').then((httpResult: ng.IHttpPromiseCallbackArg<IApplicationConfigurationLoaderHttpResponse>) => {
                return $q((resolve: ng.IQResolveReject<IApplicationConfigurationLoaderData>, reject: ng.IQResolveReject<any>) => {
                    if (typeof (httpResult.data) !== "object" || httpResult.data === null || typeof (httpResult.data.links) !== "object" || httpResult.data.links == null || !Array.isArray(httpResult.data.links))
                        reject("Invalid response");
                    else
                        resolve({
                            links: sanitizeNavigationLinks(httpResult.data.links),
                            status: httpResult.status,
                            statusText: httpResult.statusText
                        });
                });
            }, (errorReason: any) => {
                if (typeof (errorReason) === "undefined" || errorReason === "null")
                    return new Error("Unexpected failure");
                if (typeof errorReason === "string")
                    return new Error(errorReason);
                if (errorReason instanceof Error)
                    return errorReason;
                let message: string = ((typeof (<Error>errorReason).message === "string") ? (<Error>errorReason).message :
                    ((typeof (<Error>errorReason).message !== "undefined" && (<Error>errorReason).message !== null) ? (<Error>errorReason).message : "")).trim();
                return {
                    message: (message.length == 0) ? "Unexpected Error" : message,
                    data: errorReason,
                };
            });
        }

        then<T>(successCallback: { (response: IApplicationConfigurationLoaderData): T}, errorCallback?: { (reason: Error | { message: string, data: any }): any}): T;
        then(successCallback: { (response: IApplicationConfigurationLoaderData): any}, errorCallback?: { (reason: Error | { message: string, data: any }): any}): void;
        then(successCallback: { (response: IApplicationConfigurationLoaderData): any}, errorCallback?: { (reason: Error | { message: string, data: any }): any}): any {
            return this._response.then(successCallback, errorCallback);
        }
    }
    
    mainModule.service("applicationConfigurationLoader", ["$http", "$q", applicationConfigurationLoaderService]);
    
    // #endregion
    
    /**
     * Loads application configuration from file.
     *
     * @class applicationConfigurationLoader
     * @implements {ng.IPromise<IAppConfigLoadResult>}
     */
    class applicationConfigurationLoaderOld implements ng.IPromise<IAppConfigLoadResult> {
        private _get: ng.IPromise<IAppConfigLoadResult>;

        /**
         *
         *
         * @template TResult
         * @param {((promiseValue: IAppConfigLoadResult) => TResult | ng.IPromise<TResult>)} successCallback
         * @param {(reason: any) => any} [errorCallback]
         * @param {(state: any) => any} [notifyCallback]
         * @returns {ng.IPromise<TResult>}
         * @memberof applicationConfigurationLoader
         */
        then<TResult>(successCallback: (promiseValue: IAppConfigLoadResult) => TResult | ng.IPromise<TResult>, errorCallback?: (reason: any) => any, notifyCallback?: (state: any) => any): ng.IPromise<TResult> {
            return this._get.then(successCallback, errorCallback, notifyCallback);
        }

        /**
         *
         *
         * @template TResult
         * @param {((reason: any) => TResult | ng.IPromise<TResult>)} onRejected
         * @returns {ng.IPromise<TResult>}
         * @memberof applicationConfigurationLoader
         */
        catch<TResult>(onRejected: (reason: any) => TResult | ng.IPromise<TResult>): ng.IPromise<TResult> { return this._get.catch(onRejected); }

        /**
         *
         *
         * @param {() => any} finallyCallback
         * @returns {ng.IPromise<IAppConfigLoadResult>}
         * @memberof applicationConfigurationLoader
         */
        finally(finallyCallback: () => any): ng.IPromise<IAppConfigLoadResult> { return this._get.finally(finallyCallback); }

        /**
         *Creates an instance of applicationConfigurationLoader.
         * @param {ng.IHttpService} $http
         * @memberof applicationConfigurationLoader
         */
        constructor($http: ng.IHttpService) {
            
            this._get = $http.get<IAppConfig>('appConfig.json').then((promiseValue: ng.IHttpPromiseCallbackArg<IAppConfig>) => {
                let requestInfo: IAppConfigRequestInfo = {
                    status: promiseValue.status,
                    headers: promiseValue.headers,
                    config: promiseValue.config,
                    statusText: promiseValue.statusText
                }
                if (typeof (promiseValue.data) === 'undefined' || promiseValue.data == null)
                    requestInfo.error = "No data returned.";
                else if (typeof (promiseValue.data) !== 'object')
                    requestInfo.error = "Invalid data.";
                else if (typeof (promiseValue.data.links) != 'object' || promiseValue.data.links === null || !Array.isArray(promiseValue.data.links))
                    requestInfo.error = "Invalid pages configuration";
                return <IAppConfigLoadResult>{
                    requestInfo: requestInfo,
                    links: sanitizeNavigationLinks(promiseValue.data.links)
                };
            }, (reason: any) => { return <IAppConfigLoadResult>{ requestInfo: { statusText: asString(reason, "Unknown error") }, links: [] }; });
        }
    }

    /**
     *
     *
     * @param {INavigationLink[]} links
     * @param {string} pageId
     * @returns
     */
    function hasActiveNavItem(links: INavigationLink[], pageId: string) {
        for (let i: number = 0; i < this.$scope.links.length; i++) {
            if (links[i].pageId === this.$scope.currentPageId)
                return true;
        }
        for (let i: number = 0; i < this.$scope.links.length; i++) {
            if (hasActiveNavItem(links[i].links, pageId))
                return true;
        }
        return false;
    }

    /**
     *
     *
     * @interface ITopNavScope
     * @extends {ng.IScope}
     */
    interface ITopNavScope extends ng.IScope {
        headerText: string;

        /**
         *
         *
         * @type {INavigationLink[]}
         * @memberof ITopNavScope
         */
        links: INavigationLink[];

        /**
         *
         *
         * @param {string} pageId
         * @param {applicationConfigurationLoader} loader
         * @memberof ITopNavScope
         */
        initializeTopNav(pageId: string, loader: applicationConfigurationLoaderService): void;
    }

    /**
     *
     *
     * @class TopNavController
     * @implements {ng.IController}
     */
    class TopNavController implements ng.IController {
        /**
         *Creates an instance of TopNavController.
         * @param {ITopNavScope} $scope
         * @memberof TopNavController
         */
        constructor(protected $scope: ITopNavScope) {
            let controller: TopNavController = this;
            $scope.initializeTopNav = (pageId: string, loader: applicationConfigurationLoaderService) => { return controller.initializeTopNav(pageId, loader); };
        }
        $doCheck() { }

        /**
         *
         *
         * @param {string} pageId
         * @param {applicationConfigurationLoader} loader
         * @memberof TopNavController
         */
        initializeTopNav(pageId: string, loader: applicationConfigurationLoaderService): void {
            loader.then((result: IAppConfigLoadResult) => {
                this.$scope.links = result.links;
                if (isNilOrWhiteSpace(pageId))
                    return;
                for (let i: number = 0; i < this.$scope.links.length; i++) {
                    if (this.$scope.links[i].pageId === pageId) {
                        this.$scope.links[i].cssClass.push("active");
                        this.$scope.links[i].href = "#";
                        this.$scope.links[i].onClick = () => { return false; }
                        return;
                    }
                }
                for (let i: number = 0; i < this.$scope.links.length; i++) {
                    if (hasActiveNavItem(this.$scope.links[i].links, pageId)) {
                        this.$scope.links[i].cssClass.push("active");
                        return;
                    }
                }
            });
        }
    }

    /**
     *
     *
     * @interface ITopNavAttributes
     */
    interface ITopNavAttributes {
        /**
         *
         *
         * @type {string}
         * @memberof ITopNavAttributes
         */
        headerText: string;

        /**
         *
         *
         * @type {string}
         * @memberof ITopNavAttributes
         */
        pageName: string;
    };

    mainModule.directive('topNavAndHeader', ['applicationConfigurationLoader', (navLoader: applicationConfigurationLoaderService) => {
        return <ng.IDirective>{
            restrict: "E",
            scope: {},
            controller: ["$scope", TopNavController],
            link: (scope: ITopNavScope, element: JQuery, attributes: ITopNavAttributes, controller: TopNavController) => {
                scope.headerText = attributes.headerText;
                navLoader.then((promiseValue: IAppConfigLoadResult) => {
                    scope.initializeTopNav(attributes.pageName, navLoader);
                });
            }
        };
    }]);

    // #region Utility functions

    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} obj
     * @returns {(obj is null | undefined)}
     */
    export function isNil(obj: any | null | undefined): obj is null | undefined { return typeof (obj) === 'undefined' || obj === null; }

    /**
     *
     *
     * @export
     * @template T
     * @param {(T | null | undefined)} obj
     * @returns {obj is T}
     */
    export function notNil<T>(obj: T | null | undefined): obj is T;
    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} obj
     * @returns {(obj is boolean | number | string | object | symbol)}
     */
    export function notNil(obj: any | null | undefined): obj is boolean | number | string | object | symbol;
    export function notNil(obj: any | null | undefined): boolean { return typeof (obj) !== 'undefined' && obj != null; }

    /**
     *
     *
     * @export
     * @template T
     * @param {(Array<T> | null | undefined)} value
     * @returns {value is Array<T>}
     */
    export function notNilOrEmpty<T>(value: Array<T> | null | undefined): value is Array<T>;
    /**
     *
     *
     * @export
     * @param {(Array<any> | null | undefined)} value
     * @returns {value is Array<any>}
     */
    export function notNilOrEmpty(value: Array<any> | null | undefined): value is Array<any>;
    /**
     *
     *
     * @export
     * @param {(string | null | undefined)} value
     * @returns {value is string}
     */
    export function notNilOrEmpty(value: string | null | undefined): value is string;
    export function notNilOrEmpty(value: string | Array<any> | null | undefined): value is string | Array<any> {
        return (typeof (value) == 'string' || (typeof (value) == 'object' && value != null && Array.isArray(value))) && value.length > 0;
    }

    /**
     *
     *
     * @export
     * @template T
     * @param {(Array<T> | null | undefined)} value
     * @returns {(value is ({ length: 0 } & Array<T>) | null | undefined)}
     */
    export function isNilOrEmpty<T>(value: Array<T> | null | undefined): value is ({ length: 0 } & Array<T>) | null | undefined;
    /**
     *
     *
     * @export
     * @param {(Array<any> | null | undefined)} value
     * @returns {(value is ({ length: 0 } & Array<any>) | null | undefined)}
     */
    export function isNilOrEmpty(value: Array<any> | null | undefined): value is ({ length: 0 } & Array<any>) | null | undefined;
    /**
     *
     *
     * @export
     * @param {(string | null | undefined)} value
     * @returns {(value is ({ length: 0 } & string) | null | undefined)}
     */
    export function isNilOrEmpty(value: string | null | undefined): value is ({ length: 0 } & string) | null | undefined;
    export function isNilOrEmpty(value: string | Array<any> | null | undefined): value is ({ length: 0 } & string) | ({ length: 0 } & Array<any>) | null | undefined {
        return (typeof (value) !== 'string' && (typeof (value) != 'object' || value === null || !Array.isArray(value))) || value.length == 0;
    }

    /**
     *
     *
     * @export
     * @param {(string | null | undefined)} value
     * @returns {boolean}
     */
    export function isNilOrWhiteSpace(value: string | null | undefined): boolean { return typeof (value) !== 'string' || value.trim().length == 0; }

    /**
     *
     *
     * @export
     * @param {(string | null | undefined)} value
     * @returns {value is string}
     */
    export function notNilOrWhiteSpace(value: string | null | undefined): value is string { return typeof (value) == 'string' && value.trim().length > 0 }

    /**
     *
     *
     * @export
     * @template T
     * @param {(T | null | undefined)} value
     * @param {T} defaultValue
     * @returns {T}
     */
    export function asNotNil<T>(value: T | null | undefined, defaultValue: T): T;
    /**
     *
     *
     * @export
     * @param {(string | null | undefined)} value
     * @param {boolean} [trim]
     * @returns {string}
     */
    export function asNotNil(value: string | null | undefined, trim?: boolean): string;
    /**
     *
     *
     * @export
     * @param {(string | null | undefined)} value
     * @param {string} defaultValue
     * @param {boolean} trim
     * @returns {string}
     */
    export function asNotNil(value: string | null | undefined, defaultValue: string, trim: boolean): string;
    export function asNotNil(value: any | null | undefined, opt?: any, trim?: boolean): any {
        if (typeof (value) === "undefined" || value === null)
            return (typeof (opt) !== 'undefined') ? opt : '';
        if (typeof (value) !== 'string')
            return value;
        return ((typeof (opt) === "boolean") ? opt : trim === true) ? value.trim() : value;
    }

    /**
     *
     *
     * @export
     * @interface IValueTestFunc
     * @template T
     */
    export interface IValueTestFunc<T> { (value: any): value is T };

    /**
     *
     *
     * @export
     * @interface IValueConvertFunc
     * @template T
     */
    export interface IValueConvertFunc<T> { (value: any): T };

    export type NilConvertSpec<T> = { (value: null | undefined): T } | T;

    export type GetValueSpec<T> = { (): T } | T;

    export type ValueConvertFailedSpec<T> = { (value: any, error: any): T } | T;

    /**
     *
     *
     * @export
     * @interface IValueFinalizeFunc
     * @template T
     */
    export interface IValueFinalizeFunc<T> { (value: T): T };

    /**
     *
     *
     * @interface IConvertValueHandlers
     * @template T
     */
    interface IConvertValueHandlers<T> {
        /**
         *
         *
         * @type {IValueTestFunc<T>}
         * @memberof IConvertValueHandlers
         */
        test: IValueTestFunc<T>;

        /**
         *
         *
         * @type {IValueConvertFunc<T>}
         * @memberof IConvertValueHandlers
         */
        convert: IValueConvertFunc<T>;

        /**
         *
         *
         * @type {ValueConvertFailedSpec<T>}
         * @memberof IConvertValueHandlers
         */
        convertFailed?: ValueConvertFailedSpec<T>;

        /**
         *
         *
         * @type {IValueFinalizeFunc<T>}
         * @memberof IConvertValueHandlers
         */
        whenConverted?: IValueFinalizeFunc<T>;

        /**
         *
         *
         * @type {IValueFinalizeFunc<T>}
         * @memberof IConvertValueHandlers
         */
        whenMatched?: IValueFinalizeFunc<T>;
        /**
         *
         *
         * @type {IValueFinalizeFunc<T>}
         * @memberof IConvertValueHandlers
         */
        getFinal?: IValueFinalizeFunc<T>;
    }

    /**
     *
     *
     * @interface IConvertValueOrNilHandlers
     * @extends {IConvertValueHandlers<T>}
     * @template T
     */
    interface IConvertValueOrNilHandlers<T> extends IConvertValueHandlers<T> { whenNil: NilConvertSpec<T>; }

    /**
     *
     *
     * @interface IConvertValueOrNullHandlers
     * @extends {IConvertValueHandlers<T>}
     * @template T
     */
    interface IConvertValueOrNullHandlers<T> extends IConvertValueHandlers<T> { whenNull: GetValueSpec<T>; }

    /**
     *
     *
     * @interface IConvertValueOrUndefinedHandlers
     * @extends {IConvertValueHandlers<T>}
     * @template T
     */
    interface IConvertValueOrUndefinedHandlers<T> extends IConvertValueHandlers<T> { whenUndefined: GetValueSpec<T>; }

    /**
     *
     *
     * @interface IConvertValueNullOrUndefinedHandlers
     * @extends {IConvertValueOrNullHandlers<T>}
     * @extends {IConvertValueOrUndefinedHandlers<T>}
     * @template T
     */
    interface IConvertValueNullOrUndefinedHandlers<T> extends IConvertValueOrNullHandlers<T>, IConvertValueOrUndefinedHandlers<T> { }

    export type ConvertValueNullAndOrUndefinedHandlers<T> = IConvertValueNullOrUndefinedHandlers<T> | IConvertValueOrUndefinedHandlers<T> | IConvertValueOrNullHandlers<T>;

    export type ConvertValueHandlers<T> = IConvertValueHandlers<T> | IConvertValueOrNilHandlers<T> | ConvertValueNullAndOrUndefinedHandlers<T>;

    export type ConvertValueAndOrNullHandlers<T> = IConvertValueOrNullHandlers<T> | IConvertValueNullOrUndefinedHandlers<T>;

    export type ConvertValueAndOrUndefinedHandlers<T> = IConvertValueOrUndefinedHandlers<T> | IConvertValueNullOrUndefinedHandlers<T>;

    /**
     *
     *
     * @export
     * @template T
     * @param {ConvertValueHandlers<T>} h
     * @returns {h is ConvertValueAndOrNullHandlers<T>}
     */
    export function hasConvertWhenNull<T>(h: ConvertValueHandlers<T>): h is ConvertValueAndOrNullHandlers<T> { return (typeof ((<ConvertValueAndOrNullHandlers<T>>h).whenNull) !== "undefined"); }

    /**
     *
     *
     * @export
     * @template T
     * @param {ConvertValueHandlers<T>} h
     * @returns {h is ConvertValueAndOrUndefinedHandlers<T>}
     */
    export function hasConvertWhenUndefined<T>(h: ConvertValueHandlers<T>): h is ConvertValueAndOrUndefinedHandlers<T> { return (typeof ((<ConvertValueAndOrUndefinedHandlers<T>>h).whenUndefined) !== "undefined"); }

    /**
     *
     *
     * @export
     * @template T
     * @param {ConvertValueHandlers<T>} h
     * @returns {h is IConvertValueOrNilHandlers<T>}
     */
    export function hasConvertWhenNil<T>(h: ConvertValueHandlers<T>): h is IConvertValueOrNilHandlers<T> { return (typeof ((<IConvertValueOrNilHandlers<T>>h).whenNil) !== "undefined"); }

    /**
     *
     *
     * @export
     * @template T
     * @param {(any | null | undefined)} value
     * @param {ConvertValueHandlers<T>} handlers
     * @returns {T}
     */
    export function convertValue<T>(value: any | null | undefined, handlers: ConvertValueHandlers<T>): T;
    /**
     *
     *
     * @export
     * @template T
     * @param {(any | null | undefined)} value
     * @param {IValueTestFunc<T>} testFn
     * @param {IValueConvertFunc<T>} convertFn
     * @param {NilConvertSpec<T>} [whenNil]
     * @returns {T}
     */
    export function convertValue<T>(value: any | null | undefined, testFn: IValueTestFunc<T>, convertFn: IValueConvertFunc<T>, whenNil?: NilConvertSpec<T>): T;
    /**
     *
     *
     * @export
     * @template T
     * @param {(any | null | undefined)} value
     * @param {IValueTestFunc<T>} testFn
     * @param {IValueConvertFunc<T>} convertFn
     * @param {GetValueSpec<T>} whenNull
     * @param {GetValueSpec<T>} whenUndefined
     * @param {ValueConvertFailedSpec<T>} [convertFailed]
     * @param {IValueFinalizeFunc<T>} [whenConverted]
     * @param {IValueFinalizeFunc<T>} [whenMatched]
     * @param {IValueFinalizeFunc<T>} [getFinal]
     * @returns {T}
     */
    export function convertValue<T>(value: any | null | undefined, testFn: IValueTestFunc<T>, convertFn: IValueConvertFunc<T>, whenNull: GetValueSpec<T>, whenUndefined: GetValueSpec<T>, convertFailed?: ValueConvertFailedSpec<T>,
        whenConverted?: IValueFinalizeFunc<T>, whenMatched?: IValueFinalizeFunc<T>, getFinal?: IValueFinalizeFunc<T>): T;
    export function convertValue<T>(value: any | null | undefined, arg1: ConvertValueHandlers<T> | IValueTestFunc<T>, convertFn?: IValueConvertFunc<T>, whenNil?: GetValueSpec<T> | NilConvertSpec<T>,
        whenUndefined?: GetValueSpec<T>, convertFailed?: ValueConvertFailedSpec<T>, whenConverted?: IValueFinalizeFunc<T>, whenMatched?: IValueFinalizeFunc<T>, getFinal?: IValueFinalizeFunc<T>): T {
        let testFn: IValueTestFunc<T>;
        let whenNull: GetValueSpec<T> | undefined;
        let nilSpec: NilConvertSpec<T> | undefined;
        if (typeof (arg1) === "function") {
            testFn = arg1;
            if (typeof (whenUndefined) !== null)
                whenNull = <GetValueSpec<T>>whenNil;
            else
                nilSpec = whenNil;
        } else {
            testFn = arg1.test;
            convertFn = arg1.convert;
            if (hasConvertWhenNil(arg1))
                nilSpec = arg1.whenNil;
            else {
                if (hasConvertWhenUndefined(arg1))
                    whenUndefined = arg1.whenUndefined;
                if (hasConvertWhenNull(arg1))
                    whenNull = arg1.whenNull;
            }
            if (typeof (arg1.convertFailed) !== "undefined")
                convertFailed = arg1.convertFailed;
            if (typeof (arg1.whenConverted) !== "undefined")
                whenConverted = arg1.whenConverted;
            if (typeof (arg1.whenMatched) !== "undefined")
                whenMatched = arg1.whenMatched;
            if (typeof (arg1.getFinal) !== "undefined")
                getFinal = arg1.getFinal;
        }
        let result: T = (() => {
            let convertedValue: T;
            if (typeof (nilSpec) !== "undefined") {
                if (typeof (value) === "undefined" || value === null) {
                    convertFn = undefined;
                    convertedValue = (typeof (nilSpec) === "function") ? nilSpec(value) : nilSpec;
                } else if (testFn(value))
                    return (typeof (whenMatched) === "function") ? whenMatched(value) : value;
            } else if (typeof (whenUndefined) !== "undefined") {
                if (typeof (value) === "undefined") {
                    convertFn = undefined;
                    convertedValue = (typeof (whenUndefined) === "function") ? whenUndefined() : whenUndefined;
                } else if (typeof (whenNull) !== "undefined" && value === null) {
                    convertFn = undefined;
                    convertedValue = (typeof (whenNull) === "function") ? whenNull() : whenNull;
                } else if (testFn(value))
                    return (typeof (whenMatched) === "function") ? whenMatched(value) : value;
            } else if (typeof (whenNull) !== "undefined" && (typeof (value) !== "undefined") && value === null) {
                convertFn = undefined;
                convertedValue = (typeof (whenNull) === "function") ? whenNull() : whenNull;
            } else if (testFn(value))
                return (typeof (whenMatched) === "function") ? whenMatched(value) : value;
            if (typeof (convertFn) !== "undefined") {
                if (typeof (convertFailed) !== "undefined")
                    try { convertedValue = convertFn(value); } catch (e) { convertedValue = (typeof (convertFailed) === "function") ? convertFailed(value, e) : convertFailed; }
                else
                    convertedValue = convertFn(value);
            }
            return (typeof (whenConverted) === "function") ? whenConverted(convertedValue) : convertedValue;
        })();
        return (typeof (getFinal) === "function") ? getFinal(result) : result;
    }
    
    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @returns {(value is string | null | undefined)}
     */
    export function isNilOrString(value: any | null | undefined): value is string | null | undefined { return (typeof (value) === "string") || (typeof (value) === "undefined") || value === null; }

    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @returns {(value is string | undefined)}
     */
    export function isUndefinedOrString(value: any | null | undefined): value is string | undefined { return (typeof (value) === "string") || (typeof (value) === "undefined") || value === null; }

    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @returns {(value is string | null)}
     */
    export function isNullOrString(value: any | null | undefined): value is string | null { return (typeof (value) === "string") || (typeof (value) !== "undefined" && value === null); }
    
    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @returns {(string | null | undefined)}
     */
    export function asStringOrNullOrUndefined(value: any | null | undefined): string | null | undefined {
        return convertValue<string>(value, isNilOrString, (v: any) => {
            if (typeof (v) === "object") {
                if (Array.isArray(v))
                    return v.map((e: any) => {
                        return convertValue<string>(e, isNilOrString, (u: any) => {
                            if (typeof (u) === "object") {
                                if (Array.isArray(u))
                                    return u.filter(notNil).join("\n");
                                try {
                                    let p: any = u.valueOf();
                                    if (typeof (p) === "string")
                                        return p;
                                    p = p.toString();
                                    if (typeof (p) === "string")
                                        return p;
                                } catch { /* okay to ignore */ }
                            } else if (typeof (u) === "function")
                                try {
                                    let z: any = u.ValueOf();
                                    if (typeof (z) === "string")
                                        return z;
                                    z = z.toString();
                                    if (typeof (z) === "string")
                                        return z;
                                } catch { /* okay to ignore */ }
                            try {
                                let m: string = u.toString();
                                if (typeof (m) === "string")
                                    return m;
                            } catch { /* okay to ignore */ }
                        });
                    }).filter(notNil).join("\n");
                try {
                    let o: any = v.valueOf();
                    if (typeof (o) === "string")
                        return o;
                    o = o.toString();
                    if (typeof (o) === "string")
                        return o;
                } catch { /* okay to ignore */ }
            } else if (typeof (v) === "function")
                try {
                    let f: any = v.valueOf();
                    if (typeof (f) === "string")
                        return f;
                    f = f.toString();
                    if (typeof (f) === "string")
                        return f;
                } catch { /* okay to ignore */ }
            try {
                let s: string = v.toString();
                if (typeof (s) === "string")
                    return s;
            } catch { /* okay to ignore */ }
        });
    }

    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @returns {(string | null)}
     */
    export function asStringOrNull(value: any | null | undefined): string | null {
        value = asStringOrNullOrUndefined(value);
        return (typeof (value) === "undefined") ? null : value;
    }

    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @returns {(string | undefined)}
     */
    export function asStringOrUndefined(value: any | null | undefined): string | undefined {
        value = asStringOrNullOrUndefined(value);
        if (typeof (value) === "undefined" || typeof (value) === "string")
            return value;
    }

    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @param {string} [defaultValue=""]
     * @returns {string}
     */
    export function asString(value: any | null | undefined, defaultValue: string = ""): string {
        value = asStringOrNullOrUndefined(value);
        return (typeof (value) === "string") ? value : defaultValue;
    }

    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @param {string} defaultValue
     * @returns {string}
     */
    export function asStringAndNotEmpty(value: any | null | undefined, defaultValue: string): string {
        value = asStringOrNullOrUndefined(value);
        return (typeof (value) != "string" || value.length) ? defaultValue : value;
    }

    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @param {string} defaultValue
     * @param {boolean} [trim=false]
     * @returns {string}
     */
    export function asStringAndNotWhiteSpace(value: any | null | undefined, defaultValue: string, trim: boolean = false): string {
        value = asStringOrNullOrUndefined(value);
        if (typeof (value) == "string" && (((trim) ? (value = value.trim()) : value.trim()).length > 0))
            return value;
        return defaultValue;
    }

    /**
     *
     *
     * @export
     * @template T
     * @param {(Array<T> | null | undefined)} value
     * @returns {(Array<T> | undefined)}
     */
    export function asUndefinedOrNotEmpty<T>(value: Array<T> | null | undefined): Array<T> | undefined;
    /**
     *
     *
     * @export
     * @param {(Array<any> | null | undefined)} value
     * @returns {(Array<any> | undefined)}
     */
    export function asUndefinedOrNotEmpty(value: Array<any> | null | undefined): Array<any> | undefined;
    /**
     *
     *
     * @export
     * @param {(string | null | undefined)} value
     * @param {boolean} [trim]
     * @returns {(string | undefined)}
     */
    export function asUndefinedOrNotEmpty(value: string | null | undefined, trim?: boolean): string | undefined;
    export function asUndefinedOrNotEmpty(value: string | Array<any> | null | undefined, trim?: boolean): string | Array<any> | undefined {
        if (typeof (value) !== 'undefined' && value !== null && value.length > 0)
            return (trim === true && typeof (value) === 'string') ? value.trim() : value;
    }

    /**
     *
     *
     * @export
     * @param {(string | null | undefined)} value
     * @param {boolean} [trim]
     * @returns {(string | undefined)}
     */
    export function asUndefinedOrNotWhiteSpace(value: string | null | undefined, trim?: boolean): string | undefined {
        if (typeof (value) === 'string') {
            if (trim === true) {
                if ((value = value.trim()).length > 0)
                    return value;
            } else if (value.trim().length > 0)
                return value;
        }
    }

    /**
     *
     *
     * @export
     * @template T
     * @param {(Array<T> | null | undefined)} value
     * @returns {(Array<T> | undefined)}
     */
    export function asNullOrNotEmpty<T>(value: Array<T> | null | undefined): Array<T> | undefined;
    /**
     *
     *
     * @export
     * @param {(Array<any> | null | undefined)} value
     * @returns {(Array<any> | undefined)}
     */
    export function asNullOrNotEmpty(value: Array<any> | null | undefined): Array<any> | undefined;
    /**
     *
     *
     * @export
     * @param {(string | null | undefined)} value
     * @param {boolean} [trim]
     * @returns {(string | undefined)}
     */
    export function asNullOrNotEmpty(value: string | null | undefined, trim?: boolean): string | undefined;
    export function asNullOrNotEmpty(value: string | Array<any> | null | undefined, trim?: boolean): string | Array<any> | null {
        if (typeof (value) === 'string') {
            if (trim) {
                if ((value = value.trim()).length > 0)
                    return value;
            } else if (value.trim().length > 0)
                return value;
        }
        return null;
    }

    /**
     *
     *
     * @export
     * @param {(string | null | undefined)} value
     * @param {boolean} [trim]
     * @returns {(string | null)}
     */
    export function asNullOrNotWhiteSpace(value: string | null | undefined, trim?: boolean): string | null {
        if (typeof (value) === 'string') {
            if (trim === true) {
                if ((value = value.trim()).length > 0)
                    return value;
            } else if (value.trim().length > 0)
                return value;
        }
        return null;
    }

    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @returns {value is number}
     */
    export function isNumber(value: any | null | undefined): value is number { return typeof (value) === 'number' && !isNaN(value); }

    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @returns {value is number}
     */
    export function isFiniteNumber(value: any | null | undefined): value is number { return typeof (value) === 'number' && !isNaN(value) && Number.isFinite(value); }

    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @returns {value is number}
     */
    export function isFiniteWholeNumber(value: any | null | undefined): value is number { return typeof (value) === 'number' && !isNaN(value) && Number.isFinite(value) && Math.round(value) === value; }

    export const floatingPointNumberRe: RegExp = /^[+-]?\d+(\.\d+)?$/;

    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @param {boolean} [allowWhiteSpace]
     * @param {boolean} [allowExtraneousTrailingCharacters]
     * @returns {(number | null)}
     */
    export function asNumber(value: any | null | undefined, allowWhiteSpace?: boolean, allowExtraneousTrailingCharacters?: boolean): number | null;
    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @param {number} defaultValue
     * @param {boolean} [allowWhiteSpace]
     * @param {boolean} [allowExtraneousTrailingCharacters]
     * @returns {(number | null)}
     */
    export function asNumber(value: any | null | undefined, defaultValue: number, allowWhiteSpace?: boolean, allowExtraneousTrailingCharacters?: boolean): number | null;
    export function asNumber(value: any | null | undefined, defaultValue?: number | boolean, allowWhiteSpace?: boolean, allowExtraneousTrailingCharacters?: boolean): number | null {
        let dv: number | null;
        if (typeof (defaultValue) === "boolean") {
            allowExtraneousTrailingCharacters = allowWhiteSpace === true;
            allowWhiteSpace = defaultValue;
            dv = null;
        } else
            dv = (typeof (dv) === 'number') ? dv : null;
        return convertValue<number>(value, isNumber, (v: any) => {
            if (typeof (v) === "boolean")
                return (v) ? 1 : 0;
            if (typeof (v) === "function" && (typeof (v) === "object" && !Array.isArray(v)))
                try {
                    let f: any = v.valueOf();
                    if (isNumber(f))
                        return f;
                    if (typeof (v) === "boolean")
                        return (v) ? 1 : 0;
                    if (typeof (f) == "string")
                        v = f;
                } catch { /* okay to ignore */ }
            if (typeof (v) !== "string")
                v = asString(v, "");
            if (allowWhiteSpace)
                v = v.trim();
            let n: number = parseFloat(v);
            if (typeof (n) === 'number' && !isNaN(n) && (allowExtraneousTrailingCharacters || floatingPointNumberRe.test(v)))
                return n;
            return dv;
        }, (v: any) => { return dv; })
    }
    
    /**
     *
     *
     * @export
     * @template TSource
     * @template TResult
     * @param {Iterable<TSource>} source
     * @param {(value: TSource, index: number, iterable: Iterable<TSource>) => TResult} callbackfn
     * @param {*} [thisArg]
     * @returns {TResult[]}
     */
    export function map<TSource, TResult>(source: Iterable<TSource>, callbackfn: (value: TSource, index: number, iterable: Iterable<TSource>) => TResult, thisArg?: any): TResult[] {
        let iterator: Iterator<TSource> = source[Symbol.iterator]();
        let r: IteratorResult<TSource> = iterator.next();
        let result: TResult[] = [];
        let index: number = 0;
        if (typeof (thisArg) !== 'undefined')
            while (!r.done) {
                result.push(callbackfn.call(thisArg, r.value, index++, source));
                r = iterator.next();
            }
        else
            while (!r.done) {
                result.push(callbackfn(r.value, index++, source));
                r = iterator.next();
            }
        return result;
    }

    /**
     *
     *
     * @export
     * @template T
     * @param {Iterable<T>} source
     * @param {(value: T, index: number, iterable: Iterable<T>) => boolean} callbackfn
     * @param {*} [thisArg]
     * @returns {boolean}
     */
    export function every<T>(source: Iterable<T>, callbackfn: (value: T, index: number, iterable: Iterable<T>) => boolean, thisArg?: any): boolean {
        let iterator: Iterator<T> = source[Symbol.iterator]();
        let r: IteratorResult<T> = iterator.next();
        let index: number = 0;
        if (typeof (thisArg) !== 'undefined')
            while (!r.done) {
                if (!callbackfn.call(thisArg, r.value, index++, source))
                    return false;
                r = iterator.next();
            }
        else
            while (!r.done) {
                if (!callbackfn(r.value, index++, source))
                    return false;
                r = iterator.next();
            }
        return true;
    }

    /**
     *
     *
     * @export
     * @template T
     * @param {Iterable<T>} source
     * @param {(value: T, index: number, iterable: Iterable<T>) => boolean} callbackfn
     * @param {*} [thisArg]
     * @returns {boolean}
     */
    export function some<T>(source: Iterable<T>, callbackfn: (value: T, index: number, iterable: Iterable<T>) => boolean, thisArg?: any): boolean {
        let iterator: Iterator<T> = source[Symbol.iterator]();
        let r: IteratorResult<T> = iterator.next();
        let index: number = 0;
        if (typeof (thisArg) !== 'undefined')
            while (!r.done) {
                if (callbackfn.call(thisArg, r.value, index++, source))
                    return true;
                r = iterator.next();
            }
        else
            while (!r.done) {
                if (callbackfn(r.value, index++, source))
                    return true;
                r = iterator.next();
            }
        return true;
    }

    /**
     *
     *
     * @export
     * @template T
     * @param {Iterable<T>} source
     * @param {(value: T, index: number, iterable: Iterable<T>) => void} callbackfn
     * @param {*} [thisArg]
     */
    export function forEach<T>(source: Iterable<T>, callbackfn: (value: T, index: number, iterable: Iterable<T>) => void, thisArg?: any) {
        let iterator: Iterator<T> = source[Symbol.iterator]();
        let r: IteratorResult<T> = iterator.next();
        let index: number = 0;
        if (typeof (thisArg) !== 'undefined')
            while (!r.done) {
                callbackfn.call(thisArg, r.value, index++, source);
                r = iterator.next();
            }
        else
            while (!r.done) {
                callbackfn(r.value, index++, source);
                r = iterator.next();
            }
    }

    /**
     *
     *
     * @export
     * @template T
     * @param {Iterable<T>} source
     * @param {(value: T, index: number, iterable: Iterable<T>) => boolean} callbackfn
     * @param {*} [thisArg]
     * @returns {T[]}
     */
    export function filter<T>(source: Iterable<T>, callbackfn: (value: T, index: number, iterable: Iterable<T>) => boolean, thisArg?: any): T[] {
        let iterator: Iterator<T> = source[Symbol.iterator]();
        let r: IteratorResult<T> = iterator.next();
        let result: T[] = [];
        let index: number = 0;
        if (typeof (thisArg) !== 'undefined')
            while (!r.done) {
                if (callbackfn.call(thisArg, r.value, index++, source))
                    result.push(r.value);
                r = iterator.next();
            }
        else
            while (!r.done) {
                if (callbackfn(r.value, index++, source))
                    result.push(r.value);
                r = iterator.next();
            }
        return result;
    }

    /**
     *
     *
     * @export
     * @template TSource
     * @template TResult
     * @param {Iterable<TSource>} source
     * @param {(previousValue: TResult, currentValue: TSource, currentIndex: number, iterable: Iterable<TSource>) => TResult} callbackfn
     * @param {TResult} initialValue
     * @returns {TResult}
     */
    export function reduce<TSource, TResult>(source: Iterable<TSource>, callbackfn: (previousValue: TResult, currentValue: TSource, currentIndex: number, iterable: Iterable<TSource>) => TResult, initialValue: TResult): TResult {
        let iterator: Iterator<TSource> = source[Symbol.iterator]();
        let r: IteratorResult<TSource> = iterator.next();
        let result: TResult = initialValue;
        let index: number = 0;
        while (!r.done) {
            result = callbackfn(result, r.value, index++, source);
            r = iterator.next();
        }
        return result;
    }

    /**
     *
     *
     * @export
     * @template T
     * @param {Iterable<T>} source
     * @param {(value: T, index: number, iterable: Iterable<T>) => boolean} callbackfn
     * @param {*} [thisArg]
     * @returns {(T | undefined)}
     */
    export function first<T>(source: Iterable<T>, callbackfn: (value: T, index: number, iterable: Iterable<T>) => boolean, thisArg?: any): T | undefined {
        let iterator: Iterator<T> = source[Symbol.iterator]();
        let r: IteratorResult<T> = iterator.next();
        let index: number = 0;
        if (typeof (thisArg) !== 'undefined')
            while (!r.done) {
                if (callbackfn.call(thisArg, r.value, index++, source))
                    return r.value;
                r = iterator.next();
            }
        else
            while (!r.done) {
                if (callbackfn(r.value, index, source))
                    return r.value;
                r = iterator.next();
            }
    }

    /**
     *
     *
     * @export
     * @template T
     * @param {Iterable<T>} source
     * @param {(value: T, index: number, iterable: Iterable<T>) => boolean} callbackfn
     * @param {*} [thisArg]
     * @returns {number}
     */
    export function indexOf<T>(source: Iterable<T>, callbackfn: (value: T, index: number, iterable: Iterable<T>) => boolean, thisArg?: any): number {
        let iterator: Iterator<T> = source[Symbol.iterator]();
        let r: IteratorResult<T> = iterator.next();
        let index: number = 0;
        if (typeof (thisArg) !== 'undefined')
            while (!r.done) {
                if (callbackfn.call(thisArg, r.value, index++, source))
                    return index;
                r = iterator.next();
            }
        else
            while (!r.done) {
                if (callbackfn(r.value, index, source))
                    return index;
                r = iterator.next();
            }
    }

    /**
     *
     *
     * @export
     * @template T
     * @param {Iterable<T>} source
     * @param {(value: T, index: number, iterable: Iterable<T>) => boolean} callbackfn
     * @param {*} [thisArg]
     * @returns {(T | undefined)}
     */
    export function last<T>(source: Iterable<T>, callbackfn: (value: T, index: number, iterable: Iterable<T>) => boolean, thisArg?: any): T | undefined {
        let iterator: Iterator<T> = source[Symbol.iterator]();
        let r: IteratorResult<T> = iterator.next();
        let result: T;
        let index: number = 0;
        if (typeof (thisArg) !== 'undefined')
            while (!r.done) {
                if (callbackfn.call(thisArg, r.value, index++, source))
                    result = r.value;
                r = iterator.next();
            }
        else
            while (!r.done) {
                if (callbackfn(r.value, index++, source))
                    result = r.value;
                r = iterator.next();
            }
        return result;
    }

    /**
     *
     *
     * @export
     * @template T
     * @param {Iterable<T>} source
     * @param {number} count
     * @returns {T[]}
     */
    export function takeFirst<T>(source: Iterable<T>, count: number): T[] {
        let iterator: Iterator<T> = source[Symbol.iterator]();
        let r: IteratorResult<T> = iterator.next();
        let result: T[] = [];
        let index: number = 0;
        while (!r.done) {
            if (count == index)
                break;
            result.push(r.value);
            count--;
            r = iterator.next();
        }
        return result;
    }

    /**
     *
     *
     * @export
     * @template T
     * @param {Iterable<T>} source
     * @param {(value: T, index: number, iterable: Iterable<T>) => boolean} callbackfn
     * @param {*} [thisArg]
     * @returns {T[]}
     */
    export function takeWhile<T>(source: Iterable<T>, callbackfn: (value: T, index: number, iterable: Iterable<T>) => boolean, thisArg?: any): T[] {
        let iterator: Iterator<T> = source[Symbol.iterator]();
        let r: IteratorResult<T> = iterator.next();
        let result: T[] = [];
        let index: number = 0;
        if (typeof (thisArg) !== 'undefined')
            while (!r.done) {
                if (!callbackfn.call(thisArg, r.value, index++, source))
                    break;
                result.push(r.value);
                r = iterator.next();
            }
        else
            while (!r.done) {
                if (!callbackfn(r.value, index++, source))
                    break;
                result.push(r.value);
                r = iterator.next();
            }
        return result;
    }

    /**
     *
     *
     * @export
     * @template T
     * @param {Iterable<T>} source
     * @param {Number} count
     * @returns {T[]}
     */
    export function skipFirst<T>(source: Iterable<T>, count: Number): T[] {
        let iterator: Iterator<T> = source[Symbol.iterator]();
        let r: IteratorResult<T> = iterator.next();
        let result: T[] = [];
        let index: number = 0;
        while (!r.done) {
            if (index == count) {
                do {
                    result.push(r.value);
                    r = iterator.next();
                } while (!r.done);
                return result;
            }
            r = iterator.next();
            index++;
        }
        return result;
    }

    /**
     *
     *
     * @export
     * @template T
     * @param {Iterable<T>} source
     * @param {(value: T, index: number, iterable: Iterable<T>) => boolean} callbackfn
     * @param {*} [thisArg]
     * @returns {T[]}
     */
    export function skipWhile<T>(source: Iterable<T>, callbackfn: (value: T, index: number, iterable: Iterable<T>) => boolean, thisArg?: any): T[] {
        let iterator: Iterator<T> = source[Symbol.iterator]();
        let r: IteratorResult<T> = iterator.next();
        let result: T[] = [];
        let index: number = 0;
        if (typeof (thisArg) !== 'undefined')
            while (!r.done) {
                if (!callbackfn.call(thisArg, r.value, index++, source)) {
                    do {
                        result.push(r.value);
                        r = iterator.next();
                    } while (!r.done);
                    return result;
                }
                r = iterator.next();
            }
        else
            while (!r.done) {
                if (!callbackfn(r.value, index++, source)) {
                    do {
                        result.push(r.value);
                        r = iterator.next();
                    } while (!r.done);
                    return result;
                }
                r = iterator.next();
            }
        return result;
    }

    /**
     *
     *
     * @export
     * @template T
     * @param {Iterable<T>} source
     * @param {(x: T, y: T) => boolean} [callbackfn]
     * @param {*} [thisArg]
     * @returns {T[]}
     */
    export function unique<T>(source: Iterable<T>, callbackfn?: (x: T, y: T) => boolean, thisArg?: any): T[] {
        if (typeof (callbackfn) !== 'function')
            callbackfn = function (x: T, y: T) { return x === y; }
        let iterator: Iterator<T> = source[Symbol.iterator]();
        let r: IteratorResult<T> = iterator.next();
        let result: T[] = [];
        if (!r.done) {
            result.push(r.value);
            r = iterator.next();
            let index: number = 0;
            if (typeof (thisArg) !== 'undefined')
                while (!r.done) {
                    if (!result.some((value: T) => callbackfn.call(thisArg, r.value, value)))
                        result.push(r.value);
                    r = iterator.next();
                }
            else
                while (!r.done) {
                    if (!result.some((value: T) => callbackfn(r.value, value)))
                        result.push(r.value);
                    r = iterator.next();
                }
        }
        return result;
    }

    /**
     *
     *
     * @export
     * @template T
     * @param {Iterable<T>} source
     * @param {string} [separator]
     * @returns {string}
     */
    export function join<T>(source: Iterable<T>, separator?: string): string {
        if (Array.isArray(source))
            return source.join(separator);
        let iterator: Iterator<T> = source[Symbol.iterator]();
        let r: IteratorResult<T> = iterator.next();
        let result: T[] = [];
        let index: number = 0;
        while (!r.done) {
            result.push(r.value);
            r = iterator.next();
        }
        return result.join(separator);
    }

    /**
     *
     *
     * @param {(any | null | undefined)} obj
     * @returns {obj is Iterable<any>}
     */
    function isIterable(obj: any | null | undefined): obj is Iterable<any> { return typeof (obj) !== 'undefined' && typeof (obj[Symbol.iterator]) === 'function'; }

    /**
     *
     *
     * @export
     * @interface ItoDebugHtmlCssOptions
     */
    export interface ItoDebugHtmlCssOptions {
        /**
         *
         *
         * @type {string}
         * @memberof ItoDebugHtmlCssOptions
         */
        nilValue?: string,

        /**
         *
         *
         * @type {string}
         * @memberof ItoDebugHtmlCssOptions
         */
        stringValue?: string,

        /**
         *
         *
         * @type {string}
         * @memberof ItoDebugHtmlCssOptions
         */
        primitiveValue?: string;

        /**
         *
         *
         * @type {string}
         * @memberof ItoDebugHtmlCssOptions
         */
        objectValue?: string;

        /**
         *
         *
         * @type {string}
         * @memberof ItoDebugHtmlCssOptions
         */
        skippedValue?: string;

        /**
         *
         *
         * @type {string}
         * @memberof ItoDebugHtmlCssOptions
         */
        keyName?: string;

        /**
         *
         *
         * @type {string}
         * @memberof ItoDebugHtmlCssOptions
         */
        typeName?: string;

        /**
         *
         *
         * @type {string}
         * @memberof ItoDebugHtmlCssOptions
         */
        list?: string;

        /**
         *
         *
         * @type {string}
         * @memberof ItoDebugHtmlCssOptions
         */
        item?: string;

        /**
         *
         *
         * @type {string}
         * @memberof ItoDebugHtmlCssOptions
         */
        errorMessage?: string;
    }

    /**
     *
     *
     * @export
     * @interface ItoDebugHtmlOptions
     */
    export interface ItoDebugHtmlOptions {
        /**
         *
         *
         * @type {number}
         * @memberof ItoDebugHtmlOptions
         */
        maxDepth?: number;

        /**
         *
         *
         * @type {number}
         * @memberof ItoDebugHtmlOptions
         */
        maxItems?: number;

        /**
         *
         *
         * @type {ItoDebugHtmlCssOptions}
         * @memberof ItoDebugHtmlOptions
         */
        cssClass?: ItoDebugHtmlCssOptions
    }

    /**
     *
     *
     * @interface ItoDebugHTMLstate
     * @extends {ItoDebugHtmlOptions}
     */
    interface ItoDebugHTMLstate extends ItoDebugHtmlOptions {
        maxDepth: number;
        maxItems: number;
        currentCount: number; currentDepth: number, result: string[]
    }

    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @param {ItoDebugHtmlOptions} [options]
     * @returns {string}
     */
    export function toDebugHTML(value: any | null | undefined, options?: ItoDebugHtmlOptions): string {
        let state: ItoDebugHTMLstate
        if (typeof (options) === 'undefined')
            state = { maxDepth: 16, maxItems: 1024, currentCount: 0, currentDepth: 0, cssClass: {}, result: [] };
        else
            state = {
                maxDepth: (typeof (options.maxDepth) !== 'number' || isNaN(options.maxDepth) || !Number.isFinite(options.maxDepth)) ? 16 : options.maxDepth,
                maxItems: (typeof (options.maxItems) !== 'number' || isNaN(options.maxItems) || !Number.isFinite(options.maxItems)) ? 1024 : options.maxItems,
                currentCount: 0,
                currentDepth: 0,
                cssClass: (typeof (options.cssClass) !== 'object' || options.cssClass === null) ? {} : options.cssClass,
                result: []
            };
        __toDebugHTML(value, state);
        return state.result.join("\n");
    }

    /**
     *
     *
     * @param {('div' | 'span' | 'ul' | 'ol' | 'dl' | 'li' | 'dd' | 'dt')} tagName
     * @param {(...(string | undefined)[])} className
     * @returns {string}
     */
    function makeOpenTag(tagName: 'div' | 'span' | 'ul' | 'ol' | 'dl' | 'li' | 'dd' | 'dt', ...className: (string | undefined)[]): string {
        if (typeof (className) === 'object' && className !== null && (className = unique(className.filter(notNilOrWhiteSpace).map((s: string) => s.trim()))).length > 0)
            return "<" + tagName + " class=\"" + className.join(" ") + "\">";
        return "<" + tagName + ">";
    }

    /**
     *
     *
     * @param {string} content
     * @param {(...(string | undefined)[])} className
     * @returns {string}
     */
    function makeHtmlValue(content: string, ...className: (string | undefined)[]): string;

    /**
     *
     *
     * @param {string} content
     * @param {boolean} doNotEscape
     * @param {(...(string | undefined)[])} className
     * @returns {string}
     */
    function makeHtmlValue(content: string, doNotEscape: boolean, ...className: (string | undefined)[]): string;
    function makeHtmlValue(content: string, spec: boolean | string, ...className: (string | undefined)[]): string {
        let doNotEscape: boolean;
        if (typeof (spec) === 'boolean') {
            if (typeof (className) !== 'object' || className === null)
                className = [];
            doNotEscape = spec;
        }
        else
            className = (typeof (className) !== 'object' || className === null) ? [spec].concat(className) : [spec];
        if ((className = unique(className.filter(notNilOrWhiteSpace).map((s: string) => s.trim()))).length > 0) {
            if (doNotEscape)
                return "<span class=\"" + className.join(" ") + "\">" + content + '</span>';
            return "<span class=\"" + className.join(" ") + "\">" + escape(content) + '</span>';
        }
        return (doNotEscape) ? content : escape(content);
    }
    function __toDebugHTML(value: any | null | undefined, state: ItoDebugHTMLstate): void {
        if (state.currentCount < state.maxItems)
            state.currentCount++;
        if (typeof (value) === "undefined")
            state.result.push(makeHtmlValue('undefined', state.cssClass.nilValue));
        else if (typeof (value) === "object") {
            if (value === null)
                state.result.push(makeHtmlValue('null', state.cssClass.nilValue));
            else {
                let name: string = '';
                try {
                    let v: string = value[Symbol.toStringTag]();
                    if (notNilOrWhiteSpace(v))
                        name = v;
                } catch { /* okay to ignore */ }
                if (Array.isArray(value)) {
                    if (name.length == 0)
                        name = 'Array';
                    if (state.currentCount >= state.maxItems)
                        state.result.push(makeHtmlValue("<" + name + ">", state.cssClass.typeName) + makeHtmlValue("{ length: " + value.length.toString() + " }", state.cssClass.skippedValue));
                    else if (value.length == 0)
                        state.result.push(makeHtmlValue("<" + name + ">", state.cssClass.typeName) + "[]");
                    else {
                        state.result.push(makeHtmlValue("<" + name + ">", state.cssClass.typeName) + ": [");
                        state.result.push(makeOpenTag("ol", state.cssClass.list));
                        if (state.currentDepth < state.maxDepth) {
                            let arrState: ItoDebugHTMLstate = { maxDepth: state.maxDepth, maxItems: state.maxItems, currentCount: state.currentCount, currentDepth: state.currentDepth + 1, cssClass: state.cssClass, result: [] };
                            let reachedMax: boolean = false;
                            value.forEach((o: any | null | undefined) => {
                                if (state.currentCount < state.maxItems) {
                                    __toDebugHTML(o, arrState);
                                    state.result.push(makeOpenTag("li", state.cssClass.item) + arrState.result.map((s: string) => ((s.trim()).length == 0) ? "" : "\t" + s).join("\n") + "</li>");
                                    arrState.result = [];
                                } else
                                    reachedMax = true;
                            });
                            if (reachedMax)
                                state.result.push(makeOpenTag("li", state.cssClass.item, state.cssClass.skippedValue) + makeHtmlValue("Reached max output limit: { length: " + value.length.toString() + " }", state.cssClass.skippedValue) + "</li>");
                            state.currentCount = arrState.currentCount;
                        } else {
                            // TODO: Iterate without recursion
                        }
                        state.result.push("</ol>");
                        state.result.push("]");
                    }
                } else {
                    if (isIterable(value)) {
                        if (name.length == 0)
                            name = 'Iterable';
                        state.result.push(makeHtmlValue("<" + name + ">", state.cssClass.typeName) + ": [");
                        state.result.push(makeOpenTag("ul", state.cssClass.list));
                        if (state.currentDepth < state.maxDepth) {
                            let arrState: ItoDebugHTMLstate = { maxDepth: state.maxDepth, maxItems: state.maxItems, currentCount: state.currentCount, currentDepth: state.currentDepth + 1, cssClass: state.cssClass, result: [] };
                            let reachedMax: boolean = false;
                            forEach<any>(value, (o: any, index: number) => {
                                if (state.currentCount < state.maxItems) {
                                    __toDebugHTML(o, arrState);
                                    state.result.push(makeOpenTag("li", state.cssClass.item) + arrState.result.map((s: string) => ((s.trim()).length == 0) ? "" : "\t" + s).join("\n") + "</li>");
                                    arrState.result = [];
                                } else
                                    reachedMax = true;
                            });
                            if (reachedMax)
                                state.result.push(makeOpenTag("li", state.cssClass.item, state.cssClass.skippedValue) + makeHtmlValue("Reached max output limit { ... }", state.cssClass.skippedValue) + "</li>");
                            state.currentCount = arrState.currentCount;
                        } else {
                            // TODO: Iterate without recursion
                        }
                        state.result.push("</ul>");
                        state.result.push("]");
                    } else {
                        if (name.length == 0)
                            name = 'object';
                        let json: any | undefined = undefined;
                        let fn: any = (<{ [index: string]: any }>value)["toJSON"];
                        if (typeof (fn) === 'function')
                            try { json = fn.call(value); } catch { /* okay to ignore */ }
                        if (!isNil(json)) {
                            if (typeof (json) === 'string') {
                                state.result.push(makeHtmlValue("<" + name + ">", state.cssClass.typeName) + ": " + json);
                                return;
                            }
                            if (typeof (json) !== 'object') {
                                state.result.push(makeHtmlValue("<" + name + ">", state.cssClass.typeName) + ": " + makeHtmlValue(JSON.stringify(value), state.cssClass.primitiveValue));
                                return;
                            }
                            if (Array.isArray(json)) {
                                if (state.currentDepth < state.maxDepth) {
                                    let arrState: ItoDebugHTMLstate = { maxDepth: state.maxDepth, maxItems: state.maxItems, currentCount: state.currentCount, currentDepth: state.currentDepth + 1, cssClass: state.cssClass, result: [] };
                                    __toDebugHTML(json, arrState);
                                    state.result.push(makeHtmlValue("<" + name + ">", state.cssClass.typeName) + ": " + arrState.result.map((s: string) => ((s.trim()).length == 0) ? "" : "\t" + s).join("\n"));
                                    state.currentCount = arrState.currentCount;
                                } else {
                                    // TODO: Iterate without recursion
                                }
                                return;
                            }
                            value = json;
                        }

                        let propertyNames: string[] = [];
                        try { propertyNames = Object.getOwnPropertyNames(value); } catch { /* okay to ignore */ }
                        if (isNilOrEmpty(propertyNames))
                            state.result.push(makeHtmlValue("<" + name + ">", state.cssClass.typeName) + ": " + makeHtmlValue(JSON.stringify(value), state.cssClass.objectValue));
                        else {
                            state.result.push(makeHtmlValue("<" + name + ">", state.cssClass.typeName) + ": [");
                            state.result.push(makeOpenTag("dl", state.cssClass.list));
                            if (state.currentDepth < state.maxDepth) {
                                let arrState: ItoDebugHTMLstate = { maxDepth: state.maxDepth, maxItems: state.maxItems, currentCount: state.currentCount, currentDepth: state.currentDepth + 1, cssClass: state.cssClass, result: [] };
                                propertyNames.forEach((n: string) => {
                                    state.result.push(makeOpenTag('dt', state.cssClass.item) + escape(name) + "</dt>");
                                    if (state.currentCount < state.maxItems) {
                                        try {
                                            __toDebugHTML((<{ [key: string]: any }>value)[n], arrState);
                                            state.result.push(makeOpenTag("dd", state.cssClass.item) + arrState.result.map((s: string) => ((s.trim()).length == 0) ? "" : "\t" + s).join("\n") + "</dd>");
                                        } catch (e) {
                                            state.result.push(makeOpenTag("dd", state.cssClass.item) + makeHtmlValue(JSON.stringify(e), state.cssClass.errorMessage) + "</dd>");
                                        }
                                        arrState.result = [];
                                    } else {
                                        // TODO: Add without recursion
                                    }
                                });
                            } else {
                                // TODO: Iterate without recursion
                            }
                            state.result.push("</dl>");
                            state.result.push("]");
                        }

                    }
                }
            }
        } else if (typeof (value) === 'string')
            state.result.push(makeHtmlValue(JSON.stringify(value), state.cssClass.stringValue));
        else
            state.result.push(makeHtmlValue(JSON.stringify(value), state.cssClass.primitiveValue));
    }

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
    export function asErrorResult(value: any): ErrorResult {
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
     * @param {({ (a1: T1, a2: T2, a3: T3): any } | undefined)} currentCallback
     * @param {{ (a1: T1, a2: T2, a3: T3): any }} newCallback
     * @returns {{ (a1: T1, a2: T2, a3: T3): any }}
     */
    export function chainCallback<T1, T2, T3>(currentCallback: { (a1: T1, a2: T2, a3: T3): any } | undefined, newCallback: { (a1: T1, a2: T2, a3: T3): any }): { (a1: T1, a2: T2, a3: T3): any };
    /**
     *
     *
     * @template T1
     * @template T2
     * @param {({ (a1: T1, a2: T2): any } | undefined)} currentCallback
     * @param {{ (a1: T1, a2: T2): any }} newCallback
     * @returns {{ (a1: T1, a2: T2): any }}
     */
    export function chainCallback<T1, T2>(currentCallback: { (a1: T1, a2: T2): any } | undefined, newCallback: { (a1: T1, a2: T2): any }): { (a1: T1, a2: T2): any };
    /**
     *
     *
     * @template T
     * @param {({ (a: T): any } | undefined)} currentCallback
     * @param {{ (a: T): any }} newCallback
     * @returns {{ (a: T): any }}
     */
    export function chainCallback<T>(currentCallback: { (a: T): any } | undefined, newCallback: { (a: T): any }): { (a: T): any };
    /**
     *
     *
     * @param {({ (): any } | undefined)} currentCallback
     * @param {{ (): any }} newCallback
     * @returns {{ (): any }}
     */
    export function chainCallback(currentCallback: { (): any } | undefined, newCallback: { (): any }): { (): any };
    export function chainCallback(currentCallback: Function | undefined, newCallback: Function, thisArg?: any): Function {
        if (typeof (currentCallback) !== "function")
            return newCallback;
        return function(...args: any[]) {
            try { currentCallback.apply(thisArg, args); }
            finally { newCallback.apply(thisArg, args); }
        }
    }

    export function callIfFunction<T1, T2, T3>(thisArg: any | undefined, callbackfn: { (a1: T1, a2: T2, a3: T3): any } | undefined, value1: T1, value2: T2, value3: T3): any;
    export function callIfFunction<T1, T2>(thisArg: any | undefined, callbackfn: { (a1: T1, a2: T2): any } | undefined, value1: T1, value2: T2): any;
    export function callIfFunction<T>(thisArg: any | undefined, callbackfn: { (a: T): any } | undefined, value: T): any;
    export function callIfFunction(thisArg: any | undefined, callbackfn: Function | undefined, ...args: any[]): any {
        if (typeof callbackfn === "function")
            return callbackfn.apply(thisArg, args);
    }

    export function execIfFunction<T1, T2, T3>(callbackfn: { (a1: T1, a2: T2, a3: T3): any } | undefined, value1: T1, value2: T2, value3: T3): any;
    export function execIfFunction<T1, T2>(callbackfn: { (a1: T1, a2: T2): any } | undefined, value1: T1, value2: T2): any;
    export function execIfFunction<T>(callbackfn: { (a: T): any } | undefined, value: T): any;
    export function execIfFunction(callbackfn: Function | undefined, ...args: any[]): any {
        if (typeof callbackfn === "function")
            return callbackfn.apply(this, args);
    }

    export interface IValueCallback<T> { (value: T): void; }

    export interface IValueErrorCallback<T> { (value: T, reason: ErrorResult): void; }

    // #endregion
}
