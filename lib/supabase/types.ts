/**
 * lib/supabase/types.ts
 * ─────────────────────────────────────────────────────────────────
 * Tipos TypeScript del schema de Supabase.
 * Formato: PostgREST v12 — requerido por @supabase/supabase-js ^2.48+
 *
 * EN PRODUCCIÓN: Generar automáticamente con:
 *   npx supabase gen types typescript --project-id TU_PROJECT_ID > lib/supabase/types.ts
 */

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string | null;
          phone: string | null;
          city: string | null;
          country: string;
          role: 'user' | 'admin';
          segment: 'vip' | 'activo' | 'nuevo' | 'suspendido';
          notes: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string | null;
          phone?: string | null;
          city?: string | null;
          country?: string;
          role?: 'user' | 'admin';
          segment?: 'vip' | 'activo' | 'nuevo' | 'suspendido';
          notes?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string | null;
          phone?: string | null;
          city?: string | null;
          country?: string;
          role?: 'user' | 'admin';
          segment?: 'vip' | 'activo' | 'nuevo' | 'suspendido';
          notes?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          price: number;
          compare_price: number | null;
          sku: string;
          stock: number;
          category: string;
          status: 'active' | 'low_stock' | 'out_of_stock' | 'draft' | 'archived';
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          price: number;
          compare_price?: number | null;
          sku: string;
          stock?: number;
          category: string;
          status?: 'active' | 'low_stock' | 'out_of_stock' | 'draft' | 'archived';
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          price?: number;
          compare_price?: number | null;
          sku?: string;
          stock?: number;
          category?: string;
          status?: 'active' | 'low_stock' | 'out_of_stock' | 'draft' | 'archived';
          featured?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          name: string;
          options: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          name: string;
          options: string[];
          created_at?: string;
        };
        Update: {
          name?: string;
          options?: string[];
        };
        Relationships: [
          {
            foreignKeyName: 'product_variants_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          }
        ];
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          url: string;
          alt: string | null;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          url: string;
          alt?: string | null;
          position?: number;
          created_at?: string;
        };
        Update: {
          url?: string;
          alt?: string | null;
          position?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'product_images_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          }
        ];
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          address: string;
          city: string;
          country: string;
          cp: string | null;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          address: string;
          city: string;
          country: string;
          cp?: string | null;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          address?: string;
          city?: string;
          country?: string;
          cp?: string | null;
          is_default?: boolean;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'addresses_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          created_at?: string;
        };
        Update: never;
        Relationships: [
          {
            foreignKeyName: 'favorites_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'favorites_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          }
        ];
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          customer_name: string;
          customer_email: string;
          customer_phone: string | null;
          ship_street: string;
          ship_city: string;
          ship_country: string;
          ship_cp: string | null;
          subtotal: number;
          shipping_cost: number;
          discount: number;
          total: number;
          status: 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado';
          payment_method: string;
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
          stripe_pi_id: string | null;
          coupon_code: string | null;
          tracking_code: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          customer_name: string;
          customer_email: string;
          customer_phone?: string | null;
          ship_street: string;
          ship_city: string;
          ship_country: string;
          ship_cp?: string | null;
          subtotal: number;
          shipping_cost: number;
          discount?: number;
          total: number;
          status?: 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado';
          payment_method: string;
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
          stripe_pi_id?: string | null;
          coupon_code?: string | null;
          tracking_code?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado';
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
          tracking_code?: string | null;
          notes?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          name: string;
          variant: string | null;
          price: number;
          quantity: number;
          image_url: string | null;
          slug: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          name: string;
          variant?: string | null;
          price: number;
          quantity: number;
          image_url?: string | null;
          slug?: string | null;
          created_at?: string;
        };
        Update: never;
        Relationships: [
          {
            foreignKeyName: 'order_items_order_id_fkey';
            columns: ['order_id'];
            isOneToOne: false;
            referencedRelation: 'orders';
            referencedColumns: ['id'];
          }
        ];
      };
      order_timeline: {
        Row: {
          id: string;
          order_id: string;
          status: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          status: string;
          description?: string | null;
          created_at?: string;
        };
        Update: never;
        Relationships: [
          {
            foreignKeyName: 'order_timeline_order_id_fkey';
            columns: ['order_id'];
            isOneToOne: false;
            referencedRelation: 'orders';
            referencedColumns: ['id'];
          }
        ];
      };
      coupons: {
        Row: {
          id: string;
          code: string;
          type: 'percent' | 'fixed';
          value: number;
          min_order: number;
          uses: number;
          max_uses: number | null;
          active: boolean;
          expires: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          type: 'percent' | 'fixed';
          value: number;
          min_order?: number;
          uses?: number;
          max_uses?: number | null;
          active?: boolean;
          expires?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          code?: string;
          type?: 'percent' | 'fixed';
          value?: number;
          min_order?: number;
          uses?: number;
          max_uses?: number | null;
          active?: boolean;
          expires?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      blog_posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string | null;
          cover_url: string | null;
          category: string;
          author_name: string;
          author_avatar: string | null;
          content: Json | null;
          published: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt?: string | null;
          cover_url?: string | null;
          category?: string;
          author_name?: string;
          author_avatar?: string | null;
          content?: Json | null;
          published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          slug?: string;
          title?: string;
          excerpt?: string | null;
          cover_url?: string | null;
          category?: string;
          author_name?: string;
          author_avatar?: string | null;
          content?: Json | null;
          published?: boolean;
          published_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          confirmed: boolean;
          source: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          confirmed?: boolean;
          source: string;
          created_at?: string;
        };
        Update: {
          confirmed?: boolean;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string | null;
          message: string;
          read: boolean;
          replied: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject?: string | null;
          message: string;
          read?: boolean;
          replied?: boolean;
          created_at?: string;
        };
        Update: {
          read?: boolean;
          replied?: boolean;
        };
        Relationships: [];
      };
      affiliate_applications: {
        Row: {
          id: string;
          name: string;
          email: string;
          instagram: string | null;
          followers: string | null;
          platform: string | null;
          motivation: string | null;
          status: 'pending' | 'approved' | 'rejected';
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          instagram?: string | null;
          followers?: string | null;
          platform?: string | null;
          motivation?: string | null;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
        };
        Update: {
          status?: 'pending' | 'approved' | 'rejected';
        };
        Relationships: [];
      };
      career_applications: {
        Row: {
          id: string;
          job_id: string;
          job_title: string;
          name: string;
          email: string;
          phone: string | null;
          cv_url: string | null;
          cover_letter: string | null;
          status: 'pending' | 'reviewing' | 'interview' | 'rejected' | 'hired';
          created_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          job_title: string;
          name: string;
          email: string;
          phone?: string | null;
          cv_url?: string | null;
          cover_letter?: string | null;
          status?: 'pending' | 'reviewing' | 'interview' | 'rejected' | 'hired';
          created_at?: string;
        };
        Update: {
          status?: 'pending' | 'reviewing' | 'interview' | 'rejected' | 'hired';
        };
        Relationships: [];
      };
      store_settings: {
        Row: {
          id: number;
          name: string;
          tagline: string | null;
          email: string | null;
          phone: string | null;
          address: string | null;
          city: string | null;
          currency: string;
          vat_rate: number;
          support_hours: string;
          notif_new_order: boolean;
          notif_order_shipped: boolean;
          notif_order_cancelled: boolean;
          notif_low_stock: boolean;
          notif_new_user: boolean;
          notif_newsletter_sub: boolean;
          notif_weekly_report: boolean;
          free_shipping_threshold: number;
          standard_days: string;
          express_days: string;
          updated_at: string;
        };
        Insert: never;
        Update: {
          name?: string;
          tagline?: string | null;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          currency?: string;
          vat_rate?: number;
          support_hours?: string;
          notif_new_order?: boolean;
          notif_order_shipped?: boolean;
          notif_order_cancelled?: boolean;
          notif_low_stock?: boolean;
          notif_new_user?: boolean;
          notif_newsletter_sub?: boolean;
          notif_weekly_report?: boolean;
          free_shipping_threshold?: number;
          standard_days?: string;
          express_days?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      shipping_zones: {
        Row: {
          id: string;
          name: string;
          price: number;
          enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          price: number;
          enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          price?: number;
          enabled?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      decrement_product_stock: {
        Args: { p_product_id: string; p_quantity: number };
        Returns: undefined;
      };
      increment_coupon_uses: {
        Args: { coupon_code: string };
        Returns: undefined;
      };
      get_sales_by_period: {
        Args: { p_days?: number };
        Returns: { date: string; orders: number; revenue: number }[];
      };
      get_top_products: {
        Args: { p_limit?: number };
        Returns: {
          product_id: string;
          product_name: string;
          total_sold: number;
          total_revenue: number;
        }[];
      };
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// ─── Tipos utilitarios de conveniencia ───────────────────────────
export type Profile       = Database['public']['Tables']['profiles']['Row'];
export type Product       = Database['public']['Tables']['products']['Row'];
export type Order         = Database['public']['Tables']['orders']['Row'];
export type OrderItem     = Database['public']['Tables']['order_items']['Row'];
export type Address       = Database['public']['Tables']['addresses']['Row'];
export type Coupon        = Database['public']['Tables']['coupons']['Row'];
export type BlogPost      = Database['public']['Tables']['blog_posts']['Row'];
export type StoreSettings = Database['public']['Tables']['store_settings']['Row'];
export type ShippingZone  = Database['public']['Tables']['shipping_zones']['Row'];
