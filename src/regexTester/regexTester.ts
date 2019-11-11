/// <reference path="../Scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="../Scripts/typings/angularjs/angular-route.d.ts"/>
/// <reference path="../Scripts/typings/bootstrap/index.d.ts"/>
/// <reference path="../app.ts"/>

/**
 * The commonjs module corresponding to the MyGitHubPages.regexTester angular js module.
 * @module regexTester
 */
module regexTester {
    /**
     * Regular expression option flags.
     * @export
     * @class RegexFlags
     */
    export class RegexFlags {
        private _global = false;
        private _ignoreCase = false;
        private _multiline = false;
        private _unicode = false;
        private _sticky = false;
        private _flags = '';

        /**
         * Global pattern match.
         * @readonly
         * @type {boolean}
         * @memberof RegexFlags
         */
        get global(): boolean { return this._global; }

        /**
         * Returns a RegexFlags object with the specified global flag value, creating a new RegexFlags object if the global flag is
         *     different.
         * @param {boolean} value - The value for the global flag.
         * @returns {RegexFlags} A RegexFlags object with the specified global flag value.
         * @memberof RegexFlags
         */
        setGlobal(value: boolean): RegexFlags {
            if ((value = value === true) === this._global)
                return this;
            return new RegexFlags((value) ? this._flags + 'g' : this._flags.replace('g', ''));
        }

        /**
         * Case-insensitive pattern matching.
         * @readonly
         * @type {boolean}
         * @memberof RegexFlags
         */
        get ignoreCase(): boolean { return this._ignoreCase; }

        /**
         * Returns a RegexFlags object with the specified ignoreCase flag value, creating a new RegexFlags object if the ignoreCase flag
         *     is different.
         * @param {boolean} value - The value for the ignoreCase flag.
         * @returns {RegexFlags} A RegexFlags object with the specified ignoreCase flag value.
         * @memberof RegexFlags
         */
        setIgnoreCase(value: boolean): RegexFlags {
            if ((value = value === true) === this._ignoreCase)
                return this;
            return new RegexFlags((value) ? this._flags + 'i' : this._flags.replace('i', ''));
        }

        /**
         * Multi-line pattern matching.
         * @readonly
         * @type {boolean}
         * @memberof RegexFlags
         */
        get multiline(): boolean { return this._multiline; }

        /**
         * Returns a RegexFlags object with the specified multiline flag value, creating a new RegexFlags object if the multiline flag is
         *     different.
         * @param {boolean} value - The value for the multiline flag.
         * @returns {RegexFlags} A RegexFlags object with the specified multiline flag value.
         * @memberof RegexFlags
         */
        setMultiline(value: boolean): RegexFlags {
            if ((value = value === true) === this._multiline)
                return this;
            return new RegexFlags((value) ? this._flags + 'm' : this._flags.replace('m', ''));
        }

        /**
         * Unicode regex option flag.
         * @readonly
         * @type {boolean}
         * @memberof RegexFlags
         */
        get unicode(): boolean { return this._unicode; }

        /**
         * Returns a RegexFlags object with the specified unicode flag value, creating a new RegexFlags object if the unicode flag is
         *     different.
         * @param {boolean} value - The value for the unicode flag.
         * @returns {RegexFlags} A RegexFlags object with the specified global unicode value.
         * @memberof RegexFlags
         */
        setUnicode(value: boolean): RegexFlags {
            if ((value = value === true) === this._unicode)
                return this;
            return new RegexFlags((value) ? this._flags + 'u' : this._flags.replace('u', ''));
        }

        /**
         * Value of the sticky regex option.
         * @readonly
         * @type {boolean}
         * @memberof RegexFlags
         */
        get sticky(): boolean { return this._sticky; }

        /**
         * Returns a RegexFlags object with the specified sticky flag value, creating a new RegexFlags object if the sticky flag is
         *     different.
         * @param {boolean} value - The value for the sticky flag.
         * @returns {RegexFlags} A RegexFlags object with the specified sticky flag value.
         * @memberof RegexFlags
         */
        setSticky(value: boolean): RegexFlags {
            if ((value = value === true) === this._sticky)
                return this;
            return new RegexFlags((value) ? this._flags + 'y' : this._flags.replace('y', ''));
        }

        /**
         * String value of regex option flags.
         * @readonly
         * @type {string}
         * @memberof RegexFlags
         */
        get flags(): string { return this._flags; }

