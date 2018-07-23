const path = require('path');
const webpack = require('webpack');
const opn = require("opn");
// 服务器框架
const express = require('express');
const config = require('./webpack.config.js');


Object.keys(config.entry).forEach(function (name) {
    config.entry[name] = ['./build/dev-client'].concat(config.entry[name]);
});


//开启服务器；
const app = express();
const compiler = webpack(config);

//热更新；
const devMiddleware = require('webpack-dev-middleware')(compiler, {
    quiet: true,
    hot: true,
});

//
const hotMiddleware = require('webpack-hot-middleware')(compiler,{
    log: false,
    heartbeat: 2000
});

//使用的是本地的静态资源也不能做到刷新；因此无用；
// app.use(express.static(path.join(__dirname, 'dist')));

app.use( hotMiddleware );
app.use( devMiddleware );

devMiddleware.waitUntilValid(() => {
    var uri = 'http://localhost:4000';
    //自动打开浏览器；
    opn(uri);
    app.listen("4000")
});

// 启动服务
app.listen("4000", '0.0.0.0', (err) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(' start server at port ' +'4000');
});



//开发环境下的webpack 配置完成