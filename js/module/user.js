/*global define, chrome*/

define(['jquery', 'service'], function($, Service) {
    'use strict';
    var User = function() {
        this.account = '未设置用户账号';
        this.password = '未设置用户密码';
        this.name = '未设置用户名';
        this.sex = '未设置用户性别';
        this.create_time = '未设置用户注册时间';
        this.list_num = '未设置云端笔记数量';
        this.removed_num = '未设置云端回收站数量';
        this.sync_time = '未同步';
        this.storage = window.localStorage;
        this.service = new Service();
        this.s = 'WEBNOTE_USERID';
    };
    User.prototype.toString = function() {
        return {
            "account": this.account,
            "name": this.name,
            "sex": this.sex,
            "create_time": this.create_time,
            "list_num": this.list_num,
            "removed_num": this.removed_num,
            "sync_time": this.sync_time
        };
    };
    User.prototype.make = function(obj) {
        this.account = obj.hasOwnProperty('account') ? obj.account : this.account;
        this.password = obj.hasOwnProperty('password') ? obj.password : this.password;
        this.name = obj.hasOwnProperty('name') ? obj.name : this.name;
        this.sex = obj.hasOwnProperty('sex') ? (obj.sex === '' ? '未设置用户性别' : obj.sex) : this.sex;
        this.create_time = obj.hasOwnProperty('create_time') ? obj.create_time : this.create_time;
        if (obj.hasOwnProperty('sync_time') && obj.sync_time === null) {
            this.list_num = '未同步';
            this.removed_num = '未同步';
            this.sync_time = '未同步';
        } else {
            this.list_num = obj.hasOwnProperty('list_num') ? obj.list_num : this.list_num;
            this.removed_num = obj.hasOwnProperty('removed_num') ? obj.removed_num : this.removed_num;
            this.sync_time = obj.hasOwnProperty('sync_time') ? obj.sync_time : this.sync_time;
        }
    };
    User.prototype.setId = function(id) {
        this.storage.setItem(this.s, id);
    };
    User.prototype.getId = function() {
        return this.storage.getItem(this.s);
    };
    User.prototype.login = function(successFunc, errorFunc) {
        $.ajax({
            url: this.service.URL,
            type: "GET",
            dataType: "jsonp",
            data: {
                "action": "login",
                "data": JSON.stringify({
                    "account": this.account,
                    "password": this.password
                })
            },
            success: successFunc,
            error: errorFunc
        });
    };
    User.prototype.regist = function(successFunc, errorFunc) {
        $.ajax({
            url: this.service.URL,
            type: "GET",
            dataType: "jsonp",
            data: {
                "action": "regist",
                "data": JSON.stringify({
                    "account": this.account,
                    "password": this.password
                })
            },
            success: successFunc,
            error: errorFunc
        });
    };
    User.prototype.checkBeforeRegist = function(successFunc, errorFunc) {
        $.ajax({
            url: this.service.URL,
            type: "GET",
            dataType: "jsonp",
            data: {
                "action": "check_before_regist",
                "data": JSON.stringify({
                    "account": this.account
                })
            },
            success: successFunc,
            error: errorFunc
        });
    };
    User.prototype.getUserinfo = function(successFunc, errorFunc) {
        $.ajax({
            url: this.service.URL,
            type: "GET",
            dataType: "jsonp",
            data: {
                "action": "get_userinfo",
                "data": JSON.stringify({
                    "id": this.getId()
                })
            },
            success: successFunc,
            error: errorFunc
        });
    };
    User.prototype.logout = function() {
        this.storage.removeItem(this.s);
    };
    User.prototype.updatePassword = function(successFunc, errorFunc) {
        $.ajax({
            url: this.service.URL,
            type: "GET",
            dataType: "jsonp",
            data: {
                "action": "update_password",
                "data": JSON.stringify({
                    "id": this.getId(),
                    "password": this.password
                })
            },
            success: successFunc,
            error: errorFunc
        });
    };
    User.prototype.updateUserinfo = function(successFunc, errorFunc) {
        $.ajax({
            url: this.service.URL,
            type: "GET",
            dataType: "jsonp",
            data: {
                "action": "update_userinfo",
                "data": JSON.stringify({
                    "id": this.getId(),
                    "name": this.name,
                    "sex": this.sex === '未设置用户性别' ? '' : this.sex
                })
            },
            success: successFunc,
            error: errorFunc
        });
    };
    User.prototype.getServerDatainfo = function(successFunc, errorFunc) {
        $.ajax({
            url: this.service.URL,
            type: "GET",
            dataType: "jsonp",
            data: {
                "action": "get_server_datainfo",
                "data": JSON.stringify({
                    "user_id": this.getId()
                })
            },
            success: successFunc,
            error: errorFunc
        });
    };
    User.prototype.syncToServer = function(data, successFunc, errorFunc) {
        $.ajax({
            url: this.service.URL,
            type: "GET",
            dataType: "jsonp",
            data: {
                "action": "sync_to_server",
                "data": JSON.stringify({
                    "user_id": this.getId(),
                    "data": data,
                    "list_num": this.list_num,
                    "removed_num": this.removed_num
                })
            },
            success: successFunc,
            error: errorFunc
        });
    };
    User.prototype.syncToLocal = function(successFunc, errorFunc) {
        $.ajax({
            url: this.service.URL,
            type: "GET",
            dataType: "jsonp",
            data: {
                "action": "sync_to_local",
                "data": JSON.stringify({
                    "user_id": this.getId()
                })
            },
            success: successFunc,
            error: errorFunc
        });
    };
    return User;
});