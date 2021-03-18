<template>
  <button
    class="common-button g-font-mid"
    :class="`common-button--${type}${status ? ` common-button--${status}` : ''}`"
    :aria-disabled="disable"
    tabIndex="0"
    :aria-label="label"
    @click="emitClick"
  >
    <slot>{{ label }}</slot>
    <Loading class="common-button__loading" v-if="loading"/>
  </button>
</template>

<script>

import Loading from '@/components/Loading.vue';

export default {
  name: 'CommonButton',
  components: { Loading },
  props: {
    type: {
      type: String,
      require: false,
      default: 'primary',
      validator(val) {
        return ['', 'primary', 'default'].includes(val);
      },
    },
    status: {
      type: String,
      require: false,
      default: '',
      validator(val) {
        return ['', 'danger'].includes(val);
      },
    },
    label: {
      type: String,
      require: false,
    },
    disable: {
      type: Boolean,
      require: false,
      default: false,
    },
    loading: {
      type: Boolean,
      require: false,
      default: false,
    },
  },
  methods: {
    emitClick(e) {
      if (this.disable || this.loading) {
        return;
      }
      this.$emit('click', e);
    },
  },
};
</script>

<style lang="scss">
.common-button {
  box-sizing: border-box;
  display: block;
  width: 100%;
  border: none;
  outline: none;
  margin: 0;
  padding: 0;
  background: transparent;
  transition: opacity .3s;
}

.common-button--primary {
  height: .66rem;
  line-height: .66rem;
  font-size: .24rem;
  background: var(--background-btn);
  color: var(--color-btn);
  border-radius: var(--radius-common);
  transition: all .3s;
}

.common-button--danger {
  background: var(--red);
}

.common-button__loading {
  margin-left: .2rem;
}
</style>
