import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Posts from '../components/home/Posts';
import LoadIcon from '../images/loading.gif';

import Modalsearchhome from './../components/Modalsearchhome';

import { useTranslation } from 'react-i18next';
 
 
const Home = () => {

    
    const { homePosts, languageReducer } = useSelector(state => state);

    const { t } = useTranslation('search');
    const lang = languageReducer.language || 'en';



    const [filters, setFilters] = useState({
        category: '',
        title: '',
        theme: '',
        style: '',
        minPrice: '',
        maxPrice: '',
    });
    const [isModalOpen, setIsModalOpen] = useState(false);


    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const resetFilters = () => {
        setFilters({
            category: '',
            title: '',
            theme: '',
            style: '',
            minPrice: '',
            maxPrice: '',
        });
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="home">
            <button onClick={openModal} style={styles.searchButton} className='mt-2'>
                <span style={styles.searchIcon}>
                    <i className='fas fa-search' ></i>
                    <span className='ml-3 '>  {t('Advanced search', { lng: languageReducer.language })}</span>
                </span>

            </button>
 
            <Modalsearchhome isOpen={isModalOpen} onClose={closeModal}>
                <div className="modalcontentsearch">
                    <div className="titlebusqueda">
                        <h5>Búsqueda avanzada</h5>
                        <button className="modalclosesearch" onClick={closeModal}>
                            &times;
                        </button>
                    </div>
                    <div className="filters-container">
                        <div className="filter-group">

                            <select
                                name="category"
                                value={filters.category}
                                onChange={handleFilterChange}
                                required
                            >
                                <option value="">Sélectionner le Titre</option>
                                <option value="Painting">Painting</option>
                                <option value="Sculpture">Sculpture</option>
                                <option value="Photography">Photography</option>
                                <option value="drawing">drawing</option>
                                <option value="Engraving">Engraving</option>
                                <option value="Digital_art">Digital art</option>
                                <option value="Collage">Collage</option>
                                <option value="Textile_art">Textile_art</option>

                            </select>
                        </div>
                        <div className="filter-group">

                            <select
                                name="theme"
                                value={filters.theme}
                                onChange={handleFilterChange}
                                required
                            >
                                <option value="">Sélectionner le Titre</option>
                                <div className="filter-group">
                                    <select
                                        name="theme"
                                        value={filters.theme}
                                        onChange={handleFilterChange}
                                        required
                                    >
                                        <option value="">{t('select_theme', { lng: lang })}</option>

                                        {/* Pintura */}
                                        <optgroup label={t('painting', { lng: lang })}>
                                            <option value="landscape">{t('landscape', { lng: lang })}</option>
                                            <option value="portrait">{t('portrait', { lng: lang })}</option>
                                            <option value="animals">{t('animals', { lng: lang })}</option>
                                            <option value="seascape">{t('seascape', { lng: lang })}</option>
                                            <option value="urban">{t('urban', { lng: lang })}</option>
                                            <option value="abstract">{t('abstract', { lng: lang })}</option>
                                            <option value="still_life">{t('still_life', { lng: lang })}</option>
                                            <option value="botanical">{t('botanical', { lng: lang })}</option>
                                        </optgroup>

                                        {/* Escultura */}
                                        <optgroup label={t('sculpture', { lng: lang })}>
                                            <option value="human_figure">{t('human_figure', { lng: lang })}</option>
                                            <option value="animals_sculpture">{t('animals_sculpture', { lng: lang })}</option>
                                            <option value="abstract_sculpture">{t('abstract_sculpture', { lng: lang })}</option>
                                            <option value="mythological">{t('mythological', { lng: lang })}</option>
                                            <option value="kinetic">{t('kinetic', { lng: lang })}</option>
                                            <option value="minimalist">{t('minimalist', { lng: lang })}</option>
                                        </optgroup>

                                        {/* Fotografía */}
                                        <optgroup label={t('photography', { lng: lang })}>
                                            <option value="portrait_photo">{t('portrait_photo', { lng: lang })}</option>
                                            <option value="wildlife">{t('wildlife', { lng: lang })}</option>
                                            <option value="street">{t('street', { lng: lang })}</option>
                                            <option value="architectural">{t('architectural', { lng: lang })}</option>
                                            <option value="conceptual">{t('conceptual', { lng: lang })}</option>
                                        </optgroup>

                                        {/* Arte Textil */}
                                        <optgroup label={t('textile', { lng: lang })}>
                                            <option value="tapestry_patterns">{t('tapestry_patterns', { lng: lang })}</option>
                                            <option value="ethnic">{t('ethnic', { lng: lang })}</option>
                                            <option value="abstract_textile">{t('abstract_textile', { lng: lang })}</option>
                                            <option value="nature_inspired">{t('nature_inspired', { lng: lang })}</option>
                                        </optgroup>

                                        {/* Arte Digital */}
                                        <optgroup label={t('digital', { lng: lang })}>
                                            <option value="fantasy">{t('fantasy', { lng: lang })}</option>
                                            <option value="sci_fi">{t('sci_fi', { lng: lang })}</option>
                                            <option value="concept_art">{t('concept_art', { lng: lang })}</option>
                                            <option value="pop_culture">{t('pop_culture', { lng: lang })}</option>
                                        </optgroup>
                                    </select>
                                </div>

                            </select>


                            <div className="filter-group">
                                <select
                                    name="style"
                                    value={filters.style}
                                    onChange={handleFilterChange}
                                    required
                                >
                                    <option value="">{t('style.select_style', { lng: lang })}</option>

                                    {/* Estilos Universales */}
                                    <optgroup label={t('style.group_universal', { lng: lang })}>
                                        <option value="realism">{t('style.realism', { lng: lang })}</option>
                                        <option value="impressionism">{t('style.impressionism', { lng: lang })}</option>
                                        <option value="abstract">{t('style.abstract', { lng: lang })}</option>
                                        <option value="surrealism">{t('style.surrealism', { lng: lang })}</option>
                                        <option value="cubism">{t('style.cubism', { lng: lang })}</option>
                                        <option value="minimalism">{t('style.minimalism', { lng: lang })}</option>
                                    </optgroup>

                                    {/* Estilos para Pintura */}
                                    <optgroup label={t('style.group_painting', { lng: lang })}>
                                        <option value="oil_technique">{t('style.oil_technique', { lng: lang })}</option>
                                        <option value="watercolor_style">{t('style.watercolor_style', { lng: lang })}</option>
                                        <option value="fresco">{t('style.fresco', { lng: lang })}</option>
                                        <option value="hyperrealism">{t('style.hyperrealism', { lng: lang })}</option>
                                        <option value="graffiti_style">{t('style.graffiti_style', { lng: lang })}</option>
                                    </optgroup>

                                    {/* Estilos para Escultura */}
                                    <optgroup label={t('style.group_sculpture', { lng: lang })}>
                                        <option value="figurative">{t('style.figurative', { lng: lang })}</option>
                                        <option value="kinetic_style">{t('style.kinetic_style', { lng: lang })}</option>
                                        <option value="organic_abstraction">{t('style.organic_abstraction', { lng: lang })}</option>
                                        <option value="neoclassical">{t('style.neoclassical', { lng: lang })}</option>
                                        <option value="assemblage">{t('style.assemblage', { lng: lang })}</option>
                                    </optgroup>

                                    {/* Estilos para Fotografía */}
                                    <optgroup label={t('style.group_photography', { lng: lang })}>
                                        <option value="vintage">{t('style.vintage', { lng: lang })}</option>
                                        <option value="conceptual_photo">{t('style.conceptual_photo', { lng: lang })}</option>
                                        <option value="documentary">{t('style.documentary', { lng: lang })}</option>
                                        <option value="tilt_shift">{t('style.tilt_shift', { lng: lang })}</option>
                                    </optgroup>

                                    {/* Estilos para Arte Digital */}
                                    <optgroup label={t('style.group_digital', { lng: lang })}>
                                        <option value="vector_art">{t('style.vector_art', { lng: lang })}</option>
                                        <option value="pixel_art">{t('style.pixel_art', { lng: lang })}</option>
                                        <option value="cyberpunk">{t('style.cyberpunk', { lng: lang })}</option>
                                        <option value="vaporwave">{t('style.vaporwave', { lng: lang })}</option>
                                    </optgroup>

                                    {/* Estilos para Arte Textil */}
                                    <optgroup label={t('style.group_textile', { lng: lang })}>
                                        <option value="batik">{t('style.batik', { lng: lang })}</option>
                                        <option value="japanese_sashiko">{t('style.japanese_sashiko', { lng: lang })}</option>
                                        <option value="abstract_weaving">{t('style.abstract_weaving', { lng: lang })}</option>
                                    </optgroup>
                                </select>
                            </div>




                        </div>

                        <div className="filter-group">
                            <small>Precio mínimo:</small>
                            <input
                                type="number"
                                name="minPrice"
                                placeholder="Precio mínimo"
                                onChange={handleFilterChange}
                                value={filters.minPrice}
                            />
                            <small>Precio máximo:</small>
                            <input
                                type="number"
                                name="maxPrice"
                                placeholder="Precio máximo"
                                onChange={handleFilterChange}
                                value={filters.maxPrice}
                            />
                        </div>

                        <div className="filter-group" style={{ gridColumn: '1 / -1' }}>
                            <button onClick={resetFilters} className="reset-button">
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            </Modalsearchhome>

            {homePosts.loading ? (
                <img src={LoadIcon} alt="loading" className="d-block mx-auto" />
            ) : homePosts.result === 0 && homePosts.posts.length === 0 ? (
                <h2 className="text-center">No Post</h2>
            ) : (
                <Posts filters={filters} />
            )}
        </div>
    );
};

const styles = {
    searchButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.5rem 1rem',
        border: '1px solid #ddd',
        borderRadius: '25px',
        backgroundColor: '#f8f9fa',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        maxWidth: '400px',
        margin: '0 auto',
    },
    searchIcon: {
        fontSize: '1.1rem',
        color: '#007bff',
        marginRight: '0.5rem',
    },
};

export default Home;