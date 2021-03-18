import { formatDateLabel } from '@/utils/format';
import { getTheme, THEMES } from '@/utils/theme';
import { createChart } from 'lightweight-charts';

export const getMarketPoint = (item) => {
  const { time } = item;
  if (!time) {
    return {
      price: '',
      time: '',
    };
  }
  const { value } = item.seriesPrices ? item.seriesPrices.entries()
    .next() : item;
  const date = new Date(time * 1000);
  return {
    price: (value && value[1]) || value || '',
    time: formatDateLabel(new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000), 'yyyy/MM/dd hh:mm:ss'),
  };
};

const getColors = () => {
  if (getTheme() === THEMES.dark) {
    return {
      bg: 'transparent',
      color: '#fff',
      line: '#fff',
      topColor: 'rgba(255, 255, 255, 0.1)',
      bottomColor: 'rgba(255, 255, 255, 0)',
      vertLine: 'rgba(255, 255, 255, 0.6)',
    };
  }
  return {
    bg: 'transparent',
    color: 'rgba(0,0,0,0.2)',
    line: 'rgba(0, 0, 0, 1.0)',
    topColor: 'rgba(0, 0, 0, 0.1)',
    bottomColor: 'rgba(0, 0, 0, 0.0)',
    vertLine: 'rgba(0,0,0,0.3)',
  };
};

const renderMarketChart = (container, data, setLabel) => {
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
    handleScroll: {
      mouseWheel: false,
      pressedMouseMove: false,
    },
    handleScale: {
      axisPressedMouseMove: false,
      mouseWheel: false,
      pinch: false,
    },
    layout: {
      textColor: colors.color,
      backgroundColor: colors.bg,
    },
    rightPriceScale: {
      scaleMargins: {
        top: 0.35,
        bottom: 0.2,
      },
      borderVisible: false,
    },
    timeScale: {
      rightOffset: 2,
      borderVisible: false,
      lockVisibleTimeRangeOnResize: false,
      visible: true,
      timeVisible: true,
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
  });

  const series = chart.addAreaSeries({
    priceLineVisible: false,
    lastValueVisible: false,
    lineWidth: 2,
    topColor: colors.topColor,
    bottomColor: colors.bottomColor,
    lineColor: colors.line,
    crosshairMarkerVisible: true,
    crosshairMarkerRadius: 3,
  });
  series.setData(data);
  chart.subscribeCrosshairMove((item) => {
    setLabel(getMarketPoint(item));
  });
};

export default renderMarketChart;
