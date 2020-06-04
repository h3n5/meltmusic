const target = 'http://localhost:3000/'
const path = require('path')
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/music/' : '/',
  devServer: {
    port: 4000,
    proxy: {
      '/api': {
        target: target,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  },
  chainWebpack: config => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)))
    const svgRule = config.module.rule('svg')

    svgRule.uses.clear()

    svgRule.use('vue-svg-loader').loader('vue-svg-loader')
  }
}
function addStyleResource(rule) {
  rule
    .use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [path.resolve(__dirname, './src/assets/css/global.less')]
    })
}
