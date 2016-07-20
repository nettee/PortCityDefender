# 港城卫士 设计说明书

# 1. 引言

## 1.1 编写目的

编写这份设计说明书是为了给出软件的设计方案，为编码、测试提供依据，并作为日后软件维护的参考。

## 1.2 背景

+ 软件系统名称：港城卫士
+ 任务提出者：软件工程综合实验任务组
+ 开发者：三角铁小组（成员：刘毅、张晨曦、李楠）
+ 用户：某市军分区各级领导及民兵

## 1.3 定义

+ REST（Representational State Transfer，表述性状态传递）：一种软件架构风格，通过URI对资源进行唯一的标识，通过HTTP标准方法操作资源。
+ JSON（JavaScript Object Notation）：一种轻量级的数据交换格式，它基于JavaScript的语法，但又是完全独立于语言的文本格式。

## 1.4 参考资料

《港城卫士需求分析说明书》

# 2. 概述

## 2.1 需求规定

详见《港城卫士需求分析说明书》。

## 2.2 运行环境

本系统的运行环境包括两个部分：手机客户端和服务器。

#### 手机客户端

手机客户端可为iOS环境或Android环境。对于iOS环境，要求RAM在512MB及以上，系统版本在iOS7.0及以上；对于Android环境，要求RAM在1GB及以上，系统版本在Android 4.0及以上。

#### 服务器

要求操作系统为Linux（CentOS或Debian），CPU主频2.5GHz，内容1GB，带宽1M。安装有Nodejs（4.2版本以上），Mongodb。

## 2.3 基本设计概念和处理流程

### 2.3.1 基本架构设计

系统使用Cient/Server架构，分为服务器端和客户端；同时，在网页端后台管理部分，系统使用Browser/Server的架构。无论是C/S架构还是B/S架构，服务器和客户端所有的通信都使用HTTP协议。

![部署图](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/design/img/deployment.png)

### 2.3.2 客户端-服务器交互流程

客户端-服务器之间的基本交互模式为：用户在客户端操作时，客户端根据用户的操作发送HTTP请求，服务器返回结果。服务器返回的状态码表示了请求响应的类型，其中2xx代表成功，4xx代表出错，详情见第三章“接口设计”。客户端根据返回的结果，在用户界面上显示。下面的活动图展示了交互的基本过程。

![活动图](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/design/img/activity.png)

### 2.3.3 服务器架构设计

服务器端使用Node.js配合Express框架进行开发，采用MVC架构。当请求到来时，先经过Router（路由）根据请求的路径不同分发到不同的Controller。对于客户端发来的请求，Controller会调用Model得到数据，并将数据转换为JSON格式返回给客户端。对于浏览器发来的请求，Controller会调用Model得到数据，并将数据传给View进行渲染，将渲染得到的HTML返回给浏览器。

![架构图](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/design/img/architecture.png)

### 2.3.4 客户端架构设计

客户端使用ionic混合式应用开发框架进行开发，基本采用Angularjs的MVVM架构模式。在用户对界面进行操作时，首先会经过路由确定由哪个View进行显示和渲染，然后以ViewModel为中介进行View和Model之间的交互；View将用户的产生的事件和操作传递给ViewModel，ViewModel将对应的数据更新请求发送给Model，Model会向服务器发送请求获取数据返回给ViewModel，再由ViewModel通知View完成视图更新；其中Controller的作用就是初始化ViewModel的数据和把多个Model组合起来为ViewModel提供数据服务。

![客户端架构图](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/design/img/client-architecture.png)

## 2.4 结构

### 2.4.1 客户端结构

客户端中每一个视图View与一个html文件对应，提供画面的显示和渲染；ViewModel和Controller与controller文件对应，提供绑定数据的初始化和数据服务的中介；Model和service文件相对应，提供数据服务，包括向服务器发送请求和更新数据。在客户端中，app.js完成了路由控制，它负责将视图View和html的绑定，同时将html与其对应的controller文件绑定；而Service通过依赖注入的方式与Controller绑定。

### 2.4.2 服务器结构

