var gulp = require("gulp");
var less =require("gulp-less");
var htmlmin = require("gulp-htmlmin");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var minifyCss = require("gulp-minify-css");
var browserSync = require("browser-sync").create();
var reload = browserSync.reload;
	
var smushit = require('gulp-smushit');
//压缩图片至smushit-dist 文件夹内
gulp.task('smushit', function () {
    return gulp.src('src/img/*.jpg')
        .pipe(smushit({
            verbose: true
        }))
        .pipe(gulp.dest('dist/img'))
		.pipe(reload({stream:true}));
});

//压缩HTML
gulp.task("testHTML",function (){
	 var options = {
         removeComments: true, //清除HTML注释
         collapseWhitespace: true, //压缩HTML
         minfyJS: true,//压缩JS
        minfyCss: true,//压缩CSS
     };
     gulp.src('src/html/*.html')
　　　　　//压缩html
         .pipe(htmlmin(options))
		 .pipe(gulp.dest('dist'));//保存到此目录下
           
});
//js合并压缩
gulp.task("testMinJs",function (){
	gulp.src("src/js/*.js")
	.pipe(concat("index.js"))//合并js
	.pipe(uglify())//压缩
	.pipe(gulp.dest("dist/js"));//输出到此文件夹下
});

gulp.task("js-watch",['testMinJs'],reload); //reload是上面的变量 
//css解析压缩
gulp.task("testMinCss",function (){
	gulp.src("src/less/*.less")
		.pipe(less()) //解析成css
		.pipe(minifyCss())//压缩CSS
		.pipe(gulp.dest('dist/css'))//保存到此目录下
		.pipe(reload({stream:true})); //刷新         
});


gulp.task("server",['testMinCss'],function (){
	browserSync.init({
		server:{
			baseDir:"dist"
		}
	})
	
	gulp.watch('src/less/*.less',["testMinCss"]); 
	gulp.watch('src/js/*.js',['js-watch']);
	gulp.watch('src/html/*.html',['testHTML']).on('change',reload);//reload是上面的变量
	gulp.watch('src/img/*.jpg',['smushit']);//监听图片是否有修改，如果有则压缩 只有压缩后才刷新浏览器，所以放上面
	
});

gulp.task("default",["server"]);



//监听
//gulp.task("watch", function() {
//  console.log("-- GULP IS WATCHING");
//  gulp.watch(["src/img/*.jpg"], ["smushit"]);//监听图片文件夹里有改动的时候
//});

//gulp.task("default",['smushit']); //gulp版本 3.9.1

//gulp.task('default', gulp.series('image')); //gulp版本 4.0.0

