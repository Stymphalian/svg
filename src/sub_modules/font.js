svg.plugin(function(svgElem,util){
return {
    name : "font",
    constructor :  function font(context){
        asFont.call(this,context);
        return this;
    }
};


//  "font-family": "Arial,Verdana,Helvetica",
//  "font-size":"45px",
//  "font-size-adjust":0, // aspect ratio to preserve x-height       
//  "font-stretch":"normal,wider,narrower,[ultra,extra,semi]-condensed,[ultra,extra,semi]-expanded",    
//  "font-style": "normal,italic,oblique,inherit",
//  "font-variant": "normal,small-caps,inherit",
//  "font-weight": "normal,bold,bolder,lighter,100-900,inherit",
function asFont(context){
    if( context === undefined || context === null){return this;}

    var props = [
        {desired:"family",real:"font-family"},
        {desired:"size",real:"font-size"},
        {desired:"size_adjust",real:"font-size-adjust"},
        {desired:"stretch",real:"font-stretch"},
        {desired:"style",real:"font-style"},
        {desired:"variant",real:"font-variant"},
        {desired:"weight",real:"font-weight"},
    ];
    context.attr.DirectAccessNoFunction(this,props,context);
    
    return this;
}


});