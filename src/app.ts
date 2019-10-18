/// <reference path="Scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="Scripts/typings/angularjs/angular-route.d.ts"/>
/// <reference path="Scripts/typings/bootstrap/index.d.ts"/>

module app {
    export const ModuleNames = {
        app: "MyGitHubPages" as "MyGitHubPages",
        home: "MyGitHubPages.home" as "MyGitHubPages.home",
        regexTester: "MyGitHubPages.regexTester" as "MyGitHubPages.regexTester",
        uriBuilder: "MyGitHubPages.uriBuilder" as "MyGitHubPages.uriBuilder",
        colorBuilder: "MyGitHubPages.colorBuilder" as "MyGitHubPages.colorBuilder"
    };
    
    export const ModulePaths = {
        home: "/home" as "/home",
        regexMatch: "/regex/match" as "/regex/match",
        regexReplace: "/regex/replace" as "/regex/replace",
        regexSplit: "/regex/split" as "/regex/split",
        uriBuilder: "/uri" as "/uri",
        colorBuilder: "/color" as "/color"
    };

    export const ControllerNames = {
        mainContent: "mainContentController" as "mainContentController",
        homePage: "homePageController" as "homePageController",
        regexMatch: "regexMatchController" as "regexMatchController",
        regexReplace: "regexReplaceController" as "regexReplaceController",
        regexSplit: "regexSplitController" as "regexSplitController",
        uriBuilder: "uriBuilderPageController" as "uriBuilderPageController",
        colorBuilder: "colorBuilderPageController" as "colorBuilderPageController"
    }

    export const ServiceNames = {
        pageTitle: "pageTitleService" as "pageTitleService",
        mainNavigationProvider: "mainNavigationProvider" as "mainNavigationProvider",
        regexParser: "regexParser" as "regexParser"
    }

    export const EventNames = {
        setPageTitle: "MyGitHubPages.setPageTitle" as "MyGitHubPages.setPageTitle",
        topNavChanged: "MyGitHubPages.topNavChanged" as "MyGitHubPages.topNavChanged",
        regexPatternChanged2: "MyGitHubPages.regexPatternChanged" as "MyGitHubPages.regexPatternChanged",
        regexFlagsChanged2: "MyGitHubPages.regexFlagsChanged" as "MyGitHubPages.regexFlagsChanged",
        startRegexPatternParse2: "MyGitHubPages.startRegexPatternParse" as "MyGitHubPages.startRegexPatternParse",
        endRegexPatternParse2: "MyGitHubPages.endRegexPatternParse" as "MyGitHubPages.endRegexPatternParse",
        regexPatternParseError2: "MyGitHubPages.regexPatternParseError" as "MyGitHubPages.regexPatternParseError",
        regexPatternParseSuccess: "MyGitHubPages.regexPatternParseSuccess" as "MyGitHubPages.regexPatternParseSuccess",
        regexObjectChanged2: "MyGitHubPages.regexObjectChanged" as "MyGitHubPages.regexObjectChanged"
    }

    export const HashPrefix = "!";
    export const NavPrefix = "#!";
    
    export type DomClickCallback = { (event?: BaseJQueryEventObject): void; } & Function;

    export class PageTitleService {
        private _pageTitle: string = "Lenny's GitHub Repositories";
        private _pageSubTitle: string = "";
        private _regexHref: string = NavPrefix + ModulePaths.regexMatch;
        private _scope: IMainContentControllerScope;
        readonly [Symbol.toStringTag]: string = ServiceNames.pageTitle;
        constructor() { }
        regexHref(value?: string): string {
            if (typeof value === "string") {
                if ((value = value.trim()).length > 0) {
                    this._regexHref = value;
                    if (typeof this._scope !== "undefined")
                        this._scope.regexHref = this._regexHref;
                }
            }
            return this._regexHref;
        }
        pageTitle(value?: string): string {
            if (typeof value === "string") {
                this._pageTitle = ((value = value.trim()).length == 0) ? "Lenny's GitHub Page" : value;
                if (typeof this._scope !== "undefined")
                    this._scope.pageTitle = this._pageTitle;
            }
            return this._pageTitle;
        }
        pageSubTitle(value?: string): string {
            if (typeof value === "string") {
                this._pageSubTitle = value;
                if (typeof this._scope !== "undefined")
                    this._scope.showSubtitle = (this._scope.subTitle = this._pageSubTitle).trim().length > 0;
            }
            return this._pageSubTitle;
        }
        setScope(scope: IMainContentControllerScope): void {
            if (typeof scope === "object" && scope !== null) {
                (this._scope = scope).pageTitle = this._pageTitle;
                scope.showSubtitle = (scope.subTitle = this._pageSubTitle).trim().length > 0;
                this._scope.regexHref = this._regexHref;
            }
        }
    }

    export interface IMainContentControllerScope extends ng.IScope {
        pageTitle: string;
        showSubtitle: boolean;
        subTitle: string;
        regexHref: string;
    }

    export class MainContentController implements ng.IController {
        readonly [Symbol.toStringTag]: string = ControllerNames.mainContent;
        constructor(private readonly $scope: IMainContentControllerScope, pageTitleService: PageTitleService) {
            let ctrl: MainContentController = this;
            $scope.regexHref = NavPrefix + ModulePaths.regexMatch;
            pageTitleService.setScope($scope);
        }
        $doCheck(): void { }
    }
    
    export let mainModule: ng.IModule = angular.module(ModuleNames.app, ['ngRoute'])
        .config(['$locationProvider', '$routeProvider', function ($locationProvider: ng.ILocationProvider, $routeProvider: ng.route.IRouteProvider) {
            $locationProvider.hashPrefix(HashPrefix);
            $routeProvider.when(ModulePaths.home, {
                templateUrl: 'home/home.htm',
                controller: ControllerNames.homePage
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
        .service(ServiceNames.pageTitle, PageTitleService)
        .controller(ControllerNames.mainContent, ['$scope', ServiceNames.pageTitle, MainContentController]);
}
