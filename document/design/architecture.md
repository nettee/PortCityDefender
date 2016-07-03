# 2. 概述

软件使用C/S架构，分为服务器端和客户端。服务器端和客户端所有的通信都使用HTTP协议

# 3. 接口设计

## 3.3 内部接口

内部接口规定了服务器和客户端之间的交互协议。服务器和客户端之间的接口均为HTTP协议，遵循REST设计原则。

服务器接收HTTP请求对情报信息、指挥命令、文档列表、用户信息进行操作。如无特殊说明，下面接口中request和response的格式都为JSON，request和response的header中Content-Type应为application/json。

常见的返回状态码如下：

+ 200 OK - [GET]：服务器成功返回用户请求的数据
+ 201 Created - [POST/PUT/PATCH]：用户新建或修改数据成功
+ 204 No Content - [DELETE]：用户删除数据成功
+ 400 Invalid Request：用户发出的请求有语法错误，如JSON的格式错误
+ 401 Unauthorized：用户没有权限，token错误
+ 403 Forbidden：用户的访问被禁止，如普通用户试图删除其他用户发布的情报
+ 404 Not Found：用户试图获取不存在的资源，如查看命令详情，但命令ID不存在
+ 409 Conflict：被请求的资源和资源当前状态存在冲突，如用户试图新建一个命令，但该ID的命令已经存在
+ 422 Unprocessable Entity：请求格式正确，但是由于含有语义错误，无法响应。如用户发送PUT请求修改每个情报的内容，但发送的JSON对象不完整
+ 500 Internal Server Error：服务器内部错误，如数据库访问出错

根据RESTful接口的语义，GET、PUT、DELETE方法都是幂等的，即多次发送GET、PUT、DELETE方法的请求，效果应该和发送一次的效果相同。POST方法不是幂等的。下面对于GET、PUT、DELETE方法不再做特殊说明，认为是幂等的。

#### 注册和登录（认证信息）

| HTTP方法 | 路径 | 功能 | 权限 |
|---|---|---|---|
| POST | /authentications | 用户注册 | 管理员 | 
| GET | /authentications/_username_ | 用户登录 | 用户名为_username_的用户 |
| PUT | /authentications/_username_ | 修改密码 | 用户名为_username_的用户 |

认证信息为一个Authentication对象，包含`username`, `password`两个属性，分别代表用户名和密码。

1. POST /authentications 用户注册（新建认证信息）
  + 发送认证信息：管理员的用户名和密码
  + 发送数据：要新建的Authentication对象
  + 返回状态码：201
  + 返回内容：新建的Authentication对象
  + 异常情况
    + 认证信息错误：返回401状态码
    + 注册的用户名已存在：返回409状态码

2. GET /authentications/_username_ 用户登录（获取认证信息）
  + 发送认证信息：登录用户的用户名和密码
  + 发送数据：无
  + 返回状态码：200
  + 返回内容：登录用户的Authentication对象
  + 异常情况
    + 认证信息错误：返回401状态码
    + 认证信息与URL中的_username_不一致：返回403状态码

3. PUT /authentications/_username_ 修改密码（修改认证信息）
  + 发送认证信息：用户自己的用户名和密码
  + 发送数据：Authentication对象，username属性应和_username_一致，password属性为新的密码
  + 返回状态码：201
  + 返回内容：修改过后的Authentication对象
  + 异常情况
    + 认证信息错误：返回401状态码
    + 认证信息与_username_不一致：返回403状态码
    + 发送数据中Authentication对象的username属性和_username_不一致：返回422状态码

以上两个请求均使用HTTP Basic Authentication进行认证，权限为管理员，意味着只有使用管理员的用户名和密码登录才可以；权限为所有用户，意味着使用任意用户的用户名和密码登录均可以。

客户端有两种方式发送认证信息：

