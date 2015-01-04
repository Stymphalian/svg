//transform.js
svg.plugin(function(svgElem,util){
    
return {
    name: "transform",
    constructor : function transform(context){        
        var f = function(val){
            if( val === undefined){
                return get(context);
            }else{
                if(util.is(val,"string")){
                    set(context,val);
                    return context;
                }else if( util.is(val,"number")){
                    return get(context,val);
                }
            }
        }    

        if( context !== undefined && context !== null){
           context._transform_values = [];
        }
        asTransform.call(f,context);
        return f;
    }
};

function fromStringToObject(s){
    var numParams = {
        "translate" : 2,
        "rotate" : [1,3],
        "scale" : 2,
        "skewX" : 1,
        "skewY" : 1,
        "matrix" : 6
    };

    var arr = [];

    s.replace(util.regex.transformCommand,function(full_match,cmd,vals){
        // not a valid command
        if( numParams[cmd] === undefined){return;}

        var poj = {
            name : cmd,
            values: []
        };

        vals.replace(util.regex.values,function(full_match,num){
            num && poj.values.push(util.toNum(num));
        });

        if( util.is(numParams[cmd],"array") ){
            var n = numParams[cmd].length;
            var good_flag = false;
            for(var i = 0;i < n ;++i){
                if( poj.values.length === numParams[cmd][i]){
                    good_flag = true;
                    break;
                }
            }

            if(good_flag === false){return;}                

        }else{
            if(poj.values.length < numParams[cmd]){return;}
        }
        
        arr.push(poj);
    });

    return arr;
}

function fromObjectToString(o){
    return o.name + "(" + o.values.join(",") + ")";
}

function get(context,index){
    if( index === undefined ){        
        return context._transform_values;
    }else{
        if(index < -context._transform_values.length){return null;}
        if(index >= context._transform_values.length){return null;}
        if( index < 0 ){
            index = context._transform_values.length + index;
        }

        return applyInterface(context._transform_values[index]);
    }
}

function set(context,s){
    if( s === undefined || s === null){return context;}
    var rs = fromStringToObject(s);
    context._transform_values = rs;
    context.attr("transform",s);
    return context;
}

function save(context){
    var s = "";
    var n = context._transform_values.length;
    for(var i = 0;i < n; ++i){
        s += fromObjectToString(context._transform_values[i]);

        if( i !== n-1){
            s += " ";
        }
    }

    context.attr("transform",s);
    return context;
}

function asTransform(context){
    if( context === undefined || context === null){return this;}

    this.clear = function(){
        // clear the array
        while(context._transform_values.length > 0){
            context._transform_values.pop();
        }

        // set the transform attr to empty.
        context.attr("transform","");
    }

    // after modifying any transform attributes
    // call save in order to dump it back into the dom node.
    this.save = function(){
        return save(context);
    }

    this.translate = function(x,y){
        context._transform_values.push({
            name:"translate",
            values:[x,y]
        });

        save(context);
        return context;
    }

    this.rotate = function(val,x,y){
        if( x === undefined ){x = 0;}
        if( y === undefined ){y = 0;}

        context._transform_values.push({
            name:"rotate",
            values:[x,y,val]
        });

        save(context);
        return context;        
    }

    this.scale = function(x,y){
        if( x !== undefined && y === undefined){
            y = x;
        }

        context._transform_values.push({
            name:"scale",
            values:[x,y]
        });

        save(context);
        return context;
    }
    
    this.skew = function(x,y){
        context._transform_values.push({name:"skewX",values:[x]});
        context._transform_values.push({name:"skewY",values:[y]});

        save(context);
        return context;
    }

    // a c e 
    // b d f 
    // 0 0 1 
    // provide values in this format [a,b,c,d,e,f]
    this.matrix = function(val){        
        if(util.is(val,"string")){
            val = val.split(util.regex.split_seperate,function(v,k,arr){
                return util.toNum(v);
            });
        }if( util.is(val,"array") && val.length === 6){
            // do a copy of the array.
            val = util.clone(val);
        }

        if( val.length != 6){return context;}

        context._transform_values.push({
            name:"matrix",
            values: val
        });

        save(context);
        return context;
    }
    this.matrix.identity = function(){
        return [1,0,0,1,0,0];
    }

    this.fromStringToObject = fromStringToObject;

    this.updateFromDom = function(){
        var s = context.attr("transform");
        if( s === undefined || s === null){return [];}
        var rs = fromStringToObject(s);
        
        context._transform_values = rs;
        return rs;
    }    
}

function applyInterface(e){
    return e;
}

});