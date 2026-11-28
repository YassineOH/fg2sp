/**
 * Informations de l'entreprise — point unique à mettre à jour.
 * ⚠️ Les coordonnées ci-dessous sont des valeurs provisoires à remplacer.
 */
export const site = {
  name: 'FG2SP Energie',
  fullName: 'Fournisseur Global de Solutions Solaires Photovoltaïques',
  tagline: "L'énergie du soleil, de l'étude à la maintenance.",
  description:
    'FG2SP Energie conçoit, installe et entretient des solutions solaires photovoltaïques au Maroc : centrales solaires, pompage solaire, éclairage solaire et systèmes autonomes. Devis et étude gratuits.',
  // TODO: remplacer par les vraies coordonnées
  phone: '+212 6 00 00 00 00',
  phoneHref: 'tel:+212600000000',
  whatsapp: '212600000000',
  email: 'contact@fg2sp.ma',
  city: 'Maroc',
  hours: 'Lun – Sam · 8h30 – 18h30',
};

export const nav = [
  { href: '/', label: 'Accueil' },
  { href: '/solutions/', label: 'Solutions' },
  { href: '/simulateur/', label: 'Simulateur' },
  { href: '/autoproduction/', label: 'Loi 82-21' },
  { href: '/contact/', label: 'Contact' },
];

export const regions = [
  'Tanger – Tétouan – Al Hoceïma',
  "L'Oriental",
  'Fès – Meknès',
  'Rabat – Salé – Kénitra',
  'Béni Mellal – Khénifra',
  'Casablanca – Settat',
  'Marrakech – Safi',
  'Drâa – Tafilalet',
  'Souss – Massa',
  'Guelmim – Oued Noun',
  'Laâyoune – Sakia El Hamra',
  'Dakhla – Oued Ed-Dahab',
];

export type Solution = {
  slug: string;
  icon: string;
  title: string;
  short: string;
  long: string;
  points: string[];
  for: string;
};

export const solutions: Solution[] = [
  {
    slug: 'centrales',
    icon: 'plant',
    title: 'Centrales solaires',
    short:
      "Des centrales photovoltaïques raccordées au réseau pour réduire durablement votre facture d'électricité.",
    long: "Toitures, ombrières de parking ou centrales au sol : nous dimensionnons votre installation selon votre profil de consommation pour maximiser l'autoconsommation, dans le cadre de la loi 82-21 sur l'autoproduction.",
    points: [
      'Étude de productible et simulation 3D',
      "Modules photovoltaïques de fabricants classés Tier 1 et onduleurs de marques leaders à l'échelle mondiale",
      'Monitoring à distance de la production',
      'Accompagnement administratif (ONEE / SRL / ANRE)',
    ],
    for: 'Industrie · Tertiaire · Résidentiel',
  },
  {
    slug: 'pompage',
    icon: 'pump',
    title: 'Pompage solaire',
    short:
      'Irriguez sans gasoil ni butane : des pompes immergées ou de surface alimentées directement par le soleil.',
    long: 'Nous dimensionnons le champ solaire et la pompe à partir de la profondeur du forage, du débit souhaité et des besoins en eau de vos cultures. Un système silencieux, sans carburant et quasiment sans entretien.',
    points: [
      'Calcul hydraulique (HMT, débit, besoins des cultures)',
      'Variateurs solaires avec démarrage progressif',
      'Protection contre la marche à sec',
      'Montage de dossier pour les aides agricoles éligibles',
    ],
    for: 'Agriculture · Élevage · Alimentation en eau',
  },
  {
    slug: 'eclairage',
    icon: 'light',
    title: 'Éclairage solaire',
    short:
      'Lampadaires et projecteurs autonomes pour rues, parkings, sites isolés et espaces publics.',
    long: 'Des luminaires LED avec panneau et batterie intégrés, sans tranchée ni raccordement. Idéal pour les communes, les lotissements, les zones industrielles et les exploitations agricoles.',
    points: [
      'Étude photométrique de l’éclairement',
      'Batteries lithium longue durée',
      'Détection de présence et gradation nocturne',
      'Pose rapide, sans câblage',
    ],
    for: 'Collectivités · Promoteurs · Sites isolés',
  },
  {
    slug: 'autonome',
    icon: 'battery',
    title: 'Systèmes autonomes & hybrides',
    short:
      "Électricité fiable là où le réseau n'arrive pas, ou en secours quand il fait défaut.",
    long: 'Kits off-grid avec stockage, systèmes hybrides couplés à un groupe électrogène ou au réseau : nous garantissons la continuité de service pour vos habitations, fermes, relais et sites distants.',
    points: [
      'Dimensionnement des batteries selon l’autonomie visée',
      'Onduleurs hybrides intelligents',
      'Réduction drastique de la consommation de gasoil',
      'Supervision à distance',
    ],
    for: 'Fermes · Gîtes · Sites télécoms',
  },
  {
    slug: 'etudes',
    icon: 'study',
    title: 'Études & ingénierie',
    short:
      'Audit énergétique, étude de faisabilité et ingénierie de projets photovoltaïques de toute taille.',
    long: "Fort d'une double expérience d'ingénieur et de manager dans le secteur solaire, notre fondateur vous aide à prendre la bonne décision technique et financière, du premier audit jusqu'au plan de financement.",
    points: [
      'Audit des factures et des courbes de charge',
      'Étude technico-économique et retour sur investissement',
      'Cahiers des charges et assistance à maîtrise d’ouvrage',
      'Suivi de chantier',
    ],
    for: 'Entreprises · Investisseurs · Collectivités',
  },
  {
    slug: 'maintenance',
    icon: 'tools',
    title: 'Maintenance & suivi',
    short:
      'Nettoyage, contrôle et supervision pour garder vos installations à leur rendement maximal.',
    long: 'Avec la poussière et le sable, un champ solaire mal entretenu peut perdre une part importante de sa production. Nos contrats de maintenance préventive et curative protègent votre investissement.',
    points: [
      'Nettoyage des modules',
      'Thermographie et contrôle électrique',
      'Analyse des données de production',
      'Intervention rapide en cas de défaut',
    ],
    for: 'Toutes installations, même non installées par nous',
  },
];

export const sectors = [
  { label: 'Résidentiel', text: 'Villas, maisons et résidences' },
  { label: 'Agricole', text: 'Irrigation, élevage, stockage frigorifique' },
  { label: 'Industriel', text: 'Usines, ateliers, entrepôts' },
  {
    label: 'Hôtellerie & tertiaire',
    text: 'Hôtels, cliniques, écoles, bureaux',
  },
  { label: 'Collectivités', text: 'Communes, éclairage public, équipements' },
];

export const steps = [
  {
    title: 'Écoute & visite',
    text: 'Analyse de vos factures, visite du site, relevé des contraintes (toiture, ombrages, forage…).',
  },
  {
    title: 'Étude sur mesure',
    text: 'Dimensionnement, simulation de production et étude de rentabilité claire et chiffrée.',
  },
  {
    title: 'Devis transparent',
    text: 'Une offre détaillée, poste par poste, avec le matériel exact et les garanties associées.',
  },
  {
    title: 'Installation',
    text: 'Pose par nos équipes dans le respect des normes électriques et des règles de sécurité.',
  },
  {
    title: 'Mise en service & suivi',
    text: 'Formation, monitoring de la production et maintenance tout au long de la vie du système.',
  },
];
