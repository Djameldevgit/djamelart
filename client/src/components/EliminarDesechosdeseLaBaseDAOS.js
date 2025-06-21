import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { deleteDataAPI } from '../utils/fetchData';

const EliminarDesechosdeseLaBaseDAOS = () => {
  const { token } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(false);

  const cleanOrphanedPosts = async () => {
    if (!token) return alert("Token de autenticación no disponible.");

    setLoading(true);
    try {
      const response = await deleteDataAPI('posts', token); // DELETE /api/posts
      const msg = response?.data?.message || 'Limpieza completada.';
      alert(`✅ ${msg}`);
    } catch (err) {
      console.error('❌ Error al limpiar posts huérfanos:', err);
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.msg ||
        err?.response?.data?.error ||
        err?.message ||
        'Error desconocido';
      alert(`⚠️ Error al limpiar: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={cleanOrphanedPosts}
      className="bg-red-500 hover:bg-red-600 text-white p-2 px-4 rounded disabled:opacity-60"
      disabled={loading}
    >
      {loading ? 'Limpiando...' : 'Limpiar Posts Huérfanos'}
    </button>
  );
};

export default EliminarDesechosdeseLaBaseDAOS;
