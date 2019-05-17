/// <reference path="Scripts/typings/jquery/jquery.d.ts"/>
/// <reference path="Scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="Scripts/typings/angularjs/angular-route.d.ts"/>

namespace app {
    export let mainModule: ng.IModule = angular.module("mainModule");
    interface INavigationLinkConfig {
        href: string;
        text: string;
        pageId?: string;
        target?: string;
        disabled?: boolean;
        links?: INavigationLinkConfig[];
    }
    interface IAppConfig {
        links: INavigationLinkConfig[];
    }
    interface IAppConfigRequestInfo {
        status?: number;
        headers?: ng.IHttpHeadersGetter;
        config?: ng.IRequestConfig;
        statusText: string;
        error?: any;
    }
    interface INavigationLink extends INavigationLinkConfig {
        disabled: boolean;
        links: INavigationLink[];
        cssClass: string[];
        onClick(): boolean;
    }
    interface IAppConfigLoadResult {
        requestInfo: IAppConfigRequestInfo;
        links: INavigationLink[];
    }
    function sanitizeNavigationLinks(pages?: INavigationLinkConfig[]): INavigationLink[] {
        if (typeof (pages) === "undefined" || pages === null)
            return [];
        if (typeof (pages) !== "object" || !Array.isArray(pages))
            return [{ href: "#", text: "(invalid configuration data)", disabled: true, links: [], cssClass: ["nav-item", "disabled"], onClick: () => { return false; } }];
        return pages.filter(notNil).map((item: INavigationLinkConfig) => {
            if (typeof (item) !== "object")
                return { href: "#", text: "(invalid configuration data)", disabled: true, links: [], cssClass: ["nav-item", "disabled"], onClick: () => { return false; } };

            if (isNilOrWhiteSpace(item.href)) {
                item.href = "#";
                item.disabled = true;
            }
            if (item.disabled)
                return { href: item.href, text: item.text, disabled: true, links: sanitizeNavigationLinks(item.links), cssClass: ["nav-item", "disabled"], onClick: () => { return false; } };
            return { href: item.href, text: item.text, disabled: false, links: sanitizeNavigationLinks(item.links), cssClass: ["nav-item"], onClick: () => { return true; } };
        });
    }
    class applicationConfigurationLoader implements ng.IPromise<IAppConfigLoadResult> {
        private _get: ng.IPromise<IAppConfigLoadResult>;
        then<TResult>(successCallback: (promiseValue: IAppConfigLoadResult) => TResult | ng.IPromise<TResult>, errorCallback?: (reason: any) => any, notifyCallback?: (state: any) => any): ng.IPromise<TResult> {
            return this._get.then(successCallback, errorCallback, notifyCallback);
        }
        catch<TResult>(onRejected: (reason: any) => TResult | ng.IPromise<TResult>): ng.IPromise<TResult> { return this._get.catch(onRejected); }
        finally(finallyCallback: () => any): ng.IPromise<IAppConfigLoadResult> { return this._get.finally(finallyCallback); }
        constructor($http: ng.IHttpService) {
            
            this._get = $http.get<IAppConfig>('appConfig.json').then((promiseValue: ng.IHttpPromiseCallbackArg<IAppConfig>) => {
                let requestInfo: IAppConfigRequestInfo = {
                    status: promiseValue.status,
                    headers: promiseValue.headers,
                    config: promiseValue.config,
                    statusText: promiseValue.statusText
                }
                if (typeof (promiseValue.data) === 'undefined' || promiseValue.data == null)
                    requestInfo.error = "No data returned.";
                else if (typeof (promiseValue.data) !== 'object')
                    requestInfo.error = "Invalid data.";
                else if (typeof (promiseValue.data.links) != 'object' || promiseValue.data.links === null || !Array.isArray(promiseValue.data.links))
                    requestInfo.error = "Invalid pages configuration";
                return <IAppConfigLoadResult>{
                    requestInfo: requestInfo,
                    links: sanitizeNavigationLinks(promiseValue.data.links)
                };
            }, (reason: any) => { return <IAppConfigLoadResult>{ requestInfo: { statusText: asString(reason, "Unknown error") }, links: [] }; });
        }
    }
    mainModule.service("applicationConfigurationLoader", applicationConfigurationLoader);

    function hasActiveNavItem(links: INavigationLink[], pageId: string) {
        for (let i: number = 0; i < this.$scope.links.length; i++) {
            if (links[i].pageId === this.$scope.currentPageId)
                return true;
        }
        for (let i: number = 0; i < this.$scope.links.length; i++) {
            if (hasActiveNavItem(links[i].links, pageId))
                return true;
        }
        return false;
    }

