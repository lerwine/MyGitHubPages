/// <reference path="Scripts/typings/jquery/jquery.d.ts"/>
/// <reference path="Scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="app.ts"/>

namespace accordionGroup {
    interface IShowHideCallback { (show: boolean, state?: any): void; };

    // #region <accordion-group></accordion-group>

    interface IAccordionGroupItemState {
        id: number;
        callback: IShowHideCallback;
        name: string;
        state?: any;
    }

    class AccordionGroupController {
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
                showHideCallback(true);
            } else
                showHideCallback(this._current === name);
            return id;
        }

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

        show(name: string): void {
            if (typeof name !== "string")
                name = "";
            if (name === this._current)
                return;
            let toHide: IAccordionGroupItemState[] = (this._state.length == 0 || (typeof this._current !== "string")) ? [] : this.find(this._current);
            let toShow: IAccordionGroupItemState[] = this.find(name);
            if (toShow.length == 0)
                return;
            toHide.forEach((item: IAccordionGroupItemState) => item.callback(false));
            this._current = name;
            toShow.forEach((item: IAccordionGroupItemState) => item.callback(true));
        }

        hide(name: string): void {
            if (typeof name !== "string")
                name = "";
            if (name !== this._current || this._state.length == 0)
                return;
            this._current = undefined;
            this.find(name).forEach((toHide: IAccordionGroupItemState) => toHide.callback(false));
        }

        toggle(name: string): void {
            if (typeof name !== "string")
                name = "";
            if (name === this._current)
                this.hide(name);
            else
                this.show(name);
        }
    }

    app.mainModule.directive("accordionGroup", () => <ng.IDirective>{
        restrict: "E",
        controller: ["$scope", AccordionGroupController]
    });

    // #endregion

    // #region accordion-group-toggle-on-click

    interface IAccordionGroupToggleOnClickAttributes extends ng.IAttributes { accordionGroupToggleOnClick: string; }

    function AccordionGroupToggleOnClickLink(scope: ng.IScope, element: JQuery, instanceAttributes: IAccordionGroupToggleOnClickAttributes, controller: AccordionGroupController): void {
        element.on("click", () => controller.toggle(instanceAttributes.accordionGroupToggleOnClick));
    }

    app.mainModule.directive("accordionGroupToggleOnClick", () => <ng.IDirective>{
        require: "^^accordionGroup",
        restrict: "A",
        transclude: true,
        template: '<ng-transclude></ng-transclude>',
        link: AccordionGroupToggleOnClickLink
    });

    // #endregion

    // #region accordion-group-content-item

    interface IAccordionGroupContentItemAttributes extends ng.IAttributes { accordionGroupContentItem: string; }

    function AccordionGroupContentItemLink(scope: ng.IScope, element: JQuery, instanceAttributes: IAccordionGroupContentItemAttributes, controller: AccordionGroupController): void {
        let id: number = controller.add(instanceAttributes.accordionGroupContentItem, (show: boolean) => {
            if (show)
                element.show();
            else
                element.hide();
        });
        element.on("$destory", () => controller.remove(id));
    }

    app.mainModule.directive("accordionGroupContentItem", () => <ng.IDirective>{
        require: "^^accordionGroup",
        restrict: "A",
        transclude: true,
        template: '<ng-transclude></ng-transclude>',
        link: AccordionGroupContentItemLink
    });

    // #endregion

    // #region <accordion-group-toggle-button item-id="" expanded-class="" collapsed-class=""></accordion-group-toggle-button>

    interface IAccordionGroupToggleButtonAttributes extends ng.IAttributes {
        class?: string;
        itemId: string;
        expandedClass?: string;
        collapsedClass?: string;
    }

    interface IAccordionGroupToggleButtonScope extends ng.IScope {
        class?: string;
        itemId: string;
        isShown: boolean;
    }

    function AccordionGroupToggleButtonLink(scope: IAccordionGroupToggleButtonScope, element: JQuery, instanceAttributes: IAccordionGroupToggleButtonAttributes, controller: AccordionGroupController): void {
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
        let id: number = controller.add(instanceAttributes.accordionGroupContentItem, (show: boolean) => {
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
            } else {
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
        element.on("$destory", () => controller.remove(id));
    }

    app.mainModule.directive("accordionGroupToggleButton", () => <ng.IDirective>{
        restrict: "E",
        transclude: true,
        require: "^^accordionGroup",
        scope: { itemId: "@" },
        link: AccordionGroupToggleButtonLink,
        template: '<button onclick="return false;" ng-transclude></button>'
    });

    // #endregion

    // #region <accordion-group-button-text expanded-text="" collapsed-text="" expanded-class="" collapsed-class="" />

    interface IAccordionGroupButtonTextAttributes extends ng.IAttributes { expandedText?: string; collapsedText?: string, class?: string, expandedClass?: string; collapsedClass?: string }

    function AccordionGroupButtonTextLink(scope: IAccordionGroupToggleButtonScope, element: JQuery, instanceAttributes: IAccordionGroupButtonTextAttributes, controller: AccordionGroupController): void {
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
        }
        onShownCanged(scope.isShown);
        scope.$watch("isShown", onShownCanged);
    }

    app.mainModule.directive("accordionGroupButtonText", () => <ng.IDirective>{
        require: "^^accordionGroupToggleButton",
        restrict: "E",
        link: AccordionGroupButtonTextLink,
        template: '<span></span>'
    });

    // #endregion

    // #region <accordion-group-button-expanded></accordion-group-button-expanded>

    function AccordionGroupButtonExpandedLink(scope: IAccordionGroupToggleButtonScope, element: JQuery, instanceAttributes: ng.IAttributes, controller: AccordionGroupController): void {
        function onShownCanged(newValue: boolean) {
            if (newValue)
                element.show();
            else
                element.hide();
        }
        onShownCanged(scope.isShown);
        scope.$watch("isShown", onShownCanged);
    }

    app.mainModule.directive("accordionGroupButtonExpanded", () => <ng.IDirective>{
        require: "^^accordionGroupToggleButton",
        restrict: "E",
        transclude: true,
        template: '<ng-transclude></ng-transclude>',
        link: AccordionGroupButtonExpandedLink
    });

    // #endregion

    // #region <accordion-group-button-collapsed></accordion-group-button-collapsed>

    function AccordionGroupButtonCollapsedLink(scope: IAccordionGroupToggleButtonScope, element: JQuery, instanceAttributes: ng.IAttributes, controller: AccordionGroupController): void {
        function onShownCanged(newValue: boolean) {
            if (newValue)
                element.hide();
            else
                element.show();
        }
        onShownCanged(scope.isShown);
        scope.$watch("isShown", onShownCanged);
    }

    app.mainModule.directive("accordionGroupButtonCollapsed", () => <ng.IDirective>{
        require: "^^accordionGroupToggleButton",
        restrict: "E",
        transclude: true,
        template: '<ng-transclude></ng-transclude>',
        link: AccordionGroupButtonCollapsedLink
    });

    // #endregion

    // #region <accordion-group-button-image expanded-src="" collapsed-src="" expanded-alt="" collapsed-alt="" expanded-class="" collapsed-class=""></accordion-group-button-image>

    interface IAccordionGroupButtonImageAttributes extends ng.IAttributes { expandedSrc?: string; collapsedSrc?: string, expandedAlt?: string, collapsedAlt?: string, class?: string, expandedClass?: string; collapsedClass?: string }

    function AccordionGroupButtonImageLink(scope: IAccordionGroupToggleButtonScope, element: JQuery, instanceAttributes: IAccordionGroupButtonImageAttributes, controller: AccordionGroupController): void {
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
        }
        onShownCanged(scope.isShown);
        scope.$watch("isShown", onShownCanged);
    }

    app.mainModule.directive("accordionGroupButtonImage", () => <ng.IDirective>{
        require: "^^accordionGroupToggleButton",
        restrict: "E",
        link: AccordionGroupButtonImageLink,
        template: '<img />'
    });

    // #endregion
}
