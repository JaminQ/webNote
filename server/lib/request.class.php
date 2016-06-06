<?php

class Request {
    private $type;
    private $callback;
    public $parameters;
    public $action;
    public $data;

    public function __construct($type) {
        $this->type = $type;
        $this->fetch();
    }

    public function fetch() {
        $this->parameters = ($this->type == 'GET') ? $_GET : $_POST;
        $this->callback = isset($this->parameters['callback']) ? trim($this->parameters['callback']) : '';
        $this->action = urldecode($this->parameters['action']);
        $this->data = json_decode($this->parameters['data']);
    }

    public function response($data) {
        header("Content-type: application/json; charset=utf-8");
        echo $this->callback . '(' . json_encode($data) .')';
    }
} // END

/* END file */
?>