### 介绍
本软件是在面向服务的分布式模型资源共享的基础上使用户能够在线使用SAGA GIS工具实现地学分析，避免集中式的建模与模拟环境带来的封闭性弊端，充分利用已有的模型资源，促进网络空间开放式地理建模与模拟理论与技术的发展，为地理研究者提供开放、高效的地理问题求解平台。

### 功能
- 栅格数据处理
- 矢量数据处理
- 气候相关数据计算
- 遥感影像处理
- 空间和地理统计
- 地形分析
- 模型输出数据可视化

### 项目须知：
#### 1、模型服务地址
> 地址：**172.21.212.75**
#### 2、启动项目：
##### debug模式：
> npm start
##### release模式：
> npm build/npm build:prod

#### 3、部署位置：
> 门户地址：**222.192.7.75**

> 路径：**E:\Tomcat\webapps\saga_theme**
##### 部署须知：
将 **src/config/api.config.ts** 文件下的 **backend: '/api'** 换为：**backend: '/saga_backend/api'**
>门户使用 nginx 拦截80端口请求：
```
location ^~ /saga_backend/api/ {
			proxy_pass http://127.0.0.1:9999/api/;
			proxy_redirect off;
			proxy_set_header X-Real-IP $remote_addr;
			proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
			proxy_set_header Host $http_host;
			proxy_set_header X-NginX-Proxy true;
		}
```
