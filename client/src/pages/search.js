import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';
import { getDataAPI } from "../utils/fetchData";
import { GLOBALTYPES } from "../redux/actions/globalTypes";
import UserCard from "../components/UserCard";
import Posts from "../components/home/Posts";

import {
  Container,
  Form,
  Button,
  Spinner,
  Alert,
  ListGroup,
  InputGroup,
  Row,
  Col,
  Card,
  Accordion,
  Badge,
} from "react-bootstrap";

import LoadIcon from "../images/loading.gif";

export default function SearchPage() {
  const { t, i18n } = useTranslation('search');
  const languageReducer = useSelector(state => state.languageReducer);
  
  useEffect(() => {
    const lang = languageReducer?.language || 'es';
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [languageReducer?.language, i18n]);

  // 🔹 Estados consolidados
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    categories: {
      painting: false,
      sculpture: false,
      photography: false,
      drawing: false,
      engraving: false,
      digital_art: false,
      collage: false,
      textile_art: false,
    },
    theme: "",
    style: "",
    priceMin: "",
    priceMax: "",
    wilaya: ""
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [userLoading, setUserLoading] = useState(false);

  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  // 🔹 Búsqueda inteligente con debounce mejorado
  const handleUserSearch = useCallback(async (value) => {
    const searchValue = value.toLowerCase().trim();
    setSearch(value);
    
    if (!searchValue) {
      setUsers([]);
      return;
    }

    try {
      setUserLoading(true);
      const res = await getDataAPI(`search?username=${searchValue}`, auth.token);
      setUsers(res.data.users);
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: t('errors.userSearchError') },
      });
    } finally {
      setUserLoading(false);
    }
  }, [auth.token, dispatch, t]);

  // 🔹 Buscar posts
  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const queryParams = new URLSearchParams();
      
      if (search.trim()) queryParams.append('title', search.trim().toLowerCase());
      if (filters.theme.trim()) queryParams.append('theme', filters.theme.trim().toLowerCase());
      if (filters.style.trim()) queryParams.append('style', filters.style.trim().toLowerCase());
      if (filters.wilaya.trim()) queryParams.append('wilaya', filters.wilaya.trim().toLowerCase());
      if (filters.priceMin) queryParams.append('priceMin', filters.priceMin);
      if (filters.priceMax) queryParams.append('priceMax', filters.priceMax);

      Object.entries(filters.categories).forEach(([key, value]) => {
        queryParams.append(key, value.toString());
      });

      const queryString = queryParams.toString();
      const url = `posts${queryString ? `?${queryString}` : ''}`;
      
      const res = await getDataAPI(url, auth.token);
      setResults(res.data.posts || []);
      
    } catch (err) {
      console.error("Error en búsqueda:", err);
      setError(
        err.response?.data?.message || err.message || t('errors.searchError')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseUsers = () => {
    setUsers([]);
    setSearch("");
  };

  // 🔹 Manejo de filtros optimizado
  const updateFilter = (section, key, value) => {
    setFilters(prev => ({
      ...prev,
      [section]: section === 'categories' 
        ? { ...prev.categories, [key]: value }
        : value
    }));
  };

  // 🔹 Limpiar todos los filtros
  const handleClearFilters = () => {
    setSearch("");
    setFilters({
      categories: {
        painting: false,
        sculpture: false,
        photography: false,
        drawing: false,
        engraving: false,
        digital_art: false,
        collage: false,
        textile_art: false,
      },
      theme: "",
      style: "",
      priceMin: "",
      priceMax: "",
      wilaya: ""
    });
    setResults([]);
    setUsers([]);
    setError(null);
  };

  // 🔹 Contador de filtros activos optimizado
  const activeFiltersCount = [
    search,
    filters.theme,
    filters.style,
    filters.wilaya,
    filters.priceMin,
    filters.priceMax,
    ...Object.values(filters.categories).filter(Boolean)
  ].filter(Boolean).length;

  return (
    <Container className="py-3">
      {/* Header Compacto */}
      <div className="text-center mb-3">
        <h4 className="fw-bold text-primary mb-1">{t('title')}</h4>
        <p className="text-muted small">{t('subtitle')}</p>
      </div>

      {/* Search Card Compacta */}
      <Card className="shadow-sm border-0 mb-3">
        <Card.Body className="p-3">
          <Form onSubmit={handleSearch}>
            {/* 🔹 Búsqueda Principal Compacta */}
            <Form.Group className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label className="fw-semibold text-dark mb-0 small">
                  {t('searchLabel')}
                </Form.Label>
                {activeFiltersCount > 0 && (
                  <Badge bg="primary" className="fs-6">
                    {activeFiltersCount}
                  </Badge>
                )}
              </div>
              <InputGroup size="md">
                <Form.Control
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={search}
                  onChange={(e) => handleUserSearch(e.target.value)}
                  className="border-end-0"
                />
                {search && (
                  <Button 
                    variant="outline-secondary" 
                    onClick={handleCloseUsers}
                    className="border-start-0 px-3"
                    size="sm"
                  >
                    <i className="fas fa-times small"></i>
                  </Button>
                )}
              </InputGroup>
            </Form.Group>

            {/* 🔹 Dropdown usuarios compacto */}
            {search && users.length > 0 && (
              <Card className="mb-2 border-primary">
                <Card.Header className="bg-primary text-white py-1 px-2">
                  <small className="fw-bold">
                    <i className="fas fa-users me-1"></i>
                    {t('artistsFound')} ({users.length})
                  </small>
                </Card.Header>
                <ListGroup variant="flush" className="max-h-200 overflow-auto">
                  {userLoading && (
                    <ListGroup.Item className="text-center py-2">
                      <Spinner animation="border" size="sm" className="me-2" />
                      <small>{t('searchingArtists')}</small>
                    </ListGroup.Item>
                  )}
                  {users.map((user) => (
                    <ListGroup.Item key={user._id} action className="p-2">
                      <UserCard
                        user={user}
                        border="border-0"
                        handleClose={handleCloseUsers}
                        compact={true}
                      />
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card>
            )}

            {/* 🔹 Acordeón Compacto para Filtros */}
            <Accordion className="mb-3" defaultActiveKey={[]} alwaysOpen>
              {/* Categorías Compactas */}
              <Accordion.Item eventKey="0" className="mb-2">
                <Accordion.Header className="py-2">
                  <div className="d-flex align-items-center w-100">
                    <i className="fas fa-tags text-primary me-2 fs-6"></i>
                    <small className="fw-semibold">{t('categories.title')}</small>
                    {Object.values(filters.categories).filter(Boolean).length > 0 && (
                      <Badge bg="primary" className="ms-2 fs-6">
                        {Object.values(filters.categories).filter(Boolean).length}
                      </Badge>
                    )}
                  </div>
                </Accordion.Header>
                <Accordion.Body className="p-2">
                  <Row className="g-1">
                    {Object.keys(filters.categories).map((cat) => (
                      <Col xs={6} sm={4} key={cat}>
                        <Form.Check
                          type="checkbox"
                          id={cat}
                          name={cat}
                          label={<small>{t(`categories.${cat}`)}</small>}
                          checked={filters.categories[cat]}
                          onChange={(e) => updateFilter('categories', e.target.name, e.target.checked)}
                          className="small"
                        />
                      </Col>
                    ))}
                  </Row>
                </Accordion.Body>
              </Accordion.Item>

              {/* Filtros Avanzados Compactos */}
              <Accordion.Item eventKey="1">
                <Accordion.Header className="py-2">
                  <div className="d-flex align-items-center w-100">
                    <i className="fas fa-sliders-h text-warning me-2 fs-6"></i>
                    <small className="fw-semibold">{t('advancedSearch.title')}</small>
                  </div>
                </Accordion.Header>
                <Accordion.Body className="p-2">
                  <Row className="g-2">
                    <Col sm={6}>
                      <Form.Group className="mb-2">
                        <Form.Label className="small fw-semibold mb-1">
                          <i className="fas fa-palette text-info me-1"></i>
                          {t('advancedSearch.theme')}
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder={t('advancedSearch.themePlaceholder')}
                          value={filters.theme}
                          onChange={(e) => updateFilter('theme', null, e.target.value)}
                          size="sm"
                        />
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group className="mb-2">
                        <Form.Label className="small fw-semibold mb-1">
                          <i className="fas fa-brush text-success me-1"></i>
                          {t('advancedSearch.style')}
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder={t('advancedSearch.stylePlaceholder')}
                          value={filters.style}
                          onChange={(e) => updateFilter('style', null, e.target.value)}
                          size="sm"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row className="g-2">
                    <Col sm={6}>
                      <Form.Group className="mb-2">
                        <Form.Label className="small fw-semibold mb-1">
                          <i className="fas fa-euro-sign text-danger me-1"></i>
                          {t('advancedSearch.minPrice')}
                        </Form.Label>
                        <Form.Control
                          type="number"
                          placeholder={t('advancedSearch.minPricePlaceholder')}
                          value={filters.priceMin}
                          onChange={(e) => updateFilter('priceMin', null, e.target.value)}
                          min="0"
                          size="sm"
                        />
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group className="mb-2">
                        <Form.Label className="small fw-semibold mb-1">
                          <i className="fas fa-euro-sign text-success me-1"></i>
                          {t('advancedSearch.maxPrice')}
                        </Form.Label>
                        <Form.Control
                          type="number"
                          placeholder={t('advancedSearch.maxPricePlaceholder')}
                          value={filters.priceMax}
                          onChange={(e) => updateFilter('priceMax', null, e.target.value)}
                          min="0"
                          size="sm"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-2">
                    <Form.Label className="small fw-semibold mb-1">
                      <i className="fas fa-map-marker-alt text-primary me-1"></i>
                      {t('advancedSearch.location')}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={t('advancedSearch.locationPlaceholder')}
                      value={filters.wilaya}
                      onChange={(e) => updateFilter('wilaya', null, e.target.value)}
                      size="sm"
                    />
                  </Form.Group>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            {/* 🔹 Botones de Acción Compactos */}
            <div className="d-flex gap-2">
              <Button 
                type="submit" 
                disabled={loading}
                variant="primary"
                size="sm"
                className="flex-fill"
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    <small>{t('buttons.searching')}</small>
                  </>
                ) : (
                  <>
                    <i className="fas fa-search me-2"></i>
                    <small>{t('buttons.search')}</small>
                  </>
                )}
              </Button>
              
              {activeFiltersCount > 0 && (
                <Button 
                  variant="outline-secondary" 
                  onClick={handleClearFilters}
                  size="sm"
                  className="px-3"
                >
                  <i className="fas fa-times me-1"></i>
                  <small>{t('buttons.clear')}</small>
                </Button>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* 🔹 Indicadores Compactos */}
      {results.length > 0 && (
        <Alert variant="info" className="py-2 px-3 mb-3 d-flex align-items-center">
          <i className="fas fa-info-circle me-2 fs-6"></i>
          <small className="fw-semibold">
            {t('results.found', { count: results.length })}
          </small>
        </Alert>
      )}

      {error && (
        <Alert variant="danger" className="py-2 px-3 mb-3 d-flex align-items-center">
          <i className="fas fa-exclamation-triangle me-2 fs-6"></i>
          <small>{error}</small>
        </Alert>
      )}

      {/* 🔹 Lista de Posts */}
      <div className="mt-3">
        {loading ? (
          <Card className="text-center py-4">
            <Card.Body className="p-3">
              <img src={LoadIcon} alt="loading" width="40" className="mb-2" />
              <h6 className="text-muted mb-1">{t('results.searching')}</h6>
              <small className="text-muted">{t('results.loading')}</small>
            </Card.Body>
          </Card>
        ) : (
          <Posts filters={results} />
        )}
      </div>
    </Container>
  );
}

// 🔹 Estilos CSS adicionales para mejor compactación
const styles = `
.max-h-200 {
  max-height: 200px;
}
.accordion-button {
  padding: 0.5rem 1rem;
}
.accordion-button:not(.collapsed) {
  background-color: #f8f9fa;
}
.accordion-body {
  padding: 0.5rem;
}s
`;

// Agregar estilos al documento
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);