svg.extend(function(svgElem,util,modules){
    svgElem.prototype.symbol = symbol;
    symbol.asSymbol = asSymbol;

    // @param id [string] - optional. Assign the id of this svgElem
    function symbol(id){
        var e = new svgElem("symbol",this.dom);

        if( id !== undefined){
            e.attr("id",id);
        }

        return asSymbol.call(e);
    }

    function asSymbol(){
        this.id = function(val){
            return this.attr("id",val);
        }

        modules.common.asViewport.call(this);
                
        return this;
    }
});