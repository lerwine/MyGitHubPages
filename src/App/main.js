/// <reference path="../Scripts/typings/jquery/jquery.d.ts"/>
/// <reference path="../Scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="../Scripts/typings/angularjs/angular-route.d.ts"/>
/// <reference path="../Scripts/typings/bootstrap/index.d.ts"/>
/// <reference path="sys.ts"/>
var rootBroadcaster;
(function (rootBroadcaster) {
    rootBroadcaster.SERVICE_NAME = "rootBroadcaster";
    const EVENTNAME_ROUTECHANGESUCCESS = "$routeChangeSuccess";
    function register(module) { return module.service(rootBroadcaster.SERVICE_NAME, ['$rootScope', Service]); }
    rootBroadcaster.register = register;
    class Service {
        constructor($rootScope) {
            this.$rootScope = $rootScope;
            this._eventRegistration = [];
            this[Symbol.toStringTag] = rootBroadcaster.SERVICE_NAME;
        }
        registerPrivateEventName(name, id) {
            if (typeof name !== "string")
                throw new Error("Name must be a string");
            if (name.length == 0)
                throw new Error("Name cannot be empty");
            if (name.startsWith("$"))
                throw new Error("Name cannot start with a \"$\" symbol");
            for (let i = 0; i < this._eventRegistration.length; i++) {
                if (this._eventRegistration[i].name === name) {
                    if (typeof id === "symbol" && id === this._eventRegistration[i].id)
                        return id;
                    throw new Error("That event name is already registered");
                }
            }
            let eventRegistration = { id: Symbol(), name: name };
            this._eventRegistration.push(eventRegistration);
            return eventRegistration.id;
        }
        registerSharedEventName(name) {
            if (typeof name !== "string")
                throw new Error("Name must be a string");
            if (name.length == 0)
                throw new Error("Name cannot be empty");
            if (name.startsWith("$"))
                throw new Error("Name cannot start with a \"$\" symbol");
            for (let i = 0; i < this._eventRegistration.length; i++) {
                if (this._eventRegistration[i].name === name) {
                    if (typeof this._eventRegistration[i].id === "symbol")
                        throw new Error("That event name is not available");
                    return false;
                }
            }
            let eventRegistration = { name: name };
            this._eventRegistration.push(eventRegistration);
            return true;
        }
        broadcastEvent(id, ...args) {
            let name;
            if (typeof id === "symbol")
                for (let i = 0; i < this._eventRegistration.length; i++) {
                    if (this._eventRegistration[i].id === id) {
                        name = this._eventRegistration[i].name;
                        break;
                    }
                }
            else if (typeof id === "string")
                for (let i = 0; i < this._eventRegistration.length; i++) {
                    if (this._eventRegistration[i].name === name) {
                        if (typeof this._eventRegistration[i].id !== "symbol")
                            name = this._eventRegistration[i].name;
                        break;
                    }
                }
            if (typeof name !== "string")
                throw new Error((typeof id === "symbol") ? "Event ID not registered" : "Event name not registered or is private");
            if (typeof args === "object" && args !== null)
                this.$rootScope.$broadcast(name, args);
            else
                this.$rootScope.$broadcast(name, []);
        }
        onEvent($scope, id, listener, thisArg) {
            let name;
            if (typeof id === "symbol")
                for (let i = 0; i < this._eventRegistration.length; i++) {
                    if (this._eventRegistration[i].id === id) {
                        name = this._eventRegistration[i].name;
                        break;
                    }
                }
            else if (typeof id === "string")
                for (let i = 0; i < this._eventRegistration.length; i++) {
                    if (this._eventRegistration[i].name === name) {
                        if (typeof this._eventRegistration[i].id !== "symbol")
                            name = this._eventRegistration[i].name;
                        break;
                    }
                }
            if (typeof name !== "string")
                throw new Error((typeof id === "symbol") ? "Event ID not registered" : "Event name not registered or is private");
            if (arguments.length > 3)
                $scope.$on(name, function (event, args) {
                    if (args.length == 1)
                        listener.call(thisArg, event, args[0]);
                    else if (args.length > 1)
                        listener.apply(thisArg, (args.length == 0) ? [event] : [event].concat(args));
                    else
                        listener.call(thisArg, event);
                });
            else
                $scope.$on(name, function (event, args) {
                    if (args.length == 1)
                        listener(event, args[0]);
                    else if (args.length > 1)
                        listener.apply(this, [event].concat(args));
                    else
                        listener(event);
                });
        }
        onRouteChangeSuccess(callback, thisArg) {
            if (arguments.length > 1)
                this.$rootScope.$on(EVENTNAME_ROUTECHANGESUCCESS, (event, current, previous) => {
                    callback.call(thisArg, event, current, previous);
                });
            else
                this.$rootScope.$on(EVENTNAME_ROUTECHANGESUCCESS, (event, current, previous) => {
                    callback(event, current, previous);
                });
        }
    }
    rootBroadcaster.Service = Service;
})(rootBroadcaster || (rootBroadcaster = {}));
var myGitHubPages;
(function (myGitHubPages) {
    myGitHubPages.MODULE_NAME = "myGitHubPages";
    const CONTROLLER_NAME = "mainController";
    const SERVICE_NAME = "mainNavigation";
    const PROVIDER_NAME = SERVICE_NAME + "Provider";
    let SideNavOption;
    (function (SideNavOption) {
        SideNavOption[SideNavOption["childItemsOnly"] = 0] = "childItemsOnly";
        SideNavOption[SideNavOption["currentAndChildItems"] = 1] = "currentAndChildItems";
        SideNavOption[SideNavOption["parentAndSiblings"] = 2] = "parentAndSiblings";
    })(SideNavOption = myGitHubPages.SideNavOption || (myGitHubPages.SideNavOption = {}));
    class NavigationItem {
        constructor(source) {
            this._isCurrentPage = false;
            this._hasCurrentPage = false;
            this.__id = Symbol();
            this._path = source[0];
            this._navTitle = source[2].navTitle;
            this._pageTitle = ((typeof source[2].pageTitle === "string") ? source[2].pageTitle : this._navTitle).trim();
            this._pageSubTitle = (typeof source[2].pageSubTitle === "string") ? source[2].pageSubTitle.trim() : "";
            this._route = source[1];
            this._childItems = (typeof source[2].childItems !== "object" || source[2].childItems === null || source[2].childItems.length == 0) ? [] : source[2].childItems.map((value) => new NavigationItem(value));
            this._id = (typeof source[2].id === "symbol") ? source[2].id : this.__id;
            this._route.__metaData = this;
            this._sideNavOption = (typeof source[2].sideNavOption === "number") ? source[2].sideNavOption : SideNavOption.childItemsOnly;
            if (this._childItems.length > 0)
                this._childItems.forEach((c) => { c._parent = this; });
        }
        get path() { return this._path; }
        get href() { return (this._isCurrentPage) ? "#" : "#!" + this._path; }
        get route() { return this._route; }
        get parent() { return this._parent; }
        get id() { return this._id; }
        get navTitle() { return this._navTitle; }
        get pageTitle() { return this._pageTitle; }
        get pageSubTitle() { return this._pageSubTitle; }
        get childItems() { return this._childItems; }
        get isCurrentPage() { return this._isCurrentPage; }
        get hasCurrentPage() { return this._hasCurrentPage; }
        get isActive() { return this._isCurrentPage || this._hasCurrentPage; }
        get sideNavOption() { return this._sideNavOption; }
        get cssClass() { return (this._isCurrentPage) ? this._mainNavigation.currentItemClass() : (this._hasCurrentPage) ? this._mainNavigation.currentParentClass() : this._mainNavigation.otherItemClass(); }
        static getMetaData(route) {
            return route.__metaData;
        }
        onClick(event) {
            if (this._isCurrentPage && typeof event === "object" && event !== null && !(typeof event.preventDefault === "function" && event.isDefaultPrevented()) && typeof event.preventDefault === "function")
                event.preventDefault();
        }
        getBreacrumbLinks() {
            let result = [];
            let currentItem = this._parent;
            if (typeof currentItem !== "undefined") {
                for (let parent = currentItem.parent; typeof parent !== "undefined"; parent = (currentItem = parent).parent)
                    result.push(currentItem);
            }
            return result;
        }
        getSideNavLeadItems() {
            if (this._childItems.length == 0) {
                if (this._sideNavOption === SideNavOption.currentAndChildItems)
                    return [this];
                if (this._sideNavOption !== SideNavOption.parentAndSiblings || typeof this._parent === "undefined")
                    return [];
                return [this._parent].concat(this._parent._childItems);
            }
            if (this._sideNavOption === SideNavOption.currentAndChildItems)
                return [this].concat(this._childItems);
            if (this._sideNavOption !== SideNavOption.parentAndSiblings || typeof this._parent === "undefined")
                return this._childItems;
            let result = [this._parent];
            for (let i = 0; i < this._parent._childItems.length; i++) {
                result.push(this._parent._childItems[i]);
                if (this._parent._childItems[i].__id === this.__id)
                    break;
            }
            return result;
        }
        getSideNavChildItems() {
            if (this._sideNavOption !== SideNavOption.parentAndSiblings || typeof this._parent === "undefined")
                return [];
            //if (this._sideNavOption === SideNavOption.currentAndChildItems || (this._sideNavOption === SideNavOption.parentAndSiblings && typeof this._parent !== "undefined"))
            //    return this._childItems;
            return [];
        }
        getSideNavTrailingItems() {
            if (this._sideNavOption === SideNavOption.currentAndChildItems)
                return [this];
            if (this._sideNavOption !== SideNavOption.parentAndSiblings || typeof this._parent === "undefined")
                return this._childItems;
            let result = [this._parent];
            for (let i = 0; i < this._parent._childItems.length; i++) {
                result.push(this._parent._childItems[i]);
                if (this._parent._childItems[i].__id === this.__id)
                    break;
            }
            return result;
        }
        static getCurrentPage(items) {
            for (let i = 0; i < items.length; i++) {
                if (items[i]._isCurrentPage)
                    return items[i];
                if (items[i]._hasCurrentPage)
                    return NavigationItem.getCurrentPage(items[i]._childItems);
            }
        }
        static setCurrentPage(items, newPage) {
            let oldPage = this.getCurrentPage(items);
            if (typeof newPage !== "object" || newPage === null) {
                if (typeof oldPage === "undefined")
                    return [];
            }
            else if (typeof oldPage !== "undefined" && oldPage.__id == newPage.__id)
                return [];
            if (typeof oldPage !== "undefined") {
                oldPage._isCurrentPage = false;
                for (let i = oldPage._parent; typeof i === "object"; i = i._parent)
                    i._hasCurrentPage = false;
            }
            if (typeof newPage !== "object" || newPage === null)
                return [undefined, oldPage];
            newPage._isCurrentPage = true;
            for (let i = newPage._parent; typeof i === "object"; i = i._parent)
                i._hasCurrentPage = true;
            return [newPage, oldPage];
        }
        _initialize(mainNavigation) {
            this._mainNavigation = mainNavigation;
            if (this._childItems.length > 0)
                this._childItems.forEach((item) => { item._initialize(mainNavigation); });
        }
        static initialize(navItems, mainNavigation) {
            if (typeof navItems[0]._mainNavigation !== "undefined")
                throw new Error("Navigation items already initialized");
            navItems.forEach((item) => {
                item._mainNavigation = mainNavigation;
                if (item._childItems.length > 0)
                    NavigationItem.initialize(item._childItems, mainNavigation);
            });
        }
    }
    class mainNavigationServiceProvider {
        constructor() {
            this[Symbol.toStringTag] = PROVIDER_NAME;
            this._navItems = [];
            this._currentItemClass = [];
            this._currentParentClass = [];
            this._otherItemClass = [];
            let p = this;
            this.$get = ['$document', rootBroadcaster.SERVICE_NAME, function mainNavigationFactory($document, rootBroadcaster) {
                    if (p._currentItemClass.length == 0)
                        p._currentItemClass = ["nav-link", "active"];
                    if (p._currentParentClass.length == 0)
                        p._currentParentClass = ["nav-link", "active"];
                    if (p._otherItemClass.length == 0)
                        p._otherItemClass = ["nav-link"];
                    return new mainNavigationService($document, rootBroadcaster, p._navItems.filter((value) => !Array.isArray(value)), p._currentItemClass, p._currentParentClass, p._otherItemClass);
                }];
        }
        currentItemClass(...css) {
            this._currentItemClass = [];
            if (typeof css !== "object" && css === null || css.length == 0)
                return this;
            let r = /[\s\r\n]+/;
            css.forEach((value) => {
                if (typeof value == "string" && (value = value.trim()).length > 0)
                    value.split(r).forEach((v) => { this._currentItemClass.push(v); });
            });
        }
        currentParentClass(...css) {
            this._currentParentClass = [];
            if (typeof css !== "object" && css === null || css.length == 0)
                return this;
            let r = /[\s\r\n]+/;
            css.forEach((value) => {
                if (typeof value == "string" && (value = value.trim()).length > 0)
                    value.split(r).forEach((v) => { this._currentParentClass.push(v); });
            });
        }
        otherItemClass(...css) {
            this._otherItemClass = [];
            if (typeof css !== "object" && css === null || css.length == 0)
                return this;
            let r = /[\s\r\n]+/;
            css.forEach((value) => {
                if (typeof value == "string" && (value = value.trim()).length > 0)
                    value.split(r).forEach((v) => { this._otherItemClass.push(v); });
            });
        }
        when(path, route, metaData) {
            if (arguments.length > 2)
                this._navItems.push(new NavigationItem([path, route, metaData]));
            else
                this._navItems.push([path, route]);
            return this;
        }
        config($routeProvider) {
            this._navItems.map((item) => {
                if (Array.isArray(item))
                    return [item[0].split('/').filter((s, i) => i > 0 || s.length > 0), item[0], item[1]];
                return [item.path.split('/').filter((s, i) => i > 0 || s.length > 0), item.path, item.route];
            }).sort((a, b) => {
                if (a[0].length > 0 && b[0].length > 0) {
                    let c = (a[0].length < b[0].length) ? a[0].length : b[0].length;
                    for (let i = 0; i < c; i++) {
                        if (a[i] !== b[i])
                            return (a[i] < b[i]) ? 1 : -1;
                    }
                }
                return b[0].length - a[0].length;
            }).forEach((item) => {
                $routeProvider.when(item[1], item[2]);
            });
        }
    }
    class mainNavigationService {
        constructor($document, rootBroadcaster, navItems, _currentItemClass, _currentParentClass, _otherItemClass) {
            this.$document = $document;
            this.rootBroadcaster = rootBroadcaster;
            this.navItems = navItems;
            this._currentItemClass = _currentItemClass;
            this._currentParentClass = _currentParentClass;
            this._otherItemClass = _otherItemClass;
            this[Symbol.toStringTag] = SERVICE_NAME;
            let element = $document.find('head').find('title');
            if (element.length == 0)
                element = $document.find('head').add('<title></title>');
            let pageTitle = element.text();
            if (typeof pageTitle !== "string" || (pageTitle = pageTitle.trim()).length == 0) {
                pageTitle = 'Lenny\'s GitHub Pages';
                element.text(pageTitle);
            }
            this._pageTitle = this._defaultPageTitle = pageTitle;
            NavigationItem.initialize(navItems, this);
            this._titleChangedEvent = this.rootBroadcaster.registerPrivateEventName(SERVICE_NAME + ":TitleChanged");
            this._pageChangedEvent = this.rootBroadcaster.registerPrivateEventName(SERVICE_NAME + ":PageChanged");
            this._subTitleChangedEvent = this.rootBroadcaster.registerPrivateEventName(SERVICE_NAME + ":SubTitleChanged");
            this.rootBroadcaster.onRouteChangeSuccess(this.onRouteChangeSuccess, this);
        }
        defaultPageTitle() { return this._defaultPageTitle; }
        pageTitle(value) {
            if (typeof value === "string") {
                if ((value = value.trim()).length == 0)
                    value = this._defaultPageTitle;
                let oldValue = this._pageTitle;
                if (value !== oldValue) {
                    this._pageTitle = value;
                    if (this._pageTitle === this._defaultPageTitle)
                        this.$document.find('head').find('title').text(this._defaultPageTitle);
                    else
                        this.$document.find('head').find('title').text(this._defaultPageTitle + ": " + this._pageTitle);
                    this.rootBroadcaster.broadcastEvent(this._titleChangedEvent, value, oldValue);
                }
            }
            return this._pageTitle;
        }
        pageSubTitle(value) {
            if (typeof value === "string") {
                let oldValue = this._pageSubTitle;
                if ((value = value.trim()) !== oldValue) {
                    this._pageSubTitle = value;
                    this.rootBroadcaster.broadcastEvent(this._subTitleChangedEvent, value, oldValue);
                }
            }
            return this._pageSubTitle;
        }
        getCurrentPage() { return NavigationItem.getCurrentPage(this.navItems); }
        currentItemClass() { return this._currentItemClass; }
        currentParentClass() { return this._currentParentClass; }
        otherItemClass() { return this._otherItemClass; }
        getTopNav() { return this.navItems; }
        getChildNav() {
            let current = this.getCurrentPage();
            return (typeof current === "undefined") ? [] : current.childItems;
        }
        getNestedAncestors() {
            let current = this.getCurrentPage();
            return (typeof current === "undefined") ? [] : current.getBreacrumbLinks();
        }
        onPageTitleChanged($scope, listener, thisArg) {
            if (arguments.length > 2)
                this.rootBroadcaster.onEvent($scope, this._titleChangedEvent, (event, newValue, oldValue) => { listener.call(thisArg, newValue, oldValue); });
            else
                this.rootBroadcaster.onEvent($scope, this._titleChangedEvent, (event, newValue, oldValue) => { listener(newValue, oldValue); });
        }
        onPageSubTitleChanged($scope, listener, thisArg) {
            if (arguments.length > 2)
                this.rootBroadcaster.onEvent($scope, this._subTitleChangedEvent, (event, newValue, oldValue) => { listener.call(thisArg, newValue, oldValue); });
            else
                this.rootBroadcaster.onEvent($scope, this._subTitleChangedEvent, (event, newValue, oldValue) => { listener(newValue, oldValue); });
        }
        onPageChanged($scope, listener, thisArg) {
            if (arguments.length > 2)
                this.rootBroadcaster.onEvent($scope, this._pageChangedEvent, (event, newPage, oldPage) => {
                    listener.call(thisArg, newPage, oldPage);
                });
            else
                this.rootBroadcaster.onEvent($scope, this._pageChangedEvent, (event, newPage, oldPage) => {
                    listener(newPage, oldPage);
                });
        }
        onPageActivated($scope, id, listener, thisArg) {
            if (arguments.length > 3)
                this.rootBroadcaster.onEvent($scope, this._pageChangedEvent, (event, newPage) => {
                    if (typeof newPage === "object" && newPage.id === id)
                        listener.call(thisArg, newPage);
                });
            else
                this.rootBroadcaster.onEvent($scope, this._pageChangedEvent, (event, newPage) => {
                    if (typeof newPage === "object" && newPage.id === id)
                        listener(newPage);
                });
        }
        onPageDeactivated($scope, id, listener, thisArg) {
            if (arguments.length > 3)
                this.rootBroadcaster.onEvent($scope, this._pageChangedEvent, (event, newPage, oldPage) => {
                    if (typeof oldPage === "object" && oldPage.id === id)
                        listener.call(thisArg, oldPage);
                });
            else
                this.rootBroadcaster.onEvent($scope, this._pageChangedEvent, (event, newPage, oldPage) => {
                    if (typeof oldPage === "object" && oldPage.id === id)
                        listener(oldPage);
                });
        }
        onRouteChangeSuccess(event, current) {
            if (typeof current !== "object" || current === null)
                return;
            let newPage = current.__metaData;
            let arr = NavigationItem.setCurrentPage(this.navItems, newPage);
            if (arr.length == 0)
                return;
            try {
                this.pageTitle((typeof arr[0] === "undefined" || arr[0].pageTitle.length == 0) ? this._defaultPageTitle : arr[0].pageTitle);
            }
            finally {
                try {
                    this.pageTitle((typeof arr[0] === "undefined" || arr[0].pageTitle.length == 0) ? this._defaultPageTitle : arr[0].pageTitle);
                }
                finally {
                    this.rootBroadcaster.broadcastEvent(this._pageChangedEvent, arr[0], arr[1]);
                }
            }
        }
    }
    class mainController {
        constructor($scope, mainNavigation) {
            this.$scope = $scope;
            this.mainNavigation = mainNavigation;
            this[Symbol.toStringTag] = CONTROLLER_NAME;
            $scope.pageTitle = mainNavigation.pageTitle();
            this.onSubTitleChanged(mainNavigation.pageSubTitle());
            $scope.topNavItems = mainNavigation.getTopNav();
            mainNavigation.onPageTitleChanged($scope, this.onTitleChanged, this);
        }
        onTitleChanged(newValue) { this.$scope.pageTitle = newValue; }
        onSubTitleChanged(newValue) {
            this.$scope.subTitle = newValue;
            this.$scope.showSubtitle = this.$scope.subTitle.length > 0;
        }
        $doCheck() { }
    }
    /**
    * The main module for this app.
    * @type {ng.IModule}
    */
    myGitHubPages.module = rootBroadcaster.register(angular.module(myGitHubPages.MODULE_NAME, ['ngRoute']))
        .provider(SERVICE_NAME, mainNavigationServiceProvider)
        .controller(CONTROLLER_NAME, ['$scope', SERVICE_NAME, mainController])
        .config(['$routeProvider', PROVIDER_NAME, function ($routeProvider, mainNavigationProvider) {
            //mainNavigationProvider.when('/home', { templateUrl: 'Template/Home.htm' }, { navTitle: 'Home', pageTitle: '' })
            //    .when('/regex', { templateUrl: 'Template/RegexBuilder/Match.htm' }, {
            //        navTitle: 'Regex', pageTitle: 'Regex Evaluator (match)', includeCurrentInSideNav: true, childItems: [
            //            ['/regex/replace', { templateUrl: 'Template/RegexBuilder/Replace.htm' }, { navTitle: 'Replace', pageTitle: 'Regex Evaluator (replace)', includeParentInSideNav: true }],
            //            ['/regex/search', { templateUrl: 'Template/RegexBuilder/Search.htm' }, { navTitle: 'Search', pageTitle: 'Regex Evaluator (search)', includeParentInSideNav: true }],
            //            ['/regex/split', { templateUrl: 'Template/RegexBuilder/Split.htm' }, { navTitle: 'Split', pageTitle: 'Regex Evaluator (split)', includeParentInSideNav: true }]
            //        ]
            //    })
            //    .when('/', { redirectTo: '/home' })
            //    .config($routeProvider);
            // configure html5 to get links working on jsfiddle
            //$locationProvider.html5Mode(true);
        }]);
})(myGitHubPages || (myGitHubPages = {}));
//# sourceMappingURL=main.js.map