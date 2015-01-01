define(function(){
return function(canvas,T){
    var a = T.defaultAttr();
    var s = canvas.switchElem();

    g = s.g().attr("systemLanguage","en-UK");
    g.circle(50,50,50).attr(a).style.fill("blue");    

    g = s.g().attr("systemLanguage","en");
    g.circle(50,50,50).attr(a).style.fill("red");    

    g = s.g().attr("systemLanguage","es");
    g.circle(50,50,50).attr(a).style.fill("green");    

}
});