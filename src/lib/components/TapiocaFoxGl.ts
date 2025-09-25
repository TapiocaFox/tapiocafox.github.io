export interface TapiocaFoxGLContext {
    gl: WebGL2RenderingContext,
    canvas: HTMLCanvasElement,
    program: WebGLProgram,
    startTime: number,
    lastRenderTime: number,
    devicePixelRatio: number,
    statusDict: Record<string, string>, // Do not access this inside the snippet.
    vertex_shader: string, // Do not access this inside the snippet.
    fragment_shader: string, // Do not access this inside the snippet.
    javascript: string, // Do not access this inside the snippet.

    onStart: (start: () => Promise<void>) => void,
    onStop: (stop: () => Promise<void>) => void,
    render: () => void,
    reportStatus: (key: string, status: string) => void,
    invokeStart: (() => Promise<void>) | null, // Do not run this inside the snippet.
    invokeStop: (() => Promise<void>) | null, // Do not run this inside the snippet.
    optimizeViewPort: () => Promise<void>, // Do not run this inside the snippet.
    initProgram: (vertexShader: string, fragmentShader: string) => void, // Do not run this inside the snippet.
    evalJavaScript: () => void, // Do not run this inside the snippet.
    newProgram: () => void, // Do not run this inside the snippet.
    reset: () => Promise<void>, // Do not run this inside the snippet.
    start: () => void, // Do not run this inside the snippet.
    stop: () => void, // Do not run this inside the snippet.
    setup: (vertex_shader: string, fragment_shader: string, javascript: string) => void, // Do not run this inside the snippet.
    run: () => Promise<void>, // Do not run this inside the snippet.
}