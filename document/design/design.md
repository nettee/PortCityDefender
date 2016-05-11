# 设计文档

### 接口

##### 检查用户名和密码

客户端向服务器URL `/user/check-password`发送HTTP请求，参数为`username`和`password`，例如：

```
/user/check-password?username=dog&password=123456
```

服务器返回JSON格式的数据，包含三个属性：status, errorcode和error。

status, errorcode和error的各项取值及含义：

| status取值 | errorcode取值 | error取值 | 含义 |
|----------|----------|----------|----------|  
| pass | 0 | no error | 无错误 |
| fail | 1 | user does not exist | 用户名不存在 | 
| fail | 2 | wrong password | 密码错误 |
| fail | 3 | database error | 数据库错误 |

