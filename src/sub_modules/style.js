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
    function stroke(val){
        return context.attr("stroke",val);
    }
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

    

    // fill style property
    // @param [string] - val can be either a hex string, or a color (i.e. blue, green,red)
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
}

}); 