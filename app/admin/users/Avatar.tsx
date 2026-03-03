/**
 * app/admin/users/Avatar.tsx
 *
 * Avatar circular con iniciales y color de fondo determinístico.
 * Sin imagen real — evita dependencias de assets y funciona para
 * cualquier cliente sin foto de perfil.
 *
 * Tamaños disponibles:
 *   sm → 32×32px  (tabla de clientes)
 *   md → 40×40px  (default)
 *   lg → 56×56px  (encabezado del modal de perfil)
 */

import { avatarColor, initials } from './utils';
import type { Client } from './types';

interface AvatarProps {
  client: Client;
  size?: 'sm' | 'md' | 'lg';
}

export default function Avatar({ client, size = 'md' }: AvatarProps) {
  const sizeClass =
    size === 'sm' ? 'w-8 h-8 text-xs'   :
    size === 'lg' ? 'w-14 h-14 text-xl' :
                   'w-10 h-10 text-sm';

  return (
    <div
      className={`${sizeClass} ${avatarColor(client.id)} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0`}
      aria-label={`Avatar de ${client.name}`}
    >
      {initials(client.name)}
    </div>
  );
}
