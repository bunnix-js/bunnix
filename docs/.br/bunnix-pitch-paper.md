---
layout: default
title: Bunnix Pitch Paper
---

# **Bunnix: Engenharia de Interfaces Web de Alta Performance via Reatividade Atômica**

Já reparou como o desenvolvimento frontend atingiu um patamar de complexidade onde se gasta mais tempo com abstração, ajustes de performance e manutenção de código do que com ganho real de produtividade? O **Bunnix** nasce como uma alternativa pragmática para quem quer algo tão declarativo quanto o React, mas com menos fricção: menos dependências, manutenção mais simples e responsividade previsível mesmo quando a complexidade dos componentes cresce. A proposta é tratar o framework como um facilitador do navegador, não como uma camada isolada de execução, priorizando eficiência de runtime, segurança soberana e transparência técnica.

**Baseado em:** 14 de janeiro de 2026.

## **1\. Introdução**

No cenário atual, performance deixou de ser só um desejo técnico e virou métrica de produto. E, com os incidentes recentes de segurança no ecossistema frontend, ficou claro que depender de árvores gigantes de dependências também tem um custo real. Aplicações que consomem menos memória, têm menos dependências em tempo de execução e respondem instantaneamente retêm mais usuários e reduzem custos operacionais. Para líderes técnicos, o **Bunnix** representa uma resposta direta ao "bloat" das ferramentas modernas, entregando uma fundação sólida que não depende de árvores de dependências gigantescas nem de algoritmos de reconciliação pesados. É um case pessoal que se transformou em uma oportunidade para projetos que demandam mais longevidade, melhor manutenção e agilidade máxima sob qualquer condição de hardware do usuário.

## **2\. Arquitetura Técnica: Reatividade Direta**

O Bunnix adota uma abordagem direta que questiona os dogmas estabelecidos pelos frameworks da última década. Ao invés de lutar contra o DOM, o Bunnix se integra a ele de forma cirúrgica.

### **2.1 Menos Virtual DOM**

Diferente do padrão de mercado que mantém uma representação virtual persistente em memória, o Bunnix utiliza o VDOM apenas como um esquema de montagem inicial. Após a criação dos elementos reais, essa árvore virtual é descartada, liberando recursos preciosos do sistema.

### **2.2 Performance Direta (Menos Overhead)**

Ao eliminar o "diffing algorithm" constante, o tempo entre a alteração de um dado e a atualização visual é reduzido à menor unidade possível. A atualização é atômica e direta no nó do DOM afetado.

### **2.3 Menos Re-render**

Em arquiteturas tradicionais, a mudança de um estado pode causar o "tremor" de toda uma árvore de componentes. No Bunnix, os componentes são funções de execução única. O que reage são os vínculos (bindings) entre os átomos de estado e os elementos, eliminando o processamento redundante.

### **2.4 Fim dos Synthetic Props**

O Bunnix elimina a camada de tradução de propriedades. Ao utilizar atributos e eventos nativos do HTML5, o framework remove o overhead de "Synthetic Events" e garante compatibilidade imediata com qualquer nova API do navegador (como popover ou inert) sem necessidade de atualizações no core.

## **3\. Vamos ao Código**

A flexibilidade do Bunnix permite que a equipe escolha como quer se expressar, mantendo sempre a mesma performance de baixo nível.

### **3.1 Sintaxe Padrão (Core Factory)**

A fundação do framework utiliza uma Core Factory simples, que não exige qualquer ferramenta de build para funcionar.

```js
import Bunnix, { useState } from '@bunnix/core';

const Header = () => {
    const title = useState('Bunnix Core');
    return Bunnix('header', { class: 'main-header' }, [
        Bunnix('h1', title)
    ]);
};
```

### **3.2 Tag DSL: Menos Código e Mais Compatível**

A Tag DSL oferece uma escrita declarativa extremamente limpa, aproximando a leitura da interface a linguagens modernas como Swift (SwiftUI) ou Kotlin (Jetpack Compose). Ela coexiste perfeitamente com código legado sem necessidade de overhead de transpiladores.

