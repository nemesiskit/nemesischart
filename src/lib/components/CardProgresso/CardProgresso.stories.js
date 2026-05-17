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

const reducaoData = [
  { rotulo: 'Reclamações', quantidade: 320, meta: 100, valor_referencia: 500, modo: 'reducao' },
  { rotulo: 'Tickets abertos', quantidade: 87, meta: 50, valor_referencia: 150, modo: 'reducao' },
  { rotulo: 'Cancelamentos', quantidade: 42, meta: 30, valor_referencia: 80, modo: 'reducao' },
]

export default {
  title: 'Cards/CardProgresso',
  component: CardProgresso,
  tags: ['autodocs'],
  argTypes: {
    // Layout
    tema: {
      control: { type: 'select' },
      options: ['light', 'dark', 'transparent'],
      description: 'Tema visual do card.',
    },
    direcao: {
      control: { type: 'inline-radio' },
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Posição do gráfico circular em relação à lista (apenas quando `formato: circular`).',
    },
    formato: {
      control: { type: 'inline-radio' },
      options: ['linear', 'circular'],
      description: 'Exibe barras lineares ou um gráfico de rosca com a lista.',
    },

    // Dados
    data: {
      control: { type: 'object' },
      description: `Array de itens. Campos por item:
- **rotulo** *(string)* — label do item
- **quantidade** *(number)* — valor atual
- **meta** *(number)* — valor alvo
- **valor_referencia** *(number, opcional)* — ponto de partida para modo \`reducao\` (equivale a 0% de progresso)
- **modo** *('crescimento' | 'reducao', opcional)* — define o comportamento do item; omitir equivale a \`'crescimento'\`. Itens em modo redução exibem uma seta ↓ com tooltip explicativo ao passar o mouse.
- **cor** *(string, opcional)* — cor hex da barra deste item`,
    },
    metaPadrao: {
      control: { type: 'number' },
      description: 'Valor de meta usado quando o item não possui o campo `meta`.',
    },

    // Valores
    tipoValor: {
      control: { type: 'inline-radio' },
      options: ['numero', 'moeda', 'percentual'],
      description: 'Formatação dos valores exibidos.',
    },
    mostrarValor: {
      control: { type: 'boolean' },
      description: 'Exibe `quantidade / meta` ao lado de cada item.',
    },
    mostrarPercentual: {
      control: { type: 'boolean' },
      description: 'Exibe o percentual de progresso ao lado de cada item.',
    },

    // Aparência
    cores: {
      control: { type: 'object' },
      description: 'Paleta de cores usada nos itens que não definem `cor` individualmente.',
    },
    corFundo: { control: { type: 'color' }, description: 'Cor de fundo do card (sobrescreve o tema).' },
    corTexto: { control: { type: 'color' }, description: 'Cor do texto principal (sobrescreve o tema).' },
    corBorda: { control: { type: 'color' }, description: 'Cor da borda do card.' },
    corDetalhes: { control: { type: 'color' }, description: 'Cor do gráfico circular em modo crescimento.' },
    corExcesso: { control: { type: 'color' }, description: 'Cor de alerta usada em itens com modo `reducao`.' },
    borderRadius: { control: { type: 'text' }, description: 'Border-radius do card.' },
    sombra: { control: { type: 'text' }, description: 'Box-shadow do card.' },
    alturaBarra: { control: { type: 'number' }, description: 'Altura das barras de progresso em px.' },
    raioBarra: { control: { type: 'text' }, description: 'Border-radius das barras.' },

    // Gráfico circular
    height: { control: { type: 'number' }, description: 'Altura do gráfico circular em px.' },
    cutout: { control: { type: 'text' }, description: 'Espessura do anel do gráfico de rosca (ex: `78%`). O percentual central exibido é a média simples dos percentuais individuais de cada item.' },

    // Ações
    botaoVisivel: { control: { type: 'boolean' }, description: 'Exibe o botão de ação no topo do card.' },
    textoBotao: { control: { type: 'text' }, description: 'Texto do botão de ação.' },
    exportar: { control: { type: 'boolean' }, description: 'Exibe o botão de exportar como imagem.' },
    nomeArquivoExport: { control: { type: 'text' }, description: 'Nome do arquivo gerado ao exportar.' },

    // Eventos
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
    corExcesso: '#EF4444',
    borderRadius: '1rem',
    sombra: '0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.06)',
    alturaBarra: 8,
    raioBarra: '999px',
    cutout: '78%',
    height: 220,
    metaPadrao: 100,
    data: sampleData,
  },
}

// ─── Tema ────────────────────────────────────────────────────────────────────

export const Light = { args: { tema: 'light' } }
export const Dark = { args: { tema: 'dark' } }
export const Transparent = { args: { tema: 'transparent' } }

// ─── Formato ─────────────────────────────────────────────────────────────────

export const Circular = {
  args: {
    formato: 'circular',
    direcao: 'left',
    titulo: 'Total atingido',
    descricao: 'progresso consolidado',
  },
}

// ─── Tipo de valor ───────────────────────────────────────────────────────────

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

// ─── Modo redução ─────────────────────────────────────────────────────────────

export const MetaReducao = {
  name: 'Meta de Redução',
  args: {
    legenda: 'Indicadores a reduzir',
    sublegenda: 'progresso de redução por item',
    data: reducaoData,
  },
}

export const MetaReducaoCircular = {
  name: 'Meta de Redução — Circular',
  args: {
    legenda: 'Visão consolidada',
    sublegenda: 'progresso de redução',
    formato: 'circular',
    direcao: 'left',
    titulo: 'Redução',
    data: reducaoData,
  },
}

export const TooltipReducao = {
  name: 'Tooltip de Redução',
  parameters: {
    docs: {
      description: {
        story: 'Itens com `modo: "reducao"` exibem uma seta ↓ ao lado do rótulo. Ao passar o mouse sobre ela, um tooltip customizado explica o comportamento do modo redução.',
      },
    },
  },
  args: {
    legenda: 'Passe o mouse sobre o ↓',
    sublegenda: 'tooltip de modo redução',
    data: reducaoData,
  },
}

export const MistoCrescimentoReducao = {
  name: 'Misto — Crescimento e Redução',
  args: {
    legenda: 'Painel geral',
    sublegenda: 'metas mistas por item',
    data: [
      { rotulo: 'Vendas', quantidade: 72, meta: 100 },
      { rotulo: 'Reclamações', quantidade: 320, meta: 100, valor_referencia: 500, modo: 'reducao' },
      { rotulo: 'Retenção', quantidade: 55, meta: 80 },
      { rotulo: 'Cancelamentos', quantidade: 42, meta: 30, valor_referencia: 80, modo: 'reducao' },
    ],
  },
}

// ─── Aparência ────────────────────────────────────────────────────────────────

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

export const SombraForte = {
  args: {
    sombra: '0 10px 30px rgba(15, 23, 42, 0.18)',
    corBorda: 'transparent',
    borderRadius: '20px',
  },
}

// ─── Ações ────────────────────────────────────────────────────────────────────

export const ComBotao = {
  args: { botaoVisivel: true, textoBotao: 'Ver detalhes' },
}

export const ComExportar = {
  args: { exportar: true, nomeArquivoExport: 'metas-mes.png' },
}

// ─── Interativo ───────────────────────────────────────────────────────────────

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
