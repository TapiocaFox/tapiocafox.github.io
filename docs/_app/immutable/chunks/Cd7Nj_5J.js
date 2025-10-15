const n=`// Author: TapiocaFox
// Title:  Matrix (From Prof. Perlin)

// Transformations. Column major.
export const identity = () => [1,0,0,0, 
                               0,1,0,0, 
                               0,0,1,0, 
                               0,0,0,1];
// Row.
export const rotateX = r => [1,0,0,0,
                      0,Math.cos(r),Math.sin(r),0,
                      0,-Math.sin(r),Math.cos(r),0,
                      0,0,0,1];
// Pitch.
export const rotateY = r => [Math.cos(r),0,-Math.sin(r),0,
                      0,1,0,0,
                      Math.sin(r),0,Math.cos(r),0,
                      0,0,0,1];
// Yaw.
export const rotateZ = r => [Math.cos(r),Math.sin(r),0,0,
                      -Math.sin(r),Math.cos(r),0,0,
                      0,0,1,0,
                      0,0,0,1];
// Translate.
export const translate = (x,y,z) => [1,0,0,0,
                              0,1,0,0,
                              0,0,1,0,
                              x,y,z,1];

// Scale.
export const scale = (x,y,z) => [x,0,0,0,
                          0,y,0,0,
                          0,0,z,0,
                          0,0,0,1];

// Perspective.
export const perspective = (x,y,z) => [1,0,0,x, 
                                       0,1,0,y??x, 
                                       0,0,1,z??x, 
                                       0,0,0,1];

// Matrix operations.
export const mxm = (a,b) => {
   let m = [];
   for (let c = 0 ; c < 16 ; c += 4)
       for (let r = 0 ; r < 4 ; r++)
          m.push(a[r]*b[c]+a[r+4]*b[c+1]+a[r+8]*b[c+2]+a[r+12]*b[c+3]);
   return m;
}

export const transpose = m => [ m[0],m[4],m[ 8],m[12],
                       m[1],m[5],m[ 9],m[13],
                       m[2],m[6],m[10],m[14],
                       m[3],m[7],m[11],m[15] ];

export const inverse = src => {
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

export const qxm = (Q,M) => {
   let MI = inverse(M);
   return mxm(transpose(MI), mxm(Q, MI));
}

export function Matrix() {
   let m = [identity()], top = 0;
   this.push = () => { m[top+1] = m[top].slice(); top++; return this; }
   this.pop = () => { if (top > 0) top--; return this; }
   this.get = () => m[top];
   this.identity = () => { m[top] = identity(); return this; }
   this.translate = (x,y,z) => { m[top]=mxm(m[top],translate(x,y,z)); return this; }
   this.rotateX = a => { m[top] = mxm(m[top], rotateX(a)); return this; }
   this.rotateY = a => { m[top] = mxm(m[top], rotateY(a)); return this; }
   this.rotateZ = a => { m[top] = mxm(m[top], rotateZ(a)); return this; }
   this.scale = (x,y,z) => {
      m[top] = mxm(m[top], scale(x,y,z));
      return this;
   }
   this.perspective = (x,y,z) => {
      m[top] = mxm(m[top], perspective(x,y,z));
      return this;
   }
}`,t=`// Author: TapiocaFox
// Title:  Mesh (From Prof. Perlin)

import { inverse } from 'matrix';

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
}`,e=`// Author: TapiocaFox
// Title:  Geometry

export const triangleAnglesFromSides = (a, b, c) => {
  if (a <= 0 || b <= 0 || c <= 0)
    throw new Error("Sides must be positive.");
  if (!(a + b > c && a + c > b && b + c > a))
    throw new Error("Triangle inequality violated.");

  const clamp = x => Math.max(-1, Math.min(1, x));

  const cosA = (b*b + c*c - a*a) / (2 * b * c);
  const cosB = (a*a + c*c - b*b) / (2 * a * c);
  const cosC = (a*a + b*b - c*c) / (2 * a * b);

  const A = Math.acos(clamp(cosA));
  const B = Math.acos(clamp(cosB));
  const C = Math.acos(clamp(cosC));

  return [A, B, C]; // in radians
};

export const distance = (a, b) => {
    const distances = [];
    for(let i=0; i<a.length; i++) {
        distances.push(a[i]-b[i]);
    }
    return Math.hypot(...distances);
}

export const normalize = (a) => {
    return Math.hypot(...a);
}`,r=`// Author: TapiocaFox
// Title:  Quadric Surface Matrices (From Prof. Perlin)

import { mxm, qxm, scale, translate } from 'matrix';

export const qGlobal = [0,0,0,0,
                 0,0,0,0,
                 0,0,0,0,
                 0,0,0,-1];

export const qSphere = [1,0,0,0,
                 0,1,0,0,
                 0,0,1,0,
                 0,0,0,-1];

export const qParabX = [0,0,0,1,
                 0,1,0,0,
                 0,0,1,0,
                 0,0,0,0];

export const qParabY = [1,0,0,0,
                 0,0,0,1,
                 0,0,1,0,
                 0,0,0,0];

export const qParabZ = [1,0,0,0,
                 0,1,0,0,
                 0,0,0,1,
                 0,0,0,0];

export const qSlabX = [1,0,0,0,
                0,0,0,0,
                0,0,0,0,
                0,0,0,-1];

export const qSlabY = [0,0,0,0,
                0,1,0,0,
                0,0,0,0,
                0,0,0,-1];

export const qSlabZ = [0,0,0,0,
                0,0,0,0,
                0,0,1,0,
                0,0,0,-1];

export const qTubeX = [0,0,0,0,
                0,1,0,0,
                0,0,1,0,
                0,0,0,-1];

export const qTubeY = [1,0,0,0,
                0,0,0,0,
                0,0,1,0,
                0,0,0,-1];

export const qTubeZ = [1,0,0,0,
                0,1,0,0,
                0,0,0,0,
                0,0,0,-1];

export const qConeX = [-1,0,0,0,
                 0,1,0,0,
                 0,0,1,0,
                 0,0,0,0];

export const qConeY = [1,0,0,0,
                0,-1,0,0,
                0,0,1,0,
                0,0,0,0];

export const qConeZ = [1,0,0,0,
                0,1,0,0,
                0,0,-1,0,
                0,0,0,0];

// Predefined systems.
export const cubeSystem = [qSlabX, qSlabY, qSlabZ]; // Cube
export const hourglassSystem = [qSlabX, qConeX, qGlobal]; // Hourglass
export const coneSystem = [qConeX, qxm(qSlabX,mxm(scale(.5,1,1),translate(1,0,0))), qGlobal]; // Real cone
export const cylinderSystem = [qTubeX, qSlabX, qGlobal]; // Cylinder
export const noseSystem = [qParabX, qSlabX, qGlobal]; // Nose
export const sphereSystem = [qSphere, qGlobal, qGlobal]; // Sphere`;export{t as a,e as g,n as m,r as q};
