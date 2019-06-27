/*
*
* gulp-rev插件可以将文件名修改为带有哈希码的文件名。
  但是引用静态资源的地方显示的还是之前的文件名，所以需要使用gulp-rev 插件的manifest 方法 搭配 gulp-rev-collector 插件 。来替换静态资源的引用文件名
*/

//引入gulp基础类任务 
const config = require('./config');

module.exports = {
    outPath: config.sourcePath + 'rev/',
    mergeOpt: {
        merge: true //合并manifest文件
    }
}