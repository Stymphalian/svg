require.config({
    baseUrl : "dist/js"
});

require(["svg.0.0.0"],function(svg){    
    var paper = svg.svgRoot("canvas",400,400);
    console.log(svg.style.stroke());
    console.log(svg.style.stroke.opacity());
    console.log(svg.style.stroke.width());
    console.log(svg.style.stroke.dasharray());
    console.log(svg.style.fill());
    console.log(svg.style.fill.opacity());
    console.log(svg.style());

    paper.rect(0,0,400,400).attr({
      fill:"black",
      "fill-opacity":0.8,
      stroke:"red"
    });

    var c = paper.circle(30,30,25);
    c.style.fill("green");
    c.style.fill.opacity(0.3);
    c.style.stroke("black");    
    c.style.stroke.opacity(0.5);
    c.style.stroke.width(2.5);
    c.style.stroke.dasharray("1 2 3 4");

    console.log(c.style.fill());
    console.log(c.style.fill.opacity());
    console.log(c.style.stroke());
    console.log(c.style.stroke.opacity());
    console.log(c.style.stroke.width());
    console.log(c.style.stroke.dasharray());

    c = paper.g().circle(30,30,25);
    c.style.fill("#0000ff");
    c.style.stroke("#000000");
    c.style.stroke.dasharray([1,2,3,4]);
    c.attr({      
      "fill-opacity":0.4,      
    });
    c.center(60,30);

    paper.rect(200,200,200,200).attr({
      'fill':'blue',
      'fill-opacity': 0.25,
    }).round(15,15);

    c.transform
    c.transform.translate();
    // c.shape().pos();

    var e = paper.ellipse(90,30,20,30);    
    // e.style().fill("#ff2244");
    // e.style().fill.opacity(0.25);

    //testing the color sub-module
    console.log(e.color.rgb2hex(255,172,172));
    console.log(e.color.hex2rgb("#ff3333"));

});