        /**
         * Creates an instance of RegexFlags.
         * @param {(string | RegExp)} [flags] - String value of regex flags or a RegExp object.
         * @memberof RegexFlags
         */
        constructor(flags?: string | RegExp) {
            if (typeof flags === 'object') {
                if (flags !== null) {
                    this._flags = ((this._global = flags.global) === true) ? 'g' : '';
                    if ((this._ignoreCase = flags.ignoreCase) == true)
                        this._flags += 'i';
                    if ((this._multiline = flags.multiline) == true)
                        this._flags += 'm';
                    if ((this._unicode = flags.unicode) == true)
                        this._flags += 'u';
                    if ((this._unicode = flags.sticky) == true)
                        this._flags += 'y';
                    return;
                }
            } else if (typeof flags === 'string' && flags.trim().length > 0) {
                const allFlags = 'gimuy';
                let arr: { i: number; c: string; }[] = ['g', 'i', 'm', 'u', 'y'].map((value: string) => {
                    return { i: flags.indexOf(value), c: value };
                });
                this._global = arr[0].i > -1;
                this._ignoreCase = arr[1].i > -1;
                this._multiline = arr[2].i > -1;
                this._unicode = arr[3].i > -1;
                this._sticky = arr[4].i > -1;
                if ((arr = arr.filter((value: { i: number; c: string; }) => value.i > -1)).length == 0)
                    this._flags = '';
                else if (arr.length == 1)
                    this._flags = arr[0].c;
                else
                    this._flags = arr.filter((value: { i: number; c: string; }) => value.i > -1)
                        .sort((a: { i: number; c: string; }, b: { i: number; c: string; }) => a.i - b.i)
                        .reduce((previousValue: { i: number; c: string; }, currentValue: { i: number; c: string; }) => {
                            if (previousValue.i == currentValue.i)
                                return previousValue;
                            return { i: currentValue.i, c: previousValue.c + currentValue.c };
                        }).c;
                return;
            }
            this._global = this._ignoreCase = this._multiline = this._sticky = this._sticky = false;
            this._flags = '';
        }
    }

    export class JsLine {
        private static _re: RegExp = /^[^\r\n]*(\r\n?|\n)/;
        get text(): string { return this._text; }
        get lineNumber(): number { return this._lineNumber; }
        constructor(private _text: string, private _lineNumber: number) { }
        static toJsLines(source: string): JsLine[] {
            if (typeof source !== 'string')
                return [new JsLine('null', 0)];
            if (source.length == 0)
                return [new JsLine('""', 1)];
            const lines: JsLine[] = [];
            let lineNumber = 1;
            for (let m: RegExpMatchArray = source.match(JsLine._re); typeof m === 'object' && m !== null; m = source.match(JsLine._re)) {
                lines.push(new JsLine(JSON.stringify(m[0]), lineNumber++));
                source = source.substr(m[0].length);
            }
            if (source.length > 0)
                lines.push(new JsLine(JSON.stringify(source), lineNumber));
            return lines;
        }
    }

    export class SplitTextInfo {
        private _text: JsLine[];
        get groupNumber(): number { return this._groupNumber; }
        get text(): JsLine[] { return this._text; }
        constructor(private _groupNumber: number, text?: string | null) {
            this._text = JsLine.toJsLines(text);
        }
    }

    export class MatchGroup extends SplitTextInfo {
        private _isMatch: boolean;
        get isMatch(): boolean { return this._isMatch; }
        constructor(groupNumber: number, text?: string | null) {
            super(groupNumber, text);
            this._isMatch = (typeof text === 'string');
        }
    }

    /**
     * Class to track changes to a value.
     * @class
     * @template T - The type of value to be tracked.
     */
    export class ValueVersion<V> {
        private _equalityCb: (x: V, y: V) => boolean;
        private _versionToken: symbol = Symbol();
        private _isResolved;
        private _reason?: any;

        /**
         * Gets or sets the current value.
         * @memberof ValueVersion;
         * @type {V}
         */
        get value(): V | undefined { return this._value; }

        get isResolved(): boolean { return this._isResolved; }

        get reason(): any | undefined { return this._reason; }

        /**
         * Gets a symbol that is used to track when the associated value has changed.
         * @memberof ValueVersion;
         * @type {symbol}
         */
        get versionToken(): symbol { return this._versionToken; }

        get name(): string { return this._name; }

        constructor(private _name: string, private _value?: V, equalityCb?: (x: V, y: V) => boolean) {
            this._equalityCb = (typeof equalityCb === 'function') ? equalityCb : function (x: V, y: V) {
                return x === y;
            };
            if (typeof _value === 'undefined') {
                this._isResolved = false;
                this._reason = 'Value not defined';
            } else
                this._isResolved = true;
        }

        resolve(value?: V) {
            if (!this._isResolved) {
                this._reason = undefined;
                this._isResolved = true;
            } else if (this._equalityCb(this._value, value) === true)
                return;
            this._value = value;
            this._versionToken = Symbol();
        }

        reject(reason?: any): void {
            if (this._isResolved)
                this._isResolved = false;
            else if (this._reason === reason)
                return;
            this._isResolved = false;
            this._reason = reason;
            this._versionToken = Symbol();
        }

        getValueAsync($q: ng.IQService): ng.IPromise<{ value: V; token: symbol; }> {
            const current: ValueVersion<V> = this;
            return $q(function(resolve: ng.IQResolveReject<{ value: V; token: symbol; }>, reject: ng.IQResolveReject<any>): void {
                if (current._isResolved)
                    resolve({ value: current._value, token: current._versionToken });
                else
                    reject(current._reason);
            });
        }
    }

