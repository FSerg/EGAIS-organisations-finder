(function() {

'use strict';

angular
    .module('app', ['ngResource'])

    .controller('MainCtrl', ['$scope', '$http', function($scope, $http) {

        $scope.organisations = [];
        $scope.innOrg = '';
        $scope.errorMessage = '';

        $scope.findOrg = function() {
            console.log('ИНН для поиска: '+$scope.innOrg);
            $scope.errorMessage = ''; // каждый раз перед запросом сбрасываем сообщение об ошибке
            $scope.organisations = []; // и очищаем результаты поиска
            $http({
                method: 'GET',
                url: '/org/'+$scope.innOrg
            }).then(function successCallback(response) {
                // если запрос выполнился успешно - проверим есть ли результат
                if (response.data.length > 0) {
                    $scope.organisations = response.data;
                }
                else {
                    console.log("пусто!");
                    $scope.errorMessage = "Организация с ИНН "+$scope.innOrg+" не найдена!";
                }

                // очищаем строку поиска
                $scope.innOrg = '';

            }, function errorCallback(response) {
                // выводим сообщение об ошибке, если не получилось выполнить запрос
                $scope.errorMessage = response;
            });

        };

    }]);

})();
