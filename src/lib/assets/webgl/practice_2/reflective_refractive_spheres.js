// Author: TapiocaFox
// Title:  Reflective Refractive Spheres

// Init variables.
let gl, program, canvas;
let destroyed = false;
let onpointermove, onpointerleave, onclick, resizeObserver;

const PI = 3.141592653589793;
const NS = 4;
const NL = 3;

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
    
    let enlarge = false;
    
    // Set status title.
    foxGL.setStatusTitle('Reflective Refractive Spheres');
    foxGL.reportStatus('Description', `Click to enlarge the white sphere.`, 'green');
    foxGL.reportStatus('enlarge', `Enlarged: ${enlarge}`, enlarge?'blue':'red');

    foxGL.getAssetById('hl_activated').then(result => activatedSound = result);
    foxGL.getAssetById('hl_deactivated').then(result => deactivatedSound = result);

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
        requestAnimationFrame(animate);
        const uTime = (Date.now() - foxGL.startTime) / 1000;
        const RATIO_TIME = 0.66;
        gl.uniform1f(gl.getUniformLocation(program, 'uTime'), uTime);
        foxGL.reportStatus('uTime', `uTime: ${uTime.toFixed(2)}`);

        const radianRotation = 0.25*PI*Math.sin(RATIO_TIME*uTime);
        
        const sinRot = Math.sin(radianRotation);
        const cosRot = Math.cos(radianRotation);

        const sinThird = Math.sin(2*RATIO_TIME*uTime);
        const cosThird = Math.cos(RATIO_TIME*uTime);
        const sinFourth = Math.sin(2*(RATIO_TIME*uTime-.33*PI));
        const cosFourth = Math.cos(RATIO_TIME*uTime-.33*PI);

        // Spheres.
        const thridSphere = [usePointer?2*(uMouseX/canvas.width)-1:.7*cosThird,
                            usePointer?2*(uMouseY/canvas.height)-1:.7*sinThird,
                            .1,enlarge?.275:.225];
        gl.uniform4fv(gl.getUniformLocation(program, 'uS'), [ 
            [-.4*sinRot,0,-.4*cosRot,.35],
            [.4*sinRot,0,.4*cosRot,.35],
            thridSphere,
            [.7*cosFourth,.7*sinFourth,.1,.225]
        ].flat());
        // Spheres' colors.
        gl.uniform3fv(gl.getUniformLocation(program, 'uC'), [ 
            [1,.5,.5],
            [.65,.65,1.],
            [1,1,1],
            [.5,0.,0.]
        ].flat());
        // Spheres' opacity and eta.
        gl.uniform2fv(gl.getUniformLocation(program, 'uR'), [ 
        [1., 1.],
        [.5, 1.15],
        [1.,1.],
        [1.,1.]
        ].flat());
        // Lights.
        gl.uniform3fv(gl.getUniformLocation(program, 'uL'), [ 
            normalize([1,1,1]),
            normalize([-1,-1,-.5]),
            normalize([0,-1,0])
        ].flat());
        // Lights' colors.
        gl.uniform3fv(gl.getUniformLocation(program, 'uLC'), [
            [.6,.8,1],
            [.2,.15,.1],
            [.5,0,0]
        ].flat());
        foxGL.render();
    }
    
    let usePointer = false;
    let uMouseX = 0;
    let uMouseY = 0;
    
    let activatedSound = null;
    let deactivatedSound = null;
    
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
    
    onclick = async event => {
        enlarge = !enlarge;
        if(enlarge && activatedSound) {
            activatedSound.currentTime = 0;
            activatedSound.play();
        }
        else if(deactivatedSound) {
            deactivatedSound.currentTime = 0;
            deactivatedSound.play();
        }
        foxGL.reportStatus('enlarge', `Enlarged: ${enlarge}`, enlarge?'blue':'red');
    };
    
    onpointerleave = async event => {
        usePointer = false;
    };
    
    resizeObserver = new ResizeObserver(entries => {
        gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
        foxGL.reportStatus('uResolution', `uResolution: (${canvas.width.toFixed(1)}, ${canvas.height.toFixed(1)})`);
    });

    // Register listeners on start.
    resizeObserver.observe(canvas);
    canvas.addEventListener('pointermove', onpointermove);
    canvas.addEventListener('click', onclick);
    canvas.addEventListener('pointerleave', onpointerleave);
    animate();
};

// Stop lifecycle.
export const stop = async (foxGL) => {
    // Deregister listeners on stop.
    destroyed = true;
    if(resizeObserver) resizeObserver.disconnect();
    if(onpointermove) canvas.removeEventListener('pointermove', onpointermove);
    if(onclick) canvas.removeEventListener('click', onclick);
    if(onpointerleave) canvas.removeEventListener('pointerleave', onpointerleave);
};