// SearchPage.jsx - Versión Optimizada
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getDataAPI } from "../utils/fetchData";
import { GLOBALTYPES } from "../redux/actions/globalTypes";
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
  Accordion,
  Badge
} from "react-bootstrap";

import LoadIcon from "../images/loading.gif";

export default function SearchPage() {
  const { auth, languageReducer } = useSelector(state => state);
  const { t } = useTranslation('navbar');
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
  const [theme, setTheme] = useState("");
  const [style, setStyle] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [wilaya, setWilaya] = useState("");

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [error, setError] = useState(null);

  const [users, setUsers] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  // 🔹 Contar filtros activos
  const activeFiltersCount = [
    search,
    theme,
    style,
    priceMin,
    priceMax,
    wilaya,
    ...Object.values(categories).filter(Boolean)
  ].filter(Boolean).length;

  // 🔹 Cargar posts iniciales al montar el componente
  useEffect(() => {
    loadInitialPosts();
  }, []);

  // 🔹 Función para cargar posts iniciales
  const loadInitialPosts = async () => {
    try {
      setInitialLoading(true);
      const res = await getDataAPI('posts?limit=12', auth.token);
      setFilteredPosts(res.data.posts || []);
    } catch (err) {
      console.error("Error loading initial posts:", err);
      setError(err.response?.data?.message || err.message || "Error al cargar posts");
    } finally {
      setInitialLoading(false);
    }
  };

  // 🔹 Manejar cambio de categorías
  const handleCategoryChange = (category) => {
    setCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // 🔹 Buscar posts con filtros
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const query = {
        title: search || "",
        theme: theme || "",
        style: style || "",
        wilaya: wilaya || "",
        page: 1,
      };

      if (priceMin) query.priceMin = priceMin;
      if (priceMax) query.priceMax = priceMax;

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
      setError(err.response?.data?.message || err.message || "Error en la búsqueda");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Buscar usuarios en vivo
  const handleUserSearch = async (value) => {
    setSearch(value);
    if (!value) {
      setUsers([]);
      return;
    }

    try {
      setUserLoading(true);
      const res = await getDataAPI(`search?username=${value}`, auth.token);
      setUsers(res.data.users || []);
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response?.data?.msg || "Error al buscar usuarios" },
      });
    } finally {
      setUserLoading(false);
    }
  };

  // 🔹 Resetear filtros
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
    setUsers([]);
    setError(null);
    loadInitialPosts();
  };

  return (
    <Container fluid className="py-3">
      {/* 🔹 HEADER COMPACTO STICKY */}
      <div className="sticky-top bg-white shadow-sm py-3 mb-3" style={{ zIndex: 1020 }}>
        <Row className="align-items-center">
          <Col md={4}>
            <h4 className="mb-0">{t("search", "Buscar")}</h4>
            {activeFiltersCount > 0 && (
              <Badge bg="primary" className="ms-2">
                {activeFiltersCount} {t("filtersActive", "filtros")}
              </Badge>
            )}
          </Col>
          
          <Col md={8}>
            <Form onSubmit={handleSearch}>
              <Row className="g-2">
                <Col md={6}>
                  <Form.Control
                    type="text"
                    placeholder={t("searchUserPlaceholder", "Buscar usuarios o posts...")}
                    value={search}
                    onChange={(e) => handleUserSearch(e.target.value)}
                    size="sm"
                  />
                </Col>
                <Col md={3}>
                  <Button 
                    type="submit" 
                    disabled={loading} 
                    className="w-100"
                    variant="primary"
                    size="sm"
                  >
                    {loading ? <Spinner animation="border" size="sm" /> : "🔍"}
                  </Button>
                </Col>
                <Col md={3}>
                  <Button
                    variant="outline-secondary"
                    onClick={() => setFiltersExpanded(!filtersExpanded)}
                    className="w-100"
                    size="sm"
                  >
                    {filtersExpanded ? "▲ Filtros" : "▼ Filtros"}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </div>

      {/* 🔹 FILTROS EXPANDIBLES COMPACTOS */}
      {filtersExpanded && (
        <Card className="mb-3">
          <Card.Body className="py-3">
            <Row className="g-3">
              {/* 🔹 Búsqueda de Usuarios - Resultados */}
              {users.length > 0 && (
                <Col md={12}>
                  <Card className="border">
                    <Card.Header className="py-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="fw-bold">{t("usersFound", "Usuarios encontrados")}</small>
                        <Button variant="link" size="sm" onClick={() => setUsers([])} className="p-0">
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

              {/* 🔹 Categorías Compactas */}
              <Col md={12}>
                <Form.Label className="fw-bold small">{t("categories", "Categorías")}</Form.Label>
                <Row className="g-1">
                  {Object.keys(categories).map(category => (
                    <Col xs={6} sm={4} md={3} key={category}>
                      <Form.Check
                        type="checkbox"
                        id={`category-${category}`}
                        label={t(`categories.${category}`, category)}
                        checked={categories[category]}
                        onChange={() => handleCategoryChange(category)}
                        className="small"
                      />
                    </Col>
                  ))}
                </Row>
              </Col>

              {/* 🔹 Filtros Principales en una línea */}
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="small">{t("selectTheme", "Tema")}</Form.Label>
                  <Form.Select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    size="sm"
                  >
                    <option value="">Todos</option>
                    <option value="abstrait">Abstracto</option>
                    <option value="colore">Color</option>
                    <option value="graffiti">Graffiti</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label className="small">{t("selectStyle", "Estilo")}</Form.Label>
                  <Form.Select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    size="sm"
                  >
                    <option value="">Todos</option>
                    <option value="abstrait">Abstracto</option>
                    <option value="cubisme">Cubismo</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={2}>
                <Form.Group>
                  <Form.Label className="small">{t("minPrice", "Mín")}</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="0"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    size="sm"
                  />
                </Form.Group>
              </Col>

              <Col md={2}>
                <Form.Group>
                  <Form.Label className="small">{t("maxPrice", "Máx")}</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="10000"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    size="sm"
                  />
                </Form.Group>
              </Col>

              <Col md={2}>
                <Form.Group>
                  <Form.Label className="small">{t("wilaya", "Wilaya")}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ej: Alger"
                    value={wilaya}
                    onChange={(e) => setWilaya(e.target.value)}
                    size="sm"
                  />
                </Form.Group>
              </Col>

              {/* 🔹 Botones de Acción Compactos */}
              <Col md={12}>
                <Row className="g-2">
                  <Col md={6}>
                    <Button 
                      onClick={handleSearch}
                      disabled={loading} 
                      className="w-100"
                      variant="primary"
                      size="sm"
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-1" />
                          Buscando...
                        </>
                      ) : (
                        "Aplicar Filtros"
                      )}
                    </Button>
                  </Col>
                  <Col md={6}>
                    <Button
                      variant="outline-secondary"
                      onClick={handleReset}
                      disabled={loading}
                      className="w-100"
                      size="sm"
                    >
                      Limpiar Todo
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* 🔹 MENSAJES DE ERROR COMPACTOS */}
      {error && (
        <Alert variant="danger" className="py-2 mb-3">
          <small>{error}</small>
        </Alert>
      )}

      {/* 🔹 RESULTADOS - MÁS ESPACIO VISIBLE */}
      <div className="mt-3">
        {initialLoading ? (
          <div className="text-center py-5">
            <img src={LoadIcon} alt="loading" className="d-block mx-auto" />
            <p className="mt-2 text-muted">{t("loadingPosts", "Cargando posts...")}</p>
          </div>
        ) : loading ? (
          <div className="text-center py-3">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">{t("searching", "Buscando...")}</p>
          </div>
        ) : filteredPosts.length > 0 ? (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-0">
                {t("resultsFound", "Resultados")}: <strong>{filteredPosts.length}</strong>
              </h6>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                ↑ Top
              </Button>
            </div>
            <Posts filteredPosts={filteredPosts} />
          </>
        ) : (
          <Alert variant="info" className="text-center py-4">
            <h6>No se encontraron resultados</h6>
            <p className="mb-0 small">
              {search || theme || style || priceMin || priceMax || wilaya || Object.values(categories).some(Boolean) 
                ? "Intenta con otros filtros o términos de búsqueda."
                : "No hay posts disponibles en este momento."
              }
            </p>
          </Alert>
        )}
      </div>
    </Container>
  );
}