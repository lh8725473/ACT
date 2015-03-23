angular.module('App.Widgets').factory('Utils', [
  '$modal',
  'CONFIG',
  function(
    $modal,
    CONFIG
  ) {
  return {
    getIconByExtension : function(ext) {//获取文件夹或者文件的图标
      var icons = CONFIG.ICONS;
      var path = CONFIG.ICONS_PATH;
      //默认
      var icon = icons.all;
      ext = ext.toLowerCase();
      if (ext == 'folder') {
        icon = icons.folder;
      } else if (ext == 'pdf') {
        icon = icons.pdf;
      } else if (ext == 'txt') {
        icon = icons.txt;
      } else if (ext == 'mp3') {
        icon = icons.mp3;
      } else if (ext == 'mp4') {
        icon = icons.mp4;
      } else if (ext == 'xls' || ext == 'xlsx') {
        icon = icons.xls;
      } else if (ext == 'doc' || ext == 'docx') {
        icon = icons.doc;
      } else if (ext == 'jpg' || ext == 'jpeg' || ext == "png" || ext == 'gif' || ext == 'bmp') {
        icon = icons.jpg;
      } else if (ext == 'zip' || ext == 'rar') {
        icon = icons.zip;
      } else if (ext == 'ppt' || ext == 'pptx') {
        icon = icons.ppt;
      } else if (ext == 'note') {
        icon = icons.note;
      }

      return {
        small : path + icon.small,
        large : path + icon.large
      }
    },

    getFileTypeByName : function(name){//是否为预览类型
      var extStart = name.lastIndexOf(".");
      var ext = name.substring(extStart + 1, name.length);
      ext = ext.toLowerCase();
      var office = ['doc', 'xls', 'ppt', 'docx', 'xlsx', 'pptx'];
      var img = ['jpg', 'jpeg', 'gif', 'png', 'bmp'];
      var txt = 'txt';
      var pdf = 'pdf';
      var note = 'note';

      if (ext == txt) {
        return 'txt';
      }

      if (ext == pdf) {
        return 'pdf'
      }

      if (ext == note) {
        return 'note'
      }

      for ( i = 0; i < office.length; i++) {
        if (ext == office[i]) {
          return 'office';
        }
      }

      for ( i = 0; i < img.length; i++) {
        if (ext == img[i]) {
          return 'image';
        }
      }

      return false;
    },

    formateSize: function(size){//格式化byte大小
      var name = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
      var pos = 0;
      while (size >= 1204) {
        size /= 1024;
        pos++;
      }
      return size.toFixed(2) + " " + name[pos];
    },

    formateTime: function(time, fmt){//格式化时间
      var o = {
        "M+" : time.getMonth()+1,                 //月份
        "d+" : time.getDate(),                    //日
        "h+" : time.getHours(),                   //小时
        "m+" : time.getMinutes(),                 //分
        "s+" : time.getSeconds(),                 //秒
        "q+" : Math.floor((time.getMonth()+3)/3), //季度
        "S"  : time.getMilliseconds()             //毫秒
      };
      if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (time.getFullYear()+"").substr(4 - RegExp.$1.length));
      for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
      return fmt;
    },

    replaceURLWithHTMLLinks: function(text){//str链接高亮生成链接
      var re = /(\(.*?)?\b((?:https?|ftp|file|http):\/\/[-a-z0-9+&@#\/%?=~_()|!:,.;]*[-a-z0-9+&@#\/%=~_()|])/ig;
      return text.replace(re, function(match, lParens, url) {
        var rParens = '';
        lParens = lParens || '';
        var lParenCounter = /\(/g;
        while (lParenCounter.exec(lParens)) {
          var m;
          if (m = /(.*)(\.\).*)/.exec(url) ||/(.*)(\).*)/.exec(url)) {
            url = m[1];
            rParens = m[2] + rParens;
          }
        }
        return lParens + "<a href='" + url + "'"+ " target='_blank'"  +">" + url + "</a>" + rParens;
      });
    },
    
    //高亮显示@whos
    highLightAtWhos: function(content){
      var toBeHighLightedStringArray = content.match(/@[^ ]+/g);//匹配atwhos      
      angular.forEach(toBeHighLightedStringArray, function(item){
        var highLightedString = item.fontcolor('#428bca');
        content = content.replace(item, highLightedString);
      });
      return content; 
    },

    //检查浏览器环境 ：1. 是否有flash 插件  2.浏览器版本
    checkEnvironment : function() {
      var htmlcore = ''
      if(navigator.userAgent.indexOf("MSIE")>0) {
        htmlcore =  "MSIE"
      }
      if(isFirefox=navigator.userAgent.indexOf("Firefox")>0){
        htmlcore = "Firefox"
      }
      if(isSafari=navigator.userAgent.indexOf("Safari")>0) {
        htmlcore = "Safari"
      }
      if(isCamino=navigator.userAgent.indexOf("Camino")>0){
        htmlcore = "Camino"
      }
      if(isMozilla=navigator.userAgent.indexOf("Gecko/")>0){
        htmlcore = "Gecko"
      }

      if(htmlcore == "MSIE"){
        var browser=navigator.appName
        var b_version=navigator.appVersion
        var version=b_version.split(";")
        var trim_Version=version[1].replace(/[ ]/g,"")

        if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE6.0") {
          alert("请使用IE10以上的浏览器访问，或者使用Chrome和Firefox浏览器（360浏览器需调整为极速模式）")
          return;
        }else if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE7.0"){
          alert("请使用IE10以上的浏览器访问，或者使用Chrome和Firefox浏览器（360浏览器需调整为极速模式）")
          return;
        }else if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE8.0"){
          alert("请使用IE10以上的浏览器访问，或者使用Chrome和Firefox浏览器（360浏览器需调整为极速模式）")
          return;
        }else if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE9.0"){
          alert("请使用IE10以上的浏览器访问，或者使用Chrome和Firefox浏览器（360浏览器需调整为极速模式）")
          return;
        }
      }

      if(htmlcore == "MSIE"){
        try{
          var swf1 = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
        }catch(e){
          var flashDownloadController = [
            '$scope',
            '$modalInstance',
            function(
              $scope,
              $modalInstance
            ) {

              $scope.ok = function() {
                $modalInstance.close()
              };

              $scope.cancel = function() {
                $modalInstance.dismiss('cancel')
              }
            }
          ]

          var flashDownloadModal = $modal.open({
            templateUrl: 'src/app/widgets/utils/flash-download.html',
            windowClass: 'flash-download',
            backdrop: 'static',
            controller: flashDownloadController
          })


        }
      }else {
        try{
          var swf2 = navigator.plugins['Shockwave Flash'];
          if(swf2 == undefined){
            var flashDownloadController = [
              '$scope',
              '$modalInstance',
              function(
                $scope,
                $modalInstance
              ) {
                $scope.ok = function() {
                  $modalInstance.close()
                };

                $scope.cancel = function() {
                  $modalInstance.dismiss('cancel')
                }
              }
            ]

            var flashDownloadModal = $modal.open({
              templateUrl: 'src/app/widgets/utils/flash-download.html',
              windowClass: 'flash-download',
              backdrop: 'static',
              controller: flashDownloadController
            })

          }else {
//            alert('安装了Flash');
          }
        }catch(e){
          var flashDownloadModal = $modal.open({
            templateUrl: 'src/app/widgets/utils/flash-download.html',
            windowClass: 'flash-download',
            backdrop: 'static',
            controller: flashDownloadController
          })

          var flashDownloadController = [
            '$scope',
            '$modalInstance',
            function(
              $scope,
              $modalInstance
            ) {

              $scope.ok = function() {
                $modalInstance.close()
              };

              $scope.cancel = function() {
                $modalInstance.dismiss('cancel')
              }
            }
          ]
        }
      }
    }
  }
}])