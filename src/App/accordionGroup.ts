/// <reference path="../Scripts/typings/jquery/jquery.d.ts"/>
/// <reference path="../Scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="../Scripts/typings/angularjs/angular-route.d.ts"/>
/// <reference path="../Scripts/typings/bootstrap/index.d.ts"/>
/// <reference path="app.ts"/>

module accordionGroup {
    /**
     * Callback function definition for notifying listeners when the target element's visiblity is changed.
     *
     * @export
     * @interface IShowHideCallback
     * @param {boolean} show - true if target element was just shown; otherwise, false.
     * @param {*} [state] - The optional state object that was provided when the listener was added.
     */
    export interface IShowHideCallback { (show: boolean, state?: any): void; };

    // #region <accordion-group:container></accordion-group:container>

    export const PREFIX_accordionGroup: string = "accordionGroup";

    export const DIRECTIVENAME_accordionGroupContainer: string = PREFIX_accordionGroup + "Container";

    /**
     * Internal interface for tracking show/hide listeners registered with an accordionGroup directive.
     *
     * @interface IAccordionGroupItemState
     */
    interface IAccordionGroupItemState {
        /**
         * Unique id number assigned to listener.
         *
         * @type {number}
         * @memberof IAccordionGroupItemState
         */
        id: number;

        /**
         * Function to call when target element is shown or hidden.
         *
         * @type {IShowHideCallback}
         * @memberof IAccordionGroupItemState
         */
        callback: IShowHideCallback;

        /**
         * Name assigned to target element.
         *
         * @type {string}
         * @memberof IAccordionGroupItemState
         * @description The target element will be a child element that has an accordion-group-content-item attribute (accordionGroupContentItem directive) matching this value.
         */
        name: string;

        /**
         * Optional state object provided when the listener was added.
         *
         * @type {*}
         * @memberof IAccordionGroupItemState
         */
        state?: any;
    }

    /**
     * Controller automatically given to the accordionGroup directive, which manages the visibility of child elements that have the accordionGroupContentItem directive.
     *
     * @export
     * @class AccordionGroupController
     */
    export class AccordionGroupController {
        private _state: IAccordionGroupItemState[] = [];
        private _current: string | undefined = undefined;
        
        private find(name: string): IAccordionGroupItemState[] { return this._state.filter((value: IAccordionGroupItemState) => value.name === name); }
        private get(id: number): IAccordionGroupItemState | undefined {
            if (this._state.length > 0) {
                let result: IAccordionGroupItemState = this._state.find((value: IAccordionGroupItemState) => value.id == id);
                if (typeof result === "object" && result !== null)
                    return result;
            }
        }

        /**
         * Registers a callback function to be called when the visibility of a target element changes.
         *
         * @param {string} name - Specifies the target element, which will have an accordion-group-content-item attribute (accordionGroupContentItem directive) matching this value.
         * @param {IShowHideCallback} showHideCallback - The callback function to invoke.
         * @param {*} [state] - Optional state value that will be included when showHideCallback is invoked.
         * @returns {number} - The unique identifier assigned to the callback function just registered. This value will be provided if you wish to unregister the notification callback.
         * @memberof AccordionGroupController
         */
        add(name: string, showHideCallback: IShowHideCallback, state?: any): number {
            if (typeof name !== "string")
                name = "";
            let id: number = this._state.length;
            if (this._state.length > 0) {
                while (typeof (this.get(id)) !== "undefined")
                    id--;
            }
            this._state.push({ id: id, callback: showHideCallback, name: name, state: state });
            if (this._state.length == 1) {
                this._current = name;
                showHideCallback(true, state);
            } else
                showHideCallback(this._current === name, state);
            return id;
        }

        /**
         * Un-registers a callback function so it will no longer be called when the visibility of the target element changes.
         *
         * @param {number} id - The unique identifer that was returned from the add method.
         * @returns {boolean} - true if the callback function was un-registered; otherwise, false if no callback is registered with the specified id.
         * @memberof AccordionGroupController
         */
        remove(id: number): boolean {
            let index: number = this._state.findIndex((value: IAccordionGroupItemState) => value.id == id);
            let item: IAccordionGroupItemState;
            if (index == 0)
                item = this._state.shift();
            else if (index == this._state.length - 1)
                item = this._state.pop();
            else if (index > 0)
                item = this._state.splice(index, 1)[0];
            else
                return false;
            if (this._current == item.name && this._state.length > 0 && this.find(item.name).length == 0)
                this.show(this._state[0].name);
            return true;
        }

