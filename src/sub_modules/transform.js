svg.plugin(function(svgElem,util){
    
return {
    name: "transform",
    constructor : function transform(context){        
        asTransform.call(this,context);
        return this;
    }
};

function asTransform(context){
    this.translate = function(){
        return context;
    }

    return this;
}

});