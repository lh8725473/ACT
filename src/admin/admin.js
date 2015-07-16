angular.module('App', [
  // Libs
  'ui.router',
  'ngGrid',
  'ui.bootstrap',
  'ngAnimate',
  'ngCookies',
  'pascalprecht.translate',
  'highcharts-ng',
  'perfect_scrollbar',
  'angularFileUpload',

  // Locales

  'App.Locales',

  // Config
  'App.Config',

  // Widget
  'App.Widgets',

  // global components
  'ACT.LoadingIndictor',

  // Components
  'App.Header',
  'App.Sidebar',
  'App.Overview',
  'App.Users',
  'App.Reports',
  'App.Settings',

  // Resources
  'App.Resources'

  // Http Interceptor
]).factory('httpInterceptor',[
  '$q',
  '$cookieStore',
  '$rootScope',
  'CONFIG',
  function(
    $q,
    $cookieStore,
    $rootScope,
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
          $cookieStore.removeCookie('token')
          window.location.href = CONFIG.LOGIN_PATH
        }
//      else if (rejection.status == 501) {
//        $rootScope.noRight = true
//        $rootScope.noRightMsg = rejection.data.result
//      }
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
  'CONFIG',
  function (
    $stateProvider,
    $urlRouterProvider,
    $httpProvider,
    CONFIG
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

    $urlRouterProvider.otherwise('/'+ readCookie('cloudId') +'/overview')
    $stateProvider
      .state('overview', {
        url: '/:cloudId/overview',
        templateUrl: 'src/admin/overview/template.html'
      })
      .state('users', {
        url: '/:cloudId/users',
        templateUrl: 'src/admin/users/template.html'
      })
      .state('users.managedUsers', {
        url: '/managedUsers?k',
        templateUrl: 'src/admin/users/managedUsers/template.html'
      })
      .state('users.editUser', {
        url: '/editUser/:id',
        templateUrl: 'src/admin/users/managedUsers/editUser/update-user-modal.html'
      })
      .state('users.externalUsers', {
        url: '/externalUsers',
        templateUrl: 'src/admin/users/externalUsers/template.html'
      })
      .state('users.editExternalUser', {
        url: '/editExternalUser/:id',
        templateUrl: 'src/admin/users/externalUsers/editExternalUser/update-externalUser-modal.html'
      })
      .state('users.groups', {
        url: '/groups',
        templateUrl: 'src/admin/users/groups/template.html'
      })
      .state('users.editGroup', {
        url: '/editGroup/:id',
        templateUrl: 'src/admin/users/groups/editGroup/update-group-modal.html'
      })
      .state('reports', {
        url: '/:cloudId/reports',
        templateUrl: 'src/admin/reports/template.html'
      })
      .state('settings', {
        url: '/:cloudId/settings',
        templateUrl: 'src/admin/settings/template.html'
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

    var cloudId;
    var queryString = window.location.toString().split("#");
    if (queryString.length > 1) {
      var params = queryString[1].split("/");
      cloudId = params[1]
    }

    $translate.use($cookieStore.readCookie('lang'))
    $http.defaults.headers.common['CLOUD_ID'] = cloudId
    $http.defaults.headers.common['HTTP_X_OAUTH'] = $cookies.token
  }
])
