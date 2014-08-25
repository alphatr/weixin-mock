/* global chrome */
(function () {
    var key = 'd58de73563f88d88e0f4dfe33f9fce87', // md5('is in weixin mock');
        data = {
            action: 'handshake',
            msg: key
        };

    try {
        if (window.parent !== window) {
            window.parent.postMessage(data, '*');
        }
    } catch (e) {}

    window.addEventListener("message", function (msg) {
        var weixinJSBridge = chrome.extension.getURL('WeixinJSBridge.js'),
            script = document.createElement('script');
        if (msg.data.action === 'handshake' && msg.data.msg === key) {
            script.innerHTML = [
                '(function () {',
                'var res = document.createElement("script");',
                'res.src = "' + weixinJSBridge + '";',
                'document.getElementsByTagName(\'head\')[0].appendChild(res);',
                '}());'
            ].join('\n');
            $('head').append($(script));
        }
    }, false);
}());
