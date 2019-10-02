/// <reference path="../Scripts/typings/jquery/jquery.d.ts"/>
/// <reference path="../Scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="../Scripts/typings/angularjs/angular-route.d.ts"/>
/// <reference path="../Scripts/typings/bootstrap/index.d.ts"/>
/// <reference path="sys.ts"/>
/// <reference path="app.ts"/>
var modalDialog;
(function (modalDialog) {
    const DIRECTIVENAME_modalDialog = "modalDialog";
    class ModalDialogController {
        static getDirective() {
            return {
                modalDialog: () => ({
                    controller: ["$scope", "$log", ModalDialogController],
                    controllerAs: DIRECTIVENAME_modalDialog,
                    link: (scope, element, attr) => {
                    },
                    restrict: "E",
                    scope: { error: "=" },
                    templateUrl: "Templates\modalDialog.htm"
                })
            };
        }
    }
    modalDialog.ModalDialogController = ModalDialogController;
    app.mainModule.directive(ModalDialogController.getDirective());
})(modalDialog || (modalDialog = {}));
//# sourceMappingURL=modalDialog.js.map