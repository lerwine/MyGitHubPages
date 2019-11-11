var regexTester;
(function (regexTester) {
    class RegexFlags {
        constructor(flags) {
            this._global = false;
            this._ignoreCase = false;
            this._multiline = false;
            this._unicode = false;
            this._sticky = false;
            this._flags = '';
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
            }
            else if (typeof flags === 'string' && flags.trim().length > 0) {
                const allFlags = 'gimuy';
                let arr = ['g', 'i', 'm', 'u', 'y'].map((value) => {
                    return { i: flags.indexOf(value), c: value };
                });
                this._global = arr[0].i > -1;
                this._ignoreCase = arr[1].i > -1;
                this._multiline = arr[2].i > -1;
                this._unicode = arr[3].i > -1;
                this._sticky = arr[4].i > -1;
                if ((arr = arr.filter((value) => value.i > -1)).length == 0)
                    this._flags = '';
                else if (arr.length == 1)
                    this._flags = arr[0].c;
                else
                    this._flags = arr.filter((value) => value.i > -1)
                        .sort((a, b) => a.i - b.i)
                        .reduce((previousValue, currentValue) => {
                        if (previousValue.i == currentValue.i)
                            return previousValue;
                        return { i: currentValue.i, c: previousValue.c + currentValue.c };
                    }).c;
                return;
            }
            this._global = this._ignoreCase = this._multiline = this._sticky = this._sticky = false;
            this._flags = '';
        }
        get global() { return this._global; }
        setGlobal(value) {
            if ((value = value === true) === this._global)
                return this;
            return new RegexFlags((value) ? this._flags + 'g' : this._flags.replace('g', ''));
        }
        get ignoreCase() { return this._ignoreCase; }
        setIgnoreCase(value) {
            if ((value = value === true) === this._ignoreCase)
                return this;
            return new RegexFlags((value) ? this._flags + 'i' : this._flags.replace('i', ''));
        }
        get multiline() { return this._multiline; }
        setMultiline(value) {
            if ((value = value === true) === this._multiline)
                return this;
            return new RegexFlags((value) ? this._flags + 'm' : this._flags.replace('m', ''));
        }
        get unicode() { return this._unicode; }
        setUnicode(value) {
            if ((value = value === true) === this._unicode)
                return this;
            return new RegexFlags((value) ? this._flags + 'u' : this._flags.replace('u', ''));
        }
        get sticky() { return this._sticky; }
        setSticky(value) {
            if ((value = value === true) === this._sticky)
                return this;
            return new RegexFlags((value) ? this._flags + 'y' : this._flags.replace('y', ''));
        }
        get flags() { return this._flags; }
    }
    regexTester.RegexFlags = RegexFlags;
    class JsLine {
        constructor(_text, _lineNumber) {
            this._text = _text;
            this._lineNumber = _lineNumber;
        }
        get text() { return this._text; }
        get lineNumber() { return this._lineNumber; }
        static toJsLines(source) {
            if (typeof source !== 'string')
                return [new JsLine('null', 0)];
            if (source.length == 0)
                return [new JsLine('""', 1)];
            const lines = [];
            let lineNumber = 1;
            for (let m = source.match(JsLine._re); typeof m === 'object' && m !== null; m = source.match(JsLine._re)) {
                lines.push(new JsLine(JSON.stringify(m[0]), lineNumber++));
                source = source.substr(m[0].length);
            }
            if (source.length > 0)
                lines.push(new JsLine(JSON.stringify(source), lineNumber));
            return lines;
        }
    }
    JsLine._re = /^[^\r\n]*(\r\n?|\n)/;
    regexTester.JsLine = JsLine;
    class SplitTextInfo {
        constructor(_groupNumber, text) {
            this._groupNumber = _groupNumber;
            this._text = JsLine.toJsLines(text);
        }
        get groupNumber() { return this._groupNumber; }
        get text() { return this._text; }
    }
    regexTester.SplitTextInfo = SplitTextInfo;
    class MatchGroup extends SplitTextInfo {
        constructor(groupNumber, text) {
            super(groupNumber, text);
            this._isMatch = (typeof text === 'string');
        }
        get isMatch() { return this._isMatch; }
    }
    regexTester.MatchGroup = MatchGroup;
    class ValueVersion {
        constructor(_name, _value, equalityCb) {
            this._name = _name;
            this._value = _value;
            this._versionToken = Symbol();
            this._equalityCb = (typeof equalityCb === 'function') ? equalityCb : function (x, y) {
                return x === y;
            };
            if (typeof _value === 'undefined') {
                this._isResolved = false;
                this._reason = 'Value not defined';
            }
            else
                this._isResolved = true;
        }
        get value() { return this._value; }
        get isResolved() { return this._isResolved; }
        get reason() { return this._reason; }
        get versionToken() { return this._versionToken; }
        get name() { return this._name; }
        resolve(value) {
            if (!this._isResolved) {
                this._reason = undefined;
                this._isResolved = true;
            }
            else if (this._equalityCb(this._value, value) === true)
                return;
            this._value = value;
            this._versionToken = Symbol();
        }
        reject(reason) {
            if (this._isResolved)
                this._isResolved = false;
            else if (this._reason === reason)
                return;
            this._isResolved = false;
            this._reason = reason;
            this._versionToken = Symbol();
        }
        getValueAsync($q) {
            const current = this;
            return $q(function (resolve, reject) {
                if (current._isResolved)
                    resolve({ value: current._value, token: current._versionToken });
                else
                    reject(current._reason);
            });
        }
    }
    regexTester.ValueVersion = ValueVersion;
    class ValueProducer extends ValueVersion {
        constructor(name, _resolver, _components, equalityCb, _thisArg) {
            super(name, undefined, equalityCb);
            this._resolver = _resolver;
            this._components = _components;
            this._thisArg = _thisArg;
            this._isComponentError = false;
        }
        get isComponentError() { return this._isComponentError; }
        static create(name, resolver, arg1, ...components) {
            if (typeof arg1 === 'function')
                return new ValueProducer(name, resolver, components, arg1);
            if (typeof components !== 'object' || components === null || components.length == 0)
                return new ValueProducer(name, resolver, [arg1]);
            return new ValueProducer(name, resolver, [arg1].concat(components));
        }
        static createResolveWith(thisArg, name, resolver, arg1, ...components) {
            if (typeof arg1 === 'function')
                return new ValueProducer(name, resolver, components, arg1, thisArg);
            if (typeof components !== 'object' || components === null || components.length == 0)
                return new ValueProducer(name, resolver, [arg1], undefined, thisArg);
            return new ValueProducer(name, resolver, [arg1].concat(components), undefined, thisArg);
        }
        getValueAsync($q) {
            const current = this;
            if (this._components.length < 2)
                return this._components[0].getValueAsync($q).then(function (cr) {
                    return $q(function (resolve, reject) {
                        current._update(resolve, reject, [cr]);
                    });
                }, function (reason) {
                    return $q(function (resolve, reject) {
                        if (typeof reason === 'undefined')
                            reject(current._onRejectedComponents());
                        else
                            reject(current._onRejectedComponents(reason));
                    });
                });
            return $q.all(this._components.map(function (c) {
                return c.getValueAsync($q);
            })).then(function (cr) {
                return $q(function (resolve, reject) {
                    current._update(resolve, reject, cr);
                });
            }, function (reason) {
                return $q(function (resolve, reject) {
                    if (typeof reason === 'undefined')
                        reject(current._onRejectedComponents());
                    else
                        reject(current._onRejectedComponents(reason));
                });
            });
        }
        _update(resolve, reject, cr) {
            this._isComponentError = false;
            const tokens = cr.map(function (v) { return v.token; });
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
                const current = this;
                this._resolver.apply(this._thisArg, [
                    function (result) {
                        current.resolve(result);
                        resolve({ value: current.value, token: current.versionToken });
                    },
                    function (reason) {
                        if (arguments.length == 0)
                            current.reject();
                        else
                            current.reject(reason);
                        if (typeof current.reason === 'undefined')
                            reject();
                        else
                            reject(current.reason);
                    }
                ].concat(cr.map(function (v) { return v.value; })));
            }
            else if (this.isResolved)
                resolve({ value: this.value, token: this.versionToken });
            else if (typeof this.reason === 'undefined')
                reject();
            else
                reject(this.reason);
        }
        _onRejectedComponents(reason) {
            this._isComponentError = true;
            let rejectedComponents = this._components.filter(function (c) {
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
                    message: 'The following components have errors: ' + rejectedComponents.map(function (c) {
                        return c.name;
                    }).join(', '),
                    reason: reason
                });
            return this.reason;
        }
    }
    regexTester.ValueProducer = ValueProducer;
    class RegexParserService {
        constructor($rootScope) {
            this.$rootScope = $rootScope;
            this._flags = new ValueVersion('Flags', new RegexFlags(), function (x, y) {
                if (typeof x !== 'object')
                    return typeof y !== 'object';
                if (typeof y !== 'object')
                    return false;
                if (x === null)
                    return y === null;
                return y !== null && (x.flags === y.flags || (x.global === y.global && x.ignoreCase === y.ignoreCase &&
                    x.multiline === y.multiline && x.unicode === y.unicode && x.sticky === y.sticky));
            });
            this._pattern = new ValueVersion('Pattern Text', '(?:)');
            this._inputText = new ValueVersion('Input Text', '');
            this._replaceWith = new ValueVersion('Replacement Text', '');
            this._splitLimit = new ValueVersion('Split Limit', NaN);
            this[Symbol.toStringTag] = app.ServiceNames.regexParser;
            this._regex = ValueProducer.create('Regular Expression', function (resolve, reject, flags, s) {
                let r;
                let reason;
                try {
                    r = new RegExp(s, flags.flags);
                }
                catch (e) {
                    reason = e;
                }
                if (typeof r === 'object' && r !== null)
                    resolve(r);
                else
                    reject((typeof reason === 'undefined') ? 'Invalid pattern' : reason);
            }, function (x, y) {
                if (typeof x !== 'object' || x === null)
                    return typeof y !== 'object' || y === null;
                return typeof y === 'object' && y !== null && x.source === y.source && x.global === y.global &&
                    x.ignoreCase === y.ignoreCase && x.multiline === y.multiline && x.unicode === y.unicode &&
                    x.sticky === y.sticky;
            }, this._flags, this._pattern);
            this._matchGroups = ValueProducer.create('Match Groups', function (resolve, reject, expr, s) {
                let r;
                let reason;
                try {
                    r = s.match(expr);
                }
                catch (e) {
                    reason = e;
                }
                if (typeof r === 'object' && r !== null)
                    resolve(r);
                else
                    reject((typeof reason === 'undefined') ? 'Match failed' : reason);
            }, function (x, y) {
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
            this._replacedText = ValueProducer.create('Replaced Text', function (resolve, reject, regex, s, r) {
                let t;
                let reason;
                try {
                    t = s.replace(regex, r);
                }
                catch (e) {
                    reason = e;
                }
                if (typeof t !== 'string')
                    reject((typeof reason === 'undefined') ? 'Match failed' : reason);
                else if (t === s)
                    reject('Nothing replaced');
                else
                    resolve(t);
            }, this._regex, this._inputText, this._replaceWith);
            this._splitText = ValueProducer.create('Split Text', function (resolve, reject, regex, s, l) {
                let r;
                let reason;
                try {
                    if (isNaN(l))
                        r = s.split(regex);
                    else
                        r = s.split(regex, l);
                }
                catch (e) {
                    reason = e;
                }
                if (typeof r !== 'object' || r === null)
                    reject((typeof reason === 'undefined') ? 'Match failed' : reason);
                else if (r.length == 1)
                    reject('Nothing matched');
                else
                    resolve(r);
            }, function (x, y) {
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
        flags(value) {
            switch (typeof value) {
                case 'string':
                    this._flags.resolve(new RegexFlags(value));
                    break;
                case 'object':
                    if (value != null)
                        this._flags.resolve(value);
                    break;
            }
            return this._flags.value;
        }
        global(value) {
            if (typeof value === 'boolean' && value !== this._flags.value.global)
                this.flags(this._flags.value.setGlobal(value));
            return this._flags.value.global;
        }
        ignoreCase(value) {
            if (typeof value === 'boolean' && value !== this._flags.value.ignoreCase)
                this.flags(this._flags.value.setIgnoreCase(value));
            return this._flags.value.ignoreCase;
        }
        multiline(value) {
            if (typeof value === 'boolean' && value !== this._flags.value.multiline)
                this.flags(this._flags.value.setMultiline(value));
            return this._flags.value.multiline;
        }
        sticky(value) {
            if (typeof value === 'boolean' && value !== this._flags.value.sticky)
                this.flags(this._flags.value.setSticky(value));
            return this._flags.value.sticky;
        }
        unicode(value) {
            if (typeof value === 'boolean' && value !== this._flags.value.unicode)
                this.flags(this._flags.value.setUnicode(value));
            return this._flags.value.unicode;
        }
        pattern(value) {
            if (typeof value !== 'string')
                this._pattern.resolve(value);
            return this._pattern.value;
        }
        inputText(value) {
            if (typeof value !== 'string')
                this._inputText.resolve(value);
            return this._inputText.value;
        }
        replaceWith(value) {
            if (typeof value !== 'string')
                this._replaceWith.resolve(value);
            return this._replaceWith.value;
        }
        splitLimit(value) {
            if (typeof value !== 'number')
                this._splitLimit.resolve(value);
            return this._splitLimit.value;
        }
        matchGroups() { return this._matchGroups; }
        replacedText() { return this._replacedText; }
        splitText() { return this._splitText; }
        regex() { return this._regex; }
    }
    regexTester.RegexParserService = RegexParserService;
    class RegexController {
        constructor($scope, $q, regexParser, pageLocationService, subTitle) {
            this.$scope = $scope;
            this.$q = $q;
            this.regexParser = regexParser;
            this.pageLocationService = pageLocationService;
            this._regexToken = Symbol();
            pageLocationService.pageTitle('Regular Expression Evaluator', subTitle);
            $scope.showParseError = false;
            $scope.showEvaluationError = false;
            $scope.parseErrorMessage = '';
            $scope.evaluationErrorMessage = '';
            $scope.inputLines = JsLine.toJsLines(regexParser.inputText());
            this.onFlagsChange();
        }
        get global() { return this.regexParser.global(); }
        set global(value) {
            this.regexParser.global(value);
            this.onFlagsChange();
        }
        get ignoreCase() { return this.regexParser.ignoreCase(); }
        set ignoreCase(value) {
            this.regexParser.ignoreCase(value);
            this.onFlagsChange();
        }
        get multiline() { return this.regexParser.multiline(); }
        set multiline(value) {
            this.regexParser.multiline(value);
            this.onFlagsChange();
        }
        get unicode() { return this.regexParser.unicode(); }
        set unicode(value) {
            this.regexParser.unicode(value);
            this.onFlagsChange();
        }
        get sticky() { return this.regexParser.sticky(); }
        set sticky(value) {
            this.regexParser.sticky(value);
            this.onFlagsChange();
        }
        get pattern() { return this.regexParser.pattern(); }
        set pattern(value) {
            this.regexParser.pattern(value);
            this.raiseRegexChange();
        }
        get inputText() { return this.regexParser.inputText(); }
        set inputText(value) {
            this.regexParser.inputText(value);
            this.$scope.inputLines = JsLine.toJsLines(this.regexParser.inputText());
            this.onRegexChange();
        }
        raiseRegexChange() {
            const ctrl = this;
            this.regexParser.regex().getValueAsync(this.$q).then(function (result) {
                if (ctrl._regexToken !== result.token) {
                    ctrl._regexToken = result.token;
                    ctrl.$scope.parseErrorMessage = '';
                    ctrl.$scope.showParseError = false;
                    ctrl.onRegexChange();
                }
            }, function (reason) {
                if (ctrl._regexToken !== ctrl.regexParser.regex().versionToken) {
                    ctrl._regexToken = ctrl.regexParser.regex().versionToken;
                    ctrl.$scope.parseErrorMessage = (typeof reason === 'undefined') ? '' :
                        ((typeof reason === 'string') ? reason : JSON.stringify(reason));
                    if (ctrl.$scope.parseErrorMessage.trim().length == 0)
                        ctrl.$scope.parseErrorMessage = 'Pattern parse error';
                    ctrl.$scope.showParseError = true;
                    ctrl.onRegexChange();
                }
            });
        }
        onFlagsChange() {
            this.$scope.flags = this.regexParser.flags().flags;
            this.raiseRegexChange();
        }
        setEvalSuccess() {
            this.$scope.showEvaluationError = false;
            this.$scope.evaluationErrorMessage = '';
            this.$scope.success = true;
        }
        setEvalFail(reason) {
            this.$scope.showEvaluationError = true;
            this.$scope.evaluationErrorMessage = (typeof reason === 'undefined') ? '' :
                ((typeof reason === 'string') ? reason :
                    ((typeof reason === 'object' && reason instanceof Error) ? '' + reason : JSON.stringify(reason)));
            this.$scope.success = false;
        }
        $doCheck() { }
    }
    regexTester.RegexController = RegexController;
    class RegexMatchController extends RegexController {
        constructor($scope, $q, regexParser, pageLocationService) {
            super($scope, $q, regexParser, pageLocationService, 'Match');
            this[Symbol.toStringTag] = app.ControllerNames.regexMatch;
            pageLocationService.regexHref(app.NavPrefix + app.ModulePaths.regexMatch);
        }
        onRegexChange() {
            const ctrl = this;
            this.regexParser.matchGroups().getValueAsync(this.$q).then(function (result) {
                if (ctrl._groupsToken !== result.token) {
                    ctrl._groupsToken = result.token;
                    ctrl.$scope.groups = [];
                    ctrl.$scope.matchIndex = result.value.index;
                    for (let n = 0; n < result.value.length; n++)
                        ctrl.$scope.groups.push(new MatchGroup(n, result.value[n]));
                    ctrl.setEvalSuccess();
                }
            }, function (reason) {
                if (ctrl._groupsToken !== ctrl.regexParser.matchGroups().versionToken) {
                    ctrl._groupsToken = ctrl.regexParser.matchGroups().versionToken;
                    if (ctrl.regexParser.matchGroups().isComponentError)
                        return;
                    ctrl.$scope.groups = [];
                    ctrl.$scope.matchIndex = -1;
                    ctrl.setEvalFail(reason);
                }
            });
        }
    }
    regexTester.RegexMatchController = RegexMatchController;
    class RegexReplaceController extends RegexController {
        constructor($scope, $q, regexParser, pageLocationService) {
            super($scope, $q, regexParser, pageLocationService, 'Replace');
            this._replacedLinesToken = Symbol();
            this[Symbol.toStringTag] = app.ControllerNames.regexMatch;
            pageLocationService.regexHref(app.NavPrefix + app.ModulePaths.regexReplace);
        }
        get replaceWith() { return this.regexParser.replaceWith(); }
        set replaceWith(value) {
            this.regexParser.replaceWith(value);
            this.$scope.replaceWithLines = JsLine.toJsLines(this.regexParser.replaceWith());
            this.onRegexChange();
        }
        onRegexChange() {
            const ctrl = this;
            this.regexParser.replacedText().getValueAsync(this.$q).then(function (result) {
                if (ctrl._replacedLinesToken !== result.token) {
                    ctrl._replacedLinesToken = result.token;
                    ctrl.$scope.replacedLines = JsLine.toJsLines(result.value);
                    ctrl.setEvalSuccess();
                }
            }, function (reason) {
                if (ctrl._replacedLinesToken !== ctrl.regexParser.replacedText().versionToken) {
                    ctrl._replacedLinesToken = ctrl.regexParser.replacedText().versionToken;
                    if (ctrl.regexParser.replacedText().isComponentError)
                        return;
                    ctrl.$scope.replacedLines = [];
                    ctrl.$scope.replaceWithLines = [];
                    ctrl.setEvalFail(reason);
                }
            });
        }
    }
    regexTester.RegexReplaceController = RegexReplaceController;
    class RegexSplitController extends RegexController {
        constructor($scope, $q, regexParser, pageLocationService) {
            super($scope, $q, regexParser, pageLocationService, 'Split');
            this._splitTextToken = Symbol();
            this[Symbol.toStringTag] = app.ControllerNames.regexMatch;
            pageLocationService.regexHref(app.NavPrefix + app.ModulePaths.regexSplit);
            this.onRegexChange();
        }
        get splitLimit() { return this.regexParser.splitLimit(); }
        set splitLimit(value) {
            this.regexParser.splitLimit(value);
            this.onRegexChange();
        }
        onRegexChange() {
            const ctrl = this;
            this.regexParser.splitText().getValueAsync(this.$q).then(function (result) {
                if (ctrl._splitTextToken !== result.token) {
                    ctrl._splitTextToken = result.token;
                    ctrl.$scope.splitText = result.value.map(function (s, index) {
                        return new SplitTextInfo(index + 1, s);
                    });
                    ctrl.setEvalSuccess();
                }
            }, function (reason) {
                if (ctrl._splitTextToken !== ctrl.regexParser.splitText().versionToken) {
                    ctrl._splitTextToken = ctrl.regexParser.splitText().versionToken;
                    if (ctrl.regexParser.splitText().isComponentError)
                        return;
                    ctrl.$scope.splitText = [];
                    ctrl.setEvalFail(reason);
                }
            });
        }
    }
    regexTester.RegexSplitController = RegexSplitController;
    app.mainModule.controller(app.ControllerNames.regexMatch, ['$scope', app.ServiceNames.regexParser, app.ServiceNames.pageLocation, RegexMatchController])
        .controller(app.ControllerNames.regexReplace, ['$scope', app.ServiceNames.regexParser, app.ServiceNames.pageLocation, RegexReplaceController])
        .controller(app.ControllerNames.regexSplit, ['$scope', app.ServiceNames.regexParser, app.ServiceNames.pageLocation, RegexSplitController])
        .service(app.ServiceNames.regexParser, RegexParserService);
})(regexTester || (regexTester = {}));
//# sourceMappingURL=regexTester.js.map