    interface ITopNavScope extends ng.IScope {
        headerText: string;
        links: INavigationLink[];
        initializeTopNav(pageId: string, navLoader: applicationConfigurationLoader): void;
    }
    class TopNavController implements ng.IController {
        constructor(protected $scope: ITopNavScope, loader: applicationConfigurationLoader) {
            let controller: TopNavController = this;
            $scope.initializeTopNav = (pageId: string, navLoader: applicationConfigurationLoader) => { return controller.initializeTopNav(pageId, navLoader); };
        }
        $doCheck() { }
        initializeTopNav(pageId: string, navLoader: applicationConfigurationLoader): void {
            navLoader.then((result: IAppConfigLoadResult) => {
                this.$scope.links = result.links;
                if (isNilOrWhiteSpace(pageId))
                    return;
                for (let i: number = 0; i < this.$scope.links.length; i++) {
                    if (this.$scope.links[i].pageId === pageId) {
                        this.$scope.links[i].cssClass.push("active");
                        this.$scope.links[i].href = "#";
                        this.$scope.links[i].onClick = () => { return false; }
                        return;
                    }
                }
                for (let i: number = 0; i < this.$scope.links.length; i++) {
                    if (hasActiveNavItem(this.$scope.links[i].links, pageId)) {
                        this.$scope.links[i].cssClass.push("active");
                        return;
                    }
                }
            });
        }
    }

    interface ITopNavAttributes {
        headerText: string;
        pageName: string;
    };
    mainModule.directive('topNavAndHeader', ['navigationLoader', (navLoader: applicationConfigurationLoader) => {
        return <ng.IDirective>{
            restrict: "E",
            scope: {},
            controller: ["$scope", "applicationConfigurationLoader"],
            link: (scope: ITopNavScope, element: JQuery, attributes: ITopNavAttributes) => {
                scope.headerText = attributes.headerText;
                navLoader.then((promiseValue: IAppConfigLoadResult) => {
                    scope.initializeTopNav(attributes.pageName, navLoader);
                });
            }
        };
    }]);

    // #region Utility functions

    export function isNil(obj: any | null | undefined): obj is null | undefined { return typeof (obj) === 'undefined' || obj === null; }

    export function notNil<T>(obj: T | null | undefined): obj is T;
    export function notNil(obj: any | null | undefined): obj is boolean | number | string | object | symbol;
    export function notNil(obj: any | null | undefined): boolean { return typeof (obj) !== 'undefined' && obj != null; }

    export function notNilOrEmpty<T>(value: Array<T> | null | undefined): value is Array<T>;
    export function notNilOrEmpty(value: Array<any> | null | undefined): value is Array<any>;
    export function notNilOrEmpty(value: string | null | undefined): value is string;
    export function notNilOrEmpty(value: string | Array<any> | null | undefined): value is string | Array<any> {
        return (typeof (value) == 'string' || (typeof (value) == 'object' && value != null && Array.isArray(value))) && value.length > 0;
    }


    export function isNilOrEmpty<T>(value: Array<T> | null | undefined): value is ({ length: 0 } & Array<T>) | null | undefined;
    export function isNilOrEmpty(value: Array<any> | null | undefined): value is ({ length: 0 } & Array<any>) | null | undefined;
    export function isNilOrEmpty(value: string | null | undefined): value is ({ length: 0 } & string) | null | undefined;
    export function isNilOrEmpty(value: string | Array<any> | null | undefined): value is ({ length: 0 } & string) | ({ length: 0 } & Array<any>) | null | undefined {
        return (typeof (value) !== 'string' && (typeof (value) != 'object' || value === null || !Array.isArray(value))) || value.length == 0;
    }

    export function isNilOrWhiteSpace(value: string | null | undefined): boolean { return typeof (value) !== 'string' || value.trim().length == 0; }

    export function notNilOrWhiteSpace(value: string | null | undefined): value is string { return typeof (value) == 'string' && value.trim().length > 0 }

    export function asNotNil<T>(value: T | null | undefined, defaultValue: T): T;
    export function asNotNil(value: string | null | undefined, trim?: boolean): string;
    export function asNotNil(value: string | null | undefined, defaultValue: string, trim: boolean): string;
    export function asNotNil(value: any | null | undefined, opt?: any, trim?: boolean): any {
        if (typeof (value) === "undefined" || value === null)
            return (typeof (opt) !== 'undefined') ? opt : '';
        if (typeof (value) !== 'string')
            return value;
        return ((typeof (opt) === "boolean") ? opt : trim === true) ? value.trim() : value;
    }

    export interface IValueTestFunc<T> { (value: any): value is T };
    export interface IValueConvertFunc<T> { (value: any): T };
    export type NilConvertSpec<T> = { (value: null | undefined): T } | T;
    export type GetValueSpec<T> = { (): T } | T;
    export type ValueConvertFailedSpec<T> = { (value: any, error: any): T } | T;
    export interface IValueFinalizeFunc<T> { (value: T): T };
    interface IConvertValueHandlers<T> {
        test: IValueTestFunc<T>;
        convert: IValueConvertFunc<T>;
        convertFailed?: ValueConvertFailedSpec<T>;
        whenConverted?: IValueFinalizeFunc<T>;
        whenMatched?: IValueFinalizeFunc<T>;
        getFinal?: IValueFinalizeFunc<T>;
    }

    interface IConvertValueOrNilHandlers<T> extends IConvertValueHandlers<T> { whenNil: NilConvertSpec<T>; }

