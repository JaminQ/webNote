<?php

$data = $this->req->data;

$this->db->connect();

$table = 'webNote_user';
$mod_content = '`password`="' . $data->password . '"';
$condition = 'id="' . $data->id . '"';

if($this->db->update($table, $mod_content, $condition)) {
    $res = array('data' => '', 'status' => 1, 'msg' => '修改密码成功');
    $this->console->log('修改密码成功');
} else {
    $res = array('data' => '', 'status' => 0, 'msg' => '修改密码失败');
    $this->console->error('修改密码失败');
}

$this->db->disconnect();

$this->req->response($res);

?>