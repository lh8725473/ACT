function createCookie(name, value, days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    var expires = '; expires=' + date.toGMTString();
  } else {
    var expires = '';
  }
  document.cookie = name + '=' + value + expires + '; path=/';
}

function createCookieULR(){//记录上一个页面的URL
  var createFlag = true
  var referrer = document.referrer
  if(referrer.indexOf('101.231.216.75') > 0 || referrer.indexOf('192.168.1.') > 0 || referrer.indexOf('quanxietong.com') > 0){
    createFlag = false
  }
  if(createFlag){
    createCookie('FROM_URL', referrer, 30)
  }
}

createCookieULR()