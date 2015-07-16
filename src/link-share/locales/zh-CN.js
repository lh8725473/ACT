angular.module('App.Locales').config(['$translateProvider', function($translateProvider) {
  $translateProvider.translations('zh-CN', {

    "*********************************************************": "Link",
    "LANG_UPLOAD_FILE": "上传文件",
    "LANG_LINK_NAME": "名称",
    "LANG_LINK_SIZE": "个数/大小",
    "LANG_LINK_UPDATE_TIME": "修改时间",
    "LANG_LINK_FILE_NULL": "此文件夹为空！",
    "LANG_LINK_HAVE_SAVED": "将“{{name}}”保存到我的全携通",
    "LANG_LINK_AUTO_SAVE": "成功登录后文件将自动保存到你的全携通账户",
    "LANG_LINK_NO_ACCOUNT": "没有账号？",
    "LANG_LINK_REGISTER_NOW": "立即注册",

    "*********************************************************": "Link Login",
    "LANG_USER_Register": "注册",
    "LANG_USER_SIGN_OUT": "退出",
    "LANG_USER_LOGIN": "登录",
    "LANG_USER_REMMBER_PASSWORD": "记住密码",
    "LANG_USER_FORGET_PASSWORD": "忘记密码？",
    "LANG_USER_PASSWORD": "密码",
    "LANG_USER_NAME_EMAIL": "用户名或邮箱",

    "*********************************************************": "Link Preview",
    "LANG_DOWNLOAD_FILE": "下载文件",
    "LANG_SAVE_TO_HANDSSYNC": "保存到我的全携通",
    "LANG_LINK_EXPIRATION": "链接有效期至 {{date}}",
    "LANG_NOT_SUPPORT_FILE_TYPE": "暂不支持此类型文件预览<span ng-show=\"{{is_download}}\">，请<a ng-click='downloadFile()'>下载</a>查看</span>",
    "LANG_NOT_SUPPORT_BIG_FILE": "文件太大，暂不支持预览<span ng-show=\"{{is_download}}\">，请<a ng-click='downloadFile()'>下载</a>后查看</span>",
    "LANG_DOWNLOAD_PREVIEW": "下载",
    "LANG_LEFT_ROTATE": "向左旋转",
    "LANG_RIGHT_ROTATE": "向右旋转",
    "LANG_VIEW_ORIGINAL": "查看原图"

  });
}]);