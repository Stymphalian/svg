//gradient.js
svg.extend(function(svgElem,util,modules){
    svgElem.prototype.linearGradient = linearGradient;
    linearGradient.asLinearGradient = asLinearGradient;
    svgElem.prototype.radialGradient = radialGradient;
    radialGradient.asRadialGradient = asRadialGradient;

    // ----------------------
    // linearGradient
    // ----------------------
    function linearGradient(id,x1,y1,x2,y2){
        var e = new svgElem("linearGradient",this.dom);
        asLinearGradient.call(e);

        e.attr({
            id: id,
            x1:util.convertToPercentString(x1),
            y1:util.convertToPercentString(y1),
            x2:util.convertToPercentString(x2),
            y2:util.convertToPercentString(y2)
        });
        e._stops_array = [];

        return e;
    }

    function asGradientCommon(){

        var props =[
            {desired:"id"},

            // pad | repeat | reflect
            {desired:"spreadMethod"},

            // userSpaceOnUse | objectBoundingBox
            {desired:"units",real:"gradientUnits"},
            {desired:"gradientUnits"}
        ];

        this.attr.DirectAccess(this,props);

        // @param vals - 
        // vals === undefined -- retrieve the entire stop array
        // vals === number -- retreive a single entry in the stop array
        // vals === array -- set the stops_array to the given array
        //      format of the array is [ [offset,color,opacity],... ]
        this.stops = function(vals){
            if(vals === undefined){
                return this._stops_array;

            }else if( util.is(vals,"number")){
                // requesting a single stop values;
                var index = vals
                if(index < -this._stops_array.length){return this;}
                if(index >= this._stops_array.length){return this;}
                if( index < 0 ){
                    index = this._stops_array.length + index;
                }

                return this._stops_array[index];
            }else{
                var n =vals.length;
                this._stops_array = [];
                for(var i = 0; i < n ;++i){
                    this._stops_array.push({
                        offset: vals[i][0],
                        color: vals[i][1],
                        opacity: vals[i][2]
                    });
                } 

                setStops(this,this._stops_array);
                return this;
            }
        }

        // push the information in the stops array into the 
        // the dom.
        this.save = function(){ 
            setStops(this,this._stops_array);
            return this;
        }

        this.updateFromDom = function(){
            var s = getAllStopElems(this.dom);
            this._stops_array = makeArrayCopyofStops(s);
        }

        function getAllStopElems(dom){
            var rs = [];
            var children = dom.childNodes;
            var n = children.length;
            for(var i = 0;i < n; ++i ){
                if(children[i].nodeName ==="stop"){
                    rs.push(children[i]);
                }
            }            
            return rs;
        }


        // @param stops [array] - an array of dom <stop> dom nodes
        // @return rs - return an array of object
        // [{offset: x, color: y , opacity: z},...]
        function makeArrayCopyofStops(stops){
            var attr = svgElem.prototype.attr.attrInternal;
        
            var rs = [];
            var i = 0;
            var n = stops.length;
            for( i = 0;i < n; ++i){
                rs.push({
                    "offset": attr(stops[i],"offset"),
                    "stop-color" : attr(stops[i],"stop-color"),
                    "stop-opacity" : attr(stops[i],"stop-opacity"),
                });
            }

            return rs;
        }

        function setStops(context,stopsArray){
            // helper methods
            var attr = svgElem.prototype.attr.attrInternal;
            var stopsPool = getAllStopElems(context.dom);

            // create more stops if not enough
            while(stopsPool.length < stopsArray.length){
                var s = context.stop(0,0,0);
                stopsPool.push(s.dom);
            }

            var numUsed = 0;
            var n = stopsPool.length;
            for( var i = 0; i < n; ++i){
                attr(context,stopsPool[i],{
                    "offset": util.convertToPercentString(stopsArray[i].offset),
                    "stop-color": stopsArray[i].color,
                    "stop-opacity": stopsArray[i].opacity
                });

                numUsed += 1;
            }

            if( numUsed < stopsPool.length){
                // delete all the extra nodes
                var parent = stopsPool[numUsed];
                var j = numUsed;
                n = stopsPool.length;            
                for(var j = numUsed; j < stopsPool.length; ++j){
                    parent.removeChild(stopsPool[j])
                }
            }

            return context;
        }        

        return this;
    }

    

    function asLinearGradient(){        
        // for all the stops properties
        asGradientCommon.call(this);

        // get href property
        modules.common.asXlinkable.call(this);

        var props = [
            // amound of space into the shape in which the gradient should begin at.
            // please use a percentage (i.e "50%")
            {desired:"x1",isNum:true,munger:percentMunger},
            {desired:"y1",isNum:true,munger:percentMunger},

            // amount of space into the shape in which the gradient should end
            // please use a percentage (i.e "50%")
            {desired:"x2",isNum:true,munger:percentMunger},
            {desired:"y2",isNum:true,munger:percentMunger},
        ];

        this.attr.DirectAccess(this,props);
                
        this.start = function(x,y){
            if( x === undefined){
                x = util.convertFromPercentString(this.attr("x1"));
                y = util.convertFromPercentString(this.attr("y1"));
                return {                    
                    x: util.toNum(x),
                    y: util.toNum(y)
                };
            }else{
                this.attr({
                    x1:util.convertToPercentString(x),
                    y1:util.convertToPercentString(y)
                });
                return this;
            }
        }

        this.end = function(x,y){
            if( x === undefined){
                x = util.convertFromPercentString(this.attr("x2"));
                y = util.convertFromPercentString(this.attr("y2"));
                return {                    
                    x: util.toNum(x),
                    y: util.toNum(y)
                };
            }else{
                this.attr({
                    x2:util.convertToPercentString(x),
                    y2:util.convertToPercentString(y)
                });
                return this;
            }
        }

        return this;
    }


    // ----------------------
    // radialGradient
    // ----------------------
    function radialGradient(id,fx,fy,r){
        var e = new svgElem("radialGradient",this.dom);        

        asRadialGradient.call(e);
        e.attr({
            id:id,        
            fx:util.convertToPercentString(fx),
            fy:util.convertToPercentString(fy),
            r:util.convertToPercentString(r)
        });

        return e;
    }
    function asRadialGradient(){
        asGradientCommon.call(this);

        modules.common.asXlinkable.call(this);

        var props = [
            // amound of space into the shape in which the gradient should begin at.
            // please use a percentage (i.e "50%")
            {desired:"cx",isNum:true,munger:percentMunger},
            {desired:"cy",isNum:true,munger:percentMunger},

            // amount of space into the shape in which the gradient should end
            // please use a percentage (i.e "50%")
            {desired:"fx",isNum:true,munger:percentMunger},
            {desired:"fy",isNum:true,munger:percentMunger},

            {desired:"r",isNum:true,munger:percentMunger}
        ];
        this.attr.DirectAccess(this,props);

        this.center = modules.common.makePointProperty("cx","cy",percentMunger);
        this.focal = modules.common.makePointProperty("fx","fy",percentMunger);

        return this;
    }

    function percentMunger(val,isGet){
        if(isGet){
            return util.convertFromPercentString(val);
        }else{
            return util.convertToPercentString(val);
        }            
    }

});