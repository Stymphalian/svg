svg.extend(function(svgElem,util){
    svgElem.prototype.color = new color();

    // @return [array,string] - 
    function color(){}

    function clamp(n){
        if( n < 0){return 0;}
        if( n > 255){return 255;}        
        return n;
    }
    color.prototype.rgb2hex = function(r,g,b){
        var h = ["#",0,0,0];
        h[1] = Number.prototype.toString.call(clamp(r),16);
        h[2] = Number.prototype.toString.call(clamp(g),16);
        h[3] = Number.prototype.toString.call(clamp(b),16);
        return Array.prototype.join.call(h,"");
    }

    color.prototype.hex2rgb = function(h){
        h = (h.charAt(0)==='#') ? h.substring(1,7) : h;
        return {
            r : parseInt(h.substring(0,2),16),
            g : parseInt(h.substring(2,4),16),
            b : parseInt(h.substring(4,6),16)
        };        
    }

    color.prototype.asHex = function(r,g,b){
        if( r === undefined){return null;}

        if( util.is(r,"string") ){

            // add the '#' if it is missin
            if( a.charAt(0) !== '#'){
                r = "#" + r;
            }
            return r;
        }else{
            if( g === undefined){return;}
            if( b === undefined){return;}
            // convert rgb to a hex value
            return color.prototype.rgb2hex(r,g,b);    
        }
    }

});