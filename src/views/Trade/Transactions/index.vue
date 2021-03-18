<template>
  <div class="transactions">
    <h2 class="title g-font-semi">Transactions</h2>
    <div class="list">
      <EthRecord v-if="chain === Chains.ETH"/>
      <BscRecord v-else-if="chain === Chains.BSC"/>
      <OntRecord v-else-if="chain===Chains.ONT"/>
    </div>
  </div>
</template>

<script>

import { Chains } from '@/utils/enum';
import BscRecord from '@/views/Trade/Transactions/BscRecord.vue';
import EthRecord from '@/views/Trade/Transactions/EthRecord.vue';
import OntRecord from '@/views/Trade/Transactions/OntRecord.vue';

export default {
  name: 'Transactions',
  components: {
    OntRecord,
    BscRecord,
    EthRecord,
  },
  computed: {
    chain() {
      return this.$store.state.chain;
    },
  },
  data() {
    return {
      Chains,
    };
  },
};
</script>

<style lang="scss" scoped>
.transactions {
  margin-top: var(--space-common);
}

.title {
  margin: 0;
  padding: 0;
  font-size: .32rem;
  line-height: .48rem;
}

.list {
  margin-top: var(--space-common);
}
</style>
