# SetUp

### Install Nodejs

### Install express

```shell
npm install -g express
npm install -g express-generator
```

### Install MongoDB

在Linux环境下：

+ 安装MongoDB
+ 将安装目录下的/bin添加到环境变量

```Bash
export PATH=/home/dell/Software/node-4.4.4/bin:$PATH
export PATH=/home/dell/Software/mongodb-3.2.6/bin:$PATH
```

+ 新建文件夹~/data/MongoDB，存放数据库数据
+ 运行脚本start-mongodb.sh，启动MongoDB，注意命令运行后不会结束，不要终止进程
+ 访问 http://localhost:27017/ 检查MongoDB是否已经启动，如果看到一行字“It looks like you are trying to access MongoDB over HTTP on the native driver port.”，说明成功。
+ 现在可以关闭数据库服务器，每次服务器启动前，都会运行脚本自动打开数据库服务器

<!--
在Windows环境下：

+ 安装MongoDB
+ 将安装目录下的 \bin 添加到PATH环境变量
+ 新建文件夹 E:\MongoDB\data
+ 启动MongoDB，注意命令运行后不会结束，不要终止进程

```cmd
mongod --dbpath "E:\MongoDB\data"
```

+ 访问 http://localhost:27017/ 检查MongoDB是否已经启动，如果看到一行字“It looks like you are trying to access MongoDB over HTTP on the native driver port.”，说明成功。
+ 每次使用MongoDB之前都要启动MongoDB。如果想省去这个麻烦，可以将MongoDB添加到Windows服务：（但是我没有搞定）

```cmd
mongod --logpath "E:\MongoDB\data\logs.log" --logappend --dbpath "E:\MongoDB\data" --directoryperdb --serviceName "MongoDB" --serviceDisplayName "MongoDB" --install
```
-->

### Install npm modules

```shell
npm install
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
