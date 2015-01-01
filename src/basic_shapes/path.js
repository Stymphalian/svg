//path.js
svg.extend(function(svgElem,util){
    svgElem.prototype.path = path;
    path.asPath = asPath;
    



    // relative(lower-case),absolute(upper-case)
    // Move                         (M x y)
    // Line To                      (L x y)
    // Vertical Line                (V x)
    // Horizontal Line              (H y)
    // Close Path                   (Z)
    // Cubic Bezier                 (C ctrl1_point, ctrl2_point, end_point)
    //  string Cubics together      (S ctrl2_point, end_point )
    //      Use the a reflection of 
    //      the previous ctrl point
    //      as ctrl1_point
    // Quadratic Bezier             (Q ctrl_point, end_point)
    //  string quads together       (T end_point)
    // Arc                          (A rx ry rotation large-arc? clockwise? x y)
    //      rx,ry : radius of the circle    
    //      rotation about z (45 deg)
    //      large-arc:boolean -- draw circle with angle > 180?
    //      sweep-flag:boolean -- (1 = clockwise, 0 = counter-clockwise)
    //      x,y -- the ending position of the arc
    //
    // ** Note that if you wish to use the same command again
    //  you can ommit the driver charcter and just provide the parameters.
    function path(d){
        var e = new svgElem("path",this.dom);        
        e._path_cmds = parse_pathcommand(d);
        e.attr("d",extract_pathcommand(e._path_cmds));
        return asPath.call(e);
    }
        
    function parse_pathcommand(d){        
        if( d === undefined || d === null){return null;}        
        var paramCount = {"m": 2, "l": 2, "v": 1, "h": 1, "z": 0, "c": 6, "s": 4, "q": 4, "t": 2, "a": 7};
        var rs = [];

        d.replace(util.regex.pathCommand,function(_,type,values){
            if( type === undefined || type === null){return;}
            if( values === undefined || values === null){return;}
            if( paramCount[type.toLowerCase()] === undefined){return;}

            var poj = {
                name: type,                                
                values: []
            };            

            // parse through the values and add them to the values array       
            values.replace(util.regex.pathValues,function(_,num){
                num && poj.values.push(+num);
            });

            // not enough parameters to make this type of object
            if( poj.values.length < paramCount[type.toLowerCase()] ){return;}

            // applyInterface(poj);
            rs.push(poj);
        });

        return rs;
    }

    // @param d [array] - an array of objects which holds the path data
    function extract_pathcommand(d){
        var command = "";
        var n = d.length;
        for(var i = 0;i < n; ++i){
            var s  = d[i].name;
            if( d[i].values.length > 0){
                s += " " + d[i].values.join(" ");
            }            
            command = command + s + " ";
        }
        return command;
    }




    function asPath(){
        this.d = function(val){
            if( val === undefined){
                return this.attr("d");
            }else{
                this._path_cmds = parse_pathcommand(d);
                return this.attr("d",extract_pathcommand(this._path_cmds));
            }
        }
        
        this.move = function(x,y){
            var p = this._path_cmds;
            var n = p.length;
            var i,j,m;
            for(var i = 0; i < n ; ++i){
                if(util.isUpperCase(p[i].name)){
                    var type = p[i].name
                    var vals = p[i].values;
                    var vals_len = vals.length;                    

                    if( type === "A"){
                        // position 5 and 6 denote the end point for the Arc pen cmd
                        vals[5] += x;
                        vals[6] += y;
                    }else if( type === "V" ){
                        vals[0] += y;
                    }else if( type === "H"){
                        vals[0] += x;
                    }else{
                        for(j = 0; j < vals_len; j += 2){
                            vals[j] += x;
                            vals[j+1] += y;
                        }
                    }
                }
            }

            // set the attribute on the dom node.
            this.attr("d",extract_pathcommand(this._path_cmds));
            return this;
        }

        this.insert = function(index,d){            
            if( index < -this._path_cmds.length){return this;}
            if( index > this._path_cmds.length){return this;}
            if( index < 0){
                index = this._path_cmds.length + index;
            }

            // parse the path fragment
            var d_cmds = parse_pathcommand(d);

            // insert into the correct place
            var begin = this._path_cmds.slice(0,index);
            var end = this._path_cmds.slice(index);
            this._path_cmds = begin.concat(d_cmds).concat(end);

            // set the attribute on the dom node.
            this.attr("d",extract_pathcommand(this._path_cmds));
            return this;
        }

        this.remove = function(index){
            if( index < -this._path_cmds.length){return this;}
            if( index >= this._path_cmds.length){return this;}
            if( index < 0){
                index = this._path_cmds.length + index;
            }

            Array.prototype.splice.call(this._path_cmds,index,1);
            this.attr("d",extract_pathcommand(this._path_cmds));
            return this;
        }

        this.point = function(index){
            if( index < -this._path_cmds.length){return this;}
            if( index >= this._path_cmds.length){return this;}
            if( index < 0){
                index = this._path_cmds.length + index;
            }

            applyInterface(this._path_cmds[index]);
            return this._path_cmds[index];
        }

        // after doing any modifications to the path, save and dump it back into the dom
        this.save = function(){
            return this.attr("d",extract_pathcommand(this._path_cmds));
        }

        return this;
    }

    // create an interface for each of hte path objects
    // Note that this is very very shit because of the multiple closures created
    // as well as the fact that all properties are methods calls
    function applyInterface(context){        
        // mapping between the array values and the accessor poperty
        // therefore we access the correct positoin the the context.values array.
        var defaultMapping = {
            x : 0,
            y : 1,
            c1 : [0,1],
            c2 : [2,3],
            end : [-2,-1]
        }

        var lower = context.name.toLowerCase();

        // change the mapping for each of function depending
        // on the type of interface we are creating.
        if( lower === "v" ){
            defaultMapping.y = 0;
        }else if(lower === 'h'){
            defaultMapping.x = 0;            
        }else if( lower === 'a'){
            defaultMapping.x = -2;
            defaultMapping.y = -1;
        }

        // allows -1 to index the last element of the array
        function correctIndex(i){
            if(i < 0){
                return context.values.length + i;
            }else {
                return i;
            }
        }

        // a wrapper whcih takes the desired mapIndex for the context.values
        function getSetValue(mapIndex){
            return function(val){
                if(val === undefined){
                    return context.values[correctIndex(mapIndex)];
                }else{
                    context.values[correctIndex(mapIndex)] = val;
                    return context;
                }
            }
        }

        // same as getsetValue excpet it wraps both the x and y values in
        // a an object.
        function getSetPoint(mapping){
            return function(x,y){
                if( x === undefined){
                    return {
                        x: context.values[correctIndex(mapping[0])],
                        y: context.values[correctIndex(mapping[1])]
                    };      
                }else{
                    context.values[correctIndex(mapping[0])] = x;
                    context.values[correctIndex(mapping[1])] = y;
                    return context;
                }
            }
        }
        context.c1 = getSetPoint(defaultMapping.c1);
        context.c2 = getSetPoint(defaultMapping.c2);
        context.end = getSetPoint(defaultMapping.end);
        context.x = getSetValue(defaultMapping.x);
        context.y = getSetValue(defaultMapping.y);


        // arcs have a few additional methods for manipulating the element.
        if( lower  === 'a'){
            context.rx = getSetValue(0);
            context.ry = getSetValue(1);
            context.rotation = getSetValue(2);

            function getSetBooleanValue(index){
                return function(b){
                    if( b === undefined){
                            return !!context.values[index];
                    }else{
                        if( b){
                            context.values[index] = 1;
                        }else{
                            context.values[index] = 0;
                        }
                        return context;
                    }                
                }
            }
            context.largeArc = getSetBooleanValue(3);
            context.clockwise = getSetBooleanValue(4);
        }
    }
});