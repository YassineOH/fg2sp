/**
 * Paramètres du simulateur — tous modifiables ici.
 */

/** Majoration appliquée à la grille ONEE de référence (+45 %). */
const PRICE_FACTOR = 1.45;
const p = (n: number) => Math.round(n * PRICE_FACTOR * 10000) / 10000;

/** Grille basse tension résidentielle (MAD/kWh, hors taxes), majorée de 45 %. */
export const RESIDENTIAL_TRANCHES = {
  /** Tranches « sociales » progressives, si la consommation mensuelle ≤ 150 kWh */
  social: [
    { upTo: 100, price: p(0.901) },
    { upTo: 150, price: p(1.0732) },
  ],
  /** Au-delà de 150 kWh/mois : tarification sélective, toute la consommation au prix de la tranche atteinte */
  selective: [
    { from: 151, upTo: 210, price: p(1.0732) },
    { from: 211, upTo: 310, price: p(1.1676) },
    { from: 311, upTo: 510, price: p(1.3817) },
    { from: 511, upTo: Infinity, price: p(1.5958) },
  ],
};

/** TVA et taxes appliquées sur la facture (ordre de grandeur). */
export const TAX_RATE = 0.14;

/** Prix moyen professionnel par défaut (MAD/kWh TTC), majoré de 45 %. */
export const DEFAULT_PRO_PRICE = Math.round(1.07 * PRICE_FACTOR * 100) / 100;

/** Productible spécifique indicatif (kWh produits par kWc installé et par an). */
export const REGIONS = [
  { id: 'tanger', label: 'Tanger – Tétouan', yield: 1600 },
  { id: 'oriental', label: "Oujda – L'Oriental", yield: 1700 },
  { id: 'fes', label: 'Fès – Meknès', yield: 1700 },
  { id: 'rabat', label: 'Rabat – Kénitra', yield: 1650 },
  { id: 'casa', label: 'Casablanca – Settat', yield: 1650 },
  { id: 'benimellal', label: 'Béni Mellal – Khénifra', yield: 1750 },
  { id: 'marrakech', label: 'Marrakech – Safi', yield: 1800 },
  { id: 'draa', label: 'Drâa – Tafilalet (Ouarzazate, Errachidia)', yield: 1900 },
  { id: 'souss', label: 'Souss – Massa (Agadir)', yield: 1800 },
  { id: 'sud', label: 'Provinces du Sud (Guelmim, Laâyoune, Dakhla)', yield: 1850 },
];

/** Répartition mensuelle typique de la production au Maroc (somme = 1). */
export const MONTHLY_PROFILE = [0.062, 0.068, 0.085, 0.092, 0.101, 0.104, 0.106, 0.098, 0.086, 0.076, 0.065, 0.057];
export const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

/** Puissance du module retenu : 595 Wc sous 15 kWc, 710 Wc au-delà. */
export const panelWp = (kwc: number) => (kwc < 15 ? 595 : 710);
export const M2_PER_KWC = 5.5; // surface de toiture utile, espacements compris
export const CO2_KG_PER_KWH = 0.7; // facteur d'émission indicatif du réseau marocain
/** Fourchette indicative clé en main (MAD/Wc) selon la puissance installée. */
export function costMadPerWc(kwc: number) {
  if (kwc < 10) return { min: 7, max: 11 };
  if (kwc < 20) return { min: 6, max: 10 };
  if (kwc <= 50) return { min: 5, max: 9 };
  return { min: 4, max: 8 };
}

/** Prix HT de l'énergie pour une consommation mensuelle donnée (résidentiel). */
export function residentialCostHT(kwh: number): number {
  if (kwh <= 150) {
    const [s1, s2] = RESIDENTIAL_TRANCHES.social;
    const t1 = Math.min(kwh, 100) * s1.price;
    const t2 = Math.max(0, kwh - 100) * s2.price;
    return t1 + t2;
  }
  const tranche = RESIDENTIAL_TRANCHES.selective.find((t) => kwh <= t.upTo)!;
  return kwh * tranche.price;
}

/** Inverse : à partir du montant de la facture TTC, retrouve la consommation mensuelle (kWh). */
export function residentialKwhFromBill(billTTC: number): number {
  const ht = billTTC / (1 + TAX_RATE);
  if (ht <= 0) return 0;
  // Tranches sociales (progressives)
  const [s1, s2] = RESIDENTIAL_TRANCHES.social;
  if (ht <= 100 * s1.price) return ht / s1.price;
  const socialMax = residentialCostHT(150);
  if (ht <= socialMax) return 100 + (ht - 100 * s1.price) / s2.price;
  // Tranches sélectives
  let previousUpTo = 150;
  for (const t of RESIDENTIAL_TRANCHES.selective) {
    const kwh = ht / t.price;
    if (kwh <= t.upTo) {
      // Montant tombant dans le « saut » entre deux tranches : on retient la borne basse
      return Math.max(kwh, previousUpTo);
    }
    previousUpTo = t.upTo;
  }
  return ht / RESIDENTIAL_TRANCHES.selective[RESIDENTIAL_TRANCHES.selective.length - 1].price;
}

export type SimInput = {
  bill: number; // MAD / mois
  profile: 'residentiel' | 'pro';
  proPrice: number; // MAD/kWh TTC
  yieldKwhPerKwc: number;
  coverage: number; // 0..1, part de la consommation couverte
};

export function simulate(input: SimInput) {
  const monthlyKwh = input.profile === 'residentiel' ? residentialKwhFromBill(input.bill) : input.bill / input.proPrice;
  const annualKwh = monthlyKwh * 12;
  const avgPrice = monthlyKwh > 0 ? input.bill / monthlyKwh : 0; // MAD/kWh TTC
  const targetKwh = annualKwh * input.coverage;
  const kwc = targetKwh / input.yieldKwhPerKwc;
  const production = kwc * input.yieldKwhPerKwc;
  const panelPower = panelWp(kwc);
  const panels = Math.max(1, Math.ceil((kwc * 1000) / panelPower));
  const unitCost = costMadPerWc(kwc);
  const savings = production * avgPrice;
  const costMin = kwc * 1000 * unitCost.min;
  const costMax = kwc * 1000 * unitCost.max;
  return {
    monthlyKwh,
    annualKwh,
    avgPrice,
    kwc,
    production,
    panels,
    panelPower,
    area: kwc * M2_PER_KWC,
    savingsYear: savings,
    savingsMonth: savings / 12,
    co2Tons: (production * CO2_KG_PER_KWH) / 1000,
    costMin,
    costMax,
    paybackMin: savings > 0 ? costMin / savings : 0,
    paybackMax: savings > 0 ? costMax / savings : 0,
    monthly: MONTHLY_PROFILE.map((p) => production * p),
  };
}
