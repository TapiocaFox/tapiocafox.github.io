// Author: TapiocaFox
// Title:  Colored Mesh

import { scale, perspective, inverse, mxm, Matrix } from 'matrix';
import { cube, transformMeshData } from 'mesh';

// Init variables.
let gl, program, canvas;
let destroyed = false;
let onpointermove, onmousedown, onmouseup, resizeObserver;

const vertexSize = 6;
const cubeSize = .5;
const backgroundColor = [0,0,0];
const myCube = {
    triangle_strip: false,
    data: transformMeshData(new Float32Array(cube()),scale( .5*cubeSize, .5*cubeSize, .5*cubeSize),vertexSize)
};

const matrix = new Matrix();

// Start lifecycle.
export const start = async (foxGL) => {
    gl = foxGL.gl;
    program = foxGL.program;
    canvas = foxGL.canvas;
    
    let mouseNDC = [0, 0];
    
    // Set status title.
    foxGL.setStatusTitle('Colored Mesh (Cube)');

    // Setup vertex buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    const vertexAttribute = (name, size, position) => {
        const attr = gl.getAttribLocation(program, name);
        gl.enableVertexAttribArray(attr);
        gl.vertexAttribPointer(attr, size, gl.FLOAT, false, vertexSize * 4, position * 4);
    };

    const drawMesh = (mesh, color) => {
        gl.uniform3fv(gl.getUniformLocation(program, 'uColor'), color);
        let m = mxm(perspective(0,0,-.1), matrix.get());
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uMF'), false, m);
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uMI'), false, inverse(m));
        gl.bufferData(gl.ARRAY_BUFFER, mesh.data, gl.STATIC_DRAW);
        gl.drawArrays(mesh.triangle_strip ? gl.TRIANGLE_STRIP : gl.TRIANGLES, 0, mesh.data.length / vertexSize);
    };

    vertexAttribute('aPos', 3, 0);
    vertexAttribute('aNor', 3, 3);

    // Initial uniform values.
    gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
    foxGL.reportStatus('uResolution', `uResolution: (${canvas.width.toFixed(1)}, ${canvas.height.toFixed(1)})`);

    // Render per animation frame.
    function animate() {
        if(destroyed) return;
        requestAnimationFrame(animate);
        gl.clearColor(backgroundColor[0], backgroundColor[1], backgroundColor[2], 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        const uTime = (Date.now() - foxGL.startTime) / 1000;
        gl.uniform1f(gl.getUniformLocation(program, 'uTime'), uTime);
        foxGL.reportStatus('uTime', `uTime: ${uTime.toFixed(2)}`);
        matrix.identity()
        matrix.translate(...mouseNDC, 0);
        matrix.rotateX(uTime);
        matrix.rotateY(uTime);
        drawMesh(myCube, [1, 1, 1]);
        foxGL.render();
    }

    // Declare listeners.
    onpointermove = async event => {
        const canvasRect = canvas.getBoundingClientRect();
        const canvasHeight = canvasRect.bottom - canvasRect.top;
        const uMouseX = devicePixelRatio*(event.clientX-canvasRect.left);
        const uMouseY = devicePixelRatio*(canvasHeight-(event.clientY-canvasRect.top));
        mouseNDC[0] = 2*(uMouseX/canvas.width)-1;
        mouseNDC[1] = 2*(uMouseY/canvas.height)-1;
        gl.uniform2f(gl.getUniformLocation(program, 'uMouse'), uMouseX, uMouseY);
        foxGL.reportStatus('uMouse', `uMouse: (${uMouseX.toFixed(1)}, ${uMouseY.toFixed(1)})`);
    };

    resizeObserver = new ResizeObserver(entries => {
        gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
        foxGL.reportStatus('uResolution', `uResolution: (${canvas.width.toFixed(1)}, ${canvas.height.toFixed(1)})`);
    });

    // Register listeners on start.
    canvas.addEventListener('pointermove', onpointermove);
    resizeObserver.observe(canvas);
    animate();
};

// Stop lifecycle.
export const stop = async (foxGL) => {
    // Deregister listeners on stop.
    destroyed = true;
    if(onpointermove) canvas.removeEventListener('pointermove', onpointermove);
    if(resizeObserver) resizeObserver.disconnect();
};