import getContract from '@/api/contract';
import getPairs from '@/api/pairs';
import getTokens from '@/api/tokens';
import {
  getCachedPair, savePair, getCachedToken, saveToken,
} from '@/utils/cache';
import { Chains } from '@/utils/enum';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const getDefaultState = () => ({
  address: '',
  chain: Chains.ETH,
  selectedPair: '',
  selectedPairChange: '',
  selectedFromToken: '',
  selectedToToken: '',
  pairList: [],
  tokenList: [],
  swapAbi: [],
  swapContract: '',
  swapApproveContract: '',
  fromTokenPrice: '',
  toTokenPrice: '',
});

export default new Vuex.Store({
  state: getDefaultState(),
  mutations: {
    SET_ADDRESS(state, payload) {
      state.address = payload;
    },
    SET_CHAIN(state, payload) {
      state.chain = payload;
    },
    SET_SELECTED_FROM_TOKEN(state, payload) {
      state.selectedFromToken = payload;
    },
    SET_SELECTED_TO_TOKEN(state, payload) {
      state.selectedToToken = payload;
    },
    SET_SELECTED_PAIR(state, payload) {
      state.selectedPair = payload;
    },
    SET_SELECTED_PAIR_CHANGE(state, payload) {
      state.selectedPairChange = payload;
    },
    SET_PAIR_LIST(state, payload) {
      state.pairList = payload;
    },
    SET_TOKEN_LIST(state, payload) {
      state.tokenList = payload;
    },
    SET_SWAP_ABI(state, payload) {
      state.swapAbi = payload;
    },
    SET_SWAP_CONTRACT(state, payload) {
      state.swapContract = payload;
    },
    SET_SWAP_APPROVE_CONTRACT(state, payload) {
      state.swapApproveContract = payload;
    },
    SET_FROM_TOKEN_PRICE(state, payload) {
      state.fromTokenPrice = payload;
    },
    SET_TO_TOKEN_PRICE(state, payload) {
      state.toTokenPrice = payload;
    },
    RESET_STATE(state) {
      Object.assign(state, getDefaultState());
    },
  },
  actions: {
    async FETCH_PAIR({ commit, state }) {
      const { chain } = state;
      if (!chain) {
        return;
      }
      const list = await getPairs(chain); // todo map api obj
      commit('SET_PAIR_LIST', list);
      if (list[0]) { // auto select first
        if (state.selectedPair) {
          if (list.find((item) => item.pairCode === state.selectedPair)) {
            return;
          }
        }
        const cachedPair = getCachedPair(chain);
        if (cachedPair) { // use last selected pair
          const target = list.find((item) => item.pairCode === cachedPair);
          if (target) {
            commit('SET_SELECTED_PAIR', target.pairCode);
            commit('SET_SELECTED_PAIR_CHANGE', target.priceChangePercent);
          } else {
            savePair('', chain); // remove cache if pair not exist now
          }
        } else {
          commit('SET_SELECTED_PAIR', list[0].pairCode);
          commit('SET_SELECTED_PAIR_CHANGE', list[0].priceChangePercent);
        }
      }
    },
    async FETCH_TOKENS({ commit, state }) {
      const { chain } = state;
      const tokens = await getTokens(state.chain);
      commit('SET_TOKEN_LIST', tokens);
      if (tokens[0]) { // auto select first
        const setCachedToken = (direction) => {
          if (direction === 'from') {
            if (state.selectedFromToken) {
              if (tokens.find((item) => item.symbol === state.selectedFromToken)) {
                return;
              }
            }
          } else if (direction === 'to') {
            if (state.selectedToToken) {
              if (tokens.find((item) => item.symbol === state.selectedToToken)) {
                return;
              }
            }
          }
          const token = direction === 'from' ? 'SET_SELECTED_FROM_TOKEN' : 'SET_SELECTED_TO_TOKEN';
          const cachedToken = getCachedToken(chain, direction);
          if (cachedToken) { // use last selected pair
            const target = tokens.find((item) => item.symbol === cachedToken);
            if (target) {
              commit(token, target.symbol);
            } else {
              saveToken('', chain, direction); // remove cache if pair not exist now
            }
          } else {
            commit(token, tokens[0].symbol);
          }
        };
        setCachedToken('from');
        setCachedToken('to');
      }
    },
    async FETCH_CONTRACT({ commit, state }) {
      const { abi, contract, approveContract } = await getContract(state.chain);
      commit('SET_SWAP_ABI', abi);
      commit('SET_SWAP_CONTRACT', contract);
      commit('SET_SWAP_APPROVE_CONTRACT', approveContract);
    },
  },
  modules: {
  },
});
