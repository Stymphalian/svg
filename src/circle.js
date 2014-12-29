svg.plugin(function(svgElem){
    svgElem.prototype.circle = circle;

    function circle(x,y,r){
        var e = new svgElem("circle",this.dom);
        e.attr({'cx' : x, 'cy' :y ,'r':r});
        asCircle.call(e);
        return e;
    }

    function asCircle(){
        this.center = function(x,y){
            this.attr({'x':x,'y':y});
        }
        return this;
    }
});
