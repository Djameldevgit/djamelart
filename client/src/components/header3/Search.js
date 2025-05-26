import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
 
const Search = () => {
    const { languageReducer } = useSelector(state => state);
    const { t } = useTranslation();

    return (
        <div className="search-container">
            <nav className="search-nav">
                <span className="search-icon">
                    <i className='fas fa-search'></i>
                </span>
                <span className="search-text">
                    <span style={{ fontSize: '1rem', color: '#6c757d', flex: 1, display: 'flex', justifyContent: languageReducer.language === 'ar' ? 'right' : 'flex-start', flexDirection: 'row' }}>
                        {t('Advanced search...', { lng: languageReducer.language })}
                    </span>
                </span>
            </nav>
        </div>
    );
};

export default Search;