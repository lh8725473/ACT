angular.module('App.Resources').factory('Trash', [
  '$resource',
  'CONFIG',
  function(
    $resource,
    CONFIG
  ) {
    return $resource(CONFIG.API_ROOT + '/recycle/:action', {}, {
      getRecycleList: {
        method: "GET",
        params: {
          action: 'list'
        },
        isArray: true
      },
      revertRecycle: {
        method: "PUT",
        params: {
          action: 'revert'
        }
      },
      deleteRecycle: {
        method: "DELETE",
        params: {
          action: 'delete'
        }
      },
      emptyRecycle: {
        method: "DELETE",
        params: {
          action: 'empty'
        }
      }
    })
  }
])