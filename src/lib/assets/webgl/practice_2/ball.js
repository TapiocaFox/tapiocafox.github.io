// Author: TapiocaFox
// Title:  Default

// Reference to foxGL (Only exposed APIs):
// export interface TapiocaFoxGLContext {
//     gl: WebGL2RenderingContext,
//     canvas: HTMLCanvasElement,
//     program: WebGLProgram,
//     startTime: number,
//     lastRenderTime: number,
//     devicePixelRatio: number,
//     onStart: (start: () => void) => void,
//     onStop: (stop: () => void) => void,
//     render: () => void,
//     reportStatus: (key: string, status: string) => void,
// }

// console.log('JavaScript entered.');

// Init variables.
const gl = foxGL.gl;
const program = foxGL.program;
const canvas = foxGL.canvas;
let destroyed = false;

// Declare listeners.
const onpointermove = async event => {
    const canvasRect = canvas.getBoundingClientRect();
    const canvasHeight = canvasRect.bottom - canvasRect.top;
    const uMouse_x = devicePixelRatio*(event.clientX-canvasRect.left);
    const uMouse_y = devicePixelRatio*(canvasHeight-(event.clientY-canvasRect.top));
    gl.uniform2f(gl.getUniformLocation(program, 'uMouse'), uMouse_x, uMouse_y);
    foxGL.reportStatus('uMouse', `uMouse: (${uMouse_x.toFixed(1)}, ${uMouse_y.toFixed(1)})`);
};

const resizeObserver = new ResizeObserver(entries => {
    gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.width);
    foxGL.reportStatus('uResolution', `uResolution: (${canvas.width.toFixed(1)}, ${canvas.width.toFixed(1)})`);
});

// Render per animation frame.
function animate() {
    if(destroyed) return;
    requestAnimationFrame(animate);
    const uTime = (Date.now() - foxGL.startTime) / 1000;
    gl.uniform1f(gl.getUniformLocation(program, 'uTime'), uTime);
    let s = Math.sin(uTime);
    gl.uniform4fv(gl.getUniformLocation(program, 'uS'), [ -.3*s,0,0,.4,
                          .3*s,0,.3,.4 ]);
    gl.uniform3fv(gl.getUniformLocation(program, 'uC'), [ 1,.5,.5,
                         .5,.7,1 ]);
    foxGL.reportStatus('uTime', `uTime: ${uTime.toFixed(2)}`);
    foxGL.render();
}

// Register listeners on start.
foxGL.onStart(async () => {
    gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.width);
    gl.uniform3f(gl.getUniformLocation(program, 'uViewPoint'), 0, 0, 1);
    foxGL.reportStatus('uResolution', `uResolution: (${canvas.width.toFixed(1)}, ${canvas.width.toFixed(1)})`);
    resizeObserver.observe(canvas);
    canvas.addEventListener('pointermove', onpointermove);
    window.addEventListener('resize', onresize);
    animate();
});

// Deregister listeners on stop.
foxGL.onStop(async () => {
    destroyed = true;
    resizeObserver.disconnect();
    canvas.removeEventListener('pointermove', onpointermove);
    window.removeEventListener('resize', onresize);
});

// console.log('JavaScript exited.');