服务器采用3-Tier架构中的“Fat Server”模式，分为两个层次：业务逻辑层和数据访问层。数据访问层屏蔽了数据库的细节，业务逻辑层无需知道数据库模式。同时，数据访问层也不得处理业务逻辑，如决定向客户端返回什么HTTP状态码。业务逻辑层和数据访问层之间是单向依赖的关系，数据访问层之间有同层的依赖，但没有下层到上层的依赖。下图展示了服务器的模块划分：

![系统结构图](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/design/img/structure.png)

## 2.5 功能需求与程序的关系

略。

## 2.6 人工处理过程

无。

# 3. 接口设计


## 3.1 用户接口

用户界面的设计由原型图给出，原型图详见附录A。

用户接口规定了用户在用户界面上的操作和用户界面之间的转跳关系，如下图所示：

![用户界面关系图](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/design/Protograph/%E7%94%A8%E6%88%B7%E7%95%8C%E9%9D%A2.png)

## 3.2 外部接口

无。本软件严禁外部程序访问，并需要添加严格的权限认证。详情参见第七章“安全设计”。

## 3.3 内部接口

内部接口规定了服务器和客户端之间的交互协议。服务器和客户端之间的接口均为HTTP协议，遵循REST设计原则。

服务器接收HTTP请求对情报信息、指挥命令、文档列表、用户信息进行操作。如无特殊说明，下面接口中request和response的格式都为JSON，request和response的header中Content-Type应为application/json。

如果response是表示一个错误（4xx和5xx返回码），返回一个Error对象，Error对象的属性有

+ `status`：状态码
+ `message`：错误信息

常见的返回状态码如下：

+ 200 OK - [GET]：服务器成功返回用户请求的数据
+ 201 Created - [POST/PUT/PATCH]：用户新建或修改数据成功
+ 204 No Content - [DELETE]：用户删除数据成功
+ 400 Invalid Request：用户发出的请求有语法错误，如JSON的格式错误
+ 401 Unauthorized：用户没有权限，token错误
+ 403 Forbidden：用户的访问被禁止，如普通用户试图删除其他用户发布的情报
+ 404 Not Found：用户试图获取不存在的资源，如查看命令详情，但命令ID不存在
+ 406 Not Acceptable：请求数据的格式错误，如要求application/json的格式，但请求的格式是text/plain
+ 409 Conflict：被请求的资源和资源当前状态存在冲突，如用户试图新建一个命令，但该ID的命令已经存在
+ 422 Unprocessable Entity：请求格式正确，但是由于含有语义错误，无法响应。如用户发送PUT请求修改每个情报的内容，但发送的JSON对象不完整
+ 500 Internal Server Error：服务器内部错误，如数据库访问出错

根据RESTful接口的语义，GET、PUT、DELETE方法都是幂等的，即多次发送GET、PUT、DELETE方法的请求，效果应该和发送一次的效果相同。POST方法不是幂等的。下面对于GET、PUT、DELETE方法不再做特殊说明，认为是幂等的。

本部分中出现的数据结构，请参考本文档第五章“系统数据结构设计”

### 注册和登录（认证信息）

| HTTP方法 | 路径 | 功能 | 权限 |
|----|----|----|----|
| POST | /authentications | 用户注册 | 管理员 | 
| GET | /authentications/_username_ | 用户登录 | 用户名为_username_的用户 |
| PUT | /authentications/_username_ | 修改密码 | 用户名为_username_的用户 |

认证信息为一个Authentication对象，包含的属性有
+ `username`：用户名
+ `password`：密码

1. POST /authentications：用户注册（新建认证信息）
  + 发送认证信息：管理员的用户名和密码
  + 发送数据：要新建的Authentication对象
  + 返回状态码：201
  + 返回内容：新建的Authentication对象
  + 异常情况
    + 认证信息错误：返回401状态码
    + 注册的用户名已存在：返回409状态码

2. GET /authentications/_username_：用户登录（获取认证信息）
  + 发送认证信息：登录用户的用户名和密码
  + 发送数据：无
  + 返回状态码：200
  + 返回内容：登录用户的Authentication对象
  + 异常情况
    + 认证信息错误：返回401状态码
    + 认证信息与URL中的_username_不一致：返回403状态码

