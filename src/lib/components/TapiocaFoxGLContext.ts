import type { Status, Asset, Sandbox, IndexModule } from './TapiocaFoxWebGL';

export interface TapiocaFoxGLContext {
    gl: WebGL2RenderingContext,
    canvas: HTMLCanvasElement,
    program: WebGLProgram,
    startTime: number,
    lastRenderTime: number,
    devicePixelRatio: number,
    render: () => void,
    setStatusTitle: (title: string) => void,
    reportStatus: (key: string, status: string, color: string) => void,
    getAssetById: (assetId: string) => Promise<HTMLImageElement | HTMLVideoElement | HTMLAudioElement | Blob>,

    // Do not access the things below.
    statusTitle: string,
    statusDict: Record<string, Status>,
    vertexShader: string,
    fragmentShader: string,
    sandbox: Sandbox,
    indexModule: IndexModule | null,
    assets: Record<string, Asset>
    optimizeViewPort: () => Promise<void>,
    initProgram: (vertexShader: string, fragmentShader: string) => void,
    importIndexModule: () => Promise<void>,
    newProgram: () => void,
    reset: () => Promise<void>,
    start: () => void,
    stop: () => void,
    setShadersModulesAndAssets: (vertexShader: string, fragmentShader: string, modules: Record<string, string>, assets: Record<string, Asset>) => void,
    refreshShadersAndScript: () => Promise<void>,
}

/*
To get TapiocaFoxGLContext export `start` or `stop` functions inside your index module.

For example:

export const start = async (foxGL) => {
    gl = foxGL.gl;
    program = foxGL.program;
    canvas = foxGL.canvas;
};

export const stop = async (foxGL) => {
    gl = foxGL.gl;
    program = foxGL.program;
    canvas = foxGL.canvas;
};
*/