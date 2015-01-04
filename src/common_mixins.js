svg.module(function(lib){
lib.modules["common"] = common;

// has dependencies on svgElem.js,attr.js
var util = lib.util;
var svgElem = lib.svgElem;
function common(){}

common.asViewport = function(){    
    // receive a rect specifying the viewport units for the element.
    this.viewBox = function(x,y,w,h){
        if( x === undefined){
            var rs = this.attr("viewBox");
            if( rs === null){return null;}
            
            rs = rs.split(" ");
            return {
                x : parseFloat(rs[0]),
                y : parseFloat(rs[1]),
                w : parseFloat(rs[2]),
                h : parseFloat(rs[3])
            }                
        }else{
            this.attr('viewBox',[x,y,w,h].join(" "));
        }            
    }

    // align :
    //  none, x[Min,Mid,Max]Y[Min,Mid,Max]
    // meetOrSlice :
    //  meet,slice
    this.preserveAspectRatio = function(align,defer,meetOrSlice){            
        defer = (defer === undefined) ? "" : defer;
        meetOrSlice (meetOrSlice === udnefined) ? "" : meetOrSlice;                

        this.attr('preserveAspectRatio',defer + " " + align + " " + meetOrSlice);
        return this;
    }


    this.zoom = function(times){
        console.warn("zoom not implemented");
        return this;
    }

    return this;
}

common.asXlinkable = function(){
   this.href = function(val){
        if( val === undefined){
            return this.attr("xlink:href");
        }else{
            if(val.charAt(0)!=="#"){
                val = "#"+val;
            }

            this.attr("xlink:href",val,svgElem.prototype.xlink_ns);
            return this;
        }
    }

    return this;
}

});