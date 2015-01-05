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

common.applyAnimationProps = function(){
    var props = [
        // CSS | XML | auto
        {desired:"attributeType"},

        // the attribute name that we want to modify
        {desired:"attributeName"},

        // clock-value |  <id>.[begin|end] | <id>.[event_type]
        // id.repeat(number) | accessKey(char) | realworld-clock_time
        // indefinite
        {desired:"begin"},
        {desired:"end"},

        // clockvalue hh:mm:ss.iii | indefinite     
        {desired:"dur"},

        // clockvalue hh:mm:ss.iii , default is 0
        {desired:"min"},
        {desired:"max"},

        // always  | whenNotActive | never
        {desired:"restart"},

        // number | indefinite
        {desired:"repeatCount"},

        // clockvalue hh:mm:ss.iii | indefinite
        {desired:"repeatDur"},

        // remove (default)  | freeze
        {desired:"fill"},

        // discrete | linear | paced | spline
        {desired:"calcMode"},

        // list of semi-colon base values
        // 60; 110; 60; 10; 60;    
        {desired:"values",munger:mungeSemicolonNumbersList},

        //0; 0.25; 0.5; 0.75; 1
        {desired:"keyTimes",munger:mungeSemicolonNumbersList},

        // list of bezier curve points
        // x1 y1 x2 y2
        // ignored unless the calcMode is set to spline
        {desired:"keySplines", munger:mungeNumbersList},

        // from, to values for the attribute to go between
        {desired:"from",isNum:true,munger:mungeNumbersList},
        {desired:"to",isNum:true,munger:mungeNumbersList},

        {desired:"by"},
        {desired:"autoReverse"},    
        {desired:"accelerate"},
        {desired:"decelerate"},

        // replace (default) | sum
        {desired:"additive"},

        // none | sum
        {desired:"accumulate"}
    ];

    this.attr.DirectAccess(this,props);

    function mungeSemicolonNumbersList(val,isGet){
        if( val === null){return null;}

        var rs;
        if(isGet ){
            // convert string into an array of numbers
            rs = [];
            val.replace(util.regex.semiColonValues,function(_,num){
                num && rs.push(util.toNum(num));
            });
            return rs;

        }else{
            if( util.is(val,"array")){
                return val.join(";");
            }else{
                return val;
            }
        }
    }

    function mungeNumbersList(val,isGet){
        if( val === null){return null;}
        if( isGet){
            // val is a string
            var rs = val.split(util.regex.split_seperator).map(function(v,k,arr){
                return util.toNum(v);
            });
            return rs;

        }else{
            if(util.is(val,"array")){
                var s = val.join(" ");
                return s;
            }else{
                return s;
            }
        }
    }
}

});