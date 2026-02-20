
# Ajout d'un bouton d'export CSV des KPIs

## Objectif

Ajouter un bouton "Exporter CSV" dans le composant `UserKPICards` pour permettre aux utilisateurs de telecharger leurs indicateurs de performance au format CSV, utile pour le reporting.

---

## Approche

L'export sera entierement cote client (pas besoin de backend) : les donnees KPI sont deja chargees en memoire. Un clic sur le bouton genere un fichier CSV et declenche le telechargement via un Blob URL.

---

## Modifications

### 1. `src/components/dashboard/widgets/UserKPICards.tsx` (modifie)

- Ajouter un bouton "Exporter CSV" avec l'icone `Download` de lucide-react, positionne au-dessus de la grille KPI (aligne a droite)
- Fonction `exportKPIsToCSV` qui :
  - Construit un CSV avec les colonnes : Indicateur, Valeur, Tendance (%)
  - Inclut les 4 KPIs (Projets, Documents, Evenements, Soumissions)
  - Ajoute la date d'export dans le nom du fichier (`kpis_export_2026-02-20.csv`)
  - Genere un Blob CSV avec BOM UTF-8 pour compatibilite Excel
  - Declenche le telechargement automatique

### Design du bouton
- Style coherent avec le theme Nexus : variante `ghost`, petit format
- Texte : "Exporter" avec icone Download
- Desactive quand les KPIs ne sont pas charges

---

## Resume

| Action | Fichier |
|---|---|
| Modifier | `src/components/dashboard/widgets/UserKPICards.tsx` |

Total : 1 fichier modifie, 0 dependance ajoutee, 0 migration SQL.
