const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: './src/index.js',  // Main entry file for your application
  output: {
    filename: 'bundle.js',   // Output file where the bundled code will go
    path: path.resolve(__dirname, 'dist'),  // Output directory (dist is where Webpack will put the bundle)
    clean: true,  // Clean the output directory before each build
  },
  mode: 'development',  // Set mode to 'development' for easier debugging
  devtool: 'inline-source-map',  // Source maps for debugging
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/template.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
