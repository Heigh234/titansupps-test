'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useToastStore } from '@/store/useToastStore';
import { useAuthStore } from '@/store/useAuthStore';
import { getProfile, updateProfile } from '@/actions/account';

interface Profile {
  name:    string | null;
  email:   string;
  phone:   string | null;
  city:    string | null;
  country: string | null;
}

export default function TabProfile() {
  const addToast             = useToastStore((state) => state.addToast);
  const { user, initialize } = useAuthStore();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);

  // Carga el perfil completo desde Supabase (name, phone, city, country)
  // El store solo tiene name + email — no tiene phone/city/country
  useEffect(() => {
    getProfile()
      .then((data) => {
        if (data) {
          setProfile({
            name:    data.name    ?? '',
            email:   user?.email  ?? '',
            phone:   data.phone   ?? '',
            city:    data.city    ?? '',
            country: data.country ?? '',
          });
        }
      })
      .catch(() => {
        addToast({ type: 'error', title: 'Error', message: 'No se pudo cargar tu perfil.' });
      })
      .finally(() => setLoading(false));
  }, [user?.email, addToast]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd     = new FormData(e.currentTarget);
    const result = await updateProfile(fd);
    setSaving(false);

    if ('error' in result) {
      addToast({ title: 'Error', message: result.error, type: 'error' });
      return;
    }

    // Refrescar el store para actualizar el nombre en el navbar
    await initialize();
    addToast({ title: 'Perfil actualizado', type: 'success', message: 'Tus datos han sido guardados.' });
  };

  if (loading) {
    return (
      <motion.div
        key="profile-loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center py-24"
      >
        <Loader2 size={24} className="animate-spin text-titan-accent" />
      </motion.div>
    );
  }

  if (!profile) return null;

  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="max-w-2xl space-y-8"
    >
      <h2 className="font-heading text-2xl uppercase tracking-wider text-titan-text border-b border-titan-border pb-4">
        Información del Atleta
      </h2>

      <form className="space-y-6" onSubmit={handleSave}>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-titan-text-muted uppercase tracking-wider mb-2">
              Nombre Completo
            </label>
            <input
              type="text"
              name="name"
              defaultValue={profile.name ?? ''}
              className="w-full bg-titan-surface border border-titan-border p-3 text-titan-text focus:outline-none focus:border-titan-accent transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-titan-text-muted uppercase tracking-wider mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              defaultValue={profile.email}
              disabled
              className="w-full bg-titan-surface border border-titan-border p-3 text-titan-text-muted opacity-60 cursor-not-allowed"
            />
            <p className="text-[11px] text-titan-text-muted mt-1">El email no se puede cambiar desde aquí.</p>
          </div>
        </div>

        <div className="border-t border-titan-border pt-6 space-y-6">
          <h3 className="font-heading text-lg uppercase tracking-wider text-titan-text">Datos de Contacto</h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-titan-text-muted uppercase tracking-wider mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                name="phone"
                defaultValue={profile.phone ?? ''}
                placeholder="+34 600 000 000"
                className="w-full bg-titan-surface border border-titan-border p-3 text-titan-text focus:outline-none focus:border-titan-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-titan-text-muted uppercase tracking-wider mb-2">
                Ciudad
              </label>
              <input
                type="text"
                name="city"
                defaultValue={profile.city ?? ''}
                placeholder="Madrid"
                className="w-full bg-titan-surface border border-titan-border p-3 text-titan-text focus:outline-none focus:border-titan-accent transition-colors"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 bg-titan-text text-titan-bg font-heading text-xl uppercase tracking-wider hover:bg-titan-accent hover:text-white transition-colors flex items-center gap-2 disabled:opacity-60"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          Guardar Cambios
        </button>
      </form>
    </motion.div>
  );
}
