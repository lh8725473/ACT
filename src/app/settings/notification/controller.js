angular.module('App.Settings.Notification').controller('App.Settings.Notification.Controller', [
  '$scope',
  'Users',
  'Notification',
  function(
    $scope,
    Users,
    Notification 
  ) {

    $scope.userInfo = Users.getUserInfo()

    //更改用户信息
    $scope.updateUserInfo = function(userInfo) {
      Users.updateUserInfo({

      }, {
        config:{
          email_attention:{
            user_owner: {
              upload: userInfo.config.email_attention.user_owner.upload,
              download: userInfo.config.email_attention.user_owner.download,
              comment: userInfo.config.email_attention.user_owner.comment,
              delete: userInfo.config.email_attention.user_owner.delete
            },
            user_partner:{
              upload: userInfo.config.email_attention.user_partner.upload,
              download: userInfo.config.email_attention.user_partner.download,
              comment: userInfo.config.email_attention.user_partner.comment,
              delete: userInfo.config.email_attention.user_partner.delete
            }
          }
        }
      }).$promise.then(function() {
        Notification.show({
          title: '成功',
          type: 'success',
          msg: 'LANG_USER_SAVE_SUCCESS',
          closeable: false
        })
      }, function(error) {
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: error.data.result,
          closeable: false
        })
      })
    }

  }
])