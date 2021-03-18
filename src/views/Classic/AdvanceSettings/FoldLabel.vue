<template>
  <div class="fold-label__wrapper">
    <div class="fold-label g-font-mid" @click="isUnfold=!isUnfold">
      <div class="fold-label__label">{{ label }}</div>
      <div class="fold-label__content">
        <slot name="content">{{ content }}</slot>
      </div>
      <i class="iconfont iconDropdown fold-label__icon"/>
    </div>
    <NouFoldTransition>
      <div v-if="isUnfold" class="fold-label__fold">
        <div class="fold-label__fold__container">
          <slot/>
        </div>
      </div>
    </NouFoldTransition>
  </div>
</template>

<script>

import NouFoldTransition from '@/components/FoldTransition';

export default {
  name: 'FoldLabel',
  components: { NouFoldTransition },
  props: {
    label: {
      type: String,
      require: true,
    },
    content: {
      type: String,
      require: false,
    },
  },
  data() {
    return {
      isUnfold: false,
    };
  },
};
</script>

<style lang="scss">
.fold-label__wrapper {
  & + & {
    margin-top: .4rem;
  }
}

.fold-label {
  display: flex;
  font-size: .24rem;
  line-height: .36rem;
  cursor: pointer;
}

.fold-label__label {
  color: var(--color-content);
}

.fold-label__content {
  margin-left: auto;
}

.fold-label__icon {
  margin-left: .2rem;
  font-size: .24rem;
  transform: scale(.4);
  transform-origin: right;
}

.fold-label__fold__container {
  padding-top: .3rem;
}
</style>
