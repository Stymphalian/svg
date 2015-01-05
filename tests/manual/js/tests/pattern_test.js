define(function(){
return function(canvas,T){
    var defs = canvas.defs();
    var p = defs.pattern("pattern_1",10,10,20,20);
    p.circle(10,10,10).attr({
        stroke:"none",
        fill:"#0000ff"
    });

    var r = canvas.rect(10,10,100,100).attr({
        stroke : "#000000",
        fill : canvas.url("#pattern_1")
    });

    var p2 = p.clone();
    p2.x(0).y(0);
    p2.id("pattern_2");

    var r = canvas.rect(10,120,100,100).attr({
        stroke:"#000000",
        fill: canvas.url("#pattern_2")
    });
};

});
