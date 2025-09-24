// Reference: https://stackoverflow.com/questions/56488202/how-to-persist-svelte-store

import { browser } from '$app/environment';
import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';
import { get as idbGet, set as idbSet, del as idbDel } from 'idb-keyval';


export const storage = <T>(key: string, initValue: T) => {
    const store = writable<T>(initValue);

    if (!browser) return { store, ready: Promise.resolve() };

    let resolveReady: () => void;
    const ready = new Promise<void>((resolve) => (resolveReady = resolve));

    idbGet<T>(key).then((storedValue) => {
        if (storedValue !== undefined) store.set(storedValue);
        resolveReady!();
    });

    store.subscribe((val: T | null) => {
        if (val == null) idbDel(key);
        else idbSet(key, val);
    });

    return { store, ready };
};

export default storage;