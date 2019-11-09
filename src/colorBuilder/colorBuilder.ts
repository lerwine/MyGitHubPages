/// <reference path="../Scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="../Scripts/typings/angularjs/angular-route.d.ts"/>
/// <reference path="../Scripts/typings/bootstrap/index.d.ts"/>
/// <reference path="../app.ts"/>

/**
 * The JavaScript module corresponding to the MyGitHubPages.colorBuilder angular js module.
 * @module colorBuilder
 */
module colorBuilder {
    export interface IColorBuilderPageControllerScope extends ng.IScope {

    }

    export class ColorBuilderPageController implements ng.IController {
        readonly [Symbol.toStringTag]: string = app.ControllerNames.colorBuilder;
        controller($scope: IColorBuilderPageControllerScope) {
        }
        $doCheck(): void { }
    }

    app.mainModule.controller(app.ControllerNames.colorBuilder, ['$scope', ColorBuilderPageController]);
}
