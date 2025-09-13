function newtonBasin_sequence(x,y,max_iterations,func,derivative) {
    /*
    Determine number of iterations required to reach a point outside the given radius
    Inputs: x,y--the starting point
            func defines the dynamical system, z_(n+1) = func(z_n,c)
            R--radius threshold for divergence
            max_iterations--maximum number of iterations allowed before stopping
    */

    let z = new Complex(x,y);
    
    //iterate until sequence reaches max number of iterations
    for (let iteration = 0; iteration < max_iterations; iteration++) {
        let prev_z = new Complex(z.real,z.imag);
        z = Complex.subtract(z,Complex.divide(func(z),derivative(z))); 
        if (Complex.getDistance(z,prev_z) < .001) {
            break
        }
    }  
    return z;
}

function basin_generator(func,derivative,x_lim=[-2,2],y_lim=[-2,2],N=100,max_iterations=20) {
    /*
    Inputs: func defines the dynamical system, z_(n+1) = func(z_n,c)
            R--radius threshold for divergence
            x_lim,y_lim--plotting window
            N--grid resolution is NxN
            max_iterations--maximum number of iterations allowed before stopping
            c--value of c in dynamical system equation
    Plots the julia/mandelbrot set
    */

    const grid = new Array(N);
    const x_coordinates = new Array(N);
    const y_coordinates = new Array(N);

    const x_step = (x_lim[1] - x_lim[0])/N;   
    const y_step = (y_lim[1] - y_lim[0])/N;

    //initialize coordinates and grid
    for (let index = 0; index < N; index++) {
        x_coordinates[index] = x_lim[0] + index*x_step
        y_coordinates[index] = y_lim[0] + index*y_step
        grid[index] = new Array(N);
    }
    
    //calculate the root converged to at each grid point
    for (let index_x = 0; index_x < N; index_x++) {
        for (let index_y = 0; index_y < N; index_y++) {
            
            x = x_coordinates[index_x];
            y = y_coordinates[index_y];
           
            let limit = newtonBasin_sequence(x,y,max_iterations,func,derivative);

            for (const root_info of rootDict) {
                let root = root_info[0];
                
                if (Complex.getDistance(root,limit) < epsilon) {
                    grid[index_y][index_x] = root;   
                    ctx.fillStyle = root_info[2];
                    ctx.fillRect(index_x*canvas.width/N, index_y*canvas.height/N, canvas.width/N, canvas.height/N);    
                    
                    break;
                }
            }  
        } 
    }

    for (const root_info of rootDict) {
        let root = root_info[0];
            ctx.beginPath();
            ctx.arc((root.real-x_lim[0])*canvas.width/(x_lim[1]-x_lim[0]), (root.imag-y_lim[0])*canvas.height/(y_lim[1]-y_lim[0]), canvas.height/30, 0, 2 * Math.PI);
            ctx.stroke();
    }
    return grid
    
}

main = function() {
    let xLower = parseFloat($('#xLower').text());
    let xUpper = parseFloat($('#xUpper').text());
    let yLower = parseFloat($('#yLower').text());
    let yUpper = parseFloat($('#yUpper').text());
    
    
    rootDict.length = 0;

    $("#rootsTable tbody tr").each(function( index ) {

        let real = parseFloat($(this).find("td:eq(0)").html());
        let imag = parseFloat($(this).find("td:eq(1)").html());
        let multiplicity = parseInt($(this).find("td:eq(2)").html());
    
        rootDict.push([new Complex(real,imag),multiplicity,colors[index]]);
    });

    f = function(z) {
        let result = new Complex(0,0);
        for (const root_info of rootDict) {
            
            let root = root_info[0];
            let multiplicity = root_info[1]
            
            result = Complex.add(result,Complex.subtract(z,root).getPower(multiplicity));
        }
        return result;
    };

    f_prime = function(z) {
        f_z = f(z)
        
        let factor = new Complex(0,0);
        for (const root_info of rootDict) {
            let root = root_info[0];
            let multiplicity = root_info[1]
            
            factor = Complex.add(factor,Complex.subtract(z,root).getRecipricol().multiplyScalar(multiplicity));
        }

        return Complex.multiply(f_z,factor);
    };

    f_dict["f"] = f;
    f_dict["f_prime"] = f_prime;
    x_lim[0] = xLower;
    x_lim[1] = xUpper;
    y_lim[0] = yLower;
    y_lim[1] = yUpper;
    

    basin_generator(f_dict["f"],f_dict["f_prime"],x_lim=[xLower,xUpper],y_lim=[yLower,yUpper],N=500,max_iterations=100);
    
}

let epsilon = 0.01; 

$("#buttonAddRow").click(function(){
    $('#rootsTable').append("<tr><td contenteditable='true'></td><td contenteditable='true'></td><td contenteditable='true'></td></tr>");
}); 

$("#buttonRemoveRow").click(function(){
    $('#rootsTable tbody tr:last').remove();
    });

$("#buttonSubmit").click(main);

function updateMouse(event) {
    mouse.x = event.x;
    mouse.y = event.y;
    zoomIn(x_lim,y_lim,mouse,canvas);
    basin_generator(f_dict["f"],f_dict["f_prime"],x_lim=x_lim,y_lim=y_lim,N=500,max_iterations=30);
}

const canvas = document.getElementById("Canvas");
const ctx = canvas.getContext("2d");

let rootDict = [];
let f_dict = {};

let x_lim = [-5,5];
let y_lim = [-5,5];

let colors = ['#636EFA',
'#EF553B',
'#00CC96',
'#AB63FA',
'#FFA15A',
'#19D3F3',
'#FF6692',
'#B6E880',
'#FF97FF',
'#FECB52']

const mouse = {
    x:null,
    y:null
}

canvas.addEventListener('click',updateMouse);
main();