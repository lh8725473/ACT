angular.module('App.Discussion.folderList').controller('App.Discussion.folderList.Controller', [
  '$scope',
  'CONFIG',
  'UserDiscuss',
  'Utils',
  '$modal',
  'Notification',
  '$rootScope',
  '$translate',
  '$state',
  'Confirm',
  '$window',
  '$cookies',
  'Folders',
  function(
    $scope,
    CONFIG,
    UserDiscuss,
    Utils,
    $modal,
    Notification,
    $rootScope,
    $translate,
    $state,
    Confirm,
    $window,
    $cookies,
    Folders
  ) {

    //加载动画
    $scope.loading = true

    //我的链接文件列表
    $scope.folderList = UserDiscuss.folderList()


    $scope.folderList.$promise.then(function(folderList) {
      //清除正在加载对话      
      $scope.loading = false;       
      $scope.isfolderListNull = ($scope.folderList.length == 0)?true:false;
         angular.forEach(folderList, function(folder) {
            folder.folderIcon = CONFIG.ICONS_PATH + CONFIG.ICONS.folder.small_share; 
            
            //文件地址
            if(folder.path ==""){
                folder.path = "根目录/";
            }else{
                folder.path = "根目录/" + folder.path;
            }

          //讨论内容
          /*if(folder.action_type == "discuss"){
            folder.discussionContent = folder.user + ":" + folder.content;
          }else{
            folder.discussionContent = folder.content;
          }*/
          var fileType = Utils.getFileTypeByName(folder.action_obj_name)
          folder.isFolder = (folder.action_obj_type == "folder") ? true : false

          //权限
          $scope.permission_key = CONFIG.PERMISSION_KEY
          $scope.permission_value = CONFIG.PERMISSION_VALUE

          folder.to_permission_con = "";
          folder.from_permission_con = ""

          angular.forEach($scope.permission_key, function(key, index) {
            if (key == folder.to_permission) {
              folder.to_permission_con = $translate.instant($scope.permission_value[index])
            }
            if (key == folder.from_permission) {
              folder.from_permission_con = $translate.instant($scope.permission_value[index])
            }
          })

          switch (folder.action_type) {
          case "discuss":
            folder.discussionContent = folder.user + ":" + folder.content;
            break;
            case "create":
              if (fileType != 'note') {
                folder.discussionContent = folder.user + $translate.instant("LANG_TEAM_COLLABORATION_UPLOAD_FILE")+ folder.action_obj_name;
              } else {
                folder.discussionContent = folder.user + $translate.instant("LANG_TEAM_COLLABORATION_CREATE_NOTE")+ folder.action_obj_name
              }
              break;

            case "update":
              if (fileType != 'note') {
                folder.discussionContent = folder.user + $translate.instant("LANG_TEAM_COLLABORATION_UPDATE_FILE")+ folder.action_obj_name;
              } else {
                folder.discussionContent = folder.user + $translate.instant("LANG_TEAM_COLLABORATION_UPDATE_NOTE")+ folder.action_obj_name;
              }
              break;
            case "delete":
              if(folder.isFolder){
                folder.discussionContent = folder.user + $translate.instant("LANG_TEAM_COLLABORATION_DELETE_FOLDER")+ folder.action_obj_name
              }else{
                folder.discussionContent = folder.user + $translate.instant("LANG_TEAM_COLLABORATION_DELETE_FILE") + folder.action_obj_name;
              }
              break;
            case "revert":
              folder.discussionContent = folder.user + $translate.instant("LANG_TEAM_COLLABORATION_REVERT_FILE") + folder.action_obj_name;
              break;
            case "preview":
              folder.discussionContent = folder.user + $translate.instant("LANG_TEAM_COLLABORATION_PREVIEW_FILE") + folder.action_obj_name;
              break;
            case "download":
              folder.discussionContent = folder.user + $translate.instant("LANG_TEAM_COLLABORATION_DOWNLOAD_FILE") + folder.action_obj_name;
              break;
            case "join":
              folder.discussionContent = folder.action_obj_name + $translate.instant("LANG_TEAM_COLLABORATION_BY") + folder.user + $translate.instant("LANG_TEAM_COLLABORATION_JION") + folder.to_permission_con;
              break;
            case "alter":
              folder.discussionContent = folder.action_obj_name + $translate.instant("LANG_TEAM_COLLABORATION_BY") + folder.user + $translate.instant("LANG_TEAM_COLLABORATION_FROM") + folder.from_permission_con + $translate.instant("LANG_TEAM_COLLABORATION_TO") + folder.to_permission_con;
              break;
            case "leave":
              folder.discussionContent = folder.user + $translate.instant("LANG_TEAM_COLLABORATION_LEAVE_FOLDER");
              break;            
            case "kickout":
              folder.discussionContent = folder.action_obj_name + $translate.instant("LANG_TEAM_COLLABORATION_BY") + folder.user + $translate.instant("LANG_TEAM_COLLABORATION_KICKOUT");;
              break;
            default:
              folder.action_content = "";
              break;
          }

         });

    })


    //删除最近讨论的文件夹
    $scope.deleteFolderList = function(folder){
      UserDiscuss.deleteFolderList({},{         
        folder_id: folder.folder_id
      }).$promise.then(function() {
        for (var i = 0; i < $scope.folderList.length; ++i) {
          if ($scope.folderList[i].folder_id == folder.folder_id) {
            $scope.folderList.splice(i, 1)
            break
          }
        }
        Notification.show({
          title: '成功',
          type: 'success',
          msg: '删除成功',
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

      // console.log(folder)
    }
    
     

  }
])