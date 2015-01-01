define(function(){
return function(canvas,T){

    var a = T.defaultAttr();

    var s1 = canvas.symbol("s3");
    s1.viewBox(0,0,150,150);
    s1.attr("id","s1");
    s1.circle(50,50,40).attr(a);
    s1.circle(90,60,40).attr(a).style.fill("blue");

    var s2 = s1.clone();
    s2.id("s2");
    s2.viewBox(0,0,75,75);

    canvas.use("s1",0,0,100,50);
    canvas.use("#s1",0,50,75,38);
    canvas.use("s2",0,100,50,25);

    T.assertEq(s2.id(),"s2");
    T.assertEq(s1.id(),"s1");
    T.assertEqObj(s1.viewBox(),{x:0,y:0,w:150,h:150});
    T.assertEqObj(s2.viewBox(),{x:0,y:0,w:75,h:75});
}
});