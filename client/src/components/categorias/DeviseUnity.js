import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Form } from 'react-bootstrap';
import Select from 'react-select';

export function DeviseVente({ handleChangeInput, postData }) {
    const { t } = useTranslation();
    const { languageReducer } = useSelector(state => state);

    const currencyOptions = [
        { value: 'DZD', label: t('currency.DZD', { lng: languageReducer.language }) },
        { value: 'EUR', label: t('currency.EUR', { lng: languageReducer.language }) },
        { value: 'USD', label: t('currency.USD', { lng: languageReducer.language }) },
        { value: 'CAD', label: t('currency.CAD', { lng: languageReducer.language }) },
        { value: 'GBP', label: t('currency.GBP', { lng: languageReducer.language }) },
        { value: 'JPY', label: t('currency.JPY', { lng: languageReducer.language }) },
        { value: 'MAD', label: t('currency.MAD', { lng: languageReducer.language }) },
        { value: 'XOF', label: t('currency.XOF', { lng: languageReducer.language }) }
    ];

    return (
        <Form.Group controlId="currencyInput" className="mb-3">
            <Form.Label>{t('devise_vente.label', { lng: languageReducer.language })}</Form.Label>
            <Select
                options={currencyOptions}
                onChange={(selectedOption) =>
                    handleChangeInput({
                        target: {
                            name: 'devisvente',
                            value: selectedOption?.value || '',
                            type: 'text'
                        }
                    })
                }
                name="devisvente"
                value={currencyOptions.find(opt => opt.value === postData?.devisvente) || null}
                placeholder={t('devise_vente.placeholder', { lng: languageReducer.language })}
                className="currency-select"
                classNamePrefix="cs"
                isSearchable={true}
                noOptionsMessage={() => t('devise_vente.no_option', { lng: languageReducer.language })}
                styles={{
                    option: (base) => ({
                        ...base,
                        display: 'flex',
                        alignItems: 'center'
                    })
                }}
            />
          
        </Form.Group>
    );
}
