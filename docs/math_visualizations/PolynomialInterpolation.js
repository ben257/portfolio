$('#degreeSlider').on("input",function(){
    $('#degree').text(this.value);
    main();
  });


  $("#buttonAddRow").click(function(){
    $('#pointsTable').append("<tr><td contenteditable='true'></td><td contenteditable='true'></td><td contenteditable='true'></td></tr>");
    }); 

$("#buttonRemoveRow").click(function(){
    $('#pointsTable tbody tr:last').remove();
    });

$("#buttonSubmit").click(function() {
    let xLower = parseFloat($('#xLower').text());
    let xUpper = parseFloat($('#xUpper').text());
    let yLower = parseFloat($('#yLower').text());
    let yUpper = parseFloat($('#yUpper').text());
    
    x_lim[0] = xLower;
    x_lim[1] = xUpper;
    y_lim[0] = yLower;
    y_lim[1] = yUpper;
    
    x_points.length = 0
    y_points.length = 0

    $("#pointsTable tbody tr").each(function( index ) {

        let x = parseFloat($(this).find("td:eq(0)").html());
        let y = parseFloat($(this).find("td:eq(1)").html());
    
        x_points.push(x);
        y_points.push(y);
    });

    main()
});

main = function() {
    
    $('#degreeSlider').attr("max",x_points.length-1);
    degree = parseInt($('#degree').text())
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let MSE = SimpleLinearRegressor(x_points,y_points,degree,plotCurve=true,plotPoints=true)
    $('#MSE').text(MSE);
    drawAxes();
}


const canvas = document.getElementById("Canvas");
const ctx = canvas.getContext("2d");


let x_lim = [-5,5];
let y_lim = [-5,5];
let degree = 1;
let MSE = null;
let integralValue = null;
let x_points = [0,1,2,3];
let y_points = [1,2,3.3,4.5];
$('#degree').text($('#degreeSlider').attr("value"));

main();
//SimpleLinearRegressor(x_points,y_points,1,plotCurve=true,plotPoints=true)


