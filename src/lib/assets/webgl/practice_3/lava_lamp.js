// Author: TapiocaFox
// Title:  Lava Lamp

// Init variables.
let gl, program, canvas;
let destroyed = false;
let onpointermove, onpointerenter, onpointerleave, onclick, resizeObserver;

let alienSound = null;
let alienAppealSound = null;

export const title = 'Lava Lamp';
export const description = 'Click to appeal to the alien authority.';

// Start lifecycle.
export const start = async (foxGL) => {
    gl = foxGL.gl;
    program = foxGL.program;
    canvas = foxGL.canvas;
    
    // Set status title.
    foxGL.reportStatus('Tips', 'Click to appeal to the alien authority.', 'green');
    
    foxGL.getAssetById('hl_alien_blipper').then(result => {result.loop = true; alienSound=result;});
    foxGL.getAssetById('hl_alienappeal').then(result => {alienAppealSound=result;});

    // Setup vertex buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,0, 1,1,0, -1,-1,0, 1,-1,0, -1,-1,0, 1,1,0]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

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
    
    onclick = async event => {
        alienAppealSound.currentTime = 0;
        alienAppealSound?.play();
    };
    
    onpointerenter = async event => {
        alienSound?.play();
    };
    
    onpointerleave = async event => {
        alienSound?.pause();
    };
    
    resizeObserver = new ResizeObserver(entries => {
        gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
        foxGL.reportStatus('uResolution', `uResolution: (${canvas.width.toFixed(1)}, ${canvas.height.toFixed(1)})`);
    });
    
    // Register listeners on start.
    resizeObserver.observe(canvas);
    canvas.addEventListener('pointermove', onpointermove);
    canvas.addEventListener('pointerenter', onpointerenter);
    canvas.addEventListener('pointerleave', onpointerleave);
    canvas.addEventListener('click', onclick);
    animate();
};

// Stop lifecycle.
export const stop = async (foxGL) => {
    // Deregister listeners on stop.
    destroyed = true;
    if(resizeObserver) resizeObserver.disconnect();
    if(onpointermove) canvas.removeEventListener('pointermove', onpointermove);
    if(onpointerenter) canvas.removeEventListener('pointerenter', onpointerenter);
    if(onpointerleave) canvas.removeEventListener('pointerleave', onpointerleave);
    if(onclick) canvas.removeEventListener('click', onclick);
};