#此文件适用于MySQL

#create triggers on table `webNote_user`
CREATE TRIGGER `tg_ib_webNote_user`
    BEFORE INSERT ON `<database_name>`.`webNote_user`
    FOR EACH ROW
    SET NEW.`name`=NEW.account,NEW.create_time=NOW(),NEW.update_time=NOW();
CREATE TRIGGER `tg_ub_webNote_user`
    BEFORE UPDATE ON `<database_name>`.`webNote_user`
    FOR EACH ROW
    SET NEW.update_time=NOW();
CREATE TRIGGER `tg_ia_webNote_user`
    AFTER INSERT ON `<database_name>`.`webNote_user`
    FOR EACH ROW
    INSERT INTO <database_name>.webNote_noteData (user_id) VALUES (NEW.id);

#create triggers on table `webNote_noteData`
CREATE TRIGGER `tg_ib_webNote_noteData`
    BEFORE INSERT ON `<database_name>`.`webNote_noteData`
    FOR EACH ROW
    SET NEW.create_time=NOW(),NEW.update_time=NOW();
CREATE TRIGGER `tg_ub_webNote_noteData`
    BEFORE UPDATE ON `<database_name>`.`webNote_noteData`
    FOR EACH ROW
    BEGIN
        IF(OLD.`data`<>NEW.`data`) THEN
            SET NEW.update_time=NOW(),NEW.sync_time=NOW();
        ELSEIF(OLD.`data` IS NULL AND NEW.`data` IS NOT NULL) THEN
            SET NEW.update_time=NOW(),NEW.sync_time=NOW();
        ELSE
            SET NEW.update_time=NOW();
        END IF;
    END;