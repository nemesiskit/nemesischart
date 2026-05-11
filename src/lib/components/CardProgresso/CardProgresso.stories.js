import { ref } from 'vue'
import CardProgresso from './CardProgresso.vue'

const ROTULOS = ['Vendas', 'Serviços', 'Assinaturas', 'Suporte', 'Treinamentos']

function gerarDadosAleatorios() {
  return ROTULOS.map((rotulo) => {
    const meta = Math.floor(Math.random() * 80) + 40
    const quantidade = Math.floor(Math.random() * meta)
    return { rotulo, quantidade, meta }
  })
}

const sampleData = [
  { rotulo: 'Vendas', quantidade: 72, meta: 100 },
  { rotulo: 'Serviços', quantidade: 48, meta: 80 },
  { rotulo: 'Assinaturas', quantidade: 35, meta: 60 },
  { rotulo: 'Suporte', quantidade: 18, meta: 40 },
]

export default {
  title: 'Cards/CardProgresso',
  component: CardProgresso,
  tags: ['autodocs'],
  argTypes: {
    tema: { control: { type: 'select' }, options: ['light', 'dark', 'transparent'] },
    direcao: { control: { type: 'inline-radio' }, options: ['top', 'bottom', 'left', 'right'] },
    formato: { control: { type: 'inline-radio' }, options: ['linear', 'circular'] },
    tipoValor: { control: { type: 'inline-radio' }, options: ['numero', 'moeda', 'percentual'] },
    corFundo: { control: { type: 'color' } },
    corTexto: { control: { type: 'color' } },
    corBorda: { control: { type: 'color' } },
    corDetalhes: { control: { type: 'color' } },
    borderRadius: { control: { type: 'text' } },
    sombra: { control: { type: 'text' } },
    cutout: { control: { type: 'text' } },
    alturaBarra: { control: { type: 'number' } },
    raioBarra: { control: { type: 'text' } },
    botaoVisivel: { control: { type: 'boolean' } },
    mostrarValor: { control: { type: 'boolean' } },
    mostrarPercentual: { control: { type: 'boolean' } },
    exportar: { control: { type: 'boolean' } },
    nomeArquivoExport: { control: { type: 'text' } },
    botaoAcao: { action: 'botaoAcao' },
    exportado: { action: 'exportado' },
  },
  args: {
    legenda: 'Metas do mês',
    sublegenda: 'maio / 2026',
    titulo: null,
    descricao: null,
    tema: 'light',
    direcao: 'top',
    formato: 'linear',
    tipoValor: 'numero',
    mostrarValor: true,
    mostrarPercentual: true,
    botaoVisivel: false,
    textoBotao: 'Ver mais',
    exportar: false,
    nomeArquivoExport: 'card-progresso.png',
    corBorda: '#EAE8E8',
    corDetalhes: '#3B82F6',
    borderRadius: '1rem',
    sombra: '0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.06)',
    alturaBarra: 8,
    raioBarra: '999px',
    cutout: '78%',
    height: 220,
    data: sampleData,
  },
}

export const Light = { args: { tema: 'light' } }
export const Dark = { args: { tema: 'dark' } }
export const Transparent = { args: { tema: 'transparent' } }

export const Circular = {
  args: {
    formato: 'circular',
    direcao: 'left',
    titulo: 'Total atingido',
    descricao: 'progresso consolidado',
  },
}

export const Moeda = {
  args: {
    tipoValor: 'moeda',
    data: [
      { rotulo: 'Receita', quantidade: 18500, meta: 25000 },
      { rotulo: 'Recorrente', quantidade: 9800, meta: 15000 },
      { rotulo: 'Avulsa', quantidade: 4200, meta: 8000 },
    ],
  },
}

export const Percentual = {
  args: {
    tipoValor: 'percentual',
    data: [
      { rotulo: 'Conversão', quantidade: 42, meta: 100 },
      { rotulo: 'Retenção', quantidade: 78, meta: 100 },
      { rotulo: 'Satisfação', quantidade: 91, meta: 100 },
    ],
  },
}

export const CoresPorItem = {
  args: {
    data: [
      { rotulo: 'A', quantidade: 30, meta: 50, cor: '#10B981' },
      { rotulo: 'B', quantidade: 22, meta: 80, cor: '#F59E0B' },
      { rotulo: 'C', quantidade: 65, meta: 70, cor: '#EF4444' },
      { rotulo: 'D', quantidade: 15, meta: 100, cor: '#8B5CF6' },
    ],
  },
}

export const ComBotao = {
  args: { botaoVisivel: true, textoBotao: 'Ver detalhes' },
}

export const ComExportar = {
  args: { exportar: true, nomeArquivoExport: 'metas-mes.png' },
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
    components: { CardProgresso },
    setup() {
      const localData = ref(gerarDadosAleatorios())
      const gerar = () => { localData.value = gerarDadosAleatorios() }
      return { args, localData, gerar }
    },
    template: `
      <CardProgresso v-bind="args" :data="localData">
        <template #actions>
          <button
            @click="gerar"
            style="padding:0.5rem 1.1rem;border-radius:10px;border:1px solid rgba(15,23,42,0.18);background:transparent;cursor:pointer;font-size:0.9rem;font-weight:500;font-family:inherit;"
          >Gerar dados aleatórios</button>
        </template>
      </CardProgresso>
    `,
  }),
}
