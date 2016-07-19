/*
转盘函数 version: v1.00
http://hd.gyyx.cn
by wQing 2012/9/18
*/

/* =============================================== 参数配置说明开始 ===================================================== */
/* activeId: 游戏识别的ID号					                                                                              */
/* prizeClass: 奖品个数,拼成转盘的奖品所用到的同一个class名字						                                      */
/* prizeId: 奖品ID名						                                                                              */
/* oBtn: 转盘事件的按钮ID					                                                                          	  */
/* oBtntxtGo: 当按钮里的内容值为go的时候，点击按钮不执行请求( 转盘事件按钮的内容,根据内容不同,防止按钮多次点击去请求Ajax )*/
/* oBtntxtStop: 当按钮里的值为stop的时候，点击按钮执行请求					                                              */
/* isLogin: 此标签内是否有内容,判断是否登录						                                                          */
/* notLoginTxt: 没有登录所提示的内容						                                                              */
/* ajaxUrl: 请求的Url地址						                                                                          */
/* ajaxData: 所传参数						                                                                          */
/* =============================================== 参数配置说明结束 ===================================================== */

jQuery.fn.extend({

    btnStart_Click: function (options) {

        var defaults = {
            "activeId": "13",
            "prizeClass": ".jp",
            "prizeId": "dzp",
            "roundNum": 1,
            "oBtn": "#btnStart",
            "oBtntxtGo": "go",
            "oBtntxtStop": "stop",
            "isLogin": "#accountSpan",
            "notLoginTxt": "您还没有提交乾坤锁信息",
            "ajaxUrl": "/DialLottery/Lottery",
            "ajaxData":
            {
                r:Math.random(),
                hdName: $("#hdName").val(),
                serverId: $("#ddlGameServer option:selected").val()
            }
        };

        var roundNum = defaults.roundNum;
        var i = 0;
        var j = 0;
        var timer;
        var stop = 0;

        defaults = $.extend(defaults, options);
        var account = $.trim($(defaults.isLogin).text());
        
        if ($(defaults.oBtn).attr("text") == defaults.oBtntxtGo) {
            $(defaults.oBtn).attr("text", defaults.oBtntxtStop);
            $.ajax({
                url: defaults.ajaxUrl,
                type: "get",
                data: defaults.ajaxData,
                dataType: "json",
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                },
                success: function (result) {
                    resultFn(defaults, result);
                    $(defaults.oBtn).attr("text",defaults.oBtntxtGo);
                }
            });
        }
        else {
            return;
        }

        function resultFn(defaults, result) {
            
            if (result != null) {
                if (alertFnA(defaults, result) != 9) {

                    turnFn(defaults, result);
                };
            }
        }

        function turnFn(defaults, result) {
            $(defaults.oBtn).unbind();

            if ($.browser.mozilla) {
                roundNum = defaults.roundNum * 2;
                timer = setInterval(function () { executeAnimate(defaults, result.data.configCode,result.data.isReal, result.data.prizeChinese); }, 100);
            } else {
                roundNum = defaults.roundNum * 2;
                timer = setInterval(function () { executeAnimate(defaults, result.data.configCode, result.data.isReal, result.data.prizeChinese); }, 100);
            }
        }

        function executeAnimate(defaults, stopPoint, isReal, prizeName) {
            var prizeNum = $(defaults.prizeClass).size();
            var g = i == 0 ? prizeNum - 1 : i - 1;

            //执行动画
            $("#" + defaults.prizeId + g).removeClass("on");
            $("#" + defaults.prizeId + i).addClass("on");
            i = i + 1;
            stop = i;

            if (i == prizeNum) {
                roundNum = roundNum - 1;
                i = 0;
                stop = prizeNum;
            }
            //中奖
            if (stop - 1 == stopPoint && roundNum == 0) {
                //初始化所有参数
                clearInterval(timer);
                roundNum = defaults.roundNum;
                i = 0;
                j = 0;
                //判断是否为中奖图片的位置
                iswinFn(stopPoint, isReal, prizeName, defaults);
            }
        }
    }
})