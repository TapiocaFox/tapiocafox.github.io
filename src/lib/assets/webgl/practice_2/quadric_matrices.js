// Author: TapiocaFox
// Title:  Quadric Surface (System)

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

export default {
    qGlobal,
    qSphere,
    qParabX,
    qParabY,
    qParabZ,
    qSlabX,
    qSlabY,
    qSlabZ,
    qTubeX,
    qTubeY,
    qTubeZ,
    qConeX,
    qConeY,
    qConeZ,
}
