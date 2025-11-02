const e=`// Author: TapiocaFox
// Title:  Quadric Surface Matrix (From Prof. Perlin)

import { mxm, qxm, scale, translate } from 'matrix';

export const qGlobal = [0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, -1];

export const qSphere = [1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, -1];

export const qParabX = [0, 0, 0, 1,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 0];

export const qParabY = [1, 0, 0, 0,
    0, 0, 0, 1,
    0, 0, 1, 0,
    0, 0, 0, 0];

export const qParabZ = [1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 0, 1,
    0, 0, 0, 0];

export const qSlabX = [1, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, -1];

export const qSlabY = [0, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, -1];

export const qSlabZ = [0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, -1];

export const qTubeX = [0, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, -1];

export const qTubeY = [1, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, -1];

export const qTubeZ = [1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, -1];

export const qConeX = [-1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 0];

export const qConeY = [1, 0, 0, 0,
    0, -1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 0];

export const qConeZ = [1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, -1, 0,
    0, 0, 0, 0];

// Predefined systems.
export const cubeSystem = [qSlabX, qSlabY, qSlabZ]; // Cube
export const hourglassSystem = [qSlabX, qConeX, qGlobal]; // Hourglass
export const coneSystem = [qConeX, qxm(qSlabX, mxm(scale(.5, 1, 1), translate(1, 0, 0))), qGlobal]; // Real cone
export const cylinderSystem = [qTubeX, qSlabX, qGlobal]; // Cylinder
export const noseSystem = [qParabX, qSlabX, qGlobal]; // Nose
export const sphereSystem = [qSphere, qGlobal, qGlobal]; // Sphere`,n=`// Author: TapiocaFox
// Title:  Frameskip Renderer

// Init variables.
let gl, program, canvas;
let destroyed = false;
let onpointermove, resizeObserver;

const frameSkip = 3;
const frameSkipSkip = 5;

export const title = 'Frame Skip Renderer';

// Start lifecycle.
export const start = async (foxGL) => {
    gl = foxGL.gl;
    program = foxGL.program;
    canvas = foxGL.canvas;

    // Setup vertex buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, 0, 1, 1, 0, -1, -1, 0, 1, -1, 0, -1, -1, 0, 1, 1, 0]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

    // Initial uniform values.
    gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
    foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);

    let firstFrameRendered = false;
    let frameCount = 0;
    let skippedFrameCount = 0;
    let doNotSkip = false;

    // Render per animation frame.
    function animate() {
        if (destroyed) return;
        requestAnimationFrame(animate);
        frameCount++;
        if (!doNotSkip && firstFrameRendered && frameCount % frameSkip != 0) {
            skippedFrameCount++;
            if (skippedFrameCount % frameSkipSkip == 0) return;
        }
        const uTime = (Date.now() - foxGL.startTime) / 1000;
        gl.uniform1f(gl.getUniformLocation(program, 'uTime'), uTime);
        foxGL.reportStatus('uTime', \`uTime: \${uTime.toFixed(2)}\`);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        foxGL.reportFrame();
        firstFrameRendered = true;
    }

    // Declare listeners.
    onpointermove = async event => {
        const canvasRect = canvas.getBoundingClientRect();
        const canvasHeight = canvasRect.bottom - canvasRect.top;
        const uMouseX = devicePixelRatio * (event.clientX - canvasRect.left);
        const uMouseY = devicePixelRatio * (canvasHeight - (event.clientY - canvasRect.top));
        gl.uniform2f(gl.getUniformLocation(program, 'uMouse'), uMouseX, uMouseY);
        foxGL.reportStatus('uMouse', \`uMouse: (\${uMouseX.toFixed(1)}, \${uMouseY.toFixed(1)})\`);
        doNotSkip = true;
    };

    onpointerleave = async event => {
        doNotSkip = false;
    };

    resizeObserver = new ResizeObserver(entries => {
        gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
        foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);
        firstFrameRendered = false;
    });

    // Register listeners on start.
    canvas.addEventListener('pointermove', onpointermove);
    canvas.addEventListener('pointerleave', onpointerleave);
    resizeObserver.observe(canvas);
    animate();
};

// Stop lifecycle.
export const stop = async (foxGL) => {
    // Deregister listeners on stop.
    destroyed = true;
    if (onpointermove) canvas.removeEventListener('pointermove', onpointermove);
    if (onpointerleave) canvas.removeEventListener('pointerleave', onpointerleave);
    if (resizeObserver) resizeObserver.disconnect();
};`,t=`// Author: TapiocaFox
// Title:  Passive Renderer

// Init variables.
let gl, program, canvas;
let destroyed = false;
let onpointermove, resizeObserver;

export const title = "Passive Renderer";
export const description = "Render only when mouse is entered.";

// Start lifecycle.
export const start = async (foxGL) => {
    gl = foxGL.gl;
    program = foxGL.program;
    canvas = foxGL.canvas;

    // Setup vertex buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,0, 1,1,0, -1,-1,0, 1,-1,0, -1,-1,0, 1,1,0]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

    // Initial uniform values.
    gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
    foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);
        
    let animateOrNot = false;
    let firstFrameRendered = false;
    
    // Render per animation frame.
    function animate() {
        if(destroyed) return;
        if(firstFrameRendered && !animateOrNot) return;
        requestAnimationFrame(animate);
        const uTime = (Date.now() - foxGL.startTime) / 1000;
        gl.uniform1f(gl.getUniformLocation(program, 'uTime'), uTime);
        foxGL.reportStatus('uTime', \`uTime: \${uTime.toFixed(2)}\`);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        foxGL.reportFrame();
        firstFrameRendered = true;
    }

    // Declare listeners.
    onpointermove = async event => {
        const canvasRect = canvas.getBoundingClientRect();
        const canvasHeight = canvasRect.bottom - canvasRect.top;
        const uMouseX = devicePixelRatio*(event.clientX-canvasRect.left);
        const uMouseY = devicePixelRatio*(canvasHeight-(event.clientY-canvasRect.top));
        gl.uniform2f(gl.getUniformLocation(program, 'uMouse'), uMouseX, uMouseY);
        foxGL.reportStatus('uMouse', \`uMouse: (\${uMouseX.toFixed(1)}, \${uMouseY.toFixed(1)})\`);
        if(!animateOrNot) {
            animateOrNot = true;
            animate();
        }
    };
    
    onpointerleave = async event => {
        animateOrNot = false;
    };
    
    resizeObserver = new ResizeObserver(entries => {
        gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
        foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);
        firstFrameRendered = false;
        animate();
    });

    // Register listeners on start.
    resizeObserver.observe(canvas);
    canvas.addEventListener('pointermove', onpointermove);
    canvas.addEventListener('pointerleave', onpointerleave);
};

// Stop lifecycle.
export const stop = async (foxGL) => {
    // Deregister listeners on stop.
    destroyed = true;
    if(resizeObserver) resizeObserver.disconnect();
    if(onpointermove) canvas.removeEventListener('pointermove', onpointermove);
    if(onpointerleave) canvas.removeEventListener('pointerleave', onpointerleave);
};`;export{n as f,t as p,e as q};
