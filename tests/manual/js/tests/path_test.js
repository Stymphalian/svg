define(function(){
return function(canvas,T){
    var a = {
        "stroke":"black",
        "stroke-width":3,
        "fill":"none"
    };

    // test moveto and line command
    var m = canvas.path("M 10,10 L 20 10 m 0 10 l -10 0").attr(a);

    var v = canvas.path("M 30 10 v 10").attr(a);
    v = canvas.path("M 40 10 V 20").attr(a);

    var h = canvas.path("M 50 10 h 10").attr(a);
    h = canvas.path("M 50 20 H 60").attr(a);

    var z = canvas.path("M 70 10 l 10 0 l 0 10 l -10 0 Z").attr(a);
    z = canvas.path("M 90 10 l 10 0 l 0 10 l -10 0 z").attr(a);

    var c = canvas.path("M 10 90 c 30 30 70 -30 90 0").attr(a);
    c = canvas.path("M 10 60 C 40 90 80 30 100 60").attr(a).attr("stroke","#dd0000");

    var s = canvas.path("M10 120 C40 150 80 90 100 120 S120 150 150 120").attr(a);
    s = canvas.path("M 10 140 c 30 30 70 -30 90 0 s30 30 60 0").attr(a);

    var q = canvas.path("M 10 160 Q20 190 60 160").attr(a);
    q = canvas.path("M 10 170 q10 30 50 0").attr(a);

    var t = canvas.path("M 10 180 Q20 210 60 180 T80 210 ").attr(a);
    t = canvas.path("M 10 190 q10 30 50 0 t20 30 ").attr(a);
    // t = canvas.path("M 10 210 q10 30 50 0 t20 30 40 0").attr(a);    

    var arc;
    arc = canvas.path("M 220 20 a 30,30 0 0 0 30,50").attr(a).attr("stroke","red");
    arc = canvas.path("M 220 20 a 30,30 0 0 1 30,50").attr(a).attr("stroke","blue");
    arc = canvas.path("M 220 20 a 30,30 0 1 0 30,50").attr(a).attr("stroke","green");
    arc = canvas.path("M 220 20 a 30,30 0 1 1 30,50").attr(a).attr("stroke","yellow");

    arc = canvas.path("M 140 20 A 30,30 0 0 0 170,70").attr(a).attr("stroke","red");
    arc = canvas.path("M 140 20 A 30,30 0 0 1 170,70").attr(a).attr("stroke","blue");
    arc = canvas.path("M 140 20 A 30,30 0 1 0 170,70").attr(a).attr("stroke","green");
    arc = canvas.path("M 140 20 A 30,30 0 1 1 170,70").attr(a).attr("stroke","yellow");
    arc.point(-1);

    var m2 = m.clone();
    m2.move(0,240);

    var v2 = v.clone();
    var vPoint = v2.point(-1);
    vPoint.x(30);
    v2.save();
    T.assertEq(vPoint.x(),30); 
    vPoint.x(20);
    T.assertEq(vPoint.x(),20); 
    v2.save();

    v2.move(0,240);
    
    var h2 = h.clone();
    var hPoint = h2.point(-1);
    hPoint.y(30);
    h2.save();
    T.assertEq(hPoint.y(),30); 
    hPoint.y(60);
    T.assertEq(hPoint.y(),60); 
    h2.save();

    h2.move(0,240);


    var c2 = c.clone();

    var c2Point = c2.point(-1);
    c = canvas.path("M 10 60 C 40 90 80 30 100 60").attr(a);    
    c2Point.c1(50,100);
    c2Point.c2(90,40);
    c2Point.end(110,70);
    c2.save();

    T.assertEqObj(c2Point.c1(),{x:50,y:100});
    T.assertEqObj(c2Point.c2(),{x:90,y:40});
    T.assertEqObj(c2Point.end(),{x:110,y:70});    

    c2Point.c1(40,90);
    c2Point.c2(80,30);
    c2Point.end(100,60);
    c2.save();
    T.assertEqObj(c2Point.c1(),{x:40,y:90});
    T.assertEqObj(c2Point.c2(),{x:80,y:30});
    T.assertEqObj(c2Point.end(),{x:100,y:60});

    c2.move(0,220);


    var arc2 = arc.clone();
    arc2.move(0,240);
    
    var arc_point = arc2.point(-1);    
    T.assertEq(arc_point.rx(),30);
    T.assertEq(arc_point.ry(),30);
    T.assertEq(arc_point.rotation(),0);
    T.assertEq(arc_point.largeArc(),true);
    T.assertEq(arc_point.clockwise(),true);    

    
    arc_point.rx(35);
    arc_point.ry(35);
    arc_point.rotation(20);
    arc_point.largeArc(false);
    arc_point.clockwise(false);
    arc2.save();

    T.assertEq(arc_point.rx(),35);
    T.assertEq(arc_point.ry(),35);
    T.assertEq(arc_point.rotation(),20);
    T.assertEq(arc_point.largeArc(),false);
    T.assertEq(arc_point.clockwise(),false);


    var j = canvas.path("M 0 0 L 300,300").attr(a);
    j.insert(-500,"M 260 260");
    j.insert(500,"M 260 260");
    j.insert(0,"M 260 260");
    j.insert(-1,"l 0 -30 z");
    j.insert(1,"l 0 30");

    // seems like a shit idea to do tesing with the string return value.    
    T.assertEq(j.d(),"M 260 260 l 0 30 M 0 0 l 0 -30 z L 300 300 ");

    j.remove(-500);
    j.remove(500);
    j.remove(-2);
    j.remove(2);    
    j.insert(0,"M 260 260");
    j.remove(0);    

    T.assertEq(j.d(),"M 260 260 l 0 30 l 0 -30 L 300 300 ");

    j.point(-1).values[0] = 270;
    j.point(-1).values[1] = 270;
    j.save();

    T.assertEq(j.d(),"M 260 260 l 0 30 l 0 -30 L 270 270 ");
}    
});