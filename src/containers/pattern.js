svg.extend(function(svgElem,util,modules){
    svgElem.prototype.pattern = pattern;
    pattern.asPattern = asPattern;

    function pattern(id,x,y,width,height){
        var e = new svgElem("pattern",this.dom);

        e.attr({
            id:id, x:x,y:y,
            width:width,height:height,
            patternUnits : "userSpaceOnUse"
        });

        asPattern.call(e);
        return e;
    }

    function asPattern(){
        var props = [
            {desired:"id"},

            // userSpaceOnUse | objectBoundingBox
            {desired:"units",real:"patternUnits"},

            // userSpaceOnUse | objectBoundingBox
            {desired:"contentUnits",real:"patternContentUnits"},

            {desired:"x",isNum:true},
            {desired:"y",isNum:true},
            {desired:"width",isNum:true},
            {desired:"height",isNum:true},            
        ];
        this.attr.DirectAccess(this,props);

        modules.common.asViewport.call(this);
        modules.common.asXlinkable.call(this);

        return this;
    }

});