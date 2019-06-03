/// <reference path="Scripts/typings/jquery/jquery.d.ts"/>
/// <reference path="Scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="app.ts"/>

namespace uriBuilder {
    interface UriQueryItem {
        key: string;
        keyOnly: boolean;
        value: string;
    }

    /**
     * Defines scope properties for UriBuilderController.
     *
     * @export
     * @interface UriBuilderControllerScope
     * @extends {ng.IScope}
     */
    interface UriBuilderControllerScope extends ng.IScope {
        /**
         * The full URI string.
         *
         * @type {string}
         * @memberof UriBuilderControllerScope
         */
        href: string;

        originEnabled: boolean;

        schemeName: string;
        
        schemeOptions: ISchemaOption[];

        separatorOptions: string[];

        selectedScheme: string;

        selectedSeparator: string;

        enableUsername: boolean;

        username: string;

        enablePassword: boolean;

        password: string;

        host: string;

        enablePort: boolean;

        port: string;

        path: UriBuilderPathSegment[];

        enableQuery: boolean;

        query: UriQueryItem[];

        enableFragment: boolean;

        fragment: string;

        hrefChanged(): void;
        
        originChanged(): void;

        schemeChanged(): void;

        userInfoChanged(): void;

        hostNameChanged(): void;

        portChanged(): void;
    }

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
    class UriBuilderController implements ng.IController {
        private _href: string = '';
        private _hasOrigin: boolean = false;
        private _schemeName: string = '';
        private _schemeSeparator: string = '';
        private _hasUserInfo: boolean = false;
        private _userName: string = '';
        private _hasPassword: boolean = false;
        private _password: string = '';
        private _hostName: string = '';
        private _hasPort: boolean = false;
        private _port: string = '';
        private _path: UriBuilderPathSegment[] = [];
        private _hasQuery: boolean = false;
        private _query: UriQueryItem[] = [];
        private _hasFragment: boolean = false;
        private _fragment: string = '';

        constructor(protected $Scope: UriBuilderControllerScope) {
            $Scope.href = 'http://myuser:mypw@www.erwinefamily.net:8080/test/path/page.html?the=query#fragmented';
            $Scope.separatorOptions = ["://", ":/", ":"];
            $Scope.schemeOptions = [SchemaProperties.uriScheme_http, SchemaProperties.uriScheme_https, SchemaProperties.uriScheme_file, SchemaProperties.uriScheme_ftp, SchemaProperties.uriScheme_ftps, SchemaProperties.uriScheme_git,
                SchemaProperties.uriScheme_gopher, SchemaProperties.uriScheme_ldap, SchemaProperties.uriScheme_mailto, SchemaProperties.uriScheme_netPipe, SchemaProperties.uriScheme_netTcp, SchemaProperties.uriScheme_news,
                SchemaProperties.uriScheme_nntp, SchemaProperties.uriScheme_sftp, SchemaProperties.uriScheme_ssh, SchemaProperties.uriScheme_telnet, SchemaProperties.uriScheme_urn, SchemaProperties.uriScheme_wais,
                { name: "", displayText: "(custom)" }];
            $Scope.selectedScheme = $Scope.schemeName = $Scope.schemeOptions[0].name;
            $Scope.selectedSeparator = $Scope.schemeOptions[0].schemeSeparator;
            let constructor: UriBuilderController = this;
            $Scope.hrefChanged = () => {
                if ($Scope.href !== this._href)
                    constructor.parseHref();
            }
            $Scope.originChanged = () => {
                if (this._hasOrigin === $Scope.originEnabled)
                    return;
                this._hasOrigin = $Scope.originEnabled;
                this.rebuildHref();
            };
            $Scope.schemeChanged = () => {
                if ($Scope.selectedScheme.length == 0) {
                    if ($Scope.schemeName === this._schemeName && $Scope.selectedSeparator === this._schemeSeparator)
                        return;
                    this._schemeName = $Scope.schemeName;
                    this._schemeSeparator = $Scope.selectedSeparator;
                } else {
                    let selectedSeparator: string = this.$Scope.schemeOptions.filter((value: ISchemaOption) => value.name == $Scope.selectedScheme)[0].schemeSeparator;
                    if (this._schemeSeparator == selectedSeparator && $Scope.selectedScheme === this._schemeName)
                        return;
                    this._schemeSeparator = $Scope.selectedSeparator = selectedSeparator;
                    this._schemeName = $Scope.schemeName = $Scope.selectedScheme;
                }
                this.rebuildHref();
            }
            $Scope.userInfoChanged = () => {
                if (this._hasUserInfo) {
                    if ($Scope.enableUsername) {
                        if (this._hasPassword === $Scope.enablePassword)
                            return;
                        this._hasPassword = $Scope.enablePassword;
                    } else
                        this._hasUserInfo = $Scope.enablePassword = false;
                } else {
                    if (!$Scope.enableUsername)
                        return false;
                    this._hasUserInfo = true;
                    $Scope.enablePassword = this._hasPassword;
                }
                this.rebuildHref();
            };
            $Scope.hostNameChanged = () => {
                if (this._hostName === $Scope.host)
                    return;
                this._hostName = $Scope.host;
                this.rebuildHref();
            };
            $Scope.portChanged = () => {
                if (this._hasPort === $Scope.enablePort && this._port === $Scope.port)
                    return;
                this._hasPort = $Scope.enablePort;
                this._port = $Scope.port;
                this.rebuildHref();
            };
        }

        $onInit(): void { this.parseHref(); }

        $doCheck(): void {
            console.info("check...");
            if (this.$Scope.href !== this._href) {
                this.parseHref();
            }
        }

        parseQuery(query: string): void {
            this.$Scope.enableQuery = this._hasQuery = (typeof (query) === 'string');
            if (this._hasQuery) {
                if (query.startsWith('?'))
                    query = query.substr(1);
                if (query.length == 0) {
                    this._query = [];
                    this.$Scope.query = [];
                } else {
                    this.$Scope.query = query.split('&').map((value: string) => {
                        let i: number = value.indexOf('=');
                        if (i < 0)
                            return <UriQueryItem>{ key: decodeURIComponent(value), keyOnly: true, value: '' };
                        return <UriQueryItem>{ key: decodeURIComponent(value.substr(0, i)), keyOnly: false, value: decodeURIComponent(value.substr(i + 1)) };
                    });
                    this._query = this.$Scope.query.map((value: UriQueryItem) => <UriQueryItem>{ key: value.key, keyOnly: value.keyOnly, value: value.value });
                }
            } else {
                this._query = [];
                this.$Scope.query = [];
            }
        }

        parseQueryAndFragment(pathOrHref: string): string {
            if (typeof (pathOrHref) != "string" || pathOrHref.length == 0) {
                this._hasQuery = this._hasFragment = this.$Scope.enableFragment = this.$Scope.enableQuery = false;
                this._query = [];
                this.$Scope.query = [];
                this._fragment = this.$Scope.fragment = "";
                return "";
            }
            let i: number = pathOrHref.indexOf("#");
            this._hasFragment = this.$Scope.enableFragment = (i >= 0);
            if (this._hasFragment) {
                this._fragment = this.$Scope.fragment = decodeURIComponent(pathOrHref.substr(i + 1));
                pathOrHref = pathOrHref.substr(0, i);
            } else
                this._fragment = this.$Scope.fragment = "";
            i = pathOrHref.indexOf("?");
            if (i < 0) {
                this._hasQuery = this.$Scope.enableQuery = false;
                this._query = [];
                this.$Scope.query = [];
                return pathOrHref;
            }
            this.parseQuery(pathOrHref.substr(i));
            return pathOrHref.substr(0, i);
        }

