import { ref } from 'vue'
import CardPizza from './CardPizza.vue'

const ROTULOS = ['Vendas', 'Serviços', 'Assinaturas', 'Licenças', 'Suporte', 'Treinamentos', 'Outros']

function gerarDadosAleatorios() {
  return ROTULOS.map((rotulo) => ({ rotulo, quantidade: Math.floor(Math.random() * 5000) + 100 }))
}

// Receita por categoria — total = 14.030.
const receitaPorCategoria = [
  { rotulo: 'Vendas', quantidade: 4200 },
  { rotulo: 'Serviços', quantidade: 3100 },
  { rotulo: 'Assinaturas', quantidade: 2450 },
  { rotulo: 'Licenças', quantidade: 1800 },
  { rotulo: 'Suporte', quantidade: 1250 },
  { rotulo: 'Treinamentos', quantidade: 820 },
  { rotulo: 'Outros', quantidade: 410 },
]

export default {
  title: 'Cards/CardPizza',
  component: CardPizza,
  tags: ['autodocs'],
  argTypes: {
    tema: { control: { type: 'select' }, options: ['light', 'dark', 'transparent'] },
    direcao: { control: { type: 'inline-radio' }, options: ['top', 'bottom', 'left', 'right'] },
    tipoValor: { control: { type: 'inline-radio' }, options: ['numero', 'moeda', 'percentual'] },
    corDetalhes: {
      control: { type: 'color' },
      description: 'Cor base da paleta gerada automaticamente para as fatias (itens podem sobrescrever com `cor`).',
    },
    corFundo: { control: { type: 'color' } },
    corTexto: { control: { type: 'color' } },
    corBorda: { control: { type: 'color' } },
    borderRadius: { control: { type: 'text' } },
    sombra: { control: { type: 'text' } },
    cutout: { control: { type: 'text' } },
    botaoVisivel: { control: { type: 'boolean' } },
    mostrarCabecalho: { control: { type: 'boolean' } },
    exportar: { control: { type: 'boolean' } },
    nomeArquivoExport: { control: { type: 'text' } },
    itensClicaveis: { control: { type: 'boolean' } },
    detalheTooltip: {
      control: false,
      description:
        'Função `(item, index) => string | string[]`. Recebe o item original de `data` e retorna texto(s) extra(s) exibidos no tooltip abaixo do valor. Use para mostrar um detalhe complementar (ex.: participação %, contagem, meta).',
    },
    tooltipLinha: {
      control: false,
      description:
        'Função `(item, index) => string`. Tooltip nativo (atributo `title`) exibido ao passar o mouse sobre a linha da tabela lateral. Quando omitido, usa `item.descricao`.',
    },
    botaoAcao: { action: 'botaoAcao' },
    exportado: { action: 'exportado' },
    itemClicado: { action: 'itemClicado' },
  },
  args: {
    legenda: 'Receita por categoria',
    sublegenda: '2026',
    titulo: '14.030',
    descricao: 'total',
    tema: 'light',
    direcao: 'right',
    tipoValor: 'numero',
    rotuloCategoria: 'Categoria',
    rotuloQuantidade: 'Quantidade',
    mostrarCabecalho: true,
    botaoVisivel: false,
    textoBotao: 'Ver mais',
    exportar: false,
    nomeArquivoExport: 'card-pizza.png',
    itensClicaveis: false,
    corBorda: '#EAE8E8',
    borderRadius: '1rem',
    sombra: '0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.06)',
    cutout: '70%',
    height: 260,
    data: receitaPorCategoria,
  },
}

/**
 * Exemplo canônico. Use os controles (tema, direção, cutout, cabeçalho, botão,
 * exportar…) para explorar as variações sem precisar de stories dedicadas.
 * `direcao` muda o layout: tabela ao lado (`left`/`right`) ou abaixo (`top`/`bottom`).
 */
export const Padrao = {}

/** Tema escuro. */
export const Escuro = { args: { tema: 'dark' } }

/** Tema transparente — sem fundo/sombra, para compor dentro de outro container. */
export const Transparente = {
  args: { tema: 'transparent', sombra: 'none', corBorda: 'transparent' },
}

/** `tipoValor="moeda"` — distribuição de receita formatada como moeda. */
export const Moeda = {
  args: {
    tipoValor: 'moeda',
    titulo: 'R$ 35k',
    descricao: 'receita total',
    data: [
      { rotulo: 'Vendas', quantidade: 12400 },
      { rotulo: 'Serviços', quantidade: 8900 },
      { rotulo: 'Assinaturas', quantidade: 6300 },
      { rotulo: 'Outros', quantidade: 7400 },
    ],
  },
}

/** `tipoValor="percentual"` — participação por dispositivo. */
export const Percentual = {
  args: {
    tipoValor: 'percentual',
    titulo: '100%',
    descricao: 'distribuição',
    data: [
      { rotulo: 'Mobile', quantidade: 55 },
      { rotulo: 'Desktop', quantidade: 35 },
      { rotulo: 'Tablet', quantidade: 10 },
    ],
  },
}

