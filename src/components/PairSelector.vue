<template>
  <div>
    <SelectView
      :value="$store.state.selectedPair"
      @input="changePair"
      :pair="$store.state.selectedPair"
      @action="showSelectPair"
    />
    <BlurMask :visible.sync="isSelectPairShowing" title="Market">
      <SelectPair @select="isSelectPairShowing=false"/>
    </BlurMask>
  </div>
</template>

<script>

import SelectView from '@/components/SelectView.vue';
import { savePair } from '@/utils/cache';
import SelectPair from '@/views/Trade/SelectPair.vue';
import BlurMask from '@/components/BlurMask.vue';

export default {
  name: 'PairSelector',
  components: {
    BlurMask,
    SelectPair,
    SelectView,
  },
  data() {
    return {
      isSelectPairShowing: false,
    };
  },
  methods: {
    showSelectPair() {
      this.isSelectPairShowing = true;
    },
    changePair(pair) {
      const target = this.$store.state.pairList.find((item) => item.pairCode === pair);
      if (target) {
        this.$store.commit('SET_SELECTED_PAIR', pair);
        this.$store.commit('SET_SELECTED_PAIR_CHANGE', target.priceChangePercent);
        savePair(pair, this.$store.state.chain);
      }
    },
  },
};
</script>
