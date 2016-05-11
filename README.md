# webNote
我的毕业设计

## 代码结构

```
webNote/
├── _locales/                      //i18n目录
│   └── zh_CN                      //中文目录
│       └── messages.json          //中文语言包
├── css/                           //样式文件目录
│   ├── lib/                       //样式库文件目录
│   │   └── font-awesome.css       //第三方库css文件: icon-font字体库 (http://fontawesome.io/)
│   ├── content.css                //页面css文件
│   ├── option.css                 //配置页css文件
│   └── popup.css                  //popup页面css文件
├── font/                          //字体文件目录
│   ├── fontawesome-webfont.eot    //fontawesome字体eot文件
│   ├── fontawesome-webfont.svg    //fontawesome字体svg文件
│   ├── fontawesome-webfont.ttf    //fontawesome字体ttf文件
│   ├── fontawesome-webfont.woff   //fontawesome字体woff文件
│   ├── fontawesome-webfont.woff2  //fontawesome字体woff2文件
│   ├── FontAwesome.otf            //fontawesome字体otf文件
├── html/                          //html文件目录
│   ├── popup.html                 //popup页面html文件
│   └── option.html                //配置页html文件
├── icon/                          //icon文件目录
│   ├── logo128.png                //logo(128*128)
│   ├── logo16.png                 //logo(16*16)
│   ├── logo19.png                 //logo(19*19)
│   ├── logo38.png                 //logo(38*38)
│   └── logo48.png                 //logo(49*49)
├── img/                           //图片文件目录
│   └── nicEditorIcons.gif         //富文本编辑器nicEditor用到的Icons
├── js/                            //脚本文件目录
│   ├── lib/                       //脚本库文件目录
│   │   ├── jquery.min.js          //第三方库js文件: jQuery (https://jquery.com/)
│   │   ├── nicEdit.min.js         //第三方库js文件: 富文本编辑器NicEdit (http://nicedit.com/)
│   │   ├── require.min.js         //第三方库js文件: RequireJS (http://requirejs.org/)
│   │   └── serializeObject.js     //自行编写的用于将表单元素序列化为对象的jQuery插件
│   ├── module/                    //自定义AMD模块目录
│   │   ├── article.js             //笔记对象(依赖于localDatabase模块)
│   │   ├── config.js              //软件配置对象(依赖于localDatabase模块)
│   │   ├── content.html.js        //
│   │   ├── localDatabase.js       //本地数据db操作模块
│   │   └── msg.js                 //程序内部通信模块
│   ├── background.js              //后台页面js文件
│   ├── content.js                 //页面js文件
│   ├── option.js                  //配置页js文件
│   ├── popup.js                   //popup页js文件
│   ├── require.config.js          //RequireJS配置文件
│   └── require.content.js         //修改RequireJS的load方法以适应Chrome Extension
├── .gitignore                     //git忽略列表
├── manifest.json                  //Chrome Extension主配置文件
└── README.md                      //项目说明书
```

## 操作逻辑与通信流程

*待形成文字*

## TODO

- 增加新增笔记时的article id唯一性检测。
- 增加导入数据时的article id唯一性检测。
- 在popup页里关闭插件时应对每个tab进行通信。
- 重新封装，优化代码结构。

## 其他

目前此目录已可加载为Chrome Extension。

- 开启后，随便打开一个网站可以看到content.js效果。
- 在扩展管理页面点击背景页，可查看background.js的运行效果。