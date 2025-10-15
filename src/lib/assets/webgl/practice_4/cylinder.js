// Author: TapiocaFox
// Title:  Cylinder

import { Matrix, translate, inverse, perspective, mxm, rotateX, rotateY, scale } from 'matrix';
import { tube, torus, disk, sphere, cube, glueMeshes, transformMeshData } from 'mesh';
import { triangleAnglesFromSides, distance } from 'geometry';

// Init variables.
let gl, program, canvas;
let destroyed = false;
let onpointermove, resizeObserver;

const cylinderColor = [166/256, 87/255, 91/255];
const backgroundColor = [54/256, 44/255, 97/255];

const vertexSize = 6;

const upperarmSize =.5;
const forarmSize =.6;
const anchorXY = [0,0];

const myTube = {
    triangle_strip: true,
    data: new Float32Array(tube(20))
};
const myTCap = {
    triangle_strip: true,
    data: new Float32Array(transformMeshData(disk(20), translate(0,0,1), vertexSize))
};
const myBCap = {
    triangle_strip: true,
    data: new Float32Array(transformMeshData(disk(20), mxm(translate(0,0,-1), rotateX(Math.PI)), vertexSize))
};
const myShpere = {
    triangle_strip: true,
    data: new Float32Array(transformMeshData(sphere(12, 8), translate(0,1,0), vertexSize))
};
const myCube = {
    triangle_strip: false,
    data: new Float32Array(cube())
}

const matrix = new Matrix();
const myCylinder = glueMeshes(glueMeshes(myTube, myTCap, vertexSize), myBCap, vertexSize);
myCylinder.data = transformMeshData(transformMeshData(myCylinder.data, rotateX(.5*Math.PI),vertexSize),scale(.4, .4, .4),vertexSize);

// Start lifecycle.
export const start = async (foxGL) => {
    gl = foxGL.gl;
    program = foxGL.program;
    canvas = foxGL.canvas;
    
    let mouseNDC = [0, 0];

    let anchorToHandDistance = Math.max(upperarmSize, forarmSize);
    let armAngles = triangleAnglesFromSides(forarmSize, anchorToHandDistance, upperarmSize);

    // Set status title.
    foxGL.setStatusTitle('Cylinder');

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
        gl.uniform3fv(gl.getUniformLocation(program, 'uColor'), cylinderColor);
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
        matrix.identity().translate(...mouseNDC, 0).rotateX(uTime);
        // matrix.identity().translate(mouseXNDC, mouseYNDC, 0);
        // matrix.scale(.4, .4, .4);
        // matrix.rotateY(uTime);
        drawMesh(myCylinder, [1,0,0]);
        // drawMesh(myShpere, [1,0,0]);
        // drawMesh(myShpere, [1,0,0]);
        matrix.pop();
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
        
        anchorToHandDistance = distance(mouseNDC, anchorXY);
        foxGL.reportStatus('anchorToHandDistance', `anchorToHandDistance: ${anchorToHandDistance.toFixed(1)}`);
        armAngles = triangleAnglesFromSides(forarmSize, anchorToHandDistance, upperarmSize);
        foxGL.reportStatus('armAngles', `armAngles: (${armAngles[0].toFixed(1)}, ${armAngles[1].toFixed(1)}, ${armAngles[2].toFixed(1)})`);
        
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