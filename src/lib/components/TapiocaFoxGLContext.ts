import type { Status, Asset, Sandbox, IndexModule } from './TapiocaFoxWebGL';

export interface TapiocaFoxGLContext {
    gl: WebGL2RenderingContext,
    canvas: HTMLCanvasElement,
    program: WebGLProgram,
    startTime: number,
    lastRenderTime: number,
    devicePixelRatio: number,
    onStart: (start: () => Promise<void>) => void,
    onStop: (stop: () => Promise<void>) => void,
    render: () => void,
    setStatusTitle: (title: string) => void,
    reportStatus: (key: string, status: string, color: string) => void,
    loadScriptFromSource: (src: string) => Promise<void>,
    getAssetById: (assetId: string) => Promise<HTMLImageElement | HTMLVideoElement | HTMLAudioElement | Blob>,

    // Do not access the things below.
    statusTitle: string,
    statusDict: Record<string, Status>,
    vertexShader: string,
    fragmentShader: string,
    sandbox: Sandbox,
    indexModule: IndexModule | null,
    assets: Record<string, Asset>
    loadedScripts: Array<HTMLScriptElement>,
    unloadLoadedScripts: () => void,
    invokeStart: (() => Promise<void>) | null,
    invokeStop: (() => Promise<void>) | null,
    optimizeViewPort: () => Promise<void>,
    initProgram: (vertexShader: string, fragmentShader: string) => void,
    importIndexModule: () => Promise<void>,
    newProgram: () => void,
    reset: () => Promise<void>,
    start: () => void,
    stop: () => void,
    setShadersScriptAndAssets: (vertexShader: string, fragmentShader: string, javascript: string, assets: Record<string, Asset>) => void,
    refreshShadersAndScript: () => Promise<void>,
}
