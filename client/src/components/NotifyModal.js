import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Modal } from "react-bootstrap";

const NotifyModal = ({ show, handleClose }) => {
  const notify = useSelector((state) => state.notify);

  useEffect(() => {
    if (notify.data.length > 0) {
      const ultima = notify.data[0];

      // 📌 Notificación push si el navegador lo permite
      if (
        !ultima.isRead &&
        typeof Notification !== "undefined" &&
        Notification.permission === "granted"
      ) {
        try {
          new Notification("Nueva notificación", {
            body: ultima.text,
            icon: ultima.user.avatar || "/icon.png",
          });
        } catch (error) {
          console.warn("Notificación no soportada en este dispositivo", error);
        }
      }

      // 📌 Vibración solo si está soportada
      if ("vibrate" in navigator) {
        navigator.vibrate([300, 100, 300, 100, 600]);
      } else {
        console.log("⚠️ Vibración no soportada en este dispositivo/navegador");
      }
    }
  }, [notify.data]);

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Notificaciones</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {notify.data.length === 0 ? (
          <p>No tienes notificaciones</p>
        ) : (
          notify.data.map((n) => (
            <div
              key={n._id}
              style={{
                padding: "10px",
                borderBottom: "1px solid #ddd",
                backgroundColor: n.isRead ? "#fff" : "#eef6ff",
              }}
            >
              <strong>{n.user.username}</strong>: {n.text}
            </div>
          ))
        )}
      </Modal.Body>
    </Modal>
  );
};

export default NotifyModal;
