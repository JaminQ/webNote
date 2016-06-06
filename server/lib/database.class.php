<?php

/**
 * @todo 1)增加debug功能
 *       2)完善show_error功能
 */
class Database {
    private $mysqli;
    private $db_host;
    private $db_port;
    private $db_user;
    private $db_password;
    private $db_database;
    private $db_coding;

    public function __construct($db_host, $db_port, $db_user, $db_password, $db_database, $coding) {
        $this->db_host = $db_host;
        $this->db_port = $db_port;
        $this->db_user = $db_user;
        $this->db_password = $db_password;
        $this->db_database = $db_database;
        $this->coding = $coding;
    }

    public function connect() {
        //创建对象并打开连接，最后一个参数是选择的数据库名称
        $this->mysqli = new mysqli($this->db_host, $this->db_user, $this->db_password, $this->db_database);
        $this->mysqli->query('SET NAMES ' . $this->coding);

        //检查连接是否成功
        if ($this->mysqli->errno) {
            //注意mysqli_connect_error()新特性
            die('Unable to connect!') . $this->mysqli->error;
        }
    }

    public function disconnect() {
        $this->mysqli->close();
    }

    public function query($sql) {
        return $this->mysqli->query($sql);
    }

    //简化查询select
    public function select($table, $columnName = '*', $condition = '') {
        $condition = $condition ? ' Where ' . $condition : NULL;
        return $this->query('SELECT ' . $columnName . ' FROM ' . $table . $condition);
    }

    //简化删除delete
    public function delete($table, $condition) {
        return $result = $this->query('DELETE FROM ' . $table . ' WHERE ' . $condition);
    }

    //简化插入insert
    public function insert($table, $columnName, $value) {
        return $result = $this->query('INSERT INTO ' . $table . ' (' . $columnName . ') VALUES (' . $value . ')');
    }

    //简化修改update
    public function update($table, $mod_content, $condition) {
        return $result = $this->query('UPDATE ' . $table . ' SET ' . $mod_content . ' WHERE ' . $condition);
    }

    // public function show_error($message = '', $sql = '') {
    //     ;
    // }
} // END

/* END file */
?>