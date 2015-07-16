angular.module('App.Widgets').factory('Utils', [
  '$modal',
  'CONFIG',
  function(
    $modal,
    CONFIG
  ) {
	return {
		getIconByExtension : function(ext) {
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
			} else if (ext == 'jpg' || ext == 'jpeg' || ext == "png" || ext == 'gif' || ext == 'bmp' || ext == 'ico') {
				icon = icons.jpg;
			} else if (ext == 'zip' || ext == 'rar') {
				icon = icons.zip;
			} else if (ext == 'ppt' || ext == 'pptx') {
				icon = icons.ppt;
			}	else if (ext == 'note') {
				icon = icons.note;
			}

			return {
				small : path + icon.small,
				large : path + icon.large
			}
		},
		getFileTypeByName : function(name){
			var extStart = name.lastIndexOf(".");
			var ext = name.substring(extStart + 1, name.length);
			ext = ext.toLowerCase();
			var office = ['doc', 'xls', 'ppt', 'docx', 'xlsx', 'pptx'];
			var img = ['jpg', 'jpeg', 'gif', 'png', 'bmp', 'ico'];
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
		formateSize: function(size){
		  var name = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
      var pos = 0;
      while (size >= 1204) {
        size /= 1024;
        pos++;
      }
      return size.toFixed(2) + " " + name[pos];
		},
		browser: function(){
			var u = navigator.userAgent.toLowerCase();
	    var app = navigator.appVersion.toLowerCase();
	    return {
	      txt: u, // 浏览器版本信息
	      version: (u.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1], // 版本号       
	      msie: /msie/.test(u) && !/opera/.test(u), // IE内核
	      mozilla: /mozilla/.test(u) && !/(compatible|webkit)/.test(u), // 火狐浏览器
	      safari: /safari/.test(u) && !/chrome/.test(u), //是否为safair
	      chrome: /chrome/.test(u), //是否为chrome
	      opera: /opera/.test(u), //是否为oprea
	      presto: u.indexOf('presto/') > -1, //opera内核
	      webKit: u.indexOf('applewebkit/') > -1, //苹果、谷歌内核
	      gecko: u.indexOf('gecko/') > -1 && u.indexOf('khtml') == -1, //火狐内核
	      mobile: !!u.match(/applewebkit.*mobile.*/), //是否为移动终端
	      ios: !!u.match(/\(i[^;]+;( u;)? cpu.+mac os x/), //ios终端
	      android: u.indexOf('android') > -1, //android终端
	      iPhone: u.indexOf('iphone') > -1, //是否为iPhone
	      iPad: u.indexOf('ipad') > -1, //是否iPad
	      webApp: !!u.match(/applewebkit.*mobile.*/) && u.indexOf('safari/') == -1 //是否web应该程序，没有头部与底部
	    };
		}
	}
}])