3. PUT /authentications/_username_：修改密码（修改认证信息）
  + 发送认证信息：用户自己的用户名和密码
  + 发送数据：Authentication对象，username属性应和_username_一致，password属性为新的密码
  + 返回状态码：201
  + 返回内容：修改过后的Authentication对象
  + 异常情况
    + 认证信息错误：返回401状态码
    + 认证信息与_username_不一致：返回403状态码
    + 发送数据中Authentication对象的username属性和_username_不一致：返回422状态码

以上两个请求均使用HTTP Basic Authentication进行认证，权限为管理员，意味着只有使用管理员的用户名和密码登录才可以；权限为所有用户，意味着使用任意用户的用户名和密码登录均可以。

要发送认证信息，客户端应该在HTTP请求头部添加Authorization，格式为"Basic _encoded-string_"，其中_encoded-string_是字符串"_username_:_password_"经过base64编码后的串。

如无特殊说明，下文中的HTTP接口均需要使用HTTP Basic Authentication进行认证，认证出错的返回为：

1. 当认证信息错误时（用户名或密码错误），返回401状态码
2. 当认证信息的权限不满足所要求的权限时（如权限要求管理员，但认证信息为普通用户），返回403状态码

### 用户

| HTTP方法 | 路径 | 功能 | 权限 |
|----|----|----|----|
| POST | /users | 新增用户 | 管理员 | 
| GET | /users | 获得用户列表 | 所有用户 |
| GET | /users?region=_region_ | 按区域搜索用户 | 所有用户 |
| GET | /users?level=_level_ | 按级别搜索用户 | 所有用户 |
| GET | /users?name=_name_ | 按姓名搜索用户 | 所有用户 | 
| GET | /users?id=_userid_ | 按ID搜索用户 | 管理员 |
| GET | /users/_userid_ | 获得用户信息 | 所有用户 |
| PUT | /users/_userid_ | 修改用户信息 | 管理员 | 
| DELETE | /users/_userid_ | 删除用户 | 管理员 | 

用户数据为一个User对象，包含的属性有：
+ `id`：用户ID
+ `name`：姓名
+ `level`：级别
+ `region`：区域
+ `description`：描述
+ `phone`：电话

1. POST /users：新建用户
  + 发送数据：要新建的User对象
  + 返回状态码：201
  + 返回数据：新建的User对象
  + 说明：多次发送该请求时，服务器每次会尝试新增一个用户
  + 异常情况
    + 用户ID已存在：返回409状态码
    + 发送数据User对象的属性不完整：返回422状态码

2. GET /users：获得用户列表
  + 返回状态码：200
  + 返回数据：不带查询参数时，返回所有用户的列表；带有查询参数时，返回用户列表进行筛选后的结果。如果有多个查询参数，则进行多重筛选
  + 异常情况
    + 如果查询参数名称不正确，结果是未定义的

2. GET /users/_userid_：获得ID为_userid_的用户的信息
  + 发送数据：无
  + 返回状态码：200
  + 返回数据：ID为_userid_的User对象
  + 异常情况
    + ID为_userid_的用户不存在：返回404状态码

4. PUT /users/_userid_：修改ID为_userid_的用户的信息
  + 发送数据：一个完整的User对象，代表用户信息的预期修改结果
  + 返回状态码：201
  + 返回数据：修改后的User对象
  + 说明：服务器将ID为_userid_的用户信息替换为User中的用户信息，返回修改后的User对象
  + 异常情况
    + ID为_userid_的用户不存在：返回404状态码
    + 发送数据User对象的属性不完整：返回422状态码
    + 发送数据User对象的id属性和_userid_不等：返回422状态码

6. DELETE /users/_userid_：删除ID为_userid_的用户
  + 发送数据：无
  + 返回状态码：204
  + 返回数据：空对象
  + 异常情况
    + ID为_userid_的用户不存在：返回404状态码

### 情报信息

情报为一个Information对象，包含的属性有
+ `id`：情报ID
+ `publisher`：情报发布者 - User对象
+ `text`：情报文本
+ `urgent`：情报是否紧急
+ `updated_time`：更新时间
+ `images`：图片列表 - Image对象的数组
+ `replications`：回复列表 - Replication对象的数组

