import { ref } from 'vue'
import CardBarra from './CardBarra.vue'

const ROTULOS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

function gerarDadosAleatorios() {
  return ROTULOS.map((rotulo) => ({ rotulo, quantidade: Math.floor(Math.random() * 5000000) }))
}

const sampleData = [
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
    data: sampleData,
  },
}

export const Light = { args: { tema: 'light' } }
export const Dark = { args: { tema: 'dark' } }
export const Transparent = { args: { tema: 'transparent' } }

export const Moeda = {
  args: { tema: 'light', tipoValor: 'moeda', titulo: 'R$ 3,5M', descricao: 'pico em abril' },
}

export const Numero = {
  args: { tema: 'light', tipoValor: 'numero', titulo: '11.000.211', descricao: 'unidades' },
}

export const Percentual = {
  args: {
    tema: 'light',
    tipoValor: 'percentual',
    titulo: '78%',
    data: [
      { rotulo: 'Jan', quantidade: 12 },
      { rotulo: 'Fev', quantidade: 25 },
      { rotulo: 'Mar', quantidade: 40 },
      { rotulo: 'Abr', quantidade: 55 },
      { rotulo: 'Mai', quantidade: 78 },
    ],
  },
}

export const CorDeTextoCustomizada = {
  args: {
    tema: 'light',
    corTexto: '#7C3AED',
  },
}

export const DirecaoBottom = { args: { direcao: 'bottom' } }
export const DirecaoLeft = { args: { direcao: 'left' } }
export const DirecaoRight = { args: { direcao: 'right' } }

export const ComBotao = {
  args: { tema: 'dark', botaoVisivel: true, textoBotao: 'Ver detalhes' },
}

export const ComExportar = {
  args: { exportar: true, nomeArquivoExport: 'faturamento.png' },
}

export const ComBotaoEExportar = {
  args: { botaoVisivel: true, textoBotao: 'Ver detalhes', exportar: true },
}

export const BordaCustomizada = {
  args: {
    corBorda: '#3B82F6',
    borderRadius: '24px',
  },
}

export const SemSombra = {
  args: {
    sombra: 'none',
    corBorda: '#EAE8E8',
  },
}

export const SombraForte = {
  args: {
    sombra: '0 10px 30px rgba(15, 23, 42, 0.18)',
    corBorda: 'transparent',
    borderRadius: '20px',
  },
}

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

export const SeriesAgrupadas = {
  args: {
    legenda: 'Vendas por canal',
    sublegenda: 'trimestre',
    titulo: 'Online x Loja',
    descricao: 'comparativo trimestral',
    tipoValor: 'numero',
    series: [
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
    ],
  },
}

export const SeriesEmpilhadas = {
  args: {
    legenda: 'Receita por categoria',
    titulo: 'Empilhado',
    tipoValor: 'moeda',
    empilhado: true,
    series: [
      {
        nome: 'Produtos',
        cor: '#3B82F6',
        dados: [
          { rotulo: 'Jan', quantidade: 1200 },
          { rotulo: 'Fev', quantidade: 1500 },
          { rotulo: 'Mar', quantidade: 1800 },
          { rotulo: 'Abr', quantidade: 2000 },
        ],
      },
      {
        nome: 'Serviços',
        cor: '#10B981',
        dados: [
          { rotulo: 'Jan', quantidade: 800 },
          { rotulo: 'Fev', quantidade: 900 },
          { rotulo: 'Mar', quantidade: 1100 },
          { rotulo: 'Abr', quantidade: 1300 },
        ],
      },
      {
        nome: 'Assinaturas',
        cor: '#F59E0B',
        dados: [
          { rotulo: 'Jan', quantidade: 400 },
          { rotulo: 'Fev', quantidade: 500 },
          { rotulo: 'Mar', quantidade: 600 },
          { rotulo: 'Abr', quantidade: 700 },
        ],
      },
    ],
  },
}

