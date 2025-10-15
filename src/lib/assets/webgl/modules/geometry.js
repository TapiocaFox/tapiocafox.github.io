// Author: TapiocaFox
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