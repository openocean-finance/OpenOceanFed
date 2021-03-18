<template>
  <div>
    <Radio v-model="selectedType"
    :options="typeOptions" :danger="selectedType===TypeEnum.exchanges"/>
    <div class="g-child-mt g-child-mt-padding" v-show="selectedType===TypeEnum.swap">
      <SelectView />
      <Field
        ref="fromInput"
        class="transfer-dex__amount"
        label="From"
        v-model="amount"
        @change="amountChangeHandler"
        input
      >
        <template v-slot:left>
          <CommonButton class="transfer-dex__max" label="MAX" @click="useMaxAmount">
            <div class="transfer-dex__max__label">
              <span>MAX</span>
            </div>
          </CommonButton>
        </template>
        <template v-slot:token>
          <div class="field__unit field__unit__fixed" @click="changeToken('from')">{{ from }}
            <i class="iconfont iconDropdown transfer-dex__slippage__icon"/>
          </div>
        </template>
      </Field>
      <Field label="To">
        <span v-if="toAmount&&toAmount!=='0'">{{ toAmount | formatUsdt }}</span>
        <span v-else class="to__empty">--</span>
        <template v-slot:token>
          <div class="field__unit field__unit__fixed" @click="changeToken('to')">{{ to }}
            <i class="iconfont iconDropdown transfer-dex__slippage__icon"/>
          </div>
        </template>
      </Field>
      <div class="balance">Balance: {{ walletBalance | formatBalance }} {{ from }}
        <span @click="showSettingsAction">
          Advanced Settings<i class="iconfont iconList transfer-dex__slippage__icon"/>
        </span>
      </div>
      <div class="g-child-mt" v-if="showSettings">
        <Field label="Slippage" @click.native="showSlippageAction">
          <span class="transfer-dex__slippage__label">{{ `${selectedSlippage}%` }}</span>
          <i class="iconfont iconDropdown transfer-dex__slippage__icon"/>
        </Field>
        <Field label="Gas Price" @click.native="showGasPriceAction" v-if="gasPriceList.length > 0">
          <span class="transfer-dex__slippage__label">{{ `${gasPrice}` }}</span>
          <i class="iconfont iconDropdown transfer-dex__slippage__icon"/>
        </Field>
        <Field label="Liquidity Sources" @click.native="showExchangeAction">
          <span class="transfer-dex__slippage__label">{{ `${dexesLength}` }} Selected</span>
          <i class="iconfont iconDropdown transfer-dex__slippage__icon"/>
        </Field>
      </div>
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
      <div class="gas g-flex">
        <div>Gas Price</div>
        <div class="gas__value">{{ gasPrice }}</div>
      </div>
    </div>
    <div class="g-child-mt g-child-mt-padding" v-show="selectedType===TypeEnum.exchanges">
      <Exchanges :dexes="dexes" />
    </div>
    <ActionSheet :visible.sync="isSlippageActionShowing">
      <SelectSlippage :slippage="selectedSlippage" @select="selectSlippageHandler"/>
    </ActionSheet>
    <ActionSheet :visible.sync="isGasPriceActionShowing">
      <SelectGasPrice
      :gas-price-list="gasPriceList"
      :gas-price="gasPriceValue"
      @select="selectGasPriceHandler"/>
    </ActionSheet>
    <ActionSheet :visible.sync="isExchangeActionShowing">
      <SelectExchange :dexes="dexes" @select="selectExchangeHandler"/>
    </ActionSheet>
    <ActionSheet :visible.sync="isTokenActionShowing">
      <SelectToken @select="selectTokenHandler" :direction="direction" />
    </ActionSheet>
    <ActionSheet :visible.sync="isConfirmShowing">
      <ConfirmSwap
        :from-token="from"
        :from-amount="amount"
        :to-token="to"
        :to-amount="toAmount"
        :slippage="selectedSlippage"
        :loading="sendLoading"
        @confirm="confirmSwap"
      />
    </ActionSheet>
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
import {
  isLte, isPositiveNumber, gas2Gwei,
} from '@/utils/number';
import ConfirmSwap from '@/views/Trade/ConfirmSwap.vue';
import SelectSlippage from '@/views/Trade/SelectSlippage.vue';
import SelectGasPrice from '@/views/Trade/SelectGasPrice.vue';
import SelectToken from '@/views/Classic/SelectToken.vue';
import SelectExchange from '@/views/Classic/SelectExchange.vue';
import { mapState } from 'vuex';
import Radio from '@/components/Radio.vue';
import Exchanges from '@/views/Classic/Exchanges.vue';
import SelectView from '@/views/Classic/SelectView.vue';

const TypeEnum = {
  swap: 'Swap',
  exchanges: 'Exchanges',
};

export default {
  name: 'TransferClassic',
  components: {
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
      isConfirmShowing: false,
      sendLoading: false,
      walletBalance: '',
      pullBalanceTimer: null,
      selectedType: TypeEnum.swap,
      showSettings: false,
      gasPriceList: [],
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
    };
  },
  methods: {
    showSettingsAction() {
      this.showSettings = !this.showSettings;
    },
    showExchangeAction() {
      this.isExchangeActionShowing = true;
    },
    selectExchangeHandler() {
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
      this.gasPriceValue = val;
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
        return;
      }
      this.toAmountTimer = setTimeout(() => {
        this.fetchQuote();
      }, 500);
    },
    switchPair() {
      const temp = this.from;
      this.from = this.to;
      this.to = temp;
      this.fetchQuote();
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
          this.toAmount = toAmount;
          this.dexes = dexes;
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
      this.pullBalanceTimer = setTimeout(async () => {
        try {
          this.walletBalance = await getBalance({
            address: this.address,
            contract: fromToken.address,
            decimals: fromToken.decimals,
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
    changeToken(direction) {
      this.direction = direction;
      this.isTokenActionShowing = true;
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
        this.fetchQuote();
      },
      immediate: true, // component key = pair
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.g-child-mt-padding {
  padding-top: .2rem;
}

.gas {
  font-size: .22rem;
  color: var(--color-des);
  line-height: .5rem;
}

.gas__value {
  margin-left: auto;
}

.balance {
  font-size: .22rem;
  color: var(--color-des);
  font-weight: 400;
  display: flex;
  span {
    flex: 1;
    text-align: right;
    padding: 0 .2rem;
    color: var(--color-base);
    .iconfont {
      font-size: .36rem;
      margin-left: .15rem;
      transition: all .3s ease;
      &.up {
        transform: rotate(180deg);
      }
    }
  }
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

.transfer-dex__max {
  position: relative;
  border-radius: .05rem;
  margin-right: .1rem;
  width: .6rem;
  height: .28rem;
  line-height: .28rem;
  overflow: hidden;
}

.transfer-dex__max__label {
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
</style>
