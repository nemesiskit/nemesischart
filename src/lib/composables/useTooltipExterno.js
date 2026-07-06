import { toRgba } from './useTema.js'

const BORDA_CARET = '1px solid rgba(15,23,42,.06)'

export function criarTooltipEl(parent, { caretFlexivel = false } = {}) {
  let el = parent.querySelector('.nc-tt')
  if (el) return el
  el = document.createElement('div')
  el.className = 'nc-tt'
  Object.assign(el.style, {
    position: 'absolute',
    pointerEvents: 'none',
    transform: caretFlexivel ? 'translateX(-50%)' : 'translate(-50%, calc(-100% - 16px))',
    transition: 'opacity .18s ease, left .12s ease, top .12s ease',
    opacity: '0',
    background: '#ffffff',
    borderRadius: '10px',
    padding: '8px 11px',
    boxShadow: '0 1px 2px rgba(15,23,42,.06), 0 8px 24px rgba(15,23,42,.12)',
    border: '1px solid rgba(15,23,42,.06)',
    minWidth: '90px',
    whiteSpace: 'nowrap',
    zIndex: '10',
    fontFamily: 'inherit',
    textAlign: 'left',
  })
  const caret = document.createElement('div')
  caret.className = 'nc-tt__caret'
  const baseCaret = {
    position: 'absolute',
    left: '50%',
    width: '10px',
    height: '10px',
    background: '#ffffff',
    transform: 'translateX(-50%) rotate(45deg)',
    borderRadius: '2px',
  }
  if (caretFlexivel) {
    Object.assign(caret.style, baseCaret)
  } else {
    Object.assign(caret.style, baseCaret, {
      bottom: '-5px',
      borderRight: '1px solid rgba(15,23,42,.06)',
      borderBottom: '1px solid rgba(15,23,42,.06)',
    })
  }
  el.appendChild(caret)
  const content = document.createElement('div')
  content.className = 'nc-tt__content'
  Object.assign(content.style, { position: 'relative', background: '#fff', borderRadius: '8px' })
  el.appendChild(content)
  parent.appendChild(el)
  return el
}

export function prepararTooltipParent(chart) {
  const parent = chart.canvas.parentNode
  if (!parent) return null
  if (getComputedStyle(parent).position === 'static') parent.style.position = 'relative'
  return parent
}

export function clampHorizontal(left, ttWidth, parentWidth, margin = 4) {
  const halfW = ttWidth / 2
  if (left - halfW < margin) return halfW + margin
  if (left + halfW > parentWidth - margin) return parentWidth - halfW - margin
  return left
}

/** Linha de título (categoria/rótulo) do tooltip. */
export function ttTitulo(texto) {
  if (!texto) return ''
  return `<div style="font-size:9px;font-weight:500;color:#94A3B8;letter-spacing:.04em;text-transform:uppercase;line-height:1;margin-bottom:4px;">${texto}</div>`
}

/** Linha de texto secundário (detalhe/complemento) abaixo do valor principal. */
export function ttLinhaTexto(texto) {
  if (!texto) return ''
  return `<div style="font-size:11px;font-weight:500;color:#64748B;line-height:1.3;margin-top:3px;">${texto}</div>`
}

/**
 * Linha "bolinha colorida + valor" do tooltip.
 * `nome` adiciona o rótulo da série; `alinharDireita` empurra o valor para a
 * direita (tooltips multi-série); `margemTopo` separa linhas consecutivas.
 */
export function ttLinhaValor(cor, valor, { nome = '', alinharDireita = false, margemTopo = false } = {}) {
  const nomeHtml = nome
    ? `<span style="font-size:11px;color:#64748B;margin-right:6px;">${nome}</span>`
    : ''
  return (
    `<div style="display:flex;align-items:center;gap:6px;${margemTopo ? 'margin-top:2px;' : ''}">` +
      `<span style="width:6px;height:6px;border-radius:999px;background:${cor};box-shadow:0 0 0 2px ${toRgba(cor, 0.15)};flex:0 0 auto;"></span>` +
      nomeHtml +
      `<span style="font-size:12px;font-weight:700;color:#0F172A;letter-spacing:-.01em;line-height:1.1;${alinharDireita ? 'margin-left:auto;' : ''}">${valor}</span>` +
    `</div>`
  )
}

/** Ajusta as bordas/posição do caret quando o tooltip flipa para baixo do ponto. */
export function aplicarCaretFlip(caret, flip) {
  if (!caret) return
  if (flip) {
    Object.assign(caret.style, {
      top: '-5px',
      bottom: '',
      borderLeft: BORDA_CARET,
      borderTop: BORDA_CARET,
      borderRight: '',
      borderBottom: '',
    })
  } else {
    Object.assign(caret.style, {
      top: '',
      bottom: '-5px',
      borderRight: BORDA_CARET,
      borderBottom: BORDA_CARET,
      borderLeft: '',
      borderTop: '',
    })
  }
}

/**
 * Fábrica do handler de tooltip externo padrão (um ponto por vez): título em
 * cima, linha cor+valor embaixo, com clamp horizontal, flip vertical e caret
 * acompanhando o ponto ancorado. Usado por CardLinhas, CardPizza e CardPolar.
 *
 * `linhasExtrasDe(dp)` é opcional e permite acrescentar linhas de texto
 * secundário abaixo do valor (ex.: detalhamento por item). Pode retornar uma
 * string ou um array de strings.
 */
export function criarTooltipExternoPadrao({ corDe, valorDe, linhasExtrasDe = null, deveOcultar = () => false }) {
  return function externalTooltip(context) {
    const { chart, tooltip } = context
    const parent = prepararTooltipParent(chart)
    if (!parent) return
    const el = criarTooltipEl(parent)
    if (tooltip.opacity === 0 || deveOcultar()) {
      el.style.opacity = '0'
      return
    }
    const dp = tooltip.dataPoints && tooltip.dataPoints[0]
    const content = el.querySelector('.nc-tt__content')
    const extras = dp && linhasExtrasDe ? linhasExtrasDe(dp) : []
    const linhasExtras = (Array.isArray(extras) ? extras : [extras]).filter(Boolean)
    content.innerHTML =
      ttTitulo((tooltip.title || []).join(' ')) +
      ttLinhaValor(dp ? corDe(dp) : '#3B82F6', dp ? valorDe(dp) : '') +
      linhasExtras.map((t) => ttLinhaTexto(t)).join('')

    const { offsetLeft, offsetTop } = chart.canvas
    el.style.opacity = '1'
    el.style.visibility = 'hidden'
    el.style.left = '0px'
    el.style.top = '0px'
    const ttWidth = el.offsetWidth
    const ttHeight = el.offsetHeight
    const margin = 4
    const targetX = offsetLeft + tooltip.caretX
    const targetY = offsetTop + tooltip.caretY
    const left = clampHorizontal(targetX, ttWidth, parent.clientWidth, margin)
    const flipBelow = targetY < ttHeight + 16 + margin
    el.style.transform = flipBelow ? 'translate(-50%, 16px)' : 'translate(-50%, calc(-100% - 16px))'
    const caret = el.querySelector('.nc-tt__caret')
    aplicarCaretFlip(caret, flipBelow)
    if (caret) {
      const offset = targetX - left
      const half = ttWidth / 2
      const clampedOffset = Math.max(-half + 8, Math.min(half - 8, offset))
      caret.style.left = `calc(50% + ${clampedOffset}px)`
    }
    el.style.left = left + 'px'
    el.style.top = targetY + 'px'
    el.style.visibility = 'visible'
  }
}
