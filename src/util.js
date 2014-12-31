(function(lib){

// ---------------------
// util under the svgElem
// This is the one hacky way of getting a utils object into the svgElem namespace
// without cluttering everything inside svgElem
// whenever you build the library be sure to include directly after including the 
// svgElem.js file. In this way we can have all the utils method in a seperate file
// yet still have access to across the library.
// ---------------------    
function util(){}    
lib.__proto__.util = util;


util.regex = {
    points : /[, ]/
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
}(svg));