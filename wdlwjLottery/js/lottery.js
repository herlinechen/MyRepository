/*
*  author:tianhaiting
*  date:2015-8-11
*  for rotate action
*/

$.fn.extend({
	rotate: function (option) {

		/* --------------------------------插件参数说明start--------------------------------------------------- */
		/* Btn：抽奖按钮                                                                                        */
		/* prizeObj：奖品统一的class名用来遍历                                                                  */
		/* prizeClass：奖品展示选中样式                                                                         */
		/* BtnStateYes：标识抽奖按钮可用                                                                        */
		/* BtnStateNo：标识抽奖按钮不可用                                                                       */
		/* BtnAttr：按钮属性值用来和按钮可用和不可用状态对比来确定是否允许抽奖；(^_^)除了全局变量可以这么做的哦 */
		/* num:动画执行次数                                                                                     */
		/* -------------------------------插件参数说明end------------------------------------------------------ */

		var defaults = {
			Btn: "#js_start",
			prizeObj: "js_img",
			prizeClass: "dzp",
			prizeStop: "js_stop",
			BtnStateYes: "yes",
			BtnStateNo: "no",
			BtnAttr: "data-state",
			num: 2,
			ajaxUrl: "data/getLottery.json",
			ajaxData: {
				r:Math.random(),
	                	serverCode: $("#js_server option:selected").val(),
	                	serverName: $("#js_server option:selected").text()
			}
		};
		$.extend(defaults, option);

		$.extend(defaults.ajaxData, { r: Math.random() });  //参数扩展随机数

		var roundNum = defaults.num;
		var timer;
		var i = 0;		
		var k = 0;
		var stop=0;

		$("."+defaults.prizeObj).each(function(n){
			if($(this).hasClass(defaults.prizeStop)){
				i = n;
				$(this).removeClass(defaults.prizeStop);
			}
		});

		if ($(defaults.Btn).attr(defaults.BtnAttr) == defaults.BtnStateYes) {
			$(defaults.Btn).attr(defaults.BtnAttr,defaults.BtnStateNo);
			$.ajax({
				url:defaults.ajaxUrl,
				type:"get",
				dataType:"JSON",
				data:defaults.ajaxData,
				success: function (result) {
					resultFn(result, defaults);
				}
			});
		}
		//中奖函数
		function resultFn(result, defaults) {
			if (result != null) {
				if (alertFunc(result, defaults)) {
					turnFn(result, defaults);
				}
			}
		}
		//间隔调用
		function turnFn(result, defaults) {
			timer = setInterval(function () { animateFn(result.data.configCode, result.message, defaults); }, 200);
		}
		//执行动画
		function animateFn(point, message, defaults) {
			var prizeLen = $("."+defaults.prizeObj).length; 
			k = i == 0 ? prizeLen - 1 : i - 1;

			$("." + defaults.prizeClass + i).addClass(defaults.prizeClass + i + "_" + i);
			$("." + defaults.prizeClass + k).removeClass(defaults.prizeClass + k + "_" + k);
			i++;
			stop = i;

			if (i == prizeLen) {
				roundNum--;
				i = 0;
				stop = prizeLen;
			}
			if (stop - 1 == point && roundNum == 0) {
				clearInterval(timer);
				//中奖后各变量初始化
				$("." + defaults.prizeClass + point).addClass(defaults.prizeStop);
				roundNum = defaults.num;
				i = 0;
				k = 0;

				//中奖图片位置
				winPrizeFn(point, message, defaults);
			}
		}
	}
});

