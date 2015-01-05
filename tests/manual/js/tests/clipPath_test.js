define(function(){

return function(canvas,T){
    var defs = canvas.defs();
    var c = defs.clipPath("clipPath_1");
    c.path("M10,10 q60,60 100,0 q50,50 50,50 l40,0 l-40,40 l-100,-20");

    var r = canvas.rect(5,5,190,90).attr({
        stroke :"none",
        fill : "#00ff00"
    });
    r.clip_path(r.url("#clipPath_1"));

    var c2 = c.clone();
    c2.clear();
    c2.id("clipPath_2");
    c2.rect(10,110,100,20);

    var g = canvas.g();
    g.clip_path(g.url("#clipPath_2"));
    g.rect(5,105,190,90).attr({
        stroke:"none",
        fill : "#00ff00"
    });
    g.circle(20,120,20).attr({
        stroke: "none",
        fill :"#ff0000"
    });
}


});