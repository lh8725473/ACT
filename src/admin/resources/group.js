angular.module('App.Resources').factory('Group', [
  '$resource',
  'CONFIG',
  function(
    $resource,
    CONFIG
  ) {
    return $resource(CONFIG.API_ROOT + '/group/:action/:id', {}, {
      query: {
        method: "GET",
        params: {
          action: 'list',
          _ : function(){
            return new Date().getTime()
          }
        },
        isArray: true
      },
      getGroupById: {
        method: "GET",
        params: {
          action: 'view',
          id : '',
          _ : function(){
            return new Date().getTime()
          }
        }
      },
      'delete': {
        method: "DELETE",
        params: {
          action: 'delete',
          id : 0
        }
      },
      create: {
        method: "POST",
        params: {
          action: 'create'
        }
      },
      update: {
        method: "PUT",
        params: {
          action: 'update',
          id : 0
        }
      }
    })
  }
])