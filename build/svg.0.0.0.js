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
        this.dom = globals.document.createElementNS(svgElem.prototype.svg_ns,tag_name);

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

    // to -- the object to mixin in to
    // from -- the object to take properties from
    // force -- boolean which determines if you should overwrite the values in 'to'
    svgElem.prototype.mixin = function(to,from,force){
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

    svgElem.prototype.mixinUsingFunc = function(to,from,func){
        for( var k in from){
            if( Object.prototype.hasOwnProperty.call(from,k)){
                to[k] = func(to,from,k);
            }
        }   
        return to;
    }

    svgElem.prototype.mixinFromExports = function(to,from,namedExports,force){
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

    
    svgElem.prototype.plugin = function(func){
        func(svgElem);
    }

    return new svgElem();
}())
svg.plugin(function(svgElem){

    // @param key : the attribute to set
    // @param value : the value for the attribute to take.
    // @param ns : namespace for setting the attribute
    function setAttr(key,value,ns){        
        // ns = 'http://www.w3.org/2000/svg';
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
        if( ns === undefined ){
            this.dom.setAttribute(key,val);
        }else{
            this.dom.setAttributeNS(ns,key,val);
        }
        
        return this;    
    }

    function isObject(t){
        return (t && Object.prototype.toString.call(t) == "[object Object]");
    }

    // @purpose 
    // no arguments : return [ [key,value], ...]
    // String : return the value of the specified key
    // String,Value : set the attribute 'String' to 'Value'
    // Object : set the properties the object as the attributes of the object
    svgElem.prototype.attr = function(arg1,arg2){        
        if(arg1 !== undefined){
            if( isObject(arg1) ){
                // mixin the properties
                for(var e in arg1){
                    if(Object.prototype.hasOwnProperty.call(arg1,e)){
                        setAttr.call(this,e,arg1[e]);
                    }
                }           
                return this;
            }else if( isString(arg1) ) {
                if( arg2 === undefined){
                    // getter
                    return this.dom.attributes[arg1].value;
                }else{
                    // setter
                    setAttr.call(this,arg1,arg2);
                    return this;
                }
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
});
svg.plugin(function(svgElem){
    svgElem.prototype.svg = svg;
    svgElem.prototype.svgRoot = svgRoot;

    function svgRoot(parentElementId,width,height){
        var container = document.getElementById(parentElementId);       
        if( container === null){
            console.error("Invalid parent container id");
            return null;
        }

        if( width === undefined){width = container.clientWidth;}
        if( height === undefined){height = container.clientHeight;}
        var canvas = svg(0,0,width,height);
        canvas.dom.setAttribute("xmlns",svgElem.prototype.svg_ns);
        canvas.dom.setAttributeNS(svgElem.prototype.svg_ns,"xlink",svgElem.prototype.xlink_ns);
        canvas.attr({
                    "version":"1.1",
                    "baseProfile":"full",        
                    });
        // TODO: Find out why I can't use the attr to set this attribute

        container.appendChild(canvas.dom);
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
            this.attr('viewBox',[x,y,w,h].join(" "));
        }

        // align :
        //  none, x[Min,Mid,Max]Y[Min,Mid,Max]
        // meetOrSlice :
        //  meet,slice
        this.preserveAspectRatio = function(align,defer,meetOrSlice){            
            defer = (defer === undefined) ? "" : defer;
            meetOrSlice (meetOrSlice === udnefined) ? "" : meetOrSlice;                

            this.attr('preserveAspectRatio',defer + " " + align + " " + meetOrSlice);
        }

        return this;        
    }

})
svg.plugin(function(svgElem){
    svgElem.prototype.circle = circle;

    function circle(x,y,r){
        var e = new svgElem("circle",this.dom);
        e.attr({'cx' : x, 'cy' :y ,'r':r});
        asCircle.call(e);
        return e;
    }

    function asCircle(){
        this.center = function(x,y){
            this.attr({'x':x,'y':y});
        }
        return this;
    }
});

    return svg;
}));

