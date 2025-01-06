const path = require('path');

module.exports = {
  entry: './src/index.js',  // Main entry file for your application
  output: {
    filename: 'bundle.js',   // Output file where the bundled code will go
    path: path.resolve(__dirname, 'dist'),  // Output directory (dist is where Webpack will put the bundle)
  },
  mode: 'development',  // Set mode to 'development' for easier debugging
  devtool: 'inline-source-map',  // Source maps for debugging
};
