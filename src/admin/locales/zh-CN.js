angular.module('App.Locales').config(['$translateProvider', function($translateProvider) {
  $translateProvider.translations('zh-CN', {
    "ADMIN_CONSOLE_OF_ACT": "管理控制台",

    "PERMISSION_VALUE_1": "协同拥有者",
    "PERMISSION_VALUE_2": "编辑者",
    "PERMISSION_VALUE_3": "查看上传者",
    "PERMISSION_VALUE_4": "预览上传者",
    "PERMISSION_VALUE_5": "查看者",
    "PERMISSION_VALUE_6": "预览者",
    "PERMISSION_VALUE_7": "上传者"
  });
}]);