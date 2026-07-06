import { ref } from 'vue'
import CardLinhas from './CardLinhas.vue'

const ROTULOS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

// Faturamento mensal (R$) — ano cheio com sazonalidade, total ≈ R$ 45,8M.
const faturamentoMensal = [
  { rotulo: 'Jan', quantidade: 1186451.5 },
  { rotulo: 'Fev', quantidade: 2810076.48 },
  { rotulo: 'Mar', quantidade: 3247974.14 },
  { rotulo: 'Abr', quantidade: 3565908.98 },
  { rotulo: 'Mai', quantidade: 2980120.0 },
  { rotulo: 'Jun', quantidade: 4120540.3 },
  { rotulo: 'Jul', quantidade: 3894210.77 },
  { rotulo: 'Ago', quantidade: 4452980.12 },
  { rotulo: 'Set', quantidade: 3720145.6 },
  { rotulo: 'Out', quantidade: 5104320.0 },
  { rotulo: 'Nov', quantidade: 4583900.45 },
  { rotulo: 'Dez', quantidade: 6201780.9 },
]

// Pagamentos realizados — valor (eixo) + contagem por mês (detalhe no tooltip).
const pagamentosRealizados = [
  { rotulo: 'Jan', quantidade: 2456173.9, pagamentos: 1353 },
  { rotulo: 'Fev', quantidade: 3889895.3, pagamentos: 1269 },
  { rotulo: 'Mar', quantidade: 11107160.65, pagamentos: 2162 },
  { rotulo: 'Abr', quantidade: 6754282.76, pagamentos: 2401 },
  { rotulo: 'Mai', quantidade: 7878164.95, pagamentos: 3690 },
  { rotulo: 'Jun', quantidade: 5456376.87, pagamentos: 2501 },
]

function gerarFaturamento() {
  return ROTULOS.map((rotulo) => ({ rotulo, quantidade: Math.floor(Math.random() * 5_000_000) }))
}

export default {
  title: 'Cards/CardLinhas',
  component: CardLinhas,
  tags: ['autodocs'],
  argTypes: {
    tema: { control: { type: 'select' }, options: ['light', 'dark', 'transparent'] },
    direcao: { control: { type: 'inline-radio' }, options: ['top', 'bottom', 'left', 'right'] },
    tipoValor: { control: { type: 'inline-radio' }, options: ['numero', 'moeda', 'percentual'] },
    corDetalhes: { control: { type: 'color' } },
    corFundo: { control: { type: 'color' } },
    corTexto: { control: { type: 'color' } },
    corBorda: { control: { type: 'color' } },
    borderRadius: { control: { type: 'text' } },
    sombra: { control: { type: 'text' } },
    botaoVisivel: { control: { type: 'boolean' } },
    exportar: { control: { type: 'boolean' } },
    nomeArquivoExport: { control: { type: 'text' } },
    linhasReferencia: { control: { type: 'object' } },
    detalheTooltip: { control: false },
    botaoAcao: { action: 'botaoAcao' },
    exportado: { action: 'exportado' },
  },
  args: {
    legenda: 'Faturamento',
    sublegenda: '2026',
    titulo: 'R$ 45,8M',
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
    nomeArquivoExport: 'card-linhas.png',
    corBorda: '#EAE8E8',
    borderRadius: '1rem',
    sombra: '0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.06)',
    data: faturamentoMensal,
  },
}

/**
 * Exemplo canônico: faturamento mensal formatado como moeda. Use os controles
 * (tema, cor, direção, borda, sombra, botão, exportar…) para explorar todas as
 * variações sem precisar de stories dedicadas.
 */
export const Padrao = {}

/** Tema escuro — ideal para cards de destaque sobre fundos claros. */
export const Escuro = {
  args: { tema: 'dark', corDetalhes: '#60A5FA' },
}

/** Tema transparente — sem fundo/sombra, para compor dentro de outro container. */
export const Transparente = {
  args: { tema: 'transparent', sombra: 'none', corBorda: 'transparent' },
}

