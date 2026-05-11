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
