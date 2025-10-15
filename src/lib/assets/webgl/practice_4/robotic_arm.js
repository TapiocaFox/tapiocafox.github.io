// Author: TapiocaFox
// Title:  Robotic Arm

import { Matrix, translate, inverse, perspective, mxm, rotateX, rotateY, rotateZ, scale } from 'matrix';
import { tube, torus, disk, sphere, cube, octachedron, glueMeshes, transformMeshData } from 'mesh';
import { triangleAnglesFromSides, distance } from 'geometry';

// Init variables.
let gl, program, canvas;
let destroyed = false;
let onpointermove, onmousedown, onmouseup, resizeObserver;

let lightswitch2Sound = null;
let button7Sound = null;
let button9Sound = null;

const armsColor = [60/256, 61/256, 83/256];
const shoulderColor = [122/256, 36/256, 56/256];
const jointColor = [207/256, 47/256, 63/256];
const handColor = [1, 1, 1];
const backgroundColor = [54/256, 89/256, 127/256];
const octachedronColor = [171/256, 175/256, 187/256];
const octachedronActiveColor = [256/256, 256/256, 256/256];

const vertexSize = 6;

const upperarmLength =.66;
const upperarmWidth =.1;
const forearmLength =.9;
const forearmWidth =.1;
const shoulderNDC = [0,.25];
const jointSize = .175;
const octahedronSize = .3;
const octahedronHitboxRadius= octahedronSize+.05;
const octahedronSizeNum = 6; 

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
const myJoint = {
    triangle_strip: true,
    data: new Float32Array(transformMeshData(sphere(12, 8), scale(.5*jointSize, .5*jointSize, .5*jointSize), vertexSize))
};

const myCylinder = glueMeshes(glueMeshes(myTube, myTCap, vertexSize), myBCap, vertexSize);
transformMeshData(myCylinder.data, mxm(mxm(rotateX(.5*Math.PI), rotateY(.5*Math.PI)), translate(0,0,1)), vertexSize);

const upperarmMesh = {
    triangle_strip: myCylinder.triangle_strip,
    data: transformMeshData(new Float32Array(myCylinder.data),scale( .5*upperarmLength, .5*upperarmWidth, .5*upperarmWidth),vertexSize)
}

const forearmMesh = {
    triangle_strip: myCylinder.triangle_strip,
    data: transformMeshData(new Float32Array(myCylinder.data),scale(.5*forearmLength, .5*forearmWidth, .5*forearmWidth),vertexSize)
}

const myOctahedron = {
    triangle_strip: false,
    data: transformMeshData(new Float32Array(octachedron()),scale( .5*octahedronSize, .5*octahedronSize, .5*octahedronSize),vertexSize)
};

const matrix = new Matrix();

