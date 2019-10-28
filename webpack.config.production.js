const { resolve } = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  context: __dirname,
  entry: {
    main: "./src/main.tsx"
  },
  output: {
    path: resolve(__dirname, "public"),
    // publicPath: "docs/",
    filename: "[name].js"
  },
  mode: "production",
  optimization: {
    splitChunks: {
      chunks: "all"
    },
    runtimeChunk: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(__dirname, "src", "index.html"),
      filename: resolve(__dirname, "public", "index.html")
    }),
    new webpack.DefinePlugin({
      __NODE_ENV__: JSON.stringify("production")
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: resolve(__dirname, "src"),
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.js?$/,
        include: resolve(__dirname, "src"),
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        // exclude: /node_modules/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(jpg|png)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 2000
          }
        }
      },
      {
        test: /\.woff(2)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000,
              name: "./font/[hash].[ext]",
              mimetype: "application/font-woff"
            }
          }
        ]
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
              mimetype: "application/x-font-ttf"
            }
          }
        ]
      }
      // {
      //   test: /\.scss$/,
      //   exclude: /node_modules/,
      //   use: [
      //     "style-loader",
      //     "css-modules-typescript-loader?&localIndentName=[name]_[local]",
      //     // "css-loader?&importLoaders=1&localIdentName=[name]__[local]&url=false",
      //     {
      //       loader: "css-loader",
      //       options: {
      //         modules: true,
      //         // importLoaders: 1,
      //         // localIdentName: "[name]__[local]"
      //       }
      //     },
      //     "sass-loader"
      //   ]
      // }
    ]
  },
  // devtool: "source-map",
  resolve: {
    alias: {
      src: resolve(__dirname, "src")
    },
    extensions: [".ts", ".tsx", ".js", ".json", ".scss"]
  }
};
