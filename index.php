<?php

define('IF_AUTHORIZED', 1);

include_once 'config.php';
include_once 'controller.php';

// here we go
$controller = new Controller();
$controller->main();

/* END file */
?>