<template>
  <div>
    <div class="label">
      <div class="g-font-mid">{{ label }}</div>
      <div class="label__balance">{{ `Balance: ${balance} ${tokenSymbol}` }}</div>
    </div>
    <div class="card" :class="{'card--focus':isFocus}">
      <div class="card__line card__line--header">
        <div class="card__line__name">{{ tokenName || '--' }}</div>
        <div class="card__line--right">{{ usdtValue || '--' }}
          <span v-if="percent"
          :class="percent<0?'red':'blue'">
            {{`(${percent}%)`}}
          </span>
        </div>
      </div>
      <div class="card__line g-font-mid">
        <div>{{ tokenSymbol || '--' }}</div>
        <CommonButton v-if="input" class="card__line__max" label="MAX" @click="useMaxAmount">
          <div class="card__line__max__label">
            <span>MAX</span>
          </div>
        </CommonButton>
        <div class="card__line--right">
          <input
            class="g-clear-input card__line__input"
            v-if="input"
            type="text"
            :placeholder="isFocus?'':'0'"
            :value="value"
            @input="inputHandler"
            @focus="isFocus=true"
            @blur="isFocus=false"
          >
          <slot/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import CommonButton from '@/components/CommonButton.vue';
import { Chains } from '@/utils/enum';
import getTokenPrice from '@/api/tokenPrice';
import { getTimes } from '@/utils/number';
import store from '@/store';

export default {
  name: 'TransferField',
  components: { CommonButton },
  props: {
    label: {
      type: String,
      require: true,
    },
    balance: {
      type: String,
      require: true,
    },
    tokenName: {
      type: String,
      require: true,
    },
    tokenSymbol: {
      type: String,
      require: true,
    },
    tokenContract: {
      type: String,
      require: true,
    },
    input: {
      type: Boolean,
      require: false,
      default: false,
    },
    value: {
      type: String,
      require: false,
      default: '',
    },
    chain: {
      type: String,
      require: true,
    },
    percent: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    usdtValue() {
      return this.tokenPrice ? `≈ $${Number(getTimes(this.tokenPrice, this.value || 0)).toLocaleString()}` : '';
    },
  },
  data() {
    return {
      isFocus: false,
      tokenPrice: '',
    };
  },
  methods: {
    useMaxAmount() {
      this.$emit('max');
    },
    inputHandler(e) {
      const val = e.target.value.replace(/[^\d.]/g, '')
        .replace(/(\..*)\./g, '$1');
      e.target.value = val;
      this.$emit('input', val);
      this.$emit('change', val);
    },
    async getTokenPrice() {
      if ((this.chain === Chains.ETH || this.chain === Chains.BSC) && this.tokenContract) {
        // eslint-disable-next-line no-console
        console.log('getTokenPrice', this.chain);
        const addr = this.tokenContract.toLowerCase();
        const res = await getTokenPrice(addr, this.chain === Chains.BSC ? 'bsc/' : '');
        const { usd } = res[addr] || {};
        this.tokenPrice = usd || 0;
        if (this.label === 'From') {
          store.commit('SET_FROM_TOKEN_PRICE', this.tokenPrice);
        } else {
          store.commit('SET_TO_TOKEN_PRICE', this.tokenPrice);
        }
      }
    },
  },
  watch: {
    chain() {
      this.getTokenPrice();
    },
    tokenContract() {
      this.getTokenPrice();
    },
  },
  mounted() {
    this.getTokenPrice();
  },
};
</script>

<style lang="scss" scoped>
.label {
  display: flex;
  font-size: .24rem;
  line-height: .35rem;
}

.label__balance {
  margin-left: auto;
  font-size: .2rem;
  color: var(--color-des);
}

.card {
  box-sizing: border-box;
  margin-top: .2rem;
  border-radius: var(--radius-common);
  background-color: var(--background);
  padding: .2rem;
  transition: border-color .3s;
  border: 2px solid transparent;
}

.card--focus {
  border-color: var(--blue);
}

.card__line {
  display: flex;
  align-items: center;
  font-size: .24rem;
  line-height: .35rem;
}

.card__line--header {
  margin-bottom: .1rem;
  color: var(--color-content);
  font-size: .22rem;
  line-height: .33rem;
}

.card__line__name {
  max-width: 0.7rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card__line--right {
  margin-left: auto;
  text-align: right;
  white-space: nowrap;

  .red{
    color: var(--red);
  }
}

.card__line__max {
  margin-left: .2rem;
  position: relative;
  border-radius: .05rem;
  margin-right: .1rem;
  width: 1rem;
  height: .28rem;
  line-height: .28rem;
  overflow: hidden;
}

.card__line__max__label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  span {
    font-size: .32rem;
    display: block;
    transform: scale(.5);
    transform-origin: center;
  }
}

.card__line__input {
  width: 100%;
  font-size: .24rem;
  color: inherit;
  font-weight: inherit;
  text-align: right;
  background: transparent;
  height: .33rem;
  line-height: .33rem;
  padding: 0!important;

  &::placeholder {
    color: var(--color-content);
  }
}
</style>