1. 在URL中加入用户名的密码。完整的URL应是：http://_username_:_password_@_host_:_port_/authentications
2. 在HTTP请求头部添加Authorization，格式为"Basic _encoded-string_"，其中_encoded-string_是字符串"_username_:_password_"经过base64编码后的串。

如无特殊说明，下文中的HTTP接口均需要使用HTTP Basic Authentication进行认证，认证出错的返回为：

1. 当认证信息错误时（用户名或密码错误），返回401状态码
2. 当认证信息的权限不满足所要求的权限时（如权限要求管理员，但认证信息为普通用户），返回403状态码

#### 用户

| HTTP方法 | 路径 | 功能 | 权限 |
|---|---|---|---|
| POST | /users | 新增用户 | 管理员 | 
| GET | /users | 获得用户列表 | 所有用户 |
| GET | /users?region=_region_ | 按区域搜索用户 | 所有用户 |
| GET | /users?level=_level_ | 按级别搜索用户 | 所有用户 |
| GET | /users?name=_name_ | 按姓名搜索用户 | 所有用户 | 
| GET | /users?id=_userid_ | 按ID搜索用户 | 管理员 |
| GET | /users/_userid_ | 获得用户信息 | 所有用户 |
| PUT | /users/_userid_ | 修改用户信息 | 管理员 | 
| PATCH | /users/_userid_ | 部分更新用户信息 | 管理员 | 
| DELETE | /users/_userid_ | 删除用户 | 管理员 | 

用户数据为一个User对象，含有`id`,`name`,`level`,`region`,`description`,`phone`六个属性，分别代表用户的ID、姓名、级别、区域、描述、电话。

1. POST /users 新建用户
  + 发送数据：要新建的User对象
  + 返回状态码：201
  + 返回数据：新建的User对象
  + 说明：多次发送该请求时，服务器每次会尝试新增一个用户
  + 异常情况
    + 用户ID已存在：返回409状态码
    + 发送数据User对象的属性不完整：返回422状态码

2. GET /users 获得用户列表
  + 返回状态码：200
  + 返回数据：不带查询参数时，返回所有用户的列表；带有查询参数时，返回用户列表进行筛选后的结果。如果有多个查询参数，则进行多重筛选
  + 异常情况
    + 如果查询参数名称不正确，结果是未定义的

2. GET /users/_userid_ 获得ID为_userid_的用户的信息
  + 发送数据：无
  + 返回状态码：200
  + 返回数据：ID为_userid_的User对象
  + 异常情况
    + ID为_userid_的用户不存在：返回404状态码

4. PUT /users/_userid_ 修改ID为_userid_的用户的信息
  + 发送数据：一个完整的User对象，代表用户信息的预期修改结果
  + 返回状态码：201
  + 返回数据：修改后的User对象
  + 说明：服务器将ID为_userid_的用户信息替换为User中的用户信息，返回修改后的User对象
  + 异常情况
    + ID为_userid_的用户不存在：返回404状态码
    + 发送数据User对象的属性不完整：返回422状态码
    + 发送数据User对象的id属性和_userid_不等：返回422状态码

5. PATCH /users/_userid_ 部分修改ID为_userid_的用户的信息
  + 发送数据：一个（不一定完整的）User对象，包含User对象的若干个属性，每个属性代表用户信息的预期修改结果
  + 返回状态码：201
  + 返回数据：修改后的User对象
  + 说明：服务器将ID为_userid_的用户信息根据发送的数据中的User对象进行部分更新
  + 异常情况
    + ID为_userid_的用户不存在：返回404状态码
    + User对象含有id属性且和_userid_不等：返回422状态码

6. DELETE /users/_userid_ 删除ID为_userid_的用户
  + 发送数据：无
  + 返回状态码：204
  + 返回数据：空对象
  + 异常情况
    + ID为_userid_的用户不存在：返回404状态码

#### 情报信息

