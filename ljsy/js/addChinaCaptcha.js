/*-------------------------------------------------------------------------
* author:luochongfei
* date:2015-3
* desc:社区公用弹层添加中文验证码支持 
-------------------------------------------------------------------------*/
; (function () {
    var
        //中文验证码对象
        ChinaCaptcha,

        //是否需要验证码
       isNeedCatpchaUrl = 'http://account.gyyx.cn/captcha/corsneedcaptcha',

        //中文验证码接口
        chinaCaptchaImgUrl = 'http://account.gyyx.cn/captcha/create';



    //中文验证码构造函数
    ChinaCaptcha = function ($Submit, Defaults) {
        this.$Submit = $Submit;
        this.isNeedCatpchaUrl = isNeedCatpchaUrl;
        this.chinaCaptchaImgUrl = chinaCaptchaImgUrl;
        this.bid = Defaults.bid;
        this.Defaults = Defaults;
    };

    ChinaCaptcha.prototype = {

        //主程序入口
        init: function () {
            this.isNeedCaptcha();
            this.createCaptchaPop();
        },

        //是否需要验证码
        isNeedCaptcha: function () {
            var _this = this;
            $.ajax({
                url: isNeedCatpchaUrl,
                type: "GET",
                dataType: "jsonp",
                jsonp: "jsoncallback",
                data: {
                    bid: _this.bid,
                    r: Math.random()
                },
                success: function (data) {
                    if (data && data.type) {
                       
                        var
                            //普通验证码对象
                            $yzm_p = $(".js_captcha"),
                            $yzm_ipt = $("#Captcha"),//input Id
                            $yzm_img = $(".js_captchaimg"),//图片元素
                            $submit = _this.$Submit;

                        switch (parseInt(data.type)) {
                            case -1://不需要验证码
                                //隐藏普通验证码项
                                $yzm_p.css("visibility", "hidden");
                                //移除普通验证码输入框
                                $yzm_ipt.remove();
                                break;
                            case 0://需要普通验证码（依旧）
                                $(".js_china").hide();
                                $yzm_p.show();
                                var yzm_img_src = chinaCaptchaImgUrl + "?bid=" + _this.bid;
                                $yzm_img.attr("src", yzm_img_src + "&r=" + Math.random());
                                $yzm_img.unbind("click").bind("click", function () {
                                    $yzm_img.attr("src", yzm_img_src + "&r=" + Math.random());
                                });
                                $(".changecode").unbind("click").bind("click", function () {
                                    $yzm_img.attr("src", yzm_img_src + "&r=" + Math.random());
                                });
                                break;
                            case 1:
                                 $yzm_ipt.remove();
                                $submit.append('<input type="hidden" name="captcha" value="" class="validCodeVal"/>');
                                break;
                            default:
                                break;
                        }
                        //设置验证码类型
                        _this.captcahSwitchOpen = parseInt(data.type);
                    }
                },
                error: function () {
                    alert(":( 程序出错！");
                }
            });
        },

        //生成验证码弹出层
        createCaptchaPop: function () {
        	var _this = this;
            //获取中文验证码
            this.addCSSByStyle(".chinaCaptchaImg  { background-image: url(" + chinaCaptchaImgUrl + "?bid=" + _this.bid + "&r=" + Math.random() + ".png) }");
            //添加事件
            this.addEventForPop();
        },

        //初始化弹出框位置
        initAlertPosition: function () {
            var winwidth = $(window).width();
            var thisleft = winwidth / 2 - $(".js_chinaCaptchaContainer").width() / 2;
            var thistop = $(window).height() / 2 - $(".js_chinaCaptchaContainer").height() / 2 + $(window).scrollTop();
            var bodyheight = Math.max($(document.body).outerHeight(true), $(window).height());
            $("#maskChinaCaptcha").css("height", bodyheight);
            $(".js_chinaCaptchaContainer").css({ 'left': thisleft, 'top': thistop });
        },

        //刷新验证码时，添加样式表到Head中
        addCSSByStyle: function (cssString) {
            var
                doc = document,
                style,
                heads = doc.getElementsByTagName("head"),
                _jsChina = doc.getElementById("JS_CHINA");

            if (_jsChina) {
                $(_jsChina).remove();
            }
            style = doc.createElement("style");
            style.setAttribute("type", "text/css");
            style.setAttribute("id", "JS_CHINA");
            heads[0].appendChild(style);

            if (style.styleSheet) {
                //IE
                style.styleSheet.cssText = cssString;
            } else {
                var cssText = doc.createTextNode(cssString);
                style.appendChild(cssText);
            }

        },

        //给弹层添加事件
        addEventForPop: function () {
            var _this = this;
            
            //设置弹层位置 
            //this.initAlertPosition();

            //关闭弹层
            //$(".js_captcha_close").unbind("click").bind("click", function () {
            //    $("input[name='captcha']").val("");
            //    $(".js_chinaCaptcha_Alert").remove();
            //    return false;
            //});

            //选择验证码
            $(".js_ChinaCaptchaSelect_img").off().on("click", function () {
                _this.selectCaptcha($(this));
                return false;
            });

            //删除验证码
            $(".js_deleteChinaCaptcha").unbind("click").bind("click", function () {
                _this.deleteCaptcha();
                return false;
            });

            //刷新验证码
            $(".js_refreshChinaCaptcha").unbind("click").bind("click", function () {
                _this.refreshCaptcha();
                return false;
            });

            //提交(如果验证码格式通过则提交)
            $(".js_chinaCaptchaBtn").unbind("click").bind("click", function () {
                if (_this.chinaCaptchaCheck($("input[name='captcha']"))) {
                    _this.subFn();
                }
                return false;
            });

        },

        //选择验证码
        selectCaptcha: function ($obj) {
            var
                    obj = $obj,
                    objAttrCode = obj.attr("data-code"),
                    codeLen = parseInt($("input[name='captcha']").val().length),
                    checkcodeStr = $("input[name='captcha']").val() + objAttrCode;

            if (codeLen < 4) {

                //验证码真实值
                $("input[name='captcha']").val(checkcodeStr);
                $(".js_ChinaCaptchaInput").eq(codeLen).find("i").addClass("chinaCaptchaImg_" + objAttrCode);

            }
            this.chinaCaptchaCheck($("input[name='captcha']"));
        },

        //删除验证码
        deleteCaptcha: function () {
            var
                    Len = parseInt($("input[name='captcha']").val().length),
                    checkcodeStr1 = $("input[name='captcha']").val();

            checkcodeStr1 = checkcodeStr1.substring(0, Len - 1);
            $("input[name='captcha']").val(checkcodeStr1);

            $(".js_ChinaCaptchaInput").eq(Len - 1).find("i").removeClass().attr("class", "chinaCaptchaImg");

            this.chinaCaptchaCheck($("input[name='captcha']"));
        },

        //刷新验证码
        refreshCaptcha: function () {
            var
                _this = this,
                Defaults = _this.Defaults;
            switch (_this.captcahSwitchOpen) {
                case 0:
                    //if (Defaults.IsSpread) {
                    //    $("#indexcheckcode").show().attr("data-isneedcaptcha", "1");
                    //}
                    //$("input[name='checkcode']").val("").focus();
                    ///$(".flash_pagecode").attr("src", Defaults.CodeImgUrl + "?fileName=" + Math.random() + ".png&bid=" + _this.bid);
                    break;
                case 1:
                    $(".js_checkChinaCaptchaTip").removeClass("error").removeClass("success");
                    $("input[name='captcha']").val("");
                    $(".js_ChinaCaptchaInput").find("i").attr("class", "chinaCaptchaImg");
                    //一定记得加随机数
                    _this.addCSSByStyle(".chinaCaptchaImg  { background-image: url(" + chinaCaptchaImgUrl + "?bid=" + _this.bid + "&r=" + Math.random() + ".png) }");
                    break;
                default:
                    break;
            }

        },

        //验证验证码格式
        chinaCaptchaCheck: function (obj) {
            if (this.VerCheckChinaCaptcha(obj) == true) {
                this.VerChinaCaptchaOK(obj);
                return true;
            } else {
                return false;
            }
        },

        //验证复杂验证码格式
        VerCheckChinaCaptcha: function (obj) {
            var exp = new RegExp("^\\d{4}$");
            if (!exp.test(obj.val())) {
                $(".js_checkChinaCaptchaTip").addClass("error");
                return false;
            } else {
                return true;
            }
        },

        //复杂验证码格式正确
        VerChinaCaptchaOK: function (obj) {
            $(".js_checkChinaCaptchaTip").removeClass("error").addClass("success");
            return true;
        }
    }

    window.ChinaCaptcha = ChinaCaptcha;
})();