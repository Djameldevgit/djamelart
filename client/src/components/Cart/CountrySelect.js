import React from 'react';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import { useTranslation } from 'react-i18next';

const CountrySelect = ({ onChange, value }) => {
  const { t, i18n } = useTranslation('chekout');
  const lang = i18n.language || 'es';
  const isRTL = lang === 'ar';

  // Obtener países y traducir los nombres según el idioma
  const getTranslatedCountries = () => {
    const countries = countryList().getData();
    
    return countries.map(country => ({
      label: (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          direction: isRTL ? 'rtl' : 'ltr'
        }}>
          <img
            src={`https://flagcdn.com/w40/${country.value.toLowerCase()}.png`}
            alt={country.label}
            style={{ 
              width: '20px', 
              marginRight: isRTL ? '0' : '10px',
              marginLeft: isRTL ? '10px' : '0'
            }}
            onError={(e) => {
              e.target.src = `https://flagcdn.com/w40/${country.value.toLowerCase()}.png`;
            }}
          />
          <span style={{ 
            textAlign: isRTL ? 'right' : 'left',
            fontSize: '14px'
          }}>
            {t(`countries.${country.value}`, { 
              lng: lang,
              defaultValue: country.label 
            })}
          </span>
        </div>
      ),
      value: country.value,
      code: country.value
    }));
  };

  const options = getTranslatedCountries();

  const customStyles = {
    control: (base, state) => ({
      ...base,
      padding: '4px',
      borderRadius: '12px',
      border: '2px solid #e2e8f0',
      fontSize: '1rem',
      backgroundColor: 'white',
      boxShadow: 'none',
      minHeight: '50px',
      '&:hover': {
        borderColor: '#667eea'
      },
      borderColor: state.isFocused ? '#667eea' : '#e2e8f0',
      direction: isRTL ? 'rtl' : 'ltr'
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
      zIndex: 9999,
      position: 'absolute',
      direction: isRTL ? 'rtl' : 'ltr'
    }),
    menuList: (base) => ({
      ...base,
      borderRadius: '12px',
      padding: 0,
      maxHeight: '300px'
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#667eea' : state.isFocused ? '#e2e8f0' : 'white',
      color: state.isSelected ? 'white' : '#2d3748',
      textAlign: isRTL ? 'right' : 'left',
      direction: isRTL ? 'rtl' : 'ltr',
      '&:hover': {
        backgroundColor: '#667eea',
        color: 'white'
      }
    }),
    placeholder: (base) => ({
      ...base,
      color: '#718096',
      textAlign: isRTL ? 'right' : 'left',
      fontSize: '14px'
    }),
    singleValue: (base) => ({
      ...base,
      color: '#2d3748',
      textAlign: isRTL ? 'right' : 'left',
      direction: isRTL ? 'rtl' : 'ltr'
    }),
    input: (base) => ({
      ...base,
      textAlign: isRTL ? 'right' : 'left',
      direction: isRTL ? 'rtl' : 'ltr'
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: '#667eea',
      '&:hover': {
        color: '#764ba2'
      }
    }),
    clearIndicator: (base) => ({
      ...base,
      color: '#718096',
      '&:hover': {
        color: '#e53e3e'
      }
    })
  };

  const handleChange = (selected) => {
    if (onChange) onChange(selected?.value || '');
  };

  const currentValue = options.find(option => option.value === value);

  return (
    <Select
      options={options}
      value={currentValue}
      onChange={handleChange}
      isClearable
      placeholder={t('selectCountry', { lng: lang })}
      styles={customStyles}
      isSearchable
      noOptionsMessage={({ inputValue }) => 
        !inputValue ? 
        t('noOptionsAvailable', { lng: lang }) : 
        t('countryNotFound', { lng: lang })
      }
      loadingMessage={() => t('loadingCountries', { lng: lang })}
    />
  );
};

export default CountrySelect;