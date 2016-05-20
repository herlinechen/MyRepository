//视屏播放的弹层
$(function () {
    $('.img-04').click(function () {
        $('.video_box').show();
        $('.video_con').show();
    })
    $('.close').click(function () {
        closeVideo();
    })
    $('.video_box').click(function () {
        closeVideo();
    })
    function closeVideo() {
        $('.video_box').hide();
        $('.video_con').hide();
        $('.video_con video').trigger('pause');
    }
})
//视屏播放的弹层

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
                $(".nowDownload").unbind().bind("click", function () {

                    alert("IOS版本敬请期待！")
                });

            } else {

                $(".dec_down").click(function () {
                    alert("请用浏览器打开,进行下载")
                    /* if (confirm("请用浏览器打开,进行下载")) {
                            window.location.href = "http://download.gyyx.cn/Default.ashx?typeid=992&netType=1&file=gyyx_cn.gyyx.mobile.jsws414%281%29.apk"
                        }*/

                });
                $(".nowDownload").click(function () {
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
                $(".nowDownload").unbind().bind("click", function () {
                    alert("IOS版本敬请期待！")
                });

            } else {

                $(".dec_down").attr("href", "http://download.gyyx.cn/Default.ashx?typeid=992&netType=1&file=gyyx_cn.gyyx.mobile.jsws414%281%29.apk");
                $(".nowDownload").attr("href", "http://download.gyyx.cn/Default.ashx?typeid=992&netType=1&file=gyyx_cn.gyyx.mobile.jsws414%281%29.apk");
            }
        }
    }
    init();//顶部立即下载


});
