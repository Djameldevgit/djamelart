import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getDataAPI } from "../utils/fetchData";
import { GLOBALTYPES } from "../redux/actions/globalTypes";
import { POST_TYPES } from '../redux/actions/postAction';
import UserCard from "../components/UserCard";
import Posts from "../components/home/Posts";
import { useTranslation } from "react-i18next";
import {
  Container,
  Form,
  Button,
  Spinner,
  Alert,
  Row,
  Col,
  Card,
  Badge
} from "react-bootstrap";

import LoadIcon from "../images/loading.gif";

// 🔹 FUNCIÓN AUXILIAR PARA NORMALIZAR TEXTO (maneja mayúsculas, minúsculas y acentos)
const normalizeText = (text) => {
  if (!text) return '';
  
  return text
    .trim()
    .toLowerCase()
    .normalize("NFD") // Separar acentos de letras
    .replace(/[\u0300-\u036f]/g, ""); // Eliminar diacríticos
};

export default function search() {
  const { auth, languageReducer, homePosts } = useSelector(state => state);
  const { t } = useTranslation('search');
  const lang = languageReducer.language || 'es';
  const isRTL = lang === 'ar';

  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState({
    painting: false,
    sculpture: false,
    photography: false,
    drawing: false,
    engraving: false,
    digital_art: false,
    collage: false,
    textile_art: false,
  });
  
  // 🔹 NUEVOS ESTADOS PARA LOS CAMPOS ADICIONALES
  const [theme, setTheme] = useState("");
  const [style, setStyle] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [artType, setArtType] = useState("");
  const [material, setMaterial] = useState("");
  const [technique, setTechnique] = useState("");
  const [orientation, setOrientation] = useState("");
  const [size, setSize] = useState("");
  const [year, setYear] = useState("");
  const [tags, setTags] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [error, setError] = useState(null);

  const [users, setUsers] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState(false);

  // 🔹 Contar filtros activos (actualizado con nuevos campos)
  const activeFiltersCount = [
    search,
    theme,
    style,
    priceMin,
    priceMax,
    wilaya,
    artType,
    material,
    technique,
    orientation,
    size,
    year,
    tags,
    ...Object.values(categories).filter(Boolean)
  ].filter(Boolean).length;

  // 🔹 Cargar posts iniciales al montar el componente
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setInitialLoading(true);
        
        // Si ya hay posts en Redux, usarlos
        if (homePosts.posts.length > 0) {
          setFilteredPosts(homePosts.posts);
        } else {
          // Si no hay posts, cargarlos
          const res = await getDataAPI('posts?limit=9', auth.token);
          setFilteredPosts(res.data.posts || []);
          
          // También actualizar Redux store
          dispatch({
            type: POST_TYPES.GET_POSTS,
            payload: { ...res.data, page: 1 }
          });
        }
      } catch (err) {
        console.error("Error loading initial posts:", err);
        setError(t('errors.loadingPosts', { lng: lang }));
      } finally {
        setInitialLoading(false);
      }
    };

    loadInitialData();
  }, [auth.token, dispatch, t, homePosts.posts.length, lang]);

  // 🔹 Manejar cambio de categorías
  const handleCategoryChange = (category) => {
    setCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // 🔹 BUSCAR POSTS CON FILTROS - ACTUALIZADO PARA MANEJAR MAYÚSCULAS Y ACENTOS
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Si la búsqueda está vacía, mostrar todos los posts
      if (!search && !theme && !style && !priceMin && !priceMax && !wilaya && 
          !artType && !material && !technique && !orientation && !size && 
          !year && !tags && !Object.values(categories).some(Boolean)) {
        
        setFilteredPosts(homePosts.posts);
        setLoading(false);
        return;
      }

      const query = {
        // 🔹 NORMALIZAR EL TEXTO DE BÚSQUEDA
        search: normalizeText(search) || "",
        theme: normalizeText(theme) || "",
        style: normalizeText(style) || "",
        wilaya: normalizeText(wilaya) || "",
        artType: normalizeText(artType) || "",
        material: normalizeText(material) || "",
        technique: normalizeText(technique) || "",
        orientation: normalizeText(orientation) || "",
        size: normalizeText(size) || "",
        year: year || "",
        tags: normalizeText(tags) || "",
        sortBy: sortBy || "createdAt",
        sortOrder: sortOrder || "desc",
        page: 1,
      };

      if (priceMin) query.minPrice = priceMin;
      if (priceMax) query.maxPrice = priceMax;

      // Agregar categorías seleccionadas
      Object.keys(categories).forEach(category => {
        if (categories[category]) {
          query[category] = "true";
        }
      });

      const params = new URLSearchParams();
      Object.entries(query).forEach(([key, value]) => {
        if (value !== "" && value !== undefined && value !== false) {
          params.append(key, value);
        }
      });

      const res = await getDataAPI(`posts?${params.toString()}`, auth.token);
      setFilteredPosts(res.data.posts || []);
    } catch (err) {
      setError(t('errors.searchError', { lng: lang }));
    } finally {
      setLoading(false);
    }
  };

  // 🔹 BUSCAR USUARIOS EN VIVO - ACTUALIZADO PARA MANEJAR MAYÚSCULAS Y ACENTOS
  const handleUserSearch = async (value) => {
    setSearch(value);
    if (!value) {
      setUsers([]);
      return;
    }

    try {
      setUserLoading(true);
      // 🔹 NORMALIZAR EL TEXTO DE BÚSQUEDA PARA USUARIOS
      const normalizedSearch = normalizeText(value);
      const res = await getDataAPI(`search?username=${encodeURIComponent(normalizedSearch)}`, auth.token);
      setUsers(res.data.users || []);
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: t('errors.userSearchError', { lng: lang }) },
      });
    } finally {
      setUserLoading(false);
    }
  };

  // 🔹 Resetear filtros (ACTUALIZADO)
  const handleReset = () => {
    setSearch("");
    setCategories({
      painting: false,
      sculpture: false,
      photography: false,
      drawing: false,
      engraving: false,
      digital_art: false,
      collage: false,
      textile_art: false,
    });
    setTheme("");
    setStyle("");
    setPriceMin("");
    setPriceMax("");
    setWilaya("");
    setArtType("");
    setMaterial("");
    setTechnique("");
    setOrientation("");
    setSize("");
    setYear("");
    setTags("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setUsers([]);
    setError(null);
    
    // Al resetear, mostrar todos los posts disponibles
    setFilteredPosts(homePosts.posts);
  };

  return (
    <Container 
      fluid 
      className={`py-3 ${isRTL ? 'rtl' : ''}`} 
      style={{ 
        maxWidth: '1400px', 
        direction: isRTL ? 'rtl' : 'ltr' 
      }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* 🔹 HEADER MEJORADO CON GRADIENTE */}
      <div 
        className="sticky-top shadow-sm py-3 mb-3" 
        style={{ 
          zIndex: 1020,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '0 0 15px 15px',
        }}
      >
        <Row className="align-items-center px-3">
          <Col md={4} className="mb-3 mb-md-0">
            <div className="d-flex align-items-center">
              <h4 className="mb-0 text-white fw-bold">
                <i className={`fas fa-search ${isRTL ? 'ms-2' : 'me-2'}`}></i>
                {t("header.title", { lng: lang })}
              </h4>
              {activeFiltersCount > 0 && (
                <Badge 
                  bg="light" 
                  text="dark"
                  className={isRTL ? 'me-2' : 'ms-2'}
                  style={{
                    fontSize: '0.75rem',
                    padding: '0.35rem 0.65rem',
                    borderRadius: '20px'
                  }}
                >
                  {activeFiltersCount} {t("header.filtersActive", { lng: lang })}
                </Badge>
              )}
            </div>
          </Col>
          
          <Col md={8}>
            <Form onSubmit={handleSearch}>
              <Row className="g-2">
                <Col md={6}>
                  <div className="position-relative">
                    <Form.Control
                      type="text"
                      placeholder={t("search.placeholder", { lng: lang })}
                      value={search}
                      onChange={(e) => handleUserSearch(e.target.value)}
                      style={{
                        borderRadius: '25px',
                        paddingLeft: isRTL ? '1rem' : '2.5rem',
                        paddingRight: isRTL ? '2.5rem' : '1rem',
                        border: '2px solid rgba(255,255,255,0.3)',
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        transition: 'all 0.3s ease',
                        textAlign: isRTL ? 'right' : 'left'
                      }}
                      onFocus={(e) => {
                        e.target.style.backgroundColor = 'white';
                        e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                      }}
                      onBlur={(e) => {
                        e.target.style.backgroundColor = 'rgba(255,255,255,0.95)';
                        e.target.style.boxShadow = 'none';
                      }}
                      // 🔹 ATRIBUTOS PARA PREVENIR AUTOCAPITALIZE EN ANDROID
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="none"
                      spellCheck="false"
                    />
                    <i 
                      className={`fas fa-search position-absolute`} 
                      style={{
                        [isRTL ? 'right' : 'left']: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#667eea',
                        fontSize: '1rem'
                      }}
                    ></i>
                  </div>
                </Col>
                <Col md={2}>
                  <Button 
                    type="submit" 
                    disabled={loading} 
                    className="w-100"
                    style={{
                      borderRadius: '25px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(245, 87, 108, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(245, 87, 108, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(245, 87, 108, 0.3)';
                    }}
                  >
                    {loading ? <Spinner animation="border" size="sm" /> : t("buttons.search", { lng: lang })}
                  </Button>
                </Col>
                <Col md={2}>
                  <Button
                    variant="light"
                    onClick={() => setFiltersExpanded(!filtersExpanded)}
                    className="w-100"
                    style={{
                      borderRadius: '25px',
                      border: '2px solid rgba(255,255,255,0.5)',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <i className={`fas fa-${filtersExpanded ? 'chevron-up' : 'sliders-h'} ${isRTL ? 'ms-2' : 'me-2'}`}></i>
                    {filtersExpanded ? t("buttons.hide", { lng: lang }) : t("buttons.filters", { lng: lang })}
                  </Button>
                </Col>
                <Col md={2}>
                  <Button
                    variant="outline-light"
                    onClick={() => setAdvancedFilters(!advancedFilters)}
                    className="w-100"
                    style={{
                      borderRadius: '25px',
                      border: '2px solid rgba(255,255,255,0.5)',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(255,255,255,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <i className={`fas fa-${advancedFilters ? 'cog' : 'cogs'} ${isRTL ? 'ms-2' : 'me-2'}`}></i>
                    {t("buttons.advanced", { lng: lang })}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </div>

      {/* 🔹 FILTROS EXPANDIBLES MEJORADOS */}
      {filtersExpanded && (
        <Card 
          className="mb-3 border-0 shadow-lg"
          style={{
            borderRadius: '15px',
            overflow: 'hidden',
            animation: 'slideDown 0.3s ease-out'
          }}
        >
          <Card.Body className="py-4" style={{ background: 'linear-gradient(to bottom, #f8f9fa, #ffffff)' }}>
            <Row className="g-3">
              {/* 🔹 Búsqueda de Usuarios - Resultados Mejorados */}
              {users.length > 0 && (
                <Col md={12}>
                  <Card 
                    className="border-0 shadow-sm"
                    style={{ borderRadius: '12px' }}
                  >
                    <Card.Header 
                      className="py-2"
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        borderRadius: '12px 12px 0 0'
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="fw-bold">
                          <i className={`fas fa-users ${isRTL ? 'ms-2' : 'me-2'}`}></i>
                          {t("users.title", { lng: lang })}
                        </small>
                        <Button 
                          variant="link" 
                          size="sm" 
                          onClick={() => setUsers([])} 
                          className="p-0 text-white"
                          style={{ fontSize: '1.5rem', lineHeight: '1' }}
                        >
                          ×
                        </Button>
                      </div>
                    </Card.Header>
                    <Card.Body className="py-2">
                      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {users.map(user => (
                          <UserCard key={user._id} user={user} compact />
                        ))}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              )}

              {/* 🔹 Categorías con Estilo de Pills */}
              <Col md={12}>
                <div className="mb-3">
                  <div className="d-flex align-items-center mb-3">
                    <i className={`fas fa-palette ${isRTL ? 'ms-2' : 'me-2'}`} style={{ color: '#667eea', fontSize: '1.2rem' }}></i>
                    <Form.Label className="fw-bold mb-0" style={{ fontSize: '1rem', color: '#333' }}>
                      {t("categories.title", { lng: lang })}
                    </Form.Label>
                  </div>
                  <Row className="g-2">
                    {Object.keys(categories).map(category => (
                      <Col xs={6} sm={4} md={3} key={category}>
                        <div
                          onClick={() => handleCategoryChange(category)}
                          style={{
                            padding: '0.6rem 1rem',
                            borderRadius: '25px',
                            border: categories[category] 
                              ? '2px solid #667eea' 
                              : '2px solid #e0e0e0',
                            background: categories[category]
                              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                              : 'white',
                            color: categories[category] ? 'white' : '#666',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            textAlign: 'center',
                            fontSize: '0.85rem',
                            fontWeight: categories[category] ? '600' : '500',
                            boxShadow: categories[category] 
                              ? '0 4px 12px rgba(102, 126, 234, 0.3)' 
                              : 'none'
                          }}
                          onMouseEnter={(e) => {
                            if (!categories[category]) {
                              e.target.style.borderColor = '#667eea';
                              e.target.style.transform = 'translateY(-2px)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!categories[category]) {
                              e.target.style.borderColor = '#e0e0e0';
                              e.target.style.transform = 'translateY(0)';
                            }
                          }}
                        >
                          {categories[category] && <i className={`fas fa-check ${isRTL ? 'ms-1' : 'me-1'}`}></i>}
                          {t(`categories.${category}`, { lng: lang })}
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              </Col>

              {/* 🔹 FILTROS BÁSICOS */}
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="small fw-semibold text-muted">
                    <i className={`fas fa-tag ${isRTL ? 'ms-1' : 'me-1'}`}></i>
                    {t("filters.theme", { lng: lang })}
                  </Form.Label>
                  <Form.Select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    style={{
                      borderRadius: '10px',
                      border: '2px solid #e0e0e0',
                      transition: 'all 0.3s ease',
                      textAlign: isRTL ? 'right' : 'left'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  >
                    <option value="">{t("filters.allThemes", { lng: lang })}</option>
                    <option value="abstract">{t("filters.themes.abstract", { lng: lang })}</option>
                    <option value="landscape">{t("filters.themes.landscape", { lng: lang })}</option>
                    <option value="portrait">{t("filters.themes.portrait", { lng: lang })}</option>
                    <option value="still_life">{t("filters.themes.still_life", { lng: lang })}</option>
                    <option value="urban">{t("filters.themes.urban", { lng: lang })}</option>
                    <option value="surreal">{t("filters.themes.surreal", { lng: lang })}</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label className="small fw-semibold text-muted">
                    <i className={`fas fa-brush ${isRTL ? 'ms-1' : 'me-1'}`}></i>
                    {t("filters.style", { lng: lang })}
                  </Form.Label>
                  <Form.Select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    style={{
                      borderRadius: '10px',
                      border: '2px solid #e0e0e0',
                      transition: 'all 0.3s ease',
                      textAlign: isRTL ? 'right' : 'left'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  >
                    <option value="">{t("filters.allStyles", { lng: lang })}</option>
                    <option value="realism">{t("filters.styles.realism", { lng: lang })}</option>
                    <option value="impressionism">{t("filters.styles.impressionism", { lng: lang })}</option>
                    <option value="expressionism">{t("filters.styles.expressionism", { lng: lang })}</option>
                    <option value="cubism">{t("filters.styles.cubism", { lng: lang })}</option>
                    <option value="surrealism">{t("filters.styles.surrealism", { lng: lang })}</option>
                    <option value="abstract">{t("filters.styles.abstract", { lng: lang })}</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={2}>
                <Form.Group>
                  <Form.Label className="small fw-semibold text-muted">
                    <i className={`fas fa-coins ${isRTL ? 'ms-1' : 'me-1'}`}></i>
                    {t("filters.minPrice", { lng: lang })}
                  </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder={t("filters.pricePlaceholder", { lng: lang })}
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    style={{
                      borderRadius: '10px',
                      border: '2px solid #e0e0e0',
                      transition: 'all 0.3s ease',
                      textAlign: isRTL ? 'right' : 'left'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  />
                </Form.Group>
              </Col>

              <Col md={2}>
                <Form.Group>
                  <Form.Label className="small fw-semibold text-muted">
                    <i className={`fas fa-coins ${isRTL ? 'ms-1' : 'me-1'}`}></i>
                    {t("filters.maxPrice", { lng: lang })}
                  </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder={t("filters.maxPricePlaceholder", { lng: lang })}
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    style={{
                      borderRadius: '10px',
                      border: '2px solid #e0e0e0',
                      transition: 'all 0.3s ease',
                      textAlign: isRTL ? 'right' : 'left'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  />
                </Form.Group>
              </Col>

              <Col md={2}>
                <Form.Group>
                  <Form.Label className="small fw-semibold text-muted">
                    <i className={`fas fa-map-marker-alt ${isRTL ? 'ms-1' : 'me-1'}`}></i>
                    {t("filters.location", { lng: lang })}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={t("filters.locationPlaceholder", { lng: lang })}
                    value={wilaya}
                    onChange={(e) => setWilaya(e.target.value)}
                    style={{
                      borderRadius: '10px',
                      border: '2px solid #e0e0e0',
                      transition: 'all 0.3s ease',
                      textAlign: isRTL ? 'right' : 'left'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  />
                </Form.Group>
              </Col>

              {/* 🔹 FILTROS AVANZADOS */}
              {advancedFilters && (
                <>
                  <Col md={12}>
                    <hr />
                    <div className="d-flex align-items-center mb-3">
                      <i className={`fas fa-cogs ${isRTL ? 'ms-2' : 'me-2'}`} style={{ color: '#667eea', fontSize: '1.2rem' }}></i>
                      <h6 className="mb-0 fw-bold" style={{ color: '#333' }}>{t("advancedFilters.title", { lng: lang })}</h6>
                    </div>
                  </Col>

                  <Col md={3}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold text-muted">
                        <i className={`fas fa-paint-brush ${isRTL ? 'ms-1' : 'me-1'}`}></i>
                        {t("advancedFilters.artType", { lng: lang })}
                      </Form.Label>
                      <Form.Select
                        value={artType}
                        onChange={(e) => setArtType(e.target.value)}
                        style={{
                          borderRadius: '10px',
                          border: '2px solid #e0e0e0',
                          transition: 'all 0.3s ease',
                          textAlign: isRTL ? 'right' : 'left'
                        }}
                      >
                        <option value="">{t("advancedFilters.allTypes", { lng: lang })}</option>
                        <option value="oil_painting">{t("advancedFilters.artTypes.oil_painting", { lng: lang })}</option>
                        <option value="watercolor">{t("advancedFilters.artTypes.watercolor", { lng: lang })}</option>
                        <option value="acrylic">{t("advancedFilters.artTypes.acrylic", { lng: lang })}</option>
                        <option value="digital_art">{t("advancedFilters.artTypes.digital_art", { lng: lang })}</option>
                        <option value="sculpture">{t("advancedFilters.artTypes.sculpture", { lng: lang })}</option>
                        <option value="photography">{t("advancedFilters.artTypes.photography", { lng: lang })}</option>
                        <option value="drawing">{t("advancedFilters.artTypes.drawing", { lng: lang })}</option>
                        <option value="mixed_media">{t("advancedFilters.artTypes.mixed_media", { lng: lang })}</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold text-muted">
                        <i className={`fas fa-hammer ${isRTL ? 'ms-1' : 'me-1'}`}></i>
                        {t("advancedFilters.material", { lng: lang })}
                      </Form.Label>
                      <Form.Select
                        value={material}
                        onChange={(e) => setMaterial(e.target.value)}
                        style={{
                          borderRadius: '10px',
                          border: '2px solid #e0e0e0',
                          transition: 'all 0.3s ease',
                          textAlign: isRTL ? 'right' : 'left'
                        }}
                      >
                        <option value="">{t("advancedFilters.allMaterials", { lng: lang })}</option>
                        <option value="canvas">{t("advancedFilters.materials.canvas", { lng: lang })}</option>
                        <option value="paper">{t("advancedFilters.materials.paper", { lng: lang })}</option>
                        <option value="wood">{t("advancedFilters.materials.wood", { lng: lang })}</option>
                        <option value="metal">{t("advancedFilters.materials.metal", { lng: lang })}</option>
                        <option value="clay">{t("advancedFilters.materials.clay", { lng: lang })}</option>
                        <option value="stone">{t("advancedFilters.materials.stone", { lng: lang })}</option>
                        <option value="fabric">{t("advancedFilters.materials.fabric", { lng: lang })}</option>
                        <option value="digital">{t("advancedFilters.materials.digital", { lng: lang })}</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold text-muted">
                        <i className={`fas fa-magic ${isRTL ? 'ms-1' : 'me-1'}`}></i>
                        {t("advancedFilters.technique", { lng: lang })}
                      </Form.Label>
                      <Form.Select
                        value={technique}
                        onChange={(e) => setTechnique(e.target.value)}
                        style={{
                          borderRadius: '10px',
                          border: '2px solid #e0e0e0',
                          transition: 'all 0.3s ease',
                          textAlign: isRTL ? 'right' : 'left'
                        }}
                      >
                        <option value="">{t("advancedFilters.allTechniques", { lng: lang })}</option>
                        <option value="oil_painting">{t("advancedFilters.techniques.oil_painting", { lng: lang })}</option>
                        <option value="watercolor">{t("advancedFilters.techniques.watercolor", { lng: lang })}</option>
                        <option value="acrylic">{t("advancedFilters.techniques.acrylic", { lng: lang })}</option>
                        <option value="digital_painting">{t("advancedFilters.techniques.digital_painting", { lng: lang })}</option>
                        <option value="sculpting">{t("advancedFilters.techniques.sculpting", { lng: lang })}</option>
                        <option value="carving">{t("advancedFilters.techniques.carving", { lng: lang })}</option>
                        <option value="photography_digital">{t("advancedFilters.techniques.photography_digital", { lng: lang })}</option>
                        <option value="collage">{t("advancedFilters.techniques.collage", { lng: lang })}</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold text-muted">
                        <i className={`fas fa-arrows-alt ${isRTL ? 'ms-1' : 'me-1'}`}></i>
                        {t("advancedFilters.orientation", { lng: lang })}
                      </Form.Label>
                      <Form.Select
                        value={orientation}
                        onChange={(e) => setOrientation(e.target.value)}
                        style={{
                          borderRadius: '10px',
                          border: '2px solid #e0e0e0',
                          transition: 'all 0.3s ease',
                          textAlign: isRTL ? 'right' : 'left'
                        }}
                      >
                        <option value="">{t("advancedFilters.allOrientations", { lng: lang })}</option>
                        <option value="horizontal">{t("advancedFilters.orientations.horizontal", { lng: lang })}</option>
                        <option value="vertical">{t("advancedFilters.orientations.vertical", { lng: lang })}</option>
                        <option value="square">{t("advancedFilters.orientations.square", { lng: lang })}</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={2}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold text-muted">
                        <i className={`fas fa-expand ${isRTL ? 'ms-1' : 'me-1'}`}></i>
                        {t("advancedFilters.size", { lng: lang })}
                      </Form.Label>
                      <Form.Select
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        style={{
                          borderRadius: '10px',
                          border: '2px solid #e0e0e0',
                          transition: 'all 0.3s ease',
                          textAlign: isRTL ? 'right' : 'left'
                        }}
                      >
                        <option value="">{t("advancedFilters.allSizes", { lng: lang })}</option>
                        <option value="small">{t("advancedFilters.sizes.small", { lng: lang })}</option>
                        <option value="medium">{t("advancedFilters.sizes.medium", { lng: lang })}</option>
                        <option value="large">{t("advancedFilters.sizes.large", { lng: lang })}</option>
                        <option value="extra-large">{t("advancedFilters.sizes.extra_large", { lng: lang })}</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={2}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold text-muted">
                        <i className={`fas fa-calendar ${isRTL ? 'ms-1' : 'me-1'}`}></i>
                        {t("advancedFilters.year", { lng: lang })}
                      </Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="2024"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        min="1900"
                        max="2024"
                        style={{
                          borderRadius: '10px',
                          border: '2px solid #e0e0e0',
                          transition: 'all 0.3s ease',
                          textAlign: isRTL ? 'right' : 'left'
                        }}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold text-muted">
                        <i className={`fas fa-tags ${isRTL ? 'ms-1' : 'me-1'}`}></i>
                        {t("advancedFilters.tags", { lng: lang })}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder={t("advancedFilters.tagsPlaceholder", { lng: lang })}
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        style={{
                          borderRadius: '10px',
                          border: '2px solid #e0e0e0',
                          transition: 'all 0.3s ease',
                          textAlign: isRTL ? 'right' : 'left'
                        }}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={2}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold text-muted">
                        <i className={`fas fa-sort ${isRTL ? 'ms-1' : 'me-1'}`}></i>
                        {t("advancedFilters.sortBy", { lng: lang })}
                      </Form.Label>
                      <Form.Select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{
                          borderRadius: '10px',
                          border: '2px solid #e0e0e0',
                          transition: 'all 0.3s ease',
                          textAlign: isRTL ? 'right' : 'left'
                        }}
                      >
                        <option value="createdAt">{t("advancedFilters.sortOptions.createdAt", { lng: lang })}</option>
                        <option value="price">{t("advancedFilters.sortOptions.price", { lng: lang })}</option>
                        <option value="title">{t("advancedFilters.sortOptions.title", { lng: lang })}</option>
                        <option value="likesCount">{t("advancedFilters.sortOptions.likesCount", { lng: lang })}</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={2}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold text-muted">
                        <i className={`fas fa-sort-amount-down ${isRTL ? 'ms-1' : 'me-1'}`}></i>
                        {t("advancedFilters.order", { lng: lang })}
                      </Form.Label>
                      <Form.Select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        style={{
                          borderRadius: '10px',
                          border: '2px solid #e0e0e0',
                          transition: 'all 0.3s ease',
                          textAlign: isRTL ? 'right' : 'left'
                        }}
                      >
                        <option value="desc">{t("advancedFilters.orderOptions.desc", { lng: lang })}</option>
                        <option value="asc">{t("advancedFilters.orderOptions.asc", { lng: lang })}</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </>
              )}

              {/* 🔹 Botones de Acción Modernos */}
              <Col md={12}>
                <Row className="g-2 mt-2">
                  <Col md={6}>
                    <Button 
                      onClick={handleSearch}
                      disabled={loading} 
                      className="w-100"
                      style={{
                        borderRadius: '12px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        fontWeight: '600',
                        padding: '0.65rem',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
                      }}
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className={isRTL ? 'ms-2' : 'me-2'} />
                          {t("buttons.searching", { lng: lang })}
                        </>
                      ) : (
                        <>
                          <i className={`fas fa-search ${isRTL ? 'ms-2' : 'me-2'}`}></i>
                          {t("buttons.applyFilters", { lng: lang })}
                        </>
                      )}
                    </Button>
                  </Col>
                  <Col md={6}>
                    <Button
                      variant="outline-secondary"
                      onClick={handleReset}
                      disabled={loading}
                      className="w-100"
                      style={{
                        borderRadius: '12px',
                        border: '2px solid #e0e0e0',
                        fontWeight: '600',
                        padding: '0.65rem',
                        transition: 'all 0.3s ease',
                        color: '#666'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.borderColor = '#667eea';
                        e.target.style.color = '#667eea';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.borderColor = '#e0e0e0';
                        e.target.style.color = '#666';
                      }}
                    >
                      <i className={`fas fa-redo ${isRTL ? 'ms-2' : 'me-2'}`}></i>
                      {t("buttons.clearAll", { lng: lang })}
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* 🔹 MENSAJES DE ERROR MODERNOS */}
      {error && (
        <Alert 
          variant="danger" 
          className="py-3 mb-3 border-0"
          style={{
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
            color: 'white',
            boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)'
          }}
        >
          <i className={`fas fa-exclamation-circle ${isRTL ? 'ms-2' : 'me-2'}`}></i>
          <small className="fw-semibold">{error}</small>
        </Alert>
      )}

      {/* 🔹 RESULTADOS CON MEJOR PRESENTACIÓN */}
      <div className="mt-3">
        {initialLoading ? (
          <div className="text-center py-5">
            <img src={LoadIcon} alt="loading" className="d-block mx-auto" style={{ width: '80px' }} />
            <p className="mt-3 text-muted fw-semibold">{t("results.loadingPosts", { lng: lang })}</p>
          </div>
        ) : loading ? (
          <div className="text-center py-5">
            <Spinner 
              animation="border" 
              variant="primary" 
              style={{ 
                width: '3rem', 
                height: '3rem',
                borderWidth: '4px'
              }}
            />
            <p className="mt-3 text-muted fw-semibold">{t("results.searching", { lng: lang })}</p>
          </div>
        ) : filteredPosts.length > 0 ? (
          <>
            <div 
              className="d-flex justify-content-between align-items-center mb-4 p-3"
              style={{
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <h6 className="mb-0 fw-bold" style={{ color: '#333' }}>
                <i className={`fas fa-image ${isRTL ? 'ms-2' : 'me-2'}`} style={{ color: '#667eea' }}></i>
                {t("results.title", { lng: lang })}: 
                <Badge 
                  bg="primary" 
                  className={isRTL ? 'me-2' : 'ms-2'}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontSize: '0.9rem',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '20px'
                  }}
                >
                  {filteredPosts.length}
                </Badge>
              </h6>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                style={{
                  borderRadius: '20px',
                  border: '2px solid #667eea',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                  e.target.style.color = 'white';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#667eea';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <i className={`fas fa-arrow-up ${isRTL ? 'ms-1' : 'me-1'}`}></i> {t("results.top", { lng: lang })}
              </Button>
            </div>
            <Posts filteredPosts={filteredPosts} />
          </>
        ) : (
          <Alert 
            variant="info" 
            className="text-center py-5 border-0"
            style={{
              borderRadius: '15px',
              background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
              color: '#333'
            }}
          >
            <i className="fas fa-search" style={{ fontSize: '3rem', color: '#667eea', marginBottom: '1rem' }}></i>
            <h5 className="fw-bold mb-3">{t("results.noResults.title", { lng: lang })}</h5>
            <p className="mb-0">
              {search || theme || style || priceMin || priceMax || wilaya || Object.values(categories).some(Boolean) 
                ? t("results.noResults.withFilters", { lng: lang })
                : t("results.noResults.withoutFilters", { lng: lang })
              }
            </p>
          </Alert>
        )}
      </div>

      {/* 🔹 CSS PERSONALIZADO PARA ANIMACIONES */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .form-control:focus,
        .form-select:focus {
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }

        /* Scroll suave para resultados de usuarios */
        div::-webkit-scrollbar {
          width: 6px;
        }

        div::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        div::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
        }

        div::-webkit-scrollbar-thumb:hover {
          background: #667eea;
        }
      `}</style>
    </Container>
  );
}