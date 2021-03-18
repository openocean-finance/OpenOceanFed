<template>
  <div class="classic" @touchmove="touchMove" @touchend="touchEnd">
    <HeaderView
      ref="headerDom"
      class="classic__header"
      :style="{opacity:headerOpacity}"
      classic
      @showMenu="isShowMenu=true"
      @selectChain="isSelectChain=true"
      :is-menu-showing="isShowMenu"
      @transaction="isTransactionShowing=true"
    />
    <div class="g-container">
      <div class="classic__content-wrapper" ref="tabDom">
        <div class="classic__light-dot"/>
        <div class="classic__content-box">
          <div class="classic__light-dot classic__light-dot--inner"/>
          <CommonTab v-model="selectedTab">
            <CommonTabPanel name="swap" label="Swap">
              <div class="classic-swap">
                <div :class="`classic-swap__input ${swap===0?'':'flip'}`">
                  <div class="classic-swap__input__item1">
                    <ClassicField
                    type="From"
                    :symbol="from"
                    :balance="fromBalance"
                    v-model="amount"
                    :percent="percent"
                    @setMax="useMaxAmount"
                    @showSelect="changeToken('from')"/>
                  </div>
                  <i class="iconfont iconChange classic-swap__icon" @click="switchPair"/>
                  <div class="classic-swap__input__item2">
                    <ClassicField
                    type="To"
                    :symbol="to"
                    :balance="toBalance"
                    v-model="toAmount"
                    :percent="percent"
                    @setMax="useMaxAmount"
                    @showSelect="changeToken('to')"/>
                  </div>
                </div>
                <CommonButton
                  v-if="toAmountLoading"
                  label="Finding Best Prices"
                  class="classic-swap__submit"
                  loading
                  disable
                />
                <CommonButton
                  v-else
                  label="Swap Now"
                  class="classic-swap__submit"
                  @click="swapClickHandler"
                />
                <div class="classic-swap__set">
                  <div>Price Tolerance</div>
                  <div class="classic-swap__set__value">{{ selectedSlippage }}%</div>
                  <div class="classic-swap__set__right">Gas Price</div>
                  <div class="classic-swap__set__value">{{ gasPrice }}</div>
                </div>
              </div>
            </CommonTabPanel>
            <CommonTabPanel name="exchange" label="Exchanges">
              <ClassicExchange :list="dexes" />
            </CommonTabPanel>
          </CommonTab>
          <div class="classic__manage">
            <div class="classic__manage__btn" @click="isAdvanceShowing=true">
              <i class="iconfont iconSetting"/>
            </div>
            <div class="classic__manage__btn" @click="changeTheme">
              <i class="iconfont iconDark g-light-only"/>
              <i class="iconfont iconLight g-dark-only"/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <NouDialog
      title="Advanced Settings"
      :visible.sync="isAdvanceShowing"
      close-on-click-modal
      :dialog-class="advanceContentClasses"
    >
    <div class="advance-settings">
      <FoldLabel label="Price Tolerance" :content="`${selectedSlippage}%`">
        <SlippageSelect v-model="selectedSlippage" :options="toleranceOptions" inline/>
      </FoldLabel>
      <FoldLabel label="Gas Price" :content="gasPrice" v-if="gasPriceList.length > 0">
        <SlippageSelect v-model="gasPriceValue" :gas="true" :options="gasPriceList"/>
      </FoldLabel>
      <FoldLabel label="Spread Across DEXes"
      :content="`${dexesLength} Selected`" v-if="dexes.length">
        <div class="advance-settings__dex">
          <div v-for="(item, i) in dexesList" :key="i">
            <CommonSwitch :value="item.checked" @input="selectExchangeHandler(item)"/>
            <span class="advance-settings__dex__label">{{ item.dexCode }}</span>
          </div>
        </div>
      </FoldLabel>
    </div>
    </NouDialog>
    <NouDialog
      :visible.sync="isTokenActionShowing"
      :dialog-class="tokenDialogClass"
      close-on-click-modal
      show-close
    >
      <SelectToken :direction="direction" @select="selectTokenHandler"/>
    </NouDialog>
    <BlurMask :visible.sync="isTransactionShowing">
      <ClassicTransaction @close="isTransactionShowing=false"/>
    </BlurMask>
    <NouDialog title="Order Confirm" :visible.sync="isConfirmShowing" close-on-click-modal>
      <ConfirmSwap
        :from-token="from"
        :from-amount="amount"
        :to-token="to"
        :to-amount="toAmount"
        :percent="percent"
        :slippage="selectedSlippage"
        :loading="sendLoading"
        @confirm="confirmSwap"
        @cancel="isConfirmShowing = false"
      />
    </NouDialog>
    <transition name="g-fade">
      <HeaderMask
        v-if="isShowMenu"
        @close="isShowMenu=false"
        :is-menu-showing="isShowMenu"
        is-classic
      />
    </transition>
    <NouDialog title="Select Chains" :visible="isSelectChain" close-on-click-modal>
      <SelectChain/>
    </NouDialog>
  </div>
