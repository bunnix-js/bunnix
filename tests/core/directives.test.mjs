import assert from 'node:assert/strict';
import { test } from 'node:test';
import Bunnix, { ForEach, Show, useEffect, useMemo, useState } from '../../index.mjs';

test('Show toggles content based on state', () => {
    const visible = useState(true);
    const container = document.createElement('div');

    const fragment = Show(visible, Bunnix('span', {}, 'On'));
    container.appendChild(fragment);
    assert.equal(container.textContent, 'On');

    visible.set(false);
    assert.equal(container.textContent, '');

    visible.set(true);
    assert.equal(container.textContent, 'On');
});

test('ForEach updates only the changed keyed item', async () => {
    const items = useState([
        { id: 1, label: 'A' },
        { id: 2, label: 'B' }
    ]);

    const container = document.createElement('div');
    const list = Bunnix('ul', {}, ForEach(items, 'id', (item) => (
        Bunnix('li', {}, item.label)
    )));

    Bunnix.render(list, container);
    await new Promise((resolve) => queueMicrotask(resolve));

    const firstRenderNodes = Array.from(container.querySelectorAll('li'));
    const firstNode = firstRenderNodes[0];
    const secondNode = firstRenderNodes[1];

    items.set([
        items.get()[0],
        { id: 2, label: 'B2' }
    ]);
    await new Promise((resolve) => queueMicrotask(resolve));

    const secondRenderNodes = Array.from(container.querySelectorAll('li'));
    assert.equal(secondRenderNodes.length, 2);
    assert.equal(secondRenderNodes[0], firstNode);
    assert.notEqual(secondRenderNodes[1], secondNode);
    assert.equal(secondRenderNodes[1].textContent, 'B2');
});

test('form submit enables only when all ForEach inputs are filled', async () => {
    const users = useState([
        { id: 1, name: '' },
        { id: 2, name: '' }
    ]);
    const isDisabled = useState(true);

    useEffect(() => {
        const allFilled = users.get().every((user) => user.name.trim().length > 0);
        isDisabled.set(!allFilled);
    }, [users]);

    const Form = () => (
        Bunnix('form', {}, [
            Bunnix('div', {}, [
                ForEach(users, 'id', (user, index) => (
                    Bunnix('input', {
                        type: 'text',
                        value: user.name,
                        change: (event) => {
                            const next = users.get().map((item, i) => (
                                i === index ? { ...item, name: event.target.value } : item
                            ));
                            users.set(next);
                        }
                    })
                ))
            ]),
            Bunnix('button', { type: 'submit', disabled: isDisabled }, 'Submit')
        ])
    );

    const container = document.createElement('div');
    Bunnix.render(Form, container);
    await new Promise((resolve) => queueMicrotask(resolve));

    let button = container.querySelector('button');
    assert.ok(button);
    assert.equal(button.disabled, true);

    let inputs = Array.from(container.querySelectorAll('input'));
    assert.equal(inputs.length, 2);

    inputs[0].value = 'Ada';
    inputs[0].dispatchEvent(new window.Event('change', { bubbles: true }));

    button = container.querySelector('button');
    assert.equal(button.disabled, true);

    inputs = Array.from(container.querySelectorAll('input'));
    inputs[1].value = 'Bob';
    inputs[1].dispatchEvent(new window.Event('change', { bubbles: true }));

    button = container.querySelector('button');
    assert.equal(button.disabled, false);

    inputs = Array.from(container.querySelectorAll('input'));
    inputs[0].value = '';
    inputs[0].dispatchEvent(new window.Event('change', { bubbles: true }));

    button = container.querySelector('button');
    assert.equal(button.disabled, true);
});

test('foreach delete buttons enable based on list size and entry value', async () => {
    const users = useState([
        { id: 1, name: '' },
        { id: 2, name: '' }
    ]);

    const Form = () => (
        Bunnix('form', {}, [
            Bunnix('div', {}, [
                ForEach(users, 'id', (user, index) => {
                    const deleteDisabled = user.name.trim().length === 0 || users.get().length <= 1;
                    return Bunnix('div', { class: 'row' }, [
                        Bunnix('input', {
                            type: 'text',
                            value: user.name,
                            change: (event) => {
                                const next = users.get().map((item, i) => (
                                    i === index ? { ...item, name: event.target.value } : item
                                ));
                                users.set(next);
                            }
                        }),
                        Bunnix('button', {
                            type: 'button',
                            disabled: deleteDisabled,
                            click: () => {
                                const next = users.get()
                                    .filter((_, i) => i !== index)
                                    .map((item) => ({ ...item }));
                                users.set(next);
                            }
                        }, 'Delete')
                    ]);
                })
            ])
        ])
    );

    const container = document.createElement('div');
    Bunnix.render(Form, container);
    await new Promise((resolve) => queueMicrotask(resolve));

    let inputs = Array.from(container.querySelectorAll('input'));
    let buttons = Array.from(container.querySelectorAll('button'));
    assert.equal(inputs.length, 2);
    assert.equal(buttons.length, 2);
    assert.equal(buttons[0].disabled, true);
    assert.equal(buttons[1].disabled, true);

    inputs[0].value = 'Ada';
    inputs[0].dispatchEvent(new window.Event('change', { bubbles: true }));

    buttons = Array.from(container.querySelectorAll('button'));
    assert.equal(buttons[0].disabled, false);
    assert.equal(buttons[1].disabled, true);

    inputs = Array.from(container.querySelectorAll('input'));
    inputs[1].value = 'Bob';
    inputs[1].dispatchEvent(new window.Event('change', { bubbles: true }));

    buttons = Array.from(container.querySelectorAll('button'));
    assert.equal(buttons[0].disabled, false);
    assert.equal(buttons[1].disabled, false);

    buttons[0].dispatchEvent(new window.MouseEvent('click', { bubbles: true }));

    inputs = Array.from(container.querySelectorAll('input'));
    buttons = Array.from(container.querySelectorAll('button'));
    assert.equal(inputs.length, 1);
    assert.equal(buttons.length, 1);
    assert.equal(buttons[0].disabled, true);
});