    export class ValueProducer<R> extends ValueVersion<R> {
        private _tokens?: symbol[];
        private _isComponentError = false;
        get isComponentError(): boolean { return this._isComponentError; }
        private constructor(name: string,
            private readonly _resolver: (resolve: ng.IQResolveReject<R>, reject: ng.IQResolveReject<any>,
                    ...componentValues: any[]) => void,
                    private readonly _components: ValueVersion<any>[],
                    equalityCb?: (x: R, y: R) => boolean, private readonly _thisArg?: any) {
            super(name, undefined, equalityCb);
        }
        static create<V0, V1, V2, R>(name: string, resolver: (resolve: ng.IQResolveReject<R>,
                reject: ng.IQResolveReject<any>, v0: V0, v1: V1, v2: V2) => void,
            equalityCb: (x: R, y: R) => boolean, c0: ValueVersion<V0>, c1: ValueVersion<V1>, c2: ValueVersion<V2>): ValueProducer<R>;
        static create<V0, V1, V2, R>(name: string, resolver: (resolve: ng.IQResolveReject<R>,
                reject: ng.IQResolveReject<any>, v0: V0, v1: V1, v2: V2) => void,
            c0: ValueVersion<V0>, c1: ValueVersion<V1>, c2: ValueVersion<V2>): ValueProducer<R>;
        static create<V0, V1, R>(name: string, resolver: (resolve: ng.IQResolveReject<R>,
                reject: ng.IQResolveReject<any>, v0: V0, v1: V1) => void,
            equalityCb: (x: R, y: R) => boolean, c0: ValueVersion<V0>, c1: ValueVersion<V1>): ValueProducer<R>;
        static create<V0, V1, R>(name: string, resolver: (resolve: ng.IQResolveReject<R>,
                reject: ng.IQResolveReject<any>, v0: V0, v1: V1) => void, c0: ValueVersion<V0>, c1: ValueVersion<V1>): ValueProducer<R>;
        static create<C, R>(name: string, resolver: (resolve: ng.IQResolveReject<R>, reject: ng.IQResolveReject<any>, cv: C) => void,
            equalityCb: (x: R, y: R) => boolean, component: ValueVersion<C>): ValueProducer<R>;
        static create<C, R>(name: string, resolver: (resolve: ng.IQResolveReject<R>, reject: ng.IQResolveReject<any>, cv: C) => void,
            component: ValueVersion<C>): ValueProducer<R>;
        static create<R>(name: string, resolver: (resolve: ng.IQResolveReject<R>, reject: ng.IQResolveReject<any>,
                    ...componentValues: any[]) => void,
                arg1: ValueVersion<any> | ((x: R, y: R) => boolean), ...components: ValueVersion<any>[]): ValueProducer<R> {
            if (typeof arg1 === 'function')
                return new ValueProducer<R>(name, resolver, components, arg1);
            if (typeof components !== 'object' || components === null || components.length == 0)
                return new ValueProducer<R>(name, resolver, [arg1]);
            return new ValueProducer<R>(name, resolver, [arg1].concat(components));
        }
        static createResolveWith<T, V0, V1, V2, R>(thisArg: T, name: string, resolver: (resolve: ng.IQResolveReject<R>,
                reject: ng.IQResolveReject<any>, v0: V0, v1: V1, v2: V2) => void,
            equalityCb: (x: R, y: R) => boolean, c0: ValueVersion<V0>, c1: ValueVersion<V1>, c2: ValueVersion<V2>): ValueProducer<R>;
        static createResolveWith<T, V0, V1, V2, R>(thisArg: T, name: string, resolver: (resolve: ng.IQResolveReject<R>,
                reject: ng.IQResolveReject<any>, v0: V0, v1: V1, v2: V2) => void,
            c0: ValueVersion<V0>, c1: ValueVersion<V1>, c2: ValueVersion<V2>): ValueProducer<R>;
        static createResolveWith<T, V0, V1, R>(thisArg: T, name: string, resolver: (resolve: ng.IQResolveReject<R>,
                reject: ng.IQResolveReject<any>, v0: V0, v1: V1) => void,
            equalityCb: (x: R, y: R) => boolean, c0: ValueVersion<V0>, c1: ValueVersion<V1>): ValueProducer<R>;
        static createResolveWith<T, V0, V1, R>(thisArg: T, name: string, resolver: (resolve: ng.IQResolveReject<R>,
                reject: ng.IQResolveReject<any>, v0: V0, v1: V1) => void, c0: ValueVersion<V0>, c1: ValueVersion<V1>): ValueProducer<R>;
        static createResolveWith<T, C, R>(thisArg: T, name: string, resolver: (resolve: ng.IQResolveReject<R>,
                reject: ng.IQResolveReject<any>, cv: C) => void,
            equalityCb: (x: R, y: R) => boolean, component: ValueVersion<C>): ValueProducer<R>;
        static createResolveWith<T, C, R>(thisArg: T, name: string, resolver: (resolve: ng.IQResolveReject<R>,
                reject: ng.IQResolveReject<any>, cv: C) => void,
            component: ValueVersion<C>): ValueProducer<R>;
        static createResolveWith<T, R>(thisArg: T, name: string, resolver: (resolve: ng.IQResolveReject<R>, reject: ng.IQResolveReject<any>,
                    ...componentValues: any[]) => void,
                arg1: ValueVersion<any> | ((x: R, y: R) => boolean), ...components: ValueVersion<any>[]): ValueProducer<R> {
            if (typeof arg1 === 'function')
                return new ValueProducer<R>(name, resolver, components, arg1, thisArg);
            if (typeof components !== 'object' || components === null || components.length == 0)
                return new ValueProducer<R>(name, resolver, [arg1], undefined, thisArg);
            return new ValueProducer<R>(name, resolver, [arg1].concat(components), undefined, thisArg);
        }
        getValueAsync($q: ng.IQService): ng.IPromise<{ value: R; token: symbol; }> {
            const current: ValueProducer<R> = this;
            if (this._components.length < 2)
                return this._components[0].getValueAsync($q).then(
                    function(cr: { value: any; token: symbol; }): ng.IPromise<{ value: R; token: symbol; }> {
                        return $q<{ value: R; token: symbol; }>(
                            function(resolve: ng.IQResolveReject<{ value: R; token: symbol; }>, reject: ng.IQResolveReject<any>): void {
                                current._update(resolve, reject, [cr]);
                            }
                        );
                    },
                    function(reason?: any): any {
                        return $q(function(resolve: ng.IQResolveReject<{ value: R; token: symbol; }>,
                                reject: ng.IQResolveReject<any>): void {
                            if (typeof reason === 'undefined')
                                reject(current._onRejectedComponents());
                            else
                                reject(current._onRejectedComponents(reason));
                        });
                    }
                );
            return $q.all<{ value: any; token: symbol; }>(this._components.map(
                function(c: ValueVersion<any>): ng.IPromise<{ value: any; token: symbol; }> {
                    return c.getValueAsync($q);
                }
            )).then<{ value: R; token: symbol; }>(
                function(cr: { value: any; token: symbol; }[]): ng.IPromise<{ value: R; token: symbol; }> {
                    return $q<{ value: R; token: symbol; }>(
                        function(resolve: ng.IQResolveReject<{ value: R; token: symbol; }>, reject: ng.IQResolveReject<any>): void {
                            current._update(resolve, reject, cr);
                        }
                    );
                },
                function(reason?: any): any {
                    return $q(function(resolve: ng.IQResolveReject<{ value: R; token: symbol; }>, reject: ng.IQResolveReject<any>): void {
                        if (typeof reason === 'undefined')
                            reject(current._onRejectedComponents());
                        else
                            reject(current._onRejectedComponents(reason));
                    });
                }
            );
        }
        _update(resolve: ng.IQResolveReject<{ value: R; token: symbol; }>, reject: ng.IQResolveReject<any>,
                cr: { value: any; token: symbol; }[]): void {
            this._isComponentError = false;
            const tokens: symbol[] = cr.map(function(v: { value: any; token: symbol; }): symbol { return v.token; });
            let hasChange = typeof this._tokens === 'undefined';
            if (!hasChange)
                for (let i = 0; i < tokens.length; i++) {
                    if (tokens[i] !== this._tokens[i]) {
                        hasChange = true;
                        break;
                    }
                }
            if (hasChange) {
                this._tokens = tokens;
                const current: ValueProducer<R> = this;
                this._resolver.apply(this._thisArg, [
                    function(result?: R): void {
                        current.resolve(result);
                        resolve({ value: current.value, token: current.versionToken });
                    },
                    function(reason?: any): void {
                        if (arguments.length == 0)
                            current.reject();
                        else
                            current.reject(reason);
                        if (typeof current.reason === 'undefined')
                            reject();
                        else
                            reject(current.reason);
                    }].concat(cr.map(function(v: { value: any; token: symbol; }): any { return v.value; }))
                );
            } else if (this.isResolved)
                resolve({ value: this.value, token: this.versionToken });
            else if (typeof this.reason === 'undefined')
                reject();
            else
                reject(this.reason);
        }
        _onRejectedComponents(reason?: any): any {
            this._isComponentError = true;
            let rejectedComponents: ValueVersion<any>[] = this._components.filter(function(c: ValueVersion<any>): boolean {
                return !c.isResolved;
            });
            if (rejectedComponents.length == 0)
                rejectedComponents = this._components;
            if (rejectedComponents.length == 1)
                this.reject({
                    message: rejectedComponents[0].name + ' has error',
                    reason: reason
                });
            else
                this.reject({
                    message: 'The following components have errors: ' + rejectedComponents.map(function(c: ValueVersion<any>): string {
                        return c.name;
                    }).join(', '),
                    reason: reason
                });
            return this.reason;
        }
    }

