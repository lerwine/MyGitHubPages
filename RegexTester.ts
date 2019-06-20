/// <reference path="Scripts/typings/jquery/jquery.d.ts"/>
/// <reference path="Scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="sys.ts"/>
/// <reference path="app.ts"/>

namespace regexTester {
    abstract class RegexExpressionBase {
        private _id: symbol;
        private _parent: RegexExpression | undefined;
        private _previous: RegexExpressionBase | undefined;
        private _next: RegexExpressionBase | undefined;
        private _first: RegexExpressionBase | undefined;
        private _last: RegexExpressionBase | undefined;
        private _size: number = 0;

        protected get baseParent(): RegexExpressionBase { return this._parent; }

        protected get basePrevious(): RegexExpressionBase { return this._previous; }

        protected get baseNext(): RegexExpressionBase { return this._next; }

        protected get baseFirst(): RegexExpressionBase { return this._first; }

        protected get baseLast(): RegexExpressionBase { return this._last; }

        protected get baseSize(): number { return this._size; }

        constructor() { this._id = Symbol(); }
        
        protected baseAdd(item: RegexExpressionBase): number {
            if (sys.isNil(item))
                throw new Error("Cannot add nil items.");
            if (!sys.isNil(item._parent)) {
                if (item._parent._id === this._id)
                    throw new Error("Item alrady belongs to this expression.");
                throw new Error("Item belongs to another expression.");
            }
            if (sys.isNil(item._previous = this._last))
                this._first = item;
            else
                item._previous._next = item;
            (this._last = item)._parent = this;
            return this._size++;
        }

        protected baseReplace(item: RegexExpressionBase, ref: RegexExpressionBase): void {
            if (sys.isNil(item))
                throw new Error("Cannot add nil items.");
            if (sys.isNil(ref))
                throw new Error("Reference item cannot be null.");
            if (sys.isNil(ref._parent) || ref._parent._id !== this._id)
                throw new Error("Reference item does not belong to this expression");
            if (!sys.isNil(item._parent)) {
                if (item._parent._id === this._id) {
                    if (this._id == ref._id)
                        return;
                    throw new Error("Item alrady belongs to this expression.");
                }
                throw new Error("Item belongs to another expression.");
            }
            item._parent = this;
            if (sys.isNil(item._previous = ref._previous))
                this._first = item;
            else
                item._previous._next = item;
            if (sys.isNil(item._next = ref._next))
                this._last = item;
            else
                item._next._previous = item;
            ref._previous = ref._next = ref._parent = undefined;
        }

        protected baseInsertBefore(item: RegexExpressionBase, ref: RegexExpressionBase): number {
            if (sys.isNil(item))
                throw new Error("Cannot add nil items.");
            if (!sys.isNil(item._parent)) {
                if (item._parent._id === this._id)
                    throw new Error("Item alrady belongs to this expression.");
                throw new Error("Item belongs to another expression.");
            }
            if (sys.isNil(ref))
                throw new Error("Reference item cannot be null.");
            if (sys.isNil(ref._parent) || ref._parent._id !== this._id)
                throw new Error("Reference item does not belong to this expression");
            let index: number;
            if (sys.isNil(item._previous = (item._next = ref)._previous)) {
                index = 0;
                this._first = item;
            } else {
                item._previous._next = item;
                index = 1;
                for (let i: RegexExpressionBase = ref._previous._previous; !sys.isNil(i); i = i._previous)
                    index++;
            }
            (ref._previous = item)._parent = this;
            this._size++;
            return index;
        }

        protected baseInsertAfter(item: RegexExpressionBase, ref: RegexExpressionBase): number {
            if (sys.isNil(item))
                throw new Error("Cannot add nil items.");
            if (!sys.isNil(item._parent)) {
                if (item._parent._id === this._id)
                    throw new Error("Item alrady belongs to this expression.");
                throw new Error("Item belongs to another expression.");
            }
            if (sys.isNil(ref))
                throw new Error("Reference item cannot be null.");
            if (sys.isNil(ref._parent) || ref._parent._id !== this._id)
                throw new Error("Reference item does not belong to this expression");
            let index: number;
            if (sys.isNil(item._next = (item._previous = ref)._next)) {
                index = this._size;
                this._last = item;
            } else {
                item._next._previous = item;
                index = 1;
                for (let i: RegexExpressionBase = ref._previous; !sys.isNil(i); i = i._previous)
                    index++;
            }
            (ref._next = item)._parent = this;
            this._size++;
            return index;
        }

