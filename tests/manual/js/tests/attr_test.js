define(function(){
return function(canvas,T){

    var r = canvas.rect(0,0,300,300);

    // test setting by Object
    r.attr({
      fill:"black",
      "fill-opacity":0.8,
      stroke:"red"
    });

    // test retrieval
    T.assertEq(r.attr("fill"),"black");
    T.assertEq(r.attr("fill-opacity"),"0.8");
    T.assertEq(r.attr("stroke"),"red");
    T.assertEq(r.attr("stroke-width"), null);

    // test single set
    r.attr("stroke-width",4);
    T.assertEq(r.attr("stroke-width"),"4");

    // testing retrieval of all attributes
    var arr = r.attr();
    var exp = [
        ["x","0"],
        ["y","0"],
        ["width","300"],
        ["height","300"],
        ["fill","black"],        
        ["fill-opacity","0.8"],
        ["stroke","red"],
        ["stroke-width","4"],
    ]
    for( var i = 0 ;  i < arr.length; ++i){
        T.assertEq(arr[i][0],exp[i][0]);
        T.assertEq(arr[i][1],exp[i][1]);
    }


    arr = r.attr(["x","y","width","height","not_here"]);
    T.assertEqObj(arr,{
        "x":"0",
        "y":"0",
        "width":"300",
        "height":"300"
    });
}

});
