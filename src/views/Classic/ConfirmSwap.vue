<template>
  <div class="confirm-swap g-child-mt">
    <Field label="From" view>{{ `${formatAmount(fromAmount)} ${fromToken}` }}</Field>
    <Field label="To" view>{{ `${formatAmount(toAmount)} ${toToken}` }}</Field>
    <Field label="Rate" view>{{ `1 ${fromToken} = ${formatAmount(rate)} ${toToken}` }}</Field>
    <Field label="Price Tolerance" view>{{ `${slippage} %` }}</Field>
    <Field v-if="percent" label="Estimated Exchange Gain/Loss" view>
      <span :class="{red:percent<0}">{{ `${percent} %` }}</span>
    </Field>
    <div class="tip__wrapper">
      <div class="tip">{{ tip }}</div>
    </div>
    <CommonButton label="Confirm Swap" @click="$emit('confirm')" :loading="loading" />
  </div>
</template>

<script>

import CommonButton from '@/components/CommonButton.vue';
import Field from '@/components/Field.vue';
import { formatUsdt } from '@/utils/format';
import { getDiv } from '@/utils/number';

export default {
  name: 'ConfirmSwap',
  components: {
    CommonButton,
    Field,
  },
  props: {
    fromToken: {
      type: String,
      require: true,
    },
    fromAmount: {
      type: String,
      require: true,
    },
    toToken: {
      type: String,
      require: true,
    },
    toAmount: {
      type: String,
      require: true,
    },
    slippage: {
      type: String,
      require: true,
    },
    percent: {
      type: Number,
      require: false,
    },
    loading: {
      type: Boolean,
      require: true,
    },
  },
  computed: {
    rate() {
      return getDiv(this.toAmount, this.fromAmount);
    },
    tip() {
      const amount = this.formatAmount(this.toAmount);
      return `Output is estimated. You will receive at least ${amount} ${this.toToken} or the transaction will revert.`;
    },
  },
  methods: {
    formatAmount(val) {
      return formatUsdt(val);
    },
  },
};
</script>

<style lang="scss" scoped>
.confirm-swap {
}

.title {
  margin: 0;
  padding: 0;
  font-size: .36rem;
  line-height: .55rem;
}

.tip__wrapper {
  padding: .1rem 0; // total 30 space
}

.tip {
  padding: var(--space-common-sm);
  border-radius: var(--radius-common);
  background: var(--background-classic-tip);
  font-size: .22rem;
  line-height: .4rem;
  color: var(--color-des);
}
.field__content {
  .red {
    color: var(--red);
  }
}
</style>
