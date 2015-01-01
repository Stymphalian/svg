//circle.js
svg.extend(function(svgElem,util){
    svgElem.prototype.circle = circle;
    circle.asCircle = asCircle;

    function circle(x,y,r){
        var e = new svgElem("circle",this.dom);
        e.attr({'cx' : x, 'cy' :y ,'r':r});
        asCircle.call(e);
        return e;
    }


    function asCircle(){        
        this.radius = function(val){
            if( val === undefined){
                return util.toNum(this.attr("r",val));
            }else{
                this.attr("r",val);
            }            
        }

        this.center = function(x,y){
            if( x === undefined){
                return {
                    'cx':util.toNum(this.attr('cx')),
                    'cy':util.toNum(this.attr('cy'))
                };
            }else{
                this.attr({'cx':x,'cy':y});    
                return this;
            }            
        }
        return this;
    }
});
