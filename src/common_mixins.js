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

// @param x_name [string] - the string of the property for the x part of the point
// @param y_name [string] - the string of the property for the x part of the point
// @param munger [function] - optional. function(val,isGet){}
common.makePointProperty = function(x_name,y_name,munger){    
    return function(x,y){
        if( x === undefined){
            x = this.attr(x_name);
            y = this.attr(y_name);
            if(munger !== undefined){
                x = munger(x,true);
                y = munger(x,true);
            }

            var rs = {};
            rs[x_name] = x;
            rs[y_name] = y;
            return rs;

        }else{
            if(munger !== undefined){
                x = munger(x,false);
                y = munger(y,false);
            }
            this.attr(x_name,x);
            this.attr(y_name,y);
            return this;
        }
    }
}

});