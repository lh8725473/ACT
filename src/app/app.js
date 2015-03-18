angular.module('App', [
  // Libs
  'ui.router',
  'ngGrid',
  'ui.bootstrap',
  'ngAnimate',
  'ngCookies',
  'perfect_scrollbar',
  'pascalprecht.translate',
  'ng-context-menu',
  'ng-left-context-menu',
  'angularFileUpload',
  'ngSanitize',
  'angularTreeview',
  'snap',
  'pageslide-directive',
  'ui.select2',
  'Act.at',
  'ngSocket',
  'ngHighLightText',
  'ngzTree',
  'ng-umeditor',
  'angular-flexslider',

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
  'App.Updates',
  'App.Files',
  'App.Contacts',
  'App.Trash',
  'App.Search',
  'App.Note',
  'App.UploadProgressDialog'


  // Http Interceptor
]).factory('httpInterceptor',[
  '$q',
  '$cookieStore',
  'CONFIG',
  '$injector',
  function(
    $q,
    $cookieStore,
    CONFIG,
    $injector
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
        // Handle Request error
        if(rejection.status == 401){//401 token 无效
          $cookieStore.removeCookie('token')
          var language = $injector.get('$state').params.lang
          language = (language === null) ? 'zh-CN' : language //默认为中文
          var folderId = $injector.get('$state').params.folderId
          var path = '#folderId=' + folderId
          if(language === 'zh-CN'){
            window.location.href = CONFIG.LOGIN_PATH + path
          }else{
            window.location.href = CONFIG.LOGIN_PATH_EN + path
          }
        }
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
  'CONFIG',
  function (
    $stateProvider,
    $urlRouterProvider,
    $httpProvider,
    CONFIG
  ) {
    $urlRouterProvider.otherwise('/files/')
    $stateProvider
      .state('updates', {
        url: '/updates',
        templateUrl: 'src/app/updates/template.html'
      })
      .state('files', {
        url: '/files/:folderId?lang',
        templateUrl: 'src/app/files/template.html'
      })
      .state('contacts', {
        url: '/contacts',
        templateUrl: 'src/app/contacts/template.html'
      })
      .state('trash', {
        url: '/trash',
        templateUrl: 'src/app/trash/template.html'
      })
      .state('note', {
        url: '/note/:fileId?folderId&isNew',
        templateUrl: 'src/app/note/template.html'
      })
      .state('search', {
        url: '/search/:key',
        templateUrl: 'src/app/search/template.html'
      })

    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    $httpProvider.interceptors.push('httpInterceptor')
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
    if($cookieStore.readCookie('lang') == null){//默认语言
      $translate.use('zh-CN');
    }else{
      $translate.use($cookieStore.readCookie('lang'))
    }
    $http.defaults.headers.common['HTTP_X_OAUTH'] = ($cookies.token) ? $cookies.token : $cookies.accessToken
  }
])
