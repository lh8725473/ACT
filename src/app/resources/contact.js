angular.module('App.Resources').factory('Contact', [
	'$resource',
	'CONFIG',
	function(
		$resource,
		CONFIG
	) {
		return $resource(CONFIG.API_ROOT + '/contact/:action/:id', {}, {
			getContactList: {
				method: "GET",
				params: {
					action: 'list'
				},
				isArray: true
			},
			addContact: {
				method: "POST",
				params: {
					action: 'create'
				}
			},
			updateContact: {
				method: "PUT",
				params: {
					action: 'update',
					id: 0
				}
			},
			deleteContact: {
				method: "DELETE",
				params: {
					action: 'delete',
					id: 0
				}
			}
		})
	}
])