// Author: TapiocaFox
// Title:  Match The Texture

import {qGlobal, qSphere, qParabX, qParabY, qParabZ, qSlabX, qSlabY, qSlabZ, qTubeX, qTubeY, qTubeZ, qConeX, qConeY, qConeZ, cubeSystem, hourglassSystem, coneSystem, cylinderSystem, noseSystem, sphereSystem} from 'quadric_matrices';
import { mxm, qxm, scale, translate, rotateX, rotateY } from 'matrix';

// Init variables.
let gl, program, canvas;
let destroyed = false;
let onpointermove, onpointerenter, onpointerleave, onclick, resizeObserver;

const qsxm = (QS,M) => { // "qs" stands for "Quadric System".
    let newSystem = [];
    for(let n=0; n<QS.length; n++) {
        newSystem.push(qxm(QS[n],M));
    }
    return newSystem;
}

let systemIndex = 5;
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

const nearest_sq = n => Math.ceil(Math.sqrt(n));

const numObjects = 16;
const numGridSlice = nearest_sq(numObjects);
const coolDownTime = 500;

let flags_reveal = new Array(numObjects).fill(false);
let flags_lock = new Array(numObjects).fill(false);
let seedsUnique = Array.from({ length: Math.ceil(numObjects / 2) }, () => randInt(0, 1000));
let seeds = shuffleArray([seedsUnique, seedsUnique].flat());
let seletedSeed = null;
let selectedIndex = null;
let isCoolingDown = false;
let matchCount = 0;

let blipSound = null;
let button1Sound = null;
let button2Sound = null;
let gmanWiseSound = null;
let ambientSound = null;

function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function shuffleArray(array) {
  let currentIndex = array.length;
  let randomIndex; 
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--; 
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

function resetGame() {
    flags_reveal = new Array(numObjects).fill(false);
    flags_lock = new Array(numObjects).fill(false);
    seedsUnique = Array.from({ length: Math.ceil(numObjects / 2) }, () => randInt(0, 1000));
    seeds = shuffleArray([seedsUnique, seedsUnique].flat());
    seletedSeed = null;
    selectedIndex = null;
    isCoolingDown = false;  
    matchCount = 0;
}

export const title = 'Match The Texture';
export const description = 'Click to reveal texture to Gman.';

// Start lifecycle.
export const start = async (foxGL) => {
    gl = foxGL.gl;
    program = foxGL.program;
    canvas = foxGL.canvas;
    
    // Set status title.
    foxGL.reportStatus('Tips', 'Click to reveal texture to Gman.', 'green');
    foxGL.reportStatus('MatchCount', `Matched Spheres: ${matchCount}`, 'blue');

    foxGL.getAssetById('hl_blip1').then(result => blipSound = result);
    foxGL.getAssetById('hl_button1').then(result => button1Sound = result);
    foxGL.getAssetById('hl_button2').then(result => button2Sound = result);
    foxGL.getAssetById('hl_gman_wise').then(result => gmanWiseSound = result);
    // foxGL.getAssetById('hl_industrial1').then(result => {ambientSound = result; ambientSound.loop=true;});

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
    gl.uniform1i(gl.getUniformLocation(program, 'uNumQ'), numObjects);
    gl.uniform1f(gl.getUniformLocation(program, 'uSizeGrid'), 2/numGridSlice);

    // Render per animation frame.
    function animate() {
        if(destroyed) return;
        requestAnimationFrame(animate);
    
        let instances = [];
        
        const uTime = (Date.now() - foxGL.startTime) / 1000;
        gl.uniform1f(gl.getUniformLocation(program, 'uTime'), uTime);
        foxGL.reportStatus('uTime', `uTime: ${uTime.toFixed(2)}`);
    
        let uniformTransform = scale(1/numGridSlice,1/numGridSlice,1/numGridSlice);
    
        for(let i=0; i<numGridSlice; i++) {
            for(let j=0; j<numGridSlice; j++) {
                const translateX = (2*j)-(numGridSlice-1);
                const translateY = (2*i)-(numGridSlice-1);
                const translateZ = (matchCount == numObjects)?2*Math.sin(uTime+i+j):.25*Math.sin(uTime+i+j);
                const transform = mxm(uniformTransform,translate(translateX, translateY, translateZ));
                const finalQSystem = qsxm(systems[systemIndex], transform).flat();
                instances.push(finalQSystem);
            }
        }
    
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uQ'), false, instances.flat());
        gl.uniform1iv(gl.getUniformLocation(program, 'uF'), flags_reveal);
        gl.uniform1iv(gl.getUniformLocation(program, 'uS'), seeds);
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
    
    onpointerenter = async event => {
        ambientSound?.play();
    };
    
    onpointerleave = async event => {
        ambientSound?.pause();
    };
    
    onclick = async event => {
        // systemIndex = (systemIndex+1)%systems.length;
        // foxGL.reportStatus('QSurface', `Selected system: ${systemNames[systemIndex]}`, 'blue');
        
        blipSound.currentTime = 0;
        blipSound?.play();
        if(isCoolingDown) return;
        const canvasRect = canvas.getBoundingClientRect();
        const canvasHeight = canvasRect.bottom - canvasRect.top;
        const uMouseX = devicePixelRatio*(event.clientX-canvasRect.left);
        const uMouseY = devicePixelRatio*(canvasHeight-(event.clientY-canvasRect.top));
        const col = Math.floor((uMouseX/canvas.width)/(1/numGridSlice));
        const row = Math.floor((uMouseY/canvas.height)/(1/numGridSlice));
        const index = col+numGridSlice*row;
        if(index == selectedIndex || flags_lock[index]) return;
        if(seletedSeed == null) {
            flags_reveal[index] = true;
            seletedSeed = seeds[index];
            selectedIndex = index;
        }
        else if(seeds[index] != seletedSeed) {
            flags_reveal[index] = true;
            button2Sound.currentTime = 0;
            button2Sound?.play();
            isCoolingDown = true;
            setTimeout(() => {
                isCoolingDown = false;
                flags_reveal[selectedIndex] = false;
                flags_reveal[index] = false;
                seletedSeed = null;
                selectedIndex = null;
            }, coolDownTime);
        }
        else {
            flags_reveal[index] = true;
            flags_lock[index] = true;
            flags_lock[selectedIndex] = true;
            button1Sound.currentTime = 0;
            button1Sound?.play();
            seletedSeed = null;
            selectedIndex = null;
            matchCount += 2;
            foxGL.reportStatus('MatchCount', `Matched Spheres: ${matchCount}`, 'blue');
            if(matchCount == numObjects) {
                gmanWiseSound.currentTime = 0;
                gmanWiseSound?.play();
                setTimeout(() => {
                    foxGL.reportStatus('MatchCount', `Matched Spheres: ${matchCount}`, 'blue');
                    resetGame();
                    foxGL.reportStatus('MatchCount', `Matched Spheres: ${matchCount}`, 'blue');
                }, 16*coolDownTime);
            }
        }
        foxGL.reportStatus('ClickPos', `Click Position: (${uMouseX.toFixed(1)} [${col}], ${uMouseY.toFixed(1)} [${row}])`);
    }
    
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
    if(onpointermove) canvas.removeEventListener('pointerenter', onpointermove);
    if(onpointermove) canvas.removeEventListener('pointerleave', onpointerleave);
    if(onclick) canvas.removeEventListener('click', onclick);
};