// Author: TapiocaFox
// Title:  Match The Texture

// Init variables.
const gl = foxGL.gl;
const program = foxGL.program;
const canvas = foxGL.canvas;

let destroyed = false;

const qGlobal = [0,0,0,0,
                 0,0,0,0,
                 0,0,0,0,
                 0,0,0,-1];

const qSphere = [1,0,0,0,
                 0,1,0,0,
                 0,0,1,0,
                 0,0,0,-1];

const qParabX = [0,0,0,1,
                 0,1,0,0,
                 0,0,1,0,
                 0,0,0,0];

const qParabY = [1,0,0,0,
                 0,0,0,1,
                 0,0,1,0,
                 0,0,0,0];

const qParabZ = [1,0,0,0,
                 0,1,0,0,
                 0,0,0,1,
                 0,0,0,0];

const qSlabX = [1,0,0,0,
                0,0,0,0,
                0,0,0,0,
                0,0,0,-1];

const qSlabY = [0,0,0,0,
                0,1,0,0,
                0,0,0,0,
                0,0,0,-1];

const qSlabZ = [0,0,0,0,
                0,0,0,0,
                0,0,1,0,
                0,0,0,-1];

const qTubeX = [0,0,0,0,
                0,1,0,0,
                0,0,1,0,
                0,0,0,-1];

const qTubeY = [1,0,0,0,
                0,0,0,0,
                0,0,1,0,
                0,0,0,-1];

const qTubeZ = [1,0,0,0,
                0,1,0,0,
                0,0,0,0,
                0,0,0,-1];

const qConeX = [-1,0,0,0,
                 0,1,0,0,
                 0,0,1,0,
                 0,0,0,0];

const qConeY = [1,0,0,0,
                0,-1,0,0,
                0,0,1,0,
                0,0,0,0];

const qConeZ = [1,0,0,0,
                0,1,0,0,
                0,0,-1,0,
                0,0,0,0];

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

const qsxm = (QS,M) => { // "qs" stands for "Quadric System".
    let newSystem = [];
    for(let n=0; n<QS.length; n++) {
        newSystem.push(qxm(QS[n],M));
    }
    return newSystem;
}

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

// Predefined systems.
const numObjects = 16;
const coolDownTime = 500;

let flags_reveal = new Array(numObjects).fill(false);
let flags_lock = new Array(numObjects).fill(false);
let seedsUnique = Array.from({ length: Math.ceil(numObjects / 2) }, () => randInt(0, 1000));
let seeds = shuffleArray([seedsUnique, seedsUnique].flat());
let seletedSeed = null;
let selectedIndex = null;
let isCoolingDown = false;
let matchCount = 0;

function resetGame() {
    flags_reveal = new Array(numObjects).fill(false);
    flags_lock = new Array(numObjects).fill(false);
    seedsUnique = Array.from({ length: Math.ceil(numObjects / 2) }, () => randInt(0, 1000));
    seeds = shuffleArray([seedsUnique, seedsUnique].flat());
    seletedSeed = null;
    selectedIndex = null;
    isCoolingDown = false;  
    matchCount = 0;
    foxGL.reportStatus('MatchCount', `Matched Spheres: ${matchCount}`, 'blue');
}

// console.log(seedsUnique, seeds);

const cubeSystem = [qSlabX, qSlabY, qSlabZ]; // Cube
const hourglassSystem = [qSlabX, qConeX, qGlobal]; // Hourglass
const coneSystem = [qConeX, qxm(qSlabX,mxm(scale(.5,1,1),translate(1,0,0))), qGlobal]; // Real cone
const cylinderSystem = [qTubeX, qSlabX, qGlobal]; // Cylinder
const noseSystem = [qParabX, qSlabX, qGlobal]; // Nose
const sphereSystem = [qSphere, qGlobal, qGlobal]; // Sphere

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

let blipSound = null;
let button1Sound = null;
let button2Sound = null;
let gmanWiseSound = null;
let ambientSound = null;

// Declare listeners.
const onpointermove = async event => {
    const canvasRect = canvas.getBoundingClientRect();
    const canvasHeight = canvasRect.bottom - canvasRect.top;
    const uMouseX = devicePixelRatio*(event.clientX-canvasRect.left);
    const uMouseY = devicePixelRatio*(canvasHeight-(event.clientY-canvasRect.top));
    gl.uniform2f(gl.getUniformLocation(program, 'uMouse'), uMouseX, uMouseY);
    foxGL.reportStatus('uMouse', `uMouse: (${uMouseX.toFixed(1)}, ${uMouseY.toFixed(1)})`);
};

const onpointerenter = async event => {
    ambientSound?.play();
};

const onpointerleave = async event => {
    ambientSound?.pause();
};

const onclick = async event => {
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
            }, 16*coolDownTime);
        }
    }
    foxGL.reportStatus('ClickPos', `Click Position: (${uMouseX.toFixed(1)} [${col}], ${uMouseY.toFixed(1)} [${row}])`);
}

const resizeObserver = new ResizeObserver(entries => {
    gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
    foxGL.reportStatus('uResolution', `uResolution: (${canvas.width.toFixed(1)}, ${canvas.height.toFixed(1)})`);
});

const nearest_sq = n => Math.ceil(Math.sqrt(n));
const numGridSlice = nearest_sq(numObjects);

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
    

    // instances.push(systems[2].flat());
    
    gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uQ'), false, instances.flat());
    gl.uniform1iv(gl.getUniformLocation(program, 'uF'), flags_reveal);
    gl.uniform1iv(gl.getUniformLocation(program, 'uS'), seeds);
    
    // console.log(numObjects);
    
    foxGL.render();
}

// Start lifecycle.
foxGL.onStart(async () => {
    // Set status title.
    foxGL.setStatusTitle('Match The Texture');
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
    
    // Register listeners on start.
    resizeObserver.observe(canvas);
    canvas.addEventListener('pointermove', onpointermove);
    canvas.addEventListener('pointerenter', onpointerenter);
    canvas.addEventListener('pointerleave', onpointerleave);
    canvas.addEventListener('click', onclick);
    animate();
});

// Stop lifecycle.
foxGL.onStop(async () => {
    // Deregister listeners on stop.
    destroyed = true;
    resizeObserver.disconnect();
    canvas.removeEventListener('pointermove', onpointermove);
    canvas.removeEventListener('pointerenter', onpointerenter);
    canvas.removeEventListener('pointerleave', onpointerleave);
    canvas.removeEventListener('click', onclick);
});