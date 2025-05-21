const path = require("path");
const ESLintPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  //! 核心节点1：打包的入口，相对路径
  entry: "./src/main.js",

  //! 核心节点2: 打包的出口，绝对路径
  output: {
    path: undefined, // 开发环境下，没在硬盘中构建产物，不需要输出路径
    filename: "static/js/main.js",
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
        loader: "babel-loader",
      },
    ],
  },

  //! 核心节点4: plugin
  plugins: [
    // ESLint 监查
    new ESLintPlugin({
      // 监查指定路径下的文件
      context: path.resolve(__dirname, "../src"),
    }),
    // HtmlWebpackPlugin
    new HtmlWebpackPlugin({
      // 以 public/index.html 为模板创建文件
      // 新的 html 文件会替换旧的
      template: path.resolve(__dirname, "../public/index.html"),
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
};
