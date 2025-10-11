// Author: TapiocaFox
// Title:  Phong Reflection

// Init variables.
let gl, program, canvas;
let destroyed = false;
let onpointermove, onpointerleave, resizeObserver;

const PI = 3.141592653589793;
const NS = 1;
const NL = 2;

// Math.
const normalize = v => {
   let s = Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2]);
   return [ v[0]/s, v[1]/s, v[2]/s ];
}

// Start lifecycle.
export const start = async (foxGL) => {
    gl = foxGL.gl;
    program = foxGL.program;
    canvas = foxGL.canvas;
    
    // Set status title.
    foxGL.setStatusTitle('Phong Reflection');

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

    // Render per animation frame.
    function animate() {
        if(destroyed) return;
        if(firstFrameRendered) return;
        requestAnimationFrame(animate);
        const uTime = (Date.now() - foxGL.startTime) / 1000;
        gl.uniform1f(gl.getUniformLocation(program, 'uTime'), uTime);
        foxGL.reportStatus('uTime', `uTime: ${uTime.toFixed(2)}`);
    
        // Spheres.
        gl.uniform4fv(gl.getUniformLocation(program, 'uS'), [
            [0,0,0,.45]
        ].flat());
        
        // Spheres' lighting.
        gl.uniform3fv(gl.getUniformLocation(program, 'uAmbient'), [
            [ 0,0,.4 ]
        ].flat());
        gl.uniform3fv(gl.getUniformLocation(program, 'uDiffuse'), [
            [ 0,0,.4 ]
        ].flat());
        gl.uniform4fv(gl.getUniformLocation(program, 'uSpecular'), [
            [ 1,1,1,3 ]
        ].flat());
        
        // Lights.
        gl.uniform3fv(gl.getUniformLocation(program, 'uL'), [
            normalize([-.35,.35,.35]),
            normalize([1,-1,-.5])
        ].flat());
    
        // Lights' colors.
        gl.uniform3fv(gl.getUniformLocation(program, 'uLC'), [
            [.5,.7,1],
            [.2,.15,.1]
        ].flat());
        foxGL.render();
        firstFrameRendered = true;
    }
    
    let usePointer = false;
    let uMouseX = 0;
    let uMouseY = 0;
    let firstFrameRendered = false;
    
    // Declare listeners.
    onpointermove = async event => {
        usePointer = true;
        const canvasRect = canvas.getBoundingClientRect();
        const canvasHeight = canvasRect.bottom - canvasRect.top;
        uMouseX = devicePixelRatio*(event.clientX-canvasRect.left);
        uMouseY = devicePixelRatio*(canvasHeight-(event.clientY-canvasRect.top));
        gl.uniform2f(gl.getUniformLocation(program, 'uMouse'), uMouseX, uMouseY);
        foxGL.reportStatus('uMouse', `uMouse: (${uMouseX.toFixed(1)}, ${uMouseY.toFixed(1)})`);
    };
    
    onpointerleave = async event => {
        usePointer = false;
    };
    
    resizeObserver = new ResizeObserver(entries => {
        gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
        foxGL.reportStatus('uResolution', `uResolution: (${canvas.width.toFixed(1)}, ${canvas.height.toFixed(1)})`);
        firstFrameRendered = false;
        animate();
    });
    
    // Register listeners on start.
    resizeObserver.observe(canvas);
    canvas.addEventListener('pointermove', onpointermove);
    canvas.addEventListener('pointerleave', onpointerleave);
    animate();
};

// Stop lifecycle.
export const stop = async (foxGL) => {
    // Deregister listeners on stop.
    destroyed = true;
    if(resizeObserver) resizeObserver.disconnect();
    if(onpointermove) canvas.removeEventListener('pointermove', onpointermove);
    if(onpointerleave) canvas.removeEventListener('pointerleave', onpointerleave);
};