# Request proxy for hapydev

## 快速安装

- 调试模式安装

```
 git clone git@github.com:hapydev-team/hapydev-proxy.git
 cd hapydev-proxy
 npm install
 npm start
```
- Docker 方式安装
```
  docker pull hapydev/hapydev-proxy
  docker run -d -p 6003:6003 hapydev/hapydev-proxy
 ```



打开浏览器 http://ip:6003/
显示“hapydev 代理已启动!”即为安装成功