    /**
     * Service for parsing regular expression patterns.
     * @export
     * @class RegexParserService
     */
    export class RegexParserService {
        // private _parseId: symbol;
        private _flags: ValueVersion<RegexFlags> = new ValueVersion<RegexFlags>('Flags', new RegexFlags(),
            function (x: RegexFlags, y: RegexFlags): boolean {
                if (typeof x !== 'object')
                    return typeof y !== 'object';
                if (typeof y !== 'object')
                    return false;
                if (x === null)
                    return y === null;
                return y !== null && (x.flags === y.flags || (x.global === y.global && x.ignoreCase === y.ignoreCase &&
                    x.multiline === y.multiline && x.unicode === y.unicode && x.sticky === y.sticky));
            });
        private _pattern: ValueVersion<string> = new ValueVersion<string>('Pattern Text', '(?:)');
        private _regex: ValueProducer<RegExp>;
        private _inputText: ValueVersion<string> = new ValueVersion<string>('Input Text', '');
        private _matchGroups: ValueProducer<RegExpMatchArray>;
        private _replaceWith: ValueVersion<string> = new ValueVersion<string>('Replacement Text', '');
        private _replacedText: ValueProducer<string>;
        private _splitLimit: ValueVersion<number> = new ValueVersion<number>('Split Limit', NaN);
        private _splitText: ValueProducer<string[]>;

