(function(){
    // ========================
    // bootstrap code
    // ========================
    window.noin = noin;

    // TODO: this seems like a shitty idea..
    // core modules references  
    var factory = null;
    var globals = {
        svg_ns :'http://www.w3.org/2000/svg',       
        xlink_ns : 'http://www.w3.org/1999/xlink'
    };
    //bootup();
        

    // =====================================
    // Library Code
    // =====================================
    // @purpose -- first call to the library to set everything up.  
    //      Default staring position is 0,0 with width and height of container.
    // @param parentElementId:String -- The id of a container in which to add the
    // @param width:Number -- the width of the svg element. 
    //      Defaults to client width of the container.  
    // @param height:Number -- the height of the svg element.
    //      Defaults to the clientHeight of the container
    // @params options:Object -- currently not used.
    function noin(parentElementId,width,height,options){    
        var container = document.getElementById(parentElementId);       
        if( container === null){
            console.error("Invalid parent container id");
            return null;
        }

        if( width === undefined){width = container.clientWidth;}
        if( height === undefined){height = container.clientHeight;}
        var canvas = factory.svg(0,0,width,height);
        canvas.dom.setAttribute("xmlns",globals.svg_ns);
        canvas.dom.setAttributeNS(globals.svg_ns,"xlink",globals.xlink_ns);
        canvas.attr({
                            "version":"1.1",
                            "baseProfile":"full",       
                            //"xmlns": globals.xml_ns,
                            //"xlink": globals.xlink_ns
                            });
        // TODO: Find out why I can't use the attr to set this attribute

        container.appendChild(canvas.dom);

        return canvas;
    }

    // ==========================================
    // S V G E L E M E N T
    // shell elements which we pass to the user such that
    // they can manipulate and display them.
    // @mixin : FactoryElements.prototype.exports list of functions are mixed-in
    // ==========================================
    function SvgElement(dom,attrMunger){
        // public
        this.dom = dom;

        // private
        this._attrMunger = attrMunger;
    }

    // =================================
    // Helper Methods
    // =================================    
    // @purpose -- fill the shell with the exports from a source.
    // @param ref:Object -- the object from which we will mixin.
    // @param exports:Array -- array of Strings containing the names of
    //      the properties to mixin.    
    // @param functor:Function -- function(ref,name){return function(){}}

    SvgElement.prototype._mixinExtension = function(ref,exports,functor){
        var i,n;
        // aspect used to automate mixing in methods into SvgElement shells.
        for( i = 0,n = exports.length; i < n; ++i){         
            if(SvgElement.prototype[exports[i]] ){
                console.warn("Overwriting prototype property " + exports[i]);
            }
            SvgElement.prototype[exports[i]] = functor(ref,exports[i]);
        }
        return this;
    }
    
    // @purpose -- Append the current SvgElement to the dom node.
    // @param elem:SvgElement -- the element to append to this.dom
    // @return SvgElement -- returns 'this'
    SvgElement.prototype._appendToContext = function(elem){
        if(elem){this.dom.appendChild(elem.dom);}
        return this;
    }

    

    // @purpose --Takes a key and value and set the attribute on the current dom node.
    // @param attr:String -
    // @param value:? --
    // @param ns:? -- optional
    // @return this --
    function _array2String(v){return (v instanceof Array) ? v.join(" ") : v;}
    SvgElement.prototype._defaultAttrMunger = {     
        "stroke-dasharray": _array2String,
        "viewBox": _array2String
    }       
    SvgElement.prototype._setAttr = function(attr,value,ns){
        if( ns === undefined){ns = null;}
        var v = value;
        if( this.attrMunger){
            // if a attribute Munger function was defined,
            // apply the function and take the result as the atribute value
            v = this.attrMunger(attr,value);            
        }

        // if the attrMunger didn't do anything to the value, then apply the
        // default attrMunger functions
        if( v === value && SvgElement.prototype._defaultAttrMunger[attr]){
            v = SvgElement.prototype._defaultAttrMunger[attr](value);
        }

        this.dom.setAttributeNS(ns,attr,v);
        return this;
    }   


    // ===========================
    // Core Methods
    // ===========================
    // @purpose -- Several uses depending what gets passed in as the parameter
    //  No arguments == return [ [key,value],...] of all the attributes
    //  String == return value for the specified key
    //  String,value  == set the attribute 'string' to 'value'
    //  Object == set the properties, and return the object.
    // @param arg1: --
    // @param arg2: --
    // @return --
    SvgElement.prototype.attr = function(arg1,arg2){
        var properties = arg1;
        var key = arg1;
        var value = arg2;

        if(arg1){
            if( properties instanceof Object && !(properties instanceof Array) ){                               
                // mixin the properties
                for(var e in properties){
                    if(properties.hasOwnProperty(e)){
                        this._setAttr(e,properties[e]);                     
                    }               
                }               
                return this;            
            }else if( typeof properties === "string"){              
                if( value === undefined){
                    // getter
                    return this.dom.attributes[key].value;
                }else{
                    // setter
                    this._setAttr(key,value);
                    return this;
                }
            }
        }else {
            // return an array of attributes
            return (function(){
                var attrs = [];
                var n = this.dom.attributes.length;
                var key,value;
                for(var i = 0;i < n; ++i){              
                    key = this.dom.attributes[i].name;
                    value = this.dom.attributes[i].value;                   
                    attrs.push([key,value]);
                }
                return attrs;
            }).call(this);
        }
    }

    // @purpose -- remove all child elements.
    // @return this
    SvgElement.prototype.clear = function(){        
        while(this.dom.firstChild){
            this.dom.removeChild(this.dom.firstChild);
        }
        return this;
    }



    // ====================================
    //  E L E M E N T F A C T O R Y
    // Factory for creating all SvgElements
    // ==================================== 
    function ElementFactory(){}

    // @purpose -- Name all the properties of this object which will be mixin
    //      to the SvgElement prototype.
    ElementFactory.prototype.exports = [
        "svg","circle","ellipse","rect","text","tspan","tref","textPath","line",
        "polygon","path","defs","stops","linearGradient","radialGradient","pattern",
        "g","clipPath","mask"
    ].sort();       

    // @purpose -- Wrapper to creat an SvgElement. Hopefully this will make
    //  extensions to the library easier later on...
    // @return SvgElement -- the new created SvgElement
    ElementFactory.prototype.createSvgElement = function(name){
        return new SvgElement(this.createElement(name));
    }

    // @purpose -- wrapped to create a new Namespaced dom node.
    // @reutrn domNode --
    ElementFactory.prototype.createElement = function(name){
        return document.createElementNS(globals.svg_ns,name)
    }

    // @purpose -- Given an property bag,use them as attributes on the provided domNode
    // @param dest:domNode -- the target domNode in which to mixin the properties
    // @param properties:Object -- the property bag used for the mixin. There is no
    //      checking for proper key-value pairs in this method.
    //      key:String, value:[ String || Number ]
    // @return domNode -- return the dest
    ElementFactory.prototype.setAttributesFromMixin = function(dest,properties){
        if(dest === undefined){return;}
        if(properties === undefined){return;}

        // mixin the properites as attributes of the rect
        if( properties instanceof Object && !(properties instanceof Array) ){
            for(var e in properties){
                if(properties.hasOwnProperty(e)){                   
                    dest.setAttribute(e,properties[e]);
                }               
            }               
        }
        return dest;
    }
    
    // @purpose -- Create an svg element.
    // @param x:Number -- offset the x coordinate of the svg element
    // @param y:Number -- offset the y coordinate of the svg element
    // @param width:Number -- width of the svg element.
    // @param height:Number -- height of the svg element.
    // @return s -- the SvgElement that was created.
    // @attributes = 
    // {
    //  viewBox: "0 0 200 200,[0,0,200,200]" // treat the given area using the provided dimensions
    // }
    ElementFactory.prototype.svg = function(x,y,width,height,options){
        var s = this.createSvgElement("svg");
        if(x){s.dom.setAttributeNS(null,"x",x);}
        if(y){s.dom.setAttributeNS(null,"y",y);}
        if(width){s.dom.setAttributeNS(null,"width",width);}
        if(height){s.dom.setAttributeNS(null,"height",height);}
        return s;
    }


    // @purpose -- Create a circle element
    // @param cx:Number -- the x center of the circle
    // @param cy:Number -- the y center of the circle
    // @param r:Number -- the radius of the circle
    // @return s -- the SvgElement wrapping the circle      
    ElementFactory.prototype.circle = function(cx,cy,r,options){
        var s = this.createSvgElement("circle");        
        s.dom.setAttributeNS(null,"cx",cx);
        s.dom.setAttributeNS(null,"cy",cy);
        s.dom.setAttributeNS(null,"r",r);       
        return s;
    }       


    // @purpose -- Create an ellipse
    // @param cx:Number -- the x center of the circle
    // @param cy:Number -- the y center of the circle
    // @param rx:Number -- the x-radius of the circle
    // @param ry:Number -- the y-radius of the circle
    // @return s -- the SvgElement wrapping the ellipse
    ElementFactory.prototype.ellipse = function(cx,cy,rx,ry,options){
        var s = this.createSvgElement("ellipse");
        s.dom.setAttributeNS(null,"cx",cx);
        s.dom.setAttributeNS(null,"cy",cy);
        s.dom.setAttributeNS(null,"rx",rx);
        s.dom.setAttributeNS(null,"ry",ry);
        return s;
    }

    // @purpose - Create a rectangle element
    // @param x:Number -- the top-left x corner of the rectangle.
    // @param y:Number -- the top-left y of the rectangle.
    // @param w:Number -- the width of the rectangle
    // @param h:Number -- the height of the rectangle
    // @return s -- the SvgElement wrapping the rectangle.  
    // @attributes = 
    // {
    //  rx:30, // the x-rounding of the corners
    //  ry:40  // the y-rounding of the corners
    // }    
    ElementFactory.prototype.rect = function(x,y,w,h,options){      
        var s = this.createSvgElement("rect");
        s.dom.setAttributeNS(null,"x",x);
        s.dom.setAttributeNS(null,"y",x);
        s.dom.setAttributeNS(null,"width",w);
        s.dom.setAttributeNS(null,"height",h);
        return s;
    }


    // TODO: Find a better way to mixing the properties to the object
    // @purpose -- Mixin additiona methods to the Text SvgElement object
    // @param s:SvgElement -- the obejct in which to add the method
    ElementFactory.prototype._mixinAdditionalTextMethods = function(s){
        s.getText = function(){
            var i,n;
            var str = "";
            var childNodes = s.dom.childNodes;          
            for(i =0,n= childNodes.length; i < n ; ++i){
                if( childNodes[i].nodeName === "#text"){
                    str += childNodes[i].nodeValue;
                }
            }
            return str;
        }
        s.setText = function(text){
            if(text){
                // TODO: will the first child of my SvgText Elements
                // always be the textnode.              
                if( s.dom.firstChild === null){
                    var textNode = document.createTextNode(text);
                    s.dom.appendChild(textNode);                    
                }else{
                    s.dom.firstChild.nodeValue = text;              
                }               
            }
            return s;           
        }
    }   
    // @purpose - Create text at a position
    // @param x:Number -- The x position to start the text from
    // @param y:Number -- The y position determinging the 'bottom' line
    // @param text:String -- the String to be displayed.
    // @return s -- the SvgElement created.
    // @attributes = 
    //  {
    //  "text-anchor":"start,middle,end",
    //  "text-decoration": "none,underline,overline,line-through",
    //  "text-rendering": "auto,optimizeSpeed,optimizeLegibility,geometricPrecision,inherit",    
    //  "textLength":42, //Browser will try to fit the text in the given length
    //  "lengthAdjust": " spacing,spacingAndGlyphs",
    //  "font-family": "Arial,Verdana,Helvetica",
    //  "font-size":"45px",
    //  "font-size-adjust":0, // aspect ratio to preserve x-height       
    //  "font-stretch":"normal,wider,narrower,[ultra,extra,semi]-condensed,[ultra,extra,semi]-expanded",    
    //  "font-style": "normal,italic,oblique,inherit",
    //  "font-variant": "normal,small-caps,inherit",
    //  "font-weight": "normal,bold,bolder,lighter,100-900,inherit",
    //  "kerning":40, //distance between glyphs
    //  "letter-spacing":5,//distance between letters.Negative numbers will decrease space between letters. 
    //  "word-spacing":7, //Spacing between words.
    //  "writing-mode":"lr-tb,rl-tb,tb-rl,lr,rl,tb,inherit",
    //  "glyph-orientation-vertical": 45, // angle in degrees
    //  "direction":"ltr,rtl"
    // }    
    ElementFactory.prototype.text = function(x,y,text,options){
        var s = this.createSvgElement("text");

        // A user can optionally only pass in the text.
        // e.g. for the case of creating a text in a defs section.
        var t = text;
        if( typeof x === "string" && isNaN(x) ){
            t = x;
        }else{
            if(x){s.dom.setAttributeNS(null,"x",x);}
            if(y){s.dom.setAttributeNS(null,"y",y);}
        }
        
        // adding the text
        if(t){
            var textNode = document.createTextNode(t);
            s.dom.appendChild(textNode);
        }

        this._mixinAdditionalTextMethods(s);
        return s;
    }

    // textLength
    // x,y,rotate   
    // @purpose Create a sub-text element.Must be embededed with an <text> element.
    //      properties x and y provide absolute positioning, and have higher priority
    //      than dx and dy positioning.
    // @param dx:Number || Array -- The relative distance between letter
    // @param dy:Number || Array -- The realtive distance between each letter
    // @param text:String -- The text to be displayed.
    // @return s -- the SvgElement created.
    // @attributes = 
    // {
    //  x: 40, // absolute position of the text with respect to the svg canvas
    //  y: 60, // aboslute position of the text with respect to the svg canvas
    //  rotate:45,[5,10,15,20] // rotation of the characters
    // }
    ElementFactory.prototype.tspan = function(dx,dy,text,option){
        var s = this.createSvgElement("tspan");
        if( dx instanceof Array){ dx = dx.join(" ");}
        if( dy instanceof Array){ dy = dy.join(" ");}               
        s.dom.setAttributeNS(null,"dx",dx);
        s.dom.setAttributeNS(null,"dy",dy);

        if( text){
            var textnode = document.createTextNode(text);
            s.dom.appendChild(textnode);
        }
        
        s.attrMunger = function(key,value){
            if(["rotate","x","y","dx","dy"].indexOf(key) > -1 && value instanceof Array){
                return value.join(" ");
            }else{
                return value;
            }
        }       

        this._mixinAdditionalTextMethods(s);
        return s;
    }

    // @purpose -- Create a tref element. You can use this to reference
    //      another <tspan>, or <text> element and use the text from that.
    //  doesn't seem to work on my browser...
    // @param href:String -- the id of the text to reference (e.g  "#element_id")
    // @return s -- the SvgElement created.
    ElementFactory.prototype.tref = function(href,opetions){
        var s = this.createSvgElement("tref");
        s.dom.setAttributeNS(globals.xlink_ns,"xlink:href",href);               
        return s;
    }

    // @purpose -- Create a textPath. The text will be layed out along the path
    //      specified by the hreft.The element must be child of a text,or tspan element.
    // @param href:String -- the id of the path to follow.(e.g  "#element_id")
    // @param text:String -- the text to be displayed.
    // @return s -- the SvgElement created.
    // @note: TextPath only works the path is NOT in a defs tag.
    ElementFactory.prototype.textPath = function(href,text,options){
        var s = this.createSvgElement("textPath");      
        s.dom.setAttributeNS(globals.xlink_ns,"href",href);
        //s.dom.setAttributeNS('http://www.w3.org/1999/xlink',"href",href);
        

        if(text){
            var textnode = document.createTextNode(text);
            s.dom.appendChild(textnode);
        }

        this._mixinAdditionalTextMethods(s);
        return s;
    }

    
    // Create a line svg element. Either create a line segment
    // using x1,y1 and x2,y2
    // or create a polyline by passing in an array of points.       
    ElementFactory.prototype.line = function(){ 
        function line_segment(x1,y1,x2,y2,properties){
            var line = this.createSvgElement("line");
            line.dom.setAttributeNS(null,"x1",x1);
            line.dom.setAttributeNS(null,"y1",y1);
            line.dom.setAttributeNS(null,"x2",x2);
            line.dom.setAttributeNS(null,"y2",y2);          
            return line;            
        }

        function poly_line(points, properties){                     
            var polyline = this.createSvgElement("polyline");
            polyline.attrMunger = function(key,value){
                if(key === "points"){
                    if( value instanceof Array){
                        return value.join(" ");
                    }
                }
                return value;
            }
            polyline.setAttributeNS(null,"points",points);

            return polyline;
        }       


        var points_regex = /^(\s*\d*\.?\d+[\s,]\s*)+(\s*\d*\.?\d+\s*)$/
        if( arguments[0] instanceof Array ){
            if(arguments[0].length % 2 !== 0){return null;}
            return poly_line.apply(this,arguments);
        }else if(typeof arguments[0] === String && points_regex.test(arguments[0])){
            return poly_line.apply(this,arguments);
        }else{
            return line_segment.apply(this,arguments);
        }
    }


    ElementFactory.prototype.polygon = function(points,properties){
        var p = null;;

        var points_regex = /^(\s*\d*\.?\d+[\s,]\s*)+(\s*\d*\.?\d+\s*)$/
        if( points instanceof Array){
            if (points.length %2 !== 0){return null;}
            p = points.joins(" ");
        }else if(typeof points === "string" && points_regex.test(points) ){
            p = points;
        }else{
            console.error("Invalid parameter points = " + points);
            return null;
        }

        var s = this.createSvgElement("polygon");       
        s.dom.setAttributeNS(null,"points",p);
        return s;
    }

    // @purpose -- Create a path svg element.
    // @param d:String -- the string to be used as the path.
    // @return s -- The created SVG element.
    ElementFactory.prototype.path = function(d,options){        
        var s = this.createSvgElement("path");
        s.dom.setAttributeNS(null,"d",d);
        return s;       
        // relative(lower-case),absolute(upper-case)
        // Move                                     (M x y)
        // Line To                              (L x y)
        // Vertical Line                        (V x)
        // Horizontal Line                  (H y)
        // Close Path                           (Z)
        // Cubic Bezier                         (C ctrl1_point, ctrl2_point, end_point)     
        //  string Cubics together      (S ctrl2_point, end_point )
        //      Use the a reflection of 
        //      the previous ctrl point
        //      as ctrl1_point
        // Quadratic Bezier                     (Q ctrl_point, end_point)
        //  string quads together       (T end_point)
        // Arc                                  (A rx ry rotation large-arc? clockwise? x y)
        //      rotation about z (45 deg)
        //      large-arc:boolean -- draw circle with angle > 180?
        //  sweep-flag:boolean -- (1 = clockwise, 0 = counter-clockwise)
        //      x,y -- the ending position of the arc
        //
        // ** Note that if you wish to use the same command again
        //  you can ommit the driver charcter and just provide the parameters.
    }


    ElementFactory.prototype.defs = function(options){
        var d = this.createSvgElement("defs");
        return d;       
    }

    // stops = [[offset,properties]]
    // stops = [[offset,stop-color,properties]]
    ElementFactory.prototype.stops = function(stops){
        function createStopElement(stop){
            if(!(stop instanceof Array) ){return null;}
            var s = this.createSvgElement("stop");
            s.dom.setAttributeNS(null,"offset",stop[0]);

            if( stop.length >= 2){
                // treat as a stop colour
                if(typeof stop[1] === "string" || typeof stop[1] === "number" ){
                    s.domsetAttributeNS(null,"stop-color",stop[1]);

                    // last argument is a properties object
                    if(stop.length >= 3){
                        this.setAttributesFromMixin(s.dom,stop[2]);
                    }

                }else if( stop[1] instanceof Object){               
                    // We have been passed in a property object
                    this.setAttributesFromMixin(s.dom,stop[1]);                 
                }
            }
            return s;
        }
        
        if(stops === undefined || !(stops instanceof Array) ){return null;}     
        var rs = []
        var stopsLength = stops.length;
        var e;
        for(var i = 0;i < stopsLength; ++i){            
            e = createStopElement.call(this,stops[i]);
            if(e !== null){rs.push(e);}
        }
        return rs;
    }
    

    // spreadMethod = "pad","reflect","repeat"
    // gradientUnits = "userSpaceOnUse","objectBoundingBox"
    // userSpaceOnUse  --> Use absolut coordinates
    // url("#ID")
    // x1,y1,x2,y2
    ElementFactory.prototype.linearGradient = function(id,x1,y1,x2,y2,options){
        if( id === undefined){return null;}
        var s = this.createSvgElement("linearGradient");
        s.dom.setAttributeNS(null,"id",id);
        if( arguments.length === 5){
            s.dom.setAttributeNS(null,"x1",x1);
            s.dom.setAttributeNS(null,"y1",y1);
            s.dom.setAttributeNS(null,"x2",x2);
            s.dom.setAttributeNS(null,"y2",y2);     
        }
        return s;       
    }
    //cx,cy,r,fx,fy
    ElementFactory.prototype.radialGradient = function(id,cx,cy,r,options){
        if( id === undefined){return null;}
        var s = this.createSvgElement("radialGradient");
        s.dom.setAttributeNS(null,"id",id);
        s.dom.setAttributeNS(null,"cx",cx);
        s.dom.setAttributeNS(null,"cy",cy);
        s.dom.setAttributeNS(null,"r",r);               
        return grad;
    }   


    // x,y -- how much to offset before drawing the pattern
    // width,height -- percent of the bounding box before we start repeating the pattern
    // patternUnits == "objectBondingBox", "userSpaceOnUse"
    // patternContextUnits == "userSpaceOnUse","objectBondingBox"
    ElementFactory.prototype.pattern = function(id,offset_x,offset_y,width,height,options){
        if( id === undefined){return null;}
        var p = this.createSvgElement("pattern");
        p.dom.setAttributeNS(null,"id",id);
        p.dom.setAttributeNS(null,"x",offset_x);
        p.dom.setAttributeNS(null,"y",offset_y);
        p.dom.setAttributeNS(null,"width",width);
        p.dom.setAttributeNS(null,"height",height);
        return p;   
    }

    ElementFactory.prototype.g = function(options){
        var g = this.createSvgElement("g");     
        return g;
    }

    ElementFactory.prototype.clipPath = function(id,options){
        if(id === undefined){return null;}
        var s = this.createSvgElement("clipPath");
        s.dom.setAttributeNS(null,"id",id);
        return s;
    }

    ElementFactory.prototype.mask = function(id,properties){
        if(id === undefined){return null;}
        var s = this.createSvgElement("mask");
        s.dom.setAttributeNS(null,"id",id);
        return s;               
    }

    // <?xml version="1.0" standaone="no" ?>
    // <?xml-stylesheet type="text/css" href="style.css"?>
    // transform="translate(30,40),rotate(45),skewX(),skewY(),scale(1.5,0.5),matrix(a,b,c,d,e,f)
    ElementFactory.prototype.GetStyles = function(){
        var bag = {
            "stroke":"black",// rgb(0,0,0),#000000
            "stroke-opacity":0.5,
            "stroke-width":20,
            "stroke-linecap":"butt", //square,round
            "stroke-linejoin":"miter",//bevel,round
            "stroke-dasharray":"5,10,5", // filled,unfilled,filled
            "stroke-dashoffset": 5,
            "stroke-miterlimit": 5,
            
            "fill-opacity":0.5,         
            "fill":"black", // rgb(0,0,0),#000000, transparent,none
            "fill-rule": "nonzero", // evenodd
        };
        return bag;
    }

    

    (function bootup(){
        // create and load the modules.
        factory = new ElementFactory();

        // ================================
        // Automate library maitenance
        // ================================
        // mixing in the element factory methods into the shell
        // TODO: change the _mixinExtension such that it takes a reference to the object
        // in which the function will use for mixing-in
        SvgElement.prototype._mixinExtension(
                factory,
                ElementFactory.prototype.exports,
                function(factory,name){

                // a shim between calling the actual factory function
                return function(){
                    if( factory[name] ){
                        var i,n;
                        var e = factory[name].apply(factory,arguments);

                        if( e instanceof Array){                    
                            // we were returned an array of elements to append.
                            for(i = 0,n = e.length; i < n; ++i){
                                this._appendToContext(e[i]);
                            }
                        }else{
                            this._appendToContext(e);
                        }               

                        return e;
                    }else{
                        throw new Error("Unable to mixin '" + name + "'. exports[" + name + "] does not exist");
                    }           
                }               
        });
    }());


})();



