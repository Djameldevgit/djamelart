import Select from 'react-select';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function ItemsSubCategoryPeinture({ handleChangeInput, postData }) {
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation('subcategorias');  
  const lang = languageReducer.language || 'en';  

  const optionSubCategoryPeinture = [
    { value: "acrylique", label: t('acrylique', { lng: lang }) },
    { value: "huile", label: t('huile', { lng: lang }) },
    { value: "aerographe", label: t('aerographe', { lng: lang }) },
    { value: "aquarelle", label: t('aquarelle', { lng: lang }) },
    { value: "autre", label: t('autre', { lng: lang }) },
    { value: "bombe_aerosol", label: t('bombe_aerosol', { lng: lang }) },
    { value: "carte_a_gratter", label: t('carte_a_gratter', { lng: lang }) },
    { value: "cire", label: t('cire', { lng: lang }) },
    { value: "conte", label: t('conte', { lng: lang }) },
    { value: "craie", label: t('craie', { lng: lang }) },
    { value: "crayon", label: t('crayon', { lng: lang }) },
    { value: "email", label: t('email', { lng: lang }) },
    { value: "encaustique", label: t('encaustique', { lng: lang }) },
    { value: "encre", label: t('encre', { lng: lang }) },
    { value: "fusain", label: t('fusain', { lng: lang }) },
    { value: "gouache", label: t('gouache', { lng: lang }) },
    { value: "graphite", label: t('graphite', { lng: lang }) },
    { value: "laque", label: t('laque', { lng: lang }) },
    { value: "marqueur", label: t('marqueur', { lng: lang }) },
    { value: "pastel", label: t('pastel', { lng: lang }) },
    { value: "peinture_vitrail", label: t('peinture_vitrail', { lng: lang }) },
    { value: "pigments", label: t('pigments', { lng: lang }) },
    { value: "pochoir", label: t('pochoir', { lng: lang }) },
    { value: "pointe_d_argent", label: t('pointe_d_argent', { lng: lang }) },
    { value: "stylo_bille", label: t('stylo_bille', { lng: lang }) },
    { value: "stylo_gel", label: t('stylo_gel', { lng: lang }) },
    { value: "tempera", label: t('tempera', { lng: lang }) }
  ];

  return (
    <div className='mb-3'>
      <Form.Label>{t('tecnicaparapintura', { lng: lang })}</Form.Label>

      <Select
        options={optionSubCategoryPeinture}
        onChange={(selectedOption) => handleChangeInput({
          target: {
            name: 'subcategory',
            value: selectedOption?.value || '',
            type: 'text'
          }
        })}
        name="subcategory"
        value={postData ? optionSubCategoryPeinture.find(opt => opt.value === postData.subcategory) : null}
        placeholder={t('placeholder_peinture', { lng: lang })}
        isDisabled={!postData?.category}
      />
      <small className='text-danger'>{t('field_required', { lng: lang })}</small>
    </div>
  );
}
