const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  module: {
    rules: [
      // Aturan untuk Babel (JavaScript modern)
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        ],
      },
      // Aturan untuk CSS (INI YANG KURANG SEBELUMNYA)
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // Ekstrak CSS jadi file terpisah
          'css-loader', // Baca import CSS
        ],
      },
    ],
  },
  plugins: [
    // Plugin untuk menghasilkan file CSS fisik
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    // Plugin PWA Service Worker
    new WorkboxWebpackPlugin.InjectManifest({
      swSrc: path.resolve(__dirname, 'src/scripts/sw.js'),
      swDest: 'sw.js',
    }),
  ],
});