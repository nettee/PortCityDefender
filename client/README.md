# Setup

## 1.网页测试

* 安装Node.js（version 4）并按照server的README成功运行server和MongoDB

* 安装cordova，ionic

```shell
npm install -g cordova
npm install -g ionic
```

* 启动ionic并在浏览器中运行

```shell
./start.sh
```

浏览器刚启动时可能会“页面无法显示”，等待页面重新加载或手动刷新即可。

## 2.真机测试（Android平台）

### 配置Android开发环境

* 安装jdk，配置环境变量

* 安装Apache Ant，将“安装目录/bin”加入环境变量

* 安装andoid sdk（android sdk platform-tools、android sdk build-tools、Android 6.0 sdk、Android Support Library），配置tools和platform-tools的环境变量

### 手机测试

* 进入client，配置android环境

```shell
cd client

ionic platform add android

ionic build android
```
    
* 拿出手机，用usb线连接PC，打开usb调试

```shell
ionic run android
```

* 客户端会自动安装到手机上

## 3.真机测试（ios平台）

### 配置ios开发工具Xcode

### 在client中添加ios平台，其余与android平台步骤相同
