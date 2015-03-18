angular.module('App.Users.Groups').controller('App.Users.Groups.Controller', [
	'$scope',
	'$modal',
	'$timeout',
	'Notification',
	'Group',
	'Users',
	function(
		$scope,
		$modal,
		$timeout,
		Notification,
		Group,
		Users
	) {
		//groupList data
		$scope.groupList = Group.query()

		//加载动画
		$scope.loading = true
		$scope.groupList.$promise.then(function() {
			$scope.loading = false
		})

		//group grid
		$scope.groupGridOptions = {
			data: 'groupList',
			selectedItems: [],
			headerRowHeight: 36,
			enableRowSelection: false,
			rowHeight: 60,
			columnDefs: [{
				displayName: '群组名称',
				cellTemplate: 'src/admin/users/groups/row-groups-name.html'
			}, {
				field: 'user_count',
				displayName: '组员'
			}, {
				displayName: '动态',			
				cellTemplate: 'src/admin/users/groups/row-groups-action.html'
			}, {
				displayName: '操作',
				cellTemplate: 'src/admin/users/groups/group-table-action-cell.html'
			}]
		}

		//addGroup window
		$scope.addGroup = function() {
			var addGroupModal = $modal.open({
				templateUrl: 'src/admin/users/groups/add-group-modal.html',
				windowClass: 'add-group-modal-view',
				backdrop: 'static',
				controller: addGroupModalController
			})

			addGroupModal.result.then(function(group) {
				Group.create({}, group).$promise.then(function(group) {
					$scope.groupList.push(group)
					Notification.show({
						title: '成功',
						type: 'success',
						msg: '添加群组成功',
						closeable: true
					})
				}, function(error) {
					Notification.show({
						title: '失败',
						type: 'danger',
						msg: error.data.result,
						closeable: false
					})
				})
			})
		}

		//addGroup window ctrl
		var addGroupModalController = [
			'$scope',
			'$modalInstance',
			function(
				$scope,
				$modalInstance
			) {
				//增加groupwindow 用户默认值
				$scope.group = {
					config: {
						show_member: true,
						desktop_sync: true,
						inner_share: false
					},
					users: []
				}

				//addMember grid
				$scope.addMemberGridOptions = {
					data: 'group.users',
					selectedItems: [],
					enableRowSelection: false,
					columnDefs: [{
						field: 'user_name',
						displayName: '成员'
					}, {
						field: 'email',
						displayName: '邮件地址'
					}, {
						displayName: '组内权限',
						cellTemplate: 'src/admin/users/groups/row-member-role.html'
					}]
				}

				$scope.addMemberWindow = function() {
					var addMemberWindowModal = $modal.open({
						templateUrl: 'src/admin/users/groups/add-member-window-modal.html',
						windowClass: 'add-member-window-modal',
						backdrop: 'static',
						controller: addMemberWindowController,
						resolve: {
							addMembers: function() {
								return $scope.group.users
							},
							userList: function() {
								return Users.query()
							}
						}
					})

					addMemberWindowModal.result.then(function(selectedData) {
						angular.forEach(selectedData, function(member) {
							$scope.group.users.push(member)
						})
					})
				}

				var addMemberWindowController = [
					'$scope',
					'$modalInstance',
					'addMembers',
					'userList',
					function(
						$scope,
						$modalInstance,
						addMembers,
						userList
					) {
						//userList data
						$scope.userListData = []
						userList.$promise.then(function() {
							angular.forEach(userList, function(user) {
								var addFlag = true;
								for (var i = 0; i < addMembers.length; i++) {
									if (user.user_id == addMembers[i].user_id) {
										addFlag = false;
									}
								}
								if (addFlag) {
									user.role_id = 0
									$scope.userListData.push(user)
								}
							})
						}, function(error) {
							Notification.show({
								title: '失败',
								type: 'danger',
								msg: error.data.result,
								closeable: false
							})
						})

						//显示数据
						$scope.shownData = $scope.userListData

						$scope.seachMembers = function(seachMembersValue) {
							// 清空显示的group
							$scope.shownData = []
								// 重新计算
							$scope.shownData = $($scope.userListData).filter(function(index, user) {
								if (!seachMembersValue || seachMembersValue.trim() === '') {
									return true
								} else if (user.real_name.toLowerCase().indexOf(seachMembersValue.toLowerCase()) != -1) {
									return true
								} else {
									return false
								}
							})
						}

						//选中数据
						$scope.selectedData = [];
						$scope.selectedMemberGridOptions = {
							data: 'shownData',
							selectedItems: $scope.selectedData,
							rowHeight: 40,
							showSelectionCheckbox: true,
							selectWithCheckboxOnly: true,
							columnDefs: [{
								displayName: '姓名',
								cellTemplate: 'src/admin/users/groups/row-user-name.html'
							}, {
								field: 'email',
								displayName: '邮件地址',
								cellClass: 'gruop-add-email-row'
							}]
						}

						$scope.ok = function() {
							$modalInstance.close($scope.selectedData)
						}

						$scope.cancel = function() {
							$modalInstance.dismiss('cancel')
						}
					}
				]

				$scope.ok = function(group) {
					$modalInstance.close(group)
				}

				$scope.cancel = function() {
					$modalInstance.dismiss('cancel')
				}
			}
		]

		//delete group
		$scope['delete'] = function(row) {
			var deleteUserModal = $modal.open({
				templateUrl: 'src/admin/users/groups/delete-group-modal.html',
				controller: deleteModalController,
				backdrop: 'static',
				resolve: {
					groupId: function() {
						return row.entity.group_id
					}
				}
			})

			deleteUserModal.result.then(function(group_id) {
				Group['delete']({
					id: group_id
				}).$promise.then(function() {
					for (var i = 0; i < $scope.groupList.length; ++i) {
						if ($scope.groupList[i].group_id == group_id) break
					}
					$scope.groupList.splice(i, 1)
				})
			})
		}

		//delete window ctrl
		var deleteModalController = [
			'$scope',
			'$modalInstance',
			'groupId',
			function(
				$scope,
				$modalInstance,
				groupId
			) {
				$scope.ok = function() {
					$modalInstance.close(groupId)
				}

				$scope.cancel = function() {
					$modalInstance.dismiss('cancel')
				}
			}
		]

		//editGroup
		$scope.edit = function edit(row) {
			var editUserModal = $modal.open({
				templateUrl: 'src/admin/users/groups/update-group-modal.html',
				controller: editModalController,
				resolve: {
					editGroup: function() {
						// Past the ref to the modal
						return angular.copy(row.entity)
					}
				}
			})

			editUserModal.result.then(function(editGroup) {
				Group.update({
					id: editGroup.group_id
				}, editGroup)
				angular.extend(row.entity, editGroup)
			})
		}

		//edit window ctrl
		var editModalController = [
			'$scope',
			'$modalInstance',
			'editGroup',
			function(
				$scope,
				$modalInstance,
				editGroup
			) {
				$scope.editGroup = editGroup

				$scope.ok = function() {
					$modalInstance.close($scope.editGroup)
				}

				$scope.cancel = function() {
					$modalInstance.dismiss('cancel')
				}
			}
		]

	}
])