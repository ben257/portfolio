class Complex {

    constructor(real,imag) {
        this.real = real;
        this.imag = imag;
    }

    print() {
        console.log([this.real,this.imag]);
    }
    getAbs() {
        return Math.pow(Math.pow(this.real,2) + Math.pow(this.imag,2),.5);
    }

    getPower(m) {
        let result = new Complex(this.real,this.imag);
        for (let iteration = 0; iteration < m; iteration++) {
            result = Complex.multiply(result,this); 
        }  
        return result;
    }

    getRecipricol() {
        return this.getConjugate().multiplyScalar(1/(Math.pow(this.real,2) + Math.pow(this.imag,2))); 
    }

    multiplyScalar(scalar) {
        return new Complex(scalar*this.real, scalar*this.imag);
    }

 
    getConjugate() {
        return new Complex(this.real,-this.imag);
    }

    static add(a,b) {
        return new Complex(a.real + b.real, a.imag + b.imag);
    }

    static multiply(a,b) {
        return new Complex(a.real*b.real -  a.imag*b.imag, b.real*a.imag + a.real*b.imag);
    }

    static subtract(a,b) {
        return new Complex(a.real - b.real, a.imag - b.imag);
    }
    
    static divide(a,b) {
        return Complex.multiply(a,b.getRecipricol());
    }

    static getDistance(a,b) {
        return Complex.subtract(a,b).getAbs();
    }
}

function zoomIn(x_lim,y_lim,mouse,canvas) {
    alpha = .5
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let prev_x_width = (x_lim[1] - x_lim[0]);

    let x = x_lim[0] + prev_x_width*mouse.x/canvas.width

    x_lim[0] = x-prev_x_width*.5*alpha;
    x_lim[1] = x+prev_x_width*.5*alpha;

    let prev_y_height = (y_lim[1] - y_lim[0]);
    let y = y_lim[0] + prev_y_height*mouse.y/canvas.height
    y_lim[0] = y-prev_y_height*.5*alpha;
    y_lim[1] = y+prev_y_height*.5*alpha;
 
}

coordinateTransform_x = function(x) {
    let x_canvas = (x-x_lim[0])*canvas.width/(x_lim[1]-x_lim[0]);
    return x_canvas;
}

coordinateTransform_y = function(y) {
    let y_canvas = canvas.height - (y-y_lim[0])*canvas.height/(y_lim[1]-y_lim[0]);
    return y_canvas;
}

get_window_limits = function(a,b,f,N) {
    let x_coordinates = new Array(N);
    let y_coordinates = new Array(N);

    let delta_x = (b-a)/N;

    let y_lim = [f(a),f(a)]

    for (let index = 0; index < N; index++) {
        x_coordinates[index] = a + index*delta_x;
        y_coordinates[index] = f(x_coordinates[index]); 
        
        y_lim[0] = Math.min(y_lim[0],y_coordinates[index])
        y_lim[1] = Math.max(y_lim[1],y_coordinates[index])
    }
    factor = y_lim[1] * .2;
    y_lim[1] += factor;
    y_lim[0] -= factor;
    return y_lim
}


//Numerical Integration
plot_function = function(a,b,f,N,color="#000000") {
    let x_coordinates = new Array(N);
    let y_coordinates = new Array(N);

    let delta_x = (b-a)/N;

    ctx.beginPath();
    for (let index = 0; index < N; index++) {
        x_coordinates[index] = a + index*delta_x;
        y_coordinates[index] = f(x_coordinates[index]);  
        ctx.lineTo(coordinateTransform_x(x_coordinates[index]),coordinateTransform_y(y_coordinates[index]));
        
    } 
    ctx.strokeStyle = color;       
    ctx.stroke();    

}

