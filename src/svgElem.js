// svgElem.js
svg.module(function(lib){
    lib.svgElem = svgElem;

    // some global stuff
    var globals = {
        window : window,
        document : window.document
    }

    svgElem.prototype.svg_ns = 'http://www.w3.org/2000/svg';
    svgElem.prototype.xlink_ns = 'http://www.w3.org/1999/xlink';
    svgElem.prototype.xml_ns = 'http://www.w3.org/2000/xmlns/';

    // define the base svg element
    // tag_name : the element in which we want to create
    // parent_node : the DOM node in whcih to append the newly created node under.
    function svgElem(tag_name,parent_node){        

        if(tag_name && Object.prototype.toString.call(tag_name) === "[object String]" ){
            // TODO: should I add ids to every element that gets created??
            this.dom = globals.document.createElementNS(svgElem.prototype.svg_ns,tag_name);
        }else if( tag_name !== undefined && tag_name !== null){
            // we have passed in a dom node to be used when creating the svgElem
            this.dom = tag_name;
        }

        if(parent_node){
            parent_node.appendChild(this.dom);
        }
    }    

    // delete all children svg nodes under this element
    svgElem.prototype.clear = function(){
        while(this.dom.firstChild){
            this.dom.removeChild(this.dom.firstChild);
        }
        return this;
    }

    // remove this element from its parent
    svgElem.prototype.remove = function(){
        this.clear();
        if( this.dom.parentNode){
            this.dom.parentNode.removeChild(this.dom);
        }        
    }


    svgElem.prototype.reRunMixin = function(){
        var tag_name = this.dom.tagName;

        // fix up the tag_name for the switch element
        if( tag_name === "switch"){
            tag_name = "switchElem";
        }

        var f = svgElem.prototype[tag_name];
        function capFirstLetter(s){
            return s.charAt(0).toUpperCase() + s.slice(1);
        }

        // by convention, the as<ThingToMixin> method is a property
        // of the svgElem.<thingToMixin> function
        // i.e svgElem.circle.asCircle.call(<element>);
        var asFuncs = f["as"+capFirstLetter(f.name)];
        if( asFuncs && Object.prototype.toString.call(this) === "[object Function]"){
            // there was only a singe function attached
            asFuncs = [asFuncs];            
        }

        // an array of functions
        // call all the mixins listed in the array
        for(var i = 0; i < asFuncs.length; ++i){
            asFuncs[i].call(this);
        }
        
        return this;
    }

    //@return [svgElem] -  clone this element and then return the cloned element
    // TODO: clonded children of the dom don't have an associated svgElem object
    svgElem.prototype.clone = function(){
        var e = lib.util.clone(this);

        // reomve the plugin instances from the object
        for( var k in  e){
            if( lib.plugin.has[k] !== undefined){
                if( Object.prototype.hasOwnProperty.call(e,k)){
                    delete e[k];
                }
            }            
        }

        // re-apply the mixins to fix up function closures
        e.reRunMixin();

        // attach the node to the same parent
        if( this.dom.parentNode){
            this.dom.parentNode.appendChild(e.dom);
        }

        return e;
    }

    svgElem.prototype.createTextNode = function(s){
        return globals.document.createTextNode(s);
    }

});