// Start lifecycle.
export const start = async (foxGL) => {
    gl = foxGL.gl;
    program = foxGL.program;
    canvas = foxGL.canvas;

    foxGL.getAssetById('hl_lightswitch2').then(result => lightswitch2Sound = result);
    foxGL.getAssetById('hl_button7').then(result => button7Sound = result);
    foxGL.getAssetById('hl_button9').then(result => button9Sound = result);
    
    let mouseNDC = [0, 0];
    let mouseDown = false;
    let drag = false;
    const max=.9, min=-.9;
    const octahedronNDCList = [];
    let selectedOctahedron = 0;

    for(let i=0; i<octahedronSizeNum; i++) {
        octahedronNDCList.push([Math.random() * (max - min) + min, Math.random() * (max - min) + min]);
    };
    
    let shoulderToHandDistance = Math.max(upperarmLength, forearmLength);
    let shoulderToHandAngle = 0;
    let armAngles = triangleAnglesFromSides(forearmLength, shoulderToHandDistance, upperarmLength);

    // Set status title.
    foxGL.setStatusTitle('Robotic Arm');
    foxGL.reportStatus('Tips', 'Mouse down to drag the octahedron around.', 'green');

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
        // matrix.identity().translate(...mouseNDC, 0).rotateX(uTime);
        // matrix.identity().translate(...mouseNDC, 0);
        const flip = mouseNDC[0]<shoulderNDC[0];
        matrix.identity()
        matrix.translate(...shoulderNDC, 0);
        matrix.rotateZ(shoulderToHandAngle);
        matrix.rotateZ(!flip?armAngles[0]:-armAngles[0]);
        drawMesh(myJoint, shoulderColor);
        drawMesh(upperarmMesh, armsColor);
        // Next Joint.
        matrix.translate(upperarmLength, 0, 0);
        drawMesh(myJoint, jointColor);
        matrix.rotateZ(!flip?-(Math.PI-armAngles[1]):(Math.PI-armAngles[1]));
        drawMesh(forearmMesh, armsColor);
        // Next Joint.
        matrix.translate(forearmLength, 0, 0);
        drawMesh(myJoint, handColor);
        // Octahedron.
        for(const [i, octahedronNDC] of octahedronNDCList.entries()) {
            // foxGL.reportStatus('octahedronNDC',`octahedronNDC: ${octahedronNDCList[0]}`);
            matrix.identity();
            matrix.translate(...octahedronNDC,0).rotateY(uTime);
            drawMesh(myOctahedron, (selectedOctahedron==i)?octachedronActiveColor:octachedronColor);
        }
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
        const relativeNDC = [mouseNDC[0]-shoulderNDC[0], mouseNDC[1]-shoulderNDC[1]];
        shoulderToHandAngle = (relativeNDC[0]>=0)?Math.atan(relativeNDC[1]/relativeNDC[0]):Math.atan(relativeNDC[1]/relativeNDC[0])+Math.PI;
        foxGL.reportStatus('shoulderToHandAngle', `shoulderToHandAngle: ${shoulderToHandAngle.toFixed(1)}`);
        shoulderToHandDistance = distance(mouseNDC, shoulderNDC);
        foxGL.reportStatus('shoulderToHandDistance', `shoulderToHandDistance: ${shoulderToHandDistance.toFixed(1)}`);
        armAngles = triangleAnglesFromSides(forearmLength, shoulderToHandDistance, upperarmLength);
        foxGL.reportStatus('armAngles', `armAngles: (${armAngles[0].toFixed(1)}, ${armAngles[1].toFixed(1)}, ${armAngles[2].toFixed(1)})`);
        if(drag) {
            octahedronNDCList[selectedOctahedron][0] = mouseNDC[0];
            octahedronNDCList[selectedOctahedron][1] = mouseNDC[1];
        }
    };

    onmousedown = async event => {
        mouseDown = true;
        const canvasRect = canvas.getBoundingClientRect();
        const canvasHeight = canvasRect.bottom - canvasRect.top;
        const mouseX = devicePixelRatio*(event.clientX-canvasRect.left);
        const mouseY = devicePixelRatio*(canvasHeight-(event.clientY-canvasRect.top));
        mouseNDC[0] = 2*(mouseX/canvas.width)-1;
        mouseNDC[1] = 2*(mouseY/canvas.height)-1;
        for(const [i, octahedronNDC] of octahedronNDCList.entries()) {
            drag = distance(octahedronNDC, mouseNDC)<octahedronHitboxRadius;
            foxGL.reportStatus('mouse', `Mouse: down, drag: ${drag}`);
            if(drag) {
                selectedOctahedron = i;
                button9Sound.currentTime = 0;
                button9Sound?.play();
                break;
            }
        }
        if(!drag) {
            button7Sound.currentTime = 0;
            button7Sound?.play(); 
        }
    }

    onmouseup = async event => {
        mouseDown = false;
        if(drag) {
            lightswitch2Sound.currentTime = 0;
            lightswitch2Sound?.play();
        }
        drag = false;
        foxGL.reportStatus('mouse', `Mouse: up`);
    }
    
    resizeObserver = new ResizeObserver(entries => {
        gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
        foxGL.reportStatus('uResolution', `uResolution: (${canvas.width.toFixed(1)}, ${canvas.height.toFixed(1)})`);
    });

    // Register listeners on start.
    canvas.addEventListener('pointermove', onpointermove);
    canvas.addEventListener('mousedown', onmousedown);
    canvas.addEventListener('mouseup', onmouseup);
    resizeObserver.observe(canvas);
    animate();
};

// Stop lifecycle.
export const stop = async (foxGL) => {
    // Deregister listeners on stop.
    destroyed = true;
    if(onpointermove) canvas.removeEventListener('pointermove', onpointermove);
    if(onmousedown) canvas.removeEventListener('mousedown', onmousedown);
    if(onmouseup) canvas.removeEventListener('mouseup', onmouseup);
    if(resizeObserver) resizeObserver.disconnect();
};