修改 react_demo/src/socket/index.js 里面的 ip 修改为你的 ip 或者 域名
'/socket' 是服务端的接口地址，这个如果改了也需要在 websocket/src/router/socketRouter/index.js 修改get方法的地址



修改完后 执行 yarn install 安装依赖 并 yarn build 打包，将打包后build文件夹下的所有文件，复制到 websocket/dist 文件夹下面，dist文件夹需要自己手动新建



最后进入到websocket目录下，执行 npm start 或 node ./src/app.js 然后浏览器访问你的 ip+8083 或 http://localhost:8083 即可