</template>

<script>
/* eslint-disable */
import { getQuote, getSwapQuote } from '@/api/swapQuote';
import ActionSheet from '@/components/ActionSheet.vue';
import CommonButton from '@/components/CommonButton.vue';
import Field from '@/components/Field.vue';
import showToast from '@/components/toast/index';
import {
  getBalance, sendEthChainSwap, sendOntChainSwap, showWalletConnect,
} from '@/utils/dApp';
import { Chains, Codes } from '@/utils/enum';
import initGasPrice from '@/utils/gasPrice';
import {
  isLte, isPositiveNumber, gas2Gwei,
} from '@/utils/number';
import SelectSlippage from '@/views/Trade/SelectSlippage.vue';
import SelectGasPrice from '@/views/Trade/SelectGasPrice.vue';
import SelectExchange from '@/views/Classic/SelectExchange.vue';
import { mapState } from 'vuex';
import Radio from '@/components/Radio.vue';
import Exchanges from '@/views/Classic/Exchanges.vue';
import SelectView from '@/views/Classic/SelectView.vue';
import ConfirmSwap from '@/views/Classic/ConfirmSwap.vue';
import SelectToken from '@/views/Classic/ClassicSwap/SelectToken.vue';
import ClassicTransaction from '@/views/Classic/ClassicTransaction/index.vue';
import BlurMask from '@/components/BlurMask.vue';
import CommonTab from '@/components/CommonTab.vue';
import CommonTabPanel from '@/components/CommonTabPanel.vue';
import NouDialog from '@/components/NouDialog.vue';
import ClassicExchange from '@/views/Classic/ClassicSwap/ClassicExchange.vue';
import ClassicField from '@/views/Classic/ClassicSwap/ClassicField.vue';
import HeaderView from '@/views/Trade/HeaderView.vue';
import FoldLabel from '@/views/Classic/AdvanceSettings/FoldLabel.vue';
import SlippageSelect from '@/views/Classic/AdvanceSettings/SlippageSelect.vue';
import { changeTheme } from '@/utils/theme';
import { saveToken } from '@/utils/cache';
import CommonSwitch from '@/components/CommonSwitch.vue';
import HeaderMask from "@/components/HeaderView/HeaderMask.vue";
import SelectChain from "@/components/SelectChain.vue";
import { formatPrice } from '@/utils/format';

const TypeEnum = {
  swap: 'Swap',
  exchanges: 'Exchanges',
};

