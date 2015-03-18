angular.module('App.Resources').factory('Share', [
  '$resource',
  'CONFIG',
  function(
    $resource,
    CONFIG
  ) {
    return $resource(CONFIG.API_ROOT + '/share/:action', {}, {
      query: {
        method: "GET",
        params: {
          action: 'folderList',
          _ : function(){
            return new Date().getTime()
          }
        },
        isArray: true
      }
    })
  }
])