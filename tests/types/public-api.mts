import Bunnix, { useState, useEffect, useMemo, Compute, useRef } from '@bunnix/core';
import type { State } from '@bunnix/core';
// @ts-expect-error Effect is available through Bunnix, not a named export.
import { Effect } from '@bunnix/core';

const state: State<number> = useState(1);
// @ts-expect-error State is a type, not a named runtime constructor.
State(1);
const aliasState: State<number> = Bunnix.State(1);
const stop: () => void = Bunnix.Effect(() => {}, [aliasState]);
const data = ['Ada'];
const memo = useMemo([state, data, 'prefix', 2, null], (n, names) => String(n) + names.join());
const result: string = memo.get();
const computed: number = Compute([memo, 2], () => 2).get();
const namespaceMemo: string = Bunnix.useMemo([memo, data], () => 'ok').get();
Bunnix.Compute(memo, () => true);
// @ts-expect-error Computed state is readonly.
memo.set('value');

const empty = useRef();
const initialNull: null = empty.get();
const explicitUndefined: null = useRef(undefined).get();
const ref = useRef<HTMLInputElement>();
const node: HTMLInputElement | null = ref.current;
// @ts-expect-error An uninitialized ref may be null.
const mounted: HTMLInputElement = ref.get();
const unsubscribe: () => void = ref.subscribe(value => value?.focus());
const initial: string = useRef('hello').get();
const namespaceInitial: number = Bunnix.useRef(1).get();
const aliasInitial: boolean = Bunnix.Ref(true).get();
useEffect(() => {}, [ref, memo]);
useMemo(ref, () => ref.get());
ref.current = document.createElement('input');
// @ts-expect-error Refs have no public setter.
ref.set(null);
// @ts-expect-error Refs do not implement map.
ref.map(value => value);
