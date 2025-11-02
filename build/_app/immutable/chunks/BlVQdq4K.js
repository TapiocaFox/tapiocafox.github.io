const n=`#version 300 es

// Author: TapiocaFox
// Title:  Colored Mesh

precision highp float;
uniform vec3 uColor;
in  vec3 vPos, vNor;
out vec4 fragColor;

void main() {
   vec3 nor = normalize(vNor);
   vec3 c = uColor * (.1 + max(0., dot(normalize(vec3(1,1,1)),nor)));
   fragColor = vec4(c, 1.);
}`,t=`#version 300 es

// Author: TapiocaFox
// Title: Model View Projection

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;
uniform mat4 uNormal;

in vec3 aPos, aNor;
out vec3 vPos, vNor;

void main() {
    vec4 worldPos = uModel * vec4(aPos, 1.0);
    vec4 nor = vec4(aNor, 0.0) * uNormal;

    gl_Position = uProjection * uView * worldPos;
    vPos = worldPos.xyz;
    vNor = nor.xyz;
}`,e=`// Author: TapiocaFox
// Title:  4x4 Matrix (From Prof. Perlin)

import { normalize, cross, subtract, dot, norm } from 'geometry';

// Transformations. Column major.
export const identity = () => [1, 0, 0, 0,
   0, 1, 0, 0,
   0, 0, 1, 0,
   0, 0, 0, 1];
// Row.
export const rotateX = r => [1, 0, 0, 0,
   0, Math.cos(r), Math.sin(r), 0,
   0, -Math.sin(r), Math.cos(r), 0,
   0, 0, 0, 1];
// Pitch.
export const rotateY = r => [Math.cos(r), 0, -Math.sin(r), 0,
   0, 1, 0, 0,
Math.sin(r), 0, Math.cos(r), 0,
   0, 0, 0, 1];
// Yaw.
export const rotateZ = r => [Math.cos(r), Math.sin(r), 0, 0,
-Math.sin(r), Math.cos(r), 0, 0,
   0, 0, 1, 0,
   0, 0, 0, 1];
// Translate.
export const translate = (x, y, z) => [1, 0, 0, 0,
   0, 1, 0, 0,
   0, 0, 1, 0,
   x, y, z, 1];

// Scale.
export const scale = (x, y, z) => [x, 0, 0, 0,
   0, y, 0, 0,
   0, 0, z, 0,
   0, 0, 0, 1];

// Orthographic.
export const orthographic = (left, right, bottom, top, near, far) => {
   const lr = 1 / (right - left);
   const bt = 1 / (top - bottom);
   const nf = 1 / (near - far);

   return [
      2 * lr, 0, 0, 0,
      0, 2 * bt, 0, 0,
      0, 0, 2 * nf, 0,
      -(right + left) * lr, -(top + bottom) * bt, (far + near) * nf, 1
   ];
}

// Reference: https://webglfundamentals.org/webgl/lessons/webgl-3d-perspective.html
export const perspective = (fieldOfViewInRadians, aspect, near, far) => {
   const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
   const rangeInv = 1.0 / (near - far);

   return [
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) * rangeInv, -1,
      0, 0, near * far * rangeInv * 2, 0
   ];
}

// Matrix operations.
export const mxm = (a, b) => {
   let m = [];
   for (let c = 0; c < 16; c += 4)
      for (let r = 0; r < 4; r++)
         m.push(a[r] * b[c] + a[r + 4] * b[c + 1] + a[r + 8] * b[c + 2] + a[r + 12] * b[c + 3]);
   return m;
}

export const transpose = m => [m[0], m[4], m[8], m[12],
m[1], m[5], m[9], m[13],
m[2], m[6], m[10], m[14],
m[3], m[7], m[11], m[15]];

export const inverse = src => {
   let dst = [], det = 0, cofactor = (c, r) => {
      let s = (i, j) => src[c + i & 3 | (r + j & 3) << 2];
      return (c + r & 1 ? -1 : 1) * ((s(1, 1) * (s(2, 2) * s(3, 3) - s(3, 2) * s(2, 3)))
         - (s(2, 1) * (s(1, 2) * s(3, 3) - s(3, 2) * s(1, 3)))
         + (s(3, 1) * (s(1, 2) * s(2, 3) - s(2, 2) * s(1, 3))));
   }
   for (let n = 0; n < 16; n++) dst.push(cofactor(n >> 2, n & 3));
   for (let n = 0; n < 4; n++) det += src[n] * dst[n << 2];
   for (let n = 0; n < 16; n++) dst[n] /= det;
   return dst;
}

// Build a 4x4 rotation matrix from 3 orthonormal axes (column-major)
export const rotationFromBasis = (xAxis, yAxis, zAxis) => [
   xAxis[0], xAxis[1], xAxis[2], 0,   // first column = X axis
   yAxis[0], yAxis[1], yAxis[2], 0,   // second column = Y axis
   zAxis[0], zAxis[1], zAxis[2], 0,   // third column = Z axis
   0, 0, 0, 1    // fourth column = translation/homogeneous
];

// Align a local axis to targetDir, keeping a reasonable "up" orientation
export const align = (axis, targetDir, up = [0, 1, 0]) => {
   const z = normalize(targetDir); // forward
   let upRef = up;

   if (Math.abs(dot(z, up)) > 0.9999) upRef = [1, 0, 0];

   const x = normalize(cross(z, upRef)); // right
   const y = cross(x, z);                // true up

   const ref = normalize(axis);

   // Map local axis to basis using a dot-product sign trick instead of branch
   const xAxis = ref[0] !== 0 ? z : x;
   const yAxis = ref[1] !== 0 ? z : y;
   const zAxis = ref[2] !== 0 ? z : (ref[0] !== 0 ? x : y);

   return rotationFromBasis(xAxis, yAxis, zAxis);
};

// Convenience functions
export const alignX = targetDir => align([1, 0, 0], targetDir);
export const alignY = targetDir => align([0, 1, 0], targetDir);
export const alignZ = targetDir => align([0, 0, 1], targetDir);


// Reference: https://webglfundamentals.org/webgl/lessons/webgl-3d-camera.html
export const lookAt = (cameraPosition, target, up = [0, 1, 0]) => {
   var zAxis = normalize(
      subtract(cameraPosition, target));
   var xAxis = normalize(cross(up, zAxis));
   var yAxis = normalize(cross(zAxis, xAxis));

   return [
      xAxis[0], xAxis[1], xAxis[2], 0,
      yAxis[0], yAxis[1], yAxis[2], 0,
      zAxis[0], zAxis[1], zAxis[2], 0,
      cameraPosition[0],
      cameraPosition[1],
      cameraPosition[2],
      1,
   ];
}

// Congruence transformation.
export const qxm = (Q, M) => {
   const MI = inverse(M);
   return mxm(transpose(MI), mxm(Q, MI));
}

export function Matrix() {
   let m = [identity()], top = 0;
   this.push = () => { m[top + 1] = m[top].slice(); top++; return this; }
   this.pop = () => { if (top > 0) top--; return this; }
   this.get = () => m[top];
   this.identity = () => { m[top] = identity(); return this; }
   this.translate = (x, y, z) => { m[top] = mxm(m[top], translate(x, y, z)); return this; }
   this.rotateX = a => { m[top] = mxm(m[top], rotateX(a)); return this; }
   this.rotateY = a => { m[top] = mxm(m[top], rotateY(a)); return this; }
   this.rotateZ = a => { m[top] = mxm(m[top], rotateZ(a)); return this; }
   this.scale = (x, y, z) => {
      m[top] = mxm(m[top], scale(x, y, z));
      return this;
   }
   this.alignX = t => { m[top] = mxm(m[top], alignX(t)); return this; }
   this.alignY = t => { m[top] = mxm(m[top], alignY(t)); return this; }
   this.alignZ = t => { m[top] = mxm(m[top], alignZ(t)); return this; }
   this.align = (axis, targetDir, up = [0, 0, 1]) => { m[top] = mxm(m[top], align(axis, targetDir, up)); return this; }
   this.perspective = (fieldOfViewInRadians, aspect, near, far) => {
      m[top] = mxm(m[top], perspective(fieldOfViewInRadians, aspect, near, far));
      return this;
   }
   this.orthographic = (left, right, bottom, top, near, far) => {
      m[top] = mxm(m[top], orthographic(left, right, bottom, top, near, far));
      return this;
   }
}`,o=`// Author: TapiocaFox
// Title:  Mesh (From Prof. Perlin)

import { inverse } from 'matrix';
import { normalize, cross } from 'geometry';

export const parametric = (f,nu,nv,other) => {
    const V = [];
    for (let j = 0 ; j < nv ; j++) {
        for (let i = 0 ; i <= nu ; i++) {
            V.push(f(i/nu,j/nv,other));
            V.push(f(i/nu,(j+1)/nv,other));
        }
        V.push(f(1,(j+1)/nv,other));
        V.push(f(0,(j+1)/nv,other));
    }
    return V.flat();
}

export const tube = n => parametric((u,v) => {
    const theta = 2 * Math.PI * u;
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    return [c,s,2*v-1, c,s,0];
},n,2);

export const disk = n => parametric((u,v) => {
    const theta = 2 * Math.PI * u;
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    return [c*v,s*v,0, 0,0,1];
},n,2);

export const sphere = (nu,nv) => parametric((u,v) => {
    const theta = 2 * Math.PI * u;
    const phi = Math.PI * (v - 1/2);
    const cu = Math.cos(theta);
    const su = Math.sin(theta);
    const cv = Math.cos(phi);
    const sv = Math.sin(phi);
    const x = cu * cv, y = su * cv, z = sv;
    return [x,y,z, x,y,z];
},nu,nv);

export const torus = (nu,nv,r) => parametric((u,v,r) => {
    const theta = 2 * Math.PI * u, cu = Math.cos(theta), su = Math.sin(theta);
    const phi = 2 * Math.PI * v, cv = Math.cos(phi), sv = Math.sin(phi);
    return [(1+r*cv)*cu,(1+r*cv)*su,r*sv, cv*cu,cv*su,sv];
},nu,nv,r);


export const cube = () => [
  -1,-1,-1, 0, 0,-1,  1,-1,-1, 0, 0,-1,  1, 1,-1, 0, 0,-1,
   1, 1,-1, 0, 0,-1, -1, 1,-1, 0, 0,-1, -1,-1,-1, 0, 0,-1,
  -1,-1, 1, 0, 0, 1,  1,-1, 1, 0, 0, 1,  1, 1, 1, 0, 0, 1,
   1, 1, 1, 0, 0, 1, -1, 1, 1, 0, 0, 1, -1,-1, 1, 0, 0, 1,

  -1,-1,-1, 0,-1, 0,  1,-1,-1, 0,-1, 0,  1,-1, 1, 0,-1, 0,
   1,-1, 1, 0,-1, 0, -1,-1, 1, 0,-1, 0, -1,-1,-1, 0,-1, 0,
  -1, 1,-1, 0, 1, 0,  1, 1,-1, 0, 1, 0,  1, 1, 1, 0, 1, 0,
   1, 1, 1, 0, 1, 0, -1, 1, 1, 0, 1, 0, -1, 1,-1, 0, 1, 0,

  -1,-1,-1,-1, 0, 0, -1, 1,-1,-1, 0, 0, -1, 1, 1,-1, 0, 0,
  -1, 1, 1,-1, 0, 0, -1,-1, 1,-1, 0, 0, -1,-1,-1,-1, 0, 0,
   1,-1,-1, 1, 0, 0,  1, 1,-1, 1, 0, 0,  1, 1, 1, 1, 0, 0,
   1, 1, 1, 1, 0, 0,  1,-1, 1, 1, 0, 0,  1,-1,-1, 1, 0, 0,
  ];

export const octachedron = () => [
  -1, 0, 0,-1,-1,-1,  0,-1, 0,-1,-1,-1,  0, 0,-1,-1,-1,-1,
   1, 0, 0, 1,-1,-1,  0,-1, 0, 1,-1,-1,  0, 0,-1, 1,-1,-1,
  -1, 0, 0,-1, 1,-1,  0, 1, 0,-1, 1,-1,  0, 0,-1,-1, 1,-1,
   1, 0, 0, 1, 1,-1,  0, 1, 0, 1, 1,-1,  0, 0,-1, 1, 1,-1,
  -1, 0, 0,-1,-1, 1,  0,-1, 0,-1,-1, 1,  0, 0, 1,-1,-1, 1,
   1, 0, 0, 1,-1, 1,  0,-1, 0, 1,-1, 1,  0, 0, 1, 1,-1, 1,
  -1, 0, 0,-1, 1, 1,  0, 1, 0,-1, 1, 1,  0, 0, 1,-1, 1, 1,
   1, 0, 0, 1, 1, 1,  0, 1, 0, 1, 1, 1,  0, 0, 1, 1, 1, 1,
  ];

export const bezierPatch = (nu,nv,patch) => parametric((u,v,patch)=>{

   // EXTRACT THE BEZIER PATCH DATA
   let BX = patch[0], BY = patch[1], BZ = patch[2];

   // MATH TO EVALUATE A BEZIER SPLINE
   let M = [ [-1,3,-3,1],[3,-6,3,0],[-3,3,0,0],[1,0,0,0] ];
   let T = (a,t) => a[0]*t*t*t + a[1]*t*t + a[2]*t + a[3];
   let Vi = (V,i,t) => V[i] * T(M[i],t);
   let C = (V,t) => Vi(V,0,t)+Vi(V,1,t)+Vi(V,2,t)+Vi(V,3,t);

   // MATH TO FIND THE POSITION OF ONE POINT ON THE PATCH
   let bezier = (u,v) => {
      let Xu = [], Yu = [], Zu = [];
      for (let i = 0 ; i < 16 ; i += 4) {
         Xu.push(C(BX.slice(i,i+4), u));
         Yu.push(C(BY.slice(i,i+4), u));
         Zu.push(C(BZ.slice(i,i+4), u));
      }
      return [ C(Xu,v), C(Yu,v), C(Zu,v) ];
   }

   // COMPUTE AND RETURN THE POINT AND NORMAL ON THE PATCH
   let P = bezier(u,v),
       N = normalize(cross(subtract(bezier(u+.001,v),P),
                           subtract(bezier(u,v+.001),P)));
   return [ P[0],P[1],P[2], N[0],N[1],N[2] ];

},nu,nv,patch);


export const bezierWire = (nu,nv,B) => parametric((u,v,B) => {

   // EXTRACT THE BEZIER PATH DATA AND TUBE RADIUS
   let BX = B[0], BY = B[1], r = B[2], nk = (BX.length-1)/3;

   // MATH TO EVALUATE A BEZIER SPLINE
   let M = [ [-1,3,-3,1],[3,-6,3,0],[-3,3,0,0],[1,0,0,0] ];
   let T = (a,t) => a[0]*t*t*t + a[1]*t*t + a[2]*t + a[3];
   let Vi = (V,i,t) => V[i] * T(M[i],t);
   let C = (V,t) => Vi(V,0,t)+Vi(V,1,t)+Vi(V,2,t)+Vi(V,3,t);

   // FIND THE SPLINE SEGMENT AND POSITION IN THE SEGMENT
   let n = nk * u - .001 >> 0;
   let f = nk * u - n;

   // FIND THE POINT ON THE SPLINE PATH
   let x = C(BX.slice(3*n), f);
   let y = C(BY.slice(3*n), f);

   // FIND THE DIRECTION ALONG THE SPLINE PATH
   let V = normalize([ C(BX.slice(3*n),f+.001) - x,
                       C(BY.slice(3*n),f+.001) - y ]);

   // FIND POINT AND NORMAL ON TUBE
   let c = Math.cos(2 * Math.PI * v);
   let s = Math.sin(2 * Math.PI * v);
   let N = [ -V[1] * c, V[0] * c, s ];
   let P = [ x + r * N[0], y + r * N[1], r * N[2] ];

   // RETURN POINT AND NORMAL
   return [ P[0],P[1],P[2], N[0],N[1],N[2] ];
},nu,nv,B);


export const transformMeshData = (data,mat,vertexSize) => {
   let xf = (M,p) => [ M[0]*p[0]+M[4]*p[1]+M[ 8]*p[2]+M[12]*p[3],
                       M[1]*p[0]+M[5]*p[1]+M[ 9]*p[2]+M[13]*p[3],
                       M[2]*p[0]+M[6]*p[1]+M[10]*p[2]+M[14]*p[3],
                       M[3]*p[0]+M[7]*p[1]+M[11]*p[2]+M[15]*p[3] ];
    let norm = v => Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
    let normalize = v => { let s=norm(v); return [v[0]/s,v[1]/s,v[2]/s]; }
    
    let itm = inverse(mat);
    
    for (let n = 0 ; n < data.length ; n += vertexSize) {
        let pos = xf(mat, [data[n  ],data[n+1],data[n+2], 1]);
        let nor = xf(itm, [data[n+3],data[n+4],data[n+5], 0]);
        nor = normalize(nor);
        
        data[n  ] = pos[0];
        data[n+1] = pos[1];
        data[n+2] = pos[2];
        
        data[n+3] = nor[0];
        data[n+4] = nor[1];
        data[n+5] = nor[2];
    }
    
    return data;
}

export const glueMeshes = (a,b,vertexSize) => {
    if (a.triangle_strip != b.triangle_strip)
        throw new Error('error: cannot glue two meshes of different types.');
    let mesh = { triangle_strip: a.triangle_strip };
    let V = [];
    for (let n = 0 ; n < a.data.length ; n++)
            V.push(a.data[n]);
    if (mesh.triangle_strip) {
        for (let n = 0 ; n < vertexSize ; n++)
            V.push(a.data[a.data.length - vertexSize + n]);
        for (let n = 0 ; n < vertexSize ; n++)
            V.push(b.data[n]);
    }
    for (let n = 0 ; n < b.data.length ; n++)
        V.push(b.data[n]);
    mesh.data = new Float32Array(V);
    return mesh;
}`,r=`// Author: TapiocaFox
// Title:  Geometry (In Cartesian Space)

export const triangleAnglesFromSides = (a, b, c) => {
    if (a <= 0 || b <= 0 || c <= 0)
        throw new Error("Sides must be positive.");
    if (!(a + b > c && a + c > b && b + c > a))
        throw new Error("Triangle inequality violated.");

    const clamp = x => Math.max(-1, Math.min(1, x));

    const cosA = (b * b + c * c - a * a) / (2 * b * c);
    const cosB = (a * a + c * c - b * b) / (2 * a * c);
    const cosC = (a * a + b * b - c * c) / (2 * a * b);

    const A = Math.acos(clamp(cosA));
    const B = Math.acos(clamp(cosB));
    const C = Math.acos(clamp(cosC));

    return [A, B, C]; // in radians
}

export const angleFromXY = (x, y) => Math.atan2(y, x);
export const norm = a => Math.hypot(...a);
export const normalize = v => { const s = norm(v); return v.length == 3 ? [v[0] / s, v[1] / s, v[2] / s] : [v[0] / s, v[1] / s]; }
export const dot = (a, b) => { let s = 0; for (let i = 0; i < a.length; i++) s += a[i] * b[i]; return s; }
export const multiply = (c, v) => { const r = []; for (let i = 0; i < v.length; i++) r.push(c * v[i]); return r; }
export const distance = (a, b) => { return norm(subtract(a, b)); }
export const subtract = (a, b) => { const v = []; for (let i = 0; i < a.length; i++) v.push(a[i] - b[i]); return v; }
export const add = (a, b) => { const v = []; for (let i = 0; i < a.length; i++) v.push(a[i] + b[i]); return v; }
export const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const mix = (a,b,t) => { let c = []; for (let i=0 ; i<a.length ; i++) c[i] = a[i] + t*(b[i]-a[i]); return c; }`,s=`// Author: TapiocaFox
// Title:  Procedural

import { subtract, dot } from 'geometry';

export const bezier2D = (t, BX, BY) => {
    let nk = (BX.length - 1) / 3;

    // MATH TO EVALUATE A POINT ALONG A BEZIER SPLINE

    const M = [[-1, 3, -3, 1], [3, -6, 3, 0], [-3, 3, 0, 0], [1, 0, 0, 0]];
    const T = (a, t) => a[0] * t * t * t + a[1] * t * t + a[2] * t + a[3];
    const Vi = (V, i, t) => V[i] * T(M[i], t);
    const C = (V, t) => Vi(V, 0, t) + Vi(V, 1, t) + Vi(V, 2, t) + Vi(V, 3, t);

    // FIND THE SPLINE SEGMENT AND POSITION IN THE SEGMENT

    const n = nk * t - .001 >> 0;
    const f = nk * t - n;

    // EVAL AND RETURN THE X AND Y COORDINATES OF THE POINT

    return [C(BX.slice(3 * n), f), C(BY.slice(3 * n), f)];
}


// To match GLSL.
export const smoothstep = (edge0, edge1, x) => {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
};

// Inverse kinematics.
export const inverseKinematics = (A, a, b, C, aim) => {
    // Vector from C to A
    const AC = subtract(A, C);

    const B = [];
    const D = [];

    // Squared length of AC
    const cc = dot(AC, AC);

    // Fraction along AC where B lies (law of cosines)
    const x = (1 + (a * a - b * b) / cc) / 2;

    // Remove aim’s projection on AC → get perpendicular “bend” direction
    const c = dot(AC, aim) / cc;
    for (let i = 0; i < 3; i++) {
        D[i] = aim[i] - c * AC[i];
    }

    // Distance from the AC line to the elbow (B)
    const y = Math.sqrt(Math.max(0, a * a - cc * x * x) / dot(D, D));

    // Final elbow position
    for (let i = 0; i < 3; i++) {
        B[i] = A[i] + x * AC[i] + y * D[i];
    }

    return B;
};`,i=`// Author: TapiocaFox
// Title:  Delta Time Physics
// Assumed units: seconds, meters.
// TODO: Implement BVH.

import { subtract } from 'geometry';

export function Engine(update) {
    this.bodies = [];
    this.timestamp = Date.now();
    this.deltaTime = 0;

    this.tick = () => { // Tick physically for stability.
        const now = Date.now();
        this.deltaTime = now - this.timestamp;
        this.timestamp = now;
        update.call(this);
    };
};

export const newBody = () => { return { position: [0, 0, 0], velocity: [0, 0, 0] } };

// getNewPositionByVelocity, getNewPositionByVelocity
export const integrate = ({current, rate, deltaTime}) => {
    const dt = deltaTime / 1000; // convert ms -> seconds
    return current.map((c, i) => c + rate[i] * dt);
};

// Size for AABBs, or spheres in scalar or vector.
export const getPositionOffsetByBoxBounds = ({position, bounds, size = 0}) => {
    const half = Array.isArray(size) ? size : [size, size, size];

    return position.map((p, i) => {
        const min = bounds[i][0] + half[i];
        const max = bounds[i][1] - half[i];

        if (p < min) return p - min;   // below lower bound
        if (p > max) return p - max;   // above upper bound
        return 0;                      // inside bounds
    });
};

export const defaultGravity = [0, -9.8, 0]; // m/s^2
export const defaultBoxBounds = [[-1, 1], [-1, 1], [-1, 1]];
export const defaultRestitution = 0.7;
export const defaultMaxSubstep = 16;
export const EPSILON = 1e-4; // threshold for resting detection

export const bounceVelocityByBoxBoundsOffsets = ({velocity, offset, restitution = defaultRestitution, epsilon = EPSILON}) => {
    return velocity.map((v, i) => {
        let vel = v;
        if (offset[i] !== 0 && v * offset[i] > 0) vel *= -restitution;
        if (Math.abs(offset[i]) < epsilon && Math.abs(vel) < epsilon) vel = 0;
        return vel;
    });
};
 
// From Prof. Perlin.
export function spring1D({ mass = 1, force = 0, damping = 1, position = 0, velocity = 0, deltaTime}) {
    const dt = deltaTime / 1000;
    mass = Math.max(0.001, mass);
    velocity += (force - position) / mass * dt;
    position = (position + velocity) * (1 - damping * dt);
    return { position, velocity };
};

export const substepUpdate = (update, deltaTime, maxSubstep) => {
    const dt = deltaTime;
    let rdt = dt; // Remaining delta time.
    while (rdt > 0) {
        const step = Math.min(rdt, maxSubstep);
        update(step, rdt);
        rdt -= step;
    }
};

export const createDummyUpdate = (bodySize = 0) => {
    return function () {
        substepUpdate((deltaTime)=> {
            this.bodies.forEach(body => {
                body.velocity = integrate({current: body.velocity, rate: defaultGravity, deltaTime: deltaTime});
                body.position = integrate({current: body.position, rate: body.velocity, deltaTime: deltaTime});
                const offset = getPositionOffsetByBoxBounds({position: body.position, bounds: defaultBoxBounds, size: bodySize});
                body.position = subtract(body.position, offset);
                body.velocity = bounceVelocityByBoxBoundsOffsets({velocity: body.velocity, offset: offset});
            });
        }, this.deltaTime, defaultMaxSubstep);
    };
};
`;export{i as a,o as b,n as c,e as d,r as g,t as m,s as p};
