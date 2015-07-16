// by liuhao 2014-11-18

(function($){
  $.fn.highLightText = function(str,options){
    var defaults = {
      divFlag: true,
      divStr: " ",
      markClass: "",
      markColor: "red",
      nullReport: true,
      reductionLast: false,//还原上次标记
      changeText: '',
      callback: function(){
        return false;
      }
    };
    var sets = $.extend({}, defaults, options || {}), clStr;
    if(sets.markClass){
      clStr = "class='"+sets.markClass+"'";
    }else{
      clStr = "style='color:"+sets.markColor+";'";
    }

    //对前一次高亮处理的文字还原
    if(sets.reductionLast){
      $("span[rel='mark']").each(function() {
        var text = document.createTextNode($(this).text());
        $(this).replaceWith($(text));
      });
    }

    //字符串正则表达式关键字转化
    $.regTrim = function(s){
      var imp = /[\^\.\\\|\(\)\*\+\-\$\[\]\?]/g;
      var imp_c = {};
      imp_c["^"] = "\\^";
      imp_c["."] = "\\.";
      imp_c["\\"] = "\\\\";
      imp_c["|"] = "\\|";
      imp_c["("] = "\\(";
      imp_c[")"] = "\\)";
      imp_c["*"] = "\\*";
      imp_c["+"] = "\\+";
      imp_c["-"] = "\\-";
      imp_c["$"] = "\$";
      imp_c["["] = "\\[";
      imp_c["]"] = "\\]";
      imp_c["?"] = "\\?";
      s = s.replace(imp,function(o){
        return imp_c[o];
      });
      return s;
    };
    $(this).each(function(){
      var t = $(this);
      str = $.trim(str);
      if(str === ""){
        alert("关键字为空");
        return false;
      }else{
        //将关键字push到数组之中
        var arr = [];
        if(sets.divFlag){
          arr = str.split(sets.divStr);
        }else{
          arr.push(str);
        }
      }
      var v_html = t.html();
      //删除注释
      v_html = v_html.replace(/<!--(?:.*)\-->/g,"");
      //替换成chageText文本
      if(sets.changeText != ''){
        v_html = sets.changeText
      }

      function preg_quote( str ) {
        // http://kevin.vanzonneveld.net
        // +   original by: booeyOH
        // +   improved by: Ates Goral (http://magnetiq.com)
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   bugfixed by: Onno Marsman
        // *     example 1: preg_quote("$40");
        // *     returns 1: '\$40'
        // *     example 2: preg_quote("*RRRING* Hello?");
        // *     returns 2: '\*RRRING\* Hello\?'
        // *     example 3: preg_quote("\\.+*?[^]$(){}=!<>|:");
        // *     returns 3: '\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:'

        return (str+'').replace(/([\\\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1");
      }

      //将HTML代码支离为HTML片段和文字片段，其中文字片段用于正则替换处理，而HTML片段置之不理
      var tags = /[^<>]+|<(\/?)([A-Za-z]+)([^<>]*)>/g;
      var a = v_html.match(tags), test = 0;
      $.each(a, function(i, c){
        if(!/<(?:.|\s)*?>/.test(c)){//非标签
          //开始执行替换
          $.each(arr,function(index, con){
            if(con === ""){return;}
//          var reg = new RegExp($.regTrim(con), "gi");
            var reg = new RegExp( "(" + $.regTrim(preg_quote( con )) + ")" , 'gi' )
            if(reg.test(c)){
              //正则替换
              c = c.replace(reg,"♂"+"$1"+"♀");
              test = 1;
            }
          });
          c = c.replace(/♂/g,"<span rel='mark' "+clStr+">");
          c = c.replace(/♀/g,"</span>")
          a[i] = c;
        }
      });
      //将支离数组重新组成字符串
      var new_html = a.join("");

      $(this).html(new_html);

      if(test === 0 && sets.nullReport){
//      alert("没有搜索结果");
        return false;
      }

      //执行回调函数
      sets.callback();
    });
  };
})(jQuery);