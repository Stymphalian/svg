// line.js
svg.extend(function(svgElem,util){
    svgElem.prototype.line = line;    
    svgElem.prototype.polyline = polyline;
    line.asLine = asLine
    polyline.asPolyline = asPolyline;

    function line(x1,y1,x2,y2){
        var e = new svgElem("line",this.dom);
        e.attr({x1:x1,y1:y1,x2:x2,y2:y2});
        return asLine.call(e);
    }

    function polyline(points){
        var p = arrayOrString(points);
        if( p === null){return null;}
    
        var e = new svgElem("polyline",this.dom);
        e._points_array = p.points;
        e.attr("points",p.points_string);
        return asPolyline.call(e);
    }

    function asLine(){
        this.origin = function(x,y){
            if( x === undefined){
                return {
                    x: util.toNum(this.attr("x1")),
                    y: util.toNum(this.attr("y1")),
                };
            }else{
                this.attr({x1:x,y1:y});
                return this;
            }
        }

        this.dest = function(x,y){
            if( x === undefined){
                return {
                    x: util.toNum(this.attr("x2")),
                    y: util.toNum(this.attr("y2")),
                };
            }else{
                this.attr({x2:x,y2:y});
                return this;
            }
        }

        this.move = function(x,y){
            var p = this.attr(["x1","y1","x2","y2"]);
            p.x1 = util.toNum(p.x1) + x;
            p.y1 = util.toNum(p.y1) + y;
            p.x2 = util.toNum(p.x2) + x;
            p.y2 = util.toNum(p.y2) + y;
            this.attr(p);
            return this;
        }

        return this;
    }

    function asPolyline(){
        function inRange(index){
            if(index < 0 ){return false;}
            if( index >= this._points_array.length/2){return false;}
            return true;
        }

        this.points = function(p){            
            if( p === undefined){
                return _points_array;
            }else{
                var v = arrayOrString(p);
                this._points_array = p.points;
                this.attr("points",v.points_string);
                return this;
            }
        }

        this.add = function(index,x,y){        
            if(index < 0 ){return this;}
            if(index > this._points_array.length){return this;}            

            // add the point
            Array.prototype.splice(index*2,0,x,y);

            this.attr("points",p.join(" "));
            return context;
        }

        // remove the point with the given index.
        this.remove = function(index){
            if( inRange(index) === false){return this;}

            // remove the x and y for that point.
            var p = this._points_array;
            Array.prototype.splice.call(p,index*2,2);

            this.attr("points",p.join(" "));
            return context;
        }

        // retrieve a point at the given index
        // or set the point at the given index to the values provided
        // @param index [number] - the index in which to retrieve the point
        // @param x [number] - the x value to set for the point
        // @param y [number] - the y value to set for the point
        this.point = function(index,x,y){
            if( inRange(index) === false){return this;}            

            if( x=== undefined){
                return {
                    x:this._points_array[index*2],
                    y:this._points_array[index*2 + 1]
                };
            }else{
                var p  = this._points_array;
                p[index*2] = x;
                p[index*2] = y;
                this.attr("points",p.join(" "));
                return this;
            }
        }
        
        // @param x [number] - the amount of x to shift the points
        // @param y [number] - the amount of x to shift the points
        // @param begin [number] - optional. specify a begin in which to start shifting points.
        //      default is at index 0
        // @param end [number] - optional. specify the end in which to stop shifting points.
        //      default is at the end of the array.
        this.move = function(x,y,begin,end){
            if( begin !== undefined && inRange(begin) === false){return this; }
            if( end !== undefined && inRange(end) === false){return this; }
            if( begin === undefined){begin = 0;}
            if( end === undefined ){end = this._points_array.length/2;}

            var p = this._points_array;
            var n = end*2;            
            // shift all the points over
            for(var i = begin*2 ; i < n; i += 2){
                p[i] += x;
                p[i+1] += y;
            }
                        
            this.attr("points",p.join(" "));
            return this;
        }

        return this;
    }


    function arrayOrString(p){
        var points = p;
        var points_string = "";

        if(util.is(p,"array")){
            // process as an array
            points = p;
            points_string = points.join(" ");
        }else if( util.is(p,"string")){
            points_string = points;
            points = points_string.split(" ").map(function(v,k,arr){
                return util.isNum(v);
            });
        }

        //must have an even number of points
        if( points.length %2 !== 0){
            console.error("Require an even number of numbers"); 
            return null;
        }

        return {
            points:points,
            points_string: points_string
        };
    }

});