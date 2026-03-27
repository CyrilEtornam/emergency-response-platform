const isDev = process.env.NODE_ENV === 'development';

const logger = {
  info: (...args) => {
    if (isDev) console.info('[GhanaERS]', ...args);
  },
  warn: (...args) => {
    if (isDev) console.warn('[GhanaERS]', ...args);
  },
  error: (...args) => {
    // Always log errors so they appear in dev tools even in production builds
    if (isDev) console.error('[GhanaERS]', ...args);
  },
  debug: (...args) => {
    if (isDev) console.debug('[GhanaERS]', ...args);
  },
};

export default logger;
