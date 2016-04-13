/* ================
*  by chenqiaoling 2016.3.29
*  问道十周年 微信端流金岁月活动
*===============  */

/*从url获取参数*/
function getQuery(name, str) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
        r = !str ? window.location.search.substr(1).match(reg) : str.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

//Ajax请求
function Ajax(url, type, fun) {
	var xmlHttp;
	try {
		xmlhttp = new XMLHttpRequest();
	} catch (e) {
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState == 4) {
			if (xmlhttp.status == 200) {
				var Bodys = JSON.parse(xmlhttp.responseText);
				fun(Bodys);
			}
		}
	}

	xmlhttp.open(type, url, true);
	xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xmlhttp.send();
}

//返回字符的字节长度
function getByteLen(val) {
	var len = 0;
	for (var i = 0; i < val.length; i++) {
		if (val[i].match(/[^\x00-\xff]/ig) != null) {
			 //全角
		 	len += 2;
		}else{
			len += 1;
		}
	};
	return len;
}

//绑定链接
function bindLink(targetLink, pageName, para){
	// targetLink = $(".class");
	// pageName = "index.html";
	// para = {"OpenId":"", "times":"", "sign":"", "form":""}
	var par = decodeURIComponent(window.location.search);
	var href = pageName+"?";
	for(var name in para){
		var value= getQuery(name, par) != null ? getQuery(name, par) : para[name];
		href += name +"=" +value +"&";
	}
	href = href.substring(0, href.length-1);
	targetLink.attr("href", href);
}

/*首页*/
/*获取作品列表*/
function getWorkList(searchType, page, para, callbackFn, isEmpty){
	$.ajax({
		url:"data/search.json",
		type:"get",
		dataType:"json",
		async: false,
		data:{
			searchType: searchType,
			page: page,
			para: para,
			r: Math.random()
		},
		beforeSend: function(){
			$(".loading").show();
		},
		success: function(d){
			if(d.isSuccess){
				if(d.data == null){
					if(isEmpty){
						if($(".nodata").length == 0){
							$("#workList").empty().after("<p class='nodata'>"+d.message+"</p>");
						}					
						$(".loading").hide();
						flag = false;
					}else{
						$(".nodata").remove();
						$(".loading").hide();
						flag = false;
					}					
				}else{
					$(".loading").hide();
					$(".nodata").remove();
					if( callbackFn && typeof callbackFn == "function" ){
						callbackFn(d,isEmpty);
					}
					flag = true;
				}
			}else{
				alert(d.message);
				flag = false;
			}
		}
	});
	return flag;
}
/*载入作品列表，为载入的作品绑定点击事件实现投票*/
function showWorkList(d, isEmpty){
	var par = decodeURIComponent(window.location.search);
	var openId = getQuery("OpenId",par),
		from = getQuery("from",par),
		tokens = "";
	var data = d.data;
	if(data.length  == 0){
		alert(d.message);
		return false;
	}
	var htmlStr="";
	for(var i=0;i<data.length;i++){
		htmlStr += '<li data-code="'+data[i].code+'"><a class="img_wl" href="#"><img src="'+data[i].picture[0].path+'" /></a><span class="order_wl">NO.'+data[i].code+'</span><span class="vote_wl js_approval"><img class="like1" src="images/like1.png" /><em>'+data[i].approval+'</em></span></li>';
	}

	if(isEmpty){
		$("#workList").empty().append($(htmlStr));
	}else{
		$("#workList").append($(htmlStr));
	}

	//为新加的列表绑定点击事件实现投票
	$(".js_approval").click(function(){
		if(from == "share" || from == "timeline"){
	           	alert("该页面从朋友圈进入，操作无效！请从问道公众号进入活动页面");
	           	return false;
         	}
		var that = this;
		var workCode = $(this).parent().attr("data-code");
		$.ajax({
			url:"data/approval.json",
			type:"GET",
			dataType:"json",
			data:{
				workCode: workCode,
				openid: openId,
				r:Math.random()
			},
			success:function(d){
				if(d.isSuccess){
					$(that).find("img").removeClass().addClass("like2").attr("src", "images/like2.png");
					$(that).find("em").text(parseInt($(that).find("em").text())+1);
				}else{
					if(d.data == "notAttention"){
						var popleft = $(window).width()/2 - $("#popTip").width()/2;
						var poptop = $(window).height()/2 - $("#popTip").height()/2 +$(window).scrollTop();
						var bodyheight = Math.max($("body").outerHeight(true), $(window).height());
						$(".mark").css("height", bodyheight);
						$("#popTip").css({"left":popleft, "top":poptop});
						$("#popTip").show();
						$(".mark").show();
						$("#popTip").show();
						$(".close_pop").click(function(){
							$("#popTip").hide();
							$(".mark").hide();
						});
					}else{
						alert(d.message);
					}
				}
			}
		});
		return false;
	});
}

