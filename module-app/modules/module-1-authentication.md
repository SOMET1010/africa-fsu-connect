# 🧩 MODULE 1 — AUTHENTIFICATION & GESTION DES UTILISATEURS

## 🎯 Objectif

Gérer les comptes, rôles et permissions de manière sécurisée.

## 📌 Portée Fonctionnelle

* Inscription utilisateur
* Validation par administrateur
* Connexion sécurisée
* Gestion des rôles :

  * Super Admin
  * Admin Institutionnel
  * Contributeur
  * Lecteur
  * Partenaire
* Modification profil
* Réinitialisation mot de passe
* Journal d’activité

## 🗂 Structure Technique

### Backend

* Supabase

### Base de données

**Table users**

* id
* name
* email
* password_hash
* role_id
* country
* organization
* status
* created_at

**Table roles**

* id
* name
* permissions (JSON)

## 🔐 Sécurité

* Hashage bcrypt
* HTTPS obligatoire
* Rate limiting
* 2FA (Phase 2)

## 📤 API Endpoints

POST /auth/register
POST /auth/login
GET /users
PUT /users/{id}
DELETE /users/{id}