    interface IConvertValueOrNullHandlers<T> extends IConvertValueHandlers<T> { whenNull: GetValueSpec<T>; }

    interface IConvertValueOrUndefinedHandlers<T> extends IConvertValueHandlers<T> { whenUndefined: GetValueSpec<T>; }

    interface IConvertValueNullOrUndefinedHandlers<T> extends IConvertValueOrNullHandlers<T>, IConvertValueOrUndefinedHandlers<T> { }

    export type ConvertValueNullAndOrUndefinedHandlers<T> = IConvertValueNullOrUndefinedHandlers<T> | IConvertValueOrUndefinedHandlers<T> | IConvertValueOrNullHandlers<T>;

    export type ConvertValueHandlers<T> = IConvertValueHandlers<T> | IConvertValueOrNilHandlers<T> | ConvertValueNullAndOrUndefinedHandlers<T>;

    export type ConvertValueAndOrNullHandlers<T> = IConvertValueOrNullHandlers<T> | IConvertValueNullOrUndefinedHandlers<T>;

    export type ConvertValueAndOrUndefinedHandlers<T> = IConvertValueOrUndefinedHandlers<T> | IConvertValueNullOrUndefinedHandlers<T>;

    export function hasConvertWhenNull<T>(h: ConvertValueHandlers<T>): h is ConvertValueAndOrNullHandlers<T> { return (typeof ((<ConvertValueAndOrNullHandlers<T>>h).whenNull) !== "undefined"); }

    export function hasConvertWhenUndefined<T>(h: ConvertValueHandlers<T>): h is ConvertValueAndOrUndefinedHandlers<T> { return (typeof ((<ConvertValueAndOrUndefinedHandlers<T>>h).whenUndefined) !== "undefined"); }

    export function hasConvertWhenNil<T>(h: ConvertValueHandlers<T>): h is IConvertValueOrNilHandlers<T> { return (typeof ((<IConvertValueOrNilHandlers<T>>h).whenNil) !== "undefined"); }

    /*
     * arg4                                       arg5                                       arg6                                   arg7
     * whenUndefined: GetValueSpec<T>,            convertFailed?: ValueConvertFailedSpec<T>, whenConverted?: IValueFinalizeFunc<T>, whenMatched?: IValueFinalizeFunc<T>, getFinal?: IValueFinalizeFunc<T>
     * convertFailed?: ValueConvertFailedSpec<T>, whenConverted?: IValueFinalizeFunc<T>,     whenMatched?: IValueFinalizeFunc<T>,   getFinal?: IValueFinalizeFunc<T>
     */
    export function convertValue<T>(value: any | null | undefined, handlers: ConvertValueHandlers<T>): T;
    export function convertValue<T>(value: any | null | undefined, testFn: IValueTestFunc<T>, convertFn: IValueConvertFunc<T>, whenNil?: NilConvertSpec<T>): T;
    export function convertValue<T>(value: any | null | undefined, testFn: IValueTestFunc<T>, convertFn: IValueConvertFunc<T>, whenNull: GetValueSpec<T>, whenUndefined: GetValueSpec<T>, convertFailed?: ValueConvertFailedSpec<T>,
        whenConverted?: IValueFinalizeFunc<T>, whenMatched?: IValueFinalizeFunc<T>, getFinal?: IValueFinalizeFunc<T>): T;
    export function convertValue<T>(value: any | null | undefined, arg1: ConvertValueHandlers<T> | IValueTestFunc<T>, convertFn?: IValueConvertFunc<T>, whenNil?: GetValueSpec<T> | NilConvertSpec<T>,
        whenUndefined?: GetValueSpec<T>, convertFailed?: ValueConvertFailedSpec<T>, whenConverted?: IValueFinalizeFunc<T>, whenMatched?: IValueFinalizeFunc<T>, getFinal?: IValueFinalizeFunc<T>): T {
        let testFn: IValueTestFunc<T>;
        let whenNull: GetValueSpec<T> | undefined;
        let nilSpec: NilConvertSpec<T> | undefined;
        if (typeof (arg1) === "function") {
            testFn = arg1;
            if (typeof (whenUndefined) !== null)
                whenNull = <GetValueSpec<T>>whenNil;
            else
                nilSpec = whenNil;
        } else {
            testFn = arg1.test;
            convertFn = arg1.convert;
            if (hasConvertWhenNil(arg1))
                nilSpec = arg1.whenNil;
            else {
                if (hasConvertWhenUndefined(arg1))
                    whenUndefined = arg1.whenUndefined;
                if (hasConvertWhenNull(arg1))
                    whenNull = arg1.whenNull;
            }
            if (typeof (arg1.convertFailed) !== "undefined")
                convertFailed = arg1.convertFailed;
            if (typeof (arg1.whenConverted) !== "undefined")
                whenConverted = arg1.whenConverted;
            if (typeof (arg1.whenMatched) !== "undefined")
                whenMatched = arg1.whenMatched;
            if (typeof (arg1.getFinal) !== "undefined")
                getFinal = arg1.getFinal;
        }
        let result: T = (() => {
            let convertedValue: T;
            if (typeof (nilSpec) !== "undefined") {
                if (typeof (value) === "undefined" || value === null) {
                    convertFn = undefined;
                    convertedValue = (typeof (nilSpec) === "function") ? nilSpec(value) : nilSpec;
                } else if (testFn(value))
                    return (typeof (whenMatched) === "function") ? whenMatched(value) : value;
            } else if (typeof (whenUndefined) !== "undefined") {
                if (typeof (value) === "undefined") {
                    convertFn = undefined;
                    convertedValue = (typeof (whenUndefined) === "function") ? whenUndefined() : whenUndefined;
                } else if (typeof (whenNull) !== "undefined" && value === null) {
                    convertFn = undefined;
                    convertedValue = (typeof (whenNull) === "function") ? whenNull() : whenNull;
                } else if (testFn(value))
                    return (typeof (whenMatched) === "function") ? whenMatched(value) : value;
            } else if (typeof (whenNull) !== "undefined" && (typeof (value) !== "undefined") && value === null) {
                convertFn = undefined;
                convertedValue = (typeof (whenNull) === "function") ? whenNull() : whenNull;
            } else if (testFn(value))
                return (typeof (whenMatched) === "function") ? whenMatched(value) : value;
            if (typeof (convertFn) !== "undefined") {
                if (typeof (convertFailed) !== "undefined")
                    try { convertedValue = convertFn(value); } catch (e) { convertedValue = (typeof (convertFailed) === "function") ? convertFailed(value, e) : convertFailed; }
                else
                    convertedValue = convertFn(value);
            }
            return (typeof (whenConverted) === "function") ? whenConverted(convertedValue) : convertedValue;
        })();
        return (typeof (getFinal) === "function") ? getFinal(result) : result;
    }
    