/** `tipoValor="numero"` — contagem de atendimentos, sem símbolo monetário. */
export const Contagem = {
  args: {
    legenda: 'Atendimentos',
    sublegenda: '2026',
    titulo: '48.920',
    descricao: 'chamados resolvidos',
    tipoValor: 'numero',
    corDetalhes: '#10B981',
    data: [
      { rotulo: 'Jan', quantidade: 3120 },
      { rotulo: 'Fev', quantidade: 3580 },
      { rotulo: 'Mar', quantidade: 4210 },
      { rotulo: 'Abr', quantidade: 3990 },
      { rotulo: 'Mai', quantidade: 4630 },
      { rotulo: 'Jun', quantidade: 5120 },
      { rotulo: 'Jul', quantidade: 4870 },
      { rotulo: 'Ago', quantidade: 5340 },
      { rotulo: 'Set', quantidade: 4760 },
      { rotulo: 'Out', quantidade: 5610 },
      { rotulo: 'Nov', quantidade: 5180 },
      { rotulo: 'Dez', quantidade: 4510 },
    ],
  },
}

/** `tipoValor="percentual"` — evolução da taxa de conversão. */
export const Percentual = {
  args: {
    legenda: 'Taxa de conversão',
    sublegenda: 'últimos 6 meses',
    titulo: '78%',
    descricao: 'pico em junho',
    tipoValor: 'percentual',
    corDetalhes: '#7C3AED',
    data: [
      { rotulo: 'Jan', quantidade: 41 },
      { rotulo: 'Fev', quantidade: 48 },
      { rotulo: 'Mar', quantidade: 55 },
      { rotulo: 'Abr', quantidade: 62 },
      { rotulo: 'Mai', quantidade: 70 },
      { rotulo: 'Jun', quantidade: 78 },
    ],
  },
}

/**
 * `detalheTooltip` — além do valor (eixo Y), o tooltip mostra um detalhe extra
 * por ponto. Aqui, a quantidade de pagamentos de cada mês. A função recebe o
 * item original de `data` e pode retornar uma string ou um array de strings.
 */
export const DetalheTooltip = {
  name: 'Detalhe no tooltip',
  args: {
    legenda: 'Pagamentos realizados',
    sublegenda: 'Últimos 12 meses do ano',
    titulo: 'R$ 37,5M',
    descricao: '13.376 pagamentos realizados em 2026',
    tipoValor: 'moeda',
    corDetalhes: '#1E40AF',
    data: pagamentosRealizados,
    detalheTooltip: (item) => `${item.pagamentos.toLocaleString('pt-BR')} pagamentos`,
  },
}

/** Linha de referência como meta — destaca quem ficou acima/abaixo do alvo. */
export const LinhaDeReferencia = {
  name: 'Com linha de referência',
  args: {
    legenda: 'Faturamento',
    sublegenda: '2026',
    titulo: null,
    descricao: null,
    tipoValor: 'moeda',
    corDetalhes: '#3B82F6',
    data: faturamentoMensal,
    linhasReferencia: { valor: 4_000_000, rotulo: 'Meta mensal', cor: '#10B981' },
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
    data: faturamentoMensal,
    linhasReferencia: [
      { valor: 3_000_000, rotulo: 'Meta', cor: '#10B981', tracejado: [6, 6] },
      { valor: 5_000_000, rotulo: 'Stretch', cor: '#EF4444', tracejado: [2, 4] },
    ],
  },
}

/** Interativo — regenera os dados para visualizar a transição da curva. */
export const Interativo = {
  render: (args) => ({
    components: { CardLinhas },
    setup() {
      const localData = ref(gerarFaturamento())
      const gerar = () => {
        localData.value = gerarFaturamento()
      }
      return { args, localData, gerar }
    },
    template: `
      <CardLinhas v-bind="args" :data="localData">
        <template #actions>
          <button
            @click="gerar"
            style="padding:0.5rem 1.1rem;border-radius:10px;border:1px solid rgba(15,23,42,0.18);background:transparent;cursor:pointer;font-size:0.9rem;font-weight:500;font-family:inherit;"
          >Gerar dados aleatórios</button>
        </template>
      </CardLinhas>
    `,
  }),
}
