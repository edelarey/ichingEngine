module.exports = {
    devServer: {
        allowedHosts: 'all',
        port: process.env.DEV_PORT || 8088,
    },

    chainWebpack: config => {
        config.plugins.delete('prefetch');
    },

    pwa: {
        name: 'i-ching-engine',
        themeColor: '#1141e1',
        msTileColor: '#000000',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'black',
        manifestFile: 'manifest.json',       
    },

    publicPath: '/',

    lintOnSave: false,
};
