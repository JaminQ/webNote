/*global require, chrome, nicEditor*/

require(['jquery', 'article', 'localDatabase', 'user'], function($, Article, LocalDatabase, User) {
    'use strict';
    $(function() {
        var localDatabase = new LocalDatabase(),
            user = new User(),
            editor,
            editorEdit,
            resizeHandle,
            flag = false,
            flagEdit = false,
            Editor = nicEditor,
            showMsg = function(msg) {
                $('.msg').remove();
                var msgBox = $('<div class="msg"></div>');
                msgBox.css({
                    'position': 'fixed',
                    'left': '50%',
                    'top': '50%',
                    'width': '300px',
                    'height': '100px',
                    'background': 'rgba(0, 0, 0, 0.7)',
                    'margin-left': '-150px',
                    'margin-top': '-50px',
                    'color': '#FFF',
                    'border-radius': '20px',
                    'transition': '0.3s',
                    'transform': 'scale(0.2)',
                    'text-align': 'center',
                    'line-height': '100px',
                    'font-size': '24px'
                });
                msgBox.html(msg);
                $('body').append(msgBox);
                setTimeout(function() {
                    msgBox.css({
                        'transform': 'scale(1)'
                    });
                }, 50);
                setTimeout(function() {
                    msgBox.remove();
                }, 1550);
            },
            makeArticle = function(area, article) {
                var articleWrapper = $('<div class="content-list" article-id="' + article.id + '"></div>'),
                    titleWrapper = $('<div class="content-list-title"></div>'),
                    dateWrapper = $('<div class="content-list-date"></div>'),
                    contentWrapper = $('<div class="content-list-content"></div>'),
                    funcWrapper = $('<div class="content-list-footer"></div>');
                titleWrapper.html(article.title);
                dateWrapper.html(article.date);
                contentWrapper.html(article.content);
                if (area === 'look') {
                    funcWrapper.append('<i class="fa fa-edit"></i><a class="content-list-footer-edit">编辑</a>');
                    funcWrapper.append('<i class="fa fa-trash"></i><a class="content-list-footer-trash">放入回收站</a>');
                    funcWrapper.find('.content-list-footer-edit').click(function() {
                        var article = Article.getById($(this).parents('.content-list').attr('article-id'));
                        if (article) {
                            $('.opt[data-toggle=edit]').show().click();
                            $('#article-title-input-edit').val(article.title).attr('article-id', article.id);
                            if (!flagEdit) {
                                flagEdit = true;
                                editorEdit = new Editor({
                                    fullPanel: true
                                }).panelInstance('article-content-input-edit', {
                                    hasPanel: true
                                });
                                editorEdit = editorEdit.instanceById('article-content-input-edit');
                                resizeHandle();
                            }
                            editorEdit.setContent(article.content);
                        }
                    });
                    funcWrapper.find('.content-list-footer-trash').click(function() {
                        var article = Article.getById($(this).parents('.content-list').attr('article-id'));
                        if (article) {
                            if (window.confirm('是否确定放入回收站？')) {
                                article.remove();
                                $('.opt[data-toggle=look]').click();
                                showMsg('成功放入回收站');
                            }
                        }
                    });
                } else {
                    funcWrapper.append('<i class="fa fa-edit"></i><a class="content-list-footer-recover">恢复</a>');
                    funcWrapper.append('<i class="fa fa-trash"></i><a class="content-list-footer-trash">彻底删除</a>');
                    funcWrapper.find('.content-list-footer-recover').click(function() {
                        var article = Article.getById($(this).parents('.content-list').attr('article-id'));
                        if (article) {
                            if (window.confirm('是否确定恢复？')) {
                                article.recover();
                                $('.opt[data-toggle=look]').click();
                                showMsg('成功恢复');
                            }
                        }
                    });
                    funcWrapper.find('.content-list-footer-trash').click(function() {
                        var article = Article.getById($(this).parents('.content-list').attr('article-id'));
                        if (article) {
                            if (window.confirm('是否确定彻底删除？')) {
                                article.removeReal();
                                $('.opt[data-toggle=trash]').click();
                                showMsg('成功彻底删除');
                            }
                        }
                    });
                }
                articleWrapper.append(titleWrapper).append(dateWrapper).append(contentWrapper).append(funcWrapper);
                return articleWrapper;
            },
            search = function(area) {
                var maxHeight = 150,
                    keyword = $('#search-input').val(),
                    acticlesAll = (area === 'look' ? Article.search('list', '') : Article.search('removed', '')),
                    articles = (area === 'look' ? Article.search('list', keyword) : Article.search('removed', keyword));
                $('#' + area + ' .article-box').html('');
                if (articles.length === 0) {
                    if (acticlesAll.length === 0) {
                        $('#' + area + ' .article-box').append(area === 'look' ? $('<div class="content-list-empty">你还没有创建自己的笔记呢！</div>') : $('<div class="content-list-empty">你的回收站很干净哦！</div>'));
                    } else {
                        $('#' + area + ' .article-box').append(area === 'look' ? $('<div class="content-list-empty">找不到带有关键字“' + keyword + '”的笔记！</div>') : $('<div class="content-list-empty">在回收站里找不到带有关键字“' + keyword + '”的笔记！</div>'));
                    }
                } else {
                    $(articles).each(function(i) {
                        $('#' + area + ' .article-box').append(makeArticle(area, this));
                    });
                    // 检测高度
                    $('#' + area + ' .article-box .content-list-content').map(function(index, elem) {
                        if ($(elem).height() > maxHeight) {
                            $(elem)
                                .height(maxHeight)
                                .siblings('.content-list-footer')
                                .prepend($('<i class="fa fa-caret-down"></i><a class="content-list-footer-more">展开</a>'));
                        }
                    });
                    $('#' + area + ' .content-list')
                        .find('.content-list-footer-more')
                        .bind('click', function(event) {
                            if (typeof this.toggle === "undefined") {
                                this.toggle = true;
                            }
                            if (this.toggle) {
                                $(event.target)
                                    .html('收起')
                                    .parent()
                                    .siblings('.content-list-content')
                                    .css({
                                        height: 'auto'
                                    });
                                $(event.target)
                                    .siblings('i.fa-caret-down')
                                    .removeClass('fa-caret-down')
                                    .addClass('fa-caret-up');
                            } else {
                                $(event.target)
                                    .html('展开')
                                    .parent()
                                    .siblings('.content-list-content')
                                    .css({
                                        height: maxHeight
                                    });
                                $(event.target)
                                    .siblings('i.fa-caret-up')
                                    .removeClass('fa-caret-up')
                                    .addClass('fa-caret-down');
                            }
                            this.toggle = !this.toggle;
                        });
                }
            },
            resizeHandle = function() {
                if (flag || flagEdit) {
                    $('.area-holder > div').css({
                        'width': $('.tab-content').width() + 'px',
                        'box-sizing': 'border-box',
                        'background-color': 'white'
                    });
                    $('.nicEdit-main').css({
                        'width': $('.area-holder > div').eq(1).width() - 10 + 'px',
                        'box-sizing': 'border-box',
                        'min-height': 'auto',
                        'height': ((($('.sidebar').height() - 250) < 300) ? 300 : (($('.sidebar').height() - 250))) + 'px',
                        'overflow-x': 'hidden',
                        'overflow-y': 'auto',
                        'font-size': '16px',
                        'background-color': 'white'
                    });
                }
            },
            getUserinfo = function() {
                user.getUserinfo(function(data) {
                    if (data.status === 1) {
                        user.make(data.data);
                        $('#login').remove();
                        var $userinfo = $('#after-login .userinfo');
                        $userinfo.find('.user-account').text(user.account);
                        $userinfo.find('.user-name').text(user.name);
                        $userinfo.find('.user-sex').text(user.sex);
                        $userinfo.find('.user-create-time').text(user.create_time);
                        $('#update_name').val(user.name);
                        switch (user.sex) {
                            case '男':
                                $('#update_sex_man').attr('checked', true);
                                break;
                            case '女':
                                $('#update_sex_woman').attr('checked', true);
                                break;
                        }
                    } else {
                        console.log(data.msg);
                    }
                }, function(data) {
                    console.log(data);
                });
            },
            getServerDatainfo = function() {
                user.getServerDatainfo(function(data) {
                    if (data.status == 1) {
                        user.make(data.data);
                        var $serverDatainfo = $('#after-login .server-datainfo');
                        $serverDatainfo.find('.server-data-list-num').text(user.list_num);
                        $serverDatainfo.find('.server-data-removed-num').text(user.removed_num);
                        $serverDatainfo.find('.server-data-sync-time').text(user.sync_time);
                    } else {
                        console.log(data.msg);
                    }
                }, function(data) {
                    console.log(data);
                });
            };
        // bind event
        $(window).resize(resizeHandle);
        $('.opt').click(function() {
            if ($(this).data('toggle') !== 'edit') {
                $('.opt[data-toggle=edit]').hide();
            }
            $('.opt').removeClass('active');
            $('.tab-pane')
                .removeClass('active')
                .removeClass('in');
            $('#' + $(this).data('toggle'))
                .addClass('active')
                .addClass('in');
            $(this).addClass('active');
            switch ($(this).data('toggle')) {
                case 'look':
                    search('look');
                    break;
                case 'trash':
                    search('trash');
                    break;
                case 'add':
                    if (!flag) {
                        flag = true;
                        editor = new Editor({
                            fullPanel: true
                        }).panelInstance('article-content-input', {
                            hasPanel: true
                        });
                        editor = editor.instanceById('article-content-input');
                        resizeHandle();
                    }
                    break;
            }
        });

        $('#import-btn').click(function() {
            $('#import-data').click();
        });

        $('#import-data').on('change', function() {
            var file = this.files[0],
                fr = new window.FileReader();
            if (file.name.indexOf('.webnote') === -1) {
                showMsg('文件格式错误，请重试');
                this.value = null;
                return;
            }
            fr.onloadend = function() {
                localDatabase.make(this.result);
                showMsg('数据导入成功');
            };
            fr.readAsText(file);
        });

        $('#export-btn').click(function() {
            chrome.downloads.download({
                url: 'data:text/plain,' + localDatabase.toString(),
                filename: 'data.webnote'
            });
        });

        $('#search-input').on('input propertychange', function() {
            $('.opt[data-toggle=' + $('.opt.active').data('toggle') + ']').click();
        });

        $('#reset-btn').click(function() {
            $('#article-title-input').val('');
            editor.setContent('');
        });

        $('#save-btn').click(function() {
            var title = $('#article-title-input').val(),
                content = editor.getContent(),
                date = parseInt((new Date()).getTime() / 1000, 10),
                article;
            if ($.trim(title) === '' || $.trim(content) === '') {
                showMsg('信息填写不完整');
                return;
            }
            article = new Article(title, content, date);
            article.save();
            showMsg('保存成功');
            $('#reset-btn').click();
            $('.opt[data-toggle=look]').click();
        });

        $('#reset-btn-edit').click(function() {
            $('#article-title-input-edit').val('');
            editorEdit.setContent('');
        });

        $('#save-btn-edit').click(function() {
            var title = $('#article-title-input-edit').val(),
                content = editorEdit.getContent(),
                date = parseInt((new Date()).getTime() / 1000, 10),
                article;
            if ($.trim(title) === '' || $.trim(content) === '') {
                showMsg('信息填写不完整');
                return;
            }
            article = Article.getById($('#article-title-input-edit').attr('article-id'));
            article.title = title;
            article.content = content;
            article.date = date;
            article.save();
            showMsg('保存成功');
            $('.opt[data-toggle=look]').click();
        });

        $('#logout-btn').click(function() {
            user.logout();
            window.location.reload();
        });

        $('#sync-to-server-btn').click(function() {
            user.make({
                "list_num": localDatabase.loadArticle('list').length - 1,
                "removed_num": localDatabase.loadArticle('removed').length - 1
            });
            user.syncToServer(localDatabase.toString(), function(data) {
                if (data.status === 1) {
                    showMsg(data.msg);
                    getServerDatainfo();
                } else {
                    console.log(data.msg);
                }
            }, function(data) {
                console.log(data);
            });
        });

        $('#sync-to-local-btn').click(function() {
            user.syncToLocal(function(data) {
                if (data.status === 1) {
                    showMsg(data.msg);
                    localDatabase.make(data.data.data);
                } else {
                    console.log(data.msg);
                }
            }, function(data) {
                console.log(data);
            });
        });

        $('#update-password-btn').click(function() {
            $('#update-password').show();
        });

        $('#update-password-dialog-cancel').click(function(){
            $('#update-password').hide();
        });

        $('#update-password_form').on('submit', function() {
            var formdata = $(this).serializeObject();
            if (formdata.password !== formdata.password_confirm) {
                showMsg('两次输入的密码不一样');
                return false;
            }
            delete formdata['password_confirm'];
            user.make(formdata);
            user.updatePassword(function(data) {
                if (data.status === 1) {
                    showMsg(data.msg);
                    $('#update-password').hide();
                } else {
                    console.log(data.msg);
                }
            }, function(data) {
                console.log(data);
            });
            return false;
        });

        $('#update-userinfo-btn').click(function() {
            $('#update-userinfo').show();
        });

        $('#update-userinfo-dialog-cancel').click(function(){
            $('#update-userinfo').hide();
        });

        $('#update-userinfo_form').on('submit', function() {
            var formdata = $(this).serializeObject();
            user.make(formdata);
            user.updateUserinfo(function(data) {
                if (data.status === 1) {
                    showMsg(data.msg);
                    $('#update-userinfo').hide();
                    getUserinfo();
                } else {
                    console.log(data.msg);
                }
            }, function(data) {
                console.log(data);
            });
            return false;
        });

        $('.opt[data-toggle=look]').click();

        // main
        (function() {
            if (user.getId() === null) {
                $('#login_form').on('submit', function() {
                    var formdata = $(this).serializeObject();
                    user.make(formdata);
                    user.login(function(data) {
                        if (data.status === 1) {
                            showMsg(data.msg);
                            user.setId(data.data.id);
                            $('#after-login').show();
                            getUserinfo();
                            getServerDatainfo();
                        } else {
                            showMsg(data.msg);
                        }
                    }, function(data) {
                        console.log(data);
                    });
                    return false;
                });

                $('#regist_form').on('submit', function() {
                    var formdata = $(this).serializeObject();
                    if (formdata.password !== formdata.password_confirm) {
                        showMsg('两次输入的密码不一样');
                        return false;
                    }
                    delete formdata['password_confirm'];
                    user.make(formdata);
                    user.checkBeforeRegist(function(data) {
                        if (data.status === 1) {
                            user.regist(function(data) {
                                if (data.status === 1) {
                                    var regist_data = data;
                                    user.login(function(data) {
                                        if (data.status === 1) {
                                            showMsg(regist_data.msg);
                                            user.setId(data.data.id);
                                            $('#after-login').show();
                                            getUserinfo();
                                            getServerDatainfo();
                                        } else {
                                            showMsg(data.msg);
                                        }
                                    }, function(data) {
                                        console.log(data);
                                    });
                                } else {
                                    showMsg(data.msg);
                                }
                            }, function(data) {
                                console.log(data);
                            });
                        } else {
                            showMsg(data.msg);
                        }
                    }, function(data) {
                        console.log(data);
                    });
                    return false;
                });

                $('#change_login_mode').click(function(event) {
                    var $target = $(event.target);
                    console.log();
                    switch ($target.data('toggle')) {
                        case 'regist':
                            $('#login_form').hide();
                            $('#regist_form').show();
                            $target
                                .text('返回登录界面')
                                .data('toggle', 'login')
                                .prev().text('新用户注册');
                            break;
                        case 'login':
                            $('#regist_form').hide();
                            $('#login_form').show();
                            $target
                                .text('还没有账号？')
                                .data('toggle', 'regist')
                                .prev().text('请先登录');
                            break;
                    }
                });
            } else {
                $('#after-login').show();
                getUserinfo();
                getServerDatainfo();
            }
        })();
    });
});