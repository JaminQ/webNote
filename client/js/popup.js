/*global require, chrome*/

require(['jquery', 'msg', 'config'], function ($, Msg, Config) {
    'use strict';
    var config = new Config(),
        msg = new Msg('server');
    $('#switch input')[0].checked = config.flyMode === 'on' ? true : false;
    $('#switch input').on('change', function () {
        config.flyMode = $(this)[0].checked ? 'on' : 'off';
        msg.send('SWITCH', config.flyMode);
        config.save();
    });
    $('#option').click(function () {
        chrome.windows.getCurrent(function (current) {
            chrome.tabs.create({
                url: 'html/option.html'
            });
        });
    });
    $('#check').click(function () {
        msg.send('OPEN', null);
        window.close();
    });
});