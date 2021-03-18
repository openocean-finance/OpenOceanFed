import { CacheKeys, Chains } from '@/utils/enum';

const MAP_KEY = {
  [Chains.ETH]: CacheKeys.ETH_PAIR,
  [Chains.BSC]: CacheKeys.BSC_PAIR,
  [Chains.ONT]: CacheKeys.ONT_PAIR,
};

export const savePair = (pair, chain) => {
  if (!chain) {
    return;
  }
  localStorage.setItem(MAP_KEY[chain], pair);
};

export const saveToken = (token, chain, direction) => {
  if (!chain) {
    return;
  }
  localStorage.setItem(`${MAP_KEY[chain]}_${direction}`, token);
};

export const getCachedPair = (chain) => localStorage.getItem(MAP_KEY[chain]) || '';

export const getCachedToken = (chain, direction) => localStorage.getItem(`${MAP_KEY[chain]}_${direction}`) || '';
