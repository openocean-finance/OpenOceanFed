import { formatDateLabel } from '@/utils/format';
import { getTheme, THEMES } from '@/utils/theme';
import { createChart } from 'lightweight-charts';

export const getCexPoint = (item) => {
  const { time } = item;
  if (!time) {
    return {
      price: '',
      time: '',
    };
  }
  const {
    close, high, low, open,
  } = item.seriesPrices ? item.seriesPrices.entries().next().value[1] : item;
  const date = new Date(time * 1000);
  return {
    price: `O: ${open}, H: ${high}, L: ${low}, C: ${close}`,
    time: formatDateLabel(new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000), 'yyyy/MM/dd hh:mm:ss'),
  };
};

const getColors = () => { // todo set charts color
  if (getTheme() === THEMES.dark) {
    return {
      bg: 'transparent',
      color: '#fff',
      line: '#fff',
      vertLine: 'rgba(255, 255, 255, 0.6)',
    };
  }
  return {
    bg: 'transparent',
    color: 'rgba(0,0,0,0.2)',
    line: '#fff',
    vertLine: 'rgba(0,0,0,0.3)',
  };
};

const renderCexChart = (container, data, setLabel) => {
  if (!data || !data.length) {
    return;
  }
  if (!container) {
    return;
  }
  // eslint-disable-next-line no-param-reassign
  container.innerHTML = '';
  const colors = getColors();
  const chart = createChart(container, {
    width: container.clientWidth,
    height: 200,
    layout: {
      textColor: colors.color,
      backgroundColor: colors.bg,
    },
    crosshair: {
      vertLine: {
        color: colors.vertLine,
        width: 0.2,
        style: 1,
        visible: true,
        labelVisible: false,
      },
      horzLine: {
        color: '#6A5ACD',
        width: 0.5,
        style: 0,
        visible: false,
        labelVisible: false,
      },
      mode: 1,
    },
    grid: {
      horzLines: {
        color: '#eee',
        visible: false,
      },
      vertLines: {
        color: '#ffffff',
        visible: false,
      },
    },
    handleScroll: {
      mouseWheel: false,
      pressedMouseMove: false,
    },
    handleScale: {
      axisPressedMouseMove: false,
      mouseWheel: false,
      pinch: false,
    },
    vertLine: {
      visible: false,
      style: 0,
      width: 2,
      color: 'rgba(32, 38, 46, 0.1)',
      labelVisible: false,
    },
    rightPriceScale: {
      scaleMargins: {
        top: 0.35,
        bottom: 0.2,
      },
      borderVisible: false,
    },
    priceLineVisible: false,
    lastValueVisible: false,
    timeScale: {
      rightOffset: 2,
      lockVisibleTimeRangeOnResize: true,
      rightBarStaysOnScroll: true,
      borderVisible: false,
      borderColor: '#fff000',
      visible: true,
      timeVisible: true,
      secondsVisible: false,
    },
  });

  const candleSeries = chart.addCandlestickSeries({
    upColor: '#00C076',
    downColor: '#F84960',
    borderVisible: false,
    wickVisible: true,
    borderColor: '#00C076',
    // wickColor: "#00C076",
    borderUpColor: '#00C076',
    borderDownColor: '#F84960',
    wickUpColor: '#00C076',
    wickDownColor: '#F84960',
  });

  candleSeries.setData(data);
  candleSeries.applyOptions({
    priceLineVisible: false,
    lastValueVisible: false,
    priceLineWidth: 2,
    priceLineColor: '#4682B4',
    priceLineStyle: 3,
  });
  chart.subscribeCrosshairMove((item) => {
    setLabel(getCexPoint(item));
  });
};

export default renderCexChart;
