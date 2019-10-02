/// <reference path="../Scripts/typings/jquery/jquery.d.ts"/>
/// <reference path="../Scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="../Scripts/typings/angularjs/angular-route.d.ts"/>
/// <reference path="sys.ts"/>
var unique = sys.unique;
var notNilOrWhiteSpace = sys.notNilOrWhiteSpace;
var isIterable = sys.isIterable;
var forEach = sys.forEach;
var isNil = sys.isNil;
var isNilOrEmpty = sys.isNilOrEmpty;
var debugHtml;
(function (debugHtml) {
    /**
     *
     *
     * @export
     * @param {(any | null | undefined)} value
     * @param {ItoDebugHtmlOptions} [options]
     * @returns {string}
     */
    function toDebugHTML(value, options) {
        let state;
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
    debugHtml.toDebugHTML = toDebugHTML;
    /**
     *
     *
     * @param {('div' | 'span' | 'ul' | 'ol' | 'dl' | 'li' | 'dd' | 'dt')} tagName
     * @param {(...(string | undefined)[])} className
     * @returns {string}
     */
    function makeOpenTag(tagName, ...className) {
        if (typeof (className) === 'object' && className !== null && (className = unique(className.filter(sys.notNilOrWhiteSpace).map((s) => s.trim()))).length > 0)
            return "<" + tagName + " class=\"" + className.join(" ") + "\">";
        return "<" + tagName + ">";
    }
    function makeHtmlValue(content, spec, ...className) {
        let doNotEscape;
        if (typeof (spec) === 'boolean') {
            if (typeof (className) !== 'object' || className === null)
                className = [];
            doNotEscape = spec;
        }
        else
            className = (typeof (className) !== 'object' || className === null) ? [spec].concat(className) : [spec];
        if ((className = unique(className.filter(notNilOrWhiteSpace).map((s) => s.trim()))).length > 0) {
            if (doNotEscape)
                return "<span class=\"" + className.join(" ") + "\">" + content + '</span>';
            return "<span class=\"" + className.join(" ") + "\">" + escape(content) + '</span>';
        }
        return (doNotEscape) ? content : escape(content);
    }
    function __toDebugHTML(value, state) {
        if (state.currentCount < state.maxItems)
            state.currentCount++;
        if (typeof (value) === "undefined")
            state.result.push(makeHtmlValue('undefined', state.cssClass.nilValue));
        else if (typeof (value) === "object") {
            if (value === null)
                state.result.push(makeHtmlValue('null', state.cssClass.nilValue));
            else {
                let name = '';
                try {
                    let v = value[Symbol.toStringTag]();
                    if (notNilOrWhiteSpace(v))
                        name = v;
                }
                catch ( /* okay to ignore */_a) { /* okay to ignore */ }
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
                            let arrState = { maxDepth: state.maxDepth, maxItems: state.maxItems, currentCount: state.currentCount, currentDepth: state.currentDepth + 1, cssClass: state.cssClass, result: [] };
                            let reachedMax = false;
                            value.forEach((o) => {
                                if (state.currentCount < state.maxItems) {
                                    __toDebugHTML(o, arrState);
                                    state.result.push(makeOpenTag("li", state.cssClass.item) + arrState.result.map((s) => ((s.trim()).length == 0) ? "" : "\t" + s).join("\n") + "</li>");
                                    arrState.result = [];
                                }
                                else
                                    reachedMax = true;
                            });
                            if (reachedMax)
                                state.result.push(makeOpenTag("li", state.cssClass.item, state.cssClass.skippedValue) + makeHtmlValue("Reached max output limit: { length: " + value.length.toString() + " }", state.cssClass.skippedValue) + "</li>");
                            state.currentCount = arrState.currentCount;
                        }
                        else {
                            // TODO: Iterate without recursion
                        }
                        state.result.push("</ol>");
                        state.result.push("]");
                    }
                }
                else {
                    if (isIterable(value)) {
                        if (name.length == 0)
                            name = 'Iterable';
                        state.result.push(makeHtmlValue("<" + name + ">", state.cssClass.typeName) + ": [");
                        state.result.push(makeOpenTag("ul", state.cssClass.list));
                        if (state.currentDepth < state.maxDepth) {
                            let arrState = { maxDepth: state.maxDepth, maxItems: state.maxItems, currentCount: state.currentCount, currentDepth: state.currentDepth + 1, cssClass: state.cssClass, result: [] };
                            let reachedMax = false;
                            forEach(value, (o, index) => {
                                if (state.currentCount < state.maxItems) {
                                    __toDebugHTML(o, arrState);
                                    state.result.push(makeOpenTag("li", state.cssClass.item) + arrState.result.map((s) => ((s.trim()).length == 0) ? "" : "\t" + s).join("\n") + "</li>");
                                    arrState.result = [];
                                }
                                else
                                    reachedMax = true;
                            });
                            if (reachedMax)
                                state.result.push(makeOpenTag("li", state.cssClass.item, state.cssClass.skippedValue) + makeHtmlValue("Reached max output limit { ... }", state.cssClass.skippedValue) + "</li>");
                            state.currentCount = arrState.currentCount;
                        }
                        else {
                            // TODO: Iterate without recursion
                        }
                        state.result.push("</ul>");
                        state.result.push("]");
                    }
                    else {
                        if (name.length == 0)
                            name = 'object';
                        let json = undefined;
                        let fn = value["toJSON"];
                        if (typeof (fn) === 'function')
                            try {
                                json = fn.call(value);
                            }
                            catch ( /* okay to ignore */_b) { /* okay to ignore */ }
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
                                    let arrState = { maxDepth: state.maxDepth, maxItems: state.maxItems, currentCount: state.currentCount, currentDepth: state.currentDepth + 1, cssClass: state.cssClass, result: [] };
                                    __toDebugHTML(json, arrState);
                                    state.result.push(makeHtmlValue("<" + name + ">", state.cssClass.typeName) + ": " + arrState.result.map((s) => ((s.trim()).length == 0) ? "" : "\t" + s).join("\n"));
                                    state.currentCount = arrState.currentCount;
                                }
                                else {
                                    // TODO: Iterate without recursion
                                }
                                return;
                            }
                            value = json;
                        }
                        let propertyNames = [];
                        try {
                            propertyNames = Object.getOwnPropertyNames(value);
                        }
                        catch ( /* okay to ignore */_c) { /* okay to ignore */ }
                        if (isNilOrEmpty(propertyNames))
                            state.result.push(makeHtmlValue("<" + name + ">", state.cssClass.typeName) + ": " + makeHtmlValue(JSON.stringify(value), state.cssClass.objectValue));
                        else {
                            state.result.push(makeHtmlValue("<" + name + ">", state.cssClass.typeName) + ": [");
                            state.result.push(makeOpenTag("dl", state.cssClass.list));
                            if (state.currentDepth < state.maxDepth) {
                                let arrState = { maxDepth: state.maxDepth, maxItems: state.maxItems, currentCount: state.currentCount, currentDepth: state.currentDepth + 1, cssClass: state.cssClass, result: [] };
                                propertyNames.forEach((n) => {
                                    state.result.push(makeOpenTag('dt', state.cssClass.item) + escape(name) + "</dt>");
                                    if (state.currentCount < state.maxItems) {
                                        try {
                                            __toDebugHTML(value[n], arrState);
                                            state.result.push(makeOpenTag("dd", state.cssClass.item) + arrState.result.map((s) => ((s.trim()).length == 0) ? "" : "\t" + s).join("\n") + "</dd>");
                                        }
                                        catch (e) {
                                            state.result.push(makeOpenTag("dd", state.cssClass.item) + makeHtmlValue(JSON.stringify(e), state.cssClass.errorMessage) + "</dd>");
                                        }
                                        arrState.result = [];
                                    }
                                    else {
                                        // TODO: Add without recursion
                                    }
                                });
                            }
                            else {
                                // TODO: Iterate without recursion
                            }
                            state.result.push("</dl>");
                            state.result.push("]");
                        }
                    }
                }
            }
        }
        else if (typeof (value) === 'string')
            state.result.push(makeHtmlValue(JSON.stringify(value), state.cssClass.stringValue));
        else
            state.result.push(makeHtmlValue(JSON.stringify(value), state.cssClass.primitiveValue));
    }
})(debugHtml || (debugHtml = {}));
//# sourceMappingURL=debugHtml.js.map