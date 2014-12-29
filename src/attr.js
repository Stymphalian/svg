svg.plugin(function(svgElem){
    svgElem.prototype.attr  = attr;

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
    function attr(arg1,arg2){        
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