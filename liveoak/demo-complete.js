function ChatCtrl($scope) {
    var liveoak = new LiveOak({
        clientId: 'chat-client'
    });

    liveoak.auth.init('login-required');

    $scope.load = function() {
        liveoak.readMembers('/chat/storage/chat', {
            sort: '-time',
            success: function(data) {
                $scope.$apply(function () {
                    $scope.messages = data;
                })
            }
        })
    };

    $scope.create = function() {
        liveoak.create('/chat/storage/chat', {
            message: $scope.message,
            time: new Date().getTime()
        }, {
            success: function() {
                delete $scope.message;
                $scope.load();
            }
        })
    };

    liveoak.connect(function() {
        liveoak.subscribe('/chat/storage/chat/*',
            function() {
                $scope.load();
            }
        )
    });

    $scope.load();
}