<?php

$data = $this->req->data;

$this->db->connect();

$table = 'webNote_user';
$columnName = 'id';
$condition = 'account="' .
             $data->account .
             '" AND `password`="' .
             $data->password .
             '"';

$result = $this->db->select($table, $columnName, $condition);

if($result->num_rows > 0) {
    $obj = $result->fetch_object();
    $res = array('data' => array('id' => $obj->id), 'status' => 1, 'msg' => '登陆成功');
    $this->console->log('登陆成功');
} else {
    $res = array('data' => '', 'status' => 0, 'msg' => '账号不存在或密码不正确');
    $this->console->log('账号不存在或密码不正确');
}

$result->free();
$this->db->disconnect();

$this->req->response($res);

?>