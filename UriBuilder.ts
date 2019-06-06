/// <reference path="Scripts/typings/jquery/jquery.d.ts"/>
/// <reference path="Scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="app.ts"/>

namespace uriBuilder {
    let schemeRegex: RegExp = /^([a-z_][-.\dA-_a-z~\ud800-\udbff]*)(:[\\/]{0,2})/;
    let userInfoRegex: RegExp = /^([^:\\\/@]+)?(:([^:\\\/@]+)?)?@/;
    let hostAndPortRegex: RegExp = /^([^:\\\/@]+)?(:(\d+))?@/;
    let separatorRegex: RegExp = /[\\\/:]/;
    let nonSeparatorRegex: RegExp = /[\\\/:]/;
    let pathSegmentRegex: RegExp = /^(?:([^\\\/:]+)|([\\\/:])([^\\\/:]+)?)(.+)?$/;
    let uriParseRegex: RegExp = /^(([^\\\/@:]*)(:[\\\/]{0,2})((?=[^\\\/@:]*(?::[^\\\/@:]*)?@)([^\\\/@:]*)(:[^\\\/@:]*)?@)?([^\\\/@:]*)(?:(?=:\d*(?:[\\\/:]|$)):(\d*))?(?=[\\\/:]|$))?(.+)?$/;
    let uriDataRegex: RegExp = /^([$-.\d_a-z~\ud800-\udbff]+|%[a-f\d]{2})+/i;
    let uriPathRegex: RegExp = /^([!$&-.\d;=@-\[\]_a-z~\ud800-\udbff\/\\]+|%[a-f\d]{2})+/i;
    let uriPathNameRegex: RegExp = /^([!$&-.\d;=@-\[\]_a-z~\ud800-\udbff]+|%[a-f\d]{2})+/i;
    let uriAuthorityNameRegex: RegExp = /^([!$&-.\d;=A-\[\]_a-z~\ud800-\udbff]+|%[a-f\d]{2})+/;
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

    export interface IParsedUriQuery {
        queryString: string;
        nameValuePairs: { key: string, value?: string }[]
    }
    export interface IParsedUriPath {
        path: string;
        segments: { leadingSeparator: "/" | "\\" | ":", name: string }[];
    }
    export interface IParsedUriHost {
        name: string;
        port?: string;
    }
    export interface IParsedUriUserInfo {
        username: string;
        password?: string;
    }
    export interface IParsedUriAuthority {
        authority: string;
        userInfo?: IParsedUriUserInfo;
        host?: IParsedUriHost;
    }
    export interface IParsedUriOrigin {
        origin: string;
        schemeName: string;
        schemeSeprator: UriSchemeSeparator;
        authority?: IParsedUriAuthority;
    }
    export interface IParsedUri {
        href: string;
        origin?: IParsedUriOrigin;
        path?: IParsedUriPath;
        query?: IParsedUriQuery;
        fragment?: string;
    }

