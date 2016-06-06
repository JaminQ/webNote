# webNote
我的毕业设计

## 代码结构

```
webNote/
├── action/                                     //action目录
│   ├── action_check_before_regist.php          //action: 注册前检测用户名是否重名
│   ├── action_get_server_datainfo.php          //action: 获取云端数据信息
│   ├── action_get_userinfo.php                 //action: 获取用户信息
│   ├── action_login.php                        //action: 用户登录
│   ├── action_regist.php                       //action: 用户注册
│   ├── action_sync_to_local.php                //action: 同步数据到本地
│   ├── action_sync_to_server.php               //action: 同步数据到云端
│   ├── action_update_password.php              //action: 修改密码
│   └── action_update_userinfo.php              //action: 修改用户信息
├── lib/                                        //php库目录
│   ├── console.class.php                       //class: 自行编写的用于输出控制台信息到文件
│   ├── database.class.php                      //class: 自行编写的用于执行数据库操作
│   └── request.class.php                       //class: 自行编写的用于处理请求
├── sql/                                        //sql文件目录
│   ├── tables.sql                              //创建表的sql脚本文件
│   └── triggers.sql                            //创建触发器的sql脚本文件
├── .gitignore                                  //git忽略列表
├── config.php                                  //软件配置文件
├── controller.php                              //controller文件
├── index.php                                   //软件主入口
└── README.md                                   //项目说明书
```

## TODO

- Add func `forget password`.
- Use `Session support` to store user's login status in server rather than store it in client by `localstorage`.