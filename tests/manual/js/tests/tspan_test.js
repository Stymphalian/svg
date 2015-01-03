define(function(){
return function(canvas,T){    
    var t = canvas.text("svg is here",10,30);
    t.tspan(" why yet another text line");

    T.assertEq(t.text(true),"svg is here why yet another text line");

    t = canvas.text("svg is here",10,40);
    t.tspan(" yipee",10,10);
    var t2 = t.tspan(" yipee 2",10,20);
    T.assertEq(t.text(true),"svg is here yipee yipee 2");

    var t3 = t2.tspan(" why again",0,0);
    t3.text(" why again yes indeed");
    t3.dx(-30);
    t3.dy(10);
    T.assertEq(t.text(true),"svg is here yipee yipee 2 why again yes indeed");

    t = canvas.text("svg is here",10,150);
    t2 = t.tspan(" word1 word2 word 3",10,[10,0,10,0,10,0,10,-10,-10,-10]);
    t2.y(150);


    t = canvas.text("svg is here",10,180);
    t2 = t.tspan("word").baseline.shift("sub");

    t3 = t2.clone();
    t3.text("wordle");
    t3.dy(10);
}
});