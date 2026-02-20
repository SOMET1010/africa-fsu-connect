

# Mise a jour du branding UDC dans les emails d'invitation des points focaux

## Contexte

La fonction Edge `send-focal-point-invitation` contient encore l'ancien branding **NEXUS** dans tous les templates email (FR, EN, PT, AR). Il faut les aligner sur le nouveau nom **USF Universal Digital Connect (UDC)**.

## Changements prevus

Un seul fichier est concerne : `supabase/functions/send-focal-point-invitation/index.ts`

### Remplacements dans les templates email (4 langues)

| Element | Ancien | Nouveau |
|---------|--------|---------|
| Sujet FR | `Invitation Point Focal NEXUS` | `Invitation Point Focal UDC` |
| Sujet EN | `NEXUS Focal Point Invitation` | `UDC Focal Point Invitation` |
| Sujet PT | `Convite Ponto Focal NEXUS` | `Convite Ponto Focal UDC` |
| Sujet AR | `دعوة نقطة الاتصال NEXUS` | `UDC دعوة نقطة الاتصال` |
| Corps FR | `plateforme NEXUS` | `plateforme UDC` |
| Corps EN | `NEXUS platform` | `UDC platform` |
| Corps PT | `plataforma NEXUS` | `plataforma UDC` |
| Corps AR | `منصة NEXUS` | `UDC منصة` |
| CTA label FR | (inchange) | (inchange) |
| Header HTML | `<h1>NEXUS</h1>` | `<h1>UDC</h1>` |
| Footer FR | `Union Africaine des Telecommunications` | `USF Universal Digital Connect` |
| Footer EN | `African Telecommunications Union` | `USF Universal Digital Connect` |
| Footer PT | `Uniao Africana das Telecomunicacoes` | `USF Universal Digital Connect` |
| Footer AR | `الاتحاد الأفريقي للاتصالات` | `USF Universal Digital Connect` |
| Team FR | `L'equipe NEXUS` | `L'equipe UDC` |
| Team EN | `The NEXUS Team` | `The UDC Team` |
| Team PT | `A Equipa NEXUS` | `A Equipa UDC` |
| Team AR | `فريق NEXUS` | `UDC فريق` |
| From name | `NEXUS Platform` | `UDC Platform` |

### URL de base

L'URL d'activation (`baseUrl`) reste inchangee car elle pointe vers le domaine Lovable existant.

---

## Details techniques

- Fichier modifie : `supabase/functions/send-focal-point-invitation/index.ts`
- Nombre de remplacements : ~30 occurrences de NEXUS et des references UAT/ATU dans les 4 blocs de langue
- La fonction sera automatiquement redeployee apres modification
- Aucun changement de schema ou de secret necessaire

