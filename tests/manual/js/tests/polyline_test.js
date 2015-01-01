define(function(){
return function(canvas,T){
    var a = {
        "stroke":"black",
        "stroke-width":4,
        "fill-opacity":0
    };
    var l1 = canvas.polyline("25,25 150,25 150,150").attr(a).style.stroke("green");
    var l2 = canvas.polyline("30,30,155,30,155,155").attr(a).style.stroke("blue");
    var l3 = canvas.polyline([35,35,160,35,160,160]).attr(a).style.stroke("red");

    T.assertEqArray(l1.points(),[25,25,150,25,150,150]);
    l1.points([150,150,25,150,25,25]);
    T.assertEqArray(l1.points(),[150,150,25,150,25,25]);

    l2.numPoints = 5;
    l2.add(-(l2.numPoints+1),15,5);
    l2.add(l2.numPoints+1,15,5);
    l2.add(0,15,5);
    l2.add(1,50,35);
    l2.add(l2.numPoints,300,300);
    l2.add(-1,300,0);
    l2.add(-l2.numPoints,0,0);

    T.assertEqArray(l2.points(),
        [0,0, 15, 5, 50, 35, 30, 30, 155, 30, 155, 155, 300, 0, 300,300]);

    l2.remove(-(l2.numPoints+1));
    l2.remove(l2.numPoints);
    l2.remove(1);
    l2.remove(0);
    l2.remove(l2.numPoints-1);
    l2.remove(-l2.numPoints);
    l2.remove(-1);

    T.assertEqArray(l2.points(),[30, 30, 155, 30, 155, 155]);

    T.assertEq(l3.point(l3.numPoints),null);
    T.assertEq(l3.point(-(l3.numPoints+1)),null);
    T.assertEqObj(l3.point(0),{x:35,y:35});
    T.assertEqObj(l3.point(1),{x:160,y:35});
    T.assertEqObj(l3.point(-1),{x:160,y:160});
    T.assertEqObj(l3.point(l3.numPoints-1),{x:160,y:160});

    l3.point(0,40,40);
    T.assertEqArray(l3.points(),[40,40,160,35,160,160]);

    l3.move(10,10);
    T.assertEqArray(l3.points(),[50,50,170,45,170,170]);

    l3.move(-10,-10,1);
    T.assertEqArray(l3.points(),[50,50,160,35,160,160]);

    l3.move(-10,-10,0,1);
    T.assertEqArray(l3.points(),[40,40,160,35,160,160]);

    l3.point(0,35,35);

    var l4 = l3.clone();
    l4.point(0,40,30);
    l4.add(1,40,80);
    l4.move(50,50);

}
});