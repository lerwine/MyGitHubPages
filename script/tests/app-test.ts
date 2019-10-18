/// <reference path="../../src/Scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="../../src/Scripts/typings/angularjs/angular-mocks.d.ts"/>
/// <reference path="../../src/app.ts"/>

describe('MyGitHubPages', () => {
    console.log("describing");
    //var controllerSvc: ng.IControllerService;
    //var rootScope: ng.IRootScopeService;
    //beforeEach(inject(function (_$controller_, _$rootScope_) {
    //    // The injector unwraps the underscores (_) from around the parameter names when matching
    //    controllerSvc = _$controller_;
    //    rootScope = _$rootScope_;
    //}));
    it('mainContentController', () => {
        //let $scope: app.IMainContentControllerScope = <app.IMainContentControllerScope>rootScope.$new();
        //var mainContentController: app.MainContentController = <app.MainContentController>controllerSvc('mainContentController', { $scope: $scope });
        //expect(mainContentController).toBeDefined();
        var v = 'MyGitHubPages';
        expect(v).toEqual('MyGitHubPages');
        expect(app).toBeDefined();
    });
});
