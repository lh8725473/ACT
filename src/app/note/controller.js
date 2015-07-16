angular.module('App.Note').controller('App.Note.Controller', [
	'$scope',
	'CONFIG',
	'$sce',
	'$state',
	'Files',
	'$cookies',
	'$rootScope',
	'Notification',
	'$timeout',
	function(
		$scope,
		CONFIG,
		$sce,
		$state,
		Files,
		$cookies,
		$rootScope,
		Notification,
		$timeout
	) {
    //是否是编辑状态
    $scope.edit_flag = false;
    //是否是修改
    $scope.is_update = false;

    $scope.changeEdit = function(){
      $scope.edit_flag = !$scope.edit_flag;
      $scope.is_update = true;
    }

		//note所在folder_id
		var folder_id = $state.params.folderId
		var file_id = $state.params.fileId
		var is_new = $state.params.isNew

		if(is_new){
		  $scope.edit_flag = true
		}

    //note 上传功能imageUrl
		window.UMEDITOR_CONFIG.imageUrl = "/api/file/saveNoteImg?token="+$cookies.token+"&file_id="+file_id
		//note名字
		$scope.file_name = ''
		//note内容
    $scope.content = ''
    //note 对象
    var file = ''

		if (file_id != 0) {
      $scope.note = Files.getNote({
        file_id: file_id
      }).$promise.then(function(note){
        var is_download = note.permission.substring(5, 6) //下载权限
        note.is_download = (is_download == '1') ? true : false
        file = note
        var extStart = note.file_name.lastIndexOf(".")
        $scope.file_name = note.file_name.substring(0, extStart)
        $scope.content = note.file_content
        if($scope.editor){
          $scope.editor.setContent(note.file_content)
        }
        //编辑权限
        var is_edit = note.permission.substring(2, 3)
        $scope.is_edit = (is_edit == '1') ? true : false
      })
		}

    //ng-bind-html hack
		$scope.previewNote = function(){
		  return $sce.trustAsHtml($scope.content);
		}

    //打开讨论
		$scope.openUserDiscuss = function(){
		  $rootScope.$broadcast('discuss_file', file, 'dis')
		}

		$scope.goBack = function() {
		  $rootScope.$broadcast('closeDiscussPannel')
			$state.go('files', {cloudId: $state.params.cloudId, folderId: folder_id})
		}

    //保存note
		$scope.saveNote = function() {
		  $scope.content = $scope.editor.getContent()
      if($scope.file_name == ''){
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: 'LANG_NOTE_NAME_EMPTY',
          closeable: false
        })
        return
      }
      if($scope.content == ''){
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: 'LANG_NOTE_CONTENT_EMPTY',
          closeable: false
        })
        return
      }
      Files.saveNote({

      },{
        file_id: file_id,
        file_name: $scope.file_name,
        file_content: $scope.content
      }).$promise.then(function(r){
        file.file_name = r.file_name;
        if(is_new && !$scope.is_update) {
          Notification.show({
            title: '成功',
            type: 'success',
            msg: 'LANG_NOTE_PUBLISH_SUCCESS',
            closeable: true
          })
        } else {
          Notification.show({
            title: '成功',
            type: 'success',
            msg: 'LANG_NOTE_UPDATE_SUCCESS',
            closeable: true
          })
        }
        $scope.edit_flag = false
      }, function(error) {
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: error.data.result,
          closeable: false
        })
      })
      $rootScope.$broadcast('closeDiscussPannel')
		}

	}
])