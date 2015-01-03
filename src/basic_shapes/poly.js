//poly.js
svg.extend(function(svgElem,util){
    svgElem.prototype.polyline = polyline;
    svgElem.prototype.polygon = polygon;
    polyline.asPolyline = asPolyline;
    polygon.asPolygon = asPolygon;

    function polyline(points){
        var p = arrayOrString(points);
        if( p === null){return null;}
    
        var e = new svgElem("polyline",this.dom);
        e._points_array = p.points;
        e.attr("points",p.points_string);
        return asPolyline.call(e);
    }

    function polygon(points){
        var p = arrayOrString(points);
        if( p === null){return null;}
    
        var e = new svgElem("polygon",this.dom);
        e._points_array = p.points;
        e.attr("points",p.points_string);
        return asPolygon.call(e);
    }

    function asPolygon(){
        return asPolyMixin.call(this);
    }

    function asPolyline(){
        return asPolyMixin.call(this);
    }

    function asPolyMixin(){
        function inRange(index){
            if(index < -this._points_array.length/2 ){return false;}
            if(index >= this._points_array.length/2){return false;}
            return true;
        }

        Object.defineProperty(this,"numPoints",{
            get:function(){
                return this._points_array.length/2;
            }
        });        

        this.points = function(p){            
            if( p === undefined){
                return this._points_array;     
            }else{
                var v = arrayOrString(p);
                this._points_array = v.points;
                this.attr("points",v.points_string);
                return this;
            }
        }

        this.add = function(index,x,y){        
            if(index < -this._points_array.length/2){return this;}
            if(index > this._points_array.length/2){return this;}

            if(index <0 ){
                index = this._points_array.length /2 + index;
            }

            // add the point
            var p = this._points_array;
            Array.prototype.splice.call(p,index*2,0,x,y);

            this.attr("points",p.join(" "));
            return this;
        }

        // remove the point with the given index.
        this.remove = function(index){
            if( inRange.call(this,index) === false){return this;}

            if (index < 0){
                index = this._points_array.length/2 + index;
            }

            // remove the x and y for that point.
            var p = this._points_array;
            Array.prototype.splice.call(p,index*2,2);

            this.attr("points",p.join(" "));
            return this;
        }

        // retrieve a point at the given index
        // or set the point at the given index to the values provided
        // @param index [number] - the index in which to retrieve the point
        // @param x [number] - the x value to set for the point
        // @param y [number] - the y value to set for the point
        this.point = function(index,x,y){
            if( inRange.call(this,index) === false){return null;}
            if( index < 0){
                index = this._points_array.length/2 + index;
            }

            if( x=== undefined){
                return {
                    x:this._points_array[index*2],
                    y:this._points_array[index*2 + 1]
                };
            }else{
                var p  = this._points_array;
                p[index*2] = x;
                p[index*2 +1] = y;
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
            if( begin !== undefined && inRange.call(this,begin) === false){return this; }
            if( end !== undefined && inRange.call(this,end) === false){return this; }
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
        if( p === undefined || p === null){return null;}
        var points = p;
        var points_string = "";

        if(util.is(p,"array")){
            // process as an array
            points = p;
            points_string = points.join(" ");
        }else if( util.is(p,"string")){
            points_string = points;
            points = points_string.split(util.regex.split_seperator).map(function(v,k,arr){
                return util.toNum(v);
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