---
layout: default
title: Example - Todo List
---

# Example - Todo List

This example combines state, refs, `Show`, and keyed list updates.

```javascript
import Swiftx, { Show } from 'swiftx';

const todos = Swiftx.useState([
    { id: 1, title: 'Buy milk', done: false },
    { id: 2, title: 'Write docs', done: true }
]);
const isEmpty = todos.map((list) => list.length === 0);

const inputRef = Swiftx.useRef();

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
    Swiftx('div', { class: 'todo' }, [
        Swiftx('h1', 'Todos'),
        Swiftx('div', [
            Swiftx('input', { ref: inputRef, type: 'text', placeholder: 'New todo' }),
            Swiftx('button', { click: addTodo }, 'Add')
        ]),
        Show(
            isEmpty,
            Swiftx('p', 'Nothing here yet')
        ),
        Swiftx('ul', [
            Swiftx.ForEach(todos, 'id', (todo) =>
                Swiftx('li', [
                    Swiftx('label', [
                        Swiftx('input', {
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

Swiftx.render(
    TodoApp,
    document.getElementById('root')
);
```
