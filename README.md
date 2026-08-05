# NemesisChart

Biblioteca de componentes Vue 3 para construção rápida de cards e dashboards com gráficos, construída sobre [Chart.js](https://www.chartjs.org/) — sem dependências de UI externas (todo o CSS necessário já vem no bundle).

Todos os componentes seguem o mesmo padrão: um cartão (`Card*`) que exibe legenda, sublegenda, valor de destaque, descrição e o gráfico correspondente — com suporte a temas claro/escuro, formatação automática de valores e exportação como imagem.

---

## Sumário

- [Instalação](#instalação)
- [Uso rápido](#uso-rápido)
- [Estrutura de dados](#estrutura-de-dados)
- [Componentes](#componentes)
  - [CardLinhas](#cardlinhas)
  - [CardBarra](#cardbarra)
  - [CardPizza](#cardpizza)
  - [CardPolar](#cardpolar)
  - [CardProgresso](#cardprogresso)
  - [CardBase](#cardbase)
  - [ChartBase](#chartbase)
- [Props comuns](#props-comuns)
- [Slots](#slots)
- [Eventos](#eventos)
- [Composables internos](#composables-internos)
- [Playground & Dashboard](#playground--dashboard)

---

## Instalação

```bash
npm install nemesischart chart.js
```

`vue` e `chart.js` são as únicas peer-deps do bundle de lib. A partir da v2.1.0, PrimeVue, PrimeFlex e PrimeIcons **não são mais necessários** — os estilos utilitários usados pelos componentes são embutidos em `nemesischart/style.css` (prefixo `nc-`), mantendo o mesmo visual.

## Uso rápido

### Como plugin

```js
import { createApp } from 'vue'
import NemesisChart from 'nemesischart'
import 'nemesischart/style.css'

import App from './App.vue'

createApp(App)
  .use(NemesisChart)
  .mount('#app')
```

### Importação pontual

```vue
<script setup>
import { CardLinhas } from 'nemesischart'

const data = [
  { rotulo: 'Jan', quantidade: 1200 },
  { rotulo: 'Fev', quantidade: 2800 },
  { rotulo: 'Mar', quantidade: 3200 },
]
</script>

<template>
  <CardLinhas
    legenda="Faturamento"
    sublegenda="2026"
    titulo="R$ 7.2k"
    descricao="acumulado"
    tipoValor="moeda"
    :data="data"
  />
</template>
```

---

## Estrutura de dados

Todos os cards recebem uma prop `data` no formato:

```js
[
  { rotulo: 'Jan', quantidade: 1200 },
  { rotulo: 'Fev', quantidade: 2800 },
]
```

- `rotulo` (string): o nome exibido no eixo / legenda.
- `quantidade` (number): o valor.

Variações específicas por componente:

| Componente | Extras |
|---|---|
| `CardProgresso` | `meta`, `modo`, `valor_referencia`, `cor` por item. Ver seção [CardProgresso](#cardprogresso). |
| `CardLinhas` / `CardBarra` | aceitam `series: [{ nome, data: [...], cor? }]` para múltiplas séries. |

---

## Componentes

### CardLinhas

Gráfico de linhas com gradiente sob a curva.

```vue
<CardLinhas
  legenda="Receita"
  sublegenda="2026"
  titulo="R$ 11M"
  descricao="acumulado no ano"
  tema="light"
  tipoValor="moeda"
  corDetalhes="#3B82F6"
  corDetalhesSecundaria="#8B5CF6"
  :data="dados"
/>
```

Props específicas:

| Prop | Tipo | Padrão | Descrição |
|---|---|---|---|
| `corDetalhes` | String | `#3B82F6` | Cor da linha principal. |
| `corDetalhesSecundaria` | String | — | Segunda cor para gradiente combinado. |
| `series` | Array | — | Várias linhas. |
| `tension` | Number | `0.45` | Curvatura da linha (`0` = segmentos retos, `1` = bem arredondada). Valores fora do intervalo são limitados a 0–1. |
| `direcao` | `top` \| `bottom` \| `left` \| `right` | `top` | Posição do header em relação ao gráfico. |
| `detalheTooltip` | Function | — | `(item, index) => string \| string[]`. Recebe o item original de `data` e retorna texto(s) extra(s) exibidos no tooltip abaixo do valor. |

Exemplo — mostrar a quantidade de pagamentos por mês no tooltip, além do valor:

```vue
<CardLinhas
  legenda="Pagamentos realizados"
  tipoValor="moeda"
  :data="[
    { rotulo: 'Jan', quantidade: 2456173.9, pagamentos: 1353 },
    { rotulo: 'Fev', quantidade: 3889895.3, pagamentos: 1269 },
  ]"
  :detalheTooltip="(item) => `${item.pagamentos} pagamentos`"
/>
```

### CardBarra

Barras verticais ou horizontais, suporta empilhamento e múltiplas séries.

```vue
<CardBarra
  legenda="Vendas"
  titulo="1.160"
  orientacao="vertical"
  :empilhado="false"
  corDetalhes="#10B981"
  :data="dados"
/>
```

Props específicas:

| Prop | Tipo | Padrão |
|---|---|---|
| `orientacao` | `vertical` \| `horizontal` | `vertical` |
| `empilhado` | Boolean | `false` |
| `series` | Array | — |
| `cores` | Array&lt;String&gt; | paleta padrão |
| `mostrarLegendaSeries` | Boolean | `true` |
| `detalheTooltip` | Function | — | `(item, index) => string \| string[]`. Texto(s) extra(s) no tooltip, abaixo dos valores. Recebe o item da 1ª série. |

### CardPizza

Doughnut com tabela lateral opcional.

```vue
<CardPizza
  legenda="Dispositivos"
  titulo="100%"
  tipoValor="percentual"
  cutout="70%"
  :data="dados"
/>
```

Props específicas:

| Prop | Tipo | Padrão |
|---|---|---|
| `corDetalhes` | String | `#3B82F6` (gera a paleta das fatias; itens podem sobrescrever com `cor`) |
| `cutout` | String/Number | `'70%'` |
| `direcao` | `left` \| `right` \| `top` \| `bottom` | `right` |
| `rotuloCategoria` | String | `'Categoria'` |
| `rotuloQuantidade` | String | `'Quantidade'` |
| `mostrarCabecalho` | Boolean | `true` |
| `itensClicaveis` | Boolean | `false` |
| `detalheTooltip` | Function | — &nbsp;`(item, index) => string \| string[]`. Texto(s) extra(s) no tooltip do gráfico, abaixo do valor. |
| `tooltipLinha` | Function | — &nbsp;`(item, index) => string`. Tooltip nativo (`title`) na linha da tabela lateral. Quando omitido, usa `item.descricao`. |

### CardPolar

Polar area com grid configurável.

| Prop | Tipo | Padrão |
|---|---|---|
| `corDetalhes` | String | `#3B82F6` (gera a paleta dos setores; itens podem sobrescrever com `cor`) |
| `mostrarLinhasGrade` | Boolean | `true` |
| `mostrarGrafico` | Boolean | `true` &nbsp;`false` esconde o gráfico e deixa apenas a tabela (título/descrição continuam visíveis). |
| `itensClicaveis` | Boolean | `false` |
| `detalheTooltip` | Function | — &nbsp;`(item, index) => string \| string[]`. Texto(s) extra(s) no tooltip do gráfico, abaixo do valor. |
| `tooltipLinha` | Function | — &nbsp;`(item, index) => string`. Tooltip nativo (`title`) na linha da tabela lateral. Quando omitido, usa `item.descricao`. |

### CardProgresso

Barras de progresso lineares ou circulares. Suporta metas de **crescimento** e de **redução** por item.

```vue
<CardProgresso
  legenda="Metas"
  formato="linear"
  :data="[
    { rotulo: 'Vendas', quantidade: 72, meta: 100 },
    { rotulo: 'Reclamações', quantidade: 320, meta: 100, valor_referencia: 500, modo: 'reducao' },
  ]"
/>
```

#### Estrutura do `data`

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `rotulo` | String | sim | Label exibido. |
| `quantidade` | Number | sim | Valor atual. |
| `meta` | Number | não | Valor alvo. Usa `metaPadrao` se omitido. |
| `modo` | `'crescimento'` \| `'reducao'` | não | Omitir = `'crescimento'`. |
| `valor_referencia` | Number | não (obrigatório em `reducao`) | Ponto de partida para metas de redução (equivale a 0% de progresso). |
| `cor` | String | não | Cor hex da barra, sobrescreve a paleta automática. |

**Modo crescimento** — percentual = `quantidade / meta`. A barra cresce em direção à meta.

**Modo redução** — percentual = `(valor_referencia − quantidade) / (valor_referencia − meta)`. A barra representa o progresso de redução; o fundo da trilha usa `corExcesso`.

#### Props específicas

| Prop | Tipo | Padrão | Descrição |
|---|---|---|---|
| `formato` | `linear` \| `circular` | `linear` | Exibe barras ou gráfico de rosca. |
| `direcao` | `top` \| `bottom` \| `left` \| `right` | `top` | Posição do gráfico circular em relação à lista. |
| `metaPadrao` | Number | `100` | Meta aplicada a itens sem `meta`. |
| `mostrarValor` | Boolean | `true` | Exibe `quantidade / meta`. |
| `mostrarPercentual` | Boolean | `true` | Exibe o percentual de progresso. |
| `alturaBarra` | Number/String | `8` | Altura das barras em px. |
| `raioBarra` | String/Number | `'999px'` | Border-radius das barras. |
| `cutout` | String/Number | `'78%'` | Espessura do anel no modo circular. |
| `corDetalhes` | String | `'#3B82F6'` | Cor do gráfico circular em modo crescimento e base da paleta automática dos itens. |
| `corExcesso` | String | `'#EF4444'` | Cor de alerta usada em itens com modo `reducao`. |

### CardBase

Esqueleto sem gráfico. Útil para criar visualizações customizadas mantendo o visual da biblioteca.

```vue
<CardBase legenda="Custom" titulo="R$ 1k" descricao="exemplo">
  <template #footer>
    <MeuConteudoCustomizado />
  </template>
</CardBase>
```

### ChartBase

Wrapper fino sobre Chart.js.

```vue
<ChartBase
  type="line"
  :data="chartData"
  :options="chartOptions"
  :height="280"
/>
```

---

## Props comuns

Todas as variantes de `Card*` aceitam estas props:

| Prop | Tipo | Padrão | Descrição |
|---|---|---|---|
| `legenda` | String | — | Título superior. |
| `sublegenda` | String | — | Texto auxiliar abaixo da legenda. |
| `titulo` | String | — | Valor de destaque. |
| `descricao` | String | — | Texto complementar do título. |
| `tema` | `light` \| `dark` | `light` | Paleta base. |
| `corFundo` | String | — | Sobrescreve fundo. |
| `corTexto` | String | — | Sobrescreve texto. |
| `corBorda` | String | `#EAE8E8` | Borda externa. |
| `borderRadius` | String/Number | `'1rem'` | Raio da borda. |
| `sombra` | String | box-shadow padrão | Sombra. |
| `tipoValor` | `numero` \| `moeda` \| `percentual` | `'numero'` | Formatação. |
| `locale` | String | `'pt-BR'` | Locale do `Intl`. |
| `moeda` | String | `'BRL'` | Código ISO da moeda. |
| `height` | Number/String | varia | Altura do gráfico. |
| `botaoVisivel` | Boolean | `false` | Mostra botão "Ver mais". |
| `textoBotao` | String | `'Ver mais'` | Texto do botão. |
| `exportar` | Boolean | `false` | Mostra botão de exportação. |
| `nomeArquivoExport` | String | `'card-*.png'` | Nome do PNG. |
| `data` | Array | amostra | Dados. |

## Slots

| Slot | Onde aparece |
|---|---|
| `legenda` | Substitui a `legenda`. |
| `sublegenda` | Substitui a `sublegenda`. |
| `titulo` | Substitui o `titulo`. |
| `descricao` | Substitui a `descricao`. |
| `actions` | Área superior direita do card (substitui o botão padrão). |
| `footer` | Conteúdo extra abaixo do gráfico. |

## Eventos

| Evento | Quando |
|---|---|
| `botaoAcao` | Clique no botão "Ver mais". |
| `exportado` | Após o PNG ser gerado e baixado. |

## Composables internos

Disponíveis para customizar gráficos sob medida:

- `useTema(props)` — calcula `palette` (bg, text, muted, …) e `cardStyle`.
- `useFormatadorValor(props)` — retorna `formatar(valor)` com base em `tipoValor`/`locale`/`moeda`.
- `useTooltipExterno` — utilitários para tooltip HTML customizado (`criarTooltipEl`, `prepararTooltipParent`, `clampHorizontal`, `ttTitulo`, `ttLinhaValor`, `aplicarCaretFlip`, `criarTooltipExternoPadrao`).
- `useLinhasReferencia({ linhasReferencia, horizontal, formatar })` — plugin Chart.js de linhas de referência (metas/limites) com rótulo e tooltip próprios.
- `useExportarImagem` — `exportarElementoComoImagem(el, opções)`, `useExportarCard(props, palette, emit)` e o ícone SVG padrão.
- `propsCartao` / `propsValor` / `propsDirecao` / `propsTabela` — fábricas das definições de props compartilhadas, úteis para criar novos cards seguindo o mesmo contrato.

---

## Playground & Dashboard

Este repositório já vem com um app de demonstração com 3 rotas (vue-router):

| Rota | Conteúdo |
|---|---|
| `/playground` | Exemplos estáticos lado a lado. |
| `/dashboard` | Dashboard interativo: arraste cards pelo cabeçalho, redimensione pelo canto inferior direito e adicione novos cards pela barra lateral. O layout é persistido no `localStorage`. |
| `/docs` | Documentação navegável dentro do próprio app. |

Comandos:

```bash
npm install
npm run dev       # roda o playground em modo dev
npm run build:lib # gera o bundle distribuível em dist/
npm run storybook # abre o Storybook
```

---

## Licença

MIT.
