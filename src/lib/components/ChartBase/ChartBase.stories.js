import ChartBase from './ChartBase.vue'

const sampleData = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  datasets: [
    {
      label: 'Vendas',
      data: [12, 19, 8, 15, 22, 17],
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59,130,246,0.15)',
      fill: true,
      tension: 0.4,
    },
  ],
}

export default {
  title: 'Base/ChartBase',
  component: ChartBase,
  tags: ['autodocs'],
  argTypes: {
    type: { control: { type: 'select' }, options: ['line', 'bar', 'doughnut', 'pie', 'polarArea'] },
    height: { control: { type: 'number' } },
    width: { control: { type: 'text' } },
    data: { control: { type: 'object' } },
    options: { control: { type: 'object' } },
  },
  args: {
    type: 'line',
    height: 300,
    data: sampleData,
    options: {},
  },
}

export const Linha = { args: { type: 'line' } }

export const Barra = {
  args: {
    type: 'bar',
    data: {
      labels: sampleData.labels,
      datasets: [{ label: 'Vendas', data: [12, 19, 8, 15, 22, 17], backgroundColor: '#3B82F6', borderRadius: 6 }],
    },
  },
}

export const Doughnut = {
  args: {
    type: 'doughnut',
    data: {
      labels: ['Mobile', 'Desktop', 'Tablet'],
      datasets: [{ data: [55, 35, 10], backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'], borderWidth: 0 }],
    },
  },
}

export const AlturaCustomizada = { args: { height: 160 } }
