angular.module('App.Header').controller('App.Header.Controller', [
  '$scope',
  '$rootScope',
  'CONFIG',
  'Users',
  '$cookies',
  '$cookieStore',
  'Message',
  '$timeout',
  '$modal',
  'Notification',
  '$state',
  'Utils',
  '$translate',
  'Cloud',
  'Folders',
  '$window',
  'Confirm',
  'Cloud',
  function(
    $scope,
    $rootScope,
    CONFIG,
    Users,
    $cookies,
    $cookieStore,
    Message,
    $timeout,
    $modal,
    Notification,
    $state,
    Utils,
    $translate,
    Cloud,
    Folders,
    $window,
    Confirm,
    Cloud
  ) {

    $scope.cloudMenuOpen = false
    //检查浏览器环境
    Utils.checkEnvironment()
    $cookieStore.removeCookie('accessToken')
    //语言切换
    //$translate.use($cookieStore.readCookie('lang'));
    //默认语言
    //  if(!$cookieStore.readCookie('lang')){
    //    $translate.use('zh-CN');
    //  }

    //所属团队列表
    $scope.cloudList = Cloud.cloudList()

    //是否展开查看团队
    $scope.changeCloudshow = function() {
      $scope.cloudMenuOpen = !$scope.cloudMenuOpen
    }  

    //切换团队
    $scope.changeCloud = function(cloud){
      $scope.cloudMenuOpen = false
      if(cloud.cloud_id == $state.params.cloudId){//当前团队
        return
      }
      switchCloud(cloud.cloud_id)
      var cloudPath = 'index.html#/'+ cloud.cloud_id +'/files/0'
      $window.open(cloudPath)
    }

    //检查套餐情况
    $scope.package = Cloud.checkPackage()
    $scope.package.$promise.then(function(package) {
      if(package.package_id == 0){//免费用户权限列表
        CONFIG.PERMISSION_KEY = ['0111111', '0001110']
        CONFIG.PERMISSION_VALUE = ['PERMISSION_VALUE_2', 'PERMISSION_VALUE_5']
        CONFIG.OWNER_PERMISSION_VALUE_TOOLTIP = [{v: 'PERMISSION_VALUE_2', t : 'PERMISSION_VALUE_2_TOOLTIP'},{v: 'PERMISSION_VALUE_5', t : 'PERMISSION_VALUE_5_TOOLTIP'}]
        CONFIG.NOOWNER_PERMISSION_VALUE_TOOLTIP = [{v: 'PERMISSION_VALUE_2', t : 'PERMISSION_VALUE_2_TOOLTIP'},{v: 'PERMISSION_VALUE_5', t : 'PERMISSION_VALUE_5_TOOLTIP'}]                
      }else if (package.package_id == 1 || package.package_id == 2){//上传文件大小
        CONFIG.HISTORY_VERSIONS = 50
        CONFIG.UPLOAD_FILE_SIZE = CONFIG.UPLOAD_FILE_SIZE*5
      }else{
        CONFIG.HISTORY_VERSIONS = 100
        CONFIG.UPLOAD_FILE_SIZE = CONFIG.UPLOAD_FILE_SIZE*5
      }
    })

    //退出登录
    $scope.toLogin = function(){
      var url = ''
      if($cookieStore.readCookie('lang') == 'en-EN'){
        url = 'login-en.html'
      }else{
        url = 'login.html'
      }
      $cookieStore.removeCookie('token')
      $cookieStore.removeCookie('accessToken')
//    $cookieStore.removeCookie('userName')
      $cookieStore.removeCookie('userPic')
      $cookieStore.removeCookie('userId')
      $cookieStore.removeCookie('userType')
      $cookieStore.removeCookie('roleId')
      window.location.href = url
    }

  	$scope.toadmin = function(){
  	  window.location.href = 'admin.html#/'+ $state.params.cloudId +'/overview'
  	}

  	//加载动画
  	$scope.loading = true

  	$scope.messageCount = 0
  	$scope.noticeCount = 0
  	$scope.showMessageCount = !!$scope.messageCount
  	$scope.showMoticeCount = !!$scope.noticeCount
    $scope.roleId = $cookieStore.readCookie('roleId')

  	function refreshMessage(){
  	  $scope.unreadCount = Message.getUnreadMessagesCount()
      $scope.unreadCount.$promise.then(function(){
        $scope.messageCount = $scope.unreadCount.message
        $scope.noticeCount = $scope.unreadCount.notice
        $scope.showMessageCount = $scope.messageCount != 0
        $scope.showMoticeCount = $scope.noticeCount != 0
      })
  	}

  	//循环刷新消息
    $scope.pollForMessages = function(){
  		refreshMessage()
  		$timeout($scope.pollForMessages, 30000)
  	}

  	//循环执行消息系统
  	$scope.pollForMessages()

  	//message 列表
  	$scope.no_message = false
  	$scope.openMessageList = function($event){
      $event.stopPropagation()
      $event.preventDefault()
  	  $scope.no_message = false
  	  $scope.loading = true
  	  $scope.message_show = true
  	  $scope.notice_show = false
      $scope.messageOpen = true
  	  $scope.messageList = Message.getMessageList()
  	  $scope.messageList.$promise.then(function(messageList) {
  	    $scope.no_message = (messageList.length == 0) ? true : false
        $scope.loading = false
        $scope.messageOpen = true
      })
  	}

  	//点击单个消息msg
  	$scope.messageOpen = false
  	$scope.messageDetail = function($event, message){
  	  $event.stopPropagation()
  	  $scope.messageOpen = false
  	  $scope.toIsRead ('', message)
      if(message.cloud_id != $state.params.cloudId && $state.params.cloudId != '0'){//不是当前团队and不在其他团队
        return
      }
  	  var discuss_file = {
  	    file_name : message.obj_name,
  	    folder_id : message.folder_id,
  	    file_id : message.obj_id,
  	    permission : message.permission,
        version_count : message.version_count,
        discuss_count : message.discuss_count
  	  }
      var is_preview = discuss_file.permission.substring(4, 5) //预览权限
  	  var is_download = discuss_file.permission.substring(5, 6) //下载权限
      discuss_file.is_preview = (is_preview == '1') ? true : false
      discuss_file.is_download = (is_download == '1') ? true : false
      //对象是否能被预览
      var fileType = Utils.getFileTypeByName(discuss_file.file_name || discuss_file.folder_name)
      discuss_file.isPreview = (fileType && discuss_file.is_preview) ? true : false

      var objList = Folders.getObjList({
        folder_id: message.folder_id,
        page: 1
      })
      objList.$promise.then(function() {
        if(message.obj_type =='file'){
          $rootScope.$broadcast('discuss_file', discuss_file, 'dis', objList)

        }else if(message.obj_type =='folder'){
          $rootScope.$broadcast('discuss_folder')          
        }
      })
  	}

  	//点击单个消息notice
    $scope.noticeOpen = false
    $scope.noticeDetail = function($event, notice){
      $event.stopPropagation()
      $scope.noticeOpen = false
      $scope.toIsRead ('', notice)
    }

  	//notice 列表
  	$scope.no_notice = false
  	$scope.openNoticeList = function($event){
      $event.stopPropagation()
      $event.preventDefault()
  	  $scope.no_notice = false
  	  $scope.loading = true
  	  $scope.message_show = false
      $scope.notice_show = true
      $scope.noticeOpen = true
      $scope.noticeList = Message.getNoticeList()
      $scope.noticeList.$promise.then(function(noticeList) {
        $scope.no_notice = (noticeList.length == 0) ? true : false
        $scope.loading = false
        $scope.noticeOpen = true
      })
    }

  	//message标记为已读
  	$scope.toIsRead = function($event, message){
  	  if($event){
  	    $event.stopPropagation()
  	  }
      Message.toIsRead({
        id : message.id
      }).$promise.then(function() {
        message.is_read = 'true'
        refreshMessage()
      }, function(error) {
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: error.data.result,
          closeable: false
        })
      })
  	}

    function switchCloud(cloud_id){
      Cloud.switch({},{
        cloud_id : cloud_id,
        client_id : 'JsQCsjF3yr7KACyT'
      })
    }

    //路由改变跳到对应的文件夹或者打开相应链接
    $scope.goToFolderOrLink = function(notice) {
      if(notice.folder_deleted=='true'){
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: 'LANG_HEADER_DELETE_FOLDER',
          closeable: false
        })
        return
      }
      if(notice.file_deleted=='true'){
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: 'LANG_HEADER_DELETE_FILE',
          closeable: false
        })
        return
      }
      if(notice.share_key == ''){//跳转至对应文件夹
        var cloudId = $cookieStore.readCookie('cloudId')
        if(notice.cloud_id == $state.params.cloudId){//已在当前团队
          $state.go('files', {folderId: notice.folder_id,cloudId: $state.params.cloudId})
        }else{
          var cloudPath = ''
          for (var i = 0; i < $scope.cloudList.length; ++i) {
            if (notice.cloud_id == $scope.cloudList[i].cloud_id) {//在所属团队列表中
              switchCloud(notice.cloud_id)
              if(notice.obj_type=="file"){
                cloudPath = 'index.html#/'+ notice.cloud_id +'/files/'+notice.folder_id + "?file_id=" + notice.obj_id + "&is_show_folder=1"
              }else{
                cloudPath = 'index.html#/'+ notice.cloud_id +'/files/'+notice.folder_id
              }
              //$window.open(cloudPath)
              Confirm.show({
                title: '切换团队',
                content: '消息不是当前团队的消息，是否切换？',
                ok: function($modalInstance) {
                  $window.open(cloudPath)
                  $modalInstance.close()
                }
              }) 
              return
              break
            }
          }
          //没有在所属团队中
          if($state.params.cloudId == cloudId){
            $state.go('files', {folderId: notice.folder_id,cloudId: $state.params.cloudId})
          }else{
            switchCloud(cloudId)
            if(notice.obj_type=="file"){
              cloudPath = 'index.html#/'+ cloudId +'/files/'+notice.folder_id + "?file_id=" + notice.obj_id + "&is_show_folder=1";
            }else{
              cloudPath = 'index.html#/'+ notice.cloud_id +'/files/'+notice.folder_id
            }
            //$window.open(cloudPath)
            Confirm.show({
              title: '切换团队',
              content: '消息不是当前团队的消息，是否切换？',
              ok: function($modalInstance) {
                $window.open(cloudPath)
                $modalInstance.close()
              }
            }) 
          }
          
        }
        
      }else{//新窗口打开对应链接
        var path = 'link.html#/'+ notice.cloud_id + '/'+ notice.share_key + '/0'
        $window.open(path);
      }
    }

  	//删除message
  	$scope.deleteMessage = function($event, message){
      $event.stopPropagation()
      Message.deleteMessage({
        id : message.id
      }).$promise.then(function() {
        if(message.type == 'notice'){
          for (var i = 0; i < $scope.noticeList.length; ++i) {
            if ($scope.noticeList[i].id == message.id) {
              $scope.noticeList.splice(i, 1)
              break
            }
          }
        }else{
          for (var i = 0; i < $scope.messageList.length; ++i) {
            if ($scope.messageList[i].id == message.id) {
              $scope.messageList.splice(i, 1)
              break
            }
          }
        }

        refreshMessage()
      }, function(error) {
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: error.data.result,
          closeable: false
        })
      })
    }

  	//当前用户ID
  	$scope.id = $cookies.userId

    $scope.user = Users.getUserInfo()

    $scope.user.$promise.then(function(user) {
      $scope.user.cloud_id = parseInt(user.cloud_id)
      if($state.params.cloudId == -1){//无团队        
        $window.document.title = "全携通"
      }else{
        $window.document.title = "全携通-" + user.cloud_name
      }
    })




    //重载用户头像
    $scope.$on('updateUserImg', function() {
      var avatar = $scope.user.avatar
      $scope.user.avatar = ''
      $scope.user.avatar = avatar + '&_=' + new Date().getTime()
    })

    //搜索文件或者文件夹
    function doSearch(searchFilesValue) {
      //特殊字符正则表达式
      var txt = new RegExp("[\\\\,\\:,\\*,\\/,\\?,\",\\<,\\>,\\|]")
      if(searchFilesValue == undefined || searchFilesValue.trim() == '' || txt.test(searchFilesValue)){
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: 'LANG_SEARCH_FILE_NOT_NULL',
          closeable: false
        })
        return
      }

      if(searchFilesValue && searchFilesValue.trim() != ''){
        $state.go('search', {
          keyword: searchFilesValue,
          cloudId: $state.params.cloudId
        })
      }
    }

    $scope.searchByKeyDown = function($event, searchFilesValue){
      if ($event.which === 13) {
        doSearch(searchFilesValue)
      }
    }

    $scope.searchByButton = doSearch

    //个人信息
    $scope.userInfoMenuOpen = false
    $scope.userInfoWin = function(){
      $scope.userInfoMenuOpen = !$scope.userInfoMenuOpen
      $state.go('settings.profile', {
        cloudId: $state.params.cloudId
      })
      // var userInfoModal = $modal.open({
      //   templateUrl: 'src/app/header/user-info/template.html',
      //   windowClass: 'user-info',
      //   backdrop: 'static',
      //   controller: 'App.Header.UserInfoController',
      //   resolve: {}
      // })

      // userInfoModal.result.then(function(real_name) {
      //   $scope.user.real_name = real_name
      // })
    }

    $scope.preventopenNoticeList = function($event){
      $event.stopPropagation()
    }

    //清空消息
    $scope.emptyMessage = function() {
      Message.emptyMessage({

      }, {
        type:'msg'
      }).$promise.then(function() {
        $scope.messageList = ""
        Notification.show({
          title: '成功',
          type: 'success',
          msg: '已清除所有消息',
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
    }

    //清空消息
    $scope.emptyNotice = function() {
      Message.emptyMessage({

      }, {
        type:'notice'
      }).$promise.then(function() {
        $scope.noticeList = ""
        Notification.show({
          title: '成功',
          type: 'success',
          msg: '已清除所有消息',
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
    }



  }
])