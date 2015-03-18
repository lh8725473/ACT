angular.module('App.Files').controller('App.Files.InviteTeamUsersController', [
  '$scope',
  '$rootScope',
  '$modalInstance',
  'Cloud',
  'obj',
  'folder_id',
  'folder_permission',
  'folder_name',
  'CONFIG',
  '$timeout',
  '$translate',
  'Share',
  'Folders',
  '$cookies',
  'Notification',
  function(
    $scope,
    $rootScope,
    $modalInstance,
    Cloud,
    obj,
    folder_id,
    folder_permission,
    folder_name,
    CONFIG,
    $timeout,
    $translate,
    Share,
    Folders,
    $cookies,
    Notification
  ) {
      //右侧列表是否显示
      $scope.broad = false
      //分享文件夹ID
      $scope.folder_id = folder_id
      //分享文件夹名字
      $scope.folder_name = folder_name
      //权限
      $scope.permission_key = CONFIG.PERMISSION_KEY
      $scope.permission_value = CONFIG.PERMISSION_VALUE
      //表单提交按钮文字
      $scope.invite_send = 'LANG_INVITE_SENT_INVITATION'

      if(folder_permission != '1111111'){
        $scope.permission_value_list = CONFIG.NOOWNER_PERMISSION_VALUE_TOOLTIP
      }else{
        $scope.permission_value_list = CONFIG.OWNER_PERMISSION_VALUE_TOOLTIP
      }

      $scope.permissions = []
      angular.forEach($scope.permission_key, function(key, index) {
        var permissionMap = {
          key: key,
          value: $scope.permission_value[index]
         }
        $scope.permissions.push(permissionMap)
      })

      $scope.selectedPermissionKey = "0111111"
      $scope.selectedPermissionValue = "PERMISSION_VALUE_2"

      //选择权限dropdown
      $scope.permissionOpen = false

      //选择权限
      $scope.selectedPermission = function(value) {
        $scope.selectedPermissionValue = value.v
        $scope.permissionOpen = !$scope.permissionOpen
        angular.forEach($scope.permission_value, function(p_value, index) {
          if (p_value == value.v) {
            $scope.selectedPermissionKey = $scope.permission_key[index]
          }
        })
      }

      //删除选中的人员
      $scope.deleteSelectedUser = function(user) {
        for (var i = 0; i < $scope.invitedList.userList.length; ++i) {
          if ((user.user_id && $scope.invitedList.userList[i].user_id == user.user_id) || (user.email && $scope.invitedList.userList[i].email == user.email)){
            user.selected = false
            break
          }
        }
        $scope.invitedList.userList.splice(i, 1)

        if ($scope.invitedList.userList.length > 0 || $scope.invitedList.groupList.length > 0) {
          $scope.disableBtn = false;
        }
        else {
          $scope.disableBtn = true;
        }
      }

      //删除选中的组
      $scope.deleteSelectedGroup = function(group) {
        for (var i = 0; i < $scope.invitedList.groupList.length; ++i) {
          if ($scope.invitedList.groupList[i].group_id == group.group_id){
            group.selected = false
            break
          }
        }
        $scope.invitedList.groupList.splice(i, 1)

        if ($scope.invitedList.userList.length > 0 || $scope.invitedList.groupList.length > 0) {
          $scope.disableBtn = false;
        }
        else {
          $scope.disableBtn = true;
        }
      }

      //协作 人员和组的接口
      $scope.cloudUserList = Cloud.cloudUserList({
        folder_id: $scope.folder_id
      })

      $scope.cloudUserList.$promise.then(function(cloudUser) {
        $scope.userList = cloudUser.list.users
        $scope.groupList = cloudUser.list.groups

        angular.forEach($scope.userList, function(user) {
          user.selected = (user.invited) ? true : false
        })

        angular.forEach($scope.groupList, function(group) {
          group.selected = (group.invited) ? true : false
          group.show = false
        })
      })

      //组是否显示人员
      $scope.changeGroupshow = function(group) {
        group.show = !group.show
      }

      //已邀请的 组和人员
      $scope.invitedList = {
        groupList: [],
        userList: []
      }

      //外部联系人输入框
      $scope.inviteInputValue = ""

      //输入框输入增加协作人或组
      $scope.inviteBypress = function($event, inviteInputValue) {
        $event.stopPropagation()
        if($event.which != 13){
          return
        }
        if(inviteInputValue.replace(/^\s+|\s+$/g, "") == ''){
          Notification.show({
            title: '失败',
            type: 'danger',
            msg: "LANG_INVITE_MESSAGE_EMPTY_MAIL",
            closeable: false
          })
          return
        }
        var user = {
          real_name: inviteInputValue,
          email: inviteInputValue
        }
        $scope.invitedList.userList.push(user)
        $scope.inviteInputValue = ''

        if ($scope.invitedList.userList.length > 0 || $scope.invitedList.groupList.length > 0) {
          $scope.disableBtn = false;
        }else {
          $scope.disableBtn = true;
        }
      }

      //右侧列表是否显示
      $scope.showGRroupUser = function() {
        $scope.broad = !$scope.broad
      }

      //右侧列表选择协作人或组
      $scope.disableBtn = true;
      $scope.inviteBySelect = function(groupOrUser, selected) {
        if (selected) { //取消组或者协作人
          if (groupOrUser.group_id) { //取消的是组
            angular.forEach($scope.groupList, function(group) {
              if (groupOrUser.group_id == group.group_id) {
                group.selected = false;
              }
            })
            for (var i = 0; i < $scope.invitedList.groupList.length; ++i) {
              if ($scope.invitedList.groupList[i].group_id == groupOrUser.group_id)
                break
            }
            $scope.invitedList.groupList.splice(i, 1)
          } else { //取消的是用户
            angular.forEach($scope.userList, function(user) {
              if (groupOrUser.user_id == user.user_id) {
                user.selected = false;
              }
            })
            for (var i = 0; i < $scope.invitedList.userList.length; ++i) {
              if ($scope.invitedList.userList[i].user_id == groupOrUser.user_id)
                break
            }
            $scope.invitedList.userList.splice(i, 1)
          }
        } else { //选中列表中组或者协作人
          if (groupOrUser.group_id) { //选中的是组
            $scope.invitedList.groupList.push(groupOrUser)
          } else { //选中的是用户
            $scope.invitedList.userList.push(groupOrUser)
          }
        }

        if ($scope.invitedList.userList.length > 0 || $scope.invitedList.groupList.length > 0) {
          $scope.disableBtn = false;
        }
        else {
          $scope.disableBtn = true;
        }
      }

      //邀请联系人comment
      $scope.comment = $translate.instant('LANG_INVITE_MESSAGE_DEFAULT_INVITE_CONTENT')

      //发送邀请
      $scope.createShare = function() {
        $scope.invite_send = 'LOADING'
        $scope.disableBtn = true
        var toUserList = []
        var toGroupList = []
        angular.forEach($scope.invitedList.userList, function(user) {
          if (user.user_id) { //已有联系人
            var to_user = {
              to_user_id: user.user_id
            }
            toUserList.push(to_user)
          } else { //没有的联系人 （通过邮件邀请）
            var to_user = {
              email: user.email
            }
            toUserList.push(to_user)
          }
        })
        angular.forEach($scope.invitedList.groupList, function(group) {
          var to_group = {
            to_group_id: group.group_id
          }
          toGroupList.push(to_group)
        })
        Share.createShare({}, {
          share_type: "to_all",
          permission: $scope.selectedPermissionKey,
          obj_type: "folder",
          comment: $scope.comment,
          obj_id: $scope.folder_id,
          list: {
            users: toUserList,
            groups: toGroupList
          }
        }).$promise.then(function(resUser) {
          $scope.invite_send = 'LANG_INVITE_SENT_INVITATION'
          $modalInstance.close()
          Notification.show({
            title: '成功',
            type: 'success',
            msg: 'LANG_INVITE_MESSAGE_INVITE_SUCCESS',
            closeable: true
          })
          if (obj.owner_uid == $cookies.userId){
            obj.permission_value = 'OWNER_PERMISSION_VALUE'
          }
          obj.smallIcon = CONFIG.ICONS_PATH + CONFIG.ICONS.folder.small_share
          Folders.queryShareObj({
            folder_id: $scope.folder_id
          }).$promise.then(function(reShareObj) {
            obj.user_count = reShareObj.user_count
          })
          $rootScope.$broadcast('inviteDone');
        }, function (error) {
          Notification.show({
            title: '失败',
            type: 'danger',
            msg: error.data.result,
            closeable: false
          })
          $scope.invite_send = 'LANG_INVITE_SENT_INVITATION'
        })
      }

      $scope.ok = function() {
        $modalInstance.close(folder_id)
      }

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel')
      }
  }
])