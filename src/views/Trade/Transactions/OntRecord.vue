<template>
  <ListContainer :length="list.length" :loading="loading">
    <OntItem
      v-for="item in list"
      :key="item.hash"
      :hash="item.hash"
      :from-token="item.fromToken"
      :from-amount="item.fromAmount"
      :to-token="item.toToken"
      :to-amount="item.toAmount"
      :block="item.height"
      :time="item.createTime"
    />
  </ListContainer>
</template>

<script>

import { getOntTransactions } from '@/api/transactions';
import ListContainer from '@/components/ListContainer.vue';
import showToast from '@/components/toast/index';
import { Configs } from '@/utils/enum';
import OntItem from '@/views/Trade/Transactions/OntItem.vue';

export default {
  name: 'OntRecord',
  components: {
    ListContainer,
    OntItem,
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
        this.list = await getOntTransactions(this.address);
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
