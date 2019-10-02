/// <reference path="../Scripts/typings/jquery/jquery.d.ts"/>
/// <reference path="../Scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="../Scripts/typings/angularjs/angular-route.d.ts"/>
/// <reference path="../Scripts/typings/bootstrap/index.d.ts"/>

/**
 * Utility functions.
 * 
 * @namespace
 */
namespace sys {
    // #region Constants

    /**
     * Global match of any whitespace, newline or control character.
     * 
     * @constant {RegExp}
     * @default
     */
    export const whitespaceRe: RegExp = /[\s\r\n\p{C}]+/g;

    /**
     * Matches a string value that might represent a boolean value.
     * 
     * @constant {RegExp}
     * @default
     */
    export const booleanStringRe: RegExp = /^\s*(?:(y(?:es)?|t(?:rue)?|\+(?!\d))|(no?|f(?:alse)?|-(?!\d))|[+\-]?(\d+(\.\d+)))(?:\s|$)/i;

    // #endregion

    // #region Type guard members

    // #region Utility type aliases

    export type NotNilOrEmpty<T extends string | Array<any>> = T extends null | undefined | { length: 0 } ? never : NonNullable<T>;

    export type NilOrEmpty<T extends string | Array<any>> = (T & { length: 0 }) | null | undefined;

    export type NotFunctionOrNil<T> = T extends Function | null | undefined ? never : T;

    // #endregion

