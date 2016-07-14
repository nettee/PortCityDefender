# 0.Setup

### Node.js

请参照server目录下的README进行安装

### 数据库与服务器

无需配置。正常情况下，服务器应该运行在<某个云服务器地址>。如果你想手动运行服务器，请参考server目录下的README

### 安装cordova和ionic

```shell
npm install -g cordova
npm install -g ionic
```

# 1.网页测试

### 安装chrome

```shell
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
```

下载好deb包后，双击打开安装。

### 启动ionic并在浏览器中运行

```shell
./start.sh
```

浏览器刚启动时可能会“页面无法显示”，等待页面重新加载或手动刷新即可。

# 2.真机测试（Android平台）

### 配置Android开发环境

* 安装jdk，配置环境变量

* 安装Apache Ant，将“安装目录/bin”加入环境变量

* 安装andoid sdk
  * 安装Android SDK，启动SDK Manager，下载"android sdk platform-tools"，"android sdk build-tools"和"Android 6.0 sdk"
  * 如果在EXTRA目录下有"Android Support Repository"，一定要下载
  * 配置tools和platform-tools的环境变量

### 手机测试

* 配置android环境

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

# 3.真机测试（ios平台）

### 配置ios开发工具Xcode

### 在client中添加ios平台，其余与android平台步骤相同
