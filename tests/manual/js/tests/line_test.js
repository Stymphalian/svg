define(function(){

return function(canvas,T){
    // test default line
    var a = {
        "stroke":"black",
        "stroke-width":4
    };
    var l = canvas.line(25,25,125,125).attr(a);

    l = l.clone();
    l.style.stroke("blue");

    T.assertEqObj(l.origin(),{x:25,y:25});
    T.assertEqObj(l.dest(), {x:125,y:125});
    
    l.origin(125,25);
    l.dest(25,125);

    T.assertEqObj(l.origin(),{x:125,y:25});
    T.assertEqObj(l.dest(), {x:25,y:125});

    l = canvas.line(20,0,280,0).attr(a);
    l.style.stroke("green");
    l.move(0,150);    
}

});