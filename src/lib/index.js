import CardLinhas from './components/CardLinhas/CardLinhas.vue'
import CardPizza from './components/CardPizza/CardPizza.vue'
import CardBarra from './components/CardBarra/CardBarra.vue'
import CardPolar from './components/CardPolar/CardPolar.vue'
import CardProgresso from './components/CardProgresso/CardProgresso.vue'
import CardBase from './components/CardBase/CardBase.vue'
import ChartBase from './components/ChartBase/ChartBase.vue'

export { ChartBase, CardBase, CardLinhas, CardPizza, CardBarra, CardPolar, CardProgresso }

export default {
  install(app) {
    app.component('ChartBase', ChartBase)
    app.component('CardBase', CardBase)
    app.component('CardLinhas', CardLinhas)
    app.component('CardPizza', CardPizza)
    app.component('CardBarra', CardBarra)
    app.component('CardPolar', CardPolar)
    app.component('CardProgresso', CardProgresso)
  },
}
