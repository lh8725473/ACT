angular.module('App', [
  // Libs
  'ui.router',
  'ui.bootstrap',
  'ngAnimate',
  'ngCookies',
  'pascalprecht.translate',
  'angular-md5',
  'angularFileUpload',
  'perfect_scrollbar',

  // global components
  'ACT.LoadingIndictor',

  // Locales
  'App.Locales',

  // Config
  'App.Config',

  // Resources
  'App.Resources',

  // Widget
  'App.Widgets',

  // Components
  'App.Header',
  'App.Sidebar',
  'App.UploadProgressDialog',
  'App.LinkShare'


  // Http Interceptor
]).factory('httpInterceptor',[
  '$q',
  'CONFIG',
  function(
    $q,
    CONFIG
  ) {
    return {
      request: function(config) {
        // do something on success
        var d = config.url.length - '.html'.length
        if (!(d >= 0 && config.url.lastIndexOf('.html') == d)) { //是否以.html结尾
          if (config.method == 'GET') { //get请求加入随机参数防止缓存
            var separator = config.url.indexOf('?') === -1 ? '?' : '&'
            config.url = config.url + separator + '_=' + new Date().getTime()
          }
        }
        return config
      },
      response: function(response) {
        if (response.data.result) {
          response.data = response.data.result
        }
        return response
      },
      responseError: function(rejection) {
        // // Handle Request error
        // if(rejection.status == 401){//401 token 无效
        //   window.location.href = CONFIG.LOGIN_PATH
        // }
        return $q.reject(rejection)
      }
    }
  }
]).config(['$provide', function($provide) {
  $provide.decorator('$cookieStore', ['$delegate', function($delegate) {
    function createCookie(name, value, days) {
      if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = '; expires=' + date.toGMTString();
      } else {
        var expires = '';
      }
      document.cookie = name + '=' + value + expires + '; path=/';
    }

    function readCookie(name) {
      var nameEQ = name + '=';
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) == 0) {
          return c.substring(nameEQ.length, c.length);
        }
      }
      return null;
    }

    function removeCookie(name) {
      createCookie(name, '', -1);
    }

    $delegate.createCookie = createCookie
    $delegate.readCookie = readCookie
    $delegate.removeCookie = removeCookie

    return $delegate
  }])
}]).config([
  '$stateProvider',
  '$urlRouterProvider',
  '$httpProvider',
  '$translateProvider',
  '$translatePartialLoaderProvider',
  'CONFIG',
  function (
    $stateProvider,
    $urlRouterProvider,
    $httpProvider,
    $translateProvider,
    CONFIG
  ) {
    $urlRouterProvider.otherwise('/')
    $stateProvider
      .state('shares', {
        url: '/:cloudId/:key/:folderId',
        templateUrl: 'src/link-share/main/template.html'
      })
      .state('preview', {
        url: '/:cloudId/preview/:key/:fileId/:folderId',
        templateUrl: 'src/link-share/main/link_preview.html'
      })
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    $httpProvider.interceptors.push('httpInterceptor')

    // $translateProvider.preferredLanguage('zh-CN');
  }
]).run([
  '$http',
  '$cookies',
  '$cookieStore',
  '$rootScope',
  '$translate',
  function(
    $http,
    $cookies,
    $cookieStore,
    $rootScope,
    $translate
  ) {
    // $http.defaults.headers.common['HTTP_X_OAUTH'] = $cookies.token
    // $rootScope.$on('$translatePartialLoaderStructureChanged', function() {
    //   $translate.refresh();
    // });
    var cloudId;
    var queryString = window.location.toString().split("#");
    if (queryString.length > 1) {
      var params = queryString[1].split("/");
      cloudId = params[1]
    }
    
    $http.defaults.headers.common['CLOUD_ID'] = cloudId
    if($cookieStore.readCookie('lang') == null){//默认语言
      $translate.use('zh-CN');
    }else{
      $translate.use($cookieStore.readCookie('lang'))
    }
  }
]).controller('App.Controller', [
  '$scope',
  function(
    $scope
  ) {
    $scope.global_loading = true;
    $scope.$on('global_loading', function($event) {
      $scope.global_loading = false;
    })
  }
]);