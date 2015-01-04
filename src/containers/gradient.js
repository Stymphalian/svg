//gradient.js
svg.extend(function(svgElem,util,modules){
    svgElem.prototype.linearGradient = linearGradient;
    linearGradient.asLinearGradient = asLinearGradient;
    svgElem.prototype.radialGradient = radialGradient;
    radialGradient.asLinearGradient = asRadialGradient;


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

        return e;
    }

    function asGradientCommon(){
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

        function getAllStopElems(){
            var rs = [];
            var children = this.dom.childNodes;
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
            var attr = svgElem.attr.attrInternal;
        
            var rs = [];
            var i = 0;
            var n = stops.length;
            for( i = 0;i < n; ++i){
                var poj = {

                }
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
            var attr = svgElem.attr.attrInternal;
            var stopsPool = getAllStopElems();

            // create more stops if not enough
            while(stopsPool.length < stopsArray.length){
                var s = context.stop(0,0,0);
                stopsPool.push(s.dom);
            }

            var numUsed = 0;
            var n = stopsPool.length;
            for( var i = 0; i < n; ++i){
                attr(stopsPool[i],{
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
        asGradientCommon.call(this);

        var props = [
            {desired:"id"},

            // amound of space into the shape in which the gradient should begin at.
            // please use a percentage (i.e "50%")
            {desired:"x1",isNum:true,munger:percentMunger},
            {desired:"y1",isNum:true,munger:percentMunger},

            // amount of space into the shape in whcih the gradient should end
            // please use a percentage (i.e "50%")
            {desired:"x2",isNum:true,munger:percentMunger},
            {desired:"y2",isNum:true,munger:percentMunger},

            // pad | repeat | reflect
            {desired:"spreadMethod"},

            // userSpaceOnUse | objectBoundingBox
            {desired:"units",real:"gradientUnits"},
            {desired:"gradientUnits"},
        ];

        this.attr.DirectAccess(this,props);
                
        // get href property
        modules.common.asXlinkable.call(this);
    }


    // ----------------------
    // radialGradient
    // ----------------------
    function radialGradient(){

    }
    function asRadialGradient(){

    }


    function percentMunger(val,isGet){
        if(isGet){
            return util.convertFromPercentString(val);
        }else{
            return util.convertToPercentString(val);
        }            
    }

});