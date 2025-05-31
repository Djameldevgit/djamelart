import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Importaciones organizadas alfabéticamente por idioma
import arComponentstatusmodal from './locales/ar/componentstatusmodal.json';
import chComponentstatusmodal from './locales/ch/componentstatusmodal.json';
import enComponentstatusmodal from './locales/en/componentstatusmodal.json';
import esComponentstatusmodal from './locales/es/componentstatusmodal.json';
import frComponentstatusmodal from './locales/fr/componentstatusmodal.json';
import kaComponentstatusmodal from './locales/ka/componentstatusmodal.json';
import ruComponentstatusmodal from './locales/ru/componentstatusmodal.json';

import frSubcategorias from './locales/fr/subcategorias.json';
import enSubcategorias from './locales/en/subcategorias.json';
import arSubcategorias from './locales/ar/subcategorias.json';
import esSubcategorias from './locales/es/subcategorias.json';
import ruSubcategorias from './locales/ru/subcategorias.json';      // Nuevo
import kaSubcategorias from './locales/ka/subcategorias.json';      // Nuevo
import chSubcategorias from './locales/ch/subcategorias.json'; 
// Categorías
import frCategorias from './locales/fr/categorias.json';
import enCategorias from './locales/en/categorias.json';
import arCategorias from './locales/ar/categorias.json';
import esCategorias from './locales/es/categorias.json';
import ruCategorias from './locales/ru/categorias.json';      // Nuevo
import kaCategorias from './locales/ka/categorias.json';      // Nuevo
import chCategorias from './locales/ch/categorias.json';      // Nuevo

// Aplicación
import frAplicacion from './locales/fr/aplicacion.json';
import enAplicacion from './locales/en/aplicacion.json';
import arAplicacion from './locales/ar/aplicacion.json';
import esAplicacion from './locales/es/aplicacion.json';
import ruAplicacion from './locales/ru/aplicacion.json';     // Nuevo
import kaAplicacion from './locales/ka/aplicacion.json';     // Nuevo
import chAplicacion from './locales/ch/aplicacion.json';     // Nuevo

// PostDetail
import frPostDetail from './locales/fr/postDetail.json';
import enPostDetail from './locales/en/postDetail.json';
import arPostDetail from './locales/ar/postDetail.json';
import esPostDetail from './locales/es/postDetail.json';
import ruPostDetail from './locales/ru/postDetail.json';     // Nuevo
import kaPostDetail from './locales/ka/postDetail.json';     // Nuevo
import chPostDetail from './locales/ch/postDetail.json';     // Nuevo

// Comments y Navbar
import frComments from './locales/fr/comments.json';
import enComments from './locales/en/comments.json';
import arComments from './locales/ar/comments.json';
import esComments from './locales/es/comments.json';
import ruComments from './locales/ru/comments.json';         // Nuevo
import kaComments from './locales/ka/comments.json';         // Nuevo
import chComments from './locales/ch/comments.json';         // Nuevo

import frNavbar from './locales/fr/navbar.json';
import enNavbar from './locales/en/navbar.json';
import arNavbar from './locales/ar/navbar.json';
import esNavbar from './locales/es/navbar.json';
import ruNavbar from './locales/ru/navbar.json';             // Nuevo
import kaNavbar from './locales/ka/navbar.json';             // Nuevo
import chNavbar from './locales/ch/navbar.json';             // Nuevo

const resources = {
  ar: {
    categorias: arCategorias,
    aplicacion: arAplicacion,
    postDetail: arPostDetail,
    comments: arComments,
    navbar: arNavbar,
    subcategorias: arSubcategorias,
    componentstatusmodal: arComponentstatusmodal
  },
  ch: {
    categorias: chCategorias,
    aplicacion: chAplicacion,
    postDetail: chPostDetail,
    comments: chComments,
    navbar: chNavbar,
    subcategorias: chSubcategorias,
    componentstatusmodal: chComponentstatusmodal
  },
  en: {
    categorias: enCategorias,
    aplicacion: enAplicacion,
    postDetail: enPostDetail,
    comments: enComments,
    navbar: enNavbar,
    subcategorias: enSubcategorias,
    componentstatusmodal: enComponentstatusmodal
  },
  es: {
    categorias: esCategorias,
    aplicacion: esAplicacion,
    postDetail: esPostDetail,
    comments: esComments,
    navbar: esNavbar,
    subcategorias: esSubcategorias,
    componentstatusmodal: esComponentstatusmodal
  },
  fr: {
    categorias: frCategorias,
    aplicacion: frAplicacion,
    postDetail: frPostDetail,
    comments: frComments,
    navbar: frNavbar,
    subcategorias: frSubcategorias,
    componentstatusmodal: frComponentstatusmodal
  },
  ka: {
    categorias: kaCategorias,
    aplicacion: kaAplicacion,
    postDetail: kaPostDetail,
    comments: kaComments,
    navbar: kaNavbar,
    subcategorias: kaSubcategorias,
    componentstatusmodal: kaComponentstatusmodal
  },
  ru: {
    categorias: ruCategorias,
    aplicacion: ruAplicacion,
    postDetail: ruPostDetail,
    comments: ruComments,
    navbar: ruNavbar,
    subcategorias: ruSubcategorias,
    componentstatusmodal: ruComponentstatusmodal
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr',
    fallbackLng: 'en',
    supportedLngs: ['fr', 'en', 'ar', 'es', 'ru', 'ka', 'ch'],
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;