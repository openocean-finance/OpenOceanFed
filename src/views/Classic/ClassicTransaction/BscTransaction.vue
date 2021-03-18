<template>
  <div>
    <div v-if="list.length" class="classic-transaction__list">
      <EthItem
        class="classic-transaction__list__item"
        v-for="item in list"
        :key="item.txHash"
        :hash="item.txHash"
        :from-token="item.inToken"
        :from-amount="item.inAmount"
        :to-token="item.outToken"
        :to-amount="item.outAmount"
        :block="item.block"
      />
    </div>
    <div v-else class="classic-transaction__list empty">
      <EmptyView class="classic-transaction__empty"/>
    </div>
  </div>
</template>

<script>

import EmptyView from '@/components/EmptyView.vue';
import EthItem from '@/views/Trade/Transactions/EthItem.vue';
import { getBscTransactions } from '@/api/transactions';
import showToast from '@/components/toast/index';
import { Configs } from '@/utils/enum';

export default {
  name: 'BscRecord',
  components: {
    EmptyView,
    EthItem,
  },
  data() {
    return {
      list: [],
      timer: null,
      loading: false,
    };
  },
  computed: {
    address() {
      return this.$store.state.address;
    },
  },
  methods: {
    async startPullRecord() {
      clearTimeout(this.timer);
      if (!this.address) {
        this.loading = false;
        return;
      }
      try {
        this.list = await getBscTransactions(this.address);
      } catch (e) {
        showToast(e.message);
      }
      this.loading = false;
      this.timer = setTimeout(() => {
        this.startPullRecord();
      }, Configs.PullDuration);
    },
  },
  watch: {
    address: {
      handler() {
        this.list = [];
        this.loading = true;
        this.startPullRecord();
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss">
.classic-transaction__list {
  margin-top: .5rem;
  flex: 1;
  max-height: 85vh;
  min-height: 0;
  margin-left: var(--space-common-negative);
  margin-right: var(--space-common-negative);
  padding-left: var(--space-common);
  padding-right: var(--space-common);
  overflow: auto;

  &.empty {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}

.classic-transaction__list__item {
  background: var(--background-classic-transaction) !important;

  .arrow-box {
    background: var(--background-classic-transaction);
  }
}

.classic-transaction__empty {
  background: transparent;

  .empty-view__icon {
    display: none;
  }

  .empty-view__label {
    font-size: .24rem;
    line-height: .4rem;
    color: var(--color-content);
  }
}
</style>
