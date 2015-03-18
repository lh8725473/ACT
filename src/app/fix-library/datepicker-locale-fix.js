'use strict';
angular.module("ngLocale", [], ["$provide",
  function($provide) {
    var PLURAL_CATEGORY = {
      ZERO: "zero",
      ONE: "one",
      TWO: "two",
      FEW: "few",
      MANY: "many",
      OTHER: "other"
    };

    function getDecimals(n) {
      n = n + '';
      var i = n.indexOf('.');
      return (i == -1) ? 0 : n.length - i - 1;
    }

    function getVF(n, opt_precision) {
      var v = opt_precision;

      if (undefined === v) {
        v = Math.min(getDecimals(n), 3);
      }

      var base = Math.pow(10, v);
      var f = ((n * base) | 0) % base;
      return {
        v: v,
        f: f
      };
    }

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
    }

    var lang = readCookie('lang')
    if (lang == 'en-EN') { //英文
      $provide.value("$locale", {
        "DATETIME_FORMATS": {
          "AMPMS": [
            "AM",
            "PM"
          ],
          "DAY": [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
          ],
          "MONTH": [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
          ],
          "SHORTDAY": [
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat"
          ],
          "SHORTMONTH": [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
          ],
          "fullDate": "EEEE, MMMM d, y",
          "longDate": "MMMM d, y",
          "medium": "MMM d, y h:mm:ss a",
          "mediumDate": "MMM d, y",
          "mediumTime": "h:mm:ss a",
          "short": "M/d/yy h:mm a",
          "shortDate": "M/d/yy",
          "shortTime": "h:mm a"
        },
        "NUMBER_FORMATS": {
          "CURRENCY_SYM": "$",
          "DECIMAL_SEP": ".",
          "GROUP_SEP": ",",
          "PATTERNS": [{
            "gSize": 3,
            "lgSize": 3,
            "maxFrac": 3,
            "minFrac": 0,
            "minInt": 1,
            "negPre": "-",
            "negSuf": "",
            "posPre": "",
            "posSuf": ""
          }, {
            "gSize": 3,
            "lgSize": 3,
            "maxFrac": 2,
            "minFrac": 2,
            "minInt": 1,
            "negPre": "\u00a4-",
            "negSuf": "",
            "posPre": "\u00a4",
            "posSuf": ""
          }]
        },
        "id": "en-us",
        "pluralCat": function(n, opt_precision) {
          var i = n | 0;
          var vf = getVF(n, opt_precision);
          if (i == 1 && vf.v == 0) {
            return PLURAL_CATEGORY.ONE;
          }
          return PLURAL_CATEGORY.OTHER;
        }
      });
    } else {//默认中文
      $provide.value("$locale", {
        "DATETIME_FORMATS": {
          "AMPMS": [
            "\u4e0a\u5348",
            "\u4e0b\u5348"
          ],
          "DAY": [
            "\u661f\u671f\u65e5",
            "\u661f\u671f\u4e00",
            "\u661f\u671f\u4e8c",
            "\u661f\u671f\u4e09",
            "\u661f\u671f\u56db",
            "\u661f\u671f\u4e94",
            "\u661f\u671f\u516d"
          ],
          "MONTH": [
            "\u4e00\u6708",
            "\u4e8c\u6708",
            "\u4e09\u6708",
            "\u56db\u6708",
            "\u4e94\u6708",
            "\u516d\u6708",
            "\u4e03\u6708",
            "\u516b\u6708",
            "\u4e5d\u6708",
            "\u5341\u6708",
            "\u5341\u4e00\u6708",
            "\u5341\u4e8c\u6708"
          ],
          "SHORTDAY": [
            "\u5468\u65e5",
            "\u5468\u4e00",
            "\u5468\u4e8c",
            "\u5468\u4e09",
            "\u5468\u56db",
            "\u5468\u4e94",
            "\u5468\u516d"
          ],
          "SHORTMONTH": [
            "1\u6708",
            "2\u6708",
            "3\u6708",
            "4\u6708",
            "5\u6708",
            "6\u6708",
            "7\u6708",
            "8\u6708",
            "9\u6708",
            "10\u6708",
            "11\u6708",
            "12\u6708"
          ],
          "fullDate": "y\u5e74M\u6708d\u65e5EEEE",
          "longDate": "y\u5e74M\u6708d\u65e5",
          "medium": "y\u5e74M\u6708d\u65e5 ah:mm:ss",
          "mediumDate": "y\u5e74M\u6708d\u65e5",
          "mediumTime": "ah:mm:ss",
          "short": "yy/M/d ah:mm",
          "shortDate": "yy/M/d",
          "shortTime": "ah:mm"
        },
        "NUMBER_FORMATS": {
          "CURRENCY_SYM": "\u00a5",
          "DECIMAL_SEP": ".",
          "GROUP_SEP": ",",
          "PATTERNS": [{
            "gSize": 3,
            "lgSize": 3,
            "maxFrac": 3,
            "minFrac": 0,
            "minInt": 1,
            "negPre": "-",
            "negSuf": "",
            "posPre": "",
            "posSuf": ""
          }, {
            "gSize": 3,
            "lgSize": 3,
            "maxFrac": 2,
            "minFrac": 2,
            "minInt": 1,
            "negPre": "\u00a4\u00a0-",
            "negSuf": "",
            "posPre": "\u00a4\u00a0",
            "posSuf": ""
          }]
        },
        "id": "zh-cn",
        "pluralCat": function(n, opt_precision) {
          return PLURAL_CATEGORY.OTHER;
        }
      });
    }

  }
]);