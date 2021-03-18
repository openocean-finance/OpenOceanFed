<template>
  <div class="tab" :class="{'tab--disable':disable}">
    <slot/>
    <div
      class="tab__active"
      :class="{'tab__active--trans': isShowTrans}"
      :style="{left: `${left}px`,width: `${width}px`}"
    />
  </div>
</template>

<script>

export default {
  name: 'Tab',
  props: {
    value: {
      type: [String, Number],
      require: true,
    },
    disable: {
      type: Boolean,
      require: false,
    },
  },
  data() {
    return {
      publicTabs: [],
      left: 0,
      width: 0,
      isShowTrans: false,
    };
  },
  methods: {
    publicEmitChange(item) {
      this.$emit('input', item.name);
      this.$emit('change', item);
    },
    publicSetBar(el) {
      this.left = el.offsetLeft;
      this.width = el.clientWidth;
    },
    updateBar(val) {
      const index = this.publicTabs.findIndex((item) => item.name === val);
      if (index > -1) {
        this.publicSetBar(this.$el.childNodes[index]);
      }
    },
  },
  watch: {
    value(val) {
      this.updateBar(val);
    },
  },
  mounted() {
    if (this.value) {
      this.updateBar(this.value);
      setTimeout(() => { // no transaction when first load
        this.isShowTrans = true;
      });
    }
  },
};
</script>

<style lang="scss">
.tab {
  position: relative;
  box-sizing: border-box;
  display: flex;
  background: var(--background);
  border: 3px solid var(--background);
  height: .65rem;
  line-height: .3rem;
  border-radius: .1rem;
}

.tab__active {
  position: absolute;
  top: 0;
  bottom: 0;
  background: var(--background-base);
  border-radius: .05rem;

  &.tab__active--trans {
    transition: left .3s, width .3s;
  }
}

.tab--disable {
  .tab-item:not(.tab-item--active) {
    color: var(--color-lighter);
  }
}
</style>