        readonly [Symbol.toStringTag]: string = app.ServiceNames.regexParser;

        /**
         * Creates an instance of RegexParserService.
         * @param {ng.IRootScopeService} $rootScope
         * @param {app.SupplantableTaskService} supplantablePromiseChainService
         * @memberof RegexParserService
         */
        constructor(private readonly $rootScope: ng.IRootScopeService) {
            this._regex = ValueProducer.create<RegexFlags, string, RegExp>('Regular Expression',
                function(resolve: ng.IQResolveReject<RegExp>, reject: ng.IQResolveReject<any>, flags: RegexFlags, s: string): void {
                    let r: RegExp;
                    let reason: any;
                    try { r = new RegExp(s, flags.flags); } catch (e) { reason = e; }
                    if (typeof r === 'object' && r !== null)
                        resolve(r);
                    else
                        reject((typeof reason === 'undefined') ? 'Invalid pattern' : reason);
                }, function(x: RegExp, y: RegExp): boolean {
                    if (typeof x !== 'object' || x === null)
                        return typeof y !== 'object' || y === null;
                    return typeof y === 'object' && y !== null && x.source === y.source && x.global === y.global &&
                        x.ignoreCase === y.ignoreCase && x.multiline === y.multiline && x.unicode === y.unicode &&
                        x.sticky === y.sticky;
                }, this._flags, this._pattern);
            this._matchGroups = ValueProducer.create<RegExp, string, RegExpMatchArray>('Match Groups',
                function(resolve: ng.IQResolveReject<RegExpMatchArray>, reject: ng.IQResolveReject<any>, expr: RegExp, s: string): void {
                        let r: RegExpMatchArray | null;
                        let reason: any;
                        try { r = s.match(expr); } catch (e) { reason = e; }
                        if (typeof r === 'object' && r !== null)
                            resolve(r);
                        else
                            reject((typeof reason === 'undefined') ? 'Match failed' : reason);
                }, function(x: RegExpMatchArray, y: RegExpMatchArray): boolean {
                    if (typeof x !== 'object' || x === null)
                        return typeof y !== 'object' || y === null;
                    if (typeof y !== 'object' || y === null || x.index != y.index || x.length != y.length)
                        return false;
                    for (let i = 0; i < x.length; i++) {
                        if (x[i] !== y[i])
                            return false;
                    }
                    return true;
                }, this._regex, this._inputText);
            this._replacedText = ValueProducer.create<RegExp, string, string, string>('Replaced Text',
                function(resolve: ng.IQResolveReject<string>, reject: ng.IQResolveReject<any>, regex: RegExp, s: string, r: string): void {
                    let t: string;
                    let reason: any;
                    try { t = s.replace(regex, r); } catch (e) { reason = e; }
                    if (typeof t !== 'string')
                        reject((typeof reason === 'undefined') ? 'Match failed' : reason);
                    else if (t === s)
                        reject('Nothing replaced');
                    else
                        resolve(t);
                }, this._regex, this._inputText, this._replaceWith);
            this._splitText = ValueProducer.create<RegExp, string, number, string[]>('Split Text',
                function(resolve: ng.IQResolveReject<string[]>, reject: ng.IQResolveReject<any>,
                        regex: RegExp, s: string, l: number): void {
                    let r: string[];
                    let reason: any;
                    try {
                        if (isNaN(l))
                            r = s.split(regex);
                        else
                            r = s.split(regex, l);
                    } catch (e) { reason = e; }
                    if (typeof r !== 'object' || r === null)
                        reject((typeof reason === 'undefined') ? 'Match failed' : reason);
                    else if (r.length == 1)
                        reject('Nothing matched');
                    else
                        resolve(r);
                }, function(x: string[], y: string[]): boolean {
                    if (typeof x !== 'object' || x === null)
                        return typeof y !== 'object' || y === null;
                    if (typeof y !== 'object' || y === null || x.length != y.length)
                        return false;
                    for (let i = 0; i < x.length; i++) {
                        if (x[i] !== y[i])
                            return false;
                    }
                    return true;
                }, this._regex, this._inputText, this._splitLimit);
        }

        /**
         * Gets or sets the regular expression options flags.
         * @param {(RegexFlags | string)} [value] - The new regular expression options flags to use.
         * @returns {RegexFlags} - The current regular expression options flags.
         * @memberof RegexParserService
         */
        flags(value?: RegexFlags | string): RegexFlags {
            switch (typeof value) {
                case 'string':
                    this._flags.resolve(new RegexFlags(<string>value));
                    break;
                case 'object':
                if (value != null)
                        this._flags.resolve(<RegexFlags>value);
                    break;
            }

            return this._flags.value;
        }

        /**
         * Gets or sets the global regular expression option flag.
         * @param {boolean} [value] - The new value for the global regular expression option flag.
         * @returns {boolean} The current global regular expression option flag.
         * @memberof RegexParserService
         */
        global(value?: boolean): boolean {
            if (typeof value === 'boolean' && value !== this._flags.value.global)
                this.flags(this._flags.value.setGlobal(value));
            return this._flags.value.global;
        }

