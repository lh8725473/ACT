angular.module('App.Resources').factory('FolderAction', [
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
      },
      createFolder: {
        method: "POST",
        params: {
          action: 'create'
        }
      },
      deleteFolder: {
        method: "DELETE",
        params: {
          action: 'delete',
          folder_id : ''
        }
      },
      updateFolder:{
      	method: "PUT",
        params: {
          action: 'update',
          folder_id: ''
        }
      },
      quit: {
        method: "PUT",
        params: {
          action: 'quit',
          folder_id: ''
        }
      }
    })
  }
])