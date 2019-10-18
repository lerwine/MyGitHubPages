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
        it('Injectable', inject(function ($rootScope: ng.IRootScopeService, pageTitleService: app.PageTitleService) {
            expect(pageTitleService).toBeDefined();
            expect(pageTitleService).not.toBeNull();
            expect(pageTitleService.pageTitle()).toEqual(defaultPageTitle);
            expect(pageTitleService.pageSubTitle()).toEqual(defultSubTitle);
            expect(pageTitleService.regexHref()).toEqual(defaultRegexHref);
            expect(pageTitleService[Symbol.toStringTag]).toEqual('pageTitleService');
        }));
        describe('Members', function () {
            let pageTitleService: app.PageTitleService;
            let scope: app.IMainContentControllerScope;
            beforeEach(inject(function ($rootScope: ng.IRootScopeService, _pageTitleService_: app.PageTitleService) {
                pageTitleService = _pageTitleService_;
                scope = <app.IMainContentControllerScope>$rootScope.$new();
            }));
            it('setScope', function () {
                pageTitleService.setScope(scope);
                expect(scope.pageTitle).toEqual(defaultPageTitle);
                expect(pageTitleService.pageTitle()).toEqual(defaultPageTitle);
                expect(scope.subTitle).toEqual(defultSubTitle);
                expect(pageTitleService.pageSubTitle()).toEqual(defultSubTitle);
                expect(scope.showSubtitle).toEqual(false);
                expect(scope.regexHref).toEqual(defaultRegexHref);
                expect(pageTitleService.regexHref()).toEqual(defaultRegexHref);
            });
            describe('pageTitle', function () {
                it('Modify before setScope', function () {
                    expect(scope.pageTitle).toBeUndefined();
                    let expected: string = 'New Title';
                    expect(pageTitleService.pageTitle(expected)).toEqual(expected);
                    expect(pageTitleService.pageTitle()).toEqual(expected);
                    pageTitleService.setScope(scope);
                    expect(scope.pageTitle).toEqual(expected);
                    expect(pageTitleService.pageTitle()).toEqual(expected);
                    expect(scope.subTitle).toEqual(defultSubTitle);
                    expect(pageTitleService.pageSubTitle()).toEqual(defultSubTitle);
                    expect(scope.showSubtitle).toEqual(false);
                    expect(scope.regexHref).toEqual(defaultRegexHref);
                    expect(pageTitleService.regexHref()).toEqual(defaultRegexHref);
                });
                it('Modify after setScope', function () {
                    expect(scope.pageTitle).toBeUndefined();
                    pageTitleService.setScope(scope);
                    let expected: string = 'New Title';
                    expect(pageTitleService.pageTitle(expected)).toEqual(expected);
                    expect(pageTitleService.pageTitle()).toEqual(expected);
                    expect(scope.pageTitle).toEqual(expected);
                    expect(scope.subTitle).toEqual(defultSubTitle);
                    expect(pageTitleService.pageSubTitle()).toEqual(defultSubTitle);
                    expect(scope.showSubtitle).toEqual(false);
                    expect(scope.regexHref).toEqual(defaultRegexHref);
                    expect(pageTitleService.regexHref()).toEqual(defaultRegexHref);
                });
            });
            describe('pageSubTitle', function () {
                it('Modify before setScope', function () {
                    expect(scope.subTitle).toBeUndefined();
                    let expected: string = 'New Sub-Title';
                    expect(pageTitleService.pageSubTitle(expected)).toEqual(expected);
                    expect(pageTitleService.pageSubTitle()).toEqual(expected);
                    pageTitleService.setScope(scope);
                    expect(scope.subTitle).toEqual(expected);
                    expect(scope.showSubtitle).toEqual(true);
                    expect(pageTitleService.pageSubTitle()).toEqual(expected);
                    expect(scope.pageTitle).toEqual(defaultPageTitle);
                    expect(pageTitleService.pageTitle()).toEqual(defaultPageTitle);
                    expect(scope.regexHref).toEqual(defaultRegexHref);
                    expect(pageTitleService.regexHref()).toEqual(defaultRegexHref);
                });
                it('Modify after setScope', function () {
                    expect(scope.subTitle).toBeUndefined();
                    pageTitleService.setScope(scope);
                    let expected: string = 'New Sub-Title';
                    expect(pageTitleService.pageSubTitle(expected)).toEqual(expected);
                    expect(pageTitleService.pageSubTitle()).toEqual(expected);
                    expect(scope.subTitle).toEqual(expected);
                    expect(scope.showSubtitle).toEqual(true);
                    expect(scope.pageTitle).toEqual(defaultPageTitle);
                    expect(pageTitleService.pageTitle()).toEqual(defaultPageTitle);
                    expect(scope.regexHref).toEqual(defaultRegexHref);
                    expect(pageTitleService.regexHref()).toEqual(defaultRegexHref);
                    expect(pageTitleService.pageSubTitle(defultSubTitle)).toEqual(defultSubTitle);
                    expect(pageTitleService.pageSubTitle()).toEqual(defultSubTitle);
                    expect(scope.subTitle).toEqual(defultSubTitle);
                    expect(scope.showSubtitle).toEqual(false);
                });
            });
            describe('regexHref', function () {
                it('Modify before setScope', function () {
                    expect(scope.regexHref).toBeUndefined();
                    let expected: string = '#!/new/href';
                    expect(pageTitleService.regexHref(expected)).toEqual(expected);
                    expect(pageTitleService.regexHref()).toEqual(expected);
                    pageTitleService.setScope(scope);
                    expect(scope.regexHref).toEqual(expected);
                    expect(pageTitleService.regexHref()).toEqual(expected);
                    expect(scope.pageTitle).toEqual(defaultPageTitle);
                    expect(pageTitleService.pageTitle()).toEqual(defaultPageTitle);
                    expect(scope.subTitle).toEqual(defultSubTitle);
                    expect(pageTitleService.pageSubTitle()).toEqual(defultSubTitle);
                    expect(scope.showSubtitle).toEqual(false);
                });
                it('Modify after setScope', function () {
                    expect(scope.regexHref).toBeUndefined();
                    pageTitleService.setScope(scope);
                    let expected: string = '#!/new/href';
                    expect(pageTitleService.regexHref(expected)).toEqual(expected);
                    expect(pageTitleService.regexHref()).toEqual(expected);
                    expect(scope.regexHref).toEqual(expected);
                    expect(scope.pageTitle).toEqual(defaultPageTitle);
                    expect(pageTitleService.pageTitle()).toEqual(defaultPageTitle);
                    expect(scope.subTitle).toEqual(defultSubTitle);
                    expect(pageTitleService.pageSubTitle()).toEqual(defultSubTitle);
                    expect(scope.showSubtitle).toEqual(false);
                });
            });
        });
    });
    describe('MainContentController', function () {
        let pageTitleService: app.PageTitleService;
        let scope: app.IMainContentControllerScope;
        let controllerSvc: ng.IControllerService;
        beforeEach(inject(function ($rootScope: ng.IRootScopeService, $controller: ng.IControllerService, _pageTitleService_: app.PageTitleService) {
            pageTitleService = _pageTitleService_;
            scope = <app.IMainContentControllerScope>$rootScope.$new();
            controllerSvc = $controller;
        }));
        it("Constructor", function () {
            let mainContentController: app.MainContentController = <app.MainContentController>controllerSvc('mainContentController', { $scope: scope, pageTitleService: pageTitleService });
            expect(mainContentController).toBeDefined();
            expect(mainContentController).not.toBeNull();
            expect(scope.pageTitle).toEqual(defaultPageTitle);
            expect(scope.subTitle).toEqual(defultSubTitle);
            expect(scope.regexHref).toEqual(defaultRegexHref);
            expect(mainContentController[Symbol.toStringTag]).toEqual('mainContentController');
        })
    });
});
