define(function(){
return function(canvas,T){
    var i = canvas.image("data/icon.png",10,10,135,135);

    var i2 = i.clone();
    i2.href("data/icon2.png");
    i2.shape.move(100,0);
    i2.width(50);
}

});