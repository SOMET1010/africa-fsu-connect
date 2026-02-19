
# Plan : Import en masse des 48 points focaux

## Contexte

Vous avez fourni une liste de 48 points focaux couvrant 24 pays africains. La base contient actuellement 0 point focal et seulement 15 pays dans la table `countries`. Il faut donc :

1. **Ajouter 16 pays manquants** dans la table `countries`
2. **Inserer les 48 points focaux** dans la table `focal_points`

## Pays manquants a ajouter

| Code | Nom francais |
|------|-------------|
| SD | Soudan |
| CG | Congo-Brazzaville |
| SZ | Eswatini |
| LS | Lesotho |
| NA | Namibie |
| ST | Sao Tome-et-Principe |
| CV | Cabo Verde |
| LR | Liberia |
| GA | Gabon |
| ZW | Zimbabwe |
| MR | Mauritanie |
| GN | Guinee |
| GM | Gambie |
| BI | Burundi |
| CF | Republique centrafricaine |
| MU | Maurice |
| AO | Angola |
| TD | Tchad |

## Mapping des points focaux (pays -> code ISO)

Chaque pays recoit 2 points focaux (primary + secondary), sauf le Senegal qui en a 4 (2 paires d'organisations differentes : numerique.gouv.sn / fdsut.sn et artp.sn).

## Details techniques

### Etape 1 : Creer une edge function `import-focal-points`

Cette fonction :
- Insere les 16 pays manquants dans `countries` (avec `ON CONFLICT DO NOTHING`)
- Insere les 48 points focaux dans `focal_points` avec statut `pending`
- Attribue `designation_type: 'primary'` au premier point focal de chaque pays et `'secondary'` au second
- Nettoie les numeros de telephone (suppression des espaces et caracteres speciaux)

### Etape 2 : Appeler la fonction

Un seul appel HTTP pour importer toutes les donnees.

### Donnees importees par pays

| # | Pays | Code | Point focal 1 (Primary) | Point focal 2 (Secondary) |
|---|------|------|------------------------|--------------------------|
| 1 | Soudan | SD | Saeed Addow Himmaida Mohammad | Zahwa Eltayeb Mokhtar |
| 2 | Congo-Brazzaville | CG | Roch Blanchard OKEMBA | - |
| 3 | Eswatini | SZ | Mbongeni Mtshali | - |
| 4 | Lesotho | LS | Makhabane Mohale | - |
| 5 | Namibie | NA | Jacobus Maritz | Monica Nangutuwala |
| 6 | Sao Tome-et-Principe | ST | Adelaide fahe | Irandira Trovoada |
| 7 | Senegal | SN | Maty Dieng LO + Ousmane NDIAYE | Mamadou NDIR |
| 8 | Cabo Verde | CV | Josemar Soares | Juvenal Carvalho |
| 9 | Liberia | LR | James Lynch Monbo | Elijah G. Glay |
| 10 | Gabon | GA | LAURIANE CEPHORA SANOU EBINDA | Farid Nazare BAMBA + Kassa Patrick |
| 11 | Zimbabwe | ZW | Kennedy Dewera | Remember Muchechemera |
| 12 | Mauritanie | MR | Salahdine SOUHEIB | Nine Ahmed Abdellahi |
| 13 | Ouganda | UG | Susan Nakanwagi | James Mpango |
| 14 | Maroc | MA | Abdelkarim BELKHADIR | Abdelhay MOTIAA |
| 15 | Kenya | KE | Miriam Mutuku | Julius Lenaseiyan |
| 16 | Burkina Faso | BF | SANOU Soumanan | NIKIEMA Zakaria |
| 17 | Guinee | GN | NABE Aboubacar Sidiki | - |
| 18 | Gambie | GM | Serign Modou Bah | Lamin Fatty |
| 19 | Burundi | BI | AHIBONEYE Elias | KAYEYE Milca Ornella |
| 20 | Centrafrique | CF | Dieu Beni DAZOUROU | Elysee SOKOTE |
| 21 | Tanzanie | TZ | Batholomew Marcel Waranse | Peter John Mushi |
| 22 | Maurice | MU | Harish BHOOLAH | Shenabadi RAMASAMY |
| 23 | Mali | ML | CAMARA Issa | DOUMBIA Ibrahim |
| 24 | Angola | AO | Pedro Jose Manuel | Jose Cristovao Quiombo |
| 25 | Tchad | TD | Kadidja Harsou Abbas | Zakaria Yamouda Djorbo |

### Fichiers concernes

| Fichier | Action |
|---------|--------|
| `supabase/functions/import-focal-points/index.ts` | Creer - edge function d'import avec toutes les donnees hardcodees |

### Structure de l'edge function

```text
1. Authentification : verifier que l'appelant est admin
2. INSERT INTO countries (code, name_fr, name_en, continent)
   VALUES (...) ON CONFLICT (code) DO NOTHING
3. INSERT INTO focal_points (country_code, designation_type, first_name, last_name, email, phone, organization, job_title, status)
   VALUES (...) pour chacun des 48 enregistrements
4. Retourner le nombre d'insertions reussies
```

Apres l'import, les 48 points focaux apparaitront dans la page d'administration `/admin/focal-points` avec le statut "En attente", prets a recevoir leurs invitations par email.
