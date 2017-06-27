// twilight.js
// (c) 2017 Andrew Liles
// MIT License

document.addEventListener('DOMContentLoaded', twilightMain);
var gl;
var prog;
var twilightParams = {
    orange: [1, 72.0/255.0, 0, 1],
    blueish: [0, 110.0/255.0, 189.0/255.0, 1],
    black: [0,0,0,1],
    TRANSITION: 0.2,
    NUM_SMALL_STARS: 2500,
    NUM_BIG_STARS: 200
}

var bgPosBuf;
var bgColBuf;

async function twilightMain() {
    var canvas = document.getElementById('twilight');
    gl = initGL(canvas);

    if(!gl) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    prog = await compileProgram();
    var positionAttribLoc = gl.getAttribLocation(prog, "a_position");
    var colorAttribLoc = gl.getAttribLocation(prog, "a_color");
    loadBuffers();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(prog);

    gl.enableVertexAttribArray(positionAttribLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, bgPosBuf); 
    gl.vertexAttribPointer(positionAttribLoc, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(colorAttribLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, bgColBuf);
    gl.vertexAttribPointer(colorAttribLoc, 4, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function initGL(canvas) {
    gl = null;
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if(!gl) {
        alert("Couldn't get a WebGL context");
    }
    return gl;
}

async function compileProgram() {
    var frag = await fetch("twilight.frag");
    var vert = await fetch("twilight.vert");

    var fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, frag);
    gl.compileShader(fs);

    var vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vert);
    gl.compileShader(vs);

    if(! (gl.getShaderParameter(fs, gl.COMPILE_STATUS) && gl.getShaderParameter(vs, gl.COMPILE_STATUS)) )
    {
        alert("error compiling shaders");
    }

    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);

    if(!gl.getProgramParameter(prog, gl.LINK_STATUS))
    {
        alert("failed to link shader program");
    }

    return prog;
}

function loadBuffers() {
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    var points = [ 
        -1, -1,
        1, -1,
        -1, 0,
        1, 0,
        1, -1,
        -1, 0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    var colors = [];
    colors = colors.concat(twilightParams.orange);
    colors = colors.concat(twilightParams.orange);
    colors = colors.concat(twilightParams.blueish);
    colors = colors.concat(twilightParams.blueish);
    colors = colors.concat(twilightParams.orange);
    colors = colors.concat(twilightParams.blueish);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    bgPosBuf = positionBuffer;
    bgColBuf = colorBuffer;
}

// super simple AJAX
async function fetch(url) {
    return new Promise((resolve, reject) => {
        var x = new XMLHttpRequest();
        x.onreadystatechange = function() {
            if(x.readyState == XMLHttpRequest.DONE) {
                if(x.status == 200) {
                    resolve(x.responseText);
                } else {
                    reject(x.statusText);
                }
            }
        }
        x.open("GET", url, true);
        x.send();
    });
}

