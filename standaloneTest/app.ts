/// <reference path="../Scripts/typings/jquery/jquery.d.ts"/>
/// <reference path="../Scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="../Scripts/typings/angularjs/angular-route.d.ts"/>

/**
 * The application namespace.
 * 
 * @namespace
 */
namespace app
{
    /**
    * The main module for this app.
    *
    * @type {ng.IModule}
    */
    export let appModule: ng.IModule = angular.module('app', []);
    
    /**
     *
     *
     * @template T1
     * @template T2
     * @template T3
     * @param {({ (a1: T1, a2: T2, a3: T3): void } | undefined)} currentCallback
     * @param {{ (a1: T1, a2: T2, a3: T3): void }} newCallback
     * @returns {{ (a1: T1, a2: T2, a3: T3): void }}
     */
    function chainCallback<T1, T2, T3>(currentCallback: { (a1: T1, a2: T2, a3: T3): void } | undefined, newCallback: { (a1: T1, a2: T2, a3: T3): void }): { (a1: T1, a2: T2, a3: T3): void };
    /**
     *
     *
     * @template T1
     * @template T2
     * @param {({ (a1: T1, a2: T2): void } | undefined)} currentCallback
     * @param {{ (a1: T1, a2: T2): void }} newCallback
     * @returns {{ (a1: T1, a2: T2): void }}
     */
    function chainCallback<T1, T2>(currentCallback: { (a1: T1, a2: T2): void } | undefined, newCallback: { (a1: T1, a2: T2): void }): { (a1: T1, a2: T2): void };
    /**
     *
     *
     * @template T
     * @param {({ (a: T): void } | undefined)} currentCallback
     * @param {{ (a: T): void }} newCallback
     * @returns {{ (a: T): void }}
     */
    function chainCallback<T>(currentCallback: { (a: T): void } | undefined, newCallback: { (a: T): void }): { (a: T): void };
    /**
     *
     *
     * @param {({ (): void } | undefined)} currentCallback
     * @param {{ (): void }} newCallback
     * @returns {{ (): void }}
     */
    function chainCallback(currentCallback: { (): void } | undefined, newCallback: { (): void }): { (): void };
    function chainCallback(currentCallback: Function | undefined, newCallback: Function, thisArg?: any): Function {
        if (typeof (currentCallback) !== "function")
            return newCallback;
        return function(...args: any[]) {
            try { currentCallback.apply(thisArg, args); }
            finally { newCallback.apply(thisArg, args); }
        }
    }
    
    interface IExampleControllerScope extends ng.IScope {
        text: string;
        altText: string;
    }

    class ExampleController implements ng.IController {
        constructor(protected $scope: IExampleControllerScope) {
            $scope.text = "Here";
        }

        $onInit() { }
    }

    appModule.controller("exampleController", ["$scope", ExampleController]);

    interface IShowHideCallback { (show: boolean): void; };
    interface IAccordionGroupItemState {
        id: number;
        callback: IShowHideCallback;
        name: string;
    }

    class AccordionGroupController {
        private _state: IAccordionGroupItemState[] = [];
        private _current: string | undefined = undefined;

        constructor($scope: IExampleControllerScope) {
            $scope.altText = "There";
        }

        private find(name: string): IAccordionGroupItemState[] { return this._state.filter((value: IAccordionGroupItemState) => value.name === name); }
        private get(id: number): IAccordionGroupItemState | undefined {
            if (this._state.length > 0) {
                let result: IAccordionGroupItemState = this._state.find((value: IAccordionGroupItemState) => value.id == id);
                if (typeof result === "object" && result !== null)
                    return result;
            }
        }

        add(name: string, showHideCallback: IShowHideCallback): number {
            if (typeof name !== "string")
                name = "";
            let id: number = this._state.length;
            if (this._state.length > 0) {
                while (typeof (this.get(id)) !== "undefined")
                    id--;
            }
            this._state.push({ id: id, callback: showHideCallback, name: name });
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

    interface IAccordionGroupToggleOnClickAttributes extends ng.IAttributes { accordionGroupToggleOnClick: string; }

    appModule.directive("accordionGroup", () => <ng.IDirective>{
        restrict: "E",
        controller: ["$scope", AccordionGroupController]
    });

    function AccordionGroupToggleOnClickLink(scope: ng.IScope, element: JQuery, instanceAttributes: IAccordionGroupToggleOnClickAttributes, controller: AccordionGroupController, transclude?: ng.ITranscludeFunction): void {
        element.on("click", () => controller.toggle(instanceAttributes.accordionGroupToggleOnClick));
    }

    appModule.directive("accordionGroupToggleOnClick", () => <ng.IDirective>{
        require: "^^accordionGroup",
        restrict: "A",
        transclude: true,
        template: '<ng-transclude></ng-transclude>',
        link: AccordionGroupToggleOnClickLink
    });

    interface IAccordionGroupContentItemAttributes extends ng.IAttributes { accordionGroupContentItem: string; }

    function AccordionGroupContentItemLink(scope: ng.IScope, element: JQuery, instanceAttributes: IAccordionGroupContentItemAttributes, controller: AccordionGroupController, transclude?: ng.ITranscludeFunction): void {
        let id: number = controller.add(instanceAttributes.accordionGroupContentItem, (show: boolean) => {
            if (show)
                element.show();
            else
                element.hide();
        });
        element.on("$destory", () => controller.remove(id));
    }

    appModule.directive("accordionGroupContentItem", () => <ng.IDirective>{
        require: "^^accordionGroup",
        restrict: "A",
        transclude: true,
        template: '<ng-transclude></ng-transclude>',
        link: AccordionGroupContentItemLink
    });
}
