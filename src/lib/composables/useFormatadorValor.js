import { computed } from 'vue'

export function useFormatadorValor(props) {
  const formatador = computed(() => {
    if (props.tipoValor === 'moeda') {
      return new Intl.NumberFormat(props.locale, { style: 'currency', currency: props.moeda })
    }
    if (props.tipoValor === 'percentual') {
      return new Intl.NumberFormat(props.locale, { style: 'percent', maximumFractionDigits: 2 })
    }
    return new Intl.NumberFormat(props.locale, { maximumFractionDigits: 2 })
  })

  function formatar(valor) {
    if (valor === null || valor === undefined) return ''
    const n = Number(valor)
    if (Number.isNaN(n)) return String(valor)
    if (props.tipoValor === 'percentual') return formatador.value.format(n / 100)
    return formatador.value.format(n)
  }

  return { formatador, formatar }
}
