// Author: TapiocaFox
// Title:  Quadric Surface (System)

import {qGlobal, qSphere, qParabX, qParabY, qParabZ, qSlabX, qSlabY, qSlabZ, qTubeX, qTubeY, qTubeZ, qConeX, qConeY, qConeZ, cubeSystem, hourglassSystem, coneSystem, cylinderSystem, noseSystem, sphereSystem} from 'quadric_matrices';
import { mxm, qxm, scale, translate, rotateX, rotateY } from 'matrix';

// Init variables.
let gl, program, canvas;
let destroyed = false;
let onpointermove, onclick, resizeObserver;

const qsxm = (QS,M) => { // "qs" stands for "qmtrx System".
    let newSystem = [];
    for(let n=0; n<QS.length; n++) {
        newSystem.push(qxm(QS[n],M));
    }
    return newSystem;
}

// Predefined systems.
const numObjects = 4;
const sizeScale = .66;
const flags_reveal = new Array(numObjects).fill(false);

let systemIndex = 1;
const systems = [
    cubeSystem,
    hourglassSystem,
    coneSystem,
    cylinderSystem,
    noseSystem,
    sphereSystem,
]

const systemNames = [
    'Cube',
    'Hourglass',
    'Cone',
    'Cylinder',
    'Nose',
    'Sphere',
]

// Start lifecycle.
export const start = async (foxGL) => {
    gl = foxGL.gl;
    program = foxGL.program;
    canvas = foxGL.canvas;
    
    // Set status title.
    foxGL.setStatusTitle('Quadric Surface (System)');
    foxGL.reportStatus('Tips', 'Click to cycle thru systems (shapes).', 'green');
    foxGL.reportStatus('QSurface', `Selected system: ${systemNames[systemIndex]}`, 'blue');

    foxGL.getAssetById('hl_blip').then(result => blipSound = result);

    // Setup vertex buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,0, 1,1,0, -1,-1,0, 1,-1,0, -1,-1,0, 1,1,0]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

    // Initial uniform values.
    gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
    foxGL.reportStatus('uResolution', `uResolution: (${canvas.width.toFixed(1)}, ${canvas.height.toFixed(1)})`);
    gl.uniform3f(gl.getUniformLocation(program, 'uViewPoint'), 0, 0, 7);

    let blipSound = null;
    
    // Render per animation frame.
    function animate() {
        if(destroyed) return;
        requestAnimationFrame(animate);
    
        let instances = [];
        
        
        const uTime = (Date.now() - foxGL.startTime) / 1000;
        gl.uniform1f(gl.getUniformLocation(program, 'uTime'), uTime);
        foxGL.reportStatus('uTime', `uTime: ${uTime.toFixed(2)}`);
    
        const cosScale = Math.cos(uTime);
        const scaleSize = 0.1;
        const breath = 1+scaleSize*cosScale;
    
        const sinTranslation = Math.sin(.66*uTime);
        const cosTranslation = Math.cos(.33*uTime);
        const transaltionScale = .4;
        const translateX = transaltionScale*sinTranslation;
        const translateY = transaltionScale*cosTranslation;
    
        let transform = scale(.45,.45,.45);
        transform = mxm(transform,translate(translateX,translateY,0));
        transform = mxm(transform,scale(breath,breath,breath));
        transform = mxm(transform,rotateX(.66*uTime));
        transform = mxm(transform,rotateY(.66*uTime));
        // transform = mxm(transform,rotateZ(uTime));
        const finalQSystem = qsxm(systems[systemIndex], transform).flat();
        instances.push(finalQSystem);
        
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uQ'), false, instances.flat());
        gl.uniform1i(gl.getUniformLocation(program, 'uNumQ'), numObjects);
        gl.uniform1iv(gl.getUniformLocation(program, 'uF'), flags_reveal);
        
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
        blipSound.currentTime = 0;
        blipSound?.play();
        systemIndex = (systemIndex+1)%systems.length;
        foxGL.reportStatus('QSurface', `Selected system: ${systemNames[systemIndex]}`, 'blue');
    }
    
    resizeObserver = new ResizeObserver(entries => {
        gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
        foxGL.reportStatus('uResolution', `uResolution: (${canvas.width.toFixed(1)}, ${canvas.height.toFixed(1)})`);
    });
    
    // Register listeners on start.
    resizeObserver.observe(canvas);
    canvas.addEventListener('pointermove', onpointermove);
    canvas.addEventListener('click', onclick);
    animate();
};

// Stop lifecycle.
export const stop = async (foxGL) => {
    // Deregister listeners on stop.
    destroyed = true;
    if(resizeObserver) resizeObserver.disconnect();
    if(onpointermove) canvas.removeEventListener('pointermove', onpointermove);
    if(onclick) canvas.removeEventListener('click', onclick);
};