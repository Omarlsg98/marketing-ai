export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      customer_journey: {
        Row: {
          author: Database["public"]["Enums"]["message_role"]
          created_at: string
          deleted_at: string | null
          id: string
          information: Json | null
          persona_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          author: Database["public"]["Enums"]["message_role"]
          created_at?: string
          deleted_at?: string | null
          id: string
          information?: Json | null
          persona_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          author?: Database["public"]["Enums"]["message_role"]
          created_at?: string
          deleted_at?: string | null
          id?: string
          information?: Json | null
          persona_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_customer_journey_persona_id"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "persona"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          created_at: string
          email: string
        }
        Insert: {
          created_at?: string
          email: string
        }
        Update: {
          created_at?: string
          email?: string
        }
        Relationships: []
      }
      lemon_squeezy_customers: {
        Row: {
          customer_id: number | null
          id: string
        }
        Insert: {
          customer_id?: number | null
          id: string
        }
        Update: {
          customer_id?: number | null
          id?: string
        }
        Relationships: []
      }
      lemon_squeezy_subscriptions: {
        Row: {
          cancelled: boolean | null
          created_at: string
          ends_at: string | null
          id: number
          metadata: Json | null
          renews_at: string | null
          status:
            | Database["public"]["Enums"]["lemon_squeezy_subscription_status"]
            | null
          updated_at: string
          user_id: string
          variant_id: number | null
        }
        Insert: {
          cancelled?: boolean | null
          created_at?: string
          ends_at?: string | null
          id: number
          metadata?: Json | null
          renews_at?: string | null
          status?:
            | Database["public"]["Enums"]["lemon_squeezy_subscription_status"]
            | null
          updated_at?: string
          user_id: string
          variant_id?: number | null
        }
        Update: {
          cancelled?: boolean | null
          created_at?: string
          ends_at?: string | null
          id?: number
          metadata?: Json | null
          renews_at?: string | null
          status?:
            | Database["public"]["Enums"]["lemon_squeezy_subscription_status"]
            | null
          updated_at?: string
          user_id?: string
          variant_id?: number | null
        }
        Relationships: []
      }
      llm_chats: {
        Row: {
          context: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          display_info: Json | null
          id: string
          is_first_interaction: boolean
          last_message_id_in_context: string | null
          object_context_id: string | null
          progress: number
          state: string
          status: Database["public"]["Enums"]["chat_status"]
          substep_id: number | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          context?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          display_info?: Json | null
          id: string
          is_first_interaction?: boolean
          last_message_id_in_context?: string | null
          object_context_id?: string | null
          progress?: number
          state?: string
          status?: Database["public"]["Enums"]["chat_status"]
          substep_id?: number | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          context?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          display_info?: Json | null
          id?: string
          is_first_interaction?: boolean
          last_message_id_in_context?: string | null
          object_context_id?: string | null
          progress?: number
          state?: string
          status?: Database["public"]["Enums"]["chat_status"]
          substep_id?: number | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "llm_chats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      llm_messages: {
        Row: {
          chat_id: string
          content: string
          created_at: string
          deleted_at: string | null
          id: string
          role: Database["public"]["Enums"]["message_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          chat_id: string
          content: string
          created_at?: string
          deleted_at?: string | null
          id: string
          role: Database["public"]["Enums"]["message_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          chat_id?: string
          content?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["message_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "llm_messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "llm_chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "llm_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      persona: {
        Row: {
          about_me: string | null
          author: Database["public"]["Enums"]["message_role"]
          coverage: number | null
          created_at: string
          deleted_at: string | null
          finished: boolean
          id: string
          image_path: string | null
          information: Json | null
          is_suggestion: boolean | null
          short_information: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          about_me?: string | null
          author: Database["public"]["Enums"]["message_role"]
          coverage?: number | null
          created_at?: string
          deleted_at?: string | null
          finished?: boolean
          id: string
          image_path?: string | null
          information?: Json | null
          is_suggestion?: boolean | null
          short_information?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          about_me?: string | null
          author?: Database["public"]["Enums"]["message_role"]
          coverage?: number | null
          created_at?: string
          deleted_at?: string | null
          finished?: boolean
          id?: string
          image_path?: string | null
          information?: Json | null
          is_suggestion?: boolean | null
          short_information?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "persona_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_customers: {
        Row: {
          customer_id: string | null
          id: string
        }
        Insert: {
          customer_id?: string | null
          id: string
        }
        Update: {
          customer_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stripe_customers_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_subscriptions: {
        Row: {
          cancel_at: string | null
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created: string
          current_period_end: string
          current_period_start: string
          ended_at: string | null
          id: string
          metadata: Json | null
          price_id: string | null
          status:
            | Database["public"]["Enums"]["stripe_subscription_status"]
            | null
          user_id: string
        }
        Insert: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id: string
          metadata?: Json | null
          price_id?: string | null
          status?:
            | Database["public"]["Enums"]["stripe_subscription_status"]
            | null
          user_id: string
        }
        Update: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          price_id?: string | null
          status?:
            | Database["public"]["Enums"]["stripe_subscription_status"]
            | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          credits: number
          email: string
          full_name: string | null
          id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          credits?: number
          email: string
          full_name?: string | null
          id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          credits?: number
          email?: string
          full_name?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_credits: {
        Args: {
          x: number
          user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      chat_status: "new" | "in_progress" | "closed"
      lemon_squeezy_subscription_status:
        | "active"
        | "unpaid"
        | "paused"
        | "on_trial"
        | "cancelled"
        | "expired"
      message_role: "user" | "assistant" | "system"
      question_category: "Persona B2B" | "Persona B2C"
      question_sub_category:
        | "Decision-Making"
        | "Current Situation"
        | "Background Information"
      question_type:
        | "text"
        | "multiline"
        | "number"
        | "date"
        | "select"
        | "multi-select"
      stripe_subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "past_due"
        | "unpaid"
        | "paused"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