    export function isNilOrString(value: any | null | undefined): value is string | null | undefined { return (typeof (value) === "string") || (typeof (value) === "undefined") || value === null; }

    export function isUndefinedOrString(value: any | null | undefined): value is string | undefined { return (typeof (value) === "string") || (typeof (value) === "undefined") || value === null; }

    export function isNullOrString(value: any | null | undefined): value is string | null { return (typeof (value) === "string") || (typeof (value) !== "undefined" && value === null); }
    
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

    export function asStringOrNull(value: any | null | undefined): string | null {
        value = asStringOrNullOrUndefined(value);
        return (typeof (value) === "undefined") ? null : value;
    }

    export function asStringOrUndefined(value: any | null | undefined): string | undefined {
        value = asStringOrNullOrUndefined(value);
        if (typeof (value) === "undefined" || typeof (value) === "string")
            return value;
    }

    export function asString(value: any | null | undefined, defaultValue: string = ""): string {
        value = asStringOrNullOrUndefined(value);
        return (typeof (value) === "string") ? value : defaultValue;
    }

    export function asStringAndNotEmpty(value: any | null | undefined, defaultValue: string): string {
        value = asStringOrNullOrUndefined(value);
        return (typeof (value) != "string" || value.length) ? defaultValue : value;
    }

    export function asStringAndNotWhiteSpace(value: any | null | undefined, defaultValue: string, trim: boolean = false): string {
        value = asStringOrNullOrUndefined(value);
        if (typeof (value) == "string" && (((trim) ? (value = value.trim()) : value.trim()).length > 0))
            return value;
        return defaultValue;
    }

    export function asUndefinedOrNotEmpty<T>(value: Array<T> | null | undefined): Array<T> | undefined;
    export function asUndefinedOrNotEmpty(value: Array<any> | null | undefined): Array<any> | undefined;
    export function asUndefinedOrNotEmpty(value: string | null | undefined, trim?: boolean): string | undefined;
    export function asUndefinedOrNotEmpty(value: string | Array<any> | null | undefined, trim?: boolean): string | Array<any> | undefined {
        if (typeof (value) !== 'undefined' && value !== null && value.length > 0)
            return (trim === true && typeof (value) === 'string') ? value.trim() : value;
    }

    export function asUndefinedOrNotWhiteSpace(value: string | null | undefined, trim?: boolean): string | undefined {
        if (typeof (value) === 'string') {
            if (trim === true) {
                if ((value = value.trim()).length > 0)
                    return value;
            } else if (value.trim().length > 0)
                return value;
        }
    }

    export function asNullOrNotEmpty<T>(value: Array<T> | null | undefined): Array<T> | undefined;
    export function asNullOrNotEmpty(value: Array<any> | null | undefined): Array<any> | undefined;
    export function asNullOrNotEmpty(value: string | null | undefined, trim?: boolean): string | undefined;
    export function asNullOrNotEmpty(value: string | Array<any> | null | undefined, trim?: boolean): string | Array<any> | null {
        if (typeof (value) === 'string') {
            if (trim) {
                if ((value = value.trim()).length > 0)
                    return value;
            } else if (value.trim().length > 0)
                return value;
        }
        return null;
    }

    export function asNullOrNotWhiteSpace(value: string | null | undefined, trim?: boolean): string | null {
        if (typeof (value) === 'string') {
            if (trim === true) {
                if ((value = value.trim()).length > 0)
                    return value;
            } else if (value.trim().length > 0)
                return value;
        }
        return null;
    }

