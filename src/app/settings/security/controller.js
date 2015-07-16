angular.module('App.Settings.Security').controller('App.Settings.Security.Controller', [
  '$scope',
  'Notification',
  'Users',
  function(
    $scope,
    Notification,
    Users
  ) {

    $scope.userInfo = {}

    //更改用户密码
    $scope.updateUserInfo = function(userInfo) {
      var msg = ""
      
      if (userInfo.old_password == '' || userInfo.old_password == undefined) {
        msg = "LANG_USER_ENTER_OLD_PASSWORD"
      } else if (userInfo.new_password == undefined || userInfo.new_password == '') {
        msg = "LANG_USER_ENTER_NEW_PASSWORD"
      } else if (userInfo.confim_password == undefined || userInfo.confim_password == '') {
        msg = "LANG_USER_ENTER_OLD_PASSWORD_CONFIRM"
      } else if (userInfo.new_password != userInfo.confim_password) {
        msg = "LANG_USER_NEW_PASSWORD_MISMATCH"
      } else if (userInfo.new_password.length < 6 || userInfo.new_password.length > 16) {
        msg = "LANG_USER_PASSWORD_LENGTH_LIMIT"
      }
      if (msg != "") {
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: msg,
          closeable: false
        })
        return
      }

      Users.updateUserInfo({

      }, {
        new_password: userInfo.new_password,
        old_password: userInfo.old_password
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