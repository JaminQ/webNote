<?php

$data = $this->req->data;

$this->db->connect();

$table = 'webNote_noteData';
$columnName = '`data`';
$condition = 'user_id="' . $data->user_id . '"';

$result = $this->db->select($table, $columnName, $condition);

if($result->num_rows > 0) {
    $obj = $result->fetch_object();
    $res = array('data' => array('data' => $obj->data), 'status' => 1, 'msg' => '获取云端数据成功');
    $this->console->log('获取云端数据成功');
} else {
    $res = array('data' => '', 'status' => 0, 'msg' => '获取云端数据失败');
    $this->console->log('获取云端数据失败');
}

$result->free();
$this->db->disconnect();

$this->req->response($res);

?>