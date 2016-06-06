/*global require, chrome*/

require(['msg', 'localDatabase', 'config', 'article'], function(Msg, LocalDatabase, Config, Article) {
    'use strict';
    var msg = new Msg('server'),
        localDatabase,
        config;
    msg.listen(function(request, send) {
        switch (request.code) {
            case 'SEARCH':
                send(0, Article.search('list', request.data));
                break;
            case 'ASK':
                send(0, config.flyMode);
                break;
        }
    });
    localDatabase = new LocalDatabase();
    localDatabase.setup();
    config = new Config();
});