    export function isNumber(value: any | null | undefined): value is number { return typeof (value) === 'number' && !isNaN(value); }

    export function isFiniteNumber(value: any | null | undefined): value is number { return typeof (value) === 'number' && !isNaN(value) && Number.isFinite(value); }

    export function isFiniteWholeNumber(value: any | null | undefined): value is number { return typeof (value) === 'number' && !isNaN(value) && Number.isFinite(value) && Math.round(value) === value; }

    export const floatingPointNumberRe: RegExp = /^[+-]?\d+(\.\d+)?$/;

    export function asNumber(value: any | null | undefined, allowWhiteSpace?: boolean, allowExtraneousTrailingCharacters?: boolean): number | null;
    export function asNumber(value: any | null | undefined, defaultValue: number, allowWhiteSpace?: boolean, allowExtraneousTrailingCharacters?: boolean): number | null;
    export function asNumber(value: any | null | undefined, defaultValue?: number | boolean, allowWhiteSpace?: boolean, allowExtraneousTrailingCharacters?: boolean): number | null {
        let dv: number | null;
        if (typeof (defaultValue) === "boolean") {
            allowExtraneousTrailingCharacters = allowWhiteSpace === true;
            allowWhiteSpace = defaultValue;
            dv = null;
        } else
            dv = (typeof (dv) === 'number') ? dv : null;
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
            if (allowWhiteSpace)
                v = v.trim();
            let n: number = parseFloat(v);
            if (typeof (n) === 'number' && !isNaN(n) && (allowExtraneousTrailingCharacters || floatingPointNumberRe.test(v)))
                return n;
            return dv;
        }, (v: any) => { return dv; })
    }
    
    export function map<TSource, TResult>(source: Iterable<TSource>, callbackfn: (value: TSource, index: number, iterable: Iterable<TSource>) => TResult, thisArg?: any): TResult[] {
        let iterator: Iterator<TSource> = source[Symbol.iterator]();
        let r: IteratorResult<TSource> = iterator.next();
        let result: TResult[] = [];
        let index: number = 0;
        if (typeof (thisArg) !== 'undefined')
            while (!r.done) {
                result.push(callbackfn.call(thisArg, r.value, index++, source));
                r = iterator.next();
            }
        else
            while (!r.done) {
                result.push(callbackfn(r.value, index++, source));
                r = iterator.next();
            }
        return result;
    }
    export function every<T>(source: Iterable<T>, callbackfn: (value: T, index: number, iterable: Iterable<T>) => boolean, thisArg?: any): boolean {
        let iterator: Iterator<T> = source[Symbol.iterator]();
        let r: IteratorResult<T> = iterator.next();
        let index: number = 0;
        if (typeof (thisArg) !== 'undefined')
            while (!r.done) {
                if (!callbackfn.call(thisArg, r.value, index++, source))
                    return false;
                r = iterator.next();
            }
        else
            while (!r.done) {
                if (!callbackfn(r.value, index++, source))
                    return false;
                r = iterator.next();
            }
        return true;
    }
    export function some<T>(source: Iterable<T>, callbackfn: (value: T, index: number, iterable: Iterable<T>) => boolean, thisArg?: any): boolean {
        let iterator: Iterator<T> = source[Symbol.iterator]();
        let r: IteratorResult<T> = iterator.next();
        let index: number = 0;
        if (typeof (thisArg) !== 'undefined')
            while (!r.done) {
                if (callbackfn.call(thisArg, r.value, index++, source))
                    return true;
                r = iterator.next();
            }
        else
            while (!r.done) {
                if (callbackfn(r.value, index++, source))
                    return true;
                r = iterator.next();
            }
        return true;
    }
    export function forEach<T>(source: Iterable<T>, callbackfn: (value: T, index: number, iterable: Iterable<T>) => void, thisArg?: any) {
        let iterator: Iterator<T> = source[Symbol.iterator]();
        let r: IteratorResult<T> = iterator.next();
        let index: number = 0;
        if (typeof (thisArg) !== 'undefined')
            while (!r.done) {
                callbackfn.call(thisArg, r.value, index++, source);
                r = iterator.next();
            }
        else
            while (!r.done) {
                callbackfn(r.value, index++, source);
                r = iterator.next();
            }
    }
    export function filter<T>(source: Iterable<T>, callbackfn: (value: T, index: number, iterable: Iterable<T>) => boolean, thisArg?: any): T[] {
        let iterator: Iterator<T> = source[Symbol.iterator]();
        let r: IteratorResult<T> = iterator.next();
        let result: T[] = [];
        let index: number = 0;
        if (typeof (thisArg) !== 'undefined')
            while (!r.done) {
                if (callbackfn.call(thisArg, r.value, index++, source))
                    result.push(r.value);
                r = iterator.next();
            }
        else
            while (!r.done) {
                if (callbackfn(r.value, index++, source))
                    result.push(r.value);
                r = iterator.next();
            }
        return result;
    }
    export function reduce<TSource, TResult>(source: Iterable<TSource>, callbackfn: (previousValue: TResult, currentValue: TSource, currentIndex: number, iterable: Iterable<TSource>) => TResult, initialValue: TResult): TResult {
        let iterator: Iterator<TSource> = source[Symbol.iterator]();
        let r: IteratorResult<TSource> = iterator.next();
        let result: TResult = initialValue;
        let index: number = 0;
        while (!r.done) {
            result = callbackfn(result, r.value, index++, source);
            r = iterator.next();
        }
        return result;
    }
    export function first<T>(source: Iterable<T>, callbackfn: (value: T, index: number, iterable: Iterable<T>) => boolean, thisArg?: any): T | undefined {
        let iterator: Iterator<T> = source[Symbol.iterator]();
        let r: IteratorResult<T> = iterator.next();
        let index: number = 0;
        if (typeof (thisArg) !== 'undefined')
            while (!r.done) {
                if (callbackfn.call(thisArg, r.value, index++, source))
                    return r.value;
                r = iterator.next();
            }
        else
            while (!r.done) {
                if (callbackfn(r.value, index, source))
                    return r.value;
                r = iterator.next();
            }
    }
    export function indexOf<T>(source: Iterable<T>, callbackfn: (value: T, index: number, iterable: Iterable<T>) => boolean, thisArg?: any): number {
        let iterator: Iterator<T> = source[Symbol.iterator]();
        let r: IteratorResult<T> = iterator.next();
        let index: number = 0;
        if (typeof (thisArg) !== 'undefined')
            while (!r.done) {
                if (callbackfn.call(thisArg, r.value, index++, source))
                    return index;
                r = iterator.next();
            }
        else
            while (!r.done) {
                if (callbackfn(r.value, index, source))
                    return index;
                r = iterator.next();
            }
    }
    export function last<T>(source: Iterable<T>, callbackfn: (value: T, index: number, iterable: Iterable<T>) => boolean, thisArg?: any): T | undefined {
        let iterator: Iterator<T> = source[Symbol.iterator]();
        let r: IteratorResult<T> = iterator.next();
        let result: T;
        let index: number = 0;
        if (typeof (thisArg) !== 'undefined')
            while (!r.done) {
                if (callbackfn.call(thisArg, r.value, index++, source))
                    result = r.value;
                r = iterator.next();
            }
        else
            while (!r.done) {
                if (callbackfn(r.value, index++, source))
                    result = r.value;
                r = iterator.next();
            }
        return result;
    }
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
    export function takeWhile<T>(source: Iterable<T>, callbackfn: (value: T, index: number, iterable: Iterable<T>) => boolean, thisArg?: any): T[] {
        let iterator: Iterator<T> = source[Symbol.iterator]();
        let r: IteratorResult<T> = iterator.next();
        let result: T[] = [];
        let index: number = 0;
        if (typeof (thisArg) !== 'undefined')
            while (!r.done) {
                if (!callbackfn.call(thisArg, r.value, index++, source))
                    break;
                result.push(r.value);
                r = iterator.next();
            }
        else
            while (!r.done) {
                if (!callbackfn(r.value, index++, source))
                    break;
                result.push(r.value);
                r = iterator.next();
            }
        return result;
    }
    export function skipFirst<T>(source: Iterable<T>, count: Number): T[] {
        let iterator: Iterator<T> = source[Symbol.iterator]();
        let r: IteratorResult<T> = iterator.next();
        let result: T[] = [];
        let index: number = 0;
        while (!r.done) {
            if (index == count) {
                do {
                    result.push(r.value);
                    r = iterator.next();
                } while (!r.done);
                return result;
            }
            r = iterator.next();
            index++;
        }
        return result;
    }

    export function skipWhile<T>(source: Iterable<T>, callbackfn: (value: T, index: number, iterable: Iterable<T>) => boolean, thisArg?: any): T[] {
        let iterator: Iterator<T> = source[Symbol.iterator]();
        let r: IteratorResult<T> = iterator.next();
        let result: T[] = [];
        let index: number = 0;
        if (typeof (thisArg) !== 'undefined')
            while (!r.done) {
                if (!callbackfn.call(thisArg, r.value, index++, source)) {
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
                if (!callbackfn(r.value, index++, source)) {
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

    export function unique<T>(source: Iterable<T>, callbackfn?: (x: T, y: T) => boolean, thisArg?: any): T[] {
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

    function isIterable(obj: any | null | undefined): obj is Iterable<any> { return typeof (obj) !== 'undefined' && typeof (obj[Symbol.iterator]) === 'function'; }

    export interface ItoDebugHtmlOptions {
        maxDepth?: number;
        maxItems?: number;
        cssClass?: {
            nilValue?: string,
            stringValue?: string,
            primitiveValue?: string;
            objectValue?: string;
            skippedValue?: string;
            keyName?: string;
            typeName?: string;
            list?: string;
            item?: string;
            errorMessage?: string;
        }
    }
    interface ItoDebugHTMLstate extends ItoDebugHtmlOptions {
        maxDepth: number;
        maxItems: number;
        currentCount: number; currentDepth: number, result: string[]
    };
    export function toDebugHTML(value: any | null | undefined, options?: ItoDebugHtmlOptions): string {
        let state: ItoDebugHTMLstate
        if (typeof (options) === 'undefined')
            state = { maxDepth: 16, maxItems: 1024, currentCount: 0, currentDepth: 0, cssClass: {}, result: [] };
        else
            state = {
                maxDepth: (typeof (options.maxDepth) !== 'number' || isNaN(options.maxDepth) || !Number.isFinite(options.maxDepth)) ? 16 : options.maxDepth,
                maxItems: (typeof (options.maxItems) !== 'number' || isNaN(options.maxItems) || !Number.isFinite(options.maxItems)) ? 1024 : options.maxItems,
                currentCount: 0,
                currentDepth: 0,
                cssClass: (typeof (options.cssClass) !== 'object' || options.cssClass === null) ? {} : options.cssClass,
                result: []
            };
        __toDebugHTML(value, state);
        return state.result.join("\n");
    }
    function makeOpenTag(tagName: 'div' | 'span' | 'ul' | 'ol' | 'dl' | 'li' | 'dd' | 'dt', ...className: (string | undefined)[]): string {
        if (typeof (className) === 'object' && className !== null && (className = unique(className.filter(notNilOrWhiteSpace).map((s: string) => s.trim()))).length > 0)
            return "<" + tagName + " class=\"" + className.join(" ") + "\">";
        return "<" + tagName + ">";
    }

    function makeHtmlValue(content: string, ...className: (string | undefined)[]): string;
    function makeHtmlValue(content: string, doNotEscape: boolean, ...className: (string | undefined)[]): string;
    function makeHtmlValue(content: string, spec: boolean | string, ...className: (string | undefined)[]): string {
        let doNotEscape: boolean;
        if (typeof (spec) === 'boolean') {
            if (typeof (className) !== 'object' || className === null)
                className = [];
            doNotEscape = spec;
        }
        else
            className = (typeof (className) !== 'object' || className === null) ? [spec].concat(className) : [spec];
        if ((className = unique(className.filter(notNilOrWhiteSpace).map((s: string) => s.trim()))).length > 0) {
            if (doNotEscape)
                return "<span class=\"" + className.join(" ") + "\">" + content + '</span>';
            return "<span class=\"" + className.join(" ") + "\">" + escape(content) + '</span>';
        }
        return (doNotEscape) ? content : escape(content);
    }
    function __toDebugHTML(value: any | null | undefined, state: ItoDebugHTMLstate): void {
        if (state.currentCount < state.maxItems)
            state.currentCount++;
        if (typeof (value) === "undefined")
            state.result.push(makeHtmlValue('undefined', state.cssClass.nilValue));
        else if (typeof (value) === "object") {
            if (value === null)
                state.result.push(makeHtmlValue('null', state.cssClass.nilValue));
            else {
                let name: string = '';
                try {
                    let v: string = value[Symbol.toStringTag]();
                    if (notNilOrWhiteSpace(v))
                        name = v;
                } catch { /* okay to ignore */ }
                if (Array.isArray(value)) {
                    if (name.length == 0)
                        name = 'Array';
                    if (state.currentCount >= state.maxItems)
                        state.result.push(makeHtmlValue("<" + name + ">", state.cssClass.typeName) + makeHtmlValue("{ length: " + value.length.toString() + " }", state.cssClass.skippedValue));
                    else if (value.length == 0)
                        state.result.push(makeHtmlValue("<" + name + ">", state.cssClass.typeName) + "[]");
                    else {
                        state.result.push(makeHtmlValue("<" + name + ">", state.cssClass.typeName) + ": [");
                        state.result.push(makeOpenTag("ol", state.cssClass.list));
                        if (state.currentDepth < state.maxDepth) {
                            let arrState: ItoDebugHTMLstate = { maxDepth: state.maxDepth, maxItems: state.maxItems, currentCount: state.currentCount, currentDepth: state.currentDepth + 1, cssClass: state.cssClass, result: [] };
                            let reachedMax: boolean = false;
                            value.forEach((o: any | null | undefined) => {
                                if (state.currentCount < state.maxItems) {
                                    __toDebugHTML(o, arrState);
                                    state.result.push(makeOpenTag("li", state.cssClass.item) + arrState.result.map((s: string) => ((s.trim()).length == 0) ? "" : "\t" + s).join("\n") + "</li>");
                                    arrState.result = [];
                                } else
                                    reachedMax = true;
                            });
                            if (reachedMax)
                                state.result.push(makeOpenTag("li", state.cssClass.item, state.cssClass.skippedValue) + makeHtmlValue("Reached max output limit: { length: " + value.length.toString() + " }", state.cssClass.skippedValue) + "</li>");
                            state.currentCount = arrState.currentCount;
                        } else {
                            // TODO: Iterate without recursion
                        }
                        state.result.push("</ol>");
                        state.result.push("]");
                    }
                } else {
                    if (isIterable(value)) {
                        if (name.length == 0)
                            name = 'Iterable';
                        state.result.push(makeHtmlValue("<" + name + ">", state.cssClass.typeName) + ": [");
                        state.result.push(makeOpenTag("ul", state.cssClass.list));
                        if (state.currentDepth < state.maxDepth) {
                            let arrState: ItoDebugHTMLstate = { maxDepth: state.maxDepth, maxItems: state.maxItems, currentCount: state.currentCount, currentDepth: state.currentDepth + 1, cssClass: state.cssClass, result: [] };
                            let reachedMax: boolean = false;
                            forEach<any>(value, (o: any, index: number) => {
                                if (state.currentCount < state.maxItems) {
                                    __toDebugHTML(o, arrState);
                                    state.result.push(makeOpenTag("li", state.cssClass.item) + arrState.result.map((s: string) => ((s.trim()).length == 0) ? "" : "\t" + s).join("\n") + "</li>");
                                    arrState.result = [];
                                } else
                                    reachedMax = true;
                            });
                            if (reachedMax)
                                state.result.push(makeOpenTag("li", state.cssClass.item, state.cssClass.skippedValue) + makeHtmlValue("Reached max output limit { ... }", state.cssClass.skippedValue) + "</li>");
                            state.currentCount = arrState.currentCount;
                        } else {
                            // TODO: Iterate without recursion
                        }
                        state.result.push("</ul>");
                        state.result.push("]");
                    } else {
                        if (name.length == 0)
                            name = 'object';
                        let json: any | undefined = undefined;
                        let fn: any = (<{ [index: string]: any }>value)["toJSON"];
                        if (typeof (fn) === 'function')
                            try { json = fn.call(value); } catch { /* okay to ignore */ }
                        if (!isNil(json)) {
                            if (typeof (json) === 'string') {
                                state.result.push(makeHtmlValue("<" + name + ">", state.cssClass.typeName) + ": " + json);
                                return;
                            }
                            if (typeof (json) !== 'object') {
                                state.result.push(makeHtmlValue("<" + name + ">", state.cssClass.typeName) + ": " + makeHtmlValue(JSON.stringify(value), state.cssClass.primitiveValue));
                                return;
                            }
                            if (Array.isArray(json)) {
                                if (state.currentDepth < state.maxDepth) {
                                    let arrState: ItoDebugHTMLstate = { maxDepth: state.maxDepth, maxItems: state.maxItems, currentCount: state.currentCount, currentDepth: state.currentDepth + 1, cssClass: state.cssClass, result: [] };
                                    __toDebugHTML(json, arrState);
                                    state.result.push(makeHtmlValue("<" + name + ">", state.cssClass.typeName) + ": " + arrState.result.map((s: string) => ((s.trim()).length == 0) ? "" : "\t" + s).join("\n"));
                                    state.currentCount = arrState.currentCount;
                                } else {
                                    // TODO: Iterate without recursion
                                }
                                return;
                            }
                            value = json;
                        }

                        let propertyNames: string[] = [];
                        try { propertyNames = Object.getOwnPropertyNames(value); } catch { /* okay to ignore */ }
                        if (isNilOrEmpty(propertyNames))
                            state.result.push(makeHtmlValue("<" + name + ">", state.cssClass.typeName) + ": " + makeHtmlValue(JSON.stringify(value), state.cssClass.objectValue));
                        else {
                            state.result.push(makeHtmlValue("<" + name + ">", state.cssClass.typeName) + ": [");
                            state.result.push(makeOpenTag("dl", state.cssClass.list));
                            if (state.currentDepth < state.maxDepth) {
                                let arrState: ItoDebugHTMLstate = { maxDepth: state.maxDepth, maxItems: state.maxItems, currentCount: state.currentCount, currentDepth: state.currentDepth + 1, cssClass: state.cssClass, result: [] };
                                propertyNames.forEach((n: string) => {
                                    state.result.push(makeOpenTag('dt', state.cssClass.item) + escape(name) + "</dt>");
                                    if (state.currentCount < state.maxItems) {
                                        try {
                                            __toDebugHTML((<{ [key: string]: any }>value)[n], arrState);
                                            state.result.push(makeOpenTag("dd", state.cssClass.item) + arrState.result.map((s: string) => ((s.trim()).length == 0) ? "" : "\t" + s).join("\n") + "</dd>");
                                        } catch (e) {
                                            state.result.push(makeOpenTag("dd", state.cssClass.item) + makeHtmlValue(JSON.stringify(e), state.cssClass.errorMessage) + "</dd>");
                                        }
                                        arrState.result = [];
                                    } else {
                                        // TODO: Add without recursion
                                    }
                                });
                            } else {
                                // TODO: Iterate without recursion
                            }
                            state.result.push("</dl>");
                            state.result.push("]");
                        }

                    }
                }
            }
        } else if (typeof (value) === 'string')
            state.result.push(makeHtmlValue(JSON.stringify(value), state.cssClass.stringValue));
        else
            state.result.push(makeHtmlValue(JSON.stringify(value), state.cssClass.primitiveValue));
    }

    // #endregion
}
