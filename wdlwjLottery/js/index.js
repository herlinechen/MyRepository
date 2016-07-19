/*
 *  author:chenqiaoling
 *  date:2016-7-14
 *  for 问道缘排行抽奖老玩家回归
 */

/* ============================接口 start========================== */
//提交地址
var addressUrl = "";

/* ============================接口 end============================ */
$(function () {
    //加载弹层  
    $("#js_popAddress").pop({
        width: 743,
        height: 550,
        title: "实物奖",
        closeFn: function () {

        }
    });
    $("#js_popSuccTip").pop({
        width: 743,
        height: 550,
        title:"成功",
        closeFn: function () {
            
        }
    });
    $("#js_popFailTip").pop({
        width: 743,
        height: 550,
        title: "失败",
        closeFn: function () {

        }
    });
    //检测登录
    loginCheck();
    //抽奖
    $("#js_start").click(function () {
        var account = $(".js_account").attr("data-account");
        if (account != "" && account != null) {
            $(document).rotate();
        } else {
        }
        
    });
    
    //地址提交
    $(".js_addressSubmit").click(function () {
        var addressflag = true;
        $("#materialPrize").find(":text").each(function () {
            if (_VerEmpty($(this)) == false) {
                addressflag = false;
            } else {
                if ($(this).attr("name") == "getPhone") {
                    if (_phoneNum($(this)) == false) {
                        addressflag = false;
                    }
                }
                if ($(this).attr("name") == "getName") {
                    if (_varChina($(this)) == false) {
                        addressflag = false;
                    }
                }
            }
        });
        if (addressflag) {
            addressSubmit();
        }
    });
    

});
//检测登录
function loginCheck() {
    $.ajax({
        url: "http://reg.gyyx.cn/Login/Status",
        type: "GET",
        dataType: "JSONP",
        jsonp: "jsoncallback",
        data: {
            r: Math.random()
        },
        success: function (data) {

            if (data.IsSuccess && data.IsLogin) {

                $(".js_noLogin").hide();
                $(".js_login").show();
                var uname = "";

                if (data.Account.length <= 8) {
                    uname = data.Account;
                } else {
                    var uname1 = data.Account.substring(0, 2);
                    var uname2 = data.Account.substring(data.Account.length - 2, data.Account.length);
                    uname = uname1 + "****" + uname2;
                }
                $(".js_account").text(uname);
                $(".js_account").attr("data-account", data.Account);


            } else {
               
            }
        }
    });
    //退出
    $(".js_quite").click(function () {
        $.ajax({
            url: "http://reg.gyyx.cn/Login/LogoutJsonp",
            type: "GET",
            dataType: "jsonp",
            jsonp: "jsoncallback",
            data: { r: Math.random() },
            success: function (d) {
                if (d.IsSuccess) {
                    location.reload();
                }
                else {
                    alert(d.Message);
                }
            }
        });
        return false;
    });
}

//地址提交
function addressSubmit() {
    $.ajax({
        url: addressUrl,
        type: "GET",
        dataType: "JSON",
        data: datas,
        beforeSend: function () {
            $(".js_addressSubmit").attr("disabled", "disabled");
        },
        success: function (d) {
            if (d.IsSuccess) {
                alert("提交成功！");
                $("#materialPrize").pop("close");
            }
        }
    });
}
//提示没有资格抽奖
function alertFunc(result,defaults) {
    if (!result.IsSuccess && result.Values == "-1") {
        alert("你没有抽奖资格哦！");
        return false;
    } else if (!result.IsSuccess && result.Values == "-2") {
        alert("登录失效，请重新登录！");
        alertFn(null, null, true);
        return false;
    } else {
        return true;
    }
}
//中奖信息
function winPrizeFn(point, message, defaults) {
    switch (point) {
        case 0:
        case 1:
        case 2:
        case 4:
        case 7:
            $(".js_prizes").text(message);
            $("#materialPrize").pop("open");
            break;
        case 3:
        case 5:
        case 6:
            $(".js_virtualPrize").text(message);
            $("#virtualPrize").pop("open");
            break;
    }
    $(defaults.Btn).attr(defaults.BtnAttr, defaults.BtnStateYes);
}

//------------------验证函数 start-----------------//
//验证通过
function _okPass(obj) {
    obj.parent().find(".error").html("").hide();
    return true;
}
//------------------验证函数 end-------------------//
