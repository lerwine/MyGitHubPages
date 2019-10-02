/// <reference path="../Scripts/typings/jquery/jquery.d.ts"/>
/// <reference path="../Scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="../Scripts/typings/angularjs/angular-route.d.ts"/>
/// <reference path="../Scripts/typings/bootstrap/index.d.ts"/>
/// <reference path="sys.ts"/>

namespace rootBroadcaster {
    export const SERVICE_NAME: string = "rootBroadcaster";
    const EVENTNAME_ROUTECHANGESUCCESS = "$routeChangeSuccess";

    interface IEventRegistration {
        id?: symbol;
        name: string;
    }

    export type RouteChangeSuccessListener<TRoute extends ng.route.ICurrentRoute> = { (event: ng.IAngularEvent, current?: TRoute, previous?: TRoute): void; } & Function;
    export type ThisRouteChangeSuccessListener<TRoute extends ng.route.ICurrentRoute, TThis> = { (this: TThis, event: ng.IAngularEvent, current?: TRoute, previous?: TRoute): void; } & Function;
    export type EventListener = { (event: ng.IAngularEvent, ...args: any[]): void; } & Function;
    export type ThisEventListener<T> = { (this: T, event: ng.IAngularEvent, ...args: any[]): void; } & Function;

    export function register(module: ng.IModule): ng.IModule { return module.service(SERVICE_NAME, ['$rootScope', Service]); }

    export class Service {
        private _eventRegistration: IEventRegistration[] = [];

        readonly [Symbol.toStringTag]: string = SERVICE_NAME;

        constructor(private $rootScope: ng.IRootScopeService) { }
        
        registerPrivateEventName(name: string, id?: symbol): symbol {
            if (typeof name !== "string")
                throw new Error("Name must be a string");
            if (name.length == 0)
                throw new Error("Name cannot be empty");
            if (name.startsWith("$"))
                throw new Error("Name cannot start with a \"$\" symbol");
            for (let i: number = 0; i < this._eventRegistration.length; i++) {
                if (this._eventRegistration[i].name === name) {
                    if (typeof id === "symbol" && id === this._eventRegistration[i].id)
                        return id;
                    throw new Error("That event name is already registered");
                }
            }
            let eventRegistration: IEventRegistration = { id: Symbol(), name: name };
            this._eventRegistration.push(eventRegistration);
            return eventRegistration.id;
        }

        registerSharedEventName(name: string): boolean {
            if (typeof name !== "string")
                throw new Error("Name must be a string");
            if (name.length == 0)
                throw new Error("Name cannot be empty");
            if (name.startsWith("$"))
                throw new Error("Name cannot start with a \"$\" symbol");
            for (let i: number = 0; i < this._eventRegistration.length; i++) {
                if (this._eventRegistration[i].name === name) {
                    if (typeof this._eventRegistration[i].id === "symbol")
                        throw new Error("That event name is not available");
                    return false;
                }
            }
            let eventRegistration: IEventRegistration = { name: name };
            this._eventRegistration.push(eventRegistration);
            return true;
        }

