# 总体架构设计

软件使用C/S架构，分为client端和server端。由于目前项目还在刚起步阶段，暂时准备在做出一个demo之后再考虑更细致的架构。目前计划做一个用户登录的demo：

client端要实现登录界面和用户主页，server端要连接上mongoDB数据库，数据库中存有用户名和密码信息。server端提供一个地址，接受HTTP请求；client端发送POST请求，参数为用户名和密码，server端收到请求后，访问数据库，判断用户名和密码是否正确，返回结果的JSON。client根据JSON的内容判断用户登录是否成功。

![demo architecture](img/demo-architecture.jpg)