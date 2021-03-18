<template>
  <div class="slippage-select g-font-mid" :class="{inline}">
    <ul class="slippage-select__radio">
      <li
        v-for="item in options"
        :key="item.value"
        class="slippage-select__radio__item"
        :class="{active: value==item.value}"
        @click="select(item)"
      >
        {{ item.label }}
      </li>
    </ul>
    <input
      class="g-clear-input slippage-select__custom"
      :value="customSlippage"
      type="number"
      placeholder="Custom"
      @input="inputHandler"
    >
  </div>
</template>

<script>
import { gwei2Gas } from '@/utils/number';

export default {
  name: 'SlippageSelect',
  props: {
    value: {
      type: String,
      require: true,
    },
    options: {
      type: Array,
      require: false,
      default() {
        return [
          {
            label: '0.5%',
            value: '0.5',
          },
          {
            label: '1%',
            value: '1',
          },
          {
            label: '3%',
            value: '3',
          },
        ];
      },
    },
    inline: {
      type: Boolean,
      require: false,
      default: false,
    },
    gas: {
      type: Boolean,
      require: false,
      default: false,
    },
  },
  data() {
    return {
      customSlippage: '',
    };
  },
  methods: {
    select(target) {
      if (target.value === this.value) {
        return;
      }
      this.customSlippage = '';
      this.emitValue(target.value);
    },
    inputHandler(e) {
      const val = e.target.value.replace(/[^\d.]/g, '')
        .replace(/(\..*)\./g, '$1');
      e.target.value = val;
      this.customSlippage = val;
      if (val !== this.value) {
        if (this.gas) {
          this.emitValue(gwei2Gas(val));
        } else {
          this.emitValue(val);
        }
      }
    },
    emitValue(val) {
      this.$emit('input', val);
      this.$emit('change', val);
    },
  },
  mounted() {
    // if (!this.options.find((item) => item.value === this.value)) {
    //   this.customSlippage = this.value;
    // }
  },
};
</script>

<style lang="scss" scoped>
.slippage-select {
  line-height: .6rem;
  font-size: .24rem;
  display: block;

  &.inline {
    display: flex;

    .slippage-select__custom {
      margin-left: .2rem;
      margin-top: 0;
      width: 2.4rem;
    }
  }
}

.slippage-select__radio {
  flex: 1;
  margin: 0;
  padding: 0;
  display: flex;
  list-style: none;
  background: var(--background-classic-btn);
  border-radius: .06rem;
  overflow: hidden;
}

.slippage-select__radio__item {
  flex: 1;
  margin: 0;
  padding: .1rem 0;
  line-height: .4rem;
  text-align: center;
  cursor: pointer;
  transition: background-color .3s, color .3s;
  white-space: pre-wrap;

  &.active {
    background: var(--color-base);
    color: var(--background);
    cursor: default;
  }
}

.slippage-select__custom {
  box-sizing: border-box;
  width: 100%;
  height: .6rem;
  line-height: .6rem;
  margin-top: .2rem;
  padding: 0 .2rem;
  background: var(--background);
  border-radius: .06rem;
  color: inherit;
  text-align: right;
  font-size: inherit;
  font-family: inherit;
  border: 2px solid transparent;
  transition: background-color .3s;
  -webkit-appearance: none;
  outline: none;

  &::placeholder {
    color: var(--color-des);
  }

  &:focus {
    border-color: var(--blue);
  }
}
</style>
