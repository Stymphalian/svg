//animate.js
svg.extend(function(svgElem,util,modules){
    svgElem.prototype.animate = animate;
    animate.asAnimate = asAnimate;
    
    function animate(attrName){
        var e = new svgElem("animate",this.dom);
        asAnimate.call(e);
        e.attr({
            // attributeType:"XML",
            attributeName:attrName            
        });

        return e;
    }

    function asAnimate(){
        modules.common.applyAnimationProps.call(this);
        return this;
    }
});