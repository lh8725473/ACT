$(function(){
	var b=browser();
  if(!isWeiXin()){     
    //苹果设备    
    if (b.ios||b.iPhone||b.iPad)
    {
      $('#downloadApp').attr('href', 'https://itunes.apple.com/us/app/quan-xie-tong/id914925405'); 
    }
    else if(b.android) {//android
      $('#downloadApp').attr('href', 'http://www.quanxietong.com/quanxietong.apk');
    }                        
  } else {
    $('#downloadApp').attr('href', 'http://a.app.qq.com/o/simple.jsp?pkgname=com.icocoa_flybox'); 
  }
});
function getUrlParameter(name) {
  var queryString = window.location.toString().split("?");
  if (queryString.length > 1) {
    var params = queryString[1].split("&");
    for (var i = 0; i < params.length; ++i) {
      var param = params[i].split("=");
      if (param[0] == name) {
      	return unescape(param[1]);
      }
    }
	}
}//end getUrlParameter

function createCookie(name, value, days) {
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      var expires = '; expires=' + date.toGMTString();
    } else {
      var expires = '';
    }
    document.cookie = name + '=' + value + expires + '; path=/';
}//end createCookie

function readCookie(name) {
  var nameEQ = name + '=';
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
    	c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) == 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
}//end readCookie

function removeCookie(name) {
	createCookie(name, '', -1);
}

//errorMsg
function errorMsg(str) {
  $('.errorMsg').find('p').text(str);
  $('.errorMsg').css('left', ($(window).width() * 0.5 - ($('.errorMsg').width() + 50) * 0.5) + 'px');
  $('.errorMsg').css('top', $(window).height() * 0.1);
  $(".errorMsg").fadeIn();
  setTimeout(function() {
    $(".errorMsg").fadeOut();
  }, 2000);
}

$(".errorMsg .close").click(function() {
  $(".errorMsg").hide();
})

//app打开判断
function browser() {
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
//判断是否是微信浏览器
function isWeiXin(){ 
  var ua = window.navigator.userAgent.toLowerCase(); 
  if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
    return true; 
  } else { 
    return false; 
  } 
}
var timeout;
function open_appstore() {
	var b=browser();
	if(b.ios||b.iPhone||b.iPad){
		window.location="https://itunes.apple.com/us/app/quan-xie-tong/id914925405";
	}else if(b.android){
		window.location="http://www.quanxietong.com/api/app/download?type=app_android";
	}
} 
function try_to_open_app() {
	var b=browser();
	var key = getUrlParameter('key');
	var pwd = readCookie(key + '_pwd');

	if(b.ios||b.iPhone||b.iPad){
		if(pwd){
			window.location="quanxietonglingli://link?key=" + key +"&pwd=" + pwd;
		}else{
			window.location="quanxietonglingli://link?key=" + key 
		}

	}else if(b.android){
		if(pwd){
			window.location="quanxietong://jp.app/open?key=" + key +"&pwd=" + pwd;
		}else{
			window.location="quanxietong://jp.app/open?key=" + key
		}
		 
	}
	timeout = setTimeout('open_appstore()', 30);
}//end try_to_open_app

$(document).bind("mobileinit", function() {
			// disable ajax nav
			$.mobile.ajaxEnabled=false
});//禁用ajax转场

