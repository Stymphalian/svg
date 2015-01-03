//marker.js
svg.extend(function(svgElem,util){
svgElem.prototype.marker = marker;
marker.asMarker = asMarker;

function marker(id,width,height){    
    var e = new svgElem("marker",this.dom);

    e.attr({
        id: id,
        "markerWidth":width,
        "markerHeight":height
    });

    asMarker.call(e);
    return e;
}

function asMarker(){
    // add properties to the created marker Object
    var props = [
        {desired:"id"},        

        // where should the marker be drawn from
        // this is realtive to the point in whcih it is assigned
        // default is 0,0
        {desired:"x",real:"refX",isNum:true},
        {desired:"y",real:"refY",isNum:true},

        // how big is the canvas for this marker
        {desired:"width" ,real:"markerWidth",isNum:true},
        {desired:"height",real:"markerHeight",isNum:true},

        // strokeWidth | userSpaceOnUse
        {desired:"units",real:"markerUnits"},

        // auto |  number
        {desired:"orient",isNum:true}
    ];
    this.attr.DirectAccessDiffName(this,props);

    // @param val [boolean] - turn on using userSpace or use the default strokeWidth
    this.useUserSpace = function(val){
        if( val === undefined){
            var rs = this.attr("markerUnits");
            if( rs !== null && rs !== undefined){
                return (rs === "userSpaceOnUse");
            }else{
                return false;
            }
        }else{
            if(!!val){
                this.attr("markerUnits","userSpaceOnUse");
            }
            return this;
        }
    }

    // the reference staring point for all the shaped within the marker
    this.ref = function(x,y){
        if( x === undefined){
            return {
                x: util.toNum(this.attr("refX")),
                y: util.toNum(this.attr("refY"))
            };
        }else{
            this.attr({
                "refX":x,
                "refY":y
            });
            return this;
        }
    }

    // receive a rect specifying the viewport units for the element.
    this.viewBox = function(x,y,w,h){
        if( x === undefined){
            var rs = this.attr("viewBox");
            if( rs === null){return null;}
            
            rs = rs.split(" ");
            return {
                x : parseFloat(rs[0]),
                y : parseFloat(rs[1]),
                w : parseFloat(rs[2]),
                h : parseFloat(rs[3])
            }                
        }else{
            this.attr('viewBox',[x,y,w,h].join(" "));
        }            
    }

    return this;
}

});