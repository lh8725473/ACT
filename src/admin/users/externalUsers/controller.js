angular.module('App.Users.ExternalUsers').controller('App.Users.ExternalUsers.Controller', [
	'$scope',
	'$modal',
	'Notification',
	'ExternalUser',
	function(
		$scope,
		$modal,
		Notification,
		ExternalUser
	) {
		//externalUserList data
		$scope.externalUserList = ExternalUser.query()
		
		//加载动画
    $scope.loading = true
    $scope.externalUserList.$promise.then(function() {
      $scope.loading = false
    })

		//externalUser grid
		$scope.externalUserGridOptions = {
			data : 'externalUserList',
			selectedItems : [],
			headerRowHeight : 36,
			enableRowSelection : false,
			rowHeight : 60,
			columnDefs : [{
				displayName : '用户',
				cellTemplate : 'src/admin/users/externalUsers/row-externalUser-name.html'
			}, {
				cellTemplate: 'src/admin/users/managedUsers/row-user-email.html',
				displayName : '邮件'
			}, {
				field : 'folder_count',
				displayName : '文件夹数'
			}, {
				displayName : '操作',
				cellTemplate : 'src/admin/users/externalUsers/externalUser-table-action-cell.html'
			}]
		}

		//delete externalUser
		$scope['delete'] = function(row) {
			var deleteUserModal = $modal.open({
				templateUrl : 'src/admin/users/externalUsers/delete-externalUser-modal.html',
				controller : deleteModalController,
				backdrop: 'static',
				resolve : {
					externalUserId : function() {
						return row.entity.user_id
					}
				}
			})

			deleteUserModal.result.then(function(user_id) {
				ExternalUser['delete']({
					id : user_id
				}).$promise.then(function() {
					for (var i = 0; i < $scope.externalUserList.length; ++i) {
						if ($scope.externalUserList[i].user_id == user_id)
							break
					}
					$scope.externalUserList.splice(i, 1)
				})
			})
		}
		//delete window ctrl
		var deleteModalController = [
			'$scope',
			'$modalInstance',
			'externalUserId',
			function(
				$scope,
				$modalInstance,
				externalUserId
			) {
				$scope.ok = function() {
					$modalInstance.close(externalUserId)
				}

				$scope.cancel = function() {
					$modalInstance.dismiss('cancel')
				}
			}
		]
	}
])