        broadcastEvent(id: string | symbol, ...args: any[]): void {
            let name: string | undefined;
            if (typeof id === "symbol")
                for (let i: number = 0; i < this._eventRegistration.length; i++) {
                    if (this._eventRegistration[i].id === id) {
                        name = this._eventRegistration[i].name;
                        break;
                    }
                }
            else if (typeof id === "string")
                for (let i: number = 0; i < this._eventRegistration.length; i++) {
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

        onEvent<T>($scope: ng.IScope, id: string | symbol, listener: ThisEventListener<T>, thisArg: T): void;
        onEvent($scope: ng.IScope, id: string | symbol, listener: EventListener): void;
        onEvent($scope: ng.IScope, id: string | symbol, listener: EventListener | ThisEventListener<any>, thisArg?: any): void {
            let name: string | undefined;
            if (typeof id === "symbol")
                for (let i: number = 0; i < this._eventRegistration.length; i++) {
                    if (this._eventRegistration[i].id === id) {
                        name = this._eventRegistration[i].name;
                        break;
                    }
                }
            else if (typeof id === "string")
                for (let i: number = 0; i < this._eventRegistration.length; i++) {
                    if (this._eventRegistration[i].name === name) {
                        if (typeof this._eventRegistration[i].id !== "symbol")
                            name = this._eventRegistration[i].name;
                        break;
                    }
                }
            if (typeof name !== "string")
                throw new Error((typeof id === "symbol") ? "Event ID not registered" : "Event name not registered or is private");
            if (arguments.length > 3)
                $scope.$on(name, function (event: ng.IAngularEvent, args: any[]): void {
                    if (args.length == 1)
                        listener.call(thisArg, event, args[0]);
                    else if (args.length > 1)
                        listener.apply(thisArg, (args.length == 0) ? [event] : [event].concat(args));
                    else
                        listener.call(thisArg, event);
                });
            else
                $scope.$on(name, function (event: ng.IAngularEvent, args: any[]): void {
                    if (args.length == 1)
                        listener(event, args[0]);
                    else if (args.length > 1)
                        listener.apply(this, [event].concat(args));
                    else
                        listener(event);
                });
        }

        onRouteChangeSuccess<TRoute extends ng.route.ICurrentRoute, TThis>(callback: ThisRouteChangeSuccessListener<TRoute, any>, thisArg: TThis): void;
        onRouteChangeSuccess<T extends ng.route.ICurrentRoute>(callback: RouteChangeSuccessListener<T>): void;
        onRouteChangeSuccess<T extends ng.route.ICurrentRoute>(callback: RouteChangeSuccessListener<T> | ThisRouteChangeSuccessListener<T, any>, thisArg?: any): void {
            if (arguments.length > 1)
                this.$rootScope.$on(EVENTNAME_ROUTECHANGESUCCESS, (event: ng.IAngularEvent, current?: T, previous?: T) => {
                    callback.call(thisArg, event, current, previous);
                });
            else
                this.$rootScope.$on(EVENTNAME_ROUTECHANGESUCCESS, (event: ng.IAngularEvent, current?: T, previous?: T) => {
                    callback(event, current, previous);
                });
        }
    }
}

namespace myGitHubPages {
    export const MODULE_NAME: string = "myGitHubPages";
    const CONTROLLER_NAME: string = "mainController";
    const SERVICE_NAME: string = "mainNavigation";
    const PROVIDER_NAME: string = SERVICE_NAME + "Provider";

    export enum SideNavOption {
        childItemsOnly = 0,
        currentAndChildItems = 1,
        parentAndSiblings = 2
    }
    export interface INavigationProperties<T> {
        navTitle: string;
        pageTitle?: string;
        pageSubTitle?: string;
        id?: symbol;
        childItems?: T[];
        sideNavOption?: SideNavOption;
    }
    export interface INavigationMetaData extends INavigationProperties<INavigationDefinition> { }
    export type INavigationDefinition = [string, ng.route.IRoute, INavigationMetaData];
    interface IRouteWithMetaData extends ng.route.IRoute { __metaData: NavigationItem }
    interface ICurrentRouteWithMetaData extends ng.route.ICurrentRoute, IRouteWithMetaData { }

    class NavigationItem implements INavigationProperties<NavigationItem> {
        private readonly _id: symbol;
        private readonly _path: string;
        private readonly _navTitle: string;
        private readonly _pageTitle: string;
        private readonly _pageSubTitle: string;
        private readonly _route: IRouteWithMetaData;
        private readonly _childItems: NavigationItem[];
        private _parent?: NavigationItem;
        private _isCurrentPage: boolean = false;
        private _hasCurrentPage: boolean = false;
        private readonly _sideNavOption: SideNavOption;
        private readonly __id: symbol = Symbol();
        private _mainNavigation: mainNavigationService;

        get path(): string { return this._path; }
        get href(): string { return (this._isCurrentPage) ? "#" : "#!" + this._path; }
        get route(): IRouteWithMetaData { return this._route; }
        get parent(): NavigationItem | undefined { return this._parent; }
        get id(): symbol { return this._id; }
        get navTitle(): string { return this._navTitle; }
        get pageTitle(): string { return this._pageTitle; }
        get pageSubTitle(): string { return this._pageSubTitle; }
        get childItems(): NavigationItem[] { return this._childItems; }
        get isCurrentPage(): boolean { return this._isCurrentPage; }
        get hasCurrentPage(): boolean { return this._hasCurrentPage; }
        get isActive(): boolean { return this._isCurrentPage || this._hasCurrentPage; }
        get sideNavOption(): SideNavOption { return this._sideNavOption; }
        get cssClass(): string[] { return (this._isCurrentPage) ? this._mainNavigation.currentItemClass() : (this._hasCurrentPage) ? this._mainNavigation.currentParentClass() : this._mainNavigation.otherItemClass(); }

