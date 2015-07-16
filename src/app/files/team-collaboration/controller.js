angular.module('App.Files').controller('App.Files.TeamController', [
  '$scope',
  '$rootScope',
  'CONFIG',
  '$state',
  '$stateParams',
  'Folders',
  'Share',
  'Notification',
  '$modal',
  '$cookies',
  '$filter',
  'Utils',
  function(
    $scope,
    $rootScope,
    CONFIG,
    $state,
    $stateParams,
    Folders,
    Share,
    Notification,
    $modal,
    $cookies,
    $filter,
    Utils
  ) {
    //权限
    $scope.permission_key = CONFIG.PERMISSION_KEY
    $scope.permission_value = CONFIG.PERMISSION_VALUE

    $scope.permissions = []
    angular.forEach($scope.permission_key, function(key, index) {
      var permissionMap = {
        key: key,
        value: $scope.permission_value[index]
      }
      $scope.permissions.push(permissionMap)
    })

    //当前所在文件夹目录
    var folder_id = $state.params.folderId || 0;

    //是否为根目录
    $scope.isRoot = (folder_id == 0) ? true : false
    //是否是协作文件夹
    $scope.isShare = true

    //对当前目录下的权限
    var folder_permission = ''

    //加载动画
    $scope.loading = true

    if (folder_id != 0) {
      $scope.shareObj = Folders.queryShareObj({
        folder_id: folder_id
      })

      $scope.shareObj.$promise.then(function(shareObj) {
        $scope.loading = false
        $scope.shareObj.linkBtnText = (shareObj.link_id != 0) ? 'LANG_FILE_VIEW_LINK' : 'LANG_FILE_GENERATE_LINK'
        //是否是协作文件夹
        $scope.isShare = (shareObj.share_id != 0) ? true : false
        //对当前目录下的权限
        folder_permission = shareObj.permission
        $scope.folder_permission = shareObj.permission
        var folder_owner = folder_permission.substring(0, 1) //协同拥有者 or 拥有者1
        var folder_delete = folder_permission.substring(1, 2) //删除权限
        var folder_edit = folder_permission.substring(2, 3) //编辑权限
        var folder_getLink = folder_permission.substring(3, 4) //链接权限
        var folder_preview = folder_permission.substring(4, 5) //预览权限
        var folder_download = folder_permission.substring(5, 6) //下载权限
        var folder_upload = folder_permission.substring(6, 7) //上传权限
          //权限列表
        $scope.folder_owner = (folder_owner == '1') ? true : false
        $scope.folder_delete = (folder_delete == '1') ? true : false
        $scope.folder_edit = (folder_edit == '1') ? true : false
        $scope.folder_getLink = (folder_getLink == '1') ? true : false
        $scope.folder_preview = (folder_preview == '1') ? true : false
        $scope.folder_download = (folder_download == '1') ? true : false
        $scope.folder_upload = (folder_upload == '1') ? true : false

        $rootScope.$broadcast('folder_permission', folder_permission);

        $scope.users = shareObj.list.users
        $scope.groups = shareObj.list.groups

        $scope.link_share_btn = ($scope.folder_getLink) ? true : false

        angular.forEach($scope.groups, function(group) {
          group.show = false
          //群组权限
          angular.forEach($scope.permission_key, function(key, index) {
            if (key == group.permission) {
              group.permission_value = $scope.permission_value[index]
            }
          })

          if (parseInt(folder_permission) < parseInt(group.permission)) { //不能操作大于自身权限的用户
            group.is_edit = true
          }
          if (!$scope.folder_edit) { //没有编辑权限
            group.is_edit = true
          }

          if ($scope.folder_owner) { //不能给予别人比自己大的权限
            group.permission_value_list = CONFIG.OWNER_PERMISSION_VALUE_TOOLTIP
          } else {
            group.permission_value_list = CONFIG.NOOWNER_PERMISSION_VALUE_TOOLTIP
          }
        })
        angular.forEach($scope.users, function(user) {
          //人员权限
          if (user.owner_uid == user.user_id) { //拥有者
            user.permission_value = 'OWNER_PERMISSION_VALUE'
            user.is_owner = true
          } else {
            angular.forEach($scope.permission_key, function(key, index) {
              if (key == user.permission) {
                user.permission_value = $scope.permission_value[index]
              }
            })
            if (user.user_id == $cookies.userId) { //不能操作自己用户
              user.is_owner = true
            }
            if (parseInt(folder_permission) < parseInt(user.permission)) { //不能操作大于自身权限的用户
              user.is_owner = true
            }
            if (!$scope.folder_edit) { //没有编辑权限
              user.is_owner = true
            }
          }

          if ($scope.folder_owner) { //不能给予别人比自己大的权限
            user.permission_value_list = CONFIG.OWNER_PERMISSION_VALUE_TOOLTIP
          } else {
            user.permission_value_list = CONFIG.NOOWNER_PERMISSION_VALUE_TOOLTIP
          }
        })
      })
    } else {
      //对当前目录下的权限(根目录)
      $rootScope.$broadcast('folder_permission', '1111111');
    }

    //监听讨论的文件夹ID
    $scope.$on('discuss_folder', function($event) {
      $scope.activeTab = 1;      
    })

    //邀请协作成功后重新渲染
    $scope.$on('inviteDone', function($event, $files) {
      if (folder_id != 0) {
        $scope.shareObj = Folders.queryShareObj({
          folder_id: folder_id
        })

        $scope.shareObj.$promise.then(function(shareObj) {
          $scope.shareObj.linkBtnText = (shareObj.link_id != 0) ? 'LANG_FILE_VIEW_LINK' : 'LANG_FILE_GENERATE_LINK'
          var userNameList = []
          $scope.users = shareObj.list.users
          $scope.groups = shareObj.list.groups
          // $scope.userList = shareObj.list.users
          // $scope.groupList = shareObj.list.groups
          angular.forEach($scope.users, function(user) {
            userNameList.push(user.real_name)
          })
          angular.forEach($scope.groups, function(group) {
            angular.forEach(group.users, function(user) {
              userNameList.push(user.real_name)
            })
          })

          $rootScope.$broadcast('atOptions', userNameList);

          //是否为根目录
          if (folder_id == 0 && $scope.users.length == 1 && $scope.groups.length == 0) {
            $scope.isRoot = true
          } else {
            $scope.isRoot = false
          }
          angular.forEach($scope.groups, function(group) {
            group.show = false
            //群组权限
            angular.forEach($scope.permission_key, function(key, index) {
              if (key == group.permission) {
                group.permission_value = $scope.permission_value[index]
              }
            })

            if (parseInt(folder_permission) < parseInt(group.permission)) { //不能操作大于自身权限的用户
              group.is_owner = true
            }
            if (!$scope.folder_edit) { //没有编辑权限
              group.is_owner = true
            }
            if ($scope.folder_owner) { //不能给予别人比自己大的权限
              group.permission_value_list = CONFIG.OWNER_PERMISSION_VALUE_TOOLTIP
            } else {
              group.permission_value_list = CONFIG.NOOWNER_PERMISSION_VALUE_TOOLTIP
            }
          })
          angular.forEach($scope.users, function(user) {
            //人员权限
            if (user.owner_uid == user.user_id) { //拥有者
              user.permission_value = 'OWNER_PERMISSION_VALUE'
              user.is_owner = true
            } else {
              angular.forEach($scope.permission_key, function(key, index) {
                if (key == user.permission) {
                  user.permission_value = $scope.permission_value[index]
                }
              })
              if (user.user_id == $cookies.userId) { //不能操作自己用户
                user.is_owner = true
              }
              if (parseInt(folder_permission) < parseInt(user.permission)) { //不能操作大于自身权限的用户
                user.is_owner = true
              }
              if (!$scope.folder_edit) { //没有编辑权限
                user.is_owner = true
              }
            }

            if ($scope.folder_owner) { //不能给予别人比自己大的权限
              user.permission_value_list = CONFIG.OWNER_PERMISSION_VALUE_TOOLTIP
            } else {
              user.permission_value_list = CONFIG.NOOWNER_PERMISSION_VALUE_TOOLTIP
            }
          })
        })
      }
    })

    //群组是否展开查看用户
    $scope.changeGroupshow = function(group) {
      group.show = !group.show
    }

    //改变用户权限
    $scope.changeUserPermission = function(user, permission_value) {
      user.isopen = !user.isopen;
      angular.forEach($scope.permission_value, function(value, index) {
        if (permission_value == value) {
          user.permission = $scope.permission_key[index]
        }
      })
      Share.update({
        id: folder_id
      }, {
        user_id: user.user_id,
        permission: user.permission,
        obj_id: user.obj_id
      }).$promise.then(function() {
        Notification.show({
          title: '成功',
          type: 'success',
          msg: 'LANG_TEAM_UPDATE_AUTHORITY_SUCCESS_MESSAGE',
          param: user.real_name,
          param1: $filter('translate')(permission_value),
          closeable: true
        })
        user.permission_value = permission_value;
      }, function(error) {
        if (!Utils.isReturnErrorDetails(error)) {
          Notification.show({
            title: '失败',
            type: 'danger',
            msg: 'LANG_TEAM_UPDATE_AUTHORITY_ERROR_MESSAGE',
            closeable: false
          })
        }
      })
    }

    //改变群组权限
    $scope.changeGroupPermission = function(group, permission_value) {
      group.isopen = !group.isopen;
      angular.forEach($scope.permission_value, function(value, index) {
        if (permission_value == value) {
          group.permission = $scope.permission_key[index]
        }
      })
      Folders.updateGroup({
        folder_id: folder_id
      }, {
        group_id: group.group_id,
        permission: group.permission,
        obj_id: group.obj_id
      }).$promise.then(function() {
        Notification.show({
          title: '成功',
          type: 'success',
          msg: 'LANG_TEAM_UPDATE_AUTHORITY_SUCCESS_MESSAGE',
          param: group.group_name,
          param1: $filter('translate')(permission_value),
          closeable: true
        })
        group.permission_value = permission_value;
      }, function(error) {
        if (!Utils.isReturnErrorDetails(error)) {
          Notification.show({
            title: '失败',
            type: 'danger',
            msg: 'LANG_TEAM_UPDATE_AUTHORITY_ERROR_MESSAGE',
            closeable: false
          })
        }
      })
    }

    //移除用户协作
    $scope.deleteUserShare = function(user) {
      var deleteUserShareModal = $modal.open({
        templateUrl: 'src/app/files/team-collaboration/delete-share-user-confirm.html',
        windowClass: 'delete-share-user',
        backdrop: 'static',
        controller: deleteUserShareController,
        resolve: {
          user: function() {
            return user
          },
          users: function() {
            return $scope.users
          },
          shareObj: function() {
            return $scope.shareObj
          }
        }
      })
    }

    // deleteUserShare file
    var deleteUserShareController = [
      '$scope',
      '$modalInstance',
      'user',
      'users',
      'shareObj',
      function(
        $scope,
        $modalInstance,
        user,
        users,
        shareObj
      ) {
        $scope.users = users
        $scope.user = user

        $scope.ok = function() {
          Share.deleteShare({
            id: folder_id,
            user_id: $scope.user.user_id,
            obj_id: $scope.user.obj_id
          }).$promise.then(function(reFolder) {
            for (var i = 0; i < $scope.users.length; ++i) {
              if ($scope.users[i].user_id == $scope.user.user_id) {
                $scope.users.splice(i, 1)
                break
              }
            }
            //修改协作人数
            Folders.queryShareObj({
              folder_id: folder_id
            }).$promise.then(function(reShareObj) {
              shareObj.user_count = reShareObj.user_count
            })
            Notification.show({
              title: '成功',
              type: 'success',
              msg: 'LANG_TEAM_DELETE_COLLABORATION_SUCCESS_MESSAGE',
              param: $scope.user.real_name,
              closeable: true
            })
            $modalInstance.close()

            var userNameList = []
            $scope.users = shareObj.list.users
            angular.forEach($scope.users, function(user) {
              userNameList.push(user.real_name)
            })

            $rootScope.$broadcast('atOptions', userNameList);

          }, function(error) {
            if (!Utils.isReturnErrorDetails(error)) {
              Notification.show({
                title: '失败',
                type: 'danger',
                msg: 'LANG_TEAM_DELETE_COLLABORATION_ERROR_MESSAGE',
                closeable: false
              })
            }
          })
        };

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel')
        }
      }
    ]


    //移除群组协作
    $scope.deleteGroupShare = function(group) {
      var deleteGroupShareModal = $modal.open({
        templateUrl: 'src/app/files/team-collaboration/delete-share-user-confirm.html',
        windowClass: 'delete-share-user',
        backdrop: 'static',
        controller: deleteGroupShareController,
        resolve: {
          group: function() {
            return group
          },
          groups: function() {
            return $scope.groups
          },
          shareObj: function() {
            return $scope.shareObj
          }
        }
      })
    }

    // deleteGroupShare filer
    var deleteGroupShareController = [
      '$scope',
      '$modalInstance',
      'group',
      'groups',
      'shareObj',
      function(
        $scope,
        $modalInstance,
        group,
        groups,
        shareObj
      ) {
        $scope.group = group
        $scope.groups = groups

        $scope.ok = function() {
          Folders.deleteGroup({
            folder_id: folder_id,
            group_id: $scope.group.group_id,
            obj_id: $scope.group.obj_id
          }).$promise.then(function(reFolder) {
            for (var i = 0; i < $scope.groups.length; ++i) {
              if ($scope.groups[i].group_id == $scope.group.group_id) {
                $scope.groups.splice(i, 1)
                break
              }
            }
            //修改协作人数
            Folders.queryShareObj({
              folder_id: folder_id
            }).$promise.then(function(reShareObj) {
              shareObj.user_count = reShareObj.user_count
            })
            Notification.show({
              title: '成功',
              type: 'success',
              msg: 'LANG_TEAM_DELETE_COLLABORATION_SUCCESS_MESSAGE',
              param: $scope.group.group_name,
              closeable: true
            })
            $modalInstance.close()
            var userNameList = []
            $scope.groups = shareObj.list.groups
            angular.forEach($scope.groups, function(group) {
              angular.forEach(group.users, function(user) {
                userNameList.push(user.real_name)
              })
            })

            $rootScope.$broadcast('atOptions', userNameList);
          }, function(error) {
            if (!Utils.isReturnErrorDetails(error)) {
              Notification.show({
                title: '失败',
                type: 'danger',
                msg: 'LANG_TEAM_DELETE_COLLABORATION_ERROR_MESSAGE',
                closeable: false
              })
            }
          })
        };

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel')
        }
      }
    ]

    //邀请协作人
    $scope.inviteTeamUsers = function() {
      var addUserModal = $modal.open({
        templateUrl: 'src/app/files/invite-team-users/template.html',
        windowClass: 'invite-team-users',
        backdrop: 'static',
        controller: 'App.Files.InviteTeamUsersController',
        resolve: {
          folder_id: function() {
            return folder_id
          },
          folder_permission: function() {
            return folder_permission
          },
          folder_name: function() {
            return Folders.folderView({
              folder_id: folder_id
            }).$promise.then(function(folder) {
              return folder.folder_name
            })
          },
          obj: function() {
            return ''
          }
        }
      })
    }

    //链接分享
    $scope.linkShare = function() {
      if (!$scope.folder_getLink) { //无编辑权限
        return
      }
      $scope.shareObj.linkBtnText = 'LANG_FILE_VIEW_LINK'
      $scope.shareObj.is_edit = ($scope.folder_edit) ? true : false
      $scope.shareObj.has_link = ($scope.shareObj.link_id != 0) ? true : false
      $scope.shareObj.link_id = $scope.shareObj.link_id
      $scope.shareObj.folder_id = $scope.shareObj.obj_id
      $scope.shareObj.folder_name = $scope.shareObj.folder_name
      $scope.shareObj.folder = true
      $scope.shareObj.isFolder = 1
      var linkShareModal = $modal.open({
        templateUrl: 'src/app/files/link-share/template.html',
        windowClass: 'link-share',
        backdrop: 'static',
        controller: 'App.Files.LinkShareController',
        resolve: {
          obj: function() {
            return $scope.shareObj
          }
        }
      })
    }


  }
]).controller('App.Files.DiscussListController', [
  '$scope',
  '$state',
  '$rootScope',
  'CONFIG',
  'UserDiscuss',
  'Folders',
  '$cookies',
  '$translate',
  'Utils',
  '$modal',
  'ngSocket',
  'Notification',
  '$state',
  '$rootScope',
  function(
    $scope,
    $state,
    $rootScope,
    CONFIG,
    UserDiscuss,
    Folders,
    $cookies,
    $translate,
    Utils,
    $modal,
    ngSocket,
    Notification,
    $state,
    $rootScope
  ) {
    
    $scope.$on('objList', function($event, objList) {//objList列表数据源
      $scope.objList = objList
    })

    //ngSocket
    var ws;

    //是否关闭websocket
    var reconnectTime;

    //讨论输入框焦点
    $scope.textareaFocus = false

    //ngSocket
    var ws;

    //当前文件夹路径
    var folderId = $state.params.folderId || 0

    //讨论内容
    $scope.discussContent = ''

    //是否允许提交
    var createFlag = true

    //@配置
    var atWhoShown = false
    $scope.atOptions = {
      at: "@",
      data: [],
      limit: 5,
      start_with_space: false, //是否前面有空格
      onShown: function() {
        atWhoShown = true;
      },
      onHidden: function() {
        atWhoShown = false;
      }
    }

    //加载动画
    $scope.loading = true

    $scope.is_need_scroll_down = 'true';

    //是否已经是最后页
    var is_last_page = false
    var paging_top_id = 0;

    //发表按钮
    $scope.postbtn = 'LANG_FILE_POST'

    $scope.$on('atOptions', function($event, userNameList) {
      $scope.atOptions.data = userNameList
    })

    if (folderId != 0) {
        
        $scope.shareObj.$promise.then(function(shareObj) {
          $scope.shareObj.linkBtnText = (shareObj.link_id != 0) ? 'LANG_FILE_VIEW_LINK' : 'LANG_FILE_GENERATE_LINK'
          var userNameList = []
          $scope.userList = shareObj.list.users
          $scope.groupList = shareObj.list.groups
          angular.forEach($scope.userList, function(user) {
            userNameList.push(user.real_name)
          })
          angular.forEach($scope.groupList, function(group) {
            angular.forEach(group.users, function(user) {
              userNameList.push(user.real_name)
            })
          })
          $scope.atOptions.data = userNameList;

      });

        $scope.Discuss_list = UserDiscuss.List({
          obj_id: folderId,
          obj_type: "folder"
        })

        $scope.Discuss_list.$promise.then(function(Discuss_list) {
          $scope.loading = false
          if (Discuss_list.length < CONFIG.FOLDER_DISCUSS_PAGE_SIZE) {
            is_last_page = true
          }

          if(Discuss_list.length > 0)
          {          
            paging_top_id = Discuss_list[0].id;;
          }
          
          angular.forEach(Discuss_list, function(DiscussObj) {
            refreshDiscuss(DiscussObj)


          }) //遍历Discuss_list

        })


    } else {
      $scope.atOptions.data = [];
    }

    //检查是否屏蔽讨论消息
    $scope.isBlockMsg = Folders.isBlockMsg({
      folder_id: folderId,
      obj_type: "folder"
    })

    $scope.isBlockMsg.$promise.then(function(isBlock) {
      $scope.isBlock = isBlock.is_block
      $scope.notice_content = ($scope.isBlock == "true") ? "LANG_TEAM_COLLABORATION_NOTICE_CLOSE" : "LANG_TEAM_COLLABORATION_NOTICE_OPEN"
    })

    //切换屏蔽
    $scope.switchBlockMsg = function() {
      Folders.switchBlockMsg({

      }, {
        obj_type: "folder",
        folder_id: folderId
      }).$promise.then(function(isSwitch) {
        $scope.isBlock = isSwitch.is_block
        $scope.notice_content = (isSwitch.is_block == "true") ? "LANG_TEAM_COLLABORATION_NOTICE_CLOSE" : "LANG_TEAM_COLLABORATION_NOTICE_OPEN"
      }, function(error) {
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: error.data.result,
          closeable: false
        })
      })
    }

    //发送消息
    $scope.createUserDiscuss = function($event) {
      $scope.is_need_scroll_down = 'true';
      $scope.textareaDisabled = true
      $scope.discussButton = true
      $event.stopPropagation()
      $event.preventDefault()

      //本人发送信息
      var sendUserDiscuss = {
        format_date: Utils.formateTime(new Date(), "yyyy/MM/dd hh:mm"),
        real_name: $cookies.realName,
        content: $scope.discussContent,
        user_id: $cookies.userId,
        action: 'discuss',
        avatar: CONFIG.API_ROOT + '/user/avatar/' + $cookies.userId + '?token=' + $cookies.token + '&_=' + new Date().getTime()
      }

      var existTodayFlag = false;
          client_today = new Date();  
      angular.forEach($scope.Discuss_list, function(DiscussObj) {
        if (existTodayFlag == false && DiscussObj.breakline == true) {
          server_create_date = Utils.formateTime(new Date(DiscussObj.create_date * 1000), "yyyy/MM/dd");
          client_today_date = Utils.formateTime(client_today, "yyyy/MM/dd");
          if (server_create_date == client_today_date) {
            existTodayFlag = true;
            //break;
          }
        }
      });

      if(existTodayFlag == false)
      {
        sendUserDiscuss["breakline"] = true;
        sendUserDiscuss["breakline_date"] = "LANG_TEAM_COLLABORATION_TODAY_DATE";
        sendUserDiscuss["create_date"] = Date.parse(client_today)/1000;
      }
      sendUserDiscuss.content = sendUserDiscuss.content.replace(/\n/g, "<br/>")
      sendUserDiscuss.content = Utils.replaceURLWithHTMLLinks(sendUserDiscuss.content)
      sendUserDiscuss.content = Utils.highLightAtWhos(sendUserDiscuss.content, $scope.atOptions.data);
      $scope.Discuss_list.push(sendUserDiscuss)
      
      UserDiscuss.createUserDiscuss({

      }, {
        obj_id: folderId,
        obj_type: "folder",
        content: $scope.discussContent
      }).$promise.then(function(userDiscuss) {
        createFlag = true
        $scope.textareaFocus = true

      }, function(error) {
        var errorText = (error.data.result == undefined) ? 'NETWORK_ERROR' : error.data.result
        createFlag = true
        $scope.textareaFocus = true
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: errorText,
          closeable: false
        })
      })
      $scope.discussContent = '' 
    }

    //回车发表讨论
    $scope.createUserDiscussByPress = function($event) {
      if ($event.shiftKey && $event.which === 13) { //shiftKey+enter键换行
        $event.returnValue = true;
        return true;
      }

      if ($event.which === 13 && !atWhoShown && createFlag) { //回车事件
        $event.preventDefault()
        $scope.discussContent = $scope.discussContent.replace(/(^\s*)|(\s*$)/g, "");
        if ($scope.discussContent.length > 200) {
          Notification.show({
            title: '失败',
            type: 'danger',
            msg: 'DISCUSS_CONTENT_LIMIT',
            closeable: false
          })
          return
        }
        if ($scope.discussContent == '') {
          Notification.show({
            title: '失败',
            type: 'danger',
            msg: 'DISCUSS_CONTENT_EMPTY',
            closeable: false
          })
          return
        }

        createFlag = false
        $scope.createUserDiscuss($event)
      }
    }

    //输入讨论框监控
    $scope.$watch('discussContent', function(discussContent, oldValue) {
      $scope.discussCount = discussContent.length
      if (discussContent.length > 200 || discussContent.length == 0) {
        $scope.discussButton = true
      } else {
        $scope.discussButton = false
      }
    })

    //数据接口
    if (folderId != 0) {
      ws = ngSocket('ws://' + CONFIG.SOCKET_HOST);
      //定时断线重连websocket
      reconnectTime = setInterval(function() {
        ws.reconnect(ws.socket.readyState)
      }, 5000);

      ws.onMessage(function(msg) {
        console.log(msg)
        $scope.is_need_scroll_down = 'true';
        var DiscussObj = angular.fromJson(msg.data)
        if(DiscussObj.user_id == $cookies.userId && DiscussObj.action == 'discuss'){//本人的文件夹讨论不插入list中
          return
        }
        refreshDiscuss(DiscussObj)
        $scope.Discuss_list.push(DiscussObj)
      })

      ws.onOpen(function() {
        ws.send({
          folder_id: folderId,
          token: $cookies.token,
          type: 'login',
          name: 'xx'
        })
      })

    } //folderId != 0

    function refreshDiscuss(DiscussObj) {
      if(DiscussObj.action_obj_type != "group"){
        DiscussObj.avatar = DiscussObj.avatar + '&_=' + new Date().getTime()
      }
      
      DiscussObj.file_name = DiscussObj.action_obj_name
      DiscussObj.file_id = DiscussObj.action_obj_id
      DiscussObj.permission = $scope.folder_permission
      DiscussObj.folder_id = folderId  
      DiscussObj.version_count = DiscussObj.version_num
      DiscussObj.isPreview = $scope.folder_preview

      if (DiscussObj.action != 'discuss') { //非讨论
        //文件图标
        var ext;
        ext = DiscussObj.action_obj_name.slice(DiscussObj.action_obj_name.lastIndexOf('.') + 1);
        var icon = Utils.getIconByExtension(ext);
        DiscussObj.smallIcon = icon.small;
        DiscussObj.largeIcon = icon.large;
        //图片
        var fileType = Utils.getFileTypeByName(DiscussObj.action_obj_name)
        if (fileType == 'image') {
          DiscussObj.smallIcon = CONFIG.API_ROOT + '/file/preview/' + DiscussObj.action_obj_id + '?token=' + $cookies.token + '&size=48' + '&_=' + new Date().getTime();
        }

        //协作文件图标
        DiscussObj.isFolder = (DiscussObj.action_obj_type == "folder") ? true : false
        if(DiscussObj.isFolder){
          DiscussObj.smallIcon = CONFIG.ICONS_PATH + CONFIG.ICONS.folder.small_share;
          DiscussObj.largeIcon = CONFIG.ICONS_PATH + CONFIG.ICONS.folder.large_share;
        }

        DiscussObj.isImage = (fileType == 'image') ? true : false
        DiscussObj.isNote = (fileType == 'note') ? true : false

        // 预览笔记
        $scope.previewNote = function(DiscussObj) {
          /*console.log($scope.folder_preview);*/
          if ($scope.folder_preview && !DiscussObj.file_deleted){
            $state.go('note', {
              cloudId: $state.params.cloudId,
              fileId: DiscussObj.action_obj_id,
              folderId: DiscussObj.obj_id
            })
          }

          if(DiscussObj.file_deleted){
            Notification.show({
              title: '失败',
              type: 'danger',
              msg: 'LANG_TEAM_COLLABORATION_FILE_DELETE',
              closeable: false
            })
          }

        }

        //文件夹
        $scope.previewFolder = function(DiscussObj) {
          
        }

        //文件预览
        $scope.previewFile = function($event, DiscussObj) {
          $event.stopPropagation()
          if (!$scope.folder_preview) { //没有权限预览
            return
          }
          
          

          if (!DiscussObj.file_deleted) {
            var previewFileModal = $modal.open({
              templateUrl: 'src/app/files/preview-file/template.html',
              windowClass: 'preview-file',
              backdrop: 'static',
              controller: 'App.Files.PreviewFileController',
              resolve: {
                obj: function() {
                  return DiscussObj
                },
                fileVersionPreview: function() {
                  var fileVersion = {
                    version_id: DiscussObj.version_id
                  };
                  return fileVersion;
                },
                objList: function() {
                  return $scope.objList;
                }
              }
            })
            $rootScope.$broadcast('closeDiscussPannel')
          } else {
            Notification.show({
              title: '失败',
              type: 'danger',
              msg: 'LANG_TEAM_COLLABORATION_FILE_DELETE',
              closeable: false
            })
          }

        }



        //权限
        DiscussObj.to_permission_con = "";
        DiscussObj.from_permission_con = ""

        angular.forEach($scope.permission_key, function(key, index) {
          if (key == DiscussObj.to_permission) {
            DiscussObj.to_permission_con = $translate.instant($scope.permission_value[index])
          }
          if (key == DiscussObj.from_permission) {
            DiscussObj.from_permission_con = $translate.instant($scope.permission_value[index])
          }
        })

        DiscussObj.icon_action = 'icon-' + DiscussObj.action; //动态icon图标

        //动态操作
        switch (DiscussObj.action) {
          case "create":
            if (fileType != 'note') {
              DiscussObj.action_content = "LANG_TEAM_COLLABORATION_UPLOAD_FILE";
            } else {
              DiscussObj.action_content = "LANG_TEAM_COLLABORATION_CREATE_NOTE"
              DiscussObj.icon_action = 'icon-noteAdd';
            }
            break;

          case "update":
            if (fileType != 'note') {
              DiscussObj.action_content = "LANG_TEAM_COLLABORATION_UPDATE_FILE";
            } else {
              DiscussObj.action_content = "LANG_TEAM_COLLABORATION_UPDATE_NOTE";
            }
            break;
          case "delete":
            if(DiscussObj.isFolder){
              DiscussObj.action_content = "LANG_TEAM_COLLABORATION_DELETE_FOLDER"
            }else{
              DiscussObj.action_content = "LANG_TEAM_COLLABORATION_DELETE_FILE";
            }
            break;
          case "revert":
            DiscussObj.action_content = "LANG_TEAM_COLLABORATION_REVERT_FILE";
            break;
          case "preview":
            DiscussObj.action_content = "LANG_TEAM_COLLABORATION_PREVIEW_FILE";
            break;
          case "download":
            DiscussObj.action_content = "LANG_TEAM_COLLABORATION_DOWNLOAD_FILE";
            break;
          case "join":
            DiscussObj.action_content = $translate.instant("LANG_TEAM_COLLABORATION_BY") + DiscussObj.real_name + $translate.instant("LANG_TEAM_COLLABORATION_JION") + DiscussObj.to_permission_con;
            break;
          case "alter":
            DiscussObj.action_content = $translate.instant("LANG_TEAM_COLLABORATION_BY") + DiscussObj.real_name + $translate.instant("LANG_TEAM_COLLABORATION_FROM") + DiscussObj.from_permission_con + $translate.instant("LANG_TEAM_COLLABORATION_TO") + DiscussObj.to_permission_con;
            break;
          case "leave":
            DiscussObj.action_content = "LANG_TEAM_COLLABORATION_LEAVE_FOLDER";
            break;
          case "kickout":
            DiscussObj.action_content = $translate.instant("LANG_TEAM_COLLABORATION_BY") + DiscussObj.real_name + $translate.instant("LANG_TEAM_COLLABORATION_KICKOUT");
            break;
          default:
            DiscussObj.action_content = "";
            break;
        } //动态操作

      }else{//讨论action
        DiscussObj.content = DiscussObj.content.replace(/\n/g, "<br/>")
        DiscussObj.content = Utils.replaceURLWithHTMLLinks(DiscussObj.content)
        DiscussObj.content = Utils.highLightAtWhos(DiscussObj.content, $scope.atOptions.data);
      }


    } //refreshDiscuss()

    $scope.onDiscussListScroll = function(scrollTop, scrollHeight) {

      //console.log(scrollTop + ":" + scrollHeight);
      if(scrollTop == 0 && !$scope.loading && !is_last_page){

        $scope.is_need_scroll_down = 'false';
        $scope.loading = true;

        var objNewlist = UserDiscuss.List({
          obj_id: folderId,
          obj_type: "folder",
          top_id: paging_top_id,
          pagesize: CONFIG.FOLDER_DISCUSS_PAGE_SIZE
        })

        objNewlist.$promise.then(function(objNewlist) {
          $scope.loading = false
          if (objNewlist.length < CONFIG.FOLDER_DISCUSS_PAGE_SIZE) {
            is_last_page = true
          }

          if(objNewlist.length > 0)
          {          
            paging_top_id = objNewlist[0].id;
          }

          angular.forEach(objNewlist, function(DiscussObj) {
            refreshDiscuss(DiscussObj)
          }) 

          objOldList = $scope.Discuss_list;

          var has_find = false;
          for (var i = objNewlist.length-1; i >=0 ; i--) {
            if(has_find){
              $scope.Discuss_list = objOldList;
              break;
            }
            if (objNewlist[i].breakline == true) {
              for (var j = 0; j < objOldList.length; j++) {
              if (objOldList[j].breakline == true && objOldList[j].breakline_date == objNewlist[i].breakline_date) {
                  objOldList[j].breakline = false;
                  objOldList[j].breakline_date = "";
                  has_find = true;
                  break;
                }
              }
            }
          }
          //把objNewlist插入到$scope.Discuss_list之前
          $scope.Discuss_list.unshift.apply( $scope.Discuss_list, objNewlist );  
      })
    }
  }

    //监控路由变化，判断是否关闭ws
    $rootScope.$on('$stateChangeStart', 
      function(event, toState, toParams, fromState, fromParams){ 
      // event.preventDefault();
      if(toState.name != 'files'){//不在所有文件路由下面
        if(ws){//WS存在
          ws.close()
        }
        if(reconnectTime){//重连存在
          clearInterval(reconnectTime)
        }
      }
    })

    

  }
])