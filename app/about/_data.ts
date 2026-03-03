// ─────────────────────────────────────────────────────────────────────────────
// DATOS ESTÁTICOS — app/about/_data.ts
// ─────────────────────────────────────────────────────────────────────────────
// En producción estos datos vendrían de un CMS (Contentful, Sanity, etc.).
// Separados del JSX para facilitar edición de contenido sin tocar componentes.

import { FlaskConical, ShieldCheck, Microscope, Zap, Globe, Leaf, Users, Award } from 'lucide-react';

export const PRINCIPIOS = [
  {
    icon: FlaskConical,
    numero: '01',
    titulo: 'Evidencia Primero',
    cuerpo:
      'Cada ingrediente en nuestras fórmulas tiene al menos un ensayo clínico aleatorizado detrás. No usamos extractos propietarios sin respaldo, no inflamos dosis por marketing.',
  },
  {
    icon: ShieldCheck,
    numero: '02',
    titulo: 'Transparencia Total',
    cuerpo:
      'Publicamos los Certificados de Análisis (COA) de cada lote en nuestra web. Puedes verificar la pureza de lo que estás consumiendo antes de comprarlo.',
  },
  {
    icon: Microscope,
    numero: '03',
    titulo: 'Sin Compromisos',
    cuerpo:
      'Cero rellenos, cero colorantes artificiales, cero maltodextrina de relleno. Si un ingrediente no tiene función demostrada, no está en la fórmula.',
  },
];

export const PROCESO_STEPS = [
  {
    romano: 'I',
    fase: 'Investigación',
    titulo: 'Revisión de Literatura Científica',
    detalle:
      'Nuestro equipo de formuladores revisa meta-análisis y estudios de intervención publicados en PubMed y Cochrane Library. Solo pasan los ingredientes con evidencia Nivel A o B.',
    dato: '+2,400 papers revisados hasta la fecha',
  },
  {
    romano: 'II',
    fase: 'Formulación',
    titulo: 'Dosificación Clínicamente Efectiva',
    detalle:
      'Formulamos en las dosis exactas que demostraron efecto en estudios — no dosis simbólicas para incluir el ingrediente en la etiqueta. Si la dosis efectiva es cara, asumimos el costo.',
    dato: '100% dosis en rangos clínicos',
  },
  {
    romano: 'III',
    fase: 'Sourcing',
    titulo: 'Materias Primas Certificadas',
    detalle:
      'Trabajamos exclusivamente con proveedores que cuentan con certificaciones GMP, Informed Sport o NSF. Cada lote de materia prima es re-analizado en nuestras instalaciones antes de producción.',
    dato: '14 proveedores certificados activos',
  },
  {
    romano: 'IV',
    fase: 'Producción',
    titulo: 'Fabricación GMP en instalaciones auditadas',
    detalle:
      'Producimos en instalaciones con certificación cGMP (Current Good Manufacturing Practices). Cada batch tiene número de lote trazable desde la materia prima hasta el producto final.',
    dato: 'Auditado anualmente por terceros',
  },
  {
    romano: 'V',
    fase: 'Verificación',
    titulo: 'Análisis Independiente de Terceros',
    detalle:
      'Antes de liberar cualquier lote al mercado, enviamos muestras a laboratorios independientes acreditados. Verificamos pureza, potencia, ausencia de contaminantes y metales pesados.',
    dato: 'COA público disponible por lote',
  },
];

export const CERTIFICACIONES = [
  { label: 'Pureza Promedio Verificada', valor: '99.2%', sub: 'por lote analizado'    },
  { label: 'Lotes Publicados con COA',   valor: '100%',  sub: 'sin excepciones'        },
  { label: 'Estudios de Respaldo',       valor: '2.4K+', sub: 'literatura revisada'    },
  { label: 'Atletas Activos',            valor: '50K+',  sub: 'comunidad verificada'   },
  { label: 'Años en el Mercado',         valor: '8',     sub: 'desde 2017'             },
  { label: 'Países con Envío',           valor: '24',    sub: 'y en expansión'         },
];

export const VALORES = [
  { icon: Zap,        label: 'Alto rendimiento sin comprometer la salud'       },
  { icon: Globe,      label: 'Sourcing global, estándar único de calidad'      },
  { icon: Leaf,       label: 'Comprometidos con ingredientes sostenibles'       },
  { icon: Users,      label: 'Comunidad de atletas reales como brújula'        },
  { icon: Award,      label: 'Reconocidos por 3 premios de industria'          },
  { icon: ShieldCheck,label: 'Transparencia sin filtros en cada decisión'      },
];

export const HITOS = [
  { año: '2017', hito: 'Fundación',          desc: 'Primer lote de Titan Whey Isolate. 500 unidades vendidas en 3 días.'         },
  { año: '2019', hito: 'Certificación GMP',  desc: 'Obtenemos la certificación cGMP y empezamos a publicar COAs públicos.'       },
  { año: '2021', hito: 'Berserker Pre-Workout', desc: 'Lanzamos la fórmula pre-workout más vendida de nuestra historia.'        },
  { año: '2024', hito: '50K Atletas',        desc: 'Alcanzamos los 50,000 clientes activos en 24 países.'                       },
];

export const COA_CHECKLIST = [
  'Pureza del ingrediente activo (%)',
  'Ausencia de metales pesados certificada',
  'Sin contaminantes microbianos',
  'Disolventes residuales por debajo del límite ICH Q3C',
  'Identidad molecular verificada por HPLC',
];
