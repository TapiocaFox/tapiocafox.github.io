// Author: TapiocaFox
// Title:  Default

const gl = tapiocaFoxGL;
const canvas = tapiocaFoxGL.canvas;

gl.initViewPort();
gl.initProgram(vertex_shader, fragment_shader);

function animate() {
    requestAnimationFrame(animate);
    const u_time = Date.now() - gl.startTime / 1000;
    gl.uniform1f(gl.getUniformLocation(gl.program, 'u_time'), u_time);
    gl.render();
}

canvas.addEventListener('pointermove', async event => {
    const canvasRect = canvas.getBoundingClientRect();
    const canvasHeight = canvasRect.bottom - canvasRect.top;
    const u_mouse_x = devicePixelRatio*(event.clientX-canvasRect.left);
    const u_mouse_y = devicePixelRatio*(canvasHeight-(event.clientY-canvasRect.top));
    gl.uniform2f(gl.getUniformLocation(gl.program, 'u_mouse'), u_mouse_x, u_mouse_y);
});

gl.uniform2f(gl.getUniformLocation(gl.program, 'u_resolution'), canvas.width, canvas.width);
window.addEventListener('resize', async event => {
    gl.uniform2f(gl.getUniformLocation(gl.program, 'u_resolution'), canvas.width, canvas.width);
});