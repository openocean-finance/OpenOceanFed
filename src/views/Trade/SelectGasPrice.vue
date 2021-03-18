<template>
  <div class="select-gasprice">
    <h3 class="select-gasprice__title g-font-semi">GasPrice</h3>
    <Tab v-model="selectedGasPrice">
      <TabItem v-for="(item, i) in gasPriceList" :key="i" :label="item.label" :name="item.value"/>
    </Tab>
    <CommonButton label="Confirm" @click="submit" />
  </div>
</template>

<script>

import CommonButton from '@/components/CommonButton.vue';
import Tab from '@/components/Tab.vue';
import TabItem from '@/components/TabItem.vue';

export default {
  name: 'SelectedGasPrice',
  components: {
    CommonButton,
    TabItem,
    Tab,
  },
  props: {
    gasPriceList: {
      type: Array,
      default() {
        return [];
      },
    },
    gasPrice: {
      type: Number,
      require: true,
    },
  },
  data() {
    return {
      selectedGasPrice: this.gasPrice,
    };
  },
  methods: {
    submit() {
      window.localStorage.setItem('gasprice', this.selectedGasPrice);
      this.$emit('select', this.selectedGasPrice);
    },
  },
};
</script>

<style lang="scss" scoped>
.select-gasprice {
  padding: .4rem var(--space-common);

  & > *:not(:first-child) {
    margin-top: .4rem;
  }
}

.select-gasprice__title {
  margin: 0;
  padding: 0;
  font-size: .36rem;
  line-height: .55rem;
}
</style>
