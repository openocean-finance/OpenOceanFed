<template>
  <div class="charts">
    <div class="content t-padding" id="action-sheet-scroll">
      <h3 class="title first g-font-semi">OpenOcean Price</h3>
      <TimeRadio v-model="marketTime" @select="startPull"/>
      <div class="label">
        <div class="label__price">{{ marketLabelPrice || defaultMarketLabelPrice }}</div>
        <div class="label__time">{{ marketLabelTime || defaultMarketLabelTime }}</div>
      </div>
      <div ref="marketLineDom" class="chart"></div>
      <h3 class="title g-font-semi">Cex Price</h3>
      <TimeRadio v-model="cexTime" @select="startPull"/>
      <div class="label">
        <div class="label__price">{{ cexLabelPrice || defaultCexLabelPrice }}</div>
        <div class="label__time">{{ cexLabelTime || defaultCexLabelTime }}</div>
      </div>
      <div ref="cexLineDom" class="chart"></div>
      <h3 class="title g-font-semi">Spread</h3>
      <div class="spread__tip">{{ tip }}</div>
      <TimeRadio v-model="spreadTime" @select="startPull"/>
      <div class="label">
        <div class="label__price">{{ spreadLabelPrice || defaultSpreadLabelPrice }}</div>
        <div class="label__time">{{ spreadLabelTime || defaultSpreadLabelTime }}</div>
      </div>
      <div ref="spreadLineDom" class="chart"></div>
    </div>
  </div>
</template>

<script>

import { getCexLine, getMarketLine, getSpreadLine } from '@/api/charts';
import showToast from '@/components/toast/index';
import { Configs } from '@/utils/enum';
import renderCexChart, { getCexPoint } from '@/views/Trade/Charts/renderCexChart';
import renderMarketChart, { getMarketPoint } from '@/views/Trade/Charts/renderMarketChart';
import renderSpreadChart, { getSpreadPoint } from '@/views/Trade/Charts/renderSpreadChart';
import TimeRadio from '@/views/Trade/Charts/TimeRadio.vue';

export default {
  name: 'Charts',
  components: {
    TimeRadio,
  },
  data() {
    return {
      marketTime: '15m',
      marketLabelPrice: '',
      marketLabelTime: '',
      defaultMarketLabelPrice: '',
      defaultMarketLabelTime: '',
      cexTime: '15m',
      cexLabelPrice: '',
      cexLabelTime: '',
      defaultCexLabelPrice: '',
      defaultCexLabelTime: '',
      spreadTime: '15m',
      spreadLabelPrice: '',
      spreadLabelTime: '',
      defaultSpreadLabelPrice: '',
      defaultSpreadLabelTime: '',
      pullTimer: null,
      tip: 'Attention: spread is the price differece between openocean_price and cex_price. It does not include the trading fees and gas fees of your transactions',
    };
  },
  methods: {
    async startPull() {
      clearTimeout(this.pullTimer);
      await this.buildCharts();
      this.pullTimer = setTimeout(() => {
        this.startPull();
      }, Configs.PullDuration);
    },
    async buildCharts() {
      try {
        const {
          chain,
          selectedPair,
        } = this.$store.state;
        const marketLinePms = getMarketLine(this.marketTime, chain, selectedPair);
        const cexLinePms = getCexLine(this.cexTime, selectedPair);
        const spreadLinePms = getSpreadLine(this.spreadTime, this.cexTime, chain, selectedPair);
        const marketLineData = await marketLinePms;
        if (marketLineData.length) {
          const { time, price } = getMarketPoint(marketLineData[marketLineData.length - 1]);
          this.defaultMarketLabelTime = time;
          this.defaultMarketLabelPrice = price;
        }
        renderMarketChart(this.$refs.marketLineDom, marketLineData, ({
          price,
          time,
        }) => {
          this.marketLabelTime = time;
          this.marketLabelPrice = price;
        });
        const cexLineData = await cexLinePms;
        if (cexLineData.length) {
          const {
            time,
            price,
          } = getCexPoint(cexLineData[cexLineData.length - 1]);
          this.defaultCexLabelTime = time;
          this.defaultCexLabelPrice = price;
        }
        renderCexChart(this.$refs.cexLineDom, cexLineData, ({
          price,
          time,
        }) => {
          this.cexLabelTime = time;
          this.cexLabelPrice = price;
        });
        const spreadLineData = await spreadLinePms;
        if (spreadLineData.length) {
          const {
            time,
            price,
          } = getSpreadPoint(spreadLineData[spreadLineData.length - 1], selectedPair);
          this.defaultSpreadLabelTime = time;
          this.defaultSpreadLabelPrice = price;
        }
        renderSpreadChart(this.$refs.spreadLineDom, spreadLineData, ({
          price,
          time,
        }) => {
          this.spreadLabelTime = time;
          this.spreadLabelPrice = price;
        }, selectedPair);
      } catch (e) {
        showToast(e.message);
      }
    },
  },
  mounted() {
    this.startPull();
  },
  beforeDestroy() {
    clearTimeout(this.pullTimer);
  },
};
</script>

<style lang="scss" scoped>
.charts {
  padding: .4rem 0;
  user-select: none;
}

.t-padding {
  padding: 0 var(--space-common);
}

.content {
  overflow: auto;
  -webkit-overflow-scrolling:touch;
}

.title {
  margin: .5rem 0 0;
  padding: 0;
  font-size: .26rem;
  line-height: .42rem;

  &.first {
    margin-top: 0;
  }
}

.label {
  margin-top: var(--space-common);
  min-height: calc(.48rem + .33rem + .1rem);
}

.label__price {
  font-size: .32rem;
  line-height: .48rem;
}

.label__time {
  margin-top: .1rem;
  font-size: .22rem;
  line-height: .33rem;
  color: var(--color-lighter);
}

.chart {
  min-height: 200px;
}

.spread__tip {
  margin-top: var(--space-common);
  padding-bottom: .1rem;
  font-size: .22rem;
  line-height: .33rem;
  color: var(--color-des);
}
</style>