    // #region Nil type guards

    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} obj
     * @returns {(obj is null | undefined)}
     */
    export function isNil(obj: any | null | undefined): obj is null | undefined { return typeof (obj) === 'undefined' || obj === null; }
    
    ///**
    // *
    // *
    // * @export
    // * @template T
    // * @param {(T | null | undefined)} obj
    // * @returns {obj is NonNullable<T>}
    // */
    //export function notNil<T>(obj: T | null | undefined): obj is NonNullable<T>;
    ///**
    // *
    // *
    // * @export
    // * @param {(any | null | undefined)} obj
    // * @returns {NonNullable<(obj is boolean | number | string | object | symbol)>}
    // */
    //export function notNil(obj: any | null | undefined): obj is NonNullable<boolean | number | string | object | symbol>;
    //export function notNil(obj: any | null | undefined): boolean { return typeof (obj) !== 'undefined' && obj != null; }
    export function notNil<T>(obj: T | null | undefined): obj is NonNullable<T> { return typeof (obj) !== 'undefined' && obj != null; }

    ///**
    // *
    // *
    // * @export
    // * @param {(string | null | undefined)} value
    // * @returns {value is NotNilOrEmpty<string>}
    // */
    //export function notNilOrEmpty(value: string | null | undefined): value is NotNilOrEmpty<string>;
    ///**
    // *
    // *
    // * @export
    // * @template T
    // * @param {(Array<T> | null | undefined)} value
    // * @returns {value is NotNilOrEmpty<Array<T>>}
    // */
    //export function notNilOrEmpty<T>(value: Array<T> | null | undefined): value is NotNilOrEmpty<Array<T>>;
    ///**
    // *
    // *
    // * @export
    // * @param {(Array<any> | null | undefined)} value
    // * @returns {value is NotNilOrEmpty<Array<any>>}
    // */
    //export function notNilOrEmpty(value: Array<any> | null | undefined): value is NotNilOrEmpty<Array<any>>;
    export function notNilOrEmpty(value: string | Array<any> | null | undefined): value is NotNilOrEmpty<string | Array<any>> {
        return (typeof (value) == 'string' || (typeof (value) == 'object' && value != null && Array.isArray(value))) && value.length > 0;
    }

    ///**
    // *
    // *
    // * @export
    // * @param {(string | null | undefined)} value
    // * @returns {(value is NilOrEmpty<string>)}
    // */
    //export function isNilOrEmpty(value: string | null | undefined): value is NilOrEmpty<string>;
    ///**
    // *
    // *
    // * @export
    // * @template T
    // * @param {(Array<T> | null | undefined)} value
    // * @returns {NilOrEmpty<Array<T>>}
    // */
    //export function isNilOrEmpty<T>(value: Array<T> | null | undefined): value is NilOrEmpty<Array<T>>;
    ///**
    // *
    // *
    // * @export
    // * @param {(Array<any> | null | undefined)} value
    // * @returns {(value is NilOrEmpty<Array<any>>}
    // */
    //export function isNilOrEmpty(value: Array<any> | null | undefined): value is NilOrEmpty<Array<any>>;
    export function isNilOrEmpty(value: string | Array<any> | null | undefined): value is NilOrEmpty<string | Array<any>> {
        return (typeof (value) !== 'string' && (typeof (value) != 'object' || value === null || !Array.isArray(value))) || value.length == 0;
    }
    
    /**
     *
     *
     * @export
     * @param {(string | null | undefined)} value
     * @returns {boolean}
     */
    export function isNilOrWhiteSpace(value: string | null | undefined): boolean { return typeof (value) !== 'string' || value.trim().length == 0; }

    /**
     *
     *
     * @export
     * @param {(string | null | undefined)} value
     * @returns {value is NotNilOrEmpty<string>}
     */
    export function notNilOrWhiteSpace(value: string | null | undefined): value is NotNilOrEmpty<string> { return typeof (value) == 'string' && value.trim().length > 0 }

    // #endregion

    // #region Primitive type guards

    export function isNilOrBoolean(value: any | null | undefined): value is boolean | null | undefined {
        let t: string = typeof value;
        return t === "boolean" || t === "undefined" || (t === "object" && value === null);
    }

    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @returns {(value is string | null | undefined)}
     */
    export function isNilOrString(value: any | null | undefined): value is string | null | undefined { return (typeof (value) === "string") || (typeof (value) === "undefined") || value === null; }

    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @returns {(value is string | undefined)}
     */
    export function isUndefinedOrString(value: any | null | undefined): value is string | undefined { return (typeof (value) === "string") || (typeof (value) === "undefined") || value === null; }

    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @returns {(value is string | null)}
     */
    export function isNullOrString(value: any | null | undefined): value is string | null { return (typeof (value) === "string") || (typeof (value) !== "undefined" && value === null); }

    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @returns {value is NonNullable<number>}
     */
    export function isNumber(value: any | null | undefined): value is NonNullable<number> { return typeof (value) === 'number' && !isNaN(value); }

    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @returns {value is Exclude<number>}
     */
    export function notNumber(value: any | null | undefined): value is Exclude<any | null | undefined, number> { return typeof (value) !== 'number' || isNaN(value); }

    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @returns {value is number}
     */
    export function isFiniteNumber(value: any | null | undefined): value is NonNullable<number> { return typeof (value) === 'number' && !isNaN(value) && Number.isFinite(value); }

    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @returns {value is number}
     */
    export function isFiniteWholeNumber(value: any | null | undefined): value is NonNullable<number> { return typeof (value) === 'number' && !isNaN(value) && Number.isFinite(value) && Math.round(value) === value; }

    // #endregion

    // #endregion

    // #region Type coersion members

    // #region Nilable coersion members

    /**
     *
     *
     * @export
     * @template T
     * @param {(T | null | undefined)} value
     * @param {T} defaultValue
     * @returns {T}
     */
    export function asNotNil<T>(value: T | null | undefined, defaultValue: NonNullable<T>): NonNullable<T>;
    /**
     *
     *
     * @export
     * @param {(string | null | undefined)} value
     * @param {boolean} [trim]
     * @returns {string}
     */
    export function asNotNil(value: string | null | undefined, trim?: boolean): NonNullable<string>;
    /**
     *
     *
     * @export
     * @param {(string | null | undefined)} value
     * @param {string} defaultValue
     * @param {boolean} trim
     * @returns {string}
     */
    export function asNotNil(value: string | null | undefined, defaultValue: NonNullable<string>, trim: boolean): NonNullable<string>;
    export function asNotNil(value: any | null | undefined, opt?: any, trim?: boolean): NonNullable<any> {
        if (typeof (value) === "undefined" || value === null)
            return (typeof (opt) !== 'undefined') ? opt : '';
        if (typeof (value) !== 'string')
            return value;
        return ((typeof (opt) === "boolean") ? opt : trim === true) ? value.trim() : value;
    }

    // #endregion

    // #region Primitive coersion members

    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @returns {(boolean | null | undefined)}
     */
    export function asBooleanOrNullOrUndefined(value: any | null | undefined): boolean | null | undefined {
        return convertValue<boolean>(value, isNilOrBoolean, (v: any) => {
            let m: RegExpExecArray;
            if (typeof (v) === "object") {
                if (Array.isArray(v)) {
                    if (v.length == 0)
                        return false;
                    return v.map((value: any) => {
                        if (typeof value === "boolean")
                            return value;
                        if (typeof value === "number")
                            return !isNaN(value) && value !== 0;
                        m = booleanStringRe.exec(asString(value));
                        if (isNilOrEmpty(m) || !isNil(m[2]))
                            return false;
                        if (isNil(m[3]))
                            return true;
                        let n: number = NaN;
                        try { n = parseFloat(value); } catch { }
                        return !isNaN(n) && n !== 0.0;
                    }).reduce((previousValue: boolean, currentValue: boolean) => currentValue && previousValue, true);
                }
                try {
                    let o: any = v.valueOf();
                    if (typeof (o) === "boolean")
                        return o;
                } catch { /* okay to ignore */ }
            } else if (typeof (v) === "function")
                try {
                    let f: any = v.valueOf();
                    if (typeof (f) === "boolean")
                        return f;
                    if (typeof f !== "boolean")
                        v = f;
                } catch { /* okay to ignore */ }
            v = asString(v);
            m = booleanStringRe.exec(asString(value));
            if (isNilOrEmpty(m) || !isNil(m[2]))
                return false;
            if (isNil(m[3]))
                return true;
            let n: number = NaN;
            try { n = parseFloat(value); } catch { }
            return !isNaN(n) && n !== 0.0;
        });
    }

    /**
     * Converts a value to a boolean value.
     *
     * @export
     * @param {(any | null | undefined)} value
     * @param {boolean} [defaultValue=false]
     * @returns {boolean}
     */
    export function asBoolean(value: any | null | undefined, defaultValue: NonNullable<boolean> = false): NonNullable<boolean> {
        value = asBooleanOrNullOrUndefined(value);
        return (typeof (value) === "boolean") ? value : defaultValue;
    }

    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @returns {(string | null | undefined)}
     */
    export function asStringOrNullOrUndefined(value: any | null | undefined): string | null | undefined {
        return convertValue<string>(value, isNilOrString, (v: any) => {
            if (typeof (v) === "object") {
                if (Array.isArray(v))
                    return v.map((e: any) => {
                        return convertValue<string>(e, isNilOrString, (u: any) => {
                            if (typeof (u) === "object") {
                                if (Array.isArray(u))
                                    return u.filter(notNil).join("\n");
                                try {
                                    let p: any = u.valueOf();
                                    if (typeof (p) === "string")
                                        return p;
                                    p = p.toString();
                                    if (typeof (p) === "string")
                                        return p;
                                } catch { /* okay to ignore */ }
                            } else if (typeof (u) === "function")
                                try {
                                    let z: any = u.ValueOf();
                                    if (typeof (z) === "string")
                                        return z;
                                    z = z.toString();
                                    if (typeof (z) === "string")
                                        return z;
                                } catch { /* okay to ignore */ }
                            try {
                                let m: string = u.toString();
                                if (typeof (m) === "string")
                                    return m;
                            } catch { /* okay to ignore */ }
                        });
                    }).filter(notNil).join("\n");
                try {
                    let o: any = v.valueOf();
                    if (typeof (o) === "string")
                        return o;
                    o = o.toString();
                    if (typeof (o) === "string")
                        return o;
                } catch { /* okay to ignore */ }
            } else if (typeof (v) === "function")
                try {
                    let f: any = v.valueOf();
                    if (typeof (f) === "string")
                        return f;
                    f = f.toString();
                    if (typeof (f) === "string")
                        return f;
                } catch { /* okay to ignore */ }
            try {
                let s: string = v.toString();
                if (typeof (s) === "string")
                    return s;
            } catch { /* okay to ignore */ }
        });
    }

    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @returns {(string | null)}
     */
    export function asStringOrNull(value: any | null | undefined): string | null {
        value = asStringOrNullOrUndefined(value);
        return (typeof (value) === "undefined") ? null : value;
    }

    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @returns {(string | undefined)}
     */
    export function asStringOrUndefined(value: any | null | undefined): string | undefined {
        value = asStringOrNullOrUndefined(value);
        if (typeof (value) === "undefined" || typeof (value) === "string")
            return value;
    }

    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @param {string} [defaultValue=""]
     * @returns {string}
     */
    export function asString(value: any | null | undefined, defaultValue: NonNullable<string> = ""): NonNullable<string> {
        value = asStringOrNullOrUndefined(value);
        return (typeof (value) === "string") ? value : defaultValue;
    }

    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @param {string} defaultValue
     * @returns {string}
     */
    export function asStringAndNotEmpty(value: any | null | undefined, defaultValue: NotNilOrEmpty<string>): NotNilOrEmpty<string> {
        value = asStringOrNullOrUndefined(value);
        return (typeof (value) != "string" || value.length) ? defaultValue : value;
    }

    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @param {string} defaultValue
     * @param {boolean} [trim=false]
     * @returns {string}
     */
    export function asStringAndNotWhiteSpace(value: any | null | undefined, defaultValue: NotNilOrEmpty<string>, trim: boolean = false): NotNilOrEmpty<string> {
        value = asStringOrNullOrUndefined(value);
        if (typeof (value) == "string" && (((trim) ? (value = value.trim()) : value.trim()).length > 0))
            return value;
        return defaultValue;
    }

    /**
     *
     *
     * @export
     * @template T
     * @param {(Array<T> | null | undefined)} value
     * @returns {(Array<T> | undefined)}
     */
    export function asUndefinedOrNotEmpty<T>(value: Array<T> | null | undefined): NotNilOrEmpty<Array<T>> | undefined;
    /**
     *
     *
     * @export
     * @param {(Array<any> | null | undefined)} value
     * @returns {(Array<any> | undefined)}
     */
    export function asUndefinedOrNotEmpty(value: Array<any> | null | undefined): NotNilOrEmpty<Array<any>> | undefined;
    /**
     *
     *
     * @export
     * @param {(string | null | undefined)} value
     * @param {boolean} [trim]
     * @returns {(string | undefined)}
     */
    export function asUndefinedOrNotEmpty(value: string | null | undefined, trim?: boolean): NotNilOrEmpty<string> | undefined;
    export function asUndefinedOrNotEmpty(value: string | Array<any> | null | undefined, trim?: boolean): NotNilOrEmpty<string | Array<any>> | undefined {
        if (typeof (value) !== 'undefined' && value !== null && value.length > 0)
            return (trim === true && typeof (value) === 'string') ? value.trim() : value;
    }

    /**
     *
     *
     * @export
     * @param {(string | null | undefined)} value
     * @param {boolean} [trim]
     * @returns {(string | undefined)}
     */
    export function asUndefinedOrNotWhiteSpace(value: string | null | undefined, trim?: boolean): NotNilOrEmpty<string> | undefined {
        if (typeof (value) === 'string') {
            if (trim === true) {
                if ((value = value.trim()).length > 0)
                    return value;
            } else if (value.trim().length > 0)
                return value;
        }
    }

    /**
     *
     *
     * @export
     * @template T
     * @param {(Array<T> | null | undefined)} value
     * @returns {(Array<T> | undefined)}
     */
    export function asNullOrNotEmpty<T>(value: Array<T> | null | undefined): NotNilOrEmpty<Array<T>> | null;
    /**
     *
     *
     * @export
     * @param {(Array<any> | null | undefined)} value
     * @returns {(Array<any> | undefined)}
     */
    export function asNullOrNotEmpty(value: Array<any> | null | undefined): NotNilOrEmpty<Array<any>> | null;
    /**
     *
     *
     * @export
     * @param {(string | null | undefined)} value
     * @param {boolean} [trim]
     * @returns {(string | undefined)}
     */
    export function asNullOrNotEmpty(value: string | null | undefined, trim?: boolean): NotNilOrEmpty<string> | null;
    export function asNullOrNotEmpty(value: string | Array<any> | null | undefined, trim?: boolean): NotNilOrEmpty<string | Array<any>> | null {
        if (typeof (value) === 'string') {
            if (trim) {
                if ((value = value.trim()).length > 0)
                    return value;
            } else if (value.trim().length > 0)
                return value;
        }
        return null;
    }

    /**
     *
     *
     * @export
     * @param {(string | null | undefined)} value
     * @param {boolean} [trim]
     * @returns {(string | null)}
     */
    export function asNullOrNotWhiteSpace(value: string | null | undefined, trim?: boolean): NotNilOrEmpty<string> | null {
        if (typeof (value) === 'string') {
            if (trim === true) {
                if ((value = value.trim()).length > 0)
                    return value;
            } else if (value.trim().length > 0)
                return value;
        }
        return null;
    }

    export const floatingPointNumberRe: RegExp = /^[+-]?\d+(\.\d+)?$/;

    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @param {boolean} [allowWhiteSpace]
     * @param {boolean} [allowExtraneousTrailingCharacters]
     * @returns {(number | null)}
     */
    export function asNumber(value: any | null | undefined, allowWhiteSpace?: boolean, allowExtraneousTrailingCharacters?: boolean): NonNullable<number>;
    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @param {number} defaultValue
     * @param {boolean} [allowWhiteSpace]
     * @param {boolean} [allowExtraneousTrailingCharacters]
     * @returns {(number | null)}
     */
    export function asNumber(value: any | null | undefined, defaultValue: number, allowWhiteSpace?: boolean, allowExtraneousTrailingCharacters?: boolean): NonNullable<number>;
    export function asNumber(value: any | null | undefined, arg1?: number | boolean, arg2?: boolean, allowExtraneousTrailingCharacters?: boolean): NonNullable<number> {
        let dv: number;
        if (typeof (arg1) === "boolean") {
            allowExtraneousTrailingCharacters = arg2 === true;
            arg2 = arg1;
            dv = NaN;
        } else
            dv = (typeof (dv) === 'number') ? dv : NaN;
        return convertValue<number>(value, isNumber, (v: any) => {
            if (typeof (v) === "boolean")
                return (v) ? 1 : 0;
            if (typeof (v) === "function" && (typeof (v) === "object" && !Array.isArray(v)))
                try {
                    let f: any = v.valueOf();
                    if (isNumber(f))
                        return f;
                    if (typeof (v) === "boolean")
                        return (v) ? 1 : 0;
                    if (typeof (f) == "string")
                        v = f;
                } catch { /* okay to ignore */ }
            if (typeof (v) !== "string")
                v = asString(v, "");
            if (arg2)
                v = v.trim();
            let n: number = parseFloat(v);
            if (typeof (n) === 'number' && !isNaN(n) && (allowExtraneousTrailingCharacters || floatingPointNumberRe.test(v)))
                return n;
            return dv;
        }, (v: any) => { return dv; })
    }

    export function asWholeNumber(value: any | null | undefined, allowWhiteSpace?: boolean, allowExtraneousTrailingCharacters?: boolean): NonNullable<number>;
    export function asWholeNumber(value: any | null | undefined, defaultValue: number, allowWhiteSpace?: boolean, allowExtraneousTrailingCharacters?: boolean): NonNullable<number>;
    export function asWholeNumber(value: any | null | undefined, arg1?: number | boolean, arg2?: boolean, allowExtraneousTrailingCharacters?: boolean): NonNullable<number> {
        let dv: number;
        if (typeof (arg1) === "boolean") {
            allowExtraneousTrailingCharacters = arg2 === true;
            arg2 = arg1;
            dv = NaN;
        } else
            dv = (typeof dv !== 'number' || isNaN(dv)) ? NaN : Math.round(dv);
        return convertValue<number>(value, isNumber, (v: any) => {
            if (typeof (v) === "boolean")
                return (v) ? 1 : 0;
            if (typeof (v) === "function" && (typeof (v) === "object" && !Array.isArray(v)))
                try {
                    let f: any = v.valueOf();
                    if (isNumber(f))
                        return Math.round(f);
                    if (typeof (v) === "boolean")
                        return (v) ? 1 : 0;
                    if (typeof (f) == "string")
                        v = f;
                } catch { /* okay to ignore */ }
            if (typeof (v) !== "string")
                v = asString(v, "");
            if (arg2)
                v = v.trim();
            let n: number = parseFloat(v);
            if (typeof (n) === 'number' && !isNaN(n) && (allowExtraneousTrailingCharacters || floatingPointNumberRe.test(v)))
                return Math.round(n);
            return dv;
        }, (v: any) => { return dv; })
    }

    // #endregion

    // #region Delegated conversion

    /**
     *
     *
     * @interface IValueConversionConfig
     * @template T
     */
    interface IValueConversionConfig<T> {
        /**
         *
         *
         * @type {TypeGuardFunc<T>}
         * @memberof IValueConversionConfig
         */
        test: TypeGuardFunc<T>;

        /**
         *
         *
         * @type {ValueTranslateCallback<any, T>}
         * @memberof IValueConversionConfig
         */
        convert: ValueTranslateCallback<any, T>;

        /**
         *
         *
         * @type {GetErrorValueSpec<any, T>}
         * @memberof IValueConversionConfig
         */
        convertFailed?: GetErrorValueSpec<any, T>;

        /**
         *
         *
         * @type {ValueTranslateCallback<T, T>}
         * @memberof IValueConversionConfig
         */
        whenConverted?: ValueTranslateCallback<T, T>;

        /**
         *
         *
         * @type {ValueTranslateCallback<T, T>}
         * @memberof IValueConversionConfig
         */
        whenMatched?: ValueTranslateCallback<T, T>;
        /**
         *
         *
         * @type {ValueTranslateCallback<T, T>}
         * @memberof IValueConversionConfig
         */
        getFinal?: ValueTranslateCallback<T, T>;
    }

    /**
     *
     *
     * @interface IValueOrNilConversionConfig
     * @extends {ValueTranslateCallback<null | undefined, T>}
     * @template T
     */
    interface IValueOrNilConversionConfig<T> extends IValueConversionConfig<T> { whenNil: ValueTranslateCallback<null | undefined, T> | T; }

    /**
     *
     *
     * @interface IValueOrNullConversionConfig
     * @extends {IValueConversionConfig<T>}
     * @template T
     */
    interface IValueOrNullConversionConfig<T> extends IValueConversionConfig<T> { whenNull: GetValueSpec<T>; }

    /**
     *
     *
     * @interface IValueOrUndefinedConversionConfig
     * @extends {IValueConversionConfig<T>}
     * @template T
     */
    interface IValueOrUndefinedConversionConfig<T> extends IValueConversionConfig<T> { whenUndefined: GetValueSpec<T>; }

    /**
     *
     *
     * @interface IValueNullOrUndefinedConversionConfig
     * @extends {IValueOrNullConversionConfig<T>}
     * @extends {IValueOrUndefinedConversionConfig<T>}
     * @template T
     */
    interface IValueNullOrUndefinedConversionConfig<T> extends IValueOrNullConversionConfig<T>, IValueOrUndefinedConversionConfig<T> { }

    export type ValueNullAndOrUndefinedConversionConfig<T> = IValueNullOrUndefinedConversionConfig<T> | IValueOrUndefinedConversionConfig<T> | IValueOrNullConversionConfig<T>;

    export type ValueConversionConfig<T> = IValueConversionConfig<T> | IValueOrNilConversionConfig<T> | ValueNullAndOrUndefinedConversionConfig<T>;

    export type ValueAndOrNullConversionConfig<T> = IValueOrNullConversionConfig<T> | IValueNullOrUndefinedConversionConfig<T>;

    export type ValueAndOrUndefinedConversionConfig<T> = IValueOrUndefinedConversionConfig<T> | IValueNullOrUndefinedConversionConfig<T>;

    /**
     *
     *
     * @export
     * @template T
     * @param {ValueConversionConfig<T>} config
     * @returns {config is IValueOrNilConversionConfig<T>}
     */
    export function hasConvertWhenNil<T>(config: ValueConversionConfig<T>): config is IValueOrNilConversionConfig<T> { return typeof (<IValueOrNilConversionConfig<T>>config).whenNil !== "undefined"; }

    /**
     *
     *
     * @export
     * @template T
     * @param {ValueConversionConfig<T>} config
     * @returns {config is ValueAndOrNullConversionConfig<T>}
     */
    export function hasConvertWhenNull<T>(config: ValueConversionConfig<T>): config is ValueAndOrNullConversionConfig<T> { return typeof (<IValueOrNullConversionConfig<T>>config).whenNull !== "undefined"; }

    /**
     *
     *
     * @export
     * @template T
     * @param {ValueConversionConfig<T>} config
     * @returns {config is ValueAndOrUndefinedConversionConfig<T>}
     */
    export function hasConvertWhenUndefined<T>(config: ValueConversionConfig<T>): config is ValueAndOrUndefinedConversionConfig<T> { return typeof (<IValueOrUndefinedConversionConfig<T>>config).whenUndefined !== "undefined"; }

    function isTypeGuardFunc<T>(obj: ValueConversionConfig<T> | TypeGuardFunc<T>): obj is TypeGuardFunc<T> { return typeof obj === "function"; }

    /**
     *
     *
     * @export
     * @template T
     * @param {(any | null | undefined)} value
     * @param {ValueConversionConfig<T>} config
     * @returns {T}
     */
    export function convertValue<T>(value: any | null | undefined, config: ValueConversionConfig<T>): T;
    /**
     *
     *
     * @export
     * @template T
     * @param {(any | null | undefined)} value
     * @param {TypeGuardFunc<T>} testFn
     * @param {ValueTranslateCallback<any, T>} convertFn
     * @param {ValueTranslateCallback<null | undefined, T>} [whenNil]
     * @returns {T}
     */
    export function convertValue<T>(value: any | null | undefined, testFn: TypeGuardFunc<T>, convertFn: ValueTranslateCallback<any, T>, whenNil?: ValueTranslateCallback<null | undefined, T>): T;
    /**
     *
     *
     * @export
     * @template T
     * @param {(any | null | undefined)} value
     * @param {TypeGuardFunc<T>} testFn
     * @param {ValueTranslateCallback<any, T>} convertFn
     * @param {GetValueSpec<T>} whenNull
     * @param {GetValueSpec<T>} whenUndefined
     * @param {GetErrorValueSpec<any, T>} [convertFailed]
     * @param {ValueTranslateCallback<T, T>} [whenConverted]
     * @param {ValueTranslateCallback<T, T>} [whenMatched]
     * @param {ValueTranslateCallback<T, T>} [getFinal]
     * @returns {T}
     */
    export function convertValue<T>(value: any | null | undefined, testFn: TypeGuardFunc<T>, convertFn: ValueTranslateCallback<any, T>, whenNull: GetValueSpec<T>, whenUndefined: GetValueSpec<T>,
        convertFailed?: GetErrorValueSpec<any, T>, whenConverted?: ValueTranslateCallback<T, T>, whenMatched?: ValueTranslateCallback<T, T>, getFinal?: ValueTranslateCallback<T, T>): T;
    export function convertValue<T>(value: any | null | undefined, arg1: IValueConversionConfig<T> & Partial<IValueNullOrUndefinedConversionConfig<T>> & Partial<IValueOrNilConversionConfig<T>> | TypeGuardFunc<T>,
        convertFn?: ValueTranslateCallback<any, T>, whenNil?: GetValueSpec<T> | ValueTranslateCallback<null | undefined, T>, whenUndefined?: GetValueSpec<T>, convertFailed?: GetErrorValueSpec<any, T>, whenConverted?: ValueTranslateCallback<T, T>,
        whenMatched?: ValueTranslateCallback<T, T>, getFinal?: ValueTranslateCallback<T, T>): T {
        if (isTypeGuardFunc(arg1)) {
            if (arguments.length == 4)
                arg1 = { convert: convertFn, test: arg1, whenNil: <ValueTranslateCallback<null | undefined, T>>whenNil };
            else if (arguments.length > 5) {
                arg1 = { convert: convertFn, test: arg1, whenNull: <GetValueSpec<T>>whenNil, whenUndefined: whenUndefined, convertFailed: convertFailed, whenConverted: whenConverted, whenMatched: whenMatched, getFinal: getFinal };
            } else
                arg1 = { convert: convertFn, test: arg1 };
        }
        let result: T = ((config: IValueConversionConfig<T>): T => {
            let convertedValue: [T, boolean] = ((config: IValueConversionConfig<T>): [T, boolean] => {
                if (typeof value === "undefined") {
                    if (hasConvertWhenUndefined(arg1))
                        return [(typeof arg1.whenUndefined === "function") ? (<GetValueCallback<T>>arg1.whenUndefined)() : arg1.whenUndefined, false];
                    if (hasConvertWhenNil(arg1))
                        return [(typeof arg1.whenNil === "function") ? (<ValueTranslateCallback<null | undefined, T>>arg1.whenNil)(value) : arg1.whenNil, false];
                } else if (typeof value === "object" && value === null) {
                    if (hasConvertWhenNull(arg1))
                        return [(typeof arg1.whenNull === "function") ? (<GetValueCallback<T>>arg1.whenNull)() : arg1.whenNull, false];
                    if (hasConvertWhenNil(arg1))
                        return [(typeof arg1.whenNil === "function") ? (<ValueTranslateCallback<null | undefined, T>>arg1.whenNil)(value) : arg1.whenNil, false];
                }
                if (arg1.test(value))
                    return [(typeof arg1.whenMatched === "function") ? arg1.whenMatched(value) : value, true];
                try { return [arg1.convert(value), false]; }
                catch (e) { return [(typeof arg1.convertFailed === "function") ? (<GetErrorValueCallback<any, T>>arg1.convertFailed)(value, e) : arg1.convertFailed, false]; }
            })(config);
            if (convertedValue[1])
                return convertedValue[0];
            return (typeof (config.whenConverted) === "function") ? config.whenConverted(convertedValue[0]) : convertedValue[0];
        })(arg1);
        return (typeof (arg1.getFinal) === "function") ? arg1.getFinal(result) : result;
    }

    // #endregion

    // #endregion

    // #region Value alternation members

    /**
     * Compares current and new values, converting them to boolean, if necessary, and executes a callback if the converted values are not equal.
     *
     * @export
     * @param {(any | null | undefined)} currentValue - Represents the existing boolean value. If this is null, undefined or could not be converted to boolean, then it will be counted as being false.
     * @param {(any | null | undefined)} newValue - Represents the new boolean value. If this is null, undefined or could not be converted to boolean, then it will be counted as being false.
     * @param {ValueEventHandler<boolean>} whenChangedFn - Callback to invoke when the current and new values (converted to boolean) are not equal. The single parameter will be the new value converted to boolean.
     * @returns {boolean} - true if the current and new values (converted to boolean) were not equal.
     */
    export function testBooleanChange(currentValue: any | null | undefined, newValue: any | null | undefined, whenChangedFn: ValueEventHandler<boolean>): boolean;
    /**
     * Compares current and new values, converting them to boolean, if necessary, and executes a callback if the converted values are not equal.
     *
     * @export
     * @param {(any | null | undefined)} currentValue - Represents the existing boolean value. If this is null, undefined or could not be converted to boolean, then it will be counted as being false.
     * @param {(any | null | undefined)} newValue - Represents the new boolean value. If this is null, undefined or could not be converted to boolean, then it will be counted as being false.
     * @param {ThisValueEventHandler<TThisObj, boolean>} whenChangedFn - Callback to invoke when the current and new values (converted to boolean) are not equal. The single parameter will be the new value converted to boolean.
     * @param {TThisObj} [thisObj] - An object to which the this keyword can refer in the whenChangedFn function.
     * @this {TThisObj}
     * @returns {boolean} - true if the current and new values (converted to boolean) were not equal.
     */
    export function testBooleanChange<TThisObj>(currentValue: any | null | undefined, newValue: any | null | undefined, whenChangedFn: ThisValueEventHandler<TThisObj, boolean>, thisObj: TThisObj): boolean;
    /**
     * Compares current and new values, converting them to boolean, if necessary, and executes a callback if converted values are not equal.
     *
     * @export
     * @param {(any | null | undefined)} currentValue - Represents the existing boolean value. If this is null, undefined or could not be converted to boolean, then it will be counted as being equal to the defaultValue parameter.
     * @param {(any | null | undefined)} newValue - Represents the new boolean value. If this is null, undefined or could not be converted to boolean, then it will be counted as being equal to the defaultValue parameter.
     * @param {boolean} defaultValue - The default value to use when the current or new value are undefined, null or could not be converted to a boolean value.
     * @param {ValueEventHandler<boolean>} whenChangedFn - Callback to invoke when the current and new values (converted to boolean) are not equal. The single parameter will be the new value converted to boolean.
     * @returns {boolean} - true if the current and new values (converted to boolean) were not equal.
     */
    export function testBooleanChange(currentValue: any | null | undefined, newValue: any | null | undefined, defaultValue: boolean, whenChangedFn: ValueEventHandler<boolean>): boolean;
    /**
     * Compares current and new values, converting them to boolean, if necessary, and executes a callback if converted values are not equal.
     *
     * @export
     * @param {(any | null | undefined)} currentValue - Represents the existing boolean value. If this is null, undefined or could not be converted to boolean, then it will be counted as being equal to the defaultValue parameter.
     * @param {(any | null | undefined)} newValue - Represents the new boolean value. If this is null, undefined or could not be converted to boolean, then it will be counted as being equal to the defaultValue parameter.
     * @param {boolean} defaultValue - The default value to use when the current or new value are undefined, null or could not be converted to a boolean value.
     * @param {ThisValueEventHandler<TThisObj, boolean>} whenChangedFn - Callback to invoke when the current and new values (converted to boolean) are not equal. The single parameter will be the new value converted to boolean.
     * @param {TThisObj} [thisObj] - An object to which the this keyword can refer in the whenChangedFn function.
     * @this {TThisObj}
     * @returns {boolean} - true if the current and new values (converted to boolean) were not equal.
     */
    export function testBooleanChange<TThisObj>(currentValue: any | null | undefined, newValue: any | null | undefined, defaultValue: boolean, whenChangedFn: ThisValueEventHandler<TThisObj, boolean>, thisObj: NotFunctionOrNil<TThisObj>): boolean;
    /**
     * Compares current and new values, converting them to boolean, if necessary, and alternatively executes a callback depending upon whether the converted values are equal.
     *
     * @export
     * @param {(any | null | undefined)} currentValue - Represents the existing boolean value. If this is null, undefined or could not be converted to boolean, then it will be counted as being false.
     * @param {(any | null | undefined)} newValue - Represents the new boolean value. If this is null, undefined or could not be converted to boolean, then it will be counted as being false.
     * @param {ValueEventHandler<boolean>} whenChangedFn - Callback to invoke when the current and new values (converted to boolean) are not equal. The single parameter will be the new value converted to boolean.
     * @param {ValueEventHandler<boolean>} whenNotChangedFn - Callback to invoke when the current and new values (converted to boolean) are equal. The single parameter will be the current value converted to boolean.
     * @returns {boolean} - true if the current and new values (converted to boolean) were not equal.
     */
    export function testBooleanChange(currentValue: any | null | undefined, newValue: any | null | undefined, whenChangedFn: ValueEventHandler<boolean>, whenNotChangedFn: ValueEventHandler<boolean>): boolean;
    /**
     * Compares current and new values, converting them to boolean, if necessary, and alternatively executes a callback depending upon whether the converted values are equal.
     *
     * @export
     * @param {(any | null | undefined)} currentValue - Represents the existing boolean value. If this is null, undefined or could not be converted to boolean, then it will be counted as being false.
     * @param {(any | null | undefined)} newValue - Represents the new boolean value. If this is null, undefined or could not be converted to boolean, then it will be counted as being false.
     * @param {ThisValueEventHandler<TThisObj, boolean>} whenChangedFn - Callback to invoke when the current and new values (converted to boolean) are not equal. The single parameter will be the new value converted to boolean.
     * @param {ThisValueEventHandler<TThisObj, boolean>} whenNotChangedFn - Callback to invoke when the current and new values (converted to boolean) are equal. The single parameter will be the current value converted to boolean.
     * @param {TThisObj} [thisObj] - An object to which the this keyword can refer in the whenChangedFn function.
     * @this {TThisObj}
     * @returns {boolean} - true if the current and new values (converted to boolean) were not equal.
     */
    export function testBooleanChange<TThisObj>(currentValue: any | null | undefined, newValue: any | null | undefined, whenChangedFn: ThisValueEventHandler<TThisObj, boolean>, whenNotChangedFn: ThisValueEventHandler<TThisObj, boolean>, thisObj: NotFunctionOrNil<TThisObj>): boolean;
    /**
     * Compares current and new values, converting them to boolean, if necessary, and alternatively executes a callback depending upon whether the converted values are equal.
     *
     * @export
     * @param {(any | null | undefined)} currentValue - Represents the existing boolean value. If this is null, undefined or could not be converted to boolean, then it will be counted as being equal to the defaultValue parameter.
     * @param {(any | null | undefined)} newValue - Represents the new boolean value. If this is null, undefined or could not be converted to boolean, then it will be counted as being equal to the defaultValue parameter.
     * @param {boolean} defaultValue - The default value to use when the current or new value are undefined, null or could not be converted to a boolean value.
     * @param {ValueEventHandler<boolean>} whenChangedFn - Callback to invoke when the current and new values (converted to boolean) are not equal. The single parameter will be the new value converted to boolean.
     * @param {ValueEventHandler<boolean>} whenNotChangedFn - Callback to invoke when the current and new values (converted to boolean) are equal. The single parameter will be the current value converted to boolean.
     * @returns {boolean} - true if the current and new values (converted to boolean) were not equal.
     */
    export function testBooleanChange(currentValue: any | null | undefined, newValue: any | null | undefined, defaultValue: boolean, whenChangedFn: ValueEventHandler<boolean>, whenNotChangedFn: ValueEventHandler<boolean>): boolean;
    /**
     * Compares current and new values, converting them to boolean, if necessary, and alternatively executes a callback depending upon whether the converted values are equal.
     *
     * @export
     * @param {(any | null | undefined)} currentValue - Represents the existing boolean value. If this is null, undefined or could not be converted to boolean, then it will be counted as being equal to the defaultValue parameter.
     * @param {(any | null | undefined)} newValue - Represents the new boolean value. If this is null, undefined or could not be converted to boolean, then it will be counted as being equal to the defaultValue parameter.
     * @param {boolean} defaultValue - The default value to use when the current or new value are undefined, null or could not be converted to a boolean value.
     * @param {ThisValueEventHandler<TThisObj, boolean>} whenChangedFn - Callback to invoke when the current and new values (converted to boolean) are not equal. The single parameter will be the new value converted to boolean.
     * @param {ThisValueEventHandler<TThisObj, boolean>} whenNotChangedFn - Callback to invoke when the current and new values (converted to boolean) are equal. The single parameter will be the current value converted to boolean.
     * @param {TThisObj} [thisObj] - An object to which the this keyword can refer in the whenChangedFn function.
     * @this {TThisObj}
     * @returns {boolean} - true if the current and new values (converted to boolean) were not equal.
     */
    export function testBooleanChange<TThisObj>(currentValue: any | null | undefined, newValue: any | null | undefined, defaultValue: boolean, whenChangedFn: ThisValueEventHandler<TThisObj, boolean>, whenNotChangedFn: ThisValueEventHandler<TThisObj, boolean>, thisObj: TThisObj): boolean;
    export function testBooleanChange(currentValue: any | null | undefined, newValue: any | null | undefined, arg2: ThisValueEventHandler<any, boolean> | ValueEventHandler<boolean> | boolean, arg3?: any, arg4?: any, arg5?: any): boolean {
        let n: boolean;
        if (typeof arg2 === "boolean") {
            if (asBoolean(currentValue, arg2) === (n = asBoolean(newValue, arg2))) {
                if (typeof arg4 === "function") {
                    if (arguments.length > 5)
                        arg4.call(arg5, n);
                    else
                        arg4(n);
                }
                return false;
            }
            if (arguments.length > 5)
                arg3.call(arg5, n);
            else if (arguments.length > 4 && typeof arg4 !== "function")
                arg3.call(arg4, n);
            else
                arg3(n);
        } else {
            if (asBoolean(currentValue, false) === (n = asBoolean(newValue, false))) {
                if (typeof arg3 === "function") {
                    if (arguments.length > 4)
                        arg3.call(arg4, n);
                    else
                        arg3(n);
                }
                return false;
            }
            if (arguments.length > 4)
                arg2.call(arg4, n);
            else if (arguments.length == 4 && typeof arg3 !== "function")
                arg2.call(arg3, n);
            else
                arg2(n);
        }
        return true;
    }

    /**
     * Compares current and new values, converting them to boolean, if necessary, and executes a callback if the converted values are not equal.
     *
     * @export
     * @param {(any | null | undefined)} currentValue - Represents the existing boolean value. If this is null, undefined or could not be converted to boolean, then it will be counted as being false.
     * @param {(any | null | undefined)} newValue - Represents the new boolean value. If this is null, undefined or could not be converted to boolean, then it will be counted as being false.
     * @param {ValueChangeCallback<string>} whenChangedFn - Callback to invoke when the current and new values (converted to boolean) are not equal. The single parameter will be the new value converted to boolean.
     * @returns {boolean} - true if the current and new values (converted to boolean) were not equal.
     */
    export function testStringChange(currentValue: any | null | undefined, newValue: any | null | undefined, whenChangedFn: ValueChangeCallback<string>): boolean;
    /**
     * Compares current and new values, converting them to boolean, if necessary, and executes a callback if the converted values are not equal.
     *
     * @export
     * @param {(any | null | undefined)} currentValue - Represents the existing boolean value. If this is null, undefined or could not be converted to boolean, then it will be counted as being false.
     * @param {(any | null | undefined)} newValue - Represents the new boolean value. If this is null, undefined or could not be converted to boolean, then it will be counted as being false.
     * @param {ThisValueEventHandler<TThisObj, boolean>} whenChangedFn - Callback to invoke when the current and new values (converted to boolean) are not equal. The single parameter will be the new value converted to boolean.
     * @param {TThisObj} [thisObj] - An object to which the this keyword can refer in the whenChangedFn function.
     * @returns {boolean} - true if the current and new values (converted to boolean) were not equal.
     */
    export function testStringChange<TThisObj>(currentValue: any | null | undefined, newValue: any | null | undefined, whenChangedFn: ThisValueEventHandler<TThisObj, boolean>, TThisObj: TThisObj): boolean;
    /**
     * Compares current and new values, converting them to boolean, if necessary, and executes a callback if converted values are not equal.
     *
     * @export
     * @param {(any | null | undefined)} currentValue - Represents the existing boolean value. If this is null, undefined or could not be converted to boolean, then it will be counted as being equal to the defaultValue parameter.
     * @param {(any | null | undefined)} newValue - Represents the new boolean value. If this is null, undefined or could not be converted to boolean, then it will be counted as being equal to the defaultValue parameter.
     * @param {string} defaultValue - The default value to use when the current or new value are undefined, null or could not be converted to a boolean value.
     * @param {ValueChangeCallback<string>} whenChangedFn - Callback to invoke when the current and new values (converted to boolean) are not equal. The single parameter will be the new value converted to boolean.
     * @returns {boolean} - true if the current and new values (converted to boolean) were not equal.
     */
    export function testStringChange(currentValue: any | null | undefined, newValue: any | null | undefined, defaultValue: string, whenChangedFn: ValueChangeCallback<string>): boolean;
    /**
     * Compares current and new values, converting them to boolean, if necessary, and executes a callback if converted values are not equal.
     *
     * @export
     * @param {(any | null | undefined)} currentValue - Represents the existing boolean value. If this is null, undefined or could not be converted to boolean, then it will be counted as being equal to the defaultValue parameter.
     * @param {(any | null | undefined)} newValue - Represents the new boolean value. If this is null, undefined or could not be converted to boolean, then it will be counted as being equal to the defaultValue parameter.
     * @param {string} defaultValue - The default value to use when the current or new value are undefined, null or could not be converted to a boolean value.
     * @param {ThisValueEventHandler<TThisObj, boolean>} whenChangedFn - Callback to invoke when the current and new values (converted to boolean) are not equal. The single parameter will be the new value converted to boolean.
     * @param {NotFunctionOrNil<TThisObj>} [thisObj] - An object to which the this keyword can refer in the whenChangedFn function.
     * @returns {boolean} - true if the current and new values (converted to boolean) were not equal.
     */
    export function testStringChange<TThisObj>(currentValue: any | null | undefined, newValue: any | null | undefined, defaultValue: string, whenChangedFn: ThisValueEventHandler<TThisObj, boolean>, thisObj: NotFunctionOrNil<TThisObj>): boolean;
    /**
     * Compares current and new values, converting them to boolean, if necessary, and alternatively executes a callback depending upon whether the converted values are equal.
     *
     * @export
     * @param {(any | null | undefined)} currentValue - Represents the existing boolean value. If this is null, undefined or could not be converted to boolean, then it will be counted as being false.
     * @param {(any | null | undefined)} newValue - Represents the new boolean value. If this is null, undefined or could not be converted to boolean, then it will be counted as being false.
     * @param {ValueChangeCallback<string>} whenChangedFn - Callback to invoke when the current and new values (converted to boolean) are not equal. The single parameter will be the new value converted to boolean.
     * @param {ValueChangeCallback<string>} whenNotChangedFn - Callback to invoke when the current and new values (converted to boolean) are equal. The single parameter will be the current value converted to boolean.
     * @returns {boolean} - true if the current and new values (converted to boolean) were not equal.
     */
    export function testStringChange(currentValue: any | null | undefined, newValue: any | null | undefined, whenChangedFn: ValueChangeCallback<string>, whenNotChangedFn: ValueChangeCallback<string>): boolean;
    /**
     * Compares current and new values, converting them to boolean, if necessary, and alternatively executes a callback depending upon whether the converted values are equal.
     *
     * @export
     * @param {(any | null | undefined)} currentValue - Represents the existing boolean value. If this is null, undefined or could not be converted to boolean, then it will be counted as being false.
     * @param {(any | null | undefined)} newValue - Represents the new boolean value. If this is null, undefined or could not be converted to boolean, then it will be counted as being false.
     * @param {ThisValueEventHandler<TThisObj, boolean>} whenChangedFn - Callback to invoke when the current and new values (converted to boolean) are not equal. The single parameter will be the new value converted to boolean.
     * @param {ThisValueEventHandler<TThisObj, boolean>} whenNotChangedFn - Callback to invoke when the current and new values (converted to boolean) are equal. The single parameter will be the current value converted to boolean.
     * @param {NotFunctionOrNil<TThisObj>} [thisObj] - An object to which the this keyword can refer in the whenChangedFn function.
     * @returns {boolean} - true if the current and new values (converted to boolean) were not equal.
     */
    export function testStringChange<TThisObj>(currentValue: any | null | undefined, newValue: any | null | undefined, whenChangedFn: ThisValueEventHandler<TThisObj, boolean>, whenNotChangedFn: ThisValueEventHandler<TThisObj, boolean>, thisObj: NotFunctionOrNil<TThisObj>): boolean;
    /**
     * Compares current and new values, converting them to boolean, if necessary, and alternatively executes a callback depending upon whether the converted values are equal.
     *
     * @export
     * @param {(any | null | undefined)} currentValue - Represents the existing boolean value. If this is null, undefined or could not be converted to boolean, then it will be counted as being equal to the defaultValue parameter.
     * @param {(any | null | undefined)} newValue - Represents the new boolean value. If this is null, undefined or could not be converted to boolean, then it will be counted as being equal to the defaultValue parameter.
     * @param {boolean} defaultValue - The default value to use when the current or new value are undefined, null or could not be converted to a boolean value.
     * @param {ValueChangeCallback<string>} whenChangedFn - Callback to invoke when the current and new values (converted to boolean) are not equal. The single parameter will be the new value converted to boolean.
     * @param {ValueChangeCallback<string>} whenNotChangedFn - Callback to invoke when the current and new values (converted to boolean) are equal. The single parameter will be the current value converted to boolean.
     * @returns {boolean} - true if the current and new values (converted to boolean) were not equal.
     */
    export function testStringChange(currentValue: any | null | undefined, newValue: any | null | undefined, defaultValue: string, whenChangedFn: ValueChangeCallback<string>, whenNotChangedFn: ValueChangeCallback<string>): boolean;
    /**
     * Compares current and new values, converting them to boolean, if necessary, and alternatively executes a callback depending upon whether the converted values are equal.
     *
     * @export
     * @param {(any | null | undefined)} currentValue - Represents the existing boolean value. If this is null, undefined or could not be converted to boolean, then it will be counted as being equal to the defaultValue parameter.
     * @param {(any | null | undefined)} newValue - Represents the new boolean value. If this is null, undefined or could not be converted to boolean, then it will be counted as being equal to the defaultValue parameter.
     * @param {boolean} defaultValue - The default value to use when the current or new value are undefined, null or could not be converted to a boolean value.
     * @param {ThisValueEventHandler<TThisObj, boolean>} whenChangedFn - Callback to invoke when the current and new values (converted to boolean) are not equal. The single parameter will be the new value converted to boolean.
     * @param {ThisValueEventHandler<TThisObj, boolean>} whenNotChangedFn - Callback to invoke when the current and new values (converted to boolean) are equal. The single parameter will be the current value converted to boolean.
     * @param {TThisObj} [thisObj] - An object to which the this keyword can refer in the whenChangedFn function.
     * @returns {boolean} - true if the current and new values (converted to boolean) were not equal.
     */
    export function testStringChange<TThisObj>(currentValue: any | null | undefined, newValue: any | null | undefined, defaultValue: string, whenChangedFn: ThisValueEventHandler<TThisObj, boolean>, whenNotChangedFn: ThisValueEventHandler<TThisObj, boolean>, thisObj: TThisObj): boolean;
    export function testStringChange(currentValue: any | null | undefined, newValue: any | null | undefined, arg2: ThisValueEventHandler<any, boolean> | ValueChangeCallback<string> | string, arg3?: any, arg4?: any, arg5?: any): boolean {
        let n: string, o: string;
        if (typeof arg2 === "string") {
            if ((o = asString(currentValue, arg2)) === (n = asString(newValue, arg2))) {
                if (typeof arg4 === "function") {
                    if (arguments.length > 5)
                        arg4.call(arg5, n);
                    else
                        arg4(n);
                }
                return false;
            }
            if (arguments.length > 5)
                arg3.call(arg5, n, o)
            else if (arguments.length > 4 && typeof arg4 !== "function")
                arg3.call(arg4, n, o);
            else
                arg3(n, o);
        } else {
            if ((o = asString(currentValue, "")) === (n = asString(newValue, ""))) {
                if (typeof arg3 === "function") {
                    if (arguments.length > 4)
                        arg3.call(arg4, n);
                    else
                        arg3(n);
                }
                return false;
            }
            if (arguments.length > 4)
                arg2.call(arg4, n, o);
            else if (arguments.length == 4 && typeof arg3 !== "function")
                arg2.call(arg3, n, o);
            else
                (<ValueChangeCallback<string>>arg2)(n, o);
        }
        return true;
    }

    // #endregion
    
    // #region Iterable support members

    interface IIterableItemTranslateFn<TElement, TResult> { (value: TElement, index: number, iterable: Iterable<TElement>): TResult; }

    interface IIterableItemThisTranslateFn<TThisObj, TElement, TResult> { (this: TThisObj, value: TElement, index: number, iterable: Iterable<TElement>): TResult; }

    interface IIterableItemMergeFn<TElement, TResult> { (previousValue: TResult, currentValue: TElement, index: number, iterable: Iterable<TElement>): TResult; }

    interface IIterableThisItemMergeFn<TThisObj, TElement, TResult> { (this: TThisObj, previousValue: TResult, currentValue: TElement, index: number, iterable: Iterable<TElement>): TResult; }

    interface IValueTranslateFn<TSource, TResult> { (value: TSource): TResult; }

    interface IValueThisTranslateFn<TThisObj, TSource, TResult> { (this: TThisObj, value: TSource): TResult; }

    interface IValueMergeFn<T1, T2, TResult> { (x: T1, y: T2): TResult; }

    interface IValueThisMergeFn<TThisObj, T1, T2, TResult> { (this: TThisObj, x: T1, y: T2): TResult; }

    /**
     *
     *
     * @export
     * @template TSource
     * @template TResult
     * @param {Iterable<TSource>} source
     * @param {IIterableItemTranslateFn<TSource, TResult>} callbackfn
     * @param {*} [thisArg]
     * @returns {TResult[]}
     */
    export function map<TSource, TResult>(source: Iterable<TSource>, callbackfn: IIterableItemTranslateFn<TSource, TResult>): TResult[];
    export function map<TThisObj, TSource, TResult>(source: Iterable<TSource>, callbackfn: IIterableItemThisTranslateFn<TThisObj, TSource, TResult>, thisArg: TThisObj): TResult[];
    export function map<TSource, TResult>(source: Iterable<TSource>, callbackfn: IIterableItemThisTranslateFn<any, TSource, TResult> | IIterableItemTranslateFn<TSource, TResult>, thisArg?: any): TResult[] {
        let iterator: Iterator<TSource> = source[Symbol.iterator]();
        let r: IteratorResult<TSource> = iterator.next();
        let result: TResult[] = [];
        let index: number = -1;
        if (typeof (thisArg) !== 'undefined')
            while (!r.done) {
                result.push(callbackfn.call(thisArg, r.value, ++index, source));
                r = iterator.next();
            }
        else
            while (!r.done) {
                result.push(callbackfn(r.value, ++index, source));
                r = iterator.next();
            }
        return result;
    }

    /**
     *
     *
     * @export
     * @template T
     * @param {Iterable<T>} source
     * @param {IIterableItemTranslateFn<T, boolean>} callbackfn
     * @param {*} [thisArg]
     * @returns {boolean}
     */
    export function every<T>(source: Iterable<T>, callbackfn: IIterableItemTranslateFn<T, boolean>): boolean;
    export function every<TThisObj, T>(source: Iterable<T>, callbackfn: IIterableItemThisTranslateFn<TThisObj, T, boolean>, thisArg: TThisObj): boolean;
    export function every<T>(source: Iterable<T>, callbackfn: IIterableItemThisTranslateFn<any, T, boolean> | IIterableItemTranslateFn<T, boolean>, thisArg?: any): boolean {
        let iterator: Iterator<T> = source[Symbol.iterator]();
        let r: IteratorResult<T> = iterator.next();
        let index: number = -1;
        if (typeof (thisArg) !== 'undefined')
            while (!r.done) {
                if (!callbackfn.call(thisArg, r.value, ++index, source))
                    return false;
                r = iterator.next();
            }
        else
            while (!r.done) {
                if (!callbackfn(r.value, ++index, source))
                    return false;
                r = iterator.next();
            }
        return true;
    }

    /**
     *
     *
     * @export
     * @template T
     * @param {Iterable<T>} source
     * @param {IIterableItemTranslateFn<T, boolean>} callbackfn
     * @param {*} [thisArg]
     * @returns {boolean}
     */
    export function some<T>(source: Iterable<T>, callbackfn: IIterableItemTranslateFn<T, boolean>): boolean;
    export function some<TThisObj, T>(source: Iterable<T>, callbackfn: IIterableItemThisTranslateFn<TThisObj, T, boolean>, thisArg: TThisObj): boolean;
    export function some<T>(source: Iterable<T>, callbackfn: IIterableItemThisTranslateFn<any, T, boolean> | IIterableItemTranslateFn<T, boolean>, thisArg?: any): boolean {
        let iterator: Iterator<T> = source[Symbol.iterator]();
        let r: IteratorResult<T> = iterator.next();
        let index: number = -1;
        if (typeof (thisArg) !== 'undefined')
            while (!r.done) {
                if (callbackfn.call(thisArg, r.value, ++index, source))
                    return true;
                r = iterator.next();
            }
        else
            while (!r.done) {
                if (callbackfn(r.value, ++index, source))
                    return true;
                r = iterator.next();
            }
        return true;
    }

    /**
     *
     *
     * @export
     * @template T
     * @param {Iterable<T>} source
     * @param {(value: T, index: number, iterable: Iterable<T>) => void} callbackfn
     * @param {*} [thisArg]
     */
    export function forEach<T>(source: Iterable<T>, callbackfn: (value: T, index: number, iterable: Iterable<T>) => void): void;
    export function forEach<TThisObj, T>(source: Iterable<T>, callbackfn: (this: TThisObj, value: T, index: number, iterable: Iterable<T>) => void, thisArg: TThisObj): void;
    export function forEach<T>(source: Iterable<T>, callbackfn: (value: T, index: number, iterable: Iterable<T>) => void, thisArg?: any): void {
        let iterator: Iterator<T> = source[Symbol.iterator]();
        let r: IteratorResult<T> = iterator.next();
        let index: number = -1;
        if (typeof (thisArg) !== 'undefined')
            while (!r.done) {
                callbackfn.call(thisArg, r.value, ++index, source);
                r = iterator.next();
            }
        else
            while (!r.done) {
                callbackfn(r.value, ++index, source);
                r = iterator.next();
            }
    }

    /**
     *
     *
     * @export
     * @template T
     * @param {Iterable<T>} source
     * @param {IIterableItemTranslateFn<T, boolean>} callbackfn
     * @param {*} [thisArg]
     * @returns {T[]}
     */
    export function filter<T>(source: Iterable<T>, callbackfn: IIterableItemTranslateFn<T, boolean>): T[];
    export function filter<TThisObj, T>(source: Iterable<T>, callbackfn: IIterableItemThisTranslateFn<TThisObj, T, boolean>, thisArg: TThisObj): T[];
    export function filter<T>(source: Iterable<T>, callbackfn: IIterableItemThisTranslateFn<any, T, boolean> | IIterableItemTranslateFn<T, boolean>, thisArg?: any): T[] {
        let iterator: Iterator<T> = source[Symbol.iterator]();
        let r: IteratorResult<T> = iterator.next();
        let result: T[] = [];
        let index: number = -1;
        if (typeof (thisArg) !== 'undefined')
            while (!r.done) {
                if (callbackfn.call(thisArg, r.value, ++index, source))
                    result.push(r.value);
                r = iterator.next();
            }
        else
            while (!r.done) {
                if (callbackfn(r.value, ++index, source))
                    result.push(r.value);
                r = iterator.next();
            }
        return result;
    }

    /**
     *
     *
     * @export
     * @template TSource
     * @template TResult
     * @param {Iterable<TSource>} source
     * @param {IIterableItemMergeFn<TSource, TResult>} callbackfn
     * @param {TResult} initialValue
     * @returns {TResult}
     */
    export function reduce<TSource, TResult>(source: Iterable<TSource>, callbackfn: IIterableItemMergeFn<TSource, TResult>, initialValue: TResult): TResult;
    export function reduce<TThisObj, TSource, TResult>(source: Iterable<TSource>, callbackfn: IIterableThisItemMergeFn<TThisObj, TSource, TResult>, initialValue: TResult, thisArg: TThisObj): TResult;
    export function reduce<TSource, TResult>(source: Iterable<TSource>, callbackfn: IIterableThisItemMergeFn<any, TSource, TResult> | IIterableItemMergeFn<TSource, TResult>, initialValue: TResult, thisArg?: any): TResult {
        let iterator: Iterator<TSource> = source[Symbol.iterator]();
        let r: IteratorResult<TSource> = iterator.next();
        let result: TResult = initialValue;
        let index: number = -1;
        if (arguments.length > 3)
            while (!r.done) {
                result = callbackfn.call(thisArg, result, r.value, ++index, source);
                r = iterator.next();
            }
        else
            while (!r.done) {
                result = callbackfn(result, r.value, ++index, source);
                r = iterator.next();
            }

        return result;
    }

    export function findFirstOrDefault<TElement, TResult>(source: Iterable<TElement>, testCallbackFn: IIterableItemTranslateFn<TElement, boolean>, onMatchCallback: IIterableItemTranslateFn<TElement, TResult>,
        noMatchCallback: IValueTranslateFn<Iterable<TElement>, TResult>): TResult;
    export function findFirstOrDefault<TThisObj, TElement, TResult>(source: Iterable<TElement>, testCallbackFn: IIterableItemThisTranslateFn<TThisObj, TElement, boolean>, onMatchCallback: IIterableItemThisTranslateFn<TThisObj, TElement, TResult>,
        noMatchCallback: IValueThisTranslateFn<TThisObj, Iterable<TElement>, TResult>, thisArg: TThisObj): TResult;
    export function findFirstOrDefault<TElement, TResult>(source: Iterable<TElement>, testCallbackFn: IIterableItemThisTranslateFn<any, TElement, boolean> | IIterableItemTranslateFn<TElement, boolean>,
        onMatchCallback: IIterableItemThisTranslateFn<any, TElement, TResult> | IIterableItemTranslateFn<TElement, TResult>,
        noMatchCallback: IValueThisTranslateFn<any, Iterable<TElement>, TResult> | IValueTranslateFn<Iterable<TElement>, TResult>, thisArg?: any): TResult {
        if (isNil(source))
            return (arguments.length > 4) ? noMatchCallback.call(thisArg, source) : noMatchCallback(source);
        let iterator: Iterator<TElement> = source[Symbol.iterator]();
        let r: IteratorResult<TElement> = iterator.next();
        let index: number = -1;
        if (arguments.length > 4) {
            while (!r.done) {
                if (testCallbackFn.call(thisArg, r.value, ++index, source))
                    return onMatchCallback(r.value, index, source);
                r = iterator.next();
            }
            return noMatchCallback.call(thisArg, source);
        }
        while (!r.done) {
            if (testCallbackFn(r.value, ++index, source))
                return onMatchCallback(r.value, index, source);
            r = iterator.next();
        }
        return noMatchCallback(source);
    }

    export function findFirst<TElement, TResult>(source: Iterable<TElement>, testCallbackFn: IIterableItemTranslateFn<TElement, boolean>, onMatchCallback: IIterableItemTranslateFn<TElement, TResult>): TResult;
    export function findFirst<TThisObj, TElement, TResult>(source: Iterable<TElement>, testCallbackFn: IIterableItemThisTranslateFn<TThisObj, TElement, boolean>, onMatchCallback: IIterableItemThisTranslateFn<TThisObj, TElement, TResult>,
        thisArg: TThisObj): TResult
    export function findFirst<TElement, TResult>(source: Iterable<TElement>, testCallbackFn: IIterableItemThisTranslateFn<any, TElement, boolean> | IIterableItemTranslateFn<TElement, boolean>,
        onMatchCallback: IIterableItemThisTranslateFn<any, TElement, TResult> | IIterableItemTranslateFn<TElement, TResult>, thisArg?: any): TResult {
        if (!isNil(source)) {
            let iterator: Iterator<TElement> = source[Symbol.iterator]();
            let r: IteratorResult<TElement> = iterator.next();
            let index: number = -1;
            if (arguments.length > 2)
                while (!r.done) {
                    if (testCallbackFn.call(thisArg, r.value, ++index, source))
                        return onMatchCallback(r.value, index, source);
                    r = iterator.next();
                }
            else
                while (!r.done) {
                    if (testCallbackFn(r.value, ++index, source))
                        return onMatchCallback(r.value, index, source);
                    r = iterator.next();
                }
        }
    }

    /**
     * Iterates through the list to get the first matching item or returns a default value.
     *
     * @export
     * @template T - Type of element.
     * @param {Iterable<T>} source - The iterable object to search.
     * @param {IIterableItemTranslateFn<T, boolean>} testCallbackFn - The predicate function which determines whether the item is a match.
     * @param {T} defaultValue - The default value to return if no match is found.
     * @param {*} [thisArg] - The object to be used as the current "this" object.
     * @returns {T} - The matching object or the default value if no match was found.
     */
    export function firstOrDefault<T>(source: Iterable<T>, testCallbackFn: IIterableItemTranslateFn<T, boolean>, defaultValue: T): T;
    export function firstOrDefault<TThisObj, T>(source: Iterable<T>, testCallbackFn: IIterableItemThisTranslateFn<TThisObj, T, boolean>, defaultValue: T, thisArg: TThisObj): T;
    export function firstOrDefault<T>(source: Iterable<T>, testCallbackFn: IIterableItemThisTranslateFn<any, T, boolean> | IIterableItemTranslateFn<T, boolean>, defaultValue: T, thisArg?: any): T {
        if (isNil(source))
            return defaultValue;
        let iterator: Iterator<T> = source[Symbol.iterator]();
        let r: IteratorResult<T> = iterator.next();
        let index: number = -1;
        if (arguments.length > 3)
            while (!r.done) {
                if (testCallbackFn.call(thisArg, r.value, ++index, source))
                    return r.value;
                r = iterator.next();
            }
        else
            while (!r.done) {
                if (testCallbackFn(r.value, ++index, source))
                    return r.value;
                r = iterator.next();
            }
        return defaultValue;
    }

    /**
     * Iterates through the list to get the first matching item.
     *
     * @export
     * @template T - Type of element.
     * @param {Iterable<T>} source - The iterable object to search.
     * @param {IIterableItemTranslateFn<T, boolean>} testCallbackFn - The predicate function which determines whether the item is a match.
     * @param {*} [thisArg] - The object to be used as the current "this" object.
     * @returns {(T | undefined)} - The matching object or undefined if no match was found.
     */
    export function first<T>(source: Iterable<T>, testCallbackFn: IIterableItemTranslateFn<T, boolean>): T | undefined;
    export function first<TThisObj, T>(source: Iterable<T>, testCallbackFn: IIterableItemThisTranslateFn<TThisObj, T, boolean>, thisArg: TThisObj): T | undefined;
    export function first<T>(source: Iterable<T>, testCallbackFn: IIterableItemThisTranslateFn<any, T, boolean> | IIterableItemTranslateFn<T, boolean>, thisArg?: any): T | undefined {
        if (!isNil(source)) {
            let iterator: Iterator<T> = source[Symbol.iterator]();
            let r: IteratorResult<T> = iterator.next();
            let index: number = -1;
            if (arguments.length > 2)
                while (!r.done) {
                    if (testCallbackFn.call(thisArg, r.value, ++index, source))
                        return r.value;
                    r = iterator.next();
                }
            else
                while (!r.done) {
                    if (testCallbackFn(r.value, ++index, source))
                        return r.value;
                    r = iterator.next();
                }
        }
    }

    /**
     *
     *
     * @export
     * @template T
     * @param {Iterable<T>} source
     * @param {IIterableItemTranslateFn<T, boolean>} callbackfn
     * @param {*} [thisArg]
     * @returns {number}
     */
    export function indexOf<T>(source: Iterable<T>, callbackfn: IIterableItemTranslateFn<T, boolean>): number;
    export function indexOf<TThisObj, T>(source: Iterable<T>, callbackfn: IIterableItemThisTranslateFn<TThisObj, T, boolean>, thisArg: TThisObj): number;
    export function indexOf<T>(source: Iterable<T>, callbackfn: IIterableItemTranslateFn<T, boolean>, thisArg?: any): number {
        let iterator: Iterator<T> = source[Symbol.iterator]();
        let r: IteratorResult<T> = iterator.next();
        let index: number = -1;
        if (typeof (thisArg) !== 'undefined')
            while (!r.done) {
                if (callbackfn.call(thisArg, r.value, ++index, source))
                    return index;
                r = iterator.next();
            }
        else
            while (!r.done) {
                if (callbackfn(r.value, ++index, source))
                    return index;
                r = iterator.next();
            }
        return -1;
    }

    /**
     *
     *
     * @export
     * @template T
     * @param {Iterable<T>} source
     * @param {IIterableItemTranslateFn<T, boolean>} callbackfn
     * @param {*} [thisArg]
     * @returns {(T | undefined)}
     */
    export function last<T>(source: Iterable<T>, callbackfn: IIterableItemTranslateFn<T, boolean>): T | undefined;
    export function last<TThisObj, T>(source: Iterable<T>, callbackfn: IIterableItemThisTranslateFn<TThisObj, T, boolean>, thisArg: TThisObj): T | undefined;
    export function last<T>(source: Iterable<T>, callbackfn: IIterableItemTranslateFn<T, boolean>, thisArg?: any): T | undefined {
        let iterator: Iterator<T> = source[Symbol.iterator]();
        let r: IteratorResult<T> = iterator.next();
        let result: T;
        let index: number = -1;
        if (typeof (thisArg) !== 'undefined')
            while (!r.done) {
                if (callbackfn.call(thisArg, r.value, ++index, source))
                    result = r.value;
                r = iterator.next();
            }
        else
            while (!r.done) {
                if (callbackfn(r.value, ++index, source))
                    result = r.value;
                r = iterator.next();
            }
        return result;
    }

    /**
     *
     *
     * @export
     * @template T
     * @param {Iterable<T>} source
     * @param {number} count
     * @returns {T[]}
     */
    export function takeFirst<T>(source: Iterable<T>, count: number): T[] {
        let iterator: Iterator<T> = source[Symbol.iterator]();
        let r: IteratorResult<T> = iterator.next();
        let result: T[] = [];
        let index: number = 0;
        while (!r.done) {
            if (count == index)
                break;
            result.push(r.value);
            count--;
            r = iterator.next();
        }
        return result;
    }

    /**
     *
     *
     * @export
     * @template T
     * @param {Iterable<T>} source
     * @param {IIterableItemTranslateFn<T, boolean>} callbackfn
     * @param {*} [thisArg]
     * @returns {T[]}
     */
    export function takeWhile<T>(source: Iterable<T>, callbackfn: IIterableItemTranslateFn<T, boolean>): T[];
    export function takeWhile<TThisObj, T>(source: Iterable<T>, callbackfn: IIterableItemThisTranslateFn<TThisObj, T, boolean>, thisArg: TThisObj): T[];
    export function takeWhile<T>(source: Iterable<T>, callbackfn: IIterableItemTranslateFn<T, boolean>, thisArg?: any): T[] {
        let iterator: Iterator<T> = source[Symbol.iterator]();
        let r: IteratorResult<T> = iterator.next();
        let result: T[] = [];
        let index: number = -1;
        if (typeof (thisArg) !== 'undefined')
            while (!r.done) {
                if (!callbackfn.call(thisArg, r.value, ++index, source))
                    break;
                result.push(r.value);
                r = iterator.next();
            }
        else
            while (!r.done) {
                if (!callbackfn(r.value, ++index, source))
                    break;
                result.push(r.value);
                r = iterator.next();
            }
        return result;
    }

    /**
     *
     *
     * @export
     * @template T
     * @param {Iterable<T>} source
     * @param {Number} count
     * @returns {T[]}
     */
    export function skipFirst<T>(source: Iterable<T>, count: Number): T[] {
        let iterator: Iterator<T> = source[Symbol.iterator]();
        let r: IteratorResult<T> = iterator.next();
        let result: T[] = [];
        let index: number = -1;
        while (!r.done) {
            if (++index == count) {
                do {
                    result.push(r.value);
                    r = iterator.next();
                } while (!r.done);
                return result;
            }
            r = iterator.next();
        }
        return result;
    }

    /**
     *
     *
     * @export
     * @template T
     * @param {Iterable<T>} source
     * @param {IIterableItemTranslateFn<T, boolean>} callbackfn
     * @param {*} [thisArg]
     * @returns {T[]}
     */
    export function skipWhile<T>(source: Iterable<T>, callbackfn: IIterableItemTranslateFn<T, boolean>): T[];
    export function skipWhile<TThisObj, T>(source: Iterable<T>, callbackfn: IIterableItemThisTranslateFn<TThisObj, T, boolean>, thisArg: TThisObj): T[];
    export function skipWhile<T>(source: Iterable<T>, callbackfn: IIterableItemTranslateFn<T, boolean>, thisArg?: any): T[] {
        let iterator: Iterator<T> = source[Symbol.iterator]();
        let r: IteratorResult<T> = iterator.next();
        let result: T[] = [];
        let index: number = -1;
        if (typeof (thisArg) !== 'undefined')
            while (!r.done) {
                if (!callbackfn.call(thisArg, r.value, ++index, source)) {
                    do {
                        result.push(r.value);
                        r = iterator.next();
                    } while (!r.done);
                    return result;
                }
                r = iterator.next();
            }
        else
            while (!r.done) {
                if (!callbackfn(r.value, ++index, source)) {
                    do {
                        result.push(r.value);
                        r = iterator.next();
                    } while (!r.done);
                    return result;
                }
                r = iterator.next();
            }
        return result;
    }

    /**
     *
     *
     * @export
     * @template T
     * @param {Iterable<T>} source
     * @param {IValueMergeFn<T, T, boolean>} [callbackfn]
     * @param {*} [thisArg]
     * @returns {T[]}
     */
    export function unique<T>(source: Iterable<T>, callbackfn?: IValueMergeFn<T, T, boolean>): T[]
    export function unique<TThisObj, T>(source: Iterable<T>, callbackfn: IValueThisMergeFn<TThisObj, T, T, boolean>, thisArg: TThisObj): T[];
    export function unique<T>(source: Iterable<T>, callbackfn?: IValueThisMergeFn<any, T, T, boolean> | IValueMergeFn<T, T, boolean>, thisArg?: any): T[] {
        if (typeof (callbackfn) !== 'function')
            callbackfn = function (x: T, y: T) { return x === y; }
        let iterator: Iterator<T> = source[Symbol.iterator]();
        let r: IteratorResult<T> = iterator.next();
        let result: T[] = [];
        if (!r.done) {
            result.push(r.value);
            r = iterator.next();
            let index: number = 0;
            if (typeof (thisArg) !== 'undefined')
                while (!r.done) {
                    if (!result.some((value: T) => callbackfn.call(thisArg, r.value, value)))
                        result.push(r.value);
                    r = iterator.next();
                }
            else
                while (!r.done) {
                    if (!result.some((value: T) => callbackfn(r.value, value)))
                        result.push(r.value);
                    r = iterator.next();
                }
        }
        return result;
    }

    /**
     *
     *
     * @export
     * @template T
     * @param {Iterable<T>} source
     * @param {string} [separator]
     * @returns {string}
     */
    export function join<T>(source: Iterable<T>, separator?: string): string {
        if (Array.isArray(source))
            return source.join(separator);
        let iterator: Iterator<T> = source[Symbol.iterator]();
        let r: IteratorResult<T> = iterator.next();
        let result: T[] = [];
        let index: number = 0;
        while (!r.done) {
            result.push(r.value);
            r = iterator.next();
        }
        return result.join(separator);
    }

    /**
     *
     *
     * @param {(any | null | undefined)} obj
     * @returns {obj is Iterable<any>}
     */
    export function isIterable(obj: any | null | undefined): obj is NonNullable<Iterable<any>> { return typeof (obj) !== 'undefined' && typeof (obj[Symbol.iterator]) === 'function'; }


    interface IListSet<T> extends Set<T> {
        get(index: number): T;
        set(index: number, value: T): void;
        /**
          * Returns the index of the first occurrence of a value in the current list.
          * 
          * @param {T} searchElement The value to locate in the current list.
          * @param {number} fromIndex The list index at which to begin the search. If fromIndex is omitted, the search starts at index 0.
          */
        indexOf(searchElement: T, fromIndex?: number): number;

        /**
          * Inserts new items at the given index.
          * 
          * @param {number} index - The index where the items are to be inserted.
          * @param {T[]} items - Items to insert at the given index.
          */
        insert(index: number, ...items: T[]): this;

        /**
          * Returns the index of the last occurrence of a specified value in the current list.
          * 
          * @param {T} searchElement The value to locate in the current list.
          * @param {number} fromIndex The list index at which to begin the search. If fromIndex is omitted, the search starts at the last index in the current list.
          */
        lastIndexOf(searchElement: T, fromIndex?: number): number;

        /**
          * Sorts the current list.
          * 
          * @param { (a: T, b: T) => number } compareFn The name of the function used to determine the order of the elements. If omitted, the elements are sorted in ascending, ASCII character order.
          */
        sort(compareFn?: (a: T, b: T) => number): this;

        /**
          * Removes elements from the current list, returning the deleted elements.
          * 
          * @param {number} start The zero-based location in the current list from which to start removing elements.
          * @param {number} deleteCount The number of elements to remove.
          */
        splice(start: number, deleteCount?: number): T[];
        /**
          * Removes elements from the current list and, if necessary, inserts new elements in their place, returning the deleted elements.
          * 
          * @param {number} start The zero-based location in the current list from which to start removing elements.
          * @param {number} deleteCount The number of elements to remove.
          * @param {T[]} items Elements to insert into the current list in place of the deleted elements.
          */
        splice(start: number, deleteCount: number, ...items: T[]): T[];
    }

    interface ILinkedList<T extends object> extends IListSet<T> {
        readonly firstElement: T | undefined;
        readonly lastElement: T | undefined;
        getPreviousElement(refItem: T): T | undefined;
        getNextElement(refItem: T): T | undefined;
        insertElementAfter(refItem: T, ...items: T[]): this;
        insertElementBefore(refItem: T, ...items: T[]): this;
    }

    interface ILinkedMap<K, V extends object> extends Map<K, Iterable<V>> {
        readonly firstElement: V | undefined;
        readonly lastElement: V | undefined;
        firstIndexOfKey(key: K, fromIndex?: number): number;
        forEachKey(callbackfn: (value: NonNullable<Iterable<NonNullable<V>>>, key: NonNullable<K>, map: ILinkedMap<K, V>) => void, thisArg?: any): void;
        getFirst(key: K): V | undefined;
        getKey(obj: V): K | undefined;
        getKeyAt(index: number): NonNullable<K>;
        getPreviousValue(refObj: V): V | undefined;
        getNextValue(refObj: V): V | undefined;
        getValueAt(index: number): NonNullable<V>;
        indexOf(searchElement: V, fromIndex?: number): number;
        indexOfKeyAndValue(key: K, searchElement: V, fromIndex?: number): number;
        lastIndexOf(searchElement: V, fromIndex?: number): number;
        lastIndexOfKey(key: K, fromIndex?: number): number;
        lastIndexOfKeyAndValue(key: K, searchElement: V, fromIndex?: number): number;
        set(key: K, value: V | Iterable<V>): this;
        setKey(obj: V, key: K): void;
        setKeyAt(index: number, key: K): void;
        setValueAt(index: number, value: V): void;
    }

    class LinkManager<T extends object> {
        private _id: symbol = Symbol();
        private _next: symbol = Symbol();
        private _previous: symbol = Symbol();
        getPrevious(obj: T): T | null | undefined { return (<{ [key: string]: T | null | undefined; }>obj)[<string>(<any>this._previous)]; }
        getNext(obj: T): T | null | undefined { return (<{ [key: string]: T | null | undefined; }>obj)[<string>(<any>this._next)]; }
        getId(obj: T): symbol | undefined { return (<{ [key: string]: symbol | undefined; }>obj)[<string>(<any>this._id)]; }
        setPrevious(obj: T, value: T | null | undefined): T | null | undefined { (<{ [key: string]: T | null | undefined; }>obj)[<string>(<any>this._previous)] = value; return value; }
        setNext(obj: T, value: T | null | undefined): T | null | undefined { (<{ [key: string]: T | null | undefined; }>obj)[<string>(<any>this._next)] = value; return value; }
        setId(obj: T): void { (<{ [key: string]: symbol | undefined; }>obj)[<string>(<any>this._id)] = Symbol(); }
        clearId(obj: T): void { (<{ [key: string]: symbol | undefined; }>obj)[<string>(<any>this._id)] = undefined; }
    }

    export class UniqueLinkedSet<T extends object> implements ILinkedList<T> {
        private _k: LinkManager<T> = new LinkManager<T>();
        private _firstElement: T | undefined;
        private _lastElement: T | undefined;
        private _size: number = 0;

        get firstElement(): T | undefined { return this._firstElement; }

        get lastElement(): T | undefined { return this._lastElement; }

        get size(): number { return this._size; }

        add(value: T): this { return this.insertElementAfter(this._lastElement, value); }

        clear(): void {
            let previous: T | null | undefined = this._firstElement;
            if (typeof previous === "undefined")
                return;
            let current: T | null | undefined;
            while (notNil(current = this._k.getNext(previous))) {
                this._k.setNext(previous, undefined);
                this._k.clearId(previous);
                this._k.setPrevious(previous = current, undefined);
            }
            this._k.setPrevious(previous, undefined);
            this._k.clearId(previous);
            this._firstElement = this._lastElement = undefined;
            this._size = 0;
        }

        delete(value: T): boolean {
            if (typeof value !== "object" || value === null || typeof this._k.getId(value) === "undefined")
                return false;
            this._k.clearId(value);
            if (this._k.getPrevious(value) === null) {
                if ((this._firstElement = this._k.getNext(value)) === null) {
                    this._k.setPrevious(value, this._k.setNext(value, this._firstElement = this._lastElement = undefined));
                    this._size = 0;
                } else {
                    this._k.setPrevious(this._firstElement = this._k.getNext(value), null);
                    this._k.setPrevious(value, this._k.setNext(value, undefined));
                    this._size--;
                }
            } else {
                if (this._k.setNext(this._k.getPrevious(value), this._k.getNext(value)) === null)
                    this._k.setNext(this._lastElement = this._k.getPrevious(value), null)
                else
                    this._k.setPrevious(this._k.getNext(value), this._k.getPrevious(value))
                this._size--;
                this._k.setPrevious(value, this._k.setNext(value, undefined));
            }
            return true;
        }

        entries(): IterableIterator<[T, T]> { return new LinkedListEntryIterator(this); }

        forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void): void;
        forEach<TThisObj>(callbackfn: (this: TThisObj, value: T, value2: T, set: Set<T>) => void, thisArg: TThisObj): void;
        forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: any): void {
            if (arguments.length > 1)
                for (let value: T | undefined = this._firstElement; typeof value !== "undefined"; value = this._k.getNext(value))
                    callbackfn.call(thisArg, value, value, this);
            else
                for (let value: T | undefined = this._firstElement; typeof value !== "undefined"; value = this._k.getNext(value))
                    callbackfn(value, value, this);
        }

        getPreviousElement(refItem: T): T | undefined {
            if (typeof refItem === "object" && refItem !== null) {
                let previous: T | null | undefined = this._k.getPrevious(refItem);
                if (previous !== null)
                    return previous;
            }
        }

        getNextElement(refItem: T): T | undefined {
            if (typeof refItem === "object" && refItem !== null) {
                let next: T | null | undefined = this._k.getNext(refItem);
                if (next !== null)
                    return next;
            }
        }

        has(refItem: T): boolean { return typeof refItem === "object" && refItem !== null && typeof this._k.getId(refItem) === "symbol"; }

        insertElementAfter(refItem: T, ...items: T[]): this {
            this._insertElementAfter(refItem, items);
            return this;
        }

        private _insertElementAfter(refItem: T, items: T[]): void {
            if (isNil(items) || items.length == 0)
                return;
            items.forEach((value: T) => {
                if (typeof value !== "object" || value === null)
                    throw new Error("Invalid new item argument type.");
                if (typeof this._k.getId(value) === "symbol")
                    throw new Error("New item already exists in target list.");
            });
            if (isNil(refItem)) {
                if (typeof (refItem = this._lastElement) === "undefined") {
                    this._k.setId(refItem = items[0]);
                    this._k.setPrevious(this._firstElement = refItem, null);
                    this._size = 1;
                    for (let i: number = 1; i < items.length; i++) {
                        if (typeof this._k.getId(items[i]) !== "symbol") {
                            this._k.setId(refItem = this._k.setNext(this._k.setPrevious(items[i], refItem), items[i]));
                            this._size++;
                        }
                    }
                    this._k.setNext(refItem, null);
                    return;
                }
            } else {
                if (typeof refItem !== "object" || refItem === null)
                    throw new Error("Invalid reference item argument type.");
                if (typeof this._k.getId(refItem) !== "symbol")
                    throw new Error("Reference item does not belong to the target list.");
            }
            let next: T | null = this._k.getNext(refItem);
            items.forEach((value: T) => {
                if (typeof this._k.getId(value) !== "symbol") {
                    this._k.setId(refItem = this._k.setNext(this._k.setPrevious(value, refItem), value));
                    this._size++;
                }
            }, this);

            if (this._k.setNext(refItem, next) === null)
                this._lastElement = refItem;
            else
                this._k.setPrevious(next, refItem);
        }

        private _insertElementBefore(refItem: T, items: T[]): void {
            if (isNil(items) || items.length == 0)
                return;
            items.forEach((value: T) => {
                if (typeof value !== "object" || value === null)
                    throw new Error("Invalid new item argument type.");
                if (typeof this._k.getId(value) === "symbol")
                    throw new Error("New item already exists in target list.");
            });
            let index: number = items.length - 1;
            let previous: T | null;
            if (isNil(refItem)) {
                if (typeof (refItem = this._firstElement) === "undefined") {
                    previous = null;
                    this._k.setId(refItem = items[index--]);
                    this._k.setNext(this._lastElement = refItem, null);
                    this._size = 1;
                    if (items.length === 1) {
                        this._firstElement = refItem;
                        return;
                    }
                } else
                    previous = this._k.getPrevious(refItem);
            } else {
                if (typeof refItem !== "object" || refItem === null)
                    throw new Error("Invalid reference item argument type.");
                if (typeof this._k.getId(refItem) !== "symbol")
                    throw new Error("Reference item does not belong to the target list.");
                previous = this._k.getPrevious(refItem);
            }

            for (let i: number = index; i > -1; i--) {
                if (typeof this._k.getId(items[i]) !== "symbol") {
                    this._k.setId(refItem = this._k.setPrevious(this._k.setNext(items[i], refItem), items[i]));
                    this._size++;
                }
            }

            if (this._k.setPrevious(refItem, previous) === null)
                this._firstElement = refItem;
            else
                this._k.setNext(previous, refItem);
        }

        insertElementBefore(refItem: T, ...items: T[]): this {
            this._insertElementBefore(refItem, items);
            return this;
        }

        get(index: number): T {
            if (!isNumber(index))
                throw new Error("Invalid index argument");
            if (isNumber(index) && index > -1 && index < this._size) {
                let item: T | undefined = this._firstElement
                while (!isNil(item)) {
                    if (index-- === 0)
                        return item;
                    item = this._k.getNext(item);
                }
            }
            throw new RangeError("Index out of range");
        }

        set(index: number, value: T): T {
            let current: T = this.get(index);
            if (typeof value !== "object" || value === null)
                throw new Error("Invalid value argument.");
            if (typeof this._k.getId(value) === "symbol") {
                if (this._k.getId(value) === this._k.getId(current))
                    return;
                throw new Error("Item has already been added to the target list.");
            }
            if (this._k.setNext(value, this._k.getNext(current)) === null)
                this._lastElement = value;
            if (this._k.setPrevious(value, this._k.getPrevious(current)) === null)
                this._firstElement = value;
            this._k.setNext(current, this._k.setPrevious(current, undefined));
            this._k.clearId(current);
            return current;
        }

        indexOf(searchElement: T, fromIndex?: number): number {
            let id: Symbol;
            if (typeof searchElement === "object" && searchElement !== null && typeof (id = this._k.getId(searchElement)) === "symbol") {
                if (!isNumber(fromIndex))
                    fromIndex = 0;
                if (fromIndex > -1 && fromIndex < this._size) {
                    let current: T | null | undefined = this._firstElement;
                    let index: number = fromIndex;
                    while (fromIndex-- > 0) {
                        if (this._k.getId(current) === id || isNil(current = this._k.getNext(current)))
                            return -1;
                    }
                    do {
                        if (this._k.getId(current) === id)
                            return fromIndex;
                        if (isNil(current = this._k.getNext(current)))``
                        break;
                    } while (++index < this._size);
                }
            }
            return -1;
        }

        insert(index: number, ...items: T[]): this {
            this._insertElementBefore(this.get(index), items);
            return this;
        }

        keys(): IterableIterator<T> { return new LinkedListIterator(this); }

        lastIndexOf(searchElement: T, fromIndex?: number): number {
            if (!isNumber(fromIndex))
                fromIndex = 0;
            let id: symbol;
            if (fromIndex > -1 && fromIndex < this._size && typeof searchElement === "object" && searchElement !== null && typeof (id = this._k.getId(searchElement)) === "symbol") {
                let current: T | null | undefined = this._lastElement;
                let index: number = this._size - 1;
                while (!isNil(current) && fromIndex >= fromIndex) {
                    if (this._k.getId(current) === id)
                        return index;
                    index--;
                }
            }
        }

        sort(compareFn?: (a: T, b: T) => number): this {
            if (this._size < 2)
                return this;

            let arr: T[] = [];
            this.forEach((value: T) => arr.push(value));
            arr = (arguments.length == 0) ? arr.sort() : arr.sort(compareFn);
            let previous: T = arr[0];
            this._k.setPrevious(previous, null);
            for (let i: number = 1; i < arr.length; i++)
                previous = this._k.setNext(this._k.setPrevious(arr[i], arr[i - 1]), arr[i]);
            this._k.setNext(previous, null);
            return this;
        }

        splice(start: number, deleteCount?: number): T[];
        splice(start: number, deleteCount: number, ...items: T[]): T[];
        splice(start: number, deleteCount?: number, ...items: T[]): T[] {
            if (notNumber(start))
                throw new Error("Invalid start number argument type.");
            if (arguments.length < 2 || isNil(deleteCount))
                deleteCount = this._size - start;
            else if (notNumber(deleteCount))
                throw new Error("Invalid delete count argument type.");

            if (this._size == 0) {
                if (start !== 0)
                    throw new RangeError("Start argument out of range.");
                if (isNilOrEmpty(items))
                    return [];
                items.forEach((value: T) => {
                    if (typeof value !== "object" || value === null)
                        throw new Error("Invalid new item argument type.");
                    if (typeof this._k.getId(value) === "symbol")
                        throw new Error("New item already exists in target list.");
                });
                this._insertElementBefore(undefined, items);
                return [];
            }
            if (start > -1 && start < this._size) {
                let refItem: T = this.get(start);
                if (!isNil(refItem)) {
                    let deleted: T[] = [];
                    if (deleteCount < 1)
                        refItem = this._k.getNext(refItem);
                    else {
                        do {
                            deleted.push(refItem);
                            let n: T = this._k.getNext(refItem);
                            this.delete(refItem);
                            if (typeof (refItem = n) === "undefined")
                                break;
                        } while (--deleteCount > 0);
                    }
                    if (isNilOrEmpty(items))
                        return deleted;
                    if (typeof refItem === "undefined")
                        this._insertElementAfter(this._lastElement, items);
                    else
                        this._insertElementBefore(refItem, items);
                    return deleted;
                }
            }
            throw new RangeError("Start argument out of range.");
        }

        values(): IterableIterator<T> { return new LinkedListIterator(this); }

        [Symbol.iterator](): IterableIterator<T> { return new LinkedListIterator(this); }

        [Symbol.toStringTag]: "Set";
    }

    export class LinkedListIterator<T extends object> implements IterableIterator<T> {
        private _list: ILinkedList<T>;
        private _current: T | undefined;
        private _isDone: boolean;

        constructor(list: ILinkedList<T>) { this._isDone = typeof (this._current = (this._list = list).firstElement) === "undefined" || this._current === null; }

        next(value?: any): IteratorResult<T> {
            let result: IteratorResult<T> = { done: this._isDone, value: this._current };
            if (!(result.done || typeof (this._current = this._list.getNextElement(this._current)) !== "undefined" && this._current !== null))
                this._isDone = true;
            return result;
        }

        [Symbol.iterator](): IterableIterator<T> { return this }
    }

    export class LinkedListEntryIterator<T extends object> implements IterableIterator<[T, T]> {
        private _list: ILinkedList<T>;
        private _current: T | undefined;
        private _isDone: boolean;

        constructor(list: ILinkedList<T>) { this._isDone = typeof (this._current = (this._list = list).firstElement) === "undefined" || this._current === null; }

        next(value?: any): IteratorResult<[T, T]> {
            let result: IteratorResult<[T, T]> = { done: this._isDone, value: [this._current, this._current] };
            if (!(result.done || typeof (this._current = this._list.getNextElement(this._current)) !== "undefined" && this._current !== null))
                this._isDone = true;
            return result;
        }

        [Symbol.iterator](): IterableIterator<[T, T]> { return this }
    }

    // #endregion

    // #region Events and delegates

    /**
     * Callback which acts as a type guard.
     *
     * @export
     * @interface TypeGuardFunc
     * @template T
     */
    export interface TypeGuardFunc<T> { (value: any): value is T };

    /**
     * Callback for value-based events with a context value.
     * 
     * @export
     * @callback
     * @interface ThisValueEventHandler
     * @template TThisObj - The context object type (this object).
     * @template TValue - Type of value for the event.
     * @this TThisObj - The value of the current context (this) object.
     * @param {TValue} value - The event value.
     */
    export interface ThisValueEventHandler<TThisObj, TValue> { (this: TThisObj, value: TValue): void; }

    /**
     * Callback for a value-based event.
     * 
     * @export
     * @callback
     * @interface ValueEventHandler
     * @template TValue - Type of value for the event.
     * @param {TValue} value - The event value.
     */
    export interface ValueEventHandler<TValue> { (args: TValue): void; }

    /**
     * Callback for a simple event.
     * 
     * @export
     * @callback
     * @interface SimpleEventHandler
     */
    export interface SimpleEventHandler { (): void; }

    /**
     * Callback for a simple event.

     * @export
     * @callback
     * @interface ThisSimpleEventHandler
     * @template TThisObj - The context object type (this object).
     */
    export interface ThisSimpleEventHandler<TThisObj> { (this: TThisObj): void; }

    /**
     * Callback which translates one value to another.
     *
     * @export
     * @callback
     * @interface ValueTranslateCallback
     * @template TSource
     * @template TResult
     * @param {TSource} value - The source result value.
     * @returns {TResult} - The translated value.
     * @todo Finish renaming from IValueFinalizeFunc, IValueConvertFunc and NilConvertSpec 
     */
    export interface ValueTranslateCallback<TSource, TResult> { (value: TSource): TResult; }

    export type ValueTranslateSpec<TSource, TResult> = TSource | ValueTranslateCallback<TSource, TResult>;

    /**
     * Callback which translates one value to another.
     *
     * @export
     * @callback
     * @interface ValueTranslateCallback
     * @template TThisObj - The context object type (this object).
     * @template TSource
     * @template TResult
     * @param {TSource} value - The source result value.
     * @returns {TResult} - The translated value.
     */
    export interface ThisValueTranslateCallback<TThisObj, TSource, TResult> { (this: TThisObj, value: TSource): TResult; }

    export type ThisValueTranslateSpec<TThisObj, TSource, TResult> = ThisValueTranslateCallback<TThisObj, TSource, TResult> | TResult;

    /**
     * A callback method that gets a value of a specific type taken from a specific context (this object).
     *
     * @export
     * @callback
     * @interface GetThisValueCallback
     * @template TThisObj - The context object type (this object).
     * @template TResult - The value to return.
     * @returns {TResult} - A value of the specified type.
     */
    export interface GetThisValueCallback<TThisObj, TResult> { (this: TThisObj): TResult; }

    /**
     * A value or a method for obtaining a value in a specific context (this object).
     *
     * @export
     * @template TThisObj - The context object type (this object).
     * @template TResult - The target value type.
     * @type { GetThisValueCallback<TThisObj, TResult> | TResult } - The actual value or a method that returns a value of the specified type.
     */
    export type GetThisValueSpec<TThisObj, TResult> = GetThisValueCallback<TThisObj, TResult> | TResult;

    /**
     * A callback method that gets a value of a specific.
     *
     * @export
     * @callback
     * @interface GetValueCallback
     * @template TResult - The value to return.
     * @returns {TResult} - A value of the specified type.
     */
    export interface GetValueCallback<TResult> { (): TResult; }

    export interface GetErrorValueCallback<TError, TResult> { (value: any, error: TError): TResult };

    export type GetErrorValueSpec<TError, TResult> = GetErrorValueCallback<TError, TResult> | TResult;

    /**
     * A value or a method for obtaining a value.
     *
     * @export
     * @callback
     * @interface GetValueSpec
     * @template TResult - The target value type.
     */
    export type GetValueSpec<TResult> = GetValueCallback<TResult> | TResult;

    /**
     * Callback which passes an old and a new value.
     *
     * @export
     * @interface ValueChangeCallback
     * @template T - Type of value.
     * @param {any} newValue - The new value.
     * @param {any} oldValue - The old value.
     */
    interface ValueChangeCallback<T> { (newValue: T, oldValue: T): void; }

    /**
     * Callback which passes an old and a new value.
     *
     * @export
     * @interface ThisValueChangeCallback
     * @template TThisObj - The context object type (this object).
     * @template TValue - Type of value.
     * @param {any} newValue - The new value.
     * @param {any} oldValue - The old value.
     */
    interface ThisValueChangeCallback<TThisObj, TValue> { (this: TThisObj, newValue: TValue, oldValue: TValue): void; }

    /**
     * 
     *
     * @export
     * @interface ValueErrorEventHandler
     * @template T
     */
    export interface ValueErrorEventHandler<T> { (value: T, reason: ErrorResult): void; }

    /* *
     *
     *
     * @template T1
     * @template T2
     * @template T3
     * @param {({ (a1: T1, a2: T2, a3: T3): any } | undefined)} currentCallback
     * @param {{ (a1: T1, a2: T2, a3: T3): any }} newCallback
     * @returns {{ (a1: T1, a2: T2, a3: T3): any }}
     * /
    export function chainCallback<T1, T2, T3>(currentCallback: { (a1: T1, a2: T2, a3: T3): any } | undefined, newCallback: { (a1: T1, a2: T2, a3: T3): any }): { (a1: T1, a2: T2, a3: T3): any };
    /**
     *
     *
     * @template T1
     * @template T2
     * @param {({ (a1: T1, a2: T2): any } | undefined)} currentCallback
     * @param {{ (a1: T1, a2: T2): any }} newCallback
     * @returns {{ (a1: T1, a2: T2): any }}
     * /
    export function chainCallback<T1, T2>(currentCallback: { (a1: T1, a2: T2): any } | undefined, newCallback: { (a1: T1, a2: T2): any }): { (a1: T1, a2: T2): any };
    /**
     *
     *
     * @template T
     * @param {({ (a: T): any } | undefined)} currentCallback
     * @param {{ (a: T): any }} newCallback
     * @returns {{ (a: T): any }}
     * /
    export function chainCallback<T>(currentCallback: { (a: T): any } | undefined, newCallback: { (a: T): any }): { (a: T): any };
    /**
     *
     *
     * @param {({ (): any } | undefined)} currentCallback
     * @param {{ (): any }} newCallback
     * @returns {{ (): any }}
     * /
    export function chainCallback(currentCallback: SimpleEventHandler | undefined, newCallback: { (): any }): { (): any };
    export function chainCallback(currentCallback: Function | undefined, newCallback: Function, thisArg?: any): Function {
        if (typeof (currentCallback) !== "function")
            return newCallback;
        return function (...args: any[]) {
            try { currentCallback.apply(thisArg, args); }
            finally { newCallback.apply(thisArg, args); }
        }
    }

    /**
     *
     *
     * @template T1
     * @template T2
     * @template T3
     * @template TResult
     * @param TResult value
     * @param {({ (value: TResult, a1: T1, a2: T2, a3: T3): TResult } | undefined)} currentCallback
     * @param {{ (value: TResult, a1: T1, a2: T2, a3: T3): TResult }} newCallback
     * @returns {{ (value: TResult, a1: T1, a2: T2, a3: T3): TResult }}
     * /
    export function chainResultCallback<T1, T2, T3, TResult>(currentCallback: { (value: TResult, a1: T1, a2: T2, a3: T3): TResult } | undefined, newCallback: { (value: TResult, a1: T1, a2: T2, a3: T3): TResult }): { (value: TResult, a1: T1, a2: T2, a3: T3): TResult };
    /**
     *
     *
     * @template T1
     * @template T2
     * @template TResult
     * @param TResult value
     * @param {({ (value: TResult, a1: T1, a2: T2): TResult } | undefined)} currentCallback
     * @param {{ (value: TResult, a1: T1, a2: T2): TResult }} newCallback
     * @returns {{ (value: TResult, a1: T1, a2: T2): TResult }}
     * /
    export function chainResultCallback<T1, T2, TResult>(currentCallback: { (value: TResult, a1: T1, a2: T2): TResult } | undefined, newCallback: { (value: TResult, a1: T1, a2: T2): TResult }): { (value: TResult, a1: T1, a2: T2): TResult };
    /**
     *
     *
     * @template T
     * @template TResult
     * @param TResult value
     * @param {({ (value: TResult, a: T): TResult } | undefined)} currentCallback
     * @param {{ (value: TResult, a: T): TResult }} newCallback
     * @returns {{ (value: TResult, a: T): TResult }}
     * /
    export function chainResultCallback<T, TResult>(currentCallback: { (value: TResult, a: T): TResult } | undefined, newCallback: { (value: TResult, a: T): TResult }): { (value: TResult, a: T): TResult };
    /**
     *
     *
     * @template TResult
     * @param TResult value
     * @param {({ (value: TResult): TResult } | undefined)} currentCallback
     * @param {{ (value: TResult): TResult }} newCallback
     * @returns {{ (value: TResult): TResult }}
     * /
    export function chainResultCallback<TResult>(currentCallback: { (value: TResult): TResult } | undefined, newCallback: { (value: TResult): TResult }): { (value: TResult): TResult };
    export function chainResultCallback<TResult>(currentCallback: Function | undefined, newCallback: Function, thisArg?: TResult): Function {
        if (typeof (currentCallback) !== "function")
            return newCallback;
        return function (...args: any[]) {
            try { args[0] = currentCallback.apply(thisArg, args); }
            finally { args[0] = newCallback.apply(thisArg, args); }
            return args[0];
        }
    }

    /**
     *
     *
     * @export
     * @template T1
     * @template T2
     * @template T3
     * @param {(any | undefined)} thisArg
     * @param {({ (a1: T1, a2: T2, a3: T3): any } | undefined)} callbackfn
     * @param {T1} value1
     * @param {T2} value2
     * @param {T3} value3
     * @returns {*}
     * /
    export function callIfFunction<T1, T2, T3>(thisArg: any | undefined, callbackfn: { (a1: T1, a2: T2, a3: T3): any } | undefined, value1: T1, value2: T2, value3: T3): any;
    /**
     *
     *
     * @export
     * @template T1
     * @template T2
     * @param {(any | undefined)} thisArg
     * @param {({ (a1: T1, a2: T2): any } | undefined)} callbackfn
     * @param {T1} value1
     * @param {T2} value2
     * @returns {*}
     * /
    export function callIfFunction<T1, T2>(thisArg: any | undefined, callbackfn: { (a1: T1, a2: T2): any } | undefined, value1: T1, value2: T2): any;
    /**
     *
     *
     * @export
     * @template T
     * @param {(any | undefined)} thisArg
     * @param {({ (a: T): any } | undefined)} callbackfn
     * @param {T} value
     * @returns {*}
     * /
    export function callIfFunction<T>(thisArg: any | undefined, callbackfn: { (a: T): any } | undefined, value: T): any;
    export function callIfFunction(thisArg: any | undefined, callbackfn: Function | undefined, ...args: any[]): any {
        if (typeof callbackfn === "function")
            return callbackfn.apply(thisArg, args);
    }

    /**
     *
     *
     * @export
     * @template T1
     * @template T2
     * @template T3
     * @param {({ (a1: T1, a2: T2, a3: T3): any } | undefined)} callbackfn
     * @param {T1} value1
     * @param {T2} value2
     * @param {T3} value3
     * @returns {*}
     * /
    export function execIfFunction<T1, T2, T3>(callbackfn: { (a1: T1, a2: T2, a3: T3): any } | undefined, value1: T1, value2: T2, value3: T3): any;
    /**
     *
     *
     * @export
     * @template T1
     * @template T2
     * @param {({ (a1: T1, a2: T2): any } | undefined)} callbackfn
     * @param {T1} value1
     * @param {T2} value2
     * @returns {*}
     * /
    export function execIfFunction<T1, T2>(callbackfn: { (a1: T1, a2: T2): any } | undefined, value1: T1, value2: T2): any;
    /**
     *
     *
     * @export
     * @template T
     * @param {({ (a: T): any } | undefined)} callbackfn
     * @param {T} value
     * @returns {*}
     * /
    export function execIfFunction<T>(callbackfn: { (a: T): any } | undefined, value: T): any;
    export function execIfFunction(callbackfn: Function | undefined, ...args: any[]): any {
        if (typeof callbackfn === "function")
            return callbackfn.apply(this, args);
    }

    /**
     *
     *
     * @export
     * @template T1
     * @template T2
     * @template TResult
     * @param {({ (value: TResult, ag1: T1, arg2: T2): TResult } | undefined)} callbackfn
     * @param {TResult} value
     * @param {T1} arg1
     * @param {T2} arg2
     * @returns {TResult}
     * /
    export function execResultIfFunction<T1, T2, TResult>(callbackfn: { (value: TResult, a1: T1, a2: T2): TResult } | undefined, value: TResult, arg1: T1, arg2: T2): TResult;
    /**
     *
     *
     * @export
     * @template T
     * @template TResult
     * @param {({ (value: TResult, arg: T): TResult } | undefined)} callbackfn
     * @param {TResult} value
     * @param {T} arg
     * @returns {TResult}
     * /
    export function execResultIfFunction<T, TResult>(callbackfn: { (value: TResult, arg: T): TResult } | undefined, value: TResult, arg: T): TResult;
    /**
     *
     *
     * @export
     * @template TResult
     * @param {({ (value: TResult): TResult } | undefined)} callbackfn
     * @param {TResult} value
     * @returns {TResult}
     * /
    export function execResultIfFunction<TResult>(callbackfn: { (value: TResult): TResult } | undefined, value: TResult): TResult;
    export function execResultIfFunction<TResult>(callbackfn: Function | undefined, ...args: any[]): TResult {
        if (typeof callbackfn === "function")
            return callbackfn.apply(this, args);
        return <TResult>args[0];
    }
    
     */
    // #endregion
    
    // #region Error support members

    /**
     * Contains properties similar to Error objects.
     *
     * @export
     * @interface IErrorLike
     */
    export interface IErrorLike {
        /**
         *
         *
         * @type {string}
         * @memberof IErrorLike
         */
        message: string;

        /**
         *
         *
         * @type {*}
         * @memberof IErrorLike
         */
        data?: any;

        /**
         *
         *
         * @type {string}
         * @memberof IErrorLike
         */
        stack?: string;

        /**
         *
         *
         * @type {string}
         * @memberof IErrorLike
         */
        name?: string;
    }

    export type ErrorResult = Error | IErrorLike | string;

    /**
     *
     *
     * @param {*} value
     * @returns {ErrorResult}
     */
    export function asErrorResult(value: any): ErrorResult {
        if (typeof (value) !== "undefined" && value !== null) {
            let message: string;
            if (typeof (value) === "string")
                return ((message = value.trim()).length == 0) ? "Unexpected error" : message;
            if (value instanceof Error)
                return value;
            if (typeof (value) === "object" && ((typeof (<IErrorLike>value).message !== "undefined") && (<IErrorLike>value).message !== null)) {
                if (typeof (<IErrorLike>value).data !== "undefined" && (<IErrorLike>value).data !== null)
                    return value;
                if ((message = ((typeof (<IErrorLike>value).message === "string") ? (<IErrorLike>value).message : "" + (<IErrorLike>value).message).trim()).length == 0)
                    message = ("" + value).trim();
            } else
                message = ("" + value).trim();
            return {
                message: (message.length == 0) ? "Unexpected Error" : message,
                data: value
            };
        }
    }

    // #endregion

    // #region URL parsing

    const REGEX_USERINFO_ENCODE: RegExp = /( |%20)|((?:%(?:[a-f][\dA-Fa-f]|[\dA-Fa-f][a-f]))+)|((?:%(?![\dA-F]{2})|[^ !$&-.\d;=-\[\]_a-zA-Z~\ud800-\udbff%])+)/g;
    const REGEX_SEGMENT_ENCODE: RegExp = /( |%20)|((?:%(?:[a-f][\dA-Fa-f]|[\dA-Fa-f][a-f]))+)|((?:%(?![\dA-F]{2})|[^ !$&-.\d;=@-\[\]_a-zA-Z~\ud800-\udbff%])+)/g;
    const REGEX_PATH_ENCODE: RegExp = /( |%20)|(\\)|((?:%(?:[a-f][\dA-Fa-f]|[\dA-Fa-f][a-f]))+)|((?:%(?![\dA-F]{2})|[^ !$&-.\d;=@-\[\]_a-zA-Z~\ud800-\udbff\/:%])+)/g;
    const REGEX_QUERY_ENCODE: RegExp = /( |%20)|((?:%(?:[a-f][\dA-Fa-f]|[\dA-Fa-f][a-f]))+)|((?:%(?![\dA-F]{2})|[^ !$&-.\d;=@-\[\]_a-zA-Z~\ud800-\udbff\\\/:%])+)/g;
    const REGEX_QUERY_COMPONENT_ENCODE: RegExp = /( |%20)|((?:%(?:[a-f][\dA-Fa-f]|[\dA-Fa-f][a-f]))+)|((?:%(?![\dA-F]{2})|[^ !$-.\d;@-\[\]_a-zA-Z~\ud800-\udbff\\\/:%])+)/g;
    const REGEX_QUERY_COMPONENT_DECODE: RegExp = /(\+)|((?:%(?:[a-f][\dA-Fa-f]|[\dA-Fa-f][a-f]))+)|((?:%[\dA-F]{2})+)/g;
    const REGEX_PATH_SEGMENT: RegExp = /([\/:])([^\/:]*)/;
    const REGEX_URI_VALIDATE_SCHEME: RegExp = /^[a-z_][-.\dA-_a-z~\ud800-\udbff]*$/;
    const REGEX_URI_VALIDATE_HOSTNAME: RegExp = /^[-.\dA-\[\]_a-z~\ud800-\udbff]+/;
    const REGEX_URI_PARSE_PROTOCOL: RegExp = /^([^:?#@/\\]+)(:[\\/]{0,2})/;
    const REGEX_URI_PARSE_USERINFO: RegExp = /^([^:?#@/\\]*)(?::([^?#@/\\]*))@/;

    function encodeUserInfo(value: string): string {
        return asString(value, "").replace(REGEX_USERINFO_ENCODE, function (m, w, h, e): string {
            if (typeof w === "string")
                return "+";
            if (typeof h === "string")
                return h.toUpperCase();
            return encodeURIComponent(e);
        });
    }

    function encodePath(value: string): string {
        return asString(value, "").replace(REGEX_PATH_ENCODE, function (m, w, b, h, e): string {
            if (typeof w === "string")
                return "+";
            if (typeof b === "string")
                return "/";
            if (typeof h === "string")
                return h.toUpperCase();
            return encodeURIComponent(e);
        });
    }

    function encodePathSegment(value: string): string {
        return asString(value, "").replace(REGEX_SEGMENT_ENCODE, function (m, w, h, e): string {
            if (typeof w === "string")
                return "+";
            if (typeof h === "string")
                return h.toUpperCase();
            return encodeURIComponent(e);
        });
    }

    function encodeQuery(value: string): string {
        return asString(value, "").replace(REGEX_QUERY_ENCODE, function (m, w, h, e): string {
            if (typeof w === "string")
                return "+";
            if (typeof h === "string")
                return h.toUpperCase();
            return encodeURIComponent(e);
        });
    }

    function encodeQueryComponent(value: string): string {
        return asString(value, "").replace(REGEX_QUERY_COMPONENT_ENCODE, function (m, w, h, e): string {
            if (typeof w === "string")
                return "+";
            if (typeof h === "string")
                return h.toUpperCase();
            return encodeURIComponent(e);
        });
    }

    function decodeUriString(value: string) {
        return asString(value, "").replace(REGEX_QUERY_COMPONENT_ENCODE, function (m, p, l, u): string {
            if (typeof p === "string")
                return " ";
            if (typeof l === "string")
                return decodeURIComponent(l.toUpperCase());
            return decodeURIComponent(u);
        });
    }

    export type UriPathSeparator = ":" | "/";

    export type UriPathSeparatorOpt = UriPathSeparator | "";

    export type UriSchemeSeparator = ":" | ":/" | "://";

    // #endregion

    export function preventEventDefault(event?: BaseJQueryEventObject | ng.IAngularEvent, stopPropogation: boolean = false): void {
        if (sys.notNil(event)) {
            if (!event.defaultPrevented)
                event.preventDefault();
            if (stopPropogation)
                try { event.stopPropagation(); } catch (e) { /* okay to ignore */ }
        }   
    }
}
