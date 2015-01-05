//clipPath.js
svg.extend(function(svgElem,util,modules){
    svgElem.prototype.clipPath = clipPath;
    clipPath.asClipPath = asClipPath;
    svgElem.prototype.clip_path = clip_path;

    function clipPath(id){
        var e = new svgElem("clipPath",this.dom);

        e.attr("id",id);
        asClipPath.call(e);

        return e;
    }

    function asClipPath(){
        var props= [
            {desired:"id"},

            // userSpaceOnUse | objectBoundingBox
            {desired:"units",real:"clipPathUnits"},
        ];
        this.attr.DirectAccess(this,props);

        return this;
    }

    function clip_path(id){
        if(id === undefined){
            return this.attr("clip-path");
        }else{
            this.attr("clip-path",id)
            return this;
        }
        
    }

});