        parseHref(): void {
            let href: string = this._href = this.$Scope.href;
            if ((href = this.parseQueryAndFragment(href)).length == 0) {
                this.$Scope.href = this._href = this.$Scope.schemeName = this._schemeName = this.$Scope.username = this._userName = this.$Scope.password = this._password = this.$Scope.host = this._hostName = this.$Scope.port = this._port = "";
                this.$Scope.enablePassword = this.$Scope.enablePort = this.$Scope.enableUsername = this.$Scope.originEnabled = this.$Scope.enableQuery = this.$Scope.enableFragment = this._hasOrigin = this._hasPassword = this._hasPort = this._hasUserInfo = this._hasQuery = this._hasFragment = false;
                this._path = [<UriBuilderPathSegment>{ name: "", separator: "" }];
                this.$Scope.path = [<UriBuilderPathSegment>{ name: "", separator: "" }];
                return;
            }
            let matches: RegExpExecArray = uriParseRegex.exec(href);
            if (typeof (matches) !== "object" || matches === null) {
                this.$Scope.schemeName = this._schemeName = this.$Scope.username = this._userName = this.$Scope.password = this._password = this.$Scope.host = this._hostName = this.$Scope.port = this._port = "";
                this.$Scope.enablePassword = this.$Scope.enablePort = this.$Scope.enableUsername = this.$Scope.originEnabled = this._hasOrigin = this._hasPassword = this._hasPort = this._hasUserInfo = false;
            } else {
                this.$Scope.originEnabled = this._hasOrigin = (typeof matches[uriParseGroup.origin] === "string");
                if (this.$Scope.originEnabled) {
                    this.$Scope.selectedSeparator = this._schemeSeparator = matches[uriParseGroup.schemeSeparator].replace("\\", "/");
                    this.$Scope.schemeName = this._schemeName = matches[uriParseGroup.schemeName];
                    let matchingOptions: ISchemaOption[] = this.$Scope.schemeOptions.filter((value: ISchemaOption) => value.name == this._schemeName && (typeof value.schemeSeparator === "string") && value.schemeSeparator === this._schemeSeparator);
                    this.$Scope.selectedScheme = (matchingOptions.length == 0) ? "" : matchingOptions[0].name;
                    this.$Scope.enableUsername = this._hasUserInfo = (typeof matches[uriParseGroup.userInfo] === "string");
                    if (this.$Scope.enableUsername) {
                        this._userName = this.$Scope.username = (typeof matches[uriParseGroup.username] === "string") ? decodeURIComponent(matches[uriParseGroup.username]) : "";
                        this.$Scope.enablePassword = (typeof matches[uriParseGroup.password] === "string");
                        this._password = this.$Scope.password = (this.$Scope.enablePassword) ? matches[uriParseGroup.password] : "";
                    } else {
                        this._userName = this.$Scope.username = this._password = this.$Scope.password = "";
                        this.$Scope.enablePassword = this._hasPassword = false;
                        this._hostName = this.$Scope.host = (typeof matches[uriParseGroup.hostname] === "string") ? decodeURIComponent(matches[uriParseGroup.hostname]) : "";
                    }
                    this.$Scope.enablePort = this._hasPort = (typeof matches[uriParseGroup.portnumber] === "string");
                    this._port = this.$Scope.port = (this.$Scope.enablePort) ? matches[uriParseGroup.portnumber] : "";
                } else {
                    this.$Scope.schemeName = this._schemeName = this.$Scope.username = this._userName = this.$Scope.password = this._password = this.$Scope.host = this._hostName = this.$Scope.port = this._port = "";
                    this.$Scope.enablePassword = this.$Scope.enablePort = this.$Scope.enableUsername = this.$Scope.originEnabled = this._hasOrigin = this._hasPassword = this._hasPort = this._hasUserInfo = false;
                }
                href = (typeof matches[uriParseGroup.path] === "string") ? matches[uriParseGroup.path] : "";
            }
            if (href.length == 0) {
                this._path = [<UriBuilderPathSegment>{ name: "", separator: "" }];
                this.$Scope.path = [<UriBuilderPathSegment>{ name: "", separator: "" }];
                this.$Scope.enableQuery = this.$Scope.enableFragment = this._hasQuery = this._hasFragment = false;
            } else {
                this._path = [];
                this.$Scope.path = [];
                let p: string;
                matches = pathSegmentRegex.exec(href);
                while ((typeof matches !== "object") || matches === null) {
                    if (typeof matches[1] === "string") {
                        p = decodeURIComponent(matches[1]);
                        this._path.push(<UriBuilderPathSegment>{ separator: "", name: p });
                        this.$Scope.push(<UriBuilderPathSegment>{ separator: "", name: p });
                    } else {
                        p = (typeof matches[3] === "string") ? decodeURIComponent(matches[3]) : "";
                        this._path.push(<UriBuilderPathSegment>{ separator: matches[2], name: p });
                        this.$Scope.push(<UriBuilderPathSegment>{ separator: matches[2], name: p });
                    }
                    if (typeof matches[4] !== "string")
                        break;
                    matches = pathSegmentRegex.exec(matches[4]);
                }
            }
        }

        rebuildHref(): void {
            let href: string = "";
            if (this._hasOrigin) {
                href = encodeURIComponent(this._schemeName) + this._schemeSeparator;
                if (this._hasUserInfo) {
                    href += encodeURIComponent(this._userName);
                    if (this._hasPassword)
                        href += ":" + encodeURIComponent(this._password);
                    href += "@";
                }
                href += encodeURIComponent(this._hostName);
                if (this._hasPort)
                    href += ":" + encodeURIComponent(this._port);
            }
            this._path.forEach((value: UriBuilderPathSegment) => href += value.separator + encodeURIComponent(value.name));
            if (this._hasQuery) {
                href += "?";
                if (this._query.length > 0)
                    this._query.forEach((value: UriQueryItem, idx: number) => {
                        if (idx > 0)
                            href += "&";
                        if (value.keyOnly)
                            href += encodeURIComponent(value.key);
                        else
                            href += encodeURIComponent(value.key) + "=" + encodeURIComponent(value.value);
                    });
            }
            this._href = this.$Scope.href = (this._hasFragment) ? href + "#" + encodeURI(this._fragment) : href;
        }
    }
    
    interface IChangeTracking { hasChanges: boolean; }

    interface IUriQueryParamItem { name: string, value?: string };

    class UriQueryParamItem implements IUriQueryParamItem, IChangeTracking {
        private _encodedPair?: string;
        private _separatorIndex: number;
        private _name?: string;
        private _value?: string;

        hasChanges: boolean = false;

        get name(): string {
            if (typeof (this._name) !== 'string')
                this._name = decodeURIComponent((this._separatorIndex < 0) ? this._encodedPair : this._encodedPair.substr(0, this._separatorIndex));
            return this._name;
        }
        set name(s: string) {
            if (typeof (s) !== 'string')
                throw new Error("Query parameter name string must be a string value");
            if (s !== this._name) {
                if (typeof (this._value) === 'string' || this._separatorIndex < 0) {
                    this._encodedPair = undefined;
                    this._separatorIndex = -1;
                } else {
                    let e: string = encodeURIComponent(s);
                    this._encodedPair = e + '=' + this._encodedPair.substr(this._separatorIndex + 1);
                    this._separatorIndex = e.length;
                }
                this._name = s;
                this.hasChanges = true;
            }
        }

