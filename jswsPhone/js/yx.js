/*add by chenqiaoling 2016-06-16 绝世武神英雄页脚本*/
$(function(){			
	var swiper = new Swiper('.swiper-container', {
		wrapperClass: 'swiper-wrapper',
		slideClass: 'swiper-slide',
		mode: 'vertical',
		initialSlide: 0,
		noSwiping: true,
		preventClicksPropagation: false,
		onSlideChangeEnd: function (swiper) {
                    if(swiper.activeIndex ==3){
                    	$(".nextslide").hide();
                    }else{
                    	$(".nextslide").show();
                    }
                }
	});

	$(".nextslide").tap(function(){
		if(swiper.activeIndex == 3){
			$(".nextslide").hide();
			return false;
		}else{
			$(".nextslide").show();
		}
		swiper.swipeNext();
	});

	
	$(".js_showWx").tap(function(e){
		$("#showWx").animate({"top":"0"},1000,"linear");
		e.stopPropagation();
	});
	$(".si2_1").tap(function(e){
		$(".si2_1 .wx_fu").show();
		e.stopPropagation();
	});
	$(".si2_2").tap(function(e){
		$(".si2_2 .wx_dy").show();
		e.stopPropagation();
	});
	$("body").tap(function(e){
		if($(e.target).attr("id") != "showWx" && $(e.target).parent().attr("id") != "showWx" && !$(e.target).parent().hasClass("shareitem2")){
			$(".wx_fu").hide();
			$(".wx_dy").hide();

			$("#showWx").animate({"top":"100%"},1000,"linear");
		}
	});

	//判断横竖屏提示 
	window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function () {
    			if (window.orientation === 180 || window.orientation === 0) {
          			// alert('竖屏状态！');
        		}
    			if (window.orientation === 90 || window.orientation === -90) {
          			alert('为了更好的查看页面，请竖屏查看，谢谢');
        		}
  		}, false);	

	//预加载
	var loader = {
		init: function () {
			this._loadImages(pics, function () {
				//$(".loading").hide();
				$('.swiper-container').show();
			});
		},
		_loadImages: function (arr, callback) {
			var newimages = [], loadedimages = 0;
			var context = this;

			function imageloadpost() {
				var percent = loadedimages / arr.length;
				if (loadedimages == arr.length - 1) {
					context._drawLoadProgress(1);
					callback();
					return;
				} else {
					loadedimages++;
				}
				context._drawLoadProgress(percent);
			}

			for (var i = 0; i < arr.length; i++) {
				newimages[i] = new Image();
				newimages[i].src = arr[i];
				newimages[i].onload = function () {
					imageloadpost();
				};
				newimages[i].onerror = function () {
					imageloadpost();
				};
			}
		},
		_drawLoadProgress: function (w) {
			//var num = Math.floor(w * 100) >= 100 ? 100 : Math.floor(w * 100);
			//$('.loading-progress').css({width: num + '%'});
			//$(".loading-num").html(num + "%");
		}
	};
	loader.init();

});