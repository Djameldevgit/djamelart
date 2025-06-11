import React from "react";
 
const InfoAplicacion = () => {
  return (
    <div className="info-container">
    {/* Titre principal */}
    <h1 className="info-title">À propos de notre application</h1>

    {/* Section : Comment est-elle construite ? */}
    <section className="info-section">
      <h2>Comment notre application est-elle construite ?</h2>
      <p>
        Notre plateforme utilise la stack technologique <strong>MERN</strong>, qui associe 
        des technologies modernes pour offrir des performances optimales.
      </p>
      
      <ul className="info-list">
        <li><strong>Frontend - React.js :</strong> Expérience rapide et interactive avec Redux.</li>
        <li><strong>Backend - Node.js et Express.js :</strong> Gestion des requêtes et sécurité.</li>
        <li><strong>Base de données - MongoDB :</strong> Stockage efficace des propriétés et utilisateurs.</li>
        <li><strong>Authentification - JWT :</strong> Protection des données avec des tokens de sécurité.</li>
        <li><strong>Cloudinary :</strong> Gestion optimisée des images des propriétés.</li>
      </ul>
    </section>

    {/* Section : Comment fonctionne-t-elle ? */}
    <section className="info-section">
      <h2>Comment fonctionne notre application ?</h2>
      <p>
        Notre application est conçue pour être intuitive et efficace pour les acheteurs et les vendeurs.
      </p>
      
      <ul className="info-list">
        <li><strong>Inscription et Connexion :</strong> Accédez en toute sécurité à votre compte.</li>
        <li><strong>Publication des Propriétés :</strong> Ajoutez vos annonces avec photos et détails.</li>
        <li><strong>Recherche et Filtres :</strong> Trouvez des propriétés selon leur emplacement et prix.</li>
        <li><strong>Contact avec les Propriétaires :</strong> Envoyez des messages directement depuis la plateforme.</li>
        <li><strong>Gestion du Profil :</strong> Modifiez vos informations et administrez vos publications.</li>
      </ul>
    </section>
  </div>
  );
};

export default InfoAplicacion;
