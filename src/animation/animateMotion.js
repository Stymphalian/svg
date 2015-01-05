//animateMotion.js
svg.extend(function(svgElem,util,modules){
    svgElem.prototype.animateMotion = animateMotion;
    animateMotion.asAnimateMotion = asAnimateMotion;
    
    function animateMotion(d){
        var e = new svgElem("animateMotion",this.dom);
        asAnimateMotion.call(e);

        if( d.charAt(0) === "#"){
            e.mpath(d);
        }else{
            e.attr("path",d);
        }        

        return e;
    }


    function asAnimateMotion(){
        modules.common.applyAnimationProps.call(this);

        var props = [
            {desired:"rotate"},
            {desired:"path"}           
        ];
        this.attr.DirectAccess(this,props);

        this.mpath = function(href){
            var e = null;
            if( this.dom.hasChildNodes()){                
                var children = this.dom.childNodes;
                for (var i = 0;i < children.length; ++i){
                    if( children[i].nodeName === "mpath"){
                        e = children[i];
                        break;
                    }
                }
            }

            if( href === undefined){
                // getter
                if( e === null){return null;}
                return this.attr.attrInternal(this,e,"xlink:href");

            }else{
                // setter

                // don't have an mpath node therefore make one.
                if( e === null){
                    e = new svgElem("mpath",this.dom);
                    e = e.dom;
                }

                this.attr.attrInternal(this,e,"xlink:href",href,this.xlink_ns);
            }
        }
        
        return this;
    }
});