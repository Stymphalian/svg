//g.js
svg.extend(function(svgElem,util){
    svgElem.prototype.g = g;
    g.asG = asG;

    function g(){
        var e = new svgElem("g",this.dom);
        return asG.call(e);        
    }

    
    function asG(){
        return this;
    }
    
});