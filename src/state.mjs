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

export function Effect(cb, deps) {
    const rawDeps = deps ? (Array.isArray(deps) ? deps : [deps]) : []
    const states = rawDeps.filter(s => s && typeof s.get === 'function' && typeof s.subscribe === 'function')
    const disposers = states.map(s => s.subscribe(cb))

    const firstStateValue = states.length === 1 ? states[0].get() : undefined
    cb(firstStateValue)

    return () => disposers.forEach(d => d?.())
}

const toReadonly = (state) => ({
    get: () => state.get(),
    subscribe: (cb) => state.subscribe(cb),
    map: (fn) => toReadonly(state.map(fn))
});

export function Compute(deps, fn) {
    const rawDeps = deps ? (Array.isArray(deps) ? deps : [deps]) : []
    const states = rawDeps.filter(s => s && typeof s.get === 'function' && typeof s.subscribe === 'function')
    const computeValue = () => fn(...states.map(s => s.get()))
    const derived = State(computeValue())

    const update = () => {
        derived.set(computeValue())
    }

    states.forEach(s => s.subscribe(update))

    return toReadonly(derived)
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