export const SeriesHorizontalEmpilhadas = {
  args: {
    orientacao: 'horizontal',
    empilhado: true,
    legenda: 'Distribuição por região',
    titulo: 'Mix de canais',
    tipoValor: 'numero',
    series: [
      {
        nome: 'Online',
        cor: '#3B82F6',
        dados: [
          { rotulo: 'Sul', quantidade: 320 },
          { rotulo: 'Sudeste', quantidade: 540 },
          { rotulo: 'Centro', quantidade: 210 },
          { rotulo: 'Nordeste', quantidade: 380 },
          { rotulo: 'Norte', quantidade: 150 },
        ],
      },
      {
        nome: 'Loja',
        cor: '#10B981',
        dados: [
          { rotulo: 'Sul', quantidade: 180 },
          { rotulo: 'Sudeste', quantidade: 290 },
          { rotulo: 'Centro', quantidade: 120 },
          { rotulo: 'Nordeste', quantidade: 200 },
          { rotulo: 'Norte', quantidade: 80 },
        ],
      },
    ],
  },
}

export const LinhaReferencia = {
  name: 'Linha de referência (simples)',
  args: {
    legenda: 'Horas trabalhadas',
    sublegenda: 'semana atual',
    titulo: null,
    descricao: null,
    tipoValor: 'numero',
    corDetalhes: '#7C3AED',
    data: [
      { rotulo: 'Seg', quantidade: 3.5 },
      { rotulo: 'Ter', quantidade: 5.2 },
      { rotulo: 'Qua', quantidade: 7.8 },
      { rotulo: 'Qui', quantidade: 4.6 },
      { rotulo: 'Sex', quantidade: 6.1 },
    ],
    linhasReferencia: { valor: 4.2, rotulo: '4.2 hours' },
  },
}

export const LinhaReferenciaApenasValor = {
  name: 'Linha sem rótulo (só valor)',
  args: {
    legenda: 'Receita diária',
    sublegenda: 'últimos 7 dias',
    titulo: null,
    descricao: null,
    tipoValor: 'moeda',
    corDetalhes: '#0EA5E9',
    data: [
      { rotulo: 'Seg', quantidade: 8400 },
      { rotulo: 'Ter', quantidade: 11200 },
      { rotulo: 'Qua', quantidade: 9800 },
      { rotulo: 'Qui', quantidade: 14500 },
      { rotulo: 'Sex', quantidade: 17200 },
      { rotulo: 'Sáb', quantidade: 6900 },
      { rotulo: 'Dom', quantidade: 4300 },
    ],
    linhasReferencia: 10000,
  },
}

export const LinhaReferenciaMeta = {
  name: 'Linha como meta (verde)',
  args: {
    legenda: 'Vendas',
    sublegenda: '2026',
    titulo: 'R$ 11M',
    descricao: 'acumulado no ano',
    tipoValor: 'moeda',
    corDetalhes: '#3B82F6',
    linhasReferencia: { valor: 2500000, rotulo: 'Meta mensal', cor: '#10B981' },
  },
}

export const LinhaReferenciaMultipla = {
  name: 'Múltiplas linhas (meta + stretch)',
  args: {
    legenda: 'Faturamento vs metas',
    sublegenda: '2026',
    titulo: null,
    descricao: null,
    tipoValor: 'moeda',
    linhasReferencia: [
      { valor: 2000000, rotulo: 'Meta', cor: '#10B981' },
      { valor: 3500000, rotulo: 'Stretch', cor: '#EF4444' },
    ],
  },
}

export const LinhaReferenciaTema = {
  name: 'Linha em tema escuro',
  args: {
    tema: 'dark',
    legenda: 'Horas trabalhadas',
    sublegenda: 'semana atual',
    titulo: null,
    descricao: null,
    tipoValor: 'numero',
    corDetalhes: '#7C3AED',
    data: [
      { rotulo: 'Seg', quantidade: 3.5 },
      { rotulo: 'Ter', quantidade: 5.2 },
      { rotulo: 'Qua', quantidade: 7.8 },
      { rotulo: 'Qui', quantidade: 4.6 },
      { rotulo: 'Sex', quantidade: 6.1 },
    ],
    linhasReferencia: { valor: 4.2, rotulo: '4.2 hours', cor: '#F8FAFC', corRotulo: '#F8FAFC', corTexto: '#0F172A' },
  },
}

