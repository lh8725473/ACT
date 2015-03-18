angular.module('App.Resources').factory('Folders', [
  '$resource',
  'CONFIG',
  function(
    $resource,
    CONFIG
  ) {
    return $resource(CONFIG.API_ROOT + '/folder/:action/:folder_id', {}, {
      getObjList: {
        method: "GET",
        params: {
          action: 'objList',
          folder_id: 0
        },
        isArray: true
      },
      queryShareObj: {
        method: "GET",
        params: {
          action: 'userList',
          folder_id : 0
        },
        isArray: false
      },
      getTree: {
        method: "GET",
        params: {
          action: 'getTree'
        },
        isArray: true
      },
      update: {
        method: "PUT",
        params: {
          action: 'update',
          folder_id: 0
        }
      },
      updateGroup: {
        method: "PUT",
        params: {
          action: 'updateGroup',
          folder_id: 0
        }
      },
      deleteGroup: {
        method: "DELETE",
        params: {
          action: 'deleteGroup',
          folder_id: 0
        }
      },
      folderView: {
        method: "GET",
        params: {
          action: 'view',
          folder_id: 0
        }
      },
      setSync: {
        method: "POST",
        params: {
          action: 'setSync'
        }
      }
    })
  }
])