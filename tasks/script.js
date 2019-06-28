//引入gulp方法 
const {
    src,
    dest,
    series,
    watch
} = require('gulp');

//引入gulp第三方插件 
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');

//需要安装@babel/core ,@babel/preset-env 2个模块才可以正常使用(https://github.com/babel/gulp-babel)   
/* 
    之前使用的版本是
        "@babel/core": "^7.4.5",
        "@babel/preset-env": "^7.4.5",
    出现了任务可以正常运行，结束，但是没有输出文件的错误。
    降低为 7.4.3 以后可以正常运行。
 */
const babel = require('gulp-babel');

// const jshint = require('gulp-jshint');
const rename = require('gulp-rename');
const rev = require('gulp-rev');
const revCollector = require('gulp-rev-collector');

//引入gulp基础类任务 
const config = require('./config');
const browser = require('./browser');
const revOpt = require('./revOpt');

//配置 script任务 常量 
const jsOpt = {
    inPath: config.sourcePath + 'scripts/*.js',
    babelOpt: {
        presets: ['@babel/preset-env']
    },
    jshintOpt: {
        "asi": true //不对缺少分号的情况提出警告
    },
    outPath: config.distPath + 'js/',
    wathPath: config.sourcePath + 'scripts/*.js',
    revOutPath: revOpt.outPath + 'js/',
}

function scriptDev(cb) {
    src(jsOpt.inPath, {
            sourcemaps: true
        })
        .pipe(babel(jsOpt.babelOpt)) //编译
        // .pipe(jshint(jsOpt.jshintOpt)) //代码检查
        .pipe(concat('all.js')) //合并

        .pipe(uglify()) //压缩
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(dest(jsOpt.outPath, {
            sourcemaps: '.'
        }))
    watch(jsOpt.wathPath, series(scriptDev, browser.browserSyncObj.reload))
    cb();
}

function scriptProd() {
    return src([jsOpt.revOutPath + '*.json', jsOpt.inPath])
        .pipe(revCollector({
            replaceReved: true
        }))
        .pipe(babel(jsOpt.babelOpt)) //编译
        // .pipe(jshint(jsOpt.jshintOpt)) //代码检查
        .pipe(concat('all.js')) //合并

        .pipe(uglify()) //压缩
        .pipe(rename({
            extname: '.min.js'
        }))

        //在文件名后面,添加哈希码，来确保将文件设置为永不过期，以保证用户获取最新的静态资源文件。(静态资源文件的内容修改以后哈希码才会修改)
        .pipe(rev())
        .pipe(dest(jsOpt.outPath))

        //生成哈希文件名和原文件名对应的manifest文件
        .pipe(rev.manifest(revOpt.manifestOpt))
        .pipe(dest(jsOpt.revOutPath))
}


module.exports = {
    dev: scriptDev,
    prod: scriptProd
}