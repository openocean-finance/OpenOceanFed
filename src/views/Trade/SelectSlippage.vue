<template>
  <div class="select-slippage">
    <h3 class="select-slippage__title g-font-semi">Price Tolerance</h3>
    <Tab v-model="selectedSlippage">
      <TabItem label="0.5%" name="0.5"/>
      <TabItem label="1%" name="1"/>
      <TabItem label="3%" name="3"/>
    </Tab>
    <CommonButton label="Confirm" @click="submit" />
  </div>
</template>

<script>

import CommonButton from '@/components/CommonButton.vue';
import Tab from '@/components/Tab.vue';
import TabItem from '@/components/TabItem.vue';

export default {
  name: 'SelectSlippage',
  components: {
    CommonButton,
    TabItem,
    Tab,
  },
  props: {
    slippage: {
      type: String,
      require: true,
    },
  },
  data() {
    return {
      selectedSlippage: this.slippage,
    };
  },
  methods: {
    submit() {
      window.localStorage.setItem('tolerance', this.selectedSlippage);
      this.$emit('select', this.selectedSlippage);
    },
  },
};
</script>

<style lang="scss" scoped>
.select-slippage {
  padding: .4rem var(--space-common);

  & > *:not(:first-child) {
    margin-top: .4rem;
  }
}

.select-slippage__title {
  margin: 0;
  padding: 0;
  font-size: .36rem;
  line-height: .55rem;
}
</style>