| HTTP方法 | 路径 | 功能 | 权限 |
|---|---|---|---|
| GET | /information | 获得情报列表 |  所有用户 | 
| GET | /information?publisher=_userid_ | 按发布用户ID搜索情报 | 管理员 |
| GET | /information?keyword=_keyword_ | 按关键字搜索情报 | 管理员 |
| GET | /information/_info\_id_ | 获得情报详情 | 所有用户 |
| POST | /information | 发送情报 | 所有用户 | 
| GET | /information/_info\_id_/images | 获得情报图片列表 | 所有用户 |
| POST | /information/_info\_id_/images | 在情报中插入图片 | 情报所属用户 |
| GET | /information/_info\_id_/replications | 获得情报回复列表 | 所有用户 | 
| POST | /information/_info\_id_/replications | 添加回复 | 所有用户 | 
| DELETE | /information/_info\_id_ | 删除情报 | 情报所属用户 |

情报为一个Information对象，包含`id`, `publisher`, `text`, `urgent`, `updated`, `images`,  `replications`六个属性，分别代表情报ID、情报发布者（ID）、情报文本、是否紧急、更新时间、图片列表、回复列表。

回复为一个Replication对象，包含`publisher`, `content`两个属性，分别代表回复发布者（ID）、回复内容。

1. GET /information 获得情报列表。
    + 返回内容：Information对象的数组
    + 返回状态码：200
    + 说明：不带查询参数时，返回所有情报的列表；带有查询参数时，返回情报列表进行筛选后的结果。如果有多个查询参数，则进行多重筛选
    + 例外情况：如果查询参数名称不正确，结果是未定义的

2. GET /information/_info\_id_ 获得ID为_info\_id_的情报信息
    + 返回状态码：200
    + 返回内容：Information对象
    + 如果ID为_info\_id_的情报不存在，返回404状态码。

3. POST /information 新增一个情报。用户请求发送一个Information对象，服务器返回新增的Information对象，返回201状态码。多次发送该请求时，服务器每次会尝试新增一个情报。如果情报ID已存在，服务器返回400状态码。

#### 指挥命令

| HTTP方法 | 路径 | 功能 | 权限 |
|---|---|---|---|
| GET | /commands | 查看命令列表 | 管理员 |
| GET | /commands?receiver=_userid_ | 查看某个用户收到的命令 | 用户自己 | 
| POST | /commands | 发送命令 | 所有用户 | 

指挥命令为一个Command对象，包含`receiver`, `sender`, `content`三个属性，分别代表命令的接收者（ID）、发送者（ID）、内容。

1. GET /commands/ 获得命令列表。服务器返回Command对象的数组，返回200状态码。不带查询参数时，返回所有命令的列表；带有查询参数receiver时，返回按发送者进行筛选后的命令列表。如果查询参数名称不正确，结果是未定义的。

2. POST /commands 新增一个命令。用户请求发送一个Command对象，服务器返回新增的Command对象，返回201状态码。多次发送该请求时，服务器每次会尝试新增一个命令。如果Command对象的三个属性不完整，服务器返回400状态码。

#### 文档列表

| HTTP方法 | 路径 | 功能 | 权限 |
|---|---|---|---|
| GET | /documents/_class_/_subclass_/_doc\_name_ | 获得文档 | 所有用户、管理员 | 
| POST | /documents/_class_/_subclass_/_doc\_name_ | 新建文档 | 管理员 |
| PUT | /documents/_class_/_subclass_/_doc\_name_ | 更新文档 | 管理员 |
| DELETE | /documents/_class_/_subclass_/_doc\_name_ | 删除文档 | 管理员 |


#### 区域

| HTTP方法 | 路径 | 功能 | 权限 |
|---|---|---|---|
| GET | /regions | 获得区域列表 | 所有用户 |
| POST | /regions | 添加区域 | 管理员 |
| DELETE | /regions/_region\_id_ | 删除区域 | 管理员 |


