// ─────────────────────────────────────────────────────────────────────────────
// DATOS ESTÁTICOS — app/sizing/_data.ts
// ─────────────────────────────────────────────────────────────────────────────
// En producción estos datos vendrían de un CMS (Contentful, Sanity, etc.).
// Separados del JSX para facilitar edición de contenido sin tocar componentes.
//
// Convención "_" = archivo de infraestructura de la ruta, no un componente.
// Sigue el mismo patrón de about/_data.ts, affiliates/_data.ts, etc.

// ─────────────────────────────────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────────────────────────────────

export interface Producto {
  nombre:               string;
  categoria:            string;
  presentaciones:       string[];
  scoop:                string;
  proteina_por_servicio: string;
  dosis_recomendada:    string;
  cuando:               string;
  nota:                 string;
}

export interface FilaProtein {
  peso:     string;
  rango:    string;
  objetivo: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCTOS — presentaciones, dosis y notas científicas
// ─────────────────────────────────────────────────────────────────────────────

export const PRODUCTOS: Producto[] = [
  {
    nombre:               'Titan Whey Isolate',
    categoria:            'Proteína',
    presentaciones:       ['1 kg (33 servicios)', '2 kg (66 servicios)', '5 kg (166 servicios)'],
    scoop:                '30g',
    proteina_por_servicio: '27g',
    dosis_recomendada:    '1–2 scoops/día',
    cuando:               'Post-entreno o entre comidas',
    nota:                 'Para objetivos de ganancia muscular: 1.6g de proteína total por kg de peso corporal al día (todas las fuentes combinadas).',
  },
  {
    nombre:               'Berserker Pre-Workout',
    categoria:            'Energía',
    presentaciones:       ['300g (30 servicios)', '600g (60 servicios)'],
    scoop:                '10g',
    proteina_por_servicio: '—',
    dosis_recomendada:    '1 scoop / 20 min antes',
    cuando:               'Pre-entreno (no tomar después de las 16:00h)',
    nota:                 'Cafeína por servicio: 200mg. Usuarios sensibles a la cafeína: comenzar con medio scoop.',
  },
  {
    nombre:               'Creatina Monohidratada',
    categoria:            'Fuerza',
    presentaciones:       ['300g (60 servicios)', '500g (100 servicios)', '1 kg (200 servicios)'],
    scoop:                '5g',
    proteina_por_servicio: '—',
    dosis_recomendada:    '3–5g/día',
    cuando:               'Cualquier momento del día (consistencia > timing)',
    nota:                 'Protocolo de carga opcional: 20g/día divididos en 4 tomas durante 5 días. Después pasar a 3–5g de mantenimiento.',
  },
  {
    nombre:               'Mass Gainer Colossus',
    categoria:            'Volumen',
    presentaciones:       ['2 kg (16 servicios)', '5 kg (40 servicios)'],
    scoop:                '125g',
    proteina_por_servicio: '31g',
    dosis_recomendada:    '1 servicio/día',
    cuando:               'Entre comidas principales o post-entreno',
    nota:                 'Aporta ~500 kcal por servicio. Solo recomendado si tu ingesta calórica diaria está por debajo de tu TDEE + 300-500 kcal.',
  },
  {
    nombre:               'Vitaminas & Minerales Titan',
    categoria:            'Salud',
    presentaciones:       ['60 cápsulas (30 días)', '120 cápsulas (60 días)'],
    scoop:                '2 cápsulas',
    proteina_por_servicio: '—',
    dosis_recomendada:    '2 cápsulas/día',
    cuando:               'Con el desayuno para mejor absorción de vitaminas liposolubles',
    nota:                 'Contiene vitamina K2-MK7, D3, magnesio bisglicinato y zinc. Formulado para atletas con mayor depleción de micronutrientes.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CALCULADORA DE PROTEÍNA — tabla de referencia rápida por peso corporal
// Basado en: Morton et al. (2018) y Stokes et al. (2018)
// ─────────────────────────────────────────────────────────────────────────────

export const CALCULADORA_PROTEINA: FilaProtein[] = [
  { peso: '50–60 kg',  rango: '80g–96g',      objetivo: 'Mantenimiento / Principiante'         },
  { peso: '61–70 kg',  rango: '98g–112g',     objetivo: 'Ganancia muscular moderada'            },
  { peso: '71–80 kg',  rango: '114g–128g',    objetivo: 'Ganancia muscular activa'              },
  { peso: '81–90 kg',  rango: '130g–144g',    objetivo: 'Atleta de fuerza / alto volumen'       },
  { peso: '91–100 kg', rango: '146g–160g',    objetivo: 'Competidor / halterófilo'              },
  { peso: '100+ kg',   rango: '1.6g × peso',  objetivo: 'Cálculo individual recomendado'        },
];
