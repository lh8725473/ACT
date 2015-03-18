angular.module('App.Resources').factory('UserDiscuss', [
  '$resource',
  'CONFIG',
  function(
    $resource,
    CONFIG
  ) {
    return $resource(CONFIG.API_ROOT + '/userDiscuss/:action/:id', {}, {
      getUserDiscussList: {
        method: "GET",
        params: {
          action: 'list',
          obj_id : 0
        },
        isArray: true
      },
      createUserDiscuss: {
        method: "POST",
        params: {
          action: 'create',
          obj_id : 0
        }
      },
      deleteUserDiscuss: {
        method: "DELETE",
        params: {
          action: 'delete',
          id : ''
        }
      }
    })
  }
])