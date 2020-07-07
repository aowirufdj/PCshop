const isProduction = process.env.NODE_ENV !== 'development'
const { SkeletonPlugin } = require('page-skeleton-webpack-plugin')
const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const publicPath = '/'
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
module.exports = {
  publicPath,//vue-cli3.3+新版本使用
  //输出文件目录
  outputDir: 'dist',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: true,
  devServer: {
    publicPath,
    // proxy: {
    //   '/cover/': {
    //     target: 'https://amandacat.shop/',
    //     ws: true,
    //     changeOrigin:true,//允许跨域
    //     // pathRewrite: {
    //     //   '^/api': '/api'
    //     // }
    //   }
    // }
  },
  // css: {
  //   extract: true, // css拆分ExtractTextPlugin插件，默认true - 骨架屏需要为true
  // },
  configureWebpack:{
    // 骨架屏配置
    plugins: [
      new SkeletonPlugin({
        pathname: path.resolve(__dirname, './shell'), // 用来存储 shell 文件的地址
        staticDir: path.resolve(__dirname, './dist'), // 最好和 `output.path` 相同
        routes: ['/','/article','/items'], // 将需要生成骨架屏的路由添加到数组中
      }),
      
      
      
      // new UglifyJsPlugin({
      //   uglifyOptions: {
      //     //生产环境自动删除console
      //     compress: {
      //       drop_debugger: true,
      //       drop_console: true,
      //       pure_funcs: ['console.log']
      //     }
      //   },
      //   sourceMap: false,
      //   parallel: true
      // }),
    ],
    module:{
      rules: [
        {
          test: /\.m?js$/,
          //exclude用下面配置的话，默认是过滤不编译node_modules 路径下的文件
          exclude: /(node_modules|bower_components)/,
          //include 指定需要编译的文件路径
          include: [
            resolve('src'),
            // resolve('node_modules/tree-table-vue/lib'),
            // resolve('node_modules/v-org-tree/dist'),
            // resolve('node_modules/iview/src/locale')
          ],
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    }
    // 公共代码抽离
    // optimization :{
    //   splitChunks: {
    //     cacheGroups: {
    //       vendor: {
    //         chunks: 'all',
    //         test: /node_modules/,
    //         name: 'vendor',
    //         minChunks: 1,
    //         maxInitialRequests: 5,
    //         minSize: 0,
    //         priority: 100
    //       },
    //       common: {
    //         chunks: 'all',
    //         test: /[\\/]src[\\/]js[\\/]/,
    //         name: 'common',
    //         minChunks: 2,
    //         maxInitialRequests: 5,
    //         minSize: 0,
    //         priority: 60
    //       },
    //       styles: {
    //         name: 'styles',
    //         test: /\.(sa|sc|c)ss$/,
    //         chunks: 'all',
    //         enforce: true
    //       },
    //       runtimeChunk: {
    //         name: 'manifest'
    //       }
    //     }
    //   }
    // }
  
    // 公共文件抽离
   // optimization: {
   //   splitChunks: {
   //     cacheGroups: {
   //       vendor:{
   //         chunks:"all",
   //         test: /node_modules/,
   //         name:"vendor",
   //         minChunks: 1,
   //         maxInitialRequests: 10,
   //         minSize: 0,
   //         priority:100,
   //       },
   //       common: {
   //         chunks:"all",
   //         test:/[\\/]src[\\/]js[\\/]/,
   //         name: "common",
   //         minChunks: 2,
   //         maxInitialRequests: 10,
   //         minSize: 0,
   //         priority:60
   //       },
   //       styles: {
   //         name: 'styles',
   //         test: /\.(sa|sc|c)ss$/,
   //         chunks: 'all',
   //         enforce: true,
   //       },
   //       runtimeChunk: {
   //         name: 'manifest'
   //       }
   //     }
   //   }
   // }
  },
  
  chainWebpack: (config) => {   // 解决vue-cli3脚手架创建的项目压缩html 干掉<!-- shell -->导致骨架屏不生效
    if (process.env.NODE_ENV !== 'development') {
      config.plugin('html').tap(opts => {
        opts[0].minify.removeComments = false
        return opts
      })
      // // 移除 prefetch 插件
      // config.plugins.delete("prefetch");
      // // 移除 preload 插件
      // config.plugins.delete('preload');
      // // 压缩代码
      // config.optimization.minimize(true);
      // // 分割代码
      // config.optimization.splitChunks({
      //   chunks: 'all'
      // })
    }
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
    
  },
  // css: {
  //   // 是否使用css分离插件 ExtractTextPlugin
  //   extract: true,
  //   // 开启 CSS source maps?
  //   sourceMap: false,
  //   // css预设器配置项
  //   loaderOptions: {},
  //   // 启用 CSS modules for all css / pre-processor files.
  //   modules: false
  // },

  //放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  assetsDir: 'static',
  //以多页模式构建应用程序。
  pages: undefined,
  //是否使用包含运行时编译器的 Vue 构建版本
  runtimeCompiler: false,
  //生产环境是否生成 sourceMap 文件，一般情况不建议打开
  productionSourceMap: false,
  // webpack配置
  //对内部的 webpack 配置进行更细粒度的修改 https://github.com/neutrinojs/webpack-chain see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  //调整 webpack 配置 https://cli.vuejs.org/zh/guide/webpack.html#%E7%AE%80%E5%8D%95%E7%9A%84%E9%85%8D%E7%BD%AE%E6%96%B9%E5%BC%8F
  // css:{requireModuleExtension : true},
  // webpack-dev-server 相关配置 https://webpack.js.org/configuration/dev-server/
  
  // 第三方插件配置 https://www.npmjs.com/package/vue-cli-plugin-style-resources-loader
  pluginOptions: {
    i18n: {
      locale: 'cn',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true
    }
  }
};
