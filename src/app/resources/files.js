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
      createNote:{
        method: "POST",
        params: {
          action: 'createNote'
        }
      },
      saveNote:{
        method: "POST",
        params: {
          action: 'saveNote'
        }
      },
      getNote:{
        method: "GET",
        params: {
          action: 'getNote',
          file_id: 'file_id'
        }
      },
      view:{
        method: "GET",
        params: {
          action: 'view',
          file_id: ''
        }
      },
      deleteFile: {
        method: "DELETE",
        params: {
          action: 'delete',
          file_id: ''
        }
      },
      deleteFileList: {
        method: "POST",
        params: {
          action: 'delete'
        }
      },
      moveFileList: {
        method: "PUT",
        params: {
          action: 'move'
        }
      },
      copyFileList: {
        method: "PUT",
        params: {
          action: 'copy'
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
      },
      history:{
        method: "GET",
        params: {
          action: 'history',
          file_id: ''
        },
        isArray: true
      },
      revertFileVersion:{
        method: "PUT",
        params: {
          action: 'revert',
          file_id: '',
          version_id: '@version_id'
        }
      }
    })
    angular.extend(Files, {
      preview: function(file_id, refresh, version_id) {
        var deferred = $q.defer();
        var param = (refresh == true)?'?refresh=true':'';
        if(version_id){
          if(param == ''){
            param = '?version_id=' + version_id;
          }
          else{
            param += '&version_id=' + version_id;
          }
        }
        $http({
          url: CONFIG.API_ROOT + '/file/preview/' + file_id + param,
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
