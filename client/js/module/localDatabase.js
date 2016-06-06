/*global define, chrome*/

define(function() {
    'use strict';
    var LocalDatabase = function() {
        this.s = '#WEBNOTEDATABASE#';
        this.config = 'WEBNOTE_CONFIG';
        this.article = 'WEBNOTE_ARTICLE_';
        this.list = 'WEBNOTE_ARTICLE_LIST';
        this.removed = 'WEBNOTE_ARTICLE_REMOVED';
        this.flag = 'WEBNOTE_FLAG';
        this.storage = window.localStorage;
        this.as = '#WEBNOTEDATABASEARTICLE#';
        this.asi = '#WEBNOTEDATABASEARTICLEID#';
    };
    LocalDatabase.prototype.toString = function() {
        var list = this.loadArticle('list'),
            removed = this.loadArticle('removed'),
            result = '',
            i;
        result += this.loadConfig();
        result += this.s;
        result += this.getItem(this.list);
        result += this.s;
        result += this.getItem(this.removed);
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
    LocalDatabase.prototype.make = function(string) {
        this.setItem(this.flag, 'ok');
        var tempArray = string.split(this.s),
            articleArray = null,
            i,
            article;
        if (tempArray.length !== 4) {
            return false;
        }
        this.setItem(this.config, tempArray[0]);
        chrome.browserAction.setBadgeText({
            text: tempArray[0] === 'on' ? 'ON' : 'OFF'
        });
        chrome.browserAction.setBadgeBackgroundColor({
            color: tempArray[0] === 'on' ? '#82a06a' : '#b2ac9e'
        });
        if (tempArray[3] !== '') {
            articleArray = tempArray[3].split(this.as);
            for (i in articleArray) {
                if (articleArray[i] !== '') {
                    article = articleArray[i].split(this.asi);
                    this.setItem(this.article + article[0], article[1]);
                    if (this.getItem(this.list).indexOf(article[0]) === -1 && tempArray[1].indexOf(article[0]) !== -1) {
                        this.setItem(this.list, this.getItem(this.list) + ',' + article[0]);
                    }
                    if (this.getItem(this.removed).indexOf(article[0]) === -1 && tempArray[2].indexOf(article[0]) !== -1) {
                        this.setItem(this.removed, this.getItem(this.removed) + ',' + article[0]);
                    }
                }
            }
        }
    };
    LocalDatabase.prototype.setup = function() {
        if (this.getItem(this.flag) === null) {
            this.setItem(this.flag, 'ok');
            this.setItem(this.config, 'none');
            this.setItem(this.list, '');
            this.setItem(this.removed, '');
        }
    };
    LocalDatabase.prototype.flush = function() {
        this.storage.clear();
    };
    LocalDatabase.prototype.saveConfig = function(value) {
        this.setItem(this.config, value);
    };
    LocalDatabase.prototype.loadConfig = function() {
        return this.getItem(this.config);
    };
    LocalDatabase.prototype.saveArticle = function(action, id, data) {
        var tempList,
            contains = function(array, item) {
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
                this.setItem(this.article + id, data);
                tempList = this.loadArticle('list');
                if (contains(tempList, id) === -1) {
                    tempList.push(id);
                    this.setItem(this.list, tempList.join(','));
                }
                break;
            case 'remove':
                tempList = this.loadArticle('list');
                if (contains(tempList, id) !== -1) {
                    tempList.splice(contains(tempList, id), 1);
                    this.setItem(this.list, tempList.join(','));
                    tempList = this.loadArticle('removed');
                    tempList.push(id);
                    this.setItem(this.removed, tempList.join(','));
                }
                break;
            case 'recover':
                tempList = this.loadArticle('removed');
                if (contains(tempList, id) !== -1) {
                    tempList.splice(contains(tempList, id), 1);
                    this.setItem(this.removed, tempList.join(','));
                    tempList = this.loadArticle('list');
                    tempList.push(id);
                    this.setItem(this.list, tempList.join(','));
                }
                break;
            case 'removeReal':
                tempList = this.loadArticle('removed');
                if (contains(tempList, id) !== -1) {
                    tempList.splice(contains(tempList, id), 1);
                    this.setItem(this.removed, tempList.join(','));
                }
                break;
        }
    };
    LocalDatabase.prototype.loadArticle = function(action, id) {
        var result = null;
        switch (action) {
            case 'one':
                result = this.getItem(this.article + id);
                break;
            case 'list':
                result = this.getItem(this.list).split(',');
                break;
            case 'removed':
                result = this.getItem(this.removed).split(',');
                break;
        }
        return result;
    };
    LocalDatabase.prototype.getItem = function(key) {
        return this.storage.getItem(key);
    };
    LocalDatabase.prototype.setItem = function(key, value) {
        this.storage.setItem(key, value);
    };
    return LocalDatabase;
});