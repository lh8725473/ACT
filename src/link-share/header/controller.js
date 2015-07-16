angular.module('App.Header').controller('App.Header.Controller', [
  '$scope',
  '$translatePartialLoader',
  'CONFIG',
  'Users',
  '$cookies',
  '$cookieStore',
  '$timeout',
  '$modal',
  'Notification',
  '$http',
  '$rootScope',
  'Utils',
  '$state',
  '$timeout',
  '$translate',
  function(
    $scope,
    $translatePartialLoader,
    CONFIG,
    Users,
    $cookies,
    $cookieStore,
    $timeout,
    $modal,
    Notification,
    $http,    
    $rootScope,
    Utils,
    $state,
    $timeout,
    $translate
  ) {
    $timeout(function() {
      var b = Utils.browser()
      if(b.ios||b.iPhone||b.iPad||b.android){//手机设备访问
        window.location='wap-link.html?key='+ $state.params.key;
      }
    })

    //按回车键登录
    $scope.monitorKeyPress = function($event) {
      if ($event.keyCode === 13) {
        $scope.loginHandler();
      }
    }  

    //退出
    $scope.toSignOut = function () {
      $cookieStore.removeCookie('token')
      $cookieStore.removeCookie('userPic')
      $cookieStore.removeCookie('userId')
      $cookieStore.removeCookie('userType')
      $cookieStore.removeCookie('roleId')
      $cookieStore.removeCookie('userName');
      $cookieStore.removeCookie('realName');
      $cookieStore.removeCookie('cloudId');
      $cookieStore.removeCookie('remember');
      $scope.hasLogedIn = false;

      // 删除公共请求头
      $http.defaults.headers.common['HTTP_X_OAUTH'] = undefined;
    }

  	// $scope.toadmin = function(){
  	//   window.location.href = "admin.html"
  	// }

  	$scope.toregist = function(){
  	  window.location.href = "regist.html"
  	 
    }

    $scope.id = $cookies.userId

    $scope.hasLogedIn = $scope.id ? true : false;

    if($scope.hasLogedIn) {
      // 增加公共请求头
      $http.defaults.headers.common['HTTP_X_OAUTH'] = $cookieStore.readCookie('token');
      Users.getUserById({id: $scope.id}).$promise.then(function(user) {
        $scope.user = user;
      });
    }
  	

     //个人信息s
    // $scope.userInfoWin = function(){
    //   var userInfoModal = $modal.open({
    //    templateUrl: 'src/app/header/user-info/template.html',
    //    windowClass: 'user-info',
    //    backdrop: 'static',
    //    controller: 'App.Header.UserInfoController',
    //    resolve: {}
    //   })
    // }

    // log in
    $scope.loginHandler = function($modalInstance) {
      if (!$scope.userName) {
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: '请输入用户名',
          closeable: false
        })
        return false;
      }
      if (!$scope.userPassword) {
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: '请输入密码',
          closeable: false
        })
        return false;
      }
      var data = {
        'client_id' : 'JsQCsjF3yr7KACyT',
        'client_secret' : 'bqGeM4Yrjs3tncJZ',
        'user_name' : $scope.userName,
        'password' : $scope.userPassword,
        'response_type' : 'token',
        'grant_type' : 'password',
        'device_type' : '1',
        'device_name' : 'web',
        'device_info' : 'browser'         
      };
      Users.login(data).$promise.then(function(responseJSON){
        if(responseJSON.lang == 'zh-CN') {
          $translate.use('zh-CN');
          $cookieStore.createCookie('lang', 'zh-CN', 30);
        } else if(responseJSON.lang == 'en-EN') {
          $translate.use('en-EN');
          $cookieStore.createCookie('lang', 'en-EN', 30);
        }
        var token = responseJSON.access_token;
        var expiresin = responseJSON.expires_in;
        var user_name = responseJSON.user_name;
        var real_name = responseJSON.real_name;
        var user_pic = responseJSON.avatar;
        var user_id = responseJSON.user_id;
        var cloud_id = responseJSON.cloud_id;
        var role_id = responseJSON.role_id;
        if($scope.remember) {
          $cookieStore.createCookie('token', token, 30);
          $cookieStore.createCookie('userName', user_name, 30);
          $cookieStore.createCookie('realName', real_name, 30);
          $cookieStore.createCookie('userpic', user_pic, 30);
          $cookieStore.createCookie('userId', user_id, 30);
          $cookieStore.createCookie('userType', 'qxt', 30);
          $cookieStore.createCookie('cloudId', cloud_id, 30);
          $cookieStore.createCookie('roleId', role_id, 30);
          $cookieStore.createCookie('remember', true, 30);
        } else {
          $cookieStore.createCookie('token', token);
          $cookieStore.createCookie('userName', user_name, 30);
          $cookieStore.createCookie('realName', real_name);
          $cookieStore.createCookie('userPic', user_pic);
          $cookieStore.createCookie('userId', user_id);
          $cookieStore.createCookie('userType', 'qxt');
          $cookieStore.createCookie('cloudId', cloud_id);
          $cookieStore.createCookie('roleId', role_id);
          $cookieStore.createCookie('remember', false);
        }
        $scope.id = $cookieStore.readCookie('userId');
        $scope.hasLogedIn = $scope.id ? true : false;
        // 增加公共请求头
        $http.defaults.headers.common['HTTP_X_OAUTH'] = $cookieStore.readCookie('token');
        if($scope.hasLogedIn) {
          Users.getUserById({id: $scope.id}).$promise.then(function(user) {
            $scope.user = user;
          });
        }         
        // 记录访问过该链接
        $rootScope.$broadcast("addLinkRecord"); 
        if($modalInstance) {
          $modalInstance.close();
        }   
      }, function(xhr){
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: xhr.data.result,
          closeable: false
        })
        return false;
      });
    }

    $scope.$on("loginDelegate", function (event, userName, userPassword, remember, $modalInstance) {
      $scope.userName = userName;
      $scope.userPassword = userPassword;
      $scope.remember = remember;
      $scope.loginHandler($modalInstance);
    });

  }
])