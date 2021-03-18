import getGasPrice from '@/api/gasPrice';
import { Chains } from '@/utils/enum';
import { getFixed, getShift } from '@/utils/number';

const gas2Gwei = (gas) => getFixed(getShift(gas, -9), 2);

const initGasPrice = async (chain) => {
  const { fast, instant, standard } = await getGasPrice();

  if (chain === Chains.ONT) {
    return {
      label: '0.15 ONG',
      value: '',
    };
  }

  if (chain === Chains.BSC) {
    return {
      label: '10 GWEI',
      value: '10000000000',
    };
  }

  return {
    list: [{
      code: 'standard',
      value: `${standard}`,
      label: `${gas2Gwei(standard)} GWEI`,
    }, {
      code: 'fast',
      value: `${fast}`,
      label: `${gas2Gwei(fast)} GWEI`,
    }, {
      code: 'instant',
      value: `${instant}`,
      label: `${gas2Gwei(instant)} GWEI`,
    }],
  };
};

export default initGasPrice;
