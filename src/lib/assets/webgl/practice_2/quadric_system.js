// Author: TapiocaFox
// Title:  Quadric Surface (System)

import qmtrx from 'quadric_matrices';

// Init variables.
let gl, program, canvas;
let destroyed = false;
let onpointermove, onclick, resizeObserver;

// Transformations. Column major.
// Row.
const rotateX = r => [1,0,0,0,
                      0,Math.cos(r),Math.sin(r),0,
                      0,-Math.sin(r),Math.cos(r),0,
                      0,0,0,1];
// Pitch.
const rotateY = r => [Math.cos(r),0,-Math.sin(r),0,
                      0,1,0,0,
                      Math.sin(r),0,Math.cos(r),0,
                      0,0,0,1];
// Yaw.
const rotateZ = r => [Math.cos(r),Math.sin(r),0,0,
                      -Math.sin(r),Math.cos(r),0,0,
                      0,0,1,0,
                      0,0,0,1];
// Translate.
const translate = (x,y,z) => [1,0,0,0,
                              0,1,0,0,
                              0,0,1,0,
                              x,y,z,1];

// Scale.
const scale = (x,y,z) => [x,0,0,0,
                          0,y,0,0,
                          0,0,z,0,
                          0,0,0,1];

// Matrix operations.
const mxm = (a,b) => {
   let m = [];
   for (let c = 0 ; c < 16 ; c += 4)
       for (let r = 0 ; r < 4 ; r++)
          m.push(a[r]*b[c]+a[r+4]*b[c+1]+a[r+8]*b[c+2]+a[r+12]*b[c+3]);
   return m;
}

const transpose = m => [ m[0],m[4],m[ 8],m[12],
                       m[1],m[5],m[ 9],m[13],
                       m[2],m[6],m[10],m[14],
                       m[3],m[7],m[11],m[15] ];

const inverse = src => {
   let dst = [], det = 0, cofactor = (c, r) => {
      let s = (i, j) => src[c+i & 3 | (r+j & 3) << 2];
      return (c+r&1?-1:1)*((s(1,1)*(s(2,2)*s(3,3)-s(3,2)*s(2,3)))
                         - (s(2,1)*(s(1,2)*s(3,3)-s(3,2)*s(1,3)))
                         + (s(3,1)*(s(1,2)*s(2,3)-s(2,2)*s(1,3))) );
   }
   for (let n = 0 ; n < 16 ; n++) dst.push(cofactor(n >> 2, n & 3));
   for (let n = 0 ; n <  4 ; n++) det += src[n] * dst[n << 2];
   for (let n = 0 ; n < 16 ; n++) dst[n] /= det;
   return dst;
}

const qxm = (Q,M) => {
   let MI = inverse(M);
   return mxm(transpose(MI), mxm(Q, MI));
}

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

const cubeSystem = [qmtrx.qSlabX, qmtrx.qSlabY, qmtrx.qSlabZ]; // Cube
const hourglassSystem = [qmtrx.qSlabX, qmtrx.qConeX, qmtrx.qGlobal]; // Hourglass
const coneSystem = [qmtrx.qConeX, qxm(qmtrx.qSlabX,mxm(scale(.5,1,1),translate(1,0,0))), qmtrx.qGlobal]; // Real cone
const cylinderSystem = [qmtrx.qTubeX, qmtrx.qSlabX, qmtrx.qGlobal]; // Cylinder
const noseSystem = [qmtrx.qParabX, qmtrx.qSlabX, qmtrx.qGlobal]; // Nose
const sphereSystem = [qmtrx.qSphere, qmtrx.qGlobal, qmtrx.qGlobal]; // Sphere

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