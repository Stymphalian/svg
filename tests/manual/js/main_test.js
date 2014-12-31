require.config({
    baseUrl : "js",    
    paths : {
        "tests" : "tests"
    }
});


require(["svg","testing"], function(svg,T){
    var currentTestBlock = 1
    function getNextId(){
        return currentTestBlock++;
    }
    
    var tests = [
        "rect_test",
        "attr_test",
        "color_test",
        "g_test",
        "lex_test",
        "style_test",
                
        "circle_test",
        "ellipse_test",
        "line_test",
                    
        "shape_test",
        // "transform_test"
    ];

    for(var i = 0 ;i < tests.length; ++i){
        var nextId = getNextId();

        // set the label for the test
        var label = document.getElementById("label_"+nextId.toString());        
        label.textContent = tests[i];

        // create a default svg canvas
        var canvas = svg.svgRoot(nextId.toString(),300,300);
        var f = (function(canvas){
            // create a closure around the canvas that we want to use.
            return function(test){
                test(canvas,T);
            }
        }(canvas));

        // require the test and the run it.
        require(["tests/"+tests[i]],f);
    }
});
