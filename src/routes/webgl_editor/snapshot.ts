import { writable, type Writable } from "svelte/store";
import type { Asset, ModuleSource } from "$lib/components/TapiocaFoxWebGL";

export type Snapshot = {
    name: string;
    timestamp: number;
    img:string;
    vert: string;
    frag: string;
    modules: Record<string, string>;
    assets: Record<string, Asset>;
};

export const extension: string = 'fgl';

export const nextSnapshot: Writable<Snapshot | null> = writable(null);