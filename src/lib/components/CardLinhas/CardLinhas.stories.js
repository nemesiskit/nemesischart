import { ref } from 'vue'
import CardLinhas from './CardLinhas.vue'

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
    nomeArquivoExport: 'card-linhas.png',
    corBorda: '#EAE8E8',
    borderRadius: '1rem',
    sombra: '0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.06)',
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

export const DadosAleatorios = {
  render: (args) => ({
    components: { CardLinhas },
    setup() {
      const localData = ref(gerarDadosAleatorios())
      const gerar = () => { localData.value = gerarDadosAleatorios() }
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

const dadosSemana = [
  { rotulo: 'Seg', quantidade: 3.5 },
  { rotulo: 'Ter', quantidade: 5.2 },
  { rotulo: 'Qua', quantidade: 7.8 },
  { rotulo: 'Qui', quantidade: 4.6 },
  { rotulo: 'Sex', quantidade: 6.1 },
]

export const LinhaReferencia = {
  name: 'Linha de referência (simples)',
  args: {
    legenda: 'Horas trabalhadas',
    sublegenda: 'semana atual',
    titulo: null,
    descricao: null,
    tipoValor: 'numero',
    corDetalhes: '#7C3AED',
    data: dadosSemana,
    linhasReferencia: { valor: 4.2, rotulo: 'Meta diária' },
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
    legenda: 'Faturamento',
    sublegenda: '2026',
    titulo: 'R$ 11M',
    descricao: 'acumulado no ano',
    tipoValor: 'moeda',
    corDetalhes: '#3B82F6',
    data: sampleData,
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
    data: sampleData,
    linhasReferencia: [
      { valor: 1500000, rotulo: 'Meta', cor: '#10B981' },
      { valor: 3000000, rotulo: 'Stretch', cor: '#EF4444' },
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
    data: dadosSemana,
    linhasReferencia: { valor: 4.2, rotulo: 'Meta diária', cor: '#F8FAFC', corRotulo: '#F8FAFC', corTexto: '#0F172A' },
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

export const LinhaReferenciaInterativa = {
  name: 'Linha de referência interativa',
  render: (args) => ({
    components: { CardLinhas },
    setup() {
      const meta = ref(5)
      return { args, meta }
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:1rem;">
        <label style="display:flex;align-items:center;gap:0.75rem;font-family:'Inter',sans-serif;font-size:0.85rem;">
          Meta:
          <input type="range" min="0" max="10" step="0.1" v-model.number="meta" style="flex:1;max-width:300px;" />
          <span style="font-variant-numeric:tabular-nums;font-weight:600;min-width:3ch;">{{ meta.toFixed(1) }}</span>
        </label>
        <CardLinhas
          v-bind="args"
          :linhas-referencia="{ valor: meta, rotulo: meta.toFixed(1) + 'h' }"
        />
      </div>
    `,
  }),
  args: {
    legenda: 'Horas trabalhadas',
    sublegenda: 'semana atual',
    titulo: null,
    descricao: null,
    tipoValor: 'numero',
    corDetalhes: '#7C3AED',
    data: dadosSemana,
  },
}
