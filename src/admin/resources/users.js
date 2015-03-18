angular.module('App.Resources').factory('Users', [
  '$resource',
  'CONFIG',
  function(
    $resource,
    CONFIG
  ) {
    return $resource(CONFIG.API_ROOT + '/user/:action/:id', {}, {
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
      getUserById: {
        method: "GET",
        params: {
          action: 'view',
          id : '',
          _ : function(){
            return new Date().getTime()
          }
        },
      },
      'delete': {
        method: "DELETE",
        params: {
          action: 'delete',
          id : ''
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
          id : ''
        }
      },
      getSpaceinfo: {
        method: "GET",
        params: {
          action: 'spaceinfo',
          _ : function(){
            return new Date().getTime()
          }
        }
      },
      reinvite: {
        method: "POST",
        params: {
          action: 'reinvite'
        }
      }
    })
  }
])