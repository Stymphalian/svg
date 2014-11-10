define("jordan_module",[],function(){

    function a(){
        return {};
    }
    
    a.prototype.foo = function(a){
        console.log("a.prototype.foo " + a);
    }
    a.prototype.bar = function(b){
        console.log("a.prototype.bar " + b);
    }
    return a;
});