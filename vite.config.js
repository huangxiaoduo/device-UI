import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from '@vant/auto-import-resolver';
import AutoImport from 'unplugin-auto-import/vite'
import postcssPxToViewport from 'postcss-px-to-viewport-8-plugin';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    AutoImport({ // Auto import APIs on-demand for Vite, Webpack, Rspack, Rollup and esbuild. With TypeScript support
      imports: [ // global imports to register
        'vue',
        'vue-router',
        'pinia',
        // custom 
        {
          /*
          '@vueuse/core': [
            // named imports
            'useMouse', // import { useMouse } from '@vueuse/core',
            // alias
            ['useFetch', 'useMyFetch'], // import { useFetch as useMyFetch } from '@vueuse/core',
          ],
          */
          'axios': [
            // default imports
            ['default', 'axios'], // import { default as axios } from 'axios',
          ],
          /*
          '[package-name]': [
            '[import-names]',
            // alias
            ['[from]', '[alias]'],
          ]
          */
        }
      ],
      dts: true,
      dirs: ['./store', './network', './src/utils'],
      vueTemplate: false // 自动引入的变量等，是否在<template>中使用
    }),
    Components({
      dirs: ['./src/components'],
      dts: true,
      resolvers: [VantResolver()]
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    // 输入目录
    outDir: 'www/controllPage/html',
    // 设置最终构建的浏览器兼容目标
    target: 'es2015',
    // 构建后是否生成 source map 文件
    sourcemap: false,
    //  chunk 大小警告的限制（以 kbs 为单位）
    chunkSizeWarningLimit: 2000,
    // 启用/禁用 gzip 压缩大小报告
    reportCompressedSize: false,
    // 自定义底层的 Rollup 打包配置
    rollupOptions: {
      output: {
        // 指定 chunks 的入口文件模式
        entryFileNames: 'static/js/[name]-[hash].js',
        // 对代码分割中产生的 chunk 自定义命名
        chunkFileNames: 'static/js/[name]-[hash].js',
        // 自定义构建结果中的静态资源名称
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        // 压缩 Rollup 产生的额外代码
        compact: true,
        // 创建自定义的公共 chunk
        manualChunks: {
          vue: ['vue', 'vue-router', 'pinia'],
        },
      }
    }
  },
  css: {
    postcss: {
      plugins: [
        postcssPxToViewport ({
          unitToConvert: 'px',
          viewportWidth: 375,
          unitPrecision: 5, //单位转换后保留的精度
          propList: ['*'], // 能转化为vw的属性列表
          viewportUnit: 'vw', //希望使用的视口单位
          fontViewportUnit: 'vw', //字体使用的视口单位
          selectorBlackList: ['ignore-'], //需要忽略的CSS选择器，不会转为vw，使用原有的px等单位
          minPixelValue: 1, //设置最小的转换数值，如果为1的话，只有大于1的值会被转换
          mediaQuery: true, //媒体查询里的单位是否需要转换vw
          replace: true, //是否直接更换属性纸， 而不添加备用属性
          exclude: [], //忽略某些文件夹下的文件或特定文件，例如‘node_modules'下的文件
          include: [], //如果设置了include，那将只有匹配到的文件才会被转换
          landscape: false, //是否后添加根据landscapeWidth生成的媒体查询条件@media (orientation: landscape)
          landscapeUnit: 'vw', //横屏时使用的单位
          landscapeWidth: 1628 //横屏时使用的视口宽度
        })
      ]
    }
  }
})
