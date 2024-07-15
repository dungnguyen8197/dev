import { languageKey, REFRESH_TOKEN_KEY, TOKEN_KEY } from "config/keys";

const setLanguage = (language) => localStorage.setItem(languageKey, language);
const getLanguage = () => localStorage.getItem(languageKey);

const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
const getToken = () => localStorage.getItem(TOKEN_KEY);

const setRefreshToken = (refreshToken) => localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export { setLanguage, getLanguage, setToken, getToken, setRefreshToken, getRefreshToken };
