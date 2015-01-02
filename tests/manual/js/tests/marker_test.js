define(function(){
return function(canvas,T){
    var a = T.defaultAttr();
    var defs = canvas.defs();

    var g = defs.g().attr("id","g_1");
    g.rect(50,50,50,50).attr(a);
    g.circle(50,50,50).attr(a);


    var g = defs.g().attr("id","g_2");
    g.rect(50,50,50,50).attr(a).style.fill("blue");
    g.circle(50,50,50).attr(a).style.fill("blue");

    canvas.use("g_1").attr({x:50,y:50});
    canvas.use("g_1").attr({x:200,y:50});

    var u = canvas.use("g_1").attr({x:50,y:200});
    u = u.clone();
    u.shape.move(150,0);
    u.href("#g_2");
}

});