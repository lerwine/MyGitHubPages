/// <reference path="../../Scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts"/>
/// <reference path="../../Scripts/typings/angularjs/angular-mocks.d.ts"/>
/// <reference path="../../Scripts/typings/bootstrap/index.d.ts"/>
/// <reference path="../../Scripts/typings/jasmine/jasmine.d.ts"/>
/// <reference path="../../app.ts"/>

describe('MyGitHubPages app', function () {
    let defaultPageTitle: string = 'Lenny\'s GitHub Repositories';
    let defultSubTitle: string = '';
    let defaultRegexHref: string = '#!/regex/match';
    beforeEach(function () {
        angular.mock.module('MyGitHubPages');
    });
    describe('PageTitleService', function () {
        it('Injectable', inject(function ($rootScope: ng.IRootScopeService, pageLocationService: app.PageLocationService) {
            expect(pageLocationService).toBeDefined();
            expect(pageLocationService).not.toBeNull();
            expect(pageLocationService.pageTitle()).toEqual(defaultPageTitle);
            expect(pageLocationService.pageSubTitle()).toEqual(defultSubTitle);
            expect(pageLocationService.regexHref()).toEqual(defaultRegexHref);
            expect(pageLocationService[Symbol.toStringTag]).toEqual('pageTitleService');
        }));
        describe('Members', function () {
            let pageLocationService: app.PageLocationService;
            let scope: app.IMainContentControllerScope;
            beforeEach(inject(function ($rootScope: ng.IRootScopeService, _pageLocationService: app.PageLocationService) {
                pageLocationService = _pageLocationService;
                scope = <app.IMainContentControllerScope>$rootScope.$new();
            }));
            it('setScope', function () {
                pageLocationService.setScope(scope);
                expect(scope.pageTitle).toEqual(defaultPageTitle);
                expect(pageLocationService.pageTitle()).toEqual(defaultPageTitle);
                expect(scope.subTitle).toEqual(defultSubTitle);
                expect(pageLocationService.pageSubTitle()).toEqual(defultSubTitle);
                expect(scope.showSubtitle).toEqual(false);
                expect(scope.regexHref).toEqual(defaultRegexHref);
                expect(pageLocationService.regexHref()).toEqual(defaultRegexHref);
            });
            describe('pageTitle', function () {
                it('Modify before setScope', function () {
                    expect(scope.pageTitle).toBeUndefined();
                    let expected: string = 'New Title';
                    expect(pageLocationService.pageTitle(expected)).toEqual(expected);
                    expect(pageLocationService.pageTitle()).toEqual(expected);
                    pageLocationService.setScope(scope);
                    expect(scope.pageTitle).toEqual(expected);
                    expect(pageLocationService.pageTitle()).toEqual(expected);
                    expect(scope.subTitle).toEqual(defultSubTitle);
                    expect(pageLocationService.pageSubTitle()).toEqual(defultSubTitle);
                    expect(scope.showSubtitle).toEqual(false);
                    expect(scope.regexHref).toEqual(defaultRegexHref);
                    expect(pageLocationService.regexHref()).toEqual(defaultRegexHref);
                });
                it('Modify after setScope', function () {
                    expect(scope.pageTitle).toBeUndefined();
                    pageLocationService.setScope(scope);
                    let expected: string = 'New Title';
                    expect(pageLocationService.pageTitle(expected)).toEqual(expected);
                    expect(pageLocationService.pageTitle()).toEqual(expected);
                    expect(scope.pageTitle).toEqual(expected);
                    expect(scope.subTitle).toEqual(defultSubTitle);
                    expect(pageLocationService.pageSubTitle()).toEqual(defultSubTitle);
                    expect(scope.showSubtitle).toEqual(false);
                    expect(scope.regexHref).toEqual(defaultRegexHref);
                    expect(pageLocationService.regexHref()).toEqual(defaultRegexHref);
                });
            });
            describe('pageSubTitle', function () {
                it('Modify before setScope', function () {
                    expect(scope.subTitle).toBeUndefined();
                    let expected: string = 'New Sub-Title';
                    expect(pageLocationService.pageSubTitle(expected)).toEqual(expected);
                    expect(pageLocationService.pageSubTitle()).toEqual(expected);
                    pageLocationService.setScope(scope);
                    expect(scope.subTitle).toEqual(expected);
                    expect(scope.showSubtitle).toEqual(true);
                    expect(pageLocationService.pageSubTitle()).toEqual(expected);
                    expect(scope.pageTitle).toEqual(defaultPageTitle);
                    expect(pageLocationService.pageTitle()).toEqual(defaultPageTitle);
                    expect(scope.regexHref).toEqual(defaultRegexHref);
                    expect(pageLocationService.regexHref()).toEqual(defaultRegexHref);
                });
                it('Modify after setScope', function () {
                    expect(scope.subTitle).toBeUndefined();
                    pageLocationService.setScope(scope);
                    let expected: string = 'New Sub-Title';
                    expect(pageLocationService.pageSubTitle(expected)).toEqual(expected);
                    expect(pageLocationService.pageSubTitle()).toEqual(expected);
                    expect(scope.subTitle).toEqual(expected);
                    expect(scope.showSubtitle).toEqual(true);
                    expect(scope.pageTitle).toEqual(defaultPageTitle);
                    expect(pageLocationService.pageTitle()).toEqual(defaultPageTitle);
                    expect(scope.regexHref).toEqual(defaultRegexHref);
                    expect(pageLocationService.regexHref()).toEqual(defaultRegexHref);
                    expect(pageLocationService.pageSubTitle(defultSubTitle)).toEqual(defultSubTitle);
                    expect(pageLocationService.pageSubTitle()).toEqual(defultSubTitle);
                    expect(scope.subTitle).toEqual(defultSubTitle);
                    expect(scope.showSubtitle).toEqual(false);
                });
            });
            describe('regexHref', function () {
                it('Modify before setScope', function () {
                    expect(scope.regexHref).toBeUndefined();
                    let expected: string = '#!/new/href';
                    expect(pageLocationService.regexHref(expected)).toEqual(expected);
                    expect(pageLocationService.regexHref()).toEqual(expected);
                    pageLocationService.setScope(scope);
                    expect(scope.regexHref).toEqual(expected);
                    expect(pageLocationService.regexHref()).toEqual(expected);
                    expect(scope.pageTitle).toEqual(defaultPageTitle);
                    expect(pageLocationService.pageTitle()).toEqual(defaultPageTitle);
                    expect(scope.subTitle).toEqual(defultSubTitle);
                    expect(pageLocationService.pageSubTitle()).toEqual(defultSubTitle);
                    expect(scope.showSubtitle).toEqual(false);
                });
                it('Modify after setScope', function () {
                    expect(scope.regexHref).toBeUndefined();
                    pageLocationService.setScope(scope);
                    let expected: string = '#!/new/href';
                    expect(pageLocationService.regexHref(expected)).toEqual(expected);
                    expect(pageLocationService.regexHref()).toEqual(expected);
                    expect(scope.regexHref).toEqual(expected);
                    expect(scope.pageTitle).toEqual(defaultPageTitle);
                    expect(pageLocationService.pageTitle()).toEqual(defaultPageTitle);
                    expect(scope.subTitle).toEqual(defultSubTitle);
                    expect(pageLocationService.pageSubTitle()).toEqual(defultSubTitle);
                    expect(scope.showSubtitle).toEqual(false);
                });
            });
        });
    });
    describe('MainContentController', function () {
        let pageLocationService: app.PageLocationService;
        let scope: app.IMainContentControllerScope;
        let controllerSvc: ng.IControllerService;
        beforeEach(inject(function ($rootScope: ng.IRootScopeService, $controller: ng.IControllerService, _pageLocationService: app.PageLocationService) {
            pageLocationService = _pageLocationService;
            scope = <app.IMainContentControllerScope>$rootScope.$new();
            controllerSvc = $controller;
        }));
        it("Constructor", function () {
            let mainContentController: app.MainContentController = <app.MainContentController>controllerSvc('mainContentController', { $scope: scope, pageLocationService: pageLocationService });
            expect(mainContentController).toBeDefined();
            expect(mainContentController).not.toBeNull();
            expect(scope.pageTitle).toEqual(defaultPageTitle);
            expect(scope.subTitle).toEqual(defultSubTitle);
            expect(scope.regexHref).toEqual(defaultRegexHref);
            expect(mainContentController[Symbol.toStringTag]).toEqual('mainContentController');
        })
    });
});
