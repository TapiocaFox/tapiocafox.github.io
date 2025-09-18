// Author: TapiocaFox
// Title:  Default

// Reference to tapiocaFoxGL:
// interface TapiocaFoxGL {
//     gl: WebGL2RenderingContext,
//     canvas: HTMLCanvasElement,
//     program: WebGLProgram,
//     startTime: number,
//     lastRenderTime: number,
//     devicePixelRatio: number,
//     animate: (() => void) | null,
//     start: (() => void) | null,
//     stop: (() => void) | null,
//     onStart: (start: () => void) => void,
//     onStop: (stop: () => void) => void,
//     initViewPort: () => void,
//     initProgram: (vertexShader: string, fragmentShader: string) => void,
//     newProgram: () => void,
//     render: () => void
// }

// console.log('JavaScript entered.');

const gl = tapiocaFoxGL.gl;
const program = tapiocaFoxGL.program;
const canvas = tapiocaFoxGL.canvas;

let destroyed = false;

const onpointermove = async event => {
    const canvasRect = canvas.getBoundingClientRect();
    const canvasHeight = canvasRect.bottom - canvasRect.top;
    const u_mouse_x = devicePixelRatio*(event.clientX-canvasRect.left);
    const u_mouse_y = devicePixelRatio*(canvasHeight-(event.clientY-canvasRect.top));
    gl.uniform2f(gl.getUniformLocation(program, 'u_mouse'), u_mouse_x, u_mouse_y);
};

const onresize = async event => {
    gl.uniform2f(gl.getUniformLocation(program, 'u_resolution'), canvas.width, canvas.width);
};

function animate() {
    if(destroyed) return;
    requestAnimationFrame(animate);
    const u_time = (Date.now() - tapiocaFoxGL.startTime) / 1000;
    gl.uniform1f(gl.getUniformLocation(program, 'u_time'), u_time);
    tapiocaFoxGL.render();
}


tapiocaFoxGL.onStart(() => {
    gl.uniform2f(gl.getUniformLocation(program, 'u_resolution'), canvas.width, canvas.width);
    canvas.addEventListener('pointermove', onpointermove);
    window.addEventListener('resize', onresize);
    animate();
});

tapiocaFoxGL.onStop(() => {
    destroyed = true;
    canvas.removeEventListener('pointermove', onpointermove);
    window.removeEventListener('resize', onresize);
});

// console.log('JavaScript exited.');