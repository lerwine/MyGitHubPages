var home;
(function (home) {
    class HomePageController {
        constructor() {
            this[Symbol.toStringTag] = app.ControllerNames.homePage;
        }
        controller($scope, pageTitleService) {
            pageTitleService.pageTitle("");
            pageTitleService.pageSubTitle("");
        }
        $doCheck() { }
    }
    home.HomePageController = HomePageController;
    app.mainModule.controller(app.ControllerNames.homePage, ['$scope', app.ServiceNames.pageTitle, HomePageController]);
})(home || (home = {}));
//# sourceMappingURL=home.js.map