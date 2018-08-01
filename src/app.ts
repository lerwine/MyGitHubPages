'use strict';
let mainModule: angular.IModule = angular.module("main", []);

interface IMenuSchemaNavItem {
    title: string;
    heading?: string;
    pageUrl: string;
}
interface IMenuSchemaLeaf extends IMenuSchemaNavItem {
    disabled?: boolean;
}
type MenuSchemaNavItem = IMenuSchemaLeaf|IMenuSchemaContainer;
interface IMenuSchemaContainer extends IMenuSchemaNavItem {
    items: MenuSchemaNavItem[];
}
interface IMenuSchema {
    rootItems: MenuSchemaNavItem[];
}
function isMenuSchemaContainer(item: MenuSchemaNavItem): item is IMenuSchemaContainer {
    return typeof((<{[key: string]: any}>item).items) != "undefined";
}
interface IPagePropertiesScope extends angular.IScope {
    headingText: string;
    activeNavItem?: INavigationScope;
    selectedChildItem?: NavigationItem;
    navItems: NavigationItem[],
    pageTemplateUrl: string
};

interface INavigationScope extends angular.IScope {
    navNode: NavigationItem;
    isActive: boolean;
    title: string;
    heading: string;
    listItemClass: string;
    anchorClass: string;
    disabled: boolean;
    containsActive: boolean;
}
interface INavigationContainerScope extends INavigationScope {
    selectedChildItem?: NavigationItem;
}
type NavigationParent = IPagePropertiesScope|NavigationContainer;

abstract class NavigationItem {
    private _id : Symbol;
    private _parentNode : NavigationParent;
    private _precedingSibling : NavigationItem|undefined;
    private _followingSibling : NavigationItem|undefined;
    private _pageUrl: string;
    public get parentNode() : NavigationParent { return this._parentNode; }
    public get precedingSibling() : NavigationItem|undefined { return this._precedingSibling; }
    public get followingSibling() : NavigationItem|undefined { return this._followingSibling; }
    public get activeNavItem(): INavigationScope|undefined { return this.parentNode.activeNavItem; }
    public abstract get scope() : INavigationScope;
    public get title() : string { return this.scope.title; }
    public get heading() : string { return this.scope.heading; }
    public get pageUrl() : string { return this._pageUrl; }
    public get isActive() : boolean { return this.scope.isActive; }
    public set isActive(value : boolean) {
        if (this.scope.isActive == value)
            return;
        
        let pageScope: IPagePropertiesScope = this.getPagePropertiesScope();
        let previousActive: INavigationScope|undefined = pageScope.activeNavItem;
        this.scope.isActive = value;
        NavigationItem.setCssClass(this.scope);
        if (value) {
            if (typeof(pageScope.activeNavItem) == "undefined" || !pageScope.activeNavItem.navNode.equals(this._id)) {
                pageScope.activeNavItem = this.scope;
                if (this.parentNode instanceof NavigationContainer)
                    this.parentNode.select(this);
                else
                    this.parentNode.selectedChildItem = this;
            }

            pageScope.headingText = this.scope.heading;
            pageScope.pageTemplateUrl = this._pageUrl;
        } else if (typeof(previousActive) != "undefined" && previousActive.navNode.equals(this._id)) {
            pageScope.activeNavItem = undefined;
            if (this.parentNode instanceof NavigationContainer)
                this.parentNode.deselect(this);
            else
                this.parentNode.selectedChildItem = undefined;
        }
    }
    static setCssClass(scope: INavigationScope) {
        if (scope.disabled) {
            scope.listItemClass = "nav-item border border-secondary bg-dark";
            scope.anchorClass = "nav-link text-light";
        } else if (scope.isActive) {
            scope.listItemClass = "nav-item active border border-secondary bg-light";
            scope.anchorClass = "nav-link text";
        } else if (scope.containsActive) {
            scope.listItemClass = "nav-item active border border-secondary bg-light";
            scope.anchorClass = "nav-link text";
        } else {
            scope.listItemClass = "nav-item border border-secondary bg-dark";
            scope.anchorClass = "nav-link text-light";
        }
    }
    constructor(parentNode: NavigationParent, scope: INavigationScope, source: MenuSchemaNavItem, precedingSibling?: NavigationItem) {
        this._id = Symbol();
        this._parentNode = parentNode;
        scope.title = source.title;
        scope.heading = (typeof(source.heading) == "string" && source.heading.trim().length > 0) ? source.heading : source.title;
        scope.isActive = false;
        scope.navNode = this;
        scope.disabled = false;
        NavigationItem.setCssClass(scope);
        this._pageUrl = "pages/" + source.pageUrl;
        this._precedingSibling = precedingSibling;
        if (typeof(this._precedingSibling) != "undefined") {
            this._followingSibling = this._precedingSibling._followingSibling;
            this._precedingSibling._followingSibling = this;
            if (typeof(this._followingSibling) != "undefined")
                this._followingSibling._precedingSibling = this;
        }
    }
    activate(): false {
        if (!(this.isActive || this.scope.disabled))
            this.isActive = true;
        return false;
    }
    private getPagePropertiesScope(): IPagePropertiesScope {
        let container: NavigationContainer|IPagePropertiesScope = this.parentNode;
        while (container instanceof NavigationContainer)
            container = container.parentNode;
        return container;
    }
    equals(other: NavigationItem|Symbol): boolean {
        if (typeof(other) == "symbol")
            return other === this._id;
        return (<NavigationItem>other).equals(this._id);
    }
}
class NavigationLeaf extends NavigationItem {
    private _scope : INavigationScope;
    public get scope() : INavigationScope { return this._scope; }
    public get disabled() : boolean {
        return this.scope.disabled;
    }
    public set disabled(value : boolean) {
        this.scope.disabled = value;
    }
    constructor(parentItem: NavigationParent, parentScope: angular.IScope, source: IMenuSchemaLeaf, precedingSibling?: NavigationItem) {
        let scope: INavigationScope = <INavigationScope>(parentScope.$new(true));
        super(parentItem, scope, source, precedingSibling);
        this._scope = scope;
        this.disabled = source.disabled === true;
    }
}
class NavigationContainer extends NavigationItem {
    private _scope : INavigationContainerScope;
    public get scope() : INavigationContainerScope { return this._scope; }
    private _navItems: NavigationItem[];
    private _selectedChildItem?: NavigationItem;
    public get navItems(): ReadonlyArray<NavigationItem> { return this._navItems; }
    public get selectedChildItem(): NavigationItem|undefined { return this._selectedChildItem; }
    public get activeNavNode() : NavigationItem|undefined {
        if (typeof(this.parentNode.activeNavItem) != "undefined")
            return this.parentNode.activeNavItem.navNode;
    }

