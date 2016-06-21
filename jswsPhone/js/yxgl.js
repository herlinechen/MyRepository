/*add by chenqiaoling 2016-06-16 绝世武神首页脚本*/
$(function () {
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
					alert("请用浏览器打开,进行下载");
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

	var newsData =[];
	var page = [0,0,0,0];
	var cate = 0;
	var pageNum = 6;

	getNewsData();
	showNews();

	//切换
	function Tab(tabNav, tabCont, tabItem){ 
		var $li = $('.'+tabNav+' li'); 
		var $ul = $('.'+tabCont+' .'+tabItem);
		$li.click(function(){
			var $this = $(this); 
			var $t = $this.index(); 
			if($this.hasClass("on")){
				return false;
			}
			$li.removeClass();        
			$this.addClass('on');        
			$ul.css('display','none');        
			$ul.eq($t).css('display','block');

			cate = $t;
			getNewsData();
			if($ul.eq($t).html() == ""){
				showNews();
			}
			if(newsData[cate].data.length == $(".list_word").eq(cate).find(".word").length){
				$(".loading").css("display","none");
				$(".loaded").css("display","block");
				//return false;
			}else{
				$(".loading").css("display","block");
				$(".loaded").css("display","none");
			}
			

		});    
	}

	Tab("title_word", "main_word", "list_word");

	//获取列表数据
	function getNewsData(){
		if(!newsData[cate]){               
			$.ajax({
				url:dataUrl[cate],
				type:"GET",
				async: false,
				dataType:"json",
				success: function(d){
					newsData[cate] = d;
				}
			});
		}
	}
	//显示列表数据
	function showNews(){
		var datalist = newsData[cate].data;
		if(datalist.length == 0){
			$(".list_word").eq(cate).html('<li class="nodata">暂无数据</li>');
			return false;
		}
		var liHtml = "";
		var  p = (page[cate]) * pageNum;
		var pn = pageNum;

		if(datalist.length - p <= 0){
			$(".loading").css("display","none");
			$(".loaded").css("display","block");
			return false;
		} else if(datalist.length - p <= pageNum){
			pn = datalist.length - p;
		}
		for(var i=0;i<pn;i++){
			k = p + i;                      
			liHtml += '<li class="word"><a href="'+datalist[k].url+'">'+
				'<span class="wanfa">'+datalist[k].channel+'</span>'+
				'<span class="neirong">'+datalist[k].title+'</span>'+
				'<span class="data">'+datalist[k].date+'</span>'+
				'</a></li>';
		}
		if(p == 0){
			$(".list_word").eq(cate).html(liHtml);
		}else{
			$(".list_word").eq(cate).append(liHtml);
		}
	}

	//全局变量，触摸开始位置  
	var startX = 0, startY = 0, dir, t;  
	//touchstart事件  
	function touchSatrtFunc(evt) {
		clearTimeout(t);
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
		} catch (e) {  
			alert('touchMoveFunc：' + e.message);  
		}  
	}  

	//touchend事件  
	function touchEndFunc(evt) {
		try {  
			if($(document).scrollTop() >= $(document).height() - $(window).height()){			
				t = setTimeout(function(){
					page[cate]++;
					showNews();
				}, 300);
			}
		}  catch (e) {  
			alert('touchEndFunc：' + e.message);  
		}
	}  
	//绑定事件  
	function bindEvent() {  
		document.addEventListener('touchstart', touchSatrtFunc, false);  
		document.addEventListener('touchmove', touchMoveFunc, false);  
		document.addEventListener('touchend', touchEndFunc, false);  
	}

	window.onload = bindEvent;

});

