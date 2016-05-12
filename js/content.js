/*global require, chrome*/

require(['msg', 'jquery', 'content.html'], function(Msg, $, context) {
    $(function() {
        var msg = new Msg('client');
        //记录浮层的状态
        var ifShowWrapper = false;
        var ifShowStorage = false;
        //记录浮层配置状态
        var ifReady = true;
        //记录用户选中的文字
        var selectedText = "";
        //定义消息列表的最大高度
        var maxHeight = 150;

        msg.listen(function(request, send) {
            switch (request.code) {
                case 'OPEN':
                    {
                        selectedText = "";
                        webNote_showStorage();
                        break;
                    }
                case 'SWITCH':
                    {
                        if (request.data === 'on') {
                            ifReady = true;
                        } else {
                            if ($("#webNote-storage").is(':visible')) {
                                webNote_closeStorage();
                            }
                            ifReady = false;
                        }
                        break;
                    }
            }
        });

        msg.send('ASK', null, function(response) {
            ifReady = response.data === 'on' ? true : false;
        });

        var $body = $("body");
        var $head = $("head");
        var $link1 = $("<link rel='stylesheet' type='text/css' href='" + chrome.extension.getURL('css/lib/font-awesome.css') + "'>");
        var $link2 = $("<link rel='stylesheet' type='text/css' href='" + chrome.extension.getURL('css/content.css') + "'>")
        $head.append($link1).append($link2);
        var $wrapper = $(context.data);
        $body.append($wrapper);

        $("#webNote-wrapper .search-storage").bind("click", webNote_showStorage);

        $("body").bind("mouseup", webNote_initWrapper);

        function webNote_showWrapper() {
            ifShowWrapper = true;
            $("#webNote-wrapper").show();
        }

        function webNote_closeWrapper() {
            if (ifShowWrapper) {
                ifShowWrapper = false;
                $("#webNote-wrapper").hide();

                //解绑事件
                $("body").unbind("click", webNote_bodyCloseWrapper);
            }
        }

        function webNote_moveWrapper(event) {
            var $webNote_wrapper = $("#webNote-wrapper");
            var posX = event.pageX + 5;
            var posY = event.pageY + 5;

            //判断是否越界
            if (posX + $webNote_wrapper.width() + parseInt($webNote_wrapper.css("padding-left")) + parseInt($webNote_wrapper.css("padding-right")) > ($(window).width() + $(window).scrollLeft())) {
                posX = $(window).width() - $webNote_wrapper.width() - parseInt($webNote_wrapper.css("padding-left")) - parseInt($webNote_wrapper.css("padding-right")) - 20;
            }
            if (posY + $webNote_wrapper.height() + parseInt($webNote_wrapper.css("padding-top")) + parseInt($webNote_wrapper.css("padding-bottom")) > ($(window).height() + $(window).scrollTop())) {
                posY = $(window).height() - $webNote_wrapper.height() - parseInt($webNote_wrapper.css("padding-top")) - parseInt($webNote_wrapper.css("padding-bottom")) - 20;
            }

            //修改浮层位置
            $webNote_wrapper.css({
                top: posY,
                left: posX
            });
        }

        function webNote_initWrapper(event) {
            if (!ifReady) return;
            //获取选中的文本
            if (window.getSelection().toString() != "") {
                selectedText = window.getSelection().toString();
                $("#webNote-wrapper .webNote-storage-search input").val(selectedText);
                webNote_moveWrapper(event); //更新浮层位置
                webNote_showWrapper(); //打开浮层

                //添加关闭按钮和body的点击事件--用于关闭浮层
                $("body").bind("click", webNote_bodyCloseWrapper);
            }
        }

        function webNote_bodyCloseWrapper(event) {
            if (window.getSelection().toString() == "" && event.target.id != "webNote-wrapper") {
                webNote_closeWrapper(); //关闭浮层
            }
        }

        function webNote_showStorage() {
            webNote_closeWrapper(); //关闭浮层
            ifShowStorage = true;
            if (selectedText !== "" || !$("#webNote-storage").is(':visible')) {
                $("#webNote-storage .webNote-storage-search input").val(selectedText);
                webNote_searchStorage(selectedText);
            }

            $("#webNote-storage").fadeIn('slow')
                .width($(window).width() * 0.8)
                .height($(window).height() * 0.8)
                .css({
                    left: $(window).width() * 0.1,
                    top: $(window).height() * 0.1
                });
            $("#webNote-storage .main-content").height($("#webNote-storage").height() * 0.95 - $("#webNote-storage .webNote-header").height() - parseInt($("#webNote-storage .webNote-header").css("margin-bottom")));

            $("#webNote-storage .closeWebNote").bind("click", webNote_closeStorage);
            $("#webNote-storage .webNote-storage-search input").bind("input propertychange", webNote_searchStorage);
        }

        function webNote_closeStorage() {
            if (ifShowStorage) {
                ifShowStorage = false;
                $("#webNote-storage").fadeOut('slow');

                //解绑事件
                $("#webNote-storage .closeFly2").unbind("click", webNote_closeStorage);
                $("#webNote-storage .webNote-storage-search input").unbind("keypress", webNote_searchStorage);
                //重新绑定事件
                $("body").bind("mouseup", webNote_initWrapper);
            }
        }

        function webNote_searchStorage() {
            msg.send('SEARCH', $("#webNote-storage .webNote-storage-search input").val(), function(response) {
                var html = '';

                $(response.data).map(function(index, elem) {
                    html += '<div class="content-list"><div class="content-list-title">';
                    html += elem.title;
                    html += '</div><div class="content-list-date">';
                    html += elem.date;
                    html += '</div><div class="content-list-content">'
                    html += elem.content;
                    html += '</div></div>';
                });
                if (html != '') {
                    $("#webNote-storage .main-content").empty().append($(html));
                    $("#webNote-storage .content-list-content").map(function(index, elem) {
                        if ($(elem).height() > maxHeight) {
                            $(elem)
                                .height(maxHeight)
                                .parent()
                                .append($('<div class="content-list-footer"><i class="fa fa-caret-down"></i><a class="content-list-footer-more">展开</a></div>'));
                        }
                    });
                    $("#webNote-storage .content-list")
                        .find(".content-list-footer-more")
                        .bind("click", webNote_toggleMore);
                } else {
                    html = '<div class="content-list-empty">没有在本地搜索到相关知识库哦！</div>';
                    $("#webNote-storage .main-content").empty().append($(html));
                }
            });
        }

        function webNote_toggleMore(event) {
            if (this.toggle == undefined) {
                this.toggle = true;
            }
            if (this.toggle) {
                $(event.target)
                    .html('收起')
                    .parent()
                    .siblings('.content-list-content')
                    .css({
                        height: "auto"
                    });
                $(event.target)
                    .siblings('i')
                    .removeClass('fa-caret-down')
                    .addClass('fa-caret-up');
            } else {
                $(event.target)
                    .html('展开')
                    .parent()
                    .siblings('.content-list-content')
                    .css({
                        height: maxHeight
                    })
                $(event.target)
                    .siblings('i')
                    .removeClass('fa-caret-up')
                    .addClass('fa-caret-down');
            }
            this.toggle = !this.toggle;
        }
    });
});