/*我的作品页*/	
/*获取我的作品列表*/
function getMyWorks(callbackFn){
	var par = decodeURIComponent(window.location.search);
	var openId = getQuery("OpenId",par),
		tokens = ""; 
	$.ajax({
		url:"data/ptcpt.json",
		type:"get",
		dataType:"json",
		data:{
			userOpenid: openId,
			r: Math.random()
		},
		success: function(d){
			if(d.isSuccess){
				if( callbackFn && typeof callbackFn == "function" ){
					callbackFn(d);
				}
			}else{
				alert(d.message);
			}
		}
	});
}

/*载入我的作品列表*/
function showMyWorks(d){
	var par = decodeURIComponent(window.location.search);
	var openId = getQuery("OpenId",par),
	     	from = getQuery("from", par),
		tokens = ""; 
	var data = d.data;
	if(d.message == "noMessage"){
		//请求成功，但是无作品，显示+，可以去制作作品
		var addworksStr = '<li class="addworks"><a href="#"><img src="images/add.png" /><span>添加作品</span></a></li>';
		$("#myWorkList").empty().append($(addworksStr));
		bindLink($(".addworks a"), "making", {"OpenId" : "", "time": "", "sign":"", "form":""});
		return false;
	}
	var htmlStr="";
	for(var i=0;i<data.length;i++){
		var picSrc = "";
		if(data[i].picture.length > 0){
			picSrc = data[i].picture[0].path;
		}
		if(data[i].status == 0){
			if(picSrc == ""){
				//待审核状态 
				htmlStr += '<li data-code="'+data[i].code+'"><a class="nopreview img_wl" href="#"><img src="'+picSrc+'" /><span class="marks_wl"></span><span class="invalidtxt">作品保存失败</span></a><a class="dele" href="#"><img src="images/close.png" /></a><a class="auditing_btn" href="#"><img src="images/btn8.jpg" /></a></li>';
			}else{
				//待审核状态 
				htmlStr += '<li data-code="'+data[i].code+'"><a class="nopreview img_wl" href="#"><img src="'+picSrc+'" /><span class="marks_wl"></span></a><a class="dele" href="#"><img src="images/close.png" /></a><a class="auditing_btn" href="#"><img src="images/btn8.jpg" /></a></li>';
			}

		}else if(data[i].status == 1){
			//审核未通过状态
			htmlStr += '<li data-code="'+data[i].code+'"><a class="nopreview img_wl" href="#"><img src="'+picSrc+'" /><span class="marks_wl"></span><span class="invalidtxt">因内容不文明，<br />已删除，请重新制作</span></a><a class="dele" href="#"><img src="images/close.png" /></a><a class="invalid_btn" href="#"><img src="images/btn7.jpg" /></a></li>';
		}else if(data[i].status == 2){
			//审核已通过，未参赛
			htmlStr += '<li data-code="'+data[i].code+'"><a class="img_wl" href="#"><img src="'+picSrc+'" /></a><a class="dele" href="#"><img src="images/close.png" /></a><a class="upload_btn" href="#"><img src="images/btn5.jpg" /></a></li>';
		} else if(data[i].status == 3 ){
			//已参赛
			htmlStr += '<li data-code="'+data[i].code+'"><a class="img_wl" href="#"><img src="'+picSrc+'" /></a><a class="uploaded_btn" href="#"><img src="images/btn6.jpg" /><span class="uploadedcode">编号：'+data[i].code+'</span></a></li>';
		}		
	}
	$("#myWorkList").empty().append($(htmlStr));
	$(".auditing_btn, .invalid_btn, .nopreview, .uploaded_btn").on("click",function(){
		return false;
	});
	$(".upload_btn").off().on("click",function(){
		if(from == "share" || from == "timeline"){
	           	alert("该页面从朋友圈进入，操作无效！请从问道公众号进入活动页面");
	           	return false;
         	}
		var that = this;
		var workCode = $(this).parent().attr("data-code");
		$.ajax({
			url:"data/upload.json",
			type:"GET",
			dataType:"json",
			data:{
				workCode: workCode,
				userOpenid: openId,
				r:Math.random()
			},
			success:function(d){
				if(d.isSuccess){
					alert(d.message);
					$(that).siblings(".dele").remove();
					$(that).removeClass().addClass("uploaded_btn").find("img").attr("src", "images/btn6.jpg");
					$(that).append('<span class="uploadedcode">编号：'+workCode+'</span>');
				}else{
					alert(d.message);
					if(d.data == "nologin"){
						//跳转到登录页
						window.location.href = "http://actionv2.gyyx.cn/GoldenYears/loginPage"+decodeURIComponent(window.location.search);
					}
				}
			}
		});
		return false;
	});
	$(".dele").off().on("click",function(){
		if(from == "share"  || from == "timeline"){
	           	alert("该页面从朋友圈进入，操作无效！请从问道公众号进入活动页面");
	           	return false;
         	}
		var that = this;
		var workCode = $(this).parent().attr("data-code");
		$.ajax({
			url:"data/delete.json",
			type:"GET",
			dataType:"json",
			data:{
				workCode: workCode,
				r:Math.random()
			},
			success:function(d){
				if(d.isSuccess){
					$(that).parent().remove();
					//删除成功后，如果已经全部删除了，显示添加作品区块
					if($("#myWorkList").find("li").length == 0){
						var addworksStr = '<li class="addworks"><a href="#"><img src="images/add.png" /><span>添加作品</span></a></li>';
						$("#myWorkList").empty().append($(addworksStr));
						bindLink($(".addworks a"), "making", {"OpenId" : "", "time": "", "sign":"", "form":""});
					}
				}else{
					alert(d.message);
				}
			}
		});
		return false;
	});
}

