<?php if (!defined('IF_AUTHORIZED')) { die('Unauthorized Access!'); }

class Controller {
    protected $db;
    protected $console;
    protected $req;

    function __construct() {
        require_once __DIR__ . '/lib/database.class.php';
        require_once __DIR__ . '/lib/console.class.php';
        require_once __DIR__ . '/lib/request.class.php';
        $this->db = new Database(MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_CODING);
        $this->console = new Console(LOG_PATH, LOG_FILE);
        $this->req = new Request('GET');
    }

    /**
     * 控制器入口，根据action路由到各个接口
     */
    public function main() {
        $action = 'action_' . $this->req->action;
        if (!method_exists($this, $action)) {
            $this->show_server_error('Request action does not exist.');
        }
        call_user_func(array($this, $action));
    }

    /***************************************************************
     * Actions
     ***************************************************************/

    public function action_test() {
        echo "test";
        $this->console->debug('test' . "\n");
    }

    public function action_login() {
        $this->console->debug('"login" start');

        require_once __DIR__ . '/action/action_login.php';

        $this->console->debug('"login" end' . "\n");
    }

    public function action_regist() {
        $this->console->debug('"regist" start');

        require_once __DIR__ . '/action/action_regist.php';

        $this->console->debug('"regist" end' . "\n");
    }

    public function action_check_before_regist() {
        $this->console->debug('"check_before_regist" start');

        require_once __DIR__ . '/action/action_check_before_regist.php';

        $this->console->debug('"check_before_regist" end' . "\n");
    }

    public function action_get_userinfo() {
        $this->console->debug('"get_userinfo" start');

        require_once __DIR__ . '/action/action_get_userinfo.php';

        $this->console->debug('"get_userinfo" end' . "\n");
    }

    public function action_update_userinfo() {
        $this->console->debug('"update_userinfo" start');

        require_once __DIR__ . '/action/action_update_userinfo.php';

        $this->console->debug('"update_userinfo" end' . "\n");
    }

    public function action_update_password() {
        $this->console->debug('"update_password" start');

        require_once __DIR__ . '/action/action_update_password.php';

        $this->console->debug('"update_password" end' . "\n");
    }

    public function action_sync_to_server() {
        $this->console->debug('"sync_to_server" start');

        require_once __DIR__ . '/action/action_sync_to_server.php';

        $this->console->debug('"sync_to_server" end' . "\n");
    }

    public function action_sync_to_local() {
        $this->console->debug('"sync_to_local" start');

        require_once __DIR__ . '/action/action_sync_to_local.php';

        $this->console->debug('"sync_to_local" end' . "\n");
    }

    public function action_get_server_datainfo() {
        $this->console->debug('"get_server_datainfo" start');

        require_once __DIR__ . '/action/action_get_server_datainfo.php';

        $this->console->debug('"get_server_datainfo" end' . "\n");
    }
} // END

/* END file */
?>