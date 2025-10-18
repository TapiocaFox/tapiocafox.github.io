// Author: TapiocaFox
// Title:  Geometry (In Cartesian Space)

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


export const norm = a => Math.hypot(...a);
export const normalize = v => { const s = norm(v); return v.length==3 ? [ v[0]/s,v[1]/s,v[2]/s ] : [ v[0]/s,v[1]/s ]; }
export const dot = (a,b) => { let s = 0 ; for (let i=0 ; i<a.length ; i++) s += a[i] * b[i]; return s; }
export const distance = (a, b) => { return norm(subtract(a,b)); }
export const subtract = (a,b) => { const v = []; for (let i=0 ; i<a.length ; i++) v.push(a[i] - b[i]); return v; }
export const cross = (a,b) => [ a[1]*b[2] - a[2]*b[1], a[2]*b[0] - a[0]*b[2], a[0]*b[1] - a[1]*b[0] ];
