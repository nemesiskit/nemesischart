/*
 * Definições de props compartilhadas entre os cards.
 * Cada fábrica retorna um objeto pronto para espalhar em defineProps();
 * `defaults` permite sobrescrever apenas o valor padrão de props pontuais.
 */

export const SOMBRA_PADRAO = '0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.06)'

function comDefaults(base, defaults) {
  if (!defaults) return base
  const out = { ...base }
  for (const [chave, valor] of Object.entries(defaults)) {
    if (out[chave]) out[chave] = { ...out[chave], default: valor }
  }
  return out
}

/** Props visuais e de conteúdo comuns a todos os cards. */
export function propsCartao(defaults) {
  return comDefaults({
    legenda: { type: String, default: null },
    sublegenda: { type: String, default: null },
    titulo: { type: String, default: null },
    descricao: { type: String, default: null },
    tema: { type: String, default: 'light' },
    corFundo: { type: String, default: null },
    corTexto: { type: String, default: null },
    corBorda: { type: String, default: '#EAE8E8' },
    borderRadius: { type: [String, Number], default: '0.75rem' },
    sombra: { type: String, default: SOMBRA_PADRAO },
    textoBotao: { type: String, default: 'Ver mais' },
    botaoVisivel: { type: Boolean, default: false },
    exportar: { type: Boolean, default: false },
    nomeArquivoExport: { type: String, default: 'card.png' },
  }, defaults)
}

/** Props de formatação de valores (usadas com useFormatadorValor). */
export function propsValor(defaults) {
  return comDefaults({
    tipoValor: {
      type: String,
      default: 'numero',
      validator: (v) => ['numero', 'moeda', 'percentual'].includes(v),
    },
    locale: { type: String, default: 'pt-BR' },
    moeda: { type: String, default: 'BRL' },
  }, defaults)
}

/** Prop de direção do layout (posição do conteúdo em relação ao gráfico). */
export function propsDirecao(padrao = 'top') {
  return {
    direcao: {
      type: String,
      default: padrao,
      validator: (v) => ['top', 'bottom', 'left', 'right'].includes(v),
    },
  }
}

/** Props da tabela de dados (CardPizza e CardPolar). */
export function propsTabela(defaults) {
  return comDefaults({
    rotuloCategoria: { type: String, default: 'Categoria' },
    rotuloQuantidade: { type: String, default: 'Quantidade' },
    mostrarCabecalho: { type: Boolean, default: true },
    itensClicaveis: { type: Boolean, default: false },
    // Tooltip nativo (atributo `title`) exibido ao passar o mouse sobre a linha
    // da tabela. `(item, index) => string`. Quando omitido, usa `item.descricao`.
    tooltipLinha: { type: Function, default: null },
  }, defaults)
}
