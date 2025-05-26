import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Importaciones de francés
import frHeader from './locales/fr/header.json';
import frCategorias from './locales/fr/categorias.json';
import frSubcategorias from './locales/fr/subcategorias.json';
import frStatusModal from './locales/fr/statusmodal.json';
import frDescripcion from './locales/fr/descripcion.json';

// Importaciones de inglés
import enHeader from './locales/en/header.json';
import enCategorias from './locales/en/categorias.json';
import enSubcategorias from './locales/en/subcategorias.json';
import enStatusModal from './locales/en/statusmodal.json';
import enDescripcion from './locales/en/descripcion.json';

// Importaciones de árabe
import arHeader from './locales/ar/header.json';
import arCategorias from './locales/ar/categorias.json';
import arSubcategorias from './locales/ar/subcategorias.json';
import arStatusModal from './locales/ar/statusmodal.json';
import arDescripcion from './locales/ar/descripcion.json';

import esHeader from './locales/es/header.json';
import esCategorias from './locales/es/categorias.json';
 
import esStatusModal from './locales/es/statusmodal.json';
import esDescripcion from './locales/es/descripcion.json';

const resources = {
  fr: {
    header: frHeader,
    categorias: frCategorias,
    subcategorias: frSubcategorias,
    statusmodal: frStatusModal,
    descripcion: frDescripcion
  },
  en: {
    header: enHeader,
    categorias: enCategorias,
    subcategorias: enSubcategorias,
    statusmodal: enStatusModal,
    descripcion: enDescripcion
  },
  ar: {
    header: arHeader,
    categorias: arCategorias,
    subcategorias: arSubcategorias,
    statusmodal: arStatusModal,
    descripcion: arDescripcion
  },
  es: {
    header: esHeader,
    categorias: esCategorias,
  
    statusmodal: esStatusModal,
    descripcion: esDescripcion
  }


};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr', // Idioma por defecto
    fallbackLng: 'en',
    
    // Namespaces configurados correctamente
    ns: ['header', 'categorias', 'support'],
    defaultNS: 'categorias', // Solo UN defaultNS
  
    // Configuración clave para anidados:
    keySeparator: '.', // Habilita notación de puntos para objetos anidados
    nsSeparator: ':', // Separador de namespaces
 





    interpolation: {
      escapeValue: false // React ya protege contra XSS
    },
    
    // Opcional: Para mejor rendimiento con muchos namespaces
    partialBundledLanguages: true,
    parseMissingKeyHandler: (key) => {
      console.warn(`Traducción faltante: ${key}`);
      return key;
    }
  });

export default i18n;