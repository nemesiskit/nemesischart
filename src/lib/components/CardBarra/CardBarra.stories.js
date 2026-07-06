import { ref } from 'vue'
import CardBarra from './CardBarra.vue'

const ROTULOS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

function gerarDadosAleatorios() {
  return ROTULOS.map((rotulo) => ({ rotulo, quantidade: Math.floor(Math.random() * 5000000) }))
}

// Faturamento mensal (R$) — ano em andamento, total ≈ R$ 11M.
const faturamentoMensal = [
  { rotulo: 'Jan', quantidade: 1186451.5 },
  { rotulo: 'Fev', quantidade: 2810076.48 },
  { rotulo: 'Mar', quantidade: 3247974.14 },
  { rotulo: 'Abr', quantidade: 3565908.98 },
  { rotulo: 'Mai', quantidade: 159800.0 },
  { rotulo: 'Jun', quantidade: 0 },
  { rotulo: 'Jul', quantidade: 0 },
  { rotulo: 'Ago', quantidade: 0 },
  { rotulo: 'Set', quantidade: 0 },
  { rotulo: 'Out', quantidade: 0 },
  { rotulo: 'Nov', quantidade: 0 },
  { rotulo: 'Dez', quantidade: 0 },
]

// Duas séries (online x loja) reaproveitadas em agrupado/empilhado.
const vendasPorCanal = [
  {
    nome: 'Online',
    cor: '#3B82F6',
    dados: [
      { rotulo: 'Jan', quantidade: 120 },
      { rotulo: 'Fev', quantidade: 150 },
      { rotulo: 'Mar', quantidade: 180 },
      { rotulo: 'Abr', quantidade: 200 },
    ],
  },
  {
    nome: 'Loja',
    cor: '#10B981',
    dados: [
      { rotulo: 'Jan', quantidade: 80 },
      { rotulo: 'Fev', quantidade: 90 },
      { rotulo: 'Mar', quantidade: 110 },
      { rotulo: 'Abr', quantidade: 130 },
    ],
  },
]

export default {
  title: 'Cards/CardBarra',
  component: CardBarra,
  tags: ['autodocs'],
  argTypes: {
    tema: { control: { type: 'select' }, options: ['light', 'dark', 'transparent'] },
    direcao: { control: { type: 'inline-radio' }, options: ['top', 'bottom', 'left', 'right'] },
    orientacao: { control: { type: 'inline-radio' }, options: ['vertical', 'horizontal'] },
    empilhado: { control: { type: 'boolean' } },
    tipoValor: { control: { type: 'inline-radio' }, options: ['numero', 'moeda', 'percentual'] },
    corDetalhes: { control: { type: 'color' } },
    corFundo: { control: { type: 'color' } },
    corTexto: { control: { type: 'color' } },
    corBorda: { control: { type: 'color' } },
    borderRadius: { control: { type: 'text' } },
    sombra: { control: { type: 'text' } },
    larguraBarra: { control: { type: 'number', min: 0.1, max: 1, step: 0.05 } },
    raioBarra: { control: { type: 'number', min: 0, max: 24, step: 1 } },
    botaoVisivel: { control: { type: 'boolean' } },
    exportar: { control: { type: 'boolean' } },
    nomeArquivoExport: { control: { type: 'text' } },
    detalheTooltip: {
      control: false,
      description:
        'Função `(item, index) => string | string[]`. Recebe o item original (da 1ª série em `data`/`series`) e o índice, e retorna texto(s) extra(s) exibidos no tooltip abaixo dos valores. Use para um detalhe por categoria (ex.: variação, meta, observação).',
    },
    botaoAcao: { action: 'botaoAcao' },
    exportado: { action: 'exportado' },
  },
  args: {
    legenda: 'Faturamento',
    sublegenda: '2026',
    titulo: 'R$ 11M',
    descricao: 'acumulado no ano',
    tema: 'light',
    corDetalhes: '#3B82F6',
    direcao: 'top',
    tipoValor: 'moeda',
    moeda: 'BRL',
    locale: 'pt-BR',
    botaoVisivel: false,
    textoBotao: 'Ver mais',
    exportar: false,
    nomeArquivoExport: 'card-barra.png',
    corBorda: '#EAE8E8',
    borderRadius: '1rem',
    sombra: '0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.06)',
    larguraBarra: 0.6,
    raioBarra: 6,
    orientacao: 'vertical',
    empilhado: false,
    height: 280,
    data: faturamentoMensal,
  },
}

