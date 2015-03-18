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
  'ng-umeditor',

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
        // Handle Request error
        if(rejection.status == 401){//401 token 无效
          window.location.href = CONFIG.LOGIN_PATH
        }
        return $q.reject(rejection)
      }
    }
  }
]).config([
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
        url: '/:key/:folderId',
        templateUrl: 'src/link-share/main/template.html'
      })
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    $httpProvider.interceptors.push('httpInterceptor')

    $translateProvider.preferredLanguage('zh-CN');
  }
]).run([
  '$http',
  '$cookies',
  '$rootScope',
  '$translate',
  function(
    $http,
    $cookies,
    $rootScope,
    $translate
  ) {
    $http.defaults.headers.common['HTTP_X_OAUTH'] = $cookies.token
    $rootScope.$on('$translatePartialLoaderStructureChanged', function() {
      $translate.refresh();
    });
  }
])
