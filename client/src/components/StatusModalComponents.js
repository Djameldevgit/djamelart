 
  
  // Componente: Wilaya y commune
  export const WilayaCommune = ({ postData, handleWilayaChange, handleCommuneChange, wilayasOptions, communesOptions }) => (
    <div>


      <div className="form-group">
           <label>Localisation de l'artiste</label>
        <select
          className="form-control"
          name="wilaya"
          value={postData.wilaya}
          onChange={handleWilayaChange}
        >
          <option value="">Sélectionnez une wilaya</option>
          {wilayasOptions}
        </select>
      </div>
  
      <div className="form-group">
        <select
          className="form-control"
          name="commune"
          value={postData.commune}
          onChange={handleCommuneChange}
        >
          <option value="">Sélectionnez la commune</option>
          {communesOptions}
        </select>
      </div>
    </div>
  );
  
 

  