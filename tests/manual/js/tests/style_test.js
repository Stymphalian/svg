define(function(){
return function(canvas,T){
    var a = T.defaultAttr();
    var r = canvas.rect(0,0,50,50);
    T.assertEq(r.style.stroke(),null);
    T.assertEq(r.style.stroke.width(),null);
    T.assertEq(r.style.stroke.opacity(),null);
    T.assertEq(r.style.stroke.dasharray(),null);
    T.assertEq(r.style.fill(),null);
    T.assertEq(r.style.fill.opacity(),null);    
        
    T.assertEq(r.style(),null);
    r.style("stroke:#006600; fill:#00cc00");
    T.assertEq(r.style(),"stroke:#006600; fill:#00cc00");


    r = canvas.rect(100,100,50,50);
    r.style.stroke("black");
    r.style.stroke.width(3);
    r.style.stroke.opacity(0.2);
    r.style.stroke.dasharray("1 2 3 4");
    r.style.fill("#ff5151");
    r.style.fill.opacity(0.8);
    T.assertEq(r.style.stroke(),"black");
    T.assertEq(r.style.stroke.width(),3);
    T.assertEq(r.style.stroke.opacity(),0.2);
    T.assertEqArray(r.style.stroke.dasharray(),[1,2,3,4]);
    T.assertEq(r.style.fill(),"#ff5151");
    T.assertEq(r.style.fill.opacity(),0.8);
    
}
});