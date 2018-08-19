interface INavConfigvMenuItem {
  /**
   * Unique identifier for programmatic reference
   * @type {string}
   */
  id?: string;

  /**
   * Menu item display text
   * @type {string}
   */
  label: string;

  /**
   * Menu item tooltip
   * @type {string|undefined}
   */
  tooltip?: string;
}

/**
 * Base interface for child navigation items.
 * @interface
 */
interface INavConfigSubNav extends INavConfigvMenuItem {
  /**
   * Items to append to top navigation bar when this item is selected.
   */
  topNavBar?: NavConfigItem[];
  sideNavBar?: NavConfigItem[];
  hideTopNav?: string[];
  hideSideNav?: string[];
}
interface INavConfigRouterLink extends INavConfigvMenuItem, INavConfigSubNav {
  routerLink: string;
}
interface INavConfigPage extends INavConfigvMenuItem, INavConfigSubNav {
  page: string;
  heading?: string;
  subHeading?: string;
  description?: string;
}
interface INavConfigRouterPage extends INavConfigPage, INavConfigRouterLink {
}
interface INavConfigExternalUrl extends INavConfigvMenuItem {
  externalUrl: string;
}
type RootNavConfigItem = INavConfigRouterPage|INavConfigRouterLink|INavConfigExternalUrl;
type NavConfigItem = RootNavConfigItem|INavConfigPage;
interface INavMenuConfig {
  topNavBar: RootNavConfigItem[];
  sideNavBar?: RootNavConfigItem[];
}
function isNavConfigRouterPage(value: NavConfigItem): value is INavConfigRouterPage {
  return (typeof((<{[index: string]: any; }>value).page) === 'string' && typeof((<{[index: string]: any; }>value).routerLink) === 'string');
}
function hasNavConfigRouterLink(value?: NavConfigItem): value is INavConfigRouterLink|INavConfigRouterPage {
  return (typeof((<{[index: string]: any; }>value).page) !== 'string' && typeof((<{[index: string]: any; }>value).routerLink) === 'string');
}
function isNavConfigRouterLink(value?: NavConfigItem): value is INavConfigRouterLink {
  return (typeof((<{[index: string]: any; }>value).page) !== 'string' && typeof((<{[index: string]: any; }>value).routerLink) === 'string');
}
function isNavConfigPage(value?: NavConfigItem): value is INavConfigPage {
  return (typeof((<{[index: string]: any; }>value).page) === 'string' && typeof((<{[index: string]: any; }>value).routerLink) !== 'string');
}
function isNavConfigExternalUrl(value: NavConfigItem): value is INavConfigExternalUrl {
  return typeof((<{[index: string]: any; }>value).externalUrl) === 'string';
}
export class NavMenuItem {
  private _type: MenuItemType;
  private _id: string;
  private _label: string;
  private _tooltip: string;
  private _routerLink: string;
  private _heading: string;
  private _page: string;
  private _subHeading: string;
  private _description: string;
  private _precedingSibling?: NavMenuItem;
  private _followingSibling?: NavMenuItem;
  private _parent: NavMenuItem|NavMenu;
  private _topNavItems: NavMenuItem[];
  private _sideNavItems: NavMenuItem[];
  public get type(): string { return this._type; }
  public get id(): string { return this._id; }
  public get label(): string { return this._label; }
  public get routerLink(): string { return this._routerLink; }
  public get heading(): string { return this._heading; }
  public get page(): string { return this._page; }
  public get subHeading(): string { return this._subHeading; }
  public get description(): string { return this._description; }
  public get tooltip(): string { return this._tooltip; }
  public get precedingSibling(): NavMenuItem|undefined { return this._precedingSibling; }
  public get followingSibling(): NavMenuItem|undefined { return this._followingSibling; }
  public get parent(): NavMenuItem|NavMenu { return this._parent; }
  public get topNavItems(): NavMenuItem[] { return this._topNavItems; }
  public get sideNavItems(): NavMenuItem[] { return this._sideNavItems; }

  private static create(value: NavConfigItem, parent: NavMenuItem|NavMenu, precedingSibling?: NavMenuItem): NavMenuItem {
    const result: NavMenuItem = new NavMenuItem(value, parent);
    if (typeof(precedingSibling) !== 'undefined') {
      parent = precedingSibling._parent;
      result._followingSibling = precedingSibling._followingSibling;
      precedingSibling._followingSibling = result;
      if (typeof(result._followingSibling) !== 'undefined')
        result._followingSibling._precedingSibling = result;
    }
    return result;
  }
  constructor(value: NavConfigItem, parent: NavConfigItem|NavMenu) {
    this._id = (typeof(value.id) === 'string') ? value.id : '';
    this._label = value.label;
    this._tooltip = (typeof(value.tooltip) === 'string') ? value.tooltip : '';
    if (isNavConfigExternalUrl(value))
      this._type = 'externalUrl';
    else {
      if (isNavConfigRouterLink(value)) {
        this._routerLink = value.routerLink;
        this._type = 'routedUrl';
      } else {
        this._type = 'page';
        this._page = value.page;
        if (isNavConfigRouterPage(value))
          this._routerLink = value.routerLink;
        else {
          let r: NavMenuItem|NavMenu = parent;
          while (isNavConfigItem(r) && r._type === 'externalUrl')
            r = r._parent;
          if (isNavConfigItem(r))
            this._routerLink = r._routerLink;
        }
        this._description = value.description;
        this._heading = value.heading;
        this._subHeading = value.subHeading;
        let precedingSibling: NavMenuItem|undefined;
        this._topNavItems = (typeof(value.topNavBar) === 'object' && value.topNavBar !== null) ?
          value.topNavBar.map<NavMenuItem>(function(v: NavConfigItem): NavMenuItem {
            precedingSibling = NavMenuItem.create(v, this, precedingSibling);
            return precedingSibling;
          }) : [];
        this._sideNavItems = (typeof(value.sideNavBar) === 'object' && value.sideNavBar !== null) ?
          value.sideNavBar.map<NavMenuItem>(function(v: NavConfigItem): NavMenuItem {
            precedingSibling = NavMenuItem.create(v, this, precedingSibling);
            return precedingSibling;
          }) : [];
      }
    }
  }
}
function isNavConfigItem(value?: NavMenuItem|NavMenu|null): value is NavMenuItem {
  return typeof(value) === 'object' && value !== null && value instanceof NavMenuItem;
}
export type MenuItemType = 'routedUrl'|'page'|'externalUrl';
export class NavMenu {
}

