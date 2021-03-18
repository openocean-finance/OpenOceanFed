<template>
  <div class="select-pair">
    <div class="top">
      <SearchInput class="top__search" v-model="query" placeholder="Search"/>
    </div>
    <div class="scroll" id="action-sheet-scroll">
      <NouTable class="scroll__table" :data="queryList" @clickRow="selectPair">
        <NouTableCol label="Pair" prop="pairCode"/>
        <NouTableCol label="Last Price" prop="lastPrice"/>
        <NouTableCol label="Change">
          <template v-slot="{row}">
            <ChangeLabel :change="row.priceChangePercent"/>
          </template>
        </NouTableCol>
      </NouTable>
    </div>
  </div>
</template>

<script>

import ChangeLabel from '@/components/ChangeLabel.vue';
import NouTable from '@/components/NouTable.vue';
import NouTableCol from '@/components/NouTableCol';
import SearchInput from '@/components/SearchInput.vue';
import { savePair } from '@/utils/cache';

export default {
  name: 'SelectPair',
  components: {
    ChangeLabel,
    NouTableCol,
    NouTable,
    SearchInput,
  },
  computed: {
    pairList() {
      return this.$store.state.pairList;
    },
    queryList() {
      if (!this.query) {
        return this.pairList;
      }
      return this.pairList.filter((item) => item.pairCode.indexOf(this.query.toUpperCase()) > -1);
    },
  },
  data() {
    return {
      query: '',
      pullTimer: null,
    };
  },
  methods: {
    selectPair(pair) {
      this.$store.commit('SET_SELECTED_PAIR', pair.pairCode);
      this.$store.commit('SET_SELECTED_PAIR_CHANGE', pair.priceChangePercent);
      this.$emit('select');
      savePair(pair.pairCode, this.$store.state.chain);
    },
  },
};
</script>

<style lang="scss" scoped>
.select-pair {
  padding: 0 var(--space-common);
  padding-right: 0; // move scroll bar
  padding-bottom: .4rem;
  display: flex;
  flex-direction: column;
}

.top {
  padding-top: .3rem;
  padding-bottom: .3rem;
  padding-right: var(--space-common);
}

.top__search {
}

.scroll {
  flex: 1;
  min-height: 0;
  overflow: auto;
}

.scroll__table {
  padding-right: var(--space-common);
}
</style>

<style lang="scss">
.select-pair {
  .common-table__td {
    padding-top: 0;
    font-size: .26rem;
    line-height: .76rem;
  }
}
</style>
