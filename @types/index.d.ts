/// <reference path="./bunnix-jsx.d.ts" />

/**
 * Bunnix Core Type Definitions
 */

export interface State<T> {
    get(): T;
    set(value: T): void;
    subscribe(callback: (value: T) => void): () => void;
    map<R>(fn: (value: T) => R): State<R>;
}

export interface ReadonlyState<T> {
    get(): T;
    subscribe(callback: (value: T) => void): () => void;
    map<R>(fn: (value: T) => R): ReadonlyState<R>;
}

export interface StateSource<T> {
    get(): T;
    subscribe(callback: (value: T) => void): () => void;
}

export interface Ref<T> extends StateSource<T> {
    current: T;
}

export function useState<T>(value: T): State<T>;

export function useEffect(
    callback: (val?: any) => void | (() => void),
    dependencies?: StateSource<any> | Array<StateSource<any>>
): () => void;

export function Compute<T>(
    deps: StateSource<any> | readonly unknown[],
    compute: (...values: any[]) => T
): ReadonlyState<T>;

export type VNode = {
    tag: any;
    props: any;
    events: any;
    children: any[];
};


export interface BunnixFactory {
    (tag: any, propsOrChildren?: any, ...children: any[]): VNode;

    useState: typeof useState;
    useEffect: typeof useEffect;
    useMemo: typeof Compute;
    useRef: typeof useRef;
    render(component: any, container: Element): void;
    toDOM(element: any, svgContext?: boolean): Node;
    whenReady(callback: () => void): void;
    Show<T>(state: State<T> | ReadonlyState<T>, content: ((value: NonNullable<T>) => any) | any): any;
    ForEach<T>(
        items: State<T[]> | ReadonlyState<T[]> | T[],
        options: { key?: keyof T } | keyof T,
        render: (item: T, index: number) => any
    ): any;
    State: typeof useState;
    Effect: typeof useEffect;
    Compute: typeof Compute;
    Ref: typeof useRef;
    /** Dynamic tag factory (e.g., Bunnix.div(...)) */
    [tag: string]: any;
}

export const Bunnix: BunnixFactory;
export default Bunnix;

export const useMemo: typeof Compute;
export function useRef<T = null>(): Ref<T | null>;
export function useRef<T>(initialValue: T): Ref<Exclude<T, undefined> | (undefined extends T ? null : never)>;
export const whenReady: (callback: () => void) => void;
export const render: (component: any, container: Element) => void;
export const Show: BunnixFactory['Show'];
export const ForEach: BunnixFactory['ForEach'];
