/*global define, chrome*/

define(['localDatabase'], function(LocalDatabase) {
    'use strict';
    var Article = function(title, content, date) {
        this.s = '#WEBNOTEARTICLE#';
        this.id = '';
        this.title = '';
        this.content = '';
        this.date = 0;
        var randomId = function(length) {
            var lib = 'abcdefghijklmnopqrstuvwxyz',
                i,
                result = '';
            for (i = 0; i < length; i += 1) {
                result += (lib[parseInt(Math.random() * lib.length, 10)]);
            }
            return result;
        };
        if (arguments.length === 1) {
            this.make(title);
        } else {
            this.id = randomId(16);
            this.title = title;
            this.content = content;
            this.date = date;
        }
    };
    Article.prototype.toString = function() {
        return this.id + this.s + this.title + this.s + this.content + this.s + this.date;
    };
    Article.prototype.make = function(string) {
        var tempArray = string.split(this.s);
        if (tempArray.length !== 4) {
            return false;
        }
        this.id = tempArray[0];
        this.title = tempArray[1];
        this.content = tempArray[2];
        this.date = parseInt(tempArray[3], 10);
    };
    Article.prototype.save = function() {
        var localDatabase = new LocalDatabase();
        localDatabase.saveArticle('edit', this.id, this.toString());
    };
    Article.prototype.remove = function() {
        var localDatabase = new LocalDatabase();
        localDatabase.saveArticle('remove', this.id);
    };
    Article.prototype.recover = function() {
        var localDatabase = new LocalDatabase();
        localDatabase.saveArticle('recover', this.id);
    };
    Article.prototype.removeReal = function() {
        var localDatabase = new LocalDatabase();
        localDatabase.saveArticle('removeReal', this.id);
    };
    Article.search = function(target, keyword) {
        var localDatabase = new LocalDatabase(),
            list = localDatabase.loadArticle('list'),
            removed = localDatabase.loadArticle('removed'),
            result = [],
            i,
            j,
            tempArticle;
        if (target === 'list') {
            for (i in list) {
                if (list[i] !== '') {
                    tempArticle = new Article(localDatabase.loadArticle('one', list[i]));
                    if (keyword === '' || tempArticle.title.indexOf(keyword) !== -1 || tempArticle.content.indexOf(keyword) !== -1) {
                        result.push(tempArticle);
                    }
                }
            }
        } else {
            for (i in removed) {
                if (removed[i] !== '') {
                    tempArticle = new Article(localDatabase.loadArticle('one', removed[i]));
                    if (keyword === '' || tempArticle.title.indexOf(keyword) !== -1 || tempArticle.content.indexOf(keyword) !== -1) {
                        result.push(tempArticle);
                    }
                }
            }
        }
        // 按时间从大往小排序（时间从近到远）
        result.sort(function(a, b){
            return b.date - a.date;
        });
        Date.prototype.Format = function(fmt) {
            var o = {
                    'M+': this.getMonth() + 1,
                    'd+': this.getDate(),
                    'h+': this.getHours(),
                    'm+': this.getMinutes(),
                    's+': this.getSeconds(),
                    'q+': Math.floor((this.getMonth() + 3) / 3),
                    'S': this.getMilliseconds()
                },
                k;
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (this.getFullYear() + String('')).substr(4 - RegExp.$1.length));
            }
            for (k in o) {
                if (o.hasOwnProperty(k)) {
                    if (new RegExp('(' + k + ')').test(fmt)) {
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr((String('') + o[k]).length)));
                    }
                }
            }
            return fmt;
        };
        for (i = 0; i < result.length; i += 1) {
            result[i].date = new Date(result[i].date * 1000).Format('yyyy.MM.dd');
        }
        return result;
    };
    Article.getById = function(id) {
        var localDatabase = new LocalDatabase();
        return new Article(localDatabase.loadArticle('one', id));
    };
    return Article;
});