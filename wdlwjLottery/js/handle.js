/*-------------------------------------------------------------------------
* author:chenqiaoling
* date:2016-07-14
* desc:问道缘排行抽奖老玩家回归
-------------------------------------------------------------------------*/
; (function (window, $) {
	var NinthLottery = function () {
		this.ScrollTime = null;
	};
	NinthLottery.prototype = {
		init: function () {
			var _this = this;
			this.$formUserName = $("[name='userName']");
			this.$formPhone = $("[name='userPhone']");
			this.$formAddress = $("[name='userAddress']");
			this.subAddressUrl=NLOTTERY_CONFIG.submitAddress;

			//显示登录及我的奖品信息
			this.showInfo($("#js_account"), $("#js_myPrize"));
			this.bindServer($("#js_netType"), $("#js_server"))
			//准备虚拟物品弹层
			this.pop($("#js_popSuccTip"), {
				autoOpen: false,
				closeFn:function(){

					//未填写过地址
					_this.getAddress(function () {
						_this.$formUserName.val("");
						_this.$formPhone.val("");
						_this.$formAddress.val("");
						_this.subAddressUrl=NLOTTERY_CONFIG.submitAddress;
						//开启弹层
						_this.pop($("#js_popAddress"), "open");
					});

					//显示的信息
					_this.showMyPrize($("#js_myPrize"));
					//显示滚动列表
					_this.showScrollPrizeList();
				}
			});
			//准备未抽到奖品弹层信息
			this.pop($("#js_popFailTip"), {
				autoOpen: false,
				closeFn:function(){
					//显示的信息
					_this.showMyPrize($("#js_myPrize"));
					//显示滚动列表
					_this.showScrollPrizeList();
				}
			});
			//准备实物弹层
			this.pop($("#js_popAddress"), {
				autoOpen: false,
				closeFn: function () {
					//显示的信息
					_this.showMyPrize($("#js_myPrize"));
					//显示滚动列表
					_this.showScrollPrizeList();
				}
			});

			
			//抽奖
			this.lottery();
			//提交表单
			this.subAddressForm();
			//显示滚动列表
			this.showScrollPrizeList();
		},
		//动画 fn
		animate: function (obj, attrjson, fn, cspeed, ctime) {
			var _this = this;
			var dspeed = cspeed ? cspeed : 8;
			var dtime = ctime ? ctime : 30;
			clearInterval(obj.timer);
			obj.timer = setInterval(function () {
				var isStop = true;
				for (var attr in attrjson) {
					var
					isOpa = attr == 'opacity',
					cur = isOpa ? parseInt(parseFloat(_this.getStyle(obj, attr)) * 100) : parseInt(_this.getStyle(obj, attr)),
					speed = (attrjson[attr] - cur) / dspeed;
					speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);

					if (cur != attrjson[attr]) {
						isStop = false;
					}

					if (isOpa) {
						obj.style.filter = 'alpha(opacity:' + (cur + speed) + ')';
						obj.style.opacity = (cur + speed) / 100;
					} else {
						obj.style[attr] = cur + speed + 'px';
					}
				}
				if (isStop) {
					clearInterval(obj.timer);
					fn && fn();
				}
			}, dtime);
		},

		//获取当前属性值 fn
		getStyle: function (obj, attr) {
			return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, false)[attr];
		},

		//弹层    fn
		pop: function ($obj, options) {
			var divWrap = document.createElement("div"),
				divMod = document.createElement("div");
			if (typeof options == "string") {
				if (options == "close") {
					$obj.parents(".POP_WRAP").hide().next(".POP_MODAL").hide();
				} else if (options == "open") {
					$obj.parents(".POP_WRAP").show().next(".POP_MODAL").show();
					//var
					//    boxH = parseInt($obj.parents(".POP_WRAP").height()),
					//    clientH = document.documentElement.clientHeight || document.body.clientHeight,
					//    scrollT = document.documentElement.scrollTop || document.body.scrollTop;
					//$obj.parents(".POP_WRAP")[0].style.top = (Math.abs(clientH - parseInt(boxH)) / 2 + scrollT) + "px";
				}
			} else {
				//为了能获取到弹窗尺寸
				$obj.css({ "display": "block", "visibility": "hidden" });
				var $this = $obj,
					clientW = document.documentElement.clientWidth || document.body.clientWidth,
					clientH = document.documentElement.clientHeight || document.body.clientHeight,
					scrollT = document.documentElement.scrollTop || document.body.scrollTop,
					boxW = $this[0].offsetWidth,
					boxH = $this[0].offsetHeight,
					defaults = {
						modalColor: "#000",
						modalOpacity: 0.5,
						autoOpen: false,
						closeCls: "pop-close",
						closeFn:null
					};
				$.extend(defaults, options);

				createPop();
				if (defaults.autoOpen) {
					showPop($(divWrap), $(divMod));
				}
				$this.find("."+defaults.closeCls).unbind("click").bind("click", function () {
					hidePop($(divWrap), $(divMod));
					defaults.closeFn && defaults.closeFn();
					return false;
				});
				return $this;
			}

			//创建弹层
			function createPop() {
				//弹出层容器
				divWrap.className = "POP_WRAP";
				divWrap.style.display = "none";

				divWrap.style.width = boxW + "px";
				divWrap.style.height = boxH + "px";
				divWrap.style.marginLeft = -(parseInt(boxW) / 2) + "px";
				divWrap.style.marginTop = -parseInt(boxH) / 2 + "px";

				//显示弹窗
				$this.css("visibility", "visible");

				//遮罩层
				divMod.className = "POP_MODAL";
				divMod.style.display = "none";
				divMod.style.backgroundColor = defaults.modalColor;
				divMod.style.opacity = defaults.modalOpacity;
				divMod.style.filter = "alpha(opacity=" + defaults.modalOpacity * 100 + ");";

				$(divWrap).bgiframe();

				divWrap.appendChild($this[0]);
				document.body.appendChild(divWrap);
				document.body.appendChild(divMod);
			}

			//显示弹层
			function showPop($pop, $modal){
				$pop.show();
				$modal.show();
			}

			//隐藏弹层
			function hidePop($pop, $modal) {
				$pop.hide();
				$modal.hide();
			}

			return $obj;
		},

		//滚动显示  fn
		scrollList: function ($obj, height, time) {
			var  _this = this,
				height1 = height ? height : 34,
				time1 = time ? time : 2,
				$this = $obj,
				moveH = 0,
				child = $this[0],
				move = function () {
					moveH -= height;
					_this.animate(child, {
						top: moveH
					}, function () {
						if (moveH < -(child.children.length / 2 - 1) * height) {//无缝滚动
							child.style.top = 0;
							moveH = 0;
						}
					});
				};
			//为无缝滚动布局
			child.innerHTML += child.innerHTML;
			clearInterval(_this.ScrollTime);
			//开启滚动
			 _this.ScrollTime  = setInterval(move, time1 * 1000);
			//鼠标移入时暂停
			child.onmouseover = function () {
				clearInterval(_this.ScrollTime);
			}
			//鼠标移开时开启滚动
			child.onmouseout = function () {
				_this.ScrollTime = setInterval(move, time1 * 1000);
			}
		},

		//检查是否登录    fn
		checkLogin: function (fn) {
			$.ajax({
				url: "http://reg.gyyx.cn/Login/Status",
				type: "GET",
				dataType: "jsonp",
				jsonp: "jsoncallback",
				data: { r: Math.random() },
				success: function (d) {
					if (d.IsLogin) {
						if (fn.success) {
							fn.success(d);
						}
					} else {
						if (fn.failed) {
							fn.failed(d);
						}
					}
				}
			});
		},

		//退出登录  fn
		signOut: function () {
			$.ajax({
				url: "http://reg.gyyx.cn/Login/LogoutJsonp/",
				type: "GET",
				dataType: "jsonp",
				jsonp: "jsoncallback",
				data: { r: Math.random() },
				success: function (d) {
					if (d.IsSuccess) {
						window.location.href = window.location.href.replace(/#+$/, "");
					}
					else {
						alert(d.Message);
					}
				}
			});
		},

		//获取之前的收货地址
		getAddress: function (successFn) {
			$.ajax({
				url: NLOTTERY_CONFIG.getBeforeAddress,
				type: "GET",
				data: {
					r:Math.random()
				},
				success: function (data) {
					if (data) {
						successFn && successFn(data);
					} else {
						alert(":( getAddress 数据处理出错，请刷新页面重试！");
					}
				},
				error: function () {
					alert(":( getAddress 获取数据出错，请刷新页面重试！");
				}
			});
		},

		//重置地址表单
		resetAddressForm: function ($form) {
			$form.find("input").val("");
		},

		//验证地址表单
		validAddressForm: function ($form) {
			var regPhone = /^(1[3|4|5|7|8][0-9]\d{8})$|^(0?\d{3}-\d{7,8})$/;
			var regNormal=/^[\d-\w\u4E00-\u9FA5]+$/;
			if (!regNormal.test($form.find(this.$formUserName).val())) {
				return [false, "请填写正确的收件人姓名！"];
			} else if($.trim($form.find(this.$formUserName).val()).length >50){
				return [false, "收件人姓名不得超过50个字符！"];
			} else if (!regPhone.test($form.find(this.$formPhone).val())) {
				return [false, "请填写正确的联系手机！"];
			} else if (!regNormal.test($form.find(this.$formAddress).val())) {
				return [false, "请填写正确的收件地址！"];
			}else if($.trim($form.find(this.$formAddress).val()).length >100){
				return [false, "收件地址不得超过100个字符！"];
			}  else {
				return [true, $form.find(this.$formUserName).val(), $form.find(this.$formPhone).val(), $form.find(this.$formAddress).val()];
			}
		},

		//提交地址表单数据
		ajaxAddressForm: function (sdata, successFn) {
			var url=this.subAddressUrl;
			sdata.r = Math.random();
			$.ajax({
				url: url,
				type: "get",
				data: sdata,
				dataType:"json",
				success: function (data) {
					if (data) {
						successFn && successFn(data);
					} else {
						alert(":( ajaxAddressForm 数据处理出错，请刷新页面重试！");
					}
				},
				error: function () {
					alert(":( ajaxAddressForm 获取数据出错，请刷新页面重试！");
				}
			});
		},

		//提交地址表单
		subAddressForm: function (url) {
			var _this = this;
			//提交收件表单
			$("#js_popAddressForm").submit(function () {
				var valid = _this.validAddressForm($(this));
				var sdata = {};
				if (!valid[0]) {
					alert(valid[1]);
					return false;
				}
				sdata = {
					userName: valid[1],
					userPhone: valid[2],
					userAddress:valid[3]
				};
				//提交数据
				_this.ajaxAddressForm(sdata,function (data) {
					alert(data.message);
					if(data.isSuccess){
						_this.pop($("#js_popAddress"),"close");
						_this.showMyPrize($("#js_myPrize"));
					}
				});
				return false;
			});
		},

		//显示用户相关信息  this
		showInfo: function ($account, $prize) {
			var _this = this;
			this.checkLogin({
				success: function (d) {
					//显示用户名并绑定退出事件
					$account.html('欢迎回来，' + d.Account + '<a href="javascript:;">【注销】</a>').
					find("a").unbind("click").bind("click", function () {
						_this.signOut();
						return false;
					});

					//显示奖品
					_this.showMyPrize($prize);
				}
			});
		},

		//显示我的奖品 this
		showMyPrize: function ($prize) {
			var _this = this;
			this.getMyPrize(function (d) {           
				if(d.isSuccess == true && d.data.length>0 ){
					var prize = d.data[0].presentName;
					var aEditHtml = d.data[0].presentType=="realPrize"?'<a href="#" id="js_btnPopEditAddress">修改地址</a>':'';
					prize && $prize.html('我的奖品：' + prize + aEditHtml).show();

					//修改收货地址
					$("#js_btnPopEditAddress").unbind("click").bind("click", function () {
						//先回填数据
						_this.getAddress(function (data) {
							if(data.isSuccess&&data.data){
								//填写过地址
								_this.$formUserName.val(data.data.userName);
								_this.$formPhone.val(data.data.userPhone);
								_this.$formAddress.val(data.data.userAddress);
								_this.subAddressUrl=NLOTTERY_CONFIG.updateAddress;
								//修改title
								$("#js_addressFormTitle").html("修改收货地址");
							}else{
								//未填写过地址
								_this.$formUserName.val("");
								_this.$formPhone.val("");
								_this.$formAddress.val("");
								_this.subAddressUrl=NLOTTERY_CONFIG.submitAddress;
								//修改title
								$("#js_addressFormTitle").html("收货地址");
							}
							//清空奖励信息
							$("#js_realPrizePanel").html('');
							//开启弹层
							_this.pop($("#js_popAddress"), "open");
						});
						return false;
					});
				}
			});
		},

		//绑定服务器 this
		bindServer: function ($net, $server) {
			$net.val("").unbind("change").bind("change", function () {
				var  thisVal = this.value,
					optHtml = '<option value="">请选择服务器</option>';

				if (!thisVal) {
					$server.html(optHtml);
					return false;
				}

				$server.html('<option value="">加载中...</option>');
				$.ajax({
					url: NLOTTERY_CONFIG.serverListUrl,
					type: "GET",
					dataType: "json",
					data: {
						netType: thisVal,
						r: Math.random()
					},
					success: function (data) {
						if (data.isSuccess) {
							var dCont = data.data;
							for (var i = 0; l = dCont.length, i < l; i++) {
								optHtml += "<option value='" + dCont[i].code + "'>" + dCont[i].serverName + "</option>"
							}
							$server.html(optHtml);
						}else{
							$server.html('<option value="">请选择</option>');
							alert(data.message);
						}
					}
				});
			});
		},

		//获取我的奖品    this
		getMyPrize: function (successFn) {
			$.ajax({
				url: NLOTTERY_CONFIG.getMyPrize,
				type: "GET",
				dataType:"json",
				data: {
					r: Math.random()
				},
				success: function (data) {
					if (data) {
						successFn && successFn(data);
					} else {
						alert(":( 程序处理数据出错，请刷新页面重试！");
					}
				},
				error: function () {
					alert(":( 程序出错，请刷新页面重试！");
				}
			});
		},

		//抽奖    this
		lottery: function (defaults) {
			$("#js_start").click(function () {
				if (/\u767b\u5f55/.test($("#js_account").html())) {
					window.alertFn&&alertFn(null,null,true);
					return false;
				}
				var serverId=$("#js_server").val();
				if(!serverId||serverId<1){
					alert("请选择游戏区服！");
					return false;
				}
				//$().btnStart_Click({
				// ajaxUrl: NLOTTERY_CONFIG.lotteryUrl,
				// "ajaxData": {
				//    r: Math.random(),
				//      serverCode:serverId,
				//      serverName:$("#js_server").find("option:selected").text()
				//  }
				// });
				$(document).rotate();
			});
		},

		//获取玩家获取列表
		showPrizeList: function (successFn,failedFn) {
			$.ajax({
				url: NLOTTERY_CONFIG.scrollNews,
				type: "GET",
				dataType:"json",
				data: {
				actionCode:314,
					r: Math.random()
				},
				success: function (data) {                  
					if (data) {
						if(data.isSuccess&&data.data&&data.data[0]){
							var dCont = data.data;
							var liHtml = '';
							for (var i = 0; i < dCont.length; i++) {
								liHtml += '<li title=' + dCont[i].presentName + '>'+dCont[i].account+',已获得' + dCont[i].presentName + '!</li>';
							}
							$("#js_scrollList").html(liHtml);
							successFn && successFn(data);
						}else{
							failedFn&&failedFn();
						}
					} else {
						alert(":( showPrizeList 数据处理出错，请刷新页面重试！");
					}
				},
				error: function () {
					alert(":( showPrizeList 获取数据出错，请刷新页面重试！");
				}
			});
		},

		//显示滚动中奖列表
		showScrollPrizeList:function(){
			var _this=this;
			this.showPrizeList(function () {
				//滚动显示其他玩家抽奖信息
				_this.scrollList($("#js_scrollList"), 45, 2);
				$("#js_scrollList").show();
			},function(){
				$("#js_scrollList").hide();
			});
		}
	};
	window.NinthLottery = NinthLottery;
})(window, jQuery);


var nLottery = new NinthLottery();

//提示没有资格抽奖
function alertFunc(result,defaults) {
	if (!result.isSuccess) {
		alert(result.message);
		if(result.message == "无法探测到您的账户信息，请重新登录"){
			alertFn(null, null, true);
		}
		$(defaults.Btn).attr(defaults.BtnAttr, defaults.BtnStateYes);
		return false;
	}else {
		return true;
	}
}
//中奖信息
function winPrizeFn(point, message, defaults) {
	switch (point) {
		case 0:
		case 1:
		case 3:
		case 4:
		case 6:
		case 7:
		case 9:
		case 11:
			//普通奖品弹层
			$("#js_panelPrize").html(message);
			nLottery.pop($("#js_popSuccTip"), "open");
			break;
		case 2:
		case 5:
		case 8:
		case 10:
			nLottery.pop($("#js_popFailTip"), "open");
			break;
	}
	$(defaults.Btn).attr(defaults.BtnAttr, defaults.BtnStateYes);
}