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

    onStart: (start: () => void) => void,
    onStop: (stop: () => void) => void,
    render: () => void,
    reportStatus: (key: string, status: string) => void,
    start: (() => void) | null, // Do not run this inside the snippet.
    stop: (() => void) | null, // Do not run this inside the snippet.
    optimizeViewPort: () => void, // Do not run this inside the snippet.
    initProgram: (vertexShader: string, fragmentShader: string) => void, // Do not run this inside the snippet.
    newProgram: () => void, // Do not run this inside the snippet.
    reset: () => void, // Do not run this inside the snippet.
    run: (vertex_shader: string, fragment_shader: string, javascript: string) => void, // Do not run this inside the snippet.
}