// @source -- A function object
// @exports -- Array of strings which 
function TakeObjectAndReturnFunctionalMixin(source,exports){
    // do some error checking.
    if( typeof source === 'undefined'){return null;}
    if( typeof exports === 'undefined'){return null;}
    if( !exports instanceof Array){return null;}


    // Create a cache of the desired properties
    // We do this to help improve performance.
    var cache = {};
    var i,n,name;   
    for(i = 0, n= exports.length; i < n; ++i){      
        name = exports[i];      
        if( typeof source.prototype[name] === 'undefined'){
            console.log(source.name + ".prototype['" + name  + "'] does not exist");
            continue;
        }
        cache[name] = source.prototype[name];
    }


    // helper method for setting the property
    // on the target object, and allow for some error checking.
    function _setProperty(name,fn){
        if(this[name]){console.log("Overwriting property '" + name + "'");}
        this[name] = fn;
    }
    
    
    // This returns a functioMixin
    // Call this function with .call(object.prototype)
    return function(){
        for(var key in cache){
            if(cache.hasOwnProperty(key)){
                _setProperty.call(this,key,cache[key]);
            }           
        }       
    }   

}


function kepler(a){
    this.gatcha = "hell no " + a;
}
kepler.prototype.shita= function(){
    console.log(this.gabi + " shita");
};
kepler.prototype.shitb= function(){
    console.log(this.gabi + " shitb");
};
kepler.prototype.shitd = "some shitd"