        protected baseRemove(item: RegexExpressionBase): boolean {
            if (sys.isNil(item) || sys.isNil(item._parent) || item._parent._id !== this._id)
                return false;
            if (sys.isNil(item._previous)) {
                if (sys.isNil(this._first = item._next)) {
                    this._last = undefined;
                    this._size = 0;
                } else {
                    this._first._previous = undefined;
                    item._next = undefined;
                    this._size--;
                }
            } else {
                if (sys.isNil(item._previous._next = item._next))
                    this._last = item._previous;
                else {
                    item._next._previous = item._previous;
                    item._next = undefined;
                }
                item._previous = undefined;
            }
            item._parent = undefined;
            return true;
        }

        protected baseGet(index: number): RegexExpressionBase | undefined {
            if (!isNaN(index) && index >= 0 && index < this._size) {
                if (index > (this._size >> 1)) {
                    let n: number = this._size - 1;
                    for (let i: RegexExpressionBase = this._last; !sys.isNil(i); i = i._previous) {
                        if (index == n)
                            return i;
                        n--;
                    }
                } else {
                    let n: number = 0;
                    for (let i: RegexExpressionBase = this._first; !sys.isNil(i); i = i._next) {
                        if (index == n)
                            return i;
                        n++;
                    }
                }
            }
        }

        protected baseClear(): void {
            for (let item: RegexExpressionBase = this._first; !sys.isNil(item); item = item._next)
                item._previous = item._next = item._parent = undefined;
            this._first = this._last = undefined;
            this._size = 0;
        }
    }

    class AlternationSet<TParent extends RegexExpressionBase> extends RegexExpressionBase implements Set<RegexExpression> {
        [Symbol.toStringTag]: "Set";

        get size(): number { return this.baseSize; }
        get parent(): TParent { return <TParent>this.baseParent; }
        get previous(): AlternationSet<TParent> { return <AlternationSet<TParent>>this.basePrevious; }
        get next(): AlternationSet<TParent> { return <AlternationSet<TParent>>this.baseNext; }

        constructor(item: RegexExpression) {
            super();
            this.baseAdd(item);
        }

        add(value: RegexExpression): this {
            this.baseAdd(value);
            return this;
        }
        clear(): void {
            this.baseClear();
            this.baseAdd(new RegexExpression());
        }
        delete(value: RegexExpression): boolean { return this.baseSize > 1 && this.baseRemove(value); }
        forEach(callbackfn: (value: RegexExpression, value2: RegexExpression, set: Set<RegexExpression>) => void, thisArg?: any): void {
            throw new Error("Method not implemented.");
        }
        has(value: RegexExpression): boolean {
            throw new Error("Method not implemented.");
        }
        [Symbol.iterator](): IterableIterator<RegexExpression> {
            throw new Error("Method not implemented.");
        }
        entries(): IterableIterator<[RegexExpression, RegexExpression]> {
            throw new Error("Method not implemented.");
        }
        keys(): IterableIterator<RegexExpression> {
            throw new Error("Method not implemented.");
        }
        values(): IterableIterator<RegexExpression> {
            throw new Error("Method not implemented.");
        }
        replace(item: RegexExpression, ref: RegexExpression): void { this.baseReplace(item, ref); }
        insertBefore(item: RegexExpression, ref: RegexExpression): number { return this.baseInsertBefore(item, ref); }
        insertAfter(item: RegexExpression, ref: RegexExpression): number { return this.baseInsertAfter(item, ref); }
        get(index: number): RegexExpression { return <RegexExpression>this.baseGet(index); }
    }

    class RegexExpression extends RegexExpressionBase {

    }

