import { ref } from 'vue'
import CardPolar from './CardPolar.vue'

const ROTULOS = ['Vendas', 'Serviços', 'Assinaturas', 'Licenças', 'Suporte', 'Treinamentos', 'Outros']

function gerarDadosAleatorios() {
  return ROTULOS.map((rotulo) => ({ rotulo, quantidade: Math.floor(Math.random() * 5000) + 100 }))
}

const sampleData = [
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
    botaoAcao: { action: 'botaoAcao' },
    exportado: { action: 'exportado' },
  },
  args: {
    legenda: 'legenda',
    sublegenda: 'sublegenda',
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
    corBorda: '#EAE8E8',
    borderRadius: '1rem',
    sombra: '0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.06)',
    height: 260,
    data: sampleData,
  },
}

export const Light = { args: { tema: 'light' } }
export const Dark = { args: { tema: 'dark' } }
export const Transparent = { args: { tema: 'transparent' } }

export const DirecaoLeft = { args: { direcao: 'left' } }
export const DirecaoTop = { args: { direcao: 'top' } }
export const DirecaoBottom = { args: { direcao: 'bottom' } }

export const Moeda = {
  args: {
    tipoValor: 'moeda',
    data: [
      { rotulo: 'Vendas', quantidade: 12 },
      { rotulo: 'Serviços', quantidade: 8 },
      { rotulo: 'Assinaturas', quantidade: 6 },
      { rotulo: 'Outros', quantidade: 9 },
    ],
  },
}

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

export const CoresCustomizadas = {
  args: {
    cores: ['#0F766E', '#14B8A6', '#5EEAD4', '#99F6E4', '#CCFBF1'],
    data: [
      { rotulo: 'A', quantidade: 30 },
      { rotulo: 'B', quantidade: 25 },
      { rotulo: 'C', quantidade: 20 },
      { rotulo: 'D', quantidade: 15 },
      { rotulo: 'E', quantidade: 10 },
    ],
  },
}

export const SemGrade = {
  args: { mostrarLinhasGrade: false },
}

export const ComBotao = {
  args: { botaoVisivel: true, textoBotao: 'Ver detalhes' },
}

export const ComExportar = {
  args: { exportar: true, nomeArquivoExport: 'distribuicao-polar.png' },
}

export const SemCabecalho = {
  args: { mostrarCabecalho: false },
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
    components: { CardPolar },
    setup() {
      const localData = ref(gerarDadosAleatorios())
      const gerar = () => { localData.value = gerarDadosAleatorios() }
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
