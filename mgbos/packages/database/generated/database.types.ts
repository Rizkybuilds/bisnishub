export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  app: {
    Tables: {
      addresses: {
        Row: {
          address_line_1: string
          address_line_2: string | null
          archived_at: string | null
          city: string
          country_code: string
          created_at: string
          district: string | null
          id: string
          latitude: number | null
          longitude: number | null
          phone: string
          postal_code: string
          province: string
          recipient_name: string
          updated_at: string
        }
        Insert: {
          address_line_1: string
          address_line_2?: string | null
          archived_at?: string | null
          city: string
          country_code?: string
          created_at?: string
          district?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          phone: string
          postal_code: string
          province: string
          recipient_name: string
          updated_at?: string
        }
        Update: {
          address_line_1?: string
          address_line_2?: string | null
          archived_at?: string | null
          city?: string
          country_code?: string
          created_at?: string
          district?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          phone?: string
          postal_code?: string
          province?: string
          recipient_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      brands: {
        Row: {
          archived_at: string | null
          code: string
          created_at: string
          description: string | null
          domain: string | null
          id: string
          name: string
          organization_id: string
          slug: string
          status: string
          updated_at: string
        }
        Insert: {
          archived_at?: string | null
          code: string
          created_at?: string
          description?: string | null
          domain?: string | null
          id?: string
          name: string
          organization_id: string
          slug: string
          status?: string
          updated_at?: string
        }
        Update: {
          archived_at?: string | null
          code?: string
          created_at?: string
          description?: string | null
          domain?: string | null
          id?: string
          name?: string
          organization_id?: string
          slug?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "brands_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      business_lines: {
        Row: {
          archived_at: string | null
          brand_id: string
          code: string
          created_at: string
          description: string | null
          id: string
          name: string
          status: string
          updated_at: string
        }
        Insert: {
          archived_at?: string | null
          brand_id: string
          code: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          status?: string
          updated_at?: string
        }
        Update: {
          archived_at?: string | null
          brand_id?: string
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_lines_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      channels: {
        Row: {
          archived_at: string | null
          channel_type: string
          code: string
          created_at: string
          id: string
          name: string
          organization_id: string
          status: string
          updated_at: string
        }
        Insert: {
          archived_at?: string | null
          channel_type: string
          code: string
          created_at?: string
          id?: string
          name: string
          organization_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          archived_at?: string | null
          channel_type?: string
          code?: string
          created_at?: string
          id?: string
          name?: string
          organization_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "channels_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_accounts: {
        Row: {
          account_type: string
          archived_at: string | null
          created_at: string
          customer_since: string
          display_name: string
          id: string
          legal_name: string | null
          organization_id: string
          primary_email: string | null
          primary_phone: string | null
          status: string
          tax_id: string | null
          updated_at: string
        }
        Insert: {
          account_type?: string
          archived_at?: string | null
          created_at?: string
          customer_since?: string
          display_name: string
          id?: string
          legal_name?: string | null
          organization_id: string
          primary_email?: string | null
          primary_phone?: string | null
          status?: string
          tax_id?: string | null
          updated_at?: string
        }
        Update: {
          account_type?: string
          archived_at?: string | null
          created_at?: string
          customer_since?: string
          display_name?: string
          id?: string
          legal_name?: string | null
          organization_id?: string
          primary_email?: string | null
          primary_phone?: string | null
          status?: string
          tax_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_accounts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_addresses: {
        Row: {
          address_id: string
          address_type: string
          created_at: string
          customer_account_id: string
          id: string
          is_default: boolean
          updated_at: string
        }
        Insert: {
          address_id: string
          address_type?: string
          created_at?: string
          customer_account_id: string
          id?: string
          is_default?: boolean
          updated_at?: string
        }
        Update: {
          address_id?: string
          address_type?: string
          created_at?: string
          customer_account_id?: string
          id?: string
          is_default?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_addresses_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_addresses_customer_account_id_fkey"
            columns: ["customer_account_id"]
            isOneToOne: false
            referencedRelation: "customer_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_brand_relationships: {
        Row: {
          brand_id: string
          created_at: string
          customer_account_id: string
          customer_segment: string
          first_interaction_at: string
          id: string
          last_interaction_at: string
          relationship_status: string
          updated_at: string
        }
        Insert: {
          brand_id: string
          created_at?: string
          customer_account_id: string
          customer_segment?: string
          first_interaction_at?: string
          id?: string
          last_interaction_at?: string
          relationship_status?: string
          updated_at?: string
        }
        Update: {
          brand_id?: string
          created_at?: string
          customer_account_id?: string
          customer_segment?: string
          first_interaction_at?: string
          id?: string
          last_interaction_at?: string
          relationship_status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_brand_relationships_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_brand_relationships_customer_account_id_fkey"
            columns: ["customer_account_id"]
            isOneToOne: false
            referencedRelation: "customer_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_contacts: {
        Row: {
          archived_at: string | null
          created_at: string
          customer_account_id: string
          email: string | null
          id: string
          is_primary: boolean
          name: string
          phone: string | null
          position: string | null
          updated_at: string
        }
        Insert: {
          archived_at?: string | null
          created_at?: string
          customer_account_id: string
          email?: string | null
          id?: string
          is_primary?: boolean
          name: string
          phone?: string | null
          position?: string | null
          updated_at?: string
        }
        Update: {
          archived_at?: string | null
          created_at?: string
          customer_account_id?: string
          email?: string | null
          id?: string
          is_primary?: boolean
          name?: string
          phone?: string | null
          position?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_contacts_customer_account_id_fkey"
            columns: ["customer_account_id"]
            isOneToOne: false
            referencedRelation: "customer_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      document_sequences: {
        Row: {
          brand_id: string
          created_at: string
          document_type: string
          id: string
          last_number: number
          organization_id: string
          updated_at: string
          year: number
        }
        Insert: {
          brand_id: string
          created_at?: string
          document_type: string
          id?: string
          last_number?: number
          organization_id: string
          updated_at?: string
          year: number
        }
        Update: {
          brand_id?: string
          created_at?: string
          document_type?: string
          id?: string
          last_number?: number
          organization_id?: string
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "document_sequences_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_sequences_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_ledger_entries: {
        Row: {
          amount: number
          brand_id: string
          category: string
          created_at: string
          created_by_user_id: string
          currency: string
          direction: string
          entry_number: string
          entry_type: string
          id: string
          metadata: Json
          notes: string | null
          order_id: string | null
          organization_id: string
          reference_document: string | null
          reference_id: string | null
        }
        Insert: {
          amount: number
          brand_id: string
          category: string
          created_at?: string
          created_by_user_id: string
          currency?: string
          direction: string
          entry_number: string
          entry_type: string
          id?: string
          metadata?: Json
          notes?: string | null
          order_id?: string | null
          organization_id: string
          reference_document?: string | null
          reference_id?: string | null
        }
        Update: {
          amount?: number
          brand_id?: string
          category?: string
          created_at?: string
          created_by_user_id?: string
          currency?: string
          direction?: string
          entry_number?: string
          entry_type?: string
          id?: string
          metadata?: Json
          notes?: string | null
          order_id?: string | null
          organization_id?: string
          reference_document?: string | null
          reference_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_ledger_entries_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_ledger_entries_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_ledger_entries_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_financial_summaries"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "financial_ledger_entries_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_ledger_entries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_audit: {
        Row: {
          action: string
          actor_id: string
          created_at: string
          details: Json
          id: string
          invoice_id: string
          organization_id: string
        }
        Insert: {
          action: string
          actor_id: string
          created_at?: string
          details?: Json
          id?: string
          invoice_id: string
          organization_id: string
        }
        Update: {
          action?: string
          actor_id?: string
          created_at?: string
          details?: Json
          id?: string
          invoice_id?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_audit_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_audit_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_audit_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          created_at: string
          description: string
          id: string
          invoice_id: string
          notes: string | null
          order_item_id: string | null
          quantity: number
          subtotal: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          invoice_id: string
          notes?: string | null
          order_item_id?: string | null
          quantity?: number
          subtotal: number
          unit_price: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string
          notes?: string | null
          order_item_id?: string | null
          quantity?: number
          subtotal?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount_paid: number
          amount_shipping: number
          amount_subtotal: number
          amount_tax: number
          amount_total: number
          balance_due: number
          bank_account_snapshot: Json
          brand_id: string
          created_at: string
          created_by_user_id: string
          currency: string
          customer_account_id: string
          customer_snapshot: Json
          due_date: string
          id: string
          invoice_number: string
          invoice_type: string
          issued_at: string | null
          notes: string | null
          order_id: string
          organization_id: string
          paid_at: string | null
          payment_instructions: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount_paid?: number
          amount_shipping?: number
          amount_subtotal: number
          amount_tax?: number
          amount_total: number
          balance_due: number
          bank_account_snapshot?: Json
          brand_id: string
          created_at?: string
          created_by_user_id: string
          currency?: string
          customer_account_id: string
          customer_snapshot?: Json
          due_date: string
          id?: string
          invoice_number: string
          invoice_type: string
          issued_at?: string | null
          notes?: string | null
          order_id: string
          organization_id: string
          paid_at?: string | null
          payment_instructions?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount_paid?: number
          amount_shipping?: number
          amount_subtotal?: number
          amount_tax?: number
          amount_total?: number
          balance_due?: number
          bank_account_snapshot?: Json
          brand_id?: string
          created_at?: string
          created_by_user_id?: string
          currency?: string
          customer_account_id?: string
          customer_snapshot?: Json
          due_date?: string
          id?: string
          invoice_number?: string
          invoice_type?: string
          issued_at?: string | null
          notes?: string | null
          order_id?: string
          organization_id?: string
          paid_at?: string | null
          payment_instructions?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_customer_account_id_fkey"
            columns: ["customer_account_id"]
            isOneToOne: false
            referencedRelation: "customer_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_financial_summaries"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "invoices_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          archived_at: string | null
          assigned_user_id: string | null
          brand_id: string
          business_line_id: string | null
          channel_id: string
          company_name: string | null
          contact_name: string | null
          contacted_at: string | null
          converted_at: string | null
          created_at: string
          customer_account_id: string | null
          customer_contact_id: string | null
          disqualification_reason: string | null
          disqualified_at: string | null
          email: string | null
          estimated_budget: number | null
          estimated_quantity: number | null
          id: string
          lead_number: string
          lost_at: string | null
          lost_reason: string | null
          organization_id: string
          phone: string | null
          qualification_notes: string | null
          qualification_result: string | null
          qualification_score: number | null
          qualified_at: string | null
          raw_inquiry: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          archived_at?: string | null
          assigned_user_id?: string | null
          brand_id: string
          business_line_id?: string | null
          channel_id: string
          company_name?: string | null
          contact_name?: string | null
          contacted_at?: string | null
          converted_at?: string | null
          created_at?: string
          customer_account_id?: string | null
          customer_contact_id?: string | null
          disqualification_reason?: string | null
          disqualified_at?: string | null
          email?: string | null
          estimated_budget?: number | null
          estimated_quantity?: number | null
          id?: string
          lead_number: string
          lost_at?: string | null
          lost_reason?: string | null
          organization_id: string
          phone?: string | null
          qualification_notes?: string | null
          qualification_result?: string | null
          qualification_score?: number | null
          qualified_at?: string | null
          raw_inquiry?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          archived_at?: string | null
          assigned_user_id?: string | null
          brand_id?: string
          business_line_id?: string | null
          channel_id?: string
          company_name?: string | null
          contact_name?: string | null
          contacted_at?: string | null
          converted_at?: string | null
          created_at?: string
          customer_account_id?: string | null
          customer_contact_id?: string | null
          disqualification_reason?: string | null
          disqualified_at?: string | null
          email?: string | null
          estimated_budget?: number | null
          estimated_quantity?: number | null
          id?: string
          lead_number?: string
          lost_at?: string | null
          lost_reason?: string | null
          organization_id?: string
          phone?: string | null
          qualification_notes?: string | null
          qualification_result?: string | null
          qualification_score?: number | null
          qualified_at?: string | null
          raw_inquiry?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_assigned_user_id_fkey"
            columns: ["assigned_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_business_line_id_fkey"
            columns: ["business_line_id"]
            isOneToOne: false
            referencedRelation: "business_lines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_customer_account_id_fkey"
            columns: ["customer_account_id"]
            isOneToOne: false
            referencedRelation: "customer_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_customer_contact_id_fkey"
            columns: ["customer_contact_id"]
            isOneToOne: false
            referencedRelation: "customer_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      order_audit: {
        Row: {
          action: string
          actor_id: string
          created_at: string
          details: Json
          id: string
          order_id: string
          organization_id: string
        }
        Insert: {
          action: string
          actor_id: string
          created_at?: string
          details?: Json
          id?: string
          order_id: string
          organization_id: string
        }
        Update: {
          action?: string
          actor_id?: string
          created_at?: string
          details?: Json
          id?: string
          order_id?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_audit_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_audit_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_financial_summaries"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "order_audit_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_audit_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          description: string
          discount_total: number
          id: string
          order_id: string
          position: number
          quantity: number
          specification_snapshot: Json
          subtotal: number
          unit: string
          unit_price: number
        }
        Insert: {
          created_at?: string
          description: string
          discount_total?: number
          id?: string
          order_id: string
          position?: number
          quantity: number
          specification_snapshot: Json
          subtotal: number
          unit: string
          unit_price: number
        }
        Update: {
          created_at?: string
          description?: string
          discount_total?: number
          id?: string
          order_id?: string
          position?: number
          quantity?: number
          specification_snapshot?: Json
          subtotal?: number
          unit?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_financial_summaries"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_address_snapshot: Json | null
          brand_id: string
          confirmed_at: string
          created_at: string
          created_by_user_id: string
          currency: string
          customer_account_id: string
          customer_snapshot: Json
          discount_total: number
          estimated_cost_total: number
          estimated_gross_profit: number
          grand_total: number
          id: string
          order_number: string
          organization_id: string
          payment_terms_snapshot: Json
          request_id: string
          request_payload: Json
          shipping_address_snapshot: Json
          shipping_total: number
          source_quote_id: string
          source_quote_version_id: string
          source_requirement_id: string
          source_requirement_version_id: string
          status: string
          subtotal: number
          updated_at: string
        }
        Insert: {
          billing_address_snapshot?: Json | null
          brand_id: string
          confirmed_at?: string
          created_at?: string
          created_by_user_id: string
          currency?: string
          customer_account_id: string
          customer_snapshot: Json
          discount_total: number
          estimated_cost_total: number
          estimated_gross_profit: number
          grand_total: number
          id?: string
          order_number: string
          organization_id: string
          payment_terms_snapshot: Json
          request_id: string
          request_payload?: Json
          shipping_address_snapshot: Json
          shipping_total: number
          source_quote_id: string
          source_quote_version_id: string
          source_requirement_id: string
          source_requirement_version_id: string
          status?: string
          subtotal: number
          updated_at?: string
        }
        Update: {
          billing_address_snapshot?: Json | null
          brand_id?: string
          confirmed_at?: string
          created_at?: string
          created_by_user_id?: string
          currency?: string
          customer_account_id?: string
          customer_snapshot?: Json
          discount_total?: number
          estimated_cost_total?: number
          estimated_gross_profit?: number
          grand_total?: number
          id?: string
          order_number?: string
          organization_id?: string
          payment_terms_snapshot?: Json
          request_id?: string
          request_payload?: Json
          shipping_address_snapshot?: Json
          shipping_total?: number
          source_quote_id?: string
          source_quote_version_id?: string
          source_requirement_id?: string
          source_requirement_version_id?: string
          status?: string
          subtotal?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_customer_account_id_fkey"
            columns: ["customer_account_id"]
            isOneToOne: false
            referencedRelation: "customer_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_source_quote_id_fkey"
            columns: ["source_quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_source_quote_version_id_fkey"
            columns: ["source_quote_version_id"]
            isOneToOne: true
            referencedRelation: "quote_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_source_requirement_id_fkey"
            columns: ["source_requirement_id"]
            isOneToOne: false
            referencedRelation: "requirements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_source_requirement_version_id_fkey"
            columns: ["source_requirement_version_id"]
            isOneToOne: false
            referencedRelation: "requirement_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          archived_at: string | null
          created_at: string
          id: string
          joined_at: string
          organization_id: string
          role_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          archived_at?: string | null
          created_at?: string
          id?: string
          joined_at?: string
          organization_id: string
          role_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          archived_at?: string | null
          created_at?: string
          id?: string
          joined_at?: string
          organization_id?: string
          role_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          archived_at: string | null
          base_currency: string
          billing_settings: Json
          code: string
          created_at: string
          display_name: string
          id: string
          legal_name: string
          status: string
          timezone: string
          updated_at: string
        }
        Insert: {
          archived_at?: string | null
          base_currency?: string
          billing_settings?: Json
          code: string
          created_at?: string
          display_name: string
          id?: string
          legal_name: string
          status?: string
          timezone?: string
          updated_at?: string
        }
        Update: {
          archived_at?: string | null
          base_currency?: string
          billing_settings?: Json
          code?: string
          created_at?: string
          display_name?: string
          id?: string
          legal_name?: string
          status?: string
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_allocations: {
        Row: {
          amount: number
          created_at: string
          id: string
          invoice_id: string
          notes: string | null
          organization_id: string
          payment_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          invoice_id: string
          notes?: string | null
          organization_id: string
          payment_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          invoice_id?: string
          notes?: string | null
          organization_id?: string
          payment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_allocations_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_allocations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_allocations_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_audit: {
        Row: {
          action: string
          actor_id: string
          created_at: string
          details: Json
          id: string
          organization_id: string
          payment_id: string
        }
        Insert: {
          action: string
          actor_id: string
          created_at?: string
          details?: Json
          id?: string
          organization_id: string
          payment_id: string
        }
        Update: {
          action?: string
          actor_id?: string
          created_at?: string
          details?: Json
          id?: string
          organization_id?: string
          payment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_audit_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_audit_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_audit_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          allocated_amount: number
          amount: number
          brand_id: string
          created_at: string
          created_by_user_id: string
          currency: string
          customer_account_id: string | null
          destination_account_number: string | null
          destination_bank: string | null
          id: string
          notes: string | null
          organization_id: string
          payer_account_number: string | null
          payer_bank: string | null
          payer_name: string | null
          payment_date: string
          payment_method: string
          payment_number: string
          proof_file_url: string | null
          received_at: string
          reference_number: string | null
          status: string
          updated_at: string
        }
        Insert: {
          allocated_amount?: number
          amount: number
          brand_id: string
          created_at?: string
          created_by_user_id: string
          currency?: string
          customer_account_id?: string | null
          destination_account_number?: string | null
          destination_bank?: string | null
          id?: string
          notes?: string | null
          organization_id: string
          payer_account_number?: string | null
          payer_bank?: string | null
          payer_name?: string | null
          payment_date?: string
          payment_method: string
          payment_number: string
          proof_file_url?: string | null
          received_at?: string
          reference_number?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          allocated_amount?: number
          amount?: number
          brand_id?: string
          created_at?: string
          created_by_user_id?: string
          currency?: string
          customer_account_id?: string | null
          destination_account_number?: string | null
          destination_bank?: string | null
          id?: string
          notes?: string | null
          organization_id?: string
          payer_account_number?: string | null
          payer_bank?: string | null
          payer_name?: string | null
          payment_date?: string
          payment_method?: string
          payment_number?: string
          proof_file_url?: string | null
          received_at?: string
          reference_number?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_customer_account_id_fkey"
            columns: ["customer_account_id"]
            isOneToOne: false
            referencedRelation: "customer_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      production_assignments: {
        Row: {
          accepted_at: string | null
          assigned_at: string
          assigned_brand_id: string | null
          assigned_cost: number | null
          created_at: string
          executor_type: string
          id: string
          notes: string | null
          production_job_id: string
          status: string
          vendor_id: string | null
          vendor_name: string | null
        }
        Insert: {
          accepted_at?: string | null
          assigned_at?: string
          assigned_brand_id?: string | null
          assigned_cost?: number | null
          created_at?: string
          executor_type: string
          id?: string
          notes?: string | null
          production_job_id: string
          status?: string
          vendor_id?: string | null
          vendor_name?: string | null
        }
        Update: {
          accepted_at?: string | null
          assigned_at?: string
          assigned_brand_id?: string | null
          assigned_cost?: number | null
          created_at?: string
          executor_type?: string
          id?: string
          notes?: string | null
          production_job_id?: string
          status?: string
          vendor_id?: string | null
          vendor_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "production_assignments_assigned_brand_id_fkey"
            columns: ["assigned_brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_assignments_production_job_id_fkey"
            columns: ["production_job_id"]
            isOneToOne: false
            referencedRelation: "production_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_assignments_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      production_job_audit: {
        Row: {
          action: string
          actor_id: string
          created_at: string
          details: Json
          id: string
          organization_id: string
          production_job_id: string
        }
        Insert: {
          action: string
          actor_id: string
          created_at?: string
          details?: Json
          id?: string
          organization_id: string
          production_job_id: string
        }
        Update: {
          action?: string
          actor_id?: string
          created_at?: string
          details?: Json
          id?: string
          organization_id?: string
          production_job_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "production_job_audit_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_job_audit_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_job_audit_production_job_id_fkey"
            columns: ["production_job_id"]
            isOneToOne: false
            referencedRelation: "production_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      production_job_items: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          order_item_id: string
          production_job_id: string
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          order_item_id: string
          production_job_id: string
          quantity: number
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          order_item_id?: string
          production_job_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "production_job_items_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_job_items_production_job_id_fkey"
            columns: ["production_job_id"]
            isOneToOne: false
            referencedRelation: "production_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      production_jobs: {
        Row: {
          actual_cost: number | null
          brand_id: string
          committed_cost: number | null
          created_at: string
          created_by_user_id: string
          currency: string
          estimated_cost: number
          id: string
          job_number: string
          job_type: string
          notes: string | null
          order_id: string
          organization_id: string
          priority: string
          specification: Json
          status: string
          target_completion_date: string | null
          title: string
          updated_at: string
        }
        Insert: {
          actual_cost?: number | null
          brand_id: string
          committed_cost?: number | null
          created_at?: string
          created_by_user_id: string
          currency?: string
          estimated_cost?: number
          id?: string
          job_number: string
          job_type: string
          notes?: string | null
          order_id: string
          organization_id: string
          priority?: string
          specification?: Json
          status?: string
          target_completion_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          actual_cost?: number | null
          brand_id?: string
          committed_cost?: number | null
          created_at?: string
          created_by_user_id?: string
          currency?: string
          estimated_cost?: number
          id?: string
          job_number?: string
          job_type?: string
          notes?: string | null
          order_id?: string
          organization_id?: string
          priority?: string
          specification?: Json
          status?: string
          target_completion_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "production_jobs_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_jobs_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_jobs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_financial_summaries"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "production_jobs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_jobs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      qc_inspections: {
        Row: {
          checklist_snapshot: Json
          created_at: string
          defect_category: string | null
          defect_count: number
          defect_severity: string | null
          id: string
          inspected_at: string
          inspection_number: string
          inspector_id: string
          notes: string | null
          organization_id: string
          production_job_id: string
          result: string
          rework_instructions: string | null
          sample_size: number
        }
        Insert: {
          checklist_snapshot?: Json
          created_at?: string
          defect_category?: string | null
          defect_count?: number
          defect_severity?: string | null
          id?: string
          inspected_at?: string
          inspection_number: string
          inspector_id: string
          notes?: string | null
          organization_id: string
          production_job_id: string
          result: string
          rework_instructions?: string | null
          sample_size?: number
        }
        Update: {
          checklist_snapshot?: Json
          created_at?: string
          defect_category?: string | null
          defect_count?: number
          defect_severity?: string | null
          id?: string
          inspected_at?: string
          inspection_number?: string
          inspector_id?: string
          notes?: string | null
          organization_id?: string
          production_job_id?: string
          result?: string
          rework_instructions?: string | null
          sample_size?: number
        }
        Relationships: [
          {
            foreignKeyName: "qc_inspections_inspector_id_fkey"
            columns: ["inspector_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qc_inspections_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qc_inspections_production_job_id_fkey"
            columns: ["production_job_id"]
            isOneToOne: false
            referencedRelation: "production_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_audit: {
        Row: {
          action: string
          actor_id: string
          created_at: string
          details: Json
          id: string
          organization_id: string
          quote_version_id: string
        }
        Insert: {
          action: string
          actor_id: string
          created_at?: string
          details?: Json
          id?: string
          organization_id: string
          quote_version_id: string
        }
        Update: {
          action?: string
          actor_id?: string
          created_at?: string
          details?: Json
          id?: string
          organization_id?: string
          quote_version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_audit_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_audit_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_audit_quote_version_id_fkey"
            columns: ["quote_version_id"]
            isOneToOne: false
            referencedRelation: "quote_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_cost_components: {
        Row: {
          cost_type: string
          description: string
          id: string
          quantity: number
          quote_item_id: string
          total_cost: number
          unit_cost: number
        }
        Insert: {
          cost_type: string
          description: string
          id?: string
          quantity: number
          quote_item_id: string
          total_cost: number
          unit_cost: number
        }
        Update: {
          cost_type?: string
          description?: string
          id?: string
          quantity?: number
          quote_item_id?: string
          total_cost?: number
          unit_cost?: number
        }
        Relationships: [
          {
            foreignKeyName: "quote_cost_components_quote_item_id_fkey"
            columns: ["quote_item_id"]
            isOneToOne: false
            referencedRelation: "quote_items"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_items: {
        Row: {
          description: string
          discount_total: number
          id: string
          position: number
          quantity: number
          quote_version_id: string
          specification: Json
          subtotal: number
          unit: string
          unit_price: number
        }
        Insert: {
          description: string
          discount_total: number
          id?: string
          position?: number
          quantity: number
          quote_version_id: string
          specification: Json
          subtotal: number
          unit: string
          unit_price: number
        }
        Update: {
          description?: string
          discount_total?: number
          id?: string
          position?: number
          quantity?: number
          quote_version_id?: string
          specification?: Json
          subtotal?: number
          unit?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "quote_items_quote_version_id_fkey"
            columns: ["quote_version_id"]
            isOneToOne: false
            referencedRelation: "quote_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_price_approvals: {
        Row: {
          approved_by_user_id: string
          created_at: string
          id: string
          quote_version_id: string
          reason: string
        }
        Insert: {
          approved_by_user_id: string
          created_at?: string
          id?: string
          quote_version_id: string
          reason: string
        }
        Update: {
          approved_by_user_id?: string
          created_at?: string
          id?: string
          quote_version_id?: string
          reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_price_approvals_approved_by_user_id_fkey"
            columns: ["approved_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_price_approvals_quote_version_id_fkey"
            columns: ["quote_version_id"]
            isOneToOne: true
            referencedRelation: "quote_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_versions: {
        Row: {
          acceptance_details: Json | null
          accepted_at: string | null
          created_at: string
          created_by_user_id: string
          currency: string
          customer_snapshot: Json
          discount_total: number
          estimated_cost_total: number
          estimated_gross_profit: number
          grand_total: number
          id: string
          issuer_snapshot: Json
          pricing_guard: string
          quote_id: string
          request_id: string
          request_payload: Json
          requirement_version_id: string
          sent_at: string | null
          shipping_total: number
          status: string
          subtotal: number
          terms_snapshot: Json
          valid_until: string
          version_number: number
        }
        Insert: {
          acceptance_details?: Json | null
          accepted_at?: string | null
          created_at?: string
          created_by_user_id: string
          currency?: string
          customer_snapshot: Json
          discount_total: number
          estimated_cost_total: number
          estimated_gross_profit: number
          grand_total: number
          id?: string
          issuer_snapshot?: Json
          pricing_guard: string
          quote_id: string
          request_id: string
          request_payload: Json
          requirement_version_id: string
          sent_at?: string | null
          shipping_total: number
          status?: string
          subtotal: number
          terms_snapshot: Json
          valid_until: string
          version_number: number
        }
        Update: {
          acceptance_details?: Json | null
          accepted_at?: string | null
          created_at?: string
          created_by_user_id?: string
          currency?: string
          customer_snapshot?: Json
          discount_total?: number
          estimated_cost_total?: number
          estimated_gross_profit?: number
          grand_total?: number
          id?: string
          issuer_snapshot?: Json
          pricing_guard?: string
          quote_id?: string
          request_id?: string
          request_payload?: Json
          requirement_version_id?: string
          sent_at?: string | null
          shipping_total?: number
          status?: string
          subtotal?: number
          terms_snapshot?: Json
          valid_until?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "quote_versions_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_versions_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_versions_requirement_version_id_fkey"
            columns: ["requirement_version_id"]
            isOneToOne: false
            referencedRelation: "requirement_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          brand_id: string
          created_at: string
          current_version_id: string | null
          customer_account_id: string
          id: string
          organization_id: string
          quote_number: string
          requirement_id: string
        }
        Insert: {
          brand_id: string
          created_at?: string
          current_version_id?: string | null
          customer_account_id: string
          id?: string
          organization_id: string
          quote_number: string
          requirement_id: string
        }
        Update: {
          brand_id?: string
          created_at?: string
          current_version_id?: string | null
          customer_account_id?: string
          id?: string
          organization_id?: string
          quote_number?: string
          requirement_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_current_version_fk"
            columns: ["id", "current_version_id"]
            isOneToOne: false
            referencedRelation: "quote_versions"
            referencedColumns: ["quote_id", "id"]
          },
          {
            foreignKeyName: "quotes_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_customer_account_id_fkey"
            columns: ["customer_account_id"]
            isOneToOne: false
            referencedRelation: "customer_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_requirement_id_fkey"
            columns: ["requirement_id"]
            isOneToOne: false
            referencedRelation: "requirements"
            referencedColumns: ["id"]
          },
        ]
      }
      requirement_versions: {
        Row: {
          completeness_score: number | null
          created_at: string
          created_by_user_id: string | null
          currency: string
          id: string
          is_locked: boolean
          locked_at: string | null
          locked_reason: string | null
          quantity: number | null
          requirement_id: string
          specification: Json
          summary: string
          target_budget: number | null
          target_date: string | null
          unit: string
          version_number: number
        }
        Insert: {
          completeness_score?: number | null
          created_at?: string
          created_by_user_id?: string | null
          currency?: string
          id?: string
          is_locked?: boolean
          locked_at?: string | null
          locked_reason?: string | null
          quantity?: number | null
          requirement_id: string
          specification?: Json
          summary: string
          target_budget?: number | null
          target_date?: string | null
          unit?: string
          version_number: number
        }
        Update: {
          completeness_score?: number | null
          created_at?: string
          created_by_user_id?: string | null
          currency?: string
          id?: string
          is_locked?: boolean
          locked_at?: string | null
          locked_reason?: string | null
          quantity?: number | null
          requirement_id?: string
          specification?: Json
          summary?: string
          target_budget?: number | null
          target_date?: string | null
          unit?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "requirement_versions_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requirement_versions_requirement_id_fkey"
            columns: ["requirement_id"]
            isOneToOne: false
            referencedRelation: "requirements"
            referencedColumns: ["id"]
          },
        ]
      }
      requirements: {
        Row: {
          archived_at: string | null
          brand_id: string
          created_at: string
          current_version_id: string | null
          customer_account_id: string | null
          id: string
          lead_id: string | null
          organization_id: string
          requirement_number: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          archived_at?: string | null
          brand_id: string
          created_at?: string
          current_version_id?: string | null
          customer_account_id?: string | null
          id?: string
          lead_id?: string | null
          organization_id: string
          requirement_number: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          archived_at?: string | null
          brand_id?: string
          created_at?: string
          current_version_id?: string | null
          customer_account_id?: string | null
          id?: string
          lead_id?: string | null
          organization_id?: string
          requirement_number?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_current_version_owner"
            columns: ["id", "current_version_id"]
            isOneToOne: false
            referencedRelation: "requirement_versions"
            referencedColumns: ["requirement_id", "id"]
          },
          {
            foreignKeyName: "fk_requirements_current_version"
            columns: ["current_version_id"]
            isOneToOne: false
            referencedRelation: "requirement_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requirements_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requirements_customer_account_id_fkey"
            columns: ["customer_account_id"]
            isOneToOne: false
            referencedRelation: "customer_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requirements_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requirements_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          name: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          archived_at: string | null
          auth_user_id: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          archived_at?: string | null
          auth_user_id?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          archived_at?: string | null
          auth_user_id?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      vendor_rate_cards: {
        Row: {
          created_at: string
          description: string
          effective_date: string
          id: string
          is_active: boolean
          min_order_quantity: number
          notes: string | null
          service_code: string
          unit: string
          unit_cost: number
          vendor_id: string
        }
        Insert: {
          created_at?: string
          description: string
          effective_date?: string
          id?: string
          is_active?: boolean
          min_order_quantity?: number
          notes?: string | null
          service_code: string
          unit: string
          unit_cost: number
          vendor_id: string
        }
        Update: {
          created_at?: string
          description?: string
          effective_date?: string
          id?: string
          is_active?: boolean
          min_order_quantity?: number
          notes?: string | null
          service_code?: string
          unit?: string
          unit_cost?: number
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_rate_cards_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          address: string | null
          category: string
          code: string
          contact_person: string | null
          created_at: string
          email: string | null
          id: string
          lead_time_days: number
          name: string
          notes: string | null
          organization_id: string
          payment_terms: string
          phone: string | null
          rating: number
          status: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          category: string
          code: string
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          lead_time_days?: number
          name: string
          notes?: string | null
          organization_id: string
          payment_terms?: string
          phone?: string | null
          rating?: number
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          category?: string
          code?: string
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          lead_time_days?: number
          name?: string
          notes?: string | null
          organization_id?: string
          payment_terms?: string
          phone?: string | null
          rating?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendors_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      order_financial_summaries: {
        Row: {
          actual_cost: number | null
          billing_status: string | null
          brand_code: string | null
          brand_id: string | null
          brand_name: string | null
          committed_cost: number | null
          confirmed_at: string | null
          courier_shipping_fee: number | null
          courier_shipping_margin: number | null
          currency: string | null
          customer_account_id: string | null
          customer_name: string | null
          discount_total: number | null
          effective_cost: number | null
          estimated_cost: number | null
          estimated_gross_profit: number | null
          estimated_margin_pct: number | null
          grand_total: number | null
          is_cost_settled: boolean | null
          margin_health: string | null
          net_product_revenue: number | null
          order_id: string | null
          order_number: string | null
          order_status: string | null
          organization_id: string | null
          realized_gross_profit: number | null
          realized_margin_pct: number | null
          subtotal: number | null
          total_balance_due: number | null
          total_cash_received: number | null
          total_invoiced: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_customer_account_id_fkey"
            columns: ["customer_account_id"]
            isOneToOne: false
            referencedRelation: "customer_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      allocate_existing_payment: {
        Args: {
          p_actor_id: string
          p_amount: number
          p_invoice_id: string
          p_notes?: string
          p_organization_id: string
          p_payment_id: string
        }
        Returns: Json
      }
      approve_quote_price: {
        Args: {
          p_actor_id: string
          p_organization_id: string
          p_reason: string
          p_version_id: string
        }
        Returns: string
      }
      assign_production_job: {
        Args: {
          p_actor_id: string
          p_assigned_brand_id?: string
          p_assigned_cost?: number
          p_executor_type: string
          p_job_id: string
          p_notes?: string
          p_organization_id: string
          p_vendor_name?: string
        }
        Returns: string
      }
      convert_lead_to_customer: {
        Args: {
          p_actor_id?: string
          p_create_new_account?: boolean
          p_customer_account_id?: string
          p_lead_id: string
          p_organization_id: string
        }
        Returns: Json
      }
      create_customer_with_contact: {
        Args: {
          p_account_type: string
          p_actor_id?: string
          p_brand_id: string
          p_contact_email?: string
          p_contact_name?: string
          p_contact_phone?: string
          p_contact_position?: string
          p_customer_segment?: string
          p_display_name: string
          p_legal_name?: string
          p_organization_id: string
          p_primary_email?: string
          p_primary_phone?: string
          p_tax_id?: string
        }
        Returns: Json
      }
      create_invoice_for_order: {
        Args: {
          p_actor_id: string
          p_amount_shipping?: number
          p_amount_subtotal: number
          p_amount_tax?: number
          p_due_date?: string
          p_invoice_type: string
          p_items?: Json
          p_notes?: string
          p_order_id: string
          p_organization_id: string
          p_payment_instructions?: string
        }
        Returns: Json
      }
      create_new_requirement_version: {
        Args: {
          p_actor_id?: string
          p_organization_id: string
          p_quantity?: number
          p_requirement_id: string
          p_specification?: Json
          p_summary: string
          p_target_budget?: number
          p_target_date?: string
          p_unit?: string
        }
        Returns: Json
      }
      create_order_from_quote: {
        Args: {
          p_actor_id: string
          p_billing_address?: Json
          p_notes?: string
          p_organization_id: string
          p_payment_terms_override?: Json
          p_quote_version_id: string
          p_request_id: string
          p_shipping_address: Json
        }
        Returns: Json
      }
      create_production_job: {
        Args: {
          p_actor_id: string
          p_estimated_cost?: number
          p_items?: Json
          p_job_type: string
          p_notes?: string
          p_order_id: string
          p_organization_id: string
          p_priority?: string
          p_specification?: Json
          p_target_date?: string
          p_title: string
        }
        Returns: Json
      }
      create_requirement_with_initial_version: {
        Args: {
          p_actor_id?: string
          p_brand_id: string
          p_customer_account_id?: string
          p_lead_id?: string
          p_organization_id: string
          p_quantity?: number
          p_specification?: Json
          p_summary: string
          p_target_budget?: number
          p_target_date?: string
          p_title: string
          p_unit?: string
        }
        Returns: Json
      }
      create_vendor: {
        Args: {
          p_actor_id: string
          p_address?: string
          p_category: string
          p_code: string
          p_contact_person?: string
          p_email?: string
          p_lead_time_days?: number
          p_name: string
          p_notes?: string
          p_organization_id: string
          p_payment_terms?: string
          p_phone?: string
        }
        Returns: string
      }
      generate_document_number: {
        Args: {
          p_brand_id: string
          p_document_type: string
          p_organization_id: string
          p_pad_length?: number
          p_year?: number
        }
        Returns: string
      }
      invoice_actor_role: {
        Args: { p_actor_id: string; p_organization_id: string }
        Returns: string
      }
      issue_invoice: {
        Args: {
          p_actor_id: string
          p_invoice_id: string
          p_organization_id: string
        }
        Returns: Json
      }
      lock_requirement_version: {
        Args: {
          p_actor_id?: string
          p_organization_id: string
          p_reason: string
          p_version_id: string
        }
        Returns: Json
      }
      mark_quote_accepted: {
        Args: {
          p_acceptance_method: string
          p_accepted_by_contact_id?: string
          p_actor_id: string
          p_notes?: string
          p_organization_id: string
          p_version_id: string
        }
        Returns: string
      }
      mark_quote_sent: {
        Args: {
          p_actor_id: string
          p_organization_id: string
          p_version_id: string
        }
        Returns: string
      }
      next_document_sequence: {
        Args: {
          p_brand_id: string
          p_document_type: string
          p_organization_id: string
          p_year?: number
        }
        Returns: number
      }
      payment_actor_role: {
        Args: { p_actor: string; p_org: string }
        Returns: string
      }
      production_actor_role: {
        Args: { p_actor: string; p_org: string }
        Returns: string
      }
      quote_actor_role: {
        Args: { p_actor: string; p_org: string }
        Returns: string
      }
      record_actual_job_cost: {
        Args: {
          p_actor_id: string
          p_actual_cost: number
          p_job_id: string
          p_notes?: string
          p_organization_id: string
        }
        Returns: Json
      }
      record_payment_and_allocate: {
        Args: {
          p_actor_id: string
          p_allocations?: Json
          p_amount: number
          p_brand_id: string
          p_customer_account_id?: string
          p_destination_account_number?: string
          p_destination_bank?: string
          p_notes?: string
          p_organization_id: string
          p_payer_account_number?: string
          p_payer_bank?: string
          p_payer_name?: string
          p_payment_date?: string
          p_payment_method: string
          p_proof_file_url?: string
          p_reference_number?: string
        }
        Returns: Json
      }
      record_qc_inspection: {
        Args: {
          p_actor_id: string
          p_checklist_snapshot?: Json
          p_defect_category?: string
          p_defect_count?: number
          p_defect_severity?: string
          p_notes?: string
          p_organization_id: string
          p_production_job_id: string
          p_result: string
          p_rework_instructions?: string
          p_sample_size?: number
        }
        Returns: Json
      }
      revert_payment: {
        Args: {
          p_actor_id: string
          p_organization_id: string
          p_payment_id: string
          p_reason: string
        }
        Returns: Json
      }
      save_quote_version: {
        Args: {
          p_actor_id: string
          p_costs: Json
          p_customer_id: string
          p_discount: number
          p_expected_version_id?: string
          p_lead_time: string
          p_notes: string
          p_organization_id: string
          p_quote_id?: string
          p_request_id: string
          p_requirement_version_id: string
          p_shipping: number
          p_terms: string
          p_unit_price: number
          p_valid_until: string
        }
        Returns: Json
      }
      transition_lead_status: {
        Args: {
          p_actor_id?: string
          p_assigned_user_id?: string
          p_disqualification_reason?: string
          p_lead_id: string
          p_lost_reason?: string
          p_organization_id: string
          p_qualification_notes?: string
          p_qualification_result?: string
          p_qualification_score?: number
          p_target_status: string
        }
        Returns: {
          archived_at: string | null
          assigned_user_id: string | null
          brand_id: string
          business_line_id: string | null
          channel_id: string
          company_name: string | null
          contact_name: string | null
          contacted_at: string | null
          converted_at: string | null
          created_at: string
          customer_account_id: string | null
          customer_contact_id: string | null
          disqualification_reason: string | null
          disqualified_at: string | null
          email: string | null
          estimated_budget: number | null
          estimated_quantity: number | null
          id: string
          lead_number: string
          lost_at: string | null
          lost_reason: string | null
          organization_id: string
          phone: string | null
          qualification_notes: string | null
          qualification_result: string | null
          qualification_score: number | null
          qualified_at: string | null
          raw_inquiry: string | null
          status: string
          title: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "leads"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      transition_production_job_status: {
        Args: {
          p_actor_id: string
          p_job_id: string
          p_organization_id: string
          p_reason?: string
          p_to_status: string
        }
        Returns: string
      }
      transition_requirement_status: {
        Args: {
          p_actor_id?: string
          p_organization_id: string
          p_requirement_id: string
          p_target_status: string
        }
        Returns: {
          archived_at: string | null
          brand_id: string
          created_at: string
          current_version_id: string | null
          customer_account_id: string | null
          id: string
          lead_id: string | null
          organization_id: string
          requirement_number: string
          status: string
          title: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "requirements"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      upsert_vendor_rate_card: {
        Args: {
          p_actor_id: string
          p_description: string
          p_min_order_quantity?: number
          p_notes?: string
          p_organization_id: string
          p_service_code: string
          p_unit: string
          p_unit_cost: number
          p_vendor_id: string
        }
        Returns: string
      }
      void_invoice: {
        Args: {
          p_actor_id: string
          p_invoice_id: string
          p_organization_id: string
          p_reason?: string
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
  internal: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  app: {
    Enums: {},
  },
  internal: {
    Enums: {},
  },
} as const

