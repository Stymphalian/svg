// tspan.js tref.js, textPath.js
svg.extend(function(svgElem,util){
    svgElem.prototype.tspan = tspan;
    svgElem.prototype.tref = tref;
    svgElem.prototype.textPath = textPath;

    tspan.asTspan = asTspan;
    tref.asTref = asTref;
    textPath.asTextPath = asTextPath;

    // ---------------------------
    // tspan
    // ---------------------------
    function tspan(text,dx,dy){
        var e = new svgElem("tspan",this.dom);

        asTspan.call(e);
        if(text !== undefined){e.text(text);}
        if(dx !== undefined){e.dx(dx);}
        if(dx !== undefined){e.dy(dy);}
        return e;
    }

    function asTspan(){
        asTextExtension.call(this);
        return this;
    }
    
    // -----------------------
    // tref
    // -----------------------
    function tref(href,dx,dy){
        var e = new svgElem("tref",this.dom);

        asTref.call(e);
        if(href !== undefined){e.href(href);}
        if(dx !== undefined){e.dx(dx);}
        if(dy !== undefined){e.dy(dy);}        

        return e;
    }


    // TODO: currently not working..
    function asTref(){
        asTextExtension.call(this);

        this.href = function(val){
            if( val === undefined){
                return this.attr("xlink:href");
            }else{
                if(val.charAt(0)!=="#"){
                    val = "#"+val;
                }

                this.attr("xlink:href",val,svgElem.prototype.xlink_ns);
                return this;
            }
        }

        return this;
    }


    // -----------------------
    // textPath 
    // -----------------------    

    // @param href [string] - the id of the target path we want to use in the textPath
    // @param t [string] - the text that we want to follow the path
    function textPath(href,t){
        var e = new svgElem("textPath",this.dom);

        asTextPath.call(e);
        e.href(href);
        if(t !== undefined){e.text(t);}

        return e;
    }

    // TODO extend the textElement to allow them to create paths out of the given text.    

    function asTextPath(){
        asTextExtension.call(this);        

        this.href = function(val){
            if( val === undefined){
                return this.attr("xlink:href");
            }else{
                if(val.charAt(0)!=="#"){
                    val = "#"+val;
                }

                this.attr("xlink:href",val,svgElem.prototype.xlink_ns);
                return this;
            }
        }

        return this;
    }

    function asTextExtension(){
        // HACKY. we need a ref to the asText mixin
        svgElem.prototype.text.asText.call(this);

        var props = ["dx","dy"];
        // getter
        // @return [array] -  an array of points defining the the dx or dy
        // setter
        // @param val [array,string] - set the offset using an array of numbers or a string
        for (var i =0; i < props.length;++i){
            // crate a closure to hold the context and key for
            // the property we want to handle
            this[props[i]] = (function(context,key){

                return function(val){
                    if( val === undefined){
                        // getter
                        var rs = context.attr(key);
                        rs = rs.split(util.regex.split_seperator).map(function(v,k,arr){
                            return util.toNum(v);
                        });
                        return rs;
                    }else{
                        // setter
                        if( util.is(val,"array")){
                            context.attr(key,val.join(" "));
                        }else if( util.is(val,"string") || util.is(val,"number")){
                            context.attr(key,val);
                        }
                        return context;
                    }                    
                }

            }(this,props[i]));
        }

        
        (function(context){
            context.baseline = function(){}

            // @param val = auto | baseline | sup | sub | <percentage> | <length> | inherit
            context.baseline.shift = function(val){
                return context.attr("baseline-shift",val);
            }

            // @param val = none | baseline | before-edge | text-before-edge | middle | central | after-edge
            //      text-after-edge | alphabetic | hanging | mathemtical | inherit
            context.baseline.alignment = function(val){    
                return context.attr("alignment-baseline",val);
            }

            // @param val = auto | use-script |no-change | reset-size | ideographic | alphabetic | hanging | mathematical 
            //      central | middle | text-after-edge | text-before-edge | inherit
            context.baseline.dominant = function(val){
                return context.attr("dominant-baseline",val);            
            }
        }(this));

        return this;
    }
});