    class Group extends RegexExpression implements Set<AlternationSet<Group>> {
        add(value: AlternationSet<Group>): this {
            throw new Error("Method not implemented.");
        }
        delete(value: AlternationSet<Group>): boolean {
            throw new Error("Method not implemented.");
        }
        forEach(callbackfn: (value: AlternationSet<Group>, value2: AlternationSet<Group>, set: Set<AlternationSet<Group>>) => void, thisArg?: any): void {
            throw new Error("Method not implemented.");
        }
        has(value: AlternationSet<Group>): boolean {
            throw new Error("Method not implemented.");
        }
        size: number;
        [Symbol.iterator](): IterableIterator<AlternationSet<Group>> {
            throw new Error("Method not implemented.");
        }
        entries(): IterableIterator<[AlternationSet<Group>, AlternationSet<Group>]> {
            throw new Error("Method not implemented.");
        }
        keys(): IterableIterator<AlternationSet<Group>> {
            throw new Error("Method not implemented.");
        }
        values(): IterableIterator<AlternationSet<Group>> {
            throw new Error("Method not implemented.");
        }
        [Symbol.toStringTag]: "Set";
        addx(item: RegexExpression): number { return this.baseAdd(new AlternationSet<Group>(item)); }
        insertBefore(item: RegexExpression, ref: RegexExpression): number { return this.baseInsertBefore(new AlternationSet<Group>(item), ref); }
        insertAfter(item: RegexExpression, ref: RegexExpression): number { return this.baseInsertAfter(new AlternationSet<Group>(item), ref); }
        remove(item: AlternationSet<Group>): boolean { return this.baseRemove(item); }
        get(index: number): AlternationSet<Group> { return <AlternationSet<Group>>this.baseGet(index); }
        clear(): void { this.baseClear(); }
    }

    /*

        

        ?
        ??
        *
        *?
        +
        +?
        {n}
        {n,m}
        {n,}
        {n,m}?
        {n,}?

    */
    // #region RegexTester Controller
    enum RegexMatchGroup {
        all = 0,
        openCaptureGroup = 1,
        groupType = 2,
        closeGroup = 3,
        openCharGroup = 4,
        subPattern = 5
    }

