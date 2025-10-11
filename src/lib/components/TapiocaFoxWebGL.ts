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
  start: () => Promise<void> | null;
  stop: () => Promise<void> | null;
}

type ModuleRecord = {
  code: string;
  url: string;
  exports: any;
};

export interface Sandbox {
  register(name: string, code: string): string;
  import<T = any>(name: string): Promise<T>;
  replace(name: string, newCode: string): Promise<void>;
  reloadAll(): Promise<void>;
  clear(): void;
}

export function createSandbox(): Sandbox {
  const modules = new Map<string, ModuleRecord>();

  return {
    /**
     * Register a module by name
     */
    register(name: string, code: string): string {
      // Revoke old blob URL if exists
      const existing = modules.get(name);
      if (existing?.url) URL.revokeObjectURL(existing.url);

      // Rewrite internal imports
      const rewrittenCode = code.replace(
        /import\s+(?:[\s\S]*?)\s+from\s+['"]([^'"]+)['"]/g,
        (match, depName) => {
          const dep = modules.get(depName);
          if (dep) return match.replace(depName, dep.url);
          return match; // external import stays unchanged
        }
      );

      // Create blob URL
      const blob = new Blob([rewrittenCode], { type: "application/javascript" });
      const url = URL.createObjectURL(blob);

      modules.set(name, { code, url, exports: null });
      return url;
    },

    /**
     * Import a module by name
     */
    async import<T = any>(name: string): Promise<T> {
      const mod = modules.get(name);
      if (!mod) throw new Error(`Module "${name}" not found`);
      const imported: T = await import(mod.url); // no ?v= appended
      mod.exports = imported;
      return imported;
    },

    /**
     * Replace module code and reload all modules
     */
    async replace(name: string, newCode: string): Promise<void> {
      this.register(name, newCode);
      await this.reloadAll();
    },

    /**
     * Reload all modules (re-imports them from their blob URLs)
     */
    async reloadAll(): Promise<void> {
      for (const [name, mod] of modules.entries()) {
        try {
          const imported = await import(mod.url);
          mod.exports = imported;
        } catch (err) {
          console.error(`Failed to reload module "${name}":`, err);
        }
      }
    },

    /**
     * Clear all modules and revoke blob URLs
     */
    clear(): void {
      for (const mod of modules.values()) URL.revokeObjectURL(mod.url);
      modules.clear();
    },
  };
}