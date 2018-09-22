javascript: (function () {
    var performid = '9051100'; //日期ID
    var priceid = '12265294'; //价格ID
    var person = '2'; //人数
    start();
    function start() {
        var re = main();
        console.log(222)
        if (re != 1) {
            setTimeout(function () {
                start()
            }, 1000);
        }
    }
    function main() {
        var buy = document.getElementById('btnBuyNow');
        var Xuanzuo = document.getElementById('btnXuanzuo');
        if (buy !== null) {
            var Buytext = buy.innerHTML;
            if (Buytext == '立即购买' || Buytext == '立即预定') {
                qiang()
                return 1;
            } 
        } else if (Xuanzuo !== null) {
            var Xuanzuotext = Xuanzuo.innerHTML;
            if (Xuanzuotext == '选座购买') {
                Xuanzuo.click()
                return 1;
            } 
        } else {
            return 0;
        }
    }
    function qiang() {
        var firstperform = document.getElementById('firstperform');
        firstperform.className = 'itm  itm-sel';
        var priceList = document.getElementById('priceList').childNodes;
        var children = priceList[3].childNodes[1].childNodes;
        for (var i = 0; i < children.length; i++) {
            if (children[i].getAttribute('data-priceid') == priceid) {
                children[i].className = 'itm  itm-sel';
            }
        }
        var str = '<div class="ct" style=""><ul class="lst"><li class="itm" style="" data-performid=' + performid + ' data-priceid=' + priceid + '><span class="txt txt-datetime ">"2017-10-28 周六 19:30"</span><span class="txt txt-price">"680"</span><span class="m-nums"><a class="btn btn-low" href="javascript:;">减</a><input class="ipt ipt-num" type="text" value=' + person + '><a class="btn btn-add" href="javascript:;">加</a></span><span class="tips tips-stock"><strong></strong></span><a class="btn btn-del" href="javascript:;"><i></i>删除</a></li></ul></div><div class="ops"><a href="javascript:;" class="u-btn u-btn-c1 u-btn-choose" id="btnXuanzuo" style="">选座购买</a><a class="u-btn u-btn-buynow" href="javascript:;" id="btnBuyNow">立即购买</a></div>'; //测试
        document.getElementById('cartList').innerHTML = str;
        var bt = document.getElementById('btnBuyNow');
        bt.click();
    }
})();