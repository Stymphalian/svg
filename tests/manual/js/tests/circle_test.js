define(function(){
return function(canvas,T){
    var a = {
        "fill" : "green",
        "fill-opacity" : 0.4,
        "stroke" : "black",        
    };

    var c = canvas.circle(30,30,30).attr(a);
    c = canvas.circle(30,30,30).attr(a);
    c.attr("fill","blue");
    c.center(60,30);

    var cent = c.center();
    T.assertEq(cent.cx,60);
    T.assertEq(cent.cy,30);

    c = canvas.circle(30,30,30).attr(a).center(45,60).attr("fill","red");

    c = canvas.circle(150,50,40).attr(a);    
    c.radius = 60;
    T.assertEq(c.radius,60);

    c = canvas.circle(75,150,50).attr(a);
    var c2 = c.clone();
    c2.attr("fill","blue");
    c2.center(125,150);
}

});