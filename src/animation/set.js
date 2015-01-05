//set.js
svg.extend(function(svgElem,util,modules){
    svgElem.prototype.set = set;
    set.asSet = asSet;
    
    function set(attrName,to,begin){
        var e = new svgElem("set",this.dom);
        asSet.call(e);
        e.attr({attributeName:attrName});
        return e;
    }

    function asSet(){
        modules.common.applyAnimationProps.call(this);
        return this;
    }
});