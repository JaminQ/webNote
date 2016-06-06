<?php

$data = $this->req->data;

$this->db->connect();

$table = 'webNote_user';
$mod_content = '`name`="' . $data->name . '"';
$condition = 'id="' . $data->id . '"';
if(isset($data->sex)) {
    $mod_content = $mod_content . ',sex="' . $data->sex . '"';
}

if($this->db->update($table, $mod_content, $condition)) {
    $res = array('data' => '', 'status' => 1, 'msg' => '修改个人信息成功');
    $this->console->log('修改个人信息成功');
} else {
    $res = array('data' => '', 'status' => 0, 'msg' => '修改个人信息失败');
    $this->console->error('修改个人信息失败');
}

$this->db->disconnect();

$this->req->response($res);

?>