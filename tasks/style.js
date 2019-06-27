//引入gulp方法 
const {
    src,
    dest,
    series,
    watch
} = require('gulp');

//引入gulp第三方插件 
const sass = require('gulp-sass'); //自带压缩处理，如果无法满足要求，也可以使用 gulp-clean-css 等插件。（ gulp-minify-css 被弃用了）
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const rev = require('gulp-rev');
const revCollector = require('gulp-rev-collector');

//引入gulp基础类任务 
const config = require('./config');
const browser = require('./browser');
const revOpt = require('./revOpt');

//配置 style任务 常量 
const cssOpt = {
    inPath: config.sourcePath + 'styles/*.scss',
    sassOpt: {
        outputStyle: 'compressed'
        // errLogToConsole: false, //使用此选项gulp.watch可以防止每次出现错误时停止编译sass和任务执行。 //但是在gulp4上无效，gulp4上使用gulp-sass的.on('error', sass.logError))监听事件
    },
    autoprefixerOpt: {
        // browsers: 
        overrideBrowserslist: ['last 2 versions', '> 2%'] //> 2% 全球使用率高于2%的浏览器， last 2 versions 主流浏览器的最新2个版本
    },
    outPath: config.distPath + 'css/',
    wathPath: config.sourcePath + 'styles/*.scss',
    revOutPath: revOpt.outPath + 'css/',
}

function styleDev(cb) {
    src(cssOpt.inPath, {
            sourcemaps: true
        })
        .pipe(sass(cssOpt.sassOpt))
        .pipe(autoprefixer(cssOpt.autoprefixerOpt))
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(dest(cssOpt.outPath, {
            sourcemaps: '.'
        }))
    watch(cssOpt.wathPath, series(styleDev, browser.browserSyncObj.reload))
    cb();
}

function styleProd(cb) {
    src([cssOpt.revOutPath + '*.json', cssOpt.inPath])
        .pipe(revCollector({
            replaceReved: true
        }))
        .pipe(sass(cssOpt.sassOpt).on('error', sass.logError))
        .pipe(autoprefixer(cssOpt.autoprefixerOpt))
        .pipe(rename({
            extname: '.min.css'
        }))

        //在文件名后面,添加哈希码，来确保将文件设置为永不过期，以保证用户获取最新的静态资源文件。(静态资源文件的内容修改以后哈希码才会修改)
        .pipe(rev())
        .pipe(dest(cssOpt.outPath))

        //生成哈希文件名和原文件名对应的manifest文件
        .pipe(rev.manifest(revOpt.manifestOpt))
        .pipe(dest(cssOpt.revOutPath))
    cb();
}


module.exports = {
    dev: styleDev,
    prod: styleProd
}