# 🌍 MODULE 2 — GESTION DES PROJETS & CARTOGRAPHIE

## 🎯 Objectif

Centraliser tous les Projets du continent.

## 📌 Portée Fonctionnelle

- Création fiche projet
- Modification
- Filtrage multicritère
- Carte interactive
- Dashboard indicateurs
- Export PDF/Excel

## 🗂 Base de données

**Table projects**

- id
- title
- description
- country
- region
- budget
- status
- start_date
- end_date
- beneficiaries
- latitude
- longitude
- created_by

## 🗺 Cartographie

- OpenStreetMap / Mapbox
- Clustering markers
- Filtres dynamiques

## 📤 API

POST /projects
GET /projects
GET /projects/{id}
PUT /projects/{id}
DELETE /projects/{id}
