# 3. 接口设计

## 3.3 内部接口

内部接口规定了服务器和客户端之间的交互协议。

#### RESTful接口

服务器接收HTTP请求对情报信息、指挥命令、文档列表、用户信息进行操作。

情报信息：

| HTTP方法 | 路径 | 功能 | 权限 |
|---|---|---|---|
| GET | /info | 获得情报列表 |  所有用户 | 
| GET | /info/_info_id_ | 获得情报详情 | 所有用户 |
| POST | /info | 发送情报 | 所有用户 | 
| POST | /info/_info\_id_ | 在情报中插入图片 | 情报所属用户 |
| DELETE | /info/_info\_id_ | 删除情报 | 情报所属用户、管理员 |
| GET | /info?userid=_userid_ | 按发布用户ID搜索情报 | 管理员 |
| GET | /info?keyword=_keyword_ | 按关键字搜索情报 | 管理员 |

指挥命令：

| HTTP方法 | 路径 | 功能 | 权限 |
|---|---|---|---|
| GET | /command?userid=_userid_ | 查看某个用户收到的命令 | 用户自己 | 
| POST | /command | 发送命令 | 所有用户 | 

文档列表：

| HTTP方法 | 路径 | 功能 | 权限 |
|---|---|---|---|
| GET | /doc/_class_/_subclass_/_doc\_name_ | 获得文档 | 所有用户、管理员 | 
| POST | /doc/_class_/_subclass_/_doc\_name_ | 新建文档 | 管理员 |
| PUT | /doc/_class_/_subclass_/_doc\_name_ | 更新文档 | 管理员 |
| DELETE | /doc/_class_/_subclass_/_doc\_name_ | 删除文档 | 管理员 |

用户：

| HTTP方法 | 路径 | 功能 | 权限 |
|---|---|---|---|
| GET | /user?level=_level_ | 按级别搜索用户 | 所有用户 |
| GET | /user?name=_name_ | 按姓名搜索用户 | 所有用户 | 
| GET | /user | 获得用户列表 | 管理员 |
| GET | /user?id=_userid_ | 按ID搜索用户 | 管理员 |
| POST | /user | 新增用户 | 管理员 | 
| PUT | /user/_userid_ | 编辑用户 | 管理员 | 
| PUT | /user/_userid_ | 修改密码 | 用户自己 | 
| DELETE | /user/_userid_ | 删除用户 | 管理员 | 

#### 检查用户名和密码

客户端向服务器URL `/user/check-password`发送HTTP请求，参数为`username`和`password`，例如：

```
/user/check-password?username=dog&password=123456
```

服务器返回JSON格式的数据，包含三个属性：status, errorcode和error。

status, errorcode和error的各项取值及含义：

| status取值 | errorcode取值 | error取值 | 含义 |
|----------|----------|----------|----------|  
| pass | 0 | no error | 无错误 |
| fail | 1 | empty username | 空用户名 | 
| fail | 2 | empty password | 空密码 |
| fail | 3 | user does not exist | 用户名不存在 | 
| fail | 4 | wrong password | 密码错误 |
| fail | 5 | database error | 数据库错误 |



