angular.module('App.Resources').factory('Cloud', [
  '$resource',
  'CONFIG',
  function(
    $resource,
    CONFIG
  ) {
    return $resource(CONFIG.API_ROOT + '/cloud/:action?folder_id=:folder_id', {}, {
      cloudUserList: {
        method: "GET",
        params: {
          action: 'userList',
          folder_id : 0
        },
        isArray: false
      }
    })
  }  
])