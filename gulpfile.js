'use strict';

var gulp = require("gulp");
var concat = require("gulp-concat");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var del = require("del");
var exec = require("child_process").exec;
var fs = require("fs");

function getBundleName(){    
    var name = require("./package.json").name;
    var version = require("./package.json").version;
    return name + "." + version;
}


gulp.task("watch",function(){
    gulp.watch(["dist/js/*.js","dist/index.html","src/*.js"],["default"]);
});

gulp.task("default",["build"],function(){
    var bundle_name = getBundleName();
    return gulp.src("./build/"+bundle_name + ".js")
            .pipe(gulp.dest('./dist/js'))
            .pipe(rename(require("./package.json").name + ".js"))
            .pipe(gulp.dest('./tests/manual/js'));
});

gulp.task("build",function(cb){
    var bundle_name = getBundleName();
    return gulp.src([
        // header
        "src/module_banner.js",

        // base class
        "src/svgElem.js",
        "src/util.js",

        // sub-modules
        "src/sub_modules/color.js",
        "src/sub_modules/attr.js",
        "src/sub_modules/shape.js",
        "src/sub_modules/transform.js",
        "src/sub_modules/style.js",
        "src/sub_modules/lex.js",
        
        // containers
        "src/containers/svg.js",
        "src/containers/g.js",

        // basic shapes        
        "src/basic_shapes/rect.js",
        "src/basic_shapes/circle.js",
        "src/basic_shapes/ellipse.js",
        "src/basic_shapes/line.js",
        
        // footer
        "src/module_footer.js",        
    ])
    .pipe(concat(bundle_name + ".js"))
    .pipe(gulp.dest('./build'))

    // create  a minified build
    .pipe(rename(bundle_name + ".min.js"))
    .pipe(uglify())
    .pipe(gulp.dest('./build'))
});

gulp.task("clean_build",function(){
    del(["build"]);
    console.log("build was deleted")
})


gulp.task("test",function(){    
    // run all the test
    // get the performance data out
});

gulp.task("docs",function(callback){    
    var filename = getBundleName()+".js";    
    var cmd = __dirname + '/node_modules/.bin/jsdoc.cmd build/' + filename + " README.md -d docs";
    console.log(cmd);
    exec(cmd,function(err,stdout,stderr){        
        console.log(stdout);
        console.log(stderr);
        callback(err);
    });
});


gulp.task("clean_all",function(){
    del(["build","docs"]);
    console.log("deleted the build and docs folder")
});
