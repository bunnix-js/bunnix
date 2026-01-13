---
layout: default
title: Example - Todo List
---

# Example - Todo List

This example combines state, refs, `Show`, and keyed list updates.

```javascript
import Bunnix, { Show } from '@bunnix/core';

const todos = Bunnix.useState([
    { id: 1, title: 'Buy milk', done: false },
    { id: 2, title: 'Write docs', done: true }
]);
const isEmpty = todos.map((list) => list.length === 0);

const inputRef = Bunnix.useRef();

const addTodo = () => {
    const value = inputRef.current.value.trim();
    if (!value) return;
    const next = [...todos.get(), { id: Date.now(), title: value, done: false }];
    todos.set(next);
    inputRef.current.value = '';
    inputRef.current.focus();
};

const toggleTodo = (id) => {
    const next = todos.get().map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
    );
    todos.set(next);
};

const TodoApp = () => (
    Bunnix('div', { class: 'todo' }, [
        Bunnix('h1', 'Todos'),
        Bunnix('div', [
            Bunnix('input', { ref: inputRef, type: 'text', placeholder: 'New todo' }),
            Bunnix('button', { click: addTodo }, 'Add')
        ]),
        Show(
            isEmpty,
            Bunnix('p', 'Nothing here yet')
        ),
        Bunnix('ul', [
            Bunnix.ForEach(todos, 'id', (todo) =>
                Bunnix('li', [
                    Bunnix('label', [
                        Bunnix('input', {
                            type: 'checkbox',
                            checked: todo.done,
                            click: () => toggleTodo(todo.id)
                        }),
                        todo.title
                    ])
                ])
            )
        ])
    ])
);

Bunnix.render(
    TodoApp,
    document.getElementById('root')
);
```
