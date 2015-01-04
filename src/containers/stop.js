svg.extend(function(svgElem,util,modules){
    svgElem.prototype.stop = stop;
    stop.asStop = asStop;

    function stop(offset,stop_color){
        var e = new svgElem("stop",this.dom);

        e.attr({
            "offset" : util.convertToPercentString(offset),
            "stop-color":stop_color,            
            "stop-opacity" : 1.0
        });
        asStop.call(e);

        return e;
    }

    function percentMunger(val,isGet){
        if(isGet){
            return util.convertFromPercentString(val);
        }else{
            return util.convertToPercentString(val);
        }            
    }

    function asStop(){
        var props =[
            // amount of space offset from which we begin the stop
            {desired:"offset",isNum:true, munger:percentMunger},

            {desired:"color",real:"stop-color"},
            {desired:"opacity",real:"stop-opacity",isNum:true},
        ];
        this.attr.DirectAccess(this,props);
    }

});
