/* global EventEmitter */
var weixinMock = (function () {
    var emitter = new EventEmitter(),
        index,
        shareType,
        shareMap = {
            timeline: ['朋友圈', 'shareTimeline', 'share_timeline', 'share:timeline'],
            appmessage: ['朋友', 'sendAppMessage', 'send_app_msg', 'share:appmessage'],
            weibo: ['微博', 'shareWeibo', 'share_weibo', 'share:weibo']
        },
        sendMessage = function (action, msg) {
            var data = {
                action: action,
                msg: msg
            };
            window.frames[0].postMessage(data, '*');
        },

        /* 下拉初始化 */
        menu = (function () {
            var $list = $('.menu ul'),
                _menu = {
                    toggle: function () {
                        if ($list.filter(':visible').length) {
                            _menu.close();
                        } else {
                            _menu.open();
                        }
                    },

                    close: function () {
                        $list.slideUp(200);
                    },
                    open: function () {
                        $list.slideDown(200);
                    }
                },

                init = function () {
                    $('.menu .down').on('touchstart', function () {
                        _menu.toggle();
                    });
                };

            init();
            return _menu;
        }()),

        /* 下拉初始化 */
        share = (function () {
            var $share = $('#share'),
                _share = function (data) {
                    var to;
                    try {
                        if (shareType[1] === 'shareWeibo') {
                            $share.find('.bd p').html(data.content);
                            $share.find('.bd .info').html(data.url);
                            to = 'weibo';
                        } else {
                            if (shareType[1] === 'sendAppMessage') {
                                $share.find('.hd').html(data.title);
                                $share.find('.bd p').html(data.desc);
                            } else {
                                $share.find('.hd').html(data.desc);
                                $share.find('.bd p').html(data.title);
                            }

                            $share.find('.bd img').attr("src", data.img_url);
                            $share.find('.info span').html(data.link);
                            $share.find('.tips .from').html(data.appid || "微信网页");
                            $share.find('.tips .to').html(shareType[0]);
                            to = 'weixin';
                        }
                        $share.show().find('.dialog').hide().filter('.dialog-' + to).show();
                    } catch (e) {}
                },

                init = function () {
                    $share.find('button').on('touchstart', function () {
                        var type = $(this).data('type');
                        $share.hide();
                        sendMessage('weixin.' + shareType[1], [{"err_msg": shareType[2] + ":" + type}]);
                    });
                };

            init();
            return _share;
        }()),

        initEvent = function () {
            /* 初始化 */
            window.addEventListener("message", function (msg) {
                var res = msg.data;

                emitter.trigger(res.action, [res.msg]);
            }, false);

            /* 提交 */
            $('#start form').on('submit', function (e) {
                e.preventDefault();
                var url = $('#start form input').val();
                window.location.hash = url;
            });

            /* 刷新 */
            $('.menu .reload').on('touchstart', function () {
                sendMessage('system.reload');
            });

            /* 分享 */
            $('.menu li').on('touchstart', function () {
                var id = $(this).data('id');
                shareType = shareMap[id];
                sendMessage('weixin.menu:' + shareType[3]);
            });

            /* 页面更新 */
            window.addEventListener("hashchange", _mock.hashChanged, false);
            window.addEventListener('DOMContentLoaded', _mock.hashChanged, false);
        },

        _mock = {
            init: function () {
                initEvent();
            },

            hashChanged: function () {
                var hash = window.location.hash.substr(1);
                if (hash) {
                    $('#view').attr('src', hash).show();
                    $('#start').hide();
                    $('.menu').show();
                } else {
                    $('#view').attr('src', '').hide();
                    $('#start').show().find('input').val('');
                    $('.menu').hide();
                    _mock.setTitle();
                }
            },

            setTitle: function (title) {
                title = title || 'Weixin Mock';
                $('header h1').html(title);
            },

            showShare: function (argu) {
                // 弹出分享框
                share(argu);
            },

            sendResult: function () {
                sendMessage('weixin.shareTimeline', [{"err_msg": "share_timeline:ok"}]);
            },
        };

    /* 和 iframe 握手 */
    emitter.on('handshake', function (msg) {
        if (msg === 'd58de73563f88d88e0f4dfe33f9fce87') {
            try {
                sendMessage('handshake', '983b5580d9e09080f9ae5162d9397689'); // md5(msg);
            } catch (e) {}
        }
    });

    /* title 改变 */
    emitter.on('system.title-change', function (title) {
        _mock.setTitle(title);
    });

    /* 页面加载 */
    emitter.on('system.ready', function (data) {
        _mock.setTitle(data.title);
        window.location.hash = data.url;
    });

    /* 分享到朋友圈 */
    for (index in shareMap) {
        emitter.on('weixin.' + shareMap[index][1], function (argu) {
            menu.close();
            _mock.showShare(argu);
        });
    }

    return _mock;
}());

weixinMock.init();
