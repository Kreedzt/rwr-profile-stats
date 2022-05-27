# RWR 存档查询系统部署流程

该项目仅为前端, 部署时依赖后端, 后端部署见 [RWR存档管理服务](https://github.com/Kreedzt/rwr-profile-server)

## 部署方式

以下部署方式二选一即可

- 手动部署
- Docker 部署(若选择 Docker 部署, 服务端也需要选择 Docker 部署)

### 手动部署

#### 准备工作
> 手动部署需要一个 web 服务器来挂载, 如: NGINX
> 以下操作以 NGINX 为例

编写 nginx.conf 文件, 内容如下所示:


复制一份本项目根目录的 `mime.types` 文件, 放置到与 `nginx.conf` 文件同位置

#### 启动 NGINX

进入 NGINX 目录, 使用如下命令读配置启动

```sh
# -c 后面跟上面编写的 nginx.conf 文件路径
nginx -c ../nginx.conf
```

#### 部署及更新

> 更新时无需重启 NGINX

将下载好的 [压缩包](https://github.com/Kreedzt/rwr-profile-stats/releases) 解压到上述步骤的路径中即可

启动完成后, 通过 80 端口即可访问

### Docker 部署

暴露端口为 80

需要设置网络, 容器内变量为 `rwr-profile-server` 
- 可通过 --link 参数直接绑定容器(仅限一对一容器链接)
- 也可通过 `docker network` 来创建一个子网(多容器互联)

#### 使用 link

`--link` 参数使用说明:
```text
目标容器名称:本容器内变量
```

启动示例:
```sh
docker run --name rwr-profile-stats-docker -p 9292:80 --link rwr-profile-server-docker:rwr-profile-server -d zhaozisong0/rwr-profile-stats
```

以上表明已启动 `rwr-profile-server-docker` 容器名, 启动本容器时加入到 `rwr-profile-server-docker` 网络中

启动完成后, 通过映射的 9292 端口即可访问网页

更新时操作同上

#### 使用子网

1. 创建一个子网:

```bash
docker network create -d bridge rwr-profile-network
```

2. 首先将后端启动并子网(注意顺序)

使用 `--network` 参数

```bash
docker run --name rwr-profile-server -p 8181:8080 -v $PWD/data:/app/data -v $PWD/profiles:/app/profiles -v $PWD/logs:/app/logs -v $PWD/upload_temp:/app/upload_temp --network  rwr-profile-network -d rwr-profile-server
```

3. 其次将本容器启动并加入子网

```bash
docker run --name rwr-profile-stats-docker -p 9292:80 --network rwr-profile-network -d rwr-profile-stats
```

启动完成后, 通过映射的 9292 端口即可访问网页
