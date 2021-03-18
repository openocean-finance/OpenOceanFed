<template>
  <div class="trade" @touchmove="touchMove" @touchend="touchEnd">
    <div class="header__wrapper">
      <div class="header__wrapper__opacity" :style="{opacity:headerOpacity}">
        <HeaderView
          ref="headerDom"
          @showMenu="isShowMenu=true"
          @selectChain="isSelectChain=true"
          :is-menu-showing="isShowMenu"
        />
      </div>
    </div>
    <main class="main" ref="tabDom">
      <div class="center">
        <div class="center__left">
          <PairSelector class="pair__wrapper__select l-status"/>
          <TransferCex
            v-if="selectedExchange&&selectedExchange.exchangeType==='1'"
            :key="$store.state.selectedPair"
          />
          <TransferDex
            v-else
            :key="$store.state.selectedPair"
            class="center__left"
            :show-settings.sync="isAdvanceShowing"
          />
        </div>
        <div class="center__right">
          <div class="pair__wrapper l-status">
            <LabelSpan class="pair__wrapper__label" :label="$store.state.selectedPairChange"/>
            <i
              class="iconfont iconProSettings3 pair__wrapper__icon"
              @click="isAdvanceShowing=true"
            />
            <i
              class="iconfont iconMarket pair__wrapper__icon pair__wrapper__chart"
              @click="showCharts"
            />
            <i class="iconfont iconDark g-light-only pair__wrapper__theme" @click="switchTheme"/>
            <i class="iconfont iconLight g-dark-only pair__wrapper__theme" @click="switchTheme"/>
          </div>
          <Exchanges v-model="selectedExchange"/>
        </div>
      </div>
      <Transactions/>
    </main>
    <BlurMask :visible.sync="isChartsShowing" :title="$store.state.selectedPair">
      <Charts @close="isChartsShowing=false"/>
    </BlurMask>
    <transition name="g-fade">
      <HeaderMask v-if="isShowMenu" @close="isShowMenu=false" :is-menu-showing="isShowMenu"/>
    </transition>
    <NouDialog title="Select Chains" :visible="isSelectChain" close-on-click-modal>
      <SelectChain/>
    </NouDialog>
  </div>
</template>

<script>
import PairSelector from '@/components/PairSelector.vue';
import { loadChainData } from '@/utils/dApp';
import { changeTheme } from '@/utils/theme';
import Charts from '@/views/Trade/Charts/index.vue';
import Exchanges from '@/views/Trade/Exchanges.vue';
import HeaderView from '@/views/Trade/HeaderView.vue';
import { Chains, Configs } from '@/utils/enum';
import LabelSpan from '@/components/LabelSpan.vue';
import Transactions from '@/views/Trade/Transactions/index.vue';
import TransferCex from '@/views/Trade/TransferCex.vue';
import TransferDex from '@/views/Trade/TransferDex.vue';
import HeaderMask from '@/components/HeaderView/HeaderMask.vue';
import BlurMask from '@/components/BlurMask.vue';
import NouDialog from '@/components/NouDialog.vue';
import SelectChain from '@/components/SelectChain.vue';

export default {
  name: 'Trade',
  components: {
    SelectChain,
    NouDialog,
    BlurMask,
    HeaderMask,
    PairSelector,
    Charts,
    TransferDex,
    Transactions,
    Exchanges,
    TransferCex,
    LabelSpan,
    HeaderView,
  },
  data() {
    return {
      Chains,
      headerOpacity: 1,
      selectedExchange: null,
      isChartsShowing: false,
      pullPairsTimer: null,
      isAdvanceShowing: false,
      isShowMenu: false,
      isSelectChain: false,
    };
  },
  methods: {
    touchMove() {
      const tab = this.$refs.tabDom;
      const header = this.$refs.headerDom.$el;
      if (tab && header) {
        const headerHeight = header.clientHeight;
        const tabY = tab.getBoundingClientRect().y;
        this.headerOpacity = Math.min(tabY / headerHeight, 1);
      }
    },
    touchEnd() {
      this.headerOpacity = 1;
    },
    showCharts() {
      this.isChartsShowing = true;
    },
    async changeChain(target) {
      await this.$store.commit('RESET_STATE');
      await loadChainData(target.name);
    },
    /**
     * load pair list for selected pair change number
     * @return {Promise<void>}
     */
    async startPullPair() {
      clearTimeout(this.pullPairsTimer);
      await this.$store.dispatch('FETCH_PAIR');
      this.pullPairsTimer = setTimeout(() => {
        this.startPullPair();
      }, Configs.PullDuration);
    },
    switchTheme() {
      changeTheme();
    },
    selectExchangeHandler() {
    },
  },
  mounted() {
    this.startPullPair();
  },
  beforeDestroy() {
    clearTimeout(this.pullPairsTimer);
  },
};
</script>

<style lang="scss" scoped>
.trade {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding-top: var(--header-height);
  min-height: 100%;
}

.header__wrapper {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  height: 50vh; // keep pull background
  background: var(--background-pro-header);
}

.header__wrapper__opacity {
  position: relative;
  z-index: 1;
  transition: opacity .2s;
}

.header {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
}

.main {
  z-index: var(--z-index-content);
  flex: 1;
  padding: var(--space-common);
  background: var(--background-pro-main);
  border-radius: .4rem .4rem 0 0;
}

.main__tab {
  z-index: var(--z-index-tab-label);
  position: sticky;
  top: 0;
  right: 0;
  left: 0;
  padding: var(--space-common) 0;
  background: var(--background-base);
}

.pair__wrapper {
  height: .45rem;
  line-height: .45rem;
  display: flex;
  text-align: right;

  & > * {
    align-self: center;
  }
}

.pair__wrapper__label {
  margin-left: auto;
}

.pair__wrapper__select {
  margin-right: auto;
}

.pair__wrapper__icon {
  vertical-align: middle;
  margin-left: var(--space-common);
  font-size: .32rem;
}

.pair__wrapper__chart {
  font-size: .3rem;
}

.pair__wrapper__theme {
  vertical-align: middle;
  margin-left: var(--space-common);
  font-size: .28rem;
}

.center {
  display: flex;
}

.center__left {
  margin-right: var(--space-common);
  width: 3.6rem;
}

.center__right {
  flex: 1;
}

.l-status {
  margin-bottom: var(--space-common);
}
</style>
