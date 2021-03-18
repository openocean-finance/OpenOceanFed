<template>
  <div class="select-view">
    <template v-if="value.length">
      <div class="select-view__clickable" @click="$emit('action')">
        <div class="select-view__icon__wrapper first">
          <i class="iconfont iconList select-view__triangle"/>
        </div>
        <span class="select-view__label g-font-semi">{{ value }}</span>
      </div>
      <div class="select-view__icon__wrapper last" @click="switchPair">
        <i class="iconfont iconChange select-view__switch"/>
      </div>
    </template>
    <LoadingGrid class="select-view__loading" v-else/>
  </div>
</template>

<script>

import LoadingGrid from '@/components/LoadingGrid.vue';

export default {
  name: 'SelectView',
  components: { LoadingGrid },
  props: {
    value: {
      type: String,
      require: true,
    },
    pair: {
      type: String,
      require: true,
    },
    options: {
      type: Array,
      require: false,
      default: () => [],
    },
  },
  computed: {
    pairList() {
      return [this.pair, this.reversePair].sort();
    },
    reversePair() {
      return this.pair ? this.pair.split('/')
        .reverse()
        .join('/') : '';
    },
  },
  methods: {
    select(pair) {
      if (this.value === pair) {
        return;
      }
      this.$emit('input', pair);
      this.$emit('select', pair);
    },
    switchPair() {
      this.select(this.reversePair);
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
  font-size: .26rem;
  vertical-align: middle;
}

.select-view__triangle {
  vertical-align: middle;
  font-size: .24rem;
}

.select-view__loading {
  height: 100%;
  width: 100%;
}
</style>
