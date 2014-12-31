// line.js
svg.extend(function(svgElem,util){
    svgElem.prototype.line = line;
    line.asLine = asLine
    // svgElem.prototype.polyline = polyline;
    // polyline.asPolyling = asPolyline;

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

        this.points = function(p){            
            if( p === undefined){
                return _points_array;
            }else{
                var v = arrayOrString(p);
                this.attr("points",v.points_string);
                return this
            }
        }

        this.addPoint = function(index,x,y){

        }

        this.removePoint = function(index){
            if( index < 0){return this;}
            if( index >= this._points_array.length/2){return this;}

            var p = this._points_array;
            var start = index*2

            Array.prototype.slice.call(p,index*2,2);
            this.attr("points",p.join(" "));
            return context;
        }

        // retrieve a point at the given index
        this.point = function(index){
            if( index < 0){return null;}
            if( index >= this._points_array.length/2){return null;}

            return {
                x:this._points_array[index*2],
                y:this._points_array[index*2 + 1]
            };
        }

        // TODO: do a move only over a range of the points
        this.move = function(x,y){                        
            var n = this._points_array.length;
            var p = this._points_array;
            // shift all the points over
            for(var i = 0; i < n; i += 2){
                p[i] += x;
                p[i+1] += y;
            }

            p = arrayOrString(this._points_array);            
            this._points_array = p.points;
            this.attr("points",p.points_string);
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