angular.module('App.Resources').factory('OverView', [
  '$resource',
  'CONFIG',
  function(
    $resource,
    CONFIG
  ) {
    return $resource(CONFIG.API_ROOT + '/cloud/:action', {}, {
      loginCount: {
        method: "GET",
        params: {
          action: 'loginCount',
          _ : function(){
            return new Date().getTime()
          }
        }
      },
      loginRank: {
        method: "GET",
        params: {
          action: 'loginRank',
          _ : function(){
            return new Date().getTime()
          }
        },
        isArray: true
      },
      loginTrend: {
        method: "GET",
        params: {
          action: 'loginTrend',
          _ : function(){
            return new Date().getTime()
          }
        }
      },
      spaceTrend: {
        method: "GET",
        params: {
          action: 'spaceTrend',
          _ : function(){
            return new Date().getTime()
          }
        }
      },
      spaceRank: {
        method: "GET",
        params: {
          action: 'spaceRank',
          _ : function(){
            return new Date().getTime()
          }
        },
        isArray: true
      },
      spaceInfo: {
        method: "GET",
        params: {
          action: 'spaceInfo',
          _ : function(){
            return new Date().getTime()
          }
        }
      }
    })
  }
])