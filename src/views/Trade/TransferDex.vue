<template>
  <div>
    <div class="g-child-mt">
      <Field label="Exchange">OpenOcean</Field>
      <TransferField
        label="From"
        :balance="walletBalance|formatBalance"
        :token-name="fromToken.name"
        :token-symbol="from"
        :token-contract="fromToken.address"
        :chain="chain"
        v-model="amount"
        @change="amountChangeHandler"
        input
        @max="useMaxAmount"
      />
      <TransferField
        label="To"
        :balance="toWalletBalance|formatBalance"
        :token-name="toToken.name"
        :token-symbol="to"
        :token-contract="toToken.address"
        :chain="chain"
        :percent="percent"
        :value="toAmount"
      >
        <span v-if="toAmount&&toAmount!=='0'">{{ toAmount | formatUsdt }}</span>
        <span v-else class="to__empty">--</span>
      </TransferField>
      <CommonButton
        v-if="toAmountLoading"
        label="Finding Best Prices"
        loading
        disable
      />
      <CommonButton
        v-else
        label="Swap Now"
        @click="swapClickHandler"
      />
    </div>
    <div class="gas g-flex gas__margin">
      <div>Price Tolerence</div>
      <div class="gas__value">{{ selectedSlippage }}%</div>
    </div>
    <div class="gas g-flex" v-if="!disabledGasPrice">
      <div>Gas Price</div>
      <div class="gas__value">{{ gasPrice }}</div>
    </div>
    <ActionSheet :visible.sync="isConfirmShowing">
      <ConfirmSwap
        :from-token="from"
        :from-amount="amount"
        :to-token="to"
        :to-amount="toAmount"
        :slippage="selectedSlippage"
        :loading="sendLoading"
        :percent="percent"
        @confirm="confirmSwap"
      />
    </ActionSheet>
    <NouDialog
      title="Advanced Settings"
      :visible.sync="isShowSettings"
      close-on-click-modal
    >
      <div class="advance-settings">
        <FoldLabel label="Price Tolerance" :content="`${selectedSlippage}%`">
          <SlippageSelect
            v-model="selectedSlippage"
            :options="toleranceOptions"
            inline
          />
        </FoldLabel>
        <FoldLabel label="Gas Price" :content="gasPrice" v-if="gasPriceList.length > 0">
          <SlippageSelect v-model="gasPriceValue" :gas="true" :options="gasPriceList"/>
        </FoldLabel>
      </div>
    </NouDialog>
  </div>
</template>

<script>
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
import { isLte, isPositiveNumber, gas2Gwei } from '@/utils/number';
import ConfirmSwap from '@/views/Trade/ConfirmSwap.vue';
import { mapState } from 'vuex';
import TransferField from '@/views/Trade/TransferField.vue';
import NouDialog from '@/components/NouDialog.vue';
import FoldLabel from '@/views/Classic/AdvanceSettings/FoldLabel.vue';
import SlippageSelect from '@/views/Classic/AdvanceSettings/SlippageSelect.vue';

