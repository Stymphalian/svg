define(function(){
return function(canvas,T){
    var a = {
        "stroke":"black",
        "stroke-width":3,
        "fill-opacity":1
    };

    var defs = canvas.defs();
    var r = defs.radialGradient("radialGradient_1",50,50,65);
    r.stops([
        [0,"#00ff00",1],
        [100,"#003300",1]
    ]);

    T.assertEqObj(r.stops(),[
        {offset:0,color:"#00ff00",opacity:1},
        {offset:100,color:"#003300",opacity:1}
    ]);

    var c = canvas.rect(10,10,50,50).attr(a);
    c.style.fill.url("#radialGradient_1");

    var r2 = r.clone();
    r2.id("radialGradient_2");
    r2.stops([
        [0,"#00ffff",1],
        [100,"#000033",1]
    ]);
    r2.stops(0).color ="#0000ff";
    r2.save();

    T.assertEqArray(r2.stops(),[
        {offset:0,color:"#0000ff",opacity:1},
        {offset:100,color:"#000033",opacity:1}        
    ]);

    r2.focal(75,75);
    r2.center(10,10);
    r2.cx(null);
    r2.cy(null);
    r2.r(65);
    r2.fx(50);
    r2.fy(50);

    c = canvas.rect(80,10,50,50).attr(a);
    c.style.fill.url("#radialGradient_2");
}

});