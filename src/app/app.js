var appModule = angular.module('App', [
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
  'App.Discussion',
  'App.Links',
  'App.Contacts',
  'App.Trash',
  'App.Search',
  'App.Note',
  'App.Settings',
  'App.UploadProgressDialog'

]);

// Http Interceptor
appModule.factory('httpInterceptor',[
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
          language = (language === null || language === undefined) ? 'zh-CN' : language //默认为中文
          var returnUrl = window.location.toString()
          var folderId = $injector.get('$state').params.folderId
          var cloudId = $injector.get('$state').params.cloudId
          var path = '#returnUrl=' + encodeURIComponent(returnUrl)
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
]);

appModule.config(['$provide', function($provide) {
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
}]);

appModule.config([
  '$stateProvider',
  '$urlRouterProvider',
  '$httpProvider',
  '$translateProvider',
  'CONFIG',
  '$injector',
  function (
    $stateProvider,
    $urlRouterProvider,
    $httpProvider,
    CONFIG,
    $injector
  ) {

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

    $urlRouterProvider.otherwise('/'+ readCookie('cloudId') + '/files/0')
    $stateProvider
      .state('index.updates', {
        url: '/:cloudId/updates',
        templateUrl: 'src/app/updates/template.html'
      })
      .state('links', {
        url: '/:cloudId/links',
        templateUrl: 'src/app/links/template.html'
      })

      .state('links.myLinks', {
        url: '/myLinks',
        templateUrl: 'src/app/links/myLinks/template.html'
      })
      .state('links.linkRecord', {
        url: '/linkRecord',
        templateUrl: 'src/app/links/link-record/template.html'
      })
      .state('files', {
        url: '/:cloudId/files/:folderId?lang&file_id&is_show_folder',
        templateUrl: 'src/app/files/template.html'
      })
      .state('discussion', {//讨论功能
        url: '/:cloudId/discussion',
        templateUrl: 'src/app/discussion/template.html'
      })
      .state('discussion.folderList', {
        url: '/folderList',
        templateUrl: 'src/app/discussion/folderList/template.html'
      })
      .state('discussion.blockedDiscussion', {
        url: '/blockedDiscussion',
        templateUrl: 'src/app/discussion/blockedDiscussion/template.html'
      })
      
      .state('contacts', {
        url: '/:cloudId/contacts',
        templateUrl: 'src/app/contacts/template.html'
      })
      .state('trash', {
        url: '/:cloudId/trash',
        templateUrl: 'src/app/trash/template.html'
      })
      .state('settings', {
        url: '/:cloudId/setting',
        templateUrl: 'src/app/settings/template.html'
      })
      .state('settings.profile', {
        url: '/profile',
        templateUrl: 'src/app/settings/profile/template.html'
      })
      .state('settings.security', {
        url: '/security',
        templateUrl: 'src/app/settings/security/template.html'
      })
      .state('settings.notification', {
        url: '/notification',
        templateUrl: 'src/app/settings/notification/template.html'
      })
      .state('settings.team', {
        url: '/team',
        templateUrl: 'src/app/settings/team/template.html'
      })
      .state('note', {
        url: '/:cloudId/note/:fileId?folderId&isNew',
        templateUrl: 'src/app/note/template.html'
      })
      .state('search', {
        url: '/:cloudId/search?keyword',
        templateUrl: 'src/app/search/template.html'
      })

    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    $httpProvider.interceptors.push('httpInterceptor')
  }
]);

appModule.run([
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
    var cloudId;
    var queryString = window.location.toString().split("#");
    if (queryString.length > 1) {
      var url_start = queryString[0];

      var params = queryString[1].split("/");
      cloudId = params[1];
      if(cloudId <= 0 ){
        params[1] = $cookieStore.readCookie('cloudId');
        url = url_start + '#' + params.join("/");
        window.location.href = url;

        cloudId = $cookieStore.readCookie('cloudId');
      }
      
    }
    if($cookieStore.readCookie('lang') == null){//默认语言
      $translate.use('zh-CN');
    }else{
      $translate.use($cookieStore.readCookie('lang'))
    }
    $http.defaults.headers.common['CLOUD_ID'] = cloudId
    $http.defaults.headers.common['HTTP_X_OAUTH'] = ($cookies.token) ? $cookies.token : $cookies.accessToken
  }
]);

//loading效果，最多等待2秒中
appModule.controller('App.Controller', [
  '$scope',
  '$timeout',
  function(
    $scope,
    $timeout
  ){
    $scope.global_loading = true

    $timeout(function() {
      $scope.global_loading = false
    }, 2000)
  }
]);
