angular.module('App.Resources').factory('Cloud', [
  '$resource',
  'CONFIG',
  function(
    $resource,
    CONFIG
  ) {
    return $resource(CONFIG.API_ROOT + '/cloud/:action', {}, {
      userLogList: {
        method: "GET",
        params: {
          action: 'userLog',
          _ : function(){
            return new Date().getTime()
          }
        },
        isArray: true
      },
      checkPackage: {
        method: "GET",
        params: {
          action: 'checkPackage'
        },
        isArray: false
      },
      info: {
        method: "GET",
        params: {
          action: 'info'
        }
      },
      updateInfo: {
        method: "PUT",
        params: {
          action: 'info'
        }
      },
      getPackage: {
        method: "GET",
        params: {
          action: 'package'
        },
        isArray: true
      }
    })
  }
])