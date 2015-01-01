svg.extend(function(svgElem,util){
    svgElem.prototype.use = use;
    use.asUse = asUse;

    function use(href,x,y,width,height){
        var e = new svgElem("use",this.dom);

        if( href !== undefined){
            if(href.charAt(0)!=="#"){
                href = "#"+href;
            }
            e.attr("xlink:href",href,svgElem.prototype.xlink_ns);

            // set the x,y pos if it was given
            if( x!== undefined){e.attr("x",x);}
            if( y!== undefined){e.attr("y",y);}
            if( width!== undefined){e.attr("width",width);}
            if( height!== undefined){e.attr("height",height);}
        }

        return asUse.call(e);
    }

    function asUse(){
        this.attr.DirectAccess(this,["+x","+y","+width","+height"]);

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