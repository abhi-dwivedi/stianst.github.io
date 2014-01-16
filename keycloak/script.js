var demo = angular.module('demo', []);


demo.controller('DemoCtrl', function ($scope, $location) {
    $scope.keycloakServer = sessionStorage.keycloakServer || 'http://localhost:8080';
    $scope.keycloakConfigJson = sessionStorage.keycloakConfig;
    $scope.keycloakConfigStatus = 'Not configured';

    if (window.oauth.token) {
        $scope.token = angular.fromJson(window.oauth.token);
    }

    $scope.$watch('keycloakConfigJson', function (config) {
        try {
            var c = angular.fromJson(config);
            if (!c.realm || !c.resource) {
                $scope.keycloakConfig = null;
                $scope.keycloakConfigStatus = 'Invalid config';
            } else if (c.credentials.password == 'INSERT APPLICATION PASSWORD' || c.credentials.password == 'INSERT CLIENT PASSWORD') {
                $scope.keycloakConfig = null;
                $scope.keycloakConfigStatus = 'Password not set';
            } else {
                sessionStorage.keycloakConfig = config;
                $scope.keycloakConfig = c;
                $scope.keycloakConfigStatus = 'Configured';
            }
        } catch (err) {
            delete sessionStorage.keycloakConfig;
            $scope.keycloakConfigStatus = 'Not configured';
        }
    });

    $scope.$watch('keycloakServer', function (server) {
        sessionStorage.keycloakServer = server;
    });

    $scope.$on('$locationChangeSuccess', function (event, newUrl) {
        $scope.slide = parseFloat(location.hash.substring(2).replace('/', '.'));
    });

    $scope.login = function (slide) {
        if (!slide) {
            slide = $scope.slide;
        }

        var redirect = location.href.split('?')[0].split('#')[0];
        var state = '#' + btoa('hash=#/' + slide);

        sessionStorage.oauthState = state;

        var url = $scope.keycloakConfig['auth-server-url'] + '/rest/realms/' +  encodeURIComponent($scope.keycloakConfig['realm'])  + '/tokens/login';
        url += '?client_id=' + $scope.keycloakConfig['resource'];
        url += '&redirect_uri=' + encodeURIComponent(redirect);
        url += '&state=' + encodeURIComponent(state);

        document.location = url;
    }

    $scope.reset = function () {
        delete sessionStorage.keycloakConfig;
        delete oauth;
    }

    $scope.logout = function () {
        var url = $scope.keycloakConfig['auth-server-url'] + '/rest/realms/' +  encodeURIComponent($scope.keycloakConfig['realm'])  + '/tokens/logout';
        url += '?redirect_uri=' + encodeURIComponent(location.href);
        document.location = url;
        sessionStorage.logoutFragment = '/' + $scope.slide;
    }
});