export default {
  name: 'TransferDex',
  components: {
    SlippageSelect,
    FoldLabel,
    NouDialog,
    TransferField,
    ConfirmSwap,
    ActionSheet,
    CommonButton,
    Field,
  },
  props: {
    showSettings: {
      type: Boolean,
      require: true,
    },
  },
  computed: {
    from() {
      return this.pair.split('/')[0];
    },
    to() {
      return this.pair.split('/')[1];
    },
    ...mapState({
      pair: (state) => state.selectedPair,
      chain: (state) => state.chain,
      tokenList: (state) => state.tokenList,
      address: (state) => state.address,
      abi: (state) => state.swapAbi,
      contract: (state) => state.swapContract,
      approveContract: (state) => state.swapApproveContract,
    }),
    dataForBalance() {
      return {
        chain: this.chain,
        tokenList: this.tokenList,
        address: this.address,
        pair: this.pair,
      };
    },
    disabledGasPrice() {
      return !(this.chain === Chains.ETH || this.chain === Chains.BSC);
    },
    isShowSettings: {
      get() {
        return this.showSettings;
      },
      set(val) {
        this.$emit('update:showSettings', val);
      },
    },
  },
  data() {
    return {
      isSlippageActionShowing: false,
      isGasPriceActionShowing: false,
      selectedSlippage: '1',
      amount: '',
      toAmount: '',
      toAmountLoading: false,
      toAmountTimer: null,
      gasPrice: '--',
      gasPriceValue: '',
      gasPriceList: [],
      isConfirmShowing: false,
      sendLoading: false,
      walletBalance: '',
      toWalletBalance: '',
      pullBalanceTimer: null,
      fromToken: {},
      toToken: {},
      percent: 0,
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
    };
  },
  methods: {
    setTokenPercent() {
      const { fromTokenPrice } = this.$store.state;
      const { toTokenPrice } = this.$store.state;
      // eslint-disable-next-line no-console
      console.log('setTokenPercent', fromTokenPrice, toTokenPrice, this.amount, this.toAmount);
      if (fromTokenPrice && toTokenPrice && this.amount && this.toAmount && !this.toAmountLoading) {
        let inUsdtValue = '';
        let outUsdtValue = '';
        if (this.swap === 0) {
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
    showSlippageAction() {
      this.isSlippageActionShowing = true;
    },
    showGasPriceAction() {
      this.isGasPriceActionShowing = true;
    },
    selectSlippageHandler(val) {
      this.selectedSlippage = val;
      this.isSlippageActionShowing = false;
      this.amountChangeHandler();
    },
    selectGasPriceHandler(val) {
      this.gasPrice = gas2Gwei(val);
      this.gasPriceValue = val;
      this.isGasPriceActionShowing = false;
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
      if (!(this.from && this.to)) {
        return;
      }
      const fromToken = this.getToken(this.from);
      const toToken = this.getToken(this.to);
      if (!(fromToken && toToken)) {
        showToast('unsupported token');
      }
      this.toAmountLoading = true;
      getQuote(
        this.chain, fromToken, toToken, this.amount, this.selectedSlippage, this.address,
      )
        .then((res) => {
          this.toAmount = res;
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
      const toToken = this.getToken(this.to);
      this.fromToken = fromToken;
      this.toToken = toToken;
      if (!fromToken || !toToken) {
        return;
      }
      this.pullBalanceTimer = setTimeout(async () => {
        try {
          this.walletBalance = await getBalance({
            address: this.address,
            contract: fromToken.address,
            decimals: fromToken.decimals,
            chain: this.chain,
          });
          this.toWalletBalance = await getBalance({
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
      if (!isPositiveNumber(this.walletBalance)) {
        return;
      }
      this.amount = this.walletBalance;
      this.amountChangeHandler();
    },
  },
  async mounted() {
    this.selectedSlippage = window.localStorage.getItem('tolerance') || '1';
    try {
      const {
        label,
        value,
        list,
      } = await initGasPrice(this.chain);
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
        this.gasPriceValue = value;
      }
    } catch (e) {
      showToast(e.message);
    }
  },
  watch: {
    dataForBalance: {
      handler() {
        this.pullBalance();
      },
      immediate: true, // component key = pair
      deep: true,
    },
    selectedSlippage(val) {
      window.localStorage.setItem('tolerance', val);
      this.amountChangeHandler();
    },
    gasPriceValue(val) {
      if (this.chain === Chains.ETH) {
        this.gasPrice = gas2Gwei(val);
        window.localStorage.setItem('gasprice', val);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.gas {
  font-size: .22rem;
  line-height: .33rem;
  color: var(--color-des);
}

.gas__value {
  color: var(--color-base);
  margin-left: auto;
}

.gas__margin {
  margin-top: 0.2rem;
  margin-bottom: 0.05rem;
}

.balance {
  font-size: .22rem;
  color: var(--color-content);
  font-weight: 400;
}
</style>

<style lang="scss">
.transfer-dex__slippage__label {
  vertical-align: middle;
}

.transfer-dex__slippage__icon { // todo select field
  display: inline-block;
  vertical-align: middle;
  font-size: .24rem;
  transform: scale(.4);
  transform-origin: right;
}

.transfer-dex__swap {
  text-align: center;
  font-size: .24rem;
  color: var(--color-des);
}

.transfer-dex__finding {
  margin-right: .2rem;
}

.to__empty {
  color: var(--color-des);
}

.transfer-dex__amount {
  .field__label {
    margin-right: .1rem;
  }
}
</style>
