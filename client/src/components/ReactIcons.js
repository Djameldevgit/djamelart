import Select from 'react-select';
 
 
import {  FaTv , FaSuitcaseRolling,   FaCar, FaHome, FaLaptop, FaMobileAlt, FaTshirt, FaHeart, FaCouch, FaBriefcase, FaTools, FaGamepad, FaWrench, FaCog, FaBasketballBall } from 'react-icons/fa';
 
export function CategorySelect({ handleChangeInput, postData }) {
  const options = [
    { value: 'Électroménager & Électronique', label: (<><FaTv style={{ marginRight: '8px' }}/> Électroménager & Électronique</>) },
    { value: 'Automobiles & Véhicules', label: (<><FaCar style={{ marginRight: '8px' }}/> Automobiles & Véhicules</>) },
    { value: 'Immobilier', label: (<><FaHome style={{ marginRight: '8px' }}/> Immobilier</>) },
    { value: 'Informatique', label: (<><FaLaptop style={{ marginRight: '8px' }}/> Informatique</>) },
    { value: 'Téléphones & Accessoires', label: (<><FaMobileAlt style={{ marginRight: '8px' }}/> Téléphones & Accessoires</>) },
    { value: 'Vêtements & Mode', label: (<><FaTshirt style={{ marginRight: '8px' }}/> Vêtements & Mode</>) },
    { value: 'Santé & Beauté', label: (<><FaHeart style={{ marginRight: '8px' }}/> Santé & Beauté</>) },
    { value: 'Meubles & Maison', label: (<><FaCouch style={{ marginRight: '8px' }}/> Meubles & Maison</>) },
    { value: 'Emploi', label: (<><FaBriefcase style={{ marginRight: '8px' }}/> Emploi</>) },
    { value: 'Services', label: (<><FaTools style={{ marginRight: '8px' }}/> Services</>) },
    { value: 'Loisirs & Divertissements', label: (<><FaGamepad style={{ marginRight: '8px' }}/> Loisirs & Divertissements</>) },
    { value: 'Matériaux & Équipement', label: (<><FaWrench style={{ marginRight: '8px' }}/> Matériaux & Équipement</>) },
    { value: 'Pièces détachées', label: (<><FaCog style={{ marginRight: '8px' }}/> Pièces détachées</>) },
    { value: 'Sport', label: (<><FaBasketballBall style={{ marginRight: '8px' }}/> Sport</>) },
    { value: 'Voyage', label: (<><FaSuitcaseRolling style={{ marginRight: '8px' }} /> Voyage</>) },
    
    
  ];

  return (
     
      <Select
        options={options}
        onChange={(selectedOption) => handleChangeInput({
          target: {
            name: 'subCategory',
            value: selectedOption?.value || '',
            type: 'text',
            checked: undefined
          }
        })}
        name="subCategory"
        value={postData ? options.find(opt => opt.value === postData.subCategory) : null}
        placeholder="Sélectionner une catégorie"
      />
  
  );
}

 
 
 
   
 

  
  
 