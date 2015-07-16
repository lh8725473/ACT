angular.module('App.Locales').config(['$translateProvider', function($translateProvider) {
  $translateProvider.translations('en-EN', {
    "ADMIN_CONSOLE_OF_ACT": "Admin Console of ACT",

    "PERMISSION_VALUE_1": "Co-Owner",
    "PERMISSION_VALUE_2": "Editor",
    "PERMISSION_VALUE_3": "Viewer & Uploader",
    "PERMISSION_VALUE_4": "Previewer & Uploader",
    "PERMISSION_VALUE_5": "Viewer",
    "PERMISSION_VALUE_6": "Previewer",
    "PERMISSION_VALUE_7": "Uploader"
  });
}]);