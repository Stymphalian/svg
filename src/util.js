//util.js
svg.module(function(lib){
// ---------------------
// util under the svgElem
// This is the one hacky way of getting a utils object into the svgElem namespace
// without cluttering everything inside svgElem
// whenever you build the library be sure to include directly after including the 
// svgElem.js file. In this way we can have all the utils method in a seperate file
// yet still have access to across the library.
// ---------------------    
function util(){}    
lib.util = util;

util.regex = {
    // TODO: rename this to split_seperator
    split_seperator : /[, ]/,

    // pathcommand,pathValue and number regex stolen from snap.svg
    // https://github.com/adobe-webplatform/Snap.svg/blob/master/src/svg.js
    pathCommand: /([a-z])[,\s]*((-?\d+\.?\d*(?:e[+-]?\d+)?\s*,?\s*)*)/gi,     
    pathValues: /(-?\d+\.?\d*(?:e[+-]?\d+)?)\s*,?\s*/gi,
    number: /(-?\d+\.?\d*(?:e[+-]?\d+)?)/,
};

// e.g
// svgElem.is(obj,"string")
// svgElem.is(obj,"object")
// svgElem.is(obj,"function")
// svgElem.is(obj,"array")
util.is = function(obj,typeName){
    if(obj === undefined || obj === null){return false;}

    var v = Object.prototype.toString.call(obj).toLowerCase();

    // trim the "[object "
    var s = "[object ";
    var rs = v.substring(s.length, s.length + typeName.length);
    return (rs === typeName);
}

util.isUpperCase = function(s){
    return( s.toUpperCase() === s);
}

// @purpose - convert the value into a number if possible
// @param v [antying] - the value to try to convert into a number
util.toNum = function(v){
    // NOTE: the '+' infront fo the v coerces the variable into a number
    // if it is not possible to do a proper coercion then a NaN is returned;        
    if( v === null){return null;}
    var rs = +v;
    if( isNaN(+v)){return v;}
    return rs;
}

// to -- the object to mixin in to
// from -- the object to take properties from
// force -- boolean which determines if you should overwrite the values in 'to'
util.mixin = function(to,from,force){
    force = ( force === undefined) ? false : force
    for( var k in from){
        if( Object.prototype.hasOwnProperty.call(from,k)){
            if( force || !Object.prototype.hasOwnProperty.call(to,k) ){
                to[k] = from[k];
            }
        }
    }
    return to;
}

util.mixinUsingFunc = function(to,from,func){
    for( var k in from){
        if( Object.prototype.hasOwnProperty.call(from,k)){
            to[k] = func(to,from,k);
        }
    }   
    return to;
}

util.mixinFromExports = function(to,from,namedExports,force){
    if( namedExports && Object.prototype.toString.call(namedExports) == '[object Array]'){return;}
    force = (force === undefined) ? false : force        

    var i,k;
    var n = namedExports.length;
    for( i = 0; i < n ; ++i){
        k = namedExports[i];
        if( Object.prototype.hasOwnProperty.call(from,k)){
            if( force || !Object.prototype.hasOwnProperty.call(to,k) ){
                to[k] = from[k];
            }
        }
    }   
    return to;
}




// @return { points: [], points_string: string}
//  returns the value in two representations
//      points = array of numbers
//      points_string = space seperated value representation of the points list
util.arrayOrString = function(p){
    var points = p;
    var points_string = "";

    if(util.is(p,"array")){
        // process as an array
        points = p;
        points_string = points.join(" ");
    }else if( util.is(p,"string")){
        points_string = points;
        points = points_string.split(util.regex.split_seperator).map(function(v,k,arr){
            return util.toNum(v);
        });
    }

    return {
        points:points,
        points_string: points_string
    };
}

// stolen from the dojo library (v.1.9)
util.clone = function(src){
    function mixin(dest,source,copyFunc){
        var name,s,i,empty ={};
        for(name in source){
            s = source[name];
            
            if(false === (name in dest) || (dest[name] !== s && ((name in empty) == false || empty[name] !== s))){
                dest[name] = copyFunc ? copyFunc(s) : s;
            }
        }
        return dest;
    }

    if(!src || typeof src != "object" || util.is(src,"function")){
        // null,undefined, non-object,function
        return src;
    }
    if( src.nodeType && "cloneNode" in src){
        // DOM node
        return src.cloneNode(true);
    }
    if( src instanceof Date){
        // Date
        return new Date(src.getTime());
    }
    if( src instanceof RegExp){
        return new RegExp(src);
    }

    var r;
    if( util.is(src,"array")){
        // array
        r = [];
        var n = src.length;
        for(var i =0; i < n; ++i){
            r.push(util.clone(src[i]));
        }
    }else{
        // object
        r = src.constructor ? new src.constructor() : {};
    }

    return mixin(r,src,util.clone);
}

});