//播放音乐
function playMusic(){
	$("#musicWrap").removeClass("pause");
	var music = document.getElementById("playMusic");
	music.play();
}
//暂停音乐
function pauseMusic(){
	$("#musicWrap").addClass("pause");
	var music = document.getElementById("playMusic");
	music.pause();
}

function showPriview(song, imglist){
     	var music = document.getElementById("playMusic");
     	music.src = song;
	var imglistStr ='<div class="swiper-container"><div class="swiper-wrapper">';
	for(var i=0;i<imglist.length;i++){
		if(i != imglist.length-1){
			imglistStr += '<div class="swiper-slide"><img src="'+imglist[i]+'" /><a class="next" href="index.html"><img src="images/nexticon.png" /></a></div>';
		}else{
			imglistStr += '<div class="swiper-slide"><img src="'+imglist[i]+'" /><a class="backindex" href="">关注问道，投票或创建我的流金岁月</a></div>';
		}
	}
	imglistStr+='</div></div>';

	$(".preview").append($(imglistStr));

	var swiper = new Swiper('.swiper-container', {
		direction: 'vertical',
		height:document.documentElement.clientHeight || document.body.clientHeight
	});

	$(".preview .next").off().on("click", function(){
		swiper.slideNext();
		return false;
	});
	$(".backindex").attr("href","index"+decodeURIComponent(window.location.search));
	$(".preview .jump").click(function(){
		$("body").css("overflow","scroll");
		pauseMusic();	
		$(".preview").find(".swiper-container").remove();	             	
		$(".preview").hide();
		$(".previewbg").hide();
		//wx.showOptionMenu();
		return false;
	});
	
}

$(function(){

	//链接地址绑定
	//openid=obpaujkanyx4iqidv2nbxbjddbjl&time=1459137796&sign=d9e78964d343fd48538a9413ee73e71b
	bindLink($(".alink1"), "index.html", {"OpenId" : "", "time": "", "sign":"", "from":""});
	bindLink($(".alink2"), "making.html", {"OpenId" : "", "time": "", "sign":"", "from":""});
	bindLink($(".alink3"), "myworklist.html", {"OpenId" : "", "time": "", "sign":"", "from":""});
	bindLink($(".alink4"), "actionrule.html", {"OpenId" : "", "time": "", "sign":"", "from":""});
	bindLink($(".btn_index"), "myworklist.html", {"OpenId" : "", "time": "", "sign":"", "from":""});
	bindLink($(".btn_making"), "example.html", {"OpenId" : "", "time": "", "sign":"", "from":""});
	bindLink($(".btn_myworklist"), "myworklist.html", {"OpenId" : "", "time": "", "sign":"", "from":""});
	bindLink($(".btn_rule"), "myworklist.html", {"OpenId" : "", "time": "", "sign":"", "from":""});


	//分享遮照
	$(".share_btn").click(function(){
		$(".sharemark").fadeIn();
		$(".sharemarkimg").fadeIn();
		return false;
	});
	$(".sharemark").click(function(){
		$(".sharemark").fadeOut();
		$(".sharemarkimg").fadeOut();
	});
	$(".sharemarkimg").click(function(){
		$(".sharemark").fadeOut();
		$(".sharemarkimg").fadeOut();
	});

	//返回顶部
	$(window).scroll(function(){
		var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
		if(scrollTop > 300){
			$("#toTop").show();
		}else{
			$("#toTop").hide();
		}
	});
	$("#toTop").click(function(){
		$("body").animate({scrollTop: 0});
		return false;
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

});

