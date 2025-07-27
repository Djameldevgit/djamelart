import React from 'react';
import Select from 'react-select';
import countryList from 'react-select-country-list';
 
export function Paises({ handleChangeInput, postData }) {
  const rawCountries = countryList().getData();

  const countryOptions = rawCountries.map((country) => ({
    value: country.value,
    label: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={`https://flagcdn.com/w40/${country.value.toLowerCase()}.png`}
          alt={country.label}
          style={{ width: "20px", height: "15px", marginRight: "10px" }}
        />
        {country.label}
      </div>
    )
  }));

  const isAlgeria = postData?.country === 'DZ';

  return (
    <div>
      <div className="mb-3">
        <label className="form-label">Localization de l'artiste</label>
        <Select
          options={countryOptions}
          onChange={(selectedOption) =>
            handleChangeInput({
              target: {
                name: "country",
                value: selectedOption?.value || '',
                type: "text",
              },
            })
          }
          name="country"
          value={
            postData?.country
              ? countryOptions.find((opt) => opt.value === postData.country)
              : null
          }
          placeholder="Select a country"
        />
      </div>

      {!isAlgeria && (
        <div>
          {/* Por ejemplo, el componente wilayascommunes */}
          {/* wilayascommunes() */}
        </div>
      )}

      {isAlgeria && (
        <div className="mb-3">
          <label className="form-label">Ciudad</label>
          <input
            type="text"
            name="city"
            placeholder="Ingrese su ciudad"
            onChange={(e) => handleChangeInput(e)}
            value={postData?.city || ''}
            className="form-control"
          />
        </div>
      )}
    </div>
  );
}
