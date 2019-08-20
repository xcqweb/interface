const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin') // 复制静态资源的插件
const argv = require('yargs-parser')(process.argv.slice(2));
const mode = argv.mode || 'development';
const {VueLoaderPlugin} = require('vue-loader');
const isDev = mode === 'development';
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');//webpack内置的js压缩插件
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const postCssPlugin = require("autoprefixer")({overrideBrowserslist: [ "> 1%",
    "last 2 versions",
    "not ie <= 8"]})

// 清除dist文件
const CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {
    entry: ["babel-polyfill",'./src/main.js'], //入口文件，src下的main.js
    output: {
        path: path.join(__dirname, 'interface'), // 出口目录，dist文件
        publicPath: '',// 表示在引入静态资源时，从根路径开始引入,否则路由多层时候资源找不到
        filename: 'js/[name].[hash].js', //这里name就是打包出来的文件名
        chunkFilename: 'js/[name].js',//指定动态生成的Chunk在输出时的文件名称
    }, 
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            /*  {
                test: /mxClient\.js$/,
                use: {
                    loader: 'exports-loader?mxClient,mxGraphModel,mxActor,mxShape,mxEventObject,mxGraph,mxPrintPreview,mxEventSource,mxRectangle,mxVertexHandler,mxMouseEvent,mxGraphView,mxImage,mxGeometry,mxRubberband,mxKeyHandler,mxDragSource,mxUtils,mxWindow,mxEvent,mxCodec,mxCell,mxConstants,mxPoint,mxGraphHandler,mxCylinder,mxCellRenderer,mxUndoManager,mxResources,mxEditor'
                },
            },  */
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader'
                },
            },
            {
                test: /\.(js|vue)$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                options: {
                    formatter: require('eslint-friendly-formatter')
                },
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.(css)$/,
                use: [
                    {
                        loader:MiniCssExtractPlugin.loader,
                        options:{
                            publicPath: '../'
                        }
                    },
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [postCssPlugin]
                        }
                    },
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                exclude: [],
                options: {
                    limit: 5 * 1024,
                    name: 'images/[name].[hash:7].[ext]',
                }
            },
            {
                test: /\.(woff|woff2|ttf|eot)$/,
                exclude: [],
                use: [
                    {
                        loader: 'file-loader?name=fonts/[name].[hash:8].[ext]',
                    },
                ],
            }
        ]
    }, 
    plugins: [
        //new webpack.HotModuleReplacementPlugin(),//或者不添加插件，命令行里面添加hot参数
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true,
            favicon: path.resolve('./favicon.ico') // 增加
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: isDev ? 'css/[name].css' : 'css/[name].[hash].css',
            chunkFilename: isDev ? 'css/[id].css' : 'css/[name].[hash].css',
        }),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, 'static'),
                to: path.resolve(__dirname, 'interface/static'),
                ignore: ['.*']
            }
        ]),
    ],
    devServer: {
        contentBase: path.join(__dirname, "interface"), //打包输出文件根目录
        port: 8090, // 端口
        host: '0.0.0.0',
        historyApiFallback: true,//history 模式路由刷新 404 
        compress: true,
        disableHostCheck: true,
        watchOptions: {
            ignored: /node_modules/, //忽略不用监听变更的目录
            aggregateTimeout: 300, //防止重复保存频繁重新编译,n毫米内重复保存不打包
        },
        proxy: {
            "/api": {
                "target": "http://10.8.4.190:8001",
                "changeOrigin": true,
                "pathRewrite": {"^/api": ""}
            }
        },
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    name: 'vendor',
                    minChunks: 2,// 引入两次及以上被打包
                    // 可选 'initial | async | all'，
                    // 分别代表，初始化时加载、异步加载、两者皆使用
                    chunks: 'all', 
                    // 代表权重值，值越大，打包优先级越高
                    priority: 10 ,
                }
            }
        },
        runtimeChunk: {
            name: 'runtime'
        },
        minimizer: [
            new UglifyJsPlugin(), //会优化掉 .map文件
            new OptimizeCSSAssetsPlugin(),
        ],
    },
    devtool: '#source-map',
    resolve: {
        extensions: ['.js', '.jsx','.ts','.tsx', '.less','.json','.css','.vue'],
        alias: {
            '@': path.join(__dirname, 'src'),
            '@views': path.join(__dirname, 'src','views'), // ../views
            '@components': path.join(__dirname, 'src/components'),// ../../components or ../components,
        },
        modules: ['node_modules'],
    },
}