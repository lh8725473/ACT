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

			if (ext == txt) {
				return 'txt';
			}

			if (ext == pdf) {
				return 'pdf'
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
		}
	}
}])