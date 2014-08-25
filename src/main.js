/* global chrome */
// 初始化插件
var initExt = function () {

        // 初始化按钮
        chrome.browserAction.setPopup({'popup': ''});

        // 监听 browserAction 事件
        chrome.browserAction.onClicked.addListener(function () {
            var index = chrome.extension.getURL('index.html');
            chrome.tabs.create({url: index});
        });
    };
initExt();