        /**
         * Shows the element whose accordion-group-content-item attribute (accordionGroupContentItem directive) matching the specified name.
         *
         * @param {string} name - The accordion-group-content-item attribute to match.
         * @memberof AccordionGroupController
         */
        show(name: string): void {
            if (typeof name !== "string")
                name = "";
            if (name === this._current)
                return;
            let toHide: IAccordionGroupItemState[] = (this._state.length == 0 || (typeof this._current !== "string")) ? [] : this.find(this._current);
            let toShow: IAccordionGroupItemState[] = this.find(name);
            if (toShow.length == 0)
                return;
            toHide.forEach((item: IAccordionGroupItemState) => item.callback(false, item.state));
            this._current = name;
            toShow.forEach((item: IAccordionGroupItemState) => item.callback(true, item.state));
        }

        /**
         * Hides the element whose accordion-group-content-item attribute (accordionGroupContentItem directive) matching the specified name.
         *
         * @param {string} name - The accordion-group-content-item attribute to match.
         * @memberof AccordionGroupController
         */
        hide(name: string): void {
            if (typeof name !== "string")
                name = "";
            if (name !== this._current || this._state.length == 0)
                return;
            this._current = undefined;
            this.find(name).forEach((toHide: IAccordionGroupItemState) => toHide.callback(false, toHide.state));
        }

        /**
         * Toggles the visibility of the element whose accordion-group-content-item attribute (accordionGroupContentItem directive) matching the specified name.
         *
         * @param {string} name - The accordion-group-content-item attribute to match.
         * @memberof AccordionGroupController
         */
        toggle(name: string): void {
            if (typeof name !== "string")
                name = "";
            if (name === this._current)
                this.hide(name);
            else
                this.show(name);
        }
    }
    
    app.mainModule.directive(DIRECTIVENAME_accordionGroupContainer, () => <ng.IDirective>{
        restrict: "E",
        controller: ["$scope", AccordionGroupController],
        transclude: true,
        template: '<ng-transclude></ng-transclude>'
    });

    // #endregion

    // #region accordion-group:content

    export const DIRECTIVENAME_accordionGroupContent: string = PREFIX_accordionGroup + "Content";

    /**
     * Defines expected attribute values for the target element that has the accordionGroupContentItem directive.
     *
     * @export
     * @interface IAccordionGroupContentItemAttributes
     * @extends {ng.IAttributes}
     */
    export interface IAccordionGroupContentItemAttributes extends ng.IAttributes {
        /**
         * The name to associate with the target element.
         *
         * @type {string}
         * @memberof IAccordionGroupContentItemAttributes
         * @description In the source HTML, this comes from the value of the accordion-group-content-item attribute.
         */
        accordionGroupContentItem: string;
    }

    app.mainModule.directive(DIRECTIVENAME_accordionGroupContent, () => <ng.IDirective>{
        require: "^^" + DIRECTIVENAME_accordionGroupContainer,
        restrict: "A",
        transclude: true,
        template: '<ng-transclude></ng-transclude>',
        link: (scope: ng.IScope, element: JQuery,
            instanceAttributes: IAccordionGroupContentItemAttributes, controller: AccordionGroupController) => {
            let id: number = controller.add(instanceAttributes.accordionGroupContentItem, (show: boolean) => {
                if (show)
                    element.show();
                else
                    element.hide();
            });
            element.on("$destory", () => controller.remove(id));
        }
    });

    // #endregion

    // #region accordion-group:toggle-on-click

    export const DIRECTIVENAME_accordionGroupToggleOnClick: string = PREFIX_accordionGroup + "ToggleOnClick";

    /**
     *
     *
     * @export
     * @interface IAccordionGroupToggleOnClickAttributes
     * @extends {ng.IAttributes}
     */
    export interface IAccordionGroupToggleOnClickAttributes extends ng.IAttributes {
        /**
         *
         *
         * @type {string}
         * @memberof IAccordionGroupToggleOnClickAttributes
         */
        accordionGroupToggleOnClick: string;
    }

