import { formatDateLabel } from '@/utils/format';
import { getTheme, THEMES } from '@/utils/theme';
import { createChart, PriceScaleMode, LineStyle } from 'lightweight-charts';

const formatPairCode = (pair) => pair.replace(/.*?\//gi, '');

export const getSpreadPoint = (item, pair) => {
  const { time } = item;
  if (!time) {
    return {
      time: '',
      price: '',
    };
  }
  const { value } = item.seriesPrices ? item.seriesPrices.entries()
    .next() : item;
  const date = new Date(time * 1000);
  return {
    time: formatDateLabel(new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000), 'yyyy/MM/dd hh:mm:ss'),
    price: ((value && value[1]) || '') + formatPairCode(pair),
  };
};

const getColors = () => {
  if (getTheme() === THEMES.dark) {
    return {
      bg: 'transparent',
      color: '#fff',
      vertLine: 'rgba(255, 255, 255, 0.6)',
    };
  }
  return {
    bg: 'transparent',
    color: 'rgba(0,0,0,0.2)',
    vertLine: 'rgba(0,0,0,0.3)',
  };
};

const renderSpreadChart = (container, data, setLabel, pair) => {
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
    rightPriceScale: {
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
      mode: PriceScaleMode.Normal,
      borderColor: 'rgba(197, 203, 206, 0.2)',
      borderVisible: false,
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
    grid: {
      vertLines: {
        color: 'rgba(197, 203, 206, 0.2)',
        style: LineStyle.Dotted,
        visible: false,
      },
      horzLines: {
        color: 'rgba(197, 203, 206, 0.2)',
        style: LineStyle.Dotted,
        visible: false,
      },
    },
    baseLineVisible: true,
    baseLineColor: '#ff0000',
    baseLineWidth: 3,
    baseLineStyle: 1,
  });

  const areaSeries = chart.addAreaSeries({
    topColor: 'rgba(50,197,255,0.1)',
    bottomColor: 'rgba(50,197,255,0)',
    lineColor: 'rgba(50,197,255,1)',
    lineWidth: 2,
    priceLineVisible: false,
    lastValueVisible: false,
    crosshairMarkerVisible: true,
    crosshairMarkerRadius: 3,
    baseLineVisible: true,
    baseLineColor: 'rgba(0,0,0,0.3)',
    baseLineWidth: 0.2,
    baseLineStyle: LineStyle.Solid,
  });
  areaSeries.setData(data);
  chart.subscribeCrosshairMove((item) => {
    setLabel(getSpreadPoint(item, pair));
  });
};

export default renderSpreadChart;
