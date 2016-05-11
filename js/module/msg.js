/*global define, chrome*/

/*
 * S to C:
 * SWITCH (string)['on', 'off'] null
 * OPEN (array.article) null
 *
 * C to S:
 * SEARCH (string) array.article
 *
 */

define(function() {
    'use strict';
    var Msg = function(area) {
        if (area === 'client') {
            this.area = 'C';
        } else {
            this.area = 'S';
        }
    };
    Msg.prototype.listen = function(callback) {
        chrome.runtime.onMessage.addListener(function(request, sender, response) {
            var send = function(code, data) {
                response({
                    code: code,
                    data: data
                });
            };
            callback(request, send);
        });
    };
    Msg.prototype.send = function(code, data, callback) {
        if (this.area === 'C') {
            chrome.runtime.sendMessage({
                code: code,
                data: data
            }, function(response) {
                if (typeof callback === 'function') {
                    callback(response);
                }
            });
        } else {
            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    code: code,
                    data: data
                }, function(response) {
                    if (typeof callback === 'function') {
                        callback(response);
                    }
                });
            });
        }
    };
    return Msg;
});