angular.module('App.Reports').controller('App.Reports.Controller', [
  '$scope',
  'Cloud',
  'CONFIG',
  '$cookies',
  'Notification',
  function(
    $scope,
    Cloud,
    CONFIG,
    $cookies,
    Notification
  ) {
    $scope.today = function() {
      var today = new Date()
      today.setTime(today.getTime() - (7 * 24 * 60 * 60 * 1000))
      $scope.startDate = today
      var endDate = new Date()
      $scope.endDate = endDate
    };
    $scope.today()

    $scope.clear = function() {
      $scope.startDate = null
    }

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
      return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6))
    }

    $scope.toggleMin = function() {
      $scope.minDate = $scope.minDate ? null : new Date()
    };
    $scope.toggleMin()

    $scope.open = function($event, type) {
      $event.preventDefault()
      $event.stopPropagation()
      if (type == 'startDate') {
        $scope.openStart = true
      } else {
        $scope.openEnd = true
      }
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate']
    $scope.format = $scope.formats[1]

    //加载动画
    $scope.loading = true

    //日志列表
    var userLogListPage = 1
    $scope.userLogList = Cloud.userLogList({
      page: userLogListPage
    })

    $scope.userLogList.$promise.then(function() {
      $scope.loading = false
    })

    $scope.onUserLogListScroll = function(scrollTop, scrollHeight) {
      if (scrollTop == scrollHeight && !$scope.loading) {
        userLogListPage++
        $scope.loading = true
        var userLogList = Cloud.userLogList({
          page: userLogListPage,
          start_date: $scope.startDate,
          end_date: $scope.endDate
        })
        userLogList.$promise.then(function() {
          $scope.loading = false
          for (var i = 0; i < userLogList.length; i++) {
            $scope.userLogList.push(userLogList[i]);
          }
        })
      }
    }

    //搜索用户日志
    $scope.searchUserLog = function() {
      if (Date.parse($scope.startDate) > Date.parse($scope.endDate)) {
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: '搜索起始时间不能大于结束时间!',
          closeable: false
        });
        $scope.userLogList.length = 0;
        return;
      }
      $scope.userLogList = Cloud.userLogList({
        page: userLogListPage,
        start_date: $scope.startDate,
        end_date: $scope.endDate
      })
    }

    //导出用户日志
    $scope.exportUserLog = function() {
      var hiddenIframeID = 'hiddenDownloader'
      var iframe = $('#' + hiddenIframeID)[0]
      if (iframe == null) {
        iframe = document.createElement('iframe')
        iframe.id = hiddenIframeID
        iframe.style.display = 'none'
        document.body.appendChild(iframe)
      }
      iframe.src = CONFIG.API_ROOT + '/cloud/userLog?act=toExcel&token=' + $cookies.token + '&start_date=' + $scope.startDate + '&start_date=' + $scope.endDate
    }

  }
])