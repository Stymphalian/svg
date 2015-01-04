define(function(){
return function(canvas,T){
    var defs = canvas.defs();
    var l = defs.linearGradient("linearGradient_1",0,0,100,0);
    l.spreadMethod("pad");
    l.stop(10,"#00cc00").opacity(1.0);
    l.stop(30,"#006600").opacity(1.0);
    l.stop(30,"#006600").opacity(1.0);
    l.stop(70,"#cc0000").opacity(1.0);
    l.stop(90,"#000099").opacity(1.0);    

    var r = canvas.rect(10,10,290,50).attr(T.defaultAttr());
    r.style.fill("url(#linearGradient_1)");
    r.style.fill.opacity(1.0);

    var l2 = l.clone().id("linearGradient_2");    
    l2.start(30,0).end(70,0);
    var r2 = r.clone();
    r2.shape.move(0,60);
    r2.style.fill("url(#linearGradient_2)");
    
}
});