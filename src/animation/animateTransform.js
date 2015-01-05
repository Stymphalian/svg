//animateTransform.js
svg.extend(function(svgElem,util,modules){
    svgElem.prototype.animateTransform = animateTransform;
    animateTransform.asAnimateTransform = asAnimateTransform;
    
    function animateTransform(type){
        var e = new svgElem("animateTransform",this.dom);
        asAnimateTransform.call(e);
        
        var attrName ="transform";
        if( this.dom.nodeName === "linearGradient" || this.dom.nodeName === "radialGradient"){
            attrName = "gradientTransform";
        }else if (this.dom.nodeName === "pattern"){
            attrName = "patternTransform";
        }
        e.attr({
            attributeName:attrName,
            type:type
        });

        return e;
    }

    function asAnimateTransform(){
        modules.common.applyAnimationProps.call(this);
        var props = [
            // auto | ??
            {desired:"rotate"},

            // translate | rotate | skewX | skewY | scale
            {desired:"type"}
        ];
        this.attr.DirectAccess(this,props);

        return this;
    }
});