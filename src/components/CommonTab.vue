<template>
  <div class="common-tab">
    <ul ref="domList" class="common-tab__list">
      <li
        v-for="item in labels"
        :key="String(item.name)"
        class="common-tab__list__item g-font-semi"
        :class="{'active':item.name===value}"
        @click="select(item.name)"
      >
        <span>{{ item.label }}</span>
      </li>
    </ul>
    <div class="common-tab__content">
      <slot/>
    </div>
  </div>
</template>

<script>

export default {
  name: 'CommonTab',
  props: {
    value: {
      type: [String, Number],
      require: true,
    },
  },
  data() {
    return {
      labels: [],
    };
  },
  methods: {
    getChildrenTabs() {
      return this.$children.filter((item) => item.$options.name === 'CommonTabPanel');
    },
    publicUpdateData() {
      this.labels = this.getChildrenTabs()
        .map((item) => ({
          label: item.label,
          name: item.name,
        }));
      this.updateChildren();
    },
    select(name) {
      if (name === this.value) {
        return;
      }
      this.$emit('input', name);
      this.$emit('change', name);
      this.$nextTick(() => {
        this.updateChildren();
      });
    },
    updateChildren() {
      this.getChildrenTabs()
        .forEach((item) => {
          // eslint-disable-next-line no-param-reassign
          item.isActive = item.name === this.value;
        });
    },
  },
  mounted() {
    this.publicUpdateData();
  },
};
</script>

<style lang="scss">

.common-tab__content {
}

.common-tab__list {
  white-space: nowrap;
  margin: 0;
  padding: 0;
  font-size: 0;
}

.common-tab__list__item {
  display: inline-block;
  margin: 0;
  padding: 0;
  font-size: .32rem;
  line-height: .45rem;
  color: var(--color-des);

  & + & {
    margin-left: .3rem;
  }

  &.active {
    color: var(--color);
  }
}
</style>