    export function parseQuery(queryString: string): IParsedUriQuery {
        throw new Error("Not implemented");
    }
    export function parseUri(uri: string): IParsedUri {
        if (typeof uri !== "string")
            uri = "";

        let index: number;
        let scheme: UriSchemeInfo | undefined = getUriSchemeInfo(uri);
        let result: IParsedUri = <IParsedUri>{};
        if (typeof scheme === "undefined") {
            index = uri.indexOf("#");
            if (index >= 0) {
                result.fragment = uri.substr(index + 1);
                uri = uri.substr(0, index);
            }
            index = uri.indexOf("?");
            if (index >= 0) {
                result.fragment = uri.substr(index + 1);
                uri = uri.substr(0, index);
            }
        } else {
            if (scheme.fragment !== UriComponentSupport.notSupported) {
                index = uri.indexOf("#");
                let result: IParsedUri = <IParsedUri>{};
                if (index >= 0) {
                    result.fragment = uri.substr(index + 1);
                    uri = uri.substr(0, index);
                }
            }
            if (scheme.query !== UriComponentSupport.notSupported) {
                index = uri.indexOf("?");
                if (index >= 0) {
                    result.query = <IParsedUriQuery>{};
                    result.query.queryString = uri.substr(index + 1);
                    // TODO: parse name/value pairs.
                    uri = uri.substr(0, index);
                }
            }
        }
        throw new Error("Not implemented");
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

    export type UriSchemeSeparator = "://" | ":/" | ":";

    const uriSchemeParseRe: RegExp = /^([a-zA-Z_][-.\dA-_a-z~\ud800-\udbff]*)(:[\\/]{0,2})/;

    export function getUriSchemeInfo(uri: string): UriSchemeInfo | undefined {
        if ((typeof uri === "string") && uri.length > 0) {
            let m: RegExpExecArray = uriSchemeParseRe.exec(uri);
            if ((typeof m === "object") && m !== null) {
                let scheme: UriSchemeInfo = UriSchemeInfo.getSchemaProperties(m[1]);
                let s: string = m[2].replace("\\", "/");
                if (scheme.schemeSeparator === s)
                    return scheme;
                return new UriSchemeInfo(scheme.name, {
                    path: scheme.path, query: scheme.query, fragment: scheme.fragment, userInfo: scheme.userInfo, host: scheme.host, schemeSeparator: <UriSchemeSeparator>s
                }, scheme.description);
            }
        }
    }

    export interface IUriSchemeOption extends IUriSchemeProperties {
        name: string;
        displayText: string;
        description?: string;
        schemeSeparator: UriSchemeSeparator;
    }

    export enum UriComponentSupport {
        required,
        optional,
        notSupported
    }

    export interface IUriSchemeProperties {
        path?: UriComponentSupport;
        query?: UriComponentSupport;
        fragment?: UriComponentSupport;
        schemeSeparator?: UriSchemeSeparator;
        userInfo?: UriComponentSupport.notSupported | { username: UriComponentSupport.required | UriComponentSupport.optional; password?: UriComponentSupport };
        host?: UriComponentSupport.notSupported | { name: UriComponentSupport.required | UriComponentSupport.optional; port?: UriComponentSupport, defaultPort?: number };
    }

    export class UriSchemeInfo implements IUriSchemeOption {
        readonly description: string;
        readonly path: UriComponentSupport;
        readonly query: UriComponentSupport;
        readonly fragment: UriComponentSupport;
        readonly userInfo: UriComponentSupport.notSupported | { username: UriComponentSupport.required | UriComponentSupport.optional; password: UriComponentSupport };
        readonly userName: UriComponentSupport;
        readonly password: UriComponentSupport;
        readonly host: UriComponentSupport.notSupported | { name: UriComponentSupport.required | UriComponentSupport.optional; port: UriComponentSupport, defaultPort?: number };
        readonly hostName: UriComponentSupport;
        readonly port: UriComponentSupport;
        readonly defaultPort: number;
        readonly schemeSeparator: UriSchemeSeparator;

        get displayText(): string {
            return (this.description.length == 0) ? "\"" + this.name + "\" Schema" : this.description + " (" + this.name + ")";
        }

        constructor(readonly name: string, properties?: IUriSchemeProperties, description?: string) {
            this.description = (typeof description === "string") ? description.trim() : "";
            if (typeof (properties) === 'undefined' || properties === null) {
                this.path = UriComponentSupport.optional;
                this.query = UriComponentSupport.optional;
                this.fragment = UriComponentSupport.optional;
                this.userName = UriComponentSupport.optional;
                this.password = UriComponentSupport.optional;
                this.userInfo = { username: this.userName, password: this.password };
                this.hostName = UriComponentSupport.optional;
                this.port = UriComponentSupport.optional;
                this.defaultPort = NaN;
                this.host = { name: this.hostName, port: this.port, defaultPort: this.defaultPort };
                this.schemeSeparator = "://";
            } else {
                this.schemeSeparator = (typeof (properties.schemeSeparator) == 'string') ? properties.schemeSeparator : "://";
                let host: UriComponentSupport.notSupported | { name: UriComponentSupport.required | UriComponentSupport.optional; port?: UriComponentSupport, defaultPort?: number } | undefined = properties.host;
                if (typeof host === "number")
                    this.host = host;
                else if (typeof host !== "undefined")
                    this.host = { name: host.name, port: (typeof host.port === "number") ? host.port : UriComponentSupport.optional, defaultPort: host.defaultPort };
                else if (this.schemeSeparator == ":")
                    this.host = UriComponentSupport.notSupported;
                else
                    this.host = { name: UriComponentSupport.optional, port: UriComponentSupport.optional };
                this.path = ((typeof properties.path === "undefined") || properties.path === null) ? UriComponentSupport.optional : properties.path;
                this.query = ((typeof properties.query === "undefined") || properties.query === null) ? UriComponentSupport.optional : properties.path;
                this.fragment = ((typeof properties.fragment === "undefined") || properties.fragment === null) ? UriComponentSupport.optional : properties.fragment;
                let userInfo: UriComponentSupport.notSupported | { username: UriComponentSupport.required | UriComponentSupport.optional; password?: UriComponentSupport } | undefined = properties.userInfo;
                this.userInfo = ((typeof userInfo === "undefined") || userInfo === null) ? { username: UriComponentSupport.optional, password: UriComponentSupport.optional } :
                    ((typeof userInfo === "number") ? userInfo : { username: userInfo.username, password: (typeof userInfo.password === "undefined" || userInfo.password === null) ? UriComponentSupport.optional : userInfo.password });
                this.userName = (typeof properties.userInfo === "number") ? properties.userInfo : properties.userInfo.username;
                this.password = (typeof properties.userInfo === "number") ? properties.userInfo : properties.userInfo.password;
                this.hostName = (typeof properties.host === "number") ? properties.host : properties.host.name;
                this.port = (typeof properties.host === "number") ? properties.host : properties.host.port;
                this.defaultPort = (typeof properties.host === "object" && typeof properties.host.defaultPort === "number") ? properties.host.defaultPort : NaN;
            }
        }

        static getSchemaProperties(name: string): UriSchemeInfo {
            if (name.endsWith(':'))
                name = name.substr(0, name.length - 1);
            let item: UriSchemeInfo = UriSchemeInfo.knownSchemes.find((value: UriSchemeInfo) => value.name === name);
            if (typeof item !== "undefined")
                return item;
            return new UriSchemeInfo(name);
        }

        /**
         * File Transfer protocol
         **/
        static readonly uriScheme_ftp: UriSchemeInfo = new UriSchemeInfo("ftp", { query: UriComponentSupport.notSupported, fragment: UriComponentSupport.notSupported, host: { name: UriComponentSupport.required, defaultPort: 21 } }, "File Transfer protocol");
        /**
         * File Transfer protocol (secure)
         **/
        static readonly uriScheme_ftps: UriSchemeInfo = new UriSchemeInfo("ftps", { query: UriComponentSupport.notSupported, fragment: UriComponentSupport.notSupported, host: { name: UriComponentSupport.required, defaultPort: 990 } }, "File Transfer protocol (secure)");
        /**
         * Secure File Transfer Protocol
         **/
        static readonly uriScheme_sftp: UriSchemeInfo = new UriSchemeInfo("sftp", { query: UriComponentSupport.notSupported, fragment: UriComponentSupport.notSupported, host: { name: UriComponentSupport.required, defaultPort: 22 } }, "Secure File Transfer Protocol");
        /**
         * Hypertext Transfer Protocol
         **/
        static readonly uriScheme_http: UriSchemeInfo = new UriSchemeInfo("http", { host: { name: UriComponentSupport.required, defaultPort: 80 } }, "Hypertext Transfer Protocol");
        /**
         * Hypertext Transfer Protocol (secure)
         **/
        static readonly uriScheme_https: UriSchemeInfo = new UriSchemeInfo("https", { host: { name: UriComponentSupport.required, defaultPort: 443 } }, "Hypertext Transfer Protocol (secure)");
        /**
         * Gopher protocol
         **/
        static readonly uriScheme_gopher: UriSchemeInfo = new UriSchemeInfo("gopher", { host: { name: UriComponentSupport.required, defaultPort: 70 } }, "Gopher protocol");
        /**
         * Electronic mail address
         **/
        static readonly uriScheme_mailto: UriSchemeInfo = new UriSchemeInfo("mailto", { schemeSeparator: ":", host: { name: UriComponentSupport.required, port: UriComponentSupport.notSupported },
            userInfo: { username: UriComponentSupport.required, password: UriComponentSupport.notSupported } }, "Electronic mail address");
        /**
         * USENET news
         **/
        static readonly uriScheme_news: UriSchemeInfo = new UriSchemeInfo("news", { host: UriComponentSupport.notSupported, schemeSeparator: ":" }, "USENET news");
        /**
         * USENET news using NNTP access
         **/
        static readonly uriScheme_nntp: UriSchemeInfo = new UriSchemeInfo("nntp", { host: { name: UriComponentSupport.required, defaultPort: 119 } }, "USENET news using NNTP access");
        /**
         * Reference to interactive sessions
         **/
        static readonly uriScheme_telnet: UriSchemeInfo = new UriSchemeInfo("telnet", { path: UriComponentSupport.notSupported, query: UriComponentSupport.notSupported, fragment: UriComponentSupport.notSupported,
            userInfo: UriComponentSupport.notSupported, host: { name: UriComponentSupport.required, defaultPort: 23 } }, "Reference to interactive sessions");
        /**
         * Wide Area Information Servers
         **/
        static readonly uriScheme_wais: UriSchemeInfo = new UriSchemeInfo("wais", { host: { name: UriComponentSupport.required, defaultPort: 443 } }, "Wide Area Information Servers");
        /**
         * Host-specific file names
         **/
        static readonly uriScheme_file: UriSchemeInfo = new UriSchemeInfo("file", {
            query: UriComponentSupport.notSupported, fragment: UriComponentSupport.notSupported, userInfo: UriComponentSupport.notSupported,
            host: { name: UriComponentSupport.optional, port: UriComponentSupport.notSupported }
        }, "Host-specific file names");
        /**
         * Net Pipe
         **/
        static readonly uriScheme_netPipe: UriSchemeInfo = new UriSchemeInfo("net.pipe", { host: { name: UriComponentSupport.required, port: UriComponentSupport.notSupported } }, "Net Pipe");
        /**
         * Net-TCP
         **/
        static readonly uriScheme_netTcp: UriSchemeInfo = new UriSchemeInfo("net.tcp", { host: { name: UriComponentSupport.required, defaultPort: 808 } }, "Net-TCP");
        /**
         * Lightweight Directory Access Protocol
         **/
        static readonly uriScheme_ldap: UriSchemeInfo = new UriSchemeInfo("ldap", { host: { name: UriComponentSupport.required, defaultPort: 389 } }, "Lightweight Directory Access Protocol");
        /**
         * Lightweight Directory Access Protocol
         **/
        static readonly uriScheme_ssh: UriSchemeInfo = new UriSchemeInfo("ssh", { host: { name: UriComponentSupport.required, defaultPort: 22 } }, "Lightweight Directory Access Protocol");
        /**
         * GIT Respository
         **/
        static readonly uriScheme_git: UriSchemeInfo = new UriSchemeInfo("git", { query: UriComponentSupport.notSupported, fragment: UriComponentSupport.notSupported, host: { name: UriComponentSupport.required, defaultPort: 9418 } }, "GIT Respository");
        /**
         * Telephone Number
         **/
        static readonly uriScheme_tel: UriSchemeInfo = new UriSchemeInfo("tel", { host: UriComponentSupport.notSupported, schemeSeparator: ":", path: UriComponentSupport.notSupported, fragment: UriComponentSupport.notSupported, query: UriComponentSupport.notSupported }, "Telephone Number");
        /**
         * Uniform Resource notation
         **/
        static readonly uriScheme_urn: UriSchemeInfo = new UriSchemeInfo("urn", { host: UriComponentSupport.notSupported, schemeSeparator: ":" }, "Uniform Resource notation");

        static readonly knownSchemes: ReadonlyArray<UriSchemeInfo> = [
            UriSchemeInfo.uriScheme_https,
            UriSchemeInfo.uriScheme_http,
            UriSchemeInfo.uriScheme_ssh,
            UriSchemeInfo.uriScheme_file,
            UriSchemeInfo.uriScheme_ldap,
            UriSchemeInfo.uriScheme_wais,
            UriSchemeInfo.uriScheme_git,
            UriSchemeInfo.uriScheme_mailto,
            UriSchemeInfo.uriScheme_netPipe,
            UriSchemeInfo.uriScheme_netTcp,
            UriSchemeInfo.uriScheme_sftp,
            UriSchemeInfo.uriScheme_ftps,
            UriSchemeInfo.uriScheme_ftp,
            UriSchemeInfo.uriScheme_gopher,
            UriSchemeInfo.uriScheme_news,
            UriSchemeInfo.uriScheme_nntp,
            UriSchemeInfo.uriScheme_telnet,
            UriSchemeInfo.uriScheme_tel,
            UriSchemeInfo.uriScheme_urn
        ];
    }    

    interface IUriBuilderScope extends ng.IScope {

    }

    class UriBuilderController implements ng.IController {
        constructor(protected readonly $Scope: IUriBuilderScope) {

        }

        $onChanges(onChangesObj: ng.IOnChangesObject) {

        }
    }

    app.mainModule.controller("uriBuilderController", ['$scope', UriBuilderController]);
}
