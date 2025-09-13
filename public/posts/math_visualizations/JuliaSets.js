function fractal_sequence(x,y,max_iterations,func,R,c=null) {
        /*
        Determine number of iterations required to reach a point outside the given radius
        Inputs: x,y--the starting point
                func defines the dynamical system, z_(n+1) = func(z_n,c)
                R--radius threshold for divergence
                max_iterations--maximum number of iterations allowed before stopping
                c--value of c in dynamical system equation
        */

        //mandelbrot
        let z;
        if (c === null) {
            c = new Complex(x,y);
            z = new Complex(0,0);
        }

        //julia
        else {
            z = new Complex(x,y);
        }

        //iterate until sequence diverges or reaches max number of iterations
        let num_iterations = 0;
        while (num_iterations < max_iterations) {
            z = func(z,c); 
            if (z.getAbs() > R) {
                break;
            }   
            num_iterations += 1;
        }
            
        return num_iterations;
    }

function julia_generator(func,R,x_lim=[-1.8,.6],y_lim=[-1.2,1.2],N=100,max_iterations=200,c=null) {
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
    
    //calculate number of iterations required for divergence at each grid point
    for (let index_x = 0; index_x < N; index_x++) {
        for (let index_y = 0; index_y < N; index_y++) {
            x = x_coordinates[index_x];
            y = y_coordinates[index_y];
            let num_iterations = fractal_sequence(x,y,max_iterations,func,R,c)
            grid[index_y][index_x] = num_iterations;
            let color = Math.floor(255*num_iterations/max_iterations)
            ctx.fillStyle = "rgb(" + color + "," + color + "," + color + ")";
            ctx.fillRect(index_x*canvas.width/N, index_y*canvas.height/N, canvas.width/N, canvas.height/N);
            
        }
    } 
    return grid
}


function julia_func(z,c) {
    return Complex.add(Complex.multiply(z,z),c);
} 
const julia_R = 2;

const mouse = {
    x:null,
    y:null
}

function updateMouse(event) {
    mouse.x = event.x;
    mouse.y = event.y;
    zoomIn(x_lim,y_lim,mouse,canvas);
    julia_generator(julia_func,julia_R,x_lim,y_lim,N=N,max_iterations=max_iterations,c=c);
}

const canvas = document.getElementById("Canvas");
const ctx = canvas.getContext("2d");

let x_lim = [-1.8,.6];
let y_lim = [-1.2,1.2];
let N = 500;
let max_iterations = 100;
let c;

const form = document.querySelector('form');
form.addEventListener('submit', (e) => {

  e.preventDefault(); // Prevent HTML refresh
  const formData = new FormData(form); // Converts to array of arrays
  const obj = Object.fromEntries(formData); // Array of arrays to object
  if (!('MandelbrotIndicator' in obj)) {
    c = new Complex(parseFloat(obj["realCoefficient"]),parseFloat(obj["imaginaryCoefficient"]))
  }
  else {
    c = null;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  julia_generator(julia_func,julia_R,x_lim=x_lim,y_lim=y_lim,N=N,max_iterations=max_iterations,c=c);
});


julia_generator(julia_func,julia_R,x_lim=x_lim,y_lim=y_lim,N=N,max_iterations=max_iterations,c=c);
console.log("terminated")

canvas.addEventListener('click',updateMouse);