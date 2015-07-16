angular.module('App.Header').controller('App.Header.Controller', [
	'$scope',
	'$state',
	'CONFIG',
	'$translate',
	'$rootScope',
	'Cloud',
	function(
		$scope,
		$state,
		CONFIG,
		$translate,
		$rootScope,
		Cloud
	) {

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

		$scope.backToindex = function() {
			window.location.href = 'index.html#/'+ $state.params.cloudId + '/files/0'
		}

		$scope.changeLanguage = function(key) {
			$translate.use(key);
		};

		//搜索内部用户
		function doSearch(searchInputValue) {
			$state.go('users.managedUsers', {
        cloudId: $state.params.cloudId,
				k: searchInputValue
			})
		}

		$scope.searchByKeyDown = function($event, searchInputValue) {
			if ($event.which === 13) {
				doSearch(searchInputValue)
			}
		}

		$scope.searchByButton = doSearch
	}
])