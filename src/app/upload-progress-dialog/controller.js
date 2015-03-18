angular.module('App.UploadProgressDialog').controller('App.UploadProgressDialog.Controller', [
  '$scope',
  '$upload',
  '$cookies',
  '$rootScope',
  '$q',
  '$state',
  'CONFIG',
  'Utils',
  'Notification',
  function(
    $scope,
    $upload,
    $cookies,
    $rootScope,
    $q,
    $state,
    CONFIG,
    Utils,
    Notification
  ) {
    $scope.shown = false
    $scope.isMax = true

    $scope.files = []

    //是否有新上传的文件
    var uploadNew = false

    $scope.$on('uploadFiles', function($event, $files) {
      $scope.shown = true
      $scope.isMax = true
      //上传所在文件夹
      var folder_id = $state.params.folderId || 0;
      for (var i = 0; i < $files.length; i++) {
        var file = $files[i];
        file.progress = 0;
        file.fomateSize = Utils.formateSize(file.size);
        (function(file) {
          file.upload = $upload.upload({
            url: CONFIG.API_ROOT + '/file/create?token=' + $cookies.token,
            method: 'POST',
            withCredentials: true,
            data: {
              file_size: file.size,
              file_name: file.name,
              folder_id: folder_id
            },
            file: file,
            fileFormDataName: 'file_content',
          }).progress(function(evt) {
            file.progress = parseInt(100.0 * evt.loaded / evt.total)
          }).success(function(data, status, headers, config) {
            file.progress = 100
            uploadNew = true
          }).error(function(error){
            if(error != ''){//中断请求
              Notification.show({
                title: '失败',
                type: 'danger',
                msg: error.result,
                closeable: false
              })
            }
          });
        })(file);
        $scope.files.push(file)
      }
      $q.all($scope.files.map(function(file) {
        return file.upload
      })).finally(function() {
        if(uploadNew){
          $rootScope.$broadcast('uploadFilesDone');
        }
      })
    })

    $scope.$on('uploadNewFile', function($event, $files, file_id) {
      $scope.shown = true
      $scope.isMax = true
      //上传所在文件夹
      var folder_id = $state.params.folderId || 0;
      for (var i = 0; i < $files.length; i++) {
        var file = $files[i];
        file.progress = 0;
        file.fomateSize = Utils.formateSize(file.size);
        (function(file) {
          file.upload = $upload.upload({
            url: CONFIG.API_ROOT + '/file/create?token=' + $cookies.token + '&file_id=' + file_id,
            method: 'POST',
            withCredentials: true,
            data: {
              file_name: file.name,
              folder_id: folder_id
            },
            file: file,
            fileFormDataName: 'file_content',
          }).progress(function(evt) {
            file.progress = parseInt(100.0 * evt.loaded / evt.total)
          }).success(function(data, status, headers, config) {
            file.progress = 100
            $scope.files.push(file)
            $q.all($scope.files.map(function(file) {
              return file.upload
            })).finally(function() {
              $rootScope.$broadcast('uploadNewFileDone');
            })
          }).error(function(error){
            if(error != ''){//中断请求
              Notification.show({
                title: '失败',
                type: 'danger',
                msg: error.result,
                closeable: false
              })
            }
          });
        })(file);
      }
    })

    //删除上传列表
    $scope.remove = function(file){
      file.removed = true
    }

    $scope.max = function() {
      $scope.isMax = true
    }

    $scope.min = function() {
      $scope.isMax = false
    }

    $scope.hide = function() {
      $scope.shown = false
    }

  }
])