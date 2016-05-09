/*global define, chrome*/

define(['database'], function (Database) {
    'use strict';
    var Article = function (title, content, date) {
        this.s = '#WEBNOTEARTICLE#';
        this.title = '';
        this.content = '';
        this.date = 0;
        this.id = '';
        var randomId = function (length) {
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
    Article.prototype.toString = function () {
        return this.id + this.s + this.title + this.s + this.content + this.s + this.date;
    };
    Article.prototype.make = function (string) {
        var tempArray = string.split(this.s);
        if (tempArray.length !== 4) {
            return false;
        }
        this.id = tempArray[0];
        this.title = tempArray[1];
        this.content = tempArray[2];
        this.date = parseInt(tempArray[3], 10);
    };
    Article.prototype.save = function () {
        var database = new Database();
        database.saveArticle('edit', this.id, this.toString());
    };
    Article.prototype.remove = function () {
        var database = new Database();
        database.saveArticle('remove', this.id);
    };
    Article.prototype.recover = function () {
        var database = new Database();
        database.saveArticle('recover', this.id);
    };
    Article.prototype.removeReal = function () {
        var database = new Database();
        database.saveArticle('removeReal', this.id);
    };
    Article.search = function (target, keyword) {
        var database = new Database(),
            list = database.loadArticle('list'),
            removed = database.loadArticle('removed'),
            result = [],
            i,
            j,
            tempArticle;
        if (target === 'list') {
            for (i in list) {
                if (list[i] !== '') {
                    tempArticle = new Article(database.loadArticle('one', list[i]));
                    if (keyword === '' || tempArticle.title.indexOf(keyword) !== -1 || tempArticle.content.indexOf(keyword) !== -1) {
                        result.push(tempArticle);
                    }
                }
            }
        } else {
            for (i in removed) {
                if (removed[i] !== '') {
                    tempArticle = new Article(database.loadArticle('one', removed[i]));
                    if (keyword === '' || tempArticle.title.indexOf(keyword) !== -1 || tempArticle.content.indexOf(keyword) !== -1) {
                        result.push(tempArticle);
                    }
                }
            }
        }
        // 按时间排序
        for (i = 0; i < result.length; i += 1) {
            for (j = 0; j < result.length - i - 1; j += 1) {
                if (result[j].date < result[j + 1].date) {
                    tempArticle = result[j];
                    result[j] = result[j + 1];
                    result[j + 1] = tempArticle;
                }
            }
        }
        Date.prototype.Format = function (fmt) {
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
    Article.getById = function (id) {
        var database = new Database();
        return new Article(database.loadArticle('one', id));
    };
    return Article;
});