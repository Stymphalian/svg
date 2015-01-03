define(function(){
return function(canvas,T){    
    var def = canvas.defs();
    var d = def.text("ref text").attr("id","ref");

    var t = canvas.text("svg is here",10,30);
    t.tref("ref");    
}

});