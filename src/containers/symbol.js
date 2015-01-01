svg.extend(function(svgElem,util){
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
                
        // TODO: this was copied direclty from the svg.js:asSvg() method        
        // receive a rect specifying the viewport units for the element.
        this.viewBox = function(x,y,w,h){
            if( x === undefined){
                var rs = this.attr("viewBox");
                if( rs === null){return null;}
                
                rs = rs.split(" ");
                return {
                    x : util.toNum(rs[0]),
                    y : util.toNum(rs[1]),
                    w : util.toNum(rs[2]),
                    h : util.toNum(rs[3])
                }                
            }else{
                this.attr('viewBox',[x,y,w,h].join(" "));
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