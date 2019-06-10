/// <reference path="Scripts/typings/jquery/jquery.d.ts"/>
/// <reference path="Scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="accordionGroup.ts"/>
/// <reference path="sys.ts"/>
/// <reference path="app.ts"/>

namespace uriBuilder {
    // #region Uri Scheme Specification

    const schemeRegex: RegExp = /^([a-z_][-.\dA-_a-z~\ud800-\udbff]*)(:[\\/]{0,2})/;
    const userInfoRegex: RegExp = /^([^:\\\/@]+)?(:([^:\\\/@]+)?)?@/;
    const hostAndPortRegex: RegExp = /^([^:\\\/@]+)?(:(\d+))?@/;
    const separatorRegex: RegExp = /[\\\/:]/;
    const nonSeparatorRegex: RegExp = /[\\\/:]/;
    const pathSegmentRegex: RegExp = /^(?:([^\\\/:]+)|([\\\/:])([^\\\/:]+)?)(.+)?$/;
    const uriParseRegex: RegExp = /^(([^\\\/@:]*)(:[\\\/]{0,2})((?=[^\\\/@:]*(?::[^\\\/@:]*)?@)([^\\\/@:]*)(:[^\\\/@:]*)?@)?([^\\\/@:]*)(?:(?=:\d*(?:[\\\/:]|$)):(\d*))?(?=[\\\/:]|$))?(.+)?$/;
    const uriDataRegex: RegExp = /^([$-.\d_a-z~\ud800-\udbff]+|%[a-f\d]{2})+/i;
    const uriPathRegex: RegExp = /^([!$&-.\d;=@-\[\]_a-z~\ud800-\udbff\/\\]+|%[a-f\d]{2})+/i;
    const uriPathNameRegex: RegExp = /^([!$&-.\d;=@-\[\]_a-z~\ud800-\udbff]+|%[a-f\d]{2})+/i;
    const uriAuthorityNameRegex: RegExp = /^([!$&-.\d;=A-\[\]_a-z~\ud800-\udbff]+|%[a-f\d]{2})+/;

    enum uriParseGroup {
        all = 0,
        origin = 1,
        schemeName = 2,
        schemeSeparator = 3,
        userInfo = 4,
        username = 5,
        password = 6,
        hostname = 7,
        portnumber = 8,
        path = 9
    }
    
    /*
      https://john.doe:userpassword@www.example.com:65535/forum/questions/?tag=networking&order=newest#top
      ├─┬─┘└┬┘├───┬──┘ └─────┬────┤ ├──────┬──────┘ └─┬─┤│               │ │                         │ │ │
      │ │   │ │username  password │ │  hostname     port││               │ │                         │ │ │
      │ │   │ ├─────────┬─────────┘ └─────────┬─────────┤│               │ │                         │ │ │
      │ │ sep │     userinfo                 host       ││               │ │                         │ │ │
      │ │     └──────────────────┬──────────────────────┤│               │ │                         │ │ │
      │ scheme               authority                  ││               │ │                         │ │ │
      └───────────────────────┬─────────────────────────┘└───────┬───────┘ └────────────┬────────────┘ └┬┘
                            origin                              path                   query        fragment

      file:///C:/Program%20Files%20(x86)/Common%20Files/microsoft%20shared
      ├─┬┘└┬┘││                                                          │
      │ │sep ││                                                          │
      │scheme││                                                          │
      └───┬──┘└────────────────────────────┬─────────────────────────────┘
        origin                           path

      file://remoteserver.mycompany.org/Shared%20Files/Report.xlsx
      ├─┬┘└┬┘└────────────┬───────────┤│                         │
      │ │ sep       host/authority    ││                         │
      │scheme                         ││                         │
      └───────────────┬───────────────┘└────────────┬────────────┘
                    origin                        path

      ldap://[2001:db8::7]/c=GB?objectClass?one
      ├─┬┘└┬┘└─────┬─────┤│   │ │             │
      │ │ sep    host    ││   │ │             │
      │ scheme           ││   │ │             │
      └─────────┬────────┘└─┬─┘ └──────┬──────┘
             origin        path      query

      mailto:John.Doe@example.com
      ├──┬─┘ ├───┬──┘ └────┬────┤
      │  │   │username    host  │
      │  │   └─────────┬────────┤
      │scheme       authority   │
      └────────────┬────────────┘
                origin

      news:comp.infosystems.www.servers.unix
      ├─┬┘ └───────────────┬───────────────┤
      │scheme        host/authority        │
      └──────────────────┬─────────────────┘
                      origin
    
      tel:+1-816-555-1212
      ├┬┘ └──────┬──────┤
      ││  host/authority│
      │scheme           │
      └────────┬────────┘
    
      telnet://192.0.2.16:80/
      ├──┬─┘└┬┘├────┬───┘ ├┤│
      │  │   │ │hostname  │││
      │  │   │ │       port││
      │  │ sep └─────┬─────┤│
      │ scheme   host/auth ││
      └──────────┬─────────┘│
               origin      path
    
      urn:oasis:names:specification:docbook:dtd:xml:4.1.2
      ├┬┘ └─┬─┤ │                                       │
      ││  host│ │                                       │
      │scheme │ │                                       │
      └───┬───┘ └───────────────────┬───────────────────┘
        origin                     path
     */

    /**
     * Valid URI scheme separator strings.
     * 
     * @typedef {"://" | ":/" | ":"} UriSchemeSeparator
     */
    export type UriSchemeSeparator = "://" | ":/" | ":";