export default {
  name: 'TransferClassic',
  components: {
    SelectChain,
    HeaderMask,
    ConfirmSwap,
    SelectSlippage,
    ActionSheet,
    CommonButton,
    Field,
    Radio,
    Exchanges,
    SelectToken,
    SelectExchange,
    SelectView,
    SelectGasPrice,
    ClassicTransaction,
    BlurMask,
    NouDialog,
    ClassicExchange,
    ClassicField,
    CommonTabPanel,
    CommonTab,
    HeaderView,
    FoldLabel,
    SlippageSelect,
    CommonSwitch,
  },
  computed: {
    ...mapState({
      pair: (state) => state.selectedPair,
      chain: (state) => state.chain,
      tokenList: (state) => state.tokenList,
      address: (state) => state.address,
      abi: (state) => state.swapAbi,
      contract: (state) => state.swapContract,
      approveContract: (state) => state.swapApproveContract,
      from: (state) => state.selectedFromToken,
      to: (state) => state.selectedToToken,
    }),
    selectedPair() {
      return `${this.from}/${this.to}`;
    },
    dataForBalance() {
      return {
        chain: this.chain,
        tokenList: this.tokenList,
        address: this.address,
        from: this.from,
        to: this.to,
      };
    },
    dexesList() {
      return this.dexes.filter((item) => item.dexIndex !== -1);
    },
    dexesLength() {
      return this.dexes.filter((a) => +a.checked === 1 && +a.dexIndex !== -1).length;
    },
    disabledDexIds() {
      const list = window.localStorage.getItem('disabledDexList');
      return list ? JSON.parse(list).join(',') : '';
    },
    disabledGasPrice() {
      return !(this.chain === Chains.ETH || this.chain === Chains.BSC);
    },
  },
  data() {
    return {
      isSelectChain: false,
      isShowMenu: false,
      selectedTab: 'swap',
      isAdvanceShowing: false,
      isTransactionShowing: false,
      isConfirmShowing: false,
      tokenDialogClass: {
        'classic-token-dialog': true,
      },
      headerOpacity: 1,
      heightFlag: 0,
      toleranceOptions: [
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
      ],
      selectedToken: null,
      contentClasses: {
        'classic__select-token': true,
      },
      advanceContentClasses: {
        'classic__select-token': true,
        classic__advance: true,
      },
      tradeData: {
        from: '2 ETH',
        to: '3 BTC',
        rate: '1 ETH = 1BTC',
        slippage: '1%',
        tip: 'Output is estimated. You will receive at least 1 BTC or the transaction will revert.',
      },
      swap: 0,
      retry: 3,
      inAmount: '',
      outAmount: '',
      minOutAmount: '',
      dexesSelectedMap: {},
      exchangeList: [],
      gasPriceList: [],
      selectedDex: [],
      loading: false,
      idxToken: 0,
      bestPrice: 1,
      exchange: {},
      isTokenActionShowing: false,
      isExchangeActionShowing: false,
      isSlippageActionShowing: false,
      isGasPriceActionShowing: false,
      selectedSlippage: '1',
      amount: '',
      toAmount: '',
      toAmountLoading: false,
      toAmountTimer: null,
      gasPrice: '--',
      gasPriceValue: '',
      sendLoading: false,
      fromBalance: '',
      toBalance: '',
      pullBalanceTimer: null,
      selectedType: TypeEnum.swap,
      showSettings: false,
      typeOptions: [
        {
          label: TypeEnum.swap,
          value: TypeEnum.swap,
        },
        {
          label: TypeEnum.exchanges,
          value: TypeEnum.exchanges,
        },
      ],
      TypeEnum,
      direction: '',
      dexes: [],
      percent: 0
    };
  },
  watch: {
    dataForBalance: {
      handler() {
        this.pullBalance();
        this.fetchQuote();
      },
      immediate: true, // component key = pair
      deep: true,
    },
    amount() {
      this.amountChangeHandler();
    },
    selectedSlippage(val) {
      window.localStorage.setItem('tolerance', val);
      this.amountChangeHandler();
    },
    gasPriceValue(val) {
      if(this.chain === Chains.ETH) {
        this.gasPrice = gas2Gwei(val);
        window.localStorage.setItem('gasprice', val);
      }
    },
    chain() {
      this.chainChange();
    }
  },
  async mounted() {
    this.selectedSlippage = window.localStorage.getItem('tolerance') || '1';
    this.chainChange();
  },
  methods: {
    setTokenPercent() {
      const fromTokenPrice = this.$store.state.fromTokenPrice;
      const toTokenPrice = this.$store.state.toTokenPrice;
      console.log('setTokenPercent', fromTokenPrice, toTokenPrice, this.amount, this.toAmount);
      if (fromTokenPrice && toTokenPrice && this.amount && this.toAmount && !this.toAmountLoading) {
        let inUsdtValue = '';
        let outUsdtValue = '';
        if(this.swap === 0) {
          inUsdtValue = this.amount * fromTokenPrice;
          outUsdtValue = this.toAmount * toTokenPrice;
          this.percent = Math.floor(((outUsdtValue - inUsdtValue) / inUsdtValue) * 10000) / 100;
        } else {
          inUsdtValue = this.amount * fromTokenPrice;
          outUsdtValue = this.toAmount * toTokenPrice;
          this.percent = Math.floor(((outUsdtValue - inUsdtValue) / inUsdtValue) * 10000) / 100;
        }
      } else {
        this.percent = 0;
      }
    },
    async chainChange() {
      try {
        console.log('initGasPrice1', this.chain);
        const {
          label,
          value,
          list,
        } = await initGasPrice(this.chain);
        console.log('initGasPrice2', this.chain, label, value, list);
        if (list && list.length) {
          const gasPrice = window.localStorage.getItem('gasprice');
          if (this.chain === Chains.ETH && gasPrice) {
            this.gasPrice = gas2Gwei(gasPrice);
            this.gasPriceValue = +gasPrice;
          } else {
            this.gasPrice = list[0].label;
            this.gasPriceValue = list[0].value;
          }
          this.gasPriceList = list;
        } else {
          this.gasPrice = label;
          this.gasPriceValue = value || '';
          this.gasPriceList = [];
        }
      } catch (e) {
        showToast(e.message);
      }
    },
    touchMove() {
      const tab = this.$refs.tabDom;
      const tabY = tab.getBoundingClientRect().y;
      if (!this.heightFlag) {
        this.heightFlag = tabY;
      } else if (tabY < this.heightFlag) {
        this.headerOpacity = 0;
      }
    },
    touchEnd() {
      this.headerOpacity = 1;
      this.heightFlag = 0;
    },
    changeTheme() {
      changeTheme();
    },
    switchPair() {
      const toToken = this.to;
      const fromToken = this.from;
      const toTokenPrice = this.$store.state.toTokenPrice;
      const fromTokenPrice = this.$store.state.fromTokenPrice;
      this.$store.commit('SET_FROM_TOKEN_PRICE', toTokenPrice);
      this.$store.commit('SET_TO_TOKEN_PRICE', fromTokenPrice);
      this.swap = 1 - this.swap;
      this.$store.commit('SET_SELECTED_TO_TOKEN', fromToken);
      saveToken(fromToken, this.$store.state.chain, 'to');
      this.$store.commit('SET_SELECTED_FROM_TOKEN', toToken);
      saveToken(toToken, this.$store.state.chain, 'from');
    },
    showSettingsAction() {
      this.showSettings = !this.showSettings;
    },
    showExchangeAction() {
      this.isExchangeActionShowing = true;
    },
    selectExchangeHandler(item) {
      item.checked = !!!item.checked;
      const list = this.dexes.filter((a) => !(+a.checked === 1 || a.dexIndex === -1))
        .map((a) => a.dexIndex);
      window.localStorage.setItem('disabledDexList', JSON.stringify(list));
      this.fetchQuote();
    },
    showSlippageAction() {
      this.isSlippageActionShowing = true;
    },
    selectSlippageHandler(val) {
      this.selectedSlippage = val;
      this.isSlippageActionShowing = false;
      this.amountChangeHandler();
    },
    showGasPriceAction() {
      this.isGasPriceActionShowing = true;
    },
    selectGasPriceHandler(val) {
      this.gasPrice = gas2Gwei(val);
      this.gasPriceValue = val + '';
      this.isGasPriceActionShowing = false;
    },
    selectTokenHandler() {
      this.isTokenActionShowing = false;
    },
    getToken(symbol) {
      return this.tokenList.find((item) => item.symbol.toUpperCase() === symbol.toUpperCase());
    },
    amountChangeHandler() {
      clearTimeout(this.toAmountTimer);
      if (!this.amount) {
        this.toAmount = '';
        this.percent = 0;
        return;
      }
      this.toAmountTimer = setTimeout(() => {
        this.fetchQuote();
      }, 500);
    },
    fetchQuote() {
      if (!(this.from && this.to && this.amount)) {
        return;
      }
      const fromToken = this.getToken(this.from);
      const toToken = this.getToken(this.to);
      if (!(fromToken && toToken)) {
        showToast('unsupported token');
      }
      this.toAmountLoading = true;
      getQuote(
        this.chain, fromToken, toToken, this.amount, this.selectedSlippage, this.address, true,
        this.disabledDexIds,
      )
        .then((res) => {
          const { toAmount, dexes } = res;
          const outDecimals = toToken.decimals;
          this.toAmount = toAmount;
          const temp = dexes.map(item=>{
            item.amount = item.swapAmount && formatPrice(item.swapAmount) || 0;
            return item;
          })
          temp.sort((a, b) => (+a.amount > +b.amount ? -1 : 1))
          this.dexes = temp;
          
          setTimeout(() => {
            this.setTokenPercent();
          }, 500);
        })
        .finally(() => {
          this.toAmountLoading = false;
        });
    },
    async confirmSwap() {
      this.sendLoading = true;
      const fromToken = this.getToken(this.from);
      const toToken = this.getToken(this.to);
      const swapInfos = await getSwapQuote(
        this.chain, fromToken, toToken, this.amount, this.selectedSlippage, this.address,
      );
      try {
        if (this.chain === Chains.ONT) {
          await sendOntChainSwap({
            approve: swapInfos.approve,
            fromContract: swapInfos.inToken,
            address: this.address,
            amount: swapInfos.inAmount,
            scriptHash: swapInfos.transaction.scriptHash,
            operation: swapInfos.transaction.operation,
            args: swapInfos.transaction.args,
          });
        } else {
          await sendEthChainSwap({
            fromContract: swapInfos.inToken,
            toContract: swapInfos.outToken,
            amount: swapInfos.inAmount,
            minToAmount: swapInfos.minOutAmount,
            toAmount: swapInfos.outAmount,
            addresses: swapInfos.addresses,
            calldata: swapInfos.calldata,
            offsets: swapInfos.offsets,
            gasLimitsAndValues: swapInfos.gasLimitsAndValues,
            abi: this.abi,
            address: this.address,
            gasPrice: this.gasPriceValue,
            swapContract: this.contract,
            swapApproveContract: this.approveContract,
          });
        }
        showToast({
          text: 'Swap Success',
          type: 'success',
        });
        this.isConfirmShowing = false;
      } catch (e) {
        if (e.error && e.desc) {
          showToast(e.desc);
        } else if (e.code === Codes.MetaMaskCancel) {
          // do nothing
        } else {
          showToast(e.message);
        }
      }
      this.sendLoading = false;
    },
    swapClickHandler() {
      if (!this.amount || isLte(this.amount, 0)) {
        this.$refs.fromInput.focus();
        return;
      }
      if (!this.address) {
        showWalletConnect();
        return;
      }
      this.showConfirm();
    },
    showConfirm() {
      this.sendLoading = false;
      this.isConfirmShowing = true;
    },
    pullBalance() {
      clearTimeout(this.pullBalanceTimer);
      if (this.chain === Chains.ONT) { // no ont balance
        return;
      }
      if (!(this.address && this.from && this.tokenList)) {
        return;
      }
      const fromToken = this.getToken(this.from);
      if (!fromToken) {
        return;
      }
      const toToken = this.getToken(this.to);
      if (!toToken) {
        return;
      }
      this.pullBalanceTimer = setTimeout(async () => {
        try {
          this.fromBalance = await getBalance({
            address: this.address,
            contract: fromToken.address,
            decimals: fromToken.decimals,
            chain: this.chain,
          });
          this.toBalance = await getBalance({
            address: this.address,
            contract: toToken.address,
            decimals: toToken.decimals,
            chain: this.chain,
          });
        } catch (e) {
          showToast(e.message);
        }
      }, 500);
    },
    useMaxAmount() {
      if (!isPositiveNumber(this.fromBalance)) {
        return;
      }
      this.amount = this.fromBalance;
      this.amountChangeHandler();
    },
    changeToken(direction) {
      this.direction = direction;
      this.isTokenActionShowing = true;
    },
  },
};
</script>


