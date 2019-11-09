/// <reference path="../Scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="../Scripts/typings/angularjs/angular-route.d.ts"/>
/// <reference path="../Scripts/typings/bootstrap/index.d.ts"/>
/// <reference path="../app.ts"/>

/**
 * The JavaScript module corresponding to the MyGitHubPages.home angular js module.
 * @module regexTester
 */
module home {
    export interface IHomePageControllerScope extends ng.IScope {

    }

    export class HomePageController implements ng.IController {
        readonly [Symbol.toStringTag]: string = app.ControllerNames.homePage;
        controller($scope: IHomePageControllerScope, pageTitleService: app.PageTitleService) {
            pageTitleService.pageTitle('');
            pageTitleService.pageSubTitle('');
        }
        $doCheck(): void { }
    }

    app.mainModule.controller(app.ControllerNames.homePage, ['$scope', app.ServiceNames.pageTitle, HomePageController]);
}
