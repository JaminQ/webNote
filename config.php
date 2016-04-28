<?php if (!defined('IF_AUTHORIZED')) { die('Unauthorized Access!'); }

// Some database configuration
define('MYSQL_USER', 'root');
define('MYSQL_PASSWORD', '11');
define('MYSQL_HOST', 'localhost');
define('MYSQL_PORT', '3306');
define('MYSQL_DB', 'test');

// Log path
define('LOG_PATH', __DIR__ . '/_log/');

// Log function
function mylog($str) {
    if (!is_string($str)) {
        $str = json_encode($str);
    }
    $file = LOG_PATH . 'log.txt';
    // if (file_exists($file)) {
    //     file_put_contents($file, '');
    // }
    $fp = fopen($file, 'a');
    fwrite($fp, date('[m-d H:i:s]')." ".$str."\n");
    fclose($fp);
}

/* END file */
?>