        constructor(source: INavigationDefinition) {
            this._path = source[0];
            this._navTitle = source[2].navTitle;
            this._pageTitle = ((typeof source[2].pageTitle === "string") ? source[2].pageTitle : this._navTitle).trim();
            this._pageSubTitle = (typeof source[2].pageSubTitle === "string") ? source[2].pageSubTitle.trim() : "";
            this._route = <IRouteWithMetaData>source[1];
            this._childItems = (typeof source[2].childItems !== "object" || source[2].childItems === null || source[2].childItems.length == 0) ? [] : source[2].childItems.map((value: INavigationDefinition) => new NavigationItem(value));
            this._id = (typeof source[2].id === "symbol") ? source[2].id : this.__id;
            this._route.__metaData = this;
            this._sideNavOption = (typeof source[2].sideNavOption === "number") ? source[2].sideNavOption : SideNavOption.childItemsOnly;
            if (this._childItems.length > 0)
                this._childItems.forEach((c: NavigationItem) => { c._parent = this; });
        }

        static getMetaData(route: ng.route.IRoute): NavigationItem | undefined {
            return (<IRouteWithMetaData>route).__metaData;
        }

        onClick(event?: BaseJQueryEventObject): void {
            if (this._isCurrentPage && typeof event === "object" && event !== null && !(typeof event.preventDefault === "function" && event.isDefaultPrevented()) && typeof event.preventDefault === "function")
                event.preventDefault();
        }

        getBreacrumbLinks(): NavigationItem[] {
            let result: NavigationItem[] = [];
            let currentItem: NavigationItem | undefined = this._parent;
            if (typeof currentItem !== "undefined") {
                for (let parent: NavigationItem | undefined = currentItem.parent; typeof parent !== "undefined"; parent = (currentItem = parent).parent)
                    result.push(currentItem);
            }
            return result;
        }

        getSideNavLeadItems(): NavigationItem[] {
            if (this._childItems.length == 0) {
                if (this._sideNavOption === SideNavOption.currentAndChildItems)
                    return [this];
                if (this._sideNavOption !== SideNavOption.parentAndSiblings || typeof this._parent === "undefined")
                    return [];
                return [this._parent].concat(this._parent._childItems);
            }
            if (this._sideNavOption === SideNavOption.currentAndChildItems)
                return (<NavigationItem[]>[this]).concat(this._childItems);
            if (this._sideNavOption !== SideNavOption.parentAndSiblings || typeof this._parent === "undefined")
                return this._childItems;
            let result: NavigationItem[] = [this._parent];
            for (let i: number = 0; i < this._parent._childItems.length; i++) {
                result.push(this._parent._childItems[i]);
                if (this._parent._childItems[i].__id === this.__id)
                    break;
            }
            return result;
        }

        getSideNavChildItems(): NavigationItem[] {
            if (this._sideNavOption !== SideNavOption.parentAndSiblings || typeof this._parent === "undefined")
                return [];

            if (this._sideNavOption === SideNavOption.currentAndChildItems || (this._sideNavOption === SideNavOption.parentAndSiblings && typeof this._parent !== "undefined"))
                return this._childItems;
            return [];
        }

        getSideNavTrailingItems(): NavigationItem[] {
            if (this._sideNavOption === SideNavOption.currentAndChildItems)
                return [this];
            if (this._sideNavOption !== SideNavOption.parentAndSiblings || typeof this._parent === "undefined")
                return this._childItems;
            let result: NavigationItem[] = [this._parent];
            for (let i: number = 0; i < this._parent._childItems.length; i++) {
                result.push(this._parent._childItems[i]);
                if (this._parent._childItems[i].__id === this.__id)
                    break;
            }
            return result;
            let result: NavigationItem[] = [];
            for (let i: number = 0; i < this._parent._childItems.length; i++) {
                if (this._parent._childItems[i].__id === this.__id) {
                    for (let n: number = i + 1; n < this._parent.childItems.length; n++)
                        result.push(this._parent._childItems[n]);
                }
                break;
            }

        }

