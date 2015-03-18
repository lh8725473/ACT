angular.module('App.Resources').factory('Folders', [
  '$resource',
  'CONFIG',
  function(
    $resource,
    CONFIG
  ) {
    return $resource(CONFIG.API_ROOT + '/folder/:action/:folder_id', {}, {
      getFolderPath: {
        method: "GET",
        params: {
          action: 'path',
          folder_id: 0
        },
        isArray: true
      }
    })
  }  
])