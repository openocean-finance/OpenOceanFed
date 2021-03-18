<template>
  <div class="exchanges g-child-mt">
    <NouTable :data="dexList" :loading="isLoading" @clickRow="selectExchange">
      <NouTableCol :label="classic?'Exchange':'Dex'">
        <template v-slot="{row}">
          <div class="exchanges__logo__wrapper">
            <img class="exchanges__logo" :src="row.logo" alt="">
          </div>
        </template>
      </NouTableCol>
      <NouTableCol label="Last Price" prop="lastPrice">
        <template v-slot="{row}">{{ row.price | formatPrice }}</template>
      </NouTableCol>
      <NouTableCol label="Diff">
        <template v-slot="{row, $index}">
          <span
            class="exchanges__diff"
            :class="{
              match: isEq(row.price, bestDexPrice),
              empty: isEq(row.price,0)
            }"
          >
            {{ formatDiff(row, $index) }}
          </span>
        </template>
      </NouTableCol>
    </NouTable>
    <NouTable v-if="!classic" :data="cexList" :loading="isLoading" @clickRow="selectExchange">
      <NouTableCol label="Cex">
        <template v-slot="{row}">
          <div class="exchanges__logo__wrapper">
            <img class="exchanges__logo" :src="row.logo" alt="">
          </div>
        </template>
      </NouTableCol>
      <NouTableCol label="Last Price" prop="price" :formatter="formatPrice"/>
    </NouTable>
  </div>
</template>

<script>

import getExchangeList from '@/api/exchange';
import NouTable from '@/components/NouTable.vue';
import NouTableCol from '@/components/NouTableCol';
import { Configs, ExchangeType } from '@/utils/enum';
import { formatPercent, formatPrice } from '@/utils/format';
import {
  getMinus, getPercent, isEq, isGt,
} from '@/utils/number';

export default {
  name: 'Exchanges',
  components: {
    NouTableCol,
    NouTable,
  },
  props: {
    value: { // sync
      type: Object,
      require: false,
    },
    classic: { // sync
      type: Boolean,
      default: false,
    },
  },
  computed: {
    sortedList() {
      return this.list.concat([])
        .sort((a, b) => (isGt(a.price, b.price) ? -1 : 1));
    },
    dexList() {
      return this.sortedList.filter((item) => item.type === ExchangeType.DEX);
    },
    cexList() {
      return this.sortedList.filter((item) => item.type === ExchangeType.CEX);
    },
    bestDexPrice() {
      return this.dexList[0] ? this.dexList[0].price : '0';
    },
    selectedPair() {
      return this.$store.state.selectedPair;
    },
    selectedFromToken() {
      return this.$store.state.selectedFromToken;
    },
    selectedToToken() {
      return this.$store.state.selectedToToken;
    },
    chain() {
      return this.$store.state.chain;
    },
  },
  data() {
    return {
      list: [],
      isLoading: true,
      timer: null,
      formatPrice,
      isEq,
    };
  },
  methods: {
    async startPull() {
      this.isLoading = this.list.length === 0;
      clearTimeout(this.timer);
      const pair = this.classic ? `${this.selectedFromToken}/${this.selectedToToken}` : this.selectedPair;
      if (!this.chain || !pair) {
        return;
      }
      const result = await getExchangeList(this.chain, pair);
      this.isLoading = false;
      this.list = result;
      if (result.length > 0 && !this.value) {
        this.selectExchange(this.dexList[0] || this.cexList[0]);
      }
      this.timer = setTimeout(() => {
        this.startPull();
      }, Configs.PullDuration);
    },
    selectExchange(target) {
      this.$emit('input', target);
      this.$emit('select', target);
    },
    refreshPull() {
      clearTimeout(this.timer);
      this.startPull();
    },
    formatDiff(exchange, index) {
      if (index === 0) {
        return 'BEST';
      }
      if (exchange.price === this.bestDexPrice) {
        return 'MATCH';
      }
      if (isEq(exchange.price, 0)) {
        return '--';
      }
      const rate = getPercent(getMinus(exchange.price, this.bestDexPrice), this.bestDexPrice);
      return formatPercent(rate);
    },
  },
  mounted() {
    this.startPull();
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
  watch: {
    chain() { // restart timer after change
      this.refreshPull();
    },
    selectedPair() {
      this.refreshPull();
    },
    selectedFromToken() {
      this.refreshPull();
    },
    selectedToToken() {
      this.refreshPull();
    },
  },
};
</script>

<style lang="scss">
.exchanges {
  .common-table__th:first-child {
    color: var(--color-base);
    min-width: .6rem;
    font-family: Poppins-Medium, "PingFang SC", 微软雅黑,
    黑体, Microsoft YaHei, SimHei, "Open Sans", sans-serif;
    font-weight: 400;
  }
}

.exchanges__logo__wrapper {
  width: .4rem;
  height: .4rem;
  border-radius: 50%;
  overflow: hidden;
  background: #fff;
}

.exchanges__logo {
  display: block;
  height: 100%;
}

.exchanges__diff {
  color: var(--red);

  &.match {
    color: var(--green);
  }

  &.empty {
    color: var(--color-des);
  }
}
</style>