        static getCurrentPage(items: NavigationItem[]): NavigationItem | undefined {
            for (let i: number = 0; i < items.length; i++) {
                if (items[i]._isCurrentPage)
                    return items[i];
                if (items[i]._hasCurrentPage)
                    return NavigationItem.getCurrentPage(items[i]._childItems);
            }
        }

        static setCurrentPage(items: NavigationItem[], newPage?: NavigationItem): [NavigationItem, NavigationItem] | [NavigationItem, undefined] | [undefined, NavigationItem] | [] {
            let oldPage: NavigationItem = this.getCurrentPage(items);
            if (typeof newPage !== "object" || newPage === null) {
                if (typeof oldPage === "undefined")
                    return [];
            } else if (typeof oldPage !== "undefined" && oldPage.__id == newPage.__id)
                return [];
            if (typeof oldPage !== "undefined") {
                oldPage._isCurrentPage = false;
                for (let i: NavigationItem = oldPage._parent; typeof i === "object"; i = i._parent)
                    i._hasCurrentPage = false;
            }
            if (typeof newPage !== "object" || newPage === null)
                return [undefined, oldPage];
            newPage._isCurrentPage = true;
            for (let i: NavigationItem = newPage._parent; typeof i === "object"; i = i._parent)
                i._hasCurrentPage = true;
            return [newPage, oldPage];
        }

        private _initialize(mainNavigation: mainNavigationService) {
            this._mainNavigation = mainNavigation;
            if (this._childItems.length > 0)
                this._childItems.forEach((item: NavigationItem) => { item._initialize(mainNavigation); });
        }

        static initialize(navItems: NavigationItem[], mainNavigation: mainNavigationService) {
            if (typeof navItems[0]._mainNavigation !== "undefined")
                throw new Error("Navigation items already initialized");
            navItems.forEach((item: NavigationItem) => {
                item._mainNavigation = mainNavigation;
                if (item._childItems.length > 0)
                    NavigationItem.initialize(item._childItems, mainNavigation);
            });
        }
    }

    class mainNavigationServiceProvider implements ng.IServiceProvider {
        readonly [Symbol.toStringTag]: string = PROVIDER_NAME;
        private _navItems: (NavigationItem | [string, ng.route.IRoute])[] = [];
        private _currentItemClass: string[] = [];
        private _currentParentClass: string[] = [];
        private _otherItemClass: string[] = [];

        readonly $get: any;
        constructor() {
            let p: mainNavigationServiceProvider = this;
            this.$get = ['$document', rootBroadcaster.SERVICE_NAME, function mainNavigationFactory($document: ng.IDocumentService, rootBroadcaster: rootBroadcaster.Service) {
                if (p._currentItemClass.length == 0)
                    p._currentItemClass = ["nav-link", "active"];
                if (p._currentParentClass.length == 0)
                    p._currentParentClass = ["nav-link", "active"];
                if (p._otherItemClass.length == 0)
                    p._otherItemClass = ["nav-link"];
                return new mainNavigationService($document, rootBroadcaster, <NavigationItem[]>p._navItems.filter((value: NavigationItem | [string, ng.route.IRoute]) => !Array.isArray(value)), p._currentItemClass, p._currentParentClass, p._otherItemClass);
            }];
        }
        currentItemClass(...css: string[]): mainNavigationServiceProvider {
            this._currentItemClass = [];
            if (typeof css !== "object" && css === null || css.length == 0)
                return this;
            let r: RegExp = /[\s\r\n]+/;
            css.forEach((value: any) => {
                if (typeof value == "string" && (value = value.trim()).length > 0)
                    value.split(r).forEach((v: string) => { this._currentItemClass.push(v); });
            });
        }
        currentParentClass(...css: string[]): mainNavigationServiceProvider {
            this._currentParentClass = [];
            if (typeof css !== "object" && css === null || css.length == 0)
                return this;
            let r: RegExp = /[\s\r\n]+/;
            css.forEach((value: any) => {
                if (typeof value == "string" && (value = value.trim()).length > 0)
                    value.split(r).forEach((v: string) => { this._currentParentClass.push(v); });
            });
        }
        otherItemClass(...css: string[]): mainNavigationServiceProvider {
            this._otherItemClass = [];
            if (typeof css !== "object" && css === null || css.length == 0)
                return this;
            let r: RegExp = /[\s\r\n]+/;
            css.forEach((value: any) => {
                if (typeof value == "string" && (value = value.trim()).length > 0)
                    value.split(r).forEach((v: string) => { this._otherItemClass.push(v); });
            });
        }
        when(path: string, route: ng.route.IRoute, metaData?: INavigationMetaData): mainNavigationServiceProvider {
            if (arguments.length > 2)
                this._navItems.push(new NavigationItem([path, route, metaData]));
            else
                this._navItems.push([path, route]);
            return this;
        }
        config($routeProvider: ng.route.IRouteProvider): void {
            this._navItems.map((item: NavigationItem | [string, ng.route.IRoute]): [string[], string, ng.route.IRoute] => {
                if (Array.isArray(item))
                    return [item[0].split('/').filter((s: string, i: number) => i > 0 || s.length > 0), item[0], item[1]];
                return [item.path.split('/').filter((s: string, i: number) => i > 0 || s.length > 0), item.path, item.route];
            }).sort((a: [string[], string, ng.route.IRoute], b: [string[], string, ng.route.IRoute]): number => {
                if (a[0].length > 0 && b[0].length > 0) {
                    let c: number = (a[0].length < b[0].length) ? a[0].length : b[0].length;
                    for (let i: number = 0; i < c; i++) {
                        if (a[i] !== b[i])
                            return (a[i] < b[i]) ? 1 : -1;
                    }
                }
                return b[0].length - a[0].length;
            }).forEach((item: [string[], string, ng.route.IRoute]) => {
                $routeProvider.when(item[1], item[2]);
            });
        }
    }

