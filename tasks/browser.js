/*
*
将浏览器同步相关的代码做成一个单独的任务是因为
多处引用该对象，会导致启动浏览器和监听浏览器不是同一个browser-sync对象。导致'浏览器启动成功，但是同步失败'的错误情况
*/


//引入第三方模块 
const browsersync = require('browser-sync').create();

//引入基础路径配置项 
const config = require('./config');

//配置 browser常量 
const browsersyncOpt = {
    server: {
        baseDir: config.distPath,
        index: 'html/index.html'
    },
    // open:true,  //是否自动打开浏览器-----default: true， https://browsersync.io/docs/options#option-open
    // notity:true  //浏览器中的小型弹出式通知-----default: true， (应该在配置 open选项的情况下使用。否则会报错)
}

function browserSyncInit(cb) {
    browsersync.init(browsersyncOpt)
    cb();
}

module.exports = {
    browserSyncObj: browsersync,
    browserSyncInit: browserSyncInit
}