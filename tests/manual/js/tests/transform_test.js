define(function(){
return function(canvas,T){
    var p = canvas.polyline([10,10,50,50]).attr(T.defaultAttr());

    p.transform("translate(50,0) rotate(30)");
    var t = p.transform(0);
    var r = p.transform(1);
    var total = p.transform();

    T.assertEq(t.name,"translate");
    T.assertEqArray(t.values,[50,0]);
    T.assertEq(r.name,"rotate");
    T.assertEqArray(r.values,[30]);

    T.assertEq(total.length,2);
    T.assertEq(total[0].name,"translate");
    T.assertEqArray(total[0].values,[50,0]);
    T.assertEq(total[1].name,"rotate");
    T.assertEqArray(total[1].values,[30]);
    
    t.values[0] = 75;
    p.transform.save();
    total = p.transform();
    T.assertEq(total.length,2);
    T.assertEq(total[0].name,"translate");
    T.assertEqArray(total[0].values,[75,0]);
    T.assertEq(total[1].name,"rotate");
    T.assertEqArray(total[1].values,[30]);

    p.transform.clear();
    T.assertEq(total.length,0);

    p = canvas.rect(0,0,25,25).attr(T.defaultAttr());
    p.transform.translate(100,100);
    p.transform.rotate(45);    
    p.transform.rotate(-45,0,0);    
    p.transform.translate(-75,-75);
    p.transform.rotate(45,12.5,12.5);

    p.transform.scale(2);
    p.transform.scale(1);


    p = canvas.rect(0,0,25,25).attr(T.defaultAttr());
    p.transform.translate(100,100);
    p.transform.skew(10,10);
    p.transform.updateFromDom();

    p = canvas.rect(0,0,25,25).attr(T.defaultAttr());
    p.transform.matrix([1,0,0,1,120,120]);

    var p2 = p.clone();
    p2.transform.clear();
    p2.transform.translate(125,10);

}

});