# How to test this client

## 1.网页测试

* 安装Node.js（version 4）并按照server的README成功运行server和MongoDB

* 安装cordova

```shell
  npm install -g cordova
```
    
* 安装ionic

```shell
  npm install -g ionic
```
	
* 进入client进行测试（ionic的`--lab`命令可以使web应用在浏览器上以手机屏幕大小的形式出现）

```shell
  cd client
  ionic serve --lab
```

由于Chrome默认禁用了本地文件访问，要使用Chrome进行测试，使用以下参数启动Chrome：
```
--disable-web-security --allow-file-access-from-files --user-data-dir=D:
```
注意`--user-data-dir`切勿设置为项目目录，因为Chrome会在这个文件夹下面新建一大堆奇怪的文件。

## 2.真机测试（Android平台）

### 配置Android开发环境

* 安装jdk，配置环境变量

* 安装Apache Ant，将“安装目录\bin”加入环境变量

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
