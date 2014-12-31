define(function(){

return function(canvas,T){
    canvas.rect(150,-400,500,500);

    canvas.rect(0,0,50,50);
    canvas.rect(55,55,45,45);

    var r = canvas.rect(150,150,30,30).round(0,0);
    r.round(3,3);

    var round = r.round();
    T.assertEq(round.rx,3);
    T.assertEq(round.ry,3);
        
    var r2 = r.clone();
    r.shape.pos(75,150);    
}

});