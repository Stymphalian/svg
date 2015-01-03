//svg.js
svg.extend(function(svgElem,util,modules){
    svgElem.prototype.svg = function svg(x,y,w,h){
        var e = new svgElem("svg",this.dom);
        e.attr({'x' :x, 'y' :y ,'width' : w, 'height' :h });

        asSvg.call(e);
        return e;
    }
    svgElem.prototype.svg.asSvg = asSvg;

    function asSvg(){                
        this.pos = function(x,y){
            if(x === undefined) {
                var attrs = this.attr['x','y'];
                if(attrs !== null) {
                    return {
                        x:attrs[0],
                        y:attrs[1]
                    };
                }
            }else{
                this.attr({'x' : x,'y' : y});    
            }            
        }

        // mixin viewport properties to the element.s
        modules.common.asViewport.call(this);

        return this;        
    }
});

svg.module(function(lib){
    lib.svgRoot = svgRoot;

    var svgElem = lib.svgElem;    
    svgElem.prototype.svgRoot = svgRoot;
    svgRoot.asSvgRoot = svgElem.prototype.svg.asSvg;

    // dependencies required
    // svgElem.js, svg.js
    // allow the user to create a top-level svg element under a div or iframe
    function svgRoot(parentElementId,width,height){
        var container = document.getElementById(parentElementId);       
        if( container === null){
            console.error("Invalid parent container id");
            return null;
        }

        if( width === undefined){width = container.clientWidth;}
        if( height === undefined){height = container.clientHeight;}

        // create the new svgElem
        var canvas = new svgElem("svg",container);
        canvas.attr({'x' :0, 'y' :0 ,'width' : width, 'height' :height });
        svgElem.prototype.svg.asSvg.call(canvas);
        
        canvas.dom.setAttribute("xmlns",svgElem.prototype.svg_ns);
        canvas.dom.setAttributeNS(svgElem.prototype.xml_ns,"xmlns:xlink",svgElem.prototype.xlink_ns);
        canvas.attr({"version":"1.1", "baseProfile":"full"});
        
        return canvas;
    }
});