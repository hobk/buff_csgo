// ==UserScript==
// @name         buff价格监控
// @match        https://buff.163.com/goods/*
// @icon         https://www.google.com/s2/favicons?domain=163.com
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addElement
// ==/UserScript==

(function () {
    'use strict';
    window.onload = function () {
        function Myfunc() {
            //获取页面中饰品名称及价格
            var name = document.getElementsByClassName('cru-goods')[1].innerText;
            var price = document.getElementsByClassName('f_Strong')[1].innerText.slice(1) * 1
            var price2 = document.getElementsByClassName('f_Strong')[2].innerText.slice(1) * 1
            var price3 = document.getElementsByClassName('f_Strong')[3].innerText.slice(1) * 1
            var imgUrl = document.getElementsByClassName('pic-cont item-detail-img')[0].children[0].src
            if (!GM_getValue("refresh" + name)) {
                GM_setValue("refresh" + name, 1800000)
            }
            if (GM_getValue("refresh" + name) < 2000) {
                GM_setValue("refresh" + name, 3000)
            }
            //https://buff.163.com/goods/42389#tab=selling&tag_ids=446769&sort_by=price.asc
            console.log(name + "最低价格：" + price, "监控阈值" + GM_getValue(name) + ",刷新间隔：" + GM_getValue("refresh" + name))
            if (price < GM_getValue(name)) {
            //油猴插件浏览器通知API
                GM_notification('现价:' + price + "第二:" + price2 + "第三:" + price3 + "-阈值:" + GM_getValue(name), name, imgUrl)
                var noticeText = name.slice(0, 13) + ',现:' + price + "二:" + price2 + "三:" + price3 + "-阈:" + GM_getValue(name)
                //微信server酱通知
                var url = "https://sc.ftqq.com/+'Server酱的KEY'+.send?text=" + noticeText
                var xhr = new XMLHttpRequest();
                xhr.open('POST', url, false);
                xhr.send()
                console.log(noticeText)
                GM_setValue(name, price)
            }
            //向页面中插入元素
            GM_addElement(document.getElementsByTagName('h1')[0], "div", {
                textContent: GM_getValue(name) ? "监控价：" + GM_getValue(name) : "未监控",
                style: 'color:red'
            })
            GM_addElement(document.getElementsByTagName('h1')[0], "button", {
                style: "color:green;font-size:1.1rem",
                textContent: '设置监控',
                class: 'mybtn1'
            })
            GM_addElement(document.getElementsByTagName('h1')[0], "button", {
                style: "color:red;font-size:1.1rem",
                textContent: '清除监控',
                class: 'mybtn2'
            })
            GM_addElement(document.getElementsByTagName('h1')[0], "button", {
                style: "",
                textContent: '定时刷新',
                class: 'mybtn3'
            })
            GM_addElement(document.getElementsByTagName('h1')[0], "button", {
                style: "color:grey",
                textContent: '取消刷新',
                class: 'mybtn4'
            })
            document.getElementsByClassName('mybtn1')[0].onclick = () => {
                var Aprice = prompt("请输入价格阈值：(元)，高于当前最低价会自动设置当前价");
                GM_setValue(name, Aprice);
                var refresh = prompt("刷新间隔（秒）") * 1000;
                GM_setValue("refresh" + name, refresh);
                console.log('初始化价格:' + Aprice);
                location.reload()
            }
            document.getElementsByClassName('mybtn2')[0].onclick = () => {
                GM_setValue(name, 0);
                GM_setValue("refresh" + name, 3600000);
                location.reload()
            }
            document.getElementsByClassName('mybtn3')[0].onclick = () => {
                var refresh = prompt("刷新间隔（秒）,默认3") * 1000;
                GM_setValue("refresh" + name, refresh);
                location.reload()
            }
            document.getElementsByClassName('mybtn4')[0].onclick = () => {
                GM_setValue("refresh" + name, 3600000);
                console.log('取消刷新');
                location.reload()
            }


            setTimeout(() => {
                location.reload()
            }, GM_getValue("refresh" + name))
        }
        setTimeout(()=>{Myfunc()},1000)

    }
})();
