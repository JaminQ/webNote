/*global define, chrome*/

define(function() {
    'use strict';
    var Service = function() {
        this.URL = 'http://localhost:80/webNote/index.php'; // 本地测试用
        // this.URL = 'http://jaminqian.com/webNote/index.php'; // 云端服务器
    };
    return Service;
});