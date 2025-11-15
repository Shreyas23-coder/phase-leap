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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_match_results: {
        Row: {
          candidate_id: string
          computed_at: string | null
          experience_match: boolean | null
          id: string
          job_id: string
          location_match: boolean | null
          match_score: number | null
          skill_match_details: Json | null
        }
        Insert: {
          candidate_id: string
          computed_at?: string | null
          experience_match?: boolean | null
          id?: string
          job_id: string
          location_match?: boolean | null
          match_score?: number | null
          skill_match_details?: Json | null
        }
        Update: {
          candidate_id?: string
          computed_at?: string | null
          experience_match?: boolean | null
          id?: string
          job_id?: string
          location_match?: boolean | null
          match_score?: number | null
          skill_match_details?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_match_results_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_match_results_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          applied_date: string | null
          candidate_id: string
          created_at: string | null
          id: string
          job_id: string
          match_percentage: number | null
          status: Database["public"]["Enums"]["application_status"] | null
        }
        Insert: {
          applied_date?: string | null
          candidate_id: string
          created_at?: string | null
          id?: string
          job_id: string
          match_percentage?: number | null
          status?: Database["public"]["Enums"]["application_status"] | null
        }
        Update: {
          applied_date?: string | null
          candidate_id?: string
          created_at?: string | null
          id?: string
          job_id?: string
          match_percentage?: number | null
          status?: Database["public"]["Enums"]["application_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_pipeline: {
        Row: {
          available_date: string | null
          candidate_id: string
          created_at: string
          id: string
          job_id: string
          linkedin_url: string | null
          phone: string | null
          recruiter_id: string
          stage: string
          status_note: string | null
          updated_at: string
        }
        Insert: {
          available_date?: string | null
          candidate_id: string
          created_at?: string
          id?: string
          job_id: string
          linkedin_url?: string | null
          phone?: string | null
          recruiter_id: string
          stage?: string
          status_note?: string | null
          updated_at?: string
        }
        Update: {
          available_date?: string | null
          candidate_id?: string
          created_at?: string
          id?: string
          job_id?: string
          linkedin_url?: string | null
          phone?: string | null
          recruiter_id?: string
          stage?: string
          status_note?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_pipeline_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_pipeline_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_pipeline_recruiter_id_fkey"
            columns: ["recruiter_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_profiles: {
        Row: {
          certifications: string[] | null
          created_at: string | null
          education: Json | null
          experience_years: number | null
          full_name: string | null
          id: string
          job_preferences: Json | null
          linkedin_url: string | null
          location: string | null
          parsed_resume_json: Json | null
          phone: string | null
          resume_url: string | null
          skills: string[] | null
          updated_at: string | null
          user_id: string
          work_experience: Json | null
        }
        Insert: {
          certifications?: string[] | null
          created_at?: string | null
          education?: Json | null
          experience_years?: number | null
          full_name?: string | null
          id?: string
          job_preferences?: Json | null
          linkedin_url?: string | null
          location?: string | null
          parsed_resume_json?: Json | null
          phone?: string | null
          resume_url?: string | null
          skills?: string[] | null
          updated_at?: string | null
          user_id: string
          work_experience?: Json | null
        }
        Update: {
          certifications?: string[] | null
          created_at?: string | null
          education?: Json | null
          experience_years?: number | null
          full_name?: string | null
          id?: string
          job_preferences?: Json | null
          linkedin_url?: string | null
          location?: string | null
          parsed_resume_json?: Json | null
          phone?: string | null
          resume_url?: string | null
          skills?: string[] | null
          updated_at?: string | null
          user_id?: string
          work_experience?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_conversations: {
        Row: {
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      job_postings: {
        Row: {
          company_name: string
          created_at: string | null
          experience_max: number | null
          experience_min: number | null
          id: string
          is_premium: boolean | null
          job_description: string
          job_title: string
          job_type: Database["public"]["Enums"]["job_type"] | null
          location: string
          posted_date: string | null
          recruiter_id: string
          salary_max: number | null
          salary_min: number | null
          skills_required: string[]
          status: Database["public"]["Enums"]["job_status"] | null
          updated_at: string | null
        }
        Insert: {
          company_name: string
          created_at?: string | null
          experience_max?: number | null
          experience_min?: number | null
          id?: string
          is_premium?: boolean | null
          job_description: string
          job_title: string
          job_type?: Database["public"]["Enums"]["job_type"] | null
          location: string
          posted_date?: string | null
          recruiter_id: string
          salary_max?: number | null
          salary_min?: number | null
          skills_required?: string[]
          status?: Database["public"]["Enums"]["job_status"] | null
          updated_at?: string | null
        }
        Update: {
          company_name?: string
          created_at?: string | null
          experience_max?: number | null
          experience_min?: number | null
          id?: string
          is_premium?: boolean | null
          job_description?: string
          job_title?: string
          job_type?: Database["public"]["Enums"]["job_type"] | null
          location?: string
          posted_date?: string | null
          recruiter_id?: string
          salary_max?: number | null
          salary_min?: number | null
          skills_required?: string[]
          status?: Database["public"]["Enums"]["job_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_postings_recruiter_id_fkey"
            columns: ["recruiter_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      recruiter_profiles: {
        Row: {
          company_name: string | null
          company_website: string | null
          created_at: string | null
          id: string
          location: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company_name?: string | null
          company_website?: string | null
          created_at?: string | null
          id?: string
          location?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company_name?: string | null
          company_website?: string | null
          created_at?: string | null
          id?: string
          location?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recruiter_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          auth_user_id: string
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          updated_at: string | null
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          auth_user_id: string
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: string
          updated_at?: string | null
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          auth_user_id?: string
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string | null
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      application_status: "pending" | "reviewed" | "shortlisted" | "rejected"
      job_status: "active" | "closed" | "draft"
      job_type: "full-time" | "part-time" | "contract" | "remote" | "hybrid"
      user_type: "candidate" | "recruiter"
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
      application_status: ["pending", "reviewed", "shortlisted", "rejected"],
      job_status: ["active", "closed", "draft"],
      job_type: ["full-time", "part-time", "contract", "remote", "hybrid"],
      user_type: ["candidate", "recruiter"],
    },
  },
} as const
