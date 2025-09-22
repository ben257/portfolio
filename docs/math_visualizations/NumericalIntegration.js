main = function() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    integralValue = integrator(x_lim[0],x_lim[1],f,N,integrationMethod,plotBool=true) 
    plot_function(x_lim[0],x_lim[1],f,5000)
    drawAxes();

    $('#IntegralValue').text(integralValue);
}

$('#numRetanglesSlider').on("input",function(){
    $('#numRetangles').text(this.value);
    N = parseInt(this.value)
    main();
  });


$("#buttonSubmit").click(function(){

    let xLower = parseFloat($('#xLower').text());
    let xUpper = parseFloat($('#xUpper').text());
    let yLower = parseFloat($('#yLower').text());
    let yUpper = parseFloat($('#yUpper').text());

    integrationMethod = $('#integrationMethod').val()
    
    let f_inputted = $('#f').val()
    f = eval("f = function(x) { return ".concat(f_inputted,"}"));

    
    x_lim[0] = xLower;
    x_lim[1] = xUpper;
    y_lim[0] = yLower;
    y_lim[1] = yUpper;

    main()

})



const canvas = document.getElementById("Canvas");
const ctx = canvas.getContext("2d");


let x_lim = [-5,5];
let y_lim = [-5,5];
let N = 5;
let integrationMethod = "MidpointRule";
let integralValue = null;

$('#numRetangles').text(N);

let f = function (x) {
    return .25*x*x
}

main();



