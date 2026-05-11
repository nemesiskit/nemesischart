<script setup>
import { ref, onMounted, onBeforeUnmount, watch, shallowRef } from 'vue'
import {
  Chart,
  Title,
  Tooltip,
  Legend,
  Filler,
  LineController,
  LineElement,
  PointElement,
  BarController,
  BarElement,
  PieController,
  PolarAreaController,
  ArcElement,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
} from 'chart.js'

Chart.register(
  Title,
  Tooltip,
  Legend,
  Filler,
  LineController,
  LineElement,
  PointElement,
  BarController,
  BarElement,
  PieController,
  PolarAreaController,
  ArcElement,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
)

const props = defineProps({
  type: { type: String, required: true },
  data: { type: Object, required: true },
  options: { type: Object, default: () => ({}) },
  plugins: { type: Array, default: () => [] },
  height: { type: [String, Number], default: 300 },
  width: { type: [String, Number], default: null },
})

const canvasRef = ref(null)
const chartInstance = shallowRef(null)

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' },
  },
}

function buildOptions() {
  return { ...defaultOptions, ...props.options }
}

function create() {
  if (!canvasRef.value) return
  chartInstance.value = new Chart(canvasRef.value, {
    type: props.type,
    data: props.data,
    options: buildOptions(),
    plugins: props.plugins,
  })
}

function destroy() {
  if (chartInstance.value) {
    chartInstance.value.destroy()
    chartInstance.value = null
  }
}

onMounted(create)
onBeforeUnmount(destroy)

watch(
  () => props.data,
  (newData) => {
    if (!chartInstance.value) return
    chartInstance.value.data.labels = newData.labels
    const current = chartInstance.value.data.datasets
    const next = newData.datasets
    if (current.length !== next.length) {
      chartInstance.value.data.datasets = next
    } else {
      next.forEach((ds, i) => Object.assign(current[i], ds))
    }
    chartInstance.value.update()
  },
  { deep: true },
)

watch(
  () => props.options,
  () => {
    if (!chartInstance.value) return
    chartInstance.value.options = buildOptions()
    chartInstance.value.update()
  },
  { deep: true },
)

defineExpose({ chart: chartInstance })
</script>

<template>
  <div
    class="nc-chart-wrapper w-full"
    :style="{
      height: typeof height === 'number' ? `${height}px` : height,
      width: width ? (typeof width === 'number' ? `${width}px` : width) : '100%',
    }"
  >
    <canvas ref="canvasRef" />
  </div>
</template>

<style scoped>
.nc-chart-wrapper {
  position: relative;
}
</style>
