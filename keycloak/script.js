var demo = angular.module('demo', []);

demo.controller('DemoCtrl', function ($scope) {
    localStorage.keycloakConfig = angular.toJson($scope.keycloakConfig);

    $scope.showConfig = false;

    $scope.init = function () {
        if (!$scope.keycloakConfig) {
            $scope.configError = 'Not configured';
            return;
        }

        if (!$scope.keycloakConfig.url) {
            $scope.configError = 'URL missing';
            $scope.showConfig = true;
            return;
        }

        if (!$scope.keycloakConfig.realm) {
            $scope.configError = 'Realm missing';
            return;
        }

        if (!$scope.keycloakConfig.clientId) {
            $scope.configError = 'Client Id missing';
            return;
        }

        if (!$scope.keycloakConfig.clientSecret) {
            $scope.configError = 'Client Secret missing';
            return;
        }

        delete $scope.configError;

        $scope.keycloak = new Keycloak($scope.keycloakConfig);
        $scope.keycloak.init(function() {
            $scope.keycloak.loadUserProfile(function() {
                $scope.$apply(function() {
                });
            });
        }, function() {
            $scope.$apply(function() {
                $scope.configError = 'Auth failed';
            });
        });
    }

    $scope.save = function () {
        localStorage.keycloakConfig = angular.toJson($scope.keycloakConfig);
        $scope.init();
    }

    $scope.init();

    $scope.login = function () {
        $scope.keycloak.login();
    }

    $scope.logout = function() {
        $scope.keycloak.logout();
    }

    $scope.reset = function () {
        delete sessionStorage.keycloakConfig;
        delete sessionStorage.oauthToken;
        delete oauth;

        $scope.keycloakConfig = null;
        $scope.keycloak = null;
    }

});
