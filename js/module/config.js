/*global define, chrome*/

define(['localDatabase'], function(LocalDatabase) {
    'use strict';
    var Config = function() {
        this.s = '#WEBNOTECONFIG#';
        this.flyMode = null;
        this.setup();
    };
    Config.prototype.setup = function() {
        var localDatabase = new LocalDatabase(),
            config = localDatabase.loadConfig();
        if (config === 'none') {
            this.flyMode = 'on';
            this.save();
        } else {
            this.make(config);
        }
    };
    Config.prototype.toString = function() {
        return this.flyMode;
    };
    Config.prototype.make = function(string) {
        var tempArray = string.split(this.s);
        if (tempArray.length !== 1) {
            return false;
        }
        this.flyMode = tempArray[0];
        this.setBadge();
    };
    Config.prototype.save = function() {
        var localDatabase = new LocalDatabase();
        this.setBadge();
        localDatabase.saveConfig(this.toString());
    };
    Config.prototype.setBadge = function() {
        chrome.browserAction.setBadgeText({
            text: this.flyMode === 'on' ? 'ON' : 'OFF'
        });
        chrome.browserAction.setBadgeBackgroundColor({
            color: this.flyMode === 'on' ? '#82a06a' : '#b2ac9e'
        });
    };
    return Config;
});