图片为一个Image对象，包含的属性有
+ `id`：图片ID
+ `size`：图片大小（字节）
+ `mime_type`：图片MIME类型，如"image/bmp", "image/png"

回复为一个Replication对象，包含的属性有
+ `replier`：回复者 - User对象
+ `content`：回复内容

| HTTP方法 | 路径 | 功能 | 权限 |
|----|----|----|----|
| POST | /information | 发送情报 | 所有用户 | 
| POST | /information/_info\_id_/images | 在情报中插入图片 | 情报所属用户 |
| POST | /information/_info\_id_/replications | 添加回复 | 所有用户 | 
| GET | /information | 获得情报列表 |  所有用户 | 
| GET | /information?publisher=_userid_ | 按发布用户ID搜索情报 | 管理员 |
| GET | /information?keyword=_keyword_ | 按关键字搜索情报 | 管理员 |
| GET | /information/_info\_id_ | 获得情报详情 | 所有用户 |
| DELETE | /information/_info\_id_ | 删除情报 | 情报所属用户 |

1. POST /information：新增一个情报
  + 发送数据：要新建的Information对象（只包含`publisher`, `text`, `urgent`属性，其中`publisher`只需设置为用户的id即可，不需要完整的User对象）
  + 返回状态码：201
  + 返回内容：新建的Information对象，其中`id`属性设置为情报的ID，`publisher`属性设置为完整的User对象，`updated_time`属性设置为服务器收到请求的时间，`images`属性和`replications`属性设置为空数组
  + 说明：多次发送该请求，每次都会新增一个情报，每个情报的ID都是不同的。
  + 使用模式：客户端在发布一个情报的时候，先发送一个POST /information请求，发送情报的文本信息；再发送若干个POST /information请求，发送情报中的图片
  + 异常情况
    + Information对象的属性不完整：返回422状态码