/**
 * Exemplo canônico (faturamento mensal, moeda). Use os controles (tema,
 * orientação, empilhado, largura/raio da barra, direção, borda, sombra…) para
 * explorar as variações sem precisar de stories dedicadas.
 */
export const Padrao = {}

/** Tema escuro. */
export const Escuro = { args: { tema: 'dark' } }

/** Tema transparente — sem fundo/sombra, para compor dentro de outro container. */
export const Transparente = {
  args: { tema: 'transparent', sombra: 'none', corBorda: 'transparent' },
}

/** `tipoValor="numero"` — contagem por categoria. */
export const Contagem = {
  args: {
    legenda: 'Vendas por canal',
    titulo: '12.450',
    descricao: 'unidades',
    tipoValor: 'numero',
    corDetalhes: '#10B981',
    data: [
      { rotulo: 'Site', quantidade: 4200 },
      { rotulo: 'App', quantidade: 3100 },
      { rotulo: 'Marketplace', quantidade: 2450 },
      { rotulo: 'Loja física', quantidade: 1800 },
      { rotulo: 'Parceiros', quantidade: 900 },
    ],
  },
}

/** `orientacao="horizontal"` — barras deitadas, útil para rótulos longos. */
export const Horizontal = {
  args: {
    orientacao: 'horizontal',
    legenda: 'Vendas por canal',
    titulo: '12.450',
    descricao: 'unidades',
    tipoValor: 'numero',
    data: [
      { rotulo: 'Site', quantidade: 4200 },
      { rotulo: 'App', quantidade: 3100 },
      { rotulo: 'Marketplace', quantidade: 2450 },
      { rotulo: 'Loja física', quantidade: 1800 },
      { rotulo: 'Parceiros', quantidade: 900 },
    ],
  },
}

/** Múltiplas séries lado a lado (prop `series`). */
export const SeriesAgrupadas = {
  name: 'Séries agrupadas',
  args: {
    legenda: 'Vendas por canal',
    sublegenda: 'trimestre',
    titulo: 'Online x Loja',
    descricao: 'comparativo trimestral',
    tipoValor: 'numero',
    series: vendasPorCanal,
  },
}

/** Séries empilhadas (`empilhado`) — composição do total por categoria. */
export const SeriesEmpilhadas = {
  name: 'Séries empilhadas',
  args: {
    legenda: 'Vendas por canal',
    sublegenda: 'trimestre',
    titulo: 'Online + Loja',
    tipoValor: 'numero',
    empilhado: true,
    series: vendasPorCanal,
  },
}

/** Linha de referência simples como meta. */
export const LinhaDeReferencia = {
  name: 'Com linha de referência',
  args: {
    legenda: 'Vendas',
    sublegenda: '2026',
    titulo: null,
    descricao: null,
    tipoValor: 'moeda',
    corDetalhes: '#3B82F6',
    linhasReferencia: { valor: 2500000, rotulo: 'Meta mensal', cor: '#10B981' },
  },
}

/** Múltiplas referências (meta + stretch), com estilos distintos. */
export const MultiplasReferencias = {
  name: 'Múltiplas referências',
  args: {
    legenda: 'Faturamento vs metas',
    sublegenda: '2026',
    titulo: null,
    descricao: null,
    tipoValor: 'moeda',
    linhasReferencia: [
      { valor: 2000000, rotulo: 'Meta', cor: '#10B981', tracejado: [6, 6] },
      { valor: 3500000, rotulo: 'Stretch', cor: '#EF4444', tracejado: [2, 4] },
    ],
  },
}

