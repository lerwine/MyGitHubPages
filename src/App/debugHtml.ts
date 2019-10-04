/// <reference path="../Scripts/typings/jquery/jquery.d.ts"/>
/// <reference path="../Scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="../Scripts/typings/angularjs/angular-route.d.ts"/>
/// <reference path="sys.ts"/>

import unique = sys.unique;
import notNilOrWhiteSpace = sys.notNilOrWhiteSpace;
import isIterable = sys.isIterable;
import forEach = sys.forEach;
import isNil = sys.isNil;
import isNilOrEmpty = sys.isNilOrEmpty;

module debugHtml {
    /**
     *
     *
     * @export
     * @interface ItoDebugHtmlCssOptions
     */
    export interface ItoDebugHtmlCssOptions {
        /**
         *
         *
         * @type {string}
         * @memberof ItoDebugHtmlCssOptions
         */
        nilValue?: string,

        /**
         *
         *
         * @type {string}
         * @memberof ItoDebugHtmlCssOptions
         */
        stringValue?: string,

        /**
         *
         *
         * @type {string}
         * @memberof ItoDebugHtmlCssOptions
         */
        primitiveValue?: string;

        /**
         *
         *
         * @type {string}
         * @memberof ItoDebugHtmlCssOptions
         */
        objectValue?: string;

        /**
         *
         *
         * @type {string}
         * @memberof ItoDebugHtmlCssOptions
         */
        skippedValue?: string;

        /**
         *
         *
         * @type {string}
         * @memberof ItoDebugHtmlCssOptions
         */
        keyName?: string;

        /**
         *
         *
         * @type {string}
         * @memberof ItoDebugHtmlCssOptions
         */
        typeName?: string;

        /**
         *
         *
         * @type {string}
         * @memberof ItoDebugHtmlCssOptions
         */
        list?: string;

        /**
         *
         *
         * @type {string}
         * @memberof ItoDebugHtmlCssOptions
         */
        item?: string;

        /**
         *
         *
         * @type {string}
         * @memberof ItoDebugHtmlCssOptions
         */
        errorMessage?: string;
    }

    /**
     *
     *
     * @export
     * @interface ItoDebugHtmlOptions
     */
    export interface ItoDebugHtmlOptions {
        /**
         *
         *
         * @type {number}
         * @memberof ItoDebugHtmlOptions
         */
        maxDepth?: number;

        /**
         *
         *
         * @type {number}
         * @memberof ItoDebugHtmlOptions
         */
        maxItems?: number;

        /**
         *
         *
         * @type {ItoDebugHtmlCssOptions}
         * @memberof ItoDebugHtmlOptions
         */
        cssClass?: ItoDebugHtmlCssOptions
    }

    /**
     *
     *
     * @interface ItoDebugHTMLstate
     * @extends {ItoDebugHtmlOptions}
     */
    interface ItoDebugHTMLstate extends ItoDebugHtmlOptions {
        maxDepth: number;
        maxItems: number;
        currentCount: number; currentDepth: number, result: string[]
    }

    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @param {ItoDebugHtmlOptions} [options]
     * @returns {string}
     */
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

    /**
     *
     *
     * @param {('div' | 'span' | 'ul' | 'ol' | 'dl' | 'li' | 'dd' | 'dt')} tagName
     * @param {(...(string | undefined)[])} className
     * @returns {string}
     */
    function makeOpenTag(tagName: 'div' | 'span' | 'ul' | 'ol' | 'dl' | 'li' | 'dd' | 'dt', ...className: (string | undefined)[]): string {
        if (typeof (className) === 'object' && className !== null && (className = unique(className.filter(sys.notNilOrWhiteSpace).map((s: string) => s.trim()))).length > 0)
            return "<" + tagName + " class=\"" + className.join(" ") + "\">";
        return "<" + tagName + ">";
    }

    /**
     *
     *
     * @param {string} content
     * @param {(...(string | undefined)[])} className
     * @returns {string}
     */
    function makeHtmlValue(content: string, ...className: (string | undefined)[]): string;

    /**
     *
     *
     * @param {string} content
     * @param {boolean} doNotEscape
     * @param {(...(string | undefined)[])} className
     * @returns {string}
     */
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
}