        /**
         * Gets or sets the ignoreCase regular expression option flag.
         * @param {boolean} [value] - The new value for the ignoreCase regular expression option flag.
         * @returns {boolean} The current v regular expression option flag.
         * @memberof RegexParserService
         */
        ignoreCase(value?: boolean): boolean {
            if (typeof value === 'boolean' && value !== this._flags.value.ignoreCase)
                this.flags(this._flags.value.setIgnoreCase(value));
            return this._flags.value.ignoreCase;
        }

        /**
         * Gets or sets the multiline regular expression option flag.
         * @param {boolean} [value] - The new value for the multiline regular expression option flag.
         * @returns {boolean} The current multiline regular expression option flag.
         * @memberof RegexParserService
         */
        multiline(value?: boolean): boolean {
            if (typeof value === 'boolean' && value !== this._flags.value.multiline)
                this.flags(this._flags.value.setMultiline(value));
            return this._flags.value.multiline;
        }

        /**
         * Gets or sets the sticky regular expression option flag.
         * @param {boolean} [value] - The new value for the sticky regular expression option flag.
         * @returns {boolean} The current sticky regular expression option flag.
         * @memberof RegexParserService
         */
        sticky(value?: boolean): boolean {
            if (typeof value === 'boolean' && value !== this._flags.value.sticky)
                this.flags(this._flags.value.setSticky(value));
            return this._flags.value.sticky;
        }

        /**
         * Gets or sets the unicode regular expression option flag.
         * @param {boolean} [value] - The new value for the unicode regular expression option flag.
         * @returns {boolean} The current unicode regular expression option flag.
         * @memberof RegexParserService
         */
        unicode(value?: boolean): boolean {
            if (typeof value === 'boolean' && value !== this._flags.value.unicode)
                this.flags(this._flags.value.setUnicode(value));
            return this._flags.value.unicode;
        }

        /**
         * Gets or sets the regular expression pattern.
         * @param {string} [value] - The new regular expression pattern.
         * @returns {string} The current regular expression pattern.
         * @memberof RegexParserService
         */
        pattern(value?: string): string {
            if (typeof value !== 'string')
                this._pattern.resolve(value);
            return this._pattern.value;
        }

        inputText(value?: string): string {
            if (typeof value !== 'string')
                this._inputText.resolve(value);
            return this._inputText.value;
        }

        replaceWith(value?: string): string {
            if (typeof value !== 'string')
                this._replaceWith.resolve(value);
            return this._replaceWith.value;
        }

        splitLimit(value?: number): number {
            if (typeof value !== 'number')
                this._splitLimit.resolve(value);
            return this._splitLimit.value;
        }

        matchGroups(): ValueProducer<RegExpMatchArray> { return this._matchGroups; }

        replacedText(): ValueProducer<string> { return this._replacedText; }

        splitText(): ValueProducer<string[]> { return this._splitText; }

        /**
         * Gets or sets the Regular Expression object.
         * @param {RegExp} [value] - The new Regular Expression object.
         * @returns {RegExp} The current Regular Expression object.
         * @memberof RegexParserService
         */
        regex(): ValueProducer<RegExp> { return this._regex; }
    }

    /**
     * Defines the scope common to all regular expression controllers.
     * @export
     * @interface IRegexControllerScope
     * @extends {ng.IScope}
     */
    export interface IRegexControllerScope extends ng.IScope {
        flags: string;
        parseErrorMessage: string;
        showParseError: boolean;
        inputLines: JsLine[];
        success: boolean;
        evaluationErrorMessage: string;
        showEvaluationError: boolean;
    }

    export abstract class RegexController<TScope extends IRegexControllerScope> implements ng.IController {
        abstract readonly [Symbol.toStringTag]: string;
        private _regexToken: symbol = Symbol();

        get global(): boolean { return this.regexParser.global(); }
        set global(value: boolean) {
            this.regexParser.global(value);
            this.onFlagsChange();
        }

        get ignoreCase(): boolean { return this.regexParser.ignoreCase(); }
        set ignoreCase(value: boolean) {
            this.regexParser.ignoreCase(value);
            this.onFlagsChange();
        }

        get multiline(): boolean { return this.regexParser.multiline(); }
        set multiline(value: boolean) {
            this.regexParser.multiline(value);
            this.onFlagsChange();
        }

        get unicode(): boolean { return this.regexParser.unicode(); }
        set unicode(value: boolean) {
            this.regexParser.unicode(value);
            this.onFlagsChange();
        }

        get sticky(): boolean { return this.regexParser.sticky(); }
        set sticky(value: boolean) {
            this.regexParser.sticky(value);
            this.onFlagsChange();
        }

        get pattern(): string { return this.regexParser.pattern(); }
        set pattern(value: string) {
            this.regexParser.pattern(value);
            this.raiseRegexChange();
        }

        get inputText(): string { return this.regexParser.inputText(); }
        set inputText(value: string) {
            this.regexParser.inputText(value);
            this.$scope.inputLines = JsLine.toJsLines(this.regexParser.inputText());
            this.onRegexChange();
        }

