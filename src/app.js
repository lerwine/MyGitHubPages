var app;
(function (app) {
    app.ModuleNames = {
        app: "MyGitHubPages",
        home: "MyGitHubPages.home",
        regexTester: "MyGitHubPages.regexTester",
        uriBuilder: "MyGitHubPages.uriBuilder",
        colorBuilder: "MyGitHubPages.colorBuilder"
    };
    app.ModulePaths = {
        home: "/home",
        regexMatch: "/regex/match",
        regexReplace: "/regex/replace",
        regexSplit: "/regex/split",
        uriBuilder: "/uri",
        colorBuilder: "/color"
    };
    app.ControllerNames = {
        mainContent: "mainContentController",
        homePage: "homePageController",
        regexMatch: "regexMatchController",
        regexReplace: "regexReplaceController",
        regexSplit: "regexSplitController",
        uriBuilder: "uriBuilderPageController",
        colorBuilder: "colorBuilderPageController"
    };
    app.ServiceNames = {
        pageTitle: "pageTitleService",
        mainNavigationProvider: "mainNavigationProvider",
        regexParser: "regexParser"
    };
    app.EventNames = {
        setPageTitle: "MyGitHubPages.setPageTitle",
        topNavChanged: "MyGitHubPages.topNavChanged",
        regexPatternChanged2: "MyGitHubPages.regexPatternChanged",
        regexFlagsChanged2: "MyGitHubPages.regexFlagsChanged",
        startRegexPatternParse2: "MyGitHubPages.startRegexPatternParse",
        endRegexPatternParse2: "MyGitHubPages.endRegexPatternParse",
        regexPatternParseError2: "MyGitHubPages.regexPatternParseError",
        regexPatternParseSuccess: "MyGitHubPages.regexPatternParseSuccess",
        regexObjectChanged2: "MyGitHubPages.regexObjectChanged"
    };
    app.HashPrefix = "!";
    app.NavPrefix = "#!";
    class PageTitleService {
        constructor() {
            this._pageTitle = "Lenny's GitHub Repositories";
            this._pageSubTitle = "";
            this._regexHref = app.NavPrefix + app.ModulePaths.regexMatch;
            this[Symbol.toStringTag] = app.ServiceNames.pageTitle;
        }
        regexHref(value) {
            if (typeof value === "string") {
                if ((value = value.trim()).length > 0) {
                    this._regexHref = value;
                    if (typeof this._scope !== "undefined")
                        this._scope.regexHref = this._regexHref;
                }
            }
            return this._regexHref;
        }
        pageTitle(value) {
            if (typeof value === "string") {
                this._pageTitle = ((value = value.trim()).length == 0) ? "Lenny's GitHub Page" : value;
                if (typeof this._scope !== "undefined")
                    this._scope.pageTitle = this._pageTitle;
            }
            return this._pageTitle;
        }
        pageSubTitle(value) {
            if (typeof value === "string") {
                this._pageSubTitle = value;
                if (typeof this._scope !== "undefined")
                    this._scope.showSubtitle = (this._scope.subTitle = this._pageSubTitle).trim().length > 0;
            }
            return this._pageSubTitle;
        }
        setScope(scope) {
            if (typeof scope === "object" && scope !== null) {
                (this._scope = scope).pageTitle = this._pageTitle;
                scope.showSubtitle = (scope.subTitle = this._pageSubTitle).trim().length > 0;
                this._scope.regexHref = this._regexHref;
            }
        }
    }
    app.PageTitleService = PageTitleService;
    class MainContentController {
        constructor($scope, pageTitleService) {
            this.$scope = $scope;
            this[Symbol.toStringTag] = app.ControllerNames.mainContent;
            let ctrl = this;
            $scope.regexHref = app.NavPrefix + app.ModulePaths.regexMatch;
            pageTitleService.setScope($scope);
        }
        $doCheck() { }
    }
    app.MainContentController = MainContentController;
    app.mainModule = angular.module(app.ModuleNames.app, ['ngRoute'])
        .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
            $locationProvider.hashPrefix(app.HashPrefix);
            $routeProvider.when(app.ModulePaths.home, {
                templateUrl: 'home/home.htm',
                controller: app.ControllerNames.homePage
            }).when(app.ModulePaths.regexMatch, {
                templateUrl: 'regexTester/match.htm',
                controller: app.ControllerNames.regexMatch
            }).when(app.ModulePaths.regexReplace, {
                templateUrl: 'regexTester/replace.htm',
                controller: app.ControllerNames.regexReplace
            }).when(app.ModulePaths.regexSplit, {
                templateUrl: 'regexTester/split.htm',
                controller: app.ControllerNames.regexSplit
            }).when(app.ModulePaths.uriBuilder, {
                templateUrl: 'uriBuilder/uriBuilder.htm',
                controller: app.ControllerNames.uriBuilder
            }).when(app.ModulePaths.colorBuilder, {
                templateUrl: 'colorBuilder/colorBuilder.htm',
                controller: app.ControllerNames.colorBuilder
            }).when('/', { redirectTo: app.ModulePaths.home });
        }])
        .service(app.ServiceNames.pageTitle, PageTitleService)
        .controller(app.ControllerNames.mainContent, ['$scope', app.ServiceNames.pageTitle, MainContentController]);
})(app || (app = {}));
//# sourceMappingURL=app.js.map