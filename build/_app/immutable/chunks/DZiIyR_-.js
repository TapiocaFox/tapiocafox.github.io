const n=`// Author: TapiocaFox
// Title:  Alien Disco Sling

import { scale, perspective, lookAt, translate, inverse, mxm, Matrix } from 'matrix';
import { cube, sphere, octachedron, transformMeshData } from 'mesh';
import { Engine, newBody, substepUpdate, defaultMaxSubstep, spring1D } from 'physics';
import { multiply, norm, mix } from 'geometry';
import { getAudioBufferByAssetId } from 'utils';
import { smoothstep } from 'procedural';

// Init variables.
let gl, program, canvas;
let destroyed = false;
let onpointermove, onpointerenter, onpointerleave, onmousedown, onmouseup, resizeObserver;
let audioCtx = new AudioContext();
const gainNode = audioCtx.createGain();

const vertexSize = 6;
const cubeSize = .5;
const timeFactor = 8;
const seizureFactor = .25;
const spinFactor = .1;
const starNum = 32;
const starSize = .25;
const starZFactor = .7;
const backgroundColor = [47/256, 107/256, 208/256];
const firstStarColor = [70/256, 56/256, 109/256];
const secondStarColor = [250/256, 207/256, 79/256];
const thirdStarColor = [256/256, 230/256, 80/256];
const zFreq = 8;

const myStar = {
    triangle_strip: true,
    data: transformMeshData(new Float32Array(sphere(12,8)), scale(.5 * starSize, .5 * starSize, .5 * starSize), vertexSize)
};

const mySecondStar = {
    triangle_strip: false,
    data: transformMeshData(new Float32Array(octachedron()), scale(.5 * starSize, .5 * starSize, .5 * starSize), vertexSize)
};

const myCube = {
    triangle_strip: false,
    data: transformMeshData(new Float32Array(cube()), scale(.5 * cubeSize, .5 * cubeSize, .5 * cubeSize), vertexSize)
};

const matrix = new Matrix();

export const playAudioBufferWithGain = async (audioCtx, audioBuffer, offset = 0, loop = false) => {
    const src = audioCtx.createBufferSource();
    src.buffer = audioBuffer;
    src.loop = loop;
    src.connect(gainNode);
    src.start(audioCtx.currentTime + offset);
    gainNode.connect(audioCtx.destination);
};

export const title = 'Alien Disco Sling 🪩 🏹';
export const description = 'Drag to make it spooky!';

// Start lifecycle.
export const start = async (foxGL) => {
    gl = foxGL.gl;
    program = foxGL.program;
    canvas = foxGL.canvas;

    foxGL.reportStatus('Tips', 'Drag to make it spooky!', 'green');
    foxGL.reportStatus('emotional', \`Emotional High: unknown\`, 'black');

    let pointerentered = false;
    const ambientAudioBuffer = await getAudioBufferByAssetId(foxGL, audioCtx, 'ambient');
    if(!pointerentered) audioCtx.suspend();
    await playAudioBufferWithGain(audioCtx, ambientAudioBuffer, 0, true);
    
    let mouseNDC = [0, 0];
    let mouseDown = false;
    let uTime = 0;
    const getAnchorAtIndex = (i, uTime) => {
        return [.8*Math.sin(i*slice-spinFactor*uTime), .8*Math.cos(i*slice-spinFactor*uTime), starZFactor*Math.cos(zFreq*i*slice)];
    };
    const engine = new Engine(function() {
        substepUpdate((deltaTime, remainTime)=> {
            const realUTime = uTime-remainTime/1000;
            let i = 0;
            this.bodies.forEach(body => {
                // body.anchor = [Math.sin(uTime), Math.cos(uTime),0]
                if(!mouseDown) {
                    const springX = spring1D({ mass: .1*Math.sin(uTime)+1, damping: .75, position: body.position[0], velocity: body.velocity[0], force:body.anchor[0], deltaTime});
                    body.position[0] = springX.position;
                    body.velocity[0] = springX.velocity;
                    const springY = spring1D({ mass: .1*Math.sin(3*uTime)+1, damping: .75, position: body.position[1], velocity: body.velocity[1], force:body.anchor[1], deltaTime});
                    body.position[1] = springY.position;
                    body.velocity[1] = springY.velocity;
                    const springZ = spring1D({ mass: .1*Math.sin(5*uTime)+1, damping: .5, position: body.position[2], velocity: body.velocity[2], force:body.anchor[2], deltaTime});
                    body.position[2] = springZ.position;
                    body.velocity[2] = springZ.velocity;
                }
                if(body.type=='cube') {
                    body.color = [207/256, 60/256, 61/256];
                    const vel = norm(body.velocity);
                    foxGL.reportStatus('emotional', \`Emotional High: \${vel.toFixed(4)} 🤓☝️\`, 'black');
                    gainNode.gain.value = Math.min(8*vel + 0.25, 1);
                }
                else {
                    body.scale = .5*Math.sin(timeFactor*realUTime+i)+.75;
                    const realSecondStarColor = mix(secondStarColor,thirdStarColor,smoothstep(0, -1, body.position[2]));

                    body.color = mix(firstStarColor,realSecondStarColor,Math.sin(timeFactor*realUTime+i));
                    
                    body.anchor = getAnchorAtIndex(i, realUTime);
                }
                i++;
            });
        }, this.deltaTime, defaultMaxSubstep);
    });
    const cubeBody = {...newBody(), anchor:[0,0,-.25], mesh: myCube, color: [0,0,0], type:'cube'};
    engine.bodies.push(cubeBody);
    
    const slice = 2*Math.PI/starNum;
    const starBodies = [];
    for(let i=0; i<starNum; i++) {
        const body = {...newBody(), scale: 1, anchor: getAnchorAtIndex(i, uTime), position: getAnchorAtIndex(i, uTime), mesh: (i%3==1)?myStar:mySecondStar, color: (i%4==1)?firstStarColor:secondStarColor, type:'other'};
        starBodies.push(body);
        engine.bodies.push(body);
    }

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
        const m = matrix.get();
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uModel'), false, m);
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uView'), false, inverse(lookAt([0,0,2.5], multiply(seizureFactor, cubeBody.position))));
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uProjection'), false, perspective(Math.PI/4, canvas.width/canvas.height, 0.1, 100));
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uNormal'), false, inverse(m));
        gl.bufferData(gl.ARRAY_BUFFER, mesh.data, gl.STATIC_DRAW);
        gl.drawArrays(mesh.triangle_strip ? gl.TRIANGLE_STRIP : gl.TRIANGLES, 0, mesh.data.length / vertexSize);
    };

    vertexAttribute('aPos', 3, 0);
    vertexAttribute('aNor', 3, 3);

    // Initial uniform values.
    gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
    foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);

    // Render per animation frame.
    function animate() {
        if (destroyed) return;
        requestAnimationFrame(animate);
        engine.tick();
        gl.clearColor(...backgroundColor, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        uTime = (Date.now() - foxGL.startTime) / 1000;
        gl.uniform1f(gl.getUniformLocation(program, 'uTime'), uTime);
        foxGL.reportStatus('uTime', \`uTime: \${uTime.toFixed(2)}\`);
    
        engine.bodies.forEach((body) => {
            matrix.identity()
            matrix.translate(...body.position);
            if(body.type=='cube') {
                matrix.rotateX(uTime);
                matrix.rotateY(uTime);
            }
            else {
                matrix.scale(body.scale,body.scale,body.scale);
            }
            drawMesh(body.mesh, body.color);
        });
        
        foxGL.reportFrame();
    }

    // Declare listeners.
    onpointermove = async event => {
        const canvasRect = canvas.getBoundingClientRect();
        const canvasHeight = canvasRect.bottom - canvasRect.top;
        const uMouseX = devicePixelRatio * (event.clientX - canvasRect.left);
        const uMouseY = devicePixelRatio * (canvasHeight - (event.clientY - canvasRect.top));
        mouseNDC[0] = 2 * (uMouseX / canvas.width) - 1;
        mouseNDC[1] = 2 * (uMouseY / canvas.height) - 1;
        if(mouseDown) {
            cubeBody.position = [...mouseNDC, .5*norm(mouseNDC, [0,0])];
            cubeBody.velocity = [0,0,0];

            starBodies.forEach((body) => {
                body.position = [body.position[0], body.position[1], -1.5*norm(mouseNDC, [0,0])];
                body.velocity = [0,0,0];
            });
        }
        gl.uniform2f(gl.getUniformLocation(program, 'uMouse'), uMouseX, uMouseY);
        foxGL.reportStatus('uMouse', \`uMouse: (\${uMouseX.toFixed(1)}, \${uMouseY.toFixed(1)})\`);
    };

    onpointerenter = async event => {
        mouseDown = false;
        pointerentered = true;
        await audioCtx.resume();
    };

    onpointerleave = async event => {
        mouseDown = false;
        pointerentered = false;
        await audioCtx.suspend();
    };

    onmousedown = async event => {
        mouseDown = true;
        await audioCtx.resume();
    };

    onmouseup = async event => {
        mouseDown = false;
    };

    resizeObserver = new ResizeObserver(entries => {
        gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
        foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);
    });

    // Register listeners on start.
    canvas.addEventListener('pointermove', onpointermove);
    canvas.addEventListener('pointerenter', onpointerenter);
    canvas.addEventListener('pointerleave', onpointerleave);
    canvas.addEventListener('mousedown', onmousedown);
    canvas.addEventListener('mouseup', onmouseup);
    resizeObserver.observe(canvas);
    animate();
};

// Stop lifecycle.
export const stop = async (foxGL) => {
    // Deregister listeners on stop.
    destroyed = true;
    audioCtx.close();
    if (onpointermove) canvas.removeEventListener('pointermove', onpointermove);
    if (onpointerleave) canvas.removeEventListener('pointerenter', onpointerenter);
    if (onpointerleave) canvas.removeEventListener('pointerleave', onpointerleave);
    if (onmousedown) canvas.removeEventListener('mousedown', onmousedown);
    if (onmouseup) canvas.removeEventListener('mouseup', onmouseup);
    if (resizeObserver) resizeObserver.disconnect();
};`,e=""+new URL("../assets/alien_squit.BLiQgJEr.wav",import.meta.url).href;export{e as h,n as s};