        /**
         * Creates an instance of RegexController.
         * @param {IRegexMatchControllerScope} $scope - The scope object for the current controller.
         * @param {app.PageLocationService} pageLocationService
         * @memberof RegexMatchController
         */
        constructor(protected readonly $scope: TScope, protected readonly $q: ng.IQService,
                protected readonly regexParser: RegexParserService,
                protected readonly pageLocationService: app.PageLocationService, subTitle: string) {
            pageLocationService.pageTitle('Regular Expression Evaluator', subTitle);
            $scope.showParseError = false;
            $scope.showEvaluationError = false;
            $scope.parseErrorMessage = '';
            $scope.evaluationErrorMessage = '';
            $scope.inputLines = JsLine.toJsLines(regexParser.inputText());
            this.onFlagsChange();
        }

        private raiseRegexChange(): void {
            const ctrl: RegexController<TScope> = this;
            this.regexParser.regex().getValueAsync(this.$q).then(
                function(result: { value: RegExp, token: symbol }): void {
                    if (ctrl._regexToken !== result.token) {
                        ctrl._regexToken = result.token;
                        ctrl.$scope.parseErrorMessage = '';
                        ctrl.$scope.showParseError = false;
                        ctrl.onRegexChange();
                    }
                },
                function(reason: any): void {
                    if (ctrl._regexToken !== ctrl.regexParser.regex().versionToken) {
                        ctrl._regexToken = ctrl.regexParser.regex().versionToken;
                        ctrl.$scope.parseErrorMessage = (typeof reason === 'undefined') ? '' :
                            ((typeof reason === 'string') ? reason : JSON.stringify(reason));
                        if (ctrl.$scope.parseErrorMessage.trim().length == 0)
                            ctrl.$scope.parseErrorMessage = 'Pattern parse error';
                        ctrl.$scope.showParseError = true;
                        ctrl.onRegexChange();
                    }
                }
            );
        }

        protected abstract onRegexChange(): void;

        private onFlagsChange(): void {
            this.$scope.flags = this.regexParser.flags().flags;
            this.raiseRegexChange();
        }

        protected setEvalSuccess() {
            this. $scope.showEvaluationError = false;
            this.$scope.evaluationErrorMessage = '';
            this.$scope.success = true;
        }
        protected setEvalFail(reason: any) {
            this. $scope.showEvaluationError = true;
            this.$scope.evaluationErrorMessage = (typeof reason === 'undefined') ? '' :
                ((typeof reason === 'string') ? reason :
                    ((typeof reason === 'object' && reason instanceof Error) ? '' + reason : JSON.stringify(reason)));
            this.$scope.success = false;
        }

        $doCheck(): void { }
    }
    /**
     * The scope object for the regular expresssion pattern matching controller.
     * @export
     * @interface IRegexMatchControllerScope
     * @extends {IRegexControllerScope}
     */
    export interface IRegexMatchControllerScope extends IRegexControllerScope {
        groups: MatchGroup[];
        matchIndex: number;
    }

    /**
     * The regular expresssion pattern matching controller.
     * @export
     * @class RegexMatchController
     * @implements {ng.IController}
     */
    export class RegexMatchController extends RegexController<IRegexMatchControllerScope> {
        readonly [Symbol.toStringTag]: string = app.ControllerNames.regexMatch;
        private _groupsToken: symbol;

        /**
         * Creates an instance of RegexMatchController.
         * @param {IRegexMatchControllerScope} $scope - The scope object for the current controller.
         * @param {ng.IQService} $q - Asynchronous processing service.
         * @param {RegexParserService} regexParser - Regular expression parsing service.
         * @param {app.PageLocationService} pageLocationService - Page location service.
         * @memberof RegexMatchController
         */
        constructor($scope: IRegexMatchControllerScope, $q: ng.IQService, regexParser: RegexParserService,
                pageLocationService: app.PageLocationService) {
            super($scope, $q, regexParser, pageLocationService, 'Match');
            pageLocationService.regexHref(app.NavPrefix + app.ModulePaths.regexMatch);
        }
        protected onRegexChange(): void {
            const ctrl: RegexMatchController = this;
            this.regexParser.matchGroups().getValueAsync(this.$q).then(
                function(result: { value: RegExpMatchArray; token: symbol; }): void {
                    if (ctrl._groupsToken !== result.token) {
                        ctrl._groupsToken = result.token;
                        ctrl.$scope.groups = [];
                        ctrl.$scope.matchIndex = result.value.index;
                        for (let n = 0; n < result.value.length; n++)
                            ctrl.$scope.groups.push(new MatchGroup(n, result.value[n]));
                        ctrl.setEvalSuccess();
                    }
                },
                function(reason: any): void {
                    if (ctrl._groupsToken !== ctrl.regexParser.matchGroups().versionToken) {
                        ctrl._groupsToken = ctrl.regexParser.matchGroups().versionToken;
                        if (ctrl.regexParser.matchGroups().isComponentError)
                            return;
                        ctrl.$scope.groups = [];
                        ctrl.$scope.matchIndex = -1;
                        ctrl.setEvalFail(reason);
                    }
                }
            );
        }
    }

    /**
     * The scope object for the regular expresssion text replacement controller.
     * @export
     * @interface IRegexReplaceControllerScope
     * @extends {IRegexControllerScope}
     */
    export interface IRegexReplaceControllerScope extends IRegexControllerScope {
        replaceWithLines: JsLine[];
        replacedLines: JsLine[];
    }

    /**
     * The regular expresssion text replacement controller.
     * @export
     * @class RegexReplaceController
     * @implements {ng.IController}
     */
    export class RegexReplaceController extends RegexController<IRegexReplaceControllerScope> {
        private _replacedLinesToken: symbol = Symbol();

