import { computed } from 'vue'

const PRESETS = {
  light: { bg: '#ffffff', text: '#000000', muted: '#64748B', grid: 'rgba(15,23,42,0.06)' },
  dark: { bg: '#000000', text: '#ffffff', muted: '#94A3B8', grid: 'rgba(255,255,255,0.08)' },
  transparent: { bg: 'transparent', text: 'inherit', muted: '#94A3B8', grid: 'rgba(127,127,127,0.15)' },
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
      : { bg: props.corFundo || props.tema, text: '#F8FAFC', muted: '#94A3B8', grid: 'rgba(255,255,255,0.08)' }
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
