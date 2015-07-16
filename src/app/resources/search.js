angular.module('App.Resources').factory('Search', [
  '$resource',
  'CONFIG',
  function(
    $resource,
    CONFIG
  ) {
    return $resource(CONFIG.API_ROOT + '/Search', {}, {
      query: {
        method: "GET",
        isArray: true
      }
    })
  }
])