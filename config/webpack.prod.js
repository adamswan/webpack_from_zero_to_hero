const path = require("path");
const ESLintPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  //! 核心节点1：打包的入口，相对路径
  entry: "./src/main.js",

  //! 核心节点2: 打包的出口，绝对路径
  output: {
    // __dirname 表示当前文件所在的文件夹的绝对路径
    // path.resolve() 用于将路径或路径片段解析为一个绝对路径
    path: path.resolve(__dirname, "../dist"),
    filename: "static/js/main.js",
    clean: true, // 每次打包时，自动清空 dist 目录
  },

  //! 核心节点3: loader
  module: {
    rules: [
      // 处理 .css 文件
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          // 在变成css之前使用postcss
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  "postcss-preset-env", //能解决大多数css兼容性问题
                ],
              },
            },
          },
        ],
      },
      // 处理 .less 文件
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  "postcss-preset-env", //能解决大多数css兼容性问题
                ],
              },
            },
          },
          "less-loader",
        ],
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
    // MiniCssExtractPlugin
    new MiniCssExtractPlugin({
      // 输出 css 文件的路径
      filename: "static/css/main.css",
    }),
  ],

  //! 核心节点5: 模式
  mode: "production",
};
