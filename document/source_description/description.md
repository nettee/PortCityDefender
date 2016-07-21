# 1 客户端代码

## 1.1 客户端构成

客户端``client``的源代码主要在``www``文件夹，其主要包含5个文件夹：

* css：视图渲染设置模块
* templates：模板视图模块
* js：路由、控制器、数据服务模块
* lib：ionic视图组件和AngularJS框架代码
* img：客户端内部图片资源

## 1.2 各文件用途

```
www 源代码目录
├── css 视图渲染设置模块
│   └── style.css
├── img 客户端内部图片资源
├── index.html 用户界面的根页面，包含头文件的引用和应用逻辑模块名称的定义
├── js 路由、控制器、数据服务模块
│   ├── app.js 路由控制（将View与Controller绑定）
│   ├── controllers.js 控制器，包含与每个视图对应的控制器（MVVM的ViewModel和Controller部分）
│   └── services.js 数据服务（MVVM的Model部分）
├── lib ionic视图组件和AngularJS框架代码
│   ├── angular
│   ├── angular-animate
│   ├── angular-sanitize
│   ├── angular-ui-router
│   ├── ionic
│   └── ngCordova
└── templates 视图模板（MVVM的View部分）
    ├── command.html 指挥控制界面
    ├── commandReceiver.html 联系人选择界面
    ├── contact.html 联系人详情界面
    ├── contacts.html 通讯录界面
    ├── detailDocument.html 文档详情界面
    ├── detailInformation.html 情报详情界面
    ├── document.html 文档查看界面
    ├── documentSubClass.html 文档小类界面
    ├── documentSubClassItem.html 文档列表界面
    ├── information.html 情报动态界面
    ├── login.html 登录界面
    ├── menu.html 菜单栏
    ├── newCommand.html 新建命令界面
    ├── newInformation.html 新建情报界面
    ├── password.html 修改密码界面
    ├── responseInformation.html 回复情报界面
    ├── singleCommand.html 接收命令的详情界面
    ├── singleSendCommand.html 已发送命令的详情界面
    └── userpage.html 个人信息界面
```

# 2 服务器代码

## 2.1 系统构成

src文件夹下主要有四个文件夹：

+ models：数据访问层模块（MVC中的Model部分）
+ public：浏览器资源：JavaScript，CSS等
+ routes：业务逻辑层模块（MVC中的Controller部分）
+ views：前端模板模块（MVC中的View部分）

## 2.2 各文件用途

```
src
├── app.js 服务器主程序，包括路由和中间件控制
├── bin
│   └── www 服务器启动程序（Express框架自动生成）
├── models 数据访问层（MVC中的Model部分）
│   ├── authentications.js 用户登录注册
│   ├── commands.js 命令
│   ├── database.js 数据库访问基本模块
│   ├── documents.js 文档
│   ├── images.js 图片
│   ├── informations.js 情报
│   ├── regions.js 区域
│   └── users.js 用户
├── public （部分文件省略，未标注的文件来自Boostrap框架和fileinput插件）
│   ├── favicon.png 网站的标识
│   ├── fonts
│   ├── img
│   ├── javascripts
│   │   ├── bootstrap.min.js
│   │   ├── defender.js 港城卫士主脚本
│   │   ├── fileinput.min.js
│   │   ├── holder.min.js
│   │   ├── jquery.min.js
│   │   ├── locales
│   │   └── plugins
│   ├── stylesheets 
│   │   ├── bootstrap.min.css
│   │   ├── dashboard.css 控制台页面样式
│   │   ├── fileinput.min.css
│   │   ├── signin.css 登录页面样式
│   │   └── style.css
│   └── themes 
├── routes 业务逻辑层（MVC中的Controller部分）
│   ├── authentications.js 用户登录注册
│   ├── auth.js 权限认证模块
│   ├── commands.js 命令
│   ├── dashboard.js 控制台访问
│   ├── documents.js 文档
│   ├── images.js 图片
│   ├── informations.js 情报
│   ├── regions.js 区域
│   ├── test.js 测试
│   └── users.js 用户
└── views 前端模板（MVC中的View部分）
    ├── dashboard.ejs 控制台页面（包含下面的“子页面”）
    ├── document.ejs 文档子页面
    ├── documents.ejs 文档列表子页面
    ├── information.ejs 情报子页面
    ├── informations.ejs 情报列表子页面
    ├── login.ejs 登录页面
    ├── regions.ejs 区域列表子页面
    ├── user.ejs 用户列表子页面
    └── users.ejs 用户详情子页面

```
