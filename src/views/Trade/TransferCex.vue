<template>
  <div class="g-child-mt">
    <Radio v-model="selectedType" :options="typeOptions" :danger="selectedType===TypeEnum.sell"/>
    <Field label="Exchange">Binance</Field>
    <Field label="Price" unit="USDT">Market</Field>
    <Field label="Amount" unit="ETH" input/>
    <CommonButton
      :label="selectedType"
      :status="selectedType===TypeEnum.sell?'danger':''"
      @click="submit"
    />
  </div>
</template>

<script>

import CommonButton from '@/components/CommonButton.vue';
import Radio from '@/components/Radio.vue';
import Field from '@/components/Field.vue';
import toast from '@/components/toast/index';

const TypeEnum = {
  buy: 'Buy',
  sell: 'Sell',
};

export default {
  name: 'TransferCex',
  components: {
    CommonButton,
    Field,
    Radio,
  },
  data() {
    return {
      selectedType: TypeEnum.buy,
      typeOptions: [
        {
          label: TypeEnum.buy,
          value: TypeEnum.buy,
        },
        {
          label: TypeEnum.sell,
          value: TypeEnum.sell,
        },
      ],
      TypeEnum,
    };
  },
  methods: {
    submit() {
      toast('Coming Soon');
    },
  },
};
</script>

<style lang="scss" scoped>
.gas {
  font-size: .22rem;
  color: var(--color-des);
  line-height: .5rem;
}

.gas__value {
  margin-left: auto;
}
</style>
