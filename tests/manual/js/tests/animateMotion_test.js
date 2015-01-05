define(function(){
return function(canvas,T){
    var r = canvas.rect(0,0,30,15).attr({
        "stroke" : "red",
        fill:"none"
    });


    canvas.path("M10,50 q60,50 100,0 q60,-50 100,0").attr({
        "stroke":"black",
        "fill":"none",
        "id":"animateMotion_path_1"
    });

    canvas.path("M10,100 q60,50 100,0 q60,-50 100,0").attr({
        "stroke":"black",
        "fill":"none",
        "id":"animateMotion_path_2"
    });

    var m = r.animateMotion("#animateMotion_path_1")
        .begin("0s").dur('10s')
        .repeatCount("indefinite");        

    m.mpath("#animateMotion_path_2");
}
});