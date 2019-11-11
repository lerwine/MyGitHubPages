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
    }
    /**
     * Custom event names.
     * @export
     * @constant EventNames
     * @type {IEventNames}
     */
    export const EventNames: IEventNames = {
        setPageTitle: 'MyGitHubPages.setPageTitle', topNavChanged: 'MyGitHubPages.topNavChanged'
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
        .service(ServiceNames.pageLocation, PageLocationService)
        .controller(ControllerNames.mainContent, ['$scope', ServiceNames.pageLocation, MainContentController]);
}
