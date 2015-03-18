angular.module('App.Users.ExternalUsers.EditExternalUser').controller('App.Users.ExternalUsers.EditExternalUser.Controller', [
  '$scope',
  '$modal',
  'Notification',
  '$state',
  'Users',
  'Group',
  'ExternalUser',
  'CONFIG',
  function(
  	$scope,
  	$modal,
  	Notification,
  	$state,
  	Users,
  	Group,
  	ExternalUser,
  	CONFIG) {

  	$scope.permission_key = CONFIG.PERMISSION_KEY
	  $scope.permission_value = ['协同拥有者', '编辑者', '查看上传者', '预览上传者', '查看者', '预览者', '上传者']

    $scope.permissions = []
  	angular.forEach($scope.permission_key, function(key, index) {
      var permissionMap = {
        key : key,
        value : $scope.permission_value[index]
      }
      $scope.permissions.push(permissionMap)
    })

  	$scope.id = $state.params.id

  	$scope.externalUser = ExternalUser.getExternalUserById({id: $scope.id})

    $scope.externalUser.$promise.then(function() {
      $scope.externalUserFolder = $scope.externalUser.folders
      $scope.showUserExternalUserFolder = $scope.externalUser.folders.map(function(folder){
        return folder
      })
    })

	 $scope.gridFolder = {
    data: 'showUserExternalUserFolder',
    selectedItems: $scope.selectedData,
    enableRowSelection : false,
    columnDefs: [{
      field: 'folder_name',
      displayName: '文件夹名'
    }, {
      field: 'owner_name',
      displayName: '拥有者'
    }, {
      field: 'file_count',
      displayName: '文件数量'
    }, {
      displayName: '权限',
      cellTemplate : 'src/admin/users/externalUsers/editExternalUser/row-externalUser-role.html'
    }, {
      displayName: '操作',
      cellTemplate : 'src/admin/users/externalUsers/editExternalUser/row-externalUser-remove.html'
    }]
  }

    $scope.removeExternalUser = function(row){
      $scope.showUserExternalUserFolder.splice(row.rowIndex, 1);
        angular.forEach($scope.externalUserFolder, function(folder, index) {
          if(row.entity.folder_id == folder.folder_id){
            $scope.externalUserFolder.splice(index, 1);
          }
      })
    }

    $scope.seachFolders = function(seachFoldersValue) {
      // 清空显示的group
      $scope.showUserExternalUserFolder = []
      // 重新计算
      $scope.showUserExternalUserFolder = $($scope.externalUserFolder).filter(function(index, folder) {
        if (!seachFoldersValue || seachFoldersValue.trim() === '') {
          return true
        } else if (folder.folder_name.toLowerCase().indexOf(seachFoldersValue.toLowerCase()) != -1) {
          return true
        } else {
          return false
        }
      })
    }

    $scope.updateExternalUser = function(externalUser){
      ExternalUser.updateExternalUser({
        id: externalUser.user_id
      }, externalUser).$promise.then(function() {
        Notification.show({
          title: '成功',
          type: 'success',
          msg: '修改用户成功',
          closeable: true
        })
      }, function(error) {
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: error.data.result,
          closeable: true
        })
      })
    }
	}
 ])