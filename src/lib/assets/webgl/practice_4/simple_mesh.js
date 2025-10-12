// Author: TapiocaFox
// Title:  Simple Mesh

// Init variables.
let gl, program, canvas;
let destroyed = false;
let onpointermove, resizeObserver;

const vertexSize = 6;
const mesh = [
    0, 1,0, 0,0,1,
    -1,-1,0, 0,0,1,
    1,-1,0, 0,0,1,]
const vertexNum = mesh.length / vertexSize;

// Start lifecycle.
export const start = async (foxGL) => {
    gl = foxGL.gl;
    program = foxGL.program;
    canvas = foxGL.canvas;

    // Set status title.
    foxGL.setStatusTitle('Simple Mesh');

    // Setup vertex buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    
    const aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, vertexSize*4, 0);

    const aNor = gl.getAttribLocation(program, 'aNor');
    gl.enableVertexAttribArray(aNor);
    gl.vertexAttribPointer(aNor, 3, gl.FLOAT, false, vertexSize*4, vertexNum*4);
    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh), gl.STATIC_DRAW);
    
    // Initial uniform values.
    gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
    foxGL.reportStatus('uResolution', `uResolution: (${canvas.width.toFixed(1)}, ${canvas.height.toFixed(1)})`);

    // Render per animation frame.
    function animate() {
        if(destroyed) return;
        requestAnimationFrame(animate);
        const uTime = (Date.now() - foxGL.startTime) / 1000;
        gl.uniform1f(gl.getUniformLocation(program, 'uTime'), uTime);
        foxGL.reportStatus('uTime', `uTime: ${uTime.toFixed(2)}`);
        gl.drawArrays(gl.TRIANGLES, 0, vertexNum);
        foxGL.render();
    }
    
    // Declare listeners.
    onpointermove = async event => {
        const canvasRect = canvas.getBoundingClientRect();
        const canvasHeight = canvasRect.bottom - canvasRect.top;
        const uMouseX = devicePixelRatio*(event.clientX-canvasRect.left);
        const uMouseY = devicePixelRatio*(canvasHeight-(event.clientY-canvasRect.top));
        gl.uniform2f(gl.getUniformLocation(program, 'uMouse'), uMouseX, uMouseY);
        foxGL.reportStatus('uMouse', `uMouse: (${uMouseX.toFixed(1)}, ${uMouseY.toFixed(1)})`);
    };
    
    resizeObserver = new ResizeObserver(entries => {
        gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
        foxGL.reportStatus('uResolution', `uResolution: (${canvas.width.toFixed(1)}, ${canvas.height.toFixed(1)})`);
    });
        
    // Register listeners on start.
    canvas.addEventListener('pointermove', onpointermove);
    resizeObserver.observe(canvas);
    animate();
};

// Stop lifecycle.
export const stop = async (foxGL) => {
    // Deregister listeners on stop.
    destroyed = true;
    if(onpointermove) canvas.removeEventListener('pointermove', onpointermove);
    if(resizeObserver) resizeObserver.disconnect();
};