svg.extend(function(svgElem,util,modules){
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
        var d = [
            {desired:"x",isNum:true},
            {desired:"y",isNum:true},
            {desired:"width",isNum:true},
            {desired:"height",isNum:true}
        ];
        this.attr.DirectAccess(this,d);

        modules.common.asXlinkable.call(this);

        return this;
    }

});