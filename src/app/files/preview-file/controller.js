angular.module('App.Files').controller('App.Files.PreviewFileController', [
  '$scope',
  '$rootScope',
  'Utils',
  '$modalInstance',
  'CONFIG',
  'obj',
  'fileVersionPreview',
  'Files',
  '$cookies',
  '$sce',
  'UserDiscuss',
  '$modal',
  'Folders',
  'ngSocket',
  'Notification',
  function(
    $scope,
    $rootScope,
    Utils,
    $modalInstance,
    CONFIG,
    obj,
    fileVersionPreview,
    Files,
    $cookies,
    $sce,
    UserDiscuss,
    $modal,
    Folders,
    ngSocket,
    Notification
  ) {
      //获取ueditor内容
      $scope.getcontent = function(){
        console.log($scope.content)
      }

//    $scope.config = {
//      //这里可以选择自己需要的工具按钮名称,此处仅选择如下五个
//      toolbars:[['Source', 'Undo', 'Redo','Bold','test','link', 'unlink','fontfamily','fontsize','underline', 'fontborder', 'strikethrough', 'superscript', 'subscript']],
//      //focus时自动清空初始化时的内容
//      autoClearinitialContent:true,
//      //关闭字数统计
//      wordCount:false,
//      //关闭elementPath
//      elementPathEnabled:false
//    }

      $scope.content = "<h4>rfwerfwetetest</h4>"

      //ngSocket
      var ws = ngSocket('ws://' + CONFIG.SOCKET_HOST)
      ws.onOpen(function(){
        ws.send({
          file_id : obj.file_id,
          token : $cookies.token,
          type : 'login',
          name : 'xx'
        })
      })

      ws.onMessage(function (msg) {
        console.log(msg)
        var userDiscuss = angular.fromJson(msg.data)
        userDiscuss.content = Utils.replaceURLWithHTMLLinks(userDiscuss.content)
        userDiscuss.content = Utils.highLightAtWhos(userDiscuss.content);
        userDiscuss.content = userDiscuss.content.replace(/\n/g, "<br/>");
        userDiscuss.avatar = CONFIG.API_ROOT + '/user/avatar/' + userDiscuss.user_id + '?token=' + $cookies.token
        if(userDiscuss.user_id == $cookies.userId){//是否是当前用户
          userDiscuss.is_owner = true
        }
        if(obj.file_id == userDiscuss.file_id && userDiscuss.user_id != $cookies.userId){//是否是当前文件and 不是当前用户
          $scope.userDiscussList.push(userDiscuss)
        }
      })

      //权限列表
      var is_owner = obj.permission.substring(0, 1) //协同拥有者 or 拥有者1
      var is_delete = obj.permission.substring(1, 2) //删除权限
      var is_edit = obj.permission.substring(2, 3) //编辑权限
      var is_getLink = obj.permission.substring(3, 4) //链接权限
      var is_preview = obj.permission.substring(4, 5) //预览权限
      var is_download = obj.permission.substring(5, 6) //下载权限
      var is_upload = obj.permission.substring(6, 7) //上传权限

      obj.is_owner = (is_owner == '1') ? true : false
      obj.is_delete = (is_delete == '1') ? true : false
      obj.is_edit = (is_edit == '1') ? true : false
      obj.is_getLink = (is_getLink == '1') ? true : false
      obj.is_preview = (is_preview == '1') ? true : false
      obj.is_download = (is_getLink == '1') ? true : false
      obj.is_upload = (is_upload == '1') ? true : false

      //预览对象
      $scope.obj = obj      

      //右侧菜单 讨论or版本
      $scope.navType = 'dis'

      //加载动画
      $scope.loading = true

      //讨论输入框焦点
      $scope.textareaFocus = false

      $scope.changeNavType = function(navType) {
        $scope.navType = navType
      }

      $scope.fileType = Utils.getFileTypeByName(obj.file_name)

      if('note' == $scope.fileType){//笔记类型
        $scope.loading = false
      }else if ('image' == $scope.fileType) {//图片预览
        if(fileVersionPreview.version_id){
          $scope.imageSrc = CONFIG.API_ROOT + '/file/preview/' + obj.file_id + '?token=' + $cookies.token + '&version_id=' + fileVersionPreview.version_id + '&_=' + new Date().getTime()
        } else{
           $scope.imageSrc = CONFIG.API_ROOT + '/file/preview/' + obj.file_id + '?token=' + $cookies.token + '&_=' + new Date().getTime();        
        }
        $scope.loading = false
      } else {//office或者pdf预览
        Files.preview(obj.file_id, true, fileVersionPreview.version_id).then(function(htmlData) {
          $scope.loading = false
          $scope.previewValue = htmlData
        })
      }

      $scope.$on('uploadNewFileDone', function() {
        $scope.fileType = Utils.getFileTypeByName(obj.file_name)

        if ('image' == $scope.fileType) {//图片预览
          if(fileVersionPreview.version_id){
            $scope.imageSrc = CONFIG.API_ROOT + '/file/preview/' + obj.file_id + '?token=' + $cookies.token + '&version_id=' + fileVersionPreview.version_id + '&_=' + new Date().getTime()
          } else{
             $scope.imageSrc = CONFIG.API_ROOT + '/file/preview/' + obj.file_id + '?token=' + $cookies.token + '&_=' + new Date().getTime();        
          }
          obj.smallIcon = $scope.imageSrc + '&size=48'
          $scope.loading = false
        } else {//office或者pdf预览
          Files.preview(obj.file_id, true, fileVersionPreview.version_id).then(function(htmlData) {
            $scope.loading = false
            $scope.previewValue = htmlData
          })
        }

        $scope.fileHistoryList = Files.history({
          file_id : obj.file_id
        })
      })

      //上传新版本
      var uploadModalController = [
        '$scope',
        '$modalInstance',
        '$cookies',
        '$state',
        function(
          $scope,
          $modalInstance,
          $cookies,
          $state
        ) {

          $scope.multiple = false
          $scope.onFileSelect = function($files) {
            $modalInstance.close($files)
          };

          $scope.cancel = function() {
            $modalInstance.dismiss('cancel')
          }
        }
      ]

      //上传新版本
      $scope.upload = function() {
        if($scope.fileHistoryList.length >= CONFIG.HISTORY_VERSIONS){
          Notification.show({
            title: '失败',
            type: 'danger',
            msg: '抱歉：文件的历史版本数不能超过当前套餐的 '+ CONFIG.HISTORY_VERSIONS +' 个版本限制',
            closeable: false
          })
          return
        }
        var uploadModal = $modal.open({
          templateUrl: 'src/app/files/modal-upload.html',
          windowClass: 'modal-upload',
          backdrop: 'static',
          controller: uploadModalController,
          resolve: {}
        })

        uploadModal.result.then(function(files) {
          var $files = []
          var upload_erro = (CONFIG.UPLOAD_FILE_SIZE == 1024*1024*1024) ? 'LANG_FILES_NOT_MORE_THAN_1G' : 'LANG_FILES_NOT_MORE_THAN_5G'
          for (var i = 0; i < files.length; i++) {
            if(files[i].size > CONFIG.UPLOAD_FILE_SIZE){//文件大小不能大于1G
              Notification.show({
                title: '失败',
                type: 'danger',
                msg: upload_erro,
                closeable: false
              })
            }else{
              $files.push(files[i])
            }
          }

          if($files.length != 0){
            obj.format_size = Utils.formateSize($files[0].size)
            $rootScope.$broadcast('uploadNewFile', $files, obj.file_id)
          }
        })
      }

      //预览讨论
      $scope.userDiscussList = UserDiscuss.getUserDiscussList({
        obj_id : obj.file_id
      })

      $scope.userDiscussList.$promise.then(function(userDiscussList) {
        angular.forEach(userDiscussList, function(userDiscuss) {
          if(userDiscuss.is_deleted != 'true'){
            userDiscuss.content = Utils.replaceURLWithHTMLLinks(userDiscuss.content)
            userDiscuss.content = Utils.highLightAtWhos(userDiscuss.content);
          }
          userDiscuss.content = userDiscuss.content.replace(/\n/g, "<br/>")
          if (userDiscuss.user_id == $cookies.userId) { //讨论是否是当前用户
            userDiscuss.is_owner = true
          }
        })
//      $scope.loading = false
      }, function(error) {
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: error.data.result,
          closeable: false
        })
      })

      //讨论的文件
      $scope.file = obj

      //文件关联的协作人
      var fileType = Utils.getFileTypeByName($scope.file.file_name)
      $scope.isPreview = fileType ? true : false
      if($scope.file.folder_id != 0){
        $scope.shareObj = Folders.queryShareObj({
          folder_id : $scope.file.folder_id
        })
        $scope.shareObj.$promise.then(function(shareObj){
          var userNameList = []
          $scope.userList = shareObj.list.users
          $scope.groupList = shareObj.list.groups
          angular.forEach($scope.userList, function(user){
            userNameList.push(user.real_name)
          })
          angular.forEach($scope.groupList, function(group) {
            angular.forEach(group.users, function(user) {
              userNameList.push(user.real_name)
            })
          })
          $scope.atOptions.data = userNameList
        })
      }

      //回复讨论
      $scope.replyUserDiscuss = function(userDiscuss) {
        $scope.discussContent = $scope.discussContent + '@' + userDiscuss.real_name + ' '
        $scope.textareaFocus = true
      }

      //删除讨论
      $scope.deleteUserDiscuss = function(userDiscuss) {
        var deleteUserShareModal = $modal.open({
          templateUrl: 'src/app/files/user-discuss/delete-user-discuss-confirm.html',
          windowClass: 'delete-user-discuss',
          backdrop: 'static',
          controller: deleteUserDiscussController,
          resolve: {
            userDiscuss: function() {
              return userDiscuss
            },
            userDiscussList: function() {
              return $scope.userDiscussList
            }
          }
        })
      }

      // deleteUserDiscuss
      var deleteUserDiscussController = [
        '$scope',
        '$modalInstance',
        'userDiscuss',
        'userDiscussList',
        function(
          $scope,
          $modalInstance,
          userDiscuss,
          userDiscussList
        ) {
          $scope.userDiscussList = userDiscussList
          $scope.userDiscuss = userDiscuss

          $scope.ok = function() {
            UserDiscuss.deleteUserDiscuss({
              id: userDiscuss.id
            }).$promise.then(function() {
              for (var i = 0; i < $scope.userDiscussList.length; ++i) {
                if ($scope.userDiscussList[i].id == userDiscuss.id) {
                  userDiscuss.is_deleted = 'true'
                }
              }
              $modalInstance.dismiss('cancel')
            }, function(error) {
              Notification.show({
                title: '失败',
                type: 'danger',
                msg: error.data.result,
                closeable: false
              })
              $modalInstance.dismiss('cancel')
            })
          }

          $scope.cancel = function() {
            $modalInstance.dismiss('cancel')
          }
        }
      ]

      //讨论发表内容
      $scope.discussContent = ''
      //讨论字数
      $scope.discussCount = 0
      //发表按钮是否隐藏
      $scope.discussButton = true
      //讨论文本是否可编辑
      $scope.textareaDisabled = false

      //是否允许提交
      var createFlag = true

      //@配置
      var atWhoShown = false
      $scope.atOptions = {
        at: "@",
        data: [],
        limit: 5,
        start_with_space: false,//是否前面有空格
        onShown: function () {
          atWhoShown = true
        },
        onHidden: function () {
          atWhoShown = false
        }
      }

      //发表讨论
      $scope.createUserDiscuss = function($event){
        $scope.textareaDisabled = true
        $scope.discussButton = true
        $event.stopPropagation()
        $event.preventDefault()
        //本人发送信息
        var sendUserDiscuss = {
          format_date : Utils.formateTime(new Date(), "yyyy/MM/dd hh:mm"),
          real_name : $cookies.realName,
          content : $scope.discussContent,
          user_id : $cookies.userId,
          id : 0,
          avatar: CONFIG.API_ROOT + '/user/avatar/' + $cookies.userId + '?token=' + $cookies.token
        }
        sendUserDiscuss.content = sendUserDiscuss.content.replace(/\n/g, "<br/>")
        sendUserDiscuss.content = Utils.replaceURLWithHTMLLinks(sendUserDiscuss.content)
        sendUserDiscuss.content = Utils.highLightAtWhos(sendUserDiscuss.content);
        sendUserDiscuss.is_owner = true
        $scope.userDiscussList.push(sendUserDiscuss)

        UserDiscuss.createUserDiscuss({
          obj_id : obj.file_id
        },{
          content :$scope.discussContent
        }).$promise.then(function(userDiscuss){
          sendUserDiscuss.id = userDiscuss.id
          $scope.textareaDisabled = false
          createFlag = true
          $scope.discussCount = 0
          $scope.discussButton = true
          ws.send({
            file_id : obj.file_id,
            token : $cookies.token,
            format_date : userDiscuss.format_date,
            real_name : userDiscuss.real_name,
            content : userDiscuss.content,
            user_id : userDiscuss.user_id,
            id : userDiscuss.id,
            "type":"send",
            "to_client_id":"all"
          })
//        $scope.userDiscussList.push(userDiscuss)
        }, function(error) {
          $scope.textareaDisabled = false
          $scope.postbtn = 'LANG_FILE_POST'
          createFlag = true
          Notification.show({
            title: '失败',
            type: 'danger',
            msg: error.data.result,
            closeable: false
          })
          $scope.discussButton = false
        })
        $scope.discussContent = ''
      }

      //回车发表讨论
      $scope.createUserDiscussByPress = function($event){
        if($event.shiftKey && $event.which === 13){//shiftKey+enter键换行
          $event.returnValue = true;
          return true;
        }

        if($event.which === 13 && !atWhoShown && createFlag){//回车事件
          $event.preventDefault()
          $scope.discussContent = $scope.discussContent.replace(/(^\s*)|(\s*$)/g, "");
          if($scope.discussContent.length > 200){
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

      //预览历史版本
      $scope.fileHistoryList = Files.history({
        file_id : obj.file_id
      }) 

      //还原版本
      $scope.revertFileVersion = function(fileHistory){
        Files.revertFileVersion({
          file_id: obj.file_id
        },{
          version_id: fileHistory.version_id
        }).$promise.then(function(r){
          //历史版本
          obj.version_count = parseInt(obj.version_count) + 1;
          $scope.fileHistoryList = Files.history({
            file_id: obj.file_id
          });  
          //更新预览的文件
          $scope.previewFile(fileHistory);  
        }, function(error){
          Notification.show({
            title: '失败',
            type: 'danger',
            msg: 'USER_DISCUSS_VERSION_REVERT_FAILED',
            closeable: false
          })
        });
      } 

      //文件预览
      $scope.previewFile = function(fileHistory){
        if ('image' == $scope.fileType) {//图片预览
          if(fileHistory.version_id){
            $scope.imageSrc = CONFIG.API_ROOT + '/file/preview/' + fileHistory.file_id + '?token=' + $cookies.token + '&version_id=' + fileHistory.version_id + '&_=' + new Date().getTime()
          } else{
             $scope.imageSrc = CONFIG.API_ROOT + '/file/preview/' + fileHistory.file_id + '?token=' + $cookies.token + '&_=' + new Date().getTime();        
          }
        } else {//office或者pdf预览
          Files.preview(fileHistory.file_id, true, fileHistory.version_id).then(function(htmlData) {
            $scope.previewValue = htmlData
          })
        }
      }    

      //下载历史版本
      $scope.downLoadHistory = function(fileHistory){
        var hiddenIframeID = 'hiddenDownloader'
        var iframe = $('#' + hiddenIframeID)[0]
        if (iframe == null) {
          iframe = document.createElement('iframe')
          iframe.id = hiddenIframeID
          iframe.style.display = 'none'
          document.body.appendChild(iframe)
        }
        iframe.src = CONFIG.API_ROOT + '/file/get/' + fileHistory.file_id + '?token=' + $cookies.token + '&v=' + fileHistory.version_id
      }

      //下载单个文件或者文件夹
      $scope.dowloadFile = function() {
        var hiddenIframeID = 'hiddenDownloader'
        var iframe = $('#' + hiddenIframeID)[0]
        if (iframe == null) {
          iframe = document.createElement('iframe')
          iframe.id = hiddenIframeID
          iframe.style.display = 'none'
          document.body.appendChild(iframe)
        }
        iframe.src = CONFIG.API_ROOT + '/file/get/' + obj.file_id + '?token=' + $cookies.token
      }

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel')
        ws.close(function(){

        })
      }
  }
])