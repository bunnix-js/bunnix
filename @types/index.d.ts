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

export function State<T>(value: T): State<T>;

export function Effect(
    callback: (val?: any) => void | (() => void),
    dependencies?: State<any> | Array<State<any> | any>
): () => void;

export function Compute<T>(
    deps: State<any> | Array<State<any>>,
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

    useState<T>(initialValue: T): State<T>;
    useEffect(
        callback: (val?: any) => void | (() => void),
        dependencies?: State<any> | Array<State<any> | any>
    ): () => void;
    useMemo<T>(deps: State<any> | Array<State<any>>, compute: (...values: any[]) => T): ReadonlyState<T>;
    useRef<T = any>(): { current: T };
    render(component: any, container: Element): void;
    toDOM(element: any, svgContext?: boolean): Node;
    whenReady(callback: () => void): void;
    Show(state: State<boolean> | ReadonlyState<boolean>, content: any): any;
    ForEach<T>(
        items: State<T[]> | ReadonlyState<T[]> | T[],
        options: { key?: keyof T } | keyof T,
        render: (item: T, index: number) => any
    ): any;
    State: typeof State;
    Effect: typeof Effect;
    Compute: typeof Compute;
    Ref: () => { current: any };
    /** Dynamic tag factory (e.g., Bunnix.div(...)) */
    [tag: string]: any;
}

export const Bunnix: BunnixFactory;
export default Bunnix;

export const useState: typeof State;
export const useEffect: typeof Effect;
export const useMemo: typeof Compute;
export const useRef: <T = any>() => { current: T };
export const whenReady: (callback: () => void) => void;
export const render: (component: any, container: Element) => void;
export const toDOM: (element: any, svgContext?: boolean) => Node;
export const Show: BunnixFactory['Show'];
export const ForEach: BunnixFactory['ForEach'];
