const { defineConfig } = require('@vue/cli-service');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = defineConfig({
  transpileDependencies: true,

    devServer: {
      historyApiFallback: true,
    },

  // Configure Webpack
  configureWebpack: {
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash].css',
        chunkFilename: 'css/[id].[contenthash].css',
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  },

  // Customize CSS handling
  css: {
    extract: {
      ignoreOrder: true,
    },
    loaderOptions: {
      sass: {
        // Remove additionalData to avoid conflicts
      },
    },
  },

  // Chain Webpack for advanced customization
  chainWebpack: (config) => {
    config.module
      .rule('css')
      .oneOf('vue')
      .use('extract-css')
      .loader(MiniCssExtractPlugin.loader)
      .before('css-loader')
      .end();

    config.module
      .rule('scss')
      .oneOf('vue')
      .use('extract-css')
      .loader(MiniCssExtractPlugin.loader)
      .before('css-loader')
      .end();

      config.plugin('define').tap((args) => {
        args[0]['__VUE_PROD_HYDRATION_MISMATCH_DETAILS__'] = JSON.stringify(false);
        // args[0]['__VUE_OPTIONS_API__'] = JSON.stringify(false); // Set to false if you only use Composition API
        args[0]['__VUE_PROD_DEVTOOLS__'] = JSON.stringify(false);
        return args;
      });

    if (process.env.NODE_ENV === 'production') {
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.css$/,
            chunks: 'all',
            enforce: true,
          },
        },
      });
    }
  },

});