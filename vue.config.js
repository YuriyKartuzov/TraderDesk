const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')

module.exports = defineConfig({
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
      })
    ]
  },
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'https://paradigmapi.pythonanywhere.com',
        changeOrigin: true,
        pathRewrite: { '^/api': '/api' }
      }
    }
  }
})
