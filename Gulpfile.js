'use strict';

var gulp = require('gulp');
var PoormanCI = require('./src/PoormanCI');

if (!process.env.TOKEN || !process.env.OWNER || !process.env.REPO) {
    throw new Error('Missing environment variable (TOKEN, OWNER or REPO)');
}
gulp.task('task', function () {
    new PoormanCI(
        process.env.TOKEN,
        process.env.OWNER,
        process.env.REPO
    ).run(process.env.DEBUG);
});
