const path = require( 'path' );
const webpack = require( 'webpack' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );

// Set different CSS extraction for editor only and common block styles
const gtBlocksCSSPlugin = new ExtractTextPlugin( {
  filename: '../css/gt-blocks.css',
} );
const gtBlocksEditorCSSPlugin = new ExtractTextPlugin( {
  filename: '../css/gt-blocks-editor.css',
} );

// Configuration for the ExtractTextPlugin.
const extractConfig = {
  use: [
    { loader: 'raw-loader' },
    {
      loader: 'postcss-loader',
      options: {
        plugins: [ require( 'autoprefixer' ) ],
      },
    },
    {
      loader: 'sass-loader',
      query: {
        outputStyle:
          'production' === process.env.NODE_ENV ? 'compressed' : 'nested',
      },
    },
  ],
};

module.exports = {
  entry: {
    './assets/js/gt-blocks-editor' : './blocks/index.js',
    // './assets/js/gt-blocks-frontend' : './blocks/frontend.js',
  },
  output: {
    path: path.resolve( __dirname ),
    filename: '[name].js',
  },
  watch: true,
  devtool: 'cheap-eval-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /style\.s?css$/,
        use: gtBlocksCSSPlugin.extract( extractConfig ),
      },
      {
        test: /editor\.s?css$/,
        use: gtBlocksEditorCSSPlugin.extract( extractConfig ),
      },
    ],
  },
  plugins: [
    gtBlocksCSSPlugin,
    gtBlocksEditorCSSPlugin,
  ],
};
