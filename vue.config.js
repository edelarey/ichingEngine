const { defineConfig } = require('@vue/cli-service');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = defineConfig({
  transpileDependencies: true,

    devServer: {
      historyApiFallback: true,
    },

  configureWebpack: {
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
        additionalData: `@import "@/assets/scss/app.scss"; @import "@/assets/scss/app.scss";`
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

    // public/index.html is the HtmlWebpackPlugin template. CopyWebpackPlugin
    // would also copy it into dist/, which webpack reports as:
    // "Conflict: Multiple assets emit different content to the same filename index.html"
    if (config.plugins.has('copy')) {
      config.plugin('copy').tap((args) => {
        const options = args[0] || {};
        const patterns = options.patterns || [];
        patterns.forEach((pattern) => {
          if (!pattern.globOptions) pattern.globOptions = {};
          const ignore = pattern.globOptions.ignore || [];
          pattern.globOptions.ignore = [...ignore, '**/index.html', 'index.html'];
        });
        return args;
      });
    }

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
          astronomia: {
            name: 'astronomia',
            test: /[\\/]node_modules[\\/]astronomia[\\/]/,
            chunks: 'async',
            priority: 20,
            enforce: true,
          },
        },
      });
    }
  },

});