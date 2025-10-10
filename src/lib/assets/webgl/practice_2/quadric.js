// Author: TapiocaFox
// Title:  Quadric Surface

// Init variables.
const gl = foxGL.gl;
const program = foxGL.program;
const canvas = foxGL.canvas;

let destroyed = false;

const qSphere = [1,0,0,0,
                 0,1,0,0,
                 0,0,1,0,
                 0,0,0,-.25];

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
                0,0,0,-.25];

const qTubeY = [1,0,0,0,
                0,0,0,0,
                0,0,1,0,
                0,0,0,-.25];

const qTubeZ = [1,0,0,0,
                0,1,0,0,
                0,0,0,0,
                0,0,0,-.25];

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
let mxm = (a,b) => {
   let m = [];
   for (let c = 0 ; c < 16 ; c += 4)
       for (let r = 0 ; r < 4 ; r++)
          m.push(a[r]*b[c]+a[r+4]*b[c+1]+a[r+8]*b[c+2]+a[r+12]*b[c+3]);
   return m;
}

let transpose = m => [ m[0],m[4],m[ 8],m[12],
                       m[1],m[5],m[ 9],m[13],
                       m[2],m[6],m[10],m[14],
                       m[3],m[7],m[11],m[15] ];

let inverse = src => {
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

let qxm = (Q,M) => {
   let MI = inverse(M);
   return mxm(transpose(MI), mxm(Q, MI));
}

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

// Render per animation frame.
function animate() {
    if(destroyed) return;
    requestAnimationFrame(animate);
    const uTime = (Date.now() - foxGL.startTime) / 1000;
    gl.uniform1f(gl.getUniformLocation(program, 'uTime'), uTime);
    foxGL.reportStatus('uTime', `uTime: ${uTime.toFixed(2)}`);

    // const sinValue = Math.sin(2*uTime);
    const cosScale = Math.cos(2*uTime);
    const scaleSize = 0.05;
    const breath = 1+scaleSize*cosScale;

    const sinTranslation = Math.sin(uTime);
    const cosTranslation = Math.cos(.5*uTime);
    const translationScale = .25;
    const translateX = translationScale*cosTranslation;
    const translateY = translationScale*sinTranslation;
    
    const finalQ = qxm(qSphere, mxm(translate(translateX,translateY,0),scale(breath,breath,breath)));
    // const finalQ = qxm(qSphere, translate(0,0,0));
    gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uQ'), false, finalQ);
    
    foxGL.render();
}

// Start lifecycle.
foxGL.onStart(async () => {
    // Set status title.
    foxGL.setStatusTitle('Quadric Surface');

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