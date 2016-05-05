# How to run this server

### Install express

```shell
npm install -g express
npm install -g express-generator
```

### Install npm modules

```shell
npm install
```

### Install MongoDB

在Windows环境下：

+ 安装MongoDB
+ 将C:\Program Files\MongoDB\Server\3.2\bin添加到PATH环境变量
+ 启动MongoDB：

```cmd
mongod --dbpath "E:\MongoDB\data"
```

+ 访问http://localhost:27017/检查MongoDB是否已经启动，如果看到一行字“It looks like you are trying to access MongoDB over HTTP on the native driver port.”，说明成功。
+ 每次使用MongoDB之前都要启动MongoDB。如果想省去这个麻烦，可以将MongoDB添加到Windows服务：（但是我没有搞定）

```cmd
mongod --logpath "E:\MongoDB\data\logs.log" --logappend --dbpath "E:\MongoDB\data" --directoryperdb --serviceName "MongoDB" --serviceDisplayName "MongoDB" --install
```

### 初始化MongoDB数据库

+ 运行mongo.exe
+ 添加数据库port_city_defender：

```cmd
use port_city_defender
```

+ 插入用户名、密码数据：

```cmd
db.users.insert({"username": "dog", "password": "123456"})
```



### Start server

```shell
npm start
```

Server运行在localhost:3000

# 测试GET与POST请求

+ 测试GET请求

  访问 /test/get

+ 测试带参数的GET请求

  访问 /test/paramget

+ 测试POST请求

  访问 /test/post

  **注意：POST请求body的格式应为x-www-form-urlencoded**，即与网页表单得到的POST请求一致
