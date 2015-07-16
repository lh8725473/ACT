angular.module('App.Resources').factory('Message', [
  '$resource',
  'CONFIG',
  function(
    $resource,
    CONFIG
  ) {
    return $resource(CONFIG.API_ROOT + '/message/:action/:id', {}, {
      getUnreadMessagesCount : {
        method: "GET",
        params: {
          action: 'unreadCount'
        }
      },
      getMessageList : {
        method: "GET",
        params: {
          action: 'inboxList',
          type : 'msg'
        },
        isArray: true
      },
      getNoticeList : {
        method: "GET",
        params: {
          action: 'inboxList',
          type : 'notice'
        },
        isArray: true
      },
      toIsRead : {
        method: "GET",
        params: {
          action: 'view',
          id : ''
        }
      },
      deleteMessage : {
        method: "DELETE",
        params: {
          action: 'delete',
          id : ''
        }
      },
      emptyMessage : {
        method: "POST",
        params: {
          action: 'empty',
          id : ''
        }
      }
    })
  }
])