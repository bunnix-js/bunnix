Plano de benchmark (para quem nunca fez isso)**
1) Defina o objetivo: comparar “tempo de resposta” e “custo de atualizacao” entre frameworks, nao tamanho de bundle.
2) Escolha cenarios simples e repetiveis:
   - Render inicial de 1.000 itens simples.
   - Atualizacao de um unico texto/atributo (micro‑update).
   - Reordenacao de lista com chaves (move 1.000 itens).
   - Form com 100 inputs e validacao reativa.
   - Atualizacoes em alta frequencia (ex.: contador a 60fps por 3s).
3) Defina as metricas:
   - Tempo de render inicial (ms).
   - Tempo de update unico (ms).
   - Tempo de reordenacao (ms).
   - Input latency (ms) e “dropped frames”.
   - Uso de memoria (heap) antes/depois do teste.
4) Crie um harness unico:
   - Mesmo HTML base para todos.
   - Mesmo dataset (itens e entradas iguais).
   - Mesmo loop de testes.
5) Rode em modo de producao:
   - Builds otimizadas para cada framework.
   - Desabilite extensoes e processos extras.
6) Instrumentacao basica:
   - `performance.now()` antes/depois de cada etapa.
   - `performance.mark/measure` para secoes criticas.
7) Repita e descarte ruido:
   - 20–50 execucoes por cenario.
   - Descarte 2–3 warmups iniciais.
   - Reporte media + p95.
8) Controle de ambiente:
   - Mesmo browser e mesma maquina.
   - Sem outros apps consumindo CPU.
9) Reporte:
   - Tabela por cenario (tempo medio, p95).
   - Observacoes sobre fluidez (input lag, frames).
10) Valide comportamento:
   - Garanta que o resultado visual e o mesmo em todos.
   - Nao otimize um framework de forma unica.
