//lex.js
svg.plugin(function(svgElem,util){

return {
    name:"lex",
    constructor : function lex (context){
        asLex.call(this,context);
        return this;
    }
};

function asLex(context){
    if( context === undefined || context === null){return this;}
    
    // @return [svgElem] - an svgElem which wraps the dom node.
    this.parse = function(dom){ 
        if( dom === undefined){return null;}
        
        var tag_name = dom.tagName.toLowerCase();
        var e = new svgElem(dom);
        
        // call the as<ThingToMixin> on the element
        // in order to obtain all the necessary properties and methods
        // for this specific type of svg dom node
        // i.e if the dom node we got is a <cirlce>
        // then we apply the asCircle mixin to our svgElem
        var f = svgElem.prototype[tag_name];
        function capFirstLetter(s){
            return s.charAt(0).toUpperCase() + s.slice(1);
        }

        // by convention, the as<ThingToMixin> method is a property
        // of the svgElem.<thingToMixin> function
        // i.e svgElem.circle.asCircle.call(<element>);
        f["as"+capFirstLetter(f.name)].call(e);

        return e;
    }

    return this;
}

});