angular.module('App.Resources').factory('Cloud', [
	'$resource',
	'CONFIG',
	function(
		$resource,
		CONFIG
	) {
		return $resource(CONFIG.API_ROOT + '/cloud/:action', {}, {
			cloudUserList: {
				method: "GET",
				params: {
					action: 'userList'
				},
				isArray: false
			},
			checkPackage: {
        method: "GET",
        params: {
          action: 'checkPackage'
        },
        isArray: false
      },
      cloudList: {
        method: "GET",
        params: {
          action: 'list'
        },
        isArray: true
      },
      switch: {
        method: "POST",
        params: {
          action: 'switch'
        }
      }
		})
	}
])