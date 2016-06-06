<?php

$data = $this->req->data;

$this->db->connect();

$table = 'webNote_user';
$columnName = 'account,`password`';
$condition = '"' .
             $data->account .
             '","' .
             $data->password .
             '"';

if($this->db->insert($table, $columnName, $condition)) {
    $res = array('data' => '', 'status' => 1, 'msg' => '注册成功');
    $this->console->log('注册成功');
} else {
    $res = array('data' => '', 'status' => 0, 'msg' => '注册失败');
    $this->console->error('注册失败');
}

$this->db->disconnect();

$this->req->response($res);

?>