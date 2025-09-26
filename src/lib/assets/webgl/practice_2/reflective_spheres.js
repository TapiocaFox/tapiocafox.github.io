// Author: TapiocaFox
// Title:  Reflective Spheres

// Init variables.
const gl = foxGL.gl;
const program = foxGL.program;
const canvas = foxGL.canvas;

const PI = 3.141592653589793;
const NS = 4;
const NL = 3;

let destroyed = false;
let usePointer = false;
let enlarge = false;
let uMouse_x = 0;
let uMouse_y = 0;

// Declare listeners.
const onpointermove = async event => {
    usePointer = true;
    const canvasRect = canvas.getBoundingClientRect();
    const canvasHeight = canvasRect.bottom - canvasRect.top;
    uMouse_x = devicePixelRatio*(event.clientX-canvasRect.left);
    uMouse_y = devicePixelRatio*(canvasHeight-(event.clientY-canvasRect.top));
    gl.uniform2f(gl.getUniformLocation(program, 'uMouse'), uMouse_x, uMouse_y);
    foxGL.reportStatus('uMouse', `uMouse: (${uMouse_x.toFixed(1)}, ${uMouse_y.toFixed(1)})`);
};

const onclick = async event => {
    enlarge = !enlarge;
    foxGL.reportStatus('enlarge', `Enlarged: ${enlarge}`);
};

const pointerleave = async event => {
    usePointer = false;
};

const resizeObserver = new ResizeObserver(entries => {
    gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
    foxGL.reportStatus('uResolution', `uResolution: (${canvas.width.toFixed(1)}, ${canvas.height.toFixed(1)})`);
});

// Math.
const normalize = v => {
   let s = Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2]);
   return [ v[0]/s, v[1]/s, v[2]/s ];
}

// Render per animation frame.
function animate() {
    if(destroyed) return;
    requestAnimationFrame(animate);
    const uTime = (Date.now() - foxGL.startTime) / 1000;
    const RATIO_TIME = 0.66;
    gl.uniform1f(gl.getUniformLocation(program, 'uTime'), uTime);
    foxGL.reportStatus('uTime', `uTime: ${uTime.toFixed(2)}`);

    const deg = 0.25*PI*Math.sin(RATIO_TIME*uTime);
    const s = Math.sin(deg);
    const s_thrid = Math.sin(2*RATIO_TIME*uTime);
    const c_thrid = Math.cos(RATIO_TIME*uTime);
    const s_fourth = Math.sin(2*(RATIO_TIME*uTime-.33*PI));
    const c_fourth = Math.cos(RATIO_TIME*uTime-.33*PI);
    const c = Math.cos(deg);

    // Spheres.
    const thridSphere = [.7*c_thrid,.7*s_thrid,.1,.225];
    if(usePointer) {
        thridSphere[0] = 2*(uMouse_x/canvas.width)-1;
        thridSphere[1] = 2*(uMouse_y/canvas.height)-1;
    }
    if(enlarge) {
        thridSphere[3] = .275;
    }
    else {
        thridSphere[3] = .225;
    }
    gl.uniform4fv(gl.getUniformLocation(program, 'uS'), [ -.4*s,0,-.4*c,.35,
                              .4*s,0,.4*c,.35,
                               thridSphere,
                              .7*c_fourth,.7*s_fourth,.1,.225].flat());
    // Spheres' colors.
    let thridSphereC = [.5,1,.5];
    if(enlarge) {
        thridSphereC = [1,1,1];
    }
    else {
        thridSphereC = [1,1,1];
        // thridSphereC = [.5,1,.5];
    }
    gl.uniform3fv(gl.getUniformLocation(program, 'uC'), [ 1,.2,.2,
                             .25,.5,1,
                              thridSphereC,
                             0.2,0.,0.].flat());
    // Lights.
    gl.uniform3fv(gl.getUniformLocation(program, 'uL'), [ normalize([1,1,1]),
                             normalize([-1,-1,-.5]),
                             normalize([0,-1,0])
			   ].flat());

    // Lights' colors.
    gl.uniform3fv(gl.getUniformLocation(program, 'uLC'), [ .5,.7,1,
                              .2,.15,.1,
			      .5,0,0 ]);
    foxGL.render();
}

// Start lifecycle.
foxGL.onStart(async () => {
    // Set status title.
    foxGL.setStatusTitle('Reflective Spheres');
    foxGL.reportStatus('Description', `Click to enlarge the white sphere.`);
    foxGL.reportStatus('enlarge', `Enlarged: ${enlarge}`);

    // Setup vertex buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,0, 1,1,0, -1,-1,0, 1,-1,0, -1,-1,0, 1,1,0]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

    // Initial uniform values.
    gl.uniform1i(gl.getUniformLocation(program, 'NS'), NS);
    gl.uniform1i(gl.getUniformLocation(program, 'NL'), NL);
    gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
    gl.uniform3f(gl.getUniformLocation(program, 'uViewPoint'), 0, 0, 3);
    foxGL.reportStatus('uResolution', `uResolution: (${canvas.width.toFixed(1)}, ${canvas.height.toFixed(1)})`);
    
    // Register listeners on start.
    resizeObserver.observe(canvas);
    canvas.addEventListener('pointermove', onpointermove);
    canvas.addEventListener('click', onclick);
    canvas.addEventListener('pointerleave', pointerleave);
    window.addEventListener('resize', onresize);
    animate();
});

// Stop lifecycle.
foxGL.onStop(async () => {
    // Deregister listeners on stop.
    destroyed = true;
    resizeObserver.disconnect();
    canvas.removeEventListener('pointermove', onpointermove);
    canvas.removeEventListener('click', onclick);
    canvas.removeEventListener('pointerleave', pointerleave);
    window.removeEventListener('resize', onresize);
});