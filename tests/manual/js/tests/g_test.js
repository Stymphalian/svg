define(function(){
return function(canvas,T){
    var a = {
        "fill" : "green",
        "fill-opacity" : 0.4,
        "stroke" : "black",        
    };

    var g = canvas.g();
    var s = g.svg(0,0,200,200);
    s.rect(0,0,50,50).attr(a);
    s.rect(50,50,50,50).attr(a);
    g.rect(40,40,20,20).attr(a).attr("fill","blue");
}

});
