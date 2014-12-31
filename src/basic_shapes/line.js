// line.js
svg.extend(function(svgElem,util){
    svgElem.prototype.line = line;    
    line.asLine = asLine


    function line(x1,y1,x2,y2){
        var e = new svgElem("line",this.dom);
        e.attr({x1:x1,y1:y1,x2:x2,y2:y2});
        return asLine.call(e);
    }

    function asLine(){
        this.origin = function(x,y){
            if( x === undefined){
                return {
                    x: util.toNum(this.attr("x1")),
                    y: util.toNum(this.attr("y1")),
                };
            }else{
                this.attr({x1:x,y1:y});
                return this;
            }
        }

        this.dest = function(x,y){
            if( x === undefined){
                return {
                    x: util.toNum(this.attr("x2")),
                    y: util.toNum(this.attr("y2")),
                };
            }else{
                this.attr({x2:x,y2:y});
                return this;
            }
        }

        this.move = function(x,y){
            var p = this.attr(["x1","y1","x2","y2"]);
            p.x1 = util.toNum(p.x1) + x;
            p.y1 = util.toNum(p.y1) + y;
            p.x2 = util.toNum(p.x2) + x;
            p.y2 = util.toNum(p.y2) + y;
            this.attr(p);
            return this;
        }

        return this;
    }
});