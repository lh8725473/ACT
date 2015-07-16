angular.module('App.Widgets').factory('Confirm', [
  '$modal',
  function(
    $modal
  ) {
    var confirmModalController = [
      '$scope',
      '$modalInstance',
      '$timeout',
      'confirm',
      function(
        $scope,
        $modalInstance,
        $timeout,
        confirm
      ) {
        $scope.confirm = confirm

        $scope.ok = function() {
          confirm.ok($modalInstance)
        }

        $scope.extraButtonClick = function() {
          confirm.extraButtonClick($modalInstance)
        }

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel')
        }

      }
    ]
    return {
      show: function(confirm) {
        var confirmModal = $modal.open({
          backdrop: 'static',
          templateUrl: 'src/app/widgets/confirm-modal/template.html',
          windowClass: 'confirm-modal-view',
          controller: confirmModalController,
          resolve: {
            confirm: function() {
              return confirm
            }
          }
        })
      }
    }
  }
])