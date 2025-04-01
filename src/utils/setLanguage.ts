const { i18next } = require('../config/i18next');
const setLanguageMiddleware = (req, res, next) => {
    const lang = req.query.lng || 'en';
    req.language = lang;
    i18next.changeLanguage(lang);
    next();
};
module.exports = setLanguageMiddleware
  