1. POST /information/_id_/images：在情报中插入图片
  + 发送数据：二进制数据，图片文件的内容。请求头部的Content-Type应设为图片所对应的MIME类型(image/*)，如JPEG文件为image/jpeg，PNG文件为image/png
  + 返回状态码：201
  + 返回内容：新建的图片对应的Image对象
  + 说明：服务器保存图片，并将新建的图片的Image对象添加到ID为_info\_id_的Information对象的`images`属性中
  + 使用模式：参见POST /information条目
  + 异常情况
    + ID为_id_的情报不存在：返回404状态码
    + 请求头部的Content-Type不是图片MIME类型(image/*)，或MIME类型错误（如image/jpg）：返回406状态码

1. POST /information/_info\_id_/replications：新建情报回复
  + 发送数据：要新建的Replication对象（其中`replier`只需设置为用户的id即可，不需要完整的User对象）
  + 返回状态码：201
  + 返回内容：新建的情报对应的Replication对象
  + 说明：服务器将新建的回复的Replication对象添加到ID为_info\_id_的Information对象的`replications`属性中
  + 异常情况
    + 发送数据中Replication对象的`replier`属性和认证信息不一致：返回403状态码
    + ID为_info\_id_的情报不存在：返回404状态码
    + 发送数据中Replication对象的属性不完整：返回422状态码

1. GET /information：获得情报列表
  + 发送数据：无
  + 返回状态码：200
  + 返回内容：Information对象的数组，按照`updated_time`的逆序进行排序
  + 说明：不带查询参数时，返回所有情报的列表；带有查询参数时，返回情报列表进行筛选后的结果。如果有多个查询参数，则进行多重筛选
  + 异常情况
    + 如果查询参数名称不正确，结果是未定义的

2. GET /information/_info\_id_：获取ID为_info\_id_的情报
  + 发送数据：无
  + 返回状态码：200
  + 返回内容：id属性为_info\_id_的Information对象
  + 使用模式：客户端在查看情报信息时，先发送GET /information请求获得Information对象；再根据Information对象的`images`属性，发送GET /images/_id_请求获得图片
  + 异常情况
    + ID为_info\_id_的情报不存在：返回404状态码

1. DELETE /information/_info\_id_：删除ID为_info\_id_的情报
  + 发送数据：无
  + 返回状态码：204
  + 返回内容：空对象
  + 异常情况
    + ID为_info\_id_的情报不存在：返回404状态码

#### 图片

| HTTP方法 | 路径 | 功能 | 权限 |
|----|----|----|----|
| GET | /images/_id_ | 获取图片 | 所有用户 |

1. GET /images/_id_：获取图片
  + 发送数据：无
  + 返回状态码：200
  + 返回数据：ID为_id_的图片，以二进制流的形式返回，Content-Length设置为图片的字节数（对应于Image对象的`size`属性），Content-Type设置为图片的MIME类型（对应于Image对象的`mime_type`属性）
  + 异常情况
    + ID为_id_的图片不存在：返回404状态码

#### 指挥命令

| HTTP方法 | 路径 | 功能 | 权限 |
|----|----|----|----|
| POST | /commands | 发送命令 | 所有用户 | 
| GET | /commands | 查看命令列表 | 管理员 |
| GET | /commands?receiver=_userid_ | 查看某个用户收到的命令 | 用户自己 | 

指挥命令为一个Command对象，包含的属性有
+ `receiver`：接收者 - User对象
+ `sender`：发送者 - User对象
+ `content`：内容
+ `updated_time`：更新时间

2. POST /commands：新增一个命令
  + 发送数据：要新建的Command对象（只需包含`receiver`，`sender`，`content`属性，其中`receiver`和`sender`只需设置为用户的id即可，不需要完整的User对象）
  + 返回状态码：201
  + 返回内容：新建的Command对象，其中`receiver`和`sender`属性设置为完整的User对象，`updated_time`属性设置为服务器收到请求的时间
  + 说明：多次发送该请求时，每次会新增一个命令
  + 异常情况
    + Command对象的属性不完整：返回422状态码

1. GET /commands/：获得命令列表，按照`updated_time`的逆序进行排序
  + 发送数据：无
  + 返回状态码：200
  + 返回内容：Command对象的数组。不带查询参数时，返回所有命令的列表；带有查询参数receiver时，返回按发送者ID进行筛选后的命令列表

#### 文档列表

文档为一个Document对象，包含的属性有
+ `id`：文档ID
+ `class`：大类
+ `subclass`：小类
+ `title`：标题
+ `text`：文本内容
+ `images`：图片 - Image对象的数组

| HTTP方法 | 路径 | 功能 | 权限 |
|----|----|----|----|
| POST | /documents | 新建文档 | 管理员 |
| GET | /documents/_class_/_subclass_/ | 获得文档列表 | 所有用户、管理员 | 
| GET | /documents/_class_/_subclass_/_id_ | 获得文档 | 所有用户、管理员 | 
| PUT | /documents/_id_ | 更新文档 | 管理员 |
| DELETE | /documents/_id_ | 删除文档 | 管理员 |

1. POST /documents

1. GET /documents/_class_/_subclass_/：获得文档列表
  + 发送数据：无
  + 返回状态码：200
  + 返回内容：Document对象的数组

1. PUT /documents

1. DELETE /documents/_id_：删除ID为_id_的文档
  + 发送数据：无
  + 返回状态码：204
  + 返回内容：空对象

#### 区域

| HTTP方法 | 路径 | 功能 | 权限 |
|----|----|----|----|
| GET | /regions | 获得区域列表 | 所有用户 |
| POST | /regions | 添加区域 | 管理员 |
| DELETE | /regions/_region\_id_ | 删除区域 | 管理员 |

# 4. 运行设计

## 4.1 运行控制

运行控制来自两个方面：客户端和网页端。

### 客户端

#### 登录、注销、修改密码

| 运行控制方式 | 操作步骤 |
|---|---|
| 用户登录 | 在登录页面输入用户名和密码，点击登录按钮 | 
| 查看个人信息 | 打开左侧抽屉菜单，点击头像 |
| 修改密码 | 在个人信息页面，点击修改密码按钮 |
| 用户注销 | 在个人信息页面，点击退出登录按钮 |

#### 情报

| 运行控制方式 | 操作步骤 |
|---|---|
| 查看情报列表 | 打开左侧抽屉菜单，选择“情报动态” |
| 查看情报详情 | 在情报动态页面，点击某个情报 |
| 回复情报 | 在情报详情页面，点击情报详情右下角的回复按钮 |
| 删除情报 | 在情报详情页面，点击情报详情右下角的删除按钮 |
| 发布情报 | 在情报动态页面，点击右上角的“+”号 |

#### 指挥控制

| 运行控制方式 | 操作步骤 |
|---|---|
| 查看自己收到的命令 | 打开左侧抽屉菜单，选择“指挥控制” |
| 发送命令 | 在指挥控制页面，点击右上角的“+”号 |

#### 文档

| 运行控制方式 | 操作步骤 |
|---|---|
| 查看文档 | 打开左侧抽屉菜单，选择“文档列表”，选择文档大类和小类，并点击文档标题查看详情 |

#### 通讯录

| 运行控制方式 | 操作步骤 |
|---|---|
| 查看通讯录 | 打开左侧抽屉菜单，选择“通讯录” |
| 搜索通讯录 | 在通讯录页面，点击页面上方的搜索框，输入用户姓名，并点击“搜索”按钮 |

### 网页端

#### 用户管理

| 运行控制方式 | 操作步骤 |
|---|---|
| 查看用户列表 | 点击左侧导航栏中的“用户管理” |
| 按ID搜索用户 | 在用户管理页面，在页面上方的搜索框中输入用户ID |
| 查看用户详情 | 在用户管理页面，点击用户列表中某一行右边的“查看”按钮 | 
| 编辑用户 | 在用户管理页面，点击用户列表中某一行右边的“编辑”按钮，或在用户详情页面，点击“编辑”按钮 |
| 删除用户 | 在用户管理页面，点击用户列表中某一行右边的“删除”按钮，或在用户详情页面，点击“删除”按钮 |
| 新建用户 | 在用户管理页面，点击上方的“新增用户”按钮 |

#### 情报管理

| 运行控制方式 | 操作步骤 |
|---|---|
| 查看情报列表 | 点击左侧导航栏中的“情报管理” |
| 按发布用户ID搜索情报 | 在情报管理页面，在页面上方的的下拉菜单选择“发布人ID包含”，并在搜索框中输入用户ID |
| 按内容搜索情报 | 在情报管理页面，在页面上方的的下拉菜单选择“内容包含”，并在搜索框中输入搜索内容 |	
| 查看情报详情 | 在情报管理页面，点击情报列表中某一行右边的“查看”按钮 | 
| 删除情报 | 在情报管理页面，点击情报列表中某一行右边的“删除”按钮，或在情报详情页面，点击“删除”按钮 |

#### 文档管理

| 运行控制方式 | 操作步骤 |
|---|---|
| 查看文档列表 | 点击左侧导航栏中的“文档管理” |
| 按分类查看文档列表 | 在文档管理页面，在页面上方的下拉菜单选择大类和小类 |
| 查看文档详情 | 在文档管理页面，点击文档列表中某一行右边的“查看”按钮 | 
| 编辑文档 | 在文档详情页面，点击“编辑”按钮 |
| 删除文档 | 在文档详情页面，点击“删除”按钮 |
| 新建文档 | 在文档管理页面，点击上方的“新建文档”按钮 |

#### 区域管理

| 运行控制方式 | 操作步骤 |
|---|---|
| 查看区域列表 | 点击左侧导航栏中的“区域管理” |
| 查看区域内用户 | 在区域管理页面，点击某个区域 |
| 删除区域 | 点开某个不含用户的区域时，点击“删除区域”按钮 |
| 新建区域 | 在区域管理页面，在页面上方输入框中输入区域名，并点击“新建区域”按钮 |

## 4.2 运行模块组合

### 客户端

#### 登录、注销、修改密码

| 运行控制 | 运行模块组合（客户端） | 运行模块组合（服务器）|
|---|---|---|
| 用户登录 | 登陆控制器-用户服务 | 用户路由-用户模型 |
| 查看个人信息 | 用户控制器-用户服务 | 用户路由-用户模型 |
| 修改密码 | 密码控制器-用户服务-密码服务 | 用户路由-用户模型 |
| 用户注销 | 用户控制器-用户服务 | 用户路由-用户模型 |

#### 情报

| 运行控制 | 运行模块组合（客户端） | 运行模块组合（服务器）|
|---|---|---|
| 查看情报列表 | 情报控制器-情报服务-用户服务-模态框服务 | 情报路由-情报模型-用户模型-图片模型 |
| 查看情报详情 | 情报详情控制器-情报详情服务-用户服务 | 情报路由-情报模型-用户模型-图片模型 |
| 回复情报 | 回复控制器-用户服务-回复服务 | 情报路由-情报模型 |
| 删除情报 | 情报详情控制器-情报详情服务 | 情报路由-情报模型 |
| 发布情报 | 新建情报控制器-用户服务-情报服务-照相机服务-模态框服务 | 情报路由-图片模型-情报模型 |

#### 指挥控制

| 运行控制 | 运行模块组合（客户端） | 运行模块组合（服务器）|
|---|---|---|
| 查看自己收到的命令列表 | 命令控制器-命令服务-用户服务 | 命令路由-命令模型 |
| 查看自己发送的命令列表 | 命令控制器-命令服务-用户服务 | 命令路由-命令模型 |
| 查看自己收到的命令详情 | 接受命令详情控制器-命令服务-用户服务 | 命令路由-命令模型 | 
| 查看自己发送的命令详情 | 发送命令详情控制器-命令服务-用户服务 | 命令路由-命令模型 |
| 发送命令 | 新建命令控制器-联系人选择控制器-命令服务 | 命令路由-命令模型 |

#### 文档

| 运行控制 | 运行模块组合（客户端） | 运行模块组合（服务器）|
|---|---|---|
| 查看文档 | 文档控制器-文档子类控制器-文档列表控制器-文档详情控制器-文档服务 | 文档路由-文档模型-图片模型 |

#### 通讯录

| 运行控制 | 运行模块组合（客户端） | 运行模块组合（服务器）|
|---|---|---|
| 查看通讯录 | 通讯录控制器-用户服务 | 用户路由-用户模型 |
| 搜索通讯录 | 通讯录控制器-用户服务 | 用户路由-用户模型 |
| 查看联系人详情 | 联系人详情控制器-用户服务 | 用户路由-用户模型 |

### 网页端

| 运行控制 | 运行模块组合 |
|---|---|
| 用户管理 | dashboard.js -> models/users.js |
| 情报管理 | dashboard.js -> models/informations.js | 
| 文档管理 | dashboard.js -> models/documents.js |
| 区域管理 | dashboard.js -> models/regions.js |

# 5 系统数据结构设计

## 5.1 逻辑结构设计要点

#### 认证信息（Authentication）
+ `username`：用户名
+ `password`：密码

#### 用户（User）
+ `id`：用户ID
+ `name`：姓名
+ `level`：级别
+ `region`：区域
+ `description`：描述
+ `phone`：电话


#### 情报（Information）
+ `id`：情报ID
+ `publisher`：情报发布者 - User对象
+ `text`：情报文本
+ `urgent`：情报是否紧急
+ `updated_time`：更新时间
+ `images`：图片列表 - Image对象的数组
+ `replications`：回复列表 - Replication对象的数组

#### 图片（Image）
+ `id`：图片ID
+ `size`：图片大小（字节）
+ `mime_type`：图片MIME类型，如"image/bmp", "image/png"

#### 回复（Replication）
+ `replier`：回复者 - User对象
+ `content`：回复内容

#### 命令（Command）
+ `receiver`：接收者 - User对象
+ `sender`：发送者 - User对象
+ `content`：内容
+ `updated_time`：更新时间

#### 文档（Document）
+ `id`：文档ID
+ `class`：大类
+ `subclass`：小类
+ `title`：标题
+ `text`：文本内容
+ `images`：图片 - Image对象的数组

以上的数据结构可以用下面的类图来表示：

![类图](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/design/img/class.png)

## 5.2 物理结构设计要点

数据结构的物理存储由Mongodb数据库进行控制，系统使用Mongodb的默认配置。

## 5.3 数据结构与程序的关系

这些数据结构统一存储在Mongodb数据库中，从程序中获取数据，每条数据对应一个JavaScript对象。

# 6 系统出错处理设计

## 6.1 出错信息

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

## 6.2 补救措施

暂无。

## 6.3 系统维护设计

暂无。

# 7 安全设计

## 7.1 目的

服务器应当有一定的安全性，外界不能通过伪造HTTP请求的方式获得服务器数据，也不能直接通过HTTP请求进入管理员控制台。

## 7.2 手段

### 7.2.1 网页端

网页端使用Session防止绕过登录直接进入管理员控制台。每次管理员通过登录页面进行登录时，在Session中添加登录信息；每次登出时，将登录信息从Session中删除。在访问控制台页面时，检查Session中是否含有登录信息，如果没有登录信息，应拒绝访问控制台。

### 7.2.2 客户端

客户端和服务器之间的HTTP通信均需要通过HTTP认证。具体的认证方式使用HTTP Basic Authentication，每次客户端的请求均需要使用已登录用户的用户名和密码发送Basic Auth认证信息。如果外界不添加认证信息直接发送HTTP请求，服务器应返回401错误。

# 附录A 用户界面设计原型图

### 1.登陆与菜单栏

* 登陆界面

![原型图-登陆界面](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/design/Protograph/%E7%99%BB%E9%99%86.png)

* 菜单栏

![原型图-菜单栏](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/design/Protograph/%E5%B7%A6%E4%BE%A7%E8%8F%9C%E5%8D%95%E6%A0%8F.png)

### 2.个人信息

* 个人信息界面

![原型图-个人信息](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/design/Protograph/%E4%B8%AA%E4%BA%BA%E4%BF%A1%E6%81%AF.png)

* 修改密码界面

![原型图-修改密码](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/design/Protograph/%E4%BF%AE%E6%94%B9%E5%AF%86%E7%A0%81.png)

### 3.情报动态

* 情报动态界面

![原型图-情报动态](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/design/Protograph/%E6%83%85%E6%8A%A5%E5%8A%A8%E6%80%81.png)

* 新建情报界面

![原型图-新建情报](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/design/Protograph/%E6%96%B0%E5%BB%BA%E6%83%85%E6%8A%A5.png)

* 情报详情界面

![原型图-情报详情](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/design/Protograph/%E6%83%85%E6%8A%A5%E8%AF%A6%E6%83%85.png)

* 回复界面

![原型图-回复](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/design/Protograph/%E5%9B%9E%E5%A4%8D%E6%83%85%E6%8A%A5.png)

### 4.控制指挥

* 控制指挥界面

![原型图-控制指挥](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/design/Protograph/%E6%8E%A7%E5%88%B6%E6%8C%87%E6%8C%A5.png)

* 新建命令界面

![原型图-新建命令](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/design/Protograph/新建命令.png)

* 选择联系人界面

![原型图-选择联系人](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/design/Protograph/%E9%80%89%E6%8B%A9%E5%91%BD%E4%BB%A4%E8%81%94%E7%B3%BB%E4%BA%BA.png)

* 命令详情界面

![原型图-命令详情](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/design/Protograph/%E5%91%BD%E4%BB%A4%E8%AF%A6%E6%83%85.png)

### 5.文档查看

* 文档查看界面

![原型图-文档查看](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/design/Protograph/%E6%96%87%E6%A1%A3%E6%9F%A5%E7%9C%8B.png)

* 文档小类/列表界面

![原型图-文档小类/列表](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/design/Protograph/%E6%96%87%E6%A1%A3%E5%B0%8F%E7%B1%BB-%E5%88%97%E8%A1%A8.png)

* 文档详情界面

![原型图-文档详情](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/design/Protograph/%E6%96%87%E6%A1%A3%E8%AF%A6%E6%83%85.png)

### 6.通讯录

* 通讯录界面

![原型图-通讯录](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/design/Protograph/%E9%80%9A%E8%AE%AF%E5%BD%95.png)

* 联系人详情界面

![原型图-联系人详情](https://raw.githubusercontent.com/nettee/PortCityDefender/dev/document/design/Protograph/%E8%81%94%E7%B3%BB%E4%BA%BA%E8%AF%A6%E6%83%85.png)