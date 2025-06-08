const ACCESS_KEY = 'access';
const REFRESH_KEY = 'refresh';
const USER_KEY = 'user';

export const getStorage = () => {
  return localStorage.getItem(REFRESH_KEY) ? localStorage : sessionStorage;
};

export const saveTokens = (access, refresh, remember) => {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(ACCESS_KEY, access);
  storage.setItem(REFRESH_KEY, refresh);
};

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_KEY) || sessionStorage.getItem(ACCESS_KEY);
};

export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_KEY) || sessionStorage.getItem(REFRESH_KEY);
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  sessionStorage.removeItem(ACCESS_KEY);
  sessionStorage.removeItem(REFRESH_KEY);
};

export const saveUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = () => {
  return JSON.parse(localStorage.getItem(USER_KEY));
};

export const clearUser = () => {
  localStorage.removeItem(USER_KEY);
};