    constructor(parentItem: NavigationParent, parentScope: angular.IScope, source: IMenuSchemaContainer, precedingSibling?: NavigationItem) {
        let scope: INavigationContainerScope = <INavigationContainerScope>(parentScope.$new(true))
        super(parentItem, scope, source, precedingSibling);
        this._scope = scope;
        this._navItems = NavigationContainer.importNavItems(this, this.scope, source.items);
    }
    select(item: NavigationItem): void {
        if (this._navItems.filter(function(value: NavigationItem): boolean { return value.equals(item); }).length == 0)
            return;
        if (!(item.isActive || ((item instanceof NavigationContainer) && typeof(item._selectedChildItem) != "undefined")))
            item.isActive = true;
        let previousSelected: NavigationItem|undefined = this._selectedChildItem;
        this._selectedChildItem = item;
        if (this.parentNode instanceof NavigationContainer)
            this.parentNode.select(this);
        else
            this.parentNode.selectedChildItem = this;
        if (typeof(previousSelected) != "undefined" && !previousSelected.equals(item))
            this.deselect(previousSelected);
    }
    deselect(item: NavigationItem): void {
        if (this._navItems.filter(function(value: NavigationItem): boolean { return value.equals(item); }).length == 0)
            return;
        if (item.isActive)
            item.isActive = false;
        else if (item instanceof NavigationContainer && typeof(item._selectedChildItem) != "undefined")
            item.deselect(item._selectedChildItem);
        if (typeof(this._selectedChildItem) == "undefined" || !this._selectedChildItem.equals(item))
            return;
        this._selectedChildItem = undefined;
        if (this.parentNode instanceof NavigationContainer)
            this.parentNode.deselect(this);
        else if (typeof(this.parentNode.selectedChildItem) != "undefined" && this.parentNode.selectedChildItem.equals(this))
            this.parentNode.selectedChildItem = undefined;
    }
    static importNavItems(parentItem: NavigationParent, parentScope: angular.IScope, source: MenuSchemaNavItem[]): NavigationItem[] {
        let precedingSibling: NavigationItem|undefined;
        return source.map(function(value: MenuSchemaNavItem): NavigationItem {
            let current: NavigationItem = (isMenuSchemaContainer(value)) ? new NavigationContainer(parentItem, parentScope, value) : new NavigationLeaf(parentItem, parentScope, value);
            precedingSibling = current;
            return current;
        });
    }
}
let pagePropertiesController: angular.IController = mainModule.controller("pageProperties", function(this: angular.IController, $scope: IPagePropertiesScope, $http: angular.IHttpService, $q: angular.IQService) {
    $scope.headingText = "LErwine Github Repositories";
    $scope.navItems = [];
    $http.jsonp<IMenuSchema>("menuSchema.json").then(function(value: angular.IHttpResponse<IMenuSchema>) {
        $scope.navItems = NavigationContainer.importNavItems($scope, $scope, value.data.rootItems);
        if ($scope.navItems.length > 0)
            $scope.navItems[0].isActive = true;
    });
});