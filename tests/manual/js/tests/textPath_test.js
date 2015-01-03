define(function(){
return function(canvas,T){

    var def = canvas.defs();
    var p = def.path("M75,20 l100,0 l100,30 q0,100 150,100").attr("id","textPath_test_path");
    def.path("M75,150 q0,100 150,100").attr("id","textPath_test_path2");

    var t = canvas.text();
    var t2 = t.textPath("textPath_test_path","here is some long sentence ");
    t2.tspan("that is going to take me a long time",-150,10);
    t2.tspan("to take me a long time to type",-150,10);
    t2.text("a different sentence from what i wanted");

    var t3 = t2.clone();
    t3.href("textPath_test_path2")
    t3.clear();    
    t3.text("what is going to happen");    
}

});