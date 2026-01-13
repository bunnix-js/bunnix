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

import type BunnixRouter from '../bunnix-router/index';

export interface BunnixFactory {
    (tag: any, propsOrChildren?: any, ...children: any[]): VNode;

    useState<T>(initialValue: T): State<T>;
    useEffect(callback: (val?: any) => void | (() => void), dependencies?: any[]): void;
    useMemo<T>(deps: State<any> | Array<State<any>>, compute: (...values: any[]) => T): ReadonlyState<T>;
    useRef<T = any>(): { current: T };
    render(component: any, container: HTMLElement | null): void;
    whenReady(callback: () => void): void;
    Show(state: State<boolean>, content: any): any;
    ForEach<T>(
        items: State<T[]> | T[],
        options: { key?: keyof T } | keyof T,
        render: (item: T, index: number) => any
    ): any;
    State: typeof State;
    Effect: typeof Effect;
    Compute: typeof Compute;
    Ref: () => { current: any };
    Router: typeof BunnixRouter;
    /** Dynamic tag factory (e.g., Bunnix.div(...)) */
    [tag: string]: any;
}

declare const Bunnix: BunnixFactory;
export default Bunnix;
