import"../chunks/DsnmJJEf.js";import{p as ge,aG as pe,f as C,e as L,a as m,b as xe,s as a,x as he,v as e,w as ye,az as r,n as _e,ay as be,c as s,r as i,g as W,t as Se}from"../chunks/8wfNHnlc.js";import{s as X}from"../chunks/D-MeLBsU.js";import{i as F}from"../chunks/BMSRtp_v.js";import{e as V,i as k}from"../chunks/Bj7HpYt_.js";import{C as Te}from"../chunks/CkR0S-SN.js";import{H as Le}from"../chunks/CeOPx1vY.js";import{p as Re,T as g,d as p,b as we,m as Ae}from"../chunks/De1n8GzK.js";import{g as x,d as h,b as A,c as I,m as M,a as H,p as Q}from"../chunks/BlVQdq4K.js";import{f as y,q,p as D}from"../chunks/BDQL6AsC.js";import{u as G}from"../chunks/BtcYDmCC.js";import{m as $}from"../chunks/8p4Ra2kK.js";import{r as Ie,h as Z,b as j,c as Me,a as Ce,d as Pe,e as ze,f as Ee,l as Fe}from"../chunks/CG14RY4c.js";import{f as De}from"../chunks/C5QCpJDc.js";import{h as Ge,s as Be}from"../chunks/DZiIyR_-.js";import"../chunks/xXA0C5zs.js";const Ne=`#version 300 es

// Author: TapiocaFox
// Title: Balls

precision highp float;

#define P_RADIUS 0.2
#define TIME_DELAY 0.05
#define NUM_BALLS 16
#define PI 3.1415926535897932
#define RATIO_TIME 0.66

in  vec3 vPos;
out vec4 fragColor;

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;

vec3 lightDirectional = normalize(vec3(1., 1., 2.));
vec3 lightAmbient = vec3(0.7,0.78,0.92);

void main() {
	vec4 color = vec4(0., 0., 0., 1.);
    for(int i=0; i<NUM_BALLS; i++) {
        vec2 st = vPos.xy;
    	st.x *= uResolution.x/uResolution.y;
        
        for(int j=0; j<3; j++) {
            float uTimeInChannel = RATIO_TIME*uTime+(.5*sin(RATIO_TIME*uTime+3.*float(i+1)))-float(3-j)*TIME_DELAY;
        	// float uTimeInChannel = uTime-float(j)*TIME_DELAY;

            vec2 stInChannel = st;
            stInChannel.x -= sin(.5*uTimeInChannel+float(i));    
            stInChannel.y -= sin(2.*uTimeInChannel+float(i));

            float z = sqrt(P_RADIUS*P_RADIUS-stInChannel.x*stInChannel.x-stInChannel.y*stInChannel.y);

            vec3 stp = vec3(stInChannel, z);

            if(z>0.) {
                float diffuse = dot(normalize(stp), lightDirectional);
                color[j] = lightAmbient[j]+diffuse;
                color[3] = 1.;
            }
        }
    }
	fragColor = color;
}`,Ue=`#version 300 es

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
}`,Oe=`#version 300 es

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
}`,K=`#version 300 es

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
}`,Ye=`// Author: TapiocaFox
// Title:  Mozilla Texture Load
import { mat4 } from 'https://cdn.jsdelivr.net/npm/gl-matrix@3.4.3/esm/index.js';

// Init variables.
let gl, program, canvas;
let destroyed = false;
let onpointermove, onclick, resizeObserver;

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

export const title = 'Mozilla Texture Load';

// Start lifecycle.
export const start = async (foxGL) => {
    gl = foxGL.gl;
    program = foxGL.program;
    canvas = foxGL.canvas;
    
    // await foxGL.loadScriptFromSource('https://cdnjs.cloudflare.com/ajax/libs/gl-matrix/2.8.1/gl-matrix-min.js');

    // Setup vertex buffer.
    const buffers = initBuffers(gl);
    
    // console.log({...foxGL.assets});
    // Load texture
    const textureImage = await foxGL.getAssetById('uvmap');
    const texture = loadTexture(gl, textureImage);
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
    
    const buttonSound = await foxGL.getAssetById('hl_button');
    // buttonSound.play();
    
    // setTextureAttribute.
    setTextureAttribute(gl, buffers, programInfo);
    // Flip image pixels into the bottom-to-top order that WebGL expects.
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    
    foxGL.reportStatus('Tips', 'Click to make noises.', 'green');

    // Initial uniform values.
    gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
    foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);

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
        foxGL.reportFrame();
    }

    // Declare listeners.
    onpointermove = async event => {
        const canvasRect = canvas.getBoundingClientRect();
        const canvasHeight = canvasRect.bottom - canvasRect.top;
        const uMouseX = devicePixelRatio*(event.clientX-canvasRect.left);
        const uMouseY = devicePixelRatio*(canvasHeight-(event.clientY-canvasRect.top));
        gl.uniform2f(gl.getUniformLocation(program, 'uMouse'), uMouseX, uMouseY);
        foxGL.reportStatus('uMouse', \`uMouse: (\${uMouseX.toFixed(1)}, \${uMouseY.toFixed(1)})\`);
    };
    
    onclick = async event => {
        buttonSound.currentTime = 0;
        buttonSound?.play();
    };
    
    resizeObserver = new ResizeObserver(entries => {
        gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
        foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);
    });
        
    // Register listeners on start.
    resizeObserver.observe(canvas);
    canvas.addEventListener('pointermove', onpointermove);
    canvas.addEventListener('click', onclick);
    animate();
};

// Stop lifecycle.
export const stop = async (foxGL) => {
    // Deregister listeners on stop.
    destroyed = true;
    resizeObserver.disconnect();
    if(onpointermove) canvas.removeEventListener('pointermove', onpointermove);
    if(onclick) canvas.removeEventListener('click', onclick);
};`,We=`// Author: TapiocaFox
// Title:  Mozilla Texture Load

attribute vec4 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec2 vTextureCoord;

void main(void) {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  vTextureCoord = aTextureCoord;
}`,Xe=`// Author: TapiocaFox
// Title:  Mozilla Texture Load

varying highp vec2 vTextureCoord;

uniform sampler2D uSampler;

void main(void) {
  gl_FragColor = texture2D(uSampler, vTextureCoord);
}`,Ve=""+new URL("../assets/uvmap_grid.Dk-1NtMV.jpg",import.meta.url).href,ke=""+new URL("../assets/hl_button3.oGfxuWLl.wav",import.meta.url).href,J=""+new URL("../assets/mouse.BRMCOIP8.png",import.meta.url).href,ee=""+new URL("../assets/sin.CY2tZg0W.png",import.meta.url).href,He=""+new URL("../assets/snoise.bM6HzEiE.png",import.meta.url).href,Qe=""+new URL("../assets/texture_preview.D_Ubc_ew.png",import.meta.url).href,qe=`#version 300 es

// Author: TapiocaFox
// Title: Adhesive

precision highp float;

#define PI 3.14159265358979
#define RADIUS 0.75
#define RATIO_TIME 0.66

in  vec3 vPos;
out vec4 fragColor;

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;

void main() {
    vec2 st = vPos.xy;
    st.x *= uResolution.x/uResolution.y;
    
    float r = RADIUS;
    vec3 light = vec3(1., 1., 2.);
    
    st.x += sin(5.*st.x+PI*RATIO_TIME*uTime);      
    st.x += sin(5.*st.y-PI*RATIO_TIME*uTime);    
    st.y += sin(5.*st.y+PI*RATIO_TIME*uTime);
    st.y += sin(5.*st.x+PI*RATIO_TIME*uTime);    


    float z = sqrt(r*r - st.x*st.x - st.y*st.y);
    
    vec3 stp = vec3(st, z);
    
    if(stp.p>0.) {
    	vec3 color = vec3(0.);
    	color = vec3(st.x,st.y,abs(sin(RATIO_TIME*uTime)));
        float diffuse = step(abs(sin(RATIO_TIME*uTime)),dot(stp, light));
        fragColor = vec4(vec3(diffuse)+color,1.0);
    }
    else {
        fragColor = vec4(0.,0.,0.,1.0);
    }
}`,$e=`#version 300 es

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
}`,Ze=""+new URL("../assets/adhesive.CoyZhOej.png",import.meta.url).href,je=""+new URL("../assets/balls.C_HuT92j.png",import.meta.url).href,Ke=""+new URL("../assets/fiber.6rqN6YZp.png",import.meta.url).href,Je=""+new URL("../assets/array.CODMIKtH.png",import.meta.url).href,en=""+new URL("../assets/radiant.VLNVa-2n.png",import.meta.url).href,nn=`#version 300 es

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
}`,tn=`// Author: TapiocaFox
// Title:  Phong Reflective Spheres

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

export const title = 'Phong Reflective Spheres';

// Start lifecycle.
export const start = async (foxGL) => {
    gl = foxGL.gl;
    program = foxGL.program;
    canvas = foxGL.canvas;
    
    let enlarge = false;
    
    // Set status title.
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
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        foxGL.reportFrame();
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
        foxGL.reportStatus('uMouse', \`uMouse: (\${uMouseX.toFixed(1)}, \${uMouseY.toFixed(1)})\`);
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
        foxGL.reportStatus('enlarge', \`Enlarged: \${enlarge}\`, enlarge?'blue':'red');
    };
    
    onpointerleave = async event => {
        usePointer = false;
    };
    
    resizeObserver = new ResizeObserver(entries => {
        gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
        foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);
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
};`,on=`#version 300 es

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
}`,rn=`// Author: TapiocaFox
// Title:  Phong Reflection

// Init variables.
let gl, program, canvas;
let destroyed = false;
let onpointermove, onpointerleave, resizeObserver;

const PI = 3.141592653589793;
const NS = 1;
const NL = 2;

// Math.
const normalize = v => {
   let s = Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2]);
   return [ v[0]/s, v[1]/s, v[2]/s ];
}

export const title = 'Phong Reflection';

// Start lifecycle.
export const start = async (foxGL) => {
    gl = foxGL.gl;
    program = foxGL.program;
    canvas = foxGL.canvas;

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
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        foxGL.reportFrame();
        firstFrameRendered = true;
    }
    
    let usePointer = false;
    let uMouseX = 0;
    let uMouseY = 0;
    let firstFrameRendered = false;
    
    // Declare listeners.
    onpointermove = async event => {
        usePointer = true;
        const canvasRect = canvas.getBoundingClientRect();
        const canvasHeight = canvasRect.bottom - canvasRect.top;
        uMouseX = devicePixelRatio*(event.clientX-canvasRect.left);
        uMouseY = devicePixelRatio*(canvasHeight-(event.clientY-canvasRect.top));
        gl.uniform2f(gl.getUniformLocation(program, 'uMouse'), uMouseX, uMouseY);
        foxGL.reportStatus('uMouse', \`uMouse: (\${uMouseX.toFixed(1)}, \${uMouseY.toFixed(1)})\`);
    };
    
    onpointerleave = async event => {
        usePointer = false;
    };
    
    resizeObserver = new ResizeObserver(entries => {
        gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
        foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);
        firstFrameRendered = false;
        animate();
    });
    
    // Register listeners on start.
    resizeObserver.observe(canvas);
    canvas.addEventListener('pointermove', onpointermove);
    canvas.addEventListener('pointerleave', onpointerleave);
    animate();
};

// Stop lifecycle.
export const stop = async (foxGL) => {
    // Deregister listeners on stop.
    destroyed = true;
    if(resizeObserver) resizeObserver.disconnect();
    if(onpointermove) canvas.removeEventListener('pointermove', onpointermove);
    if(onpointerleave) canvas.removeEventListener('pointerleave', onpointerleave);
};`,an=`#version 300 es

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

}`,sn=`// Author: TapiocaFox
// Title:  Quadric Surface (System)

import {qGlobal, qSphere, qParabX, qParabY, qParabZ, qSlabX, qSlabY, qSlabZ, qTubeX, qTubeY, qTubeZ, qConeX, qConeY, qConeZ, cubeSystem, hourglassSystem, coneSystem, cylinderSystem, noseSystem, sphereSystem} from 'quadric_matrix';
import { mxm, qxm, scale, translate, rotateX, rotateY } from 'matrix';

// Init variables.
let gl, program, canvas;
let destroyed = false;
let onpointermove, onclick, resizeObserver;

const qsxm = (QS,M) => { // "qs" stands for "qmtrx System".
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

export const title = 'Quadric Surface (System)';

// Start lifecycle.
export const start = async (foxGL) => {
    gl = foxGL.gl;
    program = foxGL.program;
    canvas = foxGL.canvas;
    
    // Set status title.
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

    let blipSound = null;
    
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
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        foxGL.reportFrame();
    }

    // Declare listeners.
    onpointermove = async event => {
        const canvasRect = canvas.getBoundingClientRect();
        const canvasHeight = canvasRect.bottom - canvasRect.top;
        const uMouseX = devicePixelRatio*(event.clientX-canvasRect.left);
        const uMouseY = devicePixelRatio*(canvasHeight-(event.clientY-canvasRect.top));
        gl.uniform2f(gl.getUniformLocation(program, 'uMouse'), uMouseX, uMouseY);
        foxGL.reportStatus('uMouse', \`uMouse: (\${uMouseX.toFixed(1)}, \${uMouseY.toFixed(1)})\`);
    };
    
    onclick = async event => {
        blipSound.currentTime = 0;
        blipSound?.play();
        systemIndex = (systemIndex+1)%systems.length;
        foxGL.reportStatus('QSurface', \`Selected system: \${systemNames[systemIndex]}\`, 'blue');
    }
    
    resizeObserver = new ResizeObserver(entries => {
        gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
        foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);
    });
    
    // Register listeners on start.
    resizeObserver.observe(canvas);
    canvas.addEventListener('pointermove', onpointermove);
    canvas.addEventListener('click', onclick);
    animate();
};

// Stop lifecycle.
export const stop = async (foxGL) => {
    // Deregister listeners on stop.
    destroyed = true;
    if(resizeObserver) resizeObserver.disconnect();
    if(onpointermove) canvas.removeEventListener('pointermove', onpointermove);
    if(onclick) canvas.removeEventListener('click', onclick);
};`,ln=""+new URL("../assets/phong.jy2h7Dh5.png",import.meta.url).href,cn=""+new URL("../assets/phong_reflective_spheres.9emOiDdY.png",import.meta.url).href,un=""+new URL("../assets/reflective_refractive_spheres.DYxa_cRM.png",import.meta.url).href,mn=""+new URL("../assets/quadric_system.COhk_K8o.png",import.meta.url).href,dn=`#version 300 es

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
}`,fn=`// Author: TapiocaFox
// Title:  Match The Texture

import {qGlobal, qSphere, qParabX, qParabY, qParabZ, qSlabX, qSlabY, qSlabZ, qTubeX, qTubeY, qTubeZ, qConeX, qConeY, qConeZ, cubeSystem, hourglassSystem, coneSystem, cylinderSystem, noseSystem, sphereSystem} from 'quadric_matrix';
import { mxm, qxm, scale, translate, rotateX, rotateY } from 'matrix';

// Init variables.
let gl, program, canvas;
let destroyed = false;
let onpointermove, onpointerenter, onpointerleave, onclick, resizeObserver;

const qsxm = (QS,M) => { // "qs" stands for "Quadric System".
    let newSystem = [];
    for(let n=0; n<QS.length; n++) {
        newSystem.push(qxm(QS[n],M));
    }
    return newSystem;
}

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

const nearest_sq = n => Math.ceil(Math.sqrt(n));

const numObjects = 16;
const numGridSlice = nearest_sq(numObjects);
const coolDownTime = 500;

let flags_reveal = new Array(numObjects).fill(false);
let flags_lock = new Array(numObjects).fill(false);
let seedsUnique = Array.from({ length: Math.ceil(numObjects / 2) }, () => randInt(0, 1000));
let seeds = shuffleArray([seedsUnique, seedsUnique].flat());
let seletedSeed = null;
let selectedIndex = null;
let isCoolingDown = false;
let matchCount = 0;

let blipSound = null;
let button1Sound = null;
let button2Sound = null;
let gmanWiseSound = null;
let ambientSound = null;

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

function resetGame() {
    flags_reveal = new Array(numObjects).fill(false);
    flags_lock = new Array(numObjects).fill(false);
    seedsUnique = Array.from({ length: Math.ceil(numObjects / 2) }, () => randInt(0, 1000));
    seeds = shuffleArray([seedsUnique, seedsUnique].flat());
    seletedSeed = null;
    selectedIndex = null;
    isCoolingDown = false;  
    matchCount = 0;
}

export const title = 'Match The Texture';
export const description = 'Click to reveal texture to Gman.';

// Start lifecycle.
export const start = async (foxGL) => {
    gl = foxGL.gl;
    program = foxGL.program;
    canvas = foxGL.canvas;
    
    // Set status title.
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
    
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uQ'), false, instances.flat());
        gl.uniform1iv(gl.getUniformLocation(program, 'uF'), flags_reveal);
        gl.uniform1iv(gl.getUniformLocation(program, 'uS'), seeds);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        foxGL.reportFrame();
    }

    // Declare listeners.
    onpointermove = async event => {
        const canvasRect = canvas.getBoundingClientRect();
        const canvasHeight = canvasRect.bottom - canvasRect.top;
        const uMouseX = devicePixelRatio*(event.clientX-canvasRect.left);
        const uMouseY = devicePixelRatio*(canvasHeight-(event.clientY-canvasRect.top));
        gl.uniform2f(gl.getUniformLocation(program, 'uMouse'), uMouseX, uMouseY);
        foxGL.reportStatus('uMouse', \`uMouse: (\${uMouseX.toFixed(1)}, \${uMouseY.toFixed(1)})\`);
    };
    
    onpointerenter = async event => {
        ambientSound?.play();
    };
    
    onpointerleave = async event => {
        ambientSound?.pause();
    };
    
    onclick = async event => {
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
                    foxGL.reportStatus('MatchCount', \`Matched Spheres: \${matchCount}\`, 'blue');
                }, 16*coolDownTime);
            }
        }
        foxGL.reportStatus('ClickPos', \`Click Position: (\${uMouseX.toFixed(1)} [\${col}], \${uMouseY.toFixed(1)} [\${row}])\`);
    }
    
    resizeObserver = new ResizeObserver(entries => {
        gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
        foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);
    });
        
    // Register listeners on start.
    resizeObserver.observe(canvas);
    canvas.addEventListener('pointermove', onpointermove);
    canvas.addEventListener('pointerenter', onpointerenter);
    canvas.addEventListener('pointerleave', onpointerleave);
    canvas.addEventListener('click', onclick);
    animate();
};

// Stop lifecycle.
export const stop = async (foxGL) => {
    // Deregister listeners on stop.
    destroyed = true;
    if(resizeObserver) resizeObserver.disconnect();
    if(onpointermove) canvas.removeEventListener('pointermove', onpointermove);
    if(onpointermove) canvas.removeEventListener('pointerenter', onpointermove);
    if(onpointermove) canvas.removeEventListener('pointerleave', onpointerleave);
    if(onclick) canvas.removeEventListener('click', onclick);
};`,vn=""+new URL("../assets/forest.dkd6DRvS.png",import.meta.url).href,gn=""+new URL("../assets/lava_lamp.D1xLLgh0.png",import.meta.url).href,pn=""+new URL("../assets/texture_match.CGL717sL.png",import.meta.url).href,xn=`#version 300 es

// Author: TapiocaFox
// Title:  Simple Mesh

precision highp float;

in  vec3 aPos, aNor;
out vec3 vPos, vNor;
void main() {
   gl_Position = vec4(aPos, 1.);
   vPos = aPos;
   vNor = aNor;
}`,hn=`#version 300 es

// Author: TapiocaFox
// Title:  Simple Mesh

precision highp float;

in  vec3 vPos, vNor;
out vec4 fragColor;

void main() {
   fragColor = vec4(vPos, 1.);
}`,yn=`// Author: TapiocaFox
// Title:  Simple Mesh

// Init variables.
let gl, program, canvas;
let destroyed = false;
let onpointermove, resizeObserver;

const vertexSize = 6;
const mesh = [
    0, 1,0, 0,0,1,
    -1,-1,0, 0,0,1,
    1,-1,0, 0,0,1,]
const vertexNum = mesh.length / vertexSize;

export const title = 'Simple Mesh';

// Start lifecycle.
export const start = async (foxGL) => {
    gl = foxGL.gl;
    program = foxGL.program;
    canvas = foxGL.canvas;

    // Setup vertex buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    
    const aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, vertexSize*4, 0);

    const aNor = gl.getAttribLocation(program, 'aNor');
    gl.enableVertexAttribArray(aNor);
    gl.vertexAttribPointer(aNor, 3, gl.FLOAT, false, vertexSize*4, vertexNum*4);
    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh), gl.STATIC_DRAW);
    
    // Initial uniform values.
    gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
    foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);

    // Render per animation frame.
    function animate() {
        if(destroyed) return;
        requestAnimationFrame(animate);
        const uTime = (Date.now() - foxGL.startTime) / 1000;
        gl.uniform1f(gl.getUniformLocation(program, 'uTime'), uTime);
        foxGL.reportStatus('uTime', \`uTime: \${uTime.toFixed(2)}\`);
        gl.drawArrays(gl.TRIANGLES, 0, vertexNum);
        foxGL.reportFrame();
    }
    
    // Declare listeners.
    onpointermove = async event => {
        const canvasRect = canvas.getBoundingClientRect();
        const canvasHeight = canvasRect.bottom - canvasRect.top;
        const uMouseX = devicePixelRatio*(event.clientX-canvasRect.left);
        const uMouseY = devicePixelRatio*(canvasHeight-(event.clientY-canvasRect.top));
        gl.uniform2f(gl.getUniformLocation(program, 'uMouse'), uMouseX, uMouseY);
        foxGL.reportStatus('uMouse', \`uMouse: (\${uMouseX.toFixed(1)}, \${uMouseY.toFixed(1)})\`);
    };
    
    resizeObserver = new ResizeObserver(entries => {
        gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
        foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);
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
};`,_n=`// Author: TapiocaFox
// Title:  Robotic Arm

import { Matrix, translate, inverse, orthographic, lookAt, mxm, rotateX, rotateY, rotateZ, scale } from 'matrix';
import { tube, torus, disk, sphere, cube, octachedron, glueMeshes, transformMeshData } from 'mesh';
import { triangleAnglesFromSides, distance } from 'geometry';

// Init variables.
let gl, program, canvas;
let destroyed = false;
let onpointermove, onmousedown, onmouseup, resizeObserver;

let lightswitch2Sound = null;
let button7Sound = null;
let button9Sound = null;
let niceJobSound = null;
let tryAgainSound = null;
let bellSound = null;

const armsColor = [60/256, 61/256, 83/256];
const shoulderColor = [122/256, 36/256, 56/256];
const jointColor = [207/256, 47/256, 63/256];
const handColor = [1, 1, 1];
const backgroundColor = [54/256, 89/256, 127/256];
const octachedronColor = [171/256, 175/256, 187/256];
const octachedronActiveColor = [256/256, 256/256, 256/256];
const cubeColor = [256/256, 256/256, 256/256];

const vertexSize = 6;

const upperarmLength =.66;
const upperarmWidth =.1;
const forearmLength =.9;
const forearmWidth =.1;
const shoulderNDC = [0,.25];
const jointSize = .175;
const octahedronSize = .3;
const octahedronHitboxRadius= octahedronSize;
const octahedronMergeRadius = octahedronHitboxRadius/2;
const octahedronSizeNum = 8; 
const cubeSize = .2;

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

const myCube = {
    triangle_strip: false,
    data: transformMeshData(new Float32Array(cube()),scale( .5*cubeSize, .5*cubeSize, .5*cubeSize),vertexSize)
};

const matrix = new Matrix();

export const title = 'Robotic Arm';
export const description = 'Drag and merge octahedrons into cubes.';

// Start lifecycle.
export const start = async (foxGL) => {
    gl = foxGL.gl;
    program = foxGL.program;
    canvas = foxGL.canvas;

    foxGL.getAssetById('hl_lightswitch2').then(result => lightswitch2Sound = result);
    foxGL.getAssetById('hl_button7').then(result => button7Sound = result);
    foxGL.getAssetById('hl_button9').then(result => button9Sound = result);
    foxGL.getAssetById('hl_bell').then(result => bellSound = result);
    foxGL.getAssetById('hl_tr_holo_nicejob').then(result => niceJobSound = result);
    foxGL.getAssetById('hl_tr_ba_lightson').then(result => tryAgainSound = result);
    
    let mouseNDC = [0, 0];
    let mouseDown = false;
    let drag = false;
    const max=.9, min=-.9;
    let octahedronNDCList = [];
    let cubeNDCList = [];
    let selectedOctahedronIndex = 0;

    function reset() {
        octahedronNDCList = [];
        for(let i=0; i<octahedronSizeNum; i++) {
            octahedronNDCList.push([Math.random() * (max - min) + min, Math.random() * (max - min) + min]);
        };
        cubeNDCList = [];
        selectedOctahedronIndex = 0;
    }

    reset();

    const checkMerge = (octahedronIndex) => {
        const selectedOctahedronNDC = octahedronNDCList[octahedronIndex];
        let minDist = 999;
        let octahedronToBeMergedIndex = null;
        for(const [i, octahedronNDC] of octahedronNDCList.entries()) {
            if(i==octahedronIndex) continue;
            const d = distance(octahedronNDC, selectedOctahedronNDC);
            if(d<minDist&&d<octahedronMergeRadius) {
                octahedronToBeMergedIndex = i; 
                minDist = d;
            }
        }
        if(octahedronToBeMergedIndex!=null) {
            bellSound?.play();
            const first = Math.max(octahedronIndex, octahedronToBeMergedIndex);
            const second = Math.min(octahedronIndex, octahedronToBeMergedIndex);
            cubeNDCList.push(selectedOctahedronNDC);
            octahedronNDCList.splice(first, 1);
            octahedronNDCList.splice(second, 1);
            selectedOctahedronIndex = 0;
            if(octahedronNDCList.length ==0) {
                niceJobSound?.play();
                setTimeout(() => {
                    tryAgainSound?.play();
                    setTimeout(() => {
                        reset();  
                    }, 2000);
                },1500);
            }
        }
    };
    
    let shoulderToHandDistance = Math.max(upperarmLength, forearmLength);
    let shoulderToHandAngle = 0;
    let armAngles = triangleAnglesFromSides(forearmLength, shoulderToHandDistance, upperarmLength);

    // Set status title.
    foxGL.reportStatus('Tips', 'Drag and merge octahedrons into cubes.', 'green');

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
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uView'), false, inverse(lookAt([0,0,1],[0,0,0])));
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uProjection'), false, orthographic(-1,1,-1,1, 0.1, 100));
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
        if(destroyed) return;
        requestAnimationFrame(animate);
        gl.clearColor(backgroundColor[0], backgroundColor[1], backgroundColor[2], 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        const uTime = (Date.now() - foxGL.startTime) / 1000;
        gl.uniform1f(gl.getUniformLocation(program, 'uTime'), uTime);
        foxGL.reportStatus('uTime', \`uTime: \${uTime.toFixed(2)}\`);
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
            // foxGL.reportStatus('octahedronNDC',\`octahedronNDC: \${octahedronNDCList[0]}\`);
            matrix.identity();
            matrix.translate(...octahedronNDC,0).rotateY((selectedOctahedronIndex==i)?4*uTime:uTime);
            drawMesh(myOctahedron, (selectedOctahedronIndex==i)?octachedronActiveColor:octachedronColor);
        }

        for(const [i, cubeNDC] of cubeNDCList.entries()) {
            matrix.identity();
            matrix.translate(...cubeNDC,0).rotateY(i+uTime).rotateX(i+uTime);
            drawMesh(myCube, cubeColor);
        }
        foxGL.reportFrame();
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
        foxGL.reportStatus('uMouse', \`uMouse: (\${uMouseX.toFixed(1)}, \${uMouseY.toFixed(1)})\`);
        const relativeNDC = [mouseNDC[0]-shoulderNDC[0], mouseNDC[1]-shoulderNDC[1]];
        shoulderToHandAngle = (relativeNDC[0]>=0)?Math.atan(relativeNDC[1]/relativeNDC[0]):Math.atan(relativeNDC[1]/relativeNDC[0])+Math.PI;
        // foxGL.reportStatus('shoulderToHandAngle', \`shoulderToHandAngle: \${shoulderToHandAngle.toFixed(1)}\`);
        shoulderToHandDistance = distance(mouseNDC, shoulderNDC);
        // foxGL.reportStatus('shoulderToHandDistance', \`shoulderToHandDistance: \${shoulderToHandDistance.toFixed(1)}\`);
        armAngles = triangleAnglesFromSides(forearmLength, shoulderToHandDistance, upperarmLength);
        foxGL.reportStatus('armAngles', \`armAngles: (\${armAngles[0].toFixed(1)}, \${armAngles[1].toFixed(1)}, \${armAngles[2].toFixed(1)})\`);
        if(drag) {
            octahedronNDCList[selectedOctahedronIndex][0] = mouseNDC[0];
            octahedronNDCList[selectedOctahedronIndex][1] = mouseNDC[1];
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
        let minDist = 999;
        for(const [i, octahedronNDC] of octahedronNDCList.entries()) {
            const d = distance(octahedronNDC, mouseNDC);
            if(d<minDist) {
                drag = d<octahedronHitboxRadius;
                foxGL.reportStatus('mouse', \`Mouse: down, drag: \${drag}\`);
                if(drag) {
                    selectedOctahedronIndex = i;
                }
                minDist = d;
            }
        }
        if(!drag) {
            button7Sound.currentTime = 0;
            button7Sound?.play(); 
        }
        else {
            button9Sound.currentTime = 0;
            button9Sound?.play();
        }
    }

    onmouseup = async event => {
        mouseDown = false;
        if(drag) {
            lightswitch2Sound.currentTime = 0;
            lightswitch2Sound?.play();
            checkMerge(selectedOctahedronIndex);
        }
        drag = false;
        foxGL.reportStatus('mouse', \`Mouse: up\`);
    }
    
    resizeObserver = new ResizeObserver(entries => {
        gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
        foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);
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
};`,bn=`// Author: TapiocaFox
// Title:  Bézier Wire

import { orthographic, lookAt, scale, translate, inverse, mxm, Matrix } from 'matrix';
import { bezierWire, transformMeshData } from 'mesh';

// Init variables.
let gl, program, canvas;
let destroyed = false;
let onpointermove, onmousedown, onmouseup, resizeObserver;

const vertexSize = 6;
const backgroundColor = [0,0,0];

const bezierXY = [[ -.5,-.1, .8, .6, .6, -.9, -.5 ],
                  [ -.1,-.5,-.3, .4, .7,  .2, -.1 ]];

const myWire = {
    triangle_strip: true,
    data: new Float32Array(bezierWire(20, 10, [...bezierXY, .05]))
}

const matrix = new Matrix();

export const title = 'Bézier Wire';

// Start lifecycle.
export const start = async (foxGL) => {
    gl = foxGL.gl;
    program = foxGL.program;
    canvas = foxGL.canvas;
    
    let mouseNDC = [0, 0];

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
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uView'), false, inverse(lookAt([0,0,1],[0,0,0])));
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uProjection'), false, orthographic(-1,1,-1,1, 0.1, 100));
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
        if(destroyed) return;
        requestAnimationFrame(animate);
        gl.clearColor(...backgroundColor, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        const uTime = (Date.now() - foxGL.startTime) / 1000;
        gl.uniform1f(gl.getUniformLocation(program, 'uTime'), uTime);
        foxGL.reportStatus('uTime', \`uTime: \${uTime.toFixed(2)}\`);
        matrix.identity()
        // matrix.translate(...mouseNDC, 0);
        // matrix.rotateX(uTime);
        drawMesh(myWire, [1, 1, 1]);
        foxGL.reportFrame();
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
        foxGL.reportStatus('uMouse', \`uMouse: (\${uMouseX.toFixed(1)}, \${uMouseY.toFixed(1)})\`);
    };

    resizeObserver = new ResizeObserver(entries => {
        gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
        foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);
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
};`,Sn=`// Author: TapiocaFox
// Title:  Magician's Trick

import { scale, perspective, lookAt, inverse, translate, mxm, rotateX, rotateY, rotateZ, Matrix } from 'matrix';
import { tube, disk, octachedron, transformMeshData, glueMeshes } from 'mesh';
import { add, subtract, normalize, multiply, angleFromXY } from 'geometry';
import { bezier2D } from 'procedural';
import { Engine, newBody, createDummyUpdate } from 'physics';
import { getAudioBufferByAssetId, playAudioBuffer} from 'utils';

// Init variables.
let gl, program, canvas;
let destroyed = false;
let onpointermove, onmousedown, onmouseup, resizeObserver;

const vertexSize = 6;
const octahedronSize = .2;
const octachedronColor = [256/256, 150/256, 0/256];
const wandLength = .75;
const wandColor = [1,1,1];
const wandWidth = .1;
const hatLength = 1.;
const hatWidth = .9;
const hatBCapSizeRatio = 1.75
// const hatColor = [139/256, 73/256, 82/256];
// const backgroundColor = [95/256, 55/256, 107/256];
const ringLength = .2;
const ringWidth = 1.;
const ringColor = [256/256, 0/256, 0/256];
const hatColor = [95/256, 55/256, 107/256];
const backgroundColor = [139/256, 73/256, 82/256];
const bezierMinMaxXY = [[-.5,.5],[-.1,.5]];
let bezierXY = null;


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

const myOctahedron = {
    triangle_strip: false,
    data: transformMeshData(new Float32Array(octachedron()),scale( .5*octahedronSize, .5*octahedronSize, .5*octahedronSize),vertexSize)
};

const myCylinder = glueMeshes(glueMeshes(myTube, myTCap, vertexSize), myBCap, vertexSize);
transformMeshData(myCylinder.data, mxm(mxm(rotateX(.5*Math.PI), rotateY(.5*Math.PI)), translate(0,0,1)), vertexSize);

const myWand = {
    triangle_strip: myCylinder.triangle_strip,
    data: transformMeshData(new Float32Array(myCylinder.data),scale(.5*wandLength, .5*wandWidth, .5*wandWidth),vertexSize)
}
const myHatBCap = {
    triangle_strip: true,
    data: new Float32Array(transformMeshData(disk(20), mxm(mxm(translate(0,0,-1), scale(hatBCapSizeRatio,hatBCapSizeRatio,hatBCapSizeRatio)), rotateX(Math.PI)), vertexSize))
};

let myHat = glueMeshes(glueMeshes(myTube, myTCap, vertexSize), myHatBCap, vertexSize);
transformMeshData(myHat.data, mxm(mxm(rotateX(.5*Math.PI), rotateY(.5*Math.PI)), translate(0,0,1)), vertexSize);

myHat = {
    triangle_strip: true,
    data: transformMeshData(new Float32Array(myHat.data),scale( .5*hatLength, .5*hatWidth, .5*hatWidth),vertexSize)
}

const myRing = {
    triangle_strip: true,
    data: transformMeshData(new Float32Array(tube(20)), mxm(translate(.5*ringLength, 0,0), mxm(rotateY(.5*Math.PI), scale(.5*ringWidth, .5*ringWidth, .5*ringLength))), vertexSize)
};

const newBezier = (prevBezierXY = null) => {
    const minMax = bezierMinMaxXY;
    let BX = [], BY = [];

    const randX = () => Math.random()*(minMax[0][1]-minMax[0][0])+minMax[0][0];
    const randY = () => Math.random()*(minMax[1][1]-minMax[1][0])+minMax[1][0];

    if (prevBezierXY) {
        // Reflect last tangent
        const midX = prevBezierXY[0][3];
        const midY = prevBezierXY[1][3];
        const inX = prevBezierXY[0][2];
        const inY = prevBezierXY[1][2];
        const reflectedX = midX + (midX - inX);
        const reflectedY = midY + (midY - inY);
        BX.push(midX, reflectedX);
        BY.push(midY, reflectedY);
    } else {
        // First segment: pick start point and handle randomly
        BX.push(randX());
        BY.push(randY());
        BX.push(randX());
        BY.push(randY());
    }

    // Add 1–2 more points randomly to complete segment
    BX.push(randX());
    BY.push(randY());

    // Last point of segment (anchor)
    BX.push(randX());
    BY.push(randY());

    return [BX, BY];
}

bezierXY = newBezier(bezierXY);

const alignAlongRay = (start, end, offset, matrix) => {
    const v = subtract(end, start);
    // const zAngle = angleFromXY(v[1], v[0])-.5*Math.PI;
    // const xAngle = angleFromXY(v[1], v[2]);
    
    matrix.translate(...subtract(v, multiply(offset, normalize(v))));
    matrix.translate(...start);
    matrix.alignX(normalize(v));
    // matrix.rotateZ(zAngle);
    // matrix.rotateX(xAngle);
};

const matrix = new Matrix();
const engine = new Engine(createDummyUpdate(.2));
const audioCtx = new AudioContext();
const mousedownInterval = 150;

export const title = 'Magician\\'s Trick 🪄';
export const description = 'Animate the movement of the wand and hat using bezier spline.';

// Start lifecycle.
export const start = async (foxGL) => {
    gl = foxGL.gl;
    program = foxGL.program;
    canvas = foxGL.canvas;
    
    let mouseNDC = [0, 0];
    let tipNDC = null;
    let isMouseDown = false;

    foxGL.reportStatus('Tips', 'Click to add more spooky spirits. 🎃', 'darkorange');
    
    const chimeAudioBuffer = await getAudioBufferByAssetId(foxGL, audioCtx, 'hl_smallmedkit1');

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
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uView'), false, inverse(lookAt([0,0,2.5],[0,0,0])));
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
    let previousT = 0;
    function animate() {
        if(destroyed) return;
        requestAnimationFrame(animate);
        engine.tick();
        gl.clearColor(backgroundColor[0], backgroundColor[1], backgroundColor[2], 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        const uTime = (Date.now() - foxGL.startTime) / 1000;
        gl.uniform1f(gl.getUniformLocation(program, 'uTime'), uTime);
        foxGL.reportStatus('uTime', \`uTime: \${uTime.toFixed(2)}\`);
        matrix.identity();
        const t = uTime % 1;
        if(t<previousT) {
            bezierXY = newBezier(bezierXY);
        }
        previousT = t;
        tipNDC = add(bezier2D(t, ...bezierXY), mouseNDC);
        alignAlongRay([...mouseNDC,.5], [...tipNDC, -.9], wandLength, matrix);
        drawMesh(myWand, wandColor);
        for(const oBody of engine.bodies) {
            matrix.identity();
            matrix.translate(...oBody.position).rotateY(oBody.rotationFactor*uTime).rotateX(oBody.rotationFactor*uTime);
            drawMesh(myOctahedron, octachedronColor);
        }
        matrix.identity();
        alignAlongRay([...mouseNDC,-3.5], [tipNDC[0], tipNDC[1]+1, -3], wandLength, matrix);
        drawMesh(myHat, hatColor);
        drawMesh(myRing, ringColor)
        foxGL.reportFrame();
    }

    const addNewBody = async () => {
        await playAudioBuffer(audioCtx, chimeAudioBuffer);
        const oBody = newBody();
        oBody.position = [...tipNDC, -.9];
        oBody.velocity = [Math.random()*(2.)-1.,Math.random()*(2.)-1.,Math.random()*(2.)-1.];
        oBody.rotationFactor = Math.random()*(1.-.5)+.5;
        engine.bodies.push(oBody);
    }

    const addNewBodiesUntilMouseUp = async () => {
        if(!isMouseDown) return;
        addNewBody();
        setTimeout(addNewBodiesUntilMouseUp, mousedownInterval);
    }

    onmousedown = async event => {
        isMouseDown = true;
        addNewBodiesUntilMouseUp();
    }

    onmouseup = async event => {
        isMouseDown = false;
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
        foxGL.reportStatus('uMouse', \`uMouse: (\${uMouseX.toFixed(1)}, \${uMouseY.toFixed(1)})\`);
    };

    resizeObserver = new ResizeObserver(entries => {
        gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
        foxGL.reportStatus('uResolution', \`uResolution: (\${canvas.width.toFixed(1)}, \${canvas.height.toFixed(1)})\`);
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
    audioCtx.close();
    if(onpointermove) canvas.removeEventListener('pointermove', onpointermove);
    if(onmousedown) canvas.removeEventListener('mousedown', onmousedown);
    if(onmouseup) canvas.removeEventListener('mouseup', onmouseup);
    if(resizeObserver) resizeObserver.disconnect();
};`,Tn=""+new URL("../assets/smallmedkit1.Ci0zdtAh.wav",import.meta.url).href,Ln=""+new URL("../assets/button7.D-21_rhA.wav",import.meta.url).href,Rn=""+new URL("../assets/button9.DEB5fpQw.wav",import.meta.url).href,wn=""+new URL("../assets/bell.DtQkH9Bu.wav",import.meta.url).href,An=""+new URL("../assets/tr_holo_nicejob.xdU8jPIv.wav",import.meta.url).href,In=""+new URL("../assets/tr_ba_lightson.ClddX2wt.wav",import.meta.url).href,Mn=""+new URL("../assets/lightswitch2.BewYLsdz.wav",import.meta.url).href,ne=""+new URL("../assets/blip1.Db9rI5k-.wav",import.meta.url).href,Cn=""+new URL("../assets/button1.Cro1Iv89.wav",import.meta.url).href,Pn=""+new URL("../assets/button2.BmEnIolR.wav",import.meta.url).href,zn=""+new URL("../assets/industrial1.B-SN7Icb.wav",import.meta.url).href,En=""+new URL("../assets/gman_wise.CYiLjyZP.wav",import.meta.url).href,Fn=""+new URL("../assets/simple_mesh.DooNwVV7.png",import.meta.url).href,Dn=""+new URL("../assets/robotic_arm.BPU340bl.png",import.meta.url).href,Gn=""+new URL("../assets/bezier_wire.CYKf9Fb-.png",import.meta.url).href,Bn=""+new URL("../assets/magician.2uO62yag.png",import.meta.url).href,Nn=`#version 300 es

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
}`,Un=""+new URL("../assets/magnifier.Cx3grxRy.png",import.meta.url).href,On="data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='utf-8'?%3e%3c!--%20Uploaded%20to:%20SVG%20Repo,%20www.svgrepo.com,%20Generator:%20SVG%20Repo%20Mixer%20Tools%20--%3e%3csvg%20fill='%23000000'%20width='800px'%20height='800px'%20viewBox='0%200%2024%2024'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M12,2%20C14.1421954,2%2015.8910789,3.68396847%2015.9951047,5.80035966%20L16,6%20L16.0009007,6.17102423%20C16.8482841,6.47083722%2017.5208107,7.14059603%2017.8243776,7.98619771%20C18.3775427,7.93308996%2018.8969141,7.68887231%2019.2928932,7.29289322%20C19.7003708,6.88541564%2019.9471452,6.3472755%2019.9924253,5.77695139%20L20,5.58578644%20L20,5%20L20.0067277,4.88337887%20C20.0644928,4.38604019%2020.4871642,4%2021,4%20C21.5128358,4%2021.9355072,4.38604019%2021.9932723,4.88337887%20L22,5%20L22,5.58578644%20L21.9938294,5.81921837%20C21.9363787,6.90490079%2021.479744,7.93446953%2020.7071068,8.70710678%20C19.9777124,9.43650119%2019.0193415,9.88427517%2018.0009458,9.98044661%20L18,12%20L21,12%20C21.5522847,12%2022,12.4477153%2022,13%20C22,13.5522847%2021.5522847,14%2021,14%20L18,14%20L18.0009458,16.0195534%20C19.0193415,16.1157248%2019.9777124,16.5634988%2020.7071068,17.2928932%20C21.479744,18.0655305%2021.9363787,19.0950992%2021.9938294,20.1807816%20L22,20.4142136%20L22,21%20C22,21.5522847%2021.5522847,22%2021,22%20C20.4871642,22%2020.0644928,21.6139598%2020.0067277,21.1166211%20L20,21%20L20,20.4142136%20C20,19.7739243%2019.7456461,19.1598596%2019.2928932,18.7071068%20C18.8854156,18.2996292%2018.3472755,18.0528548%2017.7769514,18.0075747%20L17.6572765,18.0037085%20C16.8325575,20.3321558%2014.6110517,22%2012,22%20C9.38894833,22%207.16744253,20.3321558%206.34272355,18.0037085%20L6.22304861,18.0075747%20C5.6527245,18.0528548%205.11458436,18.2996292%204.70710678,18.7071068%20C4.2996292,19.1145844%204.05285477,19.6527245%204.00757466,20.2230486%20L4,20.4142136%20L4,21%20L3.99327227,21.1166211%20C3.93550716,21.6139598%203.51283584,22%203,22%20C2.48716416,22%202.06449284,21.6139598%202.00672773,21.1166211%20L2,21%20L2,20.4142136%20L2.00617059,20.1807816%20C2.06362127,19.0950992%202.52025597,18.0655305%203.29289322,17.2928932%20C4.02252654,16.5632599%204.98128639,16.1154315%206.00005498,16.019459%20L6,14%20L3,14%20C2.44771525,14%202,13.5522847%202,13%20C2,12.4477153%202.44771525,12%203,12%20L6,12%20L6.00005498,9.980541%20C4.98128639,9.88456847%204.02252654,9.4367401%203.29289322,8.70710678%20C2.52025597,7.93446953%202.06362127,6.90490079%202.00617059,5.81921837%20L2,5.58578644%20L2,5%20C2,4.44771525%202.44771525,4%203,4%20C3.51283584,4%203.93550716,4.38604019%203.99327227,4.88337887%20L4,5%20L4,5.58578644%20C4,6.22607568%204.25435391,6.84014035%204.70710678,7.29289322%20C5.10308588,7.68887231%205.62245732,7.93308996%206.1748463,7.98811167%20C6.47930745,7.14026687%207.15223954,6.47031582%208.00008893,6.17067428%20L8,6%20C8,3.790861%209.790861,2%2012,2%20Z%20M15,8%20L9,8%20C8.48716416,8%208.06449284,8.38604019%208.00672773,8.88337887%20L8,9%20L8,16%20C8,18.209139%209.790861,20%2012,20%20C14.1421954,20%2015.8910789,18.3160315%2015.9951047,16.1996403%20L16,16%20L16,9%20C16,8.48716416%2015.6139598,8.06449284%2015.1166211,8.00672773%20L15,8%20Z%20M12,4%20C10.9456382,4%2010.0818349,4.81587779%2010.0054857,5.85073766%20L10,6%20L14,6%20C14,4.99835629%2013.2636703,4.16869161%2012.3027743,4.0227694%20L12.1492623,4.00548574%20L12,4%20Z'/%3e%3c/svg%3e";var Yn=C('<h3>Debug Shaders</h3> <p class="annotation">WebGL2 shaders for debugging.</p> <div class="flex_grid gallery"><div class="item webgl-item svelte-ahq8ot"><!></div> <div class="item webgl-item svelte-ahq8ot"><!></div></div> <h3>In Preview Mode</h3> <p class="annotation">WebGL2 shaders for debugging, but in preview mode.</p> <div class="gallery-row"><div class="item"><!></div> <div class="item"><!></div> <div class="item"><!></div></div>',1),Wn=C('<div class="item webgl-item svelte-ahq8ot"><!></div>'),Xn=C('<h3> </h3> <p class="annotation"> </p> <div class="flex_grid gallery"></div>',1),Vn=C("<!> <!>  <!> <!>",1);function st(te,oe){ge(oe,!0);let u=ye("all"),re=pe([{title:"Fragment Shader",description:"Abstract fragment shader patterns animated over time. (Interactable) || Assignment 1",practices:[{preview_image:Ke,frag:Ue,modules:{index:y},categories:["distortion"]},{preview_image:je,frag:Ne,categories:[]},{preview_image:Ze,frag:qe,categories:["distortion"]},{preview_image:Je,frag:$e,modules:{index:y},categories:[]},{preview_image:en,frag:Ie,categories:["noise"]}]},{title:"Ray Casting & Quadric",description:"Ray casting of spheres, phong reflection, quadric surfaces and transformations. || Assignment 2 & 3",practices:[{preview_image:ln,frag:on,modules:{index:rn},categories:["raycasting"]},{preview_image:cn,frag:nn,modules:{index:tn},assets:{hl_deactivated:{id:"hl_deactivated",type:"audio",srcType:"link",src:j},hl_activated:{id:"hl_activated",type:"audio",srcType:"link",src:Z}},categories:["noise","raycasting"]},{preview_image:un,frag:Ce,modules:{index:Me},assets:{hl_deactivated:{id:"hl_deactivated",type:"audio",srcType:"link",src:j},hl_activated:{id:"hl_activated",type:"audio",srcType:"link",src:Z}},categories:["noise","raycasting"]},{preview_image:mn,frag:an,modules:{index:sn,matrix:h,geometry:x,quadric_matrix:q},assets:{hl_blip:{id:"hl_blip",type:"audio",srcType:"link",src:ne}},categories:["raycasting"]}]},{title:"Procedural Texture",description:"Procedural texture generation with noise. || Assignment 4",practices:[{preview_image:vn,frag:De,modules:{index:y},categories:["noise"]},{preview_image:gn,frag:Fe,modules:{index:Ee,utils:G},assets:{hl_alien_blipper:{id:"hl_alien_blipper",type:"audio",srcType:"link",src:ze},hl_alienappeal:{id:"hl_alienappeal",type:"audio",srcType:"link",src:Pe}},categories:["noise"]},{preview_image:pn,frag:dn,modules:{index:fn,matrix:h,geometry:x,quadric_matrix:q},assets:{hl_button1:{id:"hl_button1",type:"audio",srcType:"link",src:Cn},hl_button2:{id:"hl_button_2",type:"audio",srcType:"link",src:Pn},hl_blip1:{id:"hl_blip1",type:"audio",srcType:"link",src:ne},hl_industrial1:{id:"hl_industrial1",type:"audio",srcType:"link",src:zn},hl_gman_wise:{id:"hl_gman_wise",type:"audio",srcType:"link",src:En}},categories:["noise","raycasting"]}]},{title:"Mesh & Spline",description:"Triangles, meshes, strips, transformation matrix and splines. || Assignment 5 & 6",practices:[{preview_image:Fn,vert:xn,frag:hn,modules:{index:yn},categories:["mesh"]},{preview_image:Dn,vert:M,frag:I,modules:{index:_n,matrix:h,mesh:A,geometry:x},categories:["mesh","kinematics"],assets:{hl_button7:{id:"hl_button7",type:"audio",srcType:"link",src:Ln},hl_button9:{id:"hl_button9",type:"audio",srcType:"link",src:Rn},hl_lightswitch2:{id:"hl_lightswitch2",type:"audio",srcType:"link",src:Mn},hl_bell:{id:"hl_bell",type:"audio",srcType:"link",src:wn},hl_tr_holo_nicejob:{id:"hl_tr_holo_nicejob",type:"audio",srcType:"link",src:An},hl_tr_ba_lightson:{id:"hl_tr_ba_lightson",type:"audio",srcType:"link",src:In}}},{preview_image:Gn,vert:M,frag:I,modules:{index:bn,matrix:h,mesh:A,geometry:x},categories:["mesh","spline"]},{preview_image:Bn,vert:M,frag:I,modules:{index:Sn,utils:G,matrix:h,mesh:A,geometry:x,procedural:Q,physics:H},categories:["mesh","spline","kinematics"],assets:{hl_smallmedkit1:{id:"hl_smallmedkit1",type:"audio",srcType:"link",src:Tn}},start_immediately:!1}]},{title:"Kinematics",description:"Dynamics with springs, kinematics and inverse kinematics. || Assignment 7",practices:[{vert:M,frag:I,modules:{index:Be,utils:G,matrix:h,geometry:x,mesh:A,physics:H,procedural:Q},assets:{ambient:{id:"ambient",type:"audio",srcType:"link",src:Ge}},categories:["kinematics","mesh"]}]},{title:"Unorganized",description:"Things that are not organized to any cluster yet.",practices:[{preview_image:Un,frag:Nn,modules:{index:D},categories:["distortion"]},{preview_image:Qe,vert:We,frag:Xe,modules:{index:Ye},assets:{uvmap:{id:"uvmap",type:"image",srcType:"link",src:Ve},hl_button:{id:"hl_button",type:"audio",srcType:"link",src:ke}},categories:[]}]}]);var B=Vn(),N=L(B);Le(N,{children:(l,t)=>{_e();var c=be("Graphics");m(l,c)}});var U=a(N,2);{let l=r(()=>[null,null,null,null,null,null,null,On,Re]);Te(U,{names:["All categories","Noise","Distortion","Ray casting","Mesh","Spline","Kinematics","Debug","Playground"],get inline_icons(){return e(l)},values:["all","noise","distortion","raycasting","mesh","spline","kinematics","debug","editor"],dividers:["noise","debug"],get selected_value(){return e(u)},callback:t=>{if(t=="editor")return window.open("/webgl_editor","_blank","noopener,noreferrer"),!1;he(u,t,!0)}})}var O=a(U,2);{var ie=l=>{var t=Yn(),c=a(L(t),4),_=s(c),P=s(_);{let o=r(()=>({index:D}));g(P,{get vertex_shader(){return p},get fragment_shader(){return $},get modules(){return e(o)},start_immediately:!1,get preview_image(){return J}})}i(_);var d=a(_,2),f=s(d);{let o=r(()=>({index:y}));g(f,{get vertex_shader(){return p},get fragment_shader(){return K},get modules(){return e(o)},start_immediately:!1,get preview_image(){return ee}})}i(d),i(c);var v=a(c,6),b=s(v),S=s(b);{let o=r(()=>({index:D}));g(S,{get vertex_shader(){return p},get fragment_shader(){return $},get modules(){return e(o)},mode:"",start_immediately:!1,get preview_image(){return J}})}i(b);var T=a(b,2),R=s(T);{let o=r(()=>({index:y}));g(R,{get vertex_shader(){return p},get fragment_shader(){return K},get modules(){return e(o)},mode:"",start_immediately:!1,get preview_image(){return ee}})}i(T);var w=a(T,2),n=s(w);{let o=r(()=>({index:y}));g(n,{get vertex_shader(){return p},get fragment_shader(){return Oe},get modules(){return e(o)},mode:"",start_immediately:!1,get preview_image(){return He}})}i(w),i(v),m(l,t)};F(O,l=>{e(u)=="debug"&&l(ie)})}var ae=a(O,2);V(ae,17,()=>re,k,(l,t)=>{var c=W(),_=L(c);{var P=d=>{var f=Xn(),v=L(f),b=s(v,!0);i(v);var S=a(v,2),T=s(S,!0);i(S);var R=a(S,2);V(R,21,()=>e(t).practices,k,(w,n,o)=>{var Y=W(),se=L(Y);{var le=z=>{var E=Wn(),ce=s(E);{let ue=r(()=>e(n).vert?e(n).vert:p),me=r(()=>e(n).frag?e(n).frag:we),de=r(()=>e(n).modules?e(n).modules:Ae),fe=r(()=>e(n).assets?e(n).assets:{}),ve=r(()=>o<1||e(n).preview_image==null&&e(n).start_immediately);g(ce,{get vertex_shader(){return e(ue)},get fragment_shader(){return e(me)},get modules(){return e(de)},get assets(){return e(fe)},get start_immediately(){return e(ve)},get preview_image(){return e(n).preview_image}})}i(E),m(z,E)};F(se,z=>{(e(u)=="all"||e(n).categories.includes(e(u)))&&z(le)})}m(w,Y)}),i(R),Se(()=>{X(b,e(t).title),X(T,e(t).description)}),m(d,f)};F(_,d=>{e(t).practices.filter(f=>e(u)=="all"||f.categories.includes(e(u))).length>0&&d(P)})}m(l,c)}),m(te,B),xe()}export{st as component};
