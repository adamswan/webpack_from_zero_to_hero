const path = require("path");
const ESLintPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
const { getCPUThread } = require("./utils_config");

module.exports = {
  //! 核心节点1：打包的入口，相对路径
  entry: "./src/main.js",

  //! 核心节点2: 打包的出口，绝对路径
  output: {
    path: undefined, // 开发环境下，没在硬盘中构建产物，不需要输出路径
    filename: "static/js/[name].js", // 入口文件打包后的名字
    chunkFilename: "static/js/[name].chunk.js", // 其他文件打包后的名字
  },

  //! 核心节点3: loader
  module: {
    rules: [
      // 处理 .css 文件
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      // 处理 .less 文件
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      // 处理图片文件
      {
        test: /\.(png|jpg|jpeg|gif|webp|svg)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            // 如果图片大小小于 10kb，则使用 base64 编码
            maxSize: 10 * 1024,
          },
        },
        generator: {
          // 输出图片的路径
          filename: "static/images/[hash:10][ext][query]",
        },
      },
      // babel
      {
        test: /\.js$/,
        exclude: /node_modules/, // 排除 node_modules 目录下文件
        use: [
          {
            loader: "thread-loader",
            options: {
              workers: getCPUThread(), // 开启几个线程
            },
          },
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true, // 开启 babel 缓存
              cacheCompression: false,
            },
          },
        ],
      },
    ],
  },

  //! 核心节点4: plugin
  plugins: [
    // ESLint 监查
    new ESLintPlugin({
      // 监查指定路径下的文件
      context: path.resolve(__dirname, "../src"),
      cache: true, // 开启 ESLint 缓存
      cacheLocation: path.resolve(__dirname, "../node_modules/.cache/.eslintcache"),
    }),

    // HtmlWebpackPlugin
    new HtmlWebpackPlugin({
      // 以 public/index.html 为模板创建文件
      // 新的 html 文件会替换旧的
      template: path.resolve(__dirname, "../public/index.html"),
    }),

    // PWA
    // 测试时，需要装另一个测试用的包（pnpm i serve -g）, 否则serviceWorker注册会失败
    // 执行指令： serve dist ,就会在以 dist 为根目录启动一个服务
    new WorkboxWebpackPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],

  //! 核心节点5: 模式
  mode: "development",

  // 开发服务器
  devServer: {
    host: "localhost",
    port: 3000,
    open: true,
    hot: true,
  },

  devtool: "cheap-module-source-map",
};
