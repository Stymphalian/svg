(function(root,factory){
    if (typeof define === 'function' && define.amd){
        define(factory);
    }else if( typeof exports == 'object') {
        exports.svg = factory();
    }else{
        root.svg = factory();
    }
} (this,function(){
    // factory function used to define the module

// problems
// split things out into different files
// everything is a svgElement
// creating a new svgElement of a specific tag applies a mixin to provide special methods

var svg = (function(){
    // some global stuff
    var globals = {
        window : window,
        document : window.document
    }

    svgElem.prototype.version = "0.0.0";
    svgElem.prototype.svg_ns = 'http://www.w3.org/2000/svg';
    svgElem.prototype.xlink_ns = 'http://www.w3.org/1999/xlink';
    svgElem.prototype.xml_ns = 'http://www.w3.org/2000/xmlns/';

    // define the base svg element
    // tag_name : the element in which we want to create
    // parent_node : the DOM node in whcih to append the newly created node under.
    function svgElem(tag_name,parent_node){        

        if(tag_name && Object.prototype.toString.call(tag_name) === "[object String]" ){
            // TODO: should I add ids to every element that gets created??
            this.dom = globals.document.createElementNS(svgElem.prototype.svg_ns,tag_name);
        }else if( tag_name !== null){
            // we have passed in a dom node to be used when creating the svgElem
            this.dom = tag_name;
        }

        if(parent_node){
            parent_node.appendChild(this.dom);
        }
    }    

    // delete all children svg nodes under this element
    svgElem.prototype.clear = function(){
        while(this.dom.firstChild){
            this.dom.removeChild(this.dom.firstChild);
        }
        return this;
    }

    // remove this element from its parent
    svgElem.prototype.remove = function(){
        this.clear();
        if( this.dom.parentNode){
            this.dom.parentNode.removeChild(this.dom);
        }        
    }

    //@return [svgElem] -  clone this element and then return the cloned element
    // TODO: clonded children of the dom don't have an associated svgElem object
    svgElem.prototype.clone = function(){
        var parentNode = this.dom.parentNode;
        var tag_name = this.dom.tagName.toLowerCase();
        
        // create a deep copy of the cloned nodes.
        var clonedDom = this.dom.cloneNode(true);
        if(parentNode){
            parentNode.appendChild(clonedDom);
        }

        // create a new svgElem to use, using the created cloned dom tree
        var e = new svgElem(clonedDom);        

        // WARNING. 
        // If we have a 'bound' function being cloned over this will cause
        // alot of problems because the context may not match up.
        for(var k in this){
            if( Object.prototype.hasOwnProperty.call(this,k) ){
                if( svgElem.prototype.plugin.has[k] !== undefined){
                    continue;
                }
                e[k] = this[k];                
            }
        }

        return e;
    }

    
    // pass-in a function and recieve 
    // func(svgElem){...}    
    svgElem.prototype.extend = function(func){
        // svgElem.prototype.util comes from the util.js file
        // it gets added to the svgElem prototype
        func(svgElem,svgElem.prototype.util);
    }

    // pass in a function which meets the signature
    // func(svgElem){}
    // and returns an object with three properties
    // {
    //      name: the name in which the plugin will live under the svgelem namespace
    //      constructor : function(context){...}
    //          the context will be the svgElem
    // }
    // _plugin_list allows us to keep track of what properties
    // in our svgElem is a plugin, therefore when we do our copy
    // then we know what we are allowed to copy and can't copy.
    
    svgElem.prototype.plugin = function(func,overwrite){        
        // return vlaue from the function will be added as a property under the svgElem
        // access goes through that module and all 
        var hasOwn = Object.prototype.hasOwnProperty;
        var rs = func(svgElem,svgElem.prototype.util);

        if( hasOwn.call(rs,"name") === false){return;}
        if( hasOwn.call(rs,"constructor") === false){return;}
        if(overwrite === undefined){overwrite = false;}

        // we can overwrite a plugin if we are forced to.
        if(svgElem.prototype.plugin.has[rs.name] === true && overwrite === false){
            return;
        }

        // define a property on the svgElem prototype
        // the first time the user retrieves this plugin
        // a new instance will be created and then set as a property
        // of the calling object. In this way it is possible for
        // the plugin methods to receive the svgElem context in which
        // it is manipulating.
        // we do this round about way in order to access the plugin using the 
        // simpler syntax
        //      elem.<plugin> instead of elem.<plugin>()        
        svgElem.prototype.plugin.has[rs.name] = true;
        Object.defineProperty(svgElem.prototype,rs.name,{            
            get : function(){                                
                var instance = new rs.constructor(this);
                Object.defineProperty(this,rs.name,{
                    value: instance,
                    writable :true,
                    configurable:true,
                    enumerable:true
                });                
                return instance;
            },
            set :function (newValue){},
            configurable : true,
            enumerable: true
        });
    }
    svgElem.prototype.plugin.has = {};

    return new svgElem();
}());
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
svg.extend(function(svgElem,util){
    svgElem.prototype.color = new color();

    // @return [array,string] - 
    function color(){}

    function clamp(n){
        if( n < 0){return 0;}
        if( n > 255){return 255;}        
        return n;
    }
    color.prototype.rgb2hex = function(r,g,b){
        var h = ["#",0,0,0];
        h[1] = Number.prototype.toString.call(clamp(r),16);
        h[2] = Number.prototype.toString.call(clamp(g),16);
        h[3] = Number.prototype.toString.call(clamp(b),16);
        return Array.prototype.join.call(h,"");
    }

    color.prototype.hex2rgb = function(h){
        h = (h.charAt(0)==='#') ? h.substring(1,7) : h;
        return {
            r : parseInt(h.substring(0,2),16),
            g : parseInt(h.substring(2,4),16),
            b : parseInt(h.substring(4,6),16)
        };        
    }

    color.prototype.asHex = function(r,g,b){
        if( r === undefined){return null;}

        if( util.is(r,"string") ){

            // add the '#' if it is missin
            if( a.charAt(0) !== '#'){
                r = "#" + r;
            }
            return r;
        }else{
            if( g === undefined){return;}
            if( b === undefined){return;}
            // convert rgb to a hex value
            return color.prototype.rgb2hex(r,g,b);    
        }
    }

});
svg.extend(function(svgElem,util){
    svgElem.prototype.attr  = attr;

    // @param key : the attribute to set
    // @param value : the value for the attribute to take.
    // @param ns : namespace for setting the attribute
    function setAttr(key,value,ns){        
        if (key === undefined){return this;}

        // do any attribute munging for attributes
        // i.e given an array we process it into a string suitable to 
        // set on the dom node.
        var val = value;
        var munged = false;
        if(this.attrMunger){
            var d = this.attrMunger(key,value);
            if( d.munged){
                val = d.value;
            }
        }

        // set the actual attribute on the dom node
        if( val === undefined){return this;}

        if( ns === undefined || ns === null){
            this.dom.setAttribute(key,val);
        }else{
            this.dom.setAttributeNS(ns,key,val);
        }
        
        return this;    
    }

    // @purpose 
    // no arguments : return [ [key,value], ...]
    // String : return the value of the specified key
    // String,Value : set the attribute 'String' to 'Value'
    // Object : set the properties the object as the attributes of the object
    // Array : retrieve the set of properties with the given names.
    function attr(arg1,arg2,ns){        
        if(arg1 !== undefined){
            if( util.is(arg1,"object") ){
                if( arg2 !== undefined){
                    ns = arg2;
                }else{
                    ns = null;
                }
                // mixin the properties
                for(var e in arg1){
                    if(Object.prototype.hasOwnProperty.call(arg1,e)){
                        setAttr.call(this,e,arg1[e],ns);
                    }
                }           
                return this;
            }else if( util.is(arg1,"string") ) {
                if( arg2 === undefined){
                    // getter
                    var rs = this.dom.attributes[arg1]
                    if( rs !== null && rs !== undefined){
                        return rs.value;
                    }else{
                        return null;
                    }

                }else{
                    // setter
                    if(ns === undefined){
                        ns = null;
                    }
                    setAttr.call(this,arg1,arg2,ns);
                    return this;
                }
            }else if( util.is(arg1,"array") ){
                // return the object with all the specified properties
                var rs = {};
                var n = arg1.length;
                for(var i = 0;i < n;++i){
                    var v = this.dom.attributes[arg1[i]];
                    if( v !== undefined && v !== null){
                        if( v.value !== null){
                            rs[arg1[i]] = v.value;
                        }
                    }                    
                }
                return rs;
            }
        }else {
            // return an array of attributes
            return (function(){
                var attrs = [];
                var n = this.dom.attributes.length;
                var key,value;
                for(var i = 0;i < n; ++i){              
                    key = this.dom.attributes[i].name;
                    value = this.dom.attributes[i].value;                   
                    attrs.push([key,value]);
                }
                return attrs;
            }).call(this);
        }
    }


    // wrapper around the Object.defineProperty function
    // all we really care about is tha ability to set the getter and setter
    // values for the property.
    attr._defineProperty = function(context,name,getter,setter){
        Object.defineProperty(context,name,{            
            get : getter,
            set : setter,
            configurable : true,
            enumerable: true
        });
        return context;
    }

    // do I want to use a DefineProperty such that the programmer
    // can access the value without having to call a function?
    // @param to [object] - the obbject in which to define the property on    
    // @param d [array] - an array of strings specifying the attributes in which we
    //      want direct access. If the string has a "+" as the first character of the property
    //      this tells us that we want to do a 'toNum' coercion when we process the property
    // @param context [object|function] - optional. A context in which we want to work with
    //      in most cases, to will === context. If not context is given then we assume it
    //      is the same as the 'to' context    
    attr.DirectAccessNoFunction = function(to,d,context){
        if(context === undefined){context = to;}

        var n = d.length;
        for( var i = 0;i < n ; ++i){            
            (function(key){
                // did the programmer tell us that she wanted
                // some properties to be coercied into a number?
                var toNumFlag = false;
                if( key.charAt(0) === "+"){
                    toNumFlag = true;
                    key = key.substring(1);
                }

                // define the property on the 'to' object
                attr._defineProperty(to,key,
                    function(){
                        if( toNumFlag){
                            return util.toNum(context.attr(key));
                        }else{
                            return context.attr(key);
                        }
                    }, // getter
                    function(val){ // setter
                        context.attr(key,val);
                        return context;
                    });
            }(d[i]));
        }
    }

    
    // @param to [object] - the obbject in which to define the property on    
    // @param d [array] - an array of strings specifying the attributes in which we
    //      want direct access.
    // @param context [object|function] - optional. A context in which we want to work with
    //      in most cases, to will === context. If not context is given then we assume it
    //      is the same as the 'to' context
    attr.DirectAccess = function(to,d,context){
        if( context === undefined){context = to;}

        var n = d.length;
        for(var i = 0; i <n; ++i){
            

            // did the programmer tell us that she wanted
            // some properties to be coercied into a number?
            var toNumFlag = false;
            var k = d[i];
            if( k.charAt(0) === "+"){
                toNumFlag = true;
                k = k.substring(1);
            }

            to[k] = (function(key,numFlag){
                return function(val){
                    if( val === undefined){
                        if( numFlag){
                            return util.toNum(context.attr(key));
                        }else{
                            return context.attr(key);
                        }
                        
                    }else{
                        context.attr(key,val);
                        return context;
                    }
                }
            }(k,toNumFlag));
        }
    }
});
svg.plugin(function(svgElem,util){    

return {
    name : "shape",
    constructor :  function shape(context){
        asShape.call(this,context);
        return this;
    }
};

function asShape(context){
    // setup direct access for each of these properties    
    var d = ['+x','+y','+width','+height','+rx','+ry','+r','+cx','+cy'];
    context.attr.DirectAccessNoFunction(this,d,context);
    

    // TODO: doesn't seem like a good way to determine if 
    // the svgElem is 'circular' ( i.e for circles,ellipse)
    function isCircular(context){
        return (context.attr('cx') !== null);
    }
    function isEllipse(context){
        return (context.attr("rx") !== null);
    }
    
    // set the x and y position of the shape
    // if the object does not have an x,y then nothing happens
    // TODO: this is not well defined for <line> or <polyline>
    this.pos = function(x,y){
        if(isCircular(context) ){
            if( x === undefined){
                return {
                    'cx':util.toNum(context.attr("cx")),
                    "cy":util.toNum(context.attr("cy"))
                };
            }else{
                context.attr({"cx":x,"cy":y});
                return context;
            }
        }else{
            if( x === undefined){
                return {
                    'x':util.toNum(context.attr('x')),
                    'y':util.toNum(context.attr('y'))
                };
            }else{
                context.attr({'x':x,'y':y});
                return context;
            }
        }
    }

    // set the width and height of the svgElement
    // if the element does not have a width and height then nothing happens.
    this.size = function(w,h){        
        if( isEllipse(context)){
            if( w === undefined){
                return {
                    "rx":util.toNum(context.attr("rx")),
                    "ry":util.toNum(context.attr("ry"))
                };
            }else{
                context.attr({"rx":w,"ry":h});
                return context;
            }

        }else if (isCircular(context)){
            if( w === undefined){
                return {"r":util.toNum(context.attr("r"))};
            }else{
                context.attr({"r":w});
                return context;
            }

        }else{        
            if( w === undefined){
                return {
                    'width' : util.toNum(context.attr('width')),
                    'height' : util.toNum(context.attr('height'))
                };
            }else{
                context.attr({'width':w,'height':h});
                return context;
            }
        }
    }

    this.move = function(x,y){
        if( x === undefined){return null;}

        // check for polyline or line
        if(context.attr("points") !== null ){

        }else if( context.attr("x1") !== null){
            // move the line.
            var p = context.attr(["x1","y1","x2","y2"]);
            p.x1 = util.toNum(p.x1) + x;
            p.y1 = util.toNum(p.y1) + y;
            p.x2 = util.toNum(p.x2) + x;
            p.y2 = util.toNum(p.y2) + y;
            context.attr(p);
            return context;
        }

        var p = this.pos();        
        if(isCircular(context) ){
            context.attr({"cx":x + p.cx,"cy":y + p.cy});
        }else{         
            context.attr({'x':x + p.x,'y':y + p.y});
        }
        return context;
    }

    return this;
}
     
});
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
svg.plugin(function(svgElem,util){

return {
    name : 'style',
    constructor : style
};

function style(context){
    var f = function(styleString){
        return context.attr("style",styleString);
    }
    asStyle.call(f,context);
    return f;
}

function asStyle(context){
    
    function clamp01(val){
        if(val < 0 ){val = 0;}
        if(val > 1.0){val = 1.0;}
        return val;
    }

    function setAttrFloat(name,val){
        if( val === undefined){
            var val = this.attr(name);
            if( val != null){
                return util.toNum(val);
            }else{
                return null;
            }

        }else{
            val = clamp01(util.toNum(val));
            this.attr(name,val);
            return this;
        }
    }

    function setArrayOrStringAttr(name,val){
        var rs;
        if( val === undefined){
            rs = this.attr(name);
            if( rs === null){return null;}
            
            rs = rs.split(" ").map(function(v,k,arr){
               return util.toNum(v);
            });            
            return rs;

        }else{
            // we have been passed an array therefore convert into a string
            if(util.is(val,"array")){
                rs = val.join(" ");
            }else{
                rs = val;
            }
            this.attr(name,rs);
            return this;
        }
    }


    // stroke style property
    this.stroke = stroke;
    function stroke(val){
        return context.attr("stroke",val);
    }
    stroke.width = function(val){
        return util.toNum(context.attr("stroke-width",val));
    }
    stroke.opacity = function(val){
        return setAttrFloat.call(context,"stroke-opacity",val);
    }    
    // @param val [string,array]    
    //      string with space seperated values of numbers
    //      array of numbers
    // @return [array] - array of numbers representing the dash_array
    stroke.dasharray = function(val){
        return setArrayOrStringAttr.call(context,"stroke-dasharray",val);        
    }

    

    // fill style property
    // @param [string] - val can be either a hex string, or a color (i.e. blue, green,red)
    this.fill = fill;
    function fill(val){
        return context.attr("fill",val);
    }

    // @param [float,string,undefined] - the value to set the opacity.
    //      clamped between 0 and 1.0f
    // @return [float]
    fill.opacity = function(val){
        return setAttrFloat.call(context,"fill-opacity",val);
    }
}

}); 
svg.plugin(function(svgElem,util){

return {
    name:"lex",
    constructor : function lex (context){
        asLex.call(this,context);
        return this;
    }
};

function asLex(context){
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
svg.extend(function(svgElem,util){
    svgElem.prototype.svg = svg;
    svgElem.prototype.svgRoot = svgRoot;
    svg.asSvg = asSvg;

    function svgRoot(parentElementId,width,height){
        var container = document.getElementById(parentElementId);       
        if( container === null){
            console.error("Invalid parent container id");
            return null;
        }

        if( width === undefined){width = container.clientWidth;}
        if( height === undefined){height = container.clientHeight;}

        // create the new svgElem
        var e = new svgElem("svg",container);        
        e.attr({'x' :0, 'y' :0 ,'width' : width, 'height' :height });
        canvas = asSvg.call(e);
        
        canvas.dom.setAttribute("xmlns",svgElem.prototype.svg_ns);
        canvas.dom.setAttributeNS(svgElem.prototype.xml_ns,"xmlns:xlink",svgElem.prototype.xlink_ns);
        canvas.attr({
                    "version":"1.1",
                    "baseProfile":"full",        
                    });
        // TODO: Find out why I can't use the attr to set this attribute
        
        return canvas;
    }

    function svg(x,y,w,h){
        var e = new svgElem("svg",this.dom);
        e.attr({'x' :x, 'y' :y ,'width' : w, 'height' :h });

        asSvg.call(e);
        return e;
    }

    function asSvg(){                
        this.pos = function(x,y){
            if(x === undefined) {
                var attrs = this.attr['x','y'];
                if(attrs !== null) {
                    return {
                        x:attrs[0],
                        y:attrs[1]
                    };
                }
            }else{
                this.attr({'x' : x,'y' : y});    
            }            
        }

        // receive a rect specifying the viewport units for the element.
        this.viewBox = function(x,y,w,h){
            if( x === undefined){
                var rs = this.attr("viewBox");
                if( rs === null){return null;}
                
                rs = rs.split(" ");
                return {
                    x : parseFloat(rs[0]),
                    y : parseFloat(rs[1]),
                    w : parseFloat(rs[2]),
                    h : parseFloat(rs[3])
                }                
            }else{
                this.attr('viewBox',[x,y,w,h].join(" "));
            }            
        }

        // align :
        //  none, x[Min,Mid,Max]Y[Min,Mid,Max]
        // meetOrSlice :
        //  meet,slice
        this.preserveAspectRatio = function(align,defer,meetOrSlice){            
            defer = (defer === undefined) ? "" : defer;
            meetOrSlice (meetOrSlice === udnefined) ? "" : meetOrSlice;                

            this.attr('preserveAspectRatio',defer + " " + align + " " + meetOrSlice);
            return this;
        }


        this.zoom = function(times){
            console.warn("zoom not implemented");
            return this;
        }

        return this;        
    }

})
svg.extend(function(svgElem,util){
    svgElem.prototype.g = g;
    g.asG = asG;

    function g(){
        var e = new svgElem("g",this.dom);
        return asG.call(e);        
    }

    
    function asG(){
        return this;
    }
    
});
svg.extend(function(svgElem,util){
    svgElem.prototype.rect = rect;
    rect.asRect = asRect;

    function rect(x,y,w,h){
        var e = new svgElem("rect",this.dom);
        e.attr({'x':x,'y':y,"width":w,'height':h});
        return asRect.call(e);
    }

    function asRect(){
        // specifes the rounding of the rect corners.
        this.round = function(rx,ry){
            if( rx === undefined){
                return {
                    'rx':util.toNum(this.attr('rx')),
                    'ry':util.toNum(this.attr("ry"))
                };
            }else{
                this.attr({'rx':rx, 'ry':ry });
                return this;
            }            
        }
        return this;
    }

});
svg.extend(function(svgElem,util){
    svgElem.prototype.circle = circle;
    circle.asCircle = asCircle;

    function circle(x,y,r){
        var e = new svgElem("circle",this.dom);
        e.attr({'cx' : x, 'cy' :y ,'r':r});
        asCircle.call(e);
        return e;
    }


    function asCircle(){        
        this.radius = function(val){
            if( val === undefined){
                return util.toNum(this.attr("r",val));
            }else{
                this.attr("r",val);
            }            
        }

        this.center = function(x,y){
            if( x === undefined){
                return {
                    'cx':util.toNum(this.attr('cx')),
                    'cy':util.toNum(this.attr('cy'))
                };
            }else{
                this.attr({'cx':x,'cy':y});    
                return this;
            }            
        }
        return this;
    }
});

// ellipse.js
svg.extend(function(svgElem,util){
    svgElem.prototype.ellipse = ellipse;
    ellipse.asEllipse = asEllipse;

    function ellipse(cx,cy,rx,ry){
        var e = new svgElem("ellipse",this.dom);
        e.attr({'cx':cx,'cy':cy,'rx':rx,'ry':ry });
        return asEllipse.call(e);
    }

    function asEllipse(){
        // the plus tells use that we want the rx and ry attributes to
        // be coerced into numbers
        this.attr.DirectAccess(this,['+rx','+ry']);

        this.center = function(x,y){
            if( x === undefined){
                return {
                    'cx':util.toNum(this.attr('cx')),
                    'cy':util.toNum(this.attr('cy'))
                };
            }else{
                this.attr({'cx':x,'cy':y});    
                return this;
            }            
        }

        return this;
    }

});
// line.js
svg.extend(function(svgElem,util){
    svgElem.prototype.line = line;
    line.asLine = asLine
    // svgElem.prototype.polyline = polyline;
    // polyline.asPolyling = asPolyline;

    function line(x1,y1,x2,y2){
        var e = new svgElem("line",this.dom);
        e.attr({x1:x1,y1:y1,x2:x2,y2:y2});
        return asLine.call(e);
    }

    function polyline(points){
        var p = arrayOrString(points);
        if( p === null){return null;}
    
        var e = new svgElem("polyline",this.dom);
        e._points_array = p.points;
        e.attr("points",p.points_string);
        return asPolyline.call(e);
    }

    function asLine(){
        this.origin = function(x,y){
            if( x === undefined){
                return {
                    x: util.toNum(this.attr("x1")),
                    y: util.toNum(this.attr("y1")),
                };
            }else{
                this.attr({x1:x,y1:y});
                return this;
            }
        }

        this.dest = function(x,y){
            if( x === undefined){
                return {
                    x: util.toNum(this.attr("x2")),
                    y: util.toNum(this.attr("y2")),
                };
            }else{
                this.attr({x2:x,y2:y});
                return this;
            }
        }

        this.move = function(x,y){
            var p = this.attr(["x1","y1","x2","y2"]);
            p.x1 = util.toNum(p.x1) + x;
            p.y1 = util.toNum(p.y1) + y;
            p.x2 = util.toNum(p.x2) + x;
            p.y2 = util.toNum(p.y2) + y;
            this.attr(p);
            return this;
        }

        return this;
    }

    function asPolyline(){

        this.points = function(p){            
            if( p === undefined){
                return _points_array;
            }else{
                var v = arrayOrString(p);
                this.attr("points",v.points_string);
                return this
            }
        }

        this.addPoint = function(index,x,y){

        }

        this.removePoint = function(index){
            if( index < 0){return this;}
            if( index >= this._points_array.length/2){return this;}

            var p = this._points_array;
            var start = index*2

            Array.prototype.slice.call(p,index*2,2);
            this.attr("points",p.join(" "));
            return context;
        }

        // retrieve a point at the given index
        this.point = function(index){
            if( index < 0){return null;}
            if( index >= this._points_array.length/2){return null;}

            return {
                x:this._points_array[index*2],
                y:this._points_array[index*2 + 1]
            };
        }

        // TODO: do a move only over a range of the points
        this.move = function(x,y){                        
            var n = this._points_array.length;
            var p = this._points_array;
            // shift all the points over
            for(var i = 0; i < n; i += 2){
                p[i] += x;
                p[i+1] += y;
            }

            p = arrayOrString(this._points_array);            
            this._points_array = p.points;
            this.attr("points",p.points_string);
            return this;
        }

        return this;
    }


    function arrayOrString(p){
        var points = p;
        var points_string = "";

        if(util.is(p,"array")){
            // process as an array
            points = p;
            points_string = points.join(" ");
        }else if( util.is(p,"string")){
            points_string = points;
            points = points_string.split(" ").map(function(v,k,arr){
                return util.isNum(v);
            });
        }

        //must have an even number of points
        if( points.length %2 !== 0){
            console.error("Require an even number of numbers"); 
            return null;
        }

        return {
            points:points,
            points_string: points_string
        };
    }

});
    return svg;
}));

