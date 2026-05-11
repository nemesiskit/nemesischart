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
