# How to switch to Ubuntu

## 1.网页测试

* 从官网上下载Node.js（version 4）的binary code，解压并添加`目录/bin`到环境变量。
    
* 安装MongoDB，步骤同Node.js，同样要添加环境变量。
    
    ```shell
    sudo vim /etc/profile
    
    +++ export PATH=/home/dell/Install Directory of node.js/bin:$PATH
    +++ export PATH=/home/dell/ID of MongoDB/bin:$PATH
    
    source /etc/profile
    ```

* 注意用户名和安装目录，添加完环境变量后，重新登陆用户dell即可。

* 现在可以按照server中的描述安装express、express-generator、设置数据库并运行起服务器。

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

* 编写shell脚本运行带参数的chrome浏览器

    ```
    newchrome.sh   
    #!/bin/sh
    /usr/bin/google-chrome --disable-web-security --allow-file-access-from-files --user-data-dir=/home/dell/ChromeData    
    ```  
    
    ```shell
    chmod +x newchrome.sh
    ```
    
    之后就可以使用`./newchrome.sh`来运行测试用的chrome浏览器

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