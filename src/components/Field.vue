<template>
  <div class="field g-flex" :class="{'field--view':view,'field--focus':isFocus}">
    <div v-if="label" class="field__label">{{ label }}</div>
    <slot name="left"/>
    <div class="field__content">
      <slot/>
      <input
        v-if="input"
        ref="fieldInput"
        class="field__content__input"
        :placeholder="isFocus?'':'0'"
        :value="value"
        @input="inputHandler"
        @focus="isFocus=true"
        @blur="isFocus=false"
      >
    </div>
    <slot name="right"/>
    <div v-if="unit" class="field__unit">{{ unit }}</div>
    <slot name="token"/>
  </div>
</template>

<script>

export default {
  name: 'Field',
  props: {
    label: {
      type: String,
      require: false,
    },
    unit: {
      type: String,
      require: false,
    },
    input: {
      type: Boolean,
      require: false,
      default: false,
    },
    value: {
      type: String,
      require: false,
    },
    view: {
      type: Boolean,
      require: false,
    },
  },
  data() {
    return {
      isFocus: false,
    };
  },
  methods: {
    inputHandler(e) {
      const val = e.target.value.replace(/[^\d.]/g, '')
        .replace(/(\..*)\./g, '$1');
      e.target.value = val;
      this.$emit('input', val);
      this.$emit('change', val);
    },
    focus() {
      const dom = this.$refs.fieldInput;
      if (dom) {
        dom.focus();
      }
    },
  },
};
</script>

<style lang="scss">
.field {
  box-sizing: border-box;
  padding: 0 .2rem;
  height: .66rem;
  border: 2px solid transparent;
  //line-height: .66rem;
  font-size: .24rem;
  background-color: var(--background);
  border-radius: var(--radius-common);
  transition: border-color .3s;

  &.field--view {
    background: none;
    padding: 0;
    height: auto;
    line-height: .38rem;
  }

  &.field--focus {
    border-color: var(--blue);
  }
}

.field__label {
  vertical-align: middle;
  margin-right: .22rem;
  color: var(--color-content);
}

.field__content {
  vertical-align: middle;
  flex: 1;
  text-align: right;
}

.field__content__input {
  vertical-align: middle;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  width: 100%;
  border: none;
  height: 100%;
  text-align: right;
  background: transparent;
  outline: none;
  font-size: inherit;
  font-family: inherit;
  color: inherit;
}

.field__unit {
  vertical-align: middle;
  margin-left: .22rem;
  color: var(--color-base);
}

.field__unit__fixed {
  min-width: 1rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

</style>