test('ForEach renders initial values from useMemo-derived lists', async () => {
    const accounts = useState([
        { id: 1, name: 'Main', createdAt: '2024-01-01' },
        { id: 2, name: 'Ops', createdAt: '2024-01-02' }
    ]);
    const participants = useState([
        { id: 1, accountId: 1, name: 'Ada' },
        { id: 2, accountId: 2, name: 'Bob' },
        { id: 3, accountId: 1, name: 'Cara' }
    ]);

    const accountsWithParticipants = useMemo([accounts, participants], (acc, ptt) => (
        acc.map((a) => ({
            id: a.id,
            name: a.name,
            createdAt: a.createdAt,
            participants: ptt
                .filter((p) => p.accountId === a.id)
                .map((p) => p.name)
                .join(', ')
        }))
    ));

    const Table = () => (
        Bunnix('table', {}, [
            Bunnix('tbody', {}, [
                ForEach(accountsWithParticipants, 'id', (account) => (
                    Bunnix('tr', { id: `account-${account.id}` }, [
                        Bunnix('td', {}, account.name),
                        Bunnix('td', {}, account.participants)
                    ])
                ))
            ])
        ])
    );

    const container = document.createElement('div');
    Bunnix.render(Table, container);
    await new Promise((resolve) => queueMicrotask(resolve));

    const firstRow = container.querySelector('#account-1');
    const secondRow = container.querySelector('#account-2');

    assert.equal(firstRow?.textContent, 'MainAda, Cara');
    assert.equal(secondRow?.textContent, 'OpsBob');
});

test('ForEach renders when state updates before mount', async () => {
    const items = useState([]);

    const App = () => {
        useEffect(() => {
            queueMicrotask(() => {
                items.set([{ id: 1, label: 'A' }]);
            });
        }, []);

        return Bunnix('ul', {}, ForEach(items, 'id', (item) => (
            Bunnix('li', {}, item.label)
        )));
    };

    const container = document.createElement('div');
    Bunnix.render(App, container);
    await new Promise((resolve) => queueMicrotask(resolve));

    const nodes = container.querySelectorAll('li');
    assert.equal(nodes.length, 1);
    assert.equal(nodes[0].textContent, 'A');
});

test('ForEach handles array recreation with a deleted keyed item', async () => {
    const items = useState([
        { id: 1, label: 'A' },
        { id: 2, label: 'B' },
        { id: 3, label: 'C' }
    ]);

    const subItems = useState([
      { parentId: 1, label: "A.1"},
      { parentId: 2, label: "B.1" },
      { parentId: 2, label: "B.2" },
      { parentId: 3, label: "C.1"}
    ]);

    const List = () => (
        Bunnix('ul', {}, ForEach(items, 'id', (item) => (
          Bunnix('li', { id: `item-${item.id}` }, (
            Bunnix('div', [
              `${item.label} `,
              Bunnix('div', subItems.map((list) =>
                  list
                    .filter((s) => s.parentId === item.id)
                    .map((s) => s.label)
                    .join(', ')
                ))
            ])))
        )))
    );

    const container = document.createElement('div');
    Bunnix.render(List, container);
    await new Promise((resolve) => queueMicrotask(resolve));

    const lis = Array.from(container.querySelectorAll('li'));
    assert.equal(lis.length, 3);
    assert.equal(container.querySelector('#item-2')?.textContent, 'B B.1, B.2');

    items.set(items.get().filter((item) => item.id !== 2));
    await new Promise((resolve) => queueMicrotask(resolve));

    const nodes = Array.from(container.querySelectorAll('li'));
    assert.equal(nodes.length, 2);
    assert.equal(container.querySelector('#item-1')?.textContent, 'A A.1');
    assert.equal(container.querySelector('#item-3')?.textContent, 'C C.1');
    assert.equal(container.querySelector('#item-2'), null);
});

test('ForEach renders useMemo results from mapped root state', async () => {
    const root = useState({ accounts: [], participants: [] });
    const accounts = root.map((state) => state.accounts);
    const participants = root.map((state) => state.participants);

    const accountsWithParticipants = useMemo([accounts, participants], (acc, ptt) => (
        acc.map((a) => ({
            id: a.id,
            name: a.name,
            participants: ptt
                .filter((p) => p.accountId === a.id)
                .map((p) => p.name)
                .join(', ')
        }))
    ));

    const List = () => (
        Bunnix('ul', {}, ForEach(accountsWithParticipants, 'id', (account) => (
            Bunnix('li', { id: `account-${account.id}` }, [
                account.name,
                ' ',
                account.participants
            ])
        )))
    );

    const container = document.createElement('div');
    Bunnix.render(List, container);
    await new Promise((resolve) => queueMicrotask(resolve));

    root.set({
        accounts: [
            { id: 1, name: 'Main' },
            { id: 2, name: 'Ops' }
        ],
        participants: [
            { accountId: 1, name: 'Ada' },
            { accountId: 2, name: 'Bob' },
            { accountId: 1, name: 'Cara' }
        ]
    });
    await new Promise((resolve) => queueMicrotask(resolve));

    const first = container.querySelector('#account-1');
    const second = container.querySelector('#account-2');
    assert.equal(first?.textContent, 'Main Ada, Cara');
    assert.equal(second?.textContent, 'Ops Bob');
});