<style lang="scss">
.classic {
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 0;
}

.classic__header {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  transition: opacity .3s;
}

.classic__light-dot {
  position: absolute;
  top: 50%;
  margin-top: -40vh;
  left: 50%;
  width: 80vh;
  height: 80vh;
  // background: var(--background-dot);
  filter: blur(50px);
  border-radius: 50%;

  &.classic__light-dot--inner {
    z-index: -1;
    // background: var(--background-dot-inner);
  }
}

.classic__content-wrapper {
  position: relative;
}

.classic__content-box {
  position: relative;
  box-sizing: border-box;
  padding: .4rem;
  min-height: 7.6rem;
  background: var(--background-classic-content);
  border-radius: 10px;
  overflow: hidden;
}

.classic__manage {
  position: absolute;
  top: .38rem;
  right: .4rem;
  font-size: 0;
}

.classic__manage__btn {
  display: inline-block;
  width: .5rem;
  height: .5rem;
  line-height: .5rem;
  text-align: center;
  font-size: .32rem;
  border-radius: .06rem;
  background: var(--background-classic-btn);

  & + & {
    margin-left: .2rem;
  }
}

.classic-token-dialog {
  padding: 0 !important;
}
.classic-swap {
  padding-top: .4rem;
  text-align: center;
}

.classic-swap__icon {
  display: inline-block;
  margin: .3rem 0 .2rem;
  font-size: .44rem;
  text-align: center;
  cursor: pointer;
  transition: opacity .3s;
  transform: rotate(90deg);

  &:hover {
    opacity: .8;
  }
}

.classic-swap__submit {
  margin-top: .3rem;
  border-radius: .06rem;
  height: .75rem;
  line-height: .75rem;
  font-size: .24rem;
  background: linear-gradient(to right, #062EF5, #0E5BFB);
}

.classic-swap__set {
  margin-top: .3rem;
  display: flex;
  font-size: .22rem;
  line-height: .33rem;
  color: var(--color-content);
}

.classic-swap__set__value {
  margin-left: .2rem;
  color: var(--color-base);
}

.classic-swap__set__right {
  margin-left: auto;
}
.advance-settings {
  padding-top: 0;
}

.advance-settings__dex {
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: .3rem;
  font-size: 0;
}

.advance-settings__dex__label {
  margin-left: .4rem;
  vertical-align: middle;
  font-size: .24rem;
  line-height: .4rem;
}
</style>
