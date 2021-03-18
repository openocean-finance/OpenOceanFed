<template>
  <div class="select-token">
    <div class="top">
      <h3 class="top__title g-font-semi">Token</h3>
      <SearchInput class="top__search" v-model="query" placeholder="Search"/>
    </div>
    <div class="scroll" id="action-sheet-scroll">
      <NouTable class="scroll__table" :data="queryList" @clickRow="selectToken">
        <NouTableCol>
          <template v-slot="{row}">
            <img class="nou-table__cell__img" :src="'https://ethapi.openocean.finance/logos/'+chainPath+'/'+toLowerCase(row.address)+'.png'" />
          </template>
        </NouTableCol>
        <NouTableCol>
          <template v-slot="{row}">
            <span class="nou-table__cell__symbol" >{{ row.symbol }}</span>
          </template>
        </NouTableCol>
        <NouTableCol>
          <template v-slot="{row}">
            <span class="nou-table__cell__name" >{{ row.name }}</span>
          </template>
        </NouTableCol>
      </NouTable>
    </div>
  </div>
</template>

<script>
import NouTable from '@/components/NouTable.vue';
import NouTableCol from '@/components/NouTableCol';
import SearchInput from '@/components/SearchInput.vue';
import { saveToken } from '@/utils/cache';
import { MapChainPath } from '@/utils/enum';

export default {
  name: 'selectToken',
  components: {
    NouTableCol,
    NouTable,
    SearchInput,
  },
  props: {
    direction: {
      type: String,
      default: '',
    },
  },
  computed: {
    tokenList() {
      return this.$store.state.tokenList;
    },
    queryList() {
      if (!this.query) {
        return this.tokenList;
      }
      return this.tokenList.filter((item) => item.symbol.indexOf(this.query.toUpperCase()) > -1);
    },
    chainPath() {
      return this.$store.state.chain === Chains.BSC ? 'bsc' : '';
    },
  },
  data() {
    return {
      query: '',
      pullTimer: null,
    };
  },
  methods: {
    toLowerCase(val) {
      return val.toLowerCase();
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

<style lang="scss" scoped>
.select-token {
  padding: 0 var(--space-common);
  padding-right: 0; // move scroll bar
  padding-bottom: .4rem;
  height: 70vh;
  display: flex;
  flex-direction: column;
}

.top {
  padding-top: .4rem;
  padding-bottom: .3rem;
  padding-right: var(--space-common);
}

.top__title {
  margin: 0;
  padding: 0;
  font-size: .36rem;
  line-height: .55rem;
}

.top__search {
  margin-top: var(--space-common);
}

.scroll {
  flex: 1;
  min-height: 0;
  overflow: auto;
}

.scroll__table {
  line-height: .76rem;
  padding-right: var(--space-common);
}
</style>

<style lang="scss">
.select-token {
  .common-table__td {
    padding-top: 0;
    font-size: .26rem;
    .nou-table__cell {
      display: flex;
      align-items: center;
    }
    .nou-table__cell__img {
      width: 0.4rem;
    }
    .nou-table__cell__symbol {
      margin: 0 0.1rem 0 0.5rem;
    }
    .nou-table__cell__name {
      color: var(--color-des);
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      max-width: 3.5rem;
    }
  }
}
</style>
