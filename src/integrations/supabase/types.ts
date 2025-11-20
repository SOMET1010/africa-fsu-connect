export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      agencies: {
        Row: {
          acronym: string
          address: string | null
          api_endpoint: string | null
          contact_email: string | null
          country: string
          created_at: string
          description: string | null
          established_date: string | null
          id: string
          is_active: boolean | null
          last_sync_at: string | null
          logo_url: string | null
          metadata: Json | null
          name: string
          phone: string | null
          region: string
          sync_status: string | null
          updated_at: string
          website_url: string
        }
        Insert: {
          acronym: string
          address?: string | null
          api_endpoint?: string | null
          contact_email?: string | null
          country: string
          created_at?: string
          description?: string | null
          established_date?: string | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          logo_url?: string | null
          metadata?: Json | null
          name: string
          phone?: string | null
          region: string
          sync_status?: string | null
          updated_at?: string
          website_url: string
        }
        Update: {
          acronym?: string
          address?: string | null
          api_endpoint?: string | null
          contact_email?: string | null
          country?: string
          created_at?: string
          description?: string | null
          established_date?: string | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          logo_url?: string | null
          metadata?: Json | null
          name?: string
          phone?: string | null
          region?: string
          sync_status?: string | null
          updated_at?: string
          website_url?: string
        }
        Relationships: []
      }
      agency_connectors: {
        Row: {
          agency_id: string
          auth_config: Json | null
          auth_method: string | null
          connector_type: string
          created_at: string
          endpoint_url: string | null
          error_message: string | null
          id: string
          is_active: boolean | null
          last_sync_at: string | null
          sync_frequency: number | null
          sync_status: string | null
          updated_at: string
        }
        Insert: {
          agency_id: string
          auth_config?: Json | null
          auth_method?: string | null
          connector_type: string
          created_at?: string
          endpoint_url?: string | null
          error_message?: string | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          sync_frequency?: number | null
          sync_status?: string | null
          updated_at?: string
        }
        Update: {
          agency_id?: string
          auth_config?: Json | null
          auth_method?: string | null
          connector_type?: string
          created_at?: string
          endpoint_url?: string | null
          error_message?: string | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          sync_frequency?: number | null
          sync_status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agency_connectors_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      agency_members: {
        Row: {
          active: boolean | null
          agency_id: string
          id: string
          joined_at: string | null
          permissions: string[] | null
          role: string
          user_id: string
        }
        Insert: {
          active?: boolean | null
          agency_id: string
          id?: string
          joined_at?: string | null
          permissions?: string[] | null
          role: string
          user_id: string
        }
        Update: {
          active?: boolean | null
          agency_id?: string
          id?: string
          joined_at?: string | null
          permissions?: string[] | null
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      agency_projects: {
        Row: {
          agency_id: string
          beneficiaries: number | null
          budget: number | null
          completion_percentage: number | null
          coordinates: unknown
          created_at: string
          description: string | null
          end_date: string | null
          external_id: string | null
          id: string
          last_updated_at: string | null
          location: string | null
          source_url: string | null
          start_date: string | null
          status: string
          sync_status: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          agency_id: string
          beneficiaries?: number | null
          budget?: number | null
          completion_percentage?: number | null
          coordinates?: unknown
          created_at?: string
          description?: string | null
          end_date?: string | null
          external_id?: string | null
          id?: string
          last_updated_at?: string | null
          location?: string | null
          source_url?: string | null
          start_date?: string | null
          status: string
          sync_status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          agency_id?: string
          beneficiaries?: number | null
          budget?: number | null
          completion_percentage?: number | null
          coordinates?: unknown
          created_at?: string
          description?: string | null
          end_date?: string | null
          external_id?: string | null
          id?: string
          last_updated_at?: string | null
          location?: string | null
          source_url?: string | null
          start_date?: string | null
          status?: string
          sync_status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agency_projects_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      agency_resources: {
        Row: {
          agency_id: string
          created_at: string
          description: string | null
          download_count: number | null
          external_id: string | null
          file_size: number | null
          file_url: string | null
          id: string
          last_updated_at: string | null
          mime_type: string | null
          resource_type: string
          source_url: string | null
          sync_status: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          agency_id: string
          created_at?: string
          description?: string | null
          download_count?: number | null
          external_id?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          last_updated_at?: string | null
          mime_type?: string | null
          resource_type: string
          source_url?: string | null
          sync_status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          agency_id?: string
          created_at?: string
          description?: string | null
          download_count?: number | null
          external_id?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          last_updated_at?: string | null
          mime_type?: string | null
          resource_type?: string
          source_url?: string | null
          sync_status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agency_resources_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_events: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_name: string
          event_type: string
          id: string
          ip_address: unknown
          page_url: string | null
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_name: string
          event_type: string
          id?: string
          ip_address?: unknown
          page_url?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_name?: string
          event_type?: string
          id?: string
          ip_address?: unknown
          page_url?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      anomaly_alerts: {
        Row: {
          auto_blocked: boolean | null
          created_at: string
          details: Json | null
          id: string
          message: string
          resolved: boolean | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          type: string
          user_id: string
        }
        Insert: {
          auto_blocked?: boolean | null
          created_at?: string
          details?: Json | null
          id?: string
          message: string
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          type: string
          user_id: string
        }
        Update: {
          auto_blocked?: boolean | null
          created_at?: string
          details?: Json | null
          id?: string
          message?: string
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      anomaly_settings: {
        Row: {
          auto_block_enabled: boolean | null
          created_at: string
          device_monitoring: boolean | null
          failed_login_threshold: number | null
          id: string
          location_monitoring: boolean | null
          sensitivity_level: string | null
          time_pattern_monitoring: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_block_enabled?: boolean | null
          created_at?: string
          device_monitoring?: boolean | null
          failed_login_threshold?: number | null
          id?: string
          location_monitoring?: boolean | null
          sensitivity_level?: string | null
          time_pattern_monitoring?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_block_enabled?: boolean | null
          created_at?: string
          device_monitoring?: boolean | null
          failed_login_threshold?: number | null
          id?: string
          location_monitoring?: boolean | null
          sensitivity_level?: string | null
          time_pattern_monitoring?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      application_documents: {
        Row: {
          application_id: string
          created_at: string | null
          document_type: string
          file_name: string
          file_size: number | null
          file_url: string
          id: string
          mime_type: string | null
          updated_at: string | null
          uploaded_at: string | null
          verification_notes: string | null
          verification_status: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          application_id: string
          created_at?: string | null
          document_type: string
          file_name: string
          file_size?: number | null
          file_url: string
          id?: string
          mime_type?: string | null
          updated_at?: string | null
          uploaded_at?: string | null
          verification_notes?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          application_id?: string
          created_at?: string | null
          document_type?: string
          file_name?: string
          file_size?: number | null
          file_url?: string
          id?: string
          mime_type?: string | null
          updated_at?: string | null
          uploaded_at?: string | null
          verification_notes?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      application_evaluations: {
        Row: {
          application_id: string
          conditions_required: string | null
          created_at: string | null
          documents_completeness_score: number | null
          employment_stability_score: number | null
          evaluated_by: string
          evaluation_notes: string | null
          id: string
          income_score: number | null
          overall_score: number | null
          recommendation: string | null
          references_score: number | null
          rental_history_score: number | null
          updated_at: string | null
        }
        Insert: {
          application_id: string
          conditions_required?: string | null
          created_at?: string | null
          documents_completeness_score?: number | null
          employment_stability_score?: number | null
          evaluated_by: string
          evaluation_notes?: string | null
          id?: string
          income_score?: number | null
          overall_score?: number | null
          recommendation?: string | null
          references_score?: number | null
          rental_history_score?: number | null
          updated_at?: string | null
        }
        Update: {
          application_id?: string
          conditions_required?: string | null
          created_at?: string | null
          documents_completeness_score?: number | null
          employment_stability_score?: number | null
          evaluated_by?: string
          evaluation_notes?: string | null
          id?: string
          income_score?: number | null
          overall_score?: number | null
          recommendation?: string | null
          references_score?: number | null
          rental_history_score?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      application_status_history: {
        Row: {
          application_id: string
          change_notes: string | null
          change_reason: string | null
          changed_by: string
          created_at: string | null
          id: string
          new_status: string
          previous_status: string | null
        }
        Insert: {
          application_id: string
          change_notes?: string | null
          change_reason?: string | null
          changed_by: string
          created_at?: string | null
          id?: string
          new_status: string
          previous_status?: string | null
        }
        Update: {
          application_id?: string
          change_notes?: string | null
          change_reason?: string | null
          changed_by?: string
          created_at?: string | null
          id?: string
          new_status?: string
          previous_status?: string | null
        }
        Relationships: []
      }
      artisan_evaluations: {
        Row: {
          artisan_id: string
          cleanliness_rating: number
          comments: string | null
          communication_rating: number
          created_at: string | null
          evaluator_id: string
          id: string
          maintenance_request_id: string
          overall_rating: number
          punctuality_rating: number
          quality_rating: number
          would_recommend: boolean | null
        }
        Insert: {
          artisan_id: string
          cleanliness_rating: number
          comments?: string | null
          communication_rating: number
          created_at?: string | null
          evaluator_id: string
          id?: string
          maintenance_request_id: string
          overall_rating: number
          punctuality_rating: number
          quality_rating: number
          would_recommend?: boolean | null
        }
        Update: {
          artisan_id?: string
          cleanliness_rating?: number
          comments?: string | null
          communication_rating?: number
          created_at?: string | null
          evaluator_id?: string
          id?: string
          maintenance_request_id?: string
          overall_rating?: number
          punctuality_rating?: number
          quality_rating?: number
          would_recommend?: boolean | null
        }
        Relationships: []
      }
      artisan_profiles: {
        Row: {
          average_rating: number | null
          company_name: string | null
          created_at: string | null
          email: string | null
          external_artisan_id: string | null
          hourly_rate: number | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          last_sync_at: string | null
          min_charge: number | null
          name: string
          phone: string
          service_areas: string[]
          specialties: string[]
          total_reviews: number | null
          updated_at: string | null
        }
        Insert: {
          average_rating?: number | null
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          external_artisan_id?: string | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          last_sync_at?: string | null
          min_charge?: number | null
          name: string
          phone: string
          service_areas: string[]
          specialties: string[]
          total_reviews?: number | null
          updated_at?: string | null
        }
        Update: {
          average_rating?: number | null
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          external_artisan_id?: string | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          last_sync_at?: string | null
          min_charge?: number | null
          name?: string
          phone?: string
          service_areas?: string[]
          specialties?: string[]
          total_reviews?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action_type: string
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown
          resource_id: string | null
          resource_type: string | null
          success: boolean | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown
          resource_id?: string | null
          resource_type?: string | null
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown
          resource_id?: string | null
          resource_type?: string | null
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      collection_actions: {
        Row: {
          action_description: string
          action_type: string
          cost_incurred: number | null
          created_at: string | null
          effectiveness_score: number | null
          follow_up_date: string | null
          follow_up_required: boolean | null
          id: string
          late_payment_id: string | null
          outcome: string | null
          outcome_details: string | null
          performed_at: string | null
          performed_by: string | null
          receivable_id: string | null
        }
        Insert: {
          action_description: string
          action_type: string
          cost_incurred?: number | null
          created_at?: string | null
          effectiveness_score?: number | null
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          id?: string
          late_payment_id?: string | null
          outcome?: string | null
          outcome_details?: string | null
          performed_at?: string | null
          performed_by?: string | null
          receivable_id?: string | null
        }
        Update: {
          action_description?: string
          action_type?: string
          cost_incurred?: number | null
          created_at?: string | null
          effectiveness_score?: number | null
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          id?: string
          late_payment_id?: string | null
          outcome?: string | null
          outcome_details?: string | null
          performed_at?: string | null
          performed_by?: string | null
          receivable_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "collection_actions_late_payment_id_fkey"
            columns: ["late_payment_id"]
            isOneToOne: false
            referencedRelation: "late_payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_actions_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_actions_receivable_id_fkey"
            columns: ["receivable_id"]
            isOneToOne: false
            referencedRelation: "receivables_tracking"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_rates: {
        Row: {
          commission_percentage: number
          created_at: string | null
          created_by: string | null
          effective_from: string | null
          effective_until: string | null
          fixed_fee: number | null
          id: string
          is_active: boolean | null
          max_commission: number | null
          min_commission: number | null
          property_type: string | null
          region: string | null
          transaction_type: string
          updated_at: string | null
        }
        Insert: {
          commission_percentage: number
          created_at?: string | null
          created_by?: string | null
          effective_from?: string | null
          effective_until?: string | null
          fixed_fee?: number | null
          id?: string
          is_active?: boolean | null
          max_commission?: number | null
          min_commission?: number | null
          property_type?: string | null
          region?: string | null
          transaction_type: string
          updated_at?: string | null
        }
        Update: {
          commission_percentage?: number
          created_at?: string | null
          created_by?: string | null
          effective_from?: string | null
          effective_until?: string | null
          fixed_fee?: number | null
          id?: string
          is_active?: boolean | null
          max_commission?: number | null
          min_commission?: number | null
          property_type?: string | null
          region?: string | null
          transaction_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commission_rates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      company_verifications: {
        Row: {
          cci_api_response: Json | null
          company_name: string
          created_at: string | null
          id: string
          last_verification_date: string | null
          notes: string | null
          owner_id: string
          property_id: string
          rccm_number: string | null
          updated_at: string | null
          verification_method: string | null
          verification_status: string | null
        }
        Insert: {
          cci_api_response?: Json | null
          company_name: string
          created_at?: string | null
          id?: string
          last_verification_date?: string | null
          notes?: string | null
          owner_id: string
          property_id: string
          rccm_number?: string | null
          updated_at?: string | null
          verification_method?: string | null
          verification_status?: string | null
        }
        Update: {
          cci_api_response?: Json | null
          company_name?: string
          created_at?: string | null
          id?: string
          last_verification_date?: string | null
          notes?: string | null
          owner_id?: string
          property_id?: string
          rccm_number?: string | null
          updated_at?: string | null
          verification_method?: string | null
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_verifications_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_verifications_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_reports: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          file_url: string | null
          id: string
          report_data: Json | null
          report_type: string
          scheduled_for: string | null
          status: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          report_data?: Json | null
          report_type: string
          scheduled_for?: string | null
          status?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          report_data?: Json | null
          report_type?: string
          scheduled_for?: string | null
          status?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      countries: {
        Row: {
          capital_city: string | null
          code: string
          continent: string | null
          created_at: string
          id: string
          latitude: number | null
          longitude: number | null
          name_en: string
          name_fr: string
          region: string | null
          updated_at: string
        }
        Insert: {
          capital_city?: string | null
          code: string
          continent?: string | null
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name_en: string
          name_fr: string
          region?: string | null
          updated_at?: string
        }
        Update: {
          capital_city?: string | null
          code?: string
          continent?: string | null
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name_en?: string
          name_fr?: string
          region?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      dashboard_metrics: {
        Row: {
          calculation_date: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          metric_count: number | null
          metric_name: string
          metric_type: string
          metric_value: number | null
          period_end: string | null
          period_start: string | null
          property_id: string | null
          user_id: string
        }
        Insert: {
          calculation_date?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          metric_count?: number | null
          metric_name: string
          metric_type: string
          metric_value?: number | null
          period_end?: string | null
          period_start?: string | null
          property_id?: string | null
          user_id: string
        }
        Update: {
          calculation_date?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          metric_count?: number | null
          metric_name?: string
          metric_type?: string
          metric_value?: number | null
          period_end?: string | null
          period_start?: string | null
          property_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      data_sources: {
        Row: {
          acronym: string
          api_endpoint: string | null
          api_key_required: boolean | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          update_frequency: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          acronym: string
          api_endpoint?: string | null
          api_key_required?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          update_frequency?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          acronym?: string
          api_endpoint?: string | null
          api_key_required?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          update_frequency?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      data_versions: {
        Row: {
          change_type: string
          created_at: string
          created_by: string | null
          data_snapshot: Json
          id: string
          record_id: string
          sync_id: string | null
          table_name: string
          version_number: number
        }
        Insert: {
          change_type?: string
          created_at?: string
          created_by?: string | null
          data_snapshot: Json
          id?: string
          record_id: string
          sync_id?: string | null
          table_name: string
          version_number: number
        }
        Update: {
          change_type?: string
          created_at?: string
          created_by?: string | null
          data_snapshot?: Json
          id?: string
          record_id?: string
          sync_id?: string | null
          table_name?: string
          version_number?: number
        }
        Relationships: []
      }
      document_comments: {
        Row: {
          comment: string
          created_at: string
          document_id: string
          id: string
          section: string | null
          user_id: string
          user_name: string
        }
        Insert: {
          comment: string
          created_at?: string
          document_id: string
          id?: string
          section?: string | null
          user_id: string
          user_name: string
        }
        Update: {
          comment?: string
          created_at?: string
          document_id?: string
          id?: string
          section?: string | null
          user_id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_comments_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_validations: {
        Row: {
          application_id: string | null
          authenticity_score: number | null
          created_at: string | null
          document_type: string
          document_url: string
          format_check_passed: boolean | null
          id: string
          quality_check_passed: boolean | null
          rejection_reason: string | null
          updated_at: string | null
          validation_date: string | null
          validation_details: Json | null
          validation_status: string | null
          validator_user_id: string | null
        }
        Insert: {
          application_id?: string | null
          authenticity_score?: number | null
          created_at?: string | null
          document_type: string
          document_url: string
          format_check_passed?: boolean | null
          id?: string
          quality_check_passed?: boolean | null
          rejection_reason?: string | null
          updated_at?: string | null
          validation_date?: string | null
          validation_details?: Json | null
          validation_status?: string | null
          validator_user_id?: string | null
        }
        Update: {
          application_id?: string | null
          authenticity_score?: number | null
          created_at?: string | null
          document_type?: string
          document_url?: string
          format_check_passed?: boolean | null
          id?: string
          quality_check_passed?: boolean | null
          rejection_reason?: string | null
          updated_at?: string | null
          validation_date?: string | null
          validation_details?: Json | null
          validation_status?: string | null
          validator_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_validations_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "rental_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_validations_validator_user_id_fkey"
            columns: ["validator_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      document_versions: {
        Row: {
          changes_summary: string
          document_id: string
          file_name: string
          file_size: number
          file_url: string
          id: string
          uploaded_at: string
          uploaded_by: string
          version: string
        }
        Insert: {
          changes_summary: string
          document_id: string
          file_name: string
          file_size: number
          file_url: string
          id?: string
          uploaded_at?: string
          uploaded_by: string
          version: string
        }
        Update: {
          changes_summary?: string
          document_id?: string
          file_name?: string
          file_size?: number
          file_url?: string
          id?: string
          uploaded_at?: string
          uploaded_by?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_versions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          country: string | null
          created_at: string
          description: string | null
          document_type: Database["public"]["Enums"]["document_type"]
          download_count: number
          featured: boolean | null
          file_name: string | null
          file_size: number | null
          file_url: string | null
          id: string
          is_public: boolean
          mime_type: string | null
          tags: string[] | null
          title: string
          updated_at: string
          uploaded_by: string
          view_count: number | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          description?: string | null
          document_type?: Database["public"]["Enums"]["document_type"]
          download_count?: number
          featured?: boolean | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_public?: boolean
          mime_type?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          uploaded_by: string
          view_count?: number | null
        }
        Update: {
          country?: string | null
          created_at?: string
          description?: string | null
          document_type?: Database["public"]["Enums"]["document_type"]
          download_count?: number
          featured?: boolean | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_public?: boolean
          mime_type?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          uploaded_by?: string
          view_count?: number | null
        }
        Relationships: []
      }
      encryption_keys: {
        Row: {
          algorithm: string
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          key_data: string
          key_id: string
          last_used: string | null
          name: string
          user_id: string
        }
        Insert: {
          algorithm?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_data: string
          key_id: string
          last_used?: string | null
          name: string
          user_id: string
        }
        Update: {
          algorithm?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_data?: string
          key_id?: string
          last_used?: string | null
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      escrow_accounts: {
        Row: {
          account_id: string | null
          actual_release_date: string | null
          amount: number
          contract_id: string | null
          created_at: string | null
          currency: string | null
          dispute_reason: string | null
          dispute_status: string | null
          escrow_type: string
          id: string
          landlord_id: string | null
          property_id: string | null
          release_conditions: Json | null
          release_date: string | null
          status: string | null
          tenant_id: string | null
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          account_id?: string | null
          actual_release_date?: string | null
          amount: number
          contract_id?: string | null
          created_at?: string | null
          currency?: string | null
          dispute_reason?: string | null
          dispute_status?: string | null
          escrow_type: string
          id?: string
          landlord_id?: string | null
          property_id?: string | null
          release_conditions?: Json | null
          release_date?: string | null
          status?: string | null
          tenant_id?: string | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          account_id?: string | null
          actual_release_date?: string | null
          amount?: number
          contract_id?: string | null
          created_at?: string | null
          currency?: string | null
          dispute_reason?: string | null
          dispute_status?: string | null
          escrow_type?: string
          id?: string
          landlord_id?: string | null
          property_id?: string | null
          release_conditions?: Json | null
          release_date?: string | null
          status?: string | null
          tenant_id?: string | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "escrow_accounts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "payment_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "escrow_accounts_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      escrow_conditions: {
        Row: {
          condition_description: string
          condition_type: string
          created_at: string | null
          escrow_account_id: string | null
          evidence_documents: Json | null
          id: string
          is_met: boolean | null
          updated_at: string | null
          verification_date: string | null
          verified_by: string | null
        }
        Insert: {
          condition_description: string
          condition_type: string
          created_at?: string | null
          escrow_account_id?: string | null
          evidence_documents?: Json | null
          id?: string
          is_met?: boolean | null
          updated_at?: string | null
          verification_date?: string | null
          verified_by?: string | null
        }
        Update: {
          condition_description?: string
          condition_type?: string
          created_at?: string | null
          escrow_account_id?: string | null
          evidence_documents?: Json | null
          id?: string
          is_met?: boolean | null
          updated_at?: string | null
          verification_date?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "escrow_conditions_escrow_account_id_fkey"
            columns: ["escrow_account_id"]
            isOneToOne: false
            referencedRelation: "escrow_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          event_id: string
          id: string
          registered_at: string
          user_id: string
        }
        Insert: {
          event_id: string
          id?: string
          registered_at?: string
          user_id: string
        }
        Update: {
          event_id?: string
          id?: string
          registered_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          created_by: string
          current_attendees: number
          description: string | null
          end_date: string
          id: string
          is_virtual: boolean
          location: string | null
          max_attendees: number | null
          start_date: string
          title: string
          updated_at: string
          virtual_link: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          current_attendees?: number
          description?: string | null
          end_date: string
          id?: string
          is_virtual?: boolean
          location?: string | null
          max_attendees?: number | null
          start_date: string
          title: string
          updated_at?: string
          virtual_link?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          current_attendees?: number
          description?: string | null
          end_date?: string
          id?: string
          is_virtual?: boolean
          location?: string | null
          max_attendees?: number | null
          start_date?: string
          title?: string
          updated_at?: string
          virtual_link?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string | null
          id: string
          property_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          property_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          property_id?: string
          user_id?: string
        }
        Relationships: []
      }
      financial_kpis: {
        Row: {
          calculated_at: string | null
          calculation_method: string | null
          created_at: string | null
          id: string
          landlord_id: string | null
          metadata: Json | null
          metric_name: string
          metric_type: string
          metric_value: number
          percentage_change: number | null
          period_end: string
          period_start: string
          period_type: string
          previous_value: number | null
          property_id: string | null
          status: string | null
          target_value: number | null
        }
        Insert: {
          calculated_at?: string | null
          calculation_method?: string | null
          created_at?: string | null
          id?: string
          landlord_id?: string | null
          metadata?: Json | null
          metric_name: string
          metric_type: string
          metric_value: number
          percentage_change?: number | null
          period_end: string
          period_start: string
          period_type: string
          previous_value?: number | null
          property_id?: string | null
          status?: string | null
          target_value?: number | null
        }
        Update: {
          calculated_at?: string | null
          calculation_method?: string | null
          created_at?: string | null
          id?: string
          landlord_id?: string | null
          metadata?: Json | null
          metric_name?: string
          metric_type?: string
          metric_value?: number
          percentage_change?: number | null
          period_end?: string
          period_start?: string
          period_type?: string
          previous_value?: number | null
          property_id?: string | null
          status?: string | null
          target_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_kpis_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_reports: {
        Row: {
          auto_generated: boolean | null
          charts_data: Json | null
          created_at: string | null
          delivery_status: string | null
          description: string | null
          excel_url: string | null
          generated_at: string | null
          generated_for_user: string | null
          id: string
          pdf_url: string | null
          period_end: string
          period_start: string
          property_id: string | null
          report_data: Json
          report_type: string
          sent_at: string | null
          summary_metrics: Json | null
          template_used: string | null
          title: string
        }
        Insert: {
          auto_generated?: boolean | null
          charts_data?: Json | null
          created_at?: string | null
          delivery_status?: string | null
          description?: string | null
          excel_url?: string | null
          generated_at?: string | null
          generated_for_user?: string | null
          id?: string
          pdf_url?: string | null
          period_end: string
          period_start: string
          property_id?: string | null
          report_data: Json
          report_type: string
          sent_at?: string | null
          summary_metrics?: Json | null
          template_used?: string | null
          title: string
        }
        Update: {
          auto_generated?: boolean | null
          charts_data?: Json | null
          created_at?: string | null
          delivery_status?: string | null
          description?: string | null
          excel_url?: string | null
          generated_at?: string | null
          generated_for_user?: string | null
          id?: string
          pdf_url?: string | null
          period_end?: string
          period_start?: string
          property_id?: string | null
          report_data?: Json
          report_type?: string
          sent_at?: string | null
          summary_metrics?: Json | null
          template_used?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_reports_generated_for_user_fkey"
            columns: ["generated_for_user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_categories: {
        Row: {
          color: string | null
          created_at: string
          created_by: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      forum_posts: {
        Row: {
          author_id: string
          category_id: string
          content: string
          created_at: string
          id: string
          is_locked: boolean
          is_pinned: boolean
          last_reply_at: string | null
          reply_count: number
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          author_id: string
          category_id: string
          content: string
          created_at?: string
          id?: string
          is_locked?: boolean
          is_pinned?: boolean
          last_reply_at?: string | null
          reply_count?: number
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          author_id?: string
          category_id?: string
          content?: string
          created_at?: string
          id?: string
          is_locked?: boolean
          is_pinned?: boolean
          last_reply_at?: string | null
          reply_count?: number
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "forum_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "forum_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_replies: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          parent_reply_id: string | null
          post_id: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          parent_reply_id?: string | null
          post_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          parent_reply_id?: string | null
          post_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_replies_parent_reply_id_fkey"
            columns: ["parent_reply_id"]
            isOneToOne: false
            referencedRelation: "forum_replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_replies_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      fraud_alerts: {
        Row: {
          alert_type: string
          assigned_to: string | null
          created_at: string | null
          description: string
          id: string
          reference_id: string
          reference_type: string
          resolution_notes: string | null
          resolved_at: string | null
          severity: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          alert_type: string
          assigned_to?: string | null
          created_at?: string | null
          description: string
          id?: string
          reference_id: string
          reference_type: string
          resolution_notes?: string | null
          resolved_at?: string | null
          severity?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          alert_type?: string
          assigned_to?: string | null
          created_at?: string | null
          description?: string
          id?: string
          reference_id?: string
          reference_type?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          severity?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fraud_alerts_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fraud_checks: {
        Row: {
          application_id: string | null
          check_details: Json | null
          check_type: string
          created_at: string | null
          flagged_reasons: string[] | null
          fraud_indicators: Json | null
          id: string
          property_id: string | null
          risk_level: string | null
          risk_score: number | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          application_id?: string | null
          check_details?: Json | null
          check_type: string
          created_at?: string | null
          flagged_reasons?: string[] | null
          fraud_indicators?: Json | null
          id?: string
          property_id?: string | null
          risk_level?: string | null
          risk_score?: number | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          application_id?: string | null
          check_details?: Json | null
          check_type?: string
          created_at?: string | null
          flagged_reasons?: string[] | null
          fraud_indicators?: Json | null
          id?: string
          property_id?: string | null
          risk_level?: string | null
          risk_score?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fraud_checks_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "rental_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fraud_checks_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fraud_checks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      identity_verifications: {
        Row: {
          attempts: number | null
          created_at: string | null
          expires_at: string | null
          id: string
          status: string | null
          user_id: string | null
          verification_data: Json | null
          verification_type: string
          verified_at: string | null
        }
        Insert: {
          attempts?: number | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          status?: string | null
          user_id?: string | null
          verification_data?: Json | null
          verification_type: string
          verified_at?: string | null
        }
        Update: {
          attempts?: number | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          status?: string | null
          user_id?: string | null
          verification_data?: Json | null
          verification_type?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "identity_verifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      indicator_definitions: {
        Row: {
          calculation_method: string | null
          category: string | null
          code: string
          created_at: string
          data_type: string | null
          description: string | null
          id: string
          name: string
          source_organization: string | null
          unit: string | null
          updated_at: string
        }
        Insert: {
          calculation_method?: string | null
          category?: string | null
          code: string
          created_at?: string
          data_type?: string | null
          description?: string | null
          id?: string
          name: string
          source_organization?: string | null
          unit?: string | null
          updated_at?: string
        }
        Update: {
          calculation_method?: string | null
          category?: string | null
          code?: string
          created_at?: string
          data_type?: string | null
          description?: string | null
          id?: string
          name?: string
          source_organization?: string | null
          unit?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      indicator_translations: {
        Row: {
          category_name: string | null
          created_at: string
          description: string | null
          display_name: string
          id: string
          indicator_code: string
          language_code: string
          unit_display: string | null
          updated_at: string
        }
        Insert: {
          category_name?: string | null
          created_at?: string
          description?: string | null
          display_name: string
          id?: string
          indicator_code: string
          language_code: string
          unit_display?: string | null
          updated_at?: string
        }
        Update: {
          category_name?: string | null
          created_at?: string
          description?: string | null
          display_name?: string
          id?: string
          indicator_code?: string
          language_code?: string
          unit_display?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      intervention_photos: {
        Row: {
          created_at: string | null
          description: string | null
          file_size: number | null
          id: string
          maintenance_request_id: string
          mime_type: string | null
          photo_type: string
          photo_url: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          file_size?: number | null
          id?: string
          maintenance_request_id: string
          mime_type?: string | null
          photo_type: string
          photo_url: string
          uploaded_by: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          file_size?: number | null
          id?: string
          maintenance_request_id?: string
          mime_type?: string | null
          photo_type?: string
          photo_url?: string
          uploaded_by?: string
        }
        Relationships: []
      }
      intervention_tracking: {
        Row: {
          additional_costs: number | null
          artisan_id: string
          created_at: string | null
          end_time: string | null
          id: string
          maintenance_request_id: string
          materials_used: Json | null
          notes: string | null
          start_time: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          additional_costs?: number | null
          artisan_id: string
          created_at?: string | null
          end_time?: string | null
          id?: string
          maintenance_request_id: string
          materials_used?: Json | null
          notes?: string | null
          start_time?: string | null
          status: string
          updated_at?: string | null
        }
        Update: {
          additional_costs?: number | null
          artisan_id?: string
          created_at?: string | null
          end_time?: string | null
          id?: string
          maintenance_request_id?: string
          materials_used?: Json | null
          notes?: string | null
          start_time?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      intouch_simulation_logs: {
        Row: {
          created_at: string | null
          http_status: number | null
          id: string
          request_data: Json
          request_type: string
          response_data: Json | null
          simulated_delay_ms: number | null
          simulation_scenario: string | null
          success: boolean | null
          transaction_ref: string
        }
        Insert: {
          created_at?: string | null
          http_status?: number | null
          id?: string
          request_data: Json
          request_type: string
          response_data?: Json | null
          simulated_delay_ms?: number | null
          simulation_scenario?: string | null
          success?: boolean | null
          transaction_ref: string
        }
        Update: {
          created_at?: string | null
          http_status?: number | null
          id?: string
          request_data?: Json
          request_type?: string
          response_data?: Json | null
          simulated_delay_ms?: number | null
          simulation_scenario?: string | null
          success?: boolean | null
          transaction_ref?: string
        }
        Relationships: []
      }
      invoice_line_items: {
        Row: {
          created_at: string | null
          description: string
          id: string
          invoice_id: string | null
          item_type: string
          metadata: Json | null
          quantity: number | null
          tax_amount: number | null
          tax_rate: number | null
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          invoice_id?: string | null
          item_type: string
          metadata?: Json | null
          quantity?: number | null
          tax_amount?: number | null
          tax_rate?: number | null
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          invoice_id?: string | null
          item_type?: string
          metadata?: Json | null
          quantity?: number | null
          tax_amount?: number | null
          tax_rate?: number | null
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_line_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_templates: {
        Row: {
          content_html: string
          content_json: Json | null
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          name: string
          template_type: string
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          content_html: string
          content_json?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name: string
          template_type: string
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          content_html?: string
          content_json?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name?: string
          template_type?: string
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          due_date: string
          email_sent: boolean | null
          email_sent_at: string | null
          id: string
          invoice_date: string
          invoice_number: string
          invoice_type: string
          landlord_id: string | null
          lease_id: string | null
          metadata: Json | null
          notes: string | null
          payment_status: string | null
          pdf_url: string | null
          property_id: string | null
          status: string | null
          tax_amount: number | null
          tenant_id: string | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          due_date: string
          email_sent?: boolean | null
          email_sent_at?: string | null
          id?: string
          invoice_date?: string
          invoice_number: string
          invoice_type?: string
          landlord_id?: string | null
          lease_id?: string | null
          metadata?: Json | null
          notes?: string | null
          payment_status?: string | null
          pdf_url?: string | null
          property_id?: string | null
          status?: string | null
          tax_amount?: number | null
          tenant_id?: string | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          due_date?: string
          email_sent?: boolean | null
          email_sent_at?: string | null
          id?: string
          invoice_date?: string
          invoice_number?: string
          invoice_type?: string
          landlord_id?: string | null
          lease_id?: string | null
          metadata?: Json | null
          notes?: string | null
          payment_status?: string | null
          pdf_url?: string | null
          property_id?: string | null
          status?: string | null
          tax_amount?: number | null
          tenant_id?: string | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_lease_id_fkey"
            columns: ["lease_id"]
            isOneToOne: false
            referencedRelation: "leases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      languages: {
        Row: {
          code: string
          created_at: string
          id: string
          is_active: boolean
          is_default: boolean
          name: string
          native_name: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_default?: boolean
          name: string
          native_name: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_default?: boolean
          name?: string
          native_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      late_payments: {
        Row: {
          amount_due: number
          classification: string | null
          created_at: string | null
          days_late: number
          id: string
          invoice_id: string | null
          late_fee_amount: number | null
          notes: string | null
          payment_id: string | null
          penalty_rate: number | null
          property_id: string | null
          resolution_date: string | null
          resolution_method: string | null
          risk_score: number | null
          status: string | null
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount_due: number
          classification?: string | null
          created_at?: string | null
          days_late: number
          id?: string
          invoice_id?: string | null
          late_fee_amount?: number | null
          notes?: string | null
          payment_id?: string | null
          penalty_rate?: number | null
          property_id?: string | null
          resolution_date?: string | null
          resolution_method?: string | null
          risk_score?: number | null
          status?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount_due?: number
          classification?: string | null
          created_at?: string | null
          days_late?: number
          id?: string
          invoice_id?: string | null
          late_fee_amount?: number | null
          notes?: string | null
          payment_id?: string | null
          penalty_rate?: number | null
          property_id?: string | null
          resolution_date?: string | null
          resolution_method?: string | null
          risk_score?: number | null
          status?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "late_payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "late_payments_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "late_payments_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "late_payments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leases: {
        Row: {
          created_at: string | null
          end_date: string
          id: string
          landlord_id: string
          lease_document_url: string | null
          monthly_rent: number
          property_id: string
          security_deposit: number | null
          signed_at: string | null
          start_date: string
          status: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: string
          landlord_id: string
          lease_document_url?: string | null
          monthly_rent: number
          property_id: string
          security_deposit?: number | null
          signed_at?: string | null
          start_date: string
          status?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: string
          landlord_id?: string
          lease_document_url?: string | null
          monthly_rent?: number
          property_id?: string
          security_deposit?: number | null
          signed_at?: string | null
          start_date?: string
          status?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      maintenance_categories: {
        Row: {
          created_at: string | null
          description: string | null
          estimated_duration_hours: number | null
          icon_name: string | null
          id: string
          is_active: boolean | null
          is_urgent_by_default: boolean | null
          name: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          estimated_duration_hours?: number | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          is_urgent_by_default?: boolean | null
          name: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          estimated_duration_hours?: number | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          is_urgent_by_default?: boolean | null
          name?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      maintenance_quotes: {
        Row: {
          artisan_id: string
          created_at: string | null
          description: string | null
          estimated_duration_hours: number | null
          id: string
          labor_cost: number | null
          maintenance_request_id: string
          materials_cost: number | null
          quote_amount: number
          status: string
          updated_at: string | null
          valid_until: string | null
        }
        Insert: {
          artisan_id: string
          created_at?: string | null
          description?: string | null
          estimated_duration_hours?: number | null
          id?: string
          labor_cost?: number | null
          maintenance_request_id: string
          materials_cost?: number | null
          quote_amount: number
          status?: string
          updated_at?: string | null
          valid_until?: string | null
        }
        Update: {
          artisan_id?: string
          created_at?: string | null
          description?: string | null
          estimated_duration_hours?: number | null
          id?: string
          labor_cost?: number | null
          maintenance_request_id?: string
          materials_cost?: number | null
          quote_amount?: number
          status?: string
          updated_at?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      maintenance_requests: {
        Row: {
          category: string
          completed_date: string | null
          cost_estimate: number | null
          created_at: string | null
          description: string
          final_cost: number | null
          id: string
          owner_id: string
          preferred_artisan_id: string | null
          property_id: string
          scheduled_date: string | null
          status: string
          tenant_id: string
          title: string
          updated_at: string | null
          urgency_level: string
        }
        Insert: {
          category: string
          completed_date?: string | null
          cost_estimate?: number | null
          created_at?: string | null
          description: string
          final_cost?: number | null
          id?: string
          owner_id: string
          preferred_artisan_id?: string | null
          property_id: string
          scheduled_date?: string | null
          status?: string
          tenant_id: string
          title: string
          updated_at?: string | null
          urgency_level?: string
        }
        Update: {
          category?: string
          completed_date?: string | null
          cost_estimate?: number | null
          created_at?: string | null
          description?: string
          final_cost?: number | null
          id?: string
          owner_id?: string
          preferred_artisan_id?: string | null
          property_id?: string
          scheduled_date?: string | null
          status?: string
          tenant_id?: string
          title?: string
          updated_at?: string | null
          urgency_level?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          property_id: string | null
          read_at: string | null
          recipient_id: string
          sender_id: string
          subject: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          property_id?: string | null
          read_at?: string | null
          recipient_id: string
          sender_id: string
          subject?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          property_id?: string | null
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
          subject?: string | null
        }
        Relationships: []
      }
      mobile_money_transactions: {
        Row: {
          amount: number
          callback_data: Json | null
          created_at: string | null
          id: string
          payment_id: string
          phone_number: string
          provider: string
          status: string | null
          transaction_reference: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          callback_data?: Json | null
          created_at?: string | null
          id?: string
          payment_id: string
          phone_number: string
          provider: string
          status?: string | null
          transaction_reference?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          callback_data?: Json | null
          created_at?: string | null
          id?: string
          payment_id?: string
          phone_number?: string
          provider?: string
          status?: string | null
          transaction_reference?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      network_security_events: {
        Row: {
          blocked: boolean | null
          created_at: string
          description: string
          details: Json | null
          event_type: string
          id: string
          resolved: boolean | null
          resolved_at: string | null
          severity: string
          source_ip: unknown
          target_ip: unknown
          user_id: string | null
        }
        Insert: {
          blocked?: boolean | null
          created_at?: string
          description: string
          details?: Json | null
          event_type: string
          id?: string
          resolved?: boolean | null
          resolved_at?: string | null
          severity: string
          source_ip?: unknown
          target_ip?: unknown
          user_id?: string | null
        }
        Update: {
          blocked?: boolean | null
          created_at?: string
          description?: string
          details?: Json | null
          event_type?: string
          id?: string
          resolved?: boolean | null
          resolved_at?: string | null
          severity?: string
          source_ip?: unknown
          target_ip?: unknown
          user_id?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          is_read: boolean
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          title: string
          type?: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      partner_organizations: {
        Row: {
          acronym: string | null
          category: string | null
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          acronym?: string | null
          category?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          acronym?: string | null
          category?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      payment_accounts: {
        Row: {
          account_type: string
          balance: number | null
          created_at: string | null
          currency: string | null
          id: string
          is_active: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          account_type: string
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          account_type?: string
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      payment_disputes: {
        Row: {
          amount_disputed: number
          created_at: string | null
          currency: string | null
          dispute_reason: string
          dispute_type: string
          escrow_account_id: string | null
          id: string
          initiated_by: string
          refund_request_id: string | null
          resolution: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string | null
          supporting_documents: Json | null
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount_disputed: number
          created_at?: string | null
          currency?: string | null
          dispute_reason: string
          dispute_type: string
          escrow_account_id?: string | null
          id?: string
          initiated_by: string
          refund_request_id?: string | null
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          supporting_documents?: Json | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount_disputed?: number
          created_at?: string | null
          currency?: string | null
          dispute_reason?: string
          dispute_type?: string
          escrow_account_id?: string | null
          id?: string
          initiated_by?: string
          refund_request_id?: string | null
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          supporting_documents?: Json | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_disputes_escrow_account_id_fkey"
            columns: ["escrow_account_id"]
            isOneToOne: false
            referencedRelation: "escrow_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_disputes_refund_request_id_fkey"
            columns: ["refund_request_id"]
            isOneToOne: false
            referencedRelation: "refund_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_disputes_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          is_default: boolean | null
          is_verified: boolean | null
          masked_identifier: string | null
          metadata: Json | null
          method_type: string
          provider: string | null
          token: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_default?: boolean | null
          is_verified?: boolean | null
          masked_identifier?: string | null
          metadata?: Json | null
          method_type: string
          provider?: string | null
          token?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_default?: boolean | null
          is_verified?: boolean | null
          masked_identifier?: string | null
          metadata?: Json | null
          method_type?: string
          provider?: string | null
          token?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      payment_notifications: {
        Row: {
          created_at: string | null
          delivery_method: string | null
          id: string
          is_read: boolean | null
          is_sent: boolean | null
          message: string
          notification_type: string
          payment_schedule_id: string | null
          sent_at: string | null
          title: string
          transaction_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          delivery_method?: string | null
          id?: string
          is_read?: boolean | null
          is_sent?: boolean | null
          message: string
          notification_type: string
          payment_schedule_id?: string | null
          sent_at?: string | null
          title: string
          transaction_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          delivery_method?: string | null
          id?: string
          is_read?: boolean | null
          is_sent?: boolean | null
          message?: string
          notification_type?: string
          payment_schedule_id?: string | null
          sent_at?: string | null
          title?: string
          transaction_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_notifications_payment_schedule_id_fkey"
            columns: ["payment_schedule_id"]
            isOneToOne: false
            referencedRelation: "payment_schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_notifications_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_plans: {
        Row: {
          amount_paid: number | null
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          created_by: string | null
          end_date: string
          frequency: string | null
          id: string
          installment_amount: number
          late_payment_id: string | null
          missed_payments: number | null
          next_payment_date: string | null
          number_of_installments: number
          payments_made: number | null
          plan_type: string | null
          start_date: string
          status: string | null
          tenant_id: string | null
          terms_accepted: boolean | null
          terms_accepted_at: string | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          amount_paid?: number | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          created_by?: string | null
          end_date: string
          frequency?: string | null
          id?: string
          installment_amount: number
          late_payment_id?: string | null
          missed_payments?: number | null
          next_payment_date?: string | null
          number_of_installments: number
          payments_made?: number | null
          plan_type?: string | null
          start_date: string
          status?: string | null
          tenant_id?: string | null
          terms_accepted?: boolean | null
          terms_accepted_at?: string | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          amount_paid?: number | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          created_by?: string | null
          end_date?: string
          frequency?: string | null
          id?: string
          installment_amount?: number
          late_payment_id?: string | null
          missed_payments?: number | null
          next_payment_date?: string | null
          number_of_installments?: number
          payments_made?: number | null
          plan_type?: string | null
          start_date?: string
          status?: string | null
          tenant_id?: string | null
          terms_accepted?: boolean | null
          terms_accepted_at?: string | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_plans_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_plans_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_plans_late_payment_id_fkey"
            columns: ["late_payment_id"]
            isOneToOne: false
            referencedRelation: "late_payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_plans_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_reminders: {
        Row: {
          channel: string
          created_at: string | null
          delivery_status: string | null
          escalation_needed: boolean | null
          id: string
          invoice_id: string | null
          late_payment_id: string | null
          message_content: string
          next_reminder_date: string | null
          read_at: string | null
          recipient_contact: string
          reminder_level: number
          reminder_type: string
          response_content: string | null
          response_received: boolean | null
          sent_at: string | null
          subject: string | null
          template_used: string | null
          tenant_id: string | null
        }
        Insert: {
          channel: string
          created_at?: string | null
          delivery_status?: string | null
          escalation_needed?: boolean | null
          id?: string
          invoice_id?: string | null
          late_payment_id?: string | null
          message_content: string
          next_reminder_date?: string | null
          read_at?: string | null
          recipient_contact: string
          reminder_level: number
          reminder_type: string
          response_content?: string | null
          response_received?: boolean | null
          sent_at?: string | null
          subject?: string | null
          template_used?: string | null
          tenant_id?: string | null
        }
        Update: {
          channel?: string
          created_at?: string | null
          delivery_status?: string | null
          escalation_needed?: boolean | null
          id?: string
          invoice_id?: string | null
          late_payment_id?: string | null
          message_content?: string
          next_reminder_date?: string | null
          read_at?: string | null
          recipient_contact?: string
          reminder_level?: number
          reminder_type?: string
          response_content?: string | null
          response_received?: boolean | null
          sent_at?: string | null
          subject?: string | null
          template_used?: string | null
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_reminders_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_reminders_late_payment_id_fkey"
            columns: ["late_payment_id"]
            isOneToOne: false
            referencedRelation: "late_payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_reminders_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_schedules: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          due_date: string
          id: string
          landlord_id: string | null
          last_reminder_date: string | null
          late_fee: number | null
          paid_amount: number | null
          paid_at: string | null
          property_id: string | null
          recurring_payment_id: string | null
          reminder_count: number | null
          reminder_sent: boolean | null
          status: string | null
          tenant_id: string | null
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          due_date: string
          id?: string
          landlord_id?: string | null
          last_reminder_date?: string | null
          late_fee?: number | null
          paid_amount?: number | null
          paid_at?: string | null
          property_id?: string | null
          recurring_payment_id?: string | null
          reminder_count?: number | null
          reminder_sent?: boolean | null
          status?: string | null
          tenant_id?: string | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          due_date?: string
          id?: string
          landlord_id?: string | null
          last_reminder_date?: string | null
          late_fee?: number | null
          paid_amount?: number | null
          paid_at?: string | null
          property_id?: string | null
          recurring_payment_id?: string | null
          reminder_count?: number | null
          reminder_sent?: boolean | null
          status?: string | null
          tenant_id?: string | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_schedules_recurring_payment_id_fkey"
            columns: ["recurring_payment_id"]
            isOneToOne: false
            referencedRelation: "recurring_payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_schedules_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          due_date: string | null
          id: string
          lease_id: string
          payment_date: string | null
          payment_method: string
          payment_type: string
          status: string | null
          tenant_id: string
          transaction_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          due_date?: string | null
          id?: string
          lease_id: string
          payment_date?: string | null
          payment_method: string
          payment_type: string
          status?: string | null
          tenant_id: string
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          due_date?: string | null
          id?: string
          lease_id?: string
          payment_date?: string | null
          payment_method?: string
          payment_type?: string
          status?: string | null
          tenant_id?: string
          transaction_id?: string | null
        }
        Relationships: []
      }
      penalty_calculations: {
        Row: {
          applied_date: string
          base_amount: number
          calculated_amount: number
          calculation_method: string | null
          calculation_type: string
          cap_amount: number | null
          created_at: string | null
          days_applied: number
          final_amount: number
          id: string
          late_payment_id: string | null
          penalty_rate: number
          waived: boolean | null
          waived_at: string | null
          waived_by: string | null
          waived_reason: string | null
        }
        Insert: {
          applied_date: string
          base_amount: number
          calculated_amount: number
          calculation_method?: string | null
          calculation_type: string
          cap_amount?: number | null
          created_at?: string | null
          days_applied: number
          final_amount: number
          id?: string
          late_payment_id?: string | null
          penalty_rate: number
          waived?: boolean | null
          waived_at?: string | null
          waived_by?: string | null
          waived_reason?: string | null
        }
        Update: {
          applied_date?: string
          base_amount?: number
          calculated_amount?: number
          calculation_method?: string | null
          calculation_type?: string
          cap_amount?: number | null
          created_at?: string | null
          days_applied?: number
          final_amount?: number
          id?: string
          late_payment_id?: string | null
          penalty_rate?: number
          waived?: boolean | null
          waived_at?: string | null
          waived_by?: string | null
          waived_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "penalty_calculations_late_payment_id_fkey"
            columns: ["late_payment_id"]
            isOneToOne: false
            referencedRelation: "late_payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "penalty_calculations_waived_by_fkey"
            columns: ["waived_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          created_at: string | null
          id: number
          monthly_limit: number
          plan_type: string
          price: number
          price_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          monthly_limit: number
          plan_type: string
          price: number
          price_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          monthly_limit?: number
          plan_type?: string
          price?: number
          price_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          country: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          organization: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          organization?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          organization?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          available: boolean | null
          bathrooms: number | null
          bedrooms: number | null
          city: string
          created_at: string | null
          currency: string | null
          description: string | null
          furnished: boolean | null
          id: string
          images: string[] | null
          latitude: number | null
          longitude: number | null
          neighborhood: string | null
          owner_id: string
          price: number
          property_type: string
          status: string | null
          surface_area: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          address: string
          available?: boolean | null
          bathrooms?: number | null
          bedrooms?: number | null
          city: string
          created_at?: string | null
          currency?: string | null
          description?: string | null
          furnished?: boolean | null
          id?: string
          images?: string[] | null
          latitude?: number | null
          longitude?: number | null
          neighborhood?: string | null
          owner_id: string
          price: number
          property_type: string
          status?: string | null
          surface_area?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          available?: boolean | null
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string
          created_at?: string | null
          currency?: string | null
          description?: string | null
          furnished?: boolean | null
          id?: string
          images?: string[] | null
          latitude?: number | null
          longitude?: number | null
          neighborhood?: string | null
          owner_id?: string
          price?: number
          property_type?: string
          status?: string | null
          surface_area?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      property_amenities: {
        Row: {
          amenity_name: string
          created_at: string | null
          id: string
          property_id: string
        }
        Insert: {
          amenity_name: string
          created_at?: string | null
          id?: string
          property_id: string
        }
        Update: {
          amenity_name?: string
          created_at?: string | null
          id?: string
          property_id?: string
        }
        Relationships: []
      }
      property_analytics: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          metadata: Json | null
          property_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          property_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          property_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      property_filters: {
        Row: {
          alert_enabled: boolean | null
          created_at: string | null
          filter_criteria: Json
          filter_name: string
          id: string
          saved_search: boolean | null
          user_id: string | null
        }
        Insert: {
          alert_enabled?: boolean | null
          created_at?: string | null
          filter_criteria: Json
          filter_name: string
          id?: string
          saved_search?: boolean | null
          user_id?: string | null
        }
        Update: {
          alert_enabled?: boolean | null
          created_at?: string | null
          filter_criteria?: Json
          filter_name?: string
          id?: string
          saved_search?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_filters_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      property_images: {
        Row: {
          alt_text: string | null
          created_at: string | null
          display_order: number | null
          id: string
          image_type: string | null
          image_url: string
          property_id: string | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_type?: string | null
          image_url: string
          property_id?: string | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_type?: string | null
          image_url?: string
          property_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_images_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_visits: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          property_id: string
          status: string | null
          visit_date: string
          visitor_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          property_id: string
          status?: string | null
          visit_date: string
          visitor_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          property_id?: string
          status?: string | null
          visit_date?: string
          visitor_id?: string
        }
        Relationships: []
      }
      qr_code_configs: {
        Row: {
          config_type: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          metadata: Json | null
          position: number
          qr_content: string
          subtitle: string | null
          theme: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          config_type?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          metadata?: Json | null
          position?: number
          qr_content: string
          subtitle?: string | null
          theme?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          config_type?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          metadata?: Json | null
          position?: number
          qr_content?: string
          subtitle?: string | null
          theme?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      qr_code_scans: {
        Row: {
          created_at: string | null
          id: string
          ip_address: unknown
          location_data: Json | null
          metadata: Json | null
          qr_code_id: string | null
          scanned_at: string | null
          success: boolean | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address?: unknown
          location_data?: Json | null
          metadata?: Json | null
          qr_code_id?: string | null
          scanned_at?: string | null
          success?: boolean | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: unknown
          location_data?: Json | null
          metadata?: Json | null
          qr_code_id?: string | null
          scanned_at?: string | null
          success?: boolean | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "qr_code_scans_qr_code_id_fkey"
            columns: ["qr_code_id"]
            isOneToOne: false
            referencedRelation: "qr_code_configs"
            referencedColumns: ["id"]
          },
        ]
      }
      receivables_tracking: {
        Row: {
          aging_bucket: string | null
          amount_outstanding: number
          amount_paid: number | null
          assigned_collector: string | null
          collection_notes: string | null
          collection_priority: string | null
          collection_status: string | null
          created_at: string | null
          currency: string | null
          id: string
          invoice_id: string | null
          last_action_date: string | null
          next_action_date: string | null
          property_id: string | null
          tenant_id: string | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          aging_bucket?: string | null
          amount_outstanding: number
          amount_paid?: number | null
          assigned_collector?: string | null
          collection_notes?: string | null
          collection_priority?: string | null
          collection_status?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          invoice_id?: string | null
          last_action_date?: string | null
          next_action_date?: string | null
          property_id?: string | null
          tenant_id?: string | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          aging_bucket?: string | null
          amount_outstanding?: number
          amount_paid?: number | null
          assigned_collector?: string | null
          collection_notes?: string | null
          collection_priority?: string | null
          collection_status?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          invoice_id?: string | null
          last_action_date?: string | null
          next_action_date?: string | null
          property_id?: string | null
          tenant_id?: string | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "receivables_tracking_assigned_collector_fkey"
            columns: ["assigned_collector"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receivables_tracking_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receivables_tracking_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receivables_tracking_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      recurring_payments: {
        Row: {
          amount: number
          auto_retry: boolean | null
          contract_id: string | null
          created_at: string | null
          currency: string | null
          failed_attempts: number | null
          frequency: string | null
          id: string
          last_payment_date: string | null
          max_failed_attempts: number | null
          next_payment_date: string | null
          notifications_enabled: boolean | null
          payment_account_id: string | null
          payment_day: number | null
          payment_method: string | null
          status: string | null
          total_payments_made: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          auto_retry?: boolean | null
          contract_id?: string | null
          created_at?: string | null
          currency?: string | null
          failed_attempts?: number | null
          frequency?: string | null
          id?: string
          last_payment_date?: string | null
          max_failed_attempts?: number | null
          next_payment_date?: string | null
          notifications_enabled?: boolean | null
          payment_account_id?: string | null
          payment_day?: number | null
          payment_method?: string | null
          status?: string | null
          total_payments_made?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          auto_retry?: boolean | null
          contract_id?: string | null
          created_at?: string | null
          currency?: string | null
          failed_attempts?: number | null
          frequency?: string | null
          id?: string
          last_payment_date?: string | null
          max_failed_attempts?: number | null
          next_payment_date?: string | null
          notifications_enabled?: boolean | null
          payment_account_id?: string | null
          payment_day?: number | null
          payment_method?: string | null
          status?: string | null
          total_payments_made?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recurring_payments_payment_account_id_fkey"
            columns: ["payment_account_id"]
            isOneToOne: false
            referencedRelation: "payment_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_codes: {
        Row: {
          code: string
          created_at: string | null
          current_uses: number | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          referrer_id: string | null
          reward_amount: number | null
          reward_percentage: number | null
          reward_type: string | null
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          current_uses?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          referrer_id?: string | null
          reward_amount?: number | null
          reward_percentage?: number | null
          reward_type?: string | null
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          current_uses?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          referrer_id?: string | null
          reward_amount?: number | null
          reward_percentage?: number | null
          reward_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_codes_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          conversion_date: string | null
          created_at: string | null
          first_transaction_date: string | null
          id: string
          referral_code_id: string | null
          referral_status: string | null
          referred_user_id: string | null
          referrer_id: string | null
          reward_earned: number | null
          reward_paid: boolean | null
          reward_paid_at: string | null
          updated_at: string | null
        }
        Insert: {
          conversion_date?: string | null
          created_at?: string | null
          first_transaction_date?: string | null
          id?: string
          referral_code_id?: string | null
          referral_status?: string | null
          referred_user_id?: string | null
          referrer_id?: string | null
          reward_earned?: number | null
          reward_paid?: boolean | null
          reward_paid_at?: string | null
          updated_at?: string | null
        }
        Update: {
          conversion_date?: string | null
          created_at?: string | null
          first_transaction_date?: string | null
          id?: string
          referral_code_id?: string | null
          referral_status?: string | null
          referred_user_id?: string | null
          referrer_id?: string | null
          reward_earned?: number | null
          reward_paid?: boolean | null
          reward_paid_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referral_code_id_fkey"
            columns: ["referral_code_id"]
            isOneToOne: false
            referencedRelation: "referral_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referred_user_id_fkey"
            columns: ["referred_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      refund_calculations: {
        Row: {
          approved_by: string | null
          calculation_date: string | null
          calculation_details: Json | null
          created_at: string | null
          currency: string | null
          final_refund_amount: number
          id: string
          original_amount: number
          refund_request_id: string | null
          total_deductions: number | null
        }
        Insert: {
          approved_by?: string | null
          calculation_date?: string | null
          calculation_details?: Json | null
          created_at?: string | null
          currency?: string | null
          final_refund_amount: number
          id?: string
          original_amount: number
          refund_request_id?: string | null
          total_deductions?: number | null
        }
        Update: {
          approved_by?: string | null
          calculation_date?: string | null
          calculation_details?: Json | null
          created_at?: string | null
          currency?: string | null
          final_refund_amount?: number
          id?: string
          original_amount?: number
          refund_request_id?: string | null
          total_deductions?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "refund_calculations_refund_request_id_fkey"
            columns: ["refund_request_id"]
            isOneToOne: false
            referencedRelation: "refund_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      refund_requests: {
        Row: {
          admin_comments: string | null
          approved_amount: number | null
          created_at: string | null
          currency: string | null
          deductions: Json | null
          escrow_account_id: string | null
          id: string
          original_transaction_id: string | null
          processed_at: string | null
          processed_by: string | null
          reason: string
          refund_type: string
          requested_amount: number
          requested_at: string | null
          status: string | null
          supporting_documents: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          admin_comments?: string | null
          approved_amount?: number | null
          created_at?: string | null
          currency?: string | null
          deductions?: Json | null
          escrow_account_id?: string | null
          id?: string
          original_transaction_id?: string | null
          processed_at?: string | null
          processed_by?: string | null
          reason: string
          refund_type: string
          requested_amount: number
          requested_at?: string | null
          status?: string | null
          supporting_documents?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          admin_comments?: string | null
          approved_amount?: number | null
          created_at?: string | null
          currency?: string | null
          deductions?: Json | null
          escrow_account_id?: string | null
          id?: string
          original_transaction_id?: string | null
          processed_at?: string | null
          processed_by?: string | null
          reason?: string
          refund_type?: string
          requested_amount?: number
          requested_at?: string | null
          status?: string | null
          supporting_documents?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "refund_requests_escrow_account_id_fkey"
            columns: ["escrow_account_id"]
            isOneToOne: false
            referencedRelation: "escrow_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refund_requests_original_transaction_id_fkey"
            columns: ["original_transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      reminder_templates: {
        Row: {
          channel: string
          created_at: string | null
          created_by: string | null
          delay_days: number
          id: string
          is_active: boolean | null
          language: string | null
          message_template: string
          name: string
          reminder_level: number
          subject_template: string | null
          template_type: string
          updated_at: string | null
        }
        Insert: {
          channel: string
          created_at?: string | null
          created_by?: string | null
          delay_days: number
          id?: string
          is_active?: boolean | null
          language?: string | null
          message_template: string
          name: string
          reminder_level: number
          subject_template?: string | null
          template_type: string
          updated_at?: string | null
        }
        Update: {
          channel?: string
          created_at?: string | null
          created_by?: string | null
          delay_days?: number
          id?: string
          is_active?: boolean | null
          language?: string | null
          message_template?: string
          name?: string
          reminder_level?: number
          subject_template?: string | null
          template_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reminder_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      rental_applications: {
        Row: {
          applicant_user_id: string
          application_date: string | null
          auto_score: number | null
          bank_name: string | null
          cover_letter: string | null
          created_at: string | null
          date_of_birth: string | null
          desired_move_in_date: string | null
          email: string
          employer_name: string | null
          employment_duration_months: number | null
          employment_type: string | null
          final_score: number | null
          full_name: string
          has_pets: boolean | null
          id: string
          landlord_notes: string | null
          lease_duration_months: number | null
          manual_score_adjustment: number | null
          monthly_income: number | null
          nationality: string | null
          number_of_occupants: number | null
          occupation: string | null
          pets_description: string | null
          phone: string
          previous_landlord_contact: string | null
          previous_landlord_name: string | null
          previous_rental_duration_months: number | null
          property_id: string
          reason_for_leaving: string | null
          special_requests: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          applicant_user_id: string
          application_date?: string | null
          auto_score?: number | null
          bank_name?: string | null
          cover_letter?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          desired_move_in_date?: string | null
          email: string
          employer_name?: string | null
          employment_duration_months?: number | null
          employment_type?: string | null
          final_score?: number | null
          full_name: string
          has_pets?: boolean | null
          id?: string
          landlord_notes?: string | null
          lease_duration_months?: number | null
          manual_score_adjustment?: number | null
          monthly_income?: number | null
          nationality?: string | null
          number_of_occupants?: number | null
          occupation?: string | null
          pets_description?: string | null
          phone: string
          previous_landlord_contact?: string | null
          previous_landlord_name?: string | null
          previous_rental_duration_months?: number | null
          property_id: string
          reason_for_leaving?: string | null
          special_requests?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          applicant_user_id?: string
          application_date?: string | null
          auto_score?: number | null
          bank_name?: string | null
          cover_letter?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          desired_move_in_date?: string | null
          email?: string
          employer_name?: string | null
          employment_duration_months?: number | null
          employment_type?: string | null
          final_score?: number | null
          full_name?: string
          has_pets?: boolean | null
          id?: string
          landlord_notes?: string | null
          lease_duration_months?: number | null
          manual_score_adjustment?: number | null
          monthly_income?: number | null
          nationality?: string | null
          number_of_occupants?: number | null
          occupation?: string | null
          pets_description?: string | null
          phone?: string
          previous_landlord_contact?: string | null
          previous_landlord_name?: string | null
          previous_rental_duration_months?: number | null
          property_id?: string
          reason_for_leaving?: string | null
          special_requests?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      rental_contracts: {
        Row: {
          agency_fees: number | null
          application_id: string
          contract_number: string
          contract_pdf_url: string | null
          contract_type: string | null
          created_at: string | null
          end_date: string
          id: string
          inventory_notes: string | null
          landlord_id: string
          landlord_signature_ip: unknown
          landlord_signed_at: string | null
          monthly_rent: number
          property_id: string
          security_deposit: number
          signature_date: string | null
          signed_contract_pdf_url: string | null
          special_clauses: string | null
          start_date: string
          status: string | null
          tenant_id: string
          tenant_signature_ip: unknown
          tenant_signed_at: string | null
          updated_at: string | null
          utilities_included: boolean | null
        }
        Insert: {
          agency_fees?: number | null
          application_id: string
          contract_number: string
          contract_pdf_url?: string | null
          contract_type?: string | null
          created_at?: string | null
          end_date: string
          id?: string
          inventory_notes?: string | null
          landlord_id: string
          landlord_signature_ip?: unknown
          landlord_signed_at?: string | null
          monthly_rent: number
          property_id: string
          security_deposit: number
          signature_date?: string | null
          signed_contract_pdf_url?: string | null
          special_clauses?: string | null
          start_date: string
          status?: string | null
          tenant_id: string
          tenant_signature_ip?: unknown
          tenant_signed_at?: string | null
          updated_at?: string | null
          utilities_included?: boolean | null
        }
        Update: {
          agency_fees?: number | null
          application_id?: string
          contract_number?: string
          contract_pdf_url?: string | null
          contract_type?: string | null
          created_at?: string | null
          end_date?: string
          id?: string
          inventory_notes?: string | null
          landlord_id?: string
          landlord_signature_ip?: unknown
          landlord_signed_at?: string | null
          monthly_rent?: number
          property_id?: string
          security_deposit?: number
          signature_date?: string | null
          signed_contract_pdf_url?: string | null
          special_clauses?: string | null
          start_date?: string
          status?: string | null
          tenant_id?: string
          tenant_signature_ip?: unknown
          tenant_signed_at?: string | null
          updated_at?: string | null
          utilities_included?: boolean | null
        }
        Relationships: []
      }
      report_templates: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          output_format: string | null
          template_config: Json
          template_name: string
          template_type: string
          updated_at: string | null
          user_role: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          output_format?: string | null
          template_config: Json
          template_name: string
          template_type: string
          updated_at?: string | null
          user_role: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          output_format?: string | null
          template_config?: Json
          template_name?: string
          template_type?: string
          updated_at?: string | null
          user_role?: string
        }
        Relationships: []
      }
      revenue_analytics: {
        Row: {
          active_subscriptions: number | null
          calculated_at: string | null
          churned_subscriptions: number | null
          created_at: string | null
          id: string
          net_revenue: number | null
          new_subscriptions: number | null
          period_end: string
          period_start: string
          period_type: string
          referral_costs: number | null
          service_commissions: number | null
          subscription_revenue: number | null
          total_commissions: number | null
          total_transactions: number | null
        }
        Insert: {
          active_subscriptions?: number | null
          calculated_at?: string | null
          churned_subscriptions?: number | null
          created_at?: string | null
          id?: string
          net_revenue?: number | null
          new_subscriptions?: number | null
          period_end: string
          period_start: string
          period_type?: string
          referral_costs?: number | null
          service_commissions?: number | null
          subscription_revenue?: number | null
          total_commissions?: number | null
          total_transactions?: number | null
        }
        Update: {
          active_subscriptions?: number | null
          calculated_at?: string | null
          churned_subscriptions?: number | null
          created_at?: string | null
          id?: string
          net_revenue?: number | null
          new_subscriptions?: number | null
          period_end?: string
          period_start?: string
          period_type?: string
          referral_costs?: number | null
          service_commissions?: number | null
          subscription_revenue?: number | null
          total_commissions?: number | null
          total_transactions?: number | null
        }
        Relationships: []
      }
      scheduled_reports: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          last_generated: string | null
          next_generation: string | null
          recipient_emails: string[] | null
          report_name: string
          schedule_config: Json | null
          schedule_type: string
          template_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_generated?: string | null
          next_generation?: string | null
          recipient_emails?: string[] | null
          report_name: string
          schedule_config?: Json | null
          schedule_type: string
          template_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_generated?: string | null
          next_generation?: string | null
          recipient_emails?: string[] | null
          report_name?: string
          schedule_config?: Json | null
          schedule_type?: string
          template_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      security_preferences: {
        Row: {
          backup_codes: string[] | null
          created_at: string
          e2e_encryption_enabled: boolean | null
          id: string
          login_notifications: boolean | null
          max_concurrent_sessions: number | null
          security_alerts: boolean | null
          session_timeout: number | null
          two_factor_enabled: boolean | null
          two_factor_secret: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          backup_codes?: string[] | null
          created_at?: string
          e2e_encryption_enabled?: boolean | null
          id?: string
          login_notifications?: boolean | null
          max_concurrent_sessions?: number | null
          security_alerts?: boolean | null
          session_timeout?: number | null
          two_factor_enabled?: boolean | null
          two_factor_secret?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          backup_codes?: string[] | null
          created_at?: string
          e2e_encryption_enabled?: boolean | null
          id?: string
          login_notifications?: boolean | null
          max_concurrent_sessions?: number | null
          security_alerts?: boolean | null
          session_timeout?: number | null
          two_factor_enabled?: boolean | null
          two_factor_secret?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      service_categories: {
        Row: {
          category_name: string
          category_slug: string
          commission_rate: number | null
          created_at: string | null
          description: string | null
          icon_url: string | null
          id: string
          is_active: boolean | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          category_name: string
          category_slug: string
          commission_rate?: number | null
          created_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          category_name?: string
          category_slug?: string
          commission_rate?: number | null
          created_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      service_orders: {
        Row: {
          commission_amount: number
          completion_date: string | null
          created_at: string | null
          feedback: string | null
          id: string
          order_details: Json | null
          order_status: string | null
          property_id: string | null
          rating: number | null
          scheduled_date: string | null
          service_amount: number
          service_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          commission_amount: number
          completion_date?: string | null
          created_at?: string | null
          feedback?: string | null
          id?: string
          order_details?: Json | null
          order_status?: string | null
          property_id?: string | null
          rating?: number | null
          scheduled_date?: string | null
          service_amount: number
          service_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          commission_amount?: number
          completion_date?: string | null
          created_at?: string | null
          feedback?: string | null
          id?: string
          order_details?: Json | null
          order_status?: string | null
          property_id?: string | null
          rating?: number | null
          scheduled_date?: string | null
          service_amount?: number
          service_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_orders_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_orders_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "value_added_services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      service_revenue: {
        Row: {
          commission_earned: number
          created_at: string | null
          date: string
          id: string
          orders_count: number | null
          revenue: number
          service_category: string
        }
        Insert: {
          commission_earned: number
          created_at?: string | null
          date: string
          id?: string
          orders_count?: number | null
          revenue: number
          service_category: string
        }
        Update: {
          commission_earned?: number
          created_at?: string | null
          date?: string
          id?: string
          orders_count?: number | null
          revenue?: number
          service_category?: string
        }
        Relationships: []
      }
      submissions: {
        Row: {
          attachments: Json | null
          content: string | null
          created_at: string
          description: string | null
          id: string
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["submission_status"]
          submitted_at: string | null
          submitted_by: string
          title: string
          updated_at: string
        }
        Insert: {
          attachments?: Json | null
          content?: string | null
          created_at?: string
          description?: string | null
          id?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          submitted_at?: string | null
          submitted_by: string
          title: string
          updated_at?: string
        }
        Update: {
          attachments?: Json | null
          content?: string | null
          created_at?: string
          description?: string | null
          id?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          submitted_at?: string | null
          submitted_by?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscription_invoices: {
        Row: {
          amount: number
          created_at: string | null
          due_date: string
          id: string
          invoice_number: string
          paid_date: string | null
          payment_method: string | null
          status: string
          subscription_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          due_date: string
          id?: string
          invoice_number: string
          paid_date?: string | null
          payment_method?: string | null
          status: string
          subscription_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          due_date?: string
          id?: string
          invoice_number?: string
          paid_date?: string | null
          payment_method?: string | null
          status?: string
          subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_invoices_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          advanced_analytics: boolean | null
          created_at: string | null
          currency: string | null
          custom_branding: boolean | null
          features: Json
          id: string
          is_active: boolean | null
          max_properties: number | null
          max_transactions: number | null
          plan_name: string
          plan_type: string
          price: number
          priority_support: boolean | null
          trial_days: number | null
          updated_at: string | null
        }
        Insert: {
          advanced_analytics?: boolean | null
          created_at?: string | null
          currency?: string | null
          custom_branding?: boolean | null
          features?: Json
          id?: string
          is_active?: boolean | null
          max_properties?: number | null
          max_transactions?: number | null
          plan_name: string
          plan_type?: string
          price: number
          priority_support?: boolean | null
          trial_days?: number | null
          updated_at?: string | null
        }
        Update: {
          advanced_analytics?: boolean | null
          created_at?: string | null
          currency?: string | null
          custom_branding?: boolean | null
          features?: Json
          id?: string
          is_active?: boolean | null
          max_properties?: number | null
          max_transactions?: number | null
          plan_name?: string
          plan_type?: string
          price?: number
          priority_support?: boolean | null
          trial_days?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      subscription_plans_detailed: {
        Row: {
          analytics: boolean | null
          api_access: boolean | null
          created_at: string | null
          currency: string | null
          features: Json | null
          id: string
          interval_type: string
          max_listings: number | null
          name: string
          price: number
          priority_support: boolean | null
        }
        Insert: {
          analytics?: boolean | null
          api_access?: boolean | null
          created_at?: string | null
          currency?: string | null
          features?: Json | null
          id?: string
          interval_type: string
          max_listings?: number | null
          name: string
          price: number
          priority_support?: boolean | null
        }
        Update: {
          analytics?: boolean | null
          api_access?: boolean | null
          created_at?: string | null
          currency?: string | null
          features?: Json | null
          id?: string
          interval_type?: string
          max_listings?: number | null
          name?: string
          price?: number
          priority_support?: boolean | null
        }
        Relationships: []
      }
      subscription_revenue: {
        Row: {
          active_subscriptions: number | null
          canceled_subscriptions: number | null
          created_at: string | null
          date: string
          id: string
          new_subscriptions: number | null
          plan_type: string
          revenue: number
        }
        Insert: {
          active_subscriptions?: number | null
          canceled_subscriptions?: number | null
          created_at?: string | null
          date: string
          id?: string
          new_subscriptions?: number | null
          plan_type: string
          revenue: number
        }
        Update: {
          active_subscriptions?: number | null
          canceled_subscriptions?: number | null
          created_at?: string | null
          date?: string
          id?: string
          new_subscriptions?: number | null
          plan_type?: string
          revenue?: number
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          id: number
          price_id: string
          status: string
          stripe_customer_id: string
          stripe_subscription_id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          price_id: string
          status: string
          stripe_customer_id: string
          stripe_subscription_id: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          price_id?: string
          status?: string
          stripe_customer_id?: string
          stripe_subscription_id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["price_id"]
          },
        ]
      }
      sync_conflicts: {
        Row: {
          agency_id: string
          conflict_type: string
          created_at: string
          id: string
          is_resolved: boolean
          record_id: string
          resolution_strategy: string | null
          resolved_at: string | null
          resolved_by: string | null
          resolved_data: Json | null
          source_data: Json
          table_name: string
          target_data: Json
        }
        Insert: {
          agency_id: string
          conflict_type: string
          created_at?: string
          id?: string
          is_resolved?: boolean
          record_id: string
          resolution_strategy?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          resolved_data?: Json | null
          source_data: Json
          table_name: string
          target_data: Json
        }
        Update: {
          agency_id?: string
          conflict_type?: string
          created_at?: string
          id?: string
          is_resolved?: boolean
          record_id?: string
          resolution_strategy?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          resolved_data?: Json | null
          source_data?: Json
          table_name?: string
          target_data?: Json
        }
        Relationships: [
          {
            foreignKeyName: "sync_conflicts_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_logs: {
        Row: {
          agency_id: string
          completed_at: string | null
          connector_id: string | null
          duration_ms: number | null
          error_details: Json | null
          id: string
          records_created: number | null
          records_failed: number | null
          records_processed: number | null
          records_updated: number | null
          started_at: string
          status: string
          sync_type: string
        }
        Insert: {
          agency_id: string
          completed_at?: string | null
          connector_id?: string | null
          duration_ms?: number | null
          error_details?: Json | null
          id?: string
          records_created?: number | null
          records_failed?: number | null
          records_processed?: number | null
          records_updated?: number | null
          started_at?: string
          status: string
          sync_type: string
        }
        Update: {
          agency_id?: string
          completed_at?: string | null
          connector_id?: string | null
          duration_ms?: number | null
          error_details?: Json | null
          id?: string
          records_created?: number | null
          records_failed?: number | null
          records_processed?: number | null
          records_updated?: number | null
          started_at?: string
          status?: string
          sync_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "sync_logs_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sync_logs_connector_id_fkey"
            columns: ["connector_id"]
            isOneToOne: false
            referencedRelation: "agency_connectors"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_sessions: {
        Row: {
          agency_id: string
          conflicts_detected: number | null
          connector_id: string
          ended_at: string | null
          id: string
          metadata: Json | null
          records_processed: number | null
          session_type: string
          started_at: string
          status: string
          websocket_id: string | null
        }
        Insert: {
          agency_id: string
          conflicts_detected?: number | null
          connector_id: string
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          records_processed?: number | null
          session_type?: string
          started_at?: string
          status?: string
          websocket_id?: string | null
        }
        Update: {
          agency_id?: string
          conflicts_detected?: number | null
          connector_id?: string
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          records_processed?: number | null
          session_type?: string
          started_at?: string
          status?: string
          websocket_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sync_sessions_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sync_sessions_connector_id_fkey"
            columns: ["connector_id"]
            isOneToOne: false
            referencedRelation: "agency_connectors"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_workflows: {
        Row: {
          agency_id: string
          conditions: Json | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          steps: Json
          updated_at: string
          workflow_name: string
        }
        Insert: {
          agency_id: string
          conditions?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          steps?: Json
          updated_at?: string
          workflow_name: string
        }
        Update: {
          agency_id?: string
          conditions?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          steps?: Json
          updated_at?: string
          workflow_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "sync_workflows_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          description: string | null
          id: string
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: Json
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      transaction_commissions: {
        Row: {
          commission_amount: number
          commission_collected_at: string | null
          commission_rate_id: string | null
          commission_status: string | null
          created_at: string | null
          id: string
          landlord_id: string | null
          payment_date: string | null
          property_id: string | null
          tenant_id: string | null
          transaction_amount: number
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          commission_amount: number
          commission_collected_at?: string | null
          commission_rate_id?: string | null
          commission_status?: string | null
          created_at?: string | null
          id?: string
          landlord_id?: string | null
          payment_date?: string | null
          property_id?: string | null
          tenant_id?: string | null
          transaction_amount: number
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          commission_amount?: number
          commission_collected_at?: string | null
          commission_rate_id?: string | null
          commission_status?: string | null
          created_at?: string | null
          id?: string
          landlord_id?: string | null
          payment_date?: string | null
          property_id?: string | null
          tenant_id?: string | null
          transaction_amount?: number
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transaction_commissions_commission_rate_id_fkey"
            columns: ["commission_rate_id"]
            isOneToOne: false
            referencedRelation: "commission_rates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_commissions_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_commissions_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_commissions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_commissions_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      transaction_fees: {
        Row: {
          amount: number
          collected_by: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          fee_type: string
          id: string
          percentage: number | null
          transaction_id: string | null
        }
        Insert: {
          amount: number
          collected_by?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          fee_type: string
          id?: string
          percentage?: number | null
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          collected_by?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          fee_type?: string
          id?: string
          percentage?: number | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transaction_fees_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          description: string | null
          from_account_id: string | null
          id: string
          intouch_reference: string | null
          metadata: Json | null
          payment_method: string | null
          processed_at: string | null
          status: string | null
          to_account_id: string | null
          transaction_ref: string
          transaction_type: string
          updated_at: string | null
          user_id: string | null
          webhook_data: Json | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          from_account_id?: string | null
          id?: string
          intouch_reference?: string | null
          metadata?: Json | null
          payment_method?: string | null
          processed_at?: string | null
          status?: string | null
          to_account_id?: string | null
          transaction_ref: string
          transaction_type: string
          updated_at?: string | null
          user_id?: string | null
          webhook_data?: Json | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          from_account_id?: string | null
          id?: string
          intouch_reference?: string | null
          metadata?: Json | null
          payment_method?: string | null
          processed_at?: string | null
          status?: string | null
          to_account_id?: string | null
          transaction_ref?: string
          transaction_type?: string
          updated_at?: string | null
          user_id?: string | null
          webhook_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_from_account_id_fkey"
            columns: ["from_account_id"]
            isOneToOne: false
            referencedRelation: "payment_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_to_account_id_fkey"
            columns: ["to_account_id"]
            isOneToOne: false
            referencedRelation: "payment_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      translation_namespaces: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      translations: {
        Row: {
          approved_by: string | null
          context: string | null
          created_at: string
          created_by: string | null
          id: string
          is_approved: boolean
          key: string
          language_id: string
          namespace_id: string
          updated_at: string
          value: string
          version: number
        }
        Insert: {
          approved_by?: string | null
          context?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_approved?: boolean
          key: string
          language_id: string
          namespace_id: string
          updated_at?: string
          value: string
          version?: number
        }
        Update: {
          approved_by?: string | null
          context?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_approved?: boolean
          key?: string
          language_id?: string
          namespace_id?: string
          updated_at?: string
          value?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "translations_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "translations_namespace_id_fkey"
            columns: ["namespace_id"]
            isOneToOne: false
            referencedRelation: "translation_namespaces"
            referencedColumns: ["id"]
          },
        ]
      }
      uat_contributions: {
        Row: {
          adoption_status: string | null
          co_sponsors: string[] | null
          content: string
          contribution_type:
            | Database["public"]["Enums"]["contribution_type"]
            | null
          country: string | null
          created_at: string
          document_url: string | null
          id: string
          metadata: Json | null
          parent_id: string | null
          session_id: string | null
          status: string | null
          submitted_by: string | null
          theme: string | null
          title: string
          updated_at: string
          version: number | null
          votes_abstain: number | null
          votes_against: number | null
          votes_for: number | null
          working_group: string | null
        }
        Insert: {
          adoption_status?: string | null
          co_sponsors?: string[] | null
          content: string
          contribution_type?:
            | Database["public"]["Enums"]["contribution_type"]
            | null
          country?: string | null
          created_at?: string
          document_url?: string | null
          id?: string
          metadata?: Json | null
          parent_id?: string | null
          session_id?: string | null
          status?: string | null
          submitted_by?: string | null
          theme?: string | null
          title: string
          updated_at?: string
          version?: number | null
          votes_abstain?: number | null
          votes_against?: number | null
          votes_for?: number | null
          working_group?: string | null
        }
        Update: {
          adoption_status?: string | null
          co_sponsors?: string[] | null
          content?: string
          contribution_type?:
            | Database["public"]["Enums"]["contribution_type"]
            | null
          country?: string | null
          created_at?: string
          document_url?: string | null
          id?: string
          metadata?: Json | null
          parent_id?: string | null
          session_id?: string | null
          status?: string | null
          submitted_by?: string | null
          theme?: string | null
          title?: string
          updated_at?: string
          version?: number | null
          votes_abstain?: number | null
          votes_against?: number | null
          votes_for?: number | null
          working_group?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "uat_contributions_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "uat_contributions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uat_contributions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "uat_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uat_contributions_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "uat_participants"
            referencedColumns: ["id"]
          },
        ]
      }
      uat_nominations: {
        Row: {
          biography: string | null
          created_at: string
          cv_url: string | null
          endorsements: string[] | null
          event_id: string | null
          id: string
          is_withdrawn: boolean | null
          metadata: Json | null
          nominated_by: string
          nominee_country: string
          nominee_name: string
          position: string
          status: string | null
          updated_at: string
          votes: number | null
        }
        Insert: {
          biography?: string | null
          created_at?: string
          cv_url?: string | null
          endorsements?: string[] | null
          event_id?: string | null
          id?: string
          is_withdrawn?: boolean | null
          metadata?: Json | null
          nominated_by: string
          nominee_country: string
          nominee_name: string
          position: string
          status?: string | null
          updated_at?: string
          votes?: number | null
        }
        Update: {
          biography?: string | null
          created_at?: string
          cv_url?: string | null
          endorsements?: string[] | null
          event_id?: string | null
          id?: string
          is_withdrawn?: boolean | null
          metadata?: Json | null
          nominated_by?: string
          nominee_country?: string
          nominee_name?: string
          position?: string
          status?: string | null
          updated_at?: string
          votes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "uat_nominations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      uat_participants: {
        Row: {
          badge_number: string | null
          cer_region: string | null
          consent_given: boolean | null
          consent_timestamp: string | null
          country: string
          created_at: string
          email: string
          event_id: string | null
          first_name: string
          id: string
          is_verified: boolean | null
          last_name: string
          metadata: Json | null
          organization: string
          registered_at: string | null
          registration_qr: string | null
          role: Database["public"]["Enums"]["participant_role"] | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          badge_number?: string | null
          cer_region?: string | null
          consent_given?: boolean | null
          consent_timestamp?: string | null
          country: string
          created_at?: string
          email: string
          event_id?: string | null
          first_name: string
          id?: string
          is_verified?: boolean | null
          last_name: string
          metadata?: Json | null
          organization: string
          registered_at?: string | null
          registration_qr?: string | null
          role?: Database["public"]["Enums"]["participant_role"] | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          badge_number?: string | null
          cer_region?: string | null
          consent_given?: boolean | null
          consent_timestamp?: string | null
          country?: string
          created_at?: string
          email?: string
          event_id?: string | null
          first_name?: string
          id?: string
          is_verified?: boolean | null
          last_name?: string
          metadata?: Json | null
          organization?: string
          registered_at?: string | null
          registration_qr?: string | null
          role?: Database["public"]["Enums"]["participant_role"] | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "uat_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      uat_poll_votes: {
        Row: {
          id: string
          participant_id: string | null
          poll_id: string | null
          selected_options: Json
          voted_at: string | null
        }
        Insert: {
          id?: string
          participant_id?: string | null
          poll_id?: string | null
          selected_options: Json
          voted_at?: string | null
        }
        Update: {
          id?: string
          participant_id?: string | null
          poll_id?: string | null
          selected_options?: Json
          voted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "uat_poll_votes_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "uat_participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uat_poll_votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "uat_polls"
            referencedColumns: ["id"]
          },
        ]
      }
      uat_polls: {
        Row: {
          allows_multiple: boolean | null
          created_at: string
          created_by: string | null
          description: string | null
          end_time: string | null
          id: string
          is_active: boolean | null
          is_anonymous: boolean | null
          metadata: Json | null
          options: Json
          poll_type: Database["public"]["Enums"]["poll_type"] | null
          results: Json | null
          session_id: string | null
          start_time: string | null
          title: string
          total_votes: number | null
          updated_at: string
        }
        Insert: {
          allows_multiple?: boolean | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_time?: string | null
          id?: string
          is_active?: boolean | null
          is_anonymous?: boolean | null
          metadata?: Json | null
          options?: Json
          poll_type?: Database["public"]["Enums"]["poll_type"] | null
          results?: Json | null
          session_id?: string | null
          start_time?: string | null
          title: string
          total_votes?: number | null
          updated_at?: string
        }
        Update: {
          allows_multiple?: boolean | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_time?: string | null
          id?: string
          is_active?: boolean | null
          is_anonymous?: boolean | null
          metadata?: Json | null
          options?: Json
          poll_type?: Database["public"]["Enums"]["poll_type"] | null
          results?: Json | null
          session_id?: string | null
          start_time?: string | null
          title?: string
          total_votes?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "uat_polls_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "uat_participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uat_polls_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "uat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      uat_question_votes: {
        Row: {
          created_at: string | null
          id: string
          participant_id: string | null
          question_id: string | null
          vote_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          participant_id?: string | null
          question_id?: string | null
          vote_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          participant_id?: string | null
          question_id?: string | null
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "uat_question_votes_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "uat_participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uat_question_votes_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "uat_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      uat_questions: {
        Row: {
          answer: string | null
          answered_at: string | null
          answered_by: string | null
          category: string | null
          created_at: string
          id: string
          is_featured: boolean | null
          metadata: Json | null
          moderated_at: string | null
          moderated_by: string | null
          moderation_notes: string | null
          participant_id: string | null
          priority: number | null
          question: string
          session_id: string | null
          status: Database["public"]["Enums"]["question_status"] | null
          updated_at: string
          votes_down: number | null
          votes_up: number | null
        }
        Insert: {
          answer?: string | null
          answered_at?: string | null
          answered_by?: string | null
          category?: string | null
          created_at?: string
          id?: string
          is_featured?: boolean | null
          metadata?: Json | null
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_notes?: string | null
          participant_id?: string | null
          priority?: number | null
          question: string
          session_id?: string | null
          status?: Database["public"]["Enums"]["question_status"] | null
          updated_at?: string
          votes_down?: number | null
          votes_up?: number | null
        }
        Update: {
          answer?: string | null
          answered_at?: string | null
          answered_by?: string | null
          category?: string | null
          created_at?: string
          id?: string
          is_featured?: boolean | null
          metadata?: Json | null
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_notes?: string | null
          participant_id?: string | null
          priority?: number | null
          question?: string
          session_id?: string | null
          status?: Database["public"]["Enums"]["question_status"] | null
          updated_at?: string
          votes_down?: number | null
          votes_up?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "uat_questions_answered_by_fkey"
            columns: ["answered_by"]
            isOneToOne: false
            referencedRelation: "uat_participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uat_questions_moderated_by_fkey"
            columns: ["moderated_by"]
            isOneToOne: false
            referencedRelation: "uat_participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uat_questions_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "uat_participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uat_questions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "uat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      uat_session_attendance: {
        Row: {
          check_in_time: string | null
          check_out_time: string | null
          id: string
          is_present: boolean | null
          participant_id: string | null
          session_id: string | null
        }
        Insert: {
          check_in_time?: string | null
          check_out_time?: string | null
          id?: string
          is_present?: boolean | null
          participant_id?: string | null
          session_id?: string | null
        }
        Update: {
          check_in_time?: string | null
          check_out_time?: string | null
          id?: string
          is_present?: boolean | null
          participant_id?: string | null
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "uat_session_attendance_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "uat_participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uat_session_attendance_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "uat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      uat_sessions: {
        Row: {
          created_at: string
          current_attendees: number | null
          description: string | null
          documents: Json | null
          end_time: string
          event_id: string | null
          id: string
          is_mandatory: boolean | null
          location: string | null
          max_attendees: number | null
          metadata: Json | null
          presenter: string | null
          presenter_organization: string | null
          session_type: Database["public"]["Enums"]["session_type"] | null
          start_time: string
          status: string | null
          title: string
          updated_at: string
          virtual_link: string | null
          working_group: string | null
        }
        Insert: {
          created_at?: string
          current_attendees?: number | null
          description?: string | null
          documents?: Json | null
          end_time: string
          event_id?: string | null
          id?: string
          is_mandatory?: boolean | null
          location?: string | null
          max_attendees?: number | null
          metadata?: Json | null
          presenter?: string | null
          presenter_organization?: string | null
          session_type?: Database["public"]["Enums"]["session_type"] | null
          start_time: string
          status?: string | null
          title: string
          updated_at?: string
          virtual_link?: string | null
          working_group?: string | null
        }
        Update: {
          created_at?: string
          current_attendees?: number | null
          description?: string | null
          documents?: Json | null
          end_time?: string
          event_id?: string | null
          id?: string
          is_mandatory?: boolean | null
          location?: string | null
          max_attendees?: number | null
          metadata?: Json | null
          presenter?: string | null
          presenter_organization?: string | null
          session_type?: Database["public"]["Enums"]["session_type"] | null
          start_time?: string
          status?: string | null
          title?: string
          updated_at?: string
          virtual_link?: string | null
          working_group?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "uat_sessions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      universal_service_indicators: {
        Row: {
          country_code: string | null
          created_at: string
          data_source: string
          id: string
          indicator_code: string
          indicator_name: string
          last_updated_at: string
          metadata: Json | null
          quarter: number | null
          region: string | null
          source_url: string | null
          unit: string | null
          value: number | null
          year: number
        }
        Insert: {
          country_code?: string | null
          created_at?: string
          data_source: string
          id?: string
          indicator_code: string
          indicator_name: string
          last_updated_at?: string
          metadata?: Json | null
          quarter?: number | null
          region?: string | null
          source_url?: string | null
          unit?: string | null
          value?: number | null
          year: number
        }
        Update: {
          country_code?: string | null
          created_at?: string
          data_source?: string
          id?: string
          indicator_code?: string
          indicator_name?: string
          last_updated_at?: string
          metadata?: Json | null
          quarter?: number | null
          region?: string | null
          source_url?: string | null
          unit?: string | null
          value?: number | null
          year?: number
        }
        Relationships: []
      }
      user_dashboard_preferences: {
        Row: {
          created_at: string | null
          dashboard_layout: Json | null
          default_period: string | null
          id: string
          notifications_enabled: boolean | null
          theme_preference: string | null
          timezone: string | null
          updated_at: string | null
          user_id: string
          widget_preferences: Json | null
        }
        Insert: {
          created_at?: string | null
          dashboard_layout?: Json | null
          default_period?: string | null
          id?: string
          notifications_enabled?: boolean | null
          theme_preference?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id: string
          widget_preferences?: Json | null
        }
        Update: {
          created_at?: string | null
          dashboard_layout?: Json | null
          default_period?: string | null
          id?: string
          notifications_enabled?: boolean | null
          theme_preference?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string
          widget_preferences?: Json | null
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          created_at: string | null
          id: string
          property_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          property_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          property_id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          id: string
          preferences: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          preferences?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          preferences?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string | null
          user_type: string
          verified: boolean | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id: string
          phone?: string | null
          updated_at?: string | null
          user_type?: string
          verified?: boolean | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_type?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          ip_address: unknown
          is_active: boolean | null
          last_activity: string | null
          location: string | null
          session_token: string
          updated_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          ip_address?: unknown
          is_active?: boolean | null
          last_activity?: string | null
          location?: string | null
          session_token: string
          updated_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          ip_address?: unknown
          is_active?: boolean | null
          last_activity?: string | null
          location?: string | null
          session_token?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          auto_renew: boolean | null
          created_at: string | null
          end_date: string | null
          id: string
          last_payment_date: string | null
          next_billing_date: string | null
          payment_method: string | null
          plan_id: string | null
          start_date: string | null
          subscription_status: string | null
          total_paid: number | null
          trial_end_date: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          auto_renew?: boolean | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          last_payment_date?: string | null
          next_billing_date?: string | null
          payment_method?: string | null
          plan_id?: string | null
          start_date?: string | null
          subscription_status?: string | null
          total_paid?: number | null
          trial_end_date?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          auto_renew?: boolean | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          last_payment_date?: string | null
          next_billing_date?: string | null
          payment_method?: string | null
          plan_id?: string | null
          start_date?: string | null
          subscription_status?: string | null
          total_paid?: number | null
          trial_end_date?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_verifications: {
        Row: {
          created_at: string | null
          id: string
          status: string | null
          user_id: string
          verification_data: Json | null
          verification_type: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          status?: string | null
          user_id: string
          verification_data?: Json | null
          verification_type: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          status?: string | null
          user_id?: string
          verification_data?: Json | null
          verification_type?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      value_added_services: {
        Row: {
          available_regions: string[] | null
          category_id: string | null
          commission_rate: number | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          location_specific: boolean | null
          price: number | null
          price_type: string | null
          provider_contact: string | null
          provider_name: string | null
          service_name: string
          service_slug: string
          service_url: string | null
          updated_at: string | null
        }
        Insert: {
          available_regions?: string[] | null
          category_id?: string | null
          commission_rate?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          location_specific?: boolean | null
          price?: number | null
          price_type?: string | null
          provider_contact?: string | null
          provider_name?: string | null
          service_name: string
          service_slug: string
          service_url?: string | null
          updated_at?: string | null
        }
        Update: {
          available_regions?: string[] | null
          category_id?: string | null
          commission_rate?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          location_specific?: boolean | null
          price?: number | null
          price_type?: string | null
          provider_contact?: string | null
          provider_name?: string | null
          service_name?: string
          service_slug?: string
          service_url?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "value_added_services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_history: {
        Row: {
          action_taken: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown
          performed_by: string | null
          reference_id: string
          reference_type: string
          result: string
          user_agent: string | null
          verification_type: string
        }
        Insert: {
          action_taken: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown
          performed_by?: string | null
          reference_id: string
          reference_type: string
          result: string
          user_agent?: string | null
          verification_type: string
        }
        Update: {
          action_taken?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown
          performed_by?: string | null
          reference_id?: string
          reference_type?: string
          result?: string
          user_agent?: string | null
          verification_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "verification_history_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      webauthn_credentials: {
        Row: {
          created_at: string
          credential_id: string
          device_type: string | null
          id: string
          is_active: boolean | null
          last_used: string | null
          name: string
          public_key: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credential_id: string
          device_type?: string | null
          id?: string
          is_active?: boolean | null
          last_used?: string | null
          name: string
          public_key: string
          user_id: string
        }
        Update: {
          created_at?: string
          credential_id?: string
          device_type?: string | null
          id?: string
          is_active?: boolean | null
          last_used?: string | null
          name?: string
          public_key?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_update_user_role: {
        Args: {
          new_role: Database["public"]["Enums"]["user_role"]
          target_user_id: string
        }
        Returns: boolean
      }
      calculate_pending_refunds: {
        Args: never
        Returns: {
          amount: number
          currency: string
          days_pending: number
          priority_score: number
          refund_id: string
          user_id: string
        }[]
      }
      calculate_rental_income: {
        Args: { end_date: string; start_date: string; user_id: string }
        Returns: {
          payment_count: number
          total_income: number
        }[]
      }
      calculate_transaction_fees: {
        Args: {
          payment_method_type: string
          transaction_amount: number
          transaction_type_param: string
        }
        Returns: {
          platform_fee: number
          processing_fee: number
          total_fees: number
        }[]
      }
      check_uat_admin: { Args: never; Returns: boolean }
      cleanup_expired_sessions: { Args: never; Returns: number }
      cleanup_old_anomaly_alerts: { Args: never; Returns: number }
      create_payment_schedule: {
        Args: { months_ahead?: number; recurring_payment_id: string }
        Returns: number
      }
      generate_anomaly_alert: {
        Args: {
          p_auto_block?: boolean
          p_details?: Json
          p_message: string
          p_severity: string
          p_type: string
          p_user_id: string
        }
        Returns: string
      }
      get_account_balance: {
        Args: { account_type_filter?: string; account_user_id: string }
        Returns: {
          account_id: string
          account_type: string
          balance: number
          currency: string
        }[]
      }
      get_financial_summary: {
        Args: { user_id: string }
        Returns: {
          balance: number
          pending_transactions: number
          total_expenses: number
          total_income: number
        }[]
      }
      get_maintenance_metrics: {
        Args: { end_date: string; owner_user_id: string; start_date: string }
        Returns: {
          avg_resolution_time: number
          completed_requests: number
          in_progress_requests: number
          pending_requests: number
          total_cost: number
          total_requests: number
        }[]
      }
      get_overdue_recurring_payments: {
        Args: never
        Returns: {
          amount: number
          contract_id: string
          currency: string
          days_overdue: number
          failed_attempts: number
          payment_id: string
          user_id: string
        }[]
      }
      get_participant_networking_info: {
        Args: never
        Returns: {
          cer_region: string
          country: string
          first_name: string
          id: string
          is_verified: boolean
          last_name: string
          organization: string
          registered_at: string
          role: Database["public"]["Enums"]["participant_role"]
        }[]
      }
      get_property_stats: {
        Args: { owner_user_id: string }
        Returns: {
          occupancy_rate: number
          occupied_properties: number
          total_properties: number
          vacant_properties: number
        }[]
      }
      get_safe_participant_networking_data: {
        Args: never
        Returns: {
          cer_region: string
          country: string
          first_name: string
          id: string
          is_verified: boolean
          last_name: string
          organization: string
          registered_at: string
          role: Database["public"]["Enums"]["participant_role"]
        }[]
      }
      get_tenant_payment_stats: {
        Args: { end_date: string; start_date: string; tenant_user_id: string }
        Returns: {
          late_payments: number
          paid_on_time: number
          pending_payments: number
          total_amount: number
          total_payments: number
        }[]
      }
      get_user_balance: { Args: { user_id: string }; Returns: number }
      get_user_escrow_history: {
        Args: { target_user_id: string; user_role: string }
        Returns: {
          amount: number
          created_at: string
          currency: string
          escrow_id: string
          escrow_type: string
          other_party_id: string
          release_date: string
          status: string
        }[]
      }
      get_user_role:
        | { Args: never; Returns: string }
        | {
            Args: { user_id: string }
            Returns: Database["public"]["Enums"]["user_role"]
          }
      get_user_security_status: { Args: { p_user_id: string }; Returns: Json }
      get_user_transaction_stats: {
        Args: { end_date?: string; start_date?: string; target_user_id: string }
        Returns: {
          avg_transaction_amount: number
          failed_transactions: number
          pending_transactions: number
          successful_amount: number
          total_amount: number
          total_transactions: number
        }[]
      }
      is_admin: { Args: { user_id: string }; Returns: boolean }
      is_participant_admin: { Args: never; Returns: boolean }
      log_security_event: {
        Args: {
          p_action_type: string
          p_details?: Json
          p_ip_address?: unknown
          p_resource_id?: string
          p_resource_type?: string
          p_success?: boolean
          p_user_agent?: string
          p_user_id: string
        }
        Returns: string
      }
      process_overdue_payments: {
        Args: never
        Returns: {
          late_fees_applied: number
          processed_count: number
        }[]
      }
      release_escrow_funds: {
        Args: {
          escrow_account_id: string
          release_amount: number
          release_reason: string
        }
        Returns: boolean
      }
    }
    Enums: {
      contribution_type: "afcp" | "proposal" | "amendment" | "comment"
      document_type:
        | "guide"
        | "rapport"
        | "presentation"
        | "formulaire"
        | "autre"
      participant_role:
        | "delegate"
        | "rapporteur"
        | "president"
        | "moderator"
        | "admin"
      poll_type: "simple" | "multiple_choice" | "nomination" | "adoption"
      question_status: "pending" | "approved" | "rejected" | "answered"
      session_type: "plenary" | "working_group" | "presentation" | "break"
      submission_status:
        | "brouillon"
        | "soumis"
        | "en_revision"
        | "approuve"
        | "rejete"
      user_role:
        | "super_admin"
        | "admin_pays"
        | "editeur"
        | "contributeur"
        | "lecteur"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      contribution_type: ["afcp", "proposal", "amendment", "comment"],
      document_type: [
        "guide",
        "rapport",
        "presentation",
        "formulaire",
        "autre",
      ],
      participant_role: [
        "delegate",
        "rapporteur",
        "president",
        "moderator",
        "admin",
      ],
      poll_type: ["simple", "multiple_choice", "nomination", "adoption"],
      question_status: ["pending", "approved", "rejected", "answered"],
      session_type: ["plenary", "working_group", "presentation", "break"],
      submission_status: [
        "brouillon",
        "soumis",
        "en_revision",
        "approuve",
        "rejete",
      ],
      user_role: [
        "super_admin",
        "admin_pays",
        "editeur",
        "contributeur",
        "lecteur",
      ],
    },
  },
} as const
