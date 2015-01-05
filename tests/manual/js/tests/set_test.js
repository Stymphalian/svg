define(function(){
return function(canvas,T){
    var c = canvas.circle(30,30,25).attr({
        stroke :"black",
        fill : "#0000ff"
    });

    // hmm doesn't seem to work
    c.set("r")
        .attributeType("XML")
        .begin("10s")
        .to(100);     
}

});