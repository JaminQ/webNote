<?php if (!defined('IF_AUTHORIZED')) { die('Unauthorized Access!'); }

// Some database configuration
define('MYSQL_USER', '<your_mysql_user>');
define('MYSQL_PASSWORD', '<your_mysql_password>');
define('MYSQL_HOST', '<your_mysql_host>');
define('MYSQL_PORT', '<your_mysql_port>');
define('MYSQL_DATABASE', '<your_mysql_database>');
define('MYSQL_CODING', '<your_mysql_charset>');

// Log path
define('LOG_PATH', __DIR__ . '/_log/');
define('LOG_FILE', 'log.txt');

/* END file */
?>