//lib.js
var svg = (function(){

    function lib(){}
    lib.util = {};
    lib.svgElem = {}; // these two modules must exist

    lib.version = "0.0.0";
    // a cache of modules we can add to the library accessible by all
    // extends,plugins and modules
    lib.modules = {}

    lib.module = function(func){
        func(lib);
    }

    // pass-in a function and recieve 
    // func(svgElem){...}        
    lib.extend = function(func){
        func(lib.svgElem,lib.util,lib.modules);
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
    lib.plugin = function(func,overwrite){        
        // return vlaue from the function will be added as a property under the svgElem
        // access goes through that module and all 
        var svgElem = lib.svgElem;
        var hasOwn = Object.prototype.hasOwnProperty;
        var rs = func(lib.svgElem,lib.util,lib.modules);

        if( hasOwn.call(rs,"name") === false){return;}
        if( hasOwn.call(rs,"constructor") === false){return;}
        if(overwrite === undefined){overwrite = false;}

        // we can overwrite a plugin if we are forced to.
        if(lib.plugin.has[rs.name] === true && overwrite === false){
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
        // lib.plugin.has[rs.name] = true;
        lib.plugin.has[rs.name] = rs.contructor;
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
    lib.plugin.has ={};

    return lib;
}());