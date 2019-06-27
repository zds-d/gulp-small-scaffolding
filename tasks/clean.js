//引入第三方模块 
const del = require('del');

//引入基础路径配置项 
const config = require('./config');

function clean(cb) {
    del([config.distPath + '*'])
    cb();
}

module.exports = clean;