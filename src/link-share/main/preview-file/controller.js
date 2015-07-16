angular.module('App.LinkShare').controller('App.LinkShare.PreviewFileController', [
  '$scope',
  '$rootScope',
  'Utils',
  'CONFIG',
  'Files',
  '$cookies',
  '$modal',
  '$state',
  '$cookieStore',
  'Share',
  'Notification',
  function(
    $scope,
    $rootScope,
    Utils,
    CONFIG,
    Files,
    $cookies,
    $modal,
    $state,
    $cookieStore,
    Share,
    Notification
  ) {
      $scope.loading = true;

      //图片旋转
      $scope.angle = 0;
      $scope.rotate = function (degree) {
        $scope.isRotate = true;
        $scope.angle += parseInt(degree);
      }

      //加载动画
      $scope.loading = true

      //是否超出预览大小
      $scope.isFilePreview = true      
      $scope.fileType = true;

      $scope.key = $state.params.key
      $scope.fileId = $state.params.fileId;      
      $scope.folderId = $state.params.folderId;

      var pwd = $cookieStore.get($scope.key + '_pwd') ? $cookieStore.get($scope.key + '_pwd') : ''
      
      var imageListCachePre = new Image();
      var imageListCacheNext = new Image();
      // 浏览上（下）一个图片文件
      var imageFileList = [];
      var imageFileIndex = 0;
      $scope.imageFileList = imageFileList;
      $scope.imageFileIndex = imageFileIndex;
      // 控制图片文件切换的按钮
      var imageChangeBottonStatus = function() {
        if(imageFileIndex == 0) {
          $scope.preShow = false;
        } else {
          $scope.preShow = true;
        }
        if(imageFileIndex == imageFileList.length - 1) {
          $scope.nextShow = false;
        } else {
          $scope.nextShow = true;
        }
      }

      Share.getLinkShareList({
        key: $scope.key,
        pwd: pwd,
        folder_id: $scope.folderId
      }).$promise.then(function(linkShareList) {

        $scope.linkShareList = linkShareList;
        angular.forEach($scope.linkShareList, function(linkShare) {
          if(linkShare.file_id == $scope.fileId) {
            $scope.currentObj = linkShare;
            $scope.loading = false;
          }
        });

        $scope.fileType = Utils.getFileTypeByName($scope.currentObj.file_name);
        $scope.isFilePreview = checkFileValid($scope.currentObj);       
        if(!$scope.fileType || !$scope.isFilePreview) {
          $scope.imageSrc = 'images/web_preview_failed.png';
        }
        else if ('image' == $scope.fileType) {//图片预览
          $scope.imageSrc = CONFIG.API_ROOT + '/share/key?act=preview&key=' + $scope.key + '&pwd=' + pwd + '&file_id=' + $scope.currentObj.file_id + '&_=' + new Date().getTime();
          $scope.imageSrcMax = CONFIG.API_ROOT + '/share/key?act=preview&key=' + $scope.key + '&pwd=' + pwd + '&file_id=' + $scope.currentObj.file_id + '&_=' + new Date().getTime() + '&size=max';
        } else {//office或者pdf预览或者note
          Files.preview($scope.currentObj.file_id, $scope.key, pwd).then(function(htmlData) {
            $scope.loading = false
            $scope.previewValue = htmlData
          })
        }
      
        //图片文件在list中的位置     
        if(!$scope.currentObj.isFolder && 'image' == Utils.getFileTypeByName($scope.currentObj.file_name)){
          // foreach计数
          var objListIndex = -1;
          angular.forEach($scope.linkShareList, function(item){
            if(!item.isFolder && 'image' == Utils.getFileTypeByName(item.file_name)) {
              this.push(item);
              objListIndex++;
              if(item.file_id == $scope.currentObj.file_id){
                imageFileIndex = objListIndex;              
              }                       
            }  
          }, imageFileList);
          if(imageFileIndex != 0){
            imageListCachePre.src = CONFIG.API_ROOT + '/share/key?act=preview&key=' + $scope.key + '&pwd=' + pwd + '&file_id=' + imageFileList[imageFileIndex - 1].file_id + '&_=' + new Date().getTime();
          } 
          if(imageFileIndex != imageFileList.length - 1){       
            imageListCacheNext.src = CONFIG.API_ROOT + '/share/key?act=preview&key=' + $scope.key + '&pwd=' + pwd + '&file_id=' + imageFileList[imageFileIndex + 1].file_id + '&_=' + new Date().getTime();
          }
          imageChangeBottonStatus();
        }
      });

      //重新加载数据
      var reloadView = function(previewOperation){
        $scope.currentObj = imageFileList[imageFileIndex];
        $scope.isFilePreview = ($scope.currentObj.file_size < 10 * 1024 *1024) ? true : false;
        $scope.imageSrcMax = CONFIG.API_ROOT + '/share/key?act=preview&key=' + $scope.key + '&pwd=' + pwd + '&file_id=' + $scope.currentObj.file_id + '&_=' + new Date().getTime() + '&size=max';
        imageChangeBottonStatus();                      
        if(previewOperation == 'pre'){
          imageListCacheNext.src = $scope.imageSrc;
          // 缓存的前一张图片失败，需要重现获取
          if (!imageListCachePre.complete || typeof imageListCachePre.complete === "undefined") {
            $scope.imageSrc = CONFIG.API_ROOT + '/share/key?act=preview&key=' + $scope.key + '&pwd=' + pwd + '&file_id=' + $scope.currentObj.file_id + '&_=' + new Date().getTime();
            imageListCachePre.src = $scope.imageSrc;
          } else {
            $scope.imageSrc = imageListCachePre.src;
          }
        } else{
          imageListCachePre.src = $scope.imageSrc;
          // 缓存的后一张图片失败，需要重现获取
          if (!imageListCacheNext.complete || typeof imageListCacheNext.complete === "undefined") {
            $scope.imageSrc = CONFIG.API_ROOT + '/share/key?act=preview&key=' + $scope.key + '&pwd=' + pwd + '&file_id=' + $scope.currentObj.file_id + '&_=' + new Date().getTime();
            imageListCacheNext.src = $scope.imageSrc;
          } else {
            $scope.imageSrc = imageListCacheNext.src;
          }
        }
        if(imageFileIndex != 0 && previewOperation == 'pre'){
          imageListCachePre.src = CONFIG.API_ROOT + '/share/key?act=preview&key=' + $scope.key + '&pwd=' + pwd + '&file_id=' + imageFileList[imageFileIndex - 1].file_id + '&_=' + new Date().getTime();
        } 
        if(imageFileIndex != (imageFileList.length - 1) && previewOperation == 'next'){  
          imageListCacheNext.src = CONFIG.API_ROOT + '/share/key?act=preview&key=' + $scope.key + '&pwd=' + pwd + '&file_id=' + imageFileList[imageFileIndex + 1].file_id + '&_=' + new Date().getTime();     
        }
        $scope.angle = 0;
      }

      //外部链接详细信息
      $scope.linkDetail = Share.getLinkShareDetail({
        key: $scope.key,
        pwd: $cookieStore.get($scope.key + '_pwd')
      })

      $scope.linkDetail.$promise.then(function(linkDetail) {
        //权限列表
        var is_owner = linkDetail.permission.substring(0, 1) //协同拥有者 or 拥有者1
        var is_delete = linkDetail.permission.substring(1, 2) //删除权限
        var is_edit = linkDetail.permission.substring(2, 3) //编辑权限
        var is_getLink = linkDetail.permission.substring(3, 4) //链接权限
        var is_preview = linkDetail.permission.substring(4, 5) //预览权限
        var is_download = linkDetail.permission.substring(5, 6) //下载权限
        var is_upload = linkDetail.permission.substring(6, 7) //上传权限

        linkDetail.is_owner = (is_owner == '1') ? true : false
        linkDetail.is_delete = (is_delete == '1') ? true : false
        linkDetail.is_edit = (is_edit == '1') ? true : false
        linkDetail.is_getLink = (is_getLink == '1') ? true : false
        linkDetail.is_preview = (is_preview == '1') ? true : false
        linkDetail.is_download = (is_getLink == '1') ? true : false
        linkDetail.is_upload = (is_upload == '1') ? true : false

        //仅预览
        linkDetail.preview_only = (linkDetail.permission.substring(4, 7) == '100') ? true : false
        //仅上传
        linkDetail.upload_only = (linkDetail.permission.substring(4, 7) == '001') ? true : false

        if (linkDetail.is_upload) {
          $scope.uploadButton = true
        }

        if (linkDetail.comment == '') {
          linkDetail.comment = 'Ta很懒什么也没留下'
        }
      }, function(error) {
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: error.data.result,
          closeable: false
        })
      })
      
      //向前预览
      $scope.prePreview = function(){
        imageFileIndex--;
        reloadView('pre');
      }
      
      //向后预览
      $scope.nextPreview = function(){
        imageFileIndex++;
        reloadView('next');
      }

      //下载文件
      $scope.downloadFile = function() {
        var hiddenIframeID = 'hiddenDownloader'
        var iframe = $('#' + hiddenIframeID)[0]
        if (iframe == null) {
          iframe = document.createElement('iframe')
          iframe.id = hiddenIframeID
          iframe.style.display = 'none'
          document.body.appendChild(iframe)
        }
        iframe.src = CONFIG.API_ROOT + '/share/key?act=download&key=' + $scope.key + '&pwd=' + $cookieStore.get($scope.key + '_pwd') + '&file_id=' + $scope.currentObj.file_id
      }

      //MODAL USER LOGIN   

      $scope.open = function (size) {
        if($cookieStore.readCookie('userId')) {
          Notification.show({
            title: '成功',
            type: 'success',
            msg: '正在为你保存文件',
            closeable: false
          });
          Share.saveLinkObj({
            key: $scope.key,
            pwd: $cookieStore.get($scope.key + '_pwd')
          }, {
            obj_id: $scope.currentObj.file_id,
            obj_type: 'file'
          }).$promise.then(function() {
            Notification.show({
              title: '成功',
              type: 'success',
              msg: '已将“' + $scope.currentObj.file_name + '”保存到你的全携通的所有文件中',
              closeable: false
            });
          }, function(error) {
            Notification.show({
              title: '失败',
              type: 'danger',
              msg: error.data.result,
              closeable: false
            });
          });
        } else {

          var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            windowClass: 'link-share-login',
            controller: ModalInstanceCtrl,
            size: size,  
            resolve: {
              fileName: function() {
                return $scope.currentObj.file_name;
              }
            }     
          }); 
          modalInstance.result.then(function() {
            $scope.open();
          });          
        }      
      };

      var ModalInstanceCtrl = [
            '$scope',
            '$modalInstance',
            '$rootScope',
            'fileName',
            function($scope, $modalInstance, $rootScope, fileName) {
              $scope.file_name = fileName;
              $scope.monitorKeyPress = function($event) {
                if ($event.keyCode === 13) {
                  $scope.loginHandler();
                }
              }
              $scope.loginHandler = function() {
                $rootScope.$broadcast("loginDelegate", $scope.userName, $scope.userPassword, $scope.remember, $modalInstance);
              }
              $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
              };
            }
          ]

      //MODAL USER LOGIN END

      //add Link Record
      $scope.$on("addLinkRecord", function (){
        Share.addLinkRecord({key: $scope.key});
      }) 

      //检查预览的文件大小及类型
      function checkFileValid(obj) {
        var fileSize = obj.file_size;
        var fileType = Utils.getFileTypeByName(obj.file_name);
        if ('office' == fileType || 'image' == fileType || 'txt' == fileType) {
          //office文档最大预览为10M
          if (fileSize > 10485760) {
            return false;
          }
        } else if ('pdf' == fileType) {
          //pdf设置最大预览为50M
          if (fileSize > 52428800) {
            return false;
          }
        }
        return true;
      }
  }
]).directive('rotate', ['$timeout', function ($timeout) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {

        // initialize dom height          
        var timeout = $timeout(function () {
          $('.image-preview').height($('.link-main').height() - $('.open-link-top').height() - 3);
          $('.image-preview-td').height($('.link-main').height() - $('.open-link-top').height() - 3);
          $('.txt-preview').height($('.link-main').height() - $('.open-link-top').height() - 3);
          $('.office-preview').height($('.link-main').height() - $('.open-link-top').height() - 3);
        }, 1000);
        
        // destroy timmer when view dismiss
        scope.$on('$destroy', function() {
          $timeout.cancel(timeout);
        });

        scope.$watch(attrs.degrees, function (rotateDegrees) {
          if(!scope.isRotate) {
            $('.image-preview-td img').removeAttr('style');
            scope.originWidth = 0;
          }
          else {
            scope.isRotate = false;
            var r = 'rotate(' + rotateDegrees + 'deg)';
            element.css({
              '-moz-transform': r,
              '-webkit-transform': r,
              '-o-transform': r,
              '-ms-transform': r,
            });
            if (scope.originWidth > 0 && element.width() == $('.image-preview').height()) {
              element.css({
                  'width': scope.originWidth
              });
            } else if (element.width() > $('.image-preview').height()) {
              if (!scope.originWidth || scope.originWidth == 0) {
                  scope.originWidth = element.width();
              }
              element.css({
                  'width': $('.image-preview').height()
              });
            }
          }
        });
      }
    }
}])
.directive('resize', ['$window', function ($window) {
    return function (scope, element) {
        var w = angular.element($window);
        scope.getWindowDimensions = function () {
            return { 'h': w.height(), 'w': w.width() };
        };
        scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
          $('.image-preview').height($('.link-main').height() - $('.open-link-top').height() - 3);
          $('.image-preview-td').height($('.link-main').height() - $('.open-link-top').height() - 3);
          $('.txt-preview').height($('.link-main').height() - $('.open-link-top').height() - 3);
          $('.office-preview').height($('.link-main').height() - $('.open-link-top').height() - 3);
        }, true);

        w.bind('resize', function () {
            scope.$apply();
        });
    }
}]); 
