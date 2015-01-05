//clipPath.js
svg.extend(function(svgElem,util,modules){
    svgElem.prototype.clipPath = clipPath;
    clipPath.asClipPath = asClipPath;

    function clipPath(id){
        var e = new svgElem("clipPath",this.dom);

        e.attr("id",id);
        asClipPath.call(e);

        return e;
    }

    function asClipPath(){
        var props= [
            {desired:"id"}
        ];
        this.attr.DirectAccess(this,props);

        return this;
    }

});