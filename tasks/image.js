//引入gulp方法 
const {
    src,
    dest,
    series,
    watch,
    lastRun
} = require('gulp');

//引入gulp第三方插件 
const rev = require('gulp-rev');
const imagemin = require('gulp-imagemin');

//引入gulp基础类任务 
const config = require('./config');
const browser = require('./browser');
const revOpt = require('./revOpt');

//配置 image任务 常量 
const imgOpt = {
    inPath: config.sourcePath + 'images/*',
    imageminOPt: [
        imagemin.gifsicle({
            interlaced: true //隔行扫描gif进行渲染
        }),
        imagemin.jpegtran({
            progressive: true //无损压缩jpg图片
        }),
        imagemin.optipng({
            optimizationLevel: 5 //对png图片的优化级别
        }),
        imagemin.svgo({
            plugins: [{
                    removeViewBox: true //移除svg的viewbox属性
                },
                {
                    cleanupIDs: false //不删除未使用的和缩小使用的ID
                }
            ]
        })
    ],
    outPath: config.distPath + 'img/',
    wathPath: config.sourcePath + 'images/*',
    revOutPath: revOpt.outPath + 'img/',
}

function imageDev(cb) {
    src(imgOpt.inPath, {
            since: lastRun(imageDev)
        })
        .pipe(imagemin(imgOpt.imageminOPt))
        .pipe(dest(imgOpt.outPath))
    watch(imgOpt.wathPath, series(imageDev, browser.browserSyncObj.reload))
    cb();
}

function imageProd(cb) {
    src(imgOpt.inPath, {
            since: lastRun(imageProd)
        })
        .pipe(imagemin(imgOpt.imageminOPt))

        //在文件名后面,添加哈希码，来确保将文件设置为永不过期，以保证用户获取最新的静态资源文件。(静态资源文件的内容修改以后哈希码才会修改)
        .pipe(rev())
        .pipe(dest(imgOpt.outPath))

        //生成哈希文件名和原文件名对应的manifest文件
        .pipe(rev.manifest(revOpt.manifestOpt))
        .pipe(dest(imgOpt.revOutPath))
    cb();
}


module.exports = {
    dev: imageDev,
    prod: imageProd
}