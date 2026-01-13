import { Bunnix } from './factory.mjs';
import { render } from './render.mjs';
import { State, Effect, Compute } from './state.mjs';
import { Show, ForEach } from './directives.mjs';

/** @type {import('./index.d.ts').BunnixFactory} */
const BunnixNamespace = /** @type {any} */ (Bunnix);

BunnixNamespace.render = render;
BunnixNamespace.State = State;
BunnixNamespace.Effect = Effect;
BunnixNamespace.Compute = Compute;
BunnixNamespace.Show = Show;
BunnixNamespace.ForEach = ForEach;
BunnixNamespace.Ref = () => ({ current: null });
BunnixNamespace.whenReady = (cb) => queueMicrotask(cb);

// Attach aliases
BunnixNamespace.useState = State;
BunnixNamespace.useEffect = Effect;
BunnixNamespace.useMemo = Compute;
BunnixNamespace.useRef = BunnixNamespace.Ref;

/**
 * The Bunnix Proxy allows for a declarative DSL: Bunnix.div(...)
 * It intercepts property access and returns a tag-specific factory.
 */
const BunnixProxy = new Proxy(BunnixNamespace, {
    get(target, prop) {
        if (typeof prop === 'string') {
            if (prop in target) return target[prop];
            return (...args) => target(prop, ...args);
        }
        return Reflect.get(target, prop);
    }
});

export const useState = State;
export const useEffect = Effect;
export const useMemo = Compute;
export const whenReady = BunnixNamespace.whenReady;
export const useRef = BunnixNamespace.Ref;

export { render, Show, ForEach, Compute };
export default BunnixProxy;
