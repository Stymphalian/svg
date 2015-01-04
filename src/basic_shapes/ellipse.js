// ellipse.js
svg.extend(function(svgElem,util){
    svgElem.prototype.ellipse = ellipse;
    ellipse.asEllipse = asEllipse;

    function ellipse(cx,cy,rx,ry){
        var e = new svgElem("ellipse",this.dom);
        e.attr({'cx':cx,'cy':cy,'rx':rx,'ry':ry });
        return asEllipse.call(e);
    }

    function asEllipse(){
        // the plus tells use that we want the rx and ry attributes to
        // be coerced into numbers
        var d = [
            {desired:"rx",isNum:true},
            {desired:"ry",isNum:true},
        ];
        this.attr.DirectAccess(this,d);

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