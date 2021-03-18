<template>
  <div class="advance-settings">
    <FoldLabel label="Price Tolerance" :content="`${slippage}%`">
      <SlippageSelect v-model="slippage" inline/>
    </FoldLabel>
    <FoldLabel label="Gas Price" :content="`${gasPrice} GWEI`">
      <SlippageSelect v-model="gasPrice" :options="gasPriceOptions"/>
    </FoldLabel>
    <FoldLabel label="Spread Across DEXes" :content="`${selectedDex.length} Selected`">
      <div class="advance-settings__dex">
        <div v-for="item in dexOptions" :key="item">
          <CommonSwitch :value="selectedDex.includes(item)" @input="switchDex(item)"/>
          <span class="advance-settings__dex__label">{{ item }}</span>
        </div>
      </div>
    </FoldLabel>
  </div>
</template>

<script>

import FoldLabel from '@/views/Classic/AdvanceSettings/FoldLabel.vue';
import SlippageSelect from '@/views/Classic/AdvanceSettings/SlippageSelect.vue';
import CommonSwitch from '@/components/CommonSwitch.vue';

export default {
  name: 'AdvanceSettings',
  components: {
    CommonSwitch,
    SlippageSelect,
    FoldLabel,
  },
  data() {
    return {
      slippage: '1',
      gasPrice: '134.10',
      gasPriceOptions: [
        {
          label: '114.20\nStandard',
          value: '114.20',
        },
        {
          label: '134.10\nFast',
          value: '134.10',
        },
        {
          label: '176.00\nInstant',
          value: '176.00',
        },
      ],
      selectedDex: [],
      dexOptions: ['Uniswao 1', 'Uniswao 2', 'Uniswao 3', 'Uniswao 4', 'Uniswao 5', 'Uniswao 6'],
    };
  },
  methods: {
    switchDex(item) {
      const existIndex = this.selectedDex.indexOf(item);
      if (existIndex > -1) {
        this.selectedDex.splice(existIndex, 1);
      } else {
        this.selectedDex.push(item);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.advance-settings {
  padding-top: 0;
}

.advance-settings__dex {
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: .3rem;
  font-size: 0;
}

.advance-settings__dex__label {
  margin-left: .4rem;
  vertical-align: middle;
  font-size: .24rem;
  line-height: .4rem;
}
</style>
