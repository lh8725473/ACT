angular.module('App.Locales').config(['$translateProvider', function($translateProvider) {
  $translateProvider.translations('en-EN', {

    "*********************************************************": "Link",
    "LANG_UPLOAD_FILE": "Upload File",
    "LANG_LINK_NAME": "Name",
    "LANG_LINK_SIZE": "Number/Size",
    "LANG_LINK_UPDATE_TIME": "Update Time",
    "LANG_LINK_FILE_NULL": "File is Null!",
    "LANG_LINK_HAVE_SAVED": "Save \"{{name}}\" to My HandsSync",
    "LANG_LINK_AUTO_SAVE": "I'll save to your HansSync account after login successfully",
    "LANG_LINK_NO_ACCOUNT": "No Account? ",
    "LANG_LINK_REGISTER_NOW": "Register Now",

    "*********************************************************": "Link Login",
    "LANG_USER_Register": "Register",
    "LANG_USER_SIGN_OUT": "Sign Out",
    "LANG_USER_LOGIN": "Log In",
    "LANG_USER_REMMBER_PASSWORD": "Remember Password",
    "LANG_USER_FORGET_PASSWORD": "Forgot Password?",
    "LANG_USER_PASSWORD": "Password",
    "LANG_USER_NAME_EMAIL": "User Name/Email",

    "*********************************************************": "Link Preview",
    "LANG_DOWNLOAD_FILE": "Download File",
    "LANG_SAVE_TO_HANDSSYNC": "Save to My HandsSync",
    "LANG_LINK_EXPIRATION": "Link expiration to {{date}}",
    "LANG_NOT_SUPPORT_FILE_TYPE": "Unknown file<span ng-show=\"{{is_download}}\">, please <a ng-click='downloadFile()'>download</a> to preview.</span>",
    "LANG_NOT_SUPPORT_BIG_FILE": "Exceed the allowed preview size<span ng-show=\"{{is_download}}\">, please <a ng-click='downloadFile()'>download</a> to preview.</span>",    
    "LANG_DOWNLOAD_PREVIEW": "Download",
    "LANG_RIGHT_ROTATE": "Right Rotate",
    "LANG_LEFT_ROTATE": "Left Rotate",
    "LANG_VIEW_ORIGINAL": "View Original"

  });
}]);