angular.module('App.Resources').factory('UserDiscuss', [
  '$resource',
  'CONFIG',
  function(
    $resource,
    CONFIG
  ) {
    return $resource(CONFIG.API_ROOT + '/userDiscuss/:action/:id', {}, {
      getUserDiscussList: {
        method: "GET",
        params: {
          action: 'list'
        },
        isArray: true
      },
      createUserDiscuss: {
        method: "POST",
        params: {
          action: 'create'
        }
      },
      deleteUserDiscuss: {
        method: "DELETE",
        params: {
          action: 'delete'
        }
      },
      folderList: {
        method: "GET",
        params: {
          action: 'folderList'
        },
        isArray: true
      },
      blockList: {
        method: "GET",
        params: {
          action: 'blockList'
        },
        isArray: true
      },
      List: {
        method: "GET",
        params: {
          action: 'list'          
        },
        isArray: true
      },
       deleteFolderList: {
        method: "POST",
        params: {
          action: 'delete'
        }
      },
    })
  }
])

