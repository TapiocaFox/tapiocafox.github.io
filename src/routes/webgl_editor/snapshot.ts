import { writable } from "svelte/store";

export type Snapshot = {
    name: string;
    timestamp: number;
    img:string;
    vert: string;
    frag: string;
    js: string;
};

export const extension: string = 'fgl';

export const nextSnapshot = writable(null);