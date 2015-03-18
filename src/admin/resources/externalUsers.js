angular.module('App.Resources').factory('ExternalUser', [
  '$resource',
  'CONFIG',
  function(
    $resource,
    CONFIG
  ) {
    return $resource(CONFIG.API_ROOT + '/share/externalUser/:id', {}, {
      query: {
        method: "GET",
        params: {
          _ : function(){
            return new Date().getTime()
          }
        },
        isArray: true
      },
      getExternalUserById: {
        method: "GET",
        params: {
          id : '',
          _ : function(){
            return new Date().getTime()
          }
        },
      },
      updateExternalUser: {
        method: "PUT",
        params: {
          id : ''
        },
      },
      'delete': {
        method: "DELETE",
        params: {
          id : ''
        }
      }
    })
  }
])
