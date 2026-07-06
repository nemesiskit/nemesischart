import { computed } from 'vue'
import { toRgba } from './useTema.js'
import { prepararTooltipParent, clampHorizontal, ttTitulo, ttLinhaValor } from './useTooltipExterno.js'

function desenharRotulo(ctx, linha, bx, by, boxW, boxH, raio) {
  ctx.fillStyle = linha.corRotulo
  ctx.beginPath()
  if (ctx.roundRect) {
    ctx.roundRect(bx, by, boxW, boxH, raio)
  } else {
    ctx.moveTo(bx + raio, by)
    ctx.lineTo(bx + boxW - raio, by)
    ctx.quadraticCurveTo(bx + boxW, by, bx + boxW, by + raio)
    ctx.lineTo(bx + boxW, by + boxH - raio)
    ctx.quadraticCurveTo(bx + boxW, by + boxH, bx + boxW - raio, by + boxH)
    ctx.lineTo(bx + raio, by + boxH)
    ctx.quadraticCurveTo(bx, by + boxH, bx, by + boxH - raio)
    ctx.lineTo(bx, by + raio)
    ctx.quadraticCurveTo(bx, by, bx + raio, by)
  }
  ctx.fill()
  ctx.fillStyle = linha.corTexto
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'
  ctx.fillText(linha.rotulo, bx + boxW / 2, by + boxH / 2)
}

function criarTooltipLinhaRef(parent) {
  let el = parent.querySelector('.nc-tt-linhaRef')
  if (el) return el
  el = document.createElement('div')
  el.className = 'nc-tt-linhaRef'
  Object.assign(el.style, {
    position: 'absolute',
    pointerEvents: 'none',
    transform: 'translate(-50%, calc(-100% - 12px))',
    transition: 'opacity .18s ease, left .12s ease, top .12s ease',
    opacity: '0',
    background: '#ffffff',
    borderRadius: '10px',
    padding: '8px 11px',
    boxShadow: '0 1px 2px rgba(15,23,42,.06), 0 8px 24px rgba(15,23,42,.12)',
    border: '1px solid rgba(15,23,42,.06)',
    whiteSpace: 'nowrap',
    zIndex: '11',
    fontFamily: "'Inter', sans-serif",
    textAlign: 'left',
  })
  parent.appendChild(el)
  return el
}

/**
 * Linhas de referência (metas/limites) desenhadas sobre o gráfico, com rótulo
 * em pílula e tooltip próprio ao passar o mouse sobre a linha.
 *
 * @param {() => Object|Array|null} linhasReferencia getter da prop bruta
 * @param {() => boolean} horizontal true quando o eixo de valor é o X (barras horizontais)
 * @param {(valor: number) => string} formatar formatador de valores do card
 * @returns {{ linhasNormalizadas, pluginLinhaReferencia, temLinhaHover }}
 */
