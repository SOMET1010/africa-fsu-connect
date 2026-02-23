

# Renommage des fichiers de migration Supabase

## Probleme identifie

Les 57 fichiers de migration actuels ont deux problemes de nommage :
1. **Separateur incorrect** : Les anciens fichiers utilisent un tiret (`-`) au lieu d'un underscore (`_`) entre le timestamp et le suffixe
2. **Suffixe UUID au lieu de description** : Tous les fichiers utilisent un UUID opaque au lieu d'une description lisible du contenu

La convention Supabase CLI exige le format : `YYYYMMDDHHmmss_short_description.sql`

## Plan de renommage complet

Chaque fichier sera supprime et recree avec le bon nom (contenu identique). Voici le mapping :

| # | Nom actuel | Nouveau nom |
|---|-----------|-------------|
| 1 | `20250716155935-9addb7dc-...` | `20250716155935_create_enums_and_core_tables.sql` |
| 2 | `20250717161254-ff2b02d9-...` | `20250717161254_create_user_preferences.sql` |
| 3 | `20250717230640-aae4299a-...` | `20250717230640_create_audit_logs_and_sessions.sql` |
| 4 | `20250718090528-f6215899-...` | `20250718090528_create_advanced_security_tables.sql` |
| 5 | `20250719162749-3808a7e9-...` | `20250719162749_create_agencies_and_federation.sql` |
| 6 | `20250720084024-f527d0c0-...` | `20250720084024_update_agencies_fsu_data.sql` |
| 7 | `20250720084459-ed2d69ac-...` | `20250720084459_fix_agencies_fsu_corrections.sql` |
| 8 | `20250720094615-d6ed6582-...` | `20250720094615_fix_agencies_sutel_metadata.sql` |
| 9 | `20250720095354-815bf8b8-...` | `20250720095354_reset_agencies_sutel_data.sql` |
| 10 | `20250720100856-3e034680-...` | `20250720100856_reset_agencies_with_regions.sql` |
| 11 | `20250721095100-2688a05b-...` | `20250721095100_fix_security_search_path.sql` |
| 12 | `20250721100848-2cb67e23-...` | `20250721100848_fix_agencies_official_data.sql` |
| 13 | `20250722184556-b4e0dbf1-...` | `20250722184556_create_universal_service_indicators.sql` |
| 14 | `20250724125550-53542da6-...` | `20250724125550_restrict_anonymous_access_phase1.sql` |
| 15 | `20250724125747-78f58400-...` | `20250724125747_restrict_admin_policies_phase1b.sql` |
| 16 | `20250724130130-8f822fb2-...` | `20250724130130_secure_storage_buckets_phase1c.sql` |
| 17 | `20250724181227-aa251a75-...` | `20250724181227_fix_rls_dashboard_stats.sql` |
| 18 | `20250724195649-38f3c683-...` | `20250724195649_create_translation_system.sql` |
| 19 | `20250725134735-5440343b-...` | `20250725134735_create_data_versions.sql` |
| 20 | `20250725171651-e4e08d0f-...` | `20250725171651_create_document_versions.sql` |
| 21 | `20250725185222-57787a45-...` | `20250725185222_create_submissions.sql` |
| 22 | `20250726110322-7594e3d5-...` | `20250726110322_create_user_avatars_bucket.sql` |
| 23 | `20250726122310-03a90546-...` | `20250726122310_create_countries_table.sql` |
| 24 | `20250726124049-adf27334-...` | `20250726124049_add_countries_coordinates.sql` |
| 25 | `20250726124640-347d9663-...` | `20250726124640_add_countries_coordinates_v2.sql` |
| 26 | `20250726154705-6970b8fd-...` | `20250726154705_add_missing_translations.sql` |
| 27 | `20250726163737-7d2085fc-...` | `20250726163737_add_common_translations.sql` |
| 28 | `20250726170519-61bbb6f0-...` | `20250726170519_fix_role_escalation_vulnerability.sql` |
| 29 | `20250726170711-4221a6ff-...` | `20250726170711_fix_role_escalation_v2.sql` |
| 30 | `20250726170804-8ba37b40-...` | `20250726170804_fix_function_search_path.sql` |
| 31 | `20250726171228-7e21e18a-...` | `20250726171228_fix_audit_role_change_trigger.sql` |
| 32 | `20251121202656_d4189344-...` | `20251121202656_create_presentation_sessions.sql` |
| 33 | `20251231125727_d45ace50-...` | `20251231125727_fix_functions_search_path_phase3.sql` |
| 34 | `20251231131636_da937c5c-...` | `20251231131636_enable_rls_all_tables_phase5d.sql` |
| 35 | `20251231131800_a3ab96bf-...` | `20251231131800_fix_procedures_search_path.sql` |
| 36 | `20251231141451_ee17ccfb-...` | `20251231141451_add_languages_community_to_countries.sql` |
| 37 | `20260102165244_c8a99b3b-...` | `20260102165244_fix_artisan_profiles_rls.sql` |
| 38 | `20260102165305_ddb9996e-...` | `20260102165305_remove_public_artisan_policy.sql` |
| 39 | `20260109140931_a7982b05-...` | `20260109140931_set_storage_buckets_private.sql` |
| 40 | `20260109141742_d8c9269e-...` | `20260109141742_fix_permissive_rls_payments.sql` |
| 41 | `20260109141849_83df0db0-...` | `20260109141849_fix_all_permissive_rls_policies.sql` |
| 42 | `20260109143228_178b6a51-...` | `20260109143228_create_focal_points_system.sql` |
| 43 | `20260109145442_df4da628-...` | `20260109145442_create_focal_conversations.sql` |
| 44 | `20260110090453_ada144fd-...` | `20260110090453_security_fixes_final.sql` |
| 45 | `20260111023308_9cbaaf3b-...` | `20260111023308_security_phase2_corrections.sql` |
| 46 | `20260111023524_7ecaf242-...` | `20260111023524_security_phase3_corrections.sql` |
| 47 | `20260111024046_78f9fa99-...` | `20260111024046_security_phase4_remove_permissive.sql` |
| 48 | `20260216233247_4c2fa1c4-...` | `20260216233247_add_documents_access_control.sql` |
| 49 | `20260216234456_eef6b312-...` | `20260216234456_add_agency_resources_access_control.sql` |
| 50 | `20260216234943_35a5dd92-...` | `20260216234943_fix_rls_profiles_user_id_cast.sql` |
| 51 | `20260218170542_e0033f58-...` | `20260218170542_create_homepage_content_blocks.sql` |
| 52 | `20260218171557_9b43dbe0-...` | `20260218171557_fix_handle_new_user_function.sql` |
| 53 | `20260218172849_b1bb678b-...` | `20260218172849_update_homepage_hero_content.sql` |
| 54 | `20260219164805_0b42bf67-...` | `20260219164805_update_homepage_hero_branding.sql` |
| 55 | `20260222133935_29697865-...` | `20260222133935_update_hero_cms_multilingual.sql` |
| 56 | `20260222140706_57cd8b0f-...` | `20260222140706_create_site_settings.sql` |
| 57 | `20260223143947_85bf0aa9-...` | `20260223143947_harmonize_agencies_region_names.sql` |

## Etapes d'implementation

1. **Creer les 57 nouveaux fichiers** avec les noms corrects et le contenu identique a l'original
2. **Supprimer les 57 anciens fichiers** avec les noms UUID

## Details techniques

- Le contenu SQL de chaque fichier reste **strictement identique** -- seul le nom du fichier change
- Les timestamps sont conserves a l'identique pour maintenir l'ordre d'execution
- Le separateur entre timestamp et description passe de `-` (tiret) a `_` (underscore) conformement a la convention Supabase CLI
- Les UUIDs opaques sont remplaces par des descriptions courtes en snake_case decrivant le contenu de la migration
- Aucun impact sur la base de donnees existante -- ce changement est purement organisationnel dans le code source

