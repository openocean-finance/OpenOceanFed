<template>
  <header class="header-view header-view--menu">
    <MobileSwitch :active="isMenuShowing" @click.native="emitShowMenu"/>
    <a class="logo-link" href="https://openocean.finance">
      <template v-if="classic">
        <img
          class="logo g-dark-only"
          src="@/assets/images/logo-classic-sm-dark.svg"
          alt="Logo"
        >
        <img
          class="logo g-light-only"
          src="@/assets/images/logo-classic-sm.svg"
          alt="Logo"
        >
      </template>
      <template v-else>
        <img class="logo g-dark-only" src="@/assets/images/logo-pro-sm-dark.svg" alt="Logo">
        <img class="logo g-light-only" src="@/assets/images/logo-pro-sm.svg" alt="Logo">
      </template>
    </a>
    <ChainStatus v-if="chain && address" class="header-view__chain" :chain="chain"/>
    <HeaderWallet
      v-if="address"
      :address="address"
      :classic="classic"
      @transaction="$emit('transaction')"
      @selectChain="$emit('selectChain')"
    />
    <ConnectButton v-else class="header-view__wallet" @connect="connectHandler"/>
  </header>
</template>

<script>

import ConnectButton from '@/components/Wallet/ConnectButton.vue';
import HeaderWallet from '@/components/Wallet/HeaderWallet.vue';
import MobileSwitch from '@/components/HeaderView/MobileSwitch.vue';
import ChainStatus from '@/views/Trade/ChainStatus.vue';

export default {
  name: 'HeaderView',
  props: {
    classic: {
      type: Boolean,
      default: false,
    },
    isMenuShowing: {
      type: Boolean,
      require: true,
    },
  },
  components: {
    ChainStatus,
    MobileSwitch,
    ConnectButton,
    HeaderWallet,
  },
  computed: {
    address() {
      return this.$store.state.address;
    },
    chain() {
      return this.$store.state.chain;
    },
  },
  data() {
    return {
    };
  },
  methods: {
    connectHandler(val) {
      this.address = val;
    },
    emitShowMenu() {
      this.$emit('showMenu');
    },
  },
};
</script>

<style lang="scss" scoped>
.header-view {
  height: var(--header-height);
  line-height: var(--header-height);
  padding: 0 var(--space-common) 0 var(--space-common);
  display: flex;

  & > * {
    align-self: center;
  }
}

.logo-link {
  display: block;
  color: inherit;
  text-decoration: none;
  vertical-align: middle;
  line-height: var(--header-height);
  font-size: 0;
}

.logo {
  height: .46rem;
  vertical-align: middle;
}

.header-view__wallet {
  margin-left: auto;
}

.header-view__chain {
  margin-left: auto;
  margin-right: .25rem;
}
</style>
