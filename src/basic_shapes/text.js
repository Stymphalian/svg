svg.extend(function(svgElem,util){
    svgElem.prototype.text = text;
    text.asText = asText;
    
    // @purpose - Create text at a position
    // @param textString [String] - the String to be displayed.
    // @param x [Number] - The x position to start the text from
    // @param y [Number] - The y position determinging the 'bottom' line
    // @attributes = 
    //  {
    //  "text-anchor":"start,middle,end",
    //  "text-decoration": "none,underline,overline,line-through",
    //  "text-rendering": "auto,optimizeSpeed,optimizeLegibility,geometricPrecision,inherit",    
    //  "textLength":42, //Browser will try to fit the text in the given length
    //  "lengthAdjust": " spacing,spacingAndGlyphs",    
    //  "kerning":40, //distance between glyphs
    //  "letter-spacing":5,//distance between letters.Negative numbers will decrease space between letters. 
    //  "word-spacing":7, //Spacing between words.
    //  "writing-mode":"lr-tb,rl-tb,tb-rl,lr,rl,tb,inherit",
    //  "glyph-orientation-vertical": 45, // angle in degrees
    //  "direction":"ltr,rtl"
    // }
    function text(textString,x,y){
        var e = new svgElem("text",this.dom);

        // set the position of the text node
        e.attr({x:x,y:y});

        // set the text of the text node
        e._text_textNode = svgElem.prototype.createTextNode(textString);
        e.dom.appendChild(e._text_textNode);

        return asText.call(e);
    }

    function setText(context,val){
        if( context.dom.contains(context._text_textNode)){
            context._text_textNode.nodeValue = val;
        }else{
            context._text_textNode = svgElem.prototype.createTextNode(val);
            context.dom.appendChild(context.text_textNode);
        }
    }
    function getText(context){
        if(context.dom.contains(context._text_textNode)){
            return context._text_textNode.nodeValue;
        }else{
            return "";
        }
    }
    
    function asText(){
        this.text = function(val){
            if( val === undefined){
                return getText(this);
            }else{
                setText(this,val);
                return this;
            }
        }


        var props = [
            {desired:"anchor",real:"text-anchor"},
            {desired:"decoration",real:"text-decoration"},
            {desired:"rendering",real:"text-rendering",isNum:true},
            {desired:"textLength",real:"textLength",isNum:true},
            {desired:"lengthAdjust",real:"lengthAdjust"},
            {desired:"kerning",real:"kerning",isNum:true},
            {desired:"letter_spacing",real:"letter-spacing",isNum:true},
            {desired:"word_spacing",real:"word-spacing",isNum:true},
            {desired:"writing_mode",real:"writing-mode"},
            {desired:"glyph_orientation_vertical",real:"glyph-orientation-vertical",isNum:true},
            {desired:"direction",real:"direction"},
        ];
        for(var i = 0 ;i < props.length;++i){
            this[props[i].desired] = (function(context,real,isNum){
                if(isNum){
                    return function(val){
                        if( val === undefined){
                            return util.isNum(context.attr(real));
                        }else{
                            context.attr(real,val);
                            return context;
                        }
                    }
                }else{
                    return function(val){                        
                        return context.attr(real,val);
                    }
                }                
            }(this,props[i].real,props[i].isNum));
        }

        return this;
    }

});