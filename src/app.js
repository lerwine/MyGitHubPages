var app;
(function (app) {
    app.ModuleNames = {
        app: 'MyGitHubPages', regexTester: 'MyGitHubPages.regexTester', uriBuilder: 'MyGitHubPages.uriBuilder',
        colorBuilder: 'MyGitHubPages.colorBuilder'
    };
    app.ModulePaths = {
        home: '/home', git: '/git', vscode: '/vscode', npm: '/npm', regexMatch: '/regex/match', regexReplace: '/regex/replace',
        regexSplit: '/regex/split', uriBuilder: '/uri', colorBuilder: '/color'
    };
    app.ControllerNames = {
        mainContent: 'mainContentController', staticPage: 'staticPageController', regexMatch: 'regexMatchController',
        regexReplace: 'regexReplaceController', regexSplit: 'regexSplitController', uriBuilder: 'uriBuilderPageController',
        colorBuilder: 'colorBuilderPageController'
    };
    app.ServiceNames = {
        pageLocation: 'pageLocationService',
        mainNavigationProvider: 'mainNavigationProvider', regexParser: 'regexParser'
    };
    app.EventNames = {
        setPageTitle: 'MyGitHubPages.setPageTitle', topNavChanged: 'MyGitHubPages.topNavChanged'
    };
    app.HashPrefix = '!';
    app.NavPrefix = '#!';
    class PageLocationService {
        constructor($rootScope) {
            this._pageTitle = 'Lenny\'s GitHub Repositories';
            this._pageSubTitle = '';
            this._regexHref = app.NavPrefix + app.ModulePaths.regexMatch;
            this[Symbol.toStringTag] = app.ServiceNames.pageLocation;
            const svc = this;
            $rootScope.$on('$routeChangeSuccess', function (event, current) {
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
        static ConfigureRoutes($routeProvider) {
            $routeProvider.when(app.ModulePaths.home, {
                templateUrl: 'home.htm',
                controller: app.ControllerNames.staticPage
            }).when(app.ModulePaths.git, {
                templateUrl: 'git.htm',
                controller: app.ControllerNames.staticPage
            }).when(app.ModulePaths.vscode, {
                templateUrl: 'vscode.htm',
                controller: app.ControllerNames.staticPage
            }).when(app.ModulePaths.npm, {
                templateUrl: 'npm.htm',
                controller: app.ControllerNames.staticPage
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
        }
        regexHref(value) {
            if (typeof value === 'string') {
                if ((value = value.trim()).length > 0) {
                    this._regexHref = value;
                    if (typeof this._scope !== 'undefined')
                        this._scope.regexHref = this._regexHref;
                }
            }
            return this._regexHref;
        }
        pageTitle(value, subTitle) {
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
        pageSubTitle(value) { return this._pageSubTitle; }
        setScope(scope) {
            if (typeof scope === 'object' && scope !== null) {
                (this._scope = scope).pageTitle = this._pageTitle;
                scope.showSubtitle = (scope.subTitle = this._pageSubTitle).trim().length > 0;
                this._scope.regexHref = this._regexHref;
            }
        }
    }
    app.PageLocationService = PageLocationService;
    class StaticPageController {
        constructor(pageLocationService, $location) {
            this[Symbol.toStringTag] = app.ControllerNames.staticPage;
            const path = $location.path();
            if (path == app.ModulePaths.git)
                pageLocationService.pageTitle('GIT Cheat Sheet');
            else if (path == app.ModulePaths.vscode)
                pageLocationService.pageTitle('VS Code Cheat Sheet');
            else if (path == app.ModulePaths.npm)
                pageLocationService.pageTitle('NPM Cheat Sheet');
            else
                pageLocationService.pageTitle('');
        }
        $doCheck() { }
    }
    app.StaticPageController = StaticPageController;
    class MainContentController {
        constructor($scope, pageLocationService) {
            this.$scope = $scope;
            this[Symbol.toStringTag] = app.ControllerNames.mainContent;
            const ctrl = this;
            $scope.regexHref = app.NavPrefix + app.ModulePaths.regexMatch;
            pageLocationService.setScope($scope);
        }
        $doCheck() { }
    }
    app.MainContentController = MainContentController;
    app.mainModule = angular.module(app.ModuleNames.app, ['ngRoute'])
        .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
            $locationProvider.hashPrefix(app.HashPrefix);
            PageLocationService.ConfigureRoutes($routeProvider);
        }])
        .service(app.ServiceNames.pageLocation, PageLocationService)
        .controller(app.ControllerNames.mainContent, ['$scope', app.ServiceNames.pageLocation, MainContentController]);
})(app || (app = {}));
//# sourceMappingURL=app.js.map