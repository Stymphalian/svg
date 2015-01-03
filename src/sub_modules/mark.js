svg.plugin(function(svgElem,util){

// this plugin allows the user to quickly set the
// marker-[start|middle|end] properties of an svg line,polyling,polygon 
// and path element

return {
    name: "mark",
    constructor : mark
};

function mark(context){
    asMark.call(this,context);
    return this;
}

function asMark(context){

    function markAccess(context,type,id){
        if( id === undefined){
            var rs = context.attr(type);
            if( rs === undefined || rs == null){
                return "";
            }

            // position 5 allows us to chop off the 'url(#' part of the string
            // the -1 allows us to take off the end ')'
            return rs.slice(5,-1);                        
        }else{
            // append the # if it is missing
            if( id.charAt(0) !== '#'){
                id = "#" + id;
            }
            context.attr(type,"url(" + id +  ")");
            return context;
        }        
    }

    // set properties of the marker plugin
    this.start = function(id){return markAccess(context,"marker-start",id);}
    this.mid = function(id){return markAccess(context,"marker-mid",id);}
    this.end = function(id){return markAccess(context,"marker-end",id);}

    return context;
}

})