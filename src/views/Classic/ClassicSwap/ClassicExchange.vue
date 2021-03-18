<template>
  <div class="classic-exchange">
    <NouTable class="classic-exchange__table" :data="list" v-if="list.length > 0">
      <NouTableCol label="Exchange">
        <template v-slot="{row}">
          <div class="classic-exchange__icon-box"
            :class="{ disabled: row.dexIndex != -1 && !row.checked }">
            <img class="classic-exchange__icon" :src="row.logo" alt="">
          </div>
          <div class="g-font-mid classic-exchange__name"
          :class="{ disabled: row.dexIndex != -1 && !row.checked }">
            {{ row.dexCode }}
          </div>
        </template>
      </NouTableCol>
      <NouTableCol label="Last Price">
        <template v-slot="{row}">
          <div :class="{ disabled: row.dexIndex != -1 && !row.checked }">
            {{ row.swapAmount | formatPrice }}
          </div>
        </template>
      </NouTableCol>
      <NouTableCol label="Diff">
        <template v-slot="{row, $index}">
          <span
            class="classic-exchange__diff"
            :class="{
              match: isEq(row.swapAmount, bestDexPrice) || $index === 0,
              empty: isEq(row.swapAmount,0),
              disabled: row.dexIndex != -1 && !row.checked,
            }"
          >
            {{ formatDiff(row, $index) }}
          </span>
        </template>
      </NouTableCol>
    </NouTable>
  </div>
</template>

<script>
import NouTable from '@/components/NouTable.vue';
import NouTableCol from '@/components/NouTableCol';
import { formatPercent, formatPrice } from '@/utils/format';
import {
  getMinus, getPercent, isEq,
} from '@/utils/number';

export default {
  name: 'Exchanges',
  components: {
    NouTableCol,
    NouTable,
  },
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
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
    dexList() {
      return this.list;
    },
    bestDexPrice() {
      return this.dexList[0] ? this.dexList[0].swapAmount : '0';
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
      isLoading: true,
      timer: null,
      formatPrice,
      isEq,
    };
  },
  methods: {
    formatDiff(exchange, index) {
      if (index === 0) {
        return 'BEST';
      }
      if (exchange.swapAmount === this.bestDexPrice) {
        return 'MATCH';
      }
      if (isEq(exchange.swapAmount, 0)) {
        return '--';
      }
      const rate = getPercent(getMinus(exchange.swapAmount, this.bestDexPrice), this.bestDexPrice);
      return formatPercent(rate);
    },
  },
};
</script>

<style lang="scss">
.classic-exchange {
  padding-top: .4rem;
}

.classic-exchange__icon-box {
  vertical-align: middle;
  display: inline-block;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  background: #fff;
  border-radius: 50%;
  overflow: hidden;
}

.classic-exchange__icon {
  max-width: 80%;
  max-height: 80%;
  vertical-align: middle;
}

.classic-exchange__name {
  vertical-align: middle;
  display: inline-block;
  margin-left: 10px;
}

.classic-exchange__diff {
  &.match {
    color: var(--green);
  }

  &.empty {
    color: var(--color-content);
  }
}

.classic-exchange__table {
  th {
    font-size: .22rem;
    line-height: .33rem;
  }
  td {
    padding-top: .3rem;
    font-size: .24rem;
  }
}

.disabled {
  color: var(--color-des) !important;
  text-decoration: line-through;
  img {
      -webkit-filter: grayscale(100%);
      -moz-filter: grayscale(100%);
      -ms-filter: grayscale(100%);
      -o-filter: grayscale(100%);
      filter: grayscale(100%);
      filter: #ccc;
      opacity:0.7;
  }
  span {
      color: var(--color-des) !important;
      text-decoration: line-through;
  }
}
</style>
