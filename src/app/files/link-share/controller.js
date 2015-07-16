angular.module('App.Files').controller('App.Files.LinkShareController', [
  '$scope',
  '$modalInstance',
  'obj',
  'Share',
  'Notification',
  'Cloud',
  'Utils',
  'Confirm',
  function(
    $scope,
    $modalInstance,
    obj,
    Share,
    Notification,
    Cloud,
    Utils,
    Confirm
  ) {

    //是否是设置模式状态
    $scope.edit_setting = false

    //发送链接邮件数组
    $scope.selectedEmails = []

    //链接对象
    $scope.obj = obj

    //是否有编辑链接权限
    $scope.edit_link = obj.is_edit

    //是否已有链接
    $scope.has_link = $scope.obj.has_link

    //右侧选择列表是否显示
    $scope.broad = false

    //链接对象类型
    $scope.type = ($scope.obj.folder) ? "folder" : "file"

    //链接分享权限
    $scope.linkSharePermissionValue = "LANG_LINK_PREVIEW_AND_DOWNLOAD"
    $scope.linkSharePermissionKey = "0001110"
    $scope.showLinkSharePermissionValue = "LANG_LINK_PREVIEW_AND_DOWNLOAD"

    //表单提交按钮文字
    $scope.link_send = 'LANG_LINK_SEND'

    //是否设置访问权限
    $scope.set_password = false

    //访问密码
    $scope.linkSharePassword = ""

    //是否有访问密码
    $scope.pass_placeholder = "LANG_LINK_ENTER_ACCESS_PASSWORD"

    //选择链接permission dropdown是否显示
    $scope.permissionOpen = false

    //选择是否需要密码 dropdown是否显示
    $scope.passwordOpen = false

    //是否需要访问密码
    $scope.needPasswordValue = '无'
    $scope.showNeedPasswordValue = '无需密码'

    //链接说明
    $scope.comment = ""

    //链接分享访问密码输入框type
    $scope.linkSharePasswordType = 'password'

    //邀请按下回车键是否是通过typeahead
    $scope.is_enter_from_typeahead = false

    //全选状态
    $scope.selectedAll = false

    //链接有效期text
    $scope.perpetual = true

    //人员（组）输入控件焦点
    $scope.selectedInput = {
      value: false
    }

    //焦点人员（组）选择框
    $scope.focusInput = function() {
      $scope.selectedInput.value = true
    }

    $scope.inputSelected = {
      value: false
    }

    //已邀请的 组和人员
    $scope.invitedList = {
      groupList: [],
      userList: []
    }

    //链接分享权限List
    if ($scope.obj.folder) { //文件夹
      $scope.linkSharePermissionValueList = ["LANG_LINK_ONLY_PREVIEW", "LANG_LINK_ONLY_UPLOAD", "LANG_LINK_PREVIEW_AND_DOWNLOAD", "LANG_LINK_PREVIEW_AND_DOWNLOAD_AND_UPLOAD"]
      $scope.linkSharePermissionKeyList = ["0000100", "0000001", "0001110", "0001111"]
    } else { //文件
      $scope.linkSharePermissionValueList = ["LANG_LINK_ONLY_PREVIEW", "LANG_LINK_PREVIEW_AND_DOWNLOAD"]
      $scope.linkSharePermissionKeyList = ["0000100", "0001110"]
    }

    //是否已有链接（创建链接或获取链接）
    if (!$scope.has_link) { //创建链接
      Share.getLink({}, {
        comment: $scope.comment,
        obj_id: ($scope.obj.isFolder == 1) ? $scope.obj.folder_id : $scope.obj.file_id,
        obj_name: $scope.obj.file_name,
        obj_type: $scope.type,
        set_password: $scope.set_password,
        permission: $scope.linkSharePermissionKey
      }).$promise.then(function(linkShare) {
        $scope.obj.link_id = linkShare.link_id
        $scope.link = linkShare.link
        $scope.linkSharePassword = linkShare.password
        $scope.expiration = linkShare.expiration
        $scope.showNeedPasswordValue = (linkShare.set_password) ? '需要密码' : '无需密码'
        $scope.obj.has_link = true
        $scope.share_key = linkShare.share_key
        $scope.perpetual = true
        $scope.inputSelected.value = true 
      }, function(error) {
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: error.data.result,
          closeable: false
        })
      })
    } else { //获取链接
      $scope.link_detail = Share.viewLink({
        id: $scope.obj.link_id
      })

      $scope.link_detail.$promise.then(function(link_detail) {
        $scope.linkSharePermissionKey = link_detail.permission
        $scope.link = link_detail.link
        $scope.linkSharePassword = link_detail.password
        $scope.comment = link_detail.comment
        $scope.set_password = link_detail.set_password
        $scope.needPasswordValue = (link_detail.set_password) ? '设置访问密码' : '无'
        $scope.showNeedPasswordValue = (link_detail.set_password) ? '需要密码' : '无需密码'
        $scope.pass_placeholder = (link_detail.set_password) ? 'LANG_LINK_OLD_PASSWORD' : 'LANG_LINK_ENTER_PASSWORD'
        $scope.expiration = link_detail.expiration
        if(link_detail.expiration == null){
          $scope.dt = null
          $scope.perpetual = true
        }else{
          $scope.perpetual = false
          $scope.dt = new Date(parseInt(link_detail.expiration) * 1000)
        }
        $scope.obj.has_link = true
        $scope.share_key = link_detail.share_key
        $scope.inputSelected.value = true
        angular.forEach($scope.linkSharePermissionKeyList, function(permissionKey, index) {
          if (permissionKey == link_detail.permission) {
            $scope.linkSharePermissionValue = $scope.linkSharePermissionValueList[index]
          }
        })
      })
    }

    //协作 人员和组的接口
    Cloud.cloudUserList().$promise.then(function(cloudUser) {
      $scope.userList = cloudUser.list.users
      $scope.groupList = cloudUser.list.groups
      $scope.inviteTypeaheadList = [];
      angular.forEach($scope.userList, function(user) {
        user.selected = (user.invited) ? true : false;
        if (!user.selected) {
          var userEntity = {
            name: user.real_name + '(' + user.email + ')',
            avatar: user.avatar,
            entity: user
          };
          $scope.inviteTypeaheadList.push(userEntity);
        }
      })

      angular.forEach($scope.groupList, function(group) {
        group.selected = (group.invited) ? true : false
        group.show = false
        if (!group.selected) {
          var groupEntity = {
            name: group.group_name,
            avatar: './images/grouplist_icon.png',
            entity: group
          };
          $scope.inviteTypeaheadList.push(groupEntity);
        }
      })
    })

    //点击转换右侧选择是否显示  
    $scope.showGRroupUser = function() {
      $scope.broad = !$scope.broad
    }

    //点击转换链接设置 
    $scope.showEditSetting = function() {
      $scope.broad = false
      $scope.edit_setting = !$scope.edit_setting
    }

    //保存设置 
    $scope.saveSetting = function() {
      if($scope.set_password && ($scope.linkSharePassword.length < 6 || $scope.linkSharePassword.length > 16) && ($scope.pass_placeholder !== 'LANG_LINK_OLD_PASSWORD' || $scope.linkSharePassword != '')){
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: 'LANG_USER_PASSWORD_LENGTH_LIMIT',
          closeable: false
        })
        return
      }
      $scope.edit_setting = !$scope.edit_setting
      Share.getLink({}, {
        comment: $scope.comment,
        expiration: $scope.dt,
        obj_id: ($scope.obj.isFolder == 1) ? $scope.obj.folder_id : $scope.obj.file_id,
        obj_name: $scope.obj.file_name,
        obj_type: $scope.type,
        set_password: $scope.set_password,
        password: $scope.set_password ? $scope.linkSharePassword : '',
        permission: $scope.linkSharePermissionKey
      }).$promise.then(function(linkShare) {
        Notification.show({
          title: '成功',
          type: 'success',
          msg: "链接设置已更新",
          closeable: true
        })
        $scope.expiration = ($scope.dt) ? $scope.dt : null
        $scope.showNeedPasswordValue = ($scope.set_password) ? '需要密码' : '无需密码'
        $scope.perpetual = ($scope.dt == null) ? true : false
        $scope.link = linkShare.link
        if(!$scope.set_password) {
          $scope.pass_placeholder = 'LANG_LINK_ENTER_ACCESS_PASSWORD'
        } else {
          $scope.pass_placeholder = 'LANG_LINK_OLD_PASSWORD'
        }
      }, function(error) {
        if(!Utils.isReturnErrorDetails(error)){
          Notification.show({
            title: '失败',
            type: 'danger',
            msg: '更改链接设置时遇到问题，请再试一次',
            closeable: false
          })
        }
      })

    }

    //取消设置 
    $scope.cancelSetting = function() {
      $scope.edit_setting = !$scope.edit_setting
    }

    //复制成功提示
    $scope.showCopySuccess = function() {
      Notification.show({
        title: '成功',
        type: 'success',
        msg: "LANG_LINK_COPY_LINK",
        closeable: true
      })
    }

    //复制失败
    $scope.fallback = function(copy) {
      window.prompt('您的浏览器没有安装flash，请按ctrl+c或者cmd+c来复制下面的链接。', copy);
    }

    //展开或收拢组人员列表
    $scope.changeGroupshow = function(group) {
      group.show = !group.show
    }

    //链接分享选择权限
    $scope.changeLinkSharePermission = function(value) {
      $scope.permissionOpen = !$scope.permissionOpen
      $scope.linkSharePermissionValue = value
      angular.forEach($scope.linkSharePermissionValueList, function(permissionvalue, index) {
        if (permissionvalue == value) {
          $scope.linkSharePermissionKey = $scope.linkSharePermissionKeyList[index]
        }
      })
    }

    //链接分享选择是否需要密码
    $scope.changeNeedPassword = function(flag) {
      $scope.passwordOpen = !$scope.passwordOpen
      $scope.set_password = flag
      $scope.needPasswordValue = (flag == true) ? '设置访问密码' : '无'
    }

    //邀请内部用户
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
          //从下拉框中增加一个group
          var groupEntity = {
            name: groupOrUser.group_name,
            avatar: './images/grouplist_icon.png',
            entity: groupOrUser
          };
          $scope.inviteTypeaheadList.push(groupEntity);
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
          //从下拉框中增加一个user
          var userEntity = {
            name: groupOrUser.real_name + '(' + groupOrUser.email + ')',
            avatar: groupOrUser.avatar,
            entity: groupOrUser
          };
          $scope.inviteTypeaheadList.push(userEntity);
          $scope.invitedList.userList.splice(i, 1)
        }
      } else { //选中列表中组或者协作人
        if (groupOrUser.group_id) { //选中的是组
          angular.forEach($scope.groupList, function(group) {
            if (groupOrUser.group_id == group.group_id) {
              group.selected = true;
            }
          })
          for (var i = 0; i < $scope.inviteTypeaheadList.length; ++i) {
            if ($scope.inviteTypeaheadList[i].entity.group_id == groupOrUser.group_id)
              break
          }
          //从typeahead下拉框中删除一个group
          $scope.inviteTypeaheadList.splice(i, 1);
          $scope.invitedList.groupList.push(groupOrUser)
        } else { //选中的是用户
          angular.forEach($scope.userList, function(user) {
            if (groupOrUser.user_id == user.user_id) {
              user.selected = true;
            }
          });
          for (var i = 0; i < $scope.inviteTypeaheadList.length; ++i) {
            if ($scope.inviteTypeaheadList[i].entity.user_id == groupOrUser.user_id)
              break
          }
          //从typeahead下拉框中删除一个user
          $scope.inviteTypeaheadList.splice(i, 1);
          $scope.invitedList.userList.push(groupOrUser)
        }
      }

      $scope.selectedAll = true
      for (var i = 0; i < $scope.userList.length; i++) {
        if ($scope.userList[i].selected == false) {
          $scope.selectedAll = false
          break
        }
      }

      for (var j = 0; j < $scope.groupList.length; j++) {
        if ($scope.groupList[j].selected == false) {
          $scope.selectedAll = false
          break
        }

      }

      if ($scope.invitedList.userList.length > 0 || $scope.invitedList.groupList.length > 0) {
        $scope.inviteInputplaceholder = ''
        $scope.disableBtn = false;
      } else {
        $scope.inviteInputplaceholder = 'LANG_INVITE_EXTERNAL_USER_HINT'
        $scope.disableBtn = true;
      }
    }

    //删除选中的人员
    $scope.deleteSelectedUser = function(user) {
      //是否是内部用户
      var internalFlag = false
      for (var i = 0; i < $scope.invitedList.userList.length; ++i) {
        if ((user.user_id && $scope.invitedList.userList[i].user_id == user.user_id) || (user.email && $scope.invitedList.userList[i].email == user.email)) {
          user.selected = false
          break
        }
      }
      if(user.user_id){
        internalFlag = true
      }
      if(internalFlag){
        var userEntity = {
          name: user.real_name + '(' + user.email + ')',
          avatar: user.avatar,
          entity: user
        }
        $scope.inviteTypeaheadList.push(userEntity)
      }
      $scope.invitedList.userList.splice(i, 1)

      if ($scope.invitedList.userList.length > 0 || $scope.invitedList.groupList.length > 0) {
        $scope.inviteInputplaceholder = ''
        $scope.disableBtn = false;
      } else {
        $scope.inviteInputplaceholder = 'LANG_INVITE_EXTERNAL_USER_HINT'
        $scope.disableBtn = true;
      }
    }

    //删除选中的组
    $scope.deleteSelectedGroup = function(group) {
      var internalFlag = false
      for (var i = 0; i < $scope.invitedList.groupList.length; ++i) {
        if ($scope.invitedList.groupList[i].group_id == group.group_id) {
          internalFlag = true
          group.selected = false
          break
        }
      }
      if(internalFlag){
        var groupEntity = {
          name: group.group_name,
          avatar: './images/grouplist_icon.png',
          entity: group
        };
        $scope.inviteTypeaheadList.push(groupEntity)
      }
      $scope.invitedList.groupList.splice(i, 1)

      if ($scope.invitedList.userList.length > 0 || $scope.invitedList.groupList.length > 0) {
        $scope.inviteInputplaceholder = ''
        $scope.disableBtn = false;
      } else {
        $scope.inviteInputplaceholder = 'LANG_INVITE_EXTERNAL_USER_HINT'
        $scope.disableBtn = true;
      }
    }

    //全选或者全不选
    $scope.switchSelectAll = function() {
      $scope.invitedList.groupList = []
      $scope.invitedList.userList = []
      $scope.inviteTypeaheadList = []

      angular.forEach($scope.groupList, function(group) {
        group.selected = !$scope.selectedAll
        if ($scope.selectedAll == false) {
          $scope.invitedList.groupList.push(group)
        } else {
          var groupEntity = {
            name: group.group_name,
            avatar: './images/grouplist_icon.png',
            entity: group
          };
          $scope.inviteTypeaheadList.push(groupEntity)
        }
      })

      angular.forEach($scope.userList, function(user) {
        user.selected = !$scope.selectedAll
        if ($scope.selectedAll == false) {
          $scope.invitedList.userList.push(user)
        } else {
          var userEntity = {
            name: user.real_name + '(' + user.email + ')',
            avatar: user.avatar,
            entity: user
          };
          $scope.inviteTypeaheadList.push(userEntity)
        }
      })

      if ($scope.invitedList.userList.length > 0 || $scope.invitedList.groupList.length > 0) {
        $scope.inviteInputplaceholder = ''
        $scope.disableBtn = false;
      } else {
        $scope.inviteInputplaceholder = 'LANG_INVITE_EXTERNAL_USER_HINT'
        $scope.disableBtn = true;
      }
    }

    // Contacts typeahead select event
    $scope.onSelect = function($item, $modal, $label) {
      $scope.is_enter_from_typeahead = true;
      $scope.inviteBySelect($item.entity, $item.entity.selected);
      $scope.inviteInputValue.value = '';
      $scope.inviteInputplaceholder = '';
    }

    //外部联系人输入框
    $scope.inviteInputValue = {
      value: ''
    }

    $scope.inviteInputplaceholder = 'LANG_INVITE_EXTERNAL_USER_HINT'

    //输入框输入增加协作人或组
    $scope.inviteBypress = function($event, inviteInputValue) {
      $event.stopPropagation()
      if ($event.which == 8 && inviteInputValue == '' && ($scope.invitedList.userList.length != 0 || $scope.invitedList.groupList.length != 0)) {
        if ($scope.invitedList.userList.length != 0) {
          var internalFlag = false //是否是内部用户
          var deleteUser =  $scope.invitedList.userList[$scope.invitedList.userList.length - 1]
          if(!deleteUser.delete){
            deleteUser.delete = true
          }else{
            for (var i = 0; i < $scope.invitedList.userList.length; ++i) {
              if ((deleteUser.user_id && $scope.invitedList.userList[i].user_id == deleteUser.user_id)) {
                internalFlag = true
                break
              }
            }
            if(internalFlag){
              var userEntity = {
                name: deleteUser.real_name + '(' + $scope.invitedList.userList[$scope.invitedList.userList.length - 1].email + ')',
                avatar: deleteUser.avatar,
                entity: deleteUser
              };
              $scope.inviteTypeaheadList.push(userEntity)   
            }
            deleteUser.selected = false
            $scope.invitedList.userList.splice($scope.invitedList.userList.length - 1, 1)
            
          }
        } else {
          var internalFlag = false //是否是内部群组
          var deleteGroup = $scope.invitedList.groupList[$scope.invitedList.groupList.length - 1]
          if(deleteGroup.delete){
            deleteGroup.delete = true
          }else{
            for (var i = 0; i < $scope.invitedList.groupList.length; ++i) {
              if (($scope.invitedList.groupList[i].group_id && $scope.invitedList.groupList[i].group_id == deleteGroup.group_id)) {
                internalFlag = true
                break
              }
            }
            if(internalFlag){
              var groupEntity = {
                name: deleteGroup.group_name,
                avatar: './images/grouplist_icon.png',
                entity: deleteGroup
              };
              $scope.inviteTypeaheadList.push(groupEntity)
            }
            deleteGroup.selected = false
            $scope.invitedList.groupList.splice($scope.invitedList.groupList.length - 1, 1)
          }
        }
      }else{
        if ($scope.invitedList.userList.length != 0) {
          $scope.invitedList.userList[$scope.invitedList.userList.length - 1].delete = false
        }
        if($scope.invitedList.groupList.length != 0){
          $scope.invitedList.groupList[$scope.invitedList.groupList.length - 1].delete = false
        }
      }

      if ($event.which != 13 || $scope.is_enter_from_typeahead) {
        $scope.is_enter_from_typeahead = false;
        return
      }
      if (inviteInputValue.replace(/^\s+|\s+$/g, "") == '') {
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: "LANG_INVITE_MESSAGE_EMPTY_MAIL",
          closeable: false
        })
        return
      }
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(inviteInputValue)) {
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: "LANG_INVITE_MESSAGE_VREIFY_MAIL",
          closeable: false
        })
        return
      }
      var user = {
        real_name: inviteInputValue,
        email: inviteInputValue
      }
      $scope.invitedList.userList.push(user)
      $scope.inviteInputValue.value = ''

      if ($scope.invitedList.userList.length > 0 || $scope.invitedList.groupList.length > 0) {
        $scope.inviteInputplaceholder = ''
        $scope.disableBtn = false;
      } else {
        $scope.inviteInputplaceholder = 'LANG_INVITE_EXTERNAL_USER_HINT'
        $scope.disableBtn = true;
      }
    }

    //输入框失去焦点
    $scope.cancelDelete = function($event, inviteInputValue){
      $event.stopPropagation()
      if ($scope.invitedList.userList.length != 0) {
        $scope.invitedList.userList[$scope.invitedList.userList.length - 1].delete = false
      }
      if($scope.invitedList.groupList.length != 0){
        $scope.invitedList.groupList[$scope.invitedList.groupList.length - 1].delete = false
      }
      // if (inviteInputValue.replace(/^\s+|\s+$/g, "") == '') {
      //   Notification.show({
      //     title: '失败',
      //     type: 'danger',
      //     msg: "LANG_INVITE_MESSAGE_EMPTY_MAIL",
      //     closeable: false
      //   })
      //   return
      // }
      // var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      // if (!re.test(inviteInputValue)) {
      //   Notification.show({
      //     title: '失败',
      //     type: 'danger',
      //     msg: "LANG_INVITE_MESSAGE_VREIFY_MAIL",
      //     closeable: false
      //   })
      //   return
      // }
      // var user = {
      //   real_name: inviteInputValue,
      //   email: inviteInputValue
      // }
      // $scope.invitedList.userList.push(user)
      // $scope.inviteInputValue.value = ''

      // if ($scope.invitedList.userList.length > 0 || $scope.invitedList.groupList.length > 0) {
      //   $scope.inviteInputplaceholder = ''
      //   $scope.disableBtn = false;
      // } else {
      //   $scope.inviteInputplaceholder = 'LANG_INVITE_EXTERNAL_USER_HINT'
      //   $scope.disableBtn = true;
      // }
    }

    //start 日期控件
    $scope.today = function() {
      var today = new Date()
      today.setTime(today.getTime() + (7 * 24 * 60 * 60 * 1000))
      $scope.dt = null
    };
    $scope.today()

    //清楚日期
    $scope.clear = function() {
      $scope.dt = null
    }

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
      return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6))
    }

    $scope.toggleMin = function() {
      $scope.minDate = $scope.minDate ? null : new Date()
    };
    $scope.toggleMin()

    $scope.open = function($event) {
      $event.preventDefault()
      $event.stopPropagation()
      $scope.opened = true
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate']
    $scope.format = $scope.formats[1]
    //end 日期控件

    //是否设置访问权限切换
    $scope.changeLinkSharePasswordShow = function() {
      if (!$scope.set_password) {
        $scope.linkSharePassword = ""
      } else {
        $scope.pass_placeholder = 'LANG_LINK_ENTER_ACCESS_PASSWORD'
      }
    }

    //发送链接
    $scope.sendLink = function(inviteInputValue) {
      if (inviteInputValue.replace(/^\s+|\s+$/g, "") == '' && $scope.invitedList.userList.length != 0 && $scope.invitedList.groupList.length != 0) {
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: "LANG_INVITE_MESSAGE_EMPTY_MAIL",
          closeable: false
        })
        return
      }
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(inviteInputValue) && inviteInputValue.replace(/^\s+|\s+$/g, "") != '') {
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: "LANG_INVITE_MESSAGE_VREIFY_MAIL",
          closeable: false
        })
        return
      }

      if(inviteInputValue.replace(/^\s+|\s+$/g, "") != '' && re.test(inviteInputValue)){
        var user = {
          real_name: inviteInputValue,
          email: inviteInputValue
        }
        $scope.invitedList.userList.push(user)
        $scope.inviteInputValue.value = ''
      }
      

      if ($scope.invitedList.userList.length > 0 || $scope.invitedList.groupList.length > 0) {
        $scope.inviteInputplaceholder = ''
        $scope.disableBtn = false;
      } else {
        $scope.inviteInputplaceholder = 'LANG_INVITE_EXTERNAL_USER_HINT'
        $scope.disableBtn = true;
      }
      
      $scope.link_send = 'LANG_LINK_SENDING'//正在发送...
      $scope.disableBtn = true
      if($scope.invitedList.userList.length == 0 && $scope.invitedList.groupList == 0){
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: "LANG_FILES_SEND_MAIL_ERROR",
          closeable: true
        })
        $scope.link_send = 'LANG_LINK_SEND'
        return
      }
      Share.sendLink({}, {
        obj_name: (obj.isFolder == 1) ? obj.folder_name : obj.file_name,
        obj_id : (obj.isFolder == 1) ? obj.folder_id : obj.file_id,
        obj_type : (obj.isFolder == 1) ? 'folder' : 'file',
        link: $scope.link,
        share_key: $scope.share_key,
        users: $scope.invitedList.userList,
        groups: $scope.invitedList.groupList,
        comment: $scope.comment
      }).$promise.then(function() {
          $scope.link_send = 'LANG_LINK_SENDING'//正在发送...
          Notification.show({
          title: '成功',
          type: 'success',
          msg: "LANG_LINK_SEND_MAIL_SUCCESS",
          closeable: true
        })
        $modalInstance.close()
      }, function(){        
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: "LANG_LINK_SEND_MAIL_ERROR",
          closeable: false
        })
        $scope.link_send = 'LANG_LINK_SEND'
      })
    }

    //删除链接
    $scope.deleteLink = function() {
      
      Confirm.show({
        title: 'LANG_LINKS_DELETE_MYLINK',
        content: 'LANG_LINKS_DELETE_MYLINK_CONFIRM_MESSAGE',
        param: $scope.obj.file_name || $scope.obj.folder_name, 
        okButtonContent: 'LANG_LINKS_DELETE_MYLINK',
        ok: function($confirmModalInstance) {
          Share.deleteLink({
            id: $scope.obj.link_id
          }).$promise.then(function() {
            Notification.show({
              title: '成功',
              type: 'success',
              msg: 'LANG_FILES_DELETE_MYLINK_SUCCESS_MESSAGE',
              param: $scope.obj.file_name || $scope.obj.folder_name,
              closeable: true
            })
            $scope.obj.has_link = false
            $scope.obj.link_id = 0
            $scope.obj.linkBtnText = 'LANG_FILE_GENERATE_LINK'
            $confirmModalInstance.close();
            $modalInstance.close($scope.obj.link_id);
          })
        }
      })      
    }

    //监听日期选择空间的改变
    $scope.$watch('dt', function(dt, oldValue) {
      if(dt == undefined || dt == null){
        $scope.perpetual = true
      }else{
        $scope.perpetual = false
      }
    })

    $scope.cancel = function() {
      $modalInstance.close()
    }
    
  }
]).directive('selectInput', ['$timeout',
  function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        scope.$watch('inputSelected.value', function(newValue, oldValue, scope) {
          element.select()
        }, true);
      }
    }
  }
])