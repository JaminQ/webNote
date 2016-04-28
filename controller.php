<?php if (!defined('IF_AUTHORIZED')) { die('Unauthorized Access!'); }

class Controller {
    protected $db;

    function __construct() {
        require_once __DIR__ . '/database.php';
        $this->db = new Database();
    }

    /**
     * 控制器入口，根据action路由到各个接口
     */
    public function main() {
        $action = 'action_' . urldecode($_GET['action']);
        if (!method_exists($this, $action)) {
            $this->show_server_error('Request action does not exist.');
        }
        call_user_func(array($this, $action));
    }

    /***************************************************************
     * Actions
     ***************************************************************/

    public function action_test() {
        echo "Hello World!";
        mylog('here');
    }
} // END

/* END file */
?>