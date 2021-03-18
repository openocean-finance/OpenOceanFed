<template>
  <ul class="radio">
    <li
      class="radio__item g-font-mid"
      :class="{'radio__item--active': value === item.value, 'radio__item--danger': danger}"
      v-for="item in options"
      :key="item.value"
      @click="select(item)"
    >
      {{ item.label }}
    </li>
  </ul>
</template>

<script>

export default {
  name: 'Radio',
  props: {
    value: {
      type: [String, Number],
      require: true,
    },
    options: {
      type: Array,
      require: true,
    },
    danger: {
      type: Boolean,
      require: false,
      default: false,
    },
  },
  methods: {
    select(target) {
      this.$emit('input', target.value);
      this.$emit('change', target);
    },
  },
};
</script>

<style lang="scss" scoped>
.radio {
  margin: 0;
  padding: 0;
  height: .66rem;
  line-height: .66rem;
  list-style: none;
  display: flex;
  border-radius: .1rem;
  background: var(--background);
  overflow: hidden;
}

.radio__item {
  flex: 1;
  font-size: .24rem;
  text-align: center;
  //transition: all .3s;
}

.radio__item--active {
  background: var(--background-btn);
  color: var(--color-btn);

  &.radio__item--danger {
    background: var(--red);
  }
}
</style>
