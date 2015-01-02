define(function(){
return function(canvas,T){
    //  "font-family": "Arial,Verdana,Helvetica",
    //  "font-size":"45px",
    //  "font-size-adjust":0, // aspect ratio to preserve x-height       
    //  "font-stretch":"normal,wider,narrower,[ultra,extra,semi]-condensed,[ultra,extra,semi]-expanded",    
    //  "font-style": "normal,italic,oblique,inherit",
    //  "font-variant": "normal,small-caps,inherit",
    //  "font-weight": "normal,bold,bolder,lighter,100-900,inherit",

    var f = canvas.text("svg Man its GOOD!",10,40);
    f.font.family = "Verdana";
    f.font.size = "20pt";
    f.font.size_adjust = 5;
    f.font.stretch = "ultra_condensed";
    f.font.style ="italic";
    f.font.variant= "small-caps";
    f.font.weight = "bolder";

    var f2 = f.clone();
    f2.attr({x:100,y:180});
    f2.font.family = "Helvetica";
    f2.font.size = 15;
    f2.font.size_adjust = 0;
    f2.font.stretch = "wider";
    f2.font.style ="oblique";
    f2.font.variant= "normal";
    f2.font.weight = "lighter";
}

});