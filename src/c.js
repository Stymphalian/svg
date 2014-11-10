var gulp = require("gulp");
var concat = require("gulp-concat");
var del = require("del")

gulp.task("default",function(){})

gulp.task("build",function(cb){
    gulp.src([
        "src/a.js",
        "src/b.js",
        "src/c.js"
    ])
    .pipe(concat("svg.js"))
    .pipe(gulp.dest('./build'))    
});

gulp.task("clean_build",function(){
    del(["build"]);
    console.log("build was deleted")
})

gulp.task("test",function(){

});

gulp.task("docs",function(){
    // java -jar tools\complier.jar build\svg.js --js_output_file svg.min.js
});

