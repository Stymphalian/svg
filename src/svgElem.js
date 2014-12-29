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