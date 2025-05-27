import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Archivos de traducción

// Categorías
import frCategorias from './locales/fr/categorias.json';
import enCategorias from './locales/en/categorias.json';
import arCategorias from './locales/ar/categorias.json';
import esCategorias from './locales/es/categorias.json';

// Aplicación
import frAplicacion from './locales/fr/aplicacion.json';
import enAplicacion from './locales/en/aplicacion.json';
import arAplicacion from './locales/ar/aplicacion.json';
import esAplicacion from './locales/es/aplicacion.json';

// PostDetail
import frPostDetail from './locales/fr/postDetail.json';
import enPostDetail from './locales/en/postDetail.json';
import arPostDetail from './locales/ar/postDetail.json';
import esPostDetail from './locales/es/postDetail.json';

const resources = {
  fr: {
    categorias: frCategorias,
    aplicacion: frAplicacion,
    postDetail: frPostDetail,
  },
  en: {
    categorias: enCategorias,
    aplicacion: enAplicacion,
    postDetail: enPostDetail,
  },
  ar: {
    categorias: arCategorias,
    aplicacion: arAplicacion,
    postDetail: arPostDetail,
  },
  es: {
    categorias: esCategorias,
    aplicacion: esAplicacion,
    postDetail: esPostDetail,
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr', // Idioma por defecto
    fallbackLng: 'en',
    
    // Namespaces usados en la app
    ns: ['categorias', 'aplicacion', 'postDetail'],
    defaultNS: 'categorias', // Namespace por defecto

    keySeparator: '.', // Para acceder a claves anidadas tipo "menu.opciones"
    nsSeparator: ':', // Para usar namespace:clave

    interpolation: {
      escapeValue: false // React ya se encarga de la sanitización
    },

    partialBundledLanguages: true,

    parseMissingKeyHandler: (key) => {
      console.warn(`⚠️ Traducción faltante: ${key}`);
      return key;
    }
  });

export default i18n;
