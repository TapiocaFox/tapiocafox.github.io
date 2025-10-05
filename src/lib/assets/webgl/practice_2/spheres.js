// Author: TapiocaFox
// Title:  Perlin Spheres

// Init variables.
const gl = foxGL.gl;
const program = foxGL.program;
const canvas = foxGL.canvas;

const NS = 3;
const NL = 3;

let destroyed = false;

// Declare listeners.
const onpointermove = async event => {
    const canvasRect = canvas.getBoundingClientRect();
    const canvasHeight = canvasRect.bottom - canvasRect.top;
    const uMouseX = devicePixelRatio*(event.clientX-canvasRect.left);
    const uMouseY = devicePixelRatio*(canvasHeight-(event.clientY-canvasRect.top));
    gl.uniform2f(gl.getUniformLocation(program, 'uMouse'), uMouseX, uMouseY);
    foxGL.reportStatus('uMouse', `uMouse: (${uMouseX.toFixed(1)}, ${uMouseY.toFixed(1)})`);
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
    gl.uniform1f(gl.getUniformLocation(program, 'uTime'), uTime);
    foxGL.reportStatus('uTime', `uTime: ${uTime.toFixed(2)}`);

    
    let s = Math.sin(uTime);
    const c = Math.cos(uTime);
    
    gl.uniform4fv(gl.getUniformLocation(program, 'uS'), [ -.3*s,0,0,.4,
                              .3*s,0,.3,.4,
                              .7*c,.7*s,.0,.2 ]);
    gl.uniform3fv(gl.getUniformLocation(program, 'uC'), [ 1,.5,.5,
                             .5,.7,1,
                             .5,1,.5 ]);
    gl.uniform3fv(gl.getUniformLocation(program, 'uL'), [ normalize([1,1,1]),
                             normalize([-1,-1,-.5]),
                             normalize([0,-1,0])
			   ].flat());

    gl.uniform3fv(gl.getUniformLocation(program, 'uLC'), [ .5,.7,1,
                              .2,.15,.1,
			      .5,0,0 ]);
    foxGL.render();
}

// Start lifecycle.
foxGL.onStart(async () => {
    // Set status title.
    foxGL.setStatusTitle('Spheres');

    // Setup vertex buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,0, 1,1,0, -1,-1,0, 1,-1,0, -1,-1,0, 1,1,0]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

    gl.uniform1i(gl.getUniformLocation(program, 'NS'), NS);
    gl.uniform1i(gl.getUniformLocation(program, 'NL'), NL);
    gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
    gl.uniform3f(gl.getUniformLocation(program, 'uViewPoint'), 0, 0, 5);
    foxGL.reportStatus('uResolution', `uResolution: (${canvas.width.toFixed(1)}, ${canvas.height.toFixed(1)})`);
    
    // Register listeners on start.
    resizeObserver.observe(canvas);
    canvas.addEventListener('pointermove', onpointermove);
    animate();
});

// Stop lifecycle.
foxGL.onStop(async () => {
    // Deregister listeners on stop.
    destroyed = true;
    resizeObserver.disconnect();
    canvas.removeEventListener('pointermove', onpointermove);
});