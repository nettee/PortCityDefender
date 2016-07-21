# 港城卫士用户手册

# 1 引言

## 1.1 编写目的

本说明书为应用软件“港城卫士“的用户手册，详细的阐述了用户如何安装本应用，以及对于不同的用户类型，如何使用本系统提供的各种功能。

本说明书的预期读者包括：系统管理员，军分区各级民兵及领导

## 1.2 背景

* 软件系统名称：港城卫士
* 任务提出者：软件工程综合实验任务组
* 开发者：三角铁小组（成员：刘毅、张晨曦、李楠）
* 用户：某市军分区各级领导及民兵

## 1.3 定义

暂无。

## 1.4 参考资料

1. 《GB8567——88 用户手册》
2. 《港城卫士需求规格说明书》
3. 《港城卫士设计说明书》
4. 《港城卫士测试报告》

# 2 用途

## 2.1 功能

### 普通用户

* 用户可以通过安卓平台或者iOS平台进行登录、注销、修改密码。（无注册功能）
* 情报动态：用户可以发布含有图片的情报信息，查看情报信息列表，回复情报信息。如果是用户自己发布的情报，还可以将其删除。
* 指挥控制：用户可以选择任意数量的直接下属（下一级用户）进行命令发送。用户可以查看自己收到的命令。
* 文档查看：用户可以查看后台管理员维护的文档列表。
* 通讯录：用户可以按区域查看所有4、5、6级用户的通讯录，也可以通过用户姓名进行搜索。

### 管理员

* 通过网页端登录后台网站
* 用户管理：查看用户列表，查看、编辑、删除和新增用户
* 情报管理：查看、删除情报
* 文档管理：按类别新建、查看、编辑、删除所有文档
* 区域管理：查看、添加或删除区域

## 2.2 性能

### 2.2.1 时间特性

* 软件并发用户数可大于50人，响应时间小于1秒，应用延迟时间小于2秒

### 2.2.3 灵活性

* 各模块显示列表内容的条数可以由管理员自行定义。系统需要进行分级权限管理，每个用户对所操作的内容可进行权限控制
* 软件支持通过二次开发动态增加功能模块，改善软件现有功能
* 软件功能设计合理，易于操作使用，用户可快速掌握软件操作

## 2.3 安全保密

* 本软件每个向服务器发送的请求均要求认证，确保数据的安全性，不会被窃取
* 数据库信息被妥善储存
* 每个账户仅能进行权限范围内的操作

# 3 运行环境

本系统的运行环境包括两个部分：手机客户端和服务器。

#### 手机客户端

手机客户端可为iOS环境或Android环境。对于iOS环境，要求RAM在512MB及以上，系统版本在iOS7.0及以上；对于Android环境，要求RAM在1GB及以上，系统版本在Android 4.0及以上。

#### 服务器

要求操作系统为Linux（CentOS或Debian），CPU主频2.5GHz，内容1GB，带宽1M。安装有Nodejs（4.2版本以上），Mongodb。

# 4 使用过程

## 4.1 安装与初始化

### 网页端

无需安装配置，访问http://121.40.97.40:3000/login即可。用户名admin，密码admin。

### 手机客户端

对于Android平台，请安装我们提供的apk包；对于iOS平台，请通过iTunes安装我们提供的ipa包。

## 4.2 功能

### 4.2.1 用户登录

#### 4.2.1.1 功能描述

输入正确的用户名和密码进行登录。

#### 4.2.1.2 操作说明

在登陆页面输入正确的用户名和密码，如果用户名或密码输入错误，需要重新输入。

![图1](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/user%20manual/images/login1.png)

![图2](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/user%20manual/images/login2.png)

成功登录后，进入情报动态页面。

![图3](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/user%20manual/images/login3.png)

### 4.2.2 情报查看

#### 4.2.2.1 功能描述

用户可以上下滑动查看情报列表，点击某一项可以查看情报详情，详情页面可以对情报进行回复，如果是自己发送的情报可以在详情页面进行删除。

#### 4.2.2.2 操作说明

在情报页面就可以看到情报列表，点击某一项情报查看情报详情。

![图1](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/user%20manual/images/info1.png)

![图2](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/user%20manual/images/info2.png)

在情报详情的右下角有回复按钮，点击可以进行回复

![图3](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/user%20manual/images/info3.png)

![图4](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/user%20manual/images/info4.png)

如果是自己发布的情报，在情报详情的右下角会看到删除按钮，点击可以删除情报

![图5](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/user%20manual/images/info5.png)

### 4.2.3 发布情报

#### 4.2.3.1 功能描述

用户可以发布情报信息，情报信息可以插入文字和图片，可以选择正常上报或紧急上报。

#### 4.2.3.2操作说明

在情报动态页面，点击右上角的“+”号可以新建情报

![图1](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/user%20manual/images/sendinfo1.png)