const faturamentoEndpoint = [
  { rotulo: 'Jan', total_previsto: 14774051.37, total_recebido: 10791652.48, total_em_aberto: 3982398.89 },
  { rotulo: 'Fev', total_previsto: 12790446.8, total_recebido: 7844378.92, total_em_aberto: 4946067.88 },
  { rotulo: 'Mar', total_previsto: 22860108.98, total_recebido: 18413203.84, total_em_aberto: 4446905.14 },
  { rotulo: 'Abr', total_previsto: 8388918.21, total_recebido: 1550230.43, total_em_aberto: 6838687.78 },
  { rotulo: 'Mai', total_previsto: 20257325.12, total_recebido: 17870993, total_em_aberto: 2386332.12 },
  { rotulo: 'Jun', total_previsto: 7878621.99, total_recebido: 0, total_em_aberto: 7878621.99 },
]

/**
 * Campo `previsto` por item — quando presente nos dados, aparece como uma linha
 * "Previsto" no rodapé do tooltip, separada por um divisor tracejado.
 */
export const PrevistoNoTooltip = {
  name: 'Previsto no tooltip',
  args: {
    legenda: 'Faturamento',
    sublegenda: '2026',
    titulo: null,
    descricao: 'recebido x em aberto, com previsto no tooltip',
    tipoValor: 'moeda',
    empilhado: true,
    larguraBarra: 0.6,
    series: [
      {
        nome: 'Recebido',
        cor: '#10B981',
        dados: faturamentoEndpoint.map((r) => ({
          rotulo: r.rotulo,
          quantidade: r.total_recebido,
          previsto: r.total_previsto,
        })),
      },
      {
        nome: 'Em aberto',
        cor: '#F59E0B',
        dados: faturamentoEndpoint.map((r) => ({
          rotulo: r.rotulo,
          quantidade: r.total_em_aberto,
          previsto: r.total_previsto,
        })),
      },
    ],
  },
}

/**
 * `detalheTooltip` acrescenta linha(s) de texto no tooltip, abaixo dos valores
 * (e do "Previsto", quando houver).
 *
 * **Como definir:** passe uma função que recebe o item original (da 1ª série de
 * `data`/`series`) e o índice, e devolve uma string — ou um array de strings
 * para várias linhas. Os campos extras precisam existir em cada item.
 *
 * ```vue
 * <CardBarra
 *   :data="[
 *     { rotulo: 'Jan', quantidade: 1353, variacao: '+8% vs dez' },
 *     { rotulo: 'Fev', quantidade: 1269, variacao: '-6% vs jan' },
 *   ]"
 *   :detalheTooltip="(item) => item.variacao"
 * />
 * ```
 */
export const DetalheTooltip = {
  name: 'Detalhe no tooltip',
  args: {
    legenda: 'Pagamentos realizados',
    sublegenda: '2026',
    titulo: null,
    descricao: 'quantidade por mês, com variação no tooltip',
    tipoValor: 'numero',
    corDetalhes: '#1E40AF',
    data: [
      { rotulo: 'Jan', quantidade: 1353, variacao: '+8% vs dez' },
      { rotulo: 'Fev', quantidade: 1269, variacao: '−6% vs jan' },
      { rotulo: 'Mar', quantidade: 2162, variacao: '+70% vs fev' },
      { rotulo: 'Abr', quantidade: 2401, variacao: '+11% vs mar' },
      { rotulo: 'Mai', quantidade: 3690, variacao: '+54% vs abr' },
      { rotulo: 'Jun', quantidade: 2501, variacao: '−32% vs mai' },
    ],
    detalheTooltip: (item) => item.variacao,
  },
}

/** Interativo — regenera os dados para visualizar a transição das barras. */
export const Interativo = {
  render: (args) => ({
    components: { CardBarra },
    setup() {
      const localData = ref(gerarDadosAleatorios())
      const gerar = () => {
        localData.value = gerarDadosAleatorios()
      }
      return { args, localData, gerar }
    },
    template: `
      <CardBarra v-bind="args" :data="localData">
        <template #actions>
          <button
            @click="gerar"
            style="padding:0.5rem 1.1rem;border-radius:10px;border:1px solid rgba(15,23,42,0.18);background:transparent;cursor:pointer;font-size:0.9rem;font-weight:500;font-family:inherit;"
          >Gerar dados aleatórios</button>
        </template>
      </CardBarra>
    `,
  }),
}
