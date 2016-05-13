#此文件适用于MySQL

#create table `webNote_user`
CREATE TABLE `<database_name>`.`webNote_user` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户id',
    `account` varchar(15) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '用户账号',
    `password` varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '用户密码',
    `name` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '用户名',
    `sex` enum('男','女','') DEFAULT '' COMMENT '用户性别',
    `create_time` datetime NOT NULL COMMENT '创建时间',
    `update_time` datetime NOT NULL COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE `unique_account` USING BTREE (`account`) comment '用户账号唯一'
) ENGINE=`InnoDB` AUTO_INCREMENT=1 DEFAULT CHARACTER SET utf8 COLLATE utf8_bin ROW_FORMAT=COMPACT COMMENT='用于保存项目“webNote个人笔记”的用户信息，包括账号、密码、姓名、性别和注册时间。';

#create table `webNote_noteData`
CREATE TABLE `<database_name>`.`webNote_noteData` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '笔记id',
    `user_id` int(11) NOT NULL COMMENT '用户id',
    `data` longtext CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '笔记完整内容',
    `list_num` int(5) DEFAULT 0 COMMENT '笔记数量',
    `removed_num` int(5) DEFAULT 0 COMMENT '回收站数量',
    `sync_time` datetime DEFAULT NULL COMMENT '最新的同步时间',
    `create_time` datetime NOT NULL COMMENT '创建时间',
    `update_time` datetime NOT NULL COMMENT '更新时间',
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_webNote_user_id` FOREIGN KEY (`user_id`) REFERENCES `<database_name>`.`webNote_user` (`id`)   ON UPDATE CASCADE ON DELETE CASCADE,
    INDEX `fk_webNote_user_id` USING BTREE (`user_id`) comment 'webNote_user外键id'
) ENGINE=`InnoDB` AUTO_INCREMENT=1 DEFAULT CHARACTER SET utf8 COLLATE utf8_bin ROW_FORMAT=COMPACT COMMENT='用于保存项目“webNote个人笔记”的用户笔记信息，包括用户id、笔记内容、笔记数量、回收站数量和同步时间。';