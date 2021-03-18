const DARK_CLASS = 'g-dark';
const CACHE_NAME = 'dapp-local-theme';

let changeListener = () => {
};

export const THEMES = {
  dark: 'dark',
  light: 'light',
};

const DEFAULT_THEME = THEMES.dark;

export const getTheme = () => localStorage.getItem(CACHE_NAME) || DEFAULT_THEME;

export const changeTheme = () => {
  if (getTheme() === THEMES.dark) {
    document.body.classList.remove(DARK_CLASS);
    localStorage.setItem(CACHE_NAME, THEMES.light);
  } else {
    document.body.classList.add(DARK_CLASS);
    localStorage.setItem(CACHE_NAME, THEMES.dark);
  }
  changeListener();
};

export const initTheme = () => {
  if (getTheme() === THEMES.dark) {
    document.body.classList.add(DARK_CLASS);
  }
};

export const addThemeListener = (listener) => {
  changeListener = listener;
};
