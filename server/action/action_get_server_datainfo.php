<?php

$data = $this->req->data;

$this->db->connect();

$table = 'webNote_noteData';
$columnName = 'list_num,removed_num,sync_time';
$condition = 'user_id="' . $data->user_id . '"';

$result = $this->db->select($table, $columnName, $condition);

if($result->num_rows > 0) {
    $obj = $result->fetch_object();
    $res = array('data' => array('list_num' => $obj->list_num,
                                 'removed_num' => $obj->removed_num,
                                 'sync_time' => $obj->sync_time),
                 'status' => 1,
                 'msg' => '获取云端数据成功');
    $this->console->log('获取云端数据成功');
} else {
    $res = array('data' => '', 'status' => 0, 'msg' => '获取云端数据失败');
    $this->console->log('获取云端数据失败');
}

$result->free();
$this->db->disconnect();

$this->req->response($res);

?>