svg.extend(function(svgElem,util){
    svgElem.prototype.a = a;
    a.asA = asA;

    function a(href){
        var e = new svgElem("a",this.dom);

        asA.call(e);
        e.href(href);

        return e;
    }

    function asA(){
        this.href = function(val){
            if( val === undefined){
                return this.attr("xlink:href");
            }else{                
                this.attr("xlink:href",val,svgElem.prototype.xlink_ns);
                return this;
            }
        }

        // @param show [string] - new | replace
        this.show = function(val){
            if( val === undefined){
                return this.attr("xlink:show");
            }else{                
                this.attr("xlink:href",val, svgElem.prototype.xlink_ns);
                return this;
            }
        }

        // @param val [string] - _blank | _top
        this.target = function(val){
            return this.attr("target",val);
        }

        return this;
    }

});