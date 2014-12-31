define(function(){
    function testing(){}
    
    function is(obj,typeName){
        if(obj === undefined || obj === null){return false;}

        var v = Object.prototype.toString.call(obj).toLowerCase();

        // trim the "[object "
        var s = "[object ";
        var rs = v.substring(s.length, s.length + typeName.length);
        return (rs === typeName);
    }


    testing.assert = function(cond,obj){
        console.assert(cond,obj);
    }

    testing.assertEq = function(a,b){
        console.assert(a === b, {a:a,b:b});
    }

    testing.assertEqObj = assertEqObj;
    testing.assertEqArray = assertEqArray;    
    testing.assertEqThing = assertEqThing;
    
    function assertEqArray(get,want){
        if(get.length !== want.length){
            console.assert(false,{get:get,want:want});                        
        }

        var n = want.length;
        for(var i = 0; i < n; ++i){
            assertEqThing(get[i],want[i]);
        }
    }
    function assertEqObj(get,want){
        for(k in want){
            assertEqThing(get[k],want[k]);            
        }
    }
    function assertEqThing(get,want){
        if( is( want,"object")){
            assertEqObj(get,want);
        }else if( is(want,"array")){
            assertEqArray(get,want);
        }else{
            if( get !== want){
                console.assert(false,{get:get,want:want});
            }
        }
    }

    testing.defaultAttr = function(){
        return {
            "fill" : "green",
            "fill-opacity" : 0.4,
            "stroke" : "black",
            "storke-width" : 3
        };
    }

    return testing;
})