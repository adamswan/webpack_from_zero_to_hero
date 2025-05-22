const path = require("path");
const ESLintPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TersererPlugin = require("terser-webpack-plugin");
// const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
const { getStyleLoader, getCPUThread } = require("./utils_config");

module.exports = {
  //! 核心节点1：打包的入口，相对路径
  entry: "./src/main.js",

  //! 核心节点2: 打包的出口，绝对路径
  output: {
    // __dirname 表示当前文件所在的文件夹的绝对路径
    // path.resolve() 用于将路径或路径片段解析为一个绝对路径
    path: path.resolve(__dirname, "../dist"),
    filename: "static/js/[name].js", // 入口文件打包后的名字
    chunkFilename: "static/js/[name].chunk.js", // 其他文件打包后的名字
    clean: true, // 每次打包时，自动清空 dist 目录
  },

  //! 核心节点3: loader
  module: {
    rules: [
      // 处理 .css 文件
      {
        test: /\.css$/,
        use: getStyleLoader(MiniCssExtractPlugin, ".css"),
      },
      // 处理 .less 文件
      {
        test: /\.less$/,
        use: getStyleLoader(MiniCssExtractPlugin, ".less"),
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

    // .css 文件抽取出来，用<link>引入.html
    new MiniCssExtractPlugin({
      // 输出 css 文件的路径
      filename: "static/css/[name].css",
    }),

    // 资源预加载
    new PreloadWebpackPlugin({
      rel: "preload",
      as: "script",
    }),

    // PWA
    // 测试时，需要装另一个测试用的包（pnpm i serve -g）, 否则serviceWorker注册会失败
    // 执行指令： serve dist ,就会在以 dist 为根目录启动一个服务
    new WorkboxWebpackPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],

  // 压缩相关配置
  optimization: {
    minimize: true,
    minimizer: [
      // 压缩 .css 文件
      new CssMinimizerPlugin(),

      // 压缩 .js 文件
      new TersererPlugin({
        parallel: getCPUThread(), // 开启多线程
      }),

      // 压缩图片
      // new ImageMinimizerPlugin({
      //   minimizer: {
      //     implementation: ImageMinimizerPlugin.imageminGenerate,
      //     options: {
      //       plugins: [
      //         // ["gifsicle", { interlaced: true }],
      //         ["jpegtran", { progressive: true }],
      //         ["optipng", { optimizationLevel: 5 }],
      //         [
      //           "svgo",
      //           {
      //             plugins: [
      //               "preset-default",
      //               "prefixIds",
      //               {
      //                 name: "sortAttrs",
      //                 params: {
      //                   xmlnsOrder: "alphabetical",
      //                 },
      //               },
      //             ],
      //           },
      //         ],
      //       ],
      //     },
      //   },
      // }),
    ],
    // 分包
    splitChunks: {
      chunks: "all", // 对所有 chunk 分组进行优化（同步 + 异步）
      cacheGroups: {
        // 默认缓存组：将 node_modules 中的模块单独打包成 vendors.js
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          filename: "static/js/vendors.js",
          priority: -10, // 权重值越低优先级越高
        },
        // 将重复引用的模块打包成 common.js
        common: {
          minChunks: 2, // 最少被引用次数
          filename: "static/js/common.js",
          priority: -20,
        },
      },
    },
  },

  //! 核心节点5: 模式
  mode: "production",

  // 开启SourceMap
  devtool: "source-map",
};
