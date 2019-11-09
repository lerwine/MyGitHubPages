/// <reference path="../Scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="../Scripts/typings/angularjs/angular-route.d.ts"/>
/// <reference path="../Scripts/typings/bootstrap/index.d.ts"/>
/// <reference path="../app.ts"/>

/**
 * The JavaScript module corresponding to the MyGitHubPages.regexTester angular js module.
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

    /**
     * Results of regular expression pattern parsing.
     * @export
     * @interface IRegexParseResult
     */
    export interface IRegexParseResult {
        /**
         * Regex option flags used when constructing the RegExp object.
         * @type {RegexFlags}
         * @memberof IRegexParseResult
         */
        flags: RegexFlags;

        /**
         * The regular expression pattern that was parsed.
         * @type {string}
         * @memberof IRegexParseResult
         */
        pattern: string;

        /**
         * The result of the previous successfully parsed pattern.
         * @type {IRegexParseSuccessResult}
         * @memberof IRegexParseResult
         */
        previous?: IRegexParseSuccessResult & { previous?: undefined };

        /**
         * Indicates whether the source pattern or flags was changed before parsing was completed.
         * @type {boolean}
         * @memberof IRegexParseResult
         */
        operationCanceled?: boolean;
    }

    /**
     * Results of a successful regular expression pattern parsing.
     * @export
     * @interface IRegexParseSuccessResult
     * @extends {IRegexParseResult}
     */
    export interface IRegexParseSuccessResult extends IRegexParseResult {
        /**
         * The constructed regular expression object.
         * @type {RegExp}
         * @memberof IRegexParseSuccessResult
         */
        regex: RegExp;

        /**
         * Indicates that neither the source pattern nor flags was not changed before parsing was completed.
         * @type {false}
         * @memberof IRegexParseSuccessResult
         */
        operationCanceled?: false;
    }

    /**
     * Results of a failed regular expression parsing.
     * @export
     * @interface IRegexParseFailResult
     * @extends {IRegexParseResult}
     */
    export interface IRegexParseFailResult extends IRegexParseResult {
        /**
         * The reason for the failure.
         * @type {*}
         * @memberof IRegexParseFailResult
         */
        reason: any;

        /**
         * Indicates that neither the source pattern nor flags was not changed before parsing was completed.
         * @type {false}
         * @memberof IRegexParseFailResult
         */
        operationCanceled?: false;
    }

    /**
     * Results of a regular expression parsing that did not complete before the source pattern and/or flags was changed.
     * @export
     * @interface IRegexSourceChangedResult
     * @extends {IRegexParseResult}
     */
    export interface IRegexParseCanceledResult extends IRegexParseResult {
        /**
         * Indicates that the source pattern and/or flags was changed before parsing was completed.
         * @type {"Operation canceled"}
         * @memberof IRegexSourceChangedResult
         */
        reason: 'Operation canceled';

        /**
         * Indicates that the source pattern and/or flags was changed before parsing was completed.
         * @type {true}
         * @memberof IRegexSourceChangedResult
         */
        operationCanceled: true;
    }

    /**
     * Types of regular expression parsing results.
     * @typedef RegexParseResult
     */
    export type RegexParseResult = IRegexParseSuccessResult | IRegexParseCanceledResult | IRegexParseFailResult;

    /**
     * Callback method for a RegexFlags change event.
     * @callback RegexFlagsChangedListener
     * @param {ng.IAngularEvent} event - Information about the source of the event.
     * @param {string} oldValue - The previous regular expression flags.
     * @param {string} newValue - The current regular expression flags.
     */
    export type RegexFlagsChangedListener = ((event: ng.IAngularEvent, oldValue: RegexFlags, newValue: RegexFlags) => void) & Function;

    /**
     * Callback method for a RegexFlags change event.
     * @callback ThisRegexFlagsChangedListener
     * @template T
     * @this T
     * @param {ng.IAngularEvent} event - Information about the source of the event.
     * @param {string} oldValue - The previous regular expression flags.
     * @param {string} newValue - The current regular expression flags.
     */
    export type ThisRegexFlagsChangedListener<T> = ((this: T, event: ng.IAngularEvent, oldValue: RegexFlags,
        newValue: RegexFlags) => void) & Function;

    /**
     * Callback method for a regular expression pattern change event.
     * @callback RegexFlagsChangedListener
     * @param {ng.IAngularEvent} event - Information about the source of the event.
     * @param {string} oldValue - The previous regular expression pattern.
     * @param {string} newValue - The current regular expression pattern.
     */
    export type RegexPatternChangedListener = ((event: ng.IAngularEvent, oldValue: string, newValue: string) => void) & Function;

    /**
     * Callback method for a regular expression pattern change event.
     * @callback ThisRegexPatternChangedListener
     * @template T
     * @this T
     * @param {ng.IAngularEvent} event - Information about the source of the event.
     * @param {string} oldValue - The previous regular expression pattern.
     * @param {string} newValue - The current regular expression pattern.
     */
    export type ThisRegexPatternChangedListener<T> = ((this: T, event: ng.IAngularEvent, oldValue: string,
        newValue: string) => void) & Function;

    /**
     * Callback method for when a regular expression pattern is about to be parsed.
     * @callback StartRegexPatternParseListener
     * @param {ng.IAngularEvent} event - Information about the source of the event.
     * @param {string} pattern - The regular expression pattern to be parsed.
     * @param {RegexFlags} flags - The flags to be used when the RegExp object is constructed.
     */
    export type StartRegexPatternParseListener = ((event: ng.IAngularEvent, pattern: string, flags: RegexFlags) => void) & Function;

    /**
     * Callback method for when a regular expression pattern is about to be parsed.
     * @callback ThisStartRegexPatternParseListener
     * @template T
     * @this T
     * @param {ng.IAngularEvent} event - Information about the source of the event.
     * @param {string} pattern - The regular expression pattern to be parsed.
     * @param {RegexFlags} flags - The flags to be used when the RegExp object is constructed.
     */
    export type ThisStartRegexPatternParseListener<T> = ((this: T, event: ng.IAngularEvent, pattern: string,
        flags: RegexFlags) => void) & Function;

    /**
     * Callback method for a RegExp object change event.
     * @callback RegexObjectChangedListener
     * @param {ng.IAngularEvent} event - Information about the source of the event.
     * @param {IRegexParseSuccessResult} result - Regex pattern parsing result.
     */
    export type RegexObjectChangedListener = ((event: ng.IAngularEvent, oldValue: RegExp, newValue: RegExp) => void) & Function;

    /**
     * Callback method for a RegExp object change event.
     * @callback ThisRegexObjectChangedListener
     * @template T
     * @this T
     * @param {ng.IAngularEvent} event - Information about the source of the event.
     * @param {IRegexParseSuccessResult} result - Regex pattern parsing result.
     */
    export type ThisRegexObjectChangedListener<T> = ((this: T, event: ng.IAngularEvent, oldValue: RegExp,
        newValue: RegExp) => void) & Function;

    export type RegexPatternParseSuccessListener = ((event: ng.IAngularEvent, result: IRegexParseSuccessResult) => void) & Function;
    export type ThisRegexPatternParseSuccessListener<T> = ((this: T, event: ng.IAngularEvent,
        result: IRegexParseSuccessResult) => void) & Function;

    /**
     * Callback method for a regular expression pattern error event.
     * @callback ThisRegexPatternParseErrorListener
     * @param {ng.IAngularEvent} event - Information about the source of the event.
     * @param {IRegexParseFailResult} result - Regex pattern parsing failure result.
     */
    export type RegexPatternParseErrorListener = ((event: ng.IAngularEvent, result: IRegexParseFailResult) => void) & Function;

    /**
     * Callback method for a regular expression pattern error event.
     * @callback ThisRegexPatternParseErrorListener
     * @template T
     * @this T
     * @param {ng.IAngularEvent} event - Information about the source of the event.
     * @param {IRegexParseFailResult} result - Regex pattern parsing failure result.
     */
    export type ThisRegexPatternParseErrorListener<T> = ((this: T, event: ng.IAngularEvent,
        result: IRegexParseFailResult) => void) & Function;

    /**
     * Callback method for a regular expression parsing completion event.
     * @callback EndRegexPatternParseListener
     * @param {ng.IAngularEvent} event - Information about the source of the event.
     * @param {RegexParseResult} result - Regex pattern parsing result.
     */
    export type EndRegexPatternParseListener = ((event: ng.IAngularEvent, result: RegexParseResult, isAborted: boolean) => void) & Function;

    /**
     * Callback method for a regular expression parsing completion event.
     * @callback ThisEndRegexPatternParseListener
     * @template T
     * @this T
     * @param {ng.IAngularEvent} event - Information about the source of the event.
     * @param {RegexParseResult} result - Regex pattern parsing result.
     */
    export type ThisEndRegexPatternParseListener<T> = ((this: T, event: ng.IAngularEvent, result: RegexParseResult,
        isAborted: boolean) => void) & Function;

    /**
     * Callback method for current regular expression parsing completion.
     * @callback ParserReadyListener
     * @param {RegexParseResult} result - Regex pattern parsing result.
     */
    export type ParserReadyListener = ((result: RegexParseResult) => void) & Function;

    /**
     * Callback method for current regular expression parsing completion.
     * @callback ThisParserReadyListener
     * @template T
     * @this T
     * @param {RegexParseResult} result - Regex pattern parsing result.
     */
    export type ThisParserReadyListener<T> = ((this: T, result: RegexParseResult) => void) & Function;

    /**
     * Service for parsing regular expression patterns.
     * @export
     * @class RegexParserService
     */
    export class RegexParserService {
        private _parseId: symbol;
        private _flags: RegexFlags = new RegexFlags();
        private _pattern = '(?:)';
        private _isParsing = false;
        private _regex: RegExp;
        private _hasFault = false;
        private _faultReason: any;
        private readonly _taskId: symbol = Symbol();
        readonly [Symbol.toStringTag]: string = app.ServiceNames.regexParser;

        /**
         * Creates an instance of RegexParserService.
         * @param {ng.IRootScopeService} $rootScope
         * @param {app.SupplantableTaskService} supplantingTask
         * @memberof RegexParserService
         */
        constructor(private readonly $rootScope: ng.IRootScopeService,
                private readonly supplantingTask: app.SupplantablePromiseChainService) {
            const initialResults: IRegexParseSuccessResult = {
                pattern: this._pattern, flags: this._flags, regex: new RegExp(this._pattern, this._flags.flags)
            };
            this._regex = initialResults.regex;
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
                    this.startPatternParse(this._pattern, new RegexFlags(value));
                    break;
                case 'object':
                    this.startPatternParse(this._pattern, value);
                    break;
            }
            return this._flags;
        }

        /**
         * Gets or sets the global regular expression option flag.
         * @param {boolean} [value] - The new value for the global regular expression option flag.
         * @returns {boolean} The current global regular expression option flag.
         * @memberof RegexParserService
         */
        global(value?: boolean): boolean {
            if (typeof value === 'boolean' && value !== this._flags.global)
                this.flags(this._flags.setGlobal(value));
            return this._flags.global;
        }

        /**
         * Gets or sets the ignoreCase regular expression option flag.
         * @param {boolean} [value] - The new value for the ignoreCase regular expression option flag.
         * @returns {boolean} The current v regular expression option flag.
         * @memberof RegexParserService
         */
        ignoreCase(value?: boolean): boolean {
            if (typeof value === 'boolean' && value !== this._flags.ignoreCase)
                this.flags(this._flags.setIgnoreCase(value));
            return this._flags.ignoreCase;
        }

        /**
         * Gets or sets the multiline regular expression option flag.
         * @param {boolean} [value] - The new value for the multiline regular expression option flag.
         * @returns {boolean} The current multiline regular expression option flag.
         * @memberof RegexParserService
         */
        multiline(value?: boolean): boolean {
            if (typeof value === 'boolean' && value !== this._flags.multiline)
                this.flags(this._flags.setMultiline(value));
            return this._flags.multiline;
        }

        /**
         * Gets or sets the sticky regular expression option flag.
         * @param {boolean} [value] - The new value for the sticky regular expression option flag.
         * @returns {boolean} The current sticky regular expression option flag.
         * @memberof RegexParserService
         */
        sticky(value?: boolean): boolean {
            if (typeof value === 'boolean' && value !== this._flags.sticky)
                this.flags(this._flags.setSticky(value));
            return this._flags.sticky;
        }

        /**
         * Gets or sets the unicode regular expression option flag.
         * @param {boolean} [value] - The new value for the unicode regular expression option flag.
         * @returns {boolean} The current unicode regular expression option flag.
         * @memberof RegexParserService
         */
        unicode(value?: boolean): boolean {
            if (typeof value === 'boolean' && value !== this._flags.unicode)
                this.flags(this._flags.setUnicode(value));
            return this._flags.unicode;
        }

        /**
         * Gets or sets the regular expression pattern.
         * @param {string} [value] - The new regular expression pattern.
         * @returns {string} The current regular expression pattern.
         * @memberof RegexParserService
         */
        pattern(value?: string): string {
            if (typeof value === 'string')
                this.startPatternParse(value, this._flags);
            return this._pattern;
        }

        /**
         * Indicates whether the current regular expression pattern is still being parsed.
         * @returns {boolean} true if the current regular expression pattern is still being parsed; otherwise, false.
         * @memberof RegexParserService
         */
        isParsing(): boolean { return this._isParsing; }

        /**
         * Indicates whether the last regular expression parsing failed.
         * @returns {boolean} true if the last regular expression parsing failed; otherwise, false.
         * @memberof RegexParserService
         */
        hasFault(): boolean { return this._hasFault; }

        /**
         * The reason for the last failed regular expression parsing.
         * @returns {*}
         * @memberof RegexParserService
         */
        faultReason(): any { return this._faultReason; }

        private startPatternParse(regex: RegExp): void;
        private startPatternParse(pattern: string, flags: RegexFlags): void;
        private startPatternParse(arg0: string | RegExp, flags?: RegexFlags): RegExp {
            const parseId: symbol = Symbol();
            const previous: IRegexParseSuccessResult & { previous?: undefined } = {
                flags: this._flags,
                pattern: this._pattern,
                regex: this._regex
            };
            let pattern: string;
            if (typeof arg0 === 'string') {
                this._pattern = pattern = arg0;
                this._flags = flags;
                if (arg0 === previous.pattern) {
                    if (flags.flags === previous.flags.flags)
                        return;
                    if (flags.global == previous.flags.global && flags.ignoreCase == previous.flags.ignoreCase &&
                            flags.multiline == previous.flags.multiline && flags.unicode == previous.flags.unicode &&
                            flags.sticky == previous.flags.sticky) {
                        try {
                            this.$rootScope.$broadcast(app.EventNames.regexFlagsChanged2, previous.flags, flags, this._parseId);
                        } catch { }
                        return;
                    }
                    this._parseId = parseId;
                    this._isParsing = true;
                    try { this.$rootScope.$broadcast(app.EventNames.regexFlagsChanged2, previous.flags, flags, parseId); } catch { }
                } else {
                    this._parseId = parseId;
                    this._isParsing = true;
                    if (flags.flags !== previous.flags.flags) {
                        try { this.$rootScope.$broadcast(app.EventNames.regexFlagsChanged2, previous.flags, flags, parseId); } catch { }
                        if (this._parseId === parseId)
                            try {
                                this.$rootScope.$broadcast(app.EventNames.regexPatternChanged2, previous.pattern, arg0, parseId);
                            } catch { }
                    } else
                        try { this.$rootScope.$broadcast(app.EventNames.regexPatternChanged2, previous.pattern, arg0, parseId); } catch { }
                }
            } else {
                this._pattern = pattern = (this._regex = arg0).source;
                this._flags = flags = new RegexFlags(arg0);
                if (this._hasFault) {
                    this._parseId = parseId;
                    this._isParsing = true;
                    if ((this._flags = flags).flags !== previous.flags.flags)
                        try { this.$rootScope.$broadcast(app.EventNames.regexFlagsChanged2, previous.flags, flags, parseId); } catch { }
                    if (this._parseId === parseId && pattern !== previous.pattern)
                        try {
                            this.$rootScope.$broadcast(app.EventNames.regexPatternChanged2, previous.pattern, pattern, parseId);
                        } catch { }
                } else if (pattern === previous.pattern) {
                    if (flags.flags === previous.flags.flags || (flags.global == previous.flags.global &&
                            flags.ignoreCase == previous.flags.ignoreCase && flags.multiline == previous.flags.multiline &&
                            flags.unicode == previous.flags.unicode && flags.sticky == previous.flags.sticky))
                        return;
                    this._parseId = parseId;
                    this._isParsing = true;
                    try { this.$rootScope.$broadcast(app.EventNames.regexFlagsChanged2, previous.flags, flags, parseId); } catch { }
                } else {
                    this._parseId = parseId;
                    this._isParsing = true;
                    this._pattern = pattern;
                    if (flags.global == previous.flags.global && flags.ignoreCase == previous.flags.ignoreCase &&
                            flags.multiline == previous.flags.multiline && flags.unicode == previous.flags.unicode &&
                            flags.sticky == previous.flags.sticky)
                        this._flags = flags = previous.flags;
                    else {
                        try { this.$rootScope.$broadcast(app.EventNames.regexFlagsChanged2, previous.flags, flags, parseId); } catch { }
                        if (this._parseId === parseId)
                            try {
                                this.$rootScope.$broadcast(app.EventNames.regexPatternChanged2, previous.pattern, pattern, parseId);
                            } catch { }
                    }
                    if (this._parseId === parseId)
                        try {
                            this.$rootScope.$broadcast(app.EventNames.regexPatternChanged2, previous.pattern, pattern, parseId);
                        } catch { }
                }
            }

            const svc: RegexParserService = this;
            /**
             * @todo Finish documenting this
             */
            this.supplantingTask.start(this._taskId, function (resolve: ng.IQResolveReject<IRegexParseSuccessResult>,
                reject: ng.IQResolveReject<IRegexParseCanceledResult | IRegexParseFailResult>): void {
            }, );
            // this.$q(function (resolve: ng.IQResolveReject<IRegexParseSuccessResult>,
            //         reject: ng.IQResolveReject<IRegexParseCanceledResult | IRegexParseFailResult>): void {
            //     try { svc.$rootScope.$broadcast(app.EventNames.startRegexPatternParse2, pattern, flags, parseId); } catch { }
            //     if (parseId !== svc._parseId)
            //         reject(<IRegexParseCanceledResult>{
            //             pattern: pattern,
            //             flags: flags,
            //             operationCanceled: true,
            //             previous: previous,
            //             reason: 'Operation canceled'
            //         });
            //     else if (typeof arg0 === 'string') {
            //         try {
            //             resolve({
            //                 pattern: pattern,
            //                 flags: flags,
            //                 regex: new RegExp(pattern),
            //                 previous: previous
            //             });
            //         } catch (e) {
            //             reject(<IRegexParseFailResult>{
            //                 pattern: pattern,
            //                 flags: flags,
            //                 previous: previous,
            //                 reason: e
            //             });
            //         }
            //     } else
            //         resolve({
            //             pattern: pattern,
            //             flags: flags,
            //             regex: arg0,
            //             previous: previous
            //         });
            // }).then(function (result: IRegexParseSuccessResult) {
            //     if (parseId === svc._parseId) {
            //         svc._hasFault = svc._isParsing = false;
            //         svc._faultReason = undefined;
            //         svc._regex = result.regex;
            //         if (typeof arg0 === 'string' || result.regex.source !== previous.regex.source || result.regex.global !== previous.regex.global || result.regex.ignoreCase !== previous.regex.ignoreCase || result.regex.multiline !== previous.regex.multiline || result.regex.unicode !== previous.regex.unicode || result.regex.sticky !== previous.regex.sticky)
            //             try { svc.$rootScope.$broadcast(app.EventNames.regexObjectChanged2, previous.regex, result.regex, parseId); } catch { }
            //         try { svc.$rootScope.$broadcast(app.EventNames.regexPatternParseSuccess, result, parseId); } catch { }
            //         try { svc.$rootScope.$broadcast(app.EventNames.endRegexPatternParse2, result, parseId); } catch { }
            //     } else {
            //         try { svc.$rootScope.$broadcast(app.EventNames.regexPatternParseSuccess, result, parseId); } catch { }
            //         try {
            //             svc.$rootScope.$broadcast(app.EventNames.endRegexPatternParse2, <IRegexParseCanceledResult>{
            //                 pattern: pattern,
            //                 flags: flags,
            //                 operationCanceled: true,
            //                 previous: previous,
            //                 reason: 'Operation canceled'
            //             }, parseId);
            //         } catch { }
            //     }
            // }, function (result: IRegexParseCanceledResult | IRegexParseFailResult) {
            //     if (parseId === svc._parseId) {
            //         svc._isParsing = false;
            //         if (!svc.isParseCancel(result)) {
            //             svc._hasFault = true;
            //             svc._faultReason = result.reason;
            //             try { svc.$rootScope.$broadcast(app.EventNames.regexPatternParseError2, result, parseId); } catch { }
            //         }
            //     }
            //     try { svc.$rootScope.$broadcast(app.EventNames.endRegexPatternParse2, result, parseId); } catch { }
            // });

            return this._regex;
        }

        /**
         * Gets or sets the Regular Expression object.
         * @param {RegExp} [value] - The new Regular Expression object.
         * @returns {RegExp} The current Regular Expression object.
         * @memberof RegexParserService
         */
        regex(value?: RegExp): RegExp {
            if (typeof value === 'object' && value !== null && value instanceof RegExp)
                this.startPatternParse(value);
            return this._regex;
        }

        /**
         * Indicates whether the results indicate a successful regular expression parsing.
         * @param {RegexParseResult} result - The regular expression pattern parse result object.
         * @returns {result is IRegexParseSuccessResult} true if the RegExp object was successfully constructed; otherwise, false.
         * @memberof RegexParserService
         */
        isParseSuccess(result: RegexParseResult): result is IRegexParseSuccessResult {
            return typeof (<IRegexParseSuccessResult>result).regex === 'object';
        }

        isParseCancel(result: RegexParseResult): result is IRegexParseCanceledResult {
            return (<IRegexParseCanceledResult>result).operationCanceled === true;
        }

        /**
         * Listens for the flags change event.
         * @param {ng.IScope} $scope - The scope to listen on.
         * @param {RegexFlagsChangedListener} callbackFn - The callback method to invoke when the flags change event is raised.
         * @memberof RegexParserService
         */
        onRegexFlagsChanged($scope: ng.IScope, callbackFn: RegexFlagsChangedListener): void;

        /**
         * Listens for the flags change event.
         * @template T
         * @param {ng.IScope} $scope - The scope to listen on.
         * @param {ThisRegexFlagsChangedListener<T>} callbackFn - The callback method to invoke when the flags value has changed.
         * @param {T} thisObj - The object to use as the 'this' object when the callback function is invoked.
         * @memberof RegexParserService
         */
        onRegexFlagsChanged<T>($scope: ng.IScope, callbackFn: ThisRegexFlagsChangedListener<T>, thisObj: T): void;
        onRegexFlagsChanged($scope: ng.IScope, callbackFn: RegexFlagsChangedListener | ThisRegexFlagsChangedListener<any>,
                thisObj?: any): void {
            if (arguments.length < 3) {
                $scope.$on(app.EventNames.regexFlagsChanged2, callbackFn);
            } else {
                $scope.$on(app.EventNames.regexFlagsChanged2, (event: ng.IAngularEvent, oldValue: RegexFlags,
                        newValue: RegexFlags): void => {
                    callbackFn.call(thisObj, event, oldValue, newValue);
                });
            }
        }

        /**
         * Listens for the regular expression pattern change event.
         * @param {ng.IScope} $scope - The scope to listen on.
         * @param {RegexPatternChangedListener} callbackFn - The callback method to invoke when the regular expression pattern has changed.
         * @memberof RegexParserService
         */
        onRegexPatternChanged($scope: ng.IScope, callbackFn: RegexPatternChangedListener): void;

        /**
         * Listens for the regular expression pattern change event.
         * @template T
         * @param {ng.IScope} $scope - The scope to listen on.
         * @param {ThisRegexPatternChangedListener<T>} callbackFn - The callback method to invoke when the regular expression pattern has
         *      changed.
         * @param {T} thisObj - The object to use as the 'this' object when the callback function is invoked.
         * @memberof RegexParserService
         */
        onRegexPatternChanged<T>($scope: ng.IScope, callbackFn: ThisRegexPatternChangedListener<T>, thisObj: T): void;
        onRegexPatternChanged($scope: ng.IScope, callbackFn: RegexPatternChangedListener | ThisRegexPatternChangedListener<any>,
                thisObj?: any): void {
            if (arguments.length < 3)
                $scope.$on(app.EventNames.regexPatternChanged2, callbackFn);
            else
                $scope.$on(app.EventNames.regexPatternChanged2, (event: ng.IAngularEvent, oldValue: string, newValue: string): void => {
                    callbackFn.call(thisObj, event, oldValue, newValue);
                });
        }

        /**
         * Listens for the event that is raised before a an attempt to construct new RegExp for the regex property.
         * @param {ng.IScope} $scope - The scope to listen on.
         * @param {StartRegexPatternParseListener} callbackFn - The callback method to invoke before an attempt to construct new RegExp
         *      for the regex property.
         * @memberof RegexParserService
         */
        onStartRegexPatternParse($scope: ng.IScope, callbackFn: StartRegexPatternParseListener): void;

        /**
         * Listens for the event that is raised before a an attempt to construct new RegExp for the regex property.
         * @template T
         * @param {ng.IScope} $scope - The scope to listen on.
         * @param {ThisStartRegexPatternParseListener<T>} callbackFn - The callback method to invoke before an attempt to construct new
         *      RegExp for the regex property.
         * @param {T} thisObj - The object to use as the 'this' object when the callback function is invoked.
         * @memberof RegexParserService
         */
        onStartRegexPatternParse<T>($scope: ng.IScope, callbackFn: ThisStartRegexPatternParseListener<T>, thisObj: T): void;
        onStartRegexPatternParse($scope: ng.IScope, callbackFn: StartRegexPatternParseListener | ThisStartRegexPatternParseListener<any>,
                thisObj?: any): void {
            if (arguments.length < 3)
                $scope.$on(app.EventNames.startRegexPatternParse2, callbackFn);
            else
                $scope.$on(app.EventNames.startRegexPatternParse2, (event: ng.IAngularEvent, pattern: string, flags: RegexFlags): void => {
                    callbackFn.call(thisObj, event, pattern, flags);
                });
        }

        /**
         * Listens for the parsed regex object change event.
         * @param {ng.IScope} $scope - The scope to listen on.
         * @param {RegexObjectChangedListener} callbackFn - The callback method to invoke when the parsed regex object has changed.
         * @memberof RegexParserService
         */
        onRegexObjectChanged($scope: ng.IScope, callbackFn: RegexObjectChangedListener): void;

        /**
         * Listens for the parsed regex object change event.
         * @template T
         * @param {ng.IScope} $scope - The scope to listen on.
         * @param {ThisRegexObjectChangedListener<T>} callbackFn - The callback method to invoke when the parsed regex object has changed.
         * @param {T} thisObj - The object to use as the 'this' object when the callback function is invoked.
         * @memberof RegexParserService
         */
        onRegexObjectChanged<T>($scope: ng.IScope, callbackFn: ThisRegexObjectChangedListener<T>, thisObj: T): void;
        onRegexObjectChanged($scope: ng.IScope, callbackFn: RegexObjectChangedListener | ThisRegexObjectChangedListener<any>,
                thisObj?: any): void {
            if (arguments.length < 3)
                $scope.$on(app.EventNames.regexObjectChanged2, callbackFn);
            else
                $scope.$on(app.EventNames.regexObjectChanged2, (event: ng.IAngularEvent, oldValue: RegExp, newValue: RegExp): void => {
                    callbackFn.call(thisObj, event, oldValue, newValue);
                });
        }

        /**
         * Listens for the regular expression pattern parse error event.
         * @param {ng.IScope} $scope - The scope to listen on.
         * @param {RegexPatternParseErrorListener} callbackFn - The callback method to invoke when a regular expression pattern parsing
         *      failed.
         * @memberof RegexParserService
         */
        onRegexPatternParseError($scope: ng.IScope, callbackFn: RegexPatternParseErrorListener): void;

        /**
         * Listens for the regular expression pattern parse error event.
         * @template T
         * @param {ng.IScope} $scope - The scope to listen on.
         * @param {ThisRegexPatternParseErrorListener<T>} callbackFn - The callback method to invoke when a regular expression pattern
         *      parsing failed.
         * @param {T} thisObj - The object to use as the 'this' object when the callback function is invoked.
         * @memberof RegexParserService
         */
        onRegexPatternParseError<T>($scope: ng.IScope, callbackFn: ThisRegexPatternParseErrorListener<T>, thisObj: T): void;
        onRegexPatternParseError($scope: ng.IScope, callbackFn: RegexPatternParseErrorListener | ThisRegexPatternParseErrorListener<any>,
                thisObj?: any): void {
            if (arguments.length < 3)
                $scope.$on(app.EventNames.regexPatternParseError2, callbackFn);
            else
                $scope.$on(app.EventNames.regexPatternParseError2, (event: ng.IAngularEvent, result: IRegexParseFailResult): void => {
                    callbackFn.call(thisObj, event, result);
                });
        }

        /**
         * Listens for the regular expression pattern parse error event.
         * @param {ng.IScope} $scope - The scope to listen on.
         * @param {RegexPatternParseErrorListener} callbackFn - The callback method to invoke when a regular expression pattern parsing
         *      failed.
         * @memberof RegexParserService
         */
        onRegexPatternParseSuccess($scope: ng.IScope, callbackFn: RegexPatternParseSuccessListener): void;

        /**
         * Listens for the regular expression pattern parse error event.
         * @template T
         * @param {ng.IScope} $scope - The scope to listen on.
         * @param {ThisRegexPatternParseErrorListener<T>} callbackFn - The callback method to invoke when a regular expression pattern
         *      parsing failed.
         * @param {T} thisObj - The object to use as the 'this' object when the callback function is invoked.
         * @memberof RegexParserService
         */
        onRegexPatternParseSuccess<T>($scope: ng.IScope, callbackFn: ThisRegexPatternParseSuccessListener<T>, thisObj: T): void;
        onRegexPatternParseSuccess($scope: ng.IScope,
                callbackFn: RegexPatternParseSuccessListener | ThisRegexPatternParseSuccessListener<any>, thisObj?: any): void {
            if (arguments.length < 3)
                $scope.$on(app.EventNames.regexPatternParseSuccess, callbackFn);
            else
                $scope.$on(app.EventNames.regexPatternParseSuccess, (event: ng.IAngularEvent, result: IRegexParseSuccessResult): void => {
                        callbackFn.call(thisObj, event, result);
                });
        }

        /**
         * Listens for the regular expression pattern parsing completion event.
         * @param {ng.IScope} $scope - The scope to listen on.
         * @param {EndRegexPatternParseListener} callbackFn - The callback method to invoke when a regular expression pattern parsing
         *      attempt has completed.
         * @memberof RegexParserService
         */
        onEndRegexPatternParse($scope: ng.IScope, callbackFn: EndRegexPatternParseListener): void;

        /**
         * Listens for the regular expression pattern parsing completion event.
         * @template T
         * @param {ng.IScope} $scope - The scope to listen on.
         * @param {ThisEndRegexPatternParseListener<T>} callbackFn - The callback method to invoke when a regular expression pattern
         *      parsing attempt has completed.
         * @param {T} thisObj - The object to use as the 'this' object when the callback function is invoked.
         * @memberof RegexParserService
         */
        onEndRegexPatternParse<T>($scope: ng.IScope, callbackFn: ThisEndRegexPatternParseListener<T>, thisObj: T): void;
        onEndRegexPatternParse($scope: ng.IScope, callbackFn: EndRegexPatternParseListener | ThisEndRegexPatternParseListener<any>,
                thisObj?: any): void {
            if (arguments.length < 3)
                $scope.$on(app.EventNames.endRegexPatternParse2, callbackFn);
            else
                $scope.$on(app.EventNames.endRegexPatternParse2, (event: ng.IAngularEvent, result: RegexParseResult,
                        isAborted: boolean): void => {
                    callbackFn.call(thisObj, event, result, isAborted);
                });
        }
    }

    interface IParseOperationSuccess {
        regex: RegExp;
        previous?: RegexParseResult;
    }

    interface IParseOperationFail {
        reason?: any;
        previous?: RegexParseResult;
    }

    type ParseOperation = IParseOperationSuccess | IParseOperationFail;

    function isParseOperationSuccess(value: ParseOperation): value is IParseOperationSuccess {
        return typeof (<IParseOperationSuccess>value).regex !== 'undefined';
    }

    /**
     * Defines the scope common to all regular expression controllers.
     * @export
     * @interface IRegexControllerScope
     * @extends {ng.IScope}
     */
    export interface IRegexControllerScope extends ng.IScope {
        flags: string;
        isParsing: boolean;
        parseErrorMessage: string;
        showParseError: boolean;
    }

    export abstract class RegexController<TScope extends IRegexControllerScope> implements ng.IController {
        abstract readonly [Symbol.toStringTag]: string;

        get global(): boolean { return this.regexParser.global(); }
        set global(value: boolean) { this.regexParser.global(value); }

        get ignoreCase(): boolean { return this.regexParser.ignoreCase(); }
        set ignoreCase(value: boolean) { this.regexParser.ignoreCase(value); }

        get multiline(): boolean { return this.regexParser.multiline(); }
        set multiline(value: boolean) { this.regexParser.multiline(value); }

        get unicode(): boolean { return this.regexParser.unicode(); }
        set unicode(value: boolean) { this.regexParser.unicode(value); }

        get sticky(): boolean { return this.regexParser.sticky(); }
        set sticky(value: boolean) { this.regexParser.sticky(value); }

        get pattern(): string { return this.regexParser.pattern(); }
        set pattern(value: string) { this.regexParser.pattern(value); }

        /**
         * Creates an instance of RegexController.
         * @param {IRegexMatchControllerScope} $scope - The scope object for the current controller.
         * @param {app.PageTitleService} pageTitleService
         * @memberof RegexMatchController
         */
        constructor(protected readonly $scope: TScope, protected readonly regexParser: RegexParserService,
                pageTitleService: app.PageTitleService) {
            pageTitleService.pageTitle('Regular Expression Evaluator');
            regexParser.onRegexFlagsChanged($scope, this.onRegexFlagsChanged, this);
            regexParser.onStartRegexPatternParse($scope, this.onStartRegexPatternParse, this);
            regexParser.onEndRegexPatternParse($scope, this.onEndRegexPatternParse, this);
            $scope.isParsing = regexParser.isParsing();
            $scope.flags = regexParser.flags().flags;
            if (regexParser.hasFault())
                this.setError(regexParser.faultReason());
            else {
                $scope.showParseError = false;
                $scope.parseErrorMessage = '';
            }
        }

        private setError(reason: any): void {
            switch (typeof reason) {
                case 'undefined':
                    break;
                case 'object':
                    if (reason !== null) {
                        this.setError(JSON.stringify(reason));
                        return;
                    }
                    break;
                case 'string':
                    if ((this.$scope.parseErrorMessage = reason.trim()).length > 0) {
                        this.$scope.showParseError = true;
                        return;
                    }
                    break;
                default:
                    this.setError(JSON.stringify(reason));
                    return;
            }
            this.setError('Unknown parse failure.');
        }

        protected onRegexFlagsChanged(event: ng.IAngularEvent, oldValue: RegexFlags, newValue: RegexFlags): void {
            this.$scope.flags = this.regexParser.flags().flags;
        }

        //protected onRegexPatternChanged(event: ng.IAngularEvent, oldValue: string, newValue: string): void { }

        protected onStartRegexPatternParse(event: ng.IAngularEvent, pattern: string, flags: RegexFlags): void {
            this.$scope.showParseError = false;
            this.$scope.isParsing = this.regexParser.isParsing();
        }
        
        protected onEndRegexPatternParse(event: ng.IAngularEvent, result: RegexParseResult): void {
            this.$scope.isParsing = this.regexParser.isParsing();
            if (this.regexParser.hasFault()) {
                this.$scope.showParseError = true;
                this.setError(this.regexParser.faultReason());
            } else {
                this.$scope.showParseError = false;
                this.$scope.parseErrorMessage = '';
            }
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

    }

    /**
     * The regular expresssion pattern matching controller.
     * @export
     * @class RegexMatchController
     * @implements {ng.IController}
     */
    export class RegexMatchController extends RegexController<IRegexMatchControllerScope> {
        readonly [Symbol.toStringTag]: string = app.ControllerNames.regexMatch;

        /**
         * Creates an instance of RegexMatchController.
         * @param {IRegexMatchControllerScope} $scope - The scope object for the current controller.
         * @param {app.PageTitleService} pageTitleService
         * @memberof RegexMatchController
         */
        constructor($scope: IRegexMatchControllerScope, regexParser: RegexParserService, pageTitleService: app.PageTitleService) {
            super($scope, regexParser, pageTitleService);
            pageTitleService.pageSubTitle('Match');
            pageTitleService.regexHref(app.NavPrefix + app.ModulePaths.regexMatch);
        }
    }

    /**
     * The scope object for the regular expresssion text replacement controller.
     * @export
     * @interface IRegexReplaceControllerScope
     * @extends {IRegexControllerScope}
     */
    export interface IRegexReplaceControllerScope extends IRegexControllerScope {

    }

    /**
     * The regular expresssion text replacement controller.
     * @export
     * @class RegexReplaceController
     * @implements {ng.IController}
     */
    export class RegexReplaceController extends RegexController<IRegexReplaceControllerScope> {
        readonly [Symbol.toStringTag]: string = app.ControllerNames.regexMatch;

        /**
         * Creates an instance of RegexReplaceController.
         * @param {IRegexReplaceControllerScope} $scope - The scope object for the current controller.
         * @param {app.PageTitleService} pageTitleService
         * @memberof RegexReplaceController
         */
        constructor($scope: IRegexReplaceControllerScope, regexParser: RegexParserService, pageTitleService: app.PageTitleService) {
            super($scope, regexParser, pageTitleService);
            pageTitleService.pageSubTitle('Replace');
            pageTitleService.regexHref(app.NavPrefix + app.ModulePaths.regexReplace);
        }
    }

    /**
     * The scope object for the regular expresssion text splitting controller.
     * @export
     * @interface IRegexSplitControllerScope
     * @extends {IRegexControllerScope}
     */
    export interface IRegexSplitControllerScope extends IRegexControllerScope {

    }

    /**
     * The regular expresssion text splitting controller.
     * @export
     * @class RegexSplitController
     * @implements {ng.IController}
     */
    export class RegexSplitController extends RegexController<IRegexSplitControllerScope> {
        readonly [Symbol.toStringTag]: string = app.ControllerNames.regexMatch;

        /**
         * Creates an instance of RegexSplitController.
         * @param {IRegexSplitControllerScope} $scope - The scope object for the current controller.
         * @param {app.PageTitleService} pageTitleService
         * @memberof RegexSplitController
         */
        constructor($scope: IRegexSplitControllerScope, regexParser: RegexParserService, pageTitleService: app.PageTitleService) {
            super($scope, regexParser, pageTitleService);
            pageTitleService.pageSubTitle('Split');
            pageTitleService.regexHref(app.NavPrefix + app.ModulePaths.regexSplit);
        }
    }

    app.mainModule.controller(app.ControllerNames.regexMatch,
            ['$scope', app.ServiceNames.regexParser, app.ServiceNames.pageTitle, RegexMatchController])
        .controller(app.ControllerNames.regexReplace,
            ['$scope', app.ServiceNames.regexParser, app.ServiceNames.pageTitle, RegexReplaceController])
        .controller(app.ControllerNames.regexSplit,
            ['$scope', app.ServiceNames.regexParser, app.ServiceNames.pageTitle, RegexSplitController])
        .service(app.ServiceNames.regexParser, RegexParserService);
}
