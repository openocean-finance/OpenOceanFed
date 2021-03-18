export const Chains = {
  ETH: 'ETH',
  BSC: 'BSC',
  ONT: 'ONT',
  TRON: 'TRON',
};

export const Codes = {
  Success: 0,
  MetaMaskCancel: 4001,
};

export const Configs = {
  PullDuration: 10000,
  EthApiKey: '34H5YZ2P8Q236SN8NSCCIU9IW4JE7NJFYU',
  TransactionsPageSize: 20, // ont <= 20
  walletConnectInfuraId: 'c334bb4b45a444979057f0fb8a0c9d1b',
  walletConnectUserClose: 'User closed modal',
};

export const Enums = {
  ETH_CONTRACT: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
};

export const CacheKeys = {
  ETH_PAIR: 'eth_pair',
  ONT_PAIR: 'ont_pair',
  BSC_PAIR: 'bsc_pair',
};

export const ExchangeType = {
  CEX: '1',
  DEX: '2',
};

// chain url path
export const MapChainPath = {
  [Chains.ETH]: '',
  [Chains.BSC]: '/bsc',
  [Chains.ONT]: '/ont',
};
