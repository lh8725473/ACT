angular.module('App.Header').controller('App.Header.UserInfoController', [
  '$scope',
  '$rootScope',
  '$modalInstance',
  'Users',
  'Notification',
  '$modal',
  '$upload',
  'CONFIG',
  '$cookies',
  '$cookieStore',
  function(
    $scope,
    $rootScope,
    $modalInstance,
    Users,
    Notification,
    $modal,
    $upload,
    CONFIG,
    $cookies,
    $cookieStore
  ) {
    //个人设置信息
    $scope.userInfo = Users.getUserInfo()

    $scope.userInfo.$promise.then(function() {
      //避免图片缓存
      $scope.userInfo.avatar = $scope.userInfo.avatar + '&_=' + new Date().getTime()
    })

    //修改个人信息
    $scope.updateInfo = function(userInfo) {
      var msg = ""

      if($scope.userInfo.real_name == '' || $scope.userInfo.real_name == undefined){
        msg = "LANG_USER_ENTER_REAL_NAME"
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: msg,
          closeable: false
        })
        return
      }


      if ((userInfo.new_password && userInfo.new_password != '') ||
        (userInfo.confim_password && userInfo.confim_password != '') ||
        (userInfo.old_password && userInfo.old_password != '')) {

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
      }

      Users.updateUserInfo({}, {
        real_name: $scope.userInfo.real_name,
        phone: $scope.userInfo.phone,
        new_password: $scope.userInfo.new_password,
        old_password: $scope.userInfo.old_password
      }).$promise.then(function() {
        Notification.show({
          title: '成功',
          type: 'success',
          msg: 'LANG_USER_SAVE_SUCCESS',
          closeable: false
        })
        $cookieStore.createCookie('realName', $scope.userInfo.real_name, 30)
        $modalInstance.close($scope.userInfo.real_name)
      }, function(error) {
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: error.data.result,
          closeable: false
        })
      })
    }

    //更新用户头像
    $scope.updateImg = function() {
      $scope.onFileSelect = function($files) {
        var file = $files[0];
        if (file.type != "image/png" && file.type != "image/jpg" && file.type != "image/jpeg") {
          Notification.show({
            title: '失败',
            type: 'danger',
            msg: 'LANG_USER_INVALID_AVATOR_IMAGE',
            closeable: false
          })
          return;
        }
        (function(file) {
          file.upload = $upload.upload({
            url: CONFIG.API_ROOT + '/user/avatar?token=' + $cookies.token,
            method: 'POST',
            withCredentials: true,
            data: {
              file_name: file.name
            },
            file: file,
            fileFormDataName: 'Filedata',
          }).progress(function(evt) {
            file.progress = parseInt(100.0 * evt.loaded / evt.total)
          }).success(function(data, status, headers, config) {
            var avatar = $scope.userInfo.avatar
            $scope.userInfo.avatar = ''
            $scope.userInfo.avatar = avatar + '&_=' + new Date().getTime()
            $rootScope.$broadcast('updateUserImg');
            file.progress = 100
          });
        })(file);
      };
    }

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel')
    }
  }
])