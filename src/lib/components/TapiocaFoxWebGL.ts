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
  url: string;
  exports: any;
};

export type UncaughtErrorListener = (moduleName: string, error: unknown) => void;

export interface Sandbox {
  register(name: string, code: string): string;
  import<T = any>(name: string): Promise<T>;
  replace(name: string, newCode: string): Promise<void>;
  reloadAll(): Promise<void>;
  clear(): void;
  addUncaughtErrorListener(listener: UncaughtErrorListener): void;
  removeUncaughtErrorListener(listener: UncaughtErrorListener): void;
}

export function createSandbox(): Sandbox {
  const modules = new Map<string, ModuleRecord>();
  const errorListeners = new Set<UncaughtErrorListener>();

  function notifyError(moduleName: string, error: unknown) {
    for (const listener of errorListeners) listener(moduleName, error);
  }

  // Try to map a URL back to a module name
  function getModuleNameFromUrl(url: string | undefined): string {
    if (!url) return "unknown module";
    for (const [name, mod] of modules.entries()) {
      if (mod.url === url || url.includes(mod.url)) return name;
    }
    return "unknown module";
  }

  // Global runtime error listener
  function handleWindowError(event: ErrorEvent) {
    const moduleName = getModuleNameFromUrl(event.filename);
    notifyError(moduleName, event.error ?? event.message);
  }

  function handlePromiseRejection(event: PromiseRejectionEvent) {
    const reason = event.reason;
    if (!(reason instanceof Error) || !reason.stack) return;

    const stack = reason.stack;
    const mod = [...modules.values()].find(m => stack.includes(m.url));

    if (mod) {
      notifyError(getModuleNameFromUrl(mod.url), reason);
    } else {
      // Optional: log but ignore, or handle separately
      console.debug("[Sandbox] Ignoring external promise rejection:", reason);
    }
  }

  window.addEventListener("error", handleWindowError);
  window.addEventListener("unhandledrejection", handlePromiseRejection);

  return {
    register(name: string, code: string): string {
      const existing = modules.get(name);
      if (existing?.url) URL.revokeObjectURL(existing.url);

      const rewrittenCode = code.replace(
        /import\s+(?:[\s\S]*?)\s+from\s+['"]([^'"]+)['"]/g,
        (match, depName) => {
          const dep = modules.get(depName);
          if (dep) return match.replace(depName, dep.url);
          return match;
        }
      );

      const blob = new Blob([rewrittenCode], { type: "application/javascript" });
      const url = URL.createObjectURL(blob);
      modules.set(name, { code, url, exports: null });
      return url;
    },

    async import<T = any>(name: string): Promise<T> {
      const mod = modules.get(name);
      if (!mod) throw new Error(`Module "${name}" not found`);
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
      await this.reloadAll();
    },

    async reloadAll(): Promise<void> {
      for (const [name, mod] of modules.entries()) {
        try {
          // revoke old URL to free memory
          URL.revokeObjectURL(mod.url);

          // create a fresh blob with the same source code
          const blob = new Blob([mod.code], { type: "application/javascript" });
          const newUrl = URL.createObjectURL(blob);
          mod.url = newUrl;

          // re-import the module (must be dynamic)
          const imported = await import(/* @vite-ignore */ newUrl);
          mod.exports = imported;
        } catch (err) {
          notifyError(name, err);
          console.error(`Failed to reload module "${name}":`, err);
        }
      }
    },

    clear(): void {
      for (const mod of modules.values()) URL.revokeObjectURL(mod.url);
      modules.clear();
      errorListeners.clear();

      window.removeEventListener("error", handleWindowError);
      window.removeEventListener("unhandledrejection", handlePromiseRejection);
    },

    addUncaughtErrorListener(listener: UncaughtErrorListener): void {
      errorListeners.add(listener);
    },

    removeUncaughtErrorListener(listener: UncaughtErrorListener): void {
      errorListeners.delete(listener);
    },
  };
}