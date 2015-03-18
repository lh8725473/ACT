angular.module('App.Resources').factory('ShareAction', [
  '$resource',
  'CONFIG',
  function(
    $resource,
    CONFIG
  ) {
    return $resource(CONFIG.API_ROOT + '/share/:action/:id', {}, {
      createShare: {
        method: "POST",
        params: {
          action: 'create'
        }
      }
    })
  }  
])