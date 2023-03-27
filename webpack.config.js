const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
module.exports = {
  context: resolve(__dirname),
  entry: {
    main: "./src/main.tsx",
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    historyApiFallback: true,
    compress: true,
    port: 9000,
  },
  output: {
    path: resolve(__dirname, "./public"),
    publicPath: "/",
    filename: "[name].js",
  },
  mode: "development",
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(__dirname, "src", "index.html"),
      filename: resolve(__dirname, "public", "index.html"),
    }),
  ],
  devtool: "cheap-module-source-map",
  module: {
    rules: [
      {
        test: /\.(tsx|ts)$/,
        include: resolve(__dirname, "src"),
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.js?$/,
        include: resolve(__dirname, "src"),
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.(jpg|jpeg|png)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 25000,
          },
        },
      },
      {
        test: /\.css$/,
        // include: /node_modules/,
        // excl
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.woff(2)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000,
              name: "./font/[hash].[ext]",
              mimetype: "application/font-woff",
            },
          },
        ],
      },
      {
        test: /\.ttf$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000,
              name: "./font/[hash].[ext]",
              // mimetype: 'application/font-woff'
              mimetype: "application/x-font-ttf",
            },
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      src: resolve(__dirname, "src"),
    },
    extensions: [".ts", ".js", ".css", ".tsx", ".jpeg", ".png", ".jpg"],
  },
};
