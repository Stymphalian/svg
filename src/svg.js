svg.plugin(function(svgElem){
    svgElem.prototype.svg = svg;
    svgElem.prototype.svgRoot = svgRoot;

    function svgRoot(parentElementId,width,height){
        var container = document.getElementById(parentElementId);       
        if( container === null){
            console.error("Invalid parent container id");
            return null;
        }

        if( width === undefined){width = container.clientWidth;}
        if( height === undefined){height = container.clientHeight;}
        var canvas = svg(0,0,width,height);
        canvas.dom.setAttribute("xmlns",svgElem.prototype.svg_ns);
        canvas.dom.setAttributeNS(svgElem.prototype.svg_ns,"xlink",svgElem.prototype.xlink_ns);
        canvas.attr({
                    "version":"1.1",
                    "baseProfile":"full",        
                    });
        // TODO: Find out why I can't use the attr to set this attribute

        container.appendChild(canvas.dom);
        return canvas;
    }

    function svg(x,y,w,h){
        var e = new svgElem("svg",this.dom);
        e.attr({'x' :x, 'y' :y ,'width' : w, 'height' :h });

        asSvg.call(e);
        return e;
    }

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

        // receive a rect specifying the viewport units for the element.
        this.viewBox = function(x,y,w,h){
            this.attr('viewBox',[x,y,w,h].join(" "));
        }

        // align :
        //  none, x[Min,Mid,Max]Y[Min,Mid,Max]
        // meetOrSlice :
        //  meet,slice
        this.preserveAspectRatio = function(align,defer,meetOrSlice){            
            defer = (defer === undefined) ? "" : defer;
            meetOrSlice (meetOrSlice === udnefined) ? "" : meetOrSlice;                

            this.attr('preserveAspectRatio',defer + " " + align + " " + meetOrSlice);
        }

        return this;        
    }

})