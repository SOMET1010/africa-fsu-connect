#!/usr/bin/env bash
# Script de renommage des fichiers de migration Supabase
# Exécuter depuis la racine du projet : bash scripts/rename-migrations.sh
#
# Ce script renomme les 57 fichiers de migration pour respecter la convention
# Supabase CLI : YYYYMMDDHHmmss_short_description.sql
# Le contenu SQL reste strictement identique.

set -euo pipefail

DIR="supabase/migrations"

declare -A RENAMES=(
  # Batch 1-10
  ["20250716155935-9addb7dc"]="20250716155935_create_enums_and_core_tables"
  ["20250717161254-ff2b02d9"]="20250717161254_create_user_preferences"
  ["20250717230640-aae4299a"]="20250717230640_create_audit_logs_and_sessions"
  ["20250718090528-f6215899"]="20250718090528_create_advanced_security_tables"
  ["20250719162749-3808a7e9"]="20250719162749_create_agencies_and_federation"
  ["20250720084024-f527d0c0"]="20250720084024_update_agencies_fsu_data"
  ["20250720084459-ed2d69ac"]="20250720084459_fix_agencies_fsu_corrections"
  ["20250720094615-d6ed6582"]="20250720094615_fix_agencies_sutel_metadata"
  ["20250720095354-815bf8b8"]="20250720095354_reset_agencies_sutel_data"
  ["20250720100856-3e034680"]="20250720100856_reset_agencies_with_regions"
  # Batch 11-20
  ["20250721095100-2688a05b"]="20250721095100_fix_security_search_path"
  ["20250721100848-2cb67e23"]="20250721100848_fix_agencies_official_data"
  ["20250722184556-b4e0dbf1"]="20250722184556_create_universal_service_indicators"
  ["20250724125550-53542da6"]="20250724125550_restrict_anonymous_access_phase1"
  ["20250724125747-78f58400"]="20250724125747_restrict_admin_policies_phase1b"
  ["20250724130130-8f822fb2"]="20250724130130_secure_storage_buckets_phase1c"
  ["20250724181227-aa251a75"]="20250724181227_fix_rls_dashboard_stats"
  ["20250724195649-38f3c683"]="20250724195649_create_translation_system"
  ["20250725134735-5440343b"]="20250725134735_create_data_versions"
  ["20250725171651-e4e08d0f"]="20250725171651_create_document_versions"
  # Batch 21-31
  ["20250725185222-57787a45"]="20250725185222_create_submissions"
  ["20250726110322-7594e3d5"]="20250726110322_create_user_avatars_bucket"
  ["20250726122310-03a90546"]="20250726122310_create_countries_table"
  ["20250726124049-adf27334"]="20250726124049_add_countries_coordinates"
  ["20250726124640-347d9663"]="20250726124640_add_countries_coordinates_v2"
  ["20250726154705-6970b8fd"]="20250726154705_add_missing_translations"
  ["20250726163737-7d2085fc"]="20250726163737_add_common_translations"
  ["20250726170519-61bbb6f0"]="20250726170519_fix_role_escalation_vulnerability"
  ["20250726170711-4221a6ff"]="20250726170711_fix_role_escalation_v2"
  ["20250726170804-8ba37b40"]="20250726170804_fix_function_search_path"
  ["20250726171228-7e21e18a"]="20250726171228_fix_audit_role_change_trigger"
  # Batch 32-41 (underscore separator in originals)
  ["20251121202656_d4189344"]="20251121202656_create_presentation_sessions"
  ["20251231125727_d45ace50"]="20251231125727_fix_functions_search_path_phase3"
  ["20251231131636_da937c5c"]="20251231131636_enable_rls_all_tables_phase5d"
  ["20251231131800_a3ab96bf"]="20251231131800_fix_procedures_search_path"
  ["20251231141451_ee17ccfb"]="20251231141451_add_languages_community_to_countries"
  ["20260102165244_c8a99b3b"]="20260102165244_fix_artisan_profiles_rls"
  ["20260102165305_ddb9996e"]="20260102165305_remove_public_artisan_policy"
  ["20260109140931_a7982b05"]="20260109140931_set_storage_buckets_private"
  ["20260109141742_d8c9269e"]="20260109141742_fix_permissive_rls_payments"
  ["20260109141849_83df0db0"]="20260109141849_fix_all_permissive_rls_policies"
  # Batch 42-57
  ["20260109143228_178b6a51"]="20260109143228_create_focal_points_system"
  ["20260109145442_df4da628"]="20260109145442_create_focal_conversations"
  ["20260110090453_ada144fd"]="20260110090453_security_fixes_final"
  ["20260111023308_9cbaaf3b"]="20260111023308_security_phase2_corrections"
  ["20260111023524_7ecaf242"]="20260111023524_security_phase3_corrections"
  ["20260111024046_78f9fa99"]="20260111024046_security_phase4_remove_permissive"
  ["20260216233247_4c2fa1c4"]="20260216233247_add_documents_access_control"
  ["20260216234456_eef6b312"]="20260216234456_add_agency_resources_access_control"
  ["20260216234943_35a5dd92"]="20260216234943_fix_rls_profiles_user_id_cast"
  ["20260218170542_e0033f58"]="20260218170542_create_homepage_content_blocks"
  ["20260218171557_9b43dbe0"]="20260218171557_fix_handle_new_user_function"
  ["20260218172849_b1bb678b"]="20260218172849_update_homepage_hero_content"
  ["20260219164805_0b42bf67"]="20260219164805_update_homepage_hero_branding"
  ["20260222133935_29697865"]="20260222133935_update_hero_cms_multilingual"
  ["20260222140706_57cd8b0f"]="20260222140706_create_site_settings"
  ["20260223143947_85bf0aa9"]="20260223143947_harmonize_agencies_region_names"
)

count=0
for prefix in "${!RENAMES[@]}"; do
  # Find the file starting with this prefix
  old_file=$(find "$DIR" -maxdepth 1 -name "${prefix}*.sql" -print -quit 2>/dev/null)
  if [[ -z "$old_file" ]]; then
    echo "⚠️  Fichier non trouvé pour le préfixe: $prefix"
    continue
  fi
  new_file="$DIR/${RENAMES[$prefix]}.sql"
  if [[ "$old_file" == "$new_file" ]]; then
    echo "✓  Déjà correct: $(basename "$new_file")"
    continue
  fi
  mv "$old_file" "$new_file"
  echo "✅ $(basename "$old_file") → $(basename "$new_file")"
  ((count++))
done

echo ""
echo "🎉 $count fichier(s) renommé(s) avec succès."
