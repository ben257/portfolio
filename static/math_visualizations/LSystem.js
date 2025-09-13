
function rule_func(s,rule_dict) {
    let result = "";
    for (let char of s) {
        result = result.concat(rule_dict[char]);
    }
    return result;
}

 function get_grid_L_system(rule_dict,start,angle,num_iterations,forward_chars = [],angle_0=0) {

    let result = start;

    for (let epoch = 0; epoch < num_iterations; epoch++) {
        
        result = rule_func(result,rule_dict);
    }

    let x_current = 0;
    let y_current = 0;
    let angle_current = angle_0;

    let x_min = 0;
    let x_max = 0;
    let y_min = 0;
    let y_max = 0;

    for (let char of result) {
        

        let x_next = x_current+Math.cos(angle_current);
        let y_next = y_current+Math.sin(angle_current);

        //draw line segment
        if (forward_chars.includes(char)) {
        
            x_current = x_next;
            y_current = y_next;
        }

        //rotate
        else if (char == "+") {
            angle_current += angle;
        }

        //rotate
        else if (char == "-") {
            angle_current -= angle;
        }
        x_min = Math.min(x_min,x_current);
        x_max = Math.max(x_max,x_current);
        y_min = Math.min(y_min,y_current);
        y_max = Math.max(y_max,y_current);
    }
    
    let width = x_max-x_min;
    x_min -=  .2*width;
    x_max +=  .2*width;
    let height = y_max-y_min;
    y_min -=  .2*height;
    y_max +=  .2*height;
    return [[x_min,x_max],[y_min,y_max]]
    
}

function sleep(ms=100) {
    return new Promise(resolve => setTimeout(resolve, ms));
 }

 async function L_system(rule_dict,start,angle,num_iterations,forward_chars = [],angle_0=0,ms=20) {
     
    if (x_lim === null) {
        let windowLimits = get_grid_L_system(rule_dict,start,angle,num_iterations,forward_chars,angle_0);
        x_lim = windowLimits[0];
        y_lim = windowLimits[1]
    }
    let result = start;

    for (let epoch = 0; epoch < num_iterations; epoch++) {
        
        result = rule_func(result,rule_dict);
    }

    let x_current = 0;
    let y_current = 0;
    let angle_current = angle_0;

    ctx.beginPath();
    ctx.moveTo((0 - x_lim[0])*canvas.width/(x_lim[1]-x_lim[0]), (0 - y_lim[0])*canvas.height/(y_lim[1]-y_lim[0]));

    for (let char of result) {
        

        let x_next = x_current+Math.cos(angle_current);
        let y_next = y_current+Math.sin(angle_current);

        //draw line segment
        if (forward_chars.includes(char)) {
            
            
            await sleep(ms)
            console.log('a')
            let x_next_canvas = (x_next - x_lim[0])*canvas.width/(x_lim[1]-x_lim[0]);
            let y_next_canvas = (y_next - y_lim[0])*canvas.height/(y_lim[1]-y_lim[0]);
            ctx.lineTo(x_next_canvas, y_next_canvas);

            if (ms > 0) {
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x_next_canvas, y_next_canvas);
            }
            x_current = x_next;
            y_current = y_next;
        }

        //rotate
        else if (char == "+") {
            angle_current += angle;
        }

        //rotate
        else if (char == "-") {
            angle_current -= angle;
        }
    }

    if (ms == 0) {
        ctx.stroke();
    }
    
    
}

const mouse = {
    x:null,
    y:null
}

function updateMouse(event) {
    mouse.x = event.x;
    mouse.y = event.y;
    zoomIn(x_lim,y_lim,mouse,canvas);
    L_system(rule_dict,start,angle,num_iterations,forward_chars,angle_0,ms=0);
}


let x_lim=null;
let y_lim=null;


const canvas = document.getElementById("Canvas");
const ctx = canvas.getContext("2d");
ctx.lineWidth = .1;


let ms = 5;

canvas.addEventListener('click',updateMouse);

const form = document.querySelector('form');
form.addEventListener('submit', (e) => {

  e.preventDefault(); // Prevent HTML refresh
  const formData = new FormData(form); // Converts to array of arrays
  const obj = Object.fromEntries(formData); // Array of arrays to object
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  x_lim=null;
  y_lim=null;
  L_system(JSON.parse(obj["rules"]),obj["axiom"],parseInt(obj["angle"])*Math.PI/180,parseInt(obj["numIterations"]),JSON.parse(obj["forwardCharacters"]),parseInt(obj["startAngle"])*Math.PI/180,parseInt(obj["ms"]))
  
});

L_system({"F":"F+G","G":"F-G","+":"+","-":"-"},"F",Math.PI/2,15,forward_chars = ["F","G"],angle_0=0)

/*
let rule_dict = {"F":"F-G+F+G-F","G":"GG","-":"-","+":"+"}; 
let start = "F";
let angle = 2*Math.PI/3;
let num_iterations = 5;
let forward_chars = ["F","G"]
let angle_0 = 0;



//L_system(rule_dict,start,angle,num_iterations,forward_chars,angle_0)

//let rule_dict = {"F":"F+G","G":"F-G","+":"+","-":"-"};
//L_system(rule_dict,"F",Math.PI/2,15,forward_chars = ["F","G"],angle_0=0)

//snowflake
//let rule_dict = {"F":"F+F-F-F+F","+":"+","-":"-"} ;
//L_system(rule_dict,"F",Math.PI/2,6,forward_chars = ["F"],angle_0=0)

//triangle
//let rule_dict = {"F":"F-G+F+G-F","G":"GG","-":"-","+":"+"} 
//L_system(rule_dict,"F",2*Math.PI/3,5,forward_chars = ["F","G"],angle_0=0)
*/