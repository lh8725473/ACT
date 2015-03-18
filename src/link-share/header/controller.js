angular.module('App.Header').controller('App.Header.Controller', [
  '$scope',
  '$translatePartialLoader',
  'CONFIG',
  'Users',
  '$cookies',
  '$cookieStore',
  '$timeout',
  '$modal',
  function(
    $scope,
    $translatePartialLoader,
    CONFIG,
    Users,
    $cookies,
    $cookieStore,
    $timeout,
    $modal
  ) {
    $scope.toLogin = function(){
      window.location.href = "login.html"
    }

  	$scope.toadmin = function(){
  	  window.location.href = "admin.html"
  	}

  	$scope.toregist = function(){
      window.location.href = "regist.html"
    }

  	$scope.id = $cookies.userId

//  $scope.user = Users.getUserById({id: $scope.id})
//
//  //个人信息
//  $scope.userInfoWin = function(){
//    var userInfoModal = $modal.open({
//      templateUrl: 'src/app/header/user-info/template.html',
//      windowClass: 'user-info',
//      backdrop: 'static',
//      controller: 'App.Header.UserInfoController',
//      resolve: {}
//    })
//  }
  }
])