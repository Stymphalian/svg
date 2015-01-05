define(function(){
return function(canvas,T){
    var r = canvas.rect(20,20,100,40).attr({ 
        "stroke" :"black",
        "fill" : "none"
    });

    var c = canvas.circle(100,100,2).attr({
        "fill":"red"
    });

    r.animateTransform("rotate")
        .from("0 100 100").to([360,100,100])
        .begin("0s").dur("10s")
        .repeatCount("indefinite");
}
});