    app.mainModule.directive(DIRECTIVENAME_accordionGroupToggleOnClick, () => <ng.IDirective>{
        require: "^^" + DIRECTIVENAME_accordionGroupContainer,
        restrict: "A",
        transclude: true,
        template: '<ng-transclude></ng-transclude>',
        link: (scope: ng.IScope, element: JQuery, instanceAttributes: IAccordionGroupToggleOnClickAttributes, controller: AccordionGroupController) => {
            element.on("click", () => controller.toggle(instanceAttributes.accordionGroupToggleOnClick));
        }
    });

    // #endregion

    // #region <accordion-group-toggle-button item-id="" expanded-class="" collapsed-class=""></accordion-group-toggle-button>

    export const DIRECTIVENAME_accordionGroupToggleButton: string = PREFIX_accordionGroup + "ToggleButton";

    /**
     *
     *
     * @export
     * @interface IAccordionGroupToggleButtonAttributes
     * @extends {ng.IAttributes}
     */
    export interface IAccordionGroupToggleButtonAttributes extends ng.IAttributes {
        class?: string;
        
        /**
         *
         *
         * @type {string}
         * @memberof IAccordionGroupToggleButtonAttributes
         */
        itemId: string;
        
        /**
         *
         *
         * @type {string}
         * @memberof IAccordionGroupToggleButtonAttributes
         */
        expandedClass?: string;
        
        /**
         *
         *
         * @type {string}
         * @memberof IAccordionGroupToggleButtonAttributes
         */
        collapsedClass?: string;
    }

    /**
     *
     *
     * @export
     * @interface IAccordionGroupToggleButtonScope
     * @extends {ng.IScope}
     */
    export interface IAccordionGroupToggleButtonScope extends ng.IScope {
        /**
         *
         *
         * @type {string}
         * @memberof IAccordionGroupToggleButtonScope
         */
        class?: string;
        
        /**
         *
         *
         * @type {string}
         * @memberof IAccordionGroupToggleButtonScope
         */
        itemId: string;
        
        /**
         *
         *
         * @type {boolean}
         * @memberof IAccordionGroupToggleButtonScope
         */
        isShown: boolean;
        
        /**
         *
         *
         * @type {Function}
         * @memberof IAccordionGroupToggleButtonScope
         */
        onAccordionItemExpanded: Function;
        
        /**
         *
         *
         * @type {Function}
         * @memberof IAccordionGroupToggleButtonScope
         */
        onAccordionItemCollapsed: Function;
        
        /**
         *
         *
         * @type {AccordionGroupToggleButtonController}
         * @memberof IAccordionGroupToggleButtonScope
         */
        accordionGroupToggleButtonController: AccordionGroupToggleButtonController;
    }

    /**
     *
     *
     * @export
     * @interface IAccordionGroupToggleButtonCallback
     */
    export interface IAccordionGroupToggleButtonCallback { (newValue: boolean): void; }

    /**
     *
     *
     * @export
     * @interface IAccordionGroupToggleButtonCallbackItem
     */
    export interface IAccordionGroupToggleButtonCallbackItem { id: number; cb: IAccordionGroupToggleButtonCallback }
    
    /**
     *
     *
     * @export
     * @class AccordionGroupToggleButtonController
     * @implements {ng.IController}
     */
    export class AccordionGroupToggleButtonController implements ng.IController {
        private _callbacks: IAccordionGroupToggleButtonCallbackItem[] = [];
        private _isShown: boolean = false;

        /**
         *
         *
         * @readonly
         * @type {boolean}
         * @memberof AccordionGroupToggleButtonController
         */
        get isShown(): boolean { return this._isShown; }

        constructor(protected readonly $scope: ng.IScope) { }

        private get(id: number): IAccordionGroupToggleButtonCallbackItem | undefined {
            if (this._callbacks.length > 0) {
                let result: IAccordionGroupToggleButtonCallbackItem = this._callbacks.find((value: IAccordionGroupToggleButtonCallbackItem) => value.id == id);
                if (typeof result === "object" && result !== null)
                    return result;
            }
        }

        /**
         *
         *
         * @param {IAccordionGroupToggleButtonCallback} callbackFn
         * @returns {number}
         * @memberof AccordionGroupToggleButtonController
         */
        addOnShowHide(callbackFn: IAccordionGroupToggleButtonCallback): number {
            let id: number = this._callbacks.length;
            if (this._callbacks.length > 0) {
                while (typeof (this.get(id)) !== "undefined")
                    id--;
            }
            this._callbacks.push({ id: id, cb: callbackFn });
            callbackFn(this._isShown);
            return id;
        }

