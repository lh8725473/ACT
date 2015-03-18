angular.module('App.Resources').factory('DownLoadFile', [
  '$resource',
  'CONFIG',
  function(
    $resource,
    CONFIG
  ) {
    return $resource(CONFIG.API_ROOT + '/file/get/:file_id', {}, {
      downLoadFile: {
        method: "GET",
        params: {
          file_id: 0
        }
      }
    })
  }  
])