//.page
$(document).on("pageshow", ".page", function() {
	$(".popup-btn").on("click", function(e){
    $(".popup-menu").show();
    if(readCookie('token') == null){//没登陆隐藏退出
    	$(".popup-menu > .ui-listview > .exit").hide();
      $(".popup-menu > .ui-listview").listview('refresh');
    }else{//登陆显示退出
    	$(".popup-menu > .ui-listview > .exit").show();
      $(".popup-menu > .ui-listview").listview('refresh');
    }

    var b=browser();
    if(b.ios||b.iPhone||b.iPad){
    	$(".popup-menu > .ui-listview >.downloadLi").hide();
    	$(".popup-menu > .ui-listview").listview('refresh');
    }else if(b.android){//安卓有下载
    	$(".popup-menu > .ui-listview >.downloadLi").show();
    	$(".popup-menu > .ui-listview").listview('refresh');
    }

    $(document).on("click", function(){
      $(".popup-menu").hide();
    });
	  e.stopPropagation();
	}); //end popup-btn

	$(".download_suggestion .close").click(function() {
    $(".download_suggestion").hide();
	});

	$(".page").on("swiperight",function(){
    history.back()
  });//右滑动返回上一页

	var folder_id = 0
	var file_id = 0
	var key = getUrlParameter('key');
	var pwd = readCookie(key + '_pwd');
	if(pwd){
		urlpwd = CONFIG.API_ROOT + "/share/detail?key=" + key + "&pwd=" + pwd;
	}else{
		urlpwd = CONFIG.API_ROOT + "/share/detail?key=" + key
	}

	$(".enter-password").hide();//初始化密码界面隐藏
	//是否需要密码
	$.ajax({
	  method: "GET",
	  url: urlpwd,
	  dataType: 'json',
	  /*async:false*/
	}).done(function(obj) {//不需要密码
		//不显示跳转输入密码遮罩层
		$(".enter-password").hide();
		callBack(obj);

	}).fail(function(xhr, status, error) {//需要要密码
		var err = eval('(' + xhr.responseText + ')');
		if( err.result == "该链接已失效或被删除"){
				errorMsg(err.result);
				//显示输入密码遮罩层
				$(".enter-password").show();
				$("input").attr("disabled", "disabled");
		}else{
			  //显示输入密码遮罩层
			  $(".enter-password").show();

			  //点击按钮触发checkPasswrod（）
			  $(".enter-password .btn").bind('click', function(e) {
			  	/*var passWord = "e10adc3949ba59abbe56e057f20f883e";//123456*/
			  	var pw = $(".enter-password .form-control")[0].value;
			  	var password = $.md5(pw);
			  	$.ajax({//检查密码接口
				    method: "GET",
				    url: CONFIG.API_ROOT + '/share/check?key='+ key + '&pwd=' + password,
				    dataType: 'json'
					}).done(function(obj) {//检查成功
						 //遮罩层消失
				  	$(".enter-password").hide();
				  	createCookie(key + '_pwd', password, 30);

				  	$.ajax({//检查密码接口
					    method: "GET",
					    url: CONFIG.API_ROOT + "/share/detail?key=" + key + "&pwd=" + readCookie(key + '_pwd'),
					    dataType: 'json'
						}).done(function(obj) {
							callBack(obj);
						})

					}).fail(function(xhr, status, error) {//检查失败
				    //遮罩层不消失提示密码不正确继续输入密码
				  	errorMsg('您输入的密码不正确请重新输入密码');

				  });

			  })//end bind click
		}
	  

	});


function  callBack(obj){
	//头部分享的是文件夹名或文件名
	$(".wap_header > .download_text ").html(obj.result.obj_name)

	//分享的是文件夹还是文件
	if(obj.result.obj_type == 'folder'){
		folder_id = obj.result.obj_id
	}else{
		file_id = obj.result.obj_id
	}

	folder_id = (getUrlParameter('folder_id')) ? getUrlParameter('folder_id') : folder_id
	file_id = (getUrlParameter('file_id')) ? getUrlParameter('file_id') : file_id

	var pwd = readCookie(key + '_pwd');
	//渲染列表
	if(folder_id != 0 && file_id == '0'){//文件夹
		//path
	  $.ajax({
	    method: "GET",
	    url: CONFIG.API_ROOT + '/folder/path/' + folder_id + '?key=' + key,
	    dataType: 'json'
		})
	  .done(function(obj) {
	  	for (var i = 0; i < obj.result.length; i++) {
	  		$(".wap_header > .download_text ").html(obj.result[obj.result.length-1].name)
	  	}
	  })//end path

		if(pwd){
			url = CONFIG.API_ROOT + "/share/folder/objList?folder_id=" + folder_id + "&key=" + key + "&pwd=" + pwd;
		}else{
			url = CONFIG.API_ROOT + "/share/folder/objList?folder_id=" + folder_id + "&key=" + key;
		}
	  $(".ui-content").html("<ul data-role='listview' data-theme='custom' class='folder-list'></ul>").trigger('create').removeClass("wap_content");
	  $(".ui-content > .folder-list").empty();
	  $.ajax({
	    method: "GET",
	    url: url,
	    dataType: 'json'
		})
	  .done(function(obj) {
	    for (var i = 0; i < obj.result.length; i++) {
	      var folderlist = "";
	      var iconPath = CONFIG.ICONS_PATH + CONFIG.ICONS.all.small;
	      var type = ''
	      if (obj.result[i].isFolder == 1) { //文件夹列表
	        iconPath = CONFIG.ICONS_PATH + CONFIG.ICONS.folder.small;
	        folderlist = "<li><a href='wap-link.html?folder_id=" + obj.result[i].folder_id + "&key=" + key + "' data-transition='slide' class='file'><img src='" + iconPath + "'><h2>" + obj.result[i].folder_name + "</h2><p><time>" + obj.result[i].action + "</time><span>" + obj.result[i].file_count + "</span></p></a></li>";
	    	} else {//文件列表
	        var str = obj.result[i].file_name;
	        var ext = str.split('.')[1]
	        if(ext){
	        	ext = ext.toLowerCase();
	        }	        
	        if (ext == 'pdf') {
	          iconPath = CONFIG.ICONS_PATH + CONFIG.ICONS.pdf.small;
	          type = 'pdf'
	        } else if (ext == 'txt') {
	          iconPath = CONFIG.ICONS_PATH + CONFIG.ICONS.txt.small;
	          type = 'txt'
	        } else if (ext == 'mp3' || ext == 'wma') {
	          iconPath = CONFIG.ICONS_PATH + CONFIG.ICONS.mp3.small;
	          type = 'mp3'
	        } else if (ext == 'mp4' || ext == 'video') {
	          iconPath = CONFIG.ICONS_PATH + CONFIG.ICONS.mp4.small;
	          type = 'mp4'
	        } else if (ext == 'xls' || ext == 'xlsx') {
	          iconPath = CONFIG.ICONS_PATH + CONFIG.ICONS.xls.small;
	          type = 'xls'
	        } else if (ext == 'doc' || ext == 'docx') {
	          iconPath = CONFIG.ICONS_PATH + CONFIG.ICONS.doc.small;
	          type = 'doc'
	        } else if (ext == 'jpg' || ext == 'jpeg' || ext == "png" || ext == 'gif' || ext == 'bmp') {
	          /*iconPath = "images/web_files_jpeg.png";*/
	          iconPath = CONFIG.API_ROOT + "/share/key?act=preview&amp;key="+ key +"&file_id="+ obj.result[i].file_id + "&pwd=" + pwd;;
	          type = 'img'
	        }else if (ext == 'zip' || ext == 'rar') {
	          iconPath = CONFIG.ICONS_PATH + CONFIG.ICONS.zip.small;
	          type = 'zip'
	        } else if (ext == 'ppt' || ext == 'pptx') {
	          iconPath = CONFIG.ICONS_PATH + CONFIG.ICONS.ppt.small;
	          type = 'ppt'
	        } else if (ext == 'note') {
	          iconPath = CONFIG.ICONS_PATH + CONFIG.ICONS.note.small;
	          type = 'note'
	        } else if (ext == 'wma') {
	          iconPath = CONFIG.ICONS_PATH + CONFIG.ICONS.wma.small;
	          type = 'wma'
	        }

	        if (type == 'pdf' || type == 'txt' || type == 'xls' || type == 'doc' || type == 'img' || type == 'ppt' || type == 'note') { //是否预览
	          folderlist = "<li data-icon='false' ><a href='wap-link.html?file_id=" + obj.result[i].file_id + "&key=" + key + "' data-transition='slide' class='file'  ><img src='" + iconPath + "'><h2>" + obj.result[i].file_name + "</h2><p><time>" + obj.result[i].action + "</time><span>" + obj.result[i].format_size + "</span></p></a></li>";
	      	} else {
	        	folderlist = "<li data-icon='false'><a data-transition='slide' class='file noSee'><img src='" + iconPath + "'><h2>" + obj.result[i].file_name + "</h2><p><time>" + obj.result[i].action + "</time><span>" + obj.result[i].format_size + "</span></p></a></li>";
	        }

	      }//end else 文件
	  		$(".ui-content > .folder-list").append(folderlist).listview('refresh');
	    }//end for

    	if($(".ui-content > .folder-list > li").length == 0){
  			$(".ui-content").html('<div class="errMsg">此文件夹为空！</div>').addClass("wap_content");
  		}

  		$(".noSee").unbind("click").bind('click', function(e) {
  			errorMsg('暂不支持此类型文件预览！');
  		})

	  });//end done
	}else{//查看文件详细
		if(pwd){
			url = CONFIG.API_ROOT + "/share/key?act=view&key=" + key + "&file_id=" + file_id + "&pwd=" + pwd;
		}else{
			url = CONFIG.API_ROOT + "/share/key?act=view&key=" + key + "&file_id=" + file_id ;
		}
		$.ajax({
			method: "GET",
		  url: url,
			dataType: 'json'
		})
		.done(function(obj) {
			$(".wap_header > .download_text ").html(obj.result.file_name)//头部文件名
			var type = ''
			var str = obj.result.file_name;
			/*var str = '00list.jpg';*/
			var ext = str.split('.')[1]
			if(ext){
      	ext = ext.toLowerCase();
	    }	  
			/*alert(ext);*/
			if (ext == 'pdf') {
		    type = 'pdf'
			} else if (ext == 'txt') {
		    type = 'txt'
			} else if (ext == 'mp3') {
		    type = 'mp3'
			} else if (ext == 'mp4') {
		    type = 'mp4'
			} else if (ext == 'xls' || ext == 'xlsx') {
		    type = 'xls'
			} else if (ext == 'doc' || ext == 'docx') {
		    type = 'doc'
			} else if (ext == 'jpg' || ext == 'jpeg' || ext == "png" || ext == 'gif' || ext == 'bmp') {
		    type = 'img'
			} else if (ext == 'rar') {
		    type = 'rar'
			} else if (ext == 'zip') {
		    type = 'zip'
			} else if (ext == 'ppt' || ext == 'pptx') {
		    type = 'ppt'
			} else if (ext == 'note') {
		    type = 'note'
			} else if (ext == 'wma') {
		    type = 'wma'
			} else if (ext == 'video') {
		    type = 'video'
			} else if (ext == 'apk') {
		    type = 'apk'
			}//end type

			if (type == 'pdf' || type == 'xls' || type == 'doc' || type == 'ppt') {
				$.ajax({
					method: "GET",
					url: CONFIG.API_ROOT + '/share/key?act=preview&key=' + key + '&file_id=' + file_id + '&pwd=' + pwd
				})
				.done(function(obj) {
					console.time(obj);
					$(".ui-content").html(obj).addClass("wap_content");		      
				}).fail(function(xhr, status, error) {
		      $(".ui-content").html('<div class="errMsg">文件太大，暂不支持预览</div>').addClass("wap_content");	
	  		});
			}else if(type == 'txt'){
					$.ajax({
					method: "GET",
					url: CONFIG.API_ROOT + '/share/key?act=preview&key=' + key + '&file_id=' + file_id + '&pwd=' + pwd
				})
				.done(function(obj) {
					console.time(obj);
					$(".ui-content").html(obj);		      
				})
			}else if(type == 'img'){
				$(".ui-content").html('<div class="imgdiv"><img  class="link_img" src="'+ CONFIG.API_ROOT +'/share/key?act=preview&key='+ key +'&file_id='+ file_id +'&pwd=' + pwd +'"></div>').trigger('create').addClass("img_content");
				$(function(){
				var imglist =document.getElementsByClassName("link_img");
				//安卓4.0+等高版本不支持window.screen.width，安卓2.3.3系统支持
				var _width;
				doDraw();
				window.onresize = function(){
		    //捕捉屏幕窗口变化，始终保证图片根据屏幕宽度合理显示
		    doDraw();
				}
				function doDraw(){
			    _width = window.innerWidth;
			    for( var i = 0, len = imglist.length; i < len; i++){
			        DrawImage(imglist[i],_width);
			    }
				}
				function DrawImage(ImgD,_width){
			    var image=new Image();
			    image.src=ImgD.src;
			    image.onload = function(){
		        //限制，只对宽高都大于30的图片做显示处理
		        if(image.width>30 && image.height>30){
	            if(image.width>_width){
	                ImgD.width=_width;
	                ImgD.height=(image.height*_width)/image.width;
	            }else{
	                ImgD.width=image.width;
	                ImgD.height=image.height;
	            }
		        }
			    }
				}
				})//end function
			}else if(type == 'note'){
				$.ajax({
					method: "GET",
					url: CONFIG.API_ROOT + '/share/key?act=preview&key=' + key + '&file_id=' + file_id+ '&pwd=' + pwd,
					dataType: 'json'
				})
				.done(function(obj) {
					console.time(obj);
					/*alert(obj.result.file_name);*/
					$(".ui-content").html('<div class="notediv">' + obj.result.file_content + '</div>').addClass("note_content");
					$(function(){
						var noteDiv =document.getElementsByClassName("notediv")[0];
						var imglist =noteDiv.getElementsByTagName("img");
						//安卓4.0+等高版本不支持window.screen.width，安卓2.3.3系统支持
						var _width;
						doDraw();
						window.onresize = function(){
				    //捕捉屏幕窗口变化，始终保证图片根据屏幕宽度合理显示
				    doDraw();
						}
						function doDraw(){
					    _width = window.innerWidth;
					    for( var i = 0, len = imglist.length; i < len; i++){
					        DrawImage(imglist[i],_width);
					    }
						}
						function DrawImage(ImgD,_width){
					    var image=new Image();
					    image.src=ImgD.src;
					    image.onload = function(){
				        //限制，只对宽高都大于30的图片做显示处理
				        if(image.width>30 && image.height>30){
			            if(image.width>_width){
			                ImgD.width=_width;
			                ImgD.height=(image.height*_width)/image.width;
			            }else{
			                ImgD.width=image.width;
			                ImgD.height=image.height;
			            }
				        }
					    }
						}
						})//end function
				}).fail(function(xhr, status, error) {
		      var err = eval('(' + xhr.responseText + ')');
		      errorMsg(err.result);
	  		});
			}
		}).fail(function(xhr, status, error) {
	      var err = eval('(' + xhr.responseText + ')');
	      errorMsg(err.result);
	  });//end done

	}//end else

	
	$('.downloadFile').bind('click', function(e) {
		if(file_id){
			$(this).attr("href", CONFIG.API_ROOT + "/share/key?act=download&key=" + key + "&file_id=" + file_id + "&pwd=" + pwd);
		}else{
			$(this).attr("href", CONFIG.API_ROOT + "/share/key?act=download&key=" + key + "&folder_id=" + folder_id + "&pwd=" + pwd);
		}
	});//end downloadFile	下载文件

	$('.saveFile').bind('click', function(e) {
		if(readCookie('token') == null){//没有登录
			$(this).attr("href","#dialog-login");
			//登录成功保存到全球通返回列表页面否则继续输入校验
			//click提交
			  $("#login").unbind("click").bind('click', function(e) {
			  	var userName = $('#username')[0].value;
			    var passWord = $('#password')[0].value;
			    if (!userName) {
			      errorMsg('请输入用户名');
			      return false;
			    }
			    if (!passWord) {
			      errorMsg('请输入密码');
			      return false;
			    }
			    var data = {
			      'client_id' : 'JsQCsjF3yr7KACyT',
			      'client_secret' : 'bqGeM4Yrjs3tncJZ',
			      'user_name' : userName,
			      'password' : passWord,
			      'response_type' : 'token',
			      'grant_type' : 'password',
			      'device_type' : '1',
			      'device_name' : 'web',
			      'device_info' : 'browser'
			    };
			    $.ajax({
			      url : CONFIG.API_ROOT + '/user/login',
			      type : 'post',
			      dataType : 'json',
			      /*async:false,*/
			      data : data
			    }).done(function(responseJSON) {
			      //登录成功
			      var token = responseJSON.result['access_token'];
			      var expiresin = responseJSON.result['expires_in'];
			      var user_name = responseJSON.result['user_name'];
			      var real_name = responseJSON.result['real_name'];
			      var user_pic = responseJSON.result['avatar'];
			      var user_id = responseJSON.result['user_id'];
			      var cloud_id = responseJSON.result['cloud_id'];
			      var role_id = responseJSON.result['role_id'];

			      createCookie('token', token, 30);
			      createCookie('userName', user_name, 30);
			      createCookie('realName', real_name, 30);
			      createCookie('passWord', passWord, 30);
			      createCookie('userpic', user_pic, 30);
			      createCookie('userId', user_id, 30);
			      createCookie('userType', 'qxt', 30);
			      createCookie('cloudId', cloud_id, 30);
			      createCookie('roleId', role_id, 30);
			      createCookie('lang', 'zh-CN', 30);
			      createCookie('remember', true, 30);

			      history.back(-1);//登录后返回
			      setTimeout(function(){
			      	saveLinkObj()
			      },100)
			      //保存

			    }).fail(function(xhr, status, error) {
			      var err = eval('(' + xhr.responseText + ')');
			      errorMsg(err.result);
			    });

				});//end 提交
		}else{//已经登录
			$(this).attr("href","");
			saveLinkObj();//保存
		}//end 已登录的保存
	});//end saveFile

$('.signOut').bind('click', function(e) {
	removeCookie('token')
  removeCookie('userpic')
  removeCookie('userId')
  removeCookie('userType')
  removeCookie('roleId')
  removeCookie('userName');
  removeCookie('realName');
  removeCookie('passWord')
  removeCookie('cloudId');
  removeCookie('remember');
  errorMsg('用户已经成功退出登录');
})//end exit

function saveLinkObj(){
	var folder_id = 0;
	var file_id = 0;
	var key = getUrlParameter('key');
	var pwd = readCookie(key + '_pwd');
	//分享的是文件夹还是文件
	if(obj.result.obj_type == 'folder'){
		folder_id = obj.result.obj_id
	}else{
		file_id = obj.result.obj_id
	}

	folder_id = (getUrlParameter('folder_id')) ? getUrlParameter('folder_id') : folder_id
	file_id = (getUrlParameter('file_id')) ? getUrlParameter('file_id') : file_id

	if(folder_id != 0 && file_id == '0'){
		var data = {
		  'obj_id' : folder_id,
		  'obj_type' : 'folder',
		};
	}else{
		var data = {
		  'obj_id' : file_id,
		  'obj_type' : 'file',
		};
	}
	$.ajax({
	  url : CONFIG.API_ROOT + "/share/saveLinkObj?pwd=" + pwd + "&key=" + key,
	  /*url : "http://10.10.10.66/api/share/saveLinkObj?key=" + key + "&pwd=" + pwd,出错*/
	  type : 'post',
	  dataType : 'json',
	  data : data,
	  /*async:false,*/

	  headers: {
	  	'HTTP_X_OAUTH': readCookie('token')
	  }
	}).done(function(responseJSON) {
		errorMsg('已将文件保存到您的全携通账户');
	}).fail(function(xhr, status, error) {
      var err = eval('(' + xhr.responseText + ')');
      errorMsg(err.result);
  });

}// end saveLinkObj

	}//end callback

});//end .page