```js
const { div, h1, button } = Bunnix;

const Card = () => (
    div({ class: 'card' }, [
        h1('Arquitetura Declarativa'),
        button({ click: () => alert('Ação Direta!') }, 'Interagir')
    ])
);
```

### **3.3 JSX: Por que não?**

Para equipes que preferem a familiaridade do XML, o Bunnix suporta JSX como fábrica de renderização. Requer apenas uma configuração mínima no seu transpilador (Babel, SWC ou Vite), definindo a jsxFactory para Bunnix.

```js
import Bunnix, { useState } from '@bunnix/core';

const Counter = () => {
    const count = useState(0);

    return (
        <div class="counter-panel">
            <h1>JSX com Bunnix</h1>
            <p>Contagem: {count}</p>
            <button click={() => count.set(count.get() + 1)}>Incrementar</button>
        </div>
    );
};
```

## **4\. Os Pilares**

* **4.1 Estados e Átomos:** O estado é um objeto vivo (Atom). Pode ser aninhado, permitindo que sub-propriedades sejam reativas de forma independente.  
* **4.2 Side Effects e Computação Otimizada:** useEffect e useMemo reagem apenas à mutação real do átomo, mantendo o fluxo previsível.  
* **4.3 Referências e DOM-Ready:** O useRef é uma ponte reativa. O mecanismo whenReady garante que a lógica só execute quando o nó estiver estabilizado na hierarquia.  
* **4.4 Diretivas:** Show e ForEach são orquestradores estruturais que decidem, em nível de DOM Real, como anexar ou mover elementos.  
* **4.5 Renderização sem Diffing:** O método Bunnix.render e o utilitário Bunnix.toDOM transformam a intenção reativa em presença física no navegador sem conflitos com manipulações externas de DOM.

## **5\. Integração**

A força do Bunnix reside na união desses pilares: átomos aninhados dentro de um ForEach observados por um useEffect que dispara atualizações em referências do useRef.

### **5.1 Exemplo de Integração Complexa**

Injeção de componentes reais via `Bunnix.toDOM` em logs de auditoria e uso de **Reactive CSS Props**.

```js
import Bunnix, { useState, useEffect, useRef, ForEach } from '@bunnix/core';
const { div, input, button, ul, li, span, b } = Bunnix;

// Componente de Log Atômico  
const LogEntry = ({ userId, userName, active }) => (
    div({ class: 'log-item' }, [
        span({ style: 'color: #888; font-size: 0.8em;' }, `[${new Date().toLocaleTimeString()}] `),
        b(`ID:${userId} `),
        span(`${userName} está `),
        span({
            style: {
                color: active ? 'green' : 'red',
                fontWeight: 'bold'
            }
        }, active ? 'ONLINE' : 'OFFLINE')
    ])
);

const UserManager = () => {
    const users = useState([
        { id: 1, name: useState('Admin'), active: useState(true) }
    ]);
    const logRef = useRef();

    useEffect(() => {
        let activeSubscriptions = [];

        const syncLogs = () => {
            activeSubscriptions.forEach((unsub) => unsub());
            activeSubscriptions = users.get().map((user) =>
                user.active.subscribe((v) => {
                    const entry = Bunnix.toDOM(LogEntry({
                        userId: user.id,
                        userName: user.name.get(),
                        active: v
                    }));
                    logRef.current?.appendChild(entry);
                    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
                })
            );
        };

        const unsubList = users.subscribe(syncLogs);
        syncLogs();

        return () => {
            unsubList();
            activeSubscriptions.forEach((u) => u());
        };
    }, []);

    return div({ class: 'manager-panel' }, [
        div({ ref: logRef, class: 'audit-log', style: 'height: 120px; overflow-y: auto;' }),
        ul([
            ForEach(users, 'id', (user) =>
                li({
                    style: { opacity: user.active.map((v) => (v ? 1 : 0.5)) }
                }, [
                    input({ value: user.name, input: (e) => user.name.set(e.target.value) }),
                    button({ click: () => user.active.set(!user.active.get()) },
                        user.active.map((v) => (v ? 'Desativar' : 'Ativar'))
                    )
                ])
            )
        ])
    ]);
};
```

## **6\. Casos de Uso**

O Bunnix brilha em cenários onde a eficiência bruta é obrigatória:

