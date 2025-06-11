// CountrySelect.js
import React from 'react';
import Select from 'react-select';
import countryList from 'react-select-country-list';

const options = countryList().getData().map(country => ({
  label: (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img
        src={`https://flagcdn.com/w40/${country.value.toLowerCase()}.png`}
        alt={country.label}
        style={{ width: '20px', marginRight: '10px' }}
      />
      {country.label}
    </div>
  ),
  value: country.value,
  code: country.value
}));

const CountrySelect = ({ onChange }) => {
  const handleChange = (selected) => {
    if (onChange) onChange(selected?.value || '');
  };

  return (
    <Select
      options={options}
      onChange={handleChange}
      isClearable
      placeholder="Selecciona un país"
    />
  );
};

export default CountrySelect;