        get value(): string | undefined {
            if (typeof (this._name) !== 'string')
                this._name = decodeURIComponent((this._separatorIndex < 0) ? this._encodedPair : this._encodedPair.substr(0, this._separatorIndex));
            return this._name;
        }
        set value(s: string | undefined) {
            if (typeof (s) === 'undefined' || s === null) {
                if (typeof (this._value) === 'undefined')
                    return;
                if (typeof (this._name) === 'string')
                    this._encodedPair = undefined;
                else
                    this._encodedPair = this._encodedPair.substr(0, this._separatorIndex);
                this._separatorIndex = -1;
                this._value = undefined;
            } else {
                if (typeof (s) !== 'string')
                    throw new Error("If defined, query parameter value string must be a string value");
                if (s === this._value)
                    return;
                if (typeof (this._name) === 'string') {
                    this._encodedPair = undefined;
                    this._separatorIndex = -1;
                } else
                    this._encodedPair = this._encodedPair.substr(0, this._separatorIndex) + '=' + encodeURIComponent(s);
                this._value = s;
            }
            this.hasChanges = true;
        }

        get encodedPair(): string {
            if (typeof (this._encodedPair) !== 'string') {
                this._encodedPair = encodeURIComponent(this._name);
                if (typeof (this._value) === 'string') {
                    this._separatorIndex = this._encodedPair.length;
                    this._encodedPair = this._encodedPair + '=' + encodeURIComponent(this._value);
                } else
                    this._separatorIndex = -1;
            }
            return this._encodedPair;
        }
        set encodedPair(p: string) {
            if (typeof (p) !== 'string')
                throw new Error("Query parameter name value pair string must be a string value");
            if (p === this._encodedPair)
                return;
            this._encodedPair = p;
            this._separatorIndex = p.indexOf('=');
            this._name = this._value = undefined;
            this.hasChanges = true;
        }

        public constructor(keyValuePair: IUriQueryParamItem);
        public constructor(value: string, isEncoded: boolean);
        public constructor(name: string, value: string);
        public constructor(name: string | IUriQueryParamItem, value?: boolean | string) {
            if (typeof (value) === 'boolean') {
                if (typeof (name) !== 'string')
                    throw new Error("Query parameter name value pair string must be a string value");
                if (value) {
                    this._encodedPair = name;
                    this._separatorIndex = name.indexOf('=');
                    return;
                } else {
                    let index: number = name.indexOf('=');
                    if (index < 0) {
                        this._name = name;
                        this._value = undefined;
                    } else {
                        this._name = name.substr(0, index);
                        this._value = name.substr(index + 1);
                    }
                }
            } else {
                if (typeof (name) === 'object') {
                    if (typeof (name.name) !== 'string')
                        throw new Error("Query parameter name must be a string value");
                    this._name = name.name;
                    if (typeof (name.value) === 'undefined' || value === null)
                        this._value = undefined;
                    else {
                        if (typeof (name.value) !== 'string')
                            throw new Error("If defined, query parameter value must be a string or null value.");
                        this._value = name.value;
                    }
                } else {
                    if (typeof (name) !== 'string')
                        throw new Error("Query parameter name must be a string value");
                    this._name = name;
                    if (typeof (value) === 'undefined' || value === null)
                        this._value = undefined;
                    else {
                        if (typeof (value) !== 'string')
                            throw new Error("If defined, query parameter value must be a string or null value.");
                        this._value = value;
                    }
                }
                this._encodedPair = undefined;
            }
        }

        toString(): string { return this.encodedPair; }

        toJSON(): string { return JSON.stringify((typeof (this.value) === 'string') ? { name: this.name, value: this.value } : { name: this.name }); }
    }

    class UriQueryParamIterator implements IterableIterator<[string, string]> {
        private _index = 0;
        private _components: UriQueryParamItem[];

        constructor(components: UriQueryParamItem[]) { this._components = components; }

        next(): IteratorResult<[string, string]> {
            if (this._index < this._components.length) {
                let item: UriQueryParamItem = this._components[this._index++];
                return {
                    done: false,
                    value: [item.name, item.value]
                }
            } else
                return {
                    done: true,
                    value: null
                }
        }

        [Symbol.iterator](): IterableIterator<[string, string]> { return this; }
    }

    class UriQueryNameIterator implements IterableIterator<string> {
        private _index = 0;
        private _components: UriQueryParamItem[];

        constructor(components: UriQueryParamItem[]) { this._components = components; }

        next(): IteratorResult<string> {
            if (this._index < this._components.length) {
                let item: UriQueryParamItem = this._components[this._index++];
                return {
                    done: false,
                    value: item.name
                }
            } else
                return {
                    done: true,
                    value: null
                }
        }

        [Symbol.iterator](): IterableIterator<string> { return this; }
    }

    class UriQueryValueIterator implements IterableIterator<string> {
        private _index = 0;
        private _components: UriQueryParamItem[];

        constructor(components: UriQueryParamItem[]) { this._components = components; }

        next(): IteratorResult<string> {
            if (this._index < this._components.length) {
                let item: UriQueryParamItem = this._components[this._index++];
                return {
                    done: false,
                    value: item.value
                }
            } else
                return {
                    done: true,
                    value: null
                }
        }

        [Symbol.iterator](): IterableIterator<string> { return this; }
    }

    class UriQueryParams implements URLSearchParams, IChangeTracking {
        private _hasQuery: boolean;
        private _items: UriQueryParamItem[];
        private _hasChanges: boolean = false;

        get hasChanges(): boolean { return this._hasChanges || this._items.filter(function (i: UriQueryParamItem) { i.hasChanges }).length > 0; }
        set hasChanges(value: boolean) {
            this._hasChanges = value;
            this._items.forEach(function (i: UriQueryParamItem) { i.hasChanges = value; });
        }

        get hasQuery(): boolean { return this._hasQuery; }

        get length(): number { return this._items.length; }

        constructor(source: URLSearchParams);
        constructor(items: IUriQueryParamItem[]);
        constructor(queryString?: string);
        constructor(value?: string | IUriQueryParamItem[] | URLSearchParams) {
            if (typeof (value) == 'object') {
                if (Array.isArray(value))
                    this._items = value.map(function (i: IUriQueryParamItem) { return new UriQueryParamItem(i); });
                else {
                    this._items = [];
                    value.forEach(function (value: string, key: string) {
                        this._items.push(new UriQueryParamItem(key, value));
                    });
                }
                this._hasQuery = this._items.length > 0;
            } else if (typeof (value) !== 'string' || value.length == 0) {
                this._hasQuery = false;
                this._items = [];
            } else {
                this._hasQuery = true;
                if (value == '?')
                    this._items = [];
                else
                    this._items = value.substr(1).split("&").map(function (s: string) { return new UriQueryParamItem(s, true); });
            }
        }

        append(name: string, value: string): void {
            if (typeof (name) !== 'string')
                throw new Error("Name must be a string");
            this._items.push(new UriQueryParamItem(name, value));
            this._hasQuery = true;
        }

        delete(name: string): void {
            if (typeof (name) !== 'string' || this._items.length == 0)
                return;
            let length: number = this._items.length;
            this._items = this._items.filter(function (i: UriQueryParamItem) { return (i.name !== name); });
            if (length == this._items.length)
                return;
            if (this._items.length == 0)
                this._hasQuery = false;
        }

