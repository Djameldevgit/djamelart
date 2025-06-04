import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { bloquearUsuario } from "../../redux/actions/userBlockAction";

const BloqueModalUser = ({ setOpenBlockModal, user }) => {
  const { auth } = useSelector(state => state);
  const dispatch = useDispatch();

  const [datosBloqueo, setDatosBloqueo] = useState({
    motivo: "",
    content: "",
    fechaBloqueo: "",
    fechaLimite: ""
  });

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setDatosBloqueo({ ...datosBloqueo, [name]: value });
  };

  const handleBloqueo = (e) => {
    e.preventDefault();

    const { motivo, fechaBloqueo, fechaLimite } = datosBloqueo;

    if (!motivo || !fechaBloqueo || !fechaLimite) {
      alert("❌ Completa todos los campos, incluyendo la fecha y hora.");
      return;
    }

    const inicio = new Date(fechaBloqueo);
    const limite = new Date(fechaLimite);
    const ahora = new Date();

    if (inicio < ahora) {
      alert("⚠️ La fecha de inicio debe ser actual o futura.");
      return;
    }

    if (limite <= inicio) {
      alert("⚠️ La fecha límite debe ser posterior a la fecha de inicio.");
      return;
    }

    dispatch(bloquearUsuario({ auth, datosBloqueo, user }));
  };

  return (
    <div className="modalbloquear" >
      <div className="modalbloquear-dialog">
        <div className="modalbloquar-content">
          <div className="modalbloquear-header">
            <h5 className="modalbloquear-title">Confirmar bloqueo</h5>
            <button type="button" className="btnbloquear btn-secondary" onClick={() => setOpenBlockModal(false)}>Cerrar</button>
          </div>
          <form onSubmit={handleBloqueo}>
            <div className="modalbloquear-body">
              <div className="form-group-bloquear">
                <label>Raison du blocage</label>
                <select className="form-control-bloquar" name="motivo" value={datosBloqueo.motivo} onChange={handleChangeInput} required>
    <option value="">Sélectionner le motif</option>
    <option value="Comportement abusif">Comportement abusif</option>
    <option value="Spam">Spam</option>
    <option value="Violation des conditions d'utilisation">Violation des conditions d'utilisation</option>
    <option value="Langage offensant">Langage offensant</option>
    <option value="Fraude">Fraude</option>
    <option value="Usurpation d'identité">Usurpation d'identité</option>
    <option value="Contenu inapproprié">Contenu inapproprié</option>
    <option value="Violation de la vie privée">Violation de la vie privée</option>
    <option value="Interruption du service">Interruption du service</option>
    <option value="Activité suspecte">Activité suspecte</option>
    <option value="Autre">Autre</option>
</select>
              </div>
              <div className="form-group">
                <label>Detalles adicionales</label>
                <textarea name="content" value={datosBloqueo.content} onChange={handleChangeInput} placeholder="Proporciona más detalles sobre el motivo del bloqueo" className="form-control" />
              </div>
              <div className="form-group">
                <label>Fecha de inicio del bloqueo</label>
                <input type="datetime-local" className="form-control" name="fechaBloqueo" value={datosBloqueo.fechaBloqueo} onChange={handleChangeInput} />
              </div>
              <div className="form-group">
                <label>Fecha límite del bloqueo</label>
                <input type="datetime-local" className="form-control" name="fechaLimite" value={datosBloqueo.fechaLimite} onChange={handleChangeInput} />
              </div>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-danger">Bloquear</button>
              <button type="button" className="btn btn-secondary" onClick={() => setOpenBlockModal(false)}>Cerrar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BloqueModalUser;
