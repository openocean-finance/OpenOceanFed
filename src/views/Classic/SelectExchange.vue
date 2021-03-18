<template>
  <div class="select-pair">
    <div class="top">
      <h3 class="top__title g-font-semi">Liquidity Sources</h3>
      <SearchInput class="top__search" v-model="query" placeholder="Search"/>
    </div>
    <div class="scroll" id="action-sheet-scroll">
      <div class="exchanges g-child-mt">
        <NouTable :data="dexesList" v-if="dexesList.length > 0">
          <NouTableCol>
            <template v-slot="{row}">
              <div class="exchanges__logo__wrapper">
                <div>
                  <img class="exchanges__logo" :src="row.logo" alt="">
                  <span>{{ row.dexCode}}</span>
                </div>
                <input type="checkbox" class="switch-component" v-model="row.checked"
                @change="changeDexes(row)">
              </div>
            </template>
          </NouTableCol>
        </NouTable>
        <EmptyView v-else />
      </div>
    </div>
  </div>
</template>

<script>
import SearchInput from '@/components/SearchInput.vue';
import EmptyView from '@/components/EmptyView.vue';
import NouTable from '@/components/NouTable.vue';
import NouTableCol from '@/components/NouTableCol';

export default {
  name: 'SelectExchange',
  props: {
    dexes: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  components: {
    SearchInput,
    EmptyView,
    NouTable,
    NouTableCol,
  },
  computed: {
    dexesList() {
      return this.dexes.filter((item) => item.dexIndex !== -1);
    },
  },
  data() {
    return {
      timer: '',
    };
  },
  methods: {
    changeDexes() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.$emit('select');
      }, 500);
    },
  },
};
</script>

<style lang="scss" scoped>
.select-pair {
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
  padding-right: var(--space-common);
}

.scroll__table {
  line-height: .76rem;
}

.exchanges__logo__wrapper {
  display: flex;
  align-items: center;
  height: 0.72rem;
}

.exchanges__logo__wrapper div {
  flex: 1;
  display: flex;
  align-items: center;

  img {
    margin-right: 0.1rem;
  }
}

// switch组件
.switch-component {
    position: relative;
    width: 0.8rem;
    height: 0.4rem;
    background: var(--background);
    border-radius: 0.2rem;
    border: none;
    outline: none;
    -webkit-appearance: none;
    transition: all .3s ease;
    display: block;
    cursor: pointer;
}

// 按钮
.switch-component::after {
    content: '';
    position: absolute;
    top: 0.05rem;
    left: 0.05rem;
    width: 0.3rem;
    height: 0.3rem;
    background-color: #fff;
    border-radius: 0.15rem;
    transition: all .3s ease;
}

// checked状态时，背景颜色改变
.switch-component:checked {
    background: var(--background-btn);
}

// checked状态时，按钮位置改变
.switch-component:checked::after {
    left: 0.45rem;
}
</style>
