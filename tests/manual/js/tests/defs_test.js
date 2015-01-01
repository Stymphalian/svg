define(function(){
return function(canvas,T){
    var a = T.defaultAttr();
    var defs = canvas.defs("jordan_defs");

    var id = defs.url();
    var o = defs.rect(4,4,50,50).attr(a);
    defs.store(id,o);

    var id2 = defs.url();
    var o2 = defs.circle(10,10,30).attr(a);
    defs.store(id2,o2);

    T.assertEq(defs.get(id),o);
    T.assertEq(defs.get(id2),o2);


    var g = defs.g();
    g.rect(40,40,40,40).attr(a);
    g.ellipse(20,40,10,5).attr(a);
    g.polyline([1,2,3,4,5,6]).attr(a);
    g.attr("id","g_element");

    defs.store("g_element",g);

    defs.drop(id);
    defs.dropAll();
}

});