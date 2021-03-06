/// <reference path="../Scripts/typings/jquery/jquery.d.ts"/>
/// <reference path="../Scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="../Scripts/typings/angularjs/angular-route.d.ts"/>
/// <reference path="../Scripts/typings/bootstrap/index.d.ts"/>
/// <reference path="app.ts"/>

module colorBuilder {
    interface IColorBuilderScope extends ng.IScope {

    }

    class ColorBuilderController implements ng.IController {
        constructor(protected $scope: IColorBuilderScope) {

        }

        $doCheck() {

        }
    }

    app.mainModule.controller("ColorBuilderController", ["$scope", ColorBuilderController]);
}
