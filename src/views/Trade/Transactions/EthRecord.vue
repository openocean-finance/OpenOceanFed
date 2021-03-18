<template>
  <ListContainer :length="list.length" :loading="loading">
    <EthItem
      v-for="item in list"
      :key="item.txHash"
      :hash="item.txHash"
      :from-token="item.inToken"
      :from-amount="item.inAmount"
      :to-token="item.outToken"
      :to-amount="item.outAmount"
      :block="item.block"
    />
  </ListContainer>
</template>

<script>

import { getEthTransactions } from '@/api/transactions';
import ListContainer from '@/components/ListContainer.vue';
import showToast from '@/components/toast/index';
import { Configs } from '@/utils/enum';
import EthItem from '@/views/Trade/Transactions/EthItem.vue';

export default {
  name: 'EthRecord',
  components: {
    EthItem,
    ListContainer,
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
        this.list = await getEthTransactions(this.address);
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

<style lang="scss" scoped>
.eth-table__hash {
  text-decoration: underline;
}
</style>
