import { bunnixToDOM } from './dom.mjs';
import { isDev } from './dev.mjs';

function validateState(val, contextName) {
    if (!val || typeof val.get !== 'function' || typeof val.subscribe !== 'function') {
        const type = val === null ? 'null' : typeof val;
        throw new Error(`[Bunnix] ${contextName}: Expected a State object but received ${type}. Primitives/Values are not supported.`);
    }
}

/**
 * Conditional rendering
 */
export function Show(state, vdom) {
    validateState(state, 'Show');
    const anchor = document.createComment('bunnix-show')
    let el = null
    let renderToken = 0
    let lastVisible = null

    const update = (visible) => {
        const token = ++renderToken
        if (visible) {
            if (el) el.remove();
            const content = typeof vdom === 'function' ? vdom(visible) : vdom;
            const nextEl = bunnixToDOM(content)
            if (token !== renderToken) {
                if (isDev()) {
                    console.warn('[DEV] Bunnix.Show: render superseded by a newer update.');
                }
                return;
            }
            el = nextEl
            anchor.parentNode?.insertBefore(el, anchor)
        } else if (!visible && el) {
            el.remove(); el = null
        }
    }

    const initialVisible = state.get();
    lastVisible = initialVisible;
    state.subscribe((visible) => {
        if (visible === lastVisible) return;
        lastVisible = visible;
        update(visible);
    })

    const frag = document.createDocumentFragment()
    if (initialVisible) {
        const token = ++renderToken
        const content = typeof vdom === 'function' ? vdom(initialVisible) : vdom;
        const nextEl = bunnixToDOM(content)
        if (token === renderToken) {
            el = nextEl
            frag.append(el)
        } else {
            if (isDev()) {
                console.warn('[DEV] Bunnix.Show: render superseded by a newer update.');
            }
        }
    }
    frag.append(anchor)
    return frag
}

/**
 * Keyed list rendering with minimal diffing.
 */
export function ForEach(itemsState, keyOrOptions, render) {
    if (!Array.isArray(itemsState)) {
        validateState(itemsState, 'ForEach');
    }

    const anchor = document.createComment('bunnix-foreach');
    const keyPath = typeof keyOrOptions === 'string'
        ? keyOrOptions
        : keyOrOptions?.key;

    const getItems = () => {
        if (itemsState && typeof itemsState.get === 'function') return itemsState.get() || [];
        return Array.isArray(itemsState) ? itemsState : [];
    };

    const entries = new Map();

    const warnMissingKey = (index) => {
        console.warn(`Bunnix.ForEach: missing key for item at index ${index}, falling back to index.`);
    };

    const resolveKey = (item, index) => {
        if (!keyPath) return index;
        const key = item?.[keyPath];
        if (key === undefined || key === null) {
            warnMissingKey(index);
            return index;
        }
        return key;
    };

    const moveRange = (entry, beforeNode) => {
        const parent = beforeNode.parentNode;
        if (!parent) return;
        const nodes = [];
        let node = entry.start;
        while (node) {
            nodes.push(node);
            if (node === entry.end) break;
            node = node.nextSibling;
        }
        for (const n of nodes) {
            parent.insertBefore(n, beforeNode);
        }
    };

    const createEntry = (item, index, key) => {
        const start = document.createComment('bunnix-foreach:start');
        const end = document.createComment('bunnix-foreach:end');
        const content = typeof render === 'function' ? render(item, index) : render;
        const dom = bunnixToDOM(content);
        return { key, item, start, end, dom };
    };

    const insertEntry = (entry, beforeNode) => {
        const parent = beforeNode.parentNode;
        if (!parent) return;
        parent.insertBefore(entry.start, beforeNode);
        parent.insertBefore(entry.dom, beforeNode);
        parent.insertBefore(entry.end, beforeNode);
    };

    const removeEntry = (entry) => {
        let node = entry.start;
        while (node) {
            const next = node.nextSibling;
            node.remove();
            if (node === entry.end) break;
            node = next;
        }
    };

    let flushQueued = false;

    const flushPending = () => {
        if (!anchor.parentNode) return false;
        for (const entry of entries.values()) {
            if (!entry.start.parentNode) {
                insertEntry(entry, anchor);
            }
        }
        return true;
    };

    const scheduleFlush = () => {
        if (flushQueued) return;
        flushQueued = true;
        queueMicrotask(() => {
            flushQueued = false;
            if (!flushPending()) {
                scheduleFlush();
            }
        });
    };

    const update = () => {
        const items = getItems();
        const nextKeys = new Set();

        for (let index = 0; index < items.length; index++) {
            const item = items[index];
            const key = resolveKey(item, index);
            if (nextKeys.has(key)) {
                console.warn(`Bunnix.ForEach: duplicate key "${String(key)}" at index ${index}, falling back to index.`);
            }
            const entryKey = nextKeys.has(key) ? index : key;
            nextKeys.add(entryKey);

            let entry = entries.get(entryKey);
            if (!entry) {
                entry = createEntry(item, index, entryKey);
                entries.set(entryKey, entry);
                insertEntry(entry, anchor);
            } else {
                if (entry.item !== item) {
                    const content = typeof render === 'function' ? render(item, index) : render;
                    const nextDom = bunnixToDOM(content);
                    entry.dom.replaceWith(nextDom);
                    entry.dom = nextDom;
                    entry.item = item;
                }
                if (!entry.start.parentNode) {
                    insertEntry(entry, anchor);
                } else {
                    moveRange(entry, anchor);
                }
            }
        }

        for (const [key, entry] of entries) {
            if (!nextKeys.has(key)) {
                removeEntry(entry);
                entries.delete(key);
            }
        }

        if (!flushPending()) {
            scheduleFlush();
        }
    };

    const state = itemsState && typeof itemsState.subscribe === 'function' ? itemsState : null;
    if (state) state.subscribe(update);

    const frag = document.createDocumentFragment();
    frag.append(anchor);
    update();
    return frag;
}
