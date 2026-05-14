import { computed } from 'vue'

function hexToHsl(hex) {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const r = parseInt(full.slice(0, 2), 16) / 255
  const g = parseInt(full.slice(2, 4), 16) / 255
  const b = parseInt(full.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l * 100]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let hue
  if (max === r) hue = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) hue = ((b - r) / d + 2) / 6
  else hue = ((r - g) / d + 4) / 6
  return [hue * 360, s * 100, l * 100]
}

function hslToHex(h, s, l) {
  h /= 360; s /= 100; l /= 100
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  const hue2rgb = (t) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }
  const r = s === 0 ? l : hue2rgb(h + 1 / 3)
  const g = s === 0 ? l : hue2rgb(h)
  const b = s === 0 ? l : hue2rgb(h - 1 / 3)
  return '#' + [r, g, b].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('')
}

export function gerarPaleta(corBase, n = 7) {
  if (!corBase?.startsWith('#')) return Array.from({ length: n }, () => corBase ?? '#3B82F6')
  const [h, s] = hexToHsl(corBase)
  const lMin = 20, lMax = 72
  return Array.from({ length: n }, (_, i) => {
    const t = n === 1 ? 0.5 : i / (n - 1)
    const li = lMin + t * (lMax - lMin)
    const si = Math.max(50, s - Math.max(0, li - 55) * 0.6)
    return hslToHex(h, si, li)
  })
}

const PRESETS = {
  light: { bg: '#ffffff', text: '#000000', muted: '#64748B', grid: 'rgba(15,23,42,0.06)' },
  dark: { bg: '#000000', text: '#ffffff', muted: '#7b7b7b', grid: 'rgba(255,255,255,0.08)' },
  transparent: { bg: 'transparent', text: 'inherit', muted: '#7b7b7b', grid: 'rgba(127,127,127,0.15)' },
}

export function toRgba(color, alpha) {
  if (!color) return `rgba(59,130,246,${alpha})`
  if (color.startsWith('#')) {
    const h = color.replace('#', '')
    const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
    const r = parseInt(full.slice(0, 2), 16)
    const g = parseInt(full.slice(2, 4), 16)
    const b = parseInt(full.slice(4, 6), 16)
    return `rgba(${r},${g},${b},${alpha})`
  }
  if (color.startsWith('rgb')) {
    const nums = color.match(/[\d.]+/g)
    if (nums && nums.length >= 3) return `rgba(${nums[0]},${nums[1]},${nums[2]},${alpha})`
  }
  return color
}

export function useTema(props) {
  const palette = computed(() => {
    const preset = PRESETS[props.tema]
    const base = preset
      ? { ...preset, bg: props.corFundo || preset.bg }
      : { bg: props.corFundo || props.tema, text: '#F8FAFC', muted: '#7b7b7b', grid: 'rgba(255,255,255,0.08)' }
    return {
      ...base,
      text: props.corTexto || base.text,
      muted: props.corTexto || base.muted,
    }
  })

  const cardStyle = computed(() => ({
    background: palette.value.bg,
    color: palette.value.text,
    borderRadius: typeof props.borderRadius === 'number' ? `${props.borderRadius}px` : props.borderRadius,
    boxShadow: props.sombra,
    border: props.corBorda ? `1px solid ${props.corBorda}` : 'none',
  }))

  return { palette, cardStyle, toRgba }
}
