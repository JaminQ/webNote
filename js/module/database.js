/*global define, chrome*/

define(function () {
    'use strict';
    var Database = function () {
        this.s = '#FLY2DATABASE#';
        this.config = 'FLY2_CONFIG';
        this.article = 'FLY2_ARTICLE_';
        this.list = 'FLY2_ARTICLE_LIST';
        this.removed = 'FLY2_ARTICLE_REMOVED';
        this.flag = 'FLY2_FLAG';
        this.storage = localStorage;
        this.as = '#FLY2DATABASEARTICLE#';
        this.asi = '#FLY2DATABASEARTICLEID#';
    };
    Database.prototype.toString = function () {
        var list = this.loadArticle('list'),
            removed = this.loadArticle('removed'),
            result = '',
            i;
        result += this.storage.getItem(this.config);
        result += this.s;
        result += this.storage.getItem(this.list);
        result += this.s;
        result += this.storage.getItem(this.removed);
        result += this.s;
        for (i in list) {
            if (list[i] !== '') {
                result += list[i];
                result += this.asi;
                result += this.loadArticle('one', list[i]);
                result += this.as;
            }
        }
        for (i in removed) {
            if (removed[i] !== '') {
                result += removed[i];
                result += this.asi;
                result += this.loadArticle('one', removed[i]);
                result += this.as;
            }
        }
        return result;
    };
    Database.prototype.make = function (string) {
        this.storage.setItem(this.flag, 'ok');
        var tempArray = string.split(this.s),
            articleArray = null,
            i,
            article;
        if (tempArray.length !== 4) {
            return false;
        }
        this.storage.setItem(this.config, tempArray[0]);
        chrome.browserAction.setBadgeText({
            text: tempArray[0] === 'on' ? 'FLY' : 'OFF'
        });
        chrome.browserAction.setBadgeBackgroundColor({
            color: tempArray[0] === 'on' ? '#82a06a' : '#b2ac9e'
        });
        if (tempArray[3] !== '') {
            articleArray = tempArray[3].split(this.as);
            for (i in articleArray) {
                if (articleArray[i] !== '') {
                    article = articleArray[i].split(this.asi);
                    this.storage.setItem(this.article + article[0], article[1]);
                    if (this.storage.getItem(this.list).indexOf(article[0]) === -1 && tempArray[1].indexOf(article[0]) !== -1) {
                        this.storage.setItem(this.list, this.storage.getItem(this.list) + ',' + article[0]);
                    }
                    if (this.storage.getItem(this.removed).indexOf(article[0]) === -1 && tempArray[2].indexOf(article[0]) !== -1) {
                        this.storage.setItem(this.removed, this.storage.getItem(this.removed) + ',' + article[0]);
                    }
                }
            }
        }
    };
    Database.prototype.setup = function () {
        if (this.storage.getItem(this.flag) === null) {
            this.storage.setItem(this.flag, 'ok');
            this.storage.setItem(this.config, 'none');
            this.storage.setItem(this.list, '');
            this.storage.setItem(this.removed, '');
        }
    };
    Database.prototype.flush = function () {
        this.storage.clear();
    };
    Database.prototype.saveConfig = function (value) {
        this.storage.setItem(this.config, value);
    };
    Database.prototype.loadConfig = function () {
        return this.storage.getItem(this.config);
    };
    Database.prototype.saveArticle = function (action, id, data) {
        var tempList, contains = function (array, item) {
            var i;
            for (i = 0; i < array.length; i += 1) {
                if (array[i] === item) {
                    break;
                }
            }
            if (i < array.length) {
                return i;
            } else {
                return -1;
            }
        };
        switch (action) {
        case 'edit':
            this.storage.setItem(this.article + id, data);
            tempList = this.storage.getItem(this.list).split(',');
            if (contains(tempList, id) === -1) {
                tempList.push(id);
                this.storage.setItem(this.list, tempList.join(','));
            }
            break;
        case 'remove':
            tempList = this.storage.getItem(this.list).split(',');
            if (contains(tempList, id) !== -1) {
                tempList.splice(contains(tempList, id), 1);
                this.storage.setItem(this.list, tempList.join(','));
                tempList = this.storage.getItem(this.removed).split(',');
                tempList.push(id);
                this.storage.setItem(this.removed, tempList.join(','));
            }
            break;
        case 'recover':
            tempList = this.storage.getItem(this.removed).split(',');
            if (contains(tempList, id) !== -1) {
                tempList.splice(contains(tempList, id), 1);
                this.storage.setItem(this.removed, tempList.join(','));
                tempList = this.storage.getItem(this.list).split(',');
                tempList.push(id);
                this.storage.setItem(this.list, tempList.join(','));
            }
            break;
        case 'removeReal':
            tempList = this.storage.getItem(this.removed).split(',');
            if (contains(tempList, id) !== -1) {
                tempList.splice(contains(tempList, id), 1);
                this.storage.setItem(this.removed, tempList.join(','));
            }
            break;
        }
    };
    Database.prototype.loadArticle = function (action, id) {
        var result = null;
        switch (action) {
        case 'one':
            result = this.storage.getItem(this.article + id);
            break;
        case 'list':
            result = this.storage.getItem(this.list).split(',');
            break;
        case 'removed':
            result = this.storage.getItem(this.removed).split(',');
            break;
        }
        return result;
    };
    return Database;
});