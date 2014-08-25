(function (ns) {
        /* 发送 */
    var sendMessage = function (action, msg) {
            var data = {
                action: action,
                msg: msg
            };
            console.log('sendMessage', data);
            window.parent.postMessage(data, '*');
        },

        /* 初始化 */
        init = function () {
            console.log('=========== WeixinJSBridge Ready ===========');
            initEvent();
            sendMessage('system.ready', {
                title: window.document.title,
                url: window.location.href
            });
            document.dispatchEvent(new Event('WeixinJSBridgeReady'));
        },

        /* 事件初始化 */
        initEvent = function () {
            /* title Change */

            document.getElementsByTagName('title')[0] && document.getElementsByTagName('title')[0].addEventListener('DOMSubtreeModified', function () {
                sendMessage('system.title-change', window.document.title);
            });

            /* Message Sender */
            window.addEventListener("message", function (msg) {
                try {
                    var action = msg.data.action;
                    if (action) {
                        event.trigger(action, msg.data.msg);
                        console.log('onMessage', msg.data.msg);
                    }
                } catch (e) {}
            }, false);

            /* reload */
            event.on('system.reload', function () {
                window.location.reload();
            });
        },

        event = (function () {
            /*
             * EventEmitter v4.2.7 - git.io/ee
             * Oliver Caldwell
             * MIT license
             * @preserve
             */
            var Emitter = function () {
                (function(){"use strict";function t(){}function r(t,n){for(var e=t.length;e--;)if(t[e].listener===n)return e;return-1}function n(e){return function(){return this[e].apply(this,arguments)}}var e=t.prototype,i=this,s=i.EventEmitter;e.getListeners=function(n){var r,e,t=this._getEvents();if(n instanceof RegExp){r={};for(e in t)t.hasOwnProperty(e)&&n.test(e)&&(r[e]=t[e])}else r=t[n]||(t[n]=[]);return r},e.flattenListeners=function(t){var e,n=[];for(e=0;e<t.length;e+=1)n.push(t[e].listener);return n},e.getListenersAsObject=function(n){var e,t=this.getListeners(n);return t instanceof Array&&(e={},e[n]=t),e||t},e.addListener=function(i,e){var t,n=this.getListenersAsObject(i),s="object"==typeof e;for(t in n)n.hasOwnProperty(t)&&-1===r(n[t],e)&&n[t].push(s?e:{listener:e,once:!1});return this},e.on=n("addListener"),e.addOnceListener=function(e,t){return this.addListener(e,{listener:t,once:!0})},e.once=n("addOnceListener"),e.defineEvent=function(e){return this.getListeners(e),this},e.defineEvents=function(t){for(var e=0;e<t.length;e+=1)this.defineEvent(t[e]);return this},e.removeListener=function(i,s){var n,e,t=this.getListenersAsObject(i);for(e in t)t.hasOwnProperty(e)&&(n=r(t[e],s),-1!==n&&t[e].splice(n,1));return this},e.off=n("removeListener"),e.addListeners=function(e,t){return this.manipulateListeners(!1,e,t)},e.removeListeners=function(e,t){return this.manipulateListeners(!0,e,t)},e.manipulateListeners=function(r,t,i){var e,n,s=r?this.removeListener:this.addListener,o=r?this.removeListeners:this.addListeners;if("object"!=typeof t||t instanceof RegExp)for(e=i.length;e--;)s.call(this,t,i[e]);else for(e in t)t.hasOwnProperty(e)&&(n=t[e])&&("function"==typeof n?s.call(this,e,n):o.call(this,e,n));return this},e.removeEvent=function(e){var t,r=typeof e,n=this._getEvents();if("string"===r)delete n[e];else if(e instanceof RegExp)for(t in n)n.hasOwnProperty(t)&&e.test(t)&&delete n[t];else delete this._events;return this},e.removeAllListeners=n("removeEvent"),e.emitEvent=function(r,o){var e,i,t,s,n=this.getListenersAsObject(r);for(t in n)if(n.hasOwnProperty(t))for(i=n[t].length;i--;)e=n[t][i],e.once===!0&&this.removeListener(r,e.listener),s=e.listener.apply(this,o||[]),s===this._getOnceReturnValue()&&this.removeListener(r,e.listener);return this},e.trigger=n("emitEvent"),e.emit=function(e){var t=Array.prototype.slice.call(arguments,1);return this.emitEvent(e,t)},e.setOnceReturnValue=function(e){return this._onceReturnValue=e,this},e._getOnceReturnValue=function(){return this.hasOwnProperty("_onceReturnValue")?this._onceReturnValue:!0},e._getEvents=function(){return this._events||(this._events={})},t.noConflict=function(){return i.EventEmitter=s,t},"function"==typeof define&&define.amd?define(function(){return t}):"object"==typeof module&&module.exports?module.exports=t:this.EventEmitter=t}).call(this);
            };

            return new (new Emitter()).EventEmitter();
        }()),

        _bridge = {
            invoke: function (type, argu, callback) {
                /*
                 type: shareTimeline

                 argu: {
                    "appid":theData.appId ? theData.appId : '',
                    "img_url":theData.imgUrl,
                    "link":theData.link,
                    "desc":theData.title,
                    "title":theData.desc, // 注意这里要分享出去的内容是desc
                    "img_width":"120",
                    "img_height":"120"
                }
                 */
                event.on('weixin.' + type, callback);
                sendMessage('weixin.' + type, argu);
            },

            on: function (e, callback) {
                //  menu:share:timeline
                event.on('weixin.' + e, callback);
            },

            call: function (option) {
                sendMessage('weixin.' + option);
            }
        };

    window.WeixinJSBridge = _bridge;
    init();
}(this));
