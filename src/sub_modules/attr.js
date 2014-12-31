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