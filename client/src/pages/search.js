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
} from "react-bootstrap";

import LoadIcon from "../images/loading.gif";

export default function SearchPage() {
  const { t, i18n } = useTranslation('search');
  const languageReducer = useSelector(state => state.languageReducer); // Ajusta según tu store
  
  // Sincronizar idioma con Redux
  useEffect(() => {
    const lang = languageReducer?.language || 'es';
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [languageReducer?.language, i18n]);

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

  const [theme, setTheme] = useState("");
  const [style, setStyle] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [wilaya, setWilaya] = useState("");

  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState([]);
  const [error, setError] = useState(null);

  const [users, setUsers] = useState([]);
  const [userLoading, setUserLoading] = useState(false);

  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  // 🔹 Búsqueda inteligente con debounce
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
      // Construir query parameters correctamente
      const queryParams = new URLSearchParams();
      
      if (search.trim()) queryParams.append('title', search.trim().toLowerCase());
      if (theme.trim()) queryParams.append('theme', theme.trim().toLowerCase());
      if (style.trim()) queryParams.append('style', style.trim().toLowerCase());
      if (wilaya.trim()) queryParams.append('wilaya', wilaya.trim().toLowerCase());
      if (priceMin) queryParams.append('priceMin', priceMin);
      if (priceMax) queryParams.append('priceMax', priceMax);

      // Agregar categorías como "true"/"false"
      Object.entries(categories).forEach(([key, value]) => {
        queryParams.append(key, value.toString());
      });

      const queryString = queryParams.toString();
      const url = `posts${queryString ? `?${queryString}` : ''}`;

      console.log("Buscando con URL:", url);
      
      const res = await getDataAPI(url, auth.token);
      setFilters(res.data.posts || []);
      
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

  // 🔹 Limpiar todos los filtros
  const handleClearFilters = () => {
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
    setFilters([]);
    setUsers([]);
    setError(null);
  };

  // 🔹 Contador de filtros activos
  const activeFiltersCount = [
    search,
    theme,
    style,
    wilaya,
    priceMin,
    priceMax,
    ...Object.values(categories).filter(Boolean)
  ].filter(Boolean).length;

  return (
    <Container className="py-4">
      {/* Header Mejorado */}
      <div className="text-center mb-4">
        <h2 className="fw-bold text-primary">{t('title')}</h2>
        <p className="text-muted">{t('subtitle')}</p>
      </div>

      {/* Search Card */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body className="p-4">
          <Form onSubmit={handleSearch}>
            {/* 🔹 Búsqueda Principal Mejorada */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold text-dark">
                {t('searchLabel')}
              </Form.Label>
              <InputGroup size="lg">
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
                    className="border-start-0"
                    title={t('buttons.close')}
                  >
                    <i className="fas fa-times"></i>
                  </Button>
                )}
              </InputGroup>
              <Form.Text className="text-muted">
                {t('searchHelp')}
              </Form.Text>
            </Form.Group>

            {/* 🔹 Dropdown usuarios mejorado */}
            {search && users.length > 0 && (
              <Card className="mb-3 border-primary">
                <Card.Header className="bg-primary text-white py-2">
                  <small>{t('artistsFound')}</small>
                </Card.Header>
                <ListGroup variant="flush">
                  {userLoading && (
                    <ListGroup.Item className="text-center py-3">
                      <Spinner animation="border" size="sm" className="me-2" />
                      {t('searchingArtists')}
                    </ListGroup.Item>
                  )}
                  {users.map((user) => (
                    <ListGroup.Item key={user._id} action className="p-3">
                      <UserCard
                        user={user}
                        border="border-0"
                        handleClose={handleCloseUsers}
                      />
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card>
            )}

            {/* 🔹 Acordeón para Búsqueda Avanzada */}
            <Accordion className="mb-4" defaultActiveKey="0">
              {/* Categorías */}
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <div className="d-flex align-items-center">
                    <i className="fas fa-tags text-primary me-2"></i>
                    {t('categories.title')}
                    {Object.values(categories).filter(Boolean).length > 0 && (
                      <span className="badge bg-primary ms-2">
                        {Object.values(categories).filter(Boolean).length}
                      </span>
                    )}
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <Row>
                    {Object.keys(categories).map((cat) => (
                      <Col xs={6} md={4} lg={3} key={cat} className="mb-2">
                        <Form.Check
                          type="checkbox"
                          id={cat}
                          name={cat}
                          label={t(`categories.${cat}`)}
                          checked={categories[cat]}
                          onChange={(e) =>
                            setCategories((prev) => ({
                              ...prev,
                              [e.target.name]: e.target.checked,
                            }))
                          }
                        />
                      </Col>
                    ))}
                  </Row>
                </Accordion.Body>
              </Accordion.Item>

              {/* Búsqueda Avanzada */}
              <Accordion.Item eventKey="1">
                <Accordion.Header>
                  <div className="d-flex align-items-center">
                    <i className="fas fa-sliders-h text-warning me-2"></i>
                    {t('advancedSearch.title')}
                    {activeFiltersCount > 0 && (
                      <span className="badge bg-warning ms-2">
                        {activeFiltersCount}
                      </span>
                    )}
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <i className="fas fa-palette text-info me-2"></i>
                          {t('advancedSearch.theme')}
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder={t('advancedSearch.themePlaceholder')}
                          value={theme}
                          onChange={(e) => setTheme(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <i className="fas fa-brush text-success me-2"></i>
                          {t('advancedSearch.style')}
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder={t('advancedSearch.stylePlaceholder')}
                          value={style}
                          onChange={(e) => setStyle(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <i className="fas fa-euro-sign text-danger me-2"></i>
                          {t('advancedSearch.minPrice')}
                        </Form.Label>
                        <Form.Control
                          type="number"
                          placeholder={t('advancedSearch.minPricePlaceholder')}
                          value={priceMin}
                          onChange={(e) => setPriceMin(e.target.value)}
                          min="0"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <i className="fas fa-euro-sign text-success me-2"></i>
                          {t('advancedSearch.maxPrice')}
                        </Form.Label>
                        <Form.Control
                          type="number"
                          placeholder={t('advancedSearch.maxPricePlaceholder')}
                          value={priceMax}
                          onChange={(e) => setPriceMax(e.target.value)}
                          min="0"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="fas fa-map-marker-alt text-primary me-2"></i>
                      {t('advancedSearch.location')}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={t('advancedSearch.locationPlaceholder')}
                      value={wilaya}
                      onChange={(e) => setWilaya(e.target.value)}
                    />
                  </Form.Group>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            {/* 🔹 Botones de Acción */}
            <div className="d-flex gap-2 flex-wrap">
              <Button 
                type="submit" 
                disabled={loading}
                variant="primary"
                size="lg"
                className="flex-fill"
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    {t('buttons.searching')}
                  </>
                ) : (
                  <>
                    <i className="fas fa-search me-2"></i>
                    {t('buttons.search')}
                  </>
                )}
              </Button>
              
              {activeFiltersCount > 0 && (
                <Button 
                  variant="outline-secondary" 
                  onClick={handleClearFilters}
                  size="lg"
                >
                  <i className="fas fa-times me-2"></i>
                  {t('buttons.clear')}
                </Button>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* 🔹 Indicador de Resultados */}
      {filters.length > 0 && (
        <Alert variant="info" className="d-flex align-items-center">
          <i className="fas fa-info-circle me-2"></i>
          {t('results.found', { count: filters.length })}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" className="d-flex align-items-center">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      {/* 🔹 Lista de Posts */}
      <div className="mt-4">
        {loading ? (
          <Card className="text-center py-5">
            <Card.Body>
              <img src={LoadIcon} alt="loading" className="d-block mx-auto mb-3" />
              <h5 className="text-muted">{t('results.searching')}</h5>
              <p className="text-muted">{t('results.loading')}</p>
            </Card.Body>
          </Card>
        ) : (
          <Posts filters={filters} />
        )}
      </div>
    </Container>
  );
}