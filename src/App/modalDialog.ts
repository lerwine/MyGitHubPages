/// <reference path="../Scripts/typings/jquery/jquery.d.ts"/>
/// <reference path="../Scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="../Scripts/typings/angularjs/angular-route.d.ts"/>
/// <reference path="../Scripts/typings/bootstrap/index.d.ts"/>
/// <reference path="sys.ts"/>
/// <reference path="app.ts"/>

module modalDialog {
    const DIRECTIVENAME_modalDialog: string = "modalDialog";

    interface IModalDialogScope extends ng.IScope {

    }

    export class ModalDialogController implements ng.IController {

        static getDirective(): { modalDialog: ng.Injectable<ng.IDirectiveFactory> } {
            return {
                modalDialog: () => <ng.IDirective>{
                    controller: ["$scope", "$log", ModalDialogController],
                    controllerAs: DIRECTIVENAME_modalDialog,
                    link: (scope: IModalDialogScope, element: JQuery, attr: ng.IAttributes) => {
                    },
                    restrict: "E",
                    scope: { error: "=" },
                    templateUrl: "Templates\modalDialog.htm"
                }
            }
        }
    }

    app.mainModule.directive(ModalDialogController.getDirective());
}
