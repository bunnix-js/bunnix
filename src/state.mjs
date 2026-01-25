export function State(value) {
    const listeners = []
    return {
        get: () => value,
        set: (v) => {
            if (Object.is(v, value)) return;
            value = v;
            listeners.forEach(cb => cb(v))
        },
        subscribe: (cb) => {
            listeners.push(cb)
            return () => {
                const i = listeners.indexOf(cb)
                if (i > -1) listeners.splice(i, 1)
            }
        },
        map: (fn) => {
            const derived = State(fn(value))
            listeners.push(v => derived.set(fn(v)))
            return derived
        }
    }
}

function validateState(val, contextName) {
    if (!val || typeof val.get !== 'function' || typeof val.subscribe !== 'function') {
        const type = val === null ? 'null' : typeof val;
        throw new Error(`[Bunnix] ${contextName}: Expected a State object but received ${type}. Primitives/Values are not supported.`);
    }
}

export function Effect(cb, deps) {
    const rawDeps = deps ? (Array.isArray(deps) ? deps : [deps]) : []
    rawDeps.forEach((s, i) => validateState(s, `Effect dependency at index ${i}`))
    
    const disposers = rawDeps.map(s => s.subscribe(cb))

    const firstStateValue = rawDeps.length === 1 ? rawDeps[0].get() : undefined
    cb(firstStateValue)

    return () => disposers.forEach(d => d?.())
}

const toReadonly = (state) => ({
    get: () => state.get(),
    subscribe: (cb) => state.subscribe(cb),
    map: (fn) => toReadonly(state.map(fn))
});

export function Compute(deps, fn) {
    const rawDeps = deps ? (Array.isArray(deps) ? deps : [deps]) : [];

    const isState = (s) => s && typeof s.get === 'function' && typeof s.subscribe === 'function';

    const getValues = () => rawDeps.map(dep => isState(dep) ? dep.get() : dep);

    const derived = State(fn(...getValues()));

    const update = () => {
        derived.set(fn(...getValues()));
    };

    // Only subscribe to the actual states
    rawDeps.forEach(dep => {
        if (isState(dep)) {
            dep.subscribe(update);
        }
    });

    return toReadonly(derived);
}

export function RefState(initialValue) {
    const listeners = []
    let value = initialValue

    const setter = (v) => {
        if (Object.is(v, value)) return;
        value = v;
        state.current = v;
        listeners.forEach(cb => cb(v))
    }

    const state = {
        current: value,
        get: () => value,
        subscribe: (cb) => {
            listeners.push(cb)
            return () => {
                const i = listeners.indexOf(cb)
                if (i > -1) listeners.splice(i, 1)
            }
        },
        [Symbol.for('bunnix.ref.set')]: setter
    }

    return state
}
