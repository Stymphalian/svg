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
        if( x !== undefined && y !== undefined){
            e.attr({x:x,y:y});
        }
        
        // set the text of the text node        
        if(textString === undefined){textString = "";}
        e._text_textNode = svgElem.prototype.createTextNode(textString);
        e.dom.appendChild(e._text_textNode);
        
        return asText.call(e);
    }

    // @param context [object] - the reference svgElem we should use when setting the text
    // @param t [stirng] - the text value we should use when setting the textContext
    function setText(context,val){        
        if( val === undefined){val = "";}

        if( context.dom.contains(context._text_textNode)){            
            context._text_textNode.nodeValue = val;
        }else{

            // serach for an available textNode to use our text node???
            var children = context.dom.childNodes;
            var n = children.length;
            var foundFlag = false;
            for(var i = 0;i < n; ++i){
                if( children[i].nodeName === "#text"){
                    context._text_textNode = children[i];
                    foundFlag = true;                    
                    break;
                }
            }

            if( foundFlag === false){                
                context._text_textNode = svgElem.prototype.createTextNode(val);
            }

            context.dom.appendChild(context._text_textNode);
        }
    }

    function getTextInternal(dom,recurse){        
        if( dom.hasChildNodes() === false){
            if( dom.nodeName === "#text"){
                return dom.nodeValue;
            }else{
                return "";
            }            
        }

        var s = "";
        var children = dom.childNodes;
        var n = children.length;
        for( var i = 0;i < n; ++i){            
            if(recurse){
                s += getTextInternal(children[i],recurse);
            }else{
                if( children[i].nodeName === "#text"){
                    s += children[i].nodeValue;
                }
            }
        }
        return s;
    }

    function getText(context,recurse){                
        if(recurse){
            return getTextInternal(context.dom,true);
        }else{
            if(context.dom.contains(context._text_textNode)){
                return context._text_textNode.nodeValue;
            }else{
                return "";
            }
        }
    }
    
    function asText(){
        this.text = function(val){            
            if( val === undefined || util.is(val,"boolean")){
                return getText(this,val);
            }else{
                setText(this,val);
                return this;
            }
        }

        this.x = function(val){
            return util.toNum(this.attr("x",val));
        }
        this.y = function(val){
            return util.toNum(this.attr("y",val));
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
        this.attr.DirectAccessDiffName(this,props);        

        return this;
    }

});