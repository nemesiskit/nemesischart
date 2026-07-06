import { ref } from 'vue'
import CardPolar from './CardPolar.vue'

const ROTULOS = ['Vendas', 'Serviços', 'Assinaturas', 'Licenças', 'Suporte', 'Treinamentos', 'Outros']

function gerarDadosAleatorios() {
  return ROTULOS.map((rotulo) => ({ rotulo, quantidade: Math.floor(Math.random() * 5000) + 100 }))
}

const desempenhoPorCategoria = [
  { rotulo: 'Vendas', quantidade: 4200 },
  { rotulo: 'Serviços', quantidade: 3100 },
  { rotulo: 'Assinaturas', quantidade: 2450 },
  { rotulo: 'Licenças', quantidade: 1800 },
  { rotulo: 'Suporte', quantidade: 1250 },
  { rotulo: 'Treinamentos', quantidade: 820 },
  { rotulo: 'Outros', quantidade: 410 },
]

export default {
  title: 'Cards/CardPolar',
  component: CardPolar,
  tags: ['autodocs'],
  argTypes: {
    tema: { control: { type: 'select' }, options: ['light', 'dark', 'transparent'] },
    direcao: { control: { type: 'inline-radio' }, options: ['top', 'bottom', 'left', 'right'] },
    tipoValor: { control: { type: 'inline-radio' }, options: ['numero', 'moeda', 'percentual'] },
    corDetalhes: {
      control: { type: 'color' },
      description: 'Cor base da paleta gerada automaticamente para os setores (itens podem sobrescrever com `cor`).',
    },
    corFundo: { control: { type: 'color' } },
    corTexto: { control: { type: 'color' } },
    corBorda: { control: { type: 'color' } },
    borderRadius: { control: { type: 'text' } },
    sombra: { control: { type: 'text' } },
    botaoVisivel: { control: { type: 'boolean' } },
    mostrarCabecalho: { control: { type: 'boolean' } },
    mostrarLinhasGrade: { control: { type: 'boolean' } },
    exportar: { control: { type: 'boolean' } },
    nomeArquivoExport: { control: { type: 'text' } },
    itensClicaveis: { control: { type: 'boolean' } },
    detalheTooltip: {
      control: false,
      description:
        'Função `(item, index) => string | string[]`. Recebe o item original de `data` e retorna texto(s) extra(s) exibidos no tooltip abaixo do valor. Use para mostrar um detalhe complementar (ex.: participação %, contagem, meta).',
    },
    botaoAcao: { action: 'botaoAcao' },
    exportado: { action: 'exportado' },
    itemClicado: { action: 'itemClicado' },
  },
  args: {
    legenda: 'Desempenho por categoria',
    sublegenda: '2026',
    titulo: null,
    descricao: null,
    tema: 'light',
    direcao: 'right',
    tipoValor: 'numero',
    rotuloCategoria: 'Categoria',
    rotuloQuantidade: 'Quantidade',
    mostrarCabecalho: true,
    mostrarLinhasGrade: true,
    botaoVisivel: false,
    textoBotao: 'Ver mais',
    exportar: false,
    nomeArquivoExport: 'card-polar.png',
    itensClicaveis: false,
    corBorda: '#EAE8E8',
    borderRadius: '1rem',
    sombra: '0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.06)',
    height: 260,
    data: desempenhoPorCategoria,
  },
}

/**
 * Exemplo canônico. Use os controles (tema, direção, grade, cabeçalho, botão,
 * exportar…) para explorar as variações. `direcao` muda o layout: tabela ao lado
 * (`left`/`right`) ou abaixo (`top`/`bottom`).
 */
export const Padrao = {}

/** Tema escuro. */
export const Escuro = { args: { tema: 'dark' } }

/** Tema transparente — sem fundo/sombra, para compor dentro de outro container. */
export const Transparente = {
  args: { tema: 'transparent', sombra: 'none', corBorda: 'transparent' },
}

