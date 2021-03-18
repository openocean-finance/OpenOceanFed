<template>
  <div class="g-container classic-transaction">
    <div class="classic-transaction__header">
      <i class="iconfont iconFold classic-transaction__header__close" @click="$emit('close')"/>
      <h2 class="classic-transaction__header__title">Transactions</h2>
    </div>
    <!--  todo classic record  -->
    <EthTransaction v-if="chain === Chains.ETH"/>
    <BscTransaction v-else-if="chain === Chains.BSC"/>
    <OntTransaction v-else-if="chain===Chains.ONT"/>
  </div>
</template>

<script>

import { Chains } from '@/utils/enum';
import BscTransaction from '@/views/Classic/ClassicTransaction/BscTransaction.vue';
import EthTransaction from '@/views/Classic/ClassicTransaction/EthTransaction.vue';
import OntTransaction from '@/views/Classic/ClassicTransaction/OntTransaction.vue';

export default {
  name: 'Transactions',
  components: {
    EthTransaction,
    BscTransaction,
    OntTransaction,
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
.classic-transaction {
  box-sizing: border-box;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.classic-transaction__header {
  line-height: .5rem;
}

.classic-transaction__header__close {
  float: right;
  font-size: .5rem;
}

.classic-transaction__header__title {
  margin: 0;
  padding: 0;
  font-size: .3rem;
  line-height: .46rem;
}
</style>
