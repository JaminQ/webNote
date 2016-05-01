<?php if (!defined('IF_AUTHORIZED')) { die('Unauthorized Access!'); }

class Database {
    protected $mysqli;

    function __construct() {

    }

    public function connect() {
        //创建对象并打开连接，最后一个参数是选择的数据库名称
        $mysqli = new mysqli(MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB);
        $mysqli->query("SET NAMES utf8");

        //检查连接是否成功
        if (mysqli_connect_errno()) {
            //注意mysqli_connect_error()新特性
            die('Unable to connect!') . mysqli_connect_error();
        }
    }

    public function disconnect() {
        $mysqli->close();
    }
} // END

/* END file */
?>