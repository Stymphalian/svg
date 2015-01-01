//switch.js
svg.extend(function(svgElem,util){
    // requiredFeatures
    // requiredExtensions
    // systemLanguage
    svgElem.prototype.switchElem = switchElem;
    switchElem.asSwitchElem= asSwitchElem;

    function switchElem(){
        var e = new svgElem("switch",this.dom);
        return asSwitchElem.call(this);
    }        

    function asSwitchElem(){
        return this;
    }
});