        get(name: string): string {
            if (typeof (name) === 'string') {
                let items = this._items.filter(function (i: UriQueryParamItem) { return (i.name === name); });
                if (items.length > 0)
                    return items[0].value;
            }
        }

        getAll(name: string): string[] {
            if (typeof (name) !== 'string')
                return [];
            return this._items.filter(function (i: UriQueryParamItem) { return (i.name === name); }).map(function (i: UriQueryParamItem) { return i.value; });
        }

        has(name: string): boolean {
            return (typeof (name) === 'string' && this._items.filter(function (i) { return (i.name === name); }).length > 0);
        }

        set(name: string, value: string): void {
            if (typeof (name) !== 'string')
                throw new Error("Name must be a string");
            let thisObj: { foundFirst: boolean } = { foundFirst: false };
            this._items = this._items.filter(function (i: UriQueryParamItem) {
                if (i.name !== name)
                    return true;
                if (this.foundFirst)
                    return false;
                this.foundFirst = true;
                i.value = value;
                return true;
            }, thisObj);
            if (!thisObj.foundFirst)
                this._items.push(new UriQueryParamItem(name, value));
            this._hasQuery = true;
        }

        sort(): void {
            this._items.sort(function (a: UriQueryParamItem, b: UriQueryParamItem) {
                let lcA: string, lcB: string;
                if (a.name !== b.name) {
                    lcA = a.name.toLowerCase();
                    lcB = b.name.toLowerCase();
                    if (lcA === lcB)
                        return (a.name < b.name) ? -1 : 1;
                    return (lcA < lcB) ? -1 : 1;
                }
                if (a.value === b.value)
                    return 0;
                if (typeof (a.value) !== 'string')
                    return -1;
                if (typeof (b.value) !== 'string')
                    return 1;
                lcA = a.value.toLowerCase();
                lcB = b.value.toLowerCase();
                if (lcA === lcB)
                    return (a.value < b.value) ? -1 : 1;
                return (lcA < lcB) ? -1 : 1;
            });
        }

        forEach(callbackfn: (value: string, key: string, parent: URLSearchParams) => void, thisArg?: any): void {
            let thisObj: UriQueryParams = this;
            this._items.forEach(function (i: UriQueryParamItem) {
                callbackfn(i.value, i.name, thisObj);
            }, thisArg);
        }

        reset(queryString?: string) {
            if (typeof (queryString) !== 'string' || queryString.length == 0) {
                this._hasQuery = false;
                this._items = [];
            } else {
                this._hasQuery = true;
                if (queryString == '?')
                    this._items = [];
                else
                    this._items = queryString.substr(1).split("&").map(function (s: string) { return new UriQueryParamItem(s, true); });
            }
        }

        [Symbol.iterator](): IterableIterator<[string, string]> { return this.entries(); }

        entries(): IterableIterator<[string, string]> { return new UriQueryParamIterator(this._items); }

        keys(): IterableIterator<string> { return new UriQueryNameIterator(this._items); }

        values(): IterableIterator<string> { return new UriQueryValueIterator(this._items); }

        toString(): string {
            if (!this._hasQuery)
                return "";
            return "?" + this._items.map(function (i: UriQueryParamItem) { return i.encodedPair; }).join("&");
        }

        toJSON(): string { return JSON.stringify(this._items.map(function (i: UriQueryParamItem) { return { name: i.name, value: i.value }; })); }
    }

    class UriPathSegment implements IChangeTracking {
        private _name?: string;
        private _encodedName?: string;
        private _previousSegment?: UriPathSegment;
        private _nextSegment?: UriPathSegment;
        private _leadingSeparator: string;

        hasChanges: boolean = false;

        get name(): string {
            if (typeof (this._name) !== 'string')
                this._name = decodeURIComponent(this._encodedName);
            return this._name;
        }
        set name(s: string) {
            if (typeof (s) !== 'string')
                throw new Error("Name must be a string");
            if (s === this._name)
                return;
            this._name = s;
            this._encodedName = undefined;
            this.hasChanges = true;
        }

        get encodedName(): string {
            if (typeof (this._encodedName) !== 'string')
                this._encodedName = encodeURIComponent(this._name);
            return this._encodedName;
        }
        set encodedName(s: string) {
            if (typeof (s) !== 'string')
                throw new Error("Value must be a string");
            if (s === this._encodedName)
                return;
            this._encodedName = s;
            this._name = undefined;
            this.hasChanges = true;
        }

        get leadingSeparator(): string { return this._leadingSeparator; }
        set leadingSeparator(s: string) {
            if (typeof (s) !== 'string' || s.length == 0) {
                if (typeof (this._previousSegment) !== 'undefined')
                    throw new Error("Leading separator cannot be empty on subsequent items");
                if (this._leadingSeparator.length > 0) {
                    this._leadingSeparator = "";
                    this.hasChanges = true;
                }
            } else if (s !== this._leadingSeparator) {
                if (s != '/' && s != '\\')
                    throw new Error("Invalid separator");
                this._leadingSeparator = s;
                this.hasChanges = true;
            }
        }

        get trailingSeparator(): string {
            return (typeof (this._nextSegment) === 'undefined') ? ((this.isEmpty) ? this._leadingSeparator : "") : this._nextSegment._leadingSeparator;
        }

        get isEmpty(): boolean { return ((typeof (this._name) === 'string') ? this._name : this._encodedName).length == 0; }

        get previousSegment(): UriPathSegment | undefined { return this._previousSegment; }

        get nextSegment(): UriPathSegment | undefined { return this._nextSegment; }

        constructor(name: string, isEncoded?: boolean) {
            if (typeof (name) !== 'string')
                throw new Error("Name must be a string");
            if (isEncoded) {
                let indexA: number = name.indexOf("/");
                let indexB: number = name.indexOf("\\");
                if (indexA < 0 || (indexB >= 0 && indexB < indexA))
                    indexA = indexB;
                if (indexA < 0) {
                    this._encodedName = name;
                    this._leadingSeparator = "";
                } else {
                    if (indexA == 0) {
                        this._leadingSeparator = name.substr(0, 1);
                        name = name.substr(1);
                        indexA = name.indexOf("/");
                        indexB = name.indexOf("\\");
                        if (indexA < 0 || (indexB >= 0 && indexB < indexA))
                            indexA = indexB;
                        if (indexA < 0) {
                            this._encodedName = name;
                            return;
                        }
                    } else
                        this._leadingSeparator = "";

                    this._encodedName = name.substr(0, indexA);
                    (this._nextSegment = new UriPathSegment(name.substr(indexA + 1), true))._leadingSeparator = name.substr(indexA, 1);
                    this._nextSegment._previousSegment = this;
                }
            }
            else
                this._name = name;
        }

        getFirstSegment(): UriPathSegment { return (typeof (this._previousSegment) === 'undefined') ? this : this._previousSegment.getFirstSegment(); }

        getLastSegment(): UriPathSegment { return (typeof (this._nextSegment) === 'undefined') ? this : this._nextSegment.getLastSegment(); }

