import"../chunks/DsnmJJEf.js";import{p as on,aH as rn,f as T,e as y,a as f,b as sn,s as r,k as an,i as n,j as cn,aA as S,c as i,r as t,g as F,t as ln}from"../chunks/DuvEInI2.js";import{s as N}from"../chunks/7z5teZwa.js";import{i as A}from"../chunks/CjISyPlu.js";import{e as B,i as O}from"../chunks/C1OkaSYx.js";import{C as un}from"../chunks/KNxH3l1H.js";import{H as vn}from"../chunks/Db9z64qk.js";import{e as U,T as m,d,a as fn,b as mn}from"../chunks/CgBDuFmR.js";import{m as W}from"../chunks/8p4Ra2kK.js";import{a as dn,b as gn,r as xn,h as pn,d as hn,l as yn,c as Sn}from"../chunks/CI8_SGFQ.js";import{g as _n}from"../chunks/D1DyQkuW.js";const _=`// Author: TapiocaFox
// Title:  Frame Skip Renderer

// Init variables.
const gl = foxGL.gl;
const program = foxGL.program;
const canvas = foxGL.canvas;

const frameSkip = 3;
const frameSkipSkip = 5;

let destroyed = false;
let firstFrameRendered = false;
let frameCount = 0;
let skippedFrameCount = 0;
let doNotSkip = false;

// Declare listeners.
const onpointermove = async event => {
    const canvasRect = canvas.getBoundingClientRect();
    const canvasHeight = canvasRect.bottom - canvasRect.top;
    const uMouseX = devicePixelRatio*(event.clientX-canvasRect.left);
    const uMouseY = devicePixelRatio*(canvasHeight-(event.clientY-canvasRect.top));
    gl.uniform2f(gl.getUniformLocation(program, 'uMouse'), uMouseX, uMouseY);
    foxGL.reportStatus('uMouse', \`uMouse: (\${uMouseX.toFixed(1)}, \${uMouseY.toFixed(1)})\`);
    doNotSkip = true;
};

const onpointerleave = async event => {
    doNotSkip = false;
};

const resizeObserver = new ResizeObserver(entries => {
    gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
    foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);
    firstFrameRendered = false;
    animate();
});

// Render per animation frame.
function animate() {
    if(destroyed) return;
    requestAnimationFrame(animate);
    frameCount++;
    if(!doNotSkip && firstFrameRendered && frameCount%frameSkip!=0) {
        skippedFrameCount++;
        if(skippedFrameCount%frameSkipSkip==0) return;
    }
    const uTime = (Date.now() - foxGL.startTime) / 1000;
    gl.uniform1f(gl.getUniformLocation(program, 'uTime'), uTime);
    foxGL.reportStatus('uTime', \`uTime: \${uTime.toFixed(2)}\`);
    foxGL.render();
    firstFrameRendered = true;
}

// Start lifecycle.
foxGL.onStart(async () => {
    // Set status title.
    foxGL.setStatusTitle('Frame Skip Renderer');

    // Setup vertex buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,0, 1,1,0, -1,-1,0, 1,-1,0, -1,-1,0, 1,1,0]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

    // Initial uniform values.
    gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
    foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);
    
    // Register listeners on start.
    resizeObserver.observe(canvas);
    canvas.addEventListener('pointermove', onpointermove);
    canvas.addEventListener('pointerleave', onpointerleave);
});

// Stop lifecycle.
foxGL.onStop(async () => {
    // Deregister listeners on stop.
    destroyed = true;
    resizeObserver.disconnect();
    canvas.removeEventListener('pointermove', onpointermove);
    canvas.removeEventListener('pointerleave', onpointerleave);
});`,w=`// Author: TapiocaFox
// Title:  Passive Renderer

// Init variables.
const gl = foxGL.gl;
const program = foxGL.program;
const canvas = foxGL.canvas;

let destroyed = false;
let animateOrNot = false;
let firstFrameRendered = false;

// Declare listeners.
const onpointermove = async event => {
    const canvasRect = canvas.getBoundingClientRect();
    const canvasHeight = canvasRect.bottom - canvasRect.top;
    const uMouseX = devicePixelRatio*(event.clientX-canvasRect.left);
    const uMouseY = devicePixelRatio*(canvasHeight-(event.clientY-canvasRect.top));
    gl.uniform2f(gl.getUniformLocation(program, 'uMouse'), uMouseX, uMouseY);
    foxGL.reportStatus('uMouse', \`uMouse: (\${uMouseX.toFixed(1)}, \${uMouseY.toFixed(1)})\`);
    if(!animateOrNot) {
        animateOrNot = true;
        animate();
    }
};

const onpointerleave = async event => {
    animateOrNot = false;
};

const resizeObserver = new ResizeObserver(entries => {
    gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
    foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);
    firstFrameRendered = false;
    animate();
});

// Render per animation frame.
function animate() {
    if(destroyed) return;
    if(firstFrameRendered && !animateOrNot) return;
    requestAnimationFrame(animate);
    const uTime = (Date.now() - foxGL.startTime) / 1000;
    gl.uniform1f(gl.getUniformLocation(program, 'uTime'), uTime);
    foxGL.reportStatus('uTime', \`uTime: \${uTime.toFixed(2)}\`);
    foxGL.render();
    firstFrameRendered = true;
}

// Start lifecycle.
foxGL.onStart(async () => {
    // Set status title.
    foxGL.setStatusTitle('Passive Renderer');

    // Setup vertex buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,0, 1,1,0, -1,-1,0, 1,-1,0, -1,-1,0, 1,1,0]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

    // Initial uniform values.
    gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
    foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);
    
    // Register listeners on start.
    resizeObserver.observe(canvas);
    canvas.addEventListener('pointermove', onpointermove);
    canvas.addEventListener('pointerleave', onpointerleave);
});

// Stop lifecycle.
foxGL.onStop(async () => {
    // Deregister listeners on stop.
    destroyed = true;
    resizeObserver.disconnect();
    canvas.removeEventListener('pointermove', onpointermove);
    canvas.removeEventListener('pointerleave', onpointerleave);
});`,bn=`#version 300 es

// Author: TapiocaFox
// Title: Colorful Snoise
// Snoise implementation is from: https://stegu.github.io/webgl-noise/webdemo/

precision highp float;

#define PI 3.14159265358979
#define SIZE_SHRINK_MOUSE 1.

in  vec3 vPos;
out vec4 fragColor;

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;

vec3 mod289(vec3 x) {
	return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
	return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
	return mod289(((x*34.0)+10.0)*x);
}

vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) { 
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    //   x0 = x0 - 0.0 + 0.0 * C.xxx;
    //   x1 = x0 - i1  + 1.0 * C.xxx;
    //   x2 = x0 - i2  + 2.0 * C.xxx;
    //   x3 = x0 - 1.0 + 3.0 * C.xxx;
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
    vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

    // Permutations
    i = mod289(i); 
    vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    // Gradients: 7x7 points over a square, mapped onto an octahedron.
    // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
    float n_ = 0.142857142857; // 1.0/7.0
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    // vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
    // vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    // Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    // Mix final noise value
    vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 105.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

void main() {
    vec2 st = vPos.xy;
    st.x *= uResolution.x/uResolution.y;
    
    vec2 stMouse = uMouse/uResolution.xy *2. - 1.;
    stMouse.x *= uResolution.x/uResolution.y;
    
    float atanMouse = atan(stMouse.x, stMouse.y);
    float shrinkMouse = 1./(SIZE_SHRINK_MOUSE*distance(stMouse, vec2(0.)));

    vec3 color = vec3(0.);
    color = vec3(.5*sin(PI*(.25*st.x-uTime))+.5,.5*sin(PI*(.4*st.y-uTime))+.5,.5*sin(PI*uTime)+.5);
    
    float pctNoiseW = snoise(vec3(.8*shrinkMouse*st-vec2(.33*uTime), 0.7*uTime));
    float pctNoiseB = 2.*snoise(vec3(.9*shrinkMouse*st-vec2(.33*uTime), 0.5*uTime));
    
    color = mix(color, vec3(1.), pctNoiseW);    
    color = mix(color, vec3(0.), pctNoiseB);

    fragColor = vec4(color,1.0);
}`,D=`#version 300 es

// Author: TapiocaFox
// Title: Sin

precision highp float;


#define PI 3.14159265358979
#define RATIO_SPEED .5

in  vec3 vPos;
out vec4 fragColor;

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;

float plot(vec2 st, float pct) {
    return smoothstep(pct-0.02, pct,st.y) - smoothstep(pct, pct+0.02,st.y);
    
}

void main() {
    vec2 st = vPos.xy;
    st.x *= uResolution.x/uResolution.y;

    vec2 st_mouse = uMouse / uResolution.xy * 2.0 - 1.0;
    st_mouse.x *= uResolution.x/uResolution.y;
    st.x -= st_mouse.x;
    
	float y = sin(PI*(st.x - uTime*RATIO_SPEED));
    
    float pct = plot(st, y);
    
    vec3 color = (1.0-pct)*y+pct*vec3(0.0, 1.0, 0.0);

    fragColor = vec4(color,1.0);
}`,Rn=`// Author: TapiocaFox
// Title:  Mozilla Texture Load

// Init variables.
const gl = foxGL.gl;
const program = foxGL.program;
const canvas = foxGL.canvas;

let destroyed = false;

//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
function loadTexture(gl, image) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    
    // Because images have to be downloaded over the internet
    // they might take a moment until they are ready.
    // Until then put a single pixel in the texture so we can
    // use it immediately. When the image has finished downloading
    // we'll update the texture with the contents of the image.
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
        gl.TEXTURE_2D,
        level,
        internalFormat,
        srcFormat,
        srcType,
        image,
    );
    
    // WebGL1 has different requirements for power of 2 images
    // vs. non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
        // Yes, it's a power of 2. Generate mips.
        gl.generateMipmap(gl.TEXTURE_2D);
    } else {
        // No, it's not a power of 2. Turn off mips and set
        // wrapping to clamp to edge
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
    return texture;
}

function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
}

function initBuffers(gl) {
    const positionBuffer = initPositionBuffer(gl);
    
    const textureCoordBuffer = initTextureBuffer(gl);
    
    const indexBuffer = initIndexBuffer(gl);
    
    return {
        position: positionBuffer,
        textureCoord: textureCoordBuffer,
        indices: indexBuffer,
    };
}

function initPositionBuffer(gl) {
    // Create a buffer for the square's positions.
    const positionBuffer = gl.createBuffer();
    
    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    
    const positions = [
        // Front face
        -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
        
        // Back face
        -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,
        
        // Top face
        -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,
        
        // Bottom face
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
        
        // Right face
        1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,
        
        // Left face
        -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
    ];
    
    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    
    return positionBuffer;
}

function initColorBuffer(gl) {
    const faceColors = [
        [1.0, 1.0, 1.0, 1.0], // Front face: white
        [1.0, 0.0, 0.0, 1.0], // Back face: red
        [0.0, 1.0, 0.0, 1.0], // Top face: green
        [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
        [1.0, 1.0, 0.0, 1.0], // Right face: yellow
        [1.0, 0.0, 1.0, 1.0], // Left face: purple
    ];
    
    // Convert the array of colors into a table for all the vertices.
    
    var colors = [];
    
    for (var j = 0; j < faceColors.length; ++j) {
        const c = faceColors[j];
        // Repeat each color four times for the four vertices of the face
        colors = colors.concat(c, c, c, c);
    }
    
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    
    return colorBuffer;
}

function initIndexBuffer(gl) {
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    
    // This array defines each face as two triangles, using the
    // indices into the vertex array to specify each triangle's
    // position.
    
    const indices = [
        0, 1, 2, 0, 2, 3, // front
        4, 5, 6, 4, 6, 7, // back
        8, 9, 10, 8, 10, 11, // top
        12, 13, 14, 12, 14, 15, // bottom
        16, 17, 18, 16, 18, 19, // right
        20, 21, 22, 20, 22, 23, // left
    ];
    
    // Now send the element array to GL
    
    gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices),
        gl.STATIC_DRAW
    );
    
    return indexBuffer;
}

function initTextureBuffer(gl) {
    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
    
    const textureCoordinates = [
        // Front
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Back
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Top
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Bottom
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Right
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Left
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    ];
    
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(textureCoordinates),
        gl.STATIC_DRAW
    );
    
    return textureCoordBuffer;
}

// tell webgl how to pull out the texture coordinates from buffer
function setTextureAttribute(gl, buffers, programInfo) {
    const num = 2; // every coordinate composed of 2 values
    const type = gl.FLOAT; // the data in the buffer is 32-bit float
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set to the next
    const offset = 0; // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
    gl.vertexAttribPointer(
        programInfo.attribLocations.textureCoord,
        num,
        type,
        normalize,
        stride,
        offset,
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
}

const programInfo = {
    program: program,
    attribLocations: {
        vertexPosition: gl.getAttribLocation(program, "aVertexPosition"),
        textureCoord: gl.getAttribLocation(program, "aTextureCoord"),
    },
    uniformLocations: {
        projectionMatrix: gl.getUniformLocation(program, "uProjectionMatrix"),
        modelViewMatrix: gl.getUniformLocation(program, "uModelViewMatrix"),
        uSampler: gl.getUniformLocation(program, "uSampler"),
    },
};


function drawScene(gl, programInfo, buffers, texture, cubeRotation) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things
    
    // Clear the canvas before we start drawing on it.
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.
    
    const fieldOfView = (45 * Math.PI) / 180; // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
    
    // note: glmatrix.js always has the first argument
    // as the destination to receive the result.
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
    
    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix = mat4.create();
    
    // Now move the drawing position a bit to where we want to
    // start drawing the square.
    mat4.translate(
        modelViewMatrix, // destination matrix
        modelViewMatrix, // matrix to translate
        [-0.0, 0.0, -6.0]
    ); // amount to translate
    
    mat4.rotate(
        modelViewMatrix, // destination matrix
        modelViewMatrix, // matrix to rotate
        cubeRotation, // amount to rotate in radians
        [0, 0, 1]
    ); // axis to rotate around (Z)
    mat4.rotate(
        modelViewMatrix, // destination matrix
        modelViewMatrix, // matrix to rotate
        cubeRotation * 0.7, // amount to rotate in radians
        [0, 1, 0]
    ); // axis to rotate around (Y)
    mat4.rotate(
        modelViewMatrix, // destination matrix
        modelViewMatrix, // matrix to rotate
        cubeRotation * 0.3, // amount to rotate in radians
        [1, 0, 0]
    ); // axis to rotate around (X)
    
    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    setPositionAttribute(gl, buffers, programInfo);
    
    setTextureAttribute(gl, buffers, programInfo);
    
    // Tell WebGL which indices to use to index the vertices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
    
    // Tell WebGL to use our program when drawing
    gl.useProgram(programInfo.program);
    
    // Set the shader uniforms
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix
    );
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix
    );
    
    // Tell WebGL we want to affect texture unit 0
    gl.activeTexture(gl.TEXTURE0);
    
    // Bind the texture to texture unit 0
    gl.bindTexture(gl.TEXTURE_2D, texture);
    
    // Tell the shader we bound the texture to texture unit 0
    gl.uniform1i(programInfo.uniformLocations.uSampler, 0);
    
    {
        const vertexCount = 36;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
}

// Tell WebGL how to pull out the positions from the position
// buffer into the vertexPosition attribute.
function setPositionAttribute(gl, buffers, programInfo) {
    const numComponents = 3;
    const type = gl.FLOAT; // the data in the buffer is 32bit floats
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0; // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

// Tell WebGL how to pull out the colors from the color buffer
// into the vertexColor attribute.
function setColorAttribute(gl, buffers, programInfo) {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
}

// tell webgl how to pull out the texture coordinates from buffer
function setTextureAttribute(gl, buffers, programInfo) {
    const num = 2; // every coordinate composed of 2 values
    const type = gl.FLOAT; // the data in the buffer is 32-bit float
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set to the next
    const offset = 0; // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
    gl.vertexAttribPointer(
        programInfo.attribLocations.textureCoord,
        num,
        type,
        normalize,
        stride,
        offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
}

let buttonSound = null;

// Declare listeners.
const onpointermove = async event => {
    const canvasRect = canvas.getBoundingClientRect();
    const canvasHeight = canvasRect.bottom - canvasRect.top;
    const uMouseX = devicePixelRatio*(event.clientX-canvasRect.left);
    const uMouseY = devicePixelRatio*(canvasHeight-(event.clientY-canvasRect.top));
    gl.uniform2f(gl.getUniformLocation(program, 'uMouse'), uMouseX, uMouseY);
    foxGL.reportStatus('uMouse', \`uMouse: (\${uMouseX.toFixed(1)}, \${uMouseY.toFixed(1)})\`);
};

const onclick = async event => {
    buttonSound.currentTime = 0;
    buttonSound?.play();
};

const resizeObserver = new ResizeObserver(entries => {
    gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
    foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);
});


// Setup vertex buffer.
const buffers = initBuffers(gl);

// Load texture
let texture = null;

let cubeRotation = 3.0;
let deltaTime = 0;
let then = 0;

// Render per animation frame.
function animate() {
    if(destroyed) return;
    requestAnimationFrame(animate);
    const uTime = (Date.now() - foxGL.startTime) / 1000;
    gl.uniform1f(gl.getUniformLocation(program, 'uTime'), uTime);
    foxGL.reportStatus('uTime', \`uTime: \${uTime.toFixed(2)}\`);
    deltaTime = uTime - then;
    then = uTime;
    drawScene(gl, programInfo, buffers, texture, cubeRotation);
    cubeRotation += deltaTime;
    foxGL.render();
}

// Start lifecycle.
foxGL.onStart(async () => {
    await foxGL.loadScriptFromSource('https://cdnjs.cloudflare.com/ajax/libs/gl-matrix/2.8.1/gl-matrix-min.js');

    // console.log({...foxGL.assets});
    // Load texture
    const textureImage = await foxGL.getAssetById('uvmap');
    texture = loadTexture(gl, textureImage);
    
    buttonSound = await foxGL.getAssetById('hl_button');
    // buttonSound.play();
    
    // setTextureAttribute.
    setTextureAttribute(gl, buffers, programInfo);
    // Flip image pixels into the bottom-to-top order that WebGL expects.
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    
    // Set status title.
    foxGL.setStatusTitle('Mozilla Texture Load');
    foxGL.reportStatus('Tips', 'Click to make noises.', 'green');

    // Initial uniform values.
    gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
    foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);
    
    // Register listeners on start.
    resizeObserver.observe(canvas);
    canvas.addEventListener('pointermove', onpointermove);
    canvas.addEventListener('click', onclick);
    animate();
});

// Stop lifecycle.
foxGL.onStop(async () => {
    // Deregister listeners on stop.
    destroyed = true;
    resizeObserver.disconnect();
    canvas.removeEventListener('pointermove', onpointermove);
    canvas.removeEventListener('click', onclick);
});`,Tn=`// Author: TapiocaFox
// Title:  Mozilla Texture Load

attribute vec4 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec2 vTextureCoord;

void main(void) {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  vTextureCoord = aTextureCoord;
}`,Ln=`// Author: TapiocaFox
// Title:  Mozilla Texture Load

varying highp vec2 vTextureCoord;

uniform sampler2D uSampler;

void main(void) {
  gl_FragColor = texture2D(uSampler, vTextureCoord);
}`,In=""+new URL("../assets/uvmap_grid.Dk-1NtMV.jpg",import.meta.url).href,Pn=""+new URL("../assets/hl_button3.oGfxuWLl.wav",import.meta.url).href,An=`#version 300 es

// Author: TapiocaFox
// Title: Fiber

precision highp float;

#define PI 3.14159265358979
#define GAP 0.1
#define SIZE_HALF_STROKE 0.02
#define RADIAN_ROTATION 0.2
#define RATIO_TIME 0.66

in  vec3 vPos;
out vec4 fragColor;

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;

float calc_background(vec2 st) {
    vec2 stMod = mod(st, GAP);
    vec2 pctSt = smoothstep(GAP-SIZE_HALF_STROKE, GAP, stMod) + smoothstep(-SIZE_HALF_STROKE, 0., -stMod);
    return max(pctSt.x, pctSt.y);
}

void main() {
    vec2 st = gl_FragCoord.xy/uResolution.xy*2.-1.;
    st.x *= uResolution.x/uResolution.y;

    vec2 stMouse = uMouse / uResolution.xy * 2. - 1.;
    stMouse.x *= uResolution.x/uResolution.y;
    
    mat2 rot;
    rot[0] = vec2(cos(RADIAN_ROTATION), -sin(RADIAN_ROTATION));    
    rot[1] = vec2(sin(RADIAN_ROTATION), cos(RADIAN_ROTATION));
    
    st = st*rot;
    st -= .5*stMouse;
	
    st.x -= sin(3.*st.x-.5*PI*RATIO_TIME*uTime);      
    st.x -= sin(3.*st.y-.5*PI*RATIO_TIME*uTime);    
    st.y -= sin(3.*st.y+.5*PI*RATIO_TIME*uTime);
    st.y -= sin(3.*st.x+.5*PI*RATIO_TIME*uTime);
    
    vec3 color = vec3(0.);
    color = vec3(abs(.25*sin(st.x+.95*PI*RATIO_TIME*uTime)+.75),abs(.25*sin(st.y+.75*PI*RATIO_TIME*uTime)+.75),abs(.25*sin(.5*PI*RATIO_TIME*uTime)+.75));
    
    float pct = calc_background(st);
    
    color = mix(vec3(0.), color, pct);

    fragColor = vec4(color,1.0);
}`,wn=`#version 300 es

// Author: TapiocaFox
// Title: Array

precision highp float;

#define SIZE_HALF_WIDTH .025
#define SIZE_EDGE .005
#define SIZE_HALF_INTERVAL .05
#define PI 3.14159265358979
#define DEG_BASE -.005
#define SCALE_ROTATION_RADIAN .5
#define SCALE_RADIAN -0.01
#define RATIO_ROTATION_INTERVAL 0.25
#define RATIO_TIME 0.66

in  vec3 vPos;
out vec4 fragColor;

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;

vec3 rot3d(vec3 stp, float alpha, float beta, float gamma) {
    mat3 rot;
    rot[0] = vec3(cos(alpha)*cos(beta), cos(alpha)*sin(beta)*sin(gamma)-sin(alpha)*cos(gamma), cos(alpha)*sin(beta)*cos(gamma)+sin(alpha)*sin(gamma));
    rot[1] = vec3(sin(alpha)*cos(beta), sin(alpha)*sin(beta)*sin(gamma)+cos(alpha)*cos(gamma), sin(alpha)*sin(beta)*cos(gamma)-cos(alpha)*sin(gamma));
    rot[2] = vec3(-sin(beta), cos(beta)*sin(gamma), cos(beta)*cos(gamma));
    return rot*stp;
}

void main() {
    vec2 st = vPos.xy;
    st.x *= uResolution.x/uResolution.y;
    
    float radian = SCALE_RADIAN*sin(RATIO_ROTATION_INTERVAL*RATIO_TIME*uTime)+DEG_BASE;
    mat2 rot2d;
    rot2d[0] = vec2(cos(radian), -sin(radian));    
    rot2d[1] = vec2(sin(radian), cos(radian));
    
    st = rot2d*st;
    
    vec3 color = vec3(0.);
    color = vec3(.5*sin(PI*(.25*st.x-RATIO_TIME*uTime))+.5,.5*sin(PI*(.4*st.y-RATIO_TIME*uTime))+.5,.5*sin(PI*RATIO_TIME*uTime)+.5);
    
    vec2 stBlock = st;
    stBlock = mod(stBlock-SIZE_HALF_INTERVAL, 2.*SIZE_HALF_INTERVAL)-SIZE_HALF_INTERVAL;
    
    stBlock = rot3d(vec3(stBlock, 0.), SCALE_ROTATION_RADIAN*PI*color.x-PI*.12, SCALE_ROTATION_RADIAN*PI*color.y-PI*.2, SCALE_ROTATION_RADIAN*PI*color.z-PI*.2).st;
    
    vec2 z_stBlock = smoothstep(-SIZE_HALF_WIDTH-SIZE_EDGE, -SIZE_HALF_WIDTH+SIZE_EDGE, stBlock)
        -smoothstep(-SIZE_HALF_WIDTH+SIZE_EDGE, -SIZE_HALF_WIDTH-SIZE_EDGE, -stBlock);
    float z_block = min(z_stBlock.x, z_stBlock.y);
    
    fragColor = vec4(mix(vec3(0.), color, z_block),1.0);
}`,Mn=`#version 300 es

// Author: TapiocaFox
// Title:  Phong Reflective Spheres
// Snoise implementation is from: https://stegu.github.io/webgl-noise/webdemo/

precision highp float;

#define MAX_SPHERES 64
#define MAX_LIGHTS 64
#define PI 3.141592653589793238
#define SPEED_SIN 10.
#define SCALE_SIN .015
#define LOWER_BOUND_SIN .8
#define SIZE_SHRINK_MOUSE 1.

uniform int NS;
uniform int NL;
uniform vec2 uMouse;
uniform vec4 uS[MAX_SPHERES];
uniform vec3 uC[MAX_SPHERES],uL[MAX_LIGHTS],uLC[MAX_LIGHTS];

uniform float uTime;
uniform vec3 uViewPoint;

in  vec3 vPos;
out vec4 fragColor;

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0; }

float mod289(float x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0; }

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+10.0)*x);
}

float permute(float x) {
     return mod289(((x*34.0)+10.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float taylorInvSqrt(float r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec4 grad4(float j, vec4 ip)
  {
  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
  vec4 p,s;

  p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
  s = vec4(lessThan(p, vec4(0.0)));
  p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www; 

  return p;
  }
						
// (sqrt(5) - 1)/4 = F4, used once below
#define F4 0.309016994374947451

float snoise(vec4 v)
  {
  const vec4  C = vec4( 0.138196601125011,  // (5 - sqrt(5))/20  G4
                        0.276393202250021,  // 2 * G4
                        0.414589803375032,  // 3 * G4
                       -0.447213595499958); // -1 + 4 * G4

// First corner
  vec4 i  = floor(v + dot(v, vec4(F4)) );
  vec4 x0 = v -   i + dot(i, C.xxxx);

// Other corners

// Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
  vec4 i0;
  vec3 isX = step( x0.yzw, x0.xxx );
  vec3 isYZ = step( x0.zww, x0.yyz );
//  i0.x = dot( isX, vec3( 1.0 ) );
  i0.x = isX.x + isX.y + isX.z;
  i0.yzw = 1.0 - isX;
//  i0.y += dot( isYZ.xy, vec2( 1.0 ) );
  i0.y += isYZ.x + isYZ.y;
  i0.zw += 1.0 - isYZ.xy;
  i0.z += isYZ.z;
  i0.w += 1.0 - isYZ.z;

  // i0 now contains the unique values 0,1,2,3 in each channel
  vec4 i3 = clamp( i0, 0.0, 1.0 );
  vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
  vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

  //  x0 = x0 - 0.0 + 0.0 * C.xxxx
  //  x1 = x0 - i1  + 1.0 * C.xxxx
  //  x2 = x0 - i2  + 2.0 * C.xxxx
  //  x3 = x0 - i3  + 3.0 * C.xxxx
  //  x4 = x0 - 1.0 + 4.0 * C.xxxx
  vec4 x1 = x0 - i1 + C.xxxx;
  vec4 x2 = x0 - i2 + C.yyyy;
  vec4 x3 = x0 - i3 + C.zzzz;
  vec4 x4 = x0 + C.wwww;

// Permutations
  i = mod289(i); 
  float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
  vec4 j1 = permute( permute( permute( permute (
             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));

// Gradients: 7x7x6 points over a cube, mapped onto a 4-cross polytope
// 7*7*6 = 294, which is close to the ring size 17*17 = 289.
  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

  vec4 p0 = grad4(j0,   ip);
  vec4 p1 = grad4(j1.x, ip);
  vec4 p2 = grad4(j1.y, ip);
  vec4 p3 = grad4(j1.z, ip);
  vec4 p4 = grad4(j1.w, ip);

// Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  p4 *= taylorInvSqrt(dot(p4,p4));

// Mix contributions from the five corners
  vec3 m0 = max(0.57 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
  vec2 m1 = max(0.57 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
  m0 = m0 * m0;
  m1 = m1 * m1;
  return 60.1 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;

  }

vec2 raySphere(vec3 V, vec3 W, vec4 S) {
    V -= S.xyz;
    float b = dot(V, W);
    float d = b * b - dot(V, V) + S.w * S.w;
    if (d < 0.)
        return vec2(1001.,1000.);
    return vec2(-b - sqrt(d), -b + sqrt(d));
}

bool inShadow(vec3 P, vec3 L) {
    for (int i = 0 ; i < NS ; i++) {
        vec2 tt = raySphere(P, L, uS[i]);
        if (tt.x < tt.y && tt.x > 0.)
            return true;
    }
    return false;
}

vec3 phong(vec3 N, vec3 L, vec3 W,vec3 diffuse, vec4 specular) {
    vec3 shade = vec3(0.);
    shade += diffuse * max(0., dot(L,N)); // Diffuse.
    vec3 reflection = 2.*N*dot(N,L)-L;
    shade += specular.xyz * pow(max(0., dot(-reflection, W)), specular.w); // Specular.
    return shade;
}

vec3 shadeSphereDirectly(int i, vec3 P, vec3 W) {
    vec4 S = uS[i];
    vec3 C = uC[i];
    vec3 N = (P - S.xyz) / S.w;
    
    vec3 shade = vec3(.1);

    vec3 step = vec3(1.3, 1.7, 2.1);
    // vec3 step = vec3(0., 0., 0.);
    float shift = float(5*i);
    float n = snoise(vec4(P, shift+0.3*uTime));
    n += 0.5 * snoise(vec4(P* 2.0 - step, shift+0.3*uTime));
    n += 0.25 * snoise(vec4(P* 4.0 - 2.0 * step, shift+0.3*uTime));
    n += 0.125 * snoise(vec4(P* 8.0 - 3.0 * step, shift+0.3*uTime));
    n += 0.0625 * snoise(vec4(P* 16.0 - 4.0 * step, shift+0.3*uTime));
    n += 0.03125 * snoise(vec4(P* 32.0 - 5.0 * step, shift+0.3*uTime));
    shade = shade+max(min(.5*n, .25), -.75);
    // shade += n;
    
    // shade *= sin(20. * N.y - PI*uTime);
    shade *= (1.-LOWER_BOUND_SIN)*(.5 + .5 * sin(1./SCALE_SIN * N.y - SPEED_SIN*PI*uTime*float(2 * (i & 1) - 1)))+LOWER_BOUND_SIN;
    // shade *= 1.;
    
    // Direct light source.
    for (int l = 0 ; l < NL ; l++)
        if (! inShadow(P, uL[l])) {
            // shade += uLC[l] * max(0., dot(N, uL[l])); // No phong.
            shade += uLC[l] * phong(N,uL[l],W,C,vec4(vec3(.33), 30));
        }
    
    return shade;
}

vec3 shadeSphere(int i, vec3 P, vec3 W) {
    vec4 S = uS[i];
    vec3 C = uC[i];
    vec3 N = (P - S.xyz) / S.w;
    
    vec3 directShade = shadeSphereDirectly(i,P,W);

    // Glow from other spheres.
    vec3 reflectiveShade = vec3(0.);
    float t = 100.;
    vec3 WR = reflect(W, N);
    for (int l = 0 ; l < NS ; l++) {
        vec2 tt = raySphere(P, WR, uS[l]);
        if (tt.x < tt.y && tt.x > 0. && tt.x < t) {
            t = tt.x;
            vec3 PGlow = P + t * WR;
            vec3 color = shadeSphereDirectly(l,PGlow,WR);
            // vec3 NGlow = (PGlow-uS[l].xyz)/uS[l].w;
            // F = color * max(0., dot(-WR, NGlow));
            reflectiveShade = color;
        }
    }

    return directShade+reflectiveShade;
}



void main() {
    vec4 F = vec4(0.);
    vec3 V = uViewPoint;
    vec3 W = normalize(vPos-V);
    float t = 100.;
    
    for (int i = 0 ; i < NS ; i++) {
        vec2 tt = raySphere(V, W, uS[i]);
        if (tt.x < tt.y && tt.x > 0. && tt.x < t) {
            t = tt.x;
            vec3 P = V + t * W;
            F = vec4(shadeSphere(i,P,W),1.);
        }
    }
    
    // fragColor = vec4(pow(F.rgb, vec3(1.0/2.2)), F.a);
    fragColor = vec4(F.rgb, F.a);

    vec4 colorBg = vec4(0.);
    colorBg = vec4(.5*sin(PI*(.25*vPos.x-uTime))+.5,.5*sin(PI*(.4*vPos.y-uTime))+.5,.5*sin(PI*uTime)+.5, 1.);
    
    float pctNoiseW = snoise(vec4(.8*SIZE_SHRINK_MOUSE*vPos.xy-vec2(.33*uTime), 0.7*uTime, 0.));
    float pctNoiseB = 2.*snoise(vec4(.9*SIZE_SHRINK_MOUSE*vPos.xy-vec2(.33*uTime), 0.5*uTime, 0.));
    
    colorBg = mix(colorBg, vec4(1.), .25*pctNoiseW);    
    colorBg = mix(colorBg, vec4(0., 0., 0., 1.), pctNoiseB);
    colorBg = mix(vec4(0.,0.,0.,1.),colorBg,.15);

    fragColor = mix(vec4(0.,0.,0.,1.),fragColor,F.a);
    // fragColor = mix(colorBg,fragColor,F.a);
}`,En=`// Author: TapiocaFox
// Title:  Phong Reflective Spheres

// Init variables.
const gl = foxGL.gl;
const program = foxGL.program;
const canvas = foxGL.canvas;

const PI = 3.141592653589793;
const NS = 4;
const NL = 3;

let destroyed = false;
let usePointer = false;
let enlarge = false;
let uMouseX = 0;
let uMouseY = 0;

// Declare listeners.
const onpointermove = async event => {
    usePointer = true;
    const canvasRect = canvas.getBoundingClientRect();
    const canvasHeight = canvasRect.bottom - canvasRect.top;
    uMouseX = devicePixelRatio*(event.clientX-canvasRect.left);
    uMouseY = devicePixelRatio*(canvasHeight-(event.clientY-canvasRect.top));
    gl.uniform2f(gl.getUniformLocation(program, 'uMouse'), uMouseX, uMouseY);
    foxGL.reportStatus('uMouse', \`uMouse: (\${uMouseX.toFixed(1)}, \${uMouseY.toFixed(1)})\`);
};

let activatedSound = null;
let deactivatedSound = null;

const onclick = async event => {
    enlarge = !enlarge;
    if(enlarge && activatedSound) {
        activatedSound.currentTime = 0;
        activatedSound.play();
    }
    else if(deactivatedSound) {
        deactivatedSound.currentTime = 0;
        deactivatedSound.play();
    }
    foxGL.reportStatus('enlarge', \`Enlarged: \${enlarge}\`, enlarge?'blue':'red');
};

const pointerleave = async event => {
    usePointer = false;
};

const resizeObserver = new ResizeObserver(entries => {
    gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
    foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);
});

// Math.
const normalize = v => {
   let s = Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2]);
   return [ v[0]/s, v[1]/s, v[2]/s ];
}

// Render per animation frame.
function animate() {
    if(destroyed) return;
    requestAnimationFrame(animate);
    const uTime = (Date.now() - foxGL.startTime) / 1000;
    const RATIO_TIME = 0.66;
    gl.uniform1f(gl.getUniformLocation(program, 'uTime'), uTime);
    foxGL.reportStatus('uTime', \`uTime: \${uTime.toFixed(2)}\`);

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
        [.65,.65,.9],
        [1,1,1],
        [.5,0.,0.]
    ].flat());
    // Lights.
    gl.uniform3fv(gl.getUniformLocation(program, 'uL'), [ 
        normalize([1,1,1]),
        normalize([-1,-1,-.5]),
        normalize([0,-1,0])
    ].flat());
    // Lights' colors.
    gl.uniform3fv(gl.getUniformLocation(program, 'uLC'), [
        [.5,.7,1],
        [.2,.15,.1],
        [.5,0,0]
    ].flat());
    foxGL.render();
}

// Start lifecycle.
foxGL.onStart(async () => {
    // Set status title.
    foxGL.setStatusTitle('Phong Reflective Spheres');
    foxGL.reportStatus('Description', \`Click to enlarge the white sphere.\`, 'green');
    foxGL.reportStatus('enlarge', \`Enlarged: \${enlarge}\`, enlarge?'blue':'red');

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
    foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);
    
    // Register listeners on start.
    resizeObserver.observe(canvas);
    canvas.addEventListener('pointermove', onpointermove);
    canvas.addEventListener('click', onclick);
    canvas.addEventListener('pointerleave', pointerleave);
    animate();
});

// Stop lifecycle.
foxGL.onStop(async () => {
    // Deregister listeners on stop.
    destroyed = true;
    resizeObserver.disconnect();
    canvas.removeEventListener('pointermove', onpointermove);
    canvas.removeEventListener('click', onclick);
    canvas.removeEventListener('pointerleave', pointerleave);
});`,Cn=`#version 300 es

// Author: TapiocaFox
// Title:  Reflective Refractive Spheres
// Snoise implementation is from: https://stegu.github.io/webgl-noise/webdemo/

precision highp float;

#define MAX_SPHERES 64
#define MAX_LIGHTS 64
#define PI 3.141592653589793238
#define SPEED_SIN 10.
#define SCALE_SIN .015
#define LOWER_BOUND_SIN .8
#define SIZE_SHRINK_MOUSE 1.

uniform int NS;
uniform int NL;
uniform vec2 uMouse, uR[MAX_SPHERES];
uniform vec4 uS[MAX_SPHERES];
uniform vec3 uC[MAX_SPHERES],uL[MAX_LIGHTS],uLC[MAX_LIGHTS];

uniform float uTime;
uniform vec3 uViewPoint;

in  vec3 vPos;
out vec4 fragColor;

vec3 colorRayEnd = vec3(.125);

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0; }

float mod289(float x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0; }

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+10.0)*x);
}

float permute(float x) {
     return mod289(((x*34.0)+10.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float taylorInvSqrt(float r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec4 grad4(float j, vec4 ip)
  {
  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
  vec4 p,s;

  p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
  s = vec4(lessThan(p, vec4(0.0)));
  p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www; 

  return p;
  }
						
// (sqrt(5) - 1)/4 = F4, used once below
#define F4 0.309016994374947451

float snoise(vec4 v)
  {
  const vec4  C = vec4( 0.138196601125011,  // (5 - sqrt(5))/20  G4
                        0.276393202250021,  // 2 * G4
                        0.414589803375032,  // 3 * G4
                       -0.447213595499958); // -1 + 4 * G4

// First corner
  vec4 i  = floor(v + dot(v, vec4(F4)) );
  vec4 x0 = v -   i + dot(i, C.xxxx);

// Other corners

// Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
  vec4 i0;
  vec3 isX = step( x0.yzw, x0.xxx );
  vec3 isYZ = step( x0.zww, x0.yyz );
//  i0.x = dot( isX, vec3( 1.0 ) );
  i0.x = isX.x + isX.y + isX.z;
  i0.yzw = 1.0 - isX;
//  i0.y += dot( isYZ.xy, vec2( 1.0 ) );
  i0.y += isYZ.x + isYZ.y;
  i0.zw += 1.0 - isYZ.xy;
  i0.z += isYZ.z;
  i0.w += 1.0 - isYZ.z;

  // i0 now contains the unique values 0,1,2,3 in each channel
  vec4 i3 = clamp( i0, 0.0, 1.0 );
  vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
  vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

  //  x0 = x0 - 0.0 + 0.0 * C.xxxx
  //  x1 = x0 - i1  + 1.0 * C.xxxx
  //  x2 = x0 - i2  + 2.0 * C.xxxx
  //  x3 = x0 - i3  + 3.0 * C.xxxx
  //  x4 = x0 - 1.0 + 4.0 * C.xxxx
  vec4 x1 = x0 - i1 + C.xxxx;
  vec4 x2 = x0 - i2 + C.yyyy;
  vec4 x3 = x0 - i3 + C.zzzz;
  vec4 x4 = x0 + C.wwww;

// Permutations
  i = mod289(i); 
  float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
  vec4 j1 = permute( permute( permute( permute (
             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));

// Gradients: 7x7x6 points over a cube, mapped onto a 4-cross polytope
// 7*7*6 = 294, which is close to the ring size 17*17 = 289.
  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

  vec4 p0 = grad4(j0,   ip);
  vec4 p1 = grad4(j1.x, ip);
  vec4 p2 = grad4(j1.y, ip);
  vec4 p3 = grad4(j1.z, ip);
  vec4 p4 = grad4(j1.w, ip);

// Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  p4 *= taylorInvSqrt(dot(p4,p4));

// Mix contributions from the five corners
  vec3 m0 = max(0.57 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
  vec2 m1 = max(0.57 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
  m0 = m0 * m0;
  m1 = m1 * m1;
  return 60.1 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;

  }

vec2 raySphere(vec3 V, vec3 W, vec4 S) {
    V -= S.xyz;
    float b = dot(V, W);
    float d = b * b - dot(V, V) + S.w * S.w;
    if (d < 0.)
        return vec2(1001.,1000.);
    return vec2(-b - sqrt(d), -b + sqrt(d));
}

bool inShadow(vec3 P, vec3 L) {
    for (int i = 0 ; i < NS ; i++) {
        vec2 tt = raySphere(P, L, uS[i]);
        if (tt.x < tt.y && tt.x > 0.)
            return true;
    }
    return false;
}

vec3 phong(vec3 N, vec3 L, vec3 W,vec3 diffuse, vec4 specular) {
    vec3 shade = vec3(0.);
    shade += diffuse * max(0., dot(L,N)); // Diffuse.
    vec3 reflection = 2.*N*dot(N,L)-L;
    shade += specular.xyz * pow(max(0., dot(-reflection, W)), specular.w); // Specular.
    return shade;
}

vec3 shadeSphereDirectly(int i, vec3 P, vec3 W) {
    vec4 S = uS[i];
    vec3 C = uC[i];
    vec3 N = (P - S.xyz) / S.w;
    vec2 R = uR[i];
    
    vec3 shade = colorRayEnd;

    vec3 step = vec3(1.3, 1.7, 2.1);
    // vec3 step = vec3(0., 0., 0.);
    float shift = float(5*i);
    float n = snoise(vec4(P, shift+0.3*uTime));
    n += 0.5 * snoise(vec4(P* 2.0 - step, shift+0.3*uTime));
    n += 0.25 * snoise(vec4(P* 4.0 - 2.0 * step, shift+0.3*uTime));
    n += 0.125 * snoise(vec4(P* 8.0 - 3.0 * step, shift+0.3*uTime));
    n += 0.0625 * snoise(vec4(P* 16.0 - 4.0 * step, shift+0.3*uTime));
    n += 0.03125 * snoise(vec4(P* 32.0 - 5.0 * step, shift+0.3*uTime));
    shade = shade+max(min(.5*n, .25), -.75);
    // shade += n;
    
    // shade *= sin(20. * N.y - PI*uTime);
    shade *= (1.-LOWER_BOUND_SIN)*(.5 + .5 * sin(1./SCALE_SIN * N.y - SPEED_SIN*PI*uTime*float(2 * (i & 1) - 1)))+LOWER_BOUND_SIN;
    // shade *= 1.;
    
    // Direct light source.
    for (int l = 0 ; l < NL ; l++)
        if (! inShadow(P, uL[l])) {
            // shade += uLC[l] * max(0., dot(N, uL[l])); // No phong.
            shade += R.x * uLC[l] * phong(N,uL[l],W,C,vec4(vec3(.33), 30));
        }
    
    return shade;
}

vec3 shadeSphere(int i, vec3 P, vec3 W) {
    vec4 S = uS[i];
    vec3 C = uC[i];
    vec3 N = (P - S.xyz) / S.w;
    vec2 R = uR[i];
    
    vec3 directShade = shadeSphereDirectly(i,P,W);

    // Glow from other spheres.
    vec3 reflectiveShade = vec3(0.);
    float t = 100.;
    vec3 WR = reflect(W, N);
    for (int l = 0 ; l < NS ; l++) {
        vec2 tt = raySphere(P, WR, uS[l]);
        if (tt.x < tt.y && tt.x > 0. && tt.x < t) {
            t = tt.x;
            vec3 PGlow = P + t * WR;
            vec3 color = shadeSphereDirectly(l,PGlow,WR);
            // vec3 NGlow = (PGlow-uS[l].xyz)/uS[l].w;
            // F = color * max(0., dot(-WR, NGlow));
            reflectiveShade = color;
        }
    }

    // Refraction from other spheres.
    vec3 refractiveShade = vec3(0.);
    t = 100.;
    WR = refract(W, N, R.y);
    vec2 tt = raySphere(P, WR, S);
    P = P + tt.x * WR;
    N = (P - S.xyz) / S.w;
    WR = refract(W, N, 1./R.y);
    for (int l = 0 ; l < NS ; l++) {
        vec2 tt = raySphere(P, WR, uS[l]);
        if (tt.x < tt.y && tt.x > 0. && tt.x < t) {
            t = tt.x;
            vec3 PGlow = P + t * WR;
            vec3 color = (1.-R.x)*shadeSphereDirectly(l,PGlow,WR);
            // vec3 NGlow = (PGlow-uS[l].xyz)/uS[l].w;
            // F = color * max(0., dot(-WR, NGlow));
            refractiveShade = color;
        }
    }

    return directShade+reflectiveShade+refractiveShade;
}



void main() {
    vec4 F = vec4(0.);
    vec3 V = uViewPoint;
    vec3 W = normalize(vPos-V);
    float t = 100.;
    
    for (int i = 0 ; i < NS ; i++) {
        vec2 tt = raySphere(V, W, uS[i]);
        if (tt.x < tt.y && tt.x > 0. && tt.x < t) {
            t = tt.x;
            vec3 P = V + t * W;
            F = vec4(shadeSphere(i,P,W),1.);
        }
    }
    
    // fragColor = vec4(pow(F.rgb, vec3(1.0/2.2)), F.a);
    fragColor = vec4(F.rgb, F.a);

    vec4 colorBg = vec4(0.);
    colorBg = vec4(.5*sin(PI*(.25*vPos.x-uTime))+.5,.5*sin(PI*(.4*vPos.y-uTime))+.5,.5*sin(PI*uTime)+.5, 1.);
    
    float pctNoiseW = snoise(vec4(.8*SIZE_SHRINK_MOUSE*vPos.xy-vec2(.33*uTime), 0.7*uTime, 0.));
    float pctNoiseB = 2.*snoise(vec4(.9*SIZE_SHRINK_MOUSE*vPos.xy-vec2(.33*uTime), 0.5*uTime, 0.));
    
    colorBg = mix(colorBg, vec4(1.), .25*pctNoiseW);    
    colorBg = mix(colorBg, vec4(0., 0., 0., 1.), pctNoiseB);
    colorBg = mix(vec4(0.,0.,0.,1.),colorBg,.15);

    fragColor = mix(vec4(0.,0.,0.,1.),fragColor,F.a);
    // fragColor = mix(colorBg,fragColor,F.a);
}`,Gn=`// Author: TapiocaFox
// Title:  Reflective Refractive Spheres

// Init variables.
const gl = foxGL.gl;
const program = foxGL.program;
const canvas = foxGL.canvas;

const PI = 3.141592653589793;
const NS = 4;
const NL = 3;

let destroyed = false;
let usePointer = false;
let enlarge = false;
let uMouseX = 0;
let uMouseY = 0;

// Declare listeners.
const onpointermove = async event => {
    usePointer = true;
    const canvasRect = canvas.getBoundingClientRect();
    const canvasHeight = canvasRect.bottom - canvasRect.top;
    uMouseX = devicePixelRatio*(event.clientX-canvasRect.left);
    uMouseY = devicePixelRatio*(canvasHeight-(event.clientY-canvasRect.top));
    gl.uniform2f(gl.getUniformLocation(program, 'uMouse'), uMouseX, uMouseY);
    foxGL.reportStatus('uMouse', \`uMouse: (\${uMouseX.toFixed(1)}, \${uMouseY.toFixed(1)})\`);
};

let activatedSound = null;
let deactivatedSound = null;

const onclick = async event => {
    enlarge = !enlarge;
    if(enlarge && activatedSound) {
        activatedSound.currentTime = 0;
        activatedSound.play();
    }
    else if(deactivatedSound) {
        deactivatedSound.currentTime = 0;
        deactivatedSound.play();
    }
    foxGL.reportStatus('enlarge', \`Enlarged: \${enlarge}\`, enlarge?'blue':'red');
};

const pointerleave = async event => {
    usePointer = false;
};

const resizeObserver = new ResizeObserver(entries => {
    gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
    foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);
});

// Math.
const normalize = v => {
   let s = Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2]);
   return [ v[0]/s, v[1]/s, v[2]/s ];
}

// Render per animation frame.
function animate() {
    if(destroyed) return;
    requestAnimationFrame(animate);
    const uTime = (Date.now() - foxGL.startTime) / 1000;
    const RATIO_TIME = 0.66;
    gl.uniform1f(gl.getUniformLocation(program, 'uTime'), uTime);
    foxGL.reportStatus('uTime', \`uTime: \${uTime.toFixed(2)}\`);

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

// Start lifecycle.
foxGL.onStart(async () => {
    // Set status title.
    foxGL.setStatusTitle('Reflective Refractive Spheres');
    foxGL.reportStatus('Description', \`Click to enlarge the white sphere.\`, 'green');
    foxGL.reportStatus('enlarge', \`Enlarged: \${enlarge}\`, enlarge?'blue':'red');

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
    foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);
    
    // Register listeners on start.
    resizeObserver.observe(canvas);
    canvas.addEventListener('pointermove', onpointermove);
    canvas.addEventListener('click', onclick);
    canvas.addEventListener('pointerleave', pointerleave);
    animate();
});

// Stop lifecycle.
foxGL.onStop(async () => {
    // Deregister listeners on stop.
    destroyed = true;
    resizeObserver.disconnect();
    canvas.removeEventListener('pointermove', onpointermove);
    canvas.removeEventListener('click', onclick);
    canvas.removeEventListener('pointerleave', pointerleave);
});`,q=""+new URL("../assets/activated.Bse8Nsx6.wav",import.meta.url).href,V=""+new URL("../assets/deactivated.COA-aso_.wav",import.meta.url).href,zn=`#version 300 es

// Author: TapiocaFox
// Title:  Phong Reflection

precision highp float;

#define PI 3.1415926535897932384
#define MAX_SPHERES 64
#define MAX_LIGHTS 64

in  vec3 vPos;
out vec4 fragColor;

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;

uniform int NS;
uniform int NL;
uniform vec4 uS[MAX_SPHERES],uSpecular[MAX_SPHERES];
uniform vec3 uViewPoint,uC[MAX_SPHERES],uL[MAX_LIGHTS],uLC[MAX_LIGHTS],uAmbient[MAX_LIGHTS],uDiffuse[MAX_LIGHTS];

vec2 raySphere(vec3 V, vec3 W, vec4 S) {
   V -= S.xyz;
   float b = dot(V, W);
   float d = b * b - dot(V, V) + S.w * S.w;
   if (d < 0.)
      return vec2(1001.,1000.);
   return vec2(-b - sqrt(d), -b + sqrt(d));
}

vec3 phong(vec3 N, vec3 L, vec3 W,vec3 diffuse, vec4 specular) {
    vec3 shade = vec3(0.);
    shade += diffuse * max(0., dot(L,N)); // Diffuse.
    vec3 reflection = 2.*N*dot(N,L)-L;
    shade += specular.xyz * pow(max(0., dot(-reflection, W)), specular.w); // Specular.
    return shade;
}

vec3 shadeSphere(vec4 S, vec3 P, vec3 W,vec3 ambient,vec3 diffuse,vec4 specular) {
   vec3 N = (P - S.xyz) / S.w;
   vec3 shade = ambient;
   for (int l = 0 ; l < NL ; l++)
      shade += uLC[l] * phong(N,uL[l],W,diffuse,specular);
   return shade;
}

void main() {
    vec4 F = vec4(0.);
    vec3 V = uViewPoint;
    vec3 W = normalize(vPos-V);
    float t = 100.;
    
    for (int i = 0 ; i < NS ; i++) {
        vec2 tt = raySphere(V, W, uS[i]);
        if (tt.x < tt.y && tt.x > 0. && tt.x < t) {
             t = tt.x;
             vec3 P = V + t * W;
             F = vec4(shadeSphere(uS[i], P, W,uAmbient[i],uDiffuse[i],uSpecular[i]), 1.);
        }
    }
    
    fragColor = vec4(sqrt(F.rgb), F.a);
    fragColor = mix(vec4(.0,.0,.0,1.),fragColor, F.a);
}`,Fn=`// Author: TapiocaFox
// Title:  Phong Reflection

// Init variables.
const gl = foxGL.gl;
const program = foxGL.program;
const canvas = foxGL.canvas;

const PI = 3.141592653589793;
const NS = 1;
const NL = 2;

let destroyed = false;
let usePointer = false;
let uMouseX = 0;
let uMouseY = 0;
let firstFrameRendered = false;

// Declare listeners.
const onpointermove = async event => {
    usePointer = true;
    const canvasRect = canvas.getBoundingClientRect();
    const canvasHeight = canvasRect.bottom - canvasRect.top;
    uMouseX = devicePixelRatio*(event.clientX-canvasRect.left);
    uMouseY = devicePixelRatio*(canvasHeight-(event.clientY-canvasRect.top));
    gl.uniform2f(gl.getUniformLocation(program, 'uMouse'), uMouseX, uMouseY);
    foxGL.reportStatus('uMouse', \`uMouse: (\${uMouseX.toFixed(1)}, \${uMouseY.toFixed(1)})\`);
};

const pointerleave = async event => {
    usePointer = false;
};

const resizeObserver = new ResizeObserver(entries => {
    gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
    foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);
    firstFrameRendered = false;
    animate();
});

// Math.
const normalize = v => {
   let s = Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2]);
   return [ v[0]/s, v[1]/s, v[2]/s ];
}

// Render per animation frame.
function animate() {
    if(destroyed) return;
    if(firstFrameRendered) return;
    requestAnimationFrame(animate);
    const uTime = (Date.now() - foxGL.startTime) / 1000;
    gl.uniform1f(gl.getUniformLocation(program, 'uTime'), uTime);
    foxGL.reportStatus('uTime', \`uTime: \${uTime.toFixed(2)}\`);

    // Spheres.
    gl.uniform4fv(gl.getUniformLocation(program, 'uS'), [
        [0,0,0,.45]
    ].flat());
    
    // Spheres' lighting.
    gl.uniform3fv(gl.getUniformLocation(program, 'uAmbient'), [
        [ 0,0,.4 ]
    ].flat());
    gl.uniform3fv(gl.getUniformLocation(program, 'uDiffuse'), [
        [ 0,0,.4 ]
    ].flat());
    gl.uniform4fv(gl.getUniformLocation(program, 'uSpecular'), [
        [ 1,1,1,3 ]
    ].flat());
    
    // Lights.
    gl.uniform3fv(gl.getUniformLocation(program, 'uL'), [
        normalize([-.35,.35,.35]),
        normalize([1,-1,-.5])
    ].flat());

    // Lights' colors.
    gl.uniform3fv(gl.getUniformLocation(program, 'uLC'), [
        [.5,.7,1],
        [.2,.15,.1]
    ].flat());
    foxGL.render();
    firstFrameRendered = true;
}

// Start lifecycle.
foxGL.onStart(async () => {
    // Set status title.
    foxGL.setStatusTitle('Phong Reflection');

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
    foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);
    
    // Register listeners on start.
    resizeObserver.observe(canvas);
    canvas.addEventListener('pointermove', onpointermove);
    canvas.addEventListener('pointerleave', pointerleave);
    animate();
});

// Stop lifecycle.
foxGL.onStop(async () => {
    // Deregister listeners on stop.
    destroyed = true;
    resizeObserver.disconnect();
    canvas.removeEventListener('pointermove', onpointermove);
    canvas.removeEventListener('pointerleave', pointerleave);
});`,Nn=`#version 300 es

// Author: TapiocaFox
// Title:  Quadric Surface (System)

#define SIZE_VOLUME_GRID 0.05
#define SIZE_MAX_SYSTEMS 16

precision highp float;
uniform float uTime;
uniform vec3 uViewPoint;
uniform mat4 uQ[3*SIZE_MAX_SYSTEMS];
uniform bool uF[SIZE_MAX_SYSTEMS];
uniform int uNumQ;

in  vec3 vPos;
out vec4 fragColor;

vec3 firstGridColor = vec3(.8,.8,.8);
vec3 secondGridColor = vec3(.7,.7,.7);

vec3 light = normalize(vec3(1.,1.,1.));
vec3 lightColor = vec3(.95,.95,1.);
vec3 light2 = normalize(vec3(-1.,-1.,0.));
vec3 lightColor2 = vec3(.9,.5,.5);
vec4 sepcular = vec4(1.,1.,1.,20.);

vec3 rayEq(vec3 V, vec3 W, mat4 Q) {

   float A = Q[0].x, B = Q[1].x+Q[0].y, C = Q[2].x+Q[0].z, D = Q[3].x+Q[0].w,
                     E = Q[1].y       , F = Q[2].y+Q[1].z, G = Q[3].y+Q[1].w,
                                        H = Q[2].z       , I = Q[3].z+Q[2].w,
                                                           J = Q[3].w       ;

   float a = A * W.x * W.x +
             B * W.x * W.y +
             C * W.z * W.x +
             E * W.y * W.y +
             F * W.y * W.z +
             H * W.z * W.z ;

   float b = 2. * A * V.x * W.x +
                  B * (W.x * V.y + V.y * W.x) +
                  C * (V.z * W.x + V.x * W.z) +
                  D * W.x +
             2. * E * V.y * W.y +
                  F * (V.y * W.z + V.z * W.y) +
                  G * W.y +
             2. * H * V.z * W.z +
                  I * W.z;

   float c = A * V.x * V.x +
             B * V.x * V.y +
             C * V.z * V.x +
             D * V.x       +
             E * V.y * V.y +
             F * V.y * V.z +
             G * V.y       +
             H * V.z * V.z +
             I * V.z       +
             J;

   return vec3(a,b,c);
}

vec2 findRoots(vec3 eq) {
    float a = eq.x, b = eq.y, c = eq.z;
    vec2 t = vec2(-1.);
    float discr = b * b - 4. * a * c;
    if (discr >= 0.)
        t = vec2(-b - sqrt(discr), -b + sqrt(discr)) / (2. * a);
    return t;
}

vec3 normalQ(mat4 Q, vec3 P) {
   float A = Q[0].x, B = Q[1].x+Q[0].y, C = Q[2].x+Q[0].z, D = Q[3].x+Q[0].w,
                     E = Q[1].y       , F = Q[2].y+Q[1].z, G = Q[3].y+Q[1].w,
                                        H = Q[2].z       , I = Q[3].z+Q[2].w,
                                                           J = Q[3].w       ;

   return normalize(vec3(2. * A * P.x + C * P.z + B * P.y + D,
                         2. * E * P.y + F * P.z + B * P.x + G,
                         2. * H * P.z + F * P.y + C * P.x + I));
}

vec3 phong(vec3 N, vec3 L, vec3 W,vec3 diffuse, vec4 specular) {
    vec3 shade = vec3(0.);
    shade += diffuse * max(0., dot(L,N)); // Diffuse.
    vec3 reflection = 2.*N*dot(N,L)-L;
    shade += specular.xyz * pow(max(0., dot(-reflection, W)), specular.w); // Specular.
    return shade;
}

// Noise snippet from Prof. Perlin.
vec3  _s(vec3 i) { return cos(5.*(i+5.*cos(5.*(i.yzx+5.*cos(5.*(i.zxy+5.*cos(5.*i))))))); }
float _t(vec3 i, vec3 u, vec3 a) { return dot(normalize(_s(i + a)), u - a); }
float noise(vec3 p) {
   vec3 i = floor(p), u = p - i, v = 2.*mix(u*u, u*(2.-u)-.5, step(.5,u));
   return mix(mix(mix(_t(i, u, vec3(0.,0.,0.)), _t(i, u, vec3(1.,0.,0.)), v.x),
                  mix(_t(i, u, vec3(0.,1.,0.)), _t(i, u, vec3(1.,1.,0.)), v.x), v.y),
              mix(mix(_t(i, u, vec3(0.,0.,1.)), _t(i, u, vec3(1.,0.,1.)), v.x),
                  mix(_t(i, u, vec3(0.,1.,1.)), _t(i, u, vec3(1.,1.,1.)), v.x), v.y), v.z);
}

float fractal(vec3 P) {
   float f = 0., s = 1.;
   for (int i = 0 ; i < 9 ; i++) {
      f += noise(s * P) / s;
      s *= 2.;
      P = vec3(.866*P.x + .5*P.z, P.y + 100., -.5*P.x + .866*P.z);
   }
   return f;
}

float turbulence(vec3 P) {
   float f = 0., s = 1.;
   for (int i = 0 ; i < 4 ; i++) {
      f += abs(noise(s * P)) / s;
      s *= 2.;
      P = vec3(.866*P.x + .5*P.z, P.y + 100., -.5*P.x + .866*P.z);
   }
   return f;
}

vec3 marble(vec3 pos) {
   float v = turbulence(pos);
   float s = sqrt(.5 + .5 * sin(20. * pos.y + 8. * v));
   return vec3(.8,.7,.5) * vec3(s,s*s,s*s*s);
}

vec3 wood(vec3 pos) {
   pos.y += .5 * turbulence(.4*pos);
   vec3 c = vec3(1.,.42,.15) *
            mix(1.5, .1,
	        .5 + .25 * turbulence(vec3(.5,40.,40.) * pos+2.*sin(pos))
                   + .25 * turbulence(vec3(40.,40.,.5) * pos+2.*sin(pos)));
   c *= .3 + .7 * pow(abs(sin(10. * pos.y)), .4);
   return c;
}

vec3 colorAtPoint(vec3 P) {
    int zeroOrOne = int(mod(floor(P.x/SIZE_VOLUME_GRID)+floor(P.y/SIZE_VOLUME_GRID)+floor(P.z/SIZE_VOLUME_GRID), 2.));
    return (zeroOrOne==0)?firstGridColor:secondGridColor;
}

void main() {
    fragColor = vec4(0.);
    
    vec3 V = uViewPoint;
    vec3 W = normalize(vPos-V);

    vec3 color1 = vec3(0.);

    fragColor = vec4(.225,.2,.2,1.);
    float minX = 1000.;
    for (int n = 0; n < uNumQ; n++) {
        vec2 tI1 = vec2(-1.,1000.);
        for (int i = 3*n ; i < 3*n+3 ; i++) {
            vec2 tQ = findRoots(rayEq(V, W, uQ[i]));
            if (tQ.x > tI1.x) {
                vec3 P = V + tQ.x * W;
                vec3 PC = colorAtPoint(P);
                vec3 N = normalQ(uQ[i], P);
                
                color1 = lightColor*phong(N,light,W,PC,vec4(mix(PC,vec3(1.),.1), 20.));
                color1 += lightColor2*phong(N,light2,W,PC,vec4(mix(PC,vec3(1.),.1), 20.));
                    
                tI1.x = tQ.x;
            }
            if (tQ.y < tI1.y)
                tI1.y = tQ.y;
        }
        if (tI1.x > 0. && tI1.x < tI1.y && tI1.x < minX) {
            fragColor = vec4(sqrt(color1), 1.);
            minX = tI1.x;
        }
    }

}`,Bn=`// Author: TapiocaFox
// Title:  Match The Texture

// Init variables.
const gl = foxGL.gl;
const program = foxGL.program;
const canvas = foxGL.canvas;

let destroyed = false;

const qGlobal = [0,0,0,0,
                 0,0,0,0,
                 0,0,0,0,
                 0,0,0,-1];

const qSphere = [1,0,0,0,
                 0,1,0,0,
                 0,0,1,0,
                 0,0,0,-1];

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
                0,0,0,-1];

const qTubeY = [1,0,0,0,
                0,0,0,0,
                0,0,1,0,
                0,0,0,-1];

const qTubeZ = [1,0,0,0,
                0,1,0,0,
                0,0,0,0,
                0,0,0,-1];

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
const mxm = (a,b) => {
   let m = [];
   for (let c = 0 ; c < 16 ; c += 4)
       for (let r = 0 ; r < 4 ; r++)
          m.push(a[r]*b[c]+a[r+4]*b[c+1]+a[r+8]*b[c+2]+a[r+12]*b[c+3]);
   return m;
}

const transpose = m => [ m[0],m[4],m[ 8],m[12],
                       m[1],m[5],m[ 9],m[13],
                       m[2],m[6],m[10],m[14],
                       m[3],m[7],m[11],m[15] ];

const inverse = src => {
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

const qxm = (Q,M) => {
   let MI = inverse(M);
   return mxm(transpose(MI), mxm(Q, MI));
}

const qsxm = (QS,M) => { // "qs" stands for "Quadric System".
    let newSystem = [];
    for(let n=0; n<QS.length; n++) {
        newSystem.push(qxm(QS[n],M));
    }
    return newSystem;
}

// Predefined systems.
const numObjects = 4;
const sizeScale = .66;
const flags_reveal = new Array(numObjects).fill(false);

const cubeSystem = [qSlabX, qSlabY, qSlabZ]; // Cube
const hourglassSystem = [qSlabX, qConeX, qGlobal]; // Hourglass
const coneSystem = [qConeX, qxm(qSlabX,mxm(scale(.5,1,1),translate(1,0,0))), qGlobal]; // Real cone
const cylinderSystem = [qTubeX, qSlabX, qGlobal]; // Cylinder
const noseSystem = [qParabX, qSlabX, qGlobal]; // Nose
const sphereSystem = [qSphere, qGlobal, qGlobal]; // Sphere

let systemIndex = 1;
const systems = [
    cubeSystem,
    hourglassSystem,
    coneSystem,
    cylinderSystem,
    noseSystem,
    sphereSystem,
]

const systemNames = [
    'Cube',
    'Hourglass',
    'Cone',
    'Cylinder',
    'Nose',
    'Sphere',
]

// Declare listeners.
const onpointermove = async event => {
    const canvasRect = canvas.getBoundingClientRect();
    const canvasHeight = canvasRect.bottom - canvasRect.top;
    const uMouseX = devicePixelRatio*(event.clientX-canvasRect.left);
    const uMouseY = devicePixelRatio*(canvasHeight-(event.clientY-canvasRect.top));
    gl.uniform2f(gl.getUniformLocation(program, 'uMouse'), uMouseX, uMouseY);
    foxGL.reportStatus('uMouse', \`uMouse: (\${uMouseX.toFixed(1)}, \${uMouseY.toFixed(1)})\`);
};

let blipSound = null;

const onclick = async event => {
    blipSound.currentTime = 0;
    blipSound?.play();
    systemIndex = (systemIndex+1)%systems.length;
    foxGL.reportStatus('QSurface', \`Selected system: \${systemNames[systemIndex]}\`, 'blue');
}

const resizeObserver = new ResizeObserver(entries => {
    gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
    foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);
});

// Render per animation frame.
function animate() {
    if(destroyed) return;
    requestAnimationFrame(animate);

    let instances = [];
    
    
    const uTime = (Date.now() - foxGL.startTime) / 1000;
    gl.uniform1f(gl.getUniformLocation(program, 'uTime'), uTime);
    foxGL.reportStatus('uTime', \`uTime: \${uTime.toFixed(2)}\`);

    const cosScale = Math.cos(uTime);
    const scaleSize = 0.1;
    const breath = 1+scaleSize*cosScale;

    const sinTranslation = Math.sin(.66*uTime);
    const cosTranslation = Math.cos(.33*uTime);
    const transaltionScale = .4;
    const translateX = transaltionScale*sinTranslation;
    const translateY = transaltionScale*cosTranslation;

    let transform = scale(.45,.45,.45);
    transform = mxm(transform,translate(translateX,translateY,0));
    transform = mxm(transform,scale(breath,breath,breath));
    transform = mxm(transform,rotateX(.66*uTime));
    transform = mxm(transform,rotateY(.66*uTime));
    // transform = mxm(transform,rotateZ(uTime));
    const finalQSystem = qsxm(systems[systemIndex], transform).flat();
    instances.push(finalQSystem);
    
    gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uQ'), false, instances.flat());
    gl.uniform1i(gl.getUniformLocation(program, 'uNumQ'), numObjects);
    gl.uniform1iv(gl.getUniformLocation(program, 'uF'), flags_reveal);
    
    foxGL.render();
}

// Start lifecycle.
foxGL.onStart(async () => {
    // Set status title.
    foxGL.setStatusTitle('Quadric Surface (System)');
    foxGL.reportStatus('Tips', 'Click to cycle thru systems (shapes).', 'green');
    foxGL.reportStatus('QSurface', \`Selected system: \${systemNames[systemIndex]}\`, 'blue');

    foxGL.getAssetById('hl_blip').then(result => blipSound = result);

    // Setup vertex buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,0, 1,1,0, -1,-1,0, 1,-1,0, -1,-1,0, 1,1,0]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

    // Initial uniform values.
    gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
    foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);
    gl.uniform3f(gl.getUniformLocation(program, 'uViewPoint'), 0, 0, 7);
    
    // Register listeners on start.
    resizeObserver.observe(canvas);
    canvas.addEventListener('pointermove', onpointermove);
    canvas.addEventListener('click', onclick);
    animate();
});

// Stop lifecycle.
foxGL.onStop(async () => {
    // Deregister listeners on stop.
    destroyed = true;
    resizeObserver.disconnect();
    canvas.removeEventListener('pointermove', onpointermove);
    canvas.removeEventListener('click', onclick);
});`,On=`#version 300 es

// Author: TapiocaFox
// Title:  Basic Noise

precision highp float;

#define PI 3.1415926535897932384

in  vec3 vPos;
out vec4 fragColor;

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;

// Noise snippet from Prof. Perlin.
vec3  _s(vec3 i) { return cos(5.*(i+5.*cos(5.*(i.yzx+5.*cos(5.*(i.zxy+5.*cos(5.*i))))))); }
float _t(vec3 i, vec3 u, vec3 a) { return dot(normalize(_s(i + a)), u - a); }
float noise(vec3 p) {
   vec3 i = floor(p), u = p - i, v = 2.*mix(u*u, u*(2.-u)-.5, step(.5,u));
   return mix(mix(mix(_t(i, u, vec3(0.,0.,0.)), _t(i, u, vec3(1.,0.,0.)), v.x),
                  mix(_t(i, u, vec3(0.,1.,0.)), _t(i, u, vec3(1.,1.,0.)), v.x), v.y),
              mix(mix(_t(i, u, vec3(0.,0.,1.)), _t(i, u, vec3(1.,0.,1.)), v.x),
                  mix(_t(i, u, vec3(0.,1.,1.)), _t(i, u, vec3(1.,1.,1.)), v.x), v.y), v.z);
}

void main() {
   vec4 F = vec4(0.);
   float x = 2. * vPos.x;
   float y = 2. * vPos.y;
   float rr = x*x + y*y;
   if (rr < 1.) {
      float z = sqrt(1. - rr);
      float c = .1 + .5 * max(0., x+y+z);
      c *= .5 + noise(40. * vPos - vec3(uTime,0.,0.));
      F = vec4(c,c,c,1.);
   }
   fragColor = vec4(sqrt(F.rgb), F.a);
}`,Un=`#version 300 es

// Author: TapiocaFox
// Title:  Match The Texture

#define SIZE_VOLUME_GRID 0.1
#define SIZE_MAX_SYSTEMS 16

precision highp float;
uniform float uTime;
uniform vec3 uViewPoint;
uniform mat4 uQ[3*SIZE_MAX_SYSTEMS];
uniform int uF[SIZE_MAX_SYSTEMS];
uniform int uS[SIZE_MAX_SYSTEMS];
uniform int uNumQ;
uniform float uSizeGrid;

in  vec3 vPos;
out vec4 fragColor;

vec3 firstGridColor = vec3(.8,.8,.8);
vec3 secondGridColor = vec3(.7,.7,.7);

vec3 light = normalize(vec3(1.,1.,1.));
vec3 lightColor = vec3(.95,.95,1.);
vec3 light2 = normalize(vec3(-1.,-1.,0.));
vec3 lightColor2 = vec3(.9,.5,.5);
vec4 sepcular = vec4(1.,1.,1.,20.);

vec3 rayEq(vec3 V, vec3 W, mat4 Q) {

   float A = Q[0].x, B = Q[1].x+Q[0].y, C = Q[2].x+Q[0].z, D = Q[3].x+Q[0].w,
                     E = Q[1].y       , F = Q[2].y+Q[1].z, G = Q[3].y+Q[1].w,
                                        H = Q[2].z       , I = Q[3].z+Q[2].w,
                                                           J = Q[3].w       ;

   float a = A * W.x * W.x +
             B * W.x * W.y +
             C * W.z * W.x +
             E * W.y * W.y +
             F * W.y * W.z +
             H * W.z * W.z ;

   float b = 2. * A * V.x * W.x +
                  B * (W.x * V.y + V.y * W.x) +
                  C * (V.z * W.x + V.x * W.z) +
                  D * W.x +
             2. * E * V.y * W.y +
                  F * (V.y * W.z + V.z * W.y) +
                  G * W.y +
             2. * H * V.z * W.z +
                  I * W.z;

   float c = A * V.x * V.x +
             B * V.x * V.y +
             C * V.z * V.x +
             D * V.x       +
             E * V.y * V.y +
             F * V.y * V.z +
             G * V.y       +
             H * V.z * V.z +
             I * V.z       +
             J;

   return vec3(a,b,c);
}

vec2 findRoots(vec3 eq) {
    float a = eq.x, b = eq.y, c = eq.z;
    vec2 t = vec2(-1.);
    float discr = b * b - 4. * a * c;
    if (discr >= 0.)
        t = vec2(-b - sqrt(discr), -b + sqrt(discr)) / (2. * a);
    return t;
}

vec3 normalQ(mat4 Q, vec3 P) {
   float A = Q[0].x, B = Q[1].x+Q[0].y, C = Q[2].x+Q[0].z, D = Q[3].x+Q[0].w,
                     E = Q[1].y       , F = Q[2].y+Q[1].z, G = Q[3].y+Q[1].w,
                                        H = Q[2].z       , I = Q[3].z+Q[2].w,
                                                           J = Q[3].w       ;

   return normalize(vec3(2. * A * P.x + C * P.z + B * P.y + D,
                         2. * E * P.y + F * P.z + B * P.x + G,
                         2. * H * P.z + F * P.y + C * P.x + I));
}

vec3 phong(vec3 N, vec3 L, vec3 W,vec3 diffuse, vec4 specular) {
    vec3 shade = vec3(0.);
    shade += diffuse * max(0., dot(L,N)); // Diffuse.
    vec3 reflection = 2.*N*dot(N,L)-L;
    shade += specular.xyz * pow(max(0., dot(-reflection, W)), specular.w); // Specular.
    return shade;
}

// Noise snippet from Prof. Perlin.
vec3  _s(vec3 i) { return cos(5.*(i+5.*cos(5.*(i.yzx+5.*cos(5.*(i.zxy+5.*cos(5.*i))))))); }
float _t(vec3 i, vec3 u, vec3 a) { return dot(normalize(_s(i + a)), u - a); }
float noise(vec3 p) {
   vec3 i = floor(p), u = p - i, v = 2.*mix(u*u, u*(2.-u)-.5, step(.5,u));
   return mix(mix(mix(_t(i, u, vec3(0.,0.,0.)), _t(i, u, vec3(1.,0.,0.)), v.x),
                  mix(_t(i, u, vec3(0.,1.,0.)), _t(i, u, vec3(1.,1.,0.)), v.x), v.y),
              mix(mix(_t(i, u, vec3(0.,0.,1.)), _t(i, u, vec3(1.,0.,1.)), v.x),
                  mix(_t(i, u, vec3(0.,1.,1.)), _t(i, u, vec3(1.,1.,1.)), v.x), v.y), v.z);
}

float fractal(vec3 P) {
    float f = 0., s = 1.;
    for (int i = 0 ; i < 9 ; i++) {
        f += noise(s * P) / s;
        s *= 2.;
        P = vec3(.866*P.x + .5*P.z, P.y + 100., -.5*P.x + .866*P.z);
    }
    return f;
}

float turbulence(vec3 P) {
    float f = 0., s = 1.;
    for (int i = 0 ; i < 4 ; i++) {
        f += abs(noise(s * P)) / s;
        s *= 2.;
        P = vec3(.866*P.x + .5*P.z, P.y + 100., -.5*P.x + .866*P.z);
    }
    return f;
}

vec3 marble(vec3 pos, int seed) {
    pos.z += float(seed);
    float v = turbulence(pos);
    float s = sqrt(.5 + .5 * sin(((.5*sin(float(seed))+.5)*17.+3.) * pos.y + 8. * v));
    return vec3(.8,.7,.5) * vec3(s,s*s,s*s*s);
}

vec3 wood(vec3 pos) {
   pos.y += .5 * turbulence(.4*pos);
   vec3 c = vec3(.7,.4,.1) *
            mix(1.5, .1,
	        .5 + .25 * turbulence(vec3(.5,40.,40.) * pos+2.*sin(pos))
                   + .25 * turbulence(vec3(40.,40.,.5) * pos+2.*sin(pos)));
   c *= .3 + .7 * pow(abs(sin(10. * pos.y)), .4);
   return c;
}

vec3 colorAtPoint(vec3 P) {
    int zeroOrOne = int(mod(floor(P.x/SIZE_VOLUME_GRID)+floor(P.y/SIZE_VOLUME_GRID)+floor(P.z/SIZE_VOLUME_GRID), 2.));
    return (zeroOrOne==0)?firstGridColor:secondGridColor;
}

void main() {
    fragColor = vec4(0.);
    
    vec3 V = uViewPoint;
    vec3 W = normalize(vPos-V);

    vec3 color1 = vec3(0.);

    fragColor = vec4(wood(vPos), 1.);
    float minX = 1000.;
    for (int n = 0; n < uNumQ; n++) {
        vec2 tI1 = vec2(-1.,1000.);
        for (int i = 3*n ; i < 3*n+3 ; i++) {
            vec2 tQ = findRoots(rayEq(V, W, uQ[i]));
            if (tQ.x > tI1.x) {
                vec3 P = V + tQ.x * W;
                vec3 PC = (uF[n]==0)?colorAtPoint(P):marble(mod(P-1., uSizeGrid), uS[n]);
                vec3 N = normalQ(uQ[i], P);
                
                color1 = lightColor*phong(N,light,W,PC,vec4(mix(PC,vec3(1.),.1), 20.));
                color1 += lightColor2*phong(N,light2,W,PC,vec4(mix(PC,vec3(1.),.1), 20.));
                    
                tI1.x = tQ.x;
            }
            if (tQ.y < tI1.y)
                tI1.y = tQ.y;
        }
        if (tI1.x > 0. && tI1.x < tI1.y && tI1.x < minX) {
            fragColor = vec4(sqrt(color1), 1.);
            minX = tI1.x;
        }
    }
}`,Wn=`// Author: TapiocaFox
// Title:  Match The Texture

// Init variables.
const gl = foxGL.gl;
const program = foxGL.program;
const canvas = foxGL.canvas;

let destroyed = false;

const qGlobal = [0,0,0,0,
                 0,0,0,0,
                 0,0,0,0,
                 0,0,0,-1];

const qSphere = [1,0,0,0,
                 0,1,0,0,
                 0,0,1,0,
                 0,0,0,-1];

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
                0,0,0,-1];

const qTubeY = [1,0,0,0,
                0,0,0,0,
                0,0,1,0,
                0,0,0,-1];

const qTubeZ = [1,0,0,0,
                0,1,0,0,
                0,0,0,0,
                0,0,0,-1];

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
const mxm = (a,b) => {
   let m = [];
   for (let c = 0 ; c < 16 ; c += 4)
       for (let r = 0 ; r < 4 ; r++)
          m.push(a[r]*b[c]+a[r+4]*b[c+1]+a[r+8]*b[c+2]+a[r+12]*b[c+3]);
   return m;
}

const transpose = m => [ m[0],m[4],m[ 8],m[12],
                       m[1],m[5],m[ 9],m[13],
                       m[2],m[6],m[10],m[14],
                       m[3],m[7],m[11],m[15] ];

const inverse = src => {
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

const qxm = (Q,M) => {
   let MI = inverse(M);
   return mxm(transpose(MI), mxm(Q, MI));
}

const qsxm = (QS,M) => { // "qs" stands for "Quadric System".
    let newSystem = [];
    for(let n=0; n<QS.length; n++) {
        newSystem.push(qxm(QS[n],M));
    }
    return newSystem;
}

function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function shuffleArray(array) {
  let currentIndex = array.length;
  let randomIndex; 
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--; 
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

// Predefined systems.
const numObjects = 16;
const coolDownTime = 500;

let flags_reveal = new Array(numObjects).fill(false);
let flags_lock = new Array(numObjects).fill(false);
let seedsUnique = Array.from({ length: Math.ceil(numObjects / 2) }, () => randInt(0, 1000));
let seeds = shuffleArray([seedsUnique, seedsUnique].flat());
let seletedSeed = null;
let selectedIndex = null;
let isCoolingDown = false;
let matchCount = 0;

function resetGame() {
    flags_reveal = new Array(numObjects).fill(false);
    flags_lock = new Array(numObjects).fill(false);
    seedsUnique = Array.from({ length: Math.ceil(numObjects / 2) }, () => randInt(0, 1000));
    seeds = shuffleArray([seedsUnique, seedsUnique].flat());
    seletedSeed = null;
    selectedIndex = null;
    isCoolingDown = false;  
    matchCount = 0;
    foxGL.reportStatus('MatchCount', \`Matched Spheres: \${matchCount}\`, 'blue');
}

// console.log(seedsUnique, seeds);

const cubeSystem = [qSlabX, qSlabY, qSlabZ]; // Cube
const hourglassSystem = [qSlabX, qConeX, qGlobal]; // Hourglass
const coneSystem = [qConeX, qxm(qSlabX,mxm(scale(.5,1,1),translate(1,0,0))), qGlobal]; // Real cone
const cylinderSystem = [qTubeX, qSlabX, qGlobal]; // Cylinder
const noseSystem = [qParabX, qSlabX, qGlobal]; // Nose
const sphereSystem = [qSphere, qGlobal, qGlobal]; // Sphere

let systemIndex = 5;
const systems = [
    cubeSystem,
    hourglassSystem,
    coneSystem,
    cylinderSystem,
    noseSystem,
    sphereSystem,
]

const systemNames = [
    'Cube',
    'Hourglass',
    'Cone',
    'Cylinder',
    'Nose',
    'Sphere',
]

let blipSound = null;
let button1Sound = null;
let button2Sound = null;
let gmanWiseSound = null;
let ambientSound = null;

// Declare listeners.
const onpointermove = async event => {
    const canvasRect = canvas.getBoundingClientRect();
    const canvasHeight = canvasRect.bottom - canvasRect.top;
    const uMouseX = devicePixelRatio*(event.clientX-canvasRect.left);
    const uMouseY = devicePixelRatio*(canvasHeight-(event.clientY-canvasRect.top));
    gl.uniform2f(gl.getUniformLocation(program, 'uMouse'), uMouseX, uMouseY);
    foxGL.reportStatus('uMouse', \`uMouse: (\${uMouseX.toFixed(1)}, \${uMouseY.toFixed(1)})\`);
};

const onpointerenter = async event => {
    ambientSound?.play();
};

const onpointerleave = async event => {
    ambientSound?.pause();
};

const onclick = async event => {
    // systemIndex = (systemIndex+1)%systems.length;
    // foxGL.reportStatus('QSurface', \`Selected system: \${systemNames[systemIndex]}\`, 'blue');
    
    blipSound.currentTime = 0;
    blipSound?.play();
    if(isCoolingDown) return;
    const canvasRect = canvas.getBoundingClientRect();
    const canvasHeight = canvasRect.bottom - canvasRect.top;
    const uMouseX = devicePixelRatio*(event.clientX-canvasRect.left);
    const uMouseY = devicePixelRatio*(canvasHeight-(event.clientY-canvasRect.top));
    const col = Math.floor((uMouseX/canvas.width)/(1/numGridSlice));
    const row = Math.floor((uMouseY/canvas.height)/(1/numGridSlice));
    const index = col+numGridSlice*row;
    if(index == selectedIndex || flags_lock[index]) return;
    if(seletedSeed == null) {
        flags_reveal[index] = true;
        seletedSeed = seeds[index];
        selectedIndex = index;
    }
    else if(seeds[index] != seletedSeed) {
        flags_reveal[index] = true;
        button2Sound.currentTime = 0;
        button2Sound?.play();
        isCoolingDown = true;
        setTimeout(() => {
            isCoolingDown = false;
            flags_reveal[selectedIndex] = false;
            flags_reveal[index] = false;
            seletedSeed = null;
            selectedIndex = null;
        }, coolDownTime);
    }
    else {
        flags_reveal[index] = true;
        flags_lock[index] = true;
        flags_lock[selectedIndex] = true;
        button1Sound.currentTime = 0;
        button1Sound?.play();
        seletedSeed = null;
        selectedIndex = null;
        matchCount += 2;
        foxGL.reportStatus('MatchCount', \`Matched Spheres: \${matchCount}\`, 'blue');
        if(matchCount == numObjects) {
            gmanWiseSound.currentTime = 0;
            gmanWiseSound?.play();
            setTimeout(() => {
                foxGL.reportStatus('MatchCount', \`Matched Spheres: \${matchCount}\`, 'blue');
                resetGame();
            }, 16*coolDownTime);
        }
    }
    foxGL.reportStatus('ClickPos', \`Click Position: (\${uMouseX.toFixed(1)} [\${col}], \${uMouseY.toFixed(1)} [\${row}])\`);
}

const resizeObserver = new ResizeObserver(entries => {
    gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
    foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);
});

const nearest_sq = n => Math.ceil(Math.sqrt(n));
const numGridSlice = nearest_sq(numObjects);

// Render per animation frame.
function animate() {
    if(destroyed) return;
    requestAnimationFrame(animate);

    let instances = [];
    
    const uTime = (Date.now() - foxGL.startTime) / 1000;
    gl.uniform1f(gl.getUniformLocation(program, 'uTime'), uTime);
    foxGL.reportStatus('uTime', \`uTime: \${uTime.toFixed(2)}\`);

    let uniformTransform = scale(1/numGridSlice,1/numGridSlice,1/numGridSlice);

    for(let i=0; i<numGridSlice; i++) {
        for(let j=0; j<numGridSlice; j++) {
            const translateX = (2*j)-(numGridSlice-1);
            const translateY = (2*i)-(numGridSlice-1);
            const translateZ = (matchCount == numObjects)?2*Math.sin(uTime+i+j):.25*Math.sin(uTime+i+j);
            const transform = mxm(uniformTransform,translate(translateX, translateY, translateZ));
            const finalQSystem = qsxm(systems[systemIndex], transform).flat();
            instances.push(finalQSystem);
        }
    }
    

    // instances.push(systems[2].flat());
    
    gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uQ'), false, instances.flat());
    gl.uniform1iv(gl.getUniformLocation(program, 'uF'), flags_reveal);
    gl.uniform1iv(gl.getUniformLocation(program, 'uS'), seeds);
    
    // console.log(numObjects);
    
    foxGL.render();
}

// Start lifecycle.
foxGL.onStart(async () => {
    // Set status title.
    foxGL.setStatusTitle('Match The Texture');
    foxGL.reportStatus('Tips', 'Click to reveal texture to Gman.', 'green');
    foxGL.reportStatus('MatchCount', \`Matched Spheres: \${matchCount}\`, 'blue');

    foxGL.getAssetById('hl_blip1').then(result => blipSound = result);
    foxGL.getAssetById('hl_button1').then(result => button1Sound = result);
    foxGL.getAssetById('hl_button2').then(result => button2Sound = result);
    foxGL.getAssetById('hl_gman_wise').then(result => gmanWiseSound = result);
    // foxGL.getAssetById('hl_industrial1').then(result => {ambientSound = result; ambientSound.loop=true;});

    // Setup vertex buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,0, 1,1,0, -1,-1,0, 1,-1,0, -1,-1,0, 1,1,0]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

    // Initial uniform values.
    gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
    foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);
    gl.uniform3f(gl.getUniformLocation(program, 'uViewPoint'), 0, 0, 7);
    gl.uniform1i(gl.getUniformLocation(program, 'uNumQ'), numObjects);
    gl.uniform1f(gl.getUniformLocation(program, 'uSizeGrid'), 2/numGridSlice);
    
    // Register listeners on start.
    resizeObserver.observe(canvas);
    canvas.addEventListener('pointermove', onpointermove);
    canvas.addEventListener('pointerenter', onpointerenter);
    canvas.addEventListener('pointerleave', onpointerleave);
    canvas.addEventListener('click', onclick);
    animate();
});

// Stop lifecycle.
foxGL.onStop(async () => {
    // Deregister listeners on stop.
    destroyed = true;
    resizeObserver.disconnect();
    canvas.removeEventListener('pointermove', onpointermove);
    canvas.removeEventListener('pointerenter', onpointerenter);
    canvas.removeEventListener('pointerleave', onpointerleave);
    canvas.removeEventListener('click', onclick);
});`,X=""+new URL("../assets/blip1.Db9rI5k-.wav",import.meta.url).href,Dn=""+new URL("../assets/button1.Cro1Iv89.wav",import.meta.url).href,qn=""+new URL("../assets/button2.BmEnIolR.wav",import.meta.url).href,Vn=""+new URL("../assets/industrial1.B-SN7Icb.wav",import.meta.url).href,Xn=""+new URL("../assets/gman_wise.CYiLjyZP.wav",import.meta.url).href,Qn=`#version 300 es

// Author: TapiocaFox
// Title: Bump Magnifier Distortion

precision highp float;

#define RADIUS_POINTER 0.033
#define GAP_GRID 0.125
#define SIZE_HALF_STROKE 0.01
#define SIZE_BUMP_RADIUS 0.35
#define SIZE_BUMP_HEIGHT .1
#define SIZE_BUMP_HEIGHT_R .08
#define SIZE_BUMP_HEIGHT_G .1
#define SIZE_BUMP_HEIGHT_B .12

in  vec3 vPos;
out vec4 fragColor;

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;

vec3 light = normalize(vec3(1., 1., 1.));
vec4 specular = vec4(.3, .3, .3, 10.);

float bump_derivative(float x) {
    float x_sqr_minus_one = min(x*x-1.,-.001); // min to prevent divided by zero.
    // float x_sqr_minus_one = x*x-1.; // min to prevent divide by zero.
    return step(-1.,-abs(x))*-2.*x*exp(1./x_sqr_minus_one)/(x_sqr_minus_one*x_sqr_minus_one);
}

float point(vec2 st, vec2 center) {
    float dist = distance(st, center);
    return 1.-smoothstep(RADIUS_POINTER-.005, RADIUS_POINTER+.005, dist);
}

float grid(vec2 st) {
    vec2 mod_st = mod(st, GAP_GRID);
    vec2 pct_st = smoothstep(GAP_GRID-SIZE_HALF_STROKE, GAP_GRID, mod_st) + smoothstep(-SIZE_HALF_STROKE, 0., -mod_st);
    return max(pct_st.x, pct_st.y);
}

vec3 magnify(vec2 st, vec2 center, float height, float radius) { // Magnifier distortion.
    float dist = distance(st, center);
    float derivative = bump_derivative(dist/radius);
    vec2 direction = normalize(st-center);
    vec3 T = normalize(vec3(direction, derivative)); // Tangent
    vec3 BT = normalize(cross(T, vec3(direction, 0.))); // BiTangent
    vec3 N = cross(T, BT); // Normal
    // vec3 reflection = 2.*N*dot(N,light)-light;
    vec3 reflection = reflect(light, N);
    float specularIntensity = pow(max(0., -reflection.z), specular.w);
    // float specularIntensity = -reflection.z;
    // float specularIntensity = BT.z;
    return vec3(st+height*derivative*direction, specularIntensity);
}

void main() {
    vec2 st = vPos.xy;
    vec2 stMouse = uMouse/uResolution.xy *2. - 1.;
    st.x *= uResolution.x/uResolution.y;
    stMouse.x *= uResolution.x/uResolution.y;

    vec3 stMagnifiedR = magnify(st, stMouse, SIZE_BUMP_HEIGHT_R, SIZE_BUMP_RADIUS);
    vec3 stMagnifiedG = magnify(st, stMouse, SIZE_BUMP_HEIGHT_G, SIZE_BUMP_RADIUS);
    vec3 stMagnifiedB = magnify(st, stMouse, SIZE_BUMP_HEIGHT_B, SIZE_BUMP_RADIUS);

    float principleSpecular = stMagnifiedG.z;

    vec3 colorPointer = vec3(0., 1., 0.);
    // vec3 colorGrid = vec3(.95, .95, .95);
    vec3 colorGrid = vec3(1.);
    vec3 colorBG = vec3(.7,.7,.7);
    // vec3 colorGrid = vec3(0.0, 0.0, 0.0);
    
	float pct = point(st, stMouse);
    float pctGrid = grid(st);
    float pctGridR = grid(stMagnifiedR.xy);
    float pctGridG = grid(stMagnifiedG.xy);
    float pctGridB = grid(stMagnifiedB.xy);

    float dist = distance(st, stMouse);
    
    vec3 color = vec3(mix(colorBG.x, colorGrid.x, pctGridR), mix(colorBG.y, colorGrid.y, pctGridG), mix(colorBG.z, colorGrid.z, pctGridB));
    color = mix(color, colorPointer, pct);
    color += color*specular.xyz*principleSpecular;
    fragColor = vec4(color,1.0);
}`,Yn="data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='utf-8'?%3e%3c!--%20Uploaded%20to:%20SVG%20Repo,%20www.svgrepo.com,%20Generator:%20SVG%20Repo%20Mixer%20Tools%20--%3e%3csvg%20fill='%23000000'%20width='800px'%20height='800px'%20viewBox='0%200%2024%2024'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M12,2%20C14.1421954,2%2015.8910789,3.68396847%2015.9951047,5.80035966%20L16,6%20L16.0009007,6.17102423%20C16.8482841,6.47083722%2017.5208107,7.14059603%2017.8243776,7.98619771%20C18.3775427,7.93308996%2018.8969141,7.68887231%2019.2928932,7.29289322%20C19.7003708,6.88541564%2019.9471452,6.3472755%2019.9924253,5.77695139%20L20,5.58578644%20L20,5%20L20.0067277,4.88337887%20C20.0644928,4.38604019%2020.4871642,4%2021,4%20C21.5128358,4%2021.9355072,4.38604019%2021.9932723,4.88337887%20L22,5%20L22,5.58578644%20L21.9938294,5.81921837%20C21.9363787,6.90490079%2021.479744,7.93446953%2020.7071068,8.70710678%20C19.9777124,9.43650119%2019.0193415,9.88427517%2018.0009458,9.98044661%20L18,12%20L21,12%20C21.5522847,12%2022,12.4477153%2022,13%20C22,13.5522847%2021.5522847,14%2021,14%20L18,14%20L18.0009458,16.0195534%20C19.0193415,16.1157248%2019.9777124,16.5634988%2020.7071068,17.2928932%20C21.479744,18.0655305%2021.9363787,19.0950992%2021.9938294,20.1807816%20L22,20.4142136%20L22,21%20C22,21.5522847%2021.5522847,22%2021,22%20C20.4871642,22%2020.0644928,21.6139598%2020.0067277,21.1166211%20L20,21%20L20,20.4142136%20C20,19.7739243%2019.7456461,19.1598596%2019.2928932,18.7071068%20C18.8854156,18.2996292%2018.3472755,18.0528548%2017.7769514,18.0075747%20L17.6572765,18.0037085%20C16.8325575,20.3321558%2014.6110517,22%2012,22%20C9.38894833,22%207.16744253,20.3321558%206.34272355,18.0037085%20L6.22304861,18.0075747%20C5.6527245,18.0528548%205.11458436,18.2996292%204.70710678,18.7071068%20C4.2996292,19.1145844%204.05285477,19.6527245%204.00757466,20.2230486%20L4,20.4142136%20L4,21%20L3.99327227,21.1166211%20C3.93550716,21.6139598%203.51283584,22%203,22%20C2.48716416,22%202.06449284,21.6139598%202.00672773,21.1166211%20L2,21%20L2,20.4142136%20L2.00617059,20.1807816%20C2.06362127,19.0950992%202.52025597,18.0655305%203.29289322,17.2928932%20C4.02252654,16.5632599%204.98128639,16.1154315%206.00005498,16.019459%20L6,14%20L3,14%20C2.44771525,14%202,13.5522847%202,13%20C2,12.4477153%202.44771525,12%203,12%20L6,12%20L6.00005498,9.980541%20C4.98128639,9.88456847%204.02252654,9.4367401%203.29289322,8.70710678%20C2.52025597,7.93446953%202.06362127,6.90490079%202.00617059,5.81921837%20L2,5.58578644%20L2,5%20C2,4.44771525%202.44771525,4%203,4%20C3.51283584,4%203.93550716,4.38604019%203.99327227,4.88337887%20L4,5%20L4,5.58578644%20C4,6.22607568%204.25435391,6.84014035%204.70710678,7.29289322%20C5.10308588,7.68887231%205.62245732,7.93308996%206.1748463,7.98811167%20C6.47930745,7.14026687%207.15223954,6.47031582%208.00008893,6.17067428%20L8,6%20C8,3.790861%209.790861,2%2012,2%20Z%20M15,8%20L9,8%20C8.48716416,8%208.06449284,8.38604019%208.00672773,8.88337887%20L8,9%20L8,16%20C8,18.209139%209.790861,20%2012,20%20C14.1421954,20%2015.8910789,18.3160315%2015.9951047,16.1996403%20L16,16%20L16,9%20C16,8.48716416%2015.6139598,8.06449284%2015.1166211,8.00672773%20L15,8%20Z%20M12,4%20C10.9456382,4%2010.0818349,4.81587779%2010.0054857,5.85073766%20L10,6%20L14,6%20C14,4.99835629%2013.2636703,4.16869161%2012.3027743,4.0227694%20L12.1492623,4.00548574%20L12,4%20Z'/%3e%3c/svg%3e";var Hn=T('<h3>Debug</h3> <p class="annotation">WebGL2 shaders for debugging.</p> <div class="flex_grid gallery"><div class="item webgl-item svelte-ahq8ot"><!></div> <div class="item webgl-item svelte-ahq8ot"><!></div></div> <h3>Debug (Preview mode)</h3> <p class="annotation">WebGL2 shaders for debugging.</p> <div class="flex_grid gallery"><div class="item webgl-item svelte-ahq8ot"><!></div> <div class="item webgl-item svelte-ahq8ot"><!></div> <div class="item webgl-item svelte-ahq8ot"><!></div></div>',1),kn=T('<div class="item webgl-item svelte-ahq8ot"><!></div>'),jn=T('<h3> </h3> <p class="annotation"> </p> <div class="flex_grid gallery"></div>',1),Zn=T("<!> <!>  <!> <!>",1);function ce(Q,Y){on(Y,!0);let s=cn("all"),H=rn([{title:"Practice One",description:"Abstract fragment shader patterns animated over time. Some of them are interactive with mouse position. (Part of assignment one.)",practices:[{frag:dn,categories:["distortion"]},{frag:gn,categories:[]},{frag:An,js:_,categories:["distortion"]},{frag:wn,js:_,categories:[]},{frag:xn,categories:["noise"]}]},{title:"Practice Two",description:"Ray casting of spheres, phong reflection, quadric surfaces and transformations. (Part of assignment two and three.)",practices:[{frag:zn,js:Fn,categories:["raycasting"]},{frag:Mn,js:En,assets:{hl_deactivated:{id:"hl_deactivated",type:"audio",srcType:"link",src:V},hl_activated:{id:"hl_activated",type:"audio",srcType:"link",src:q}},categories:["noise","raycasting"]},{frag:Cn,js:Gn,assets:{hl_deactivated:{id:"hl_deactivated",type:"audio",srcType:"link",src:V},hl_activated:{id:"hl_activated",type:"audio",srcType:"link",src:q}},categories:["noise","raycasting"]},{frag:Nn,js:Bn,assets:{hl_blip:{id:"hl_blip",type:"audio",srcType:"link",src:X}},categories:["raycasting"]}]},{title:"Practice Three",description:"Procedural texture generation. (Part of assignment four.)",practices:[{frag:On,categories:["noise"]},{frag:Sn,js:yn,assets:{hl_alien_blipper:{id:"hl_alien_blipper",type:"audio",srcType:"link",src:hn},hl_alienappeal:{id:"hl_alienappeal",type:"audio",srcType:"link",src:pn}},categories:["noise"]},{frag:Un,js:Wn,assets:{hl_button1:{id:"hl_button1",type:"audio",srcType:"link",src:Dn},hl_button2:{id:"hl_button_2",type:"audio",srcType:"link",src:qn},hl_blip1:{id:"hl_blip1",type:"audio",srcType:"link",src:X},hl_industrial1:{id:"hl_industrial1",type:"audio",srcType:"link",src:Vn},hl_gman_wise:{id:"hl_gman_wise",type:"audio",srcType:"link",src:Xn}},categories:["noise","raycasting"]}]},{title:"Unorganized",description:"Things that are not organized to any cluster yet.",practices:[{frag:Qn,js:w,categories:["distortion"]},{vert:Tn,frag:Ln,js:Rn,assets:{uvmap:{id:"uvmap",type:"image",srcType:"link",src:In},hl_button:{id:"hl_button",type:"audio",srcType:"link",src:Pn}},categories:[]}]}]);var M=Zn(),E=y(M);vn(E,{text:"Graphics"});var C=r(E,2);{let a=S(()=>[null,null,null,null,Yn,U,U]);un(C,{names:["All categories","Noise","Distortion","Ray casting","Debug","Editor"],get inline_icons(){return n(a)},values:["all","noise","distortion","raycasting","debug","editor"],dividers:["debug"],get selected_value(){return n(s)},callback:o=>{o=="editor"?_n("/webgl_editor"):an(s,o,!0)}})}var G=r(C,2);{var k=a=>{var o=Hn(),c=r(y(o),4),g=i(c),L=i(g);m(L,{get vertex_shader(){return d},get fragment_shader(){return W},get javascript(){return w}}),t(g);var l=r(g,2),u=i(l);m(u,{get vertex_shader(){return d},get fragment_shader(){return D},get javascript(){return _}}),t(l),t(c);var v=r(c,6),x=i(v),p=i(x);m(p,{get vertex_shader(){return d},get fragment_shader(){return W},get javascript(){return w},mode:"preview"}),t(x);var h=r(x,2),b=i(h);m(b,{get vertex_shader(){return d},get fragment_shader(){return D},get javascript(){return _},mode:"preview"}),t(h);var R=r(h,2),e=i(R);m(e,{get vertex_shader(){return d},get fragment_shader(){return bn},get javascript(){return _},mode:"preview"}),t(R),t(v),f(a,o)};A(G,a=>{n(s)=="debug"&&a(k)})}var j=r(G,2);B(j,17,()=>H,O,(a,o)=>{var c=F(),g=y(c);{var L=l=>{var u=jn(),v=y(u),x=i(v,!0);t(v);var p=r(v,2),h=i(p,!0);t(p);var b=r(p,2);B(b,21,()=>n(o).practices,O,(R,e)=>{var z=F(),Z=y(z);{var $=I=>{var P=kn(),K=i(P);{let J=S(()=>n(e).vert?n(e).vert:d),nn=S(()=>n(e).frag?n(e).frag:fn),en=S(()=>n(e).js?n(e).js:mn),tn=S(()=>n(e).assets?n(e).assets:{});m(K,{get vertex_shader(){return n(J)},get fragment_shader(){return n(nn)},get javascript(){return n(en)},get assets(){return n(tn)}})}t(P),f(I,P)};A(Z,I=>{(n(s)=="all"||n(e).categories.includes(n(s)))&&I($)})}f(R,z)}),t(b),ln(()=>{N(x,n(o).title),N(h,n(o).description)}),f(l,u)};A(g,l=>{n(o).practices.filter(u=>n(s)=="all"||u.categories.includes(n(s))).length>0&&l(L)})}f(a,c)}),f(Q,M),sn()}export{ce as component};
