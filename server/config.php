<?php if (!defined('IF_AUTHORIZED')) { die('Unauthorized Access!'); }

// Some database configuration
define('MYSQL_USER', '<mysql_user>');
define('MYSQL_PASSWORD', '<mysql_password>');
define('MYSQL_HOST', '<mysql_host>');
define('MYSQL_PORT', '<mysql_port>');
define('MYSQL_DATABASE', '<mysql_database>');
define('MYSQL_CODING', '<mysql_coding>');

// Log path
define('LOG_PATH', __DIR__ . '/_log/');
define('LOG_FILE', 'log.txt');

/* END file */
?>