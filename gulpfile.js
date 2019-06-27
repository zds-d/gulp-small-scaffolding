//引入gulp方法 
const {
    series,
    parallel
} = require('gulp');

//引入gulp任务 
const clean = require('./tasks/clean');
const browser = require('./tasks/browser');
const page = require('./tasks/page');
const style = require('./tasks/style');
const script = require('./tasks/script');
const image = require('./tasks/image');

exports.dev = series(clean, page.dev, parallel(style.dev, script.dev, image.dev), browser.browserSyncInit);
exports.prod = series(clean, parallel(style.prod, script.prod, image.prod), page.prod);