        shift(): UriPathSegment {
            let result: UriPathSegment = this._nextSegment;
            if (typeof (this._previousSegment) === 'undefined' && typeof (result) === 'undefined')
                throw new Error("Cannot remove last item");
            if (typeof (this._previousSegment) !== 'undefined') {
                this._previousSegment.hasChanges = true;
                this._previousSegment._nextSegment = result;
            }
            else if (this._leadingSeparator.length == 0)
                result._leadingSeparator = '';
            if (typeof (this._nextSegment) !== 'undefined') {
                this._nextSegment._previousSegment = this._previousSegment;
                this._nextSegment.hasChanges = true;
            }
            this._previousSegment = this._nextSegment = undefined;
            this.hasChanges = true;
            return result;
        }

        pop(): UriPathSegment {
            let result: UriPathSegment = this._previousSegment;
            if (typeof (result) === 'undefined' && typeof (this._nextSegment) === 'undefined')
                throw new Error("Cannot remove last item");
            if (typeof (result) !== 'undefined') {
                result._nextSegment = this._nextSegment;
                result.hasChanges = true;
            }
            else if (this._leadingSeparator.length == 0)
                this._nextSegment._leadingSeparator = '';
            if (typeof (this._nextSegment) !== 'undefined') {
                this._nextSegment._previousSegment = result;
                this._nextSegment.hasChanges = true;
            }
            this._previousSegment = this._nextSegment = undefined;
            this.hasChanges = true;
            return result;
        }

        unshift(name: string): UriPathSegment {
            let item: UriPathSegment = new UriPathSegment(name);
            item._leadingSeparator = this._leadingSeparator;
            if (this._leadingSeparator.length == 0)
                this._leadingSeparator = "/";
            item._previousSegment = this._previousSegment;
            item._nextSegment = this;
            if (typeof (this._previousSegment) !== 'undefined') {
                this._previousSegment._nextSegment = item;
                this._previousSegment.hasChanges = true;
            }
            this._previousSegment = item;
            item.hasChanges = this.hasChanges = true;
            return item;
        }

        push(name: string): UriPathSegment {
            let item: UriPathSegment = new UriPathSegment(name);
            item._leadingSeparator = (typeof (this._nextSegment) !== 'undefined') ? this._nextSegment._leadingSeparator : ((this._leadingSeparator.length == 0) ? "/" : this._leadingSeparator);
            item._nextSegment = this._nextSegment;
            item._previousSegment = this;
            if (typeof (this._nextSegment) !== 'undefined') {
                this._nextSegment._previousSegment = item;
                this._nextSegment.hasChanges = true;
            }
            this._nextSegment = item;
            item.hasChanges = this.hasChanges = true;
            return item;
        }
    }

    class UriPathSegmentIterator implements IterableIterator<UriPathSegment> {
        private _current: UriPathSegment;

        constructor(firstSegment: UriPathSegment) { this._current = firstSegment; }

        next(): IteratorResult<UriPathSegment> {
            if (typeof (this._current) !== 'undefined') {
                let item: UriPathSegment = this._current;
                this._current = this._current.nextSegment;
                return {
                    done: false,
                    value: item
                };
            } else
                return {
                    done: true,
                    value: null
                };
        }

        [Symbol.iterator](): IterableIterator<UriPathSegment> { return this; }
    }

    class UriPathSegmentCollection implements Iterable<UriPathSegment>, IChangeTracking {
        private static readonly _splitRe: RegExp = /[\\\/]/;
        private _thisObj?: any;
        private _firstItem: UriPathSegment;
        private _lastItem: UriPathSegment;
        private _length: number;
        private _hasChanges: boolean = false;

        get hasChanges(): boolean {
            if (this._hasChanges)
                return true;
            let item: UriPathSegment = this._firstItem;
            do {
                if (item.hasChanges)
                    return true;
            } while (typeof (item = item.nextSegment) !== 'undefined');
            return false;
        }
        set hasChanges(value: boolean) {
            this._hasChanges = value;
            let item: UriPathSegment = this._firstItem;
            do { item.hasChanges = value; } while (typeof (item = item.nextSegment) !== 'undefined');
        }

        get length(): number { return this._length; }

        get pathString(): string { return this.toString(); }
        set pathString(value: string) {
            if (typeof (value) !== 'string' || value.length == 0) {
                if (this.toString().length == 0)
                    return;
                this._firstItem = this._lastItem = new UriPathSegment("");
            } else {
                if (this.toString() === value)
                    return;
                this._firstItem = new UriPathSegment(value, true);
                this._lastItem = this._firstItem.getLastSegment();
            }
            this._hasChanges = true;
        }

        get isRooted(): boolean { return this._firstItem.leadingSeparator.length > 0; }
        set isRooted(b: boolean) {
            if (b) {
                if (this._firstItem.leadingSeparator.length == 0) {
                    this._firstItem.leadingSeparator = '/';
                    this._hasChanges = true;
                }
            } else if (this._firstItem.leadingSeparator.length > 0) {
                this._firstItem.leadingSeparator = "";
                while (this._firstItem.isEmpty && this._length > 1) {
                    this._firstItem = this._firstItem.shift();
                    this._length--;
                    this._firstItem.leadingSeparator = "";
                }
                this._hasChanges = true;
            }
        }

        get hasTrailingSeparator(): boolean { return this._length > 1 && this._lastItem.isEmpty; }
        set hasTrailingSeparator(b: boolean) {
            if (b) {
                if (this._length == 1 || !this._lastItem.isEmpty) {
                    this._lastItem = this._lastItem.push("");
                    this._length++;
                    this._hasChanges = true;
                }
            } else if (this._length > 1) {
                while (this._length > 1 && this._lastItem.isEmpty) {
                    this._lastItem = this._lastItem.pop();
                    this._length--;
                }
                if (this._lastItem.isEmpty)
                    this._lastItem.leadingSeparator = "";
                this._hasChanges = true;
            } else if (this._lastItem.isEmpty && this._length == 1)
                throw new Error("Path must be rooted");
        }

        constructor(path?: string) {
            if (typeof (path) !== 'string' || path.length == 0)
                this._firstItem = this._lastItem = new UriPathSegment("");
            else {
                this._firstItem = new UriPathSegment(path, true);
                this._lastItem = this._firstItem.getLastSegment();
            }
        }

        get(index: number): string {
            if (index >= 0 && index < this._length) {
                let result: UriPathSegment;
                if (index > (this._length >> 1)) {
                    result = this._lastItem;
                    index++;
                    while (index < this._length) {
                        index++;
                        result = result.previousSegment;
                    }
                } else {
                    result = this._firstItem;
                    while (index > 0) {
                        result = result.nextSegment;
                        index--;
                    }
                }
                return result.name;
            }
        }

        set(index: number, name: string) {
            if (index < 0 || index >= this._length)
                throw new Error("Index out of range");
            if (typeof (name) !== 'string')
                throw new Error("value must be a string.");
            let item: UriPathSegment;
            if (index > (this._length >> 1)) {
                item = this._lastItem;
                index++;
                while (index < this._length) {
                    index++;
                    item = item.previousSegment;
                }
            } else {
                item = this._firstItem;
                while (index > 0) {
                    item = item.nextSegment;
                    index--;
                }
            }
            if (item.name == name)
                return;
            item.name = name;
            this._hasChanges = true;
        }

        pop(): string {
            let result: string = this._lastItem.name;
            if (this._length == 1) {
                if (this._lastItem.isEmpty) {
                    if (this._lastItem.leadingSeparator.length > 0) {
                        this._lastItem.leadingSeparator = "";
                        this._hasChanges = true;
                        return "";
                    }
                } else {
                    this._lastItem.name = "";
                    this._hasChanges = true;
                    return result;
                }
            } else {
                this._lastItem = this._lastItem.pop();
                this._length--;
                this._hasChanges = true;
                return result;
            }
        }

