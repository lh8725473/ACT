angular.module('App.Resources').factory('Share', [
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
      },
      getLink: {
        method: "POST",
        params: {
          action: 'getLink'
        }
      },
      deleteLink: {
        method: "DELETE",
        params: {
          action: 'deleteLink'
        }
      },
      update: {
        method: "PUT",
        params: {
          action: 'update',
          id : ''
        }
      },
      deleteShare: {
        method: "DELETE",
        params: {
          action: 'delete',
          id : ''
        }
      },
      sendLink: {
        method: "POST",
        params: {
          action: 'sendLink'
        }
      },
      viewLink: {
        method: "GET",
        params: {
          action: 'viewLink'
        }
      },
      linkList: {
        method: "GET",
        params: {
          action: 'linkList'
        },
        isArray: true
      },
      linkRecordList: {
        method: "GET",
        params: {
          action: 'linkRecordList'
        },
        isArray: true
      },
      deleteLinkRecord: {
        method: "delete",
        params: {
          action: 'deleteLinkRecord'
        }
      }
    })
  }
])