        /**
         *
         *
         * @param {number} id
         * @returns {boolean}
         * @memberof AccordionGroupToggleButtonController
         */
        removeOnShowHide(id: number): boolean {
            let index: number = this._callbacks.findIndex((value: IAccordionGroupToggleButtonCallbackItem) => value.id == id);
            let item: IAccordionGroupToggleButtonCallbackItem;
            if (index == 0)
                item = this._callbacks.shift();
            else if (index == this._callbacks.length - 1)
                item = this._callbacks.pop();
            else if (index > 0)
                item = this._callbacks.splice(index, 1)[0];
            else
                return false;
            return true;
        }

        private static directiveLink(scope: IAccordionGroupToggleButtonScope,
            element: JQuery, instanceAttributes: IAccordionGroupToggleButtonAttributes, controller: AccordionGroupController): void {
            let expandedClass: string[] = [];
            let collapsedClass: string[] = [];
            let s: string;
            if ((typeof instanceAttributes.class === "string") && (s = instanceAttributes.class.trim()).length > 0) {
                expandedClass = s.split(/\s+/);
                collapsedClass = s.split(/\s+/);
            }
            if ((typeof instanceAttributes.expandedClass === "string") && (s = instanceAttributes.expandedClass.trim()).length > 0)
                expandedClass = expandedClass.concat(s.split(/\s+/));
            if ((typeof instanceAttributes.collapsedClass === "string") && (s = instanceAttributes.collapsedClass.trim()).length > 0)
                collapsedClass = collapsedClass.concat(s.split(/\s+/));
            scope.isShown = false;
            let id: number = controller.add(instanceAttributes.itemId, (show: boolean) => {
                scope.accordionGroupToggleButtonController._isShown = show;
                scope.accordionGroupToggleButtonController._callbacks.forEach((item: IAccordionGroupToggleButtonCallbackItem) => item.cb(show));
                scope.isShown = show;
                if (show) {
                    collapsedClass.forEach((n: string) => {
                        if (element.hasClass(n))
                            element.removeClass(n);
                    });
                    expandedClass.forEach((n: string) => {
                        if (!element.hasClass(n))
                            element.addClass(n);
                    });
                    if (typeof scope.onAccordionItemExpanded === "function")
                        scope.onAccordionItemExpanded();
                } else {
                    expandedClass.forEach((n: string) => {
                        if (element.hasClass(n))
                            element.removeClass(n);
                    });
                    collapsedClass.forEach((n: string) => {
                        if (!element.hasClass(n))
                            element.addClass(n);
                    });
                    if (typeof scope.onAccordionItemCollapsed === "function")
                        scope.onAccordionItemCollapsed();
                }
            });
            element.on("click", () => controller.toggle(instanceAttributes.itemId));
            element.on("$destory", () => controller.remove(id));
        }

        static getDirective(): ng.IDirective {
            return {
                restrict: "E",
                transclude: true,
                controllerAs: "accordionGroupToggleButtonController",
                controller: ["$scope", AccordionGroupToggleButtonController],
                require: "^^" + DIRECTIVENAME_accordionGroupContainer,
                scope: { itemId: "@", onAccordionItemExpanded: "&?", onAccordionItemCollapsed: "&?" },
                link: <ng.IDirectiveLinkFn>AccordionGroupToggleButtonController.directiveLink,
                template: '<button onclick="return false;" ng-transclude></button>'
            };
        }

        $doCheck() { }
    }

    app.mainModule.directive(DIRECTIVENAME_accordionGroupToggleButton, () => AccordionGroupToggleButtonController.getDirective());

    // #endregion

    // #region <accordion-group-button-text expanded-text="" collapsed-text="" expanded-class="" collapsed-class="" />

    export const DIRECTIVENAME_accordionGroupButtonText: string = PREFIX_accordionGroup + "ButtonText";

    /**
     *
     *
     * @export
     * @interface IAccordionGroupButtonTextAttributes
     * @extends {ng.IAttributes}
     */
    export interface IAccordionGroupButtonTextAttributes extends ng.IAttributes {
        /**
         *
         *
         * @type {string}
         * @memberof IAccordionGroupButtonTextAttributes
         */
        expandedText?: string;
        
        /**
         *
         *
         * @type {string}
         * @memberof IAccordionGroupButtonTextAttributes
         */
        collapsedText?: string;

