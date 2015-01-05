require.config({
    baseUrl : "js"
});

require(["svg.0.0.0"],function(svg){
    var canvas  = svg.svgRoot("canvas",400,400);

    var r = canvas.rect(30,30,100,100).attr({
        "stroke" : "black",
        "fill" : "#ff0000",        
    });
    r.style.fill.opacity(0.4);
    
});
