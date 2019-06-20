/// <reference path="Scripts/typings/jquery/jquery.d.ts"/>
/// <reference path="Scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="Scripts/typings/angularjs/angular-route.d.ts"/>
/// <reference path="sys.ts"/>

namespace app {
    /**
    * The main module for this app.
    *
    * @type {ng.IModule}
    */
    export let mainModule: ng.IModule = angular.module("mainModule", []);
    
    export interface IParsedUriQueryComponent {
        originalString: string;
        name: string;
        value?: string;
    }

    export interface IParsedUriPathSegment {
        originalString: string;
        name: string;
    }
    export interface IParsedUriPathComponent {
        originalString: string;
        path: string;
        segments: IParsedUriPathSegment[];
    }

    export interface IParsedUriHostComponent {
        originalString: string;
        name: string;
        port?: number;
    }

    export interface IParsedUriUserInfoComponent {
        originalString: string;
        userName: string;
        password?: string;
    }

    export interface IParsedUriOriginComponent {
        originalString: string;
        scheme: string;
        separator: string;
        userInfo?: IParsedUriUserInfoComponent;
        host?: IParsedUriHostComponent;
    }

    export interface IParsedUriComponents {
        originalString: string;
        href: string;
        origin?: IParsedUriOriginComponent;
        path: IParsedUriPathComponent;
        query?: IParsedUriQueryComponent;
        fragment?: string;
    }

    const schemeParseRe: RegExp = /^(?:([^:@\\\/]+)(:(?:\/\/?)?)|(:\/\/?))/;


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
        return pages.filter(sys.notNil).map((item: INavigationLinkConfig) => {
            if (typeof (item) !== "object")
                return { href: "#", text: "(invalid configuration data)", disabled: true, links: [], cssClass: ["nav-item", "disabled"], onClick: () => { return false; } };

            if (sys.isNilOrWhiteSpace(item.href)) {
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
            }, (reason: any) => { return <IAppConfigLoadResult>{ requestInfo: { statusText: sys.asString(reason, "Unknown error") }, links: [] }; });
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
                if (sys.isNilOrWhiteSpace(pageId))
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

    mainModule.directive('appTopNavAndHeader', ['applicationConfigurationLoader', (navLoader: applicationConfigurationLoaderService) => {
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
}
