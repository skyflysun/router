const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');


//__dirname 是webpack.config.js的所在位置；
//path.resolve是方法将相对路径转化为绝对路径,返回一个路径字符串；


function getLessVariables( ) {
    // console.log(this)

    let _filePath = path.resolve( __dirname,"../src/less/variable.less");
    var themeContent = fs.readFileSync( _filePath,'utf-8');
    var variables = {};
    themeContent.split('\n').forEach(function(item) {
        if (item.indexOf('//') > -1 || item.indexOf('/*') > -1) {
            return
        }
        var _pair = item.split(':');
        if (_pair.length < 2) return;
        var key = _pair[0].replace('\r', '').replace('@', '');
        if (!key) return;
        var value = _pair[1].replace(';', '').replace('\r', '').replace(/^\s+|\s+$/g, '');
        variables[key] = value;
    });
    return variables
}

//一个配置文件只能有一个module入口，多的只会执行最后一个
console.log( "../src/main.js" )
module.exports = {
    //多入口要想拆开输出，要以对象的形式输入，要是一数组的形式输入则会将其打包到一个文件夹下;
    entry: {
        //开发环境下不用打开babel垫片；
        // "babel-polyfill",
        // "es5-shim",
        app: "./src/main.js",

    },
    output: {
        filename: 'js/[name].js',
        // auxiliaryComment: "tianzheao",
        // chunkFilename:"asdfasd.js", //只有在异步请求的时候才有用，require.ensure()
        path: path.resolve(__dirname, "dist")
    },
    resolve: {
        alias: {
            "@":"src"
        }
    },
    mode: 'development',
    devtool: 'inline-source-map', //这里只是告诉webpack要开始sourceMap 模式，想要使用sourceMap还必须在loader中写入sourceMap文件；
    module: {
        rules: [
            {
                test: /\.less/,
                exclude: /node_modules/,
                // use: ExtractTextPlugin.extract({
                //     fallback: 'style-loader',
                    use: [
                        {
                            loader: 'style-loader',
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                                minimize: true
                            },
                        },
                        {
                            loader: 'less-loader',
                            options: {
                                sourceMap: true,
                                globalVars: getLessVariables( ),
                            }
                        }
                     ]
                // })
            },
            {
                test: /\.(html)$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        attrs: [':data-src']
                    }
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "es3ify-loader"
                    },
                    {
                        loader:  'babel-loader',
                        options: {
                            cacheDirectory: true,
                            presets: [
                                [
                                    "es2015",
                                    {
                                        "loose": true,
                                    }
                                ]
                            ],
                            // plugins: ["transform-es3-property-literals","transform-es3-member-expression-literals"]
                        }
                    }
                ]
            },
        ]
    },
    plugins: [
        //1.如果没有配置template参数的话将新生成一个页面，如果有则使用template的模板；
        //想要输出到指定文件加下可以在filename的添加路径
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            title:"tianzehao",
            template: "./src/index.html",
            filename: "index.html",
            inject: true
        }),
        //抽取css
        // new ExtractTextPlugin({
        //     filename:'css/[name].css',
        //     allChunks: true //深层次的查找到每个依赖js里面的css;利于抽取公共css,局部css不用抽取
        // }),
        // //清除dist目录；
        // new CleanWebpackPlugin(['dist']),
        // //压缩js 并开启支持ie8模式；
        // new UglifyJsPlugin({
        //     uglifyOptions: {
        //         ie8: true,
        //     }
        // }),
        // new webpack.NamedModulesPlugin(),

    ]
};



// module.exports = {
//     mode: 'development',
//     //多入口要想拆开输出，要以对象的形式输入，要是一数组的形式输入则会将其打包到一个文件夹下;
//     entry: {
//         tian: './js/asd/index.js',
//         ze:'./js/asd/index1.js',
//         hao:'./js/asd/index2.js',
//         asd:'./js/index3.js',
//         bsd :'./js/index4.js'
//     },
//     output: {
//         filename: '[name].js',
//         auxiliaryComment:"tianzheao",
//         chunkFilename:"asdfasd.js", //只有在异步请求的时候才有用，require.ensure()
//         path: path.resolve(__dirname,"tian") //这里只接受绝对路径
//     }
// };