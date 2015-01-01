svg.extend(function(svgElem,util){    
    svgElem.prototype.defs = defs;
    defs.asDefs = asDefs;

    function defs(id){
        var e = new svgElem("defs",this.dom);

        if( id === undefined){
            e._defs_id = "defs_"+ Date.now().toString() + "_";
        }else{
            e._defs_id = id;
        }        
        e._defs_start_id = 0;
        e._defs_cache = {};

        return asDefs.call(e);        
    }

    function asDefs(){        
        this.store = function(id,svgElem,force){
            if( force || this._defs_cache[id] === undefined){
                this._defs_cache[id] = svgElem;
            }
        }

        this.get = function(id){
            return this._defs_cache[id];
        }

        this.drop = function(id){
            delete this._defs_cache[id];
        }

        this.dropAll = function(){
            this._defs_cache = {};
        }

        // get a next available url
        this.url = function(){
            this._defs_start_id += 1;
            return this._defs_id + this._defs_start_id.toString();
        }

        return this;
    }

});