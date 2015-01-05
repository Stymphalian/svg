//animateMotion.js
svg.extend(function(svgElem,util,modules){
    svgElem.prototype.animateMotion = animateMotion;
    animateMotion.asAnimateMotion = asAnimateMotion;
    
    function animateMotion(attrName){
        var e = new svgElem("animateMotion",this.dom);
        asAnimateMotion.call(e);
        e.attr()
        e.attr({
            // attributeType:"XML",
            attributeName:attrName            
        });

        return e;
    }

    function asAnimateMotion(){
        modules.common.applyAnimationProps.call(this);

        var props = [
            {desired:"rotate"},
            {desired:"path"},
            {desired:"mpath"}
        ];
        this.attr.directAccess(this,props);
        
        return this;
    }
});