module.exports = {
  getStyleLoader(MiniCssExtractPlugin, type = ".css") {
    switch (type) {
      case ".css":
        return [
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
        ];
      case ".less":
        return [
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
        ];
    }
  },
};
