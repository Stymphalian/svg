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
