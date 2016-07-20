# 1 客户端代码

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
