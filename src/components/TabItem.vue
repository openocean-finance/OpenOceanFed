<template>
  <div class="tab-item" :class="{'tab-item--active': active}" @click="select">
    <span class="tab-item__label g-font-mid">{{ label }}</span>
  </div>
</template>

<script>

export default {
  name: 'TabItem',
  props: {
    label: {
      type: String,
      require: true,
    },
    name: {
      type: [String, Number],
      require: true,
    },
  },
  computed: {
    active() {
      return this.$parent.value === this.name;
    },
  },
  methods: {
    setItem() {
      this.$parent.publicTabs.push({
        label: this.label,
        name: this.name,
      });
    },
    select() {
      if (this.$parent.disable) {
        return;
      }
      if (this.active) {
        return;
      }
      this.$parent.publicEmitChange({
        label: this.label,
        name: this.name,
      });
    },
  },
  created() {
    const parent = this.$parent;
    if (!parent || parent.$options.name !== 'Tab') {
      throw new Error('Unexpected parent node');
    }
    this.setItem();
  },
};
</script>

<style lang="scss">
.tab-item {
  flex: 1;
  text-align: center;
  height: 100%;
  display: flex;
  justify-content: center;

  &.tab-item--active {
    color: var(--color-base);
  }
}

.tab-item__label {
  z-index: var(--z-index-tab-label);
  align-self: center;
  font-size: .24rem;
  line-height: .3rem;
}

</style>
