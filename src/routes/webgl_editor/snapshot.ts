import { writable, type Writable } from "svelte/store";
import type { Asset } from "$lib/components/TapiocaFoxGl";

export type Snapshot = {
    name: string;
    timestamp: number;
    img:string;
    vert: string;
    frag: string;
    js: string;
    assets: Record<string, Asset>;
};

export const extension: string = 'fgl';

export const nextSnapshot: Writable<Snapshot | null> = writable(null);