    let rePattern: RegExp = /^(?:(\((\?[:=!]?|#)?)|(\))|(\[)|((?:\\(?:u[\da-f]{4}|x[\da-f]{2}|c[a-z]|(?:0(?:[1-7][0-7]?)?|[123](?:[0-7][0-7]?)?|[4-7][0-7]?)|.)|.)+))/;
    // TODO: This next regex may not be valid.
    let intraBracketRegex = /^(?:(\\(?:u[\da-f]{4}|x[\da-f]{2}|c[a-z]|(?:0(?:[1-7][0-7]?)?|[123](?:[0-7][0-7]?)?|[4-7][0-7]?)|.)|([^\]])))/;

    interface IRegexToken {

    }

    function ParseRegexPattern(pattern: string): IRegexToken[] {
        let result: IRegexToken[] = [];
        while (pattern.length > 0) {

        }
        return result;
    }
    
    interface IRegexTesterScope extends ng.IScope {
        evaluateExpression(): void;
        evaluationIsDisabled: boolean;
    }
    
    class RegexTesterController implements ng.IController {
        constructor(protected $scope: IRegexTesterScope, regexParser: RegexParserService, evaluateExpression: EvaluateExpressionService) {
            let controller: RegexTesterController = this;
            $scope.evaluationIsDisabled = true;
            $scope.evaluateExpression = () => { controller.evaluateExpression(); }
            regexParser.whenPatternParseSucceeded((re: RegExp) => { $scope.evaluationIsDisabled = false; });
            regexParser.whenPatternParseFailed((value: string, reason: sys.ErrorResult) => { $scope.isDisabled = true; });
            regexParser.then((re: RegExp) => { $scope.evaluationIsDisabled = false; });
        }

        evaluateExpression(): void {

        }

        $doCheck() {

        }
    }
    
    app.mainModule.controller("regexTester", ["$scope", "regexParser", "evaluateExpression", RegexTesterController]);
    
    // #endregion
    
    // #region incrementalId Service
    
    class incrementalIdService {
        private _id: number = 0;

        next(): number {
            let result: number = this._id++; 
            if (result < 32768)
                return result;
            this._id = 0;
            return this.next();
        }
    
        constructor() { }
    }
    
    app.mainModule.service("incrementalId", [function () { return new incrementalIdService(); }]);
    
    // #endregion
    
    // #region regexParser Service
    
    const whitespaceRe: RegExp = /[\s\r\n\p{C}]+/g;

    class RegexParserService {
        private _result: ng.IPromise<RegExp>;
        private _flags: string = "";
        private _inputRegexPattern: string = "";
        private _parsePending: boolean = false;
        private _parsedPattern: RegExp | undefined;
        private _pauseLevel: number = 0;
        private _whenInputPatternChanged: sys.IValueCallback<string> | undefined;
        private _whenParsedPatternChanged: sys.IValueCallback<RegExp | undefined> | undefined;
        private _whenPatternParseSucceeded: sys.IValueCallback<RegExp> | undefined;
        private _whenPatternParseFailed: sys.IValueErrorCallback<string> | undefined;

        get isPaused(): boolean { return this._pauseLevel > 0; }

        get inputRegexPattern(): string { return this._inputRegexPattern; }
        set inputRegexPattern(value: string) {
            let pattern: string = ((typeof value === "undefined") || value === null) ? "" : ((typeof value === "string") ? value : "" + value);
            if (this._inputRegexPattern === pattern)
                return;
            this._inputRegexPattern = pattern;
            sys.execIfFunction<string>(this._whenInputPatternChanged, this._inputRegexPattern);
            if (this._pauseLevel > 0)
                this._parsePending = true;
            else
                this.startParseCurrentPattern();
        }

        get lastParsedPattern(): RegExp | undefined { return this._parsedPattern; }
        
        constructor(protected $q: ng.IQService, protected regexOptions: RegexOptionsService) {
            let service: RegexParserService = this;
            regexOptions.whenFlagsChanged((flags: string) => {
                if (service._flags === flags)
                    return;
                service._flags = flags;
                if (this._pauseLevel > 0)
                    this._parsePending = true;
                else
                    this.startParseCurrentPattern();
            });
            this._flags = regexOptions.flags;
        }

        withParsingPaused<T>(callback: { (): T; }, thisArg?: any): T;
        withParsingPaused(callback: { (): any; }, thisArg?: any): any {
            this._pauseLevel++;
            try { return callback(); }
            finally {
                this._pauseLevel--;
                if (this._pauseLevel == 0 && this._parsePending) {
                    this._parsePending = false;
                    this.startParseCurrentPattern();
                }
            }
        }

        whenInputPatternChanged(callback: sys.IValueCallback<string>) { this._whenInputPatternChanged = sys.chainCallback<string>(this._whenInputPatternChanged, callback); }
    
        whenParsedPatternChanged(callback: sys.IValueCallback<RegExp | undefined>) { this._whenParsedPatternChanged = sys.chainCallback<RegExp | undefined>(this._whenParsedPatternChanged, callback); }
    
        whenPatternParseSucceeded(callback: sys.IValueCallback<RegExp>) { this._whenPatternParseSucceeded = sys.chainCallback<RegExp>(this._whenPatternParseSucceeded, callback); }
        
        whenPatternParseFailed(callback: sys.IValueErrorCallback<string>) { this._whenPatternParseFailed = sys.chainCallback<string, sys.ErrorResult>(this._whenPatternParseFailed, callback); }
        
        startParseCurrentPattern(): ng.IPromise<RegExp> {
            let result: ng.IPromise<RegExp>;
            let pattern: string = this._inputRegexPattern;
            this._result = result = this.$q<RegExp>((resolve: ng.IQResolveReject<RegExp>, reject: ng.IQResolveReject<any>) => {
                let result: RegExp;
                try { result = new RegExp(pattern, this._flags); }
                catch (e) {
                    reject(e);
                    return;
                }
                if (sys.isNil(result))
                    reject("Failed ot parse regular expression.");
                else
                    resolve(result);
            }).then((result: RegExp) => {
                this._parsedPattern = result;
                try { sys.execIfFunction<RegExp>(this._whenPatternParseSucceeded, result); }
                finally { sys.execIfFunction<RegExp | undefined>(this._whenParsedPatternChanged, result); }
                return result;
            }, (reason: any) => {
                let errorReason: sys.ErrorResult = sys.asErrorResult(reason);
                this._parsedPattern = undefined;
                try { sys.execIfFunction<string, sys.ErrorResult>(this._whenPatternParseFailed, pattern, reason); }
                finally { sys.execIfFunction<RegExp | undefined>(this._whenParsedPatternChanged, undefined); }
                return errorReason;
            });

            return result;
        }

        then<T>(successCallback: { (result: RegExp): T}, errorCallback?: { (reason: sys.ErrorResult): any}): ng.IPromise<T>;
        then(successCallback: { (result: RegExp): any}, errorCallback?: { (reason: sys.ErrorResult): any}): ng.IPromise<any>;
        then(successCallback: { (result: RegExp): any}, errorCallback?: { (reason: sys.ErrorResult): any}): ng.IPromise<any> {
            let result: ng.IPromise<RegExp> = this._result;
            if (sys.isNil(result))
                return this.startParseCurrentPattern();
            return result.then(successCallback, errorCallback);
        }
    }
    
    app.mainModule.service("regexParser", ["$q", "regexOptions", function ($q: ng.IQService, regexOptions: RegexOptionsService) {
        return new RegexParserService($q, regexOptions);
    }]);
    
    // #endregion
    
    // #region evaluationSource Service

    interface IInputSourceItemParent extends ng.IScope {
        sourceItems: IInputSourceItemScope[];
        addSourceItem(): void;
    }

    class EvaluationSourceItem {
        private _cardNumber: number;
        private _matchIndex: number;
        private _groups: IExpressionEvaluationGroup[];
        private _canDelete: boolean = true;
        private _isEvaluated: boolean = false;
        private _success: boolean = false;
        private _text: string = "";

        get cardNumber(): number { return this._cardNumber; }
        get canDelete(): boolean { return this._canDelete; }
        get isEvaluated(): boolean { return this._isEvaluated; }
        get success(): boolean { return this._success; }
        get resultsButtonText(): string { return (this._isEvaluated) ? ((this._success) ? "Matched " + this._groups.length + " groups." : "No match"): "Not Evaluated"; }
        get text(): string { return this._text; }
        
        constructor(private _parentArray: EvaluationSourceItem[]) {
            this._cardNumber = _parentArray.length + 1;
            _parentArray.push(this);
            if (this._cardNumber == 1)
                this._canDelete = false;
            else {
                this._canDelete = true;
                if (this._cardNumber == 2)
                    this._parentArray[0]._canDelete = true;
            }
        }

        getResultClass(): string[] {
            if (this._isEvaluated)
                return [(this._success) ? "btn-success" : "btn-warning"];
            return ["btn-secondary"];
        }

        delete(): boolean {
            if (typeof this._parentArray === "undefined" || this._parentArray.length < 2)
                return false;
            if (this._cardNumber == 1)
                this._parentArray.shift();
            else if (this._cardNumber == this._parentArray.length)
                this._parentArray.pop();
            else
                this._parentArray.splice(this._cardNumber - 1, 1);
            for (let i: number = this._cardNumber - 1; i < this._parentArray.length; i++)
                this._parentArray[i]._cardNumber = i + 1;
            this._parentArray = undefined;
            return true;
        }

        static initialize(items: EvaluationSourceItem[], scope: IInputSourceItemParent) {
            if (sys.isNil(scope.sourceItems) || !Array.isArray(scope.sourceItems))
                scope.sourceItems = [];
            let e: number = (items.length < scope.sourceItems.length) ? items.length : scope.sourceItems.length;
            let i: number;
            for (i = 0; i < e; i++) {
                let source: EvaluationSourceItem = items[i];
                let target: IInputSourceItemScope = scope.sourceItems[i];
                if ((typeof target !== "object") || target === null)
                    scope.sourceItems[i] = target = <IInputSourceItemScope>(scope.$new());
                target.canDelete = source._canDelete;
                target.controlId = "evaluationSourceTextBox" + source._cardNumber.toString();
                target.resultsButtonText = source.resultsButtonText;
                target.resultsClick = () => { return source._isEvaluated; };
                target.delete = () => { return source.delete(); }
                target.resultsHref =(source._isEvaluated) ? "#results" + source._cardNumber.toString() : "#";
                target.text = source._text;
            }
            while (scope.sourceItems.length > 3)
                scope.sourceItems.pop();
            while (e < items.length) {
                let source: EvaluationSourceItem = new EvaluationSourceItem(items);
                let target: IInputSourceItemScope = <IInputSourceItemScope>(scope.$new());
                scope.sourceItems.push(target);
                target.canDelete = source._canDelete;
                target.controlId = "evaluationSourceTextBox" + source._cardNumber.toString();
                target.resultsButtonText = source.resultsButtonText;
                target.resultsClick = () => { return source._isEvaluated; };
                target.delete = () => { return source.delete(); }
                target.resultsHref = (source._isEvaluated) ? "#results" + source._cardNumber.toString() : "#";
                target.text = source._text;
            }
        }
    }

    class EvaluationSourceService {
        private _items: EvaluationSourceItem[] = [];
    
        constructor() { }

        initialize(scope: IInputSourceItemParent) { EvaluationSourceItem.initialize(this._items, scope); }
    }
    
    app.mainModule.service("evaluationSource", [function () { return new EvaluationSourceService(); }]);
    
    // #endregion
    
    // #region evaluateExpression Service

    interface IExpressionEvaluationGroup {

    }

    interface IExpressionEvaluationResult {
        
    }
    
    class EvaluateExpressionService {
        private _result: ng.IPromise<IExpressionEvaluationResult>;
    
        constructor(protected $q: ng.IQService, protected regexParser: RegexParserService, protected regexOptions: RegexOptionsService) { }
    
        startEvaluateCurrent(): ng.IPromise<IExpressionEvaluationResult> {
            let result: ng.IPromise<IExpressionEvaluationResult>;
            this._result = result = this.regexParser.then<IExpressionEvaluationResult>((re: RegExp) => {
                return this.$q<IExpressionEvaluationResult>((resolve: ng.IQResolveReject<IExpressionEvaluationResult>) => {
                    return this.regexParser.then<IExpressionEvaluationResult>((re: RegExp) => {
                        throw new Error("Resolver not implemented.");
                    });
                }).then((result: IExpressionEvaluationResult) => { return result; }, (reason: any) => {
                    let errorReason: sys.ErrorResult = sys.asErrorResult(reason);
                    throw new Error("Reject not implemented.");
                    // this._parsedPattern = undefined;
                    // try { sys.execIfFunction<string, sys.ErrorResult>(this._whenPatternParseFailed, pattern, reason); }
                    // finally { sys.execIfFunction<RegExp | undefined>(this._whenParsedPatternChanged, undefined); }
                    // return errorReason;
                });
            });
            
            return result;
        }

        then<T>(successCallback: { (result: IExpressionEvaluationResult): T}, errorCallback?: { (reason: sys.ErrorResult): any}): ng.IPromise<T>;
        then(successCallback: { (result: IExpressionEvaluationResult): any}, errorCallback?: { (reason: sys.ErrorResult): any}): ng.IPromise<any>;
        then(successCallback: { (resresultponse: IExpressionEvaluationResult): any}, errorCallback?: { (reason: sys.ErrorResult): any}): ng.IPromise<any> {
            return this._result.then(successCallback, errorCallback);
        }
    }
    
    app.mainModule.service("evaluateExpression", ["$q", "regexParser", "regexOptions", function ($q: ng.IQService, regexParser: RegexParserService, regexOptions: RegexOptionsService) {
        return new EvaluateExpressionService($q, regexParser, regexOptions);
    }]);
    
    // #endregion
    
    interface IRegexOptions {
        global: boolean;
        ignoreCase: boolean;
        multiline: boolean;
        sticky: boolean;
        unicode: boolean;
        dotMatchesNewline: boolean;
    }

    // #region RegexOptions Service
    
    class RegexOptionsService implements IRegexOptions {
        private _whenFlagsChanged: sys.IValueCallback<string>;

        // #region flags Property
        
        private _flags: string = "";
        
        get flags(): string { return this._flags; }
        
        // #endregion
        
        // #region global Property
        
        private _global: boolean = false;
        
        get global(): boolean { return this._global; }
        set global(value: boolean) {
            if (this._global === ((typeof (value) == "boolean") ? value : (value = value === true)))
                return;
            this._global = value;
            this.updateFlags();
        }
        
        // #endregion
        
        // #region ignoreCase Property
        
        private _ignoreCase: boolean = false;
        
        get ignoreCase(): boolean { return this._ignoreCase; }
        set ignoreCase(value: boolean) {
            if (this._ignoreCase === ((typeof (value) == "boolean") ? value : (value = value === true)))
                return;
            this._ignoreCase = value;
            this.updateFlags();
        }
        
        // #endregion
        
        // #region multiline Property
        
        private _multiline: boolean = false;
        
        get multiline(): boolean { return this._multiline; }
        set multiline(value: boolean) {
            if (this._multiline === ((typeof (value) == "boolean") ? value : (value = value === true)))
                return;
            this._multiline = value;
            this.updateFlags();
        }
        
        // #endregion
        
        // #region dotMatchesNewline Property
        
        private _dotMatchesNewline: boolean = false;
        
        get dotMatchesNewline(): boolean { return this._dotMatchesNewline; }
        set dotMatchesNewline(value: boolean) {
            if (this._dotMatchesNewline === ((typeof (value) == "boolean") ? value : (value = value === true)))
                return;
            this._dotMatchesNewline = value;
            this.updateFlags();
        }
        
        // #endregion
        
        // #region unicode Property
        
        private _unicode: boolean = false;
        
        get unicode(): boolean { return this._unicode; }
        set unicode(value: boolean) {
            if (this._unicode === ((typeof (value) == "boolean") ? value : (value = value === true)))
                return;
            this._unicode = value;
            this.updateFlags();
        }
        
        // #endregion
        
        // #region sticky Property
        
        private _sticky: boolean = false;
        
        get sticky(): boolean { return this._sticky; }
        set sticky(value: boolean) {
            if (this._sticky === ((typeof (value) == "boolean") ? value : (value = value === true)))
                return;
            this._sticky = value;
            this.updateFlags();
        }
        
        // #endregion

        constructor() { }

        static toFlags(source: IRegexOptions) {
            let flags: string = (source.global) ? "g" : "";
            if (source.ignoreCase)
                flags += "i";
            if (source.multiline)
                flags += "m";
            if (source.dotMatchesNewline)
                flags += "s";
            if (source.unicode)
                flags += "u";
            return (source.sticky) ? flags + "y" : flags;
        }

        updateFrom(source: IRegexOptions): boolean {
            let flags: string = RegexOptionsService.toFlags(source);
            if (flags === this._flags)
                return false;
            this._flags = flags;
            this._dotMatchesNewline = source.dotMatchesNewline;
            this._global = source.global;
            this._ignoreCase = source.ignoreCase;
            this._multiline = source.multiline;
            this._sticky = source.sticky;
            this._unicode = source.unicode;
            this.updateFlags();
            return true;
        }

        private updateFlags(): void {
            let flags: string;
            this._flags = flags = RegexOptionsService.toFlags(this);
            sys.execIfFunction<string>(this._whenFlagsChanged, flags);
        }

        updateTo(target: IRegexOptions) {
            target.dotMatchesNewline = this._dotMatchesNewline;
            target.global = this._global;
            target.ignoreCase = this._ignoreCase;
            target.multiline = this._multiline;
            target.sticky = this._sticky;
            target.unicode = this._unicode;
        }
        
        whenFlagsChanged(callback: sys.IValueCallback<string>) {
            this._whenFlagsChanged = sys.chainCallback<string>(this._whenFlagsChanged, callback);
        }
    }
    
    app.mainModule.service("regexOptions", [function () { return new RegexOptionsService(); }]);
    
    // #endregion
    
    // #region InputSourceEdit Controller
    interface IInputSourceItemScope extends ng.IScope {
        controlId: string;
        text: string;
        resultsHref: string;
        resultClass: string[];
        resultsButtonText: string;
        canDelete: boolean;
        resultsClick(): boolean;
        delete(): void;
    }

    interface IInputSourceEditScope extends IInputSourceItemParent {
    }
    
    class InputSourceEditController implements ng.IController {
        constructor(protected $scope: IInputSourceEditScope, evaluationSource: EvaluationSourceService, evaluateExpression: EvaluateExpressionService) { }

        $doCheck() {

        }
    }
    
    app.mainModule.controller("inputSourceEdit", ["$scope", "evaluationSource", "evaluateExpression", InputSourceEditController]);
    
    // #endregion
    
    // #region RegexPattern Controller

    const editOptionsDialogId: string = "EditOptionsDialog";

    interface IRegexPatternScope extends ng.IScope {
        regexPattern: string;
        wsRegexPattern: string;
        global: boolean;
        ignoreCase: boolean;
        multiline: boolean;
        dotMatchesNewline: boolean;
        unicode: boolean;
        sticky: boolean;
        ignoreWhitespace: boolean;
        editOptionsDialogId: string;
        flags: string;
        textBoxClass: string[];
        isValid: boolean;
        patternValidationMessage: string;
        editOptionsDialogVisible: boolean;
        showEditOptionsDialog(): void;
        closeEditOptionsDialog(): void;
    }

    class RegexPatternController implements ng.IController {
        private _pattern: string;
        private _wsRegexPattern: string;

        constructor(protected $scope: IRegexPatternScope, protected $log: ng.ILogService, protected regexOptions: RegexOptionsService, protected regexParser: RegexParserService) {
            $scope.global = regexOptions.global;
            $scope.ignoreCase = regexOptions.ignoreCase;
            $scope.multiline = regexOptions.multiline;
            $scope.dotMatchesNewline = regexOptions.dotMatchesNewline;
            $scope.unicode = regexOptions.unicode;
            $scope.sticky = regexOptions.sticky;
            $scope.flags = regexOptions.flags;
            $scope.ignoreWhitespace = false;
            $scope.regexPattern = $scope.wsRegexPattern = this._pattern = this._wsRegexPattern = regexParser.inputRegexPattern;
            $scope.editOptionsDialogId = editOptionsDialogId;
            $scope.isValid = true;
            $scope.textBoxClass = ["is-valid "];
            $scope.patternValidationMessage = "";
            
            let controller: RegexPatternController = this;
            $scope.showEditOptionsDialog = () => { controller.showEditOptionsDialog(); }
            $scope.closeEditOptionsDialog = () => { controller.closeEditOptionsDialog(); }
            regexOptions.whenFlagsChanged((value: string) => { controller.$scope.flags = value; });
            regexParser.whenPatternParseSucceeded((re: RegExp) => {
                this.$scope.textBoxClass = ["is-valid "];
                this.$scope.isValid = true;
            });
            regexParser.whenPatternParseFailed((text: string, reason: sys.ErrorResult) => {
                this.$scope.textBoxClass = ["is-invalid"];
                this.$scope.isValid = false;
                $scope.patternValidationMessage = (typeof reason === "string") ? reason : (typeof reason.message === "string" && reason.message.trim().length > 0) ? reason.message : "" + reason;
            });
        }

        showEditOptionsDialog(): void {
            this.$scope.editOptionsDialogVisible = true;
            $("#" + this.$scope.editOptionsDialogId).modal("show");
        }

        closeEditOptionsDialog(): void {
            this.$scope.editOptionsDialogVisible = false;
            $("#" + this.$scope.editOptionsDialogId).modal("hide");
        }

        $doCheck() {
            this.regexParser.withParsingPaused(() => {
                let hasChanges: boolean = true;
                if (this._wsRegexPattern !== this.$scope.wsRegexPattern)
                    this.regexParser.inputRegexPattern = this.$scope.regexPattern = this._pattern = (this._wsRegexPattern = this.$scope.wsRegexPattern).replace(whitespaceRe, "");
                else if (this._pattern !== this.$scope.regexPattern)
                    this.regexParser.inputRegexPattern = this._pattern = this._wsRegexPattern = this.$scope.wsRegexPattern = this.$scope.regexPattern;
                else
                    hasChanges = false;
                this.regexOptions.updateFrom(this.$scope);
            });
        }
    }
    
    app.mainModule.controller("regexPattern", ["$scope", "$log", "regexOptions", "regexParser", RegexPatternController]);
    
    // #endregion
}
