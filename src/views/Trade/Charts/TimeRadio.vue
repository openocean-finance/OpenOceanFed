<template>
  <div class="time-radio">
    <div
      v-for="item in options"
      :key="item.code"
      class="time-radio__item g-font-mid"
      :class="{'time-radio__item--active':value===item.code}"
      @click="select(item)"
    >
      {{ item.name }}
    </div>
  </div>
</template>

<script>

export default {
  name: 'TimeRadio',
  props: {
    value: {
      type: String,
      require: true,
    },
  },
  data() {
    return {
      options: [
        {
          code: '5m',
          name: '5Min',
        }, {
          code: '15m',
          name: '15Min',
        }, {
          code: '30m',
          name: '30Min',
        }, {
          code: '1h',
          name: '1H',
        }, {
          code: '1d',
          name: '1D',
        },
      ],
    };
  },
  methods: {
    select(target) {
      if (this.value === target.code) {
        return;
      }
      this.$emit('input', target.code);
      this.$emit('select', target.code);
    },
  },
};
</script>

<style lang="scss">
.time-radio {
  margin-top: var(--space-common);
  font-size: 0;
}

.time-radio__item {
  display: inline-block;
  font-size: .22rem;
  line-height: .35rem;
  color: var(--color-des);
  transition: color .3s;

  &.time-radio__item--active {
    color: var(--color-base);
  }

  & + & {
    margin-left: .4rem;
  }
}
</style>
