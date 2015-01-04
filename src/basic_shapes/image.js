svg.extend(function(svgElem,util){
    svgElem.prototype.image = image;
    image.asImage = asImage;

    function image(href,x,y,w,h){
        var e = new svgElem("image",this.dom);

        if( href !== undefined){
            e.attr("xlink:href",href,svgElem.prototype.xlink_ns);
        }
        if( x !== undefined){ e.attr("x",x);}
        if( y !== undefined){ e.attr("x",y);}
        if( w !== undefined){ e.attr("width",w);}
        if( h !== undefined){ e.attr("height",h);}

        return asImage.call(e);
    }

    function asImage(){
        var props = [
            {desired:"x",isNum:true},
            {desired:"y",isNum:true},
            {desired:"width",isNum:true},
            {desired:"height",isNum:true}
        ]
        this.attr.DirectAccess(this,props);

        this.href = function(val){
            if(val === undefined){
                return this.attr("xlink:href");
            }else{                
                this.attr("xlink:href",val,svgElem.prototype.xlink_ns);
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

        return this;
    }

});