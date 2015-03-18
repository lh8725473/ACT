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
      sendEmail: {
        method: "POST",
        params: {
          action: 'sendEmail'
        }
      },
      viewLink: {
        method: "GET",
        params: {
          action: 'viewLink'
        }
      }
    })
  }
])