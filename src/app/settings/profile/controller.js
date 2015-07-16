angular.module('App.Settings.Profile').controller('App.Settings.Profile.Controller', [
  '$scope',
  'Users',
  '$upload',
  '$cookies',
  '$rootScope',
  '$cookieStore',
  'Notification',
  function(
    $scope,
    Users,
    $upload,
    $cookies,
    $rootScope,
    $cookieStore,
    Notification
  ) {

    //获取个人信息
    $scope.userInfo = Users.getUserInfo()

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

    //更改用户信息
    $scope.updateUserInfo = function(userInfo) {
      Users.updateUserInfo({

      }, {
        real_name: userInfo.real_name,
        email: userInfo.email,
        phone: userInfo.phone,
        position: userInfo.position
      }).$promise.then(function() {
        Notification.show({
          title: '成功',
          type: 'success',
          msg: 'LANG_USER_SAVE_SUCCESS',
          closeable: false
        })
        $cookieStore.createCookie('realName', $scope.userInfo.real_name, 30)
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