点击“插入图片”上传图片，可以选择拍照上传或从相册中选择。输入情报内容，点击右上角“发布”按钮发布情报。

![图2](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/user%20manual/images/sendinfo2.png)

![图4](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/user%20manual/images/sendinfo4.png)

已发布的情报会出现在情报列表中。

![图5](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/user%20manual/images/sendinfo5.png)

### 4.2.4 指挥控制

#### 4.2.4.1 功能描述

用户可以选择任意数量的直接下属（下一级用户）进行命令发送。用户可以查看自己收到的命令和已发送的命令。

#### 4.2.4.2 操作说明

左侧菜单选择指挥控制，进入指挥控制页面，看到收到的命令和发送的命令列表。点击某一条命令可以查看详情。

![图1](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/user%20manual/images/command1.png)

![图2](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/user%20manual/images/command2.png)

### 4.2.5 命令发送

#### 4.2.5.1 功能描述

用户可以点击新建命令并发送，命令的接收者为直接下属（下一级用户），可以同时向多人发送命令。

#### 4.2.5.2 操作说明

在指挥控制页面，点击右上角的“+”号新建命令。

![图1](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/user%20manual/images/newcommand1.png)

点击新建命令页面右上角的联系人图标，进入选择联系人页面

![图2](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/user%20manual/images/newcommand2.png)

可以选择多个联系人，也可以在上方搜索框输入名字搜索联系人进行选择。

![图4](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/user%20manual/images/newcommand4.png)

![图3](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/user%20manual/images/newcommand3.png)

选择好接收人后，输入命令内容，点击右上角的“发送”按钮发送命令。

![图6](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/user%20manual/images/newcommand6.png)

### 4.2.6 文档查看

#### 4.2.6.1 功能描述

用户可以后台维护的文档，包括三个大类，每个大类下面有四个小类。

#### 4.2.6.2 操作说明

点击左侧菜单的“文档查看”进入文档列表页面，可以看到所有大类的列表。

![图1](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/user%20manual/images/document1.png)

依次选择大类、小类，可以看到改分类下文档的列表。

![图2](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/user%20manual/images/document2.png)

![图3](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/user%20manual/images/document3.png)

点击任意一条文档，查看文档详情。

![图4](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/user%20manual/images/document4.png)

### 4.2.7 通讯录

#### 4.2.7.1 功能描述

可以查看四个区域下联系人的信息，区域可以折叠，也可以通过搜索ID和姓名找到联系人。

#### 4.2.7.2 操作说明

点击左侧菜单中的“通讯录”进入通讯录页面。

![图1](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/user%20manual/images/contact1.png)

点击区域，可以展开查看该区域下的联系人。

![图2](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/user%20manual/images/contact2.png)

可以在上方搜索框中输入用户的ID或姓名查找用户。

![图3](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/user%20manual/images/contact3.png)

点击某个联系人，查看联系人详情。

![图4](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/user%20manual/images/contact4.png)

### 4.2.8 个人信息与设置

#### 4.2.8.1 功能描述

可以查看个人信息，退出登录，修改密码。

#### 4.2.8.2 操作说明

打开左侧菜单，点击头像和个人描述处，进入个人信息页面。

![图1](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/user%20manual/images/user1.png)

点击“修改密码”修改自己的密码，需要输入旧密码和新密码。

![图2](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/user%20manual/images/user2.png)

![图3](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/user%20manual/images/user3.png)

点击“退出登录”，可以登出当前账号，回到登录页面重新登录。

![图5](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/user%20manual/images/user5.png)

![图6](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/user%20manual/images/user6.png)

## 4.4 出错处理和恢复

| 出错情况 | 系统输出信息 | 处理方法 |
|---|---|---|
| 登录时，用户名或密码错误 | 弹框提示“用户名或密码错误” | 重新输入正确的用户名和密码登录 |
| 修改密码时，原密码错误 | 弹框提示“原密码错误” | 重新输入正确的原密码、新密码和确认密码 |
| 修改密码时，新密码与确认密码不一致 | 弹框提示“确认密码错误” | 重新输入正确的原密码、新密码和确认密码 |
| 发送情报时，情报内容为空 | 弹框提示“情报内容不能为空” | 输入情报内容 |
| 插入图片时，手机不支持拍照功能 | 弹框提示“您的环境不支持拍照上传” | 无 |
| 插入图片时，手机不支持相册读取功能 | 弹框提示“您的环境不支持相册上传” | 无 |
| 查看情报详情时，该情报已被删除 | 弹框提示“该情报已被删除” | 无 |
| 回复情报时，该情报已删除 | 弹框提示“该情报已被删除” | 无 |
| 发送命令时，没有选择联系人 | 弹框提示“请选择联系人” | 无 |
| 发送命令时，命令内容为空 | 弹框提示“命令内容不能为空” | 无 |