        push(...items: string[]): number {
            let thisObj: { coll: UriPathSegmentCollection, result: number } = { coll: this, result: 0 };
            items.forEach(function (s: string) {
                this.coll._lastItem = this.coll._lastItem.push(s);
                this.result++;
            }, thisObj);
            this._hasChanges = true;
            return thisObj.result;
        }

        shift(): string {
            let result: string = this._firstItem.name;
            if (this._length == 1) {
                if (this._firstItem.isEmpty) {
                    if (this._firstItem.leadingSeparator.length > 0) {
                        this._firstItem.leadingSeparator = "";
                        this._hasChanges = true;
                        return "";
                    }
                } else {
                    this._firstItem.name = "";
                    this._hasChanges = true;
                    return result;
                }
            } else {
                this._firstItem = this._firstItem.shift();
                this._length--;
                this._hasChanges = true;
                return result;
            }
        }

        remove(index: number): string {
            if (index == 0)
                return this.shift();
            if (index == this._length - 1)
                return this.pop();
            if (index > 0 && index < this._length) {
                let item: UriPathSegment;
                if (index > (this._length >> 1)) {
                    item = this._lastItem;
                    index++;
                    while (index < this._length) {
                        index++;
                        item = item.previousSegment;
                    }
                } else {
                    item = this._firstItem;
                    while (index > 0) {
                        item = item.nextSegment;
                        index--;
                    }
                }
                item.pop();
                this._hasChanges = true;
                return item.name;
            }
        }

        unshift(...items: string[]): number {
            let thisObj: { coll: UriPathSegmentCollection, result: number } = { coll: this, result: 0 };
            items.forEach(function (s: string) {
                this.coll._firstItem = this.coll._firstItem.unshift(s);
                this.result++;
            }, thisObj);
            this._hasChanges = true;
            return thisObj.result;
        }

        indexOf(searchElement: string, fromIndex?: number): number {
            if (typeof (searchElement) === 'string') {
                let item: UriPathSegment = this._firstItem;
                if (typeof (fromIndex) === 'number' && !isNaN(fromIndex)) {
                    if (fromIndex < 0 || !Number.isFinite(fromIndex))
                        return -1;
                    while (fromIndex > 0) {
                        if (typeof (item = this._firstItem.nextSegment) === 'undefined')
                            return -1;
                        fromIndex--;
                    }
                }
                else
                    fromIndex = 0;

                do {
                    if (item.name == searchElement)
                        return fromIndex;
                    fromIndex++;
                } while (typeof (item = this._firstItem.nextSegment) !== 'undefined');
            }
            return -1;
        }

        lastIndexOf(searchElement: string, fromIndex?: number): number {
            if (typeof (searchElement) === 'string') {
                let item: UriPathSegment = this._lastItem;
                let result: number = this._length - 1;
                do {
                    if (item.name == searchElement)
                        return (typeof (fromIndex) !== 'number' || isNaN(fromIndex) || (fromIndex <= result && fromIndex >= 0)) ? result : -1;
                    result--;
                } while (typeof (item = item.previousSegment) !== 'undefined');
            }
            return -1;
        }

        forEach(callbackfn: (value: string, index: number, collection: UriPathSegmentCollection) => void, thisArg?: any): void {
            let index: number = -1;
            let item: UriPathSegment = this._firstItem;
            do {
                index++;
                callbackfn.call(thisArg, item.name, index, this);
            } while (typeof (item = item.nextSegment) !== 'undefined');
        }

        map<U>(callbackfn: (value: string, index: number, collection: UriPathSegmentCollection) => U, thisArg?: any): U[] {
            let result: U[] = [];
            let index: number = -1;
            let item: UriPathSegment = this._firstItem;
            do {
                index++;
                result.push(callbackfn.call(thisArg, item.name, index, this));
            } while (typeof (item = item.nextSegment) !== 'undefined');
            return result;
        }

        toArray(): string[] {
            let result: string[] = [];
            let item: UriPathSegment = this._firstItem;
            do {
                result.push(item.name);
            } while (typeof (item = item.nextSegment) !== 'undefined');
            return result;
        }

        toJSON(): string { return JSON.stringify(this.toString()); }

        toString(): string {
            let result: string[] = [];
            let item: UriPathSegment = this._firstItem;
            do {
                result.push(item.leadingSeparator + item.encodedName);
            } while (typeof (item = item.nextSegment) !== 'undefined');
            return result.join("");
        }

        [Symbol.iterator](): Iterator<UriPathSegment> { return new UriPathSegmentIterator(this._firstItem); }
    }

