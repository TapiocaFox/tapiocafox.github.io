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

type ModuleRecord = {
  code: string;
  url: string;
  exports: any;
};

export function createSandbox() {
  const modules = new Map<string, ModuleRecord>();

  return {
    register(name: string, code: string): string {
      // Revoke old blob URL if exists
      const existing = modules.get(name);
      if (existing?.url) URL.revokeObjectURL(existing.url);

      // Rewrite internal imports
      const rewrittenCode = code.replace(
        /import\s+(?:[\s\S]*?)\s+from\s+['"]([^'"]+)['"]/g,
        (match, depName) => {
          const dep = modules.get(depName);
          if (dep) {
            return match.replace(depName, dep.url);
          }
          return match; // external import stays unchanged
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
      const freshUrl = mod.url + `?v=${Date.now()}`;
      const imported: T = await import(freshUrl);
      mod.exports = imported;
      return imported;
    },

    async replace(name: string, newCode: string): Promise<void> {
      this.register(name, newCode);
      await this.reloadAll();
    },

    async reloadAll(): Promise<void> {
      for (const [name, mod] of modules.entries()) {
        try {
          const imported = await import(mod.url + `?v=${Date.now()}`);
          mod.exports = imported;
        } catch (err) {
          console.error(`Failed to reload module "${name}":`, err);
        }
      }
    },

    clear(): void {
      for (const mod of modules.values()) {
        URL.revokeObjectURL(mod.url);
      }
      modules.clear();
    },
  };
}