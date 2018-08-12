module navMenuState {
    export type controllerType = "homeController"|"cookbookController";
    type MenuConfigNodeType = "page"|"link"|"separator"|"route";
    interface IMenuConfigNode {
        type: MenuConfigNodeType;
    }
    interface INamedMenuConfigNode extends IMenuConfigNode {
        type: "page"|"link";
        id?: string;
        name: string;
        toolTip?: string;
    }
    function isNamedMenuConfigNode(node: IMenuConfigNode|MenuConfigNode): node is INamedMenuConfigNode { return node.type === "page" || node.type === "link"; }
    interface IRoutedConfigNode extends IMenuConfigNode {
        type: "page"|"route";
        path: string;
        templateUrl: string;
        controller: controllerType;
    }
    function isRoutedConfigNode(node: IMenuConfigNode|MenuConfigNode): node is IRoutedConfigNode { return node.type === "page" || node.type === "route"; }
    interface IRouteOnlyConfigNode extends IRoutedConfigNode {
        type: "route";
        navItems?: IRouteOnlyConfigNode[];
    }
    function isRouteOnlyConfigNode(node: IMenuConfigNode|MenuConfigNode): node is IRouteOnlyConfigNode { return node.type === "route"; }
    interface IPageMenuConfigNode extends INamedMenuConfigNode, IRoutedConfigNode {
        type: "page";
        pageHeading?: string;
        subHeading?: string;
        topNavBar?: MenuConfigNode[];
        sideNavItems?: MenuConfigNode[];
        hiddenNavIds?: string[];
    }
    function isPageMenuConfigNode(node: IMenuConfigNode|MenuConfigNode): node is IPageMenuConfigNode { return node.type === "page"; }
    interface ILinkMenuConfigNode extends INamedMenuConfigNode {
        type: "link";
        url: string;
    }
    function isLinkMenuConfigNode(node: IMenuConfigNode|MenuConfigNode): node is ILinkMenuConfigNode { return node.type === "link"; }
    interface ISeparatorMenuConfigNode extends IMenuConfigNode {
        type: "separator";
    }
    function isSeparatorMenuConfigNode(node: IMenuConfigNode|MenuConfigNode): node is ISeparatorMenuConfigNode { return node.type === "separator"; }
    type MenuConfigNode = IPageMenuConfigNode|IRouteOnlyConfigNode|ILinkMenuConfigNode|ISeparatorMenuConfigNode;
    interface IMenuConfigSettings {
        topNavBar?: MenuConfigNode[],
        sideNavItems?: MenuConfigNode[]
    }
    let settings: IMenuConfigSettings = {
        topNavBar: [
            <IPageMenuConfigNode>{ type: "page", path: "/", templateUrl: "pages/home.html", controller: "homeController" },
            <IPageMenuConfigNode>{ type: "page", path: "/codecookbook", templateUrl: "pages/codecookbook/index.html", controller: "cookbookController", sideNavItems: [
                <IPageMenuConfigNode>{ type: "page", path: "/codecookbook/angularjs", templateUrl: "pages/codecookbook/angularweb.html", controller: "cookbookController" },
                <IPageMenuConfigNode>{ type: "page", path: "/codecookbook/git", templateUrl: "pages/codecookbook/git.html", controller: "cookbookController" },
                <IPageMenuConfigNode>{ type: "page", path: "/codecookbook/npm", templateUrl: "pages/codecookbook/npm.html", controller: "cookbookController" },
                <IPageMenuConfigNode>{ type: "page", path: "/codecookbook/vscode", templateUrl: "pages/codecookbook/vscode.html", controller: "cookbookController" }
            ] }
        ]
    }
    export abstract class NavigationNode {
        private _parent: PageNavigationNode|RouteOnlyNavigationNode|navigationSettings;
        private _preceding: NavigationItem|undefined;
        private _following: NavigationItem|undefined;
        get parent(): PageNavigationNode|RouteOnlyNavigationNode|navigationSettings { return this._parent; }
        get preceding(): NavigationItem|undefined { return this._preceding; }
        get following(): NavigationItem|undefined { return this._following; }
        constructor(source: MenuConfigNode|IMenuConfigNode, parent: PageNavigationNode|RouteOnlyNavigationNode|navigationSettings, preceding?: NavigationItem) {
            this._preceding = preceding;
            this._parent = (typeof(preceding) == "undefined") ? parent : preceding.parent;
            if (typeof(preceding) != "undefined") {
                this._following = (<NavigationNode>preceding)._following;
                (<NavigationNode>preceding)._following = this;
                if (typeof(this._following) != "undefined")
                    (<NavigationNode>(this._following))._preceding = this;
            }
        }
    }
    export abstract class NamedNavigationNode extends NavigationNode {
        private _name : string;
        private _id : string;
        private _toolTip: string;
        get id(): string { return this._id; }
        get name(): string { return this._name; }
        get toolTip(): string { return this._toolTip; }
        constructor(source: INamedMenuConfigNode, parent: PageNavigationNode|navigationSettings, preceding?: NavigationItem) {
            super(source, parent, preceding);
            this._name = source.name;
            this._id = (typeof(source.id) == "string") ? source.id.trim() : "";;
            this._toolTip = (typeof(source.toolTip) == "string") ? source.toolTip.trim() : "";
        }
    }
    export class PageNavigationNode extends NamedNavigationNode {
        private _pageHeading : string;
        private _subHeading : string;
        private _controller : controllerType;
        private _path : string;
        private _templateUrl: string;
        private _topNavBar : NavigationItem[] = [];
        private _sideNav : NavigationItem[] = [];
        private _hiddenNavIds: string[] = [];
        get pageHeading(): string { return this._pageHeading; }
        get subHeading(): string { return this._subHeading; }
        get controller(): controllerType { return this._controller; }
        get path(): string { return this._path; }
        get templateUrl(): string { return this.templateUrl; }
        get topNavBar(): NavigationItem[] { return this._topNavBar; }
        get sideNav(): NavigationItem[] { return this._sideNav; }
        get hiddenNavIds(): string[] { return this._hiddenNavIds; }
        constructor(source: IPageMenuConfigNode, parent: PageNavigationNode|navigationSettings, preceding?: NavigationItem) {
            super(source, parent, preceding);
            this._controller = source.controller;
            this._path = source.path;
            this._templateUrl = source.templateUrl;
            this._pageHeading = (typeof(source.pageHeading) == "string") ? source.pageHeading.trim() : "";
            if (this._pageHeading.length == 0)
                this._pageHeading = this.name;
            this._subHeading = (typeof(source.subHeading) == "string") ? source.subHeading.trim() : "";
            this._hiddenNavIds = (typeof(source.hiddenNavIds) == "undefined") ? [] : source.hiddenNavIds.filter(function(s: string) { return s.trim().length == 0; });
            if (typeof(source.topNavBar) != "undefined") {
                this._topNavBar = source.topNavBar.map<NavigationItem>(function(this: { pageNode: PageNavigationNode, preceding?: NavigationItem }, value: MenuConfigNode): NavigationItem {
                    if (isSeparatorMenuConfigNode(value))
                        this.preceding = new NavigationSeparatorNode(value, this.pageNode, this.preceding);
                    else if (isLinkMenuConfigNode(value))
                        this.preceding = new LinkNavigationNode(value, this.pageNode, this.preceding);
                    else if (isPageMenuConfigNode(value))
                        this.preceding = new PageNavigationNode(value, this.pageNode, this.preceding);
                    else
                        this.preceding = new RouteOnlyNavigationNode(value, this.pageNode, this.preceding);
                    return this.preceding;
                }, <{ pageNode: PageNavigationNode, preceding?: NavigationItem }>{ pageNode: this })
            }
            if (typeof(source.sideNavItems) != "undefined") {
                this._topNavBar = source.sideNavItems.map<NavigationItem>(function(this: { pageNode: PageNavigationNode, preceding?: NavigationItem }, value: MenuConfigNode): NavigationItem {
                    if (isSeparatorMenuConfigNode(value))
                        this.preceding = new NavigationSeparatorNode(value, this.pageNode, this.preceding);
                    else if (isLinkMenuConfigNode(value))
                        this.preceding = new LinkNavigationNode(value, this.pageNode, this.preceding);
                    else if (isPageMenuConfigNode(value))
                        this.preceding = new PageNavigationNode(value, this.pageNode, this.preceding);
                    else
                        this.preceding = new RouteOnlyNavigationNode(value, this.pageNode, this.preceding);
                    return this.preceding;
                }, <{ pageNode: PageNavigationNode, preceding?: NavigationItem }>{ pageNode: this })
            }
        }
    }
    export class LinkNavigationNode extends NamedNavigationNode {
        private _url : string;
        get url(): string { return this._url; }
        constructor(source: ILinkMenuConfigNode, parent: PageNavigationNode|navigationSettings, preceding?: NavigationItem) {
            super(source, parent, preceding);
            this._url = source.url;
        }
    }
    export class RouteOnlyNavigationNode extends NavigationNode {
        private _controller : controllerType;
        private _path : string;
        private _templateUrl: string;
        get controller(): string { return this._controller; }
        get path(): string { return this._path; }
        get templateUrl(): string { return this.templateUrl; }
        private _navItems: RouteOnlyNavigationNode[] = [];
        get navItems(): RouteOnlyNavigationNode[] { return this._navItems; }
        constructor(source: IRouteOnlyConfigNode, parent: PageNavigationNode|RouteOnlyNavigationNode|navigationSettings, preceding?: NavigationItem) {
            super(source, parent, preceding);
            this._path = source.path;
            this._templateUrl = source.templateUrl;
            this._controller = source.controller;
            if (typeof(source.navItems) != "undefined") {
                this._navItems = source.navItems.map<RouteOnlyNavigationNode>(function(this: { navNode: RouteOnlyNavigationNode, preceding?: RouteOnlyNavigationNode }, value: IRouteOnlyConfigNode): RouteOnlyNavigationNode {
                    this.preceding = new RouteOnlyNavigationNode(value, this.navNode, this.preceding);
                    return this.preceding;
                }, <{ navNode: RouteOnlyNavigationNode, preceding?: RouteOnlyNavigationNode }>{ navNode: this })
            }
        }
    }
    export class NavigationSeparatorNode extends NavigationNode {
        constructor(source: ISeparatorMenuConfigNode, parent: PageNavigationNode|RouteOnlyNavigationNode|navigationSettings, preceding?: NavigationItem) {
            super(source, parent, preceding);
        }
    }
    export type NavigationItem = PageNavigationNode|LinkNavigationNode|RouteOnlyNavigationNode|NavigationSeparatorNode;
    export class navigationSettings {
        private _topNavBar : NavigationItem[] = [];
        private _sideNav : NavigationItem[] = [];
        constructor(settings: IMenuConfigSettings) {
            if (typeof(settings.topNavBar) != "undefined") {
                this._topNavBar = settings.topNavBar.map<NavigationItem>(function(this: { settings: navigationSettings, preceding?: NavigationItem }, value: MenuConfigNode): NavigationItem {
                    if (isSeparatorMenuConfigNode(value))
                        this.preceding = new NavigationSeparatorNode(value, this.settings, this.preceding);
                    else if (isLinkMenuConfigNode(value))
                        this.preceding = new LinkNavigationNode(value, this.settings, this.preceding);
                    else if (isPageMenuConfigNode(value))
                        this.preceding = new PageNavigationNode(value, this.settings, this.preceding);
                    else
                        this.preceding = new RouteOnlyNavigationNode(value, this.settings, this.preceding);
                    return this.preceding;
                }, <{ settings: navigationSettings, preceding?: NavigationItem }>{ settings: this })
            }
            if (typeof(settings.sideNavItems) != "undefined") {
                this._topNavBar = settings.sideNavItems.map<NavigationItem>(function(this: { settings: navigationSettings, preceding?: NavigationItem }, value: MenuConfigNode): NavigationItem {
                    if (isSeparatorMenuConfigNode(value))
                        this.preceding = new NavigationSeparatorNode(value, this.settings, this.preceding);
                    else if (isLinkMenuConfigNode(value))
                        this.preceding = new LinkNavigationNode(value, this.settings, this.preceding);
                    else if (isPageMenuConfigNode(value))
                        this.preceding = new PageNavigationNode(value, this.settings, this.preceding);
                    else
                        this.preceding = new RouteOnlyNavigationNode(value, this.settings, this.preceding);
                    return this.preceding;
                }, <{ settings: navigationSettings, preceding?: NavigationItem }>{ settings: this })
            }
        }
    }
    export class navigationSettingsProvider implements angular.IServiceProvider {
        private _settings: navigationSettings|undefined;
        constructor(...args: any[]) {
        }
        $get(): navigationSettings {
            if (typeof(this._settings) != "undefined")
                return this._settings;
            this._settings = new navigationSettings(settings);
            return this._settings;
        }
        configureRouteProvider($routeProvider: angular.route.IRouteProvider, $locationProvider: angular.ILocationProvider): void {
            if (typeof(this._settings) == "undefined")
                this.$get();
        }
        getNavigationSettings($location: angular.ILocationService): navigationSettings {
            throw new Error("Not implemented");
        }
    }
}

interface IMainModuleScope extends angular.IScope {

}
angular.module("main", ['ngRoute'])
.provider('navigationSettingsProvider', navMenuState.navigationSettingsProvider)
.controller("mainController", ['$scope', '$http', '$route', function(this: angular.IController, $scope: IMainModuleScope, $http: angular.IHttpService, $route: angular.route.IRouteService) {
    
}])
.controller("homeController", ['$scope', '$http', '$route', function(this: angular.IController, $scope: IMainModuleScope, $http: angular.IHttpService, $route: angular.route.IRouteService) {
    
}])
.controller("cookbookController", ['$scope', '$http', '$route', function(this: angular.IController, $scope: IMainModuleScope, $http: angular.IHttpService, $route: angular.route.IRouteService) {
    
}])
.config(['$routeProvider', '$locationProvider', function($routeProvider: angular.route.IRouteProvider, $locationProvider: angular.ILocationProvider): void {
    
}]);