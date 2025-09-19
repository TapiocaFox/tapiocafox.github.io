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

const gl = foxGL.gl;
const program = foxGL.program;
const canvas = foxGL.canvas;

let destroyed = false;

const onpointermove = async event => {
    const canvasRect = canvas.getBoundingClientRect();
    const canvasHeight = canvasRect.bottom - canvasRect.top;
    const u_mouse_x = devicePixelRatio*(event.clientX-canvasRect.left);
    const u_mouse_y = devicePixelRatio*(canvasHeight-(event.clientY-canvasRect.top));
    gl.uniform2f(gl.getUniformLocation(program, 'u_mouse'), u_mouse_x, u_mouse_y);
    foxGL.reportStatus('u_mouse', `u_mouse: (${u_mouse_x.toFixed(1)}, ${u_mouse_y.toFixed(1)})`);
};

const resizeObserver = new ResizeObserver(entries => {
    gl.uniform2f(gl.getUniformLocation(program, 'u_resolution'), canvas.width, canvas.width);
    foxGL.reportStatus('u_resolution', `u_resolution: (${canvas.width.toFixed(1)}, ${canvas.width.toFixed(1)})`);
});

function animate() {
    if(destroyed) return;
    requestAnimationFrame(animate);
    const u_time = (Date.now() - foxGL.startTime) / 1000;
    gl.uniform1f(gl.getUniformLocation(program, 'u_time'), u_time);
    foxGL.reportStatus('u_time', `u_time: ${u_time.toFixed(2)}`);
    foxGL.render();
}


foxGL.onStart(() => {
    gl.uniform2f(gl.getUniformLocation(program, 'u_resolution'), canvas.width, canvas.width);
    foxGL.reportStatus('u_resolution', `u_resolution: (${canvas.width.toFixed(1)}, ${canvas.width.toFixed(1)})`);
    resizeObserver.observe(canvas);
    canvas.addEventListener('pointermove', onpointermove);
    window.addEventListener('resize', onresize);
    animate();
});

foxGL.onStop(() => {
    destroyed = true;
    resizeObserver.disconnect();
    canvas.removeEventListener('pointermove', onpointermove);
    window.removeEventListener('resize', onresize);
});

// console.log('JavaScript exited.');