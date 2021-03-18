<template>
  <div class="select-view">
    <template v-if="selectedPair.length">
      <div class="select-view__clickable">
        <span class="select-view__label g-font-semi">{{ selectedPair }}</span>
      </div>
      <div class="select-view__icon__wrapper last" @click="switchPair">
        <i class="iconfont iconChange select-view__switch"/>
      </div>
      <i class="iconfont iconDark g-light-only pair__wrapper__theme" @click="switchTheme"/>
      <i class="iconfont iconLight g-dark-only pair__wrapper__theme" @click="switchTheme"/>
    </template>
    <LoadingGrid class="select-view__loading" v-else/>
  </div>
</template>

<script>
import { changeTheme } from '@/utils/theme';
import LoadingGrid from '@/components/LoadingGrid.vue';
import { mapState } from 'vuex';
import { saveToken } from '@/utils/cache';

export default {
  name: 'SelectView',
  components: { LoadingGrid },
  props: {
    value: {
      type: String,
      require: true,
    },
  },
  computed: {
    ...mapState({
      from: (state) => state.selectedFromToken,
      to: (state) => state.selectedToToken,
    }),
    selectedPair() {
      return this.from && this.to ? `${this.from}/${this.to}` : '';
    },
  },
  methods: {
    switchPair() {
      const toToken = this.to;
      const fromToken = this.from;
      this.$store.commit('SET_SELECTED_TO_TOKEN', fromToken);
      saveToken(fromToken, this.$store.state.chain, 'to');
      this.$store.commit('SET_SELECTED_FROM_TOKEN', toToken);
      saveToken(toToken, this.$store.state.chain, 'from');
    },
    switchTheme() {
      changeTheme();
    },
  },
};
</script>

<style lang="scss">
.select-view {
  height: .45rem;
  line-height: .45rem;
  font-size: 0;
  display: flex;
  align-items: center;
}

.select-view__label {
  vertical-align: middle;
  font-size: .32rem;
  color: var(--color-base);

  & + & {
    margin-left: var(--space-common-sm);
  }
}

.select-view__clickable {
  display: flex;
}

.select-view__icon__wrapper {
  padding: 0 .2rem;

  &.first {
    padding-left: 0;
  }

  &.last {
    margin-left: auto;
    padding-right: 0;
  }
}

.select-view__switch {
  height: .26rem;
  vertical-align: middle;
}

.select-view__triangle {
  vertical-align: middle;
  height: .24rem;
}

.select-view__loading {
  height: 100%;
  width: 100%;
}
.pair__wrapper__theme {
  margin-left: var(--space-common);
}
</style>
