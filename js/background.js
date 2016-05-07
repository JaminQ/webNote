/*global require, chrome*/

require(['msg', 'database', 'config', 'article'], function (Msg, Database, Config, Article) {
    'use strict';
    var msg = new Msg('server'),
        database,
        config;
    msg.listen(function (request, send) {
        switch (request.code) {
        case 'SEARCH':
            send(0, Article.search('list', request.data));
            break;
        case 'ASK':
            send(0, config.flyMode);
            break;
        }
    });
    database = new Database();
    database.setup();
    config = new Config();
});