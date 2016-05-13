<?php

$data = $this->req->data;

$this->db->connect();

$table = 'webNote_user';
$columnName = '*';
$condition = 'account="' .
             $data->account .
             '"';

$result = $this->db->select($table, $columnName, $condition);

if($result->num_rows > 0) {
    $res = array('data' => '', 'status' => 0, 'msg' => '账号已存在');
    $this->console->log('账号已存在');
} else {
    $res = array('data' => '', 'status' => 1, 'msg' => '可以使用');
    $this->console->log('可以使用');
}

$result->free();
$this->db->disconnect();

$this->req->response($res);

?>