integrator = function(a,b,f,N,method,plotBool=true) {
    
    let x_coordinates = new Array(N+1);
    let y_coordinates = new Array(N);
    let delta_x = (b-a)/N;
    let integral = null;
    
    let canvas_coordinate_y0 = null;

    if (plotBool) {
        canvas_coordinate_y0 = coordinateTransform_y(0);
    }
    

    for (let index = 0; index < N+1; index++) {
        x_coordinates[index] = a + index*delta_x;
        
    }

    if (method === "MidpointRule") {
        for (let index = 0; index < N; index++) {
        
            y_coordinates[index] = f(.5*(x_coordinates[index]+x_coordinates[index+1]));
            
            if (plotBool) {
                ctx.beginPath();
                ctx.moveTo(coordinateTransform_x(x_coordinates[index]), canvas_coordinate_y0);
                ctx.lineTo(coordinateTransform_x(x_coordinates[index]), coordinateTransform_y(y_coordinates[index]));
                ctx.lineTo(coordinateTransform_x(x_coordinates[index+1]), coordinateTransform_y(y_coordinates[index]));
                ctx.lineTo(coordinateTransform_x(x_coordinates[index+1]), canvas_coordinate_y0);    
                ctx.stroke();    
            }
             
        }
        integral = delta_x*y_coordinates.reduce((a, b) => a + b, 0);
    }

    else if (method === "TrapezoidRule") {

        for (let index = 0; index < N+1; index++) {
        
            y_coordinates[index] = f(x_coordinates[index]);
              
        }

        if (plotBool) {
            for (let index = 0; index < N; index++) {
                ctx.beginPath();
                ctx.moveTo(coordinateTransform_x(x_coordinates[index]), canvas_coordinate_y0);
                ctx.lineTo(coordinateTransform_x(x_coordinates[index]), coordinateTransform_y(y_coordinates[index]));
                ctx.lineTo(coordinateTransform_x(x_coordinates[index+1]), coordinateTransform_y(y_coordinates[index+1]));
                ctx.lineTo(coordinateTransform_x(x_coordinates[index+1]), canvas_coordinate_y0);    
                ctx.stroke(); 
            }
        }          
        integral = delta_x*(y_coordinates.reduce((a, b) => a + b, 0)-.5*(y_coordinates[0] + y_coordinates[N]));
       
    }   

    else if (method === "SimpsonRule") {

        for (let index = 0; index < N+1; index++) {
        
            y_coordinates[index] = f(x_coordinates[index]);
              
        }

        if (plotBool) {
            for (let index = 0; index < N-2; index+2) {

                let y_slice = y_coordinates.slice(index, index+3)
                let x_slice = x_coordinates.slice(index, index+3)

                ctx.beginPath();
                ctx.moveTo(coordinateTransform_x(x_coordinates[index]), canvas_coordinate_y0);
                ctx.lineTo(coordinateTransform_x(x_coordinates[index]), coordinateTransform_y(y_coordinates[index]));
                ctx.lineTo(coordinateTransform_x(x_coordinates[index+1]), coordinateTransform_y(y_coordinates[index+1]));
                ctx.lineTo(coordinateTransform_x(x_coordinates[index+1]), canvas_coordinate_y0);    
                ctx.stroke(); 
            }
        }          
        integral = delta_x*(y_coordinates.reduce((a, b) => a + b, 0)-.5*(y_coordinates[0] + y_coordinates[N]));
       
    } 
    return integral;
}

drawAxes = function(P = null,x_increment=null,y_increment=null) {
    ctx.beginPath();
    ctx.lineTo(coordinateTransform_x(x_lim[0]),coordinateTransform_y(0));
    ctx.lineTo(coordinateTransform_x(x_lim[1]),coordinateTransform_y(0));
    ctx.stroke();    
    
    ctx.beginPath();
    ctx.lineTo(coordinateTransform_x(0),coordinateTransform_y(y_lim[0]));
    ctx.lineTo(coordinateTransform_x(0),coordinateTransform_y(y_lim[1]));
    ctx.stroke();    

    if (P !== null) {
        x_increment = P/2;
    }
    else {
        x_increment = (x_lim[1]/2);
    }
    if (y_increment === null) {
        y_increment = y_lim[1]/2;
    }

    let x = 0;
    while (x < x_lim[1]) {
        ctx.strokeText(x, coordinateTransform_x(x),coordinateTransform_y(0));
        x += x_increment;
    }
    x = 0;
    while (x > x_lim[0]) {
        ctx.strokeText(x, coordinateTransform_x(x),coordinateTransform_y(0));
        x -= x_increment;
    }

    let y = 0;
    let increment = (y_lim[1]/2);
   
    while (y < y_lim[1]) {
        ctx.strokeText(Number.parseFloat(y).toFixed(2), coordinateTransform_x(0),coordinateTransform_y(y));
        y += y_increment;
    }
    y = 0;
    while (y > y_lim[0]) {
        console.log(y)
        ctx.strokeText(Number.parseFloat(y).toFixed(2), coordinateTransform_x(0),coordinateTransform_y(y));
        y -= y_increment;
    }
}

generateVandermondeMatrix = function(x_points,n) {
    
    let VandermondeMatrix = math.ones(x_points.length,n+1);
    for (let index_x = 0; index_x < x_points.length; index_x++) {
        for (let index_power = 1; index_power <= n; index_power++) {
            VandermondeMatrix.set([index_x,index_power],VandermondeMatrix.get([index_x,index_power-1])*x_points[index_x]);
        }
    }
    return VandermondeMatrix;
}


SimpleLinearRegressor = function(x_points,y_points,degree,plotCurve=true,plotPoints=true) {
    
    let X = generateVandermondeMatrix(x_points,degree);
    console.log(X)

    let coeff = math.multiply(math.inv(math.multiply(math.transpose(X),X)),math.multiply(math.transpose(X),y_points));
    console.log(coeff)

    if (plotCurve) {
        regressor = function(x) {
            let x_Vandermonde = math.ones(degree+1);
            for (let index_power = 1; index_power <= degree; index_power++) {
                x_Vandermonde.set([index_power],x_Vandermonde.get([index_power-1])*x);
            }

            let result = math.dot(coeff,x_Vandermonde);

            return result;
        }
        
        plot_function(x_lim[0],x_lim[1],regressor,200);

        if (plotPoints) {
            for (let index = 0; index < x_points.length; index++) {
                ctx.beginPath();
                ctx.arc(coordinateTransform_x(x_points[index]),coordinateTransform_y(y_points[index]),5, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
        let y_hat = math.multiply(X,coeff);
        let residuals = math.subtract(y_hat,y_points);
        let MSE = math.mean(math.dot(residuals,residuals));
        return MSE
        
    }
    


}
