//页首滚动banner
jQuery(".slideBox").slide({ mainCell: ".bd ul", effect:"left", autoPlay: true });
//onepage scroll

var winHeight = parseInt($(window).height());
//alert($(window).height());
$(function () {
    $('.main').onepage_scroll({
        sectionContainer: '.page',
        pagination: false,
        responsiveFallback:767,
        loop:false,        
        beforeMove: function (index) {
           
            switch(index){
                case 1:
                    $(".JS-main-menu-fixed").hide();
                    break;
                case 6:
                    $(".scroll-page").hide();
                    break;
                default:
                    $(".scroll-page").show();
                    break;
                 
            }
        },
        afterMove: function(index){
        switch(index){
            case 1:
                $(".JS-main-menu-fixed").hide();
                break;
           
            default:
                if (parseInt($(window).width()) >= 768) {
                    $(".JS-main-menu-fixed").slideDown(600);
                }
                break;
        }
    }

        
    }); 
    $(".slideBox .bd li").height(winHeight);

    $(".scroll-page").click(function () { $(".main").moveDown(); });
    //change window size ,reload page
    $(window).resize(function () { setTimeout(function () { window.location.reload(); }, 1) });
    $(".Js-feature").click(function () {$('.main').moveTo(2); });
    $(".Js-businessMainly").click(function () { $('.main').moveTo(6); });
});
 
 
