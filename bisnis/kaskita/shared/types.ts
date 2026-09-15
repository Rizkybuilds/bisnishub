// ============================================================================
// KASKITA SHARED DOMAIN TYPES
// File: types.ts
// ============================================================================

export type UUID = string;

// --- 1. USER & WALLET (THE HUB) ---
export interface User {
  id: UUID;
  phone_number: string;
  full_name: string;
  email?: string | null;
  avatar_url?: string | null;
  created_at: string;
}

export type WalletType = 'CASH' | 'BANK' | 'EWALLET';

export interface Wallet {
  id: UUID;
  user_id: UUID;
  name: string;
  wallet_type: WalletType;
  balance: number; // BigInt di DB, direpresentasikan sebagai number (Rupiah penuh)
  is_default: boolean;
  created_at: string;
}

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Category {
  id: UUID;
  user_id?: UUID | null;
  name: string;
  type: TransactionType;
  icon: string;
  is_system: boolean;
}

export interface Budget {
  id: UUID;
  user_id: UUID;
  category_id: UUID;
  period_month: string; // 'YYYY-MM'
  limit_amount: number;
  created_at: string;
  // Computed fields (optional)
  used_amount?: number;
  percentage?: number;
}

// --- 2. WORKSPACE & COMMUNITY (THE SPOKES) ---
export type WorkspaceType = 'COMMUNITY' | 'PERSONAL';
export type WorkspaceRole = 'OWNER' | 'ADMIN' | 'MEMBER';

export interface Workspace {
  id: UUID;
  name: string;
  type: WorkspaceType;
  created_by: UUID;
  created_at: string;
}

export interface WorkspaceMember {
  id: UUID;
  workspace_id: UUID;
  user_id: UUID;
  role: WorkspaceRole;
  joined_at: string;
  user?: User;
}

// --- 3. DUES (IURAN WARGA) ---
export type BillingCycle = 'MONTHLY' | 'WEEKLY' | 'ONCE';
export type InvoiceStatus = 'UNPAID' | 'PENDING_VERIFICATION' | 'PAID';

export interface DuesCategory {
  id: UUID;
  workspace_id: UUID;
  name: string;
  amount: number;
  billing_cycle: BillingCycle;
  created_at: string;
}

export interface DuesInvoice {
  id: UUID;
  dues_category_id: UUID;
  workspace_id: UUID;
  member_id: UUID;
  period: string; // 'YYYY-MM'
  amount: number;
  due_date: string;
  status: InvoiceStatus;
  proof_image_url?: string | null;
  paid_at?: string | null;
  verified_by?: UUID | null;
  synced_to_personal: boolean;
  personal_wallet_id?: UUID | null;
  created_at: string;
  dues_category?: DuesCategory;
  member?: WorkspaceMember;
}

// --- 4. ARISAN DIGITAL ---
export type ArisanStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED';
export type RoundStatus = 'PENDING' | 'DRAWN' | 'PAID_OUT';

export interface ArisanGroup {
  id: UUID;
  workspace_id: UUID;
  title: string;
  amount_per_period: number;
  cycle_period: string;
  status: ArisanStatus;
  created_at: string;
}

export interface ArisanMember {
  id: UUID;
  arisan_group_id: UUID;
  workspace_member_id: UUID;
  slot_number: number;
  has_won: boolean;
  won_at_round?: number | null;
  created_at: string;
  member?: WorkspaceMember;
}

export interface ArisanRound {
  id: UUID;
  arisan_group_id: UUID;
  round_number: number;
  draw_date: string;
  winner_member_id?: UUID | null;
  total_pot_amount: number;
  status: RoundStatus;
  created_at: string;
  winner?: ArisanMember;
}

// --- 5. UTANG PIUTANG P2P ---
export type DebtType = 'PAYABLE' | 'RECEIVABLE';
export type DebtStatus = 'UNPAID' | 'PARTIAL' | 'SETTLED';

export interface Debt {
  id: UUID;
  user_id: UUID;
  party_name: string;
  party_phone?: string | null;
  type: DebtType;
  total_amount: number;
  remaining_amount: number;
  due_date?: string | null;
  status: DebtStatus;
  proof_url?: string | null;
  notes?: string | null;
  created_at: string;
}

export interface DebtPayment {
  id: UUID;
  debt_id: UUID;
  wallet_id?: UUID | null;
  amount_paid: number;
  payment_date: string;
  payment_note?: string | null;
  created_at: string;
}

// --- 6. UNIVERSAL LEDGER & TRANSACTIONS ---
export type SourceRefType = 'DUES_INVOICE' | 'ARISAN_ROUND' | 'DEBT_PAYMENT' | 'MANUAL';

export interface Transaction {
  id: UUID;
  user_id: UUID;
  wallet_id?: UUID | null;
  workspace_id?: UUID | null;
  type: TransactionType;
  amount: number;
  category_id?: UUID | null;
  description?: string | null;
  transaction_date: string;
  source_ref_type?: SourceRefType | null;
  source_ref_id?: UUID | null;
  created_at: string;
  category?: Category;
  wallet?: Wallet;
}
