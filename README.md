# FG2SP Energie — site web

Site vitrine de **FG2SP Energie** (Fournisseur Global de Solutions Solaires Photovoltaïques), entreprise marocaine spécialisée dans les centrales solaires, le pompage solaire et l'éclairage solaire.

## Stack

- [Astro](https://astro.build) (sortie 100 % statique, View Transitions)
- [Tailwind CSS v4](https://tailwindcss.com)
- JavaScript natif pour les interactions (aucun framework côté client)
- Polices auto-hébergées : Outfit (titres) et Inter (texte)

## Démarrer

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # génère ./dist
npm run preview  # sert ./dist
```

## Pages

| Route | Contenu |
| --- | --- |
| `/` | Accueil : hero animé, solutions, chiffres clés, simulateur, méthode, FAQ |
| `/solutions/` | Détail des 6 solutions et des architectures on-grid / off-grid / hybride |
| `/simulateur/` | Simulateur facture → puissance crête (kWc) + hypothèses détaillées |
| `/autoproduction/` | Guide loi 82-21 (autoproduction) avec sources |
| `/contact/` | Formulaire qui prépare un message WhatsApp ou e-mail |

## Où modifier le contenu

- `src/data/site.ts` : coordonnées (**téléphone, e-mail, WhatsApp à remplacer**), navigation, solutions, régions, étapes.
- `src/data/simulator.ts` : toutes les hypothèses du simulateur (grille ONEE, taxes, productible par région, coût au kWc, etc.).
- `src/styles/global.css` : palette (issue du logo) et animations.
- `src/components/LogoMark.astro` : logo vectoriel (feuilles + fiche).

## Déploiement

Le site est statique : il peut être hébergé sur Vercel, Netlify, Cloudflare Pages ou GitHub Pages.
Sur Vercel : « Add New Project » → importer ce dépôt → preset Astro détecté automatiquement. Chaque pull request obtient alors un lien d'aperçu.

Pensez à mettre à jour `site` dans `astro.config.mjs` avec le domaine définitif.
