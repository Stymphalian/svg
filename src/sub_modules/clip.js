svg.plugin(function(svgElem,util,modules){

return {
    name:"clip",
    constructor: clip
};

function clip(context){
    asClipPath.call(this,context);
    return this;
}

function asClip(context){
    this.path = function(id){
        context.attr("clip-path","url("+id+")");
    }    
    return this;
}

});