export const LinhaReferenciaEstilos = {
  name: 'Estilos de linha (tracejado, espessura)',
  args: {
    legenda: 'Métricas',
    sublegenda: 'mensal',
    titulo: null,
    descricao: null,
    tipoValor: 'numero',
    data: [
      { rotulo: 'Jan', quantidade: 45 },
      { rotulo: 'Fev', quantidade: 62 },
      { rotulo: 'Mar', quantidade: 38 },
      { rotulo: 'Abr', quantidade: 84 },
      { rotulo: 'Mai', quantidade: 71 },
      { rotulo: 'Jun', quantidade: 56 },
    ],
    linhasReferencia: [
      { valor: 30, rotulo: 'Mín', cor: '#EF4444', tracejado: [2, 4], espessura: 1 },
      { valor: 60, rotulo: 'Média', cor: '#0F172A', tracejado: [6, 6], espessura: 1 },
      { valor: 90, rotulo: 'Topo', cor: '#10B981', tracejado: [12, 4], espessura: 2 },
    ],
  },
}

export const LinhaReferenciaHorizontal = {
  name: 'Linha em barra horizontal',
  args: {
    orientacao: 'horizontal',
    legenda: 'Vendas por canal',
    sublegenda: '2026',
    titulo: null,
    descricao: null,
    tipoValor: 'numero',
    data: [
      { rotulo: 'Site', quantidade: 4200 },
      { rotulo: 'App', quantidade: 3100 },
      { rotulo: 'Marketplace', quantidade: 2450 },
      { rotulo: 'Loja física', quantidade: 1800 },
      { rotulo: 'Parceiros', quantidade: 900 },
    ],
    linhasReferencia: { valor: 2500, rotulo: 'Meta' },
  },
}

export const LinhaReferenciaSeries = {
  name: 'Linha em barras agrupadas',
  args: {
    legenda: 'Vendas por canal',
    sublegenda: 'trimestre',
    titulo: null,
    descricao: null,
    tipoValor: 'numero',
    series: [
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
    ],
    linhasReferencia: { valor: 150, rotulo: 'Meta', cor: '#EF4444' },
  },
}

export const LinhaReferenciaInterativa = {
  name: 'Linha de referência interativa',
  render: (args) => ({
    components: { CardBarra },
    setup() {
      const meta = ref(50)
      return { args, meta }
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:1rem;">
        <label style="display:flex;align-items:center;gap:0.75rem;font-family:'Inter',sans-serif;font-size:0.85rem;">
          Meta:
          <input type="range" min="0" max="100" v-model.number="meta" style="flex:1;max-width:300px;" />
          <span style="font-variant-numeric:tabular-nums;font-weight:600;min-width:3ch;">{{ meta }}</span>
        </label>
        <CardBarra
          v-bind="args"
          :linhas-referencia="{ valor: meta, rotulo: meta + '%' }"
        />
      </div>
    `,
  }),
  args: {
    legenda: 'Conversão por etapa',
    sublegenda: 'funil de vendas',
    titulo: null,
    descricao: null,
    tipoValor: 'percentual',
    corDetalhes: '#7C3AED',
    data: [
      { rotulo: 'Visita', quantidade: 100 },
      { rotulo: 'Cadastro', quantidade: 62 },
      { rotulo: 'Carrinho', quantidade: 38 },
      { rotulo: 'Checkout', quantidade: 21 },
      { rotulo: 'Pago', quantidade: 14 },
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
  { rotulo: 'Jul', total_previsto: 7568323.25, total_recebido: 0, total_em_aberto: 7568323.25 },
  { rotulo: 'Ago', total_previsto: 935804.93, total_recebido: 0, total_em_aberto: 935804.93 },
  { rotulo: 'Set', total_previsto: 3496123.12, total_recebido: 0, total_em_aberto: 3496123.12 },
  { rotulo: 'Out', total_previsto: 701351.0, total_recebido: 30000, total_em_aberto: 671351.0 },
  { rotulo: 'Nov', total_previsto: 505217.44, total_recebido: 0, total_em_aberto: 505217.44 },
  { rotulo: 'Dez', total_previsto: 4186451.22, total_recebido: 0, total_em_aberto: 4186451.22 },
]

export const FaturamentoPrevistoVsRecebido = {
  name: 'Faturamento (previsto no tooltip)',
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

export const DadosAleatorios = {
  render: (args) => ({
    components: { CardBarra },
    setup() {
      const localData = ref(gerarDadosAleatorios())
      const gerar = () => { localData.value = gerarDadosAleatorios() }
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