    interface ISchemaOption extends ISchemaProperties {
        readonly name: string;
        readonly displayText: string;
    }
    /*
     * https://john.doe@www.example.com:123/forum/questions/?tag=networking&order=newest#top
      └─┬─┘ └───────┬────────────────────┘└─┬─────────────┘└──┬───────────────────────┘└┬─┘
      scheme     authority                 path              query                      fragment
    
      ldap://[2001:db8::7]/c=GB?objectClass?one
      └─┬┘ └───────┬─────┘└─┬─┘ └──────┬──────┘
     scheme    authority  path       query
    
      mailto:John.Doe@example.com
      └──┬─┘ └─────────┬────────┘
      scheme         path
    
      news:comp.infosystems.www.servers.unix
      └─┬┘ └───────────────┬───────────────┘
     scheme              path
    
      tel:+1-816-555-1212
      └┬┘ └──────┬──────┘
    scheme     path
    
      telnet://192.0.2.16:80/
      └──┬─┘ └──────┬──────┘│
      scheme    authority  path
    
      urn:oasis:names:specification:docbook:dtd:xml:4.1.2
     */
    interface ISchemaProperties {
        supportsPath?: boolean;
        supportsQuery?: boolean;
        supportsFragment?: boolean;
        supportsCredentials?: boolean;
        requiresHost?: boolean;
        supportsPort?: boolean;
        requiresUsername?: boolean;
        schemeSeparator?: string;
        defaultPort?: number;
    }
    class SchemaProperties implements ISchemaOption {
        readonly description: string;
        readonly supportsPath: boolean;
        readonly supportsQuery: boolean;
        readonly supportsFragment: boolean;
        readonly supportsCredentials: boolean;
        readonly requiresHost: boolean;
        readonly supportsPort: boolean;
        readonly requiresUsername: boolean;
        readonly defaultPort: number;
        readonly schemeSeparator: string;
        get displayText(): string { return (this.description.length == 0) ? this.name : this.name + " (" + this.description + ")"; }
        constructor(readonly name: string, properties?: ISchemaProperties, description?: string) {
            this.description = (typeof description === "string") ? description.trim() : "";
            if (typeof (properties) === 'undefined' || properties === null) {
                this.supportsPath = true;
                this.supportsQuery = true;
                this.supportsFragment = true;
                this.supportsCredentials = true;
                this.requiresHost = false;
                this.supportsPort = true;
                this.requiresUsername = false;
                this.defaultPort = NaN;
                this.schemeSeparator = "://";
            } else {
                this.supportsPath = (typeof (properties.supportsPath) !== 'boolean' || properties.supportsPath === true);
                this.supportsQuery = (typeof (properties.supportsQuery) !== 'boolean' || properties.supportsQuery === true);
                this.supportsFragment = (typeof (properties.supportsFragment) !== 'boolean' || properties.supportsFragment === true);
                this.supportsCredentials = (typeof (properties.supportsCredentials) !== 'boolean' || properties.supportsCredentials === true);
                this.requiresHost = (typeof (properties.requiresHost) !== 'boolean' || properties.requiresHost === true);
                this.supportsPort = (typeof (properties.supportsPort) !== 'boolean' || properties.supportsPort === true);
                this.requiresUsername = (typeof (properties.requiresUsername) === 'boolean' && properties.requiresUsername === true);
                this.defaultPort = properties.defaultPort;
                this.schemeSeparator = (typeof (properties.schemeSeparator) == 'string') ? properties.schemeSeparator : "://";
            }
        }
        static getSchemaProperties(name: string): SchemaProperties {
            if (name.endsWith(':'))
                name = name.substr(0, name.length - 1);
            switch (name) {
                case 'ftp':
                    return SchemaProperties.uriScheme_ftp;
                case 'ftps':
                    return SchemaProperties.uriScheme_ftps;
                case 'sftp':
                    return SchemaProperties.uriScheme_sftp;
                case 'http':
                    return SchemaProperties.uriScheme_http;
                case 'https':
                    return SchemaProperties.uriScheme_https;
                case 'gopher':
                    return SchemaProperties.uriScheme_gopher;
                case 'mailto':
                    return SchemaProperties.uriScheme_mailto;
                case 'news':
                    return SchemaProperties.uriScheme_news;
                case 'nntp':
                    return SchemaProperties.uriScheme_nntp;
                case 'telnet':
                    return SchemaProperties.uriScheme_telnet;
                case 'wais':
                    return SchemaProperties.uriScheme_wais;
                case 'file':
                    return SchemaProperties.uriScheme_file;
                case 'net.pipe':
                    return SchemaProperties.uriScheme_netPipe;
                case 'net.tcp':
                    return SchemaProperties.uriScheme_netTcp;
                case 'ldap':
                    return SchemaProperties.uriScheme_ldap;
                case 'ssh':
                    return SchemaProperties.uriScheme_ssh;
                case 'git':
                    return SchemaProperties.uriScheme_git;
                case 'urn':
                    return SchemaProperties.uriScheme_urn;
            }
            return new SchemaProperties(name);
        }
        /**
         * File Transfer protocol
         **/
        static readonly uriScheme_ftp: SchemaProperties = new SchemaProperties("ftp", { supportsQuery: false, supportsFragment: false, defaultPort: 21 }, "File Transfer protocol");
        /**
         * File Transfer protocol (secure)
         **/
        static readonly uriScheme_ftps: SchemaProperties = new SchemaProperties("ftps", { supportsQuery: false, supportsFragment: false, defaultPort: 990 }, "File Transfer protocol (secure)");
        /**
         * Secure File Transfer Protocol
         **/
        static readonly uriScheme_sftp: SchemaProperties = new SchemaProperties("sftp", { supportsQuery: false, supportsFragment: false, defaultPort: 22 }, "Secure File Transfer Protocol");
        /**
         * Hypertext Transfer Protocol
         **/
        static uriScheme_http: SchemaProperties = new SchemaProperties("http", { defaultPort: 80 }, "Hypertext Transfer Protocol");
        /**
         * Hypertext Transfer Protocol (secure)
         **/
        static uriScheme_https: SchemaProperties = new SchemaProperties("https", { defaultPort: 443 }, "Hypertext Transfer Protocol (secure)");
        /**
         * Gopher protocol
         **/
        static uriScheme_gopher: SchemaProperties = new SchemaProperties("gopher", { defaultPort: 70 }, "Gopher protocol");
        /**
         * Electronic mail address
         **/
        static uriScheme_mailto: SchemaProperties = new SchemaProperties("mailto", { schemeSeparator: ":" }, "Electronic mail address");
        /**
         * USENET news
         **/
        static uriScheme_news: SchemaProperties = new SchemaProperties("news", { supportsCredentials: false, requiresHost: false, supportsPort: false, schemeSeparator: ":" }, "USENET news")
        /**
         * USENET news using NNTP access
         **/
        static uriScheme_nntp: SchemaProperties = new SchemaProperties("nntp", { defaultPort: 119 }, "USENET news using NNTP access");
        /**
         * Reference to interactive sessions
         **/
        static uriScheme_telnet: SchemaProperties = new SchemaProperties("telnet", { supportsPath: false, supportsQuery: false, supportsFragment: false, supportsCredentials: false, defaultPort: 23 }, "Reference to interactive sessions");
        /**
         * Wide Area Information Servers
         **/
        static uriScheme_wais: SchemaProperties = new SchemaProperties("wais", { defaultPort: 443 }, "Wide Area Information Servers");
        /**
         * Host-specific file names
         **/
        static uriScheme_file: SchemaProperties = new SchemaProperties("file", { supportsQuery: false, supportsFragment: false, supportsCredentials: false, requiresHost: false, supportsPort: false }, "Host-specific file names");
        /**
         * Net Pipe
         **/
        static uriScheme_netPipe: SchemaProperties = new SchemaProperties("net.pipe", { supportsPort: false }, "Net Pipe");
        /**
         * Net-TCP
         **/
        static uriScheme_netTcp: SchemaProperties = new SchemaProperties("net.tcp", { defaultPort: 808 }, "Net-TCP");
        /**
         * Lightweight Directory Access Protocol
         **/
        static uriScheme_ldap: SchemaProperties = new SchemaProperties("ldap", { defaultPort: 389 }, "Lightweight Directory Access Protocol");
        /**
         * Secure Shell
         **/
        static uriScheme_ssh: SchemaProperties = new SchemaProperties("ssh", { defaultPort: 22 }, "Secure Shell");
        /**
         * GIT Respository
         **/
        static uriScheme_git: SchemaProperties = new SchemaProperties("git", { supportsQuery: false, supportsFragment: false, defaultPort: 9418 }, "GIT Respository");
        /**
         * Uniform Resource notation
         **/
        static uriScheme_urn: SchemaProperties = new SchemaProperties("urn", { supportsCredentials: false, requiresHost: false, supportsPort: false, schemeSeparator: ":" }, "Uniform Resource notation");
    }

    /**
     * Represents a URI.
     * @class
     *
     * @property {string} schemeName URI scheme name.
     * @property {string} protocol URI scheme name with the trailing ':'.
     * */
    class UrlBuilder implements URL, IChangeTracking {
        private _isAbsoluteUrl: boolean = false;
        private _isDefaultPort: boolean = true;
        private _scheme: SchemaProperties = new SchemaProperties("");
        private _username?: string;
        private _password?: string;
        private _hostname?: string;
        private _port?: string;
        private _portNumber?: number;
        private _path: UriPathSegmentCollection;
        private _searchParams: UriQueryParams;
        private _fragment?: string;
        private _hasChanges: boolean = false;

        get hasChanges(): boolean { return this._hasChanges || this._path.hasChanges || this._searchParams.hasChanges; }
        set hasChanges(value: boolean) { this._hasChanges = this._path.hasChanges = this._searchParams.hasChanges = value; }

        get isAbsoluteUrl(): boolean { return this._isAbsoluteUrl; }

