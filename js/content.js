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
                        fly2_showStorage();
                        break;
                    }
                case 'SWITCH':
                    {
                        if (request.data === 'on') {
                            ifReady = true;
                        } else {
                            if ($("#fly2-storage").is(':visible')) {
                                fly2_closeStorage();
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

        $("#fly2-wrapper .search-storage").bind("click", fly2_showStorage);
        $("#fly2-wrapper .search-call").bind("click", function(){
            window.open("http://www.taobao.com/webww/ww.php?ver=3&touid=" + selectedText + "&siteid=cntaobao&status=1&charset=utf-8");
        });
        //Todo: 添加查物流查物品详情事件
        //$("#fly2-wrapper .search-stream").bind("click", );
        //$("#fly2-wrapper .search-details").bind("click", );

        $("body").bind("mouseup", fly2_initWrapper);

        function fly2_showWrapper() {
            ifShowWrapper = true;
            $("#fly2-wrapper").show();
        }

        function fly2_closeWrapper() {
            if (ifShowWrapper) {
                ifShowWrapper = false;
                $("#fly2-wrapper").hide();

                //解绑事件
                $("body").unbind("click", fly2_bodyCloseWrapper);
            }
        }

        function fly2_moveWrapper(event) {
            var $fly2_wrapper = $("#fly2-wrapper");
            var posX = event.pageX + 5;
            var posY = event.pageY + 5;

            //判断是否越界
            if (posX + $fly2_wrapper.width() + parseInt($fly2_wrapper.css("padding-left")) + parseInt($fly2_wrapper.css("padding-right")) > ($(window).width() + $(window).scrollLeft())) {
                posX = $(window).width() - $fly2_wrapper.width() - parseInt($fly2_wrapper.css("padding-left")) - parseInt($fly2_wrapper.css("padding-right")) - 20;
            }
            if (posY + $fly2_wrapper.height() + parseInt($fly2_wrapper.css("padding-top")) + parseInt($fly2_wrapper.css("padding-bottom")) > ($(window).height() + $(window).scrollTop())) {
                posY = $(window).height() - $fly2_wrapper.height() - parseInt($fly2_wrapper.css("padding-top")) - parseInt($fly2_wrapper.css("padding-bottom")) - 20;
            }

            //修改浮层位置
            $fly2_wrapper.css({
                top: posY,
                left: posX
            });
        }

        function fly2_initWrapper(event) {
            if (!ifReady) return;
            //获取选中的文本
            if (window.getSelection().toString() != "") {
                selectedText = window.getSelection().toString();
                $("#fly2-wrapper .fly2-storage-search input").val(selectedText);
                fly2_moveWrapper(event); //更新浮层位置
                fly2_showWrapper(); //打开浮层

                //添加关闭按钮和body的点击事件--用于关闭浮层
                $("body").bind("click", fly2_bodyCloseWrapper);
            }
        }

        function fly2_bodyCloseWrapper(event) {
            if (window.getSelection().toString() == "" && event.target.id != "fly2-wrapper") {
                fly2_closeWrapper(); //关闭浮层
            }
        }

        function fly2_showStorage() {
            fly2_closeWrapper(); //关闭浮层
            ifShowStorage = true;
            if (selectedText !== "" || !$("#fly2-storage").is(':visible')) {
                $("#fly2-storage .fly2-storage-search input").val(selectedText);
                fly2_searchStorage(selectedText);
            }

            $("#fly2-storage").fadeIn('slow')
                .width($(window).width() * 0.8)
                .height($(window).height() * 0.8)
                .css({
                    left: $(window).width() * 0.1,
                    top: $(window).height() * 0.1
                });
            $("#fly2-storage .main-content").height($("#fly2-storage").height() * 0.95 - $("#fly2-storage .fly2-header").height() - parseInt($("#fly2-storage .fly2-header").css("margin-bottom")));

            $("#fly2-storage .closeFly2").bind("click", fly2_closeStorage);
            $("#fly2-storage .fly2-storage-search input").bind("input propertychange", fly2_searchStorage);
        }

        function fly2_closeStorage() {
            if (ifShowStorage) {
                ifShowStorage = false;
                $("#fly2-storage").fadeOut('slow');

                //解绑事件
                $("#fly2-storage .closeFly2").unbind("click", fly2_closeStorage);
                $("#fly2-storage .fly2-storage-search input").unbind("keypress", fly2_searchStorage);
                //重新绑定事件
                $("body").bind("mouseup", fly2_initWrapper);
            }
        }

        function fly2_searchStorage() {
            msg.send('SEARCH', $("#fly2-storage .fly2-storage-search input").val(), function(response) {
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
                    $("#fly2-storage .main-content").empty().append($(html));
                    $("#fly2-storage .content-list-content").map(function(index, elem) {
                        if ($(elem).height() > maxHeight) {
                            $(elem)
                                .height(maxHeight)
                                .parent()
                                .append($('<div class="content-list-footer"><i class="fa fa-caret-down"></i><a class="content-list-footer-more">查看更多</a></div>'));
                        }
                    });
                    $("#fly2-storage .content-list")
                        .css({
                            visibility: "visible"
                        })
                        .find(".content-list-footer-more")
                        .bind("click", fly2_toggleMore);
                } else {
                    html = '<div class="content-list-empty">没有在本地搜索到相关知识库哦！</div>';
                    $("#fly2-storage .main-content").empty().append($(html));
                }
            });
        }

        function fly2_toggleMore(event) {
            if (this.toggle == undefined) {
                this.toggle = true;
            }
            if (this.toggle) {
                $(event.target)
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