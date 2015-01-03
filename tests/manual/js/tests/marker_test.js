define(function(){
return function(canvas,T){
    var a = {
        "stroke": "black",
        "fill": "black",
        "stroke-width":1
    };
    var defs = canvas.defs();

    var m = defs.marker("marker_1",8,8).ref(5,5);
    m.circle(5,5,3).attr({stroke:"none",fill:"black"});
    m.orient("auto");
    m.orient(45);

    var m2 = defs.marker("marker_2",0,0).ref(2,6).orient("auto").width(13).height(13);    
    m2.path("M2,2 L2,11 L10,6 L2,2").attr({"stroke":"black","stroke-width":1});

    var p = canvas.path("M100,10 L150,10 L150,60").attr({
        "fill":"none",
        "stroke":"black",
        "stroke-width":1
    });
    p.mark.start("marker_1");
    p.mark.end("marker_2");


    m = m.clone();
    m2 = m2.clone();
    m.id("marker_3");    
    m2.id("marker_4");
    m.useUserSpace(true);
    m2.units("userSpaceOnUse");

    p = canvas.polyline([150,150,200,150,200,100]).attr({
        "fill":"none",
        "stroke":"black",
        "stroke-width":2
    });     
    p.mark.start("marker_3");
    p.mark.mid("marker_3");
    p.mark.end("marker_4");


    m = defs.marker("marker_5",10,10).ref(5,5);
    m.polyline([1,1,9,9]).attr(a);

    var l = canvas.line(10,200,210,200).attr(a);
    l.mark.start("marker_5");
}

});