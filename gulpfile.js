// require plugins

const gulp     = require('gulp');
const eslint   = require('gulp-eslint');
const bump     = require('gulp-bump');
const git      = require('gulp-git');
const header   = require('gulp-header');
const mocha    = require('gulp-mocha');
const gutil    = require('gulp-util');
const less     = require('gulp-less');
const rename   = require('gulp-rename');
const plumber  = require('gulp-plumber');
const concat   = require('gulp-concat');
const watch    = require('gulp-watch');
const reload   = require('gulp-refresh');
const uglify   = require('gulp-uglify');
const minify   = require('gulp-clean-css');
const stripJS  = require('gulp-strip-comments');
const strip    = require('gulp-strip-css-comments');
const imagemin = require('gulp-imagemin');
const scanner  = require('gulp-nsp');

// require dependencies

const runSequence = require('run-sequence');
const package     = require('./package.json');

// banner to append to files in pipeline

const banner = ['/**',
  ' * @project <%= package.name %>',
  ' * @about   <%= package.description %>',
  ' * @author  <%= package.author.name %>',
  ' * @email   <%= package.author.email %>',
  ' * @github  <%= package.author.url %>',  
  ' */',
  '\n'].join('\n');

// security check against package.json

gulp.task('scan-build', function (cb) {
  scanner({package: __dirname + '/package.json'}, cb);
});  

// validate codebase using eslint to fix where it can
 
gulp.task('lint-build', () => {
    console.log('\n > linting js files using eslint...\n');
    return gulp.src(['src/js/*.js', '!node_modules/**'])
    .pipe(plumber())
    .pipe(eslint( { fix: true } ))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

// unit testing with mocha

gulp.task('test-build', function () {
    console.log('\n > testing using mocha...\n');
    return gulp.src(['tests/**/*.js'], { read: false })
      .pipe(plumber())
      .pipe(mocha({ reporter: 'spec' }))
      .on('error', gutil.log);
});

// build js into a single minified file

gulp.task('build-js', ['lint-build'], function(){
    console.log('\n > building js files from src...\n');
    return gulp.src([
          'src/js/transition.js',
          'src/js/alert.js',
          'src/js/button.js',
          'src/js/carousel.js',
          'src/js/collapse.js',
          'src/js/dropdown.js',
          'src/js/modal.js',
          'src/js/tooltip.js',
          'src/js/popover.js',
          'src/js/scrollspy.js',
          'src/js/tab.js',
          'src/js/affix.js',
          'src/js/app.js'
        ])
      .pipe(plumber())
      .pipe(stripJS())
      .pipe(concat('scripts.min.js'))
      .pipe(uglify())
      .pipe(header(banner, { package : package } ))
      .pipe(gulp.dest('./public/js'))
      .pipe(reload());
})

// automate the above lint, test and build js tasks by using watch

gulp.task('watch-scripts', function () {
    console.log('\n > watching js files in preperation for next build...\n');
    return watch('src/js/*.js', function () {
        runSequence('lint-build', 'test-build', 'build-js');
    });
});

// build bootstrap, font awesome and other files from less

gulp.task('build-less', function(){
    console.log('\n > building css files from template.less...\n');
    return gulp.src('src/less/template.less')
      .pipe(plumber())
      .pipe(less())
      .pipe(strip({preserve: false}))
      .pipe(rename('styles.css'))
      .pipe(gulp.dest('./src/css'))
      .pipe(reload());
})

// build css into a single minified file

gulp.task('build-css', function(){
    console.log('\n > building minified css files from compiled less...\n');
    return gulp.src([
          'src/css/styles.css',
          'src/css/custom.css'
        ])
      .pipe(plumber())
      .pipe(concat('styles.min.css'))
      .pipe(strip({preserve: false}))
      .pipe(minify({compatibility: 'ie8'}))
      .pipe(header(banner, { package : package } ))
      .pipe(gulp.dest('./public/css'))
      .pipe(reload());
});

// automate the above less and css tasks by using watch

gulp.task('watch-styles', function () {
    console.log('\n > watching less and css files in preperation for next build...\n');
    return watch('src/less/*.less', 'src/css/*.css', function () {
        reload.listen();
        runSequence('build-less', 'build-css');
    });
});

// optimise images during build

gulp.task('build-images', function () {
    console.log('\n > optimising images and compressing where possible...\n');
    return gulp.src('src/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./public/img'));
});

// git bump version as patch in package.json

gulp.task('git-bump', function(){
    console.log('\n > bumping version number...\n');
    return gulp.src('./package.json')
      .pipe(plumber())
      .pipe(bump({type:'patch'}))
      .pipe(gulp.dest('./'));
});

// test and build release candidate by running the above tasks in sequence then push using git-deploy

gulp.task('git-build', function() {
    console.log('\n > building release candidate from codebase...\n');
    runSequence('scan-build', 'lint-build', 'test-build', 'git-bump', 'build-less', 'build-css', 'build-js', 'build-images');
});

// git add files

gulp.task('git-add', function() {
    console.log('\n > adding changes to git repository...\n');
    return gulp.src('.')
      .pipe(git.add());
});

// git commit files

gulp.task('git-commit', function() {
    console.log('\n > commiting changes to git repository...\n');
    return gulp.src('.')
      .pipe(git.commit('gulpfile.js updated repository'));
});

// git push files to origin

gulp.task('git-push', function(){
    console.log('\n > pushing changes to git repository...\n');
    git.push('origin', 'master', function (err) {
      if (err) throw err;
  });
});

// git deploy by running the above tasks in sequence

gulp.task('git-deploy', function() {
    console.log('\n > deploying changes to git repository...\n');
    runSequence('git-build', 'git-add', 'git-commit', 'git-push');
});

// default gulp task used during development

gulp.task('default', ['watch-styles','watch-scripts']);