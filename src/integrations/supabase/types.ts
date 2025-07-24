export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
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
      agency_projects: {
        Row: {
          agency_id: string
          beneficiaries: number | null
          budget: number | null
          completion_percentage: number | null
          coordinates: unknown | null
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
          coordinates?: unknown | null
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
          coordinates?: unknown | null
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
      audit_logs: {
        Row: {
          action_type: string
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown | null
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
          ip_address?: unknown | null
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
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string | null
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
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
      documents: {
        Row: {
          country: string | null
          created_at: string
          description: string | null
          document_type: Database["public"]["Enums"]["document_type"]
          download_count: number
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
        }
        Insert: {
          country?: string | null
          created_at?: string
          description?: string | null
          document_type?: Database["public"]["Enums"]["document_type"]
          download_count?: number
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
        }
        Update: {
          country?: string | null
          created_at?: string
          description?: string | null
          document_type?: Database["public"]["Enums"]["document_type"]
          download_count?: number
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
          source_ip: unknown | null
          target_ip: unknown | null
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
          source_ip?: unknown | null
          target_ip?: unknown | null
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
          source_ip?: unknown | null
          target_ip?: unknown | null
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
      user_sessions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          ip_address: unknown | null
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
          ip_address?: unknown | null
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
          ip_address?: unknown | null
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
      cleanup_expired_sessions: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      cleanup_old_anomaly_alerts: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      generate_anomaly_alert: {
        Args: {
          p_user_id: string
          p_type: string
          p_severity: string
          p_message: string
          p_details?: Json
          p_auto_block?: boolean
        }
        Returns: string
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      get_user_security_status: {
        Args: { p_user_id: string }
        Returns: Json
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      log_security_event: {
        Args: {
          p_user_id: string
          p_action_type: string
          p_resource_type?: string
          p_resource_id?: string
          p_details?: Json
          p_ip_address?: unknown
          p_user_agent?: string
          p_success?: boolean
        }
        Returns: string
      }
    }
    Enums: {
      document_type:
        | "guide"
        | "rapport"
        | "presentation"
        | "formulaire"
        | "autre"
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
      document_type: [
        "guide",
        "rapport",
        "presentation",
        "formulaire",
        "autre",
      ],
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
