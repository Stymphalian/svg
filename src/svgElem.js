// svgElem.js
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
        }else if( tag_name !== undefined && tag_name !== null){
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
        var e = svgElem.prototype.util.clone(this);

        // reomve the plugin instances from the object
        for( var k in  e){
            if( svgElem.prototype.plugin.has[k] !== undefined){
                if( Object.prototype.hasOwnProperty.call(e,k)){
                    delete e[k];
                }
            }            
        }

        // attach the node to the same parent
        if( this.dom.parentNode){
            this.dom.parentNode.appendChild(e.dom);
        }

        return e;

        // var parentNode = this.dom.parentNode;
        // var tag_name = this.dom.tagName.toLowerCase();
        
        // // create a deep copy of the cloned nodes.
        // var clonedDom = this.dom.cloneNode(true);
        // if(parentNode){
        //     parentNode.appendChild(clonedDom);
        // }

        // // create a new svgElem to use, using the created cloned dom tree
        // var e = new svgElem(clonedDom);        

        // // WARNING. 
        // // If we have a 'bound' function being cloned over this will cause
        // // alot of problems because the context may not match up.
        // for(var k in this){
        //     if( Object.prototype.hasOwnProperty.call(this,k) ){
        //         if( svgElem.prototype.plugin.has[k] !== undefined){
        //             continue;
        //         }
        //         e[k] = this[k];
        //     }
        // }

        // return e;
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