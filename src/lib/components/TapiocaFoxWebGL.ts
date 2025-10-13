import type{ TapiocaFoxGLContext } from './TapiocaFoxGLContext';
export type Asset = {
  id: string;
  type: 'image' | 'video' | 'audio' | 'blob';
  srcType: 'local' | 'link';
  src: string;
}

export type Status = {
  text: string;
  color: string;
}

export type IndexModule = {
  start: (foxGL: TapiocaFoxGLContext) => Promise<void> | null;
  stop: (foxGL: TapiocaFoxGLContext) => Promise<void> | null;
}

export type ModuleSource = {
  name: string;
  code: string;
};

type ModuleRecord = {
  code: string;
  url: string | null;
  exports: any;
  deps: string[];
};

export type UncaughtErrorListener = (moduleName: string, error: unknown) => void;

export interface Sandbox {
  register(name: string, code: string): void;
  commit(): void;
  import<T = any>(name: string): Promise<T>;
  replace(name: string, newCode: string): Promise<void>;
  preloadAll(): Promise<Error | void>;
  clear(): void;
  addUncaughtErrorListener(listener: UncaughtErrorListener): void;
  removeUncaughtErrorListener(listener: UncaughtErrorListener): void;
}

export function createSandbox(): Sandbox {
  const modules = new Map<string, ModuleRecord>();
  const errorListeners = new Set<UncaughtErrorListener>();
  let order: string[] = [];

  function notifyError(moduleName: string, error: unknown) {
    // console.log(errorListeners);
    for (const listener of errorListeners) listener(moduleName, error);
  }

  function getModuleNameFromUrl(url: string | null): string {
    if (!url) return 'unknown module';
    for (const [name, mod] of modules.entries()) {
      if (mod.url === url || url?.includes(mod.url!)) return name;
    }
    return 'unknown module';
  }

  window.addEventListener('error', (event) => {
    const moduleName = getModuleNameFromUrl(event.filename);
    notifyError(moduleName, event.error ?? event.message);
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    if (!(reason instanceof Error) || !reason.stack) return;
    const mod = [...modules.values()].find((m) => reason.stack?.includes(m.url!));
    if (mod) notifyError(getModuleNameFromUrl(mod.url), reason);
  });

  function parseDeps(code: string): string[] {
    const deps: string[] = [];
    code.replace(/import\s+(?:.+?)\s+from\s+['"]([^'"]+)['"]/g, (_, depName) => {
      deps.push(depName);
      return _;
    });
    return deps;
  }

  function topologicalSort(): string[] {
    const visited = new Set<string>();
    const temp = new Set<string>();
    const sorted: string[] = [];

    function visit(name: string, path: string[] = []) {
      if (visited.has(name)) return;
      if (temp.has(name)) {
        const cyclePath = [...path, name].join(' -> ');
        throw new Error(`Circular dependency detected: ${cyclePath}`);
      }
      temp.add(name);
      const mod = modules.get(name);
      if (!mod) throw new Error(`Module "${name}" not found for topological sort`);
      for (const dep of mod.deps) {
        if (modules.has(dep)) visit(dep, [...path, name]);
      }
      temp.delete(name);
      visited.add(name);
      sorted.push(name);
    }

    for (const name of modules.keys()) visit(name);
    return sorted;
  }

  function rewriteCode(code: string): string {
    return code.replace(
      /import\s+(.+?)\s+from\s+['"]([^'"]+)['"]/g,
      (full, imported, depName) => {
        const dep = modules.get(depName);
        if (dep?.url) return `import ${imported} from '${dep.url}'`;
        return full;
      }
    );
  }

  return {
    register(name: string, code: string) {
      if (modules.has(name)) {
        const old = modules.get(name)!;
        if (old.url) URL.revokeObjectURL(old.url);
      }
      modules.set(name, { code, url: null, exports: null, deps: parseDeps(code) });
    },

    commit() {
      order = topologicalSort();
      for (const name of order) {
        const mod = modules.get(name)!;
        const rewritten = rewriteCode(mod.code);
        if (mod.url) URL.revokeObjectURL(mod.url);
        const blob = new Blob([rewritten], { type: 'application/javascript' });
        mod.url = URL.createObjectURL(blob);
      }
    },

    async import<T = any>(name: string): Promise<T> {
      const mod = modules.get(name);
      if (!mod || !mod.url) throw new Error(`Module "${name}" not committed`);
      try {
        const imported: T = await import(mod.url);
        mod.exports = imported;
        return imported;
      } catch (err) {
        notifyError(name, err);
        throw err;
      }
    },

    async replace(name: string, newCode: string): Promise<void> {
      this.register(name, newCode);
      this.commit();
      // await this.reloadAll();
    },

    async preloadAll(): Promise<Error | void> {
      for (const name of order) {
        console.log('name', name);
        const mod = modules.get(name)!;
        if (!mod.url) return new Error(`Module "${name}" not committed`);
        try {
          await this.import(name);
        }
        catch(error: any) {
          return error;
        }
      }
    },

    clear() {
      for (const mod of modules.values()) if (mod.url) URL.revokeObjectURL(mod.url);
      modules.clear();
      // errorListeners.clear();
    },

    addUncaughtErrorListener(listener: UncaughtErrorListener) {
      errorListeners.add(listener);
      // console.log(errorListeners);
    },

    removeUncaughtErrorListener(listener: UncaughtErrorListener) {
      errorListeners.delete(listener);
    },
  };
}

export const default_module = 'index';