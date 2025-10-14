// Author: TapiocaFox
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
export const sphereSystem = [qSphere, qGlobal, qGlobal]; // Sphere