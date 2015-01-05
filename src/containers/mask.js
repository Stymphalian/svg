svg.extend(function(svgElem,util,modules){
    svgElem.prototype.mask = mask;
    mask.asMask = asMask;
    svgElem.prototype.use_mask = use_mask;

    function mask(id,x,y,width,height){
        var e = new svgElem("mask",this.dom);
        asMask.call(e);
        e.attr({
            id:id,
            x:x,y:y,width:width,height:height
        });
        return e;
    }

    function asMask(){
        var props = [
            {desired:'id'},
            {desired:"x",isNum:true},
            {desired:"y",isNum:true},
            {desired:"width",isNum:true},
            {desired:"height",isNum:true},
            {desired:"units",real:"maskUnits",isNum:true},
            {desired:"contentUnits",real:"maskContentUnits",isNum:true},
        ];
        this.attr.DirectAccess(this,props);

        return this;
    }

    function use_mask(id){
        if(id === undefined){
            return this.attr("mask");
        }else{
            this.attr("mask","url("+id+")");
            return this;
        }
    }

});