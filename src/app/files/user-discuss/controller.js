angular.module('App.Files').controller('App.Files.UserDiscussController', [
	'$scope',
	'CONFIG',
	'Share',
	'UserDiscuss',
	'Users',
	'Files',
	'Utils',
	'$modal',
	'Folders',
	'$cookies',
	'Notification',
	'$timeout',
	'ngSocket',
	'Confirm',
	function(
		$scope,
		CONFIG,
		Share,
		UserDiscuss,
		Users,
		Files,
		Utils,
		$modal,
		Folders,
		$cookies,
		Notification,
		$timeout,
		ngSocket,
		Confirm
	) {
    //讨论输入框焦点
	  $scope.textareaFocus = false

    //ngSocket
	  var ws;

//  //检查socket连接
//  function checkSocket(){
//    if(ws.socket.readyState == 3){
//      console.log('连接socket失败')
//    }
//  }
//
//  //循环检查socket连接
//  function pollForSocket(){
//    checkSocket()
//    $timeout(pollForSocket, 10000)
//  }
//
//  pollForSocket()



		var discuss_file_id = $scope.discuss_file_id || 0;
		$scope.userDiscussList = UserDiscuss.getUserDiscussList({
			obj_id: discuss_file_id
		})

		//讨论tab 是否打开
		$scope.discussOpened = false

		//@配置
		var atWhoShown = false
		$scope.atOptions = {
			at: "@",
			data: [],
			limit: 5,
			start_with_space: false,//是否前面有空格
			onShown: function() {
				atWhoShown = true;
			},
			onHidden: function() {
				atWhoShown = false;
			}
		}

		//右侧菜单 讨论or版本
		$scope.navType = 'dis'
		$scope.changeNavType = function(navType) {
			$scope.navType = navType
		}

		function refreshDiscuss(discuss_file_id) {
			$scope.userDiscussList = UserDiscuss.getUserDiscussList({
				obj_id: discuss_file_id
			})

			$scope.userDiscussList.$promise.then(function(userDiscussList) {
				angular.forEach(userDiscussList, function(userDiscuss) {
				  if(userDiscuss.is_deleted != 'true'){
				    userDiscuss.content = Utils.replaceURLWithHTMLLinks(userDiscuss.content)
				    userDiscuss.content = Utils.highLightAtWhos(userDiscuss.content);
				  }
				  userDiscuss.content = userDiscuss.content.replace(/\n/g, "<br/>")
					if (userDiscuss.user_id == $cookies.userId) { //讨论是否是当前用户
						userDiscuss.is_owner = true
					}
				})
				$scope.loading = false
				$scope.discussOpened = true
			}, function(error) {
				Notification.show({
					title: '失败',
					type: 'danger',
					msg: error.data.result,
					closeable: false
				})
			})

		}

		//循环请求讨论消息
		function pollForDiscuss() {
			if ($scope.discussOpened) {
				refreshDiscuss(discuss_file_id)
			}
			//    $timeout(pollForDiscuss, 10000)
		}

		pollForDiscuss()

		//是否关闭websocket
		var reconnectTime;

		//监听讨论的文件ID
		$scope.$on('discuss_file', function($event, discuss_file, navType) {
      $scope.navType = navType;		  
		  ws = ngSocket('ws://' + CONFIG.SOCKET_HOST);
		  //定时断线重连websocket
		  reconnectTime = setInterval(function(){
		  	ws.reconnect(ws.socket.readyState)
		  }, 5000);
		  ws.onMessage(function (msg) {
        console.log(msg)
        var userDiscuss = angular.fromJson(msg.data)
        userDiscuss.content = Utils.replaceURLWithHTMLLinks(userDiscuss.content)
        userDiscuss.content = Utils.highLightAtWhos(userDiscuss.content);
        userDiscuss.content = userDiscuss.content.replace(/\n/g, "<br/>")
        userDiscuss.avatar = CONFIG.API_ROOT + '/user/avatar/' + userDiscuss.user_id + '?token=' + $cookies.token
        if(userDiscuss.user_id == $cookies.userId){//是否是当前用户
          userDiscuss.is_owner = true
        }
        if(discuss_file_id == userDiscuss.file_id && userDiscuss.user_id != $cookies.userId){//是否是当前文件and 不是当前用户
          $scope.userDiscussList.push(userDiscuss)
        }
      })

		  ws.onOpen(function(){
        ws.send({
          file_id : discuss_file.file_id,
          token : $cookies.token,
          type : 'login',
          name : 'xx'
        })
      })
		  $scope.discuss_file = discuss_file;
		  $scope.is_edit = $scope.discuss_file.permission.substring(2, 3); //编辑权限
			$scope.loading = true
			discuss_file_id = discuss_file.file_id
			$scope.discussContent = ''
			if (discuss_file_id) {
				refreshDiscuss(discuss_file_id)
				//历史版本
				$scope.fileHistoryList = Files.history({
					file_id: discuss_file_id
				})

				//讨论的文件
				$scope.file = discuss_file

				//文件关联的协作人
				var fileType = Utils.getFileTypeByName($scope.file.file_name)
				$scope.isPreview = (fileType && fileType != 'note') ? true : false
				if ($scope.file.folder_id != 0) {
					$scope.shareObj = Folders.queryShareObj({
						folder_id: $scope.file.folder_id
					})
					$scope.shareObj.$promise.then(function(shareObj) {
						var userNameList = []
						$scope.userList = shareObj.list.users
						$scope.groupList = shareObj.list.groups
						angular.forEach($scope.userList, function(user) {
							userNameList.push(user.real_name)
						})
						angular.forEach($scope.groupList, function(group) {
							angular.forEach(group.users, function(user) {
								userNameList.push(user.real_name)
							})
						})
						$scope.atOptions.data = userNameList
					})
				}

			}
		})

		//回复讨论
		$scope.replyUserDiscuss = function(userDiscuss) {
			$scope.discussContent = $scope.discussContent + '@' + userDiscuss.real_name + ' '
			$scope.textareaFocus = true
		}

		//讨论发表内容
		$scope.discussContent = ''
		//讨论字数
		$scope.discussCount = 0
		//发表按钮是否隐藏
		$scope.discussButton = true

		//发表按钮
		$scope.postbtn = 'LANG_FILE_POST'

		//是否允许提交
		var createFlag = true

    //讨论文本是否可编辑
		$scope.textareaDisabled = false

		//发表讨论
		$scope.createUserDiscuss = function($event) {
		  $scope.textareaDisabled = true
			$scope.discussButton = true
			$event.stopPropagation()
			$event.preventDefault()
			//本人发送信息
			var sendUserDiscuss = {
			  format_date : Utils.formateTime(new Date(), "yyyy/MM/dd hh:mm"),
			  real_name : $cookies.realName,
			  content : $scope.discussContent,
			  user_id : $cookies.userId,
			  id : 0,
			  avatar: CONFIG.API_ROOT + '/user/avatar/' + $cookies.userId + '?token=' + $cookies.token
			}
      sendUserDiscuss.is_owner = true
      sendUserDiscuss.content = sendUserDiscuss.content.replace(/\n/g, "<br/>")
      sendUserDiscuss.content = Utils.replaceURLWithHTMLLinks(sendUserDiscuss.content)
      sendUserDiscuss.content = Utils.highLightAtWhos(sendUserDiscuss.content);
			$scope.userDiscussList.push(sendUserDiscuss)
//			$scope.postbtn = 'LANG_FILE_POSTING'
			UserDiscuss.createUserDiscuss({
				obj_id: discuss_file_id
			}, {
				content: $scope.discussContent
			}).$promise.then(function(userDiscuss) {
				//discuss count ++
				$scope.discuss_file.discuss_count = parseInt($scope.discuss_file.discuss_count) + 1;
			  sendUserDiscuss.id = userDiscuss.id
			  $scope.textareaDisabled = false
				createFlag = true
				$scope.postbtn = 'LANG_FILE_POST'
				$scope.discussCount = 0
				userDiscuss.is_owner = true
				ws.send({
          file_id : discuss_file_id,
          token : $cookies.token,
          format_date : userDiscuss.format_date,
          real_name : userDiscuss.real_name,
          content : userDiscuss.content,
          user_id : userDiscuss.user_id,
          id : userDiscuss.id,
          "type":"send",
          "to_client_id":"all"
        })

//				$scope.userDiscussList.push(userDiscuss)
			}, function(error) {
				var errorText = (error.data.result == undefined) ? 'NETWORK_ERROR' : error.data.result
			  $scope.textareaDisabled = false
				$scope.postbtn = 'LANG_FILE_POST'
				createFlag = true
				Notification.show({
					title: '失败',
					type: 'danger',
					msg: errorText,
					closeable: false
				})
//				$scope.discussContent = ''
				$scope.discussButton = false
			})
			$scope.discussContent = ''

		}

		//回车发表讨论
		$scope.createUserDiscussByPress = function($event) {
		  if($event.shiftKey && $event.which === 13){//shiftKey+enter键换行
		    $event.returnValue = true;
        return true;
		  }

			if ($event.which === 13 && !atWhoShown && createFlag) { //回车事件
				$event.preventDefault()
				$scope.discussContent = $scope.discussContent.replace(/(^\s*)|(\s*$)/g, "");
				if($scope.discussContent.length > 200){
					Notification.show({
            title: '失败',
            type: 'danger',
            msg: 'DISCUSS_CONTENT_LIMIT',
            closeable: false
          })
          return
				}
				if ($scope.discussContent == '') {
				  Notification.show({
            title: '失败',
            type: 'danger',
            msg: 'DISCUSS_CONTENT_EMPTY',
            closeable: false
          })
					return
				}

				createFlag = false
				$scope.createUserDiscuss($event)
			}
		}

		//删除讨论
		$scope.deleteUserDiscuss = function(userDiscuss) {
			Confirm.show({
				title: 'LANG_FILE_DELETE_DISCUSS',
				content: 'LANG_FILE_DELETE_DISCUSS_CONFIRM_MESSAGE',
				ok: function($modalInstance){
					deleteDiscuss(userDiscuss, $modalInstance)
				}
			})
		}

		function deleteDiscuss(userDiscuss, $modalInstance){
			UserDiscuss.deleteUserDiscuss({
				id: userDiscuss.id
			}).$promise.then(function() {
				//discuss count --
				$scope.discuss_file.discuss_count = parseInt($scope.discuss_file.discuss_count) - 1;
				for (var i = 0; i < $scope.userDiscussList.length; ++i) {
					if ($scope.userDiscussList[i].id == userDiscuss.id) {
						userDiscuss.is_deleted = 'true'
					}
				}
				$modalInstance.dismiss('cancel')
			}, function(error) {
				Notification.show({
					title: '失败',
					type: 'danger',
					msg: error.data.result,
					closeable: false
				})
				$modalInstance.dismiss('cancel')
			})
		}

		// deleteUserDiscuss
		var deleteUserDiscussController = [
			'$scope',
			'$modalInstance',
			'userDiscuss',
			'userDiscussList',
			function(
				$scope,
				$modalInstance,
				userDiscuss,
				userDiscussList
			) {
				$scope.userDiscussList = userDiscussList
				$scope.userDiscuss = userDiscuss

				$scope.ok = function() {
					UserDiscuss.deleteUserDiscuss({
						id: userDiscuss.id
					}).$promise.then(function() {
						for (var i = 0; i < $scope.userDiscussList.length; ++i) {
							if ($scope.userDiscussList[i].id == userDiscuss.id) {
								userDiscuss.is_deleted = 'true'
							}
						}
						$modalInstance.dismiss('cancel')
					}, function(error) {
						Notification.show({
							title: '失败',
							type: 'danger',
							msg: error.data.result,
							closeable: false
						})
						$modalInstance.dismiss('cancel')
					})
				}

				$scope.cancel = function() {
					$modalInstance.dismiss('cancel')
				}
			}
		]


		//输入讨论框监控
		$scope.$watch('discussContent', function(discussContent, oldValue) {
			$scope.discussCount = discussContent.length
			if (discussContent.length > 200 || discussContent.length == 0) {
				$scope.discussButton = true
			} else {
				$scope.discussButton = false
			}
		})

		//检查预览的文件大小及类型
		function checkFileValid(obj) {
			var fileSize = obj.file_size;
			var fileType = Utils.getFileTypeByName(obj.file_name);
			if ('office' == fileType) {
				//office文档最大预览为10M
				if (fileSize > 10485760) {
					return false;
				}
			} else
			if ('pdf' == fileType) {
				//pdf设置最大预览为50M
				if (fileSize > 52428800) {
					return false;
				}
			}
			return true;
		}

		//文件预览
		$scope.previewFile = function(fileHistory) {
			var validFile = checkFileValid($scope.file);
			if (validFile) {
				var previewFileModal = $modal.open({
					templateUrl: 'src/app/files/preview-file/template.html',
					windowClass: 'preview-file',
					backdrop: 'static',
					controller: 'App.Files.PreviewFileController',
					resolve: {
						obj: function() {
							return $scope.file;
						},
						fileVersionPreview: function() {
							return fileHistory;
						}
					}
				})
				$scope.discussOpened = false
			} else {
				Notification.show({
					title: '失败',
					type: 'danger',
					msg: 'LANG_FILES_PREVIEW_LIMITATION_MESSAGE',
					closeable: false
				})
			}
		}

		//下载历史版本
		$scope.downLoadHistory = function(fileHistory) {
			var hiddenIframeID = 'hiddenDownloader'
			var iframe = $('#' + hiddenIframeID)[0]
			if (iframe == null) {
				iframe = document.createElement('iframe')
				iframe.id = hiddenIframeID
				iframe.style.display = 'none'
				document.body.appendChild(iframe)
			}
			iframe.src = CONFIG.API_ROOT + '/file/get/' + fileHistory.file_id + '?token=' + $cookies.token + '&v=' + fileHistory.version_id
		}

    //还原版本
		$scope.revertFileVersion = function(version_id){
			Files.revertFileVersion({
				file_id: discuss_file_id
			},{
				version_id: version_id
			}).$promise.then(function(r){
				//历史版本
				$scope.discuss_file.version_count = parseInt($scope.discuss_file.version_count) + 1;
				$scope.fileHistoryList = Files.history({
					file_id: discuss_file_id
				});				
			}, function(error){
				Notification.show({
					title: '失败',
					type: 'danger',
					msg: 'USER_DISCUSS_VERSION_REVERT_FAILED',
					closeable: false
				})
			});
		}

    //关闭右侧讨论框
		$scope.$on('closeDiscussPannel', function($event) {
		  $scope.discussOpened = false
		})

		//打开右侧讨论框
    $scope.$on('openDiscussPannel', function($event) {
      $scope.discussOpened = true
    })

		//关闭当前Socket
		$scope.closeSocket = function(){
		  ws.close()
		  clearInterval(reconnectTime)
		}

	}
]).filter('personAction', function(){
	//return person name + persion action
	var personOperation = function(fileHistory) {
	  var action = '';
	  switch(fileHistory.action){
	      case 'create': action = 'USER_DISCUSS_VERSION_ACTION_CREATE';
  	  		break;
	      case 'update': action = 'USER_DISCUSS_VERSION_ACTION_UPDATE';
		  	  break;	  	  
	      case 'revert': action = 'USER_DISCUSS_VERSION_ACTION_REVERT';
  	  		break;
	  }
	  return action;
  };
  return personOperation;
});