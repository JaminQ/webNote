<?php

$data = $this->req->data;

$this->db->connect();

$table = 'webNote_noteData';
$mod_content = '`data`="' .
               $data->data .
               '",list_num="' .
               $data->list_num .
               '",removed_num="' .
               $data->removed_num .
               '"';
$condition = 'user_id="' . $data->user_id . '"';

if($this->db->update($table, $mod_content, $condition)) {
    $res = array('data' => '', 'status' => 1, 'msg' => '云端数据同步成功');
    $this->console->log('云端数据同步成功');
} else {
    $res = array('data' => '', 'status' => 0, 'msg' => '云端数据同步失败');
    $this->console->error('云端数据同步失败');
}

$this->db->disconnect();

$this->req->response($res);

?>