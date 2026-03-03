/**
 * app/blog/[slug]/data.ts
 *
 * Base de datos de artículos del blog (mock estático).
 * En producción se reemplazaría por llamadas a una API/CMS/DB.
 *
 * Exporta:
 *   POSTS          → Array completo de artículos
 *   getPost()      → Busca un post por slug
 *   getRelatedPosts() → Resuelve slugs relacionados a objetos BlogPost
 */

import type { BlogPost } from './types';

export const POSTS: BlogPost[] = [

  /* ══════════════════════════════════════════════════════════════════════
     1. CREATINA — GUÍA DEFINITIVA 2026
  ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'creatina-guia-definitiva-2026',
    title: 'Creatina: La Guía Definitiva de 2026 Basada en Evidencia',
    category: 'Suplementación',
    categoryValue: 'suplementacion',
    excerpt: 'Después de revisar más de 300 estudios sobre creatina monohidratada, aquí está todo lo que necesitas saber: qué hace, cuánto tomar, cuándo tomarla y por qué es el suplemento más respaldado por la ciencia.',
    image: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?q=80&w=1400&auto=format&fit=crop',
    author: 'Dr. Marcos Villanueva',
    authorRole: 'Director de Formulación',
    authorInitial: 'M',
    date: '20 Feb 2026',
    readTime: '12 min',
    tags: ['Creatina', 'Fuerza', 'Evidencia Nivel A'],
    toc: ['¿Qué es la creatina exactamente?', 'El mecanismo real detrás del rendimiento', '¿Cuánta tomar y cuándo?', 'Fase de carga: sí o no', 'Mitos que necesitan morir', 'Conclusión'],
    relatedSlugs: ['zinc-magnesio-testosterona', 'ventana-anabolica-mito', 'proteina-whey-vs-caseina'],
    body: [
      { type: 'paragraph', content: 'Si solo pudieras tomar un suplemento, debería ser la creatina. No es marketing. Es el suplemento con más evidencia científica acumulada de toda la historia de la suplementación deportiva, con más de 1.000 estudios publicados y más de 300 ensayos clínicos controlados que confirman su eficacia y seguridad.' },
      { type: 'h2', content: '¿Qué es la creatina exactamente?' },
      { type: 'paragraph', content: 'La creatina es un compuesto nitrogenado que el cuerpo produce de forma natural en el hígado, riñones y páncreas a partir de los aminoácidos glicina y arginina. El 95% de la creatina corporal se almacena en el músculo esquelético en forma de fosfocreatina (PCr). El otro 5% se encuentra en el cerebro, el corazón y los testículos.' },
      { type: 'paragraph', content: 'La dieta aporta entre 1 y 2 g diarios (principalmente de carne y pescado), pero los depósitos musculares suelen estar al 60-80% de su capacidad máxima. La suplementación permite saturar esos depósitos, lo que tiene consecuencias directas en el rendimiento.' },
      { type: 'h2', content: 'El mecanismo real detrás del rendimiento' },
      { type: 'paragraph', content: 'El ATP (adenosín trifosfato) es la moneda energética del cuerpo. Durante el ejercicio de alta intensidad, el ATP se agota en segundos. Aquí entra la fosfocreatina: dona un grupo fosfato al ADP para regenerar ATP rápidamente, permitiendo mantener el esfuerzo máximo durante más tiempo.' },
      { type: 'highlight', content: 'Con los depósitos de creatina saturados, puedes mantener la potencia máxima entre un 10% y un 20% más de tiempo. En términos prácticos: más repeticiones, más peso, más sprints, mejor recuperación entre series.' },
      { type: 'paragraph', content: 'Más allá del rendimiento, la creatina tiene efectos secundarios positivos documentados: mayor volumen celular (las células musculares retienen más agua intracelular), aumento en la síntesis de IGF-1, reducción del daño muscular post-entrenamiento y, en estudios más recientes, mejoras en función cognitiva bajo privación de sueño o situaciones de estrés.' },
      { type: 'h2', content: '¿Cuánta tomar y cuándo?' },
      { type: 'paragraph', content: 'El protocolo estándar validado por la mayoría de estudios es simple: 3 a 5 g diarios de creatina monohidratada. Eso es todo. Sin complicaciones.' },
      { type: 'list', items: ['3-5 g/día mantiene los depósitos saturados una vez llenos', 'El momento de ingesta (pre o post entreno) tiene un efecto marginal', 'Con comida mejora la absorción (especialmente con carbohidratos + proteínas)', 'No es necesario ciclar: la creatina es segura en uso continuo'] },
      { type: 'h2', content: 'Fase de carga: sí o no' },
      { type: 'paragraph', content: 'La "fase de carga" (20 g/día durante 5-7 días) permite saturar los depósitos en una semana en lugar de 3-4 semanas. El resultado final es idéntico. La diferencia es solo la velocidad.' },
      { type: 'warning', label: 'Considera esto', content: 'La fase de carga puede causar molestias gastrointestinales en personas sensibles. Si tienes estómago delicado, ve directo a 5 g diarios sin carga. Llegarás al mismo punto en menos de un mes.' },
      { type: 'h2', content: 'Mitos que necesitan morir' },
      { type: 'list', items: ['"La creatina daña los riñones" → Falso en personas sanas. Décadas de estudios lo confirman.', '"Hay que ciclarla" → No hay ninguna razón fisiológica para hacerlo.', '"La creatina con cafeína pierde efecto" → El único estudio que lo sugirió nunca fue replicado.', '"Solo sirve para fuerza/volumen" → También mejora el rendimiento en sprints, saltos y capacidad cognitiva.'] },
      { type: 'h2', content: 'Conclusión' },
      { type: 'paragraph', content: '5 g al día de creatina monohidratada (Creapure® si buscas máxima pureza). Sin ciclos, sin timing complejo, sin misterio. Es el suplemento más barato, más seguro y más efectivo que existe. Si no la estás tomando, estás dejando rendimiento sobre la mesa.' },
    ],
  },

  /* ══════════════════════════════════════════════════════════════════════
     2. WHEY VS CASEÍNA
  ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'proteina-whey-vs-caseina',
    title: 'Whey vs. Caseína: ¿Cuál Proteína Necesitas Realmente?',
    category: 'Nutrición',
    categoryValue: 'nutricion',
    excerpt: 'La velocidad de absorción importa, pero no de la manera en que el marketing te ha dicho. Analizamos la ciencia real detrás de cada proteína.',
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=1400&auto=format&fit=crop',
    author: 'Dra. Elena Suárez',
    authorRole: 'Nutricionista Deportiva',
    authorInitial: 'E',
    date: '15 Feb 2026',
    readTime: '8 min',
    tags: ['Proteína', 'Nutrición', 'Whey', 'Caseína'],
    toc: ['Velocidad de absorción: el mito del timing', 'Perfil de aminoácidos comparado', '¿Cuándo usar cada una?', 'La respuesta corta'],
    relatedSlugs: ['ventana-anabolica-mito', 'creatina-guia-definitiva-2026', 'sleep-recuperacion-muscular'],
    body: [
      { type: 'paragraph', content: 'La industria lleva décadas vendiendo la idea de que la velocidad de absorción de la proteína es el factor determinante para la ganancia muscular. Whey para después de entrenar porque es "rápida". Caseína antes de dormir porque es "lenta". La realidad, como siempre, es más matizada.' },
      { type: 'h2', content: 'Velocidad de absorción: el mito del timing' },
      { type: 'paragraph', content: 'El whey eleva los aminoácidos en sangre más rápido que la caseína. Eso es real. Pero la síntesis proteica muscular (MPS) no funciona como un interruptor de encendido/apagado. Lo que importa es el total de proteína de calidad consumida en el día, no el momento exacto de cada dosis.' },
      { type: 'highlight', content: 'Un meta-análisis de 2023 analizó 49 estudios: la diferencia en ganancia muscular entre quienes usaban whey y quienes usaban caseína fue estadísticamente insignificante cuando la ingesta total de proteína era equivalente.' },
      { type: 'h2', content: 'Perfil de aminoácidos comparado' },
      { type: 'paragraph', content: 'Ambas son proteínas completas con todos los aminoácidos esenciales. La diferencia está en la concentración de leucina (el aminoácido que activa el mTOR, el interruptor principal de la síntesis proteica) y en la digestibilidad.' },
      { type: 'list', items: ['Whey aislado: ~11-12% leucina, PDCAAS 1.0, absorción en 1-2h', 'Caseína micelar: ~9-10% leucina, PDCAAS 1.0, absorción en 5-7h', 'Whey concentrado: ~10% leucina, algo más económico, similar eficacia'] },
      { type: 'h2', content: '¿Cuándo usar cada una?' },
      { type: 'paragraph', content: 'La lógica práctica que sí tiene respaldo: el whey post-entreno aprovecha el periodo donde el músculo es más sensible a los aminoácidos. La caseína antes de dormir mantiene un flujo sostenido de aminoácidos durante las 7-8 horas de ayuno nocturno, cuando el catabolismo es mayor.' },
      { type: 'warning', label: 'Ojo con el marketing', content: 'Los "blends" de proteína que mezclan whey + caseína + otras fuentes raramente justifican su precio premium. La evidencia que los respalda es mínima comparada con proteína de fuente única de calidad.' },
      { type: 'h2', content: 'La respuesta corta' },
      { type: 'paragraph', content: 'Si tienes presupuesto para uno solo: whey aislado. Más leucina, mejor digestibilidad, más versátil. Si puedes permitirte los dos: whey en el día y post-entreno, caseína micelar antes de dormir. Si no, no pierdas el sueño: la ingesta total del día importa más que cualquier otra variable.' },
    ],
  },

  /* ══════════════════════════════════════════════════════════════════════
     3. PRE-WORKOUT SIN CRASH
  ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'pre-workout-sin-crash',
    title: 'Cómo Elegir un Pre-Workout Sin el Crash Post-Entreno',
    category: 'Energía',
    categoryValue: 'energia',
    excerpt: 'Los picos de cafeína son el problema, no la cafeína en sí. Aquí está el sistema correcto.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1400&auto=format&fit=crop',
    author: 'Iván Cortés',
    authorRole: 'Especialista en Rendimiento',
    authorInitial: 'I',
    date: '10 Feb 2026',
    readTime: '6 min',
    tags: ['Pre-Workout', 'Cafeína', 'Energía', 'Rendimiento'],
    toc: ['Por qué ocurre el crash', 'Ingredientes que lo provocan', 'Ingredientes que lo previenen', 'El stack correcto'],
    relatedSlugs: ['creatina-guia-definitiva-2026', 'zinc-magnesio-testosterona', 'ventana-anabolica-mito'],
    body: [
      { type: 'paragraph', content: 'El crash post-pre-workout es tan predecible como evitable. La mayoría de la gente lo atribuye a "mucha cafeína" cuando el problema real es la cafeína sin buffer, sin soporte adrenérgico y sin ingredientes que suavicen la curva de energía.' },
      { type: 'h2', content: 'Por qué ocurre el crash' },
      { type: 'paragraph', content: 'La cafeína bloquea los receptores de adenosina, el neurotransmisor que genera somnolencia. Cuando la cafeína se metaboliza (vida media de 5-6h), la adenosina acumulada inunda los receptores de golpe. Resultado: crash. El pico inicial fue demasiado alto y la caída es proporcional.' },
      { type: 'h2', content: 'Ingredientes que lo provocan' },
      { type: 'list', items: ['Cafeína anhidra sola en dosis altas (+300mg sin buffer)', 'Geranium/DMAA: estimulantes sintéticos con picos abruptos', 'Exceso de niacina (flush) seguido de bajada vascular', 'Beta-alanina en dosis incorrectas que generan ansiedad'] },
      { type: 'h2', content: 'Ingredientes que lo previenen' },
      { type: 'paragraph', content: 'Un pre-workout bien formulado incluye ingredientes que modulan la energía en lugar de solo disparar el sistema nervioso:' },
      { type: 'list', items: ['L-Teanina (200mg): suaviza el pico de cafeína, mejora el foco sin ansiedad. Ratio ideal 1:2 con cafeína', 'L-Tirosina (500-1000mg): precursor de dopamina, sostiene la motivación sin crash', 'Extracto de té verde (EGCG): cafeína natural de liberación más gradual', 'Vitamina B6 + B12: cofactores para la síntesis de neurotransmisores'] },
      { type: 'highlight', content: 'El ratio cafeína:teanina de 1:2 (ej. 200mg cafeína + 400mg teanina) es la combinación con más evidencia para energía sostenida sin crash. Es literalmente el stack cognitivo más estudiado en neurociencia.' },
      { type: 'h2', content: 'El stack correcto' },
      { type: 'paragraph', content: 'Antes de comprar cualquier pre-workout, revisa la etiqueta. Si no tiene L-Teanina o algún adaptógeno (Ashwagandha, Rhodiola) y tiene más de 300mg de cafeína anhidra sola, prepárate para el crash. El Berserker de Titan usa 200mg de cafeína + 400mg de teanina + L-Tirosina precisamente por esta razón.' },
    ],
  },

  /* ══════════════════════════════════════════════════════════════════════
     4. VENTANA ANABÓLICA
  ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'ventana-anabolica-mito',
    title: 'La "Ventana Anabólica": Mito vs. Realidad en 2026',
    category: 'Entrenamiento',
    categoryValue: 'entrenamiento',
    excerpt: '¿Tienes realmente 30 minutos para tomar proteína después de entrenar? La respuesta te va a sorprender.',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1400&auto=format&fit=crop',
    author: 'Dr. Marcos Villanueva',
    authorRole: 'Director de Formulación',
    authorInitial: 'M',
    date: '5 Feb 2026',
    readTime: '7 min',
    tags: ['Entrenamiento', 'Proteína', 'Nutrición', 'Timing'],
    toc: ['El origen del mito', 'Lo que dice la ciencia actual', 'La ventana real', 'Conclusión práctica'],
    relatedSlugs: ['proteina-whey-vs-caseina', 'creatina-guia-definitiva-2026', 'sleep-recuperacion-muscular'],
    body: [
      { type: 'paragraph', content: 'La "ventana anabólica" —esos supuestos 30 minutos post-entreno en los que debes consumir proteína o perder todas las ganancias— es uno de los mitos más persistentes del fitness. Y su persistencia tiene una explicación: la industria de los suplementos la necesita.' },
      { type: 'h2', content: 'El origen del mito' },
      { type: 'paragraph', content: 'El concepto viene de estudios de los años 90 que observaron un aumento en la sensibilidad a la insulina y en la captación de nutrientes inmediatamente después del ejercicio. El problema es que esos estudios usaban sujetos en ayunas prolongadas y protocolos de ejercicio muy específicos. La extrapolación al entrenamiento convencional fue un salto enorme que la industria aprovechó.' },
      { type: 'h2', content: 'Lo que dice la ciencia actual' },
      { type: 'paragraph', content: 'Un meta-análisis de Schoenfeld et al. (2013, actualizado en 2022) analizó decenas de estudios sobre timing proteico. La conclusión: cuando se controla la ingesta total de proteína diaria, el momento exacto del consumo post-entreno tiene un efecto mínimo o nulo en la hipertrofia.' },
      { type: 'highlight', content: 'La síntesis proteica muscular elevada post-entrenamiento dura entre 24 y 48 horas, no 30 minutos. Tu ventana anabólica mide dos días, no media hora.' },
      { type: 'h2', content: 'La ventana real' },
      { type: 'paragraph', content: 'Donde sí existe una ventana relevante es en el repostaje de glucógeno. Si entrenas dos veces al día o tienes menos de 8 horas entre sesiones, sí importa consumir carbohidratos relativamente pronto para recuperar los depósitos antes de la siguiente sesión. Pero para el atleta promedio que entrena una vez al día, no hay urgencia.' },
      { type: 'list', items: ['Si entrenaste en ayunas: come proteína + carbos en la siguiente hora', 'Si comiste 1-2h antes de entrenar: tienes horas por delante sin problema', 'Si entrenas dos veces al día: sí prioriza la ingesta post-sesión', 'Para hipertrofia general: la distribución proteica en el día importa más que el timing'] },
      { type: 'h2', content: 'Conclusión práctica' },
      { type: 'paragraph', content: 'Come bien antes de entrenar, come bien después cuando te sea conveniente y asegúrate de llegar a tus gramos diarios de proteína. Eso es todo. No necesitas correr al vestuario con tu shaker si terminaste de entrenar. La biología no trabaja con cronómetros de 30 minutos.' },
    ],
  },

  /* ══════════════════════════════════════════════════════════════════════
     5. SUEÑO Y RECUPERACIÓN
  ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'sleep-recuperacion-muscular',
    title: 'Por Qué el Sueño es el Suplemento Más Poderoso que Existe',
    category: 'Recuperación',
    categoryValue: 'recuperacion',
    excerpt: 'Sin 7-9 horas de sueño de calidad, ningún suplemento, por caro que sea, va a optimizar tu recuperación.',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1400&auto=format&fit=crop',
    author: 'Dra. Elena Suárez',
    authorRole: 'Nutricionista Deportiva',
    authorInitial: 'E',
    date: '28 Ene 2026',
    readTime: '10 min',
    tags: ['Recuperación', 'Sueño', 'Hormonas', 'GH'],
    toc: ['Lo que ocurre mientras duermes', 'El impacto del déficit de sueño', 'Suplementos que realmente ayudan', 'Protocolo de higiene del sueño'],
    relatedSlugs: ['zinc-magnesio-testosterona', 'ventana-anabolica-mito', 'proteina-whey-vs-caseina'],
    body: [
      { type: 'paragraph', content: 'Podrías tener el stack de suplementos más caro del mercado, el programa de entrenamiento más optimizado y la dieta más precisa. Si duermes 5-6 horas, estás tirando todo eso a la basura. El sueño no es una variable opcional del rendimiento. Es la base sobre la que todo lo demás funciona.' },
      { type: 'h2', content: 'Lo que ocurre mientras duermes' },
      { type: 'paragraph', content: 'Durante el sueño profundo (fases N3 y REM), el cuerpo ejecuta los procesos de recuperación más críticos: el 70-80% de la hormona del crecimiento (GH) diaria se libera en los primeros ciclos de sueño profundo, la síntesis proteica muscular se acelera, el cortisol cae a su nivel más bajo del día y el sistema inmune realiza su mantenimiento.' },
      { type: 'highlight', content: 'Una sola noche con menos de 6 horas de sueño reduce los niveles de testosterona hasta un 15%. Tres noches seguidas de restricción de sueño tienen un impacto en el perfil hormonal comparable a envejecer 10 años.' },
      { type: 'h2', content: 'El impacto del déficit de sueño' },
      { type: 'list', items: ['Reducción de la síntesis proteica muscular en hasta un 30%', 'Aumento del cortisol basal (hormona catabólica)', 'Mayor percepción del esfuerzo → peor rendimiento con mismo peso', 'Reducción de la tolerancia al dolor y al esfuerzo máximo', 'Deterioro cognitivo que afecta la técnica y la toma de decisiones'] },
      { type: 'h2', content: 'Suplementos que realmente ayudan' },
      { type: 'paragraph', content: 'No en el sentido de sustituir el sueño, sino de mejorar su calidad cuando ya tienes las horas cubiertas:' },
      { type: 'list', items: ['Magnesio glicinato (300-400mg): mejora la profundidad del sueño, reduce el tiempo en conciliar', 'Zinc (15-30mg): crítico para la producción de melatonina y GH nocturna', 'Ashwagandha (600mg KSM-66): reduce el cortisol, mejora la transición al sueño', 'Melatonina (0.5-1mg): útil para jet lag y desfases, NO como solución crónica'] },
      { type: 'warning', label: 'Error común', content: 'Dosis altas de melatonina (5-10mg) que venden muchos productos no son más efectivas. Pueden desensibilizar los receptores y empeorar el problema a largo plazo. Menos es más.' },
      { type: 'h2', content: 'Protocolo de higiene del sueño' },
      { type: 'paragraph', content: 'Antes de gastar en suplementos para el sueño, asegúrate de tener cubiertos los básicos: temperatura de la habitación entre 18-20°C, oscuridad total o casi total, sin pantallas 60 minutos antes de acostarte y hora fija de despertar todos los días (incluyendo fines de semana).' },
    ],
  },

  /* ══════════════════════════════════════════════════════════════════════
     6. ZINC Y MAGNESIO
  ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'zinc-magnesio-testosterona',
    title: 'Zinc y Magnesio: El Dúo Olvidado que Afecta tu Testosterona',
    category: 'Suplementación',
    categoryValue: 'suplementacion',
    excerpt: 'La deficiencia de estos dos micronutrientes es más común de lo que crees en atletas. Y las consecuencias en hormonas y sueño son medibles.',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1400&auto=format&fit=crop',
    author: 'Dr. Marcos Villanueva',
    authorRole: 'Director de Formulación',
    authorInitial: 'M',
    date: '22 Ene 2026',
    readTime: '9 min',
    tags: ['Micronutrientes', 'Testosterona', 'Zinc', 'Magnesio'],
    toc: ['Por qué los atletas son especialmente vulnerables', 'El rol del zinc en la testosterona', 'El rol del magnesio', 'Formas y dosis correctas'],
    relatedSlugs: ['sleep-recuperacion-muscular', 'creatina-guia-definitiva-2026', 'carga-carbohidratos-protocolo'],
    body: [
      { type: 'paragraph', content: 'El 80% de los atletas tiene déficit subclínico de magnesio. El 30-40% tiene niveles de zinc por debajo del óptimo. Estos no son números de un estudio marginal: son datos consistentes en la literatura científica de los últimos 20 años. Y las consecuencias van mucho más allá de la fatiga.' },
      { type: 'h2', content: 'Por qué los atletas son especialmente vulnerables' },
      { type: 'paragraph', content: 'El ejercicio intenso aumenta dramáticamente las pérdidas de zinc y magnesio: a través del sudor, la orina y el mayor recambio celular. Al mismo tiempo, las dietas altas en cereales refinados y bajas en carnes rojas y frutos secos raramente cubren esas necesidades aumentadas. Es una tormenta perfecta de deficiencia.' },
      { type: 'h2', content: 'El rol del zinc en la testosterona' },
      { type: 'paragraph', content: 'El zinc es cofactor esencial en más de 300 enzimas. Entre ellas, las involucradas en la síntesis de testosterona en las células de Leydig. La aromatasa (la enzima que convierte testosterona en estrógeno) es inhibida naturalmente por el zinc. Un déficit implica más conversión, menos testosterona disponible.' },
      { type: 'highlight', content: 'Un estudio en hombres con déficit de zinc durante 20 semanas mostró una reducción del 74% en los niveles de testosterona. La suplementación restauró los niveles normales en todos los casos.' },
      { type: 'h2', content: 'El rol del magnesio' },
      { type: 'paragraph', content: 'El magnesio participa en más de 600 reacciones enzimáticas. En el contexto del rendimiento, los más relevantes son: la producción de ATP (sin magnesio el ATP no es funcional), la regulación del cortisol, la síntesis de proteínas y la calidad del sueño profundo.' },
      { type: 'list', items: ['Magnesio bajo = peor sueño profundo = menos GH nocturna', 'Magnesio bajo = mayor cortisol basal = más catabolismo', 'Magnesio bajo = menor eficiencia en la producción de energía celular', 'Magnesio bajo = mayor riesgo de calambres y recuperación más lenta'] },
      { type: 'h2', content: 'Formas y dosis correctas' },
      { type: 'paragraph', content: 'No todos los suplementos de zinc y magnesio son iguales. La forma química determina la biodisponibilidad:' },
      { type: 'list', items: ['Zinc: bisglicinato o gluconato. Evitar óxido de zinc (absorción <10%)', 'Dosis zinc: 15-30mg/día con comida. Más de 40mg interfiere con la absorción de cobre', 'Magnesio: glicinato para dormir, malato para energía diurna. Evitar óxido (laxante)', 'Dosis magnesio: 300-400mg/día elemental. Por la noche para aprovechar el efecto sobre el sueño'] },
      { type: 'warning', label: 'No excedas', content: 'El exceso de zinc (>50mg/día crónico) suprime el cobre y puede generar déficit de este mineral, con consecuencias en el sistema nervioso. La suplementación debe corregir un déficit, no crear exceso.' },
    ],
  },

  /* ══════════════════════════════════════════════════════════════════════
     7. CARGA DE CARBOHIDRATOS
  ══════════════════════════════════════════════════════════════════════ */
  {
    slug: 'carga-carbohidratos-protocolo',
    title: 'Protocolo de Carga de Carbohidratos para Competencia',
    category: 'Nutrición',
    categoryValue: 'nutricion',
    excerpt: 'Guía práctica de 7 días para maximizar el glucógeno muscular sin retención excesiva de agua.',
    image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=1400&auto=format&fit=crop',
    author: 'Dra. Elena Suárez',
    authorRole: 'Nutricionista Deportiva',
    authorInitial: 'E',
    date: '18 Ene 2026',
    readTime: '11 min',
    tags: ['Nutrición', 'Carbohidratos', 'Competencia', 'Glucógeno'],
    toc: ['Por qué funciona la carga', 'Protocolo de 7 días', 'Errores más comunes', 'El día de la competencia'],
    relatedSlugs: ['proteina-whey-vs-caseina', 'ventana-anabolica-mito', 'zinc-magnesio-testosterona'],
    body: [
      { type: 'paragraph', content: 'La carga de carbohidratos (carb loading) es una de las estrategias nutricionales con más evidencia en deportes de resistencia y de fuerza orientados a la estética. Cuando se hace correctamente, puede aumentar el glucógeno muscular hasta un 90% por encima del nivel basal, con un impacto real en el rendimiento y el aspecto visual.' },
      { type: 'h2', content: 'Por qué funciona la carga' },
      { type: 'paragraph', content: 'El glucógeno muscular es el combustible principal para el ejercicio de alta intensidad. Cada gramo de glucógeno se almacena con 3-4g de agua. Esto tiene dos consecuencias: los músculos se ven más llenos y duros (efecto visual positivo) y tienes más combustible disponible para rendir al máximo en los primeros minutos de competencia.' },
      { type: 'highlight', content: 'Un atleta promedio almacena 300-500g de glucógeno muscular. Con un protocolo correcto de carga, ese número puede llegar a 600-900g. La diferencia se traduce en rendimiento sostenido en los últimos kilómetros o las últimas series.' },
      { type: 'h2', content: 'Protocolo de 7 días' },
      { type: 'list', items: ['Días 1-3 (Depleción): Reduce carbos a 2-3g/kg, mantén proteína alta (2.2g/kg), entrena con intensidad para vaciar depósitos', 'Días 4-6 (Carga): Aumenta carbos a 8-10g/kg, reduce entrenamiento al 50%, reduce grasas al mínimo', 'Día 7 (Ajuste fino): 4-6g/kg de carbos simples, sin entreno pesado, monitoriza cómo responde tu cuerpo'] },
      { type: 'h2', content: 'Errores más comunes' },
      { type: 'list', items: ['Cargar con carbohidratos procesados y altos en sodio → retención de agua excesiva y poco control', 'No reducir el entrenamiento durante la fase de carga → vacías los depósitos que intentas llenar', 'Primera vez probando el protocolo el día de la competencia → ensaya siempre antes', 'Exceso de fibra durante la carga → distensión y malestar gastrointestinal el día clave'] },
      { type: 'warning', label: 'Importante', content: 'Este protocolo no es apropiado para personas sin experiencia en manipulación dietética o con condiciones metabólicas. Consulta con un nutricionista deportivo antes de implementarlo por primera vez.' },
      { type: 'h2', content: 'El día de la competencia' },
      { type: 'paragraph', content: 'El día de la competencia come tu última comida sólida 3-4 horas antes. Rica en carbohidratos de digestión media (arroz, pasta, avena), moderada en proteína y muy baja en grasa y fibra. 30-60 minutos antes, una pequeña cantidad de carbohidratos rápidos (fruta, gel) para mantener la glucemia. No experimentes con nada nuevo ese día.' },
    ],
  },

];

/* ─── HELPERS ──────────────────────────────────────────────────────────── */

/**
 * Busca un post por slug. Devuelve undefined si no existe,
 * lo que provoca notFound() en la page.
 */
export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}

/**
 * Resuelve un array de slugs relacionados a objetos BlogPost completos,
 * filtrando silenciosamente cualquier slug que no exista en POSTS.
 */
export function getRelatedPosts(slugs: string[]): BlogPost[] {
  return slugs.map((s) => POSTS.find((p) => p.slug === s)).filter(Boolean) as BlogPost[];
}
