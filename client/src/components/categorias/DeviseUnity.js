import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Form } from 'react-bootstrap';
import Select from 'react-select';

export function DeviseVente({ handleChangeInput, postData }) {
    const { languageReducer } = useSelector(state => state);
    const { t } = useTranslation('componentstatusmodal');  
    const lang = languageReducer.language || 'en'; 

    const currencyOptions = [
        { value: 'DZD', label: t('currency.DZD', { lng: lang }) },
        { value: 'EUR', label: t('currency.EUR', { lng: lang }) },
        { value: 'USD', label: t('currency.USD', { lng: lang }) },
        { value: 'CAD', label: t('currency.CAD', { lng: lang }) },
        { value: 'GBP', label: t('currency.GBP', { lng: lang }) },
        { value: 'JPY', label: t('currency.JPY', { lng: lang }) },
        { value: 'MAD', label: t('currency.MAD', { lng: lang }) },
        { value: 'XOF', label: t('currency.XOF', { lng: lang }) }
    ];

    return (
        <Form.Group controlId="currencyInput" className="mb-3">
            <Form.Label>{t('devise_vente.label', { lng: lang })}</Form.Label>
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
                placeholder={t('devise_vente.placeholder', { lng: lang })}
                className="currency-select"
                classNamePrefix="cs"
                isSearchable={true}
                noOptionsMessage={() => t('devise_vente.no_option', { lng: lang })}
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
