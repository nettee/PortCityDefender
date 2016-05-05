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

1. 安装MongoDB
2. 将C:\Program Files\MongoDB\Server\3.2\bin添加到PATH环境变量
3. 将MongoDB安装为Windows服务：

```cmd
mongod --logpath "E:\MongoDB\data\logs.log" --logappend --dbpath "E:\MongoDB\data" --directoryperdb --serviceName "MongoDB" --serviceDisplayName "MongoDB" --install
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