        /**
         *
         *
         * @type {string}
         * @memberof IAccordionGroupButtonTextAttributes
         */
        class?: string;
        
        /**
         *
         *
         * @type {string}
         * @memberof IAccordionGroupButtonTextAttributes
         */
        expandedClass?: string;
        
        /**
         *
         *
         * @type {string}
         * @memberof IAccordionGroupButtonTextAttributes
         */
        collapsedClass?: string;
    }

    function AccordionGroupButtonTextLink(scope: ng.IScope, element: JQuery, instanceAttributes: IAccordionGroupButtonTextAttributes,
            controller: AccordionGroupToggleButtonController): void {
        let expandedClass: string[] = [];
        let collapsedClass: string[] = [];
        let s: string;
        if ((typeof instanceAttributes.class === "string") && (s = instanceAttributes.class.trim()).length > 0) {
            expandedClass = s.split(/\s+/);
            collapsedClass = s.split(/\s+/);
        }
        if ((typeof instanceAttributes.expandedClass === "string") && (s = instanceAttributes.expandedClass.trim()).length > 0)
            expandedClass = expandedClass.concat(s.split(/\s+/));
        if ((typeof instanceAttributes.collapsedClass === "string") && (s = instanceAttributes.collapsedClass.trim()).length > 0)
            collapsedClass = collapsedClass.concat(s.split(/\s+/));
        let id: number = controller.addOnShowHide((newValue: boolean) => {
            if (newValue) {
                element.text((typeof instanceAttributes.expandedText === "string") ? instanceAttributes.expandedText : "");
                collapsedClass.forEach((n: string) => {
                    if (element.hasClass(n))
                        element.removeClass(n);
                });
                expandedClass.forEach((n: string) => {
                    if (!element.hasClass(n))
                        element.addClass(n);
                });
            } else {
                element.text((typeof instanceAttributes.collapsedText === "string") ? instanceAttributes.collapsedText : "");
                expandedClass.forEach((n: string) => {
                    if (element.hasClass(n))
                        element.removeClass(n);
                });
                collapsedClass.forEach((n: string) => {
                    if (!element.hasClass(n))
                        element.addClass(n);
                });
            }
        });
        element.on("$destory", () => controller.removeOnShowHide(id));
    }

    app.mainModule.directive(DIRECTIVENAME_accordionGroupButtonText, () => <ng.IDirective>{
        require: "^^" + DIRECTIVENAME_accordionGroupToggleButton,
        restrict: "E",
        link: AccordionGroupButtonTextLink,
        template: '<span></span>'
    });

    // #endregion

    // #region <accordion-group:when-button-expanded></accordion-group:when-button-expanded>

    export const DIRECTIVENAME_accordionGroupWhenButtonExpanded: string = PREFIX_accordionGroup + "WhenButtonExpanded";

    app.mainModule.directive(DIRECTIVENAME_accordionGroupWhenButtonExpanded, () => <ng.IDirective>{
        require: "^^" + DIRECTIVENAME_accordionGroupToggleButton,
        restrict: "E",
        transclude: true,
        template: '<ng-transclude></ng-transclude>',
        link: (scope: ng.IScope, element: JQuery, instanceAttributes: ng.IAttributes, controller: AccordionGroupToggleButtonController) => {
        let id: number = controller.addOnShowHide((newValue: boolean) => {
            if (newValue)
                element.show();
            else
                element.hide();
        });
        element.on("$destory", () => controller.removeOnShowHide(id));
    }
    });

    // #endregion

    // #region <accordion-group:when-button-collapsed></accordion-group:when-button-collapsed>

    export const DIRECTIVENAME_accordionGroupWhenButtonCollapsed: string = PREFIX_accordionGroup + "WhenButtonCollapsed";

    app.mainModule.directive(DIRECTIVENAME_accordionGroupWhenButtonCollapsed, () => <ng.IDirective>{
        require: "^^" + DIRECTIVENAME_accordionGroupToggleButton,
        restrict: "E",
        transclude: true,
        template: '<ng-transclude></ng-transclude>',
        link: (scope: ng.IScope, element: JQuery, instanceAttributes: ng.IAttributes, controller: AccordionGroupToggleButtonController) => {
            let id: number = controller.addOnShowHide((newValue: boolean) => {
                if (newValue)
                    element.hide();
                else
                    element.show();
            });
            element.on("$destory", () => controller.removeOnShowHide(id));
        }
    });

