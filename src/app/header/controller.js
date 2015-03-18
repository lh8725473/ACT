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
    Cloud
  ) {
    //检查浏览器环境
    Utils.checkEnvironment()
    $cookieStore.removeCookie('accessToken')
    //语言切换
    //$translate.use($cookieStore.readCookie('lang'));
    //默认语言
    //  if(!$cookieStore.readCookie('lang')){
    //    $translate.use('zh-CN');
    //  }

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
  	  window.location.href = "admin.html"
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
  	$scope.openMessageList = function(){
  	  $scope.no_message = false
  	  $scope.loading = true
  	  $scope.message_show = true
  	  $scope.notice_show = false
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
  	  var discuss_file = {
  	    file_name : message.obj_name,
  	    folder_id : message.folder_id,
  	    file_id : message.obj_id,
  	    permission : message.permission,
        version_count : message.version_count,
        discuss_count : message.discuss_count
  	  }
  	  var is_download = discuss_file.permission.substring(5, 6) //下载权限
      discuss_file.is_download = (is_download == '1') ? true : false
  	  $rootScope.$broadcast('discuss_file', discuss_file, 'dis')
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
  	$scope.openNoticeList = function(){
  	  $scope.no_notice = false
  	  $scope.loading = true
  	  $scope.message_show = false
      $scope.notice_show = true
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

    //路由改变调到对应的文件夹
    $scope.goToFolder = function(folderId) {
      $state.go('files', {folderId: folderId})
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
        Notification.show({
          title: '成功',
          type: 'success',
          msg: "LANG_HEADER_MESSAGE_DELETE_SUCCESS",
          closeable: true
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

  	//当前用户ID
  	$scope.id = $cookies.userId

    $scope.user = Users.getUserById({id: $scope.id})

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
          key: searchFilesValue
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
      var userInfoModal = $modal.open({
        templateUrl: 'src/app/header/user-info/template.html',
        windowClass: 'user-info',
        backdrop: 'static',
        controller: 'App.Header.UserInfoController',
        resolve: {}
      })

      userInfoModal.result.then(function(real_name) {
        $scope.user.real_name = real_name
      })
    }

    $scope.preventopenNoticeList = function($event){
      $event.stopPropagation()
    }
  }
])