* **Dashboards de Alta Frequência:** Visualizações de dados em tempo real sem degradar a interface.  
* **Aplicativos Mobile e PWAs:** Fluidez próxima à nativa com consumo mínimo de RAM em WebViews.  
* **Arquiteturas IoT e Sistemas Embarcados:** Interfaces de controle em hardware com processamento restrito.  
* **Soluções Web Leves:** Micro-frontends que buscam máxima performance com payload reduzido.

## **7\. Desenvolvedores React: Sintam-se em Casa**

### **7.1 useState**

* **Bunnix:** Retorna um átomo que aceita map e subscrições diretas via .subscribe.

```js
const count = useState(0);
count.subscribe((v) => console.log('Mudou para:', v));
count.set(count.get() + 1);
```

### **7.2 useEffect**

* **Bunnix:** Híbrido. Aceita observação de átomo único com valor "desenvelopado" ou array de dependências.

```js
// Modo unwrapped (apenas um state)
useEffect((val) => { console.log(val); }, count);
// Modo array (estilo React)
useEffect(() => { console.log(count.get()); }, [count]);
```

### **7.3 useMemo**

* **Bunnix:** É um estado derivado vivo (um novo átomo vinculado).

```js
const double = useMemo([count], (c) => c * 2);
```

### **7.4 useRef**

* **Bunnix:** Retorna um objeto estável `{ current }` para acesso imperativo.

```js
const inputRef = useRef();
```

## **8\. Manutenibilidade**

Com **zero dependências de runtime**, o Bunnix isola o projeto de vulnerabilidades de terceiros. O código é compacto, auditável e depende apenas de APIs web padrões, garantindo estabilidade por décadas.

## **9\. Tabela Comparativa**

| Recurso | React | SolidJS | Vue | Bunnix |
| :---- | :---- | :---- | :---- | :---- |
| **Arquitetura** | VDOM Persistente | Signals/Compilação | Proxy/VDOM | **Atomic Binding / VDOM Efêmero** |
| **Atualização** | Component-level | Fine-grained | Component-level | **Atomic-level** |
| **Dependências** | Alta | Baixa | Média | **Zero (runtime)** |
| **Memória** | Alto | Baixo | Médio | **Mínimo** |
| **Atributos** | Synthetic | Nativos | Diretivas | **Nativos (Transcrição)** |

## **10\. Estado Atual**

O Bunnix atualmente está disponível para utilização direta como um pacote do `npmjs` e encontra-se na versão Prévia de Candidato a Release, `v0.9.0`, estável, testada e tecnicamente documentada para utilização nos projetos web indicados, com previsão de release no primeiro trimestre de 2026.

```bash
npm install @bunnix/core
```

**E tem mais**: neste momento o Bunnix está tornando viável a visão completa de uma suite modular para aplicações web, também disponibilizando pacotes complementares à maioria das necessidades dos projetos:

| Pacote | Proposta | Status | Previsao | Repositorio |
| --- | --- | --- | --- | --- |
| **Bunnix Router** (`@bunnix/router`) | Framework descentralizado e atento ao contexto para rotas usando Bunnix. | Previa de Candidato a Release `v0.9.0` | 1o trimestre de 2026 | [bunnix-router](https://github.com/bunnix-js/bunnix-router) |
| **Bunnix Redux** (`@bunnix/redux`) | Framework para gerenciamento de estado global usando Bunnix. | Desenvolvimento interno | 1o trimestre de 2026 | [bunnix-redux](https://github.com/bunnix-js/bunnix-redux) |
| **Bunnix Optimistics** (`@bunnix/optimistics`) | Framework para controle de estados otimizados de componentes enquanto carregam dados externos, usando Bunnix. | Desenvolvimento interno | 1o trimestre de 2026 | [bunnix-optmistics](https://github.com/bunnix-js/bunnix-optmistics) |

## **11\. Conclusão**

O Bunnix devolve o controle ao desenvolvedor e a performance ao usuário final. É a tecnologia ideal para quem busca eficiência bruta, segurança e uma base técnica inabalável.  
**Explore o código e contribua:** https://github.com/bunnix-js/bunnix
