function ChatCtrl($scope) {
    var liveoak = new LiveOak({ clientId: 'chat-html' });

    liveoak.auth.init('login-required').success(function() {
        $scope.load();

        liveoak.connect(function() {
            liveoak.subscribe('/chat/storage/chat/*',
                function() {
                    $scope.load();
                }
            )
        });
    })

    $scope.load = function() {
        liveoak.readMembers('/chat/storage/chat', {
            sort: '-time',
            success: function(data) {
                $scope.$apply(function () {
                    $scope.messages = data;
                })
            },
            error: function(data) {
                alert('failed to load messages: ' + data.status + ' ' + data.statusText);
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

}
