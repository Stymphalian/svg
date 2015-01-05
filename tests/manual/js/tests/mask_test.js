define(function(){
return function(canvas,T){
    var defs = canvas.defs();
    var m = defs.mask("mask_1",0,0,100,50);
    m.rect(0,0,100,50).attr({
        "stroke":"none",
        fill:"#ffffff",
    });
    m.rect(0,50,100,50).attr({
        stroke:"none",
        fill:"#666666"
    });

    canvas.text("The text under the rectangle",10,55).attr({
        stroke:"none",
        fill:"#000000"
    });
    var r = canvas.rect(1,1,100,100).attr({
        stroke:"none",
        fill:"#0000ff",        
    });
    r.use_mask("#mask_1");
    T.assertEq(r.use_mask(),"url(#mask_1)");


    var m2 = m.clone();
    m2.id("mask_2");
    m2.clear();
    m2.rect(0,100,100,50).attr({
        "stroke":"none",
        fill:"#ffffff",
    });
    m2.rect(0,150,100,50).attr({
        stroke:"none",
        fill:"#666666"
    });

    canvas.text("The text under the rectangle",10,155).attr({
        stroke:"none",
        fill:"#000000"
    });
    var r = canvas.rect(1,101,100,100).attr({
        stroke:"none",
        fill:"#0000ff",        
    });
    r.use_mask("#mask_2");
    T.assertEq(r.use_mask(),"url(#mask_2)");


    var p = defs.pattern("mask_pattern_1",10,10,20,20);;
    p.circle(10,10,10).attr({
        stroke :"none",
        fill : "#999999"
    });
    var m = defs.mask("mask_3",0,0,200,100);
    m.rect(0,200,200,100).attr({
        stroke:"none"
    }).style.fill.url("#mask_pattern_1");

    t = canvas.text("this is text under the rectangle",10,255).attr({
        "stroke":"none",
        "fill" :"#000000"
    });
    r = canvas.rect(0,200,200,100).attr({
        "stroke":"none",
        "fill" : "#0000ff",
        "mask" : "url(#mask_3)"
    });

}
});