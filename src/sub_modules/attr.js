//attr.js
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

    
    // @param to [object] - the obbject in which to define the property on    
    // @param d [array] - an array of objects which have the following struture
    // {
    //     desired: string, // the desired name to access from
    //     real : string,  // the real name of property
    //     isNum : boolean // optional, used to denote if the attribute should be treated as a number
    // }
    // @param context [object|function] - optional. A context in which we want to work with
    //      in most cases, to will === context. If not context is given then we assume it
    //      is the same as the 'to' context
    attr.DirectAccessNoFunction = function(to,d,context){
        if( context === undefined){context = to;}
        var n = d.length;

        for( var i = 0;i < n; ++i){
            var e = d[i];
            if( util.is(e,"string")){
                console.error("nofunction");
                e = {
                    desired: d[i],
                    isNum : (d[i].charAt(0) === "+")
                };
            }

            (function(desired,real,isNum,munger){
                if(real === undefined){real = desired;}
                if(isNum === undefined){isNum = false;}
                if(munger === undefined){munger = function(val,isGet){return val;};}

                attr._defineProperty(to,desired,
                    function(){ //getter
                        var rs = munger(context.attr(real),true);
                        if( isNum){
                            return util.toNum(context.attr(real));
                        }else{
                            return context.attr(real);
                        }
                    },
                    function(val){ // setter
                        var rs = munger(val,false);
                        context.attr(real,rs);
                        return context;
                    }
                );

            }(d[i].desired,d[i].real,d[i].isNum,d[i].munger));
        }
    }


    // @param to [object] - the obbject in which to define the property on    
    // @param d [array] - an array of objects which have the following struture
    // {
    //     desired: string, // the desired name to access from
    //     real : string,  // optional. if not provided then we assume the noraml desired.
    //     isNum : boolean // optional, used to denote if the attribute should be treated as a number
    //     munger: // optional. function(val,isGet){} where val is value being get/set, 
    //          and the isGet flag informs us which scenario
    // }
    // @param context [object|function] - optional. A context in which we want to work with
    //      in most cases, to will === context. If not context is given then we assume it
    //      is the same as the 'to' context
    attr.DirectAccess = function(to,d,context){
        if( context === undefined){context = to;}
        var n = d.length;

        for( var i = 0;i < n; ++i){

            var e = d[i];
            if( util.is(d[i],"string")){
                console.error("direct access");
                e = {
                    desired: d[i],
                    isNum: (d[i].charAt(0) === "+")
                };
            }

            // return a function closure which holds
            // the desired,real and isNum values
            to[e.desired] = (function(desired,real,isNum,munger){
                if(isNum === undefined){isNum = false;}
                if(real === undefined){real = desired;}                
                if(munger === undefined){munger = function(val,isGet){return val;};}

                return function(val){
                    var rs = null;

                    if(val === undefined){                                                

                        // if a munger was supplied then we do some 
                        // pre-processing of the return value before returning
                        // it to the user
                        rs = munger(context.attr(real),true);
                        if(isNum){
                            return util.toNum(rs);
                        }else{
                            return rs;
                        }

                    }else{           

                        // if a munger was supplied by the user,
                        // then we apply the pre-processing before setting the attr.
                        rs = munger(val,false);
                        context.attr(real,rs);
                        return context;
                    }
                };

            }(e.desired,e.real,e.isNum,e.munger));
        }
    }

});