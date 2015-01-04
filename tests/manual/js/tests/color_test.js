define(function(){
return function(canvas,T){    
    T.assertEq(canvas.colorUtil.rgb2hex(255,51,51),"#ff3333");

    var rs = canvas.colorUtil.hex2rgb("#ff3333");
    T.assertEq(rs.r,255);
    T.assertEq(rs.g,51);
    T.assertEq(rs.b,51);


    var a = {
        "fill":"red",
        "fill-opacity":0.4,
        "stroke": "black"
    }
    r = canvas.rect(0,0,50,50).attr(a);
    r.attr("fill",canvas.colorUtil.rgb2hex(255,51,51));

    r = canvas.rect(50,0,50,50).attr(a);
    r.attr("fill","blue");

    r = canvas.rect(50,50,50,50).attr(a);
    r.attr("fill","green");

    r = canvas.rect(0,50,50,50).attr(a);
    r.attr("fill",canvas.colorUtil.rgb2hex(-1,60,400));
}

});