    export type PageTitleChangedEventListener = { (newValue: string, oldValue: string): void; } & Function;
    export type ThisPageTitleChangedEventListener<T> = { (this: T, newValue: string, oldValue: string): void; } & Function;
    export type PageChangedEventListener = { (newPage: NavigationItem | undefined, oldPage: NavigationItem | undefined): void; } & Function;
    export type ThisPageChangedEventListener<T> = { (this: T, newPage: NavigationItem | undefined, oldPage: NavigationItem | undefined): void; } & Function;

    class mainNavigationService {
        readonly [Symbol.toStringTag]: string = SERVICE_NAME;
        private readonly _titleChangedEvent: symbol;
        private readonly _pageChangedEvent: symbol;
        private readonly _subTitleChangedEvent: symbol;
        private readonly _defaultPageTitle: string;
        private _pageTitle: string;
        private _pageSubTitle: string;
        defaultPageTitle(): string { return this._defaultPageTitle; }
        pageTitle(value?: string): string {
            if (typeof value === "string") {
                if ((value = value.trim()).length == 0)
                    value = this._defaultPageTitle;
                let oldValue: string = this._pageTitle;
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
        pageSubTitle(value?: string): string {
            if (typeof value === "string") {
                let oldValue: string = this._pageSubTitle;
                if ((value = value.trim()) !== oldValue) {

                    this._pageSubTitle = value;
                    this.rootBroadcaster.broadcastEvent(this._subTitleChangedEvent, value, oldValue);
                }
            }
            return this._pageSubTitle;
        }
        getCurrentPage(): NavigationItem | undefined { return NavigationItem.getCurrentPage(this.navItems); }
        currentItemClass(): string[] { return this._currentItemClass; }
        currentParentClass(): string[] { return this._currentParentClass; }
        otherItemClass(): string[] { return this._otherItemClass; }
        getTopNav(): NavigationItem[] { return this.navItems; }
        getChildNav(): NavigationItem[] {
            let current: NavigationItem | undefined = this.getCurrentPage();
            return (typeof current === "undefined") ? [] : current.childItems;
        }
        getNestedAncestors(): NavigationItem[] {
            let current: NavigationItem | undefined = this.getCurrentPage();
            return (typeof current === "undefined") ? [] : current.getBreacrumbLinks();
        }
        constructor(private $document: ng.IDocumentService, private rootBroadcaster: rootBroadcaster.Service, private navItems: NavigationItem[], private _currentItemClass: string[], private _currentParentClass: string[], private _otherItemClass: string[]) {
            let element: JQuery = $document.find('head').find('title');
            if (element.length == 0)
                element = $document.find('head').add('<title></title>');
                
            let pageTitle: string = element.text();
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
        onPageTitleChanged<T>($scope: ng.IScope, listener: ThisPageTitleChangedEventListener<T>, thisArg: T): void;
        onPageTitleChanged($scope: ng.IScope, listener: PageTitleChangedEventListener): void;
        onPageTitleChanged($scope: ng.IScope, listener: ThisPageTitleChangedEventListener<any> | PageTitleChangedEventListener, thisArg?: any): void {
            if (arguments.length > 2)
                this.rootBroadcaster.onEvent($scope, this._titleChangedEvent, (event: ng.IAngularEvent, newValue: string, oldValue: string): void => { listener.call(thisArg, newValue, oldValue); });
            else
                this.rootBroadcaster.onEvent($scope, this._titleChangedEvent, (event: ng.IAngularEvent, newValue: string, oldValue: string): void => { listener(newValue, oldValue); });
        }
        onPageSubTitleChanged<T>($scope: ng.IScope, listener: ThisPageTitleChangedEventListener<T>, thisArg: T): void;
        onPageSubTitleChanged($scope: ng.IScope, listener: PageTitleChangedEventListener): void;
        onPageSubTitleChanged($scope: ng.IScope, listener: ThisPageTitleChangedEventListener<any> | PageTitleChangedEventListener, thisArg?: any): void {
            if (arguments.length > 2)
                this.rootBroadcaster.onEvent($scope, this._subTitleChangedEvent, (event: ng.IAngularEvent, newValue: string, oldValue: string): void => { listener.call(thisArg, newValue, oldValue); });
            else
                this.rootBroadcaster.onEvent($scope, this._subTitleChangedEvent, (event: ng.IAngularEvent, newValue: string, oldValue: string): void => { listener(newValue, oldValue); });
        }
        onPageChanged<T>($scope: ng.IScope, listener: ThisPageChangedEventListener<T>, thisArg: T): void;
        onPageChanged($scope: ng.IScope, listener, PageChangedEventListener): void;
        onPageChanged($scope: ng.IScope, listener: ThisPageChangedEventListener<any>, thisArg?: any): void {
            if (arguments.length > 2)
                this.rootBroadcaster.onEvent($scope, this._pageChangedEvent, (event: ng.IAngularEvent, newPage: NavigationItem | undefined, oldPage: NavigationItem | undefined): void => {
                    listener.call(thisArg, newPage, oldPage);
                });
            else
                this.rootBroadcaster.onEvent($scope, this._pageChangedEvent, (event: ng.IAngularEvent, newPage: NavigationItem | undefined, oldPage: NavigationItem | undefined): void => {
                    listener(newPage, oldPage);
                });
        }
        onPageActivated<T>($scope: ng.IScope, id: symbol, listener: { (this: T, page: NavigationItem): void } & Function, thisArg: T): void;
        onPageActivated($scope: ng.IScope, id: symbol, listener: { (page: NavigationItem): void } & Function): void;
        onPageActivated($scope: ng.IScope, id: symbol, listener: { (page: NavigationItem): void } & Function, thisArg?: any): void {
            if (arguments.length > 3)
                this.rootBroadcaster.onEvent($scope, this._pageChangedEvent, (event: ng.IAngularEvent, newPage: NavigationItem | undefined): void => {
                    if (typeof newPage === "object" && newPage.id === id)
                        listener.call(thisArg, newPage);
                });
            else
                this.rootBroadcaster.onEvent($scope, this._pageChangedEvent, (event: ng.IAngularEvent, newPage: NavigationItem | undefined): void => {
                    if (typeof newPage === "object" && newPage.id === id)
                        listener(newPage);
                });
        }
        onPageDeactivated<T>($scope: ng.IScope, id: symbol, listener: { (this: T, page: NavigationItem): void } & Function, thisArg: T): void;
        onPageDeactivated($scope: ng.IScope, id: symbol, listener: { (page: NavigationItem): void } & Function): void;
        onPageDeactivated($scope: ng.IScope, id: symbol, listener: { (page: NavigationItem): void } & Function, thisArg?: any): void {
            if (arguments.length > 3)
                this.rootBroadcaster.onEvent($scope, this._pageChangedEvent, (event: ng.IAngularEvent, newPage: NavigationItem | undefined, oldPage: NavigationItem | undefined): void => {
                    if (typeof oldPage === "object" && oldPage.id === id)
                        listener.call(thisArg, oldPage);
                });
            else
                this.rootBroadcaster.onEvent($scope, this._pageChangedEvent, (event: ng.IAngularEvent, newPage: NavigationItem | undefined, oldPage: NavigationItem | undefined): void => {
                    if (typeof oldPage === "object" && oldPage.id === id)
                        listener(oldPage);
                });
        }
        private onRouteChangeSuccess(event: ng.IAngularEvent, current?: ICurrentRouteWithMetaData): void {
            if (typeof current !== "object" || current === null)
                return;
            let newPage: NavigationItem | undefined = current.__metaData;
            let arr: [NavigationItem, NavigationItem] | [NavigationItem, undefined] | [undefined, NavigationItem] | [] = NavigationItem.setCurrentPage(this.navItems, newPage);
            if (arr.length == 0)
                return;

            try { this.pageTitle((typeof arr[0] === "undefined" || arr[0].pageTitle.length == 0) ? this._defaultPageTitle : arr[0].pageTitle); }
            finally {
                try { this.pageTitle((typeof arr[0] === "undefined" || arr[0].pageTitle.length == 0) ? this._defaultPageTitle : arr[0].pageTitle); }
                finally { this.rootBroadcaster.broadcastEvent(this._pageChangedEvent, arr[0], arr[1]); }
            }
        }
    }

    interface IMainScope extends ng.IScope {
        pageTitle: string;
        topNavItems: NavigationItem[];
        showSubtitle: boolean;
        subTitle: string;
    }

    class mainController implements ng.IController {
        readonly [Symbol.toStringTag]: string = CONTROLLER_NAME;
        constructor(private $scope: IMainScope, private mainNavigation: mainNavigationService) {
            $scope.pageTitle = mainNavigation.pageTitle();
            this.onSubTitleChanged(mainNavigation.pageSubTitle());
            $scope.topNavItems = mainNavigation.getTopNav();
            mainNavigation.onPageTitleChanged($scope, this.onTitleChanged, this);
        }
        private onTitleChanged(newValue: string): void { this.$scope.pageTitle = newValue; }
        private onSubTitleChanged(newValue: string): void {
            this.$scope.subTitle = newValue;
            this.$scope.showSubtitle = this.$scope.subTitle.length > 0;
        }
        $doCheck(): void { }
    }
    
    /**
    * The main module for this app.
    * @type {ng.IModule}
    */
    export let module: ng.IModule = rootBroadcaster.register(angular.module(MODULE_NAME, ['ngRoute']))
        .provider(SERVICE_NAME, mainNavigationServiceProvider)
        .controller(CONTROLLER_NAME, ['$scope', SERVICE_NAME, mainController])
        .config(['$routeProvider', PROVIDER_NAME, function ($routeProvider: ng.route.IRouteProvider, mainNavigationProvider: mainNavigationServiceProvider): void {
            mainNavigationProvider.when('/home', { templateUrl: 'Template/Home.htm' }, { navTitle: 'Home', pageTitle: '' })
                .when('/regex', { templateUrl: 'Template/RegexBuilder/Match.htm' }, {
                    navTitle: 'Regex', pageTitle: 'Regex Evaluator (match)', includeCurrentInSideNav: true, childItems: [
                        ['/regex/replace', { templateUrl: 'Template/RegexBuilder/Replace.htm' }, { navTitle: 'Replace', pageTitle: 'Regex Evaluator (replace)', includeParentInSideNav: true }],
                        ['/regex/search', { templateUrl: 'Template/RegexBuilder/Search.htm' }, { navTitle: 'Search', pageTitle: 'Regex Evaluator (search)', includeParentInSideNav: true }],
                        ['/regex/split', { templateUrl: 'Template/RegexBuilder/Split.htm' }, { navTitle: 'Split', pageTitle: 'Regex Evaluator (split)', includeParentInSideNav: true }]
                    ]
                })
                .when('/', { redirectTo: '/home' })
                .config($routeProvider);
            // configure html5 to get links working on jsfiddle
            //$locationProvider.html5Mode(true);
        }]);
}