/** `tipoValor="percentual"` — participação por dispositivo. */
export const Percentual = {
  args: {
    tipoValor: 'percentual',
    data: [
      { rotulo: 'Mobile', quantidade: 55 },
      { rotulo: 'Desktop', quantidade: 35 },
      { rotulo: 'Tablet', quantidade: 10 },
    ],
  },
}

/** Sem as linhas de grade radiais — visual mais limpo. */
export const SemGrade = {
  args: { mostrarLinhasGrade: false },
}

/** Cor por item — cada setor define sua própria `cor`. */
export const CoresPorItem = {
  name: 'Cores por item',
  args: {
    data: [
      { rotulo: 'Concluído', quantidade: 62, cor: '#10B981' },
      { rotulo: 'Em andamento', quantidade: 23, cor: '#F59E0B' },
      { rotulo: 'Atrasado', quantidade: 15, cor: '#EF4444' },
    ],
  },
}

/**
 * `detalheTooltip` acrescenta uma linha extra no tooltip, abaixo do valor.
 *
 * **Como definir:** passe uma função que recebe o item original de `data` (e o
 * índice) e devolve uma string — ou um array de strings para várias linhas.
 * Os campos extras precisam existir em cada item de `data`.
 *
 * ```vue
 * <CardPolar
 *   :data="[
 *     { rotulo: 'Vendas', quantidade: 4200, meta: 5000 },
 *     { rotulo: 'Serviços', quantidade: 3100, meta: 2800 },
 *   ]"
 *   :detalheTooltip="(item) => `Meta: ${item.meta}`"
 * />
 * ```
 */
export const DetalheTooltip = {
  name: 'Detalhe no tooltip',
  args: {
    legenda: 'Desempenho por categoria',
    sublegenda: '2026',
    tipoValor: 'numero',
    data: [
      { rotulo: 'Vendas', quantidade: 4200, meta: 5000 },
      { rotulo: 'Serviços', quantidade: 3100, meta: 2800 },
      { rotulo: 'Assinaturas', quantidade: 2450, meta: 2500 },
      { rotulo: 'Licenças', quantidade: 1800, meta: 1500 },
      { rotulo: 'Suporte', quantidade: 1250, meta: 1400 },
    ],
    detalheTooltip: (item) => `Meta: ${item.meta.toLocaleString('pt-BR')}`,
  },
}

/** Itens clicáveis — emite `itemClicado` ao clicar num setor ou linha da tabela. */
export const ItensClicaveis = {
  args: { itensClicaveis: true },
  render: (args) => ({
    components: { CardPolar },
    setup() {
      const selecionado = ref(null)
      const onItem = (payload) => {
        selecionado.value = payload
      }
      return { args, selecionado, onItem }
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:1rem;">
        <CardPolar v-bind="args" @item-clicado="onItem" />
        <div style="font-family:monospace;font-size:0.85rem;padding:0.75rem 1rem;border:1px dashed rgba(15,23,42,0.2);border-radius:8px;">
          <strong>Último item:</strong>
          {{ selecionado ? selecionado.item.rotulo + ' (' + selecionado.item.quantidade + ')' : '—' }}
        </div>
      </div>
    `,
  }),
}

/** Interativo — regenera os dados para visualizar a transição dos setores. */
export const Interativo = {
  render: (args) => ({
    components: { CardPolar },
    setup() {
      const localData = ref(gerarDadosAleatorios())
      const gerar = () => {
        localData.value = gerarDadosAleatorios()
      }
      return { args, localData, gerar }
    },
    template: `
      <CardPolar v-bind="args" :data="localData">
        <template #actions>
          <button
            @click="gerar"
            style="padding:0.5rem 1.1rem;border-radius:10px;border:1px solid rgba(15,23,42,0.18);background:transparent;cursor:pointer;font-size:0.9rem;font-weight:500;font-family:inherit;"
          >Gerar dados aleatórios</button>
        </template>
      </CardPolar>
    `,
  }),
}