/** Cor por item — cada fatia define sua própria `cor`, ignorando a paleta automática. */
export const CoresPorItem = {
  name: 'Cores por item',
  args: {
    titulo: '100',
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
 * Os campos extras que você quiser exibir devem existir em cada item de `data`.
 *
 * ```vue
 * <CardPizza
 *   :data="[
 *     { rotulo: 'Vendas', quantidade: 4200, participacao: '34%' },
 *     { rotulo: 'Serviços', quantidade: 3100, participacao: '25%' },
 *   ]"
 *   :detalheTooltip="(item) => `${item.participacao} do total`"
 * />
 * ```
 */
export const DetalheTooltip = {
  name: 'Detalhe no tooltip',
  args: {
    legenda: 'Receita por categoria',
    sublegenda: '2026',
    titulo: 'R$ 14k',
    descricao: 'total',
    tipoValor: 'moeda',
    data: [
      { rotulo: 'Vendas', quantidade: 4200, participacao: '30,2%' },
      { rotulo: 'Serviços', quantidade: 3100, participacao: '22,3%' },
      { rotulo: 'Assinaturas', quantidade: 2450, participacao: '17,6%' },
      { rotulo: 'Licenças', quantidade: 1800, participacao: '13,0%' },
      { rotulo: 'Suporte', quantidade: 1250, participacao: '9,0%' },
      { rotulo: 'Outros', quantidade: 1100, participacao: '7,9%' },
    ],
    detalheTooltip: (item) => `${item.participacao} do total`,
  },
}

/**
 * Tooltip na linha da tabela — ao passar o mouse sobre uma linha, um tooltip
 * nativo (`title`) mostra a descrição completa. Útil quando o `rotulo` é curto
 * (ex.: "Meta 1") mas existe um texto longo associado.
 *
 * **Como definir:** inclua `descricao` em cada item de `data` (comportamento
 * padrão) ou passe `:tooltipLinha="(item) => ..."` para customizar o texto.
 *
 * ```vue
 * <CardPizza
 *   :data="[
 *     { rotulo: 'Meta 1', quantidade: 58, descricao: 'Desenvolver pesquisa aplicada...' },
 *     { rotulo: 'Meta 2', quantidade: 1, descricao: 'Desenvolver ferramentas de intervenção...' },
 *   ]"
 * />
 * ```
 */
export const TooltipNaLinha = {
  name: 'Tooltip na linha da tabela',
  args: {
    legenda: 'Solicitações por meta',
    sublegenda: 'Projeto',
    titulo: '232',
    descricao: 'total de solicitações',
    rotuloCategoria: 'Meta',
    tipoValor: 'numero',
    data: [
      { rotulo: 'Meta 1', quantidade: 58, descricao: 'Desenvolver pesquisa aplicada com o desenvolvimento de ferramentas de intervenção na regulação de leitos' },
      { rotulo: 'Meta 2', quantidade: 1, descricao: 'Desenvolver pesquisa aplicada com o desenvolvimento de ferramentas de intervenção na regulação de cirurgias' },
      { rotulo: 'Meta 6', quantidade: 163, descricao: 'Desenvolver pesquisa aplicada para aprimorar a interoperabilidade do ecossistema de saúde com a regulação do acesso aos serviços de saúde' },
      { rotulo: 'Meta 8', quantidade: 8, descricao: 'Desenvolver pesquisa aplicada aos processos de trabalho, com foco no suporte aos técnicos da SES/MT' },
      { rotulo: 'Meta 13', quantidade: 16, descricao: 'Atividades de cooperação nacionais e internacionais com grupos de pesquisa' },
    ],
  },
}

/** Itens clicáveis — emite `itemClicado` ao clicar numa fatia ou linha da tabela. */
export const ItensClicaveis = {
  args: { itensClicaveis: true, titulo: 'Clique', descricao: 'em um item' },
  render: (args) => ({
    components: { CardPizza },
    setup() {
      const selecionado = ref(null)
      const onItem = (payload) => {
        selecionado.value = payload
      }
      return { args, selecionado, onItem }
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:1rem;">
        <CardPizza v-bind="args" @item-clicado="onItem" />
        <div style="font-family:monospace;font-size:0.85rem;padding:0.75rem 1rem;border:1px dashed rgba(15,23,42,0.2);border-radius:8px;">
          <strong>Último item:</strong>
          {{ selecionado ? selecionado.item.rotulo + ' (' + selecionado.item.quantidade + ')' : '—' }}
        </div>
      </div>
    `,
  }),
}

/** Interativo — regenera os dados para visualizar a transição das fatias. */
export const Interativo = {
  render: (args) => ({
    components: { CardPizza },
    setup() {
      const localData = ref(gerarDadosAleatorios())
      const gerar = () => {
        localData.value = gerarDadosAleatorios()
      }
      return { args, localData, gerar }
    },
    template: `
      <CardPizza v-bind="args" :data="localData">
        <template #actions>
          <button
            @click="gerar"
            style="padding:0.5rem 1.1rem;border-radius:10px;border:1px solid rgba(15,23,42,0.18);background:transparent;cursor:pointer;font-size:0.9rem;font-weight:500;font-family:inherit;"
          >Gerar dados aleatórios</button>
        </template>
      </CardPizza>
    `,
  }),
}
