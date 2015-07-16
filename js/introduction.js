$(function(){
    var $wh = $(window).height();
    if( $wh >= 768 ){

      $('#introduction').fullpage({
          sectionsColor: ['#26a1ce', '#26a1ce', '#26a1ce'],
          /*continuousVertical: true,//循环滚
          'navigation': true,//右侧导航*/
          verticalCentered:false,


      }); 

      $(window).resize(function(){
          autoScrolling();
      });

      function autoScrolling(){
          var $ww = $(window).width();
          if($ww < 768){
              $.fn.fullpage.setAutoScrolling(false);
          } else {
              $.fn.fullpage.setAutoScrolling(true);
          }
      }

      autoScrolling();

    }else{
        $('html, body').css({
            'overflow' : 'auto',
            'height' : '100%'
        });
    }
    

    

});