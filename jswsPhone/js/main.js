/*add by chenqiaoling 2016-06-16 绝世武神首页脚本*/
$(function () {
	//视频播放的弹层
    var video = {
        init: function (src, config) {
            var options_video = $.extend({
                loop: true,
                preload: "auto",
                src: src,
                autoplay: true
            }, config);
            var context = this;

            this._video = new Audio();
            for (var key in options_video) {
                if (options_video.hasOwnProperty(key) && (key in context._video)) {
                    context._video[key] = options_video[key];
                }
            }
            context.bind();
            context._video.load();
        },
        bind: function () {
            var context = this, timeoutId;
            this._video.addEventListener('canplaythrough', function () {
                clearTimeout(timeoutId);
                context.canPlay = true;
            }, false);
            this._video.addEventListener('error', function () {
                clearTimeout(timeoutId);
                context.error = true;
            });
            this._video.addEventListener('play', function () {
            });
            this._video.addEventListener('pause', function () {
            });
            timeoutId = setTimeout(function () {
                context.timeout = true;
            }, 1000);
        },
        play: function () {
            $('.video_box').show();
            $('.video_con').show();
            this._video.play();
        },
        pause: function () {
            this._video.pause();
        },
        close: function(){
            $('.video_box').hide();
            $('.video_con').hide();
            this._video.ended = true;
        }
    };

    $('.img-04').click(function () {
        video.init("http://download.gyyx.cn/Default.ashx?typeid=938&amp;netType=1&amp;file=jsws-xtj.mp4");
        video.play();
    });
    $('.video_close').click(function (e) {
        video.close();
        e.stopPropagation();
    });
    $('.video_box').click(function () {
        video.close();
        e.stopPropagation();
    });
    $(".slide_item_yxsp ul li span").click(function(){
        var src = $(this).attr("data-src");
        src = "http://download.gyyx.cn/Default.ashx?typeid=938&amp;netType=1&amp;file=jsws-xtj.mp4";
        video.init(src);
        video.play();
    })


    //判断是不是微信访问的
    function is_weixin() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            return true;
        } else {
            return false;
        }
    }
    var browser = {
        versions: function () {
            var u = navigator.userAgent, app = navigator.appVersion;
            return {
                trident: u.indexOf('Trident') > -1,
                presto: u.indexOf('Presto') > -1,
                webKit: u.indexOf('AppleWebKit') > -1,
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,
                mobile: !!u.match(/AppleWebKit.*Mobile.*/),
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
                iPhone: u.indexOf('iPhone') > -1,
                iPad: u.indexOf('iPad') > -1,
                webApp: u.indexOf('Safari') == -1
            }
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    };

    function init() {
        if (is_weixin()) {
            if (browser.versions.ios || browser.versions.iPhone || browser.versions.ios & browser.versions.iPad) {
                //weixin为提示使用浏览器打开的div
                $(".dec_down").unbind().bind("click", function () {
                    alert("IOS版本敬请期待！")
                });

            } else {

                $(".dec_down").click(function () {
                    alert("请用浏览器打开,进行下载")
                    /* if (confirm("请用浏览器打开,进行下载")) {
                            window.location.href = "http://download.gyyx.cn/Default.ashx?typeid=992&netType=1&file=gyyx_cn.gyyx.mobile.jsws414%281%29.apk"
                        }*/

                });
            }
        } else {
            if (browser.versions.ios || browser.versions.iPhone || browser.versions.ios & browser.versions.iPad) {
                //下载页
                $(".dec_down").unbind().bind("click", function () {
                    alert("IOS版本敬请期待！")
                });

            } else {

                $(".dec_down").attr("href", "http://download.gyyx.cn/Default.ashx?typeid=992&netType=1&file=gyyx_cn.gyyx.mobile.jsws414%281%29.apk");
            }
        }
    }
    init();//顶部立即下载

    //切换
      var Tab =  function(tabNav, tabCont, tabItem){ 
          var $li = $('.'+tabNav+' li'); 
          var $ul = $('.'+tabCont+' .'+tabItem);
          $li.click(function(){
              var $this = $(this); 
              var $t = $this.index();        
              $li.removeClass();        
              $this.addClass('on');        
              $ul.css('display','none');        
              $ul.eq($t).css('display','block');      
          })    
      }
      
      Tab("title_word", "main_word", "list_word");
      Tab("tab_nav_yxsp", "tab_cont_yxsp", "tab_item_yxsp");
      Tab("tab_nav_yxgl", "tab_cont_yxgl", "tab_item_yxgl");

      //焦点轮播图
      var slider = $('#slider');
      slider.find(".slide-trigger").find("li").eq(0).addClass("on");
          window.mySwipe = new Swipe(document.getElementById('slider'), {
              speed: 400,
          auto: 3000,
          callback: function(index, elem) {
                  slider.find(".slide-trigger").find("li").eq(index).addClass("on").siblings().removeClass("on");
          }
          });

          var slider2 = $('#slider2');
      slider2.find(".slide-trigger2").find("li").eq(0).addClass("on");
          window.mySwipe2 = new Swipe(document.getElementById('slider2'), {
              speed: 400,
          auto: 3000,
          callback: function(index, elem) {
                  slider2.find(".slide-trigger2").find("li").eq(index).addClass("on").siblings().removeClass("on");
          }
          });

          var slider3 = $('#slider3');
      slider3.find(".slide-trigger3").find("li").eq(0).addClass("on");
          window.mySwipe3 = new Swipe(document.getElementById('slider3'), {
              speed: 400,
          auto: 3000,
          callback: function(index, elem) {
                  slider3.find(".slide-trigger3").find("li").eq(index).addClass("on").siblings().removeClass("on");
          }
          });

          //第一屏滑动
          var page1Height = $("#page1").height();
          var logoHeight = $(".img-01").height();
      $("#pageTrigger").click(function(){
          if($(window).scrollTop() <= page1Height){
              $("body").animate({"scrollTop": page1Height},300);
              $("#pageTrigger").hide();
          }               
          return false;
      });

      //全局变量，触摸开始位置  
      var startX = 0, startY = 0, dir, t;  
      //touchstart事件  
      function touchSatrtFunc(evt) {
          //clearTimeout(t);  
          try  {  
              //evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等  
              var touch = evt.touches[0]; //获取第一个触点  
              var x = Number(touch.pageX); //页面触点X坐标  
              var y = Number(touch.pageY); //页面触点Y坐标  
              //记录触点初始位置  
              startX = x;  
              startY = y;  
          }  catch (e) {  
              alert('touchSatrtFunc：' + e.message);  
          }  
      }  

      //touchmove事件，这个事件无法获取坐标  
      function touchMoveFunc(evt) {  
          try {  
              //evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等  
              var touch = evt.touches[0]; //获取第一个触点  
              var y = Number(touch.pageY); //页面触点Y坐标      
      if (y - startY >0) {  
          dir = "down";                       
      }  else if( y - startY < 0){
          dir = "up";
      }
          } catch (e) {  
              alert('touchMoveFunc：' + e.message);  
          }  
      }  

      //touchend事件  
      function touchEndFunc(evt) {  
          //evt.preventDefault();   
          //t = setTimeout(function(){
              try {  
                  if(dir == "down"){
                      if($(window).scrollTop() >= 0 && $(window).scrollTop() <= page1Height){
                  $("#pageTrigger").show();
              }
          }else if( dir == "up") {
                  if($(window).scrollTop() >= logoHeight*2 && $(window).scrollTop() <= page1Height){
                      $("body").animate({"scrollTop": page1Height}, 300); 
                      $("#pageTrigger").hide();
                  }else{
                      $("#pageTrigger").hide();
                  }                       
          }
              }  catch (e) {  
                  alert('touchEndFunc：' + e.message);  
              }
         // }, 300);
      }  
      //绑定事件  
      function bindEvent() {  
          document.addEventListener('touchstart', touchSatrtFunc, false);  
          document.addEventListener('touchmove', touchMoveFunc, false);  
          document.addEventListener('touchend', touchEndFunc, false);  
      }

      window.onload = bindEvent;

      //底部显示微信和二维码
      $(".js_showWx").click(function(e){
            $("#showWx").animate({"top":"0"},1000,"linear");
            e.stopPropagation();
      });
          $(".si2_1").click(function(e){
              $(".wx_fu").show();
                      e.stopPropagation();
          });
          $(".si2_2").click(function(e){
              $(".wx_dy").show();
                      e.stopPropagation();
          });
          $("body").click(function(e){
              if($(e.target).attr("id") != "showWx" && $(e.target).parent().attr("id") != "showWx" && !$(e.target).parent().hasClass("shareitem2")){
                  $(".wx_fu").hide();
                  $(".wx_dy").hide();

                  $("#showWx").animate({"top":"100%"},1000,"linear");
              }
          });

          $(".hex a").click(function(){
          	if($(this).attr("href") == ""){
          		alert("敬请期待");
          		return false;
          	}
          });
          $(".hex a").each(function(){
          	if($(this).attr("href") == ""){
          		$(this).parent().css("opacity", 0.5);
          	}
          });


         function getNewsList(linum){
                var url = "data/news_list.json";
                if(linum == 0){
                  url = "data/news_list.json";
                }
                $.ajax({
                  url:url,
                  type:"GET",
                  dataType:"json",
                  success: function(d){
                    if(d.data.length > 0){
                      var liHtml = "";
                      for(var i=0;i<d.data.length;i++){                       
                      liHtml += '<li class="word"><a href="'+d.data[i].url+'">'+
                        '<span class="wanfa">'+d.data[i].channel+'</span>'+
                        '<span class="neirong">'+d.data[i].title+'</span>'+
                        '<span class="data">'+d.data[i].date+'</span>'+
                      '</a></li>'
                      }
                      $(".list_word").eq(linum).html(liHtml);
                    }
                  }
                });
            }

            
});

