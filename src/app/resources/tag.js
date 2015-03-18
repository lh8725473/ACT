angular.module('App.Resources').factory('Tag', [
  '$resource',
  'CONFIG',
  function(
    $resource,
    CONFIG
  ) {
    return $resource(CONFIG.API_ROOT + '/tag/:action/:tag_id', {}, {
      createTag: {
        method: "POST",
        params: {
          action: 'create'
        }
      },
      deleteTag: {
        method: "DELETE",
        params: {
          action: 'delete'
        }
      }
    })
  }  
])