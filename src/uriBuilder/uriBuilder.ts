/// <reference path="../Scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="../Scripts/typings/angularjs/angular-route.d.ts"/>
/// <reference path="../Scripts/typings/bootstrap/index.d.ts"/>
/// <reference path="../app.ts"/>

/**
 * The JavaScript module corresponding to the MyGitHubPages.uriBuilder angular js module.
 * @module uriBuilder
 */
module uriBuilder {
    export interface IUriBuilderPageControllerScope extends ng.IScope {

    }

    export class UriBuilderPageController implements ng.IController {
        readonly [Symbol.toStringTag]: string = app.ControllerNames.uriBuilder;
        controller($scope: IUriBuilderPageControllerScope) {
        }
        $doCheck(): void { }
    }

    app.mainModule.controller(app.ControllerNames.uriBuilder, ['$scope', UriBuilderPageController]);
}