        get isDefaultPort(): boolean { return this._isDefaultPort; }
        set isDefaultPort(isDefault: boolean) {
            if (isDefault === this._isDefaultPort)
                return;
            if (isDefault) {
                if (!isNaN(this._scheme.defaultPort)) {
                    this._portNumber = this._scheme.defaultPort;
                    this._port = undefined;
                    this._isDefaultPort = true;
                    this._hasChanges = true;
                }
            } else {
                this._isDefaultPort = false;
                if (!isNaN(this._portNumber))
                    this._port = this._portNumber.toString();
                this._hasChanges = true;
            }
        }

        get href(): string {
            throw new Error("Property not implemented.");
        }
        set href(url: string) {
            throw new Error("Property not implemented.");
        }

        get origin(): string { throw new Error("Property not implemented."); }
        set origin(value: string) {
            throw new Error("Property not implemented.");
        }

        get protocol(): string { return (this._scheme.name.length == 0) ? "" : this._scheme.name + this._scheme.schemeSeparator.substr(0, 1); }
        set protocol(value: string) {
            if (value === this._scheme.name)
                return;
            this._scheme = SchemaProperties.getSchemaProperties(value);
            this._isAbsoluteUrl = this._scheme.name.length > 0 || typeof (this._username) === 'string' || typeof (this._password) === 'string' || typeof (this._hostname) === 'string' || typeof (this._port) === 'string';
            this._hasChanges = true;
        }

        get schemeName(): string { return this._scheme.name; }
        set schemeName(value: string) {
            if (value === this._scheme.name)
                return;
            this._scheme = SchemaProperties.getSchemaProperties(value);
            this._isAbsoluteUrl = this._scheme.name.length > 0 || typeof (this._username) === 'string' || typeof (this._password) === 'string' || typeof (this._hostname) === 'string' || typeof (this._port) === 'string';
            this._hasChanges = true;
        }

        get schemeSeparator(): string { return this._scheme.schemeSeparator; }

        get username(): string {
            if (typeof (this._username) === 'string')
                return this._username;
            if (typeof (this._password) === 'string')
                return '';
        }
        set username(value: string) {
            if (this._username === value)
                return;
            this._username = value;
            this._isAbsoluteUrl = this._scheme.name.length > 0 || typeof (this._username) === 'string' || typeof (this._password) === 'string' || typeof (this._hostname) === 'string' || typeof (this._port) === 'string';
            this._hasChanges = true;
        }

        get password(): string { return this._password; }
        set password(value: string) {
            if (this._password === value)
                return;
            this._password = value;
            this._isAbsoluteUrl = this._scheme.name.length > 0 || typeof (this._username) === 'string' || typeof (this._password) === 'string' || typeof (this._hostname) === 'string' || typeof (this._port) === 'string';
            this._hasChanges = true;
        }

        get host(): string {
            if (typeof (this._hostname) === 'string') {
                if (typeof (this._port) === 'string')
                    return this._hostname + ':' + this._port;
                return this._hostname;
            }

            if (typeof (this._port) === 'string')
                return ':' + this._port;

            if (typeof (this._username) === 'string' || typeof (this._password) === 'string' || this._scheme.name.length > 0)
                return '';
        }
        set host(value: string) {
            if (typeof (value) !== 'string') {
                if (typeof (this._hostname) !== 'string')
                    return;
                this._hostname = undefined;
            } else {
                if (this._hostname === value)
                    return;
                let index: number = value.indexOf(':');
                if (index < 0) {
                    this._hostname = value;
                    this._portNumber = this._scheme.defaultPort;
                    this._isDefaultPort = !isNaN(this._portNumber);
                    this._port = undefined;
                } else {
                    this._hostname = value.substr(0, index);
                    this._port = value.substr(index + 1);
                    this._portNumber = parseInt(this._port);
                    this._isDefaultPort = (!isNaN(this._portNumber) && this._portNumber == this._scheme.defaultPort);
                }
            }
            this._isAbsoluteUrl = this._scheme.name.length > 0 || typeof (this._username) === 'string' || typeof (this._password) === 'string' || typeof (this._hostname) === 'string' || typeof (this._port) === 'string';
            this._hasChanges = true;
        }

        get hostname(): string { throw new Error("Property not implemented."); }
        set hostname(value: string) {
            if (typeof (value) !== 'string') {
                if (typeof (this._hostname) !== 'string')
                    return;
                this._hostname = undefined;
            } else {
                if (this._hostname === value)
                    return;
                this._hostname = value;
            }
            this._isAbsoluteUrl = this._scheme.name.length > 0 || typeof (this._username) === 'string' || typeof (this._password) === 'string' || typeof (this._hostname) === 'string' || typeof (this._port) === 'string';
            this._hasChanges = true;
        }

        get port(): string { throw new Error("Property not implemented."); }
        set port(value: string) {
            if (typeof (value) === 'string') {
                if (value === this._port)
                    return;
                this._portNumber = parseInt(value);
                this._isDefaultPort = (!isNaN(this._portNumber) && this._portNumber == this._scheme.defaultPort);
                this._port = value;
            } else {
                if (typeof (this._port) !== 'string')
                    return;
                this._portNumber = this._scheme.defaultPort;
                this._isDefaultPort = !isNaN(this._portNumber);
                this._port = undefined;
            }
            this._isAbsoluteUrl = this._scheme.name.length > 0 || typeof (this._username) === 'string' || typeof (this._password) === 'string' || typeof (this._hostname) === 'string' || typeof (this._port) === 'string';
            this._hasChanges = true;
        }

        get portNumber(): number { return (isNaN(this._portNumber) && typeof (this._port) !== 'string') ? this._scheme.defaultPort : this._portNumber; }
        set portNumber(value: number) {
            throw new Error("Not implemented.")
        }

        get pathname(): string { return this._path.pathString; }
        set pathname(value: string) { this._path.pathString = value; }

        get path(): UriPathSegmentCollection { throw new Error("Property not implemented."); }
        set path(value: UriPathSegmentCollection) {
            this._path = value;
            this._hasChanges = true;
        }

        get search(): string { return this._searchParams.toString(); }
        set search(value: string) { this._searchParams.reset(value); }

        get searchParams(): URLSearchParams { return this._searchParams; }
        set searchParams(value: URLSearchParams) {
            this._searchParams = new UriQueryParams(value);
            this._hasChanges = true;
        }

        get hash(): string { return (typeof (this._fragment) === 'string') ? '#' + this._fragment : ""; }
        set hash(value: string) {
            if (typeof (value) !== 'string' || value.length == 0) {
                if (typeof (this._fragment) !== 'string')
                    return;
                this._fragment = undefined;
            } else {
                if (value.startsWith("#"))
                    value = value.substr(1);
                if (value === this._fragment)
                    return;
                this._fragment = value;
            }
            this._hasChanges = true;
        }

        get fragment(): string | undefined { return this._fragment;; }
        set fragment(value: string | undefined) {
            if (typeof (value) !== 'string') {
                if (typeof (this._fragment) !== 'string')
                    return;
                this._fragment = undefined;
            } else {
                if (value === this._fragment)
                    return;
                this._fragment = value;
            }
            this._hasChanges = true;
        }

        toString(): string { return this.href; }
        toJSON(): string { return JSON.stringify(this.href); }
    }

    /**
     * Represents a path segment.
     * @interface
     *
     * @property {string} separator leading separator character.
     * @property {string} name name of the path segment.
     * */
    interface UriBuilderPathSegment {
        separator: string;
        name: string;
    }

    app.mainModule.controller("UriBuilderController", ['$scope', UriBuilderController]);
}
