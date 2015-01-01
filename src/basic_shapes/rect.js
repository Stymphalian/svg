//rect.js
svg.extend(function(svgElem,util){
    svgElem.prototype.rect = rect;
    rect.asRect = asRect;

    function rect(x,y,w,h){
        var e = new svgElem("rect",this.dom);
        e.attr({'x':x,'y':y,"width":w,'height':h});
        return asRect.call(e);
    }

    function asRect(){
        // specifes the rounding of the rect corners.
        this.round = function(rx,ry){
            if( rx === undefined){
                return {
                    'rx':util.toNum(this.attr('rx')),
                    'ry':util.toNum(this.attr("ry"))
                };
            }else{
                this.attr({'rx':rx, 'ry':ry });
                return this;
            }            
        }
        return this;
    }

});