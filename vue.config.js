module.exports = {
  filenameHashing: false,
  // webpack配置
  devServer: {
    open: true,
    host: "localhost",
    port: 8200,
    proxy: {
      '/api': {
        target: 'http://localhost:8006',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'          
        }
      }
    },
  },
}
