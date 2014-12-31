define(function(){
return function(canvas,T){

    var a = {
        "fill" : "green",
        "fill-opacity" : 0.4,
        "stroke" : "black",        
    };

    var e = canvas.ellipse(40,40,30,30).attr(a);
    e = canvas.ellipse(40,40,10,20).attr(a);
    e.attr("fill","blue");
    e.center(40,120);

    var cent = e.center();
    T.assertEq(cent.cx,40);
    T.assertEq(cent.cy,120);

    e = canvas.ellipse(40,40,30,30).attr(a);
    e.attr("fill","blue");
    e.center(120,40);
    e.rx(20);
    e.ry(10);

    T.assertEq(e.rx(),20);
    T.assertEq(e.ry(),10);

    var e2 = canvas.ellipse(40,40,30,30).attr(a);
    e2.attr("fill","green");
    e2.center(250,250);
}

});
