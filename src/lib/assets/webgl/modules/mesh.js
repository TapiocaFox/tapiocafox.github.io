// Author: TapiocaFox
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
        console.log('error: cannot glue two meshes of different types.');
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
}