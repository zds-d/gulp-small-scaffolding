## 功能
 #### 本地开发环境下
+ 编译ejs模板
+ 清除HTML注释，压缩HTML(折叠空白区域)，压缩内联css
+ sass编译
+ 自动处理css代码中，浏览器前缀问题
+ es6代码编译
+ js文件的合并，压缩
+ 图片压缩与优化
+ html,css,js 文件的重命名
+ `css,js 文件 sourcemaps功能的开启`
+ `浏览器监听功能：自动开启，实时刷新`

 #### 生产环境下
+ 编译ejs模板
+ 清除HTML注释，压缩HTML(折叠空白区域)，压缩内联css
+ sass编译
+ 自动处理css代码中，浏览器前缀问题
+ es6代码编译
+ js文件的合并，压缩
+ 图片压缩与优化
+ html,css,js 文件的重命名
+ `项目部署缓存解决方案 （给静态资源文件名添加hash值，并且替换修改文件的最新引用地址）`

## 使用方式
```javascript
cnpm install    //安装 
npm run build:dev  //本地开发
npm run build:prod  //生产开发
```



