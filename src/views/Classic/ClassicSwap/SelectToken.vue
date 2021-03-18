<template>
  <div class="select-token">
    <h2 class="select-token__title g-font-semi">Select Token</h2>
    <div class="select-token__input">
      <SearchInput v-model="query" placeholder="Search"/>
    </div>
    <ul class="select-token__list" id="js-dialog-scroll-dom">
      <li
        v-for="item in queryList"
        :key="item.name"
        class="select-token__list__item"
        @click="selectToken(item)"
      >
        <img class="select-token__list__item__icon" :src="'https://ethapi.openocean.finance/logos/'+chainPath+'/'+toLowerCase(item.address)+'.png'" alt="">
        <div class="select-token__list__item__name g-font-mid">{{ item.symbol }}</div>
        <div class="select-token__list__item__chain">{{ item.name }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import SearchInput from '@/components/SearchInput.vue';
import { saveToken } from '@/utils/cache';
import { Chains } from '@/utils/enum';

export default {
  name: 'SelectToken',
  components: { SearchInput },
  props: {
    direction: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      query: '',
      pullTimer: null,
    };
  },
  computed: {
    tokenList() {
      return this.$store.state.tokenList;
    },
    queryList() {
      if (!this.query) {
        return this.tokenList;
      }
      // eslint-disable-next-line max-len
      return this.tokenList.filter((item) => item.symbol.toLowerCase().indexOf(this.query.toLowerCase()) > -1);
    },
    chainPath() {
      return this.$store.state.chain === Chains.BSC ? 'bsc' : '';
    },
  },
  methods: {
    toLowerCase(val, flag) {
      if (flag) {
        return val && val.toLowerCase();
      }
      return this.$store.state.chain === 'tron' || this.$store.state.chain === 'ont' ? val : val && val.toLowerCase();
    },
    selectToken(token) {
      if (this.direction === 'from') {
        this.$store.commit('SET_SELECTED_FROM_TOKEN', token.symbol);
      } else {
        this.$store.commit('SET_SELECTED_TO_TOKEN', token.symbol);
      }
      this.$emit('select');
      saveToken(token.symbol, this.$store.state.chain, this.direction);
    },
  },
};
</script>

<style lang="scss">
.select-token {
  height: 70vh;
  display: flex;
  flex-direction: column;
}

.select-token__title {
  margin: 0;
  font-size: .36rem;
  line-height: .42rem;
  padding: .4rem;
}

.select-token__input {
  margin-left: .4rem;
  margin-right: .4rem;

  .search-input__input {
    border-radius: .06rem;
  }
}

.select-token__list {
  margin: .4rem 0;
  padding: 0;
  list-style: none;
  overflow: auto;
}

.select-token__list__item {
  margin: 0;
  padding: .2rem .4rem;
  display: flex;
  align-items: center;

  &:hover {
    background: var(--background-table-hover);
  }
}

.select-token__list__item__icon {
  height: .32rem;
  margin-right: 0.15rem;
  border-radius: 50%;
}

.select-token__list__item__name {
  font-size: .28rem;
  line-height: .4rem;
}

.select-token__list__item__chain {
  margin-left: auto;
  font-size: .24rem;
  line-height: .32rem;
  transform: scale(.833);
  transform-origin: right;
  color: var(--color-content);
}
</style>
