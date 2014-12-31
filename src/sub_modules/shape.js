svg.plugin(function(svgElem,util){    

return {
    name : "shape",
    constructor :  function shape(context){
        asShape.call(this,context);
        return this;
    }
};

function asShape(context){
    // setup direct access for each of these properties    
    var d = ['+x','+y','+width','+height','+rx','+ry','+r','+cx','+cy'];
    context.attr.DirectAccessNoFunction(this,d,context);
    

    // TODO: doesn't seem like a good way to determine if 
    // the svgElem is 'circular' ( i.e for circles,ellipse)
    function isCircular(context){
        return (context.attr('cx') !== null);
    }
    function isEllipse(context){
        return (context.attr("rx") !== null);
    }
    
    // set the x and y position of the shape
    // if the object does not have an x,y then nothing happens
    // TODO: this is not well defined for <line> or <polyline>
    this.pos = function(x,y){
        if(isCircular(context) ){
            if( x === undefined){
                return {
                    'cx':util.toNum(context.attr("cx")),
                    "cy":util.toNum(context.attr("cy"))
                };
            }else{
                context.attr({"cx":x,"cy":y});
                return context;
            }
        }else{
            if( x === undefined){
                return {
                    'x':util.toNum(context.attr('x')),
                    'y':util.toNum(context.attr('y'))
                };
            }else{
                context.attr({'x':x,'y':y});
                return context;
            }
        }
    }

    // set the width and height of the svgElement
    // if the element does not have a width and height then nothing happens.
    this.size = function(w,h){        
        if( isEllipse(context)){
            if( w === undefined){
                return {
                    "rx":util.toNum(context.attr("rx")),
                    "ry":util.toNum(context.attr("ry"))
                };
            }else{
                context.attr({"rx":w,"ry":h});
                return context;
            }

        }else if (isCircular(context)){
            if( w === undefined){
                return {"r":util.toNum(context.attr("r"))};
            }else{
                context.attr({"r":w});
                return context;
            }

        }else{        
            if( w === undefined){
                return {
                    'width' : util.toNum(context.attr('width')),
                    'height' : util.toNum(context.attr('height'))
                };
            }else{
                context.attr({'width':w,'height':h});
                return context;
            }
        }
    }

    this.move = function(x,y){
        if( x === undefined){return null;}

        // check for polyline or line
        if(context.attr("points") !== null ){

        }else if( context.attr("x1") !== null){
            // move the line.
            var p = context.attr(["x1","y1","x2","y2"]);
            p.x1 = util.toNum(p.x1) + x;
            p.y1 = util.toNum(p.y1) + y;
            p.x2 = util.toNum(p.x2) + x;
            p.y2 = util.toNum(p.y2) + y;
            context.attr(p);
            return context;
        }

        var p = this.pos();        
        if(isCircular(context) ){
            context.attr({"cx":x + p.cx,"cy":y + p.cy});
        }else{         
            context.attr({'x':x + p.x,'y':y + p.y});
        }
        return context;
    }

    return this;
}
     
});