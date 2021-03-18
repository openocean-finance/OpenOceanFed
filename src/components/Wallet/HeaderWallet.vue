<template>
  <div class="header-wallet" @click="showMenu">
    <span class="header-wallet__address g-font-mid">{{ address | formatLongStr }}</span>
    <i class="iconfont iconDropdown header-wallet__icon"/>
  </div>
</template>

<script>

import showToast from '@/components/toast';
import showHeaderMenu from '@/components/Wallet/showHeaderMenu';
import { disconnectWalletConnect, getIsWalletConnect } from '@/utils/dApp';
import copy from 'copy-to-clipboard';

export default {
  name: 'HeaderWallet',
  props: {
    address: {
      type: String,
      require: false,
    },
    classic: {
      type: Boolean,
      require: true,
    },
  },
  data() {
    return {
      isNeedExit: getIsWalletConnect(),
      isMenuShowing: false,
    };
  },
  methods: {
    copyAddress() {
      if (this.address) {
        copy(this.address);
        showToast({
          text: 'Copy Success',
          type: 'success',
        });
      }
    },
    showMenu() {
      if (this.isMenuShowing) {
        return;
      }
      const menus = [
        {
          label: 'Copy Address',
          action: () => {
            this.copyAddress();
          },
        },
        // {
        //   label: 'Select Chain',
        //   action: () => {
        //     this.$emit('selectChain');
        //   },
        // },
      ];
      if (this.classic) {
        menus.push({
          label: 'Transaction',
          action: () => {
            this.$emit('transaction');
          },
        });
      }
      if (getIsWalletConnect()) {
        menus.push({
          label: 'Disconnect',
          action: () => {
            this.disconnect();
          },
        });
      }
      this.isMenuShowing = true;
      showHeaderMenu(menus, () => {
        this.isMenuShowing = false;
      });
    },
    async disconnect() {
      try {
        await disconnectWalletConnect();
        this.$nextTick(() => {
          this.$store.commit('RESET_STATE');
        });
      } catch (e) {
        showToast(e.message);
      }
    },
  },
};
</script>

<style lang="scss">
.header-wallet {
  height: .66rem;
  line-height: .66rem;
  font-size: 0;
  white-space: nowrap;
  display: flex;
  align-items: center;
}

.header-wallet__address {
  vertical-align: middle;
  font-size: .24rem;
}

.header-wallet__icon {
  vertical-align: middle;
  display: inline-block;
  font-size: .24rem;
  transform: scale(.417);
  transform-origin: right;
}
</style>
