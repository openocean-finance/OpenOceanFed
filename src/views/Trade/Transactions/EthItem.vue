<template>
  <div class="c-item">
    <FromTo
      :from-amount="fromAmount"
      :from-token="fromToken"
      :to-amount="toAmount"
      :to-token="toToken"
    />
    <FieldItem label="Height" :content="block"/>
    <FieldItem label="Hash">
      <a :href="explorerUrl" target="_blank">{{ hash | formatLongStr(10,10) }}</a>
    </FieldItem>
  </div>
</template>

<script>

import { Chains } from '@/utils/enum';
import FieldItem from '@/views/Trade/Transactions/FieldItem.vue';
import FromTo from '@/views/Trade/Transactions/FromTo.vue';

export default {
  name: 'EthItem',
  components: { FieldItem, FromTo },
  props: ['hash', 'fromToken', 'fromAmount', 'toToken', 'toAmount', 'block'],
  computed: {
    explorerUrl() {
      if (this.$store.state.chain === Chains.ETH) {
        return `https://etherscan.io/tx/${this.hash}`;
      }
      return `https://bscscan.com/tx/${this.hash}`;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./common.scss";
</style>
