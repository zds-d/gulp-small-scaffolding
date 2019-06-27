//引入gulp方法 
const {
    src,
    dest,
    series,
    watch
} = require('gulp');

//引入gulp第三方插件 
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const htmlmin = require('gulp-htmlmin');
const revCollector = require('gulp-rev-collector');

//引入gulp基础类任务 
const config = require('./config');
const browser = require('./browser');
const revOpt = require('./revOpt');


//配置 page任务 常量 
const htmlOpt = {
    inPath: config.sourcePath + 'pages/*.ejs',
    htmlminOpt: {
        removeComments: true, //清除HTML注释
        collapseWhitespace: true, //压缩HTML(折叠空白区域)
        minifyCSS: true, //压缩内联css （注意大小写后面三个字母都是大写）
    },
    outPath: config.distPath + 'html/',
    wathPath: config.sourcePath + 'pages/*.ejs',
}

function pageDev(cb) {
    src(htmlOpt.inPath)
        .pipe(ejs())
        .pipe(rename({
            extname: '.html'
        }))
        .pipe(dest(htmlOpt.outPath))
    watch(htmlOpt.wathPath, series(pageDev, browser.browserSyncObj.reload))
    cb();
}

function pageProd(cb) {
    src([revOpt.outPath + '*/*.json', htmlOpt.inPath])
        .pipe(revCollector({
            replaceReved: true
        }))
        .pipe(ejs())
        .pipe(rename({
            extname: '.html'
        }))
        .pipe(htmlmin(htmlOpt.htmlminOpt))
        .pipe(dest(htmlOpt.outPath))
    cb();
}


module.exports = {
    dev: pageDev,
    prod: pageProd
}