<template>
  <div class="exchanges g-child-mt">
    <NouTable :data="dexList" v-if="dexList.length > 0">
      <NouTableCol label="Exchange" prop="dexCode">
        <template v-slot="{row}">
          <div class="exchanges__logo__wrapper"
            :class="{ disabled: row.dexIndex != -1 && !row.checked }">
            <img class="exchanges__logo" :src="row.logo" alt="">
            <span>{{ row.dexCode}}</span>
          </div>
        </template>
      </NouTableCol>
      <NouTableCol label="Amount">
        <template v-slot="{row}">
          <div class="exchanges__diff"
            :class="{
            empty: isEq(row.swapAmount, 0),
            disabled: row.dexIndex != -1 && !row.checked
          }">
            {{ row.swapAmount | formatPrice }}
          </div>
        </template>
      </NouTableCol>
      <NouTableCol label="Diff">
        <template v-slot="{row, $index}">
          <span
            class="exchanges__diff"
            :class="{
              match: isEq(row.swapAmount, bestDexPrice),
              empty: isEq(row.swapAmount,0),
              disabled: row.dexIndex != -1 && !row.checked,
            }"
          >
            {{ formatDiff(row, $index) }}
          </span>
        </template>
      </NouTableCol>
    </NouTable>
    <EmptyView v-else />
  </div>
</template>

<script>
import EmptyView from '@/components/EmptyView.vue';
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
    EmptyView,
  },
  props: {
    dexes: {
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
      return this.dexes || [];
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
      list: [],
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
.exchanges {
  .common-table__th:first-child {
    color: var(--color-base);
    min-width: .6rem;
  }
}

.exchanges__logo__wrapper {
  height: 0.4rem;
  display: flex;
  align-items: center;
}

.exchanges__logo {
  max-width: 0.4rem;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 5px;
  object-fit: contain;
}

.exchanges__diff {
  color: var(--red);

  &.match {
    color: var(--green)
  }

  &.empty {
    color: var(--color-des);
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