export function useLinhasReferencia({ linhasReferencia, horizontal = () => false, formatar }) {
  const linhasNormalizadas = computed(() => {
    const brutas = linhasReferencia()
    if (!brutas) return []
    const arr = Array.isArray(brutas) ? brutas : [brutas]
    return arr
      .filter((l) => l && (typeof l === 'number' || typeof l.valor === 'number'))
      .map((l) => {
        if (typeof l === 'number') {
          return { valor: l, rotulo: null, cor: '#0F172A', corRotulo: '#0F172A', corTexto: '#FFFFFF', tracejado: [6, 6], espessura: 1 }
        }
        return {
          valor: l.valor,
          rotulo: l.rotulo ?? null,
          cor: l.cor || '#0F172A',
          corRotulo: l.corRotulo || l.cor || '#0F172A',
          corTexto: l.corTexto || '#FFFFFF',
          tracejado: l.tracejado || [6, 6],
          espessura: l.espessura ?? 1,
        }
      })
  })

  const linhasPosicoes = []
  let linhaHover = null

  const pluginLinhaReferencia = {
    id: 'linhaReferencia',
    afterDatasetsDraw(chart) {
      const linhas = linhasNormalizadas.value
      linhasPosicoes.length = 0
      if (!linhas.length) return
      const { ctx, chartArea, scales } = chart
      const ehHorizontal = horizontal()
      const escalaValor = ehHorizontal ? scales.x : scales.y
      if (!escalaValor) return
      linhas.forEach((linha) => {
        const pos = escalaValor.getPixelForValue(linha.valor)
        linhasPosicoes.push({ linha, pos, horizontal: ehHorizontal, chartArea })
        ctx.save()
        ctx.beginPath()
        ctx.setLineDash(linha.tracejado)
        ctx.lineWidth = linha.espessura
        ctx.strokeStyle = linha.cor
        if (ehHorizontal) {
          if (pos < chartArea.left || pos > chartArea.right) { ctx.restore(); return }
          ctx.moveTo(pos, chartArea.top)
          ctx.lineTo(pos, chartArea.bottom)
        } else {
          if (pos < chartArea.top || pos > chartArea.bottom) { ctx.restore(); return }
          ctx.moveTo(chartArea.left, pos)
          ctx.lineTo(chartArea.right, pos)
        }
        ctx.stroke()
        ctx.setLineDash([])

        if (linha.rotulo) {
          ctx.font = "600 11px 'Inter', sans-serif"
          const padX = 8
          const padY = 5
          const metrics = ctx.measureText(linha.rotulo)
          const textW = metrics.width
          const textH = 12
          const boxW = textW + padX * 2
          const boxH = textH + padY * 2
          const raio = boxH / 2
          let bx, by
          if (ehHorizontal) {
            bx = pos - boxW / 2
            by = chartArea.top - boxH - 6
            if (by < 0) by = chartArea.top + 6
          } else {
            bx = chartArea.left - boxW - 6
            by = pos - boxH / 2
            if (bx < 0) bx = chartArea.left + 6
          }
          desenharRotulo(ctx, linha, bx, by, boxW, boxH, raio)
        }
        ctx.restore()
      })
    },
    beforeEvent(chart, args) {
      if (!linhasPosicoes.length) { linhaHover = null; return }
      const evt = args.event
      if (!evt || evt.type === 'mouseout' || evt.x == null || evt.y == null) { linhaHover = null; return }
      const limiar = 8
      let proxima = null
      let menorDist = Infinity
      for (const p of linhasPosicoes) {
        const dist = p.horizontal ? Math.abs(evt.x - p.pos) : Math.abs(evt.y - p.pos)
        const dentroEixo = p.horizontal
          ? evt.y >= p.chartArea.top && evt.y <= p.chartArea.bottom
          : evt.x >= p.chartArea.left && evt.x <= p.chartArea.right
        if (dist <= limiar && dentroEixo && dist < menorDist) {
          menorDist = dist
          proxima = p
        }
      }
      linhaHover = proxima
    },
    afterEvent(chart, args) {
      if (!linhasPosicoes.length) return
      const evt = args.event
      if (!evt) return
      const parent = prepararTooltipParent(chart)
      if (!parent) return

      if (!linhaHover) {
        const existente = parent.querySelector('.nc-tt-linhaRef')
        if (existente) existente.style.opacity = '0'
        return
      }
      const proxima = linhaHover
      const el = criarTooltipLinhaRef(parent)
      const cor = proxima.linha.cor || '#0F172A'
      el.innerHTML =
        ttTitulo(proxima.linha.rotulo) +
        ttLinhaValor(cor, formatar(proxima.linha.valor))

      const canvas = chart.canvas
      el.style.opacity = '1'
      el.style.visibility = 'hidden'
      el.style.left = '0px'
      el.style.top = '0px'
      const ttWidth = el.offsetWidth
      const ttHeight = el.offsetHeight
      const margin = 4
      let ancoraX, ancoraY
      if (proxima.horizontal) {
        ancoraX = canvas.offsetLeft + proxima.pos
        ancoraY = canvas.offsetTop + evt.y
      } else {
        ancoraX = canvas.offsetLeft + evt.x
        ancoraY = canvas.offsetTop + proxima.pos
      }
      const left = clampHorizontal(ancoraX, ttWidth, parent.clientWidth, margin)
      let top = ancoraY
      const minTop = ttHeight + 16 + margin
      if (top < minTop) top = minTop
      el.style.left = left + 'px'
      el.style.top = top + 'px'
      el.style.visibility = 'visible'
    },
  }

  return {
    linhasNormalizadas,
    pluginLinhaReferencia,
    temLinhaHover: () => !!linhaHover,
  }
}
