# How to switch to Ubuntu

## 1.网页测试

* 数据库与服务器：无需安装。正常情况下，服务器应该运行在<某个云服务器地址>。如果你想手动运行服务器，请参考server目录下的README

* 安装cordova和ionic

    ```shell
    npm install -g cordova
    
    npm install -g ionic
    ```

* 由于firefox也不支持本地ajax请求，所以我们要安装chrome

    ```shell
    wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
    ```

* 获得chrome安装包后，双击安装。

* 启动测试用的chrome浏览器

```Bash
./newchrome.sh
```

## 2.真机测试（Android）

* 安装`Java`，下载JDK1.8，解压并添加`ID/bin`到环境变量

* 下载`apache-ant`，添加环境变量

* 安装`Android SDK`，启动SDK Manager，下载`android sdk platform-tools`和`android sdk build-tools`和`Android 6.0 sdk`，如果在EXTRA目录下有`Android Support Repository`，一定要下载，之后配置环境变量

* 配置环境变量有很多种方法

    ```shell
    sudo vim /etc/profile
    
    +++ export PATH=/home/dell/ID of JAVA/bin:$PATH
    +++ export PATH=/home/dell/ID of apache-ant/bin:$PATH
	+++ export PATH=/home/dell/ID of android sdk/tools:$PATH
	+++ export PATH=/home/dell/ID of android sdk/platform-tools:$PATH
    
    source /etc/profile
    ```
* 一般的我们用的是64位系统，所以要支持Android SDK需要安装32位支持库

	```shell
	sudo apt-get install -y libc6-i386 lib32stdc++6 lib32gcc1 lib32ncurses5 lib32z1
	```
* 现在可以进入项目的**client**部分，使用usb线将手机连至电脑，开启**调试模式**

	```
	ionic platform add android
	ionic build android
	ionic run android
	```

	即可将应用安装至手机上
