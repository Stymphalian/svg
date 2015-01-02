define(function(){
return function(canvas,T){    
    var t = canvas.text("svg",100,10);
    T.assertEq(t.text(),"svg");
    t.text(t.text() + " is here");
    T.assertEq(t.text(),"svg is here");

    // tesing anchor
    t = canvas.text("svg is here",100,20)
        .anchor("start")
        .decoration("underline");

    t = canvas.text("svg is here",100,30)
        .anchor("middle")
        .decoration("overline");

    t = canvas.text("svg is here",100,40)
        .anchor("end")
        .decoration("line-through");

    t = canvas.text("svg is here",100,50)
        .anchor("end")
        .decoration("none");

    t = canvas.text("svg is here",100,60)
        .rendering("optimizeLegibility")
        .textLength(10);        

    t = canvas.text("svg is here",100,70)
        .textLength(80)
        .lengthAdjust("spacing")

    t = canvas.text("svg is here",100,80)
        .textLength(40)
        .lengthAdjust("spacingAndGlyphs");

    t = canvas.text("svg is here",100,90)
        .lengthAdjust("spacing")
        .kerning(40) //hm kerning doesn't seem to be working??
        .word_spacing(5);

    t = canvas.text("svg is here",100,100)
        .lengthAdjust("spacingAndGlyphs")
        .word_spacing(-1);

    t = canvas.text("svg is here",100,110).writing_mode("lr-tb");
    t = canvas.text("svg is here",100,120).writing_mode("rl-tb");
    t = canvas.text("svg is here",100,130).writing_mode("lr-bt");
    t = canvas.text("svg is here",100,140).writing_mode("rl-bt");
    t = canvas.text("svg is here",100,150).writing_mode("lr");
    t = canvas.text("svg is here",100,160).writing_mode("rl");
    t = canvas.text("svg is here",100,170).writing_mode("tb");
    t = canvas.text("svg is here",120,170)
            .writing_mode("tb")
            .glyph_orientation_vertical(35)
            .letter_spacing(-7);
    t = canvas.text("svg is here",200,180)
            .direction("ltr");
    t = canvas.text("svg is here",200,190)
            .direction("rtl");

}
});