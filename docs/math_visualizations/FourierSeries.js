compute_coefficient = function(P,f,n,N,coeffType) {

  let factor = P/2;
  let g = null;

    if (coeffType == "sin") {
        g = function(x) {
            return f(x)*Math.sin(2*Math.PI*n*x/P)
        }     
    }
    else {
        if (n > 0) {
            g = function(x) {
                return f(x)*Math.cos(2*Math.PI*n*x/P);
            };
        }
        else {
            g = function(x) {
                return f(x)
            }   
        factor = P;
        }
    }
    let coeff = integrator(-P/2,P/2,g,N,method="MidpointRule",plotBool=false)/factor; 
    return coeff

}

compute_series = function(P,f,N,numCoeffs) {

    coeff_even.length = 0;
    coeff_odd.length = 0;

    let coeff_constant = compute_coefficient(P,f,0,N,"cos");
    for (let n = 0; n < numCoeffs; n++) {
        coeff_even.push(compute_coefficient(P,f,n+1,N,"cos"));
        coeff_odd.push(compute_coefficient(P,f,n+1,N,"sin"));
    }

    let f_FourierSeries = function(x) {
        let result = coeff_constant;
        for (let n = 0; n < numCoeffs; n++) {
            result += coeff_even[n]*Math.cos(2*Math.PI*(n+1)*x/P)
            result += coeff_odd[n]*Math.sin(2*Math.PI*(n+1)*x/P)
        }
        return result;
    }
    return f_FourierSeries
} 
 
$('#numTermsSlider').on("input",function(){
    $('#numTerms').text(this.value);
    numTerms = parseInt(this.value)
    main();
});

$("#buttonSubmit").click(function(){

    let xLower = parseFloat($('#xLower').text());
    let xUpper = parseFloat($('#xUpper').text());
    let yLower = parseFloat($('#yLower').text());
    let yUpper = parseFloat($('#yUpper').text());

    P = parseFloat($('#period').val());
    let f_inputted = $('#f').val()
    
    f = eval("f = function(x) { return ".concat(f_inputted,"}"));
 
    x_lim[0] = xLower;
    x_lim[1] = xUpper;
    y_lim[0] = yLower;
    y_lim[1] = yUpper;

    main();

})

function updateBarChart() {

  let data = {
    labels: Array(coeff_odd.length).fill().map((_, i) => i+1),
    datasets: [{
      label: 'Sine',
      data: coeff_odd,
      borderWidth: 1
    },
    {
      label: 'Cosine',
      data: coeff_even,
      borderWidth: 1
    }]
  }
  coeff_chart.config.data = data;
  coeff_chart.update();
}  
main1 = function() {

    f_periodic = function (x) {
        return f(((x+P/2)%P + P)%P - P/2)
    }
    x_lim[0] = -3*P;
    x_lim[1] = 3*P;

    f_FourierSeries = compute_series(P,f,N,numTerms);

    console.log(f_FourierSeries);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 1;
    plot_function(x_lim[0],x_lim[1],f_periodic,500)
    drawAxes(P);
    ctx.lineWidth = 5;
    plot_function(x_lim[0],x_lim[1],f_FourierSeries,500,color="#B6E880")

    updateBarChart()
}

main = function() {
    f_periodic = function (x) {
        return f(((x+P/2)%P + P)%P - P/2)
    }
    x_lim[0] = -3*P;
    x_lim[1] = 3*P;

    f_FourierSeries = compute_series(P,f,N,numTerms);

    //console.log(f_FourierSeries);
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    //ctx.lineWidth = 1;
    //plot_function(x_lim[0],x_lim[1],f_periodic,500)
    //drawAxes(P);
    //ctx.lineWidth = 5;
    //plot_function(x_lim[0],x_lim[1],f_FourierSeries,500,color="#B6E880")

    updateBarChart(); // Keep your existing coefficient chart
    updateFunctionChart(); // Add the new function chart
}


const canvas = document.getElementById("Canvas");
//const ctx = canvas.getContext("2d");


let x_lim = [-5,5];
let y_lim = [-5,5];
let N = 500;
let P = 5;
let numTerms = 5;
let f = function (x) {
    return x
}
$('#numTerms').text(numTerms);


let coeff_even = [];
let coeff_odd = [];

const ctx_coeff = document.getElementById('Coeff');

let coeff_chart = new Chart(ctx_coeff, {
  type: 'bar',
  data: {
    labels: Array(coeff_odd.length).fill().map((_, i) => i+1),
    datasets: [{
      label: 'Sine',
      data: coeff_odd,
      borderWidth: 1
    },
    {
      label: 'Cosine',
      data: coeff_even,
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      title: {
          display: true,
          text: 'Fourier Coefficients'
      },
      legend: {
        display: true
     }
    }
    
  }
});
/////////////////////////////////////////////////////////////////////////

const series_ctx = document.getElementById('Series');

function updateFunctionChart() {
    const numPoints = 500;
    const xValues = [];
    const yValues_periodic = [];
    const yValues_fourier = [];
    
    // Generate full resolution data
    for (let i = 0; i < numPoints; i++) {
        const x = x_lim[0] + (i / (numPoints - 1)) * (x_lim[1] - x_lim[0]);
        xValues.push(x);
        yValues_periodic.push(f_periodic(x));
        yValues_fourier.push(f_FourierSeries(x));
    }
    
    if (function_chart) {
        function_chart.destroy();
    }
    
    function_chart = new Chart(series_ctx, {
        type: 'line',
        data: {
            labels: xValues, // Use all x values
            datasets: [{
                label: 'Original Function',
                data: yValues_periodic,
                borderWidth: 2,
                borderColor: 'rgba(0, 0, 255, 0.3)',
                fill: false,
                tension: 0,
                pointRadius: 0
            },
            {
                label: 'Fourier Series',
                data: yValues_fourier,
                borderWidth: 2,
                borderColor: '#B6E880',
                fill: false,
                tension: 0,
                pointRadius: 0
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: false,
                        text: 'x'
                    },
                    ticks: {
                //stepSize: 1,   // force step size of 1
                callback: function(value, index, ticks) {

                    let nearest_int = Math.round(xValues[index]);
                    if (Math.abs(nearest_int) % 2 === 1) {
                      return null;
                    }
                    console.log(nearest_int);

                    // Only show integers
                    let distance = Math.abs(xValues[index] - nearest_int);

                    if (distance <.05) {
                        if ((index === 0) & (Math.abs(xValues[index+1] - nearest_int) > distance)) {
                          return nearest_int;
                        }
                        if ((index === numPoints-1) & (Math.abs(xValues[index-1] - nearest_int) > distance)) {
                          return nearest_int;
                        }
                        if ((Math.abs(xValues[index-1] - nearest_int) > distance) 
                              & (Math.abs(xValues[index+1] - nearest_int) > distance)) {
                                return nearest_int
                              }
                        console.log(nearest_int,xValues[index]);
                        return null;
                    }
                    return null;
                }
            }
                },
                y: {
                    beginAtZero: false,
                    title: {
                        display: false,
                        text: 'f(x)'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Function vs Fourier Series'
                },
                legend: {
                    display: true
                }
            }
        }
    });
}

let function_chart;

main();

 

  










