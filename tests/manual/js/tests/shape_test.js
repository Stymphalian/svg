define(function(){
return function(canvas,T){    
    var a = T.defaultAttr();
    canvas.rect(0,0,50,50).attr(a);

    var r = canvas.rect(0,0,50,50).attr(a).attr("fill","blue");
    r.shape.pos(80,80);
    r.shape.size(10,10);

    var r = canvas.rect(0,0,50,50).attr(a).attr("fill","red");
    r.shape.pos(180,80);
    r.shape.size(80,80);

    var pos = r.shape.pos();
    T.assertEq(pos.x,180);
    T.assertEq(pos.y,80);

    var size = r.shape.size();
    T.assertEq(size.width,80);
    T.assertEq(size.height,80);

    var c = canvas.circle(0,0,0).attr(a).attr("fill","yellow");
    c.shape.pos(250,30);
    c.shape.size(20);

    pos = c.shape.pos();
    T.assertEq(pos.cx,250);
    T.assertEq(pos.cy,30);

    size = c.shape.size();
    T.assertEq(size.r,20);

    var e = canvas.ellipse(0,0,0,0).attr(a).attr("fill","purple");
    e.shape.pos(30,250);
    e.shape.size(40,30);

    pos = e.shape.pos();
    T.assertEq(pos.cx,30);
    T.assertEq(pos.cy,250);

    size = e.shape.size();
    T.assertEq(size.rx,40);
    T.assertEq(size.ry,30);
    T.assertEqThing(size,{rx:40,ry:30});

    r = canvas.rect(0,0,0,0).attr(a).attr("fill","red");
    r.shape.x= 185;
    r.shape.y= 85;
    r.shape.width=80;
    r.shape.height=80;

    T.assertEq(r.shape.x,185);
    T.assertEq(r.shape.y,85);
    T.assertEq(r.shape.width,80);
    T.assertEq(r.shape.height,80);

    c = canvas.circle(0,0,0).attr(a).attr("fill","yellow");
    c.shape.cx=255;
    c.shape.cy=35;
    c.shape.r =20;

    T.assertEq(c.shape.cx,255);
    T.assertEq(c.shape.cy,35);
    T.assertEq(c.shape.r,20);

    e = canvas.ellipse(0,0,0,0).attr(a).attr("fill","purple");
    e.shape.cx= 35;
    e.shape.cy= 255;
    e.shape.rx= 40;
    e.shape.ry= 30;
    T.assertEq(e.shape.cx,35);
    T.assertEq(e.shape.cy,255);
    T.assertEq(e.shape.rx,40);
    T.assertEq(e.shape.ry,30);

    r = canvas.rect(0,0,30,30).attr(a);
    r.shape.move(30,30);

    c = canvas.circle(0,0,30).attr(a);
    c.shape.move(60,60);
}

})