    /**
     * Matches scheme (group #1) and separator (group #2) at the beginning of text.
     * 
     * @constant
     * @default
     * */
    export const uriSchemeParseRe: RegExp = /^([^:\\\/?#@]*)(:[\\/]{0,2})/;

    /**
     * Matches user name (group #2) and optional password (group #3) followed by @.
     * 
     * @constant
     * @default
     * */
    export const userPwParseRe: RegExp = /^(([^:\\\/@]*)(?::([:\\\/@]*)))@/;

    /**
     * Matches user name (group #1) followed by @.
     * 
     * @constant
     * @default
     * */
    export const userNameParseRe: RegExp = /^([^\\\/@]*)@/;

    /**
     * Matches host name (group #1) and optional port number (group #2).
     * 
     * @constant
     * @default
     * */
    export const hostPortParseRe: RegExp = /^([^:\\\/@]*)(?::(\d+))?/;

    /**
     * Matches host name.
     * 
     * @constant
     * @default
     * */
    export const hostNameParseRe: RegExp = /^[^\\\/@]+/;

    /**
     * Matches a valid URI scheme.
     * 
     * @constant
     * @default
     * */
    export const uriSchemeValidationRe: RegExp = /^[a-zA-Z_][-.\dA-_a-z~\ud800-\udbff]*$/;

    /**
     * Indicates whether a string represents a valid URI scheme name.
     *
     * @export
     * @param {string} name
     * @returns true if the specified string is a valid URI scheme name; otherwise, false.
     */
    export function isValidSchemeName(name: string) { return !sys.isNilOrWhiteSpace(name) && uriSchemeValidationRe.test(name); }

    /**
     * Specifies whether a component is supported for a given URI scheme, and whether it is required.
     *
     * @export
     * @enum {number}
     */
    export enum UriComponentSupportOption {
        /**
         * The component is required for the given URI scheme.
         */
        required,

        /**
         * The component is optional for the given URI scheme.
         */
        optional,

        /**
         * The component is not supported for the given URI scheme.
         */
        notSupported
    }

    /**
     * Gets scheme information for URI detected in a URI string.
     *
     * @export
     * @param {string} uri - URI to parse for scheme.
     * @returns {(UriSchemeSpecification | undefined)} The detected scheme or undefined if the URI string could not be parsed as an absolute URI.
     */
    export function getUriSchemeInfo(uri: string): UriSchemeSpecification | undefined {
        if ((typeof uri === "string") && uri.length > 0) {
            let m: RegExpExecArray = uriSchemeParseRe.exec(uri);
            if ((typeof m === "object") && m !== null) {
                let scheme: UriSchemeSpecification = UriSchemeSpecification.getSchemeSpecs(m[1]);
                let s: string = m[2].replace("\\", "/");
                if (scheme.separator === s)
                    return scheme;
                return new UriSchemeSpecification({
                    name: scheme.name,
                    path: scheme.path, query: scheme.query, fragment: scheme.fragment, userinfo: scheme.userinfo, host: scheme.host, separator: <UriSchemeSeparator>s
                }, scheme.description);
            }
        }
    }

    /**
     * Specifies user info component requirements and options for a given URI scheme.
     *
     * @export
     * @interface IUriUserInfoComponentSpec
     */
    export interface IUriUserInfoComponentSpec {
        /**
         * Specifies the user name requirement/option for the given URI scheme.
         *
         * @type {(UriComponentSupportOption | null | undefined)}
         * @memberof IUriUserInfoComponentSpec
         * @description If this is not defined or is null, then it is assumed to be an optional component.
         */
        name?: UriComponentSupportOption | null;
        
        /**
         * Specifies password requirement/option for the given URI scheme.
         *
         * @type {(UriComponentSupportOption | null | undefined)}
         * @memberof IUriUserInfoComponentSpec
         * @description If {@link IUriHostComponentSpec#name} is set to {@link UriComponentSupportOption.notSupported}, then this value should be undefined, null or {@link UriComponentSupportOption.notSupported};
         *  if {@link IUriHostComponentSpec#name} is set to {@link UriComponentSupportOption.optional} and this is set to {@link UriComponentSupportOption.required}, then that specifies that the
         *  password is a requirement when the user name is present; oherwise, if this is not defined or is null, then it is assumed to be an optional component.
         */
        password?: UriComponentSupportOption | null;
    }

    /**
     * Values for specifying that user name and password components are not supported in a URI scheme.
     *
     * @typedef {UriComponentSupportOption.notSupported | (IUriUserInfoComponentSpec & { name: UriComponentSupportOption.notSupported, password?: UriComponentSupportOption.notSupported | null })} IUriUserInfoComponentSpecNotSupported
     */
    export type IUriUserInfoComponentSpecNotSupported = UriComponentSupportOption.notSupported | (IUriUserInfoComponentSpec & { name: UriComponentSupportOption.notSupported, password?: UriComponentSupportOption.notSupported | null });

    /**
     * Values for specifying that the user name component is supported in a URI scheme supported, but the password component is not.
     *
     * @typedef {UriComponentSupportOption.optional | UriComponentSupportOption.required | (IUriUserInfoComponentSpec & { name?: UriComponentSupportOption.optional | UriComponentSupportOption.required | null, password: UriComponentSupportOption.notSupported })} IUriUserInfoComponentSpecNameOnly
     */
    export type IUriUserInfoComponentSpecNameOnly = UriComponentSupportOption.optional | UriComponentSupportOption.required | (IUriUserInfoComponentSpec & { name?: UriComponentSupportOption.optional | UriComponentSupportOption.required | null, password: UriComponentSupportOption.notSupported });

    /**
     * Values for specifying that user name and password components are both supported in a URI scheme.
     *
     * @typedef {UriComponentSupportOption.optional | UriComponentSupportOption.required | (IUriUserInfoComponentSpec & { name?: UriComponentSupportOption.optional | UriComponentSupportOption.required | null, password?: UriComponentSupportOption.optional | UriComponentSupportOption.required | null }) | null} IUriUserInfoComponentSpecSupportsPassword
     */
    export type IUriUserInfoComponentSpecSupportsPassword = UriComponentSupportOption.optional | UriComponentSupportOption.required | (IUriUserInfoComponentSpec & { name?: UriComponentSupportOption.optional | UriComponentSupportOption.required | null, password?: UriComponentSupportOption.optional | UriComponentSupportOption.required | null }) | null;

    /**
     * Specifies host requirements and options for a given URI scheme.
     *
     * @export
     * @interface IUriHostComponentSpec
     */
    export interface IUriHostComponentSpec {
        /**
         * Specifies the host name requirement/option for the given URI scheme.
         *
         * @type {(UriComponentSupportOption | null | undefined)}
         * @memberof IUriHostComponentSpec
         * @description If this is not defined or is null, then it is assumed to be an optional component.
         */
        name?: UriComponentSupportOption | null;

        /**
         * Specifies the port number requirement/option for the given URI scheme.
         *
         * @type {(UriComponentSupportOption | null | undefined)}
         * @memberof IUriHostComponentSpec
         * @description If {@link IUriHostComponentSpec#name} is set to {@link UriComponentSupportOption.notSupported}, then this value should be undefined, null or {@link UriComponentSupportOption.notSupported};
         *  if {@link IUriHostComponentSpec#name} is set to {@link UriComponentSupportOption.optional} and this is set to {@link UriComponentSupportOption.required}, then that specifies that the
         *  port number is a requirement when the host name is present; oherwise, if this is not defined or is null, then it is assumed to be an optional component.
         */
        port?: UriComponentSupportOption | null;

        /**
         * Specifies the default port number for a URI scheme.
         *
         * @type {(number | null | undefined)}
         * @memberof IUriHostComponentSpec
         * @description If {@link IUriHostComponentSpec#name} or {@link IUriHostComponentSpec#port} is set to {@link UriComponentSupportOption.notSupported}, then this value should be undefined, null or {@link NaN};
         *  If this is not defined or is NaN or null, then it is assumed that there is no default port number.
         */
        defaultPort?: number | null;
    }

    /**
     * Values for specifying that host name and port number components are not supported in a URI scheme.
     *
     * @typedef {UriComponentSupportOption.notSupported | (IUriHostComponentSpec & { name: UriComponentSupportOption.notSupported, port?: UriComponentSupportOption.notSupported | null, defaultPort?: null })} IUriHostComponentSpecNotSupported
     */
    export type IUriHostComponentSpecNotSupported = UriComponentSupportOption.notSupported | (IUriHostComponentSpec & { name: UriComponentSupportOption.notSupported, port?: UriComponentSupportOption.notSupported | null, defaultPort?: null });

    /**
     * Values for specifying that the host name component is supported in a URI scheme supported, but the port number component is not.
     *
     * @typedef {UriComponentSupportOption.optional | UriComponentSupportOption.required | (IUriHostComponentSpec & { name?: UriComponentSupportOption.optional | UriComponentSupportOption.required | null, port: UriComponentSupportOption.notSupported, defaultPort?: null })} IUriHostComponentSpecNameOnly
     */
    export type IUriHostComponentSpecNameOnly = UriComponentSupportOption.optional | UriComponentSupportOption.required | (IUriHostComponentSpec & { name?: UriComponentSupportOption.optional | UriComponentSupportOption.required | null, port: UriComponentSupportOption.notSupported, defaultPort?: null });

    /**
     * Values for specifying that host name and port number components are both supported in a URI scheme.
     *
     * @typedef {UriComponentSupportOption.optional | UriComponentSupportOption.required | (IUriHostComponentSpec & { name?: UriComponentSupportOption.optional | UriComponentSupportOption.required | null, port?: UriComponentSupportOption.optional | UriComponentSupportOption.required | null }) | null} IUriHostComponentSpecSupportsPort
     */
    export type IUriHostComponentSpecSupportsPort = UriComponentSupportOption.optional | UriComponentSupportOption.required | (IUriHostComponentSpec & { name?: UriComponentSupportOption.optional | UriComponentSupportOption.required | null, port?: UriComponentSupportOption.optional | UriComponentSupportOption.required | null }) | null;
    
    /**
     * URI component support specifications.
     *
     * @export
     * @interface IUriComponentSpec
     */
    export interface IUriComponentSpec {
        /**
         * Name of URI scheme.
         *
         * @type {string}
         * @memberof IUriComponentSpec
         */
        name: string;

        /**
         * Default URI scheme separator.
         *
         * @type {(UriSchemeSeparator | null | undefined)}
         * @memberof IUriComponentSpec
         * @description If this is not defined or is null or empty, then this is assumed to be "://".
         */
        separator?: UriSchemeSeparator;
        
        /**
         * User name and password component support.
         *
         * @type {(IUriUserInfoComponentSpecNotSupported | IUriUserInfoComponentSpecNameOnly | IUriUserInfoComponentSpecSupportsPassword | null | undefined)}
         * @memberof IUriComponentSpec
         * @description If this is not defined or is null, both user name and password components are assumed to be optional.
         */
        userinfo?: IUriUserInfoComponentSpecNotSupported | IUriUserInfoComponentSpecNameOnly | IUriUserInfoComponentSpecSupportsPassword | null;
        
        /**
         * Host name and port number component support.
         *
         * @type {(IUriHostComponentSpecNotSupported | IUriHostComponentSpecNameOnly | IUriHostComponentSpecSupportsPort | null | undefined)}
         * @memberof IUriComponentSpec
         * @description If this is not defined or is null, both host name and port number components are assumed to be optional.
         */
        host?: IUriHostComponentSpecNotSupported | IUriHostComponentSpecNameOnly | IUriHostComponentSpecSupportsPort | null;
        
        /**
         * Path component support.
         *
         * @type {(UriComponentSupportOption | null | undefined)}
         * @memberof IUriComponentSpec
         * @description If this is not defined or is null, then this is assumed to be optional.
         */
        path?: UriComponentSupportOption | null;
        
        /**
         * Query string component support.
         *
         * @type {(UriComponentSupportOption | null | undefined)}
         * @memberof IUriComponentSpec
         * @description If this is not defined or is null, then this is assumed to be optional.
         */
        query?: UriComponentSupportOption | null;
        
        /**
         * Fragment component support.
         *
         * @type { | null | undefined)UriComponentSupportOption | null | undefined)}
         * @memberof IUriComponentSpec
         * @description If this is not defined or is null, then this is assumed to be optional.
         */
        fragment?: UriComponentSupportOption | null;
    }
    
    /**
     * Represents a URI scheme selection option.
     *
     * @export
     * @interface IUriSchemeOption
     * @extends {IAbsoluteUriComponentSpec}
     */
    export interface IUriSchemeOption extends IUriComponentSpec {
        /**
         * Display text to use in selection controls.
         *
         * @type {string}
         * @memberof IUriSchemeOption
         */
        displayText: string;
        
        /**
         * Optional description of URI scheme.
         *
         * @type {string}
         * @memberof IUriSchemeOption
         */
        description?: string;
    }
    
    /**
     * Represents a URI scheme specification.
     *
     * @export
     * @class UriSchemeInfo
     * @implements {IUriSchemeOption}
     */
    export class UriSchemeSpecification implements IUriSchemeOption {
        private readonly _description?: string;
        private readonly _name: string;
        private readonly _separator: UriSchemeSeparator;
        private readonly _username: UriComponentSupportOption;
        private readonly _password: UriComponentSupportOption;
        private readonly _hostname: UriComponentSupportOption;
        private readonly _port: UriComponentSupportOption;
        private readonly _defaultPort: number;
        private readonly _path: UriComponentSupportOption;
        private readonly _query: UriComponentSupportOption;
        private readonly _fragment: UriComponentSupportOption;
        /**
         * Name of the current URI scheme.
         *
         * @readonly
         * @type {string}
         * @memberof UriSchemeInfo
         */
        get name(): string { return this._name; }
        
        /**
         * The default URI scheme separator.
         *
         * @readonly
         * @type {UriSchemeSeparator}
         * @memberof UriSchemeInfo
         */
        get separator(): UriSchemeSeparator { return this._separator; }
        
        /**
         * The user name requirement/option for the current URI scheme.
         *
         * @readonly
         * @type {UriComponentSupportOption}
         * @memberof UriSchemeInfo
         */
        get username(): UriComponentSupportOption { return this._username; }
        
        /**
         * The password requirement/option for the current URI scheme.
         *
         * @readonly
         * @type {UriComponentSupportOption}
         * @memberof UriSchemeInfo
         */
        get password(): UriComponentSupportOption { return this._password; }
        
        /**
         * The host name requirement/option for the current URI scheme.
         *
         * @readonly
         * @type {UriComponentSupportOption}
         * @memberof UriSchemeInfo
         */
        get hostname(): UriComponentSupportOption { return this._hostname; }
        
        /**
         * Specifies the port number requirement/option for the current URI scheme.
         *
         * @readonly
         * @type {UriComponentSupportOption}
         * @memberof UriSchemeInfo
         */
        get port(): UriComponentSupportOption { return this._port; }
        
        /**
         * Specifies the default port number for the current URI scheme or {@link NaN} if there is no default port number.
         *
         * @readonly
         * @type {number}
         * @memberof UriSchemeInfo
         */
        get defaultPort(): number { return this._defaultPort; }
        
        /**
         * The path requirement/option for the current URI scheme.
         *
         * @readonly
         * @type {UriComponentSupportOption}
         * @memberof UriSchemeInfo
         */
        get path(): UriComponentSupportOption { return this._path; }
        
        /**
         * The query parameter requirement/option for the current URI scheme.
         *
         * @readonly
         * @type {UriComponentSupportOption}
         * @memberof UriSchemeInfo
         */
        get query(): UriComponentSupportOption { return this._query; }
        
        /**
         * The fragment requirement/option for the current URI scheme.
         *
         * @readonly
         * @type {UriComponentSupportOption}
         * @memberof UriSchemeInfo
         */
        get fragment(): UriComponentSupportOption { return this._fragment; }
        
        /**
         * The description of the current URI scheme.
         *
         * @readonly
         * @type {string}
         * @memberof UriSchemeInfo
         */
        get description(): string { return this._description; }
        
        /**
         * Gets combined user name and password requirements/options for the current URI scheme.
         *
         * @readonly
         * @type {(IUriUserInfoComponentSpecNotSupported | IUriUserInfoComponentSpecNameOnly | IUriUserInfoComponentSpecSupportsPassword)}
         * @memberof UriSchemeInfo
         */
        get userinfo(): IUriUserInfoComponentSpecNotSupported | IUriUserInfoComponentSpecNameOnly | IUriUserInfoComponentSpecSupportsPassword {
            return (this._username == UriComponentSupportOption.notSupported || this._password == UriComponentSupportOption.optional) ? this._username :
                <IUriUserInfoComponentSpecNameOnly | IUriUserInfoComponentSpecSupportsPassword>{ name: this._username, password: this._password };
        }

        /**
         * Gets combined host and port number requirements/options for the current URI scheme.
         *
         * @readonly
         * @type {(IUriHostComponentSpecNotSupported | IUriHostComponentSpecNameOnly | IUriHostComponentSpecSupportsPort)}
         * @memberof UriSchemeInfo
         */
        get host(): IUriHostComponentSpecNotSupported | IUriHostComponentSpecNameOnly | IUriHostComponentSpecSupportsPort {
            return (isNaN(this._defaultPort)) ? ((this._hostname == UriComponentSupportOption.notSupported || this._port == UriComponentSupportOption.optional) ? this._hostname :
                <IUriHostComponentSpecNameOnly | IUriHostComponentSpecSupportsPort>{ name: this._hostname, port: this._port }) :
                <IUriHostComponentSpecNameOnly | IUriHostComponentSpecSupportsPort>{ name: this._hostname, port: this._port, defaultPort: this._defaultPort };
        }

        /**
         *  Display text to use in selection controls.
         *
         * @readonly
         * @type {string}
         * @memberof UriSchemeInfo
         */
        get displayText(): string {
            return (this._description.length == 0) ? "\"" + this._name + "\" Schema" : this._description + " (" + this._name + ")";
        }

        /**
         * Creates an instance of UriSchemeInfo.
         * 
         * @param {IAbsoluteUriComponentSpec} spec - URI component support specifications.
         * @param {string} [description] - Describes the URI scheme.
         * @memberof UriSchemeInfo
         */
        constructor(spec: IUriComponentSpec, description?: string) {
            this._description = sys.asString(description);
            this._name = spec.name;
            this._separator = (sys.isNilOrWhiteSpace(spec.separator)) ? "://" : spec.separator;
            if (typeof spec.host === "number") {
                this._hostname = spec.host;
                this._port = (spec.host == UriComponentSupportOption.required) ? UriComponentSupportOption.optional : spec.host;
                this._defaultPort = NaN;
            } else if (typeof spec.host === "object" && spec.host !== null) {
                if (typeof spec.host.name === "number") {
                    if (spec.host.name === UriComponentSupportOption.notSupported) {
                        this._defaultPort = NaN;
                        this._hostname = this._port = spec.host.name;
                    } else {
                        this._hostname = (spec.host.name === UriComponentSupportOption.required) ? UriComponentSupportOption.required : UriComponentSupportOption.optional;
                        if (typeof spec.host.port === "number") {
                            if (spec.host.port === UriComponentSupportOption.notSupported) {
                                this._defaultPort = NaN;
                                this._port = UriComponentSupportOption.notSupported;
                            } else {
                                this._port = (spec.host.port === UriComponentSupportOption.required) ? UriComponentSupportOption.required : UriComponentSupportOption.optional;
                                this._defaultPort = (typeof spec.host.defaultPort === "number") ? spec.host.defaultPort : NaN;
                            }
                        } else {
                            this._defaultPort = (typeof spec.host.defaultPort === "number") ? spec.host.defaultPort : NaN;
                            this._port = UriComponentSupportOption.optional;
                        }
                    }
                } else {
                    this._hostname = UriComponentSupportOption.optional;
                    if (typeof spec.host.port === "number") {
                        if (spec.host.port === UriComponentSupportOption.notSupported) {
                            this._defaultPort = NaN;
                            this._port = UriComponentSupportOption.notSupported;
                        } else {
                            this._port = (spec.host.port === UriComponentSupportOption.required) ? UriComponentSupportOption.required : UriComponentSupportOption.optional;
                            this._defaultPort = (typeof spec.host.defaultPort === "number") ? spec.host.defaultPort : NaN;
                        }
                    } else {
                        this._defaultPort = (typeof spec.host.defaultPort === "number") ? spec.host.defaultPort : NaN;
                        this._port = UriComponentSupportOption.optional;
                    }
                }
            }

            if (typeof spec.userinfo === "number") {
                this._username = (spec.userinfo === UriComponentSupportOption.required || spec.userinfo === UriComponentSupportOption.optional) ? spec.userinfo : UriComponentSupportOption.notSupported;
                this._password = (spec.userinfo == UriComponentSupportOption.notSupported) ? UriComponentSupportOption.notSupported : UriComponentSupportOption.optional;
            } else if (typeof spec.userinfo === "object" && spec.userinfo !== null) {
                if (typeof spec.userinfo.name === "number") {
                    if (spec.userinfo.name === UriComponentSupportOption.notSupported)
                        this._username = this._password = spec.userinfo.name;
                    else {
                        this._username = (spec.userinfo.name === UriComponentSupportOption.required) ? UriComponentSupportOption.required : UriComponentSupportOption.optional;
                        if (typeof spec.userinfo.password === "number") {
                            if (spec.userinfo.password === UriComponentSupportOption.notSupported)
                                this._password = UriComponentSupportOption.notSupported;
                            else
                                this._password = (spec.userinfo.password === UriComponentSupportOption.required) ? UriComponentSupportOption.required : UriComponentSupportOption.optional;
                        } else
                            this._password = UriComponentSupportOption.optional;
                    }
                } else {
                    this._username = UriComponentSupportOption.optional;
                    if (typeof spec.userinfo.password === "number") {
                        if (spec.userinfo.password === UriComponentSupportOption.notSupported)
                            this._password = UriComponentSupportOption.notSupported;
                        else
                            this._password = (spec.userinfo.password === UriComponentSupportOption.required) ? UriComponentSupportOption.required : UriComponentSupportOption.optional;
                    } else
                        this._password = UriComponentSupportOption.optional;
                }
            }
        }

        isEqualTo(value: UriSchemeSpecification): boolean {
            return !sys.isNil(value) && this._name == value._name && this._separator == value._separator && this._path == value._path && this._username == value._username && this._password == value._password &&
                this._hostname == value._hostname && this._port == value._port && this._defaultPort == value._defaultPort && this._query == value._query && this._fragment == value._fragment;
        }

        /**
         * Gets URI scheme specifications for a given uri scheme.
         *
         * @static
         * @param {string} scheme - The URI scheme name.
         * @param {UriSchemeSeparator} [separator] - The URI scheme separator.
         * @returns {UriSchemeSpecification}
         * @memberof UriSchemeInfo
         */
        static getSchemeSpecs(scheme: string, separator?: UriSchemeSeparator): UriSchemeSpecification {
            if (scheme.endsWith(':'))
               scheme = scheme.substr(0, scheme.length - 1);
            let item: UriSchemeSpecification = UriSchemeSpecification.knownSchemes.find((value: UriSchemeSpecification) => value.name === scheme);
            if (typeof item === "undefined")
                return new UriSchemeSpecification({ name: scheme, separator: separator });

            if (typeof separator !== "string" || separator === item.separator)
                return item;
            return new UriSchemeSpecification({ fragment: item.fragment, host: item.host, name: item.name, path: item.path, query: item.query, separator: separator, userinfo: item.userinfo });
        }

        /**
         * File Transfer protocol
         *
         * @static
         * @type {UriSchemeSpecification}
         * @memberof UriSchemeInfo
         */
        static readonly uriScheme_ftp: UriSchemeSpecification = new UriSchemeSpecification({
            name: "ftp", separator: "://", host: { name: UriComponentSupportOption.required, defaultPort: 21 }, path: UriComponentSupportOption.required,
            query: UriComponentSupportOption.notSupported, fragment: UriComponentSupportOption.notSupported
        }, "");

        /**
         * File Transfer protocol (secure)
         *
         * @static
         * @type {UriSchemeSpecification}
         * @memberof UriSchemeInfo
         */
        static readonly uriScheme_ftps: UriSchemeSpecification = new UriSchemeSpecification({
            name: "ftps", host: { name: UriComponentSupportOption.required, defaultPort: 990 },
            query: UriComponentSupportOption.notSupported, fragment: UriComponentSupportOption.notSupported
        }, "File Transfer protocol (secure)");

        /**
         * Secure File Transfer Protocol
         *
         * @static
         * @type {UriSchemeSpecification}
         * @memberof UriSchemeInfo
         */
        static readonly uriScheme_sftp: UriSchemeSpecification = new UriSchemeSpecification({
            name: "sftp", host: { name: UriComponentSupportOption.required, defaultPort: 22 },
            query: UriComponentSupportOption.notSupported, fragment: UriComponentSupportOption.notSupported
        }, "Secure File Transfer Protocol");

        /**
         * Hypertext Transfer Protocol
         *
         * @static
         * @type {UriSchemeSpecification}
         * @memberof UriSchemeInfo
         */
        static readonly uriScheme_http: UriSchemeSpecification = new UriSchemeSpecification({ name: "http", host: { name: UriComponentSupportOption.required, defaultPort: 80 } }, "Hypertext Transfer Protocol");

        /**
         * Hypertext Transfer Protocol (secure)
         *
         * @static
         * @type {UriSchemeSpecification}
         * @memberof UriSchemeInfo
         */
        static readonly uriScheme_https: UriSchemeSpecification = new UriSchemeSpecification({ name: "https", host: { name: UriComponentSupportOption.required, defaultPort: 443 } }, "Hypertext Transfer Protocol (secure)");

        /**
         * Gopher protocol
         *
         * @static
         * @type {UriSchemeSpecification}
         * @memberof UriSchemeInfo
         */
        static readonly uriScheme_gopher: UriSchemeSpecification = new UriSchemeSpecification({ name: "gopher", host: { name: UriComponentSupportOption.required, defaultPort: 70 } }, "Gopher protocol");

        /**
         * Electronic mail address
         *
         * @static
         * @type {UriSchemeSpecification}
         * @memberof UriSchemeInfo
         */
        static readonly uriScheme_mailto: UriSchemeSpecification = new UriSchemeSpecification({
            name: "mailto", separator: ":", host: { name: UriComponentSupportOption.required, port: UriComponentSupportOption.notSupported },
            userinfo: { name: UriComponentSupportOption.required, password: UriComponentSupportOption.notSupported } }, "Electronic mail address");

        /**
         * USENET news
         *
         * @static
         * @type {UriSchemeSpecification}
         * @memberof UriSchemeInfo
         */
        static readonly uriScheme_news: UriSchemeSpecification = new UriSchemeSpecification({ name: "news", host: UriComponentSupportOption.notSupported, separator: ":" }, "USENET news");

        /**
         * USENET news using NNTP access
         *
         * @static
         * @type {UriSchemeSpecification}
         * @memberof UriSchemeInfo
         */
        static readonly uriScheme_nntp: UriSchemeSpecification = new UriSchemeSpecification({ name: "nntp", host: { name: UriComponentSupportOption.required, defaultPort: 119 } }, "USENET news using NNTP access");

        /**
         * Reference to interactive sessions
         *
         * @static
         * @type {UriSchemeSpecification}
         * @memberof UriSchemeInfo
         */
        static readonly uriScheme_telnet: UriSchemeSpecification = new UriSchemeSpecification({
            name: "telnet", path: UriComponentSupportOption.notSupported, query: UriComponentSupportOption.notSupported, fragment: UriComponentSupportOption.notSupported,
            userinfo: UriComponentSupportOption.notSupported, host: { name: UriComponentSupportOption.required, defaultPort: 23 } }, "Reference to interactive sessions");

        /**
         * Wide Area Information Servers
         *
         * @static
         * @type {UriSchemeSpecification}
         * @memberof UriSchemeInfo
         */
        static readonly uriScheme_wais: UriSchemeSpecification = new UriSchemeSpecification({ name: "wais", host: { name: UriComponentSupportOption.required, defaultPort: 443 } }, "Wide Area Information Servers");

        /**
         * Host-specific file names
         *
         * @static
         * @type {UriSchemeSpecification}
         * @memberof UriSchemeInfo
         */
        static readonly uriScheme_file: UriSchemeSpecification = new UriSchemeSpecification({
            name: "file",
            query: UriComponentSupportOption.notSupported, fragment: UriComponentSupportOption.notSupported, userinfo: UriComponentSupportOption.notSupported,
            host: { name: UriComponentSupportOption.optional, port: UriComponentSupportOption.notSupported }
        }, "Host-specific file names");

        /**
         * Net Pipe
         *
         * @static
         * @type {UriSchemeSpecification}
         * @memberof UriSchemeInfo
         */
        static readonly uriScheme_netPipe: UriSchemeSpecification = new UriSchemeSpecification({ name: "net.pipe", host: { name: UriComponentSupportOption.required, port: UriComponentSupportOption.notSupported } }, "Net Pipe");

        /**
         * Net-TCP
         *
         * @static
         * @type {UriSchemeSpecification}
         * @memberof UriSchemeInfo
         */
        static readonly uriScheme_netTcp: UriSchemeSpecification = new UriSchemeSpecification({ name: "net.tcp", host: { name: UriComponentSupportOption.required, defaultPort: 808 } }, "Net-TCP");

        /**
         * Lightweight Directory Access Protocol
         *
         * @static
         * @type {UriSchemeSpecification}
         * @memberof UriSchemeInfo
         */
        static readonly uriScheme_ldap: UriSchemeSpecification = new UriSchemeSpecification({ name: "ldap", host: { name: UriComponentSupportOption.required, defaultPort: 389 } }, "Lightweight Directory Access Protocol");

        /**
         * Secure Shell
         *
         * @static
         * @type {UriSchemeSpecification}
         * @memberof UriSchemeInfo
         */
        static readonly uriScheme_ssh: UriSchemeSpecification = new UriSchemeSpecification({ name: "ssh", host: { name: UriComponentSupportOption.required, defaultPort: 22 } }, "Secure Shell");

        /**
         * GIT Respository
         *
         * @static
         * @type {UriSchemeSpecification}
         * @memberof UriSchemeInfo
         */
        static readonly uriScheme_git: UriSchemeSpecification = new UriSchemeSpecification({ name: "git", query: UriComponentSupportOption.notSupported, fragment: UriComponentSupportOption.notSupported, host: { name: UriComponentSupportOption.required, defaultPort: 9418 } }, "GIT Respository");

        /**
         * Telephone Number
         *
         * @static
         * @type {UriSchemeSpecification}
         * @memberof UriSchemeInfo
         */
        static readonly uriScheme_tel: UriSchemeSpecification = new UriSchemeSpecification({
            name: "tel", separator: ":", host: UriComponentSupportOption.required, path: UriComponentSupportOption.notSupported,
            fragment: UriComponentSupportOption.notSupported, query: UriComponentSupportOption.notSupported
        }, "Telephone Number");

        /**
         * Uniform Resource notation
         *
         * @static
         * @type {UriSchemeSpecification}
         * @memberof UriSchemeInfo
         */
        static readonly uriScheme_urn: UriSchemeSpecification = new UriSchemeSpecification({ name: "urn", host: UriComponentSupportOption.notSupported, separator: ":" }, "Uniform Resource notation");

        private static readonly _knownSchemes: ReadonlyArray<UriSchemeSpecification> = [
            UriSchemeSpecification.uriScheme_https,
            UriSchemeSpecification.uriScheme_http,
            UriSchemeSpecification.uriScheme_ssh,
            UriSchemeSpecification.uriScheme_file,
            UriSchemeSpecification.uriScheme_ldap,
            UriSchemeSpecification.uriScheme_wais,
            UriSchemeSpecification.uriScheme_git,
            UriSchemeSpecification.uriScheme_mailto,
            UriSchemeSpecification.uriScheme_netPipe,
            UriSchemeSpecification.uriScheme_netTcp,
            UriSchemeSpecification.uriScheme_sftp,
            UriSchemeSpecification.uriScheme_ftps,
            UriSchemeSpecification.uriScheme_ftp,
            UriSchemeSpecification.uriScheme_gopher,
            UriSchemeSpecification.uriScheme_news,
            UriSchemeSpecification.uriScheme_nntp,
            UriSchemeSpecification.uriScheme_telnet,
            UriSchemeSpecification.uriScheme_tel,
            UriSchemeSpecification.uriScheme_urn
        ];

        /**
         * Gets an array of known URI scheme specifications.
         *
         * @static
         * @type {ReadonlyArray<UriSchemeSpecification>}
         * @memberof UriSchemeInfo
         */
        static get knownSchemes(): ReadonlyArray<UriSchemeSpecification> { return UriSchemeSpecification._knownSchemes; }
    }    

    // #endregion

    // #region ComponentChangeManager

    interface IControllerComponentChangeCallback<TComponent extends Number, TController extends ng.IController> { (component: TComponent, value: string, uriBuilder: TController): void }
    interface IComponentChangeLink {
        next?: IComponentChangeLink;
        previous?: IComponentChangeLink;
    }
    interface IComponentChangeCallback<TComponent extends Number> { (component: TComponent, value: string): void; }
    class ComponentChangeManager<TComponent extends Number> {
        private _changes: [TComponent, string][] = [];
        private _first: IComponentChangeLink | undefined;
        private _last: IComponentChangeLink | undefined;
        get isChanging(): boolean { return (typeof this._last !== "undefined"); }
        constructor(private callback: IComponentChangeCallback<TComponent>, private thisArg?: any) { }
        raiseChange(component: TComponent, value: string): boolean {
            if (typeof this._last === "undefined") {
                this.callback(component, value);
                return true;
            }

            let changes: [TComponent, string][] = this._changes.filter((value: [TComponent, string]) => value[0] === component);
            if (changes.length > 0)
                changes[0][1] = value;
            else
                this._changes.push([component, value]);
            return false;
        }
        doChange(func: Function, thisArg?: any) {
            let item: IComponentChangeLink;
            if (typeof (this._last = item = { previous: this._last }).previous === "undefined")
                this._first = this._last;
            try {
                if (arguments.length > 1)
                    func.call(thisArg);
                else
                    func();
            } finally {
                if (typeof item.next === "undefined") {
                    if (typeof (this._last = item.previous) === "undefined")
                        this._first = undefined;
                    else
                        item.previous.next = undefined;
                } else if (typeof (item.next.previous = item.previous) === "undefined")
                    this._first = item.next;
                else
                    item.previous.next = item.next;
                if (typeof this._last === "undefined" && this._changes.length > 0) {
                    let changes: [TComponent, string][] = this._changes;
                    this._changes = [];
                    changes.forEach((c: [TComponent, string]) => this.callback.apply(this.thisArg, c));
                }
            }
        }
        getChange<T>(func: { (): T; }, thisArg?: any) {
            let item: IComponentChangeLink;
            let result: T;
            if (typeof (this._last = item = { previous: this._last }).previous === "undefined")
                this._first = this._last;
            try {
                if (arguments.length > 1)
                    result = func.call(thisArg);
                else
                    result = func();
            } finally {
                if (typeof item.next === "undefined") {
                    if (typeof (this._last = item.previous) === "undefined")
                        this._first = undefined;
                    else
                        item.previous.next = undefined;
                } else if (typeof (item.next.previous = item.previous) === "undefined")
                    this._first = item.next;
                else
                    item.previous.next = item.next;
                if (typeof this._last === "undefined" && this._changes.length > 0) {
                    let changes: [TComponent, string][] = this._changes;
                    this._changes = [];
                    changes.forEach((c: [TComponent, string]) => this.callback.apply(this.thisArg, c));
                }
            }
            return result;
        }
    }

    // #endregion

    // #region uri-builder-scheme directive

    export const DIRECTIVENAME_uriBuilderScheme: string = "uriBuilderScheme";

    interface IUriBuilderSchemeScope extends IUriBuilderOriginScope {
        noPasswordClass?: string;
        allowsPasswordClass?: string;
        class: string[];
        scheme: UriBuilderSchemeController;
    }

    class UriBuilderSchemeController implements ng.IController {
        private static readonly _schemeOptions: IUriSchemeOption[] = (<ReadonlyArray<IUriSchemeOption>>UriSchemeSpecification.knownSchemes).concat(<IUriSchemeOption>{ name: "", displayText: "(other)" });
        private static readonly _separatorOptions: UriSchemeSeparator[] = ["://", ":", ":/"];
        private _selectedScheme: string;
        private _otherSchemeName: string = "";
        private _selectedSeparator: UriSchemeSeparator;

        // #region Properties

        get schemeOptions(): IUriSchemeOption[] { return UriBuilderSchemeController._schemeOptions; }

        get separatorOptions(): UriSchemeSeparator[] { return UriBuilderSchemeController._separatorOptions; }
        
        get selectedScheme(): string { return this._selectedScheme; }
        set selectedScheme(value: string) {
            if (this._selectedScheme === (value = sys.asString(value)))
                return;
            if (value.length > 0)
                this.$scope.uriBuilder.schemeSpecs = UriSchemeSpecification.getSchemeSpecs(value);
            else if (this._otherSchemeName.length > 0)
                this.$scope.uriBuilder.schemeSpecs = UriSchemeSpecification.getSchemeSpecs(this._otherSchemeName, this._selectedSeparator);
        }

        get otherSchemeName(): string { return this._otherSchemeName; }
        set otherSchemeName(value: string) {
            if (this._otherSchemeName === (value = sys.asString(value)))
                return;
            this._otherSchemeName = value;
            if (this._selectedScheme.length == 0 && value.length > 0)
                this.$scope.uriBuilder.schemeSpecs = UriSchemeSpecification.getSchemeSpecs(value, this._selectedSeparator);
        }

        // #endregion

        constructor(private readonly $scope: IUriBuilderSchemeScope) { }

        // #region Methods

        $onInit(): void { }
        
        static createDirective(): ng.IDirective {
            return {
                require: "^^" + DIRECTIVENAME_uriBuilderOrigin,
                restrict: "E",
                controllerAs: "scheme",
                controller: ["$scope", UriBuilderSchemeController],
                transclude: true,
                template: '<ng-transclude></ng-transclude>',
                link: (scope: IUriBuilderSchemeScope, element: JQuery, instanceAttributes: ng.IAttributes, originBuilder: UriBuilderOriginController) => {
                    scope.originBuilder = originBuilder;
                    originBuilder.onComponentChange(scope.scheme, scope.scheme.onSchemeComponentChange, UriBuilderComponentChangeArg.scheme);
                    let schemeController: UriBuilderSchemeController = scope.scheme;
                    let schemeSpecs: UriSchemeSpecification = originBuilder.uriBuilder.schemeSpecs;
                    let selectedSpecs: UriSchemeSpecification | undefined = UriSchemeSpecification.knownSchemes.find((value: UriSchemeSpecification) => value.name === schemeSpecs.name && value.separator === schemeSpecs.separator);
                    if (sys.isNil(selectedSpecs)) {
                        schemeController._selectedScheme = "";
                        schemeController._selectedSeparator = schemeSpecs.separator;
                        schemeController._otherSchemeName = schemeSpecs.name;
                    } else
                        schemeController._selectedScheme = schemeSpecs.name;
                    schemeController._selectedSeparator = schemeSpecs.separator;
                }
            };
        }

        private onSchemeComponentChange(component: UriBuilderComponentChangeArg, value: string | undefined, uriBuilder: UriBuilderOriginController): void {
            let schemeController: UriBuilderSchemeController = this.$scope.scheme;
            let schemeSpecs: UriSchemeSpecification = this.$scope.uriBuilder.schemeSpecs;
            if (this._selectedScheme.length == 0) {
                if (schemeSpecs.name === this._otherSchemeName && schemeSpecs.separator === this._selectedSeparator)
                    return;
            } else if (schemeSpecs.name === this._selectedScheme && schemeSpecs.separator === this._selectedSeparator)
                return;
            let selectedSpecs: UriSchemeSpecification | undefined = UriSchemeSpecification.knownSchemes.find((value: UriSchemeSpecification) => value.name === schemeSpecs.name && value.separator === schemeSpecs.separator);
            if (sys.isNil(selectedSpecs)) {
                schemeController._selectedScheme = "";
                schemeController._selectedSeparator = schemeSpecs.separator;
                schemeController._otherSchemeName = schemeSpecs.name;
            } else
                schemeController._selectedScheme = schemeSpecs.name;
            schemeController._selectedSeparator = schemeSpecs.separator;
        }

        static detectScheme(uriString: string, uriBuilder: UriBuilderController): UriSchemeSpecification | undefined { return getUriSchemeInfo(uriString); }

        // #endregion
    }

    app.mainModule.directive(DIRECTIVENAME_uriBuilderScheme, UriBuilderSchemeController.createDirective);

    // #endregion

    // #region uri-builder-userinfo directive

    export const DIRECTIVENAME_uriBuilderUserInfo: string = "uriBuilderUserInfo";

    export interface IUriBuilderUserInfoAttributes extends ng.IAttributes {
        noPasswordClass?: string;
        allowsPasswordClass?: string;
    }

    interface IUriBuilderUserInfoScope extends IUriBuilderOriginScope {
        noPasswordClass?: string;
        allowsPasswordClass?: string;
        class: string[];
        userInfo: UriBuilderUserInfoController;
    }

    class UriBuilderUserInfoController implements ng.IController {
        // #region Properties

        // #endregion

        constructor(private readonly $scope: IUriBuilderUserInfoScope) { }

        // #region Methods

        $onInit(): void { }

        static createDirective(): ng.IDirective {
            return {
                require: "^^" + DIRECTIVENAME_uriBuilderOrigin,
                restrict: "E",
                controllerAs: "userInfo",
                controller: ["$scope", UriBuilderUserInfoController],
                transclude: true,
                template: '<ng-transclude></ng-transclude>',
                link: (scope: IUriBuilderUserInfoScope, element: JQuery, instanceAttributes: IUriBuilderUserInfoAttributes, originBuilder: UriBuilderOriginController) => {
                    scope.originBuilder = originBuilder;
                    let userInfoController: UriBuilderUserInfoController = scope.userInfo;
                    originBuilder.onComponentChange(userInfoController, userInfoController.onSchemeComponentChange, UriBuilderComponentChangeArg.scheme);
                    originBuilder.onComponentChange(userInfoController, userInfoController.onUserInfoComponentChange, UriBuilderComponentChangeArg.userinfo);
                }
            };
        }

        private onSchemeComponentChange(component: UriBuilderComponentChangeArg, value: string | undefined, originBuilder: UriBuilderOriginController): void {
        }

        private onUserInfoComponentChange(component: UriBuilderComponentChangeArg, value: string | undefined, originBuilder: UriBuilderOriginController): void {
        }

        // #endregion
    }

    app.mainModule.directive(DIRECTIVENAME_uriBuilderUserInfo, UriBuilderUserInfoController.createDirective);

    // #endregion

    // #region uri-builder-host directive

    export const DIRECTIVENAME_uriBuilderHost: string = "uriBuilderHost";

    export interface IUriBuilderHostAttributes extends ng.IAttributes {
        noPortClass?: string;
        allowsPortClass?: string;
    }

    interface IUriBuilderHostScope extends IUriBuilderOriginScope {
        noPortClass?: string;
        allowsPortClass?: string;
        class: string[];
        host: UriBuilderHostController;
    }

    class UriBuilderHostController implements ng.IController {
        private _notSupported: boolean = false;
        private _hostRequired: boolean = false;
        private _name: string = "";
        private _previousName: string = "";
        private _hasName: boolean = true;
        private _portNotSupported: boolean = false;
        private _portRequired: boolean = false;
        private _portNumber: string = "";
        private _previousPort: string = "";
        private _hasPortNumber: boolean = false;
        private _defaultPort: number = NaN;
        private _noPortClass: string[] = [];
        private _allowsPortClass: string[] = [];

        // #region Properties

        get notSupported(): boolean { return this._notSupported; }

        get portNotSupported(): boolean { return this._portNotSupported; }

        get required(): boolean { return this._hostRequired; }

        get notOptional(): boolean { return this._hostRequired || this._notSupported; }

        get portRequired(): boolean { return this._portRequired; }
        
        get name(): string { return this._name; }
        set name(value: string) {
            if (this._name === (value = sys.asString(value)))
                return;
            this._name = this._previousName = value;
            if (!this._hasName) {
                if (value.length == 0)
                    return;
                this._hasName = true;
            }
            if (this._hasPortNumber)
                this.$scope.originBuilder.encodedHostName = this._name + ":" + this._portNumber;
            else
                this.$scope.originBuilder.encodedHostName = this._name;
        }

        get hasName(): boolean { return this._hasName; }
        set hasName(value: boolean) {
            if (this._hasName === (value = sys.asBoolean(value)))
                return;
            this._hasName = value;
            if (value) {
                this._name = this._previousName;
                if (this._hasPortNumber)
                    this.$scope.originBuilder.encodedHostName = this._name + ":" + this._portNumber;
                else
                    this.$scope.originBuilder.encodedHostName = this._name;
            } else {
                this._previousName = this._name;
                this._name = "";
                this.$scope.originBuilder.encodedHostName = null;
            }
        }

        get noName(): boolean { return !this._hasName; }

        get portNumber(): string { return this._portNumber; }
        set portNumber(value: string) {
            if (this._portNumber === (value = sys.asString(value)))
                return;
            this._portNumber = this._previousPort = value;
            if (!this._hasPortNumber) {
                if (value.length == 0)
                    return;
                this._hasPortNumber = true;
            }
            if (this._hasPortNumber)
                this.$scope.originBuilder.encodedHostName = this._portNumber + ":" + this._portNumber;
            else
                this.$scope.originBuilder.encodedHostName = (this._hasName) ? this._name : null;
        }

        get hasPortNumber(): boolean { return this._hasPortNumber; }
        set hasPortNumber(value: boolean) {
            if (this._hasPortNumber === (value = sys.asBoolean(value)))
                return;
            this._hasPortNumber = value;
            if (value) {
                this._portNumber = this._previousPort;
                if (this._hasPortNumber)
                    this.$scope.originBuilder.encodedHostName = this._name + ":" + this._portNumber;
                else
                    this.$scope.originBuilder.encodedHostName = this._name;
            } else {
                this._previousPort = this._portNumber;
                this._portNumber = "";
                this.$scope.originBuilder.encodedHostName = (this._hasName) ? this._name : null;
            }
        }

        get noPortNumber(): boolean { return !this._hasPortNumber; }

        // #endregion

        // #region Methods

        constructor(private readonly $scope: IUriBuilderHostScope) { }

        $onInit(): void { }

        static createDirective(): ng.IDirective {
            return {
                require: "^^" + DIRECTIVENAME_uriBuilderOrigin,
                restrict: "E",
                controllerAs: "host",
                controller: ["$scope", UriBuilderHostController],
                transclude: true,
                template: '<ng-transclude></ng-transclude>',
                scope: { noPortClass: "@?", allowsPortClass: "@?" },
                link: (scope: IUriBuilderHostScope, element: JQuery, attr: IUriBuilderHostAttributes, originBuilder: UriBuilderOriginController) => {
                    scope.originBuilder = originBuilder;
                    scope.class = [];
                    let hostController: UriBuilderHostController = scope.host;
                    originBuilder.onComponentChange(hostController, hostController.onSchemeComponentChange, UriBuilderComponentChangeArg.scheme);
                    originBuilder.onComponentChange(hostController, hostController.onHostComponentChange, UriBuilderComponentChangeArg.host);
                    let s: string = sys.asString(scope.noPortClass).trim();
                    if (s.length > 0)
                        hostController._noPortClass = s.split('/\s+');
                    s = sys.asString(scope.allowsPortClass).trim();
                    if (s.length > 0)
                        hostController._allowsPortClass = s.split('/\s+');
                    let scheme: UriSchemeSpecification = scope.originBuilder.uriBuilder.schemeSpecs;
                    hostController.updateScheme(scheme);
                    if (scheme.host == UriComponentSupportOption.notSupported) {
                        hostController._name = hostController._previousName = hostController._portNumber = hostController._previousPort = "";
                        return;
                    }
                    let value: string = originBuilder.encodedHostName;
                    if (typeof value === "string") {
                        hostController._hasName = true;
                        if (scheme.password === UriComponentSupportOption.notSupported)
                            hostController._name = hostController._previousName = value;
                        else {
                            let index: number = value.indexOf(":");
                            if (index < 0) {
                                hostController._name = hostController._previousName = value;
                                hostController._portNumber = hostController._previousPort = "";
                                hostController._hasPortNumber = false;
                            } else {
                                hostController._name = hostController._previousName = value.substr(0, index);
                                hostController._portNumber = hostController._previousPort = value.substr(index + 1);
                                hostController._hasPortNumber = true;
                            }
                        }
                    } else {
                        if (scheme.host !== UriComponentSupportOption.required) {
                            if (hostController._hasName)
                                hostController._previousName = hostController._name;
                            if (hostController._hasPortNumber)
                                hostController._previousPort = hostController._portNumber;
                            hostController._hasName = hostController._hasPortNumber = false;
                        }
                        hostController._name = "";
                    }
                }
            };
        }
        private onSchemeComponentChange(component: UriBuilderComponentChangeArg, value: string | undefined, originBuilder: UriBuilderOriginController): void { this.updateScheme(originBuilder.uriBuilder.schemeSpecs); }

        private updateScheme(scheme: UriSchemeSpecification) {
            if (this._hasName)
                this._previousName = this._name;
            if (this._hasPortNumber)
                this._previousPort = this._portNumber;
            if (scheme.host === UriComponentSupportOption.notSupported) {
                this._defaultPort = NaN;
                this._hasName = this._hasPortNumber = this._hostRequired = this._portRequired = false;
                this._notSupported = this._portNotSupported = true;
                this._name = this._portNumber = "";
            } else {
                this._notSupported = false;
                this._previousName = this._name;
                if (scheme.host == UriComponentSupportOption.required) {
                    if (!this._hasName)
                        this._name = this._previousName;
                    this._hasName = this._hostRequired = true;
                }
                else
                    this._hostRequired = false;
                if (scheme.port === UriComponentSupportOption.notSupported) {
                    this._defaultPort = NaN;
                    this._hasPortNumber = this._portRequired = false;
                    this._portNotSupported = true;
                    this._portNumber = "";
                } else {
                    this._portNotSupported = true;
                    this._previousPort = this._portNumber;
                    if (scheme.port == UriComponentSupportOption.required) {
                        this._portRequired = true;
                        if (!this._hasPortNumber && this._hasName)
                            this._portNumber = this._previousPort;
                        this._hasPortNumber = this._hasName;
                    } else
                        this._hostRequired = false;
                }
            }
        }

        private onHostComponentChange(component: UriBuilderComponentChangeArg, value: string | undefined, originBuilder: UriBuilderOriginController): void {
            let scheme: UriSchemeSpecification = this.$scope.originBuilder.uriBuilder.schemeSpecs;
            if (scheme.host == UriComponentSupportOption.notSupported)
                return;
            if (typeof value === "string") {
                this._hasName = true;
                if (scheme.password === UriComponentSupportOption.notSupported)
                    this._name = this._previousName = value;
                else {
                    let index: number = value.indexOf(":");
                    if (index < 0) {
                        this._name = this._previousName = value;
                        this._portNumber = this._previousPort = "";
                        this._hasPortNumber = false;
                    } else {
                        this._name = this._previousName = value.substr(0, index);
                        this._portNumber = this._previousPort = value.substr(index + 1);
                        this._hasPortNumber = true;
                    }
                }
            } else {
                if (scheme.host !== UriComponentSupportOption.required) {
                    if (this._hasName)
                        this._previousName = this._name;
                    if (this._hasPortNumber)
                        this._previousPort = this._portNumber;
                    this._hasName = this._hasPortNumber = false;
                }
                this._name = "";
            }
        }

        // #endregion
    }
    
    app.mainModule.directive(DIRECTIVENAME_uriBuilderHost, UriBuilderHostController.createDirective);

    // #endregion noPortClass="" allowsPortClass

    // #region uri-builder-path directive

    export const DIRECTIVENAME_uriBuilderPath: string = "uriBuilderPath";

    interface IUriPathBuilderScope extends IUriBuilderScope { pathBuilder: UriBuilderQueryController; }

    class UriBuilderPathController implements ng.IController {
        // #region Properties

        // #endregion

        constructor(private readonly $scope: IUriPathBuilderScope) { }

        // #region Methods

        $onInit(): void { }

        static createDirective(): ng.IDirective {
            return {
                require: "^^" + DIRECTIVENAME_uriBuilder,
                restrict: "E",
                controllerAs: "pathBuilder",
                controller: ["$scope", UriBuilderPathController],
                transclude: true,
                template: '<ng-transclude></ng-transclude>',
                link: (scope: IUriPathBuilderScope, element: JQuery, attr: ng.IAttributes, controller: UriBuilderController) => {
                    scope.uriBuilder = controller;
                    controller.onIsEditingEncodedUriStringChanged((isEditingEncodedUriString: boolean, encodedUriString: string) => {
                        if (isEditingEncodedUriString)
                            element.hide();
                        else if (controller.isAbsoluteUri)
                            element.show();
                    });
                    controller.onIsAbsoluteUriChanged((isAbsoluteUri: boolean, isEditingEncodedUriString: boolean) => {
                        if (!isEditingEncodedUriString)
                            return;
                        if (isAbsoluteUri)
                            element.show();
                        else
                            element.hide();
                    });
                }
            };
        }

        // #endregion
    }

    app.mainModule.directive(DIRECTIVENAME_uriBuilderPath, UriBuilderPathController.createDirective);

    // #endregion

    // #region uri-builder-query directive

    export const DIRECTIVENAME_uriBuilderQuery: string = "uriBuilderQuery";

    interface IUriQueryBuilderScope extends IUriBuilderScope { queryBuilder: UriBuilderQueryController; }

    class UriBuilderQueryController implements ng.IController {
        // #region Properties

        // #endregion

        constructor(private readonly $scope: IUriQueryBuilderScope) { }

        // #region Methods

        $onInit() { }

        static parseQuery(uriString: string, uriBuilder: UriBuilderController): string {
            let index: number = uriString.indexOf("?");
            if (index >= 0) {
                uriBuilder.encodedQueryString = uriString.substr(index + 1);
                return uriString.substr(0, index);
            }

            if (uriBuilder.schemeSpecs.query === UriComponentSupportOption.required)
                uriBuilder.encodedQueryString = "";
            else
                uriBuilder.encodedQueryString = null;
            return uriString;
        }

        static createDirective(): ng.IDirective {
            return {
                require: "^^" + DIRECTIVENAME_uriBuilder,
                restrict: "E",
                controllerAs: "queryBuilder",
                controller: ["$scope", UriBuilderQueryController],
                transclude: true,
                template: '<ng-transclude></ng-transclude>',
                link: (scope: IUriQueryBuilderScope, element: JQuery, instanceAttributes: ng.IAttributes, controller: UriBuilderController) => {
                    scope.uriBuilder = controller;
                    controller.onIsEditingEncodedUriStringChanged((isEditingEncodedUriString: boolean, encodedUriString: string) => {
                        if (isEditingEncodedUriString)
                            element.hide();
                        else if (controller.isAbsoluteUri)
                            element.show();
                    });
                    controller.onIsAbsoluteUriChanged((isAbsoluteUri: boolean, isEditingEncodedUriString: boolean) => {
                        if (!isEditingEncodedUriString)
                            return;
                        if (isAbsoluteUri)
                            element.show();
                        else
                            element.hide();
                    });
                }
            };
        }

        // #endregion
    }

    app.mainModule.directive(DIRECTIVENAME_uriBuilderQuery, UriBuilderQueryController.createDirective);

    // #endregion

    // #region uri-builder-fragment directive

    export const DIRECTIVENAME_uriBuilderFragment: string = "uriBuilderFragment";
    
    interface IUriBuilderFragmentScope extends IUriBuilderScope { fragmentBuilder: UriBuilderFragmentController; }

    class UriBuilderFragmentController implements ng.IController {
        // #region Properties

        // #endregion

        constructor(private readonly $scope: IUriBuilderFragmentScope) { }

        // #region Methods

        $onInit(): void { }

        static parseFragment(uriString: string, uriBuilder: UriBuilderController): string {
            let index: number = uriString.indexOf("#");
            if (index >= 0) {
                uriBuilder.encodedFragment = uriString.substr(index + 1);
                return uriString.substr(0, index);
            }
            if (uriBuilder.schemeSpecs.fragment === UriComponentSupportOption.required)
                uriBuilder.encodedFragment = "";
            else
                uriBuilder.encodedFragment = null;
            return uriString;
        }

        static createDirective(): ng.IDirective {
            return {
                require: "^^" + DIRECTIVENAME_uriBuilder,
                restrict: "E",
                controllerAs: "fragmentBuilder",
                controller: ["$scope", UriBuilderFragmentController],
                transclude: true,
                template: '<ng-transclude></ng-transclude>',
                link: (scope: IUriBuilderFragmentScope, element: JQuery, instanceAttributes: ng.IAttributes, uriBuilder: UriBuilderController) => {
                    scope.uriBuilder = uriBuilder;
                    uriBuilder.onIsEditingEncodedUriStringChanged((isEditingEncodedUriString: boolean, encodedUriString: string) => {
                        if (isEditingEncodedUriString)
                            element.hide();
                        else if (uriBuilder.isAbsoluteUri)
                            element.show();
                    });
                    uriBuilder.onIsAbsoluteUriChanged((isAbsoluteUri: boolean, isEditingEncodedUriString: boolean) => {
                        if (!isEditingEncodedUriString)
                            return;
                        if (isAbsoluteUri)
                            element.show();
                        else
                            element.hide();
                    });
                }
            };
        }

        // #endregion
    }

    app.mainModule.directive(DIRECTIVENAME_uriBuilderFragment, UriBuilderFragmentController.createDirective);

    // #endregion

    // #region uri-builder-origin directive

    export const DIRECTIVENAME_uriBuilderOrigin: string = "uriBuilderOrigin";

    interface IUriBuilderOriginScope extends IUriBuilderScope { originBuilder: UriBuilderOriginController; }

    class UriBuilderOriginController implements ng.IController {
        private readonly _changeManager: ComponentChangeManager<UriBuilderComponentChangeArg>;
        private _onEncodedComponentChanged: [UriBuilderComponentChangeArg, IControllerComponentChangeCallback<UriBuilderComponentChangeArg, UriBuilderOriginController>, any][] = [];
        private _encodedUserName: string | null = null;
        private _encodedPassword: string | null = null;
        private _encodedHostName: string | null = "";
        private _encodedPortNumber: string | null = null;

        // #region properties

        get encodedUserName(): string | null { return this._encodedUserName; }
        set encodedUserName(value: string | null) {
            if (this._encodedUserName === (value = sys.asStringOrNull(value)))
                return;
            this._encodedUserName = value;
            this.$scope.uriBuilder.encodedUserInfo = (typeof this._encodedUserName !== "string" || this._encodedPassword !== "string") ? this._encodedUserName : this._encodedUserName + ":" + this._encodedPassword;
            this._changeManager.raiseChange(UriBuilderComponentChangeArg.username, value);
        }

        get encodedPassword(): string | null { return this._encodedPassword; }
        set encodedPassword(value: string | null) {
            if (this._encodedPassword === (value = sys.asStringOrNull(value)))
                return;
            this._encodedPassword = value;
            this.$scope.uriBuilder.encodedUserInfo = (typeof this._encodedUserName !== "string" || this._encodedPassword !== "string") ? this._encodedUserName : this._encodedUserName + ":" + this._encodedPassword;
            this._changeManager.raiseChange(UriBuilderComponentChangeArg.password, value);
        }

        get encodedHostName(): string | null { return this._encodedHostName; }
        set encodedHostName(value: string | null) {
            if (this._encodedHostName === (value = sys.asStringOrNull(value)))
                return;
            this._encodedHostName = value;
            this.$scope.uriBuilder.encodedHost = (typeof this._encodedHostName !== "string" || this._encodedPortNumber !== "string") ? this._encodedHostName : this._encodedHostName + ":" + this._encodedPortNumber;
            this._changeManager.raiseChange(UriBuilderComponentChangeArg.hostname, value);
        }

        get encodedPortNumber(): string | null { return this._encodedPortNumber; }
        set encodedPortNumber(value: string | null) {
            if (this._encodedPortNumber === (value = sys.asStringOrNull(value)))
                return;
            this._encodedPortNumber = value;
            this.$scope.uriBuilder.encodedHost = (typeof this._encodedHostName !== "string" || this._encodedPortNumber !== "string") ? this._encodedHostName : this._encodedHostName + ":" + this._encodedPortNumber;
            this._changeManager.raiseChange(UriBuilderComponentChangeArg.port, value);
        }

        get uriBuilder(): UriBuilderController { return this.$scope.uriBuilder; }

        // #endregion

        constructor(private readonly $scope: IUriBuilderOriginScope, $log: ng.ILogService) {
            this._changeManager = new ComponentChangeManager<UriBuilderComponentChangeArg>((component: UriBuilderComponentChangeArg, value: string) => {
                this._onEncodedComponentChanged.filter((v: [UriBuilderComponentChangeArg, IControllerComponentChangeCallback<UriBuilderComponentChangeArg, UriBuilderOriginController>, any]) => v[0] === component)
                    .forEach((v: [UriBuilderComponentChangeArg, IControllerComponentChangeCallback<UriBuilderComponentChangeArg, UriBuilderOriginController>, any]) => v[1].call(v[2], component, value, this));
            }, this);
        }
        
        // #region Methods

        static createDirective(): ng.IDirective {
            return {
                require: "^^" + DIRECTIVENAME_uriBuilder,
                restrict: "E",
                controllerAs: "originBuilder",
                controller: ["$scope", "$log", UriBuilderOriginController],
                transclude: true,
                template: '<ng-transclude></ng-transclude>',
                link: (scope: IUriBuilderOriginScope, element: JQuery, instanceAttributes: ng.IAttributes, uriBuilder: UriBuilderController) => {
                    scope.uriBuilder = uriBuilder;
                    uriBuilder.onIsEditingEncodedUriStringChanged((isEditingEncodedUriString: boolean, encodedUriString: string) => {
                        if (isEditingEncodedUriString)
                            element.hide();
                        else if (uriBuilder.isAbsoluteUri)
                            element.show();
                    });
                    uriBuilder.onIsAbsoluteUriChanged((isAbsoluteUri: boolean, isEditingEncodedUriString: boolean) => {
                        if (!isEditingEncodedUriString)
                            return;
                        if (isAbsoluteUri)
                            element.show();
                        else
                            element.hide();
                    });
                    let originBuilder: UriBuilderOriginController = scope.originBuilder;
                    uriBuilder.onComponentChange(originBuilder, originBuilder.onSchemeComponentChange, UriBuilderComponentChangeArg.scheme);
                    uriBuilder.onComponentChange(originBuilder, originBuilder.onUserInfoComponentChange, UriBuilderComponentChangeArg.userinfo);
                    uriBuilder.onComponentChange(originBuilder, originBuilder.onHostComponentChange, UriBuilderComponentChangeArg.host);
                    uriBuilder.onIsEditingEncodedUriStringChanged((isEditingEncodedUriString: boolean, encodedUriString: string) =>
                        originBuilder.onIsEditingEncodedUriStringChanged(isEditingEncodedUriString, encodedUriString));
                    uriBuilder.onIsAbsoluteUriChanged((isAbsoluteUri: boolean, isEditingEncodedUriString: boolean) => originBuilder.onIsAbsoluteUriChanged(isAbsoluteUri, isEditingEncodedUriString));
                }
            };
        }

        $onInit(): void { }

        onComponentChange(thisArg: any, callback: IControllerComponentChangeCallback<UriBuilderComponentChangeArg, UriBuilderOriginController>, ...component: UriBuilderComponentChangeArg[]): void {
            component.forEach((c: UriBuilderComponentChangeArg) => {
                let arr: [UriBuilderComponentChangeArg, IControllerComponentChangeCallback<UriBuilderComponentChangeArg, UriBuilderOriginController>, any][] = this._onEncodedComponentChanged.filter((v: [UriBuilderComponentChangeArg, IControllerComponentChangeCallback<UriBuilderComponentChangeArg, UriBuilderOriginController>, any]) => v[0] === c);
                if (arr.length > 0) {
                    arr[0][1] = sys.chainCallback<UriBuilderComponentChangeArg, string, UriBuilderOriginController>(arr[0][1], callback);
                    arr[0][2] = thisArg;
                }
                else if (typeof callback === "function")
                    this._onEncodedComponentChanged.push([c, callback, thisArg]);
            });
        }

        static parseOrigin(uriString: string, uriBuilder: UriBuilderController): string {
            if (uriBuilder.isRelativeUri) {
                uriBuilder.encodedUserInfo = uriBuilder.encodedHost = null;
                return uriString;
            }
            let s: string = uriBuilder.schemeSpecs.name + uriBuilder.schemeSpecs.separator;
            if (uriString.startsWith(s))
                uriString = uriString.substr(s.length);
            let m: RegExpExecArray;
            if (uriBuilder.schemeSpecs.username == UriComponentSupportOption.notSupported)
                uriBuilder.encodedUserInfo = null;
            else if (uriBuilder.schemeSpecs.password == UriComponentSupportOption.notSupported) {
                m = userNameParseRe.exec(uriString);
                if (sys.isNilOrEmpty(m)) {
                    if (uriBuilder.schemeSpecs.username == UriComponentSupportOption.required)
                        uriBuilder.encodedUserInfo = "";
                    else
                        uriBuilder.encodedUserInfo = null;
                } else {
                    uriBuilder.encodedUserInfo = m[1];
                    uriString = uriString.substr(m[0].length);
                }
            } else {
                m = userPwParseRe.exec(uriString);
                if (sys.isNilOrEmpty(m)) {
                    if (uriBuilder.schemeSpecs.username == UriComponentSupportOption.required)
                        uriBuilder.encodedUserInfo = (uriBuilder.schemeSpecs.password == UriComponentSupportOption.required) ? ":" : "";
                    else
                        uriBuilder.encodedUserInfo = null;
                } else {
                    uriBuilder.encodedUserInfo = (sys.isNil(m[3]) && uriBuilder.schemeSpecs.password == UriComponentSupportOption.required) ? m[1] + ":" : m[1];
                    uriString = uriString.substr(m[0].length);
                }
            }

            if (uriBuilder.schemeSpecs.hostname === UriComponentSupportOption.notSupported)
                uriBuilder.encodedHost = null;
            else if (uriBuilder.schemeSpecs.port === UriComponentSupportOption.notSupported) {
                m = hostNameParseRe.exec(uriString);
                if (sys.isNilOrEmpty(m)) {
                    if (uriBuilder.schemeSpecs.hostname === UriComponentSupportOption.required)
                        uriBuilder.encodedHost = "";
                    else
                        uriBuilder.encodedHost = null;
                } else {
                    uriBuilder.encodedHost = m[0];
                    return uriString.substr(m[0].length);
                }
            } else {
                m = hostPortParseRe.exec(uriString);
                if (sys.isNilOrEmpty(m)) {
                    if (uriBuilder.schemeSpecs.host === UriComponentSupportOption.required)
                        uriBuilder.encodedHost = (uriBuilder.schemeSpecs.port === UriComponentSupportOption.required) ? ((isNaN(uriBuilder.schemeSpecs.defaultPort)) ? ":" : ":" + uriBuilder.schemeSpecs.defaultPort.toString()) : "";
                    else
                        uriBuilder.encodedHost = null;
                } else {
                    uriBuilder.encodedHost = (sys.isNil(m[2]) && uriBuilder.schemeSpecs.host === UriComponentSupportOption.required) ? m[1] + ((isNaN(uriBuilder.schemeSpecs.defaultPort)) ? ":" : ":" + uriBuilder.schemeSpecs.defaultPort.toString()) : m[0];
                    return uriString.substr(m[0].length);
                }
            }

            return uriString;
        }

        private onSchemeComponentChange(component: UriBuilderComponentChangeArg, value: string | undefined, uriBuilder: UriBuilderController): void { this._changeManager.raiseChange(component, value); }

        private onUserInfoComponentChange(component: UriBuilderComponentChangeArg, value: string | undefined, uriBuilder: UriBuilderController): void {
            this._changeManager.doChange(() => {
                if (sys.isNil(value))
                    this.encodedUserName = this.encodedPassword = null;
                else if (uriBuilder.schemeSpecs.password === UriComponentSupportOption.notSupported) {
                    this.encodedUserName = value;
                    this.encodedPassword = null;
                } else {
                    let index: number = value.indexOf(":");
                    if (index < 0) {
                        this.encodedUserName = value;
                        this.encodedPassword = null;
                    } else {
                        this.encodedUserName = value.substr(0, index);
                        this.encodedPassword = value.substr(index + 1);
                    }
                }
            }, this);
        }

        private onHostComponentChange(component: UriBuilderComponentChangeArg, value: string | undefined, uriBuilder: UriBuilderController): void {
            this._changeManager.doChange(() => {
                if (sys.isNil(value))
                    this.encodedHostName = this.encodedPortNumber = null;
                else if (uriBuilder.schemeSpecs.port === UriComponentSupportOption.notSupported) {
                    this.encodedHostName = value;
                    this.encodedPortNumber = null;
                } else {
                    let index: number = value.indexOf(":");
                    if (index < 0) {
                        this.encodedHostName = value;
                        this.encodedPortNumber = null;
                    } else {
                        this.encodedHostName = value.substr(0, index);
                        this.encodedPortNumber = value.substr(index + 1);
                    }
                }
            }, this);
        }

        private onIsEditingEncodedUriStringChanged(isEditingEncodedUriString: boolean, encodedUriString: string): void {
        }

        private onIsAbsoluteUriChanged(isAbsoluteUri: boolean, isEditingEncodedUriString: boolean): void {
        }

        // #endregion
    }
    
    app.mainModule.directive(DIRECTIVENAME_uriBuilderOrigin, UriBuilderOriginController.createDirective);

    // #endregion

    // #region uri-builder element directive

    export const DIRECTIVENAME_uriBuilder: string = "uriBuilder";
    
    interface IUriBuilderScope extends ng.IScope { uriBuilder: UriBuilderController; }

    enum UriBuilderComponentChangeArg {
        uriString,
        scheme,
        userinfo,
        username,
        password,
        host,
        hostname,
        port,
        path,
        query,
        fragment
    }

    class UriBuilderController implements ng.IController {
        private readonly _changeManager: ComponentChangeManager<UriBuilderComponentChangeArg>;
        private _onEncodedComponentChanged: [UriBuilderComponentChangeArg, IControllerComponentChangeCallback<UriBuilderComponentChangeArg, UriBuilderController>, any][] = [];
        private _lastParsedUriString: string = "";
        private _lastParsedUriIsAbsolute: boolean = false;
        private _encodedUriString: string = "";
        private _encodedUserInfo: string = "";
        private _encodedHost: string = "";
        private _encodedPathString: string | null = null;
        private _encodedQueryString: string | null = null;
        private _encodedFragment: string | null = null;
        private _isEditingEncodedUriString: boolean = true;
        private _isAbsoluteUri: boolean = false;
        private _schemeSpecs: UriSchemeSpecification = UriSchemeSpecification.uriScheme_http;
        private _onIsEditingEncodedUriStringChanged?: { (isEditingEncodedUriString: boolean, encodedUriString: string): void };
        private _onIsAbsoluteUriChanged?: { (isAbsoluteUri: boolean, isEditingEncodedUriString: boolean): void };

        // #region Properties

        get encodedUriString(): string { return this._encodedUriString; }
        set encodedUriString(value: string) {
            if (this._encodedUriString === (value = sys.asString(value)))
                return;
            this._encodedUriString = value;
            this._changeManager.raiseChange(UriBuilderComponentChangeArg.uriString, value);
        }

        get encodedUserInfo(): string | null { return this._encodedUserInfo; }
        set encodedUserInfo(value: string | null) {
            if (this._encodedUserInfo === (value = sys.asStringOrNull(value)))
                return;
            this._encodedUserInfo = value;
            this._changeManager.raiseChange(UriBuilderComponentChangeArg.userinfo, value);
        }

        get encodedHost(): string | null { return this._encodedHost; }
        set encodedHost(value: string | null) {
            if (this._encodedHost === (value = sys.asStringOrNull(value)))
                return;
            this._encodedHost = value;
            this._changeManager.raiseChange(UriBuilderComponentChangeArg.host, value);
        }

        get encodedPathString(): string | null { return this._encodedPathString; }
        set encodedPathString(value: string | null) {
            if (this._encodedPathString === (value = sys.asStringOrNull(value)))
                return;
            this._encodedPathString = value;
            this._changeManager.raiseChange(UriBuilderComponentChangeArg.path, value);
        }

        get encodedQueryString(): string | null { return this._encodedQueryString; }
        set encodedQueryString(value: string | null) {
            if (this._encodedQueryString === (value = sys.asStringOrNull(value)))
                return;
            this._encodedQueryString = value;
            this._changeManager.raiseChange(UriBuilderComponentChangeArg.query, value);
        }

        get encodedFragment(): string | null { return this._encodedFragment; }
        set encodedFragment(value: string | null) {
            if (this._encodedFragment === (value = sys.asStringOrNull(value)))
                return;
            this._encodedFragment = value;
            this._changeManager.raiseChange(UriBuilderComponentChangeArg.fragment, value);
        }

        get isChanging(): boolean { return this._changeManager.isChanging; }

        get isEditingEncodedUriString(): boolean { return this._isEditingEncodedUriString; }
        set isEditingEncodedUriString(value: boolean) { this.setIsEditingEncodedUriString(sys.asBoolean(value, false)); }

        get isEditingUriComponents(): boolean { return !this._isEditingEncodedUriString; }
        set isEditingUriComponents(value: boolean) { this.setIsEditingEncodedUriString(!sys.asBoolean(value, false)); }

        get isAbsoluteUri(): boolean { return this._isAbsoluteUri; }
        set isAbsoluteUri(value: boolean) { this.setIsAbsoluteUri(sys.asBoolean(value, false)); }

        get isRelativeUri(): boolean { return !this._isAbsoluteUri; }
        set isRelativeUri(value: boolean) { this.setIsAbsoluteUri(!sys.asBoolean(value, false)); }

        get schemeSpecs(): UriSchemeSpecification { return this._schemeSpecs; }
        set schemeSpecs(value: UriSchemeSpecification) {
            if (sys.isNil(value) || this._schemeSpecs.isEqualTo(value))
                return;
            this._schemeSpecs = value;
            this._changeManager.raiseChange(UriBuilderComponentChangeArg.scheme, value.name + value.separator);
        }

        // #endregion

        constructor(protected readonly $scope: ng.IScope, protected readonly $log: ng.ILogService) {
            $log.info("Creating UriBuilderController")
            this._changeManager = new ComponentChangeManager<UriBuilderComponentChangeArg>((component: UriBuilderComponentChangeArg, value: string) => {
                this._onEncodedComponentChanged.filter((v: [UriBuilderComponentChangeArg, IControllerComponentChangeCallback<UriBuilderComponentChangeArg, UriBuilderController>, any]) => v[0] === component)
                    .forEach((v: [UriBuilderComponentChangeArg, IControllerComponentChangeCallback<UriBuilderComponentChangeArg, UriBuilderController>, any]) => v[1].call(v[2], component, value, this));
            }, this);
        }

        // #region Methods

        private setIsAbsoluteUri(value: boolean) {
            if (this._isAbsoluteUri === value)
                return;
            this._isAbsoluteUri = value;
            sys.execIfFunction<boolean, boolean>(this._onIsAbsoluteUriChanged, value, this._isEditingEncodedUriString);
        }

        private setIsEditingEncodedUriString(value: boolean): void {
            if (this._isEditingEncodedUriString === value)
                return;
            this._isEditingEncodedUriString = value;
            if (value)
                this.rebuildEncodedUri();
            else
                this.parseEncodedUriString();
            sys.execIfFunction<boolean, string>(this._onIsEditingEncodedUriStringChanged, value, this._encodedUriString);
        }

        private parseEncodedUriString(): void {
            this._changeManager.doChange(() => {
                let value: string = this._encodedUriString;
                let scheme: UriSchemeSpecification | undefined = UriBuilderSchemeController.detectScheme(value, this);
                let index: number;
                if (typeof scheme === "undefined") {
                    this.isAbsoluteUri = false;
                    this.schemeSpecs = scheme = UriSchemeSpecification.uriScheme_http;
                    if (scheme.fragment != UriComponentSupportOption.notSupported)
                        value = UriBuilderFragmentController.parseFragment(value, this);
                    if (scheme.query != UriComponentSupportOption.notSupported)
                        value = UriBuilderQueryController.parseQuery(value, this);
                } else {
                    this.isAbsoluteUri = true;
                    this.schemeSpecs = scheme;
                    if (scheme.fragment != UriComponentSupportOption.notSupported)
                        value = UriBuilderFragmentController.parseFragment(value, this);
                    if (scheme.query != UriComponentSupportOption.notSupported)
                        value = UriBuilderQueryController.parseQuery(value, this);
                    value = UriBuilderOriginController.parseOrigin(value, this);
                }
                if (scheme.path != UriComponentSupportOption.notSupported || value.length > 0)
                    this.encodedPathString = value;
                else
                    this.encodedPathString = null;
            }, this);
        }

        private rebuildEncodedUri(): void {
            let uriString: string = sys.asString(this._encodedPathString);
            if (this._isAbsoluteUri) {
                if (uriString.length > 0) {
                    let c: string = uriString.substr(0, 1);
                    if (c !== "/" && c !== "\\" && c !== ":")
                        uriString = "/" + uriString;
                }
                uriString = sys.asString(this._encodedHost) + uriString;
                if (typeof this._encodedUserInfo === "string")
                    uriString = this._encodedUserInfo + "@" + uriString;
                uriString = this._schemeSpecs.name + this._schemeSpecs.separator + uriString;
            }
            if (typeof this._encodedQueryString === "string")
                uriString += "?" + this._encodedQueryString;
            this.encodedUriString = (typeof this._encodedFragment === "string") ? uriString + "#" + this._encodedFragment : uriString;
        }

        onIsEditingEncodedUriStringChanged(callback: { (isEditingEncodedUriString: boolean, encodedUriString: string): void }): void {
            this._onIsEditingEncodedUriStringChanged = sys.chainCallback<boolean, string>(this._onIsEditingEncodedUriStringChanged, callback);
        }

        onIsAbsoluteUriChanged(callback: { (isAbsoluteUri: boolean, isEditingEncodedUriString: boolean): void }): void {
            this._onIsAbsoluteUriChanged = sys.chainCallback<boolean, boolean>(this._onIsAbsoluteUriChanged, callback);
        }

        onComponentChange(thisArg: any, callback: IControllerComponentChangeCallback<UriBuilderComponentChangeArg, UriBuilderController>, ...component: UriBuilderComponentChangeArg[]): void {
            this.$log.debug("Component change", component);
            component.forEach((c: UriBuilderComponentChangeArg) => {
                let arr: [UriBuilderComponentChangeArg, IControllerComponentChangeCallback<UriBuilderComponentChangeArg, UriBuilderController>, any][] = this._onEncodedComponentChanged.filter((v: [UriBuilderComponentChangeArg, IControllerComponentChangeCallback<UriBuilderComponentChangeArg, UriBuilderController>, any]) => v[0] === c);
                if (arr.length > 0) {
                    arr[0][1] = sys.chainCallback<UriBuilderComponentChangeArg, string, UriBuilderController>(arr[0][1], callback);
                    arr[0][2] = thisArg;
                }
                else if (typeof callback === "function")
                    this._onEncodedComponentChanged.push([c, callback, thisArg]);
            });
        }

        showUriComponents(): void { this.isEditingUriComponents = true; }

        showEncodedUriString(): void { this.isEditingEncodedUriString = true; }

        $onInit(): void { }

        static createDirective(): ng.IDirective {
            return {
                restrict: "E",
                controllerAs: "uriBuilder",
                controller: ["$scope", "$log", UriBuilderController],
                transclude: true,
                template: '<ng-transclude></ng-transclude>'
            };
        }
        // #endregion
    }

    app.mainModule.directive(DIRECTIVENAME_uriBuilder, UriBuilderController.createDirective);

    // #endregion
}
