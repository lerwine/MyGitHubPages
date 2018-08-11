"use strict";
angular.module("main", ['ngRoute'])
    .controller("pageProperties", ['$scope', '$http', '$route', function ($scope, $http, $route) {
        $http.get("menuSchema.json").then(function (value) {
        });
