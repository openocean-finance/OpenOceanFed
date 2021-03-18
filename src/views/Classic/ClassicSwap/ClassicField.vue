<template>
  <div class="classic-field">
    <div class="balance">Balance:{{ balance | formatBalance }}</div>
    <h3 class="title g-font-mid">{{ type }}</h3>
    <div class="card" :class="{'card--focus':isFocus}">
      <img v-if="token.address" class="icon" :src="token.icon" alt="">
      <div v-else class="icon-box"/>
      <div class="select">
        <div class="t-label left" :class="{max:type==='From'}">{{ token.name }}</div>
        <div class="select__content" @click="emitShowSelect">
          <span class="t-value g-font-mid">{{ token.symbol || '--' }}</span>
          <i class="iconfont iconDropdown select__icon"/>
        </div>
      </div>
      <CommonButton v-if="type==='From'" class="max-btn" @click="setMax">
        <span class="max-btn__max">MAX</span>
      </CommonButton>
      <div class="content">
        <div class="t-label right">{{ usdtValue || '--' }}
          <span v-if="type==='To' && percent"
          :class="percent<0?'red':'blue'">
            {{`(${percent}%)`}}
          </span>
        </div>
        <input
          class="content__input t-value g-font-mid"
          v-bind:value="value"
          v-on:input="$emit('input', $event.target.value)"
          type="text"
          :placeholder="isFocus?'':'0'"
          @focus="isFocus=true"
          @blur="isFocus=false"
          v-if="type==='From'"
        />
        <input
          v-else
          class="content__input t-value g-font-mid"
          v-bind:value="formatUsdt(value)"
          type="text"
          placeholder="0"
          readonly="readonly"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import CommonButton from '@/components/CommonButton.vue';
import { Chains } from '@/utils/enum';
import { formatUsdt } from '@/utils/format';
import getTokenPrice from '@/api/tokenPrice';
import store from '@/store';

export default {
  name: 'ClassicField',
  components: { CommonButton },
  props: {
    type: {
      type: String,
      require: true,
    },
    value: {
      type: String,
    },
    symbol: {
      type: String,
      default: '',
    },
    balance: {
      type: String,
      default: '',
    },
    percent: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      isFocus: false,
      tokenPrice: '',
    };
  },
  computed: {
    ...mapState({
      tokenList: (state) => state.tokenList,
      chain: (state) => state.chain,
    }),
    token() {
      if (!this.tokenList || !this.symbol) return {};
      const temp = this.tokenList
        .find((item) => item.symbol.toUpperCase() === this.symbol.toUpperCase());
      temp.icon = `https://ethapi.openocean.finance/logos/${this.chainPath}/${this.toLowerCase(temp.address)}.png`;
      return temp;
    },
    chainPath() {
      return this.$store.state.chain === Chains.BSC ? 'bsc' : '';
    },
    usdtValue() {
      return this.tokenPrice ? `≈ $${Number(this.tokenPrice * this.value).toLocaleString()}` : '';
    },
  },
  watch: {
    symbol() {
      this.getTokenPrice();
    },
    chain() {
      this.getTokenPrice();
    },
  },
  mounted() {
    this.getTokenPrice();
  },
  methods: {
    async getTokenPrice() {
      const { address } = this.token || {};
      if ((this.chain === Chains.ETH || this.chain === Chains.BSC) && address) {
        // eslint-disable-next-line no-console
        console.log('getTokenPrice', this.chain);
        const addr = address.toLowerCase();
        const res = await getTokenPrice(addr, this.chain === Chains.BSC ? 'bsc/' : '');
        const { usd } = res[addr] || {};
        this.tokenPrice = usd || 0;
        if (this.type === 'From') {
          store.commit('SET_FROM_TOKEN_PRICE', this.tokenPrice);
        } else {
          store.commit('SET_TO_TOKEN_PRICE', this.tokenPrice);
        }
      }
    },
    formatUsdt(val) {
      return val ? formatUsdt(val) : '';
    },
    toLowerCase(val, flag) {
      if (flag) {
        return val && val.toLowerCase();
      }
      return this.$store.state.chain === 'tron' || this.$store.state.chain === 'ont' ? val : val && val.toLowerCase();
    },
    setMax() {
      this.$emit('setMax', this.type);
    },
    updateVal(val) {
      this.$emit('input', val);
    },
    emitShowSelect() {
      this.$emit('showSelect', this.name);
    },
  },
};
</script>

<style lang="scss" scoped>
.classic-field {
  text-align: left;
  font-size: 0;
}

.title {
  margin: 0;
  padding: 0;
  font-size: .22rem;
  line-height: .33rem;
}

.balance {
  float: right;
  font-size: .22rem;
  line-height: .33rem;
  color: var(--color-content);
}

.card {
  margin-top: .2rem;
  display: flex;
  align-items: center;
  padding: .2rem .3rem;
  height: .7rem; // keep save height
  border-radius: .06rem;
  background: var(--background-classic-card);
  transition: border-color .3s;
  border: 2px solid transparent;
}

.card--focus {
  border-color: var(--blue);
}

.icon {
  width: .5rem;
  height: .5rem;
  background: var(--color-des);
  border-radius: 50%;
}

.icon-box {
  width: .5rem;
  height: .5rem;
  background: var(--color-des);
  border-radius: 50%;
}

.select {
  margin-left: .2rem;
}

.t-label {
  color: var(--color-content);
  font-size: .22rem;
  line-height: .33rem;
  //transform: scale(0.833);
  //transform-origin: left;

  &.left {
    max-width: 1.7rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &.max {
    max-width: 90px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
  }

  &.right {
    transform-origin: right;
    white-space: nowrap;
  }

  .red{
    color: var(--red);
  }
}

.t-value {
  font-size: .28rem;
  line-height: .42rem;
}

.select__content {
  cursor: pointer;
}

.select__icon {
  margin-left: .1rem;
  display: inline-block;
  font-size: .24rem;
  transform: scale(0.417);
  transform-origin: left;
}

.max-btn {
  margin-left: .2rem;
  display: inline-block;
  width: auto;
  height: auto;
  padding: 0.05rem .12rem;
  font-size: .18rem;
  line-height: .27rem;
  border-radius: 1px;
}

.max-btn__max {
  display: inline-block;
  //transform: scale(0.833);
}

.content {
  flex: 1;
  margin-left: .2rem;
  text-align: right;
}

.content__input {
  margin: 0;
  padding: 0;
  height: .42rem; // for safari
  color: inherit;
  outline: none;
  background: transparent;
  border: none;
  text-align: right;
  width: 100%;

  &::placeholder {
    color: var(--color-lighter);
  }
}
</style>

<style lang="scss">
.classic-field {
  .classic-field__select-token {
    padding: 0;
    width: 420px;
  }
}
</style>
