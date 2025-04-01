import i18next from "i18next";
import Backend from "i18next-fs-backend";
import path from "path";

i18next
  .use(Backend)
  .init({
    fallbackLng: "en",
    backend: {
      loadPath: path.join(__dirname, "../locales/{{lng}}/{{ns}}.json"),
    },
    ns: ["common", "file", "auth", "job"],
    defaultNS: "common",
    preload: ["en", "fr"],
    saveMissing: true,
    debug: process.env.NODE_ENV === "development",
  });

export { i18next };
