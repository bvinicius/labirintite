/* eslint-disable no-undef */
const path = require("path");
const handler = require("serve-handler");
const http = require("http");

module.exports = () => {
  const port = 3000;
  const server = http.createServer((request, response) => {
    return handler(request, response);
  });

  server.listen(port, () => {
    console.log(`Running at http://localhost:${port}`);
  });

  return {
    entry: "./src/index.js",
    mode: "development",
    devtool: "inline-source-map",
    optimization: {
      minimize: false,
    },
    module: {
      rules: [
        {
          test: /\.(js)$/,
          exclude: /node_modules/,
          use: ["babel-loader"],
        },
      ],
    },
    resolve: {
      extensions: ["*", ".js"],
    },
    output: {
      filename: "main.js",
      path: path.resolve(__dirname, "dist"),
    },
  };
};
