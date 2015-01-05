define(function(){
return function(canvas,T){
    var c = canvas.circle(30,30,25).attr({
        "stroke":"none",
        "fill": "#0000ff"
    });

    c.animate("cx")
        .attributeType("XML")
        .from(30).to(270)
        .begin("0s").dur("5s")
        .fill("remove")
        .repeatCount("indefinite");
}
});