    // #endregion

    // #region <accordion-group:button-image expanded-src="" collapsed-src="" expanded-alt="" collapsed-alt="" expanded-class="" collapsed-class=""></accordion-group:button-image>

    export const DIRECTIVENAME_accordionGroupButtonImage: string = PREFIX_accordionGroup + "ButtonImage";

    /**
     *
     *
     * @interface IAccordionGroupButtonImageAttributes
     * @extends {ng.IAttributes}
     */
    interface IAccordionGroupButtonImageAttributes extends ng.IAttributes {
        /**
         *
         *
         * @type {string}
         * @memberof IAccordionGroupButtonImageAttributes
         */
        expandedSrc?: string;
        
        /**
         *
         *
         * @type {string}
         * @memberof IAccordionGroupButtonImageAttributes
         */
        collapsedSrc?: string;
        
        /**
         *
         *
         * @type {string}
         * @memberof IAccordionGroupButtonImageAttributes
         */
        expandedAlt?: string;
        
        /**
         *
         *
         * @type {string}
         * @memberof IAccordionGroupButtonImageAttributes
         */
        collapsedAlt?: string;
        
        /**
         *
         *
         * @type {string}
         * @memberof IAccordionGroupButtonImageAttributes
         */
        class?: string;
        
        /**
         *
         *
         * @type {string}
         * @memberof IAccordionGroupButtonImageAttributes
         */
        expandedClass?: string;

        /**
         *
         *
         * @type {string}
         * @memberof IAccordionGroupButtonImageAttributes
         */
        collapsedClass?: string;
    }

    function AccordionGroupButtonImageLink(scope: ng.IScope, element: JQuery, instanceAttributes: IAccordionGroupButtonImageAttributes, controller: AccordionGroupToggleButtonController): void {
        let expandedClass: string[] = [];
        let collapsedClass: string[] = [];
        let s: string;
        if ((typeof instanceAttributes.class === "string") && (s = instanceAttributes.class.trim()).length > 0) {
            expandedClass = s.split(/\s+/);
            collapsedClass = s.split(/\s+/);
        }
        if ((typeof instanceAttributes.expandedClass === "string") && (s = instanceAttributes.expandedClass.trim()).length > 0)
            expandedClass = expandedClass.concat(s.split(/\s+/));
        if ((typeof instanceAttributes.collapsedClass === "string") && (s = instanceAttributes.collapsedClass.trim()).length > 0)
            collapsedClass = collapsedClass.concat(s.split(/\s+/));

        function onShownCanged(newValue: boolean) {
        }
        let id: number = controller.addOnShowHide((newValue: boolean) => {
            if (newValue) {
                if (typeof (instanceAttributes.expandedSrc) === "string")
                    element.attr("src", instanceAttributes.expandedSrc);
                else
                    element.removeAttr("src");
                if (typeof (instanceAttributes.expandedAlt) === "string")
                    element.attr("alt", instanceAttributes.expandedAlt);
                else
                    element.removeAttr("alt");
                collapsedClass.forEach((n: string) => {
                    if (element.hasClass(n))
                        element.removeClass(n);
                });
                expandedClass.forEach((n: string) => {
                    if (!element.hasClass(n))
                        element.addClass(n);
                });
            } else {
                if (typeof (instanceAttributes.collapsedSrc) === "string")
                    element.attr("src", instanceAttributes.collapsedSrc);
                else
                    element.removeAttr("src");
                if (typeof (instanceAttributes.collapsedAlt) === "string")
                    element.attr("alt", instanceAttributes.collapsedAlt);
                else
                    element.removeAttr("alt");
                expandedClass.forEach((n: string) => {
                    if (element.hasClass(n))
                        element.removeClass(n);
                });
                collapsedClass.forEach((n: string) => {
                    if (!element.hasClass(n))
                        element.addClass(n);
                });
            }
        });
        element.on("$destory", () => controller.removeOnShowHide(id));
    }

    app.mainModule.directive(DIRECTIVENAME_accordionGroupButtonImage, () => <ng.IDirective>{
        require: "^^" + DIRECTIVENAME_accordionGroupToggleButton,
        restrict: "E",
        link: AccordionGroupButtonImageLink,
        template: '<img />'
    });

    // #endregion
}
