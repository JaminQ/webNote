<?php

$data = $this->req->data;

$this->db->connect();

$table = 'webNote_user';
$columnName = 'account, `name`, `sex`, create_time';
$condition = 'id="' . $data->id . '"';

$result = $this->db->select($table, $columnName, $condition);

if($result->num_rows > 0) {
    $obj = $result->fetch_object();
    $res = array('data' => array('account' => $obj->account,
                                 'name' => $obj->name,
                                 'sex' => $obj->sex,
                                 'create_time' => $obj->create_time),
                 'status' => 1,
                 'msg' => '获取用户信息成功');
    $this->console->log('获取用户信息成功');
} else {
    $res = array('data' => '', 'status' => 0, 'msg' => '获取用户信息失败');
    $this->console->error('获取用户信息失败');
}

$result->free();
$this->db->disconnect();

$this->req->response($res);

?>