function amazai(a,b){
    this.__proto__.__proto__.constructor.call(this,a);
    //kepler.call(this,a);
    this.man = "hell yes " + b;
}
amazai.prototype = new kepler();
amazai.prototype.shitc = function(){
    console.log(this.gabi + " shitc");
}
amazai.prototype.constructor = amazai.constructor;

var As_Kepler = TakeObjectAndReturnFunctionalMixin(kepler,["shita","shitb","shitd"]);
var As_Amazai = TakeObjectAndReturnFunctionalMixin(amazai,["shitc"]);

function Animal(name){
    this.gabi = name;
}


var dd = new amazai("jordan","ginelle");

As_Kepler.call(Animal.prototype);
As_Kepler.call(Animal.prototype);
As_Amazai.call(Animal.prototype);

var a = new Animal("jordan");
var g = new Animal("ginelle");

a.shita();
a.shitb();
a.shitc();
g.shita();
g.shitb();
g.shitc();





// var options = {a:4,b:5,c:6};
// var As_Text = (function(options){
//  function foo(){console.log("foot");}
//  function bar(){console.log("bar");}
//  function zick(){console.log("zick");}

//  function __(name,fn){       
//      if( this[name]){
//          console.log("Overwriting property '" + name + "'");
//      }
//      this[name] = fn;
//  }
//  return function(){
//      // mixin the functions.
//      __.call(this,"foo",foo);
//      __.call(this,"bar",foo);
//      __.call(this,"zick",foo);
//  }

// }(options));

// function Animal(){}
// function Cat(){}
// Cat.prototype = new Animal();
// Cat.prototype.constructor = Cat.constructor;

// As_Text.call(Animal.prototype);
// As_Text.call(Animal.prototype);