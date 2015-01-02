//style.js
svg.plugin(function(svgElem,util){

return {
    name : 'style',
    constructor : style
};

function style(context){
    var f = function(styleString){
        return context.attr("style",styleString);
    }
    asStyle.call(f,context);
    return f;
}

function asStyle(context){
    if( context === undefined || context === null){return this;}
    
    function clamp01(val){
        if(val < 0 ){val = 0;}
        if(val > 1.0){val = 1.0;}
        return val;
    }

    function setAttrFloat(name,val){
        if( val === undefined){
            var val = this.attr(name);
            if( val != null){
                return util.toNum(val);
            }else{
                return null;
            }

        }else{
            val = clamp01(util.toNum(val));
            this.attr(name,val);
            return this;
        }
    }

    function setArrayOrStringAttr(name,val){
        var rs;
        if( val === undefined){
            rs = this.attr(name);
            if( rs === null){return null;}
            
            rs = rs.split(" ").map(function(v,k,arr){
               return util.toNum(v);
            });            
            return rs;

        }else{
            // we have been passed an array therefore convert into a string
            if(util.is(val,"array")){
                rs = val.join(" ");
            }else{
                rs = val;
            }
            this.attr(name,rs);
            return this;
        }
    }


    // stroke style property
    this.stroke = stroke;

    // @param val [string] - val can be either a hex string,color, or an rgb
    //      #ff0033
    //      rgb(0,0.5,1.0)
    //      red,green,blue,
    function stroke(val){
        return context.attr("stroke",val);
    }

    // @param val [string|number] - set the width of the stroke
    //  available units include: em,ex,px,pt,pc,cm,mm,in
    //  default units is px
    stroke.width = function(val){        
        return util.toNum(context.attr("stroke-width",val));
    }

    stroke.opacity = function(val){
        return setAttrFloat.call(context,"stroke-opacity",val);
    }    
    // @param val [string,array]    
    //      string with space seperated values of numbers
    //      array of numbers
    // @return [array] - array of numbers representing the dash_array
    stroke.dasharray = function(val){
        return setArrayOrStringAttr.call(context,"stroke-dasharray",val);
    }

    // @param val [string] - how far into the dash array should the dasharray pattern be started.
    stroke.dashoffset = function(val){
        return context.attr("stroke-dashoffset",val);
    }

    // What cap should the lines have.
    // @param val [string]  - butt, round,square, inherit
    stroke.linecap = function(val){
        return context.attr("stroke-linecap",val);
    }

    // the type of caps when two lines join.
    // @param val [string] - miter,round,bevel,inherit
    stroke.linejoin = function(val){
        return context.attr("stroke-linejoin",val);
    }

    // @param val [number] - must be > 1.0 the amount of miter
    stroke.miterlimit = function(val){
        if ( val < 1.0 ){val = 1.0}
        return context.attr("miterlimit",val);        
    }


    // fill style property
    // @param [string] - val can be either a hex string,color, or an rgb
    //      #ff0033
    //      rgb(0,0.5,1.0)
    //      red,green,blue,
    this.fill = fill;
    function fill(val){
        return context.attr("fill",val);
    }

    // @param [float,string,undefined] - the value to set the opacity.
    //      clamped between 0 and 1.0f
    // @return [float]
    fill.opacity = function(val){
        return setAttrFloat.call(context,"fill-opacity",val);
    }

    // @param val [string] - nonzero,evenodd
    fill.rule = function(val){
        return context.attr("fill-rule",val);
    }    




    this.marker = marker;
    function marker(val){}
    marker.start = function(){}
    marker.mid = function(){}
    marker.end = function(){}

    //text-rendering
    //alignment-baseline
    //baseline-shift
    //dominant-baseline
    //gylph-orientation-horizontal
    //gylph-orientation-vertical
    //kerning
    //stop-color
    //stop-opacity

}

}); 