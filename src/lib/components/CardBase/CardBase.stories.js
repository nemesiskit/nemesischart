import CardBase from './CardBase.vue'

export default {
  title: 'Cards/CardBase',
  component: CardBase,
  tags: ['autodocs'],
  argTypes: {
    tema: { control: { type: 'select' }, options: ['light', 'dark', 'transparent'] },
    alinhamento: { control: { type: 'inline-radio' }, options: ['left', 'center', 'right'] },
    corFundo: { control: { type: 'color' } },
    corTexto: { control: { type: 'color' } },
    corBorda: { control: { type: 'color' } },
    borderRadius: { control: { type: 'text' } },
    sombra: { control: { type: 'text' } },
    botaoVisivel: { control: { type: 'boolean' } },
    exportar: { control: { type: 'boolean' } },
    botaoAcao: { action: 'botaoAcao' },
    exportado: { action: 'exportado' },
  },
  args: {
    legenda: 'legenda',
    sublegenda: 'sublegenda',
    titulo: 'título',
    descricao: 'descrição',
    tema: 'light',
    alinhamento: 'left',
    textoBotao: 'Ver Todos',
    botaoVisivel: true,
    exportar: false,
    corBorda: '#EAE8E8',
    borderRadius: '1rem',
    sombra: '0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.06)',
  },
}

export const Light = { args: { tema: 'light' } }
export const Dark = { args: { tema: 'dark' } }
export const Transparent = { args: { tema: 'transparent' } }

export const Centralizado = { args: { alinhamento: 'center' } }
export const Direita = { args: { alinhamento: 'right' } }

export const SemBotao = { args: { botaoVisivel: false } }

export const ComExportar = { args: { exportar: true } }

export const SombraForte = {
  args: {
    sombra: '0 10px 30px rgba(15, 23, 42, 0.18)',
    corBorda: 'transparent',
    borderRadius: '20px',
  },
}

export const ConteudoLongo = {
  args: {
    legenda: 'Vendas do trimestre',
    sublegenda: 'Q2 / 2026',
    titulo: 'R$ 1.248.530,00',
    descricao: 'Acima da meta em 18% comparado ao trimestre anterior.',
    textoBotao: 'Ver relatório',
  },
}
