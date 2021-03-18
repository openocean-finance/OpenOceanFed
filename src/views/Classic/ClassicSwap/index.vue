<template>
  <div class="classic-swap">
    <ClassicField type="From" @showSelect="emitShowSelect"/>
    <i class="iconfont iconChange classic-swap__icon"/>
    <ClassicField type="To" @showSelect="emitShowSelect"/>
    <CommonButton class="classic-swap__submit" label="Swap Now" @click="$emit('confirm')"/>
    <div class="classic-swap__set">
      <div>Price Tolerance</div>
      <div class="classic-swap__set__value">{{ tolerance }}</div>
      <div class="classic-swap__set__right">Gas Price</div>
      <div class="classic-swap__set__value">{{ gasPrice }} GWEI</div>
    </div>
  </div>
</template>

<script>

import CommonButton from '@/components/CommonButton.vue';
import ClassicField from '@/views/Classic/ClassicSwap/ClassicField.vue';

export default {
  name: 'ClassicSwap',
  components: {
    CommonButton,
    ClassicField,
  },
  props: {
    fromToken: {
      type: Object,
      require: true,
    },
    toToken: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      tolerance: '1%',
      gasPrice: '121.00',
    };
  },
  methods: {
    emitShowSelect(val) {
      this.$emit('showSelect', val);
    },
  },
};
</script>

<style lang="scss" scoped>
.classic-swap {
  padding-top: .4rem;
  text-align: center;
}

.classic-swap__icon {
  display: inline-block;
  margin: .3rem 0 .2rem;
  font-size: .44rem;
  text-align: center;
  cursor: pointer;
  transition: opacity .3s;
  transform: rotate(90deg);

  &:hover {
    opacity: .8;
  }
}

.classic-swap__submit {
  margin-top: .3rem;
  border-radius: .06rem;
  height: .75rem;
  line-height: .75rem;
  font-size: .24rem;
  background: linear-gradient(to right, #062EF5, #0E5BFB);
}

.classic-swap__set {
  margin-top: .3rem;
  display: flex;
  font-size: .22rem;
  line-height: .33rem;
  color: var(--color-content);
}

.classic-swap__set__value {
  margin-left: .2rem;
  color: var(--color-base);
}

.classic-swap__set__right {
  margin-left: auto;
}
</style>
