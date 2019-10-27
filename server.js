const express = require("express");
const app = express();
const path = require("path");

// Webpack for dev use
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const config = require("./webpack.config.js");
const compiler = webpack(config);

const middleware = webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  contentBase: "public"
});
app.use(middleware);
// app.use(express.static("./public"));

app.use(express.static(path.join(__dirname, "public/")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(8080, () => console.log("listening on 3003"));
