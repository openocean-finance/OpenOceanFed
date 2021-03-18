<template>
  <div class="common-switch" :class="{active:value}" @click="emitSwitch">
    <div class="common-switch__slider">
      <div class="common-switch__slider__dot"/>
    </div>
  </div>
</template>

<script>

export default {
  name: 'CommonSwitch',
  props: {
    value: {
      type: Boolean,
      require: true,
    },
  },
  methods: {
    emitSwitch() {
      this.$emit('input', !this.value);
    },
  },
};
</script>

<style lang="scss">
.common-switch {
  display: inline-block;
  position: relative;
  height: .4rem;
  width: .7rem;
  line-height: .4rem;
  cursor: pointer;
  vertical-align: middle;

  &.active {
    .common-switch__slider {
      background: var(--blue);
    }

    .common-switch__slider__dot {
      left: calc(100% - .4rem + 1px);
    }
  }
}

.common-switch__slider {
  width: 100%;
  height: .3rem;
  display: inline-block;
  vertical-align: middle;
  background: var(--background-lighter);
  border-radius: .4rem;
  transition: background-color .3s;
}

.common-switch__slider__dot {
  position: absolute;
  top: 0;
  left: -1px;
  width: .4rem;
  height: .4rem;
  background: var(--color-base);
  border-radius: 50%;
  transition: all .3s;
}
</style>
