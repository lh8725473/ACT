angular.module('App.Discussion.blockedDiscussion').controller('App.Discussion.blockedDiscussion.Controller', [
  '$scope',
  'CONFIG',
  'UserDiscuss',
  'Utils',
  '$modal',
  'Notification',
  '$translate',
  'Confirm',
  '$rootScope',
  '$window',
  'Folders',
  function(
    $scope,
    CONFIG,
    UserDiscuss,
    Utils,
    $modal,
    Notification,
    $translate,
    Confirm,
    $rootScope,
    $window,
    Folders
  ) {

    //加载动画
    $scope.loading = true

    //最近访问链接文件列表    

    $scope.blockList = UserDiscuss.blockList()
    

    $scope.blockList.$promise.then(function(block) {
      //清除正在加载对话         
      $scope.loading = false;
      $scope.isblockedNull = ($scope.blockList.length == 0)?true:false;
      //遍历返回数据
      angular.forEach(block, function(block) {
        block.hideRing = CONFIG.ICONS_PATH + CONFIG.ICONS.folder.hide_ring;
         

        //文件地址
        if(block.path ==""){
            block.path = "根目录/";
        }else{
            block.path = "根目录/" + block.path;
        }
        //讨论内容
        /*block.discussionContent = block.user + ":" + block.content;*/
        var fileType = Utils.getFileTypeByName(block.action_obj_name)
        block.isFolder = (block.action_obj_type == "folder") ? true : false

        //权限
        $scope.permission_key = CONFIG.PERMISSION_KEY
        $scope.permission_value = CONFIG.PERMISSION_VALUE

        block.to_permission_con = "";
        block.from_permission_con = ""

        angular.forEach($scope.permission_key, function(key, index) {
          if (key == block.to_permission) {
            block.to_permission_con = $translate.instant($scope.permission_value[index])
          }
          if (key == block.from_permission) {
            block.from_permission_con = $translate.instant($scope.permission_value[index])
          }
        })

        switch (block.action_type) {
        case "discuss":
          block.discussionContent = block.user + ":" + block.content;
          break;
          case "create":
            if (fileType != 'note') {
              block.discussionContent = block.user + $translate.instant("LANG_TEAM_COLLABORATION_UPLOAD_FILE")+ block.action_obj_name;
            } else {
              block.discussionContent = block.user + $translate.instant("LANG_TEAM_COLLABORATION_CREATE_NOTE")+ block.action_obj_name
            }
            break;

          case "update":
            if (fileType != 'note') {
              block.discussionContent = block.user + $translate.instant("LANG_TEAM_COLLABORATION_UPDATE_FILE")+ block.action_obj_name;
            } else {
              block.discussionContent = block.user + $translate.instant("LANG_TEAM_COLLABORATION_UPDATE_NOTE")+ block.action_obj_name;
            }
            break;
          case "delete":
            if(block.isFolder){
              block.discussionContent = block.user + $translate.instant("LANG_TEAM_COLLABORATION_DELETE_FOLDER")+ block.action_obj_name
            }else{
              block.discussionContent = block.user + $translate.instant("LANG_TEAM_COLLABORATION_DELETE_FILE") + block.action_obj_name;
            }
            break;
          case "revert":
            block.discussionContent = block.user + $translate.instant("LANG_TEAM_COLLABORATION_REVERT_FILE") + block.action_obj_name;
            break;
          case "preview":
            block.discussionContent = block.user + $translate.instant("LANG_TEAM_COLLABORATION_PREVIEW_FILE") + block.action_obj_name;
            break;
          case "download":
            block.discussionContent = block.user + $translate.instant("LANG_TEAM_COLLABORATION_DOWNLOAD_FILE") + block.action_obj_name;
            break;
          case "join":
            block.discussionContent = block.action_obj_name + $translate.instant("LANG_TEAM_COLLABORATION_BY") + block.user + $translate.instant("LANG_TEAM_COLLABORATION_JION") + block.to_permission_con;
            break;
          case "alter":
            block.discussionContent = block.action_obj_name + $translate.instant("LANG_TEAM_COLLABORATION_BY") + block.user + $translate.instant("LANG_TEAM_COLLABORATION_FROM") + block.from_permission_con + $translate.instant("LANG_TEAM_COLLABORATION_TO") + block.to_permission_con;
            break;
          case "leave":
            block.discussionContent = block.user + $translate.instant("LANG_TEAM_COLLABORATION_LEAVE_FOLDER");
            break;            
          case "kickout":
            block.discussionContent = block.action_obj_name + $translate.instant("LANG_TEAM_COLLABORATION_BY") + block.user + $translate.instant("LANG_TEAM_COLLABORATION_KICKOUT");;
            break;
          default:
            block.action_content = "";
            break;
        }



        
      });
     
    });

    
     
    

  }
])