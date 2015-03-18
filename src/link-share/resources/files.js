angular.module('App.Resources').factory('Files', [
  '$resource',
  '$http',
  '$sce',
  '$q',
  'CONFIG',
  function(
    $resource,
    $http,
    $sce,
    $q,
    CONFIG
  ) {
    var Files = $resource(CONFIG.API_ROOT + '/file/:action/:file_id', {}, {
      deleteFile: {
        method: "DELETE",
        params: {
          action: 'delete',
          file_id: ''
        }
      },
      updateFile:{
      	method: "PUT",
        params: {
          action: 'update',
          file_id: ''
        }
      },
      preview:{
      	method: "GET",
        params: {
          action: 'preview',
          file_id: ''
        }
      }
    })
    angular.extend(Files, {
      preview: function(file_id, key, pwd) {
        var deferred = $q.defer()
        $http({
          url: CONFIG.API_ROOT + '/share/key?act=preview&key=' + key + '&pwd=' + pwd + '&file_id=' + file_id,
          method: 'GET'
        }).then(function(response) {
          deferred.resolve($sce.trustAsHtml(response.data))
        }, function(err) {
          deferred.reject(err);
        })
        return deferred.promise;
      }
    })
    
    return Files
  }  
])
