//transform.js
svg.plugin(function(svgElem,util){
    
return {
    name: "transform",
    constructor : function transform(context){        
        asTransform.call(this,context);
        return this;
    }
};

function asTransform(context){
    if( context === undefined || context === null){return this;}
    this.translate = function(){
        return context;
    }

    return this;
}

});