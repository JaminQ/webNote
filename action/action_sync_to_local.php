<?php

$data = $this->req->data;

$this->db->connect();

$table = 'webNote_noteData';
$columnName = '`data`';
$condition = 'user_id="' . $data->user_id . '"';

$result = $this->db->select($table, $columnName, $condition);

if($result->num_rows > 0) {
    $obj = $result->fetch_object();
    $res = array('data' => array('data' => $obj->data), 'status' => 1, 'msg' => '云端数据同步到本地成功');
    $this->console->log('云端数据同步到本地成功');
} else {
    $res = array('data' => '', 'status' => 0, 'msg' => '云端数据同步到本地失败');
    $this->console->log('云端数据同步到本地失败');
}

$result->free();
$this->db->disconnect();

$this->req->response($res);

?>