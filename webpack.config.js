const path = require("path");

module.exports = {
  //! 核心节点1：打包的入口，相对路径
  entry: "./src/main.js",

  //! 核心节点2: 打包的出口，绝对路径
  output: {
    // __dirname 表示当前文件所在的文件夹的绝对路径
    // path.resolve() 用于将路径或路径片段解析为一个绝对路径
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },

  //! 核心节点3: loader
  module: {
    rules: [
      //todo
    ],
  },

  //! 核心节点4: plugin
  plugins: [
    //todo
  ],

  //! 核心节点5: 模式
  mode: "development",
};
