angular.module('App.Overview').controller('App.Overview.Controller', [
	'$scope',
	'Users',
	'OverView',
	'Utils',
	function(
		$scope,
		Users,
		OverView,
		Utils
	) {
		OverView.loginCount().$promise.then(function(loginCount) {
			$scope.loginCountConfig = {
				options: {
					chart: {
						type: 'column'
					}
				},
				title: {
					text: '过去一段时间的登录次数'
				},
				xAxis: {
					categories: ['过去一天', '过去一周', '过去一月']
				},
				yAxis: {
					title: {
						text: null
					}
				},
				series: [{
					name: '过去一段时间的登录次数',
					data: [
						[parseInt(loginCount.last_day)],
						[parseInt(loginCount.last_week)],
						[parseInt(loginCount.last_month)]
					]
				}],
				credits: {
					enabled: false
				}
			}
		})

		OverView.loginRank().$promise.then(function(loginRank) {
			var categories = []
			var data = []
			angular.forEach(loginRank, function(rank) {
				categories.push(rank.real_name)
				data.push(parseInt(rank.login_count))
			})

			$scope.loginRankConfig = {
				options: {
					chart: {
						type: 'column'
					}
				},
				title: {
					text: '活跃用户'
				},
				xAxis: {
					categories: categories
				},
				yAxis: {
					title: {
						text: null
					}
				},
				series: [{
					name: '登录次数',
					data: data
				}],
				credits: {
					enabled: false
				}
			}
		})

		OverView.loginTrend().$promise.then(function(loginTrend) {
			var categories = []
			var data = []
			angular.forEach(loginTrend, function(value, key) {
				if (key != '$promise' && key != '$resolved') {
					var point = []
					point.push(Date.UTC(parseInt(key.split('-')[0]), parseInt(key.split('-')[1]) - 1, parseInt(key.split('-')[2])))
					point.push(parseInt(value))
					data.push(point)
				}
			})
			$scope.loginTrendConfig = {
				global: {
					useUTC: false
				},
				title: {
					text: '登录变化'
				},
				xAxis: {
					type: 'datetime',
					dateTimeLabelFormats: { // don't display the dummy year
						day: '%m月%d日',
						week: '%m月%d日',
						month: '%m月%d日',
						year: '%m月%d日'
					}
				},
				yAxis: {
					title: {
						text: null
					}
				},
				series: [{
					name: '登录变化',
					data: data
				}],
				credits: {
					enabled: false
				}
			}
		})

		OverView.spaceTrend().$promise.then(function(spaceTrend) {
			var categories = []
			var data = []
			angular.forEach(spaceTrend, function(value, key) {
				if (key != '$promise' && key != '$resolved') {
					var point = []
					point.push(Date.UTC(parseInt(key.split('-')[0]), parseInt(key.split('-')[1]) - 1, parseInt(key.split('-')[2])))
					point.push(parseInt(value.used_size))
					data.push(point)
				}
			})

			$scope.spaceTrendConfig = {
				options: {
					tooltip: {
						formatter: function() {
							return '<span style ="color:' + this.series.color + '">\u25CF</span> ' + this.series.name + ': <b>' + Utils.formateSize(this.point.y, true) + '</b><br/>'
						}
					}
				},
				title: {
					text: '用量变化'
				},
				xAxis: {
					type: 'datetime',
					dateTimeLabelFormats: {
						day: '%m月%d日',
						week: '%m月%d日',
						month: '%m月%d日',
						year: '%m月%d日'
					}
				},
				yAxis: {
					title: {
						text: ''
					},
					min: 0
				},
				series: [{
					name: '用量变化',
					data: data
				}],
				credits: {
					enabled: false
				}

			}
		})

		OverView.spaceRank().$promise.then(function(spaceRank) {
			var categories = []
			var data = []
			angular.forEach(spaceRank, function(rank) {
				categories.push(rank.real_name)
				data.push(parseInt(rank.used_size))
			})

			$scope.spaceRankConfig = {
				options: {
					chart: {
						type: 'column'
					},
					tooltip: {
						formatter: function() {
							return '<span style ="color:' + this.series.color + '">\u25CF</span> ' + this.series.name + ': <b>' + Utils.formateSize(this.point.y, true) + '</b><br/>'
						}
					}
				},
				title: {
					text: '使用空间最多的五位用户'
				},
				xAxis: {
					categories: categories
				},
				yAxis: {
					title: {
						text: null
					}
				},
				series: [{
					name: '空间使用量',
					data: data
				}],
				credits: {
					enabled: false
				}
			}
		})

		OverView.spaceInfo().$promise.then(function(spaceinfo) {
			$scope.UserSpaceConfig = {
				options: {
					chart: {
						type: 'pie'
					},
					tooltip: {
						formatter: function() {
							return '<span style="font-size: 10px">' + this.point.name + '</span><br/>' +
								'<span style="color:' + this.series.color + '">\u25CF</span> ' + this.series.name + ': <b>' + Utils.formateSize(this.point.y, true) + '</b><br/>'
						}
					}
				},
				chart: {
					plotBackgroundColor: null,
					plotBorderWidth: 1, //null,
					plotShadow: false
				},
				title: {
					text: '已用团队空间'
				},
				plotOptions: {
					pie: {
						allowPointSelect: true,
						cursor: 'pointer'
					}
				},
				series: [{
					type: 'pie',
					name: '大小',
					data: [
						['剩余空间', spaceinfo.total_size - spaceinfo.used_size],
						['已用空间', spaceinfo.used_size]
					]
				}],
        credits: {
          enabled: false
        }
			}
		});
	}
])