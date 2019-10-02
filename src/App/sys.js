/// <reference path="../Scripts/typings/jquery/jquery.d.ts"/>
/// <reference path="../Scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="../Scripts/typings/angularjs/angular-route.d.ts"/>
/// <reference path="../Scripts/typings/bootstrap/index.d.ts"/>
/**
 * Utility functions.
 *
 * @namespace
 */
var sys;
(function (sys) {
    // #region Constants
    /**
     * Global match of any whitespace, newline or control character.
     *
     * @constant {RegExp}
     * @default
     */
    sys.whitespaceRe = /[\s\r\n\p{C}]+/g;
    /**
     * Matches a string value that might represent a boolean value.
     *
     * @constant {RegExp}
     * @default
     */
    sys.booleanStringRe = /^\s*(?:(y(?:es)?|t(?:rue)?|\+(?!\d))|(no?|f(?:alse)?|-(?!\d))|[+\-]?(\d+(\.\d+)))(?:\s|$)/i;
    // #endregion
    // #region Nil type guards
    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} obj
     * @returns {(obj is null | undefined)}
     */
    function isNil(obj) { return typeof (obj) === 'undefined' || obj === null; }
    sys.isNil = isNil;
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
    function notNil(obj) { return typeof (obj) !== 'undefined' && obj != null; }
    sys.notNil = notNil;
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
    function notNilOrEmpty(value) {
        return (typeof (value) == 'string' || (typeof (value) == 'object' && value != null && Array.isArray(value))) && value.length > 0;
    }
    sys.notNilOrEmpty = notNilOrEmpty;
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
    function isNilOrEmpty(value) {
        return (typeof (value) !== 'string' && (typeof (value) != 'object' || value === null || !Array.isArray(value))) || value.length == 0;
    }
    sys.isNilOrEmpty = isNilOrEmpty;
    /**
     *
     *
     * @export
     * @param {(string | null | undefined)} value
     * @returns {boolean}
     */
    function isNilOrWhiteSpace(value) { return typeof (value) !== 'string' || value.trim().length == 0; }
    sys.isNilOrWhiteSpace = isNilOrWhiteSpace;
    /**
     *
     *
     * @export
     * @param {(string | null | undefined)} value
     * @returns {value is NotNilOrEmpty<string>}
     */
    function notNilOrWhiteSpace(value) { return typeof (value) == 'string' && value.trim().length > 0; }
    sys.notNilOrWhiteSpace = notNilOrWhiteSpace;
    // #endregion
    // #region Primitive type guards
    function isNilOrBoolean(value) {
        let t = typeof value;
        return t === "boolean" || t === "undefined" || (t === "object" && value === null);
    }
    sys.isNilOrBoolean = isNilOrBoolean;
    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @returns {(value is string | null | undefined)}
     */
    function isNilOrString(value) { return (typeof (value) === "string") || (typeof (value) === "undefined") || value === null; }
    sys.isNilOrString = isNilOrString;
    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @returns {(value is string | undefined)}
     */
    function isUndefinedOrString(value) { return (typeof (value) === "string") || (typeof (value) === "undefined") || value === null; }
    sys.isUndefinedOrString = isUndefinedOrString;
    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @returns {(value is string | null)}
     */
    function isNullOrString(value) { return (typeof (value) === "string") || (typeof (value) !== "undefined" && value === null); }
    sys.isNullOrString = isNullOrString;
    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @returns {value is NonNullable<number>}
     */
    function isNumber(value) { return typeof (value) === 'number' && !isNaN(value); }
    sys.isNumber = isNumber;
    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @returns {value is Exclude<number>}
     */
    function notNumber(value) { return typeof (value) !== 'number' || isNaN(value); }
    sys.notNumber = notNumber;
    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @returns {value is number}
     */
    function isFiniteNumber(value) { return typeof (value) === 'number' && !isNaN(value) && Number.isFinite(value); }
    sys.isFiniteNumber = isFiniteNumber;
    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @returns {value is number}
     */
    function isFiniteWholeNumber(value) { return typeof (value) === 'number' && !isNaN(value) && Number.isFinite(value) && Math.round(value) === value; }
    sys.isFiniteWholeNumber = isFiniteWholeNumber;
    function asNotNil(value, opt, trim) {
        if (typeof (value) === "undefined" || value === null)
            return (typeof (opt) !== 'undefined') ? opt : '';
        if (typeof (value) !== 'string')
            return value;
        return ((typeof (opt) === "boolean") ? opt : trim === true) ? value.trim() : value;
    }
    sys.asNotNil = asNotNil;
    // #endregion
    // #region Primitive coersion members
    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @returns {(boolean | null | undefined)}
     */
    function asBooleanOrNullOrUndefined(value) {
        return convertValue(value, isNilOrBoolean, (v) => {
            let m;
            if (typeof (v) === "object") {
                if (Array.isArray(v)) {
                    if (v.length == 0)
                        return false;
                    return v.map((value) => {
                        if (typeof value === "boolean")
                            return value;
                        if (typeof value === "number")
                            return !isNaN(value) && value !== 0;
                        m = sys.booleanStringRe.exec(asString(value));
                        if (isNilOrEmpty(m) || !isNil(m[2]))
                            return false;
                        if (isNil(m[3]))
                            return true;
                        let n = NaN;
                        try {
                            n = parseFloat(value);
                        }
                        catch (_a) { }
                        return !isNaN(n) && n !== 0.0;
                    }).reduce((previousValue, currentValue) => currentValue && previousValue, true);
                }
                try {
                    let o = v.valueOf();
                    if (typeof (o) === "boolean")
                        return o;
                }
                catch ( /* okay to ignore */_a) { /* okay to ignore */ }
            }
            else if (typeof (v) === "function")
                try {
                    let f = v.valueOf();
                    if (typeof (f) === "boolean")
                        return f;
                    if (typeof f !== "boolean")
                        v = f;
                }
                catch ( /* okay to ignore */_b) { /* okay to ignore */ }
            v = asString(v);
            m = sys.booleanStringRe.exec(asString(value));
            if (isNilOrEmpty(m) || !isNil(m[2]))
                return false;
            if (isNil(m[3]))
                return true;
            let n = NaN;
            try {
                n = parseFloat(value);
            }
            catch (_c) { }
            return !isNaN(n) && n !== 0.0;
        });
    }
    sys.asBooleanOrNullOrUndefined = asBooleanOrNullOrUndefined;
    /**
     * Converts a value to a boolean value.
     *
     * @export
     * @param {(any | null | undefined)} value
     * @param {boolean} [defaultValue=false]
     * @returns {boolean}
     */
    function asBoolean(value, defaultValue = false) {
        value = asBooleanOrNullOrUndefined(value);
        return (typeof (value) === "boolean") ? value : defaultValue;
    }
    sys.asBoolean = asBoolean;
    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @returns {(string | null | undefined)}
     */
    function asStringOrNullOrUndefined(value) {
        return convertValue(value, isNilOrString, (v) => {
            if (typeof (v) === "object") {
                if (Array.isArray(v))
                    return v.map((e) => {
                        return convertValue(e, isNilOrString, (u) => {
                            if (typeof (u) === "object") {
                                if (Array.isArray(u))
                                    return u.filter(notNil).join("\n");
                                try {
                                    let p = u.valueOf();
                                    if (typeof (p) === "string")
                                        return p;
                                    p = p.toString();
                                    if (typeof (p) === "string")
                                        return p;
                                }
                                catch ( /* okay to ignore */_a) { /* okay to ignore */ }
                            }
                            else if (typeof (u) === "function")
                                try {
                                    let z = u.ValueOf();
                                    if (typeof (z) === "string")
                                        return z;
                                    z = z.toString();
                                    if (typeof (z) === "string")
                                        return z;
                                }
                                catch ( /* okay to ignore */_b) { /* okay to ignore */ }
                            try {
                                let m = u.toString();
                                if (typeof (m) === "string")
                                    return m;
                            }
                            catch ( /* okay to ignore */_c) { /* okay to ignore */ }
                        });
                    }).filter(notNil).join("\n");
                try {
                    let o = v.valueOf();
                    if (typeof (o) === "string")
                        return o;
                    o = o.toString();
                    if (typeof (o) === "string")
                        return o;
                }
                catch ( /* okay to ignore */_a) { /* okay to ignore */ }
            }
            else if (typeof (v) === "function")
                try {
                    let f = v.valueOf();
                    if (typeof (f) === "string")
                        return f;
                    f = f.toString();
                    if (typeof (f) === "string")
                        return f;
                }
                catch ( /* okay to ignore */_b) { /* okay to ignore */ }
            try {
                let s = v.toString();
                if (typeof (s) === "string")
                    return s;
            }
            catch ( /* okay to ignore */_c) { /* okay to ignore */ }
        });
    }
    sys.asStringOrNullOrUndefined = asStringOrNullOrUndefined;
    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @returns {(string | null)}
     */
    function asStringOrNull(value) {
        value = asStringOrNullOrUndefined(value);
        return (typeof (value) === "undefined") ? null : value;
    }
    sys.asStringOrNull = asStringOrNull;
    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @returns {(string | undefined)}
     */
    function asStringOrUndefined(value) {
        value = asStringOrNullOrUndefined(value);
        if (typeof (value) === "undefined" || typeof (value) === "string")
            return value;
    }
    sys.asStringOrUndefined = asStringOrUndefined;
    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @param {string} [defaultValue=""]
     * @returns {string}
     */
    function asString(value, defaultValue = "") {
        value = asStringOrNullOrUndefined(value);
        return (typeof (value) === "string") ? value : defaultValue;
    }
    sys.asString = asString;
    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @param {string} defaultValue
     * @returns {string}
     */
    function asStringAndNotEmpty(value, defaultValue) {
        value = asStringOrNullOrUndefined(value);
        return (typeof (value) != "string" || value.length) ? defaultValue : value;
    }
    sys.asStringAndNotEmpty = asStringAndNotEmpty;
    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @param {string} defaultValue
     * @param {boolean} [trim=false]
     * @returns {string}
     */
    function asStringAndNotWhiteSpace(value, defaultValue, trim = false) {
        value = asStringOrNullOrUndefined(value);
        if (typeof (value) == "string" && (((trim) ? (value = value.trim()) : value.trim()).length > 0))
            return value;
        return defaultValue;
    }
    sys.asStringAndNotWhiteSpace = asStringAndNotWhiteSpace;
    function asUndefinedOrNotEmpty(value, trim) {
        if (typeof (value) !== 'undefined' && value !== null && value.length > 0)
            return (trim === true && typeof (value) === 'string') ? value.trim() : value;
    }
    sys.asUndefinedOrNotEmpty = asUndefinedOrNotEmpty;
    /**
     *
     *
     * @export
     * @param {(string | null | undefined)} value
     * @param {boolean} [trim]
     * @returns {(string | undefined)}
     */
    function asUndefinedOrNotWhiteSpace(value, trim) {
        if (typeof (value) === 'string') {
            if (trim === true) {
                if ((value = value.trim()).length > 0)
                    return value;
            }
            else if (value.trim().length > 0)
                return value;
        }
    }
    sys.asUndefinedOrNotWhiteSpace = asUndefinedOrNotWhiteSpace;
    function asNullOrNotEmpty(value, trim) {
        if (typeof (value) === 'string') {
            if (trim) {
                if ((value = value.trim()).length > 0)
                    return value;
            }
            else if (value.trim().length > 0)
                return value;
        }
        return null;
    }
    sys.asNullOrNotEmpty = asNullOrNotEmpty;
    /**
     *
     *
     * @export
     * @param {(string | null | undefined)} value
     * @param {boolean} [trim]
     * @returns {(string | null)}
     */
    function asNullOrNotWhiteSpace(value, trim) {
        if (typeof (value) === 'string') {
            if (trim === true) {
                if ((value = value.trim()).length > 0)
                    return value;
            }
            else if (value.trim().length > 0)
                return value;
        }
        return null;
    }
    sys.asNullOrNotWhiteSpace = asNullOrNotWhiteSpace;
    sys.floatingPointNumberRe = /^[+-]?\d+(\.\d+)?$/;
    function asNumber(value, arg1, arg2, allowExtraneousTrailingCharacters) {
        let dv;
        if (typeof (arg1) === "boolean") {
            allowExtraneousTrailingCharacters = arg2 === true;
            arg2 = arg1;
            dv = NaN;
        }
        else
            dv = (typeof (dv) === 'number') ? dv : NaN;
        return convertValue(value, isNumber, (v) => {
            if (typeof (v) === "boolean")
                return (v) ? 1 : 0;
            if (typeof (v) === "function" && (typeof (v) === "object" && !Array.isArray(v)))
                try {
                    let f = v.valueOf();
                    if (isNumber(f))
                        return f;
                    if (typeof (v) === "boolean")
                        return (v) ? 1 : 0;
                    if (typeof (f) == "string")
                        v = f;
                }
                catch ( /* okay to ignore */_a) { /* okay to ignore */ }
            if (typeof (v) !== "string")
                v = asString(v, "");
            if (arg2)
                v = v.trim();
            let n = parseFloat(v);
            if (typeof (n) === 'number' && !isNaN(n) && (allowExtraneousTrailingCharacters || sys.floatingPointNumberRe.test(v)))
                return n;
            return dv;
        }, (v) => { return dv; });
    }
    sys.asNumber = asNumber;
    function asWholeNumber(value, arg1, arg2, allowExtraneousTrailingCharacters) {
        let dv;
        if (typeof (arg1) === "boolean") {
            allowExtraneousTrailingCharacters = arg2 === true;
            arg2 = arg1;
            dv = NaN;
        }
        else
            dv = (typeof dv !== 'number' || isNaN(dv)) ? NaN : Math.round(dv);
        return convertValue(value, isNumber, (v) => {
            if (typeof (v) === "boolean")
                return (v) ? 1 : 0;
            if (typeof (v) === "function" && (typeof (v) === "object" && !Array.isArray(v)))
                try {
                    let f = v.valueOf();
                    if (isNumber(f))
                        return Math.round(f);
                    if (typeof (v) === "boolean")
                        return (v) ? 1 : 0;
                    if (typeof (f) == "string")
                        v = f;
                }
                catch ( /* okay to ignore */_a) { /* okay to ignore */ }
            if (typeof (v) !== "string")
                v = asString(v, "");
            if (arg2)
                v = v.trim();
            let n = parseFloat(v);
            if (typeof (n) === 'number' && !isNaN(n) && (allowExtraneousTrailingCharacters || sys.floatingPointNumberRe.test(v)))
                return Math.round(n);
            return dv;
        }, (v) => { return dv; });
    }
    sys.asWholeNumber = asWholeNumber;
    /**
     *
     *
     * @export
     * @template T
     * @param {ValueConversionConfig<T>} config
     * @returns {config is IValueOrNilConversionConfig<T>}
     */
    function hasConvertWhenNil(config) { return typeof config.whenNil !== "undefined"; }
    sys.hasConvertWhenNil = hasConvertWhenNil;
    /**
     *
     *
     * @export
     * @template T
     * @param {ValueConversionConfig<T>} config
     * @returns {config is ValueAndOrNullConversionConfig<T>}
     */
    function hasConvertWhenNull(config) { return typeof config.whenNull !== "undefined"; }
    sys.hasConvertWhenNull = hasConvertWhenNull;
    /**
     *
     *
     * @export
     * @template T
     * @param {ValueConversionConfig<T>} config
     * @returns {config is ValueAndOrUndefinedConversionConfig<T>}
     */
    function hasConvertWhenUndefined(config) { return typeof config.whenUndefined !== "undefined"; }
    sys.hasConvertWhenUndefined = hasConvertWhenUndefined;
    function isTypeGuardFunc(obj) { return typeof obj === "function"; }
    function convertValue(value, arg1, convertFn, whenNil, whenUndefined, convertFailed, whenConverted, whenMatched, getFinal) {
        if (isTypeGuardFunc(arg1)) {
            if (arguments.length == 4)
                arg1 = { convert: convertFn, test: arg1, whenNil: whenNil };
            else if (arguments.length > 5) {
                arg1 = { convert: convertFn, test: arg1, whenNull: whenNil, whenUndefined: whenUndefined, convertFailed: convertFailed, whenConverted: whenConverted, whenMatched: whenMatched, getFinal: getFinal };
            }
            else
                arg1 = { convert: convertFn, test: arg1 };
        }
        let result = ((config) => {
            let convertedValue = ((config) => {
                if (typeof value === "undefined") {
                    if (hasConvertWhenUndefined(arg1))
                        return [(typeof arg1.whenUndefined === "function") ? arg1.whenUndefined() : arg1.whenUndefined, false];
                    if (hasConvertWhenNil(arg1))
                        return [(typeof arg1.whenNil === "function") ? arg1.whenNil(value) : arg1.whenNil, false];
                }
                else if (typeof value === "object" && value === null) {
                    if (hasConvertWhenNull(arg1))
                        return [(typeof arg1.whenNull === "function") ? arg1.whenNull() : arg1.whenNull, false];
                    if (hasConvertWhenNil(arg1))
                        return [(typeof arg1.whenNil === "function") ? arg1.whenNil(value) : arg1.whenNil, false];
                }
                if (arg1.test(value))
                    return [(typeof arg1.whenMatched === "function") ? arg1.whenMatched(value) : value, true];
                try {
                    return [arg1.convert(value), false];
                }
                catch (e) {
                    return [(typeof arg1.convertFailed === "function") ? arg1.convertFailed(value, e) : arg1.convertFailed, false];
                }
            })(config);
            if (convertedValue[1])
                return convertedValue[0];
            return (typeof (config.whenConverted) === "function") ? config.whenConverted(convertedValue[0]) : convertedValue[0];
        })(arg1);
        return (typeof (arg1.getFinal) === "function") ? arg1.getFinal(result) : result;
    }
    sys.convertValue = convertValue;
    function testBooleanChange(currentValue, newValue, arg2, arg3, arg4, arg5) {
        let n;
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
        }
        else {
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
    sys.testBooleanChange = testBooleanChange;
    function testStringChange(currentValue, newValue, arg2, arg3, arg4, arg5) {
        let n, o;
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
                arg3.call(arg5, n, o);
            else if (arguments.length > 4 && typeof arg4 !== "function")
                arg3.call(arg4, n, o);
            else
                arg3(n, o);
        }
        else {
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
                arg2(n, o);
        }
        return true;
    }
    sys.testStringChange = testStringChange;
    function map(source, callbackfn, thisArg) {
        let iterator = source[Symbol.iterator]();
        let r = iterator.next();
        let result = [];
        let index = -1;
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
    sys.map = map;
    function every(source, callbackfn, thisArg) {
        let iterator = source[Symbol.iterator]();
        let r = iterator.next();
        let index = -1;
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
    sys.every = every;
    function some(source, callbackfn, thisArg) {
        let iterator = source[Symbol.iterator]();
        let r = iterator.next();
        let index = -1;
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
    sys.some = some;
    function forEach(source, callbackfn, thisArg) {
        let iterator = source[Symbol.iterator]();
        let r = iterator.next();
        let index = -1;
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
    sys.forEach = forEach;
    function filter(source, callbackfn, thisArg) {
        let iterator = source[Symbol.iterator]();
        let r = iterator.next();
        let result = [];
        let index = -1;
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
    sys.filter = filter;
    function reduce(source, callbackfn, initialValue, thisArg) {
        let iterator = source[Symbol.iterator]();
        let r = iterator.next();
        let result = initialValue;
        let index = -1;
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
    sys.reduce = reduce;
    function findFirstOrDefault(source, testCallbackFn, onMatchCallback, noMatchCallback, thisArg) {
        if (isNil(source))
            return (arguments.length > 4) ? noMatchCallback.call(thisArg, source) : noMatchCallback(source);
        let iterator = source[Symbol.iterator]();
        let r = iterator.next();
        let index = -1;
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
    sys.findFirstOrDefault = findFirstOrDefault;
    function findFirst(source, testCallbackFn, onMatchCallback, thisArg) {
        if (!isNil(source)) {
            let iterator = source[Symbol.iterator]();
            let r = iterator.next();
            let index = -1;
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
    sys.findFirst = findFirst;
    function firstOrDefault(source, testCallbackFn, defaultValue, thisArg) {
        if (isNil(source))
            return defaultValue;
        let iterator = source[Symbol.iterator]();
        let r = iterator.next();
        let index = -1;
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
    sys.firstOrDefault = firstOrDefault;
    function first(source, testCallbackFn, thisArg) {
        if (!isNil(source)) {
            let iterator = source[Symbol.iterator]();
            let r = iterator.next();
            let index = -1;
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
    sys.first = first;
    function indexOf(source, callbackfn, thisArg) {
        let iterator = source[Symbol.iterator]();
        let r = iterator.next();
        let index = -1;
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
    sys.indexOf = indexOf;
    function last(source, callbackfn, thisArg) {
        let iterator = source[Symbol.iterator]();
        let r = iterator.next();
        let result;
        let index = -1;
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
    sys.last = last;
    /**
     *
     *
     * @export
     * @template T
     * @param {Iterable<T>} source
     * @param {number} count
     * @returns {T[]}
     */
    function takeFirst(source, count) {
        let iterator = source[Symbol.iterator]();
        let r = iterator.next();
        let result = [];
        let index = 0;
        while (!r.done) {
            if (count == index)
                break;
            result.push(r.value);
            count--;
            r = iterator.next();
        }
        return result;
    }
    sys.takeFirst = takeFirst;
    function takeWhile(source, callbackfn, thisArg) {
        let iterator = source[Symbol.iterator]();
        let r = iterator.next();
        let result = [];
        let index = -1;
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
    sys.takeWhile = takeWhile;
    /**
     *
     *
     * @export
     * @template T
     * @param {Iterable<T>} source
     * @param {Number} count
     * @returns {T[]}
     */
    function skipFirst(source, count) {
        let iterator = source[Symbol.iterator]();
        let r = iterator.next();
        let result = [];
        let index = -1;
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
    sys.skipFirst = skipFirst;
    function skipWhile(source, callbackfn, thisArg) {
        let iterator = source[Symbol.iterator]();
        let r = iterator.next();
        let result = [];
        let index = -1;
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
    sys.skipWhile = skipWhile;
    function unique(source, callbackfn, thisArg) {
        if (typeof (callbackfn) !== 'function')
            callbackfn = function (x, y) { return x === y; };
        let iterator = source[Symbol.iterator]();
        let r = iterator.next();
        let result = [];
        if (!r.done) {
            result.push(r.value);
            r = iterator.next();
            let index = 0;
            if (typeof (thisArg) !== 'undefined')
                while (!r.done) {
                    if (!result.some((value) => callbackfn.call(thisArg, r.value, value)))
                        result.push(r.value);
                    r = iterator.next();
                }
            else
                while (!r.done) {
                    if (!result.some((value) => callbackfn(r.value, value)))
                        result.push(r.value);
                    r = iterator.next();
                }
        }
        return result;
    }
    sys.unique = unique;
    /**
     *
     *
     * @export
     * @template T
     * @param {Iterable<T>} source
     * @param {string} [separator]
     * @returns {string}
     */
    function join(source, separator) {
        if (Array.isArray(source))
            return source.join(separator);
        let iterator = source[Symbol.iterator]();
        let r = iterator.next();
        let result = [];
        let index = 0;
        while (!r.done) {
            result.push(r.value);
            r = iterator.next();
        }
        return result.join(separator);
    }
    sys.join = join;
    /**
     *
     *
     * @param {(any | null | undefined)} obj
     * @returns {obj is Iterable<any>}
     */
    function isIterable(obj) { return typeof (obj) !== 'undefined' && typeof (obj[Symbol.iterator]) === 'function'; }
    sys.isIterable = isIterable;
    class LinkManager {
        constructor() {
            this._id = Symbol();
            this._next = Symbol();
            this._previous = Symbol();
        }
        getPrevious(obj) { return obj[this._previous]; }
        getNext(obj) { return obj[this._next]; }
        getId(obj) { return obj[this._id]; }
        setPrevious(obj, value) { obj[this._previous] = value; return value; }
        setNext(obj, value) { obj[this._next] = value; return value; }
        setId(obj) { obj[this._id] = Symbol(); }
        clearId(obj) { obj[this._id] = undefined; }
    }
    class UniqueLinkedSet {
        constructor() {
            this._k = new LinkManager();
            this._size = 0;
        }
        get firstElement() { return this._firstElement; }
        get lastElement() { return this._lastElement; }
        get size() { return this._size; }
        add(value) { return this.insertElementAfter(this._lastElement, value); }
        clear() {
            let previous = this._firstElement;
            if (typeof previous === "undefined")
                return;
            let current;
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
        delete(value) {
            if (typeof value !== "object" || value === null || typeof this._k.getId(value) === "undefined")
                return false;
            this._k.clearId(value);
            if (this._k.getPrevious(value) === null) {
                if ((this._firstElement = this._k.getNext(value)) === null) {
                    this._k.setPrevious(value, this._k.setNext(value, this._firstElement = this._lastElement = undefined));
                    this._size = 0;
                }
                else {
                    this._k.setPrevious(this._firstElement = this._k.getNext(value), null);
                    this._k.setPrevious(value, this._k.setNext(value, undefined));
                    this._size--;
                }
            }
            else {
                if (this._k.setNext(this._k.getPrevious(value), this._k.getNext(value)) === null)
                    this._k.setNext(this._lastElement = this._k.getPrevious(value), null);
                else
                    this._k.setPrevious(this._k.getNext(value), this._k.getPrevious(value));
                this._size--;
                this._k.setPrevious(value, this._k.setNext(value, undefined));
            }
            return true;
        }
        entries() { return new LinkedListEntryIterator(this); }
        forEach(callbackfn, thisArg) {
            if (arguments.length > 1)
                for (let value = this._firstElement; typeof value !== "undefined"; value = this._k.getNext(value))
                    callbackfn.call(thisArg, value, value, this);
            else
                for (let value = this._firstElement; typeof value !== "undefined"; value = this._k.getNext(value))
                    callbackfn(value, value, this);
        }
        getPreviousElement(refItem) {
            if (typeof refItem === "object" && refItem !== null) {
                let previous = this._k.getPrevious(refItem);
                if (previous !== null)
                    return previous;
            }
        }
        getNextElement(refItem) {
            if (typeof refItem === "object" && refItem !== null) {
                let next = this._k.getNext(refItem);
                if (next !== null)
                    return next;
            }
        }
        has(refItem) { return typeof refItem === "object" && refItem !== null && typeof this._k.getId(refItem) === "symbol"; }
        insertElementAfter(refItem, ...items) {
            this._insertElementAfter(refItem, items);
            return this;
        }
        _insertElementAfter(refItem, items) {
            if (isNil(items) || items.length == 0)
                return;
            items.forEach((value) => {
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
                    for (let i = 1; i < items.length; i++) {
                        if (typeof this._k.getId(items[i]) !== "symbol") {
                            this._k.setId(refItem = this._k.setNext(this._k.setPrevious(items[i], refItem), items[i]));
                            this._size++;
                        }
                    }
                    this._k.setNext(refItem, null);
                    return;
                }
            }
            else {
                if (typeof refItem !== "object" || refItem === null)
                    throw new Error("Invalid reference item argument type.");
                if (typeof this._k.getId(refItem) !== "symbol")
                    throw new Error("Reference item does not belong to the target list.");
            }
            let next = this._k.getNext(refItem);
            items.forEach((value) => {
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
        _insertElementBefore(refItem, items) {
            if (isNil(items) || items.length == 0)
                return;
            items.forEach((value) => {
                if (typeof value !== "object" || value === null)
                    throw new Error("Invalid new item argument type.");
                if (typeof this._k.getId(value) === "symbol")
                    throw new Error("New item already exists in target list.");
            });
            let index = items.length - 1;
            let previous;
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
                }
                else
                    previous = this._k.getPrevious(refItem);
            }
            else {
                if (typeof refItem !== "object" || refItem === null)
                    throw new Error("Invalid reference item argument type.");
                if (typeof this._k.getId(refItem) !== "symbol")
                    throw new Error("Reference item does not belong to the target list.");
                previous = this._k.getPrevious(refItem);
            }
            for (let i = index; i > -1; i--) {
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
        insertElementBefore(refItem, ...items) {
            this._insertElementBefore(refItem, items);
            return this;
        }
        get(index) {
            if (!isNumber(index))
                throw new Error("Invalid index argument");
            if (isNumber(index) && index > -1 && index < this._size) {
                let item = this._firstElement;
                while (!isNil(item)) {
                    if (index-- === 0)
                        return item;
                    item = this._k.getNext(item);
                }
            }
            throw new RangeError("Index out of range");
        }
        set(index, value) {
            let current = this.get(index);
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
        indexOf(searchElement, fromIndex) {
            let id;
            if (typeof searchElement === "object" && searchElement !== null && typeof (id = this._k.getId(searchElement)) === "symbol") {
                if (!isNumber(fromIndex))
                    fromIndex = 0;
                if (fromIndex > -1 && fromIndex < this._size) {
                    let current = this._firstElement;
                    let index = fromIndex;
                    while (fromIndex-- > 0) {
                        if (this._k.getId(current) === id || isNil(current = this._k.getNext(current)))
                            return -1;
                    }
                    do {
                        if (this._k.getId(current) === id)
                            return fromIndex;
                        if (isNil(current = this._k.getNext(current)))
                            ``;
                        break;
                    } while (++index < this._size);
                }
            }
            return -1;
        }
        insert(index, ...items) {
            this._insertElementBefore(this.get(index), items);
            return this;
        }
        keys() { return new LinkedListIterator(this); }
        lastIndexOf(searchElement, fromIndex) {
            if (!isNumber(fromIndex))
                fromIndex = 0;
            let id;
            if (fromIndex > -1 && fromIndex < this._size && typeof searchElement === "object" && searchElement !== null && typeof (id = this._k.getId(searchElement)) === "symbol") {
                let current = this._lastElement;
                let index = this._size - 1;
                while (!isNil(current) && fromIndex >= fromIndex) {
                    if (this._k.getId(current) === id)
                        return index;
                    index--;
                }
            }
        }
        sort(compareFn) {
            if (this._size < 2)
                return this;
            let arr = [];
            this.forEach((value) => arr.push(value));
            arr = (arguments.length == 0) ? arr.sort() : arr.sort(compareFn);
            let previous = arr[0];
            this._k.setPrevious(previous, null);
            for (let i = 1; i < arr.length; i++)
                previous = this._k.setNext(this._k.setPrevious(arr[i], arr[i - 1]), arr[i]);
            this._k.setNext(previous, null);
            return this;
        }
        splice(start, deleteCount, ...items) {
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
                items.forEach((value) => {
                    if (typeof value !== "object" || value === null)
                        throw new Error("Invalid new item argument type.");
                    if (typeof this._k.getId(value) === "symbol")
                        throw new Error("New item already exists in target list.");
                });
                this._insertElementBefore(undefined, items);
                return [];
            }
            if (start > -1 && start < this._size) {
                let refItem = this.get(start);
                if (!isNil(refItem)) {
                    let deleted = [];
                    if (deleteCount < 1)
                        refItem = this._k.getNext(refItem);
                    else {
                        do {
                            deleted.push(refItem);
                            let n = this._k.getNext(refItem);
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
        values() { return new LinkedListIterator(this); }
        [Symbol.iterator]() { return new LinkedListIterator(this); }
    }
    sys.UniqueLinkedSet = UniqueLinkedSet;
    class LinkedListIterator {
        constructor(list) { this._isDone = typeof (this._current = (this._list = list).firstElement) === "undefined" || this._current === null; }
        next(value) {
            let result = { done: this._isDone, value: this._current };
            if (!(result.done || typeof (this._current = this._list.getNextElement(this._current)) !== "undefined" && this._current !== null))
                this._isDone = true;
            return result;
        }
        [Symbol.iterator]() { return this; }
    }
    sys.LinkedListIterator = LinkedListIterator;
    class LinkedListEntryIterator {
        constructor(list) { this._isDone = typeof (this._current = (this._list = list).firstElement) === "undefined" || this._current === null; }
        next(value) {
            let result = { done: this._isDone, value: [this._current, this._current] };
            if (!(result.done || typeof (this._current = this._list.getNextElement(this._current)) !== "undefined" && this._current !== null))
                this._isDone = true;
            return result;
        }
        [Symbol.iterator]() { return this; }
    }
    sys.LinkedListEntryIterator = LinkedListEntryIterator;
    ;
    ;
    /**
     *
     *
     * @param {*} value
     * @returns {ErrorResult}
     */
    function asErrorResult(value) {
        if (typeof (value) !== "undefined" && value !== null) {
            let message;
            if (typeof (value) === "string")
                return ((message = value.trim()).length == 0) ? "Unexpected error" : message;
            if (value instanceof Error)
                return value;
            if (typeof (value) === "object" && ((typeof value.message !== "undefined") && value.message !== null)) {
                if (typeof value.data !== "undefined" && value.data !== null)
                    return value;
                if ((message = ((typeof value.message === "string") ? value.message : "" + value.message).trim()).length == 0)
                    message = ("" + value).trim();
            }
            else
                message = ("" + value).trim();
            return {
                message: (message.length == 0) ? "Unexpected Error" : message,
                data: value
            };
        }
    }
    sys.asErrorResult = asErrorResult;
    // #endregion
    // #region URL parsing
    const REGEX_USERINFO_ENCODE = /( |%20)|((?:%(?:[a-f][\dA-Fa-f]|[\dA-Fa-f][a-f]))+)|((?:%(?![\dA-F]{2})|[^ !$&-.\d;=-\[\]_a-zA-Z~\ud800-\udbff%])+)/g;
    const REGEX_SEGMENT_ENCODE = /( |%20)|((?:%(?:[a-f][\dA-Fa-f]|[\dA-Fa-f][a-f]))+)|((?:%(?![\dA-F]{2})|[^ !$&-.\d;=@-\[\]_a-zA-Z~\ud800-\udbff%])+)/g;
    const REGEX_PATH_ENCODE = /( |%20)|(\\)|((?:%(?:[a-f][\dA-Fa-f]|[\dA-Fa-f][a-f]))+)|((?:%(?![\dA-F]{2})|[^ !$&-.\d;=@-\[\]_a-zA-Z~\ud800-\udbff\/:%])+)/g;
    const REGEX_QUERY_ENCODE = /( |%20)|((?:%(?:[a-f][\dA-Fa-f]|[\dA-Fa-f][a-f]))+)|((?:%(?![\dA-F]{2})|[^ !$&-.\d;=@-\[\]_a-zA-Z~\ud800-\udbff\\\/:%])+)/g;
    const REGEX_QUERY_COMPONENT_ENCODE = /( |%20)|((?:%(?:[a-f][\dA-Fa-f]|[\dA-Fa-f][a-f]))+)|((?:%(?![\dA-F]{2})|[^ !$-.\d;@-\[\]_a-zA-Z~\ud800-\udbff\\\/:%])+)/g;
    const REGEX_QUERY_COMPONENT_DECODE = /(\+)|((?:%(?:[a-f][\dA-Fa-f]|[\dA-Fa-f][a-f]))+)|((?:%[\dA-F]{2})+)/g;
    const REGEX_PATH_SEGMENT = /([\/:])([^\/:]*)/;
    const REGEX_URI_VALIDATE_SCHEME = /^[a-z_][-.\dA-_a-z~\ud800-\udbff]*$/;
    const REGEX_URI_VALIDATE_HOSTNAME = /^[-.\dA-\[\]_a-z~\ud800-\udbff]+/;
    const REGEX_URI_PARSE_PROTOCOL = /^([^:?#@/\\]+)(:[\\/]{0,2})/;
    const REGEX_URI_PARSE_USERINFO = /^([^:?#@/\\]*)(?::([^?#@/\\]*))@/;
    function encodeUserInfo(value) {
        return asString(value, "").replace(REGEX_USERINFO_ENCODE, function (m, w, h, e) {
            if (typeof w === "string")
                return "+";
            if (typeof h === "string")
                return h.toUpperCase();
            return encodeURIComponent(e);
        });
    }
    function encodePath(value) {
        return asString(value, "").replace(REGEX_PATH_ENCODE, function (m, w, b, h, e) {
            if (typeof w === "string")
                return "+";
            if (typeof b === "string")
                return "/";
            if (typeof h === "string")
                return h.toUpperCase();
            return encodeURIComponent(e);
        });
    }
    function encodePathSegment(value) {
        return asString(value, "").replace(REGEX_SEGMENT_ENCODE, function (m, w, h, e) {
            if (typeof w === "string")
                return "+";
            if (typeof h === "string")
                return h.toUpperCase();
            return encodeURIComponent(e);
        });
    }
    function encodeQuery(value) {
        return asString(value, "").replace(REGEX_QUERY_ENCODE, function (m, w, h, e) {
            if (typeof w === "string")
                return "+";
            if (typeof h === "string")
                return h.toUpperCase();
            return encodeURIComponent(e);
        });
    }
    function encodeQueryComponent(value) {
        return asString(value, "").replace(REGEX_QUERY_COMPONENT_ENCODE, function (m, w, h, e) {
            if (typeof w === "string")
                return "+";
            if (typeof h === "string")
                return h.toUpperCase();
            return encodeURIComponent(e);
        });
    }
    function decodeUriString(value) {
        return asString(value, "").replace(REGEX_QUERY_COMPONENT_ENCODE, function (m, p, l, u) {
            if (typeof p === "string")
                return " ";
            if (typeof l === "string")
                return decodeURIComponent(l.toUpperCase());
            return decodeURIComponent(u);
        });
    }
    // #endregion
    function preventEventDefault(event, stopPropogation = false) {
        if (sys.notNil(event)) {
            if (!event.defaultPrevented)
                event.preventDefault();
            if (stopPropogation)
                try {
                    event.stopPropagation();
                }
                catch (e) { /* okay to ignore */ }
        }
    }
    sys.preventEventDefault = preventEventDefault;
})(sys || (sys = {}));
//# sourceMappingURL=sys.js.map