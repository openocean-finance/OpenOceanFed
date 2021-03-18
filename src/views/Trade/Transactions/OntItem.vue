<template>
  <div class="c-item">
    <FromTo
      :from-token="fromToken"
      :from-amount="fromAmount"
      :to-amount="toAmount"
      :to-token="toToken"
    />
    <FieldItem label="Height" :content="block" />
    <FieldItem label="Time">
      {{ time | formatDate }}
    </FieldItem>
    <FieldItem label="Hash">
      <a
        class="c-item__link"
        :href="`https://explorer.ont.io/transaction/${hash}`"
        target="_blank"
      >
        {{ hash | formatLongStr(10,10) }}
      </a>
    </FieldItem>
  </div>
</template>

<script>

import FieldItem from '@/views/Trade/Transactions/FieldItem.vue';
import FromTo from '@/views/Trade/Transactions/FromTo.vue';

export default {
  name: 'OntItem',
  components: { FieldItem, FromTo },
  props: ['hash', 'fromToken', 'fromAmount', 'toToken', 'toAmount', 'block', 'time'],
};
</script>

<style lang="scss" scoped>
@import "./common.scss";
</style>