        readonly [Symbol.toStringTag]: string = app.ControllerNames.regexMatch;

        get replaceWith(): string { return this.regexParser.replaceWith(); }
        set replaceWith(value: string) {
            this.regexParser.replaceWith(value);
            this.$scope.replaceWithLines = JsLine.toJsLines(this.regexParser.replaceWith());
            this.onRegexChange();
        }

        /**`
         * Creates an instance of RegexReplaceController.
         * @param {IRegexReplaceControllerScope} $scope - The scope object for the current controller.
         * @param {ng.IQService} $q - Asynchronous processing service.
         * @param {RegexParserService} regexParser - Regular expression parsing service.
         * @param {app.PageLocationService} pageLocationService - Page location service.
         * @memberof RegexReplaceController
         */
        constructor($scope: IRegexReplaceControllerScope, $q: ng.IQService, regexParser: RegexParserService,
                pageLocationService: app.PageLocationService) {
            super($scope, $q, regexParser, pageLocationService, 'Replace');
            pageLocationService.regexHref(app.NavPrefix + app.ModulePaths.regexReplace);
        }

        protected onRegexChange(): void {
            const ctrl: RegexReplaceController = this;
            this.regexParser.replacedText().getValueAsync(this.$q).then(
                function(result: { value: string; token: symbol; }): void {
                    if (ctrl._replacedLinesToken !== result.token) {
                        ctrl._replacedLinesToken = result.token;
                        ctrl.$scope.replacedLines = JsLine.toJsLines(result.value);
                        ctrl.setEvalSuccess();
                    }
                },
                function(reason: any): void {
                    if (ctrl._replacedLinesToken !== ctrl.regexParser.replacedText().versionToken) {
                        ctrl._replacedLinesToken = ctrl.regexParser.replacedText().versionToken;
                        if (ctrl.regexParser.replacedText().isComponentError)
                            return;
                        ctrl.$scope.replacedLines = [];
                        ctrl.$scope.replaceWithLines = [];
                        ctrl.setEvalFail(reason);
                    }
                }
            );
        }
    }

    /**
     * The scope object for the regular expresssion text splitting controller.
     * @export
     * @interface IRegexSplitControllerScope
     * @extends {IRegexControllerScope}
     */
    export interface IRegexSplitControllerScope extends IRegexControllerScope {
        splitText: SplitTextInfo[];
    }

    /**
     * The regular expresssion text splitting controller.
     * @export
     * @class RegexSplitController
     * @implements {ng.IController}
     */
    export class RegexSplitController extends RegexController<IRegexSplitControllerScope> {
        private _splitTextToken: symbol = Symbol();
        readonly [Symbol.toStringTag]: string = app.ControllerNames.regexMatch;

        get splitLimit(): number { return this.regexParser.splitLimit(); }
        set splitLimit(value: number) {
            this.regexParser.splitLimit(value);
            this.onRegexChange();
        }

        /**
         * Creates an instance of RegexSplitController.
         * @param {IRegexSplitControllerScope} $scope - The scope object for the current controller.
         * @param {ng.IQService} $q - Asynchronous processing service.
         * @param {RegexParserService} regexParser - Regular expression parsing service.
         * @param {app.PageLocationService} pageLocationService - Page location service.
         * @memberof RegexSplitController
         */
        constructor($scope: IRegexSplitControllerScope, $q: ng.IQService, regexParser: RegexParserService,
                pageLocationService: app.PageLocationService) {
            super($scope, $q, regexParser, pageLocationService, 'Split');
            pageLocationService.regexHref(app.NavPrefix + app.ModulePaths.regexSplit);
            this.onRegexChange();
        }

        protected onRegexChange(): void {
            const ctrl: RegexSplitController = this;
            this.regexParser.splitText().getValueAsync(this.$q).then(
                function(result: { value: string[]; token: symbol; }): void {
                    if (ctrl._splitTextToken !== result.token) {
                        ctrl._splitTextToken = result.token;
                        ctrl.$scope.splitText = result.value.map(function(s: string, index: number): SplitTextInfo {
                            return new SplitTextInfo(index + 1, s);
                        });
                        ctrl.setEvalSuccess();
                    }
                },
                function(reason: any): void {
                    if (ctrl._splitTextToken !== ctrl.regexParser.splitText().versionToken) {
                        ctrl._splitTextToken = ctrl.regexParser.splitText().versionToken;
                        if (ctrl.regexParser.splitText().isComponentError)
                            return;
                        ctrl.$scope.splitText = [];
                        ctrl.setEvalFail(reason);
                    }
                }
            );
        }
    }

    app.mainModule.controller(app.ControllerNames.regexMatch,
            ['$scope', app.ServiceNames.regexParser, app.ServiceNames.pageLocation, RegexMatchController])
        .controller(app.ControllerNames.regexReplace,
            ['$scope', app.ServiceNames.regexParser, app.ServiceNames.pageLocation, RegexReplaceController])
        .controller(app.ControllerNames.regexSplit,
            ['$scope', app.ServiceNames.regexParser, app.ServiceNames.pageLocation, RegexSplitController])
